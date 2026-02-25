/**
 * Store - My Leads
 * Pinia store for user's purchased leads portfolio
 */
import { defineStore } from 'pinia'
import type {
  MyLead,
  MyLeadFilters,
  MyLeadUpdateRequest,
  ContactStatus,
  PaginationMeta
} from '~/types/clientArea'

interface MyLeadsState {
  leads: MyLead[]
  currentLead: MyLead | null
  filters: MyLeadFilters
  pagination: PaginationMeta
  loading: boolean
  saving: boolean
  error: string | null
}

export const useMyLeadsStore = defineStore('myLeads', {
  state: (): MyLeadsState => ({
    leads: [],
    currentLead: null,
    filters: {
      category_id: '',
      contact_status: '',
      acquisition_type: '',
      date_from: '',
      date_to: '',
      search: '',
      page: 1,
      per_page: 20
    },
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0,
      from: 0,
      to: 0
    },
    loading: false,
    saving: false,
    error: null
  }),

  getters: {
    totalLeads: (state): number => state.pagination.total,

    leadsByStatus: (state) => (status: ContactStatus): MyLead[] => {
      return state.leads.filter(l => l.contact_status === status)
    },

    newLeadsCount: (state): number => {
      return state.leads.filter(l => l.contact_status === 'new').length
    },

    convertedLeadsCount: (state): number => {
      return state.leads.filter(l => l.contact_status === 'converted').length
    },

    conversionRate(state): number {
      if (state.leads.length === 0) return 0
      const converted = state.leads.filter(l => l.contact_status === 'converted').length
      return Math.round((converted / state.leads.length) * 100)
    }
  },

  actions: {
    async fetchLeads(): Promise<void> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()

        const query: Record<string, unknown> = {}
        if (this.filters.category_id) query.category_id = this.filters.category_id
        if (this.filters.contact_status) query.contact_status = this.filters.contact_status
        if (this.filters.acquisition_type) query.acquisition_type = this.filters.acquisition_type
        if (this.filters.date_from) query.date_from = this.filters.date_from
        if (this.filters.date_to) query.date_to = this.filters.date_to
        if (this.filters.search) query.search = this.filters.search
        if (this.filters.page) query.page = this.filters.page
        if (this.filters.per_page) query.per_page = this.filters.per_page

        const { data, error } = await client.GET('/user-leads', {
          params: { query }
        })
        if (error) throw error

        this.leads = (data as any).data
        this.pagination = (data as any).meta
      } catch (e: any) {
        this.error = e.data?.message || e.message || t('common.errors.loadError')
      } finally {
        this.loading = false
      }
    },

    async fetchLead(id: number): Promise<MyLead | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()

        const { data, error } = await client.GET('/user-leads/{userLead}', {
          params: { path: { userLead: id } }
        })
        if (error) throw error

        this.currentLead = (data as any).data
        return (data as any).data
      } catch (e: any) {
        this.error = e.data?.message || e.message || t('common.errors.loadError')
        return null
      } finally {
        this.loading = false
      }
    },

    async updateLead(id: number, updateData: MyLeadUpdateRequest): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const client = useTypedApi()

        const { error } = await client.PUT('/user-leads/{userLead}', {
          params: { path: { userLead: id } },
          body: updateData as any
        })
        if (error) throw error

        const lead = this.leads.find(l => l.id === id)
        if (lead) {
          if (updateData.contact_status) lead.contact_status = updateData.contact_status
          if (updateData.notes !== undefined) lead.notes = updateData.notes
        }

        if (this.currentLead?.id === id) {
          if (updateData.contact_status) this.currentLead.contact_status = updateData.contact_status
          if (updateData.notes !== undefined) this.currentLead.notes = updateData.notes
        }

        return true
      } catch (e: any) {
        this.error = e.data?.message || e.message || t('common.errors.updateError')
        return false
      } finally {
        this.saving = false
      }
    },

    async exportLeads(format: 'csv' | 'excel'): Promise<string | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()

        const params = new URLSearchParams()
        params.set('format', format)
        if (this.filters.category_id) params.set('category_id', String(this.filters.category_id))
        if (this.filters.contact_status) params.set('contact_status', this.filters.contact_status)

        const response = await $fetch<{ data: { url: string } }>(`${config.public.apiBase}/user-leads/export?${params}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })

        return response.data.url
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.exportError')
        return null
      } finally {
        this.loading = false
      }
    },

    setFilters(filters: Partial<MyLeadFilters>): void {
      this.filters = { ...this.filters, ...filters, page: 1 }
    },

    resetFilters(): void {
      this.filters = {
        category_id: '',
        contact_status: '',
        acquisition_type: '',
        date_from: '',
        date_to: '',
        search: '',
        page: 1,
        per_page: 20
      }
    },

    setPage(page: number): void {
      this.filters.page = page
    },

    clearCurrentLead(): void {
      this.currentLead = null
    }
  }
})
