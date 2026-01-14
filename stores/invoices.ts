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

// Mock data for development
const mockInvoices: Invoice[] = [
  {
    id: 1,
    order_id: 1,
    invoice_number: 'FT-2024-00001',
    type: 'invoice',
    fatture_cloud_id: 'FC-12345',
    sdi_status: 'delivered',
    subtotal: 150.00,
    vat_rate: 22,
    vat_amount: 33.00,
    total: 183.00,
    billing_data: {
      company_name: 'Azienda Alpha Srl',
      vat_number: '12345678901',
      address: 'Via Roma 1',
      city: 'Milano',
      province: 'MI',
      postal_code: '20100',
      country: 'IT',
      sdi_code: 'XXXXXXX',
      pec: 'alpha@pec.it'
    },
    issued_at: '2024-01-15T10:30:00Z',
    due_at: '2024-02-15T10:30:00Z',
    sent_at: '2024-01-15T11:00:00Z',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T11:00:00Z',
    client: {
      id: 1,
      company_name: 'Azienda Alpha Srl',
      vat_number: '12345678901',
      email: 'info@alpha.it',
      contact_first_name: 'Mario',
      contact_last_name: 'Rossi'
    },
    order: {
      id: 1,
      order_number: 'ORD-2024-00001',
      type: 'single',
      total: 183.00,
      paid_at: '2024-01-15T10:25:00Z'
    }
  },
  {
    id: 2,
    order_id: 2,
    invoice_number: 'FT-2024-00002',
    type: 'invoice',
    fatture_cloud_id: 'FC-12346',
    sdi_status: 'accepted',
    subtotal: 450.00,
    vat_rate: 22,
    vat_amount: 99.00,
    total: 549.00,
    billing_data: {
      company_name: 'Beta Solutions SpA',
      vat_number: '98765432109',
      address: 'Via Nazionale 50',
      city: 'Roma',
      province: 'RM',
      postal_code: '00100',
      country: 'IT',
      sdi_code: 'YYYYYYY',
      pec: 'beta@pec.it'
    },
    issued_at: '2024-01-18T14:20:00Z',
    due_at: '2024-02-18T14:20:00Z',
    sent_at: '2024-01-18T14:45:00Z',
    created_at: '2024-01-18T14:20:00Z',
    updated_at: '2024-01-18T14:45:00Z',
    client: {
      id: 2,
      company_name: 'Beta Solutions SpA',
      vat_number: '98765432109',
      email: 'contact@beta.it',
      contact_first_name: 'Laura',
      contact_last_name: 'Bianchi'
    },
    order: {
      id: 2,
      order_number: 'ORD-2024-00002',
      type: 'package',
      total: 549.00,
      paid_at: '2024-01-18T14:15:00Z'
    }
  },
  {
    id: 3,
    order_id: 3,
    invoice_number: 'FT-2024-00003',
    type: 'invoice',
    fatture_cloud_id: 'FC-12347',
    sdi_status: 'pending',
    subtotal: 75.00,
    vat_rate: 22,
    vat_amount: 16.50,
    total: 91.50,
    billing_data: {
      company_name: 'Epsilon Ltd',
      vat_number: '44332211009',
      address: 'Via Indipendenza 25',
      city: 'Bologna',
      province: 'BO',
      postal_code: '40100',
      country: 'IT',
      sdi_code: 'AAAAAAA',
      pec: 'epsilon@pec.it'
    },
    issued_at: '2024-01-20T09:00:00Z',
    due_at: '2024-02-20T09:00:00Z',
    created_at: '2024-01-20T09:00:00Z',
    updated_at: '2024-01-20T09:00:00Z',
    client: {
      id: 5,
      company_name: 'Epsilon Ltd',
      vat_number: '44332211009',
      email: 'office@epsilon.it',
      contact_first_name: 'Luca',
      contact_last_name: 'Neri'
    },
    order: {
      id: 3,
      order_number: 'ORD-2024-00003',
      type: 'single',
      total: 91.50,
      paid_at: '2024-01-20T08:55:00Z'
    }
  },
  {
    id: 4,
    order_id: 4,
    invoice_number: 'FT-2024-00004',
    type: 'invoice',
    fatture_cloud_id: 'FC-12348',
    sdi_status: 'rejected',
    sdi_message: 'Codice destinatario non valido',
    subtotal: 300.00,
    vat_rate: 22,
    vat_amount: 66.00,
    total: 366.00,
    billing_data: {
      company_name: 'Zeta Industries',
      vat_number: '99887766554',
      address: 'Via dei Calzaiuoli 5',
      city: 'Firenze',
      province: 'FI',
      postal_code: '50100',
      country: 'IT',
      sdi_code: 'BBBBBBB',
      pec: 'zeta@pec.it'
    },
    issued_at: '2024-01-22T11:30:00Z',
    due_at: '2024-02-22T11:30:00Z',
    sent_at: '2024-01-22T12:00:00Z',
    created_at: '2024-01-22T11:30:00Z',
    updated_at: '2024-01-22T12:15:00Z',
    client: {
      id: 6,
      company_name: 'Zeta Industries',
      vat_number: '99887766554',
      email: 'info@zeta.it',
      contact_first_name: 'Giulia',
      contact_last_name: 'Russo'
    },
    order: {
      id: 4,
      order_number: 'ORD-2024-00004',
      type: 'package',
      total: 366.00,
      paid_at: '2024-01-22T11:25:00Z'
    }
  },
  {
    id: 5,
    order_id: 5,
    invoice_number: 'NC-2024-00001',
    type: 'credit_note',
    fatture_cloud_id: 'FC-12349',
    sdi_status: 'delivered',
    subtotal: -150.00,
    vat_rate: 22,
    vat_amount: -33.00,
    total: -183.00,
    billing_data: {
      company_name: 'Azienda Alpha Srl',
      vat_number: '12345678901',
      address: 'Via Roma 1',
      city: 'Milano',
      province: 'MI',
      postal_code: '20100',
      country: 'IT',
      sdi_code: 'XXXXXXX',
      pec: 'alpha@pec.it'
    },
    notes: 'Nota di credito per rimborso ordine #ORD-2024-00001',
    issued_at: '2024-01-25T15:00:00Z',
    sent_at: '2024-01-25T15:30:00Z',
    created_at: '2024-01-25T15:00:00Z',
    updated_at: '2024-01-25T15:30:00Z',
    client: {
      id: 1,
      company_name: 'Azienda Alpha Srl',
      vat_number: '12345678901',
      email: 'info@alpha.it',
      contact_first_name: 'Mario',
      contact_last_name: 'Rossi'
    },
    order: {
      id: 1,
      order_number: 'ORD-2024-00001',
      type: 'single',
      total: 183.00,
      paid_at: '2024-01-15T10:25:00Z'
    }
  },
  {
    id: 6,
    order_id: 6,
    invoice_number: 'FT-2024-00005',
    type: 'invoice',
    fatture_cloud_id: 'FC-12350',
    sdi_status: 'sent',
    subtotal: 225.00,
    vat_rate: 22,
    vat_amount: 49.50,
    total: 274.50,
    billing_data: {
      company_name: 'Beta Solutions SpA',
      vat_number: '98765432109',
      address: 'Via Nazionale 50',
      city: 'Roma',
      province: 'RM',
      postal_code: '00100',
      country: 'IT',
      sdi_code: 'YYYYYYY',
      pec: 'beta@pec.it'
    },
    issued_at: '2024-01-28T10:00:00Z',
    due_at: '2024-02-28T10:00:00Z',
    sent_at: '2024-01-28T10:30:00Z',
    created_at: '2024-01-28T10:00:00Z',
    updated_at: '2024-01-28T10:30:00Z',
    client: {
      id: 2,
      company_name: 'Beta Solutions SpA',
      vat_number: '98765432109',
      email: 'contact@beta.it',
      contact_first_name: 'Laura',
      contact_last_name: 'Bianchi'
    },
    order: {
      id: 6,
      order_number: 'ORD-2024-00005',
      type: 'single',
      total: 274.50,
      paid_at: '2024-01-28T09:55:00Z'
    }
  }
]

