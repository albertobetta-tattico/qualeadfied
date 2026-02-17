/**
 * Store - My Leads
 * Pinia store for user's purchased leads portfolio
 */
import { defineStore } from 'pinia'
import type { Category, Province } from '~/types/lead'
import type {
  MyLead,
  MyLeadFilters,
  MyLeadUpdateRequest,
  ContactStatus,
  AcquisitionType,
  PaginationMeta
} from '~/types/clientArea'

const USE_MOCK_DATA = true

// Mock categories and provinces
const mockCategories: Record<number, Category> = {
  1: { id: 1, name: 'Ristrutturazioni', slug: 'ristrutturazioni', max_shares: 5, is_active: true, sort_order: 1, deleted_at: null, created_at: '', updated_at: '' },
  2: { id: 2, name: 'Fotovoltaico', slug: 'fotovoltaico', max_shares: 4, is_active: true, sort_order: 2, deleted_at: null, created_at: '', updated_at: '' },
  3: { id: 3, name: 'Serramenti', slug: 'serramenti', max_shares: 5, is_active: true, sort_order: 3, deleted_at: null, created_at: '', updated_at: '' }
}

const mockProvinces: Record<number, Province> = {
  1: { id: 1, name: 'Milano', code: 'MI', region: 'Lombardia', is_active: true },
  2: { id: 2, name: 'Roma', code: 'RM', region: 'Lazio', is_active: true },
  3: { id: 3, name: 'Torino', code: 'TO', region: 'Piemonte', is_active: true }
}

