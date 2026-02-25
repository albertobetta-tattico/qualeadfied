/**
 * Invoice Store - Gestione Fatture
 * Qualeadfied B2B Lead Platform
 */

import { defineStore } from 'pinia'
import type {
  Invoice,
  InvoiceWithDetails,
  InvoiceFilters,
  InvoiceStats,
  SdiStatus
} from '~/types/invoice'

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface InvoiceState {
  invoices: Invoice[]
  currentInvoice: InvoiceWithDetails | null
  stats: InvoiceStats | null
  pagination: PaginationMeta
  filters: InvoiceFilters
  loading: boolean
  saving: boolean
  error: string | null
}

export const useInvoiceStore = defineStore('invoice', {
  state: (): InvoiceState => ({
    invoices: [],
    currentInvoice: null,
    stats: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    },
    filters: {
      search: '',
      type: '',
      sdi_status: '',
      sort_by: 'issued_at',
      sort_order: 'desc',
      page: 1,
      per_page: 10
    },
    loading: false,
    saving: false,
    error: null
  }),

  getters: {
    hasInvoices: (state): boolean => state.invoices.length > 0,

    invoicesByType: (state) => (type: 'invoice' | 'credit_note'): Invoice[] =>
      state.invoices.filter(i => i.type === type),

    invoicesBySdiStatus: (state) => (status: SdiStatus): Invoice[] =>
      state.invoices.filter(i => i.sdi_status === status),

    pendingInvoices: (state): Invoice[] =>
      state.invoices.filter(i => i.sdi_status === 'pending'),

    problemInvoices: (state): Invoice[] =>
      state.invoices.filter(i => ['rejected', 'not_delivered', 'error'].includes(i.sdi_status)),

    hasActiveFilters: (state): boolean => {
      return !!(
        state.filters.search ||
        state.filters.type ||
        state.filters.sdi_status ||
        state.filters.client_id ||
        state.filters.date_from ||
        state.filters.date_to ||
        state.filters.amount_min ||
        state.filters.amount_max
      )
    },

    totalAmount: (state): number => {
      return state.invoices.reduce((sum, inv) => sum + inv.total, 0)
    }
  },

  actions: {
    async fetchInvoices() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()

        const query: Record<string, unknown> = {
          page: this.filters.page || 1,
          per_page: this.filters.per_page || 10
        }

        if (this.filters.search) query.search = this.filters.search
        if (this.filters.type) query.type = this.filters.type
        if (this.filters.sdi_status) query.sdi_status = this.filters.sdi_status
        if (this.filters.client_id) query.client_id = this.filters.client_id
        if (this.filters.date_from) query.date_from = this.filters.date_from
        if (this.filters.date_to) query.date_to = this.filters.date_to
        if (this.filters.amount_min !== undefined) query.amount_min = this.filters.amount_min
        if (this.filters.amount_max !== undefined) query.amount_max = this.filters.amount_max
        if (this.filters.sort_by) query.sort_by = this.filters.sort_by
        if (this.filters.sort_order) query.sort_order = this.filters.sort_order

        const { data, error } = await client.GET('/admin/invoices', {
          params: { query }
        })
        if (error) throw error

        this.invoices = (data as any).data
        this.pagination = (data as any).meta
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchInvoices error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchInvoice(id: number) {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()

        const { data, error } = await client.GET('/admin/invoices/{invoice}', {
          params: { path: { invoice: id } }
        })
        if (error) throw error

        this.currentInvoice = (data as any).data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchInvoice error:', error)
      } finally {
        this.loading = false
      }
    },

    async resendToSdi(id: number): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: Invoice }>(`${config.public.apiBase}/admin/invoices/${id}/resend-sdi`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
            Accept: 'application/json'
          }
        })

        const index = this.invoices.findIndex(inv => inv.id === id)
        if (index !== -1) this.invoices[index] = response.data
        if (this.currentInvoice?.id === id) {
          this.currentInvoice = { ...this.currentInvoice, ...response.data }
        }

        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.sendEmailError')
        console.error('resendToSdi error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    async downloadPdf(id: number): Promise<string | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: { url: string } }>(`${config.public.apiBase}/admin/invoices/${id}/pdf`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
            Accept: 'application/json'
          }
        })
        return response.data.url
      } catch (error: any) {
        this.error = error.message || t('common.errors.downloadError')
        console.error('downloadPdf error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    async sendByEmail(id: number, email?: string): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/admin/invoices/${id}/send-email`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
            Accept: 'application/json'
          },
          body: email ? { email } : {}
        })
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.sendEmailError')
        console.error('sendByEmail error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    async createCreditNote(invoiceId: number, reason?: string): Promise<Invoice | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: Invoice }>(`${config.public.apiBase}/admin/invoices/${invoiceId}/credit-note`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
            Accept: 'application/json'
          },
          body: reason ? { reason } : {}
        })

        this.invoices.unshift(response.data)
        this.pagination.total++

        return response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.createError')
        console.error('createCreditNote error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    async fetchStats() {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: InvoiceStats }>(`${config.public.apiBase}/admin/invoices/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
            Accept: 'application/json'
          }
        })
        this.stats = response.data
      } catch (error: any) {
        console.error('fetchStats error:', error)
      }
    },

    setFilters(filters: Partial<InvoiceFilters>) {
      this.filters = { ...this.filters, ...filters, page: 1 }
    },

    resetFilters() {
      this.filters = {
        search: '',
        type: '',
        sdi_status: '',
        sort_by: 'issued_at',
        sort_order: 'desc',
        page: 1,
        per_page: 10
      }
    },

    clearState() {
      this.invoices = []
      this.currentInvoice = null
      this.stats = null
      this.error = null
    }
  }
})