// Mock invoice items for detail view
const mockInvoiceItems = [
  {
    id: 1,
    invoice_id: 1,
    description: 'Lead Singolo - Categoria: Fotovoltaico - Provincia: MI',
    quantity: 1,
    unit_price: 75.00,
    line_total: 75.00,
    vat_rate: 22,
    vat_amount: 16.50
  },
  {
    id: 2,
    invoice_id: 1,
    description: 'Lead Singolo - Categoria: Fotovoltaico - Provincia: MI',
    quantity: 1,
    unit_price: 75.00,
    line_total: 75.00,
    vat_rate: 22,
    vat_amount: 16.50
  }
]

// Flag per usare mock data (true in dev, false in prod)
const USE_MOCK_DATA = true

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
    /**
     * Carica lista fatture con filtri e paginazione
     */
    async fetchInvoices() {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          // Simula delay di rete
          await new Promise(resolve => setTimeout(resolve, 500))

          // Applica filtri ai mock data
          let filtered = [...mockInvoices]

          // Filtro ricerca
          if (this.filters.search) {
            const search = this.filters.search.toLowerCase()
            filtered = filtered.filter(inv =>
              inv.invoice_number.toLowerCase().includes(search) ||
              inv.billing_data.company_name.toLowerCase().includes(search) ||
              inv.billing_data.vat_number.includes(search) ||
              inv.client?.company_name.toLowerCase().includes(search) ||
              inv.order?.order_number.toLowerCase().includes(search)
            )
          }

          // Filtro tipo
          if (this.filters.type) {
            filtered = filtered.filter(inv => inv.type === this.filters.type)
          }

          // Filtro stato SDI
          if (this.filters.sdi_status) {
            filtered = filtered.filter(inv => inv.sdi_status === this.filters.sdi_status)
          }

          // Filtro cliente
          if (this.filters.client_id) {
            filtered = filtered.filter(inv => inv.client?.id === this.filters.client_id)
          }

          // Filtro data
          if (this.filters.date_from) {
            const dateFrom = new Date(this.filters.date_from)
            filtered = filtered.filter(inv => new Date(inv.issued_at) >= dateFrom)
          }
          if (this.filters.date_to) {
            const dateTo = new Date(this.filters.date_to)
            filtered = filtered.filter(inv => new Date(inv.issued_at) <= dateTo)
          }

          // Filtro importo
          if (this.filters.amount_min !== undefined) {
            filtered = filtered.filter(inv => Math.abs(inv.total) >= this.filters.amount_min!)
          }
          if (this.filters.amount_max !== undefined) {
            filtered = filtered.filter(inv => Math.abs(inv.total) <= this.filters.amount_max!)
          }

          // Ordinamento
          const sortField = this.filters.sort_by || 'issued_at'
          const sortOrder = this.filters.sort_order === 'asc' ? 1 : -1
          filtered.sort((a, b) => {
            let aVal: any = (a as any)[sortField]
            let bVal: any = (b as any)[sortField]

            // Handle nested fields
            if (sortField === 'client_name') {
              aVal = a.client?.company_name || ''
              bVal = b.client?.company_name || ''
            }

            if (typeof aVal === 'string') {
              return aVal.localeCompare(bVal) * sortOrder
            }
            return (aVal - bVal) * sortOrder
          })

          // Paginazione
          const page = this.filters.page || 1
          const perPage = this.filters.per_page || 10
          const start = (page - 1) * perPage
          const end = start + perPage

          this.invoices = filtered.slice(start, end)
          this.pagination = {
            current_page: page,
            last_page: Math.ceil(filtered.length / perPage),
            per_page: perPage,
            total: filtered.length
          }
          return
        }

        // Chiamata API reale
        const { api } = useApi()
        const params = new URLSearchParams()

        if (this.filters.search) params.append('search', this.filters.search)
        if (this.filters.type) params.append('type', this.filters.type)
        if (this.filters.sdi_status) params.append('sdi_status', this.filters.sdi_status)
        if (this.filters.client_id) params.append('client_id', String(this.filters.client_id))
        if (this.filters.date_from) params.append('date_from', this.filters.date_from)
        if (this.filters.date_to) params.append('date_to', this.filters.date_to)
        if (this.filters.amount_min !== undefined) params.append('amount_min', String(this.filters.amount_min))
        if (this.filters.amount_max !== undefined) params.append('amount_max', String(this.filters.amount_max))
        if (this.filters.sort_by) params.append('sort_by', this.filters.sort_by)
        if (this.filters.sort_order) params.append('sort_order', this.filters.sort_order)
        params.append('page', String(this.filters.page || 1))
        params.append('per_page', String(this.filters.per_page || 10))

        const response = await api<{ data: Invoice[], meta: PaginationMeta }>(
          `/admin/invoices?${params.toString()}`
        )

        this.invoices = response.data
        this.pagination = response.meta
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento fatture'
        console.error('fetchInvoices error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Carica singola fattura con dettagli
     */
    async fetchInvoice(id: number) {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          const invoice = mockInvoices.find(inv => inv.id === id)
          if (invoice) {
            this.currentInvoice = {
              ...invoice,
              client: invoice.client!,
              order: invoice.order!,
              items: mockInvoiceItems.filter(item => item.invoice_id === id)
            } as InvoiceWithDetails
          } else {
            this.currentInvoice = null
            this.error = 'Fattura non trovata'
          }
          return
        }

        const { api } = useApi()
        const response = await api<{ data: InvoiceWithDetails }>(`/admin/invoices/${id}`)
        this.currentInvoice = response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento fattura'
        console.error('fetchInvoice error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Reinvia fattura a SDI
     */
    async resendToSdi(id: number): Promise<boolean> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const index = mockInvoices.findIndex(inv => inv.id === id)
          if (index !== -1) {
            mockInvoices[index].sdi_status = 'sent'
            mockInvoices[index].sent_at = new Date().toISOString()
            mockInvoices[index].updated_at = new Date().toISOString()

            const listIndex = this.invoices.findIndex(inv => inv.id === id)
            if (listIndex !== -1) {
              this.invoices[listIndex] = { ...mockInvoices[index] }
            }

            if (this.currentInvoice?.id === id) {
              this.currentInvoice = {
                ...this.currentInvoice,
                sdi_status: 'sent',
                sent_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            }

            return true
          }
          return false
        }

        const { api } = useApi()
        const response = await api<{ data: Invoice }>(`/admin/invoices/${id}/resend-sdi`, {
          method: 'POST'
        })

        const index = this.invoices.findIndex(inv => inv.id === id)
        if (index !== -1) {
          this.invoices[index] = response.data
        }

        if (this.currentInvoice?.id === id) {
          this.currentInvoice = {
            ...this.currentInvoice,
            ...response.data
          }
        }

        return true
      } catch (error: any) {
        this.error = error.message || 'Errore nel reinvio a SDI'
        console.error('resendToSdi error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Scarica PDF fattura
     */
    async downloadPdf(id: number): Promise<string | null> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          // Simula download restituendo URL mock
          return `/mock-invoices/invoice-${id}.pdf`
        }

        const { api } = useApi()
        const response = await api<{ data: { url: string } }>(`/admin/invoices/${id}/pdf`)
        return response.data.url
      } catch (error: any) {
        this.error = error.message || 'Errore nel download PDF'
        console.error('downloadPdf error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    /**
     * Invia fattura via email al cliente
     */
    async sendByEmail(id: number, email?: string): Promise<boolean> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          return true
        }

        const { api } = useApi()
        await api(`/admin/invoices/${id}/send-email`, {
          method: 'POST',
          body: email ? { email } : {}
        })
        return true
      } catch (error: any) {
        this.error = error.message || 'Errore nell\'invio email'
        console.error('sendByEmail error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Crea nota di credito
     */
    async createCreditNote(invoiceId: number, reason?: string): Promise<Invoice | null> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const originalInvoice = mockInvoices.find(inv => inv.id === invoiceId)
          if (!originalInvoice || originalInvoice.type === 'credit_note') {
            this.error = 'Impossibile creare nota di credito'
            return null
          }

          const newCreditNote: Invoice = {
            ...originalInvoice,
            id: Math.max(...mockInvoices.map(inv => inv.id)) + 1,
            invoice_number: `NC-2024-${String(mockInvoices.filter(i => i.type === 'credit_note').length + 1).padStart(5, '0')}`,
            type: 'credit_note',
            subtotal: -originalInvoice.subtotal,
            vat_amount: -originalInvoice.vat_amount,
            total: -originalInvoice.total,
            sdi_status: 'pending',
            notes: reason || `Nota di credito per fattura ${originalInvoice.invoice_number}`,
            issued_at: new Date().toISOString(),
            sent_at: undefined,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          mockInvoices.push(newCreditNote)
          this.invoices.unshift(newCreditNote)
          this.pagination.total++

          return newCreditNote
        }

        const { api } = useApi()
        const response = await api<{ data: Invoice }>(`/admin/invoices/${invoiceId}/credit-note`, {
          method: 'POST',
          body: reason ? { reason } : {}
        })

        this.invoices.unshift(response.data)
        this.pagination.total++

        return response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nella creazione nota di credito'
        console.error('createCreditNote error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    /**
     * Carica statistiche fatture
     */
    async fetchStats() {
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))

          const invoicesOnly = mockInvoices.filter(i => i.type === 'invoice')
          const creditNotes = mockInvoices.filter(i => i.type === 'credit_note')
          const thisMonth = mockInvoices.filter(i => {
            const date = new Date(i.issued_at)
            const now = new Date()
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
          })

          this.stats = {
            total_invoices: mockInvoices.length,
            total_amount: mockInvoices.reduce((sum, i) => sum + i.total, 0),
            invoices_this_month: thisMonth.length,
            amount_this_month: thisMonth.reduce((sum, i) => sum + i.total, 0),
            by_sdi_status: {
              pending: mockInvoices.filter(i => i.sdi_status === 'pending').length,
              sent: mockInvoices.filter(i => i.sdi_status === 'sent').length,
              delivered: mockInvoices.filter(i => i.sdi_status === 'delivered').length,
              accepted: mockInvoices.filter(i => i.sdi_status === 'accepted').length,
              rejected: mockInvoices.filter(i => i.sdi_status === 'rejected').length,
              not_delivered: mockInvoices.filter(i => i.sdi_status === 'not_delivered').length,
              error: mockInvoices.filter(i => i.sdi_status === 'error').length
            },
            by_type: {
              invoice: invoicesOnly.length,
              credit_note: creditNotes.length
            }
          }
          return
        }

        const { api } = useApi()
        const response = await api<{ data: InvoiceStats }>('/admin/invoices/stats')
        this.stats = response.data
      } catch (error: any) {
        console.error('fetchStats error:', error)
      }
    },

    /**
     * Imposta filtri
     */
    setFilters(filters: Partial<InvoiceFilters>) {
      this.filters = { ...this.filters, ...filters, page: 1 }
    },

    /**
     * Reset filtri
     */
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

    /**
     * Pulisci stato
     */
    clearState() {
      this.invoices = []
      this.currentInvoice = null
      this.stats = null
      this.error = null
    }
  }
})