// Mock my leads
const mockMyLeads: MyLead[] = [
  {
    id: 1,
    lead_id: 101,
    user_id: 1,
    acquisition_type: 'exclusive',
    purchase_price: 45,
    purchased_at: '2025-01-10T10:00:00Z',
    order_id: 1001,
    contact_status: 'contacted',
    notes: 'Chiamato, interessato. Richiamare lunedì.',
    last_contacted_at: '2025-01-12T14:30:00Z',
    lead: {
      id: 101,
      category_id: 1,
      province_id: 1,
      first_name: 'Marco',
      last_name: 'Rossi',
      email: 'marco.rossi@email.it',
      phone: '+39 02 1234567',
      request_text: 'Buongiorno, vorrei un preventivo per la ristrutturazione completa del mio appartamento di 80mq in centro a Milano. Lavori da fare: rifacimento bagno, cucina e pavimenti. Budget indicativo 40-50k.',
      generated_at: '2025-01-09T15:00:00Z',
      category: mockCategories[1],
      province: mockProvinces[1]
    }
  },
  {
    id: 2,
    lead_id: 102,
    user_id: 1,
    acquisition_type: 'shared',
    purchase_price: 15,
    purchased_at: '2025-01-08T11:00:00Z',
    order_id: 1001,
    contact_status: 'in_progress',
    notes: 'Sopralluogo fissato per giovedì ore 10',
    last_contacted_at: '2025-01-11T09:00:00Z',
    lead: {
      id: 102,
      category_id: 2,
      province_id: 2,
      first_name: 'Anna',
      last_name: 'Bianchi',
      email: 'anna.bianchi@gmail.com',
      phone: '+39 06 9876543',
      request_text: 'Sono interessata all\'installazione di un impianto fotovoltaico per la mia villetta unifamiliare. Tetto esposto a sud, superficie disponibile circa 50mq.',
      generated_at: '2025-01-07T10:00:00Z',
      category: mockCategories[2],
      province: mockProvinces[2]
    }
  },
  {
    id: 3,
    lead_id: 103,
    user_id: 1,
    acquisition_type: 'free_trial',
    purchase_price: 0,
    purchased_at: '2025-01-05T09:00:00Z',
    order_id: null,
    contact_status: 'converted',
    notes: 'Contratto firmato! Lavori da 12k',
    last_contacted_at: '2025-01-13T16:00:00Z',
    lead: {
      id: 103,
      category_id: 3,
      province_id: 3,
      first_name: 'Giuseppe',
      last_name: 'Verdi',
      email: 'g.verdi@pec.it',
      phone: '+39 011 5551234',
      request_text: 'Richiedo preventivo per sostituzione infissi appartamento 5 locali. Attuali in legno, vorrei passare a PVC o alluminio.',
      generated_at: '2025-01-04T14:00:00Z',
      category: mockCategories[3],
      province: mockProvinces[3]
    }
  },
  {
    id: 4,
    lead_id: 104,
    user_id: 1,
    acquisition_type: 'exclusive',
    purchase_price: 45,
    purchased_at: '2025-01-14T08:00:00Z',
    order_id: 1002,
    contact_status: 'new',
    notes: null,
    last_contacted_at: null,
    lead: {
      id: 104,
      category_id: 1,
      province_id: 1,
      first_name: 'Laura',
      last_name: 'Neri',
      email: 'laura.neri@outlook.com',
      phone: '+39 333 4445556',
      request_text: 'Buongiorno, cerco impresa per ristrutturazione bagno e rifacimento impianto idraulico. Appartamento zona Navigli.',
      generated_at: '2025-01-13T18:00:00Z',
      category: mockCategories[1],
      province: mockProvinces[1]
    }
  }
]

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
    /**
     * Fetch user's leads
     */
    async fetchLeads(): Promise<void> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))

          // Apply filters
          let filteredLeads = [...mockMyLeads]

          if (this.filters.category_id) {
            filteredLeads = filteredLeads.filter(l => l.lead.category_id === this.filters.category_id)
          }

          if (this.filters.contact_status) {
            filteredLeads = filteredLeads.filter(l => l.contact_status === this.filters.contact_status)
          }

          if (this.filters.acquisition_type) {
            filteredLeads = filteredLeads.filter(l => l.acquisition_type === this.filters.acquisition_type)
          }

          if (this.filters.search) {
            const search = this.filters.search.toLowerCase()
            filteredLeads = filteredLeads.filter(l =>
              l.lead.first_name.toLowerCase().includes(search) ||
              l.lead.last_name.toLowerCase().includes(search) ||
              l.lead.email.toLowerCase().includes(search) ||
              l.lead.phone.includes(search)
            )
          }

          // Sort by purchase date (most recent first)
          filteredLeads.sort((a, b) =>
            new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime()
          )

          // Pagination
          const total = filteredLeads.length
          const perPage = this.filters.per_page || 20
          const page = this.filters.page || 1
          const start = (page - 1) * perPage
          const end = start + perPage

          this.leads = filteredLeads.slice(start, end)
          this.pagination = {
            current_page: page,
            last_page: Math.ceil(total / perPage),
            per_page: perPage,
            total: total,
            from: start + 1,
            to: Math.min(end, total)
          }

          return
        }

        const params = new URLSearchParams()
        if (this.filters.category_id) params.set('category_id', String(this.filters.category_id))
        if (this.filters.contact_status) params.set('contact_status', this.filters.contact_status)
        if (this.filters.acquisition_type) params.set('acquisition_type', this.filters.acquisition_type)
        if (this.filters.date_from) params.set('date_from', this.filters.date_from)
        if (this.filters.date_to) params.set('date_to', this.filters.date_to)
        if (this.filters.search) params.set('search', this.filters.search)
        if (this.filters.page) params.set('page', String(this.filters.page))
        if (this.filters.per_page) params.set('per_page', String(this.filters.per_page))

        const response = await $fetch<{ data: MyLead[]; meta: PaginationMeta }>(`/api/client/leads?${params}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        this.leads = response.data
        this.pagination = response.meta
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.loadError')
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch single lead details
     */
    async fetchLead(id: number): Promise<MyLead | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          const lead = mockMyLeads.find(l => l.id === id)
          if (lead) {
            this.currentLead = lead
            return lead
          }
          this.error = t('common.errors.notFound')
          return null
        }

        const response = await $fetch<{ data: MyLead }>(`/api/client/leads/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        this.currentLead = response.data
        return response.data
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.loadError')
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * Update lead status/notes
     */
    async updateLead(id: number, data: MyLeadUpdateRequest): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))

          // Update in list
          const lead = this.leads.find(l => l.id === id)
          if (lead) {
            if (data.contact_status) lead.contact_status = data.contact_status
            if (data.notes !== undefined) lead.notes = data.notes
            lead.last_contacted_at = new Date().toISOString()
          }

          // Update current lead
          if (this.currentLead?.id === id) {
            if (data.contact_status) this.currentLead.contact_status = data.contact_status
            if (data.notes !== undefined) this.currentLead.notes = data.notes
            this.currentLead.last_contacted_at = new Date().toISOString()
          }

          return true
        }

        await $fetch(`/api/client/leads/${id}`, {
          method: 'PUT',
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        // Update local state
        const lead = this.leads.find(l => l.id === id)
        if (lead) {
          if (data.contact_status) lead.contact_status = data.contact_status
          if (data.notes !== undefined) lead.notes = data.notes
        }

        if (this.currentLead?.id === id) {
          if (data.contact_status) this.currentLead.contact_status = data.contact_status
          if (data.notes !== undefined) this.currentLead.notes = data.notes
        }

        return true
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.updateError')
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Export leads to CSV/Excel
     */
    async exportLeads(format: 'csv' | 'excel'): Promise<string | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          return '/downloads/mock-export.csv'
        }

        const params = new URLSearchParams()
        params.set('format', format)
        if (this.filters.category_id) params.set('category_id', String(this.filters.category_id))
        if (this.filters.contact_status) params.set('contact_status', this.filters.contact_status)

        const response = await $fetch<{ data: { url: string } }>(`/api/client/leads/export?${params}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
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

    /**
     * Set filters
     */
    setFilters(filters: Partial<MyLeadFilters>): void {
      this.filters = { ...this.filters, ...filters, page: 1 }
    },

    /**
     * Reset filters
     */
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

    /**
     * Set page
     */
    setPage(page: number): void {
      this.filters.page = page
    },

    /**
     * Clear current lead
     */
    clearCurrentLead(): void {
      this.currentLead = null
    }
  }
})
