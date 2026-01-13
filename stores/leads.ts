/**
 * Lead Store - Gestione Lead
 * Qualeadfied B2B Lead Platform
 */

import { defineStore } from 'pinia'
import type {
  Lead,
  LeadFilters,
  LeadStats,
  LeadCreateForm,
  LeadUpdateForm,
  LeadStatus,
  Category,
  Province,
  LeadSource,
  LeadSourceCreateForm,
  LeadSourceUpdateForm,
  LeadImportConfig,
  LeadImportResult
} from '~/types/lead'

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface LeadState {
  leads: Lead[]
  currentLead: Lead | null
  stats: LeadStats | null
  pagination: PaginationMeta
  filters: LeadFilters
  
  // Dati di supporto
  categories: Category[]
  provinces: Province[]
  sources: LeadSource[]
  
  // Stati UI
  loading: boolean
  saving: boolean
  importing: boolean
  error: string | null
}

// Mock Categories
const mockCategories: Category[] = [
  { id: 1, name: 'Ristrutturazioni', slug: 'ristrutturazioni', description: 'Lavori di ristrutturazione edilizia', max_shares: 3, is_active: true, sort_order: 1, deleted_at: null, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 2, name: 'Impianti Fotovoltaici', slug: 'fotovoltaico', description: 'Installazione pannelli solari', max_shares: 4, is_active: true, sort_order: 2, deleted_at: null, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 3, name: 'Infissi e Serramenti', slug: 'infissi', description: 'Sostituzione infissi', max_shares: 3, is_active: true, sort_order: 3, deleted_at: null, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 4, name: 'Caldaie e Climatizzazione', slug: 'climatizzazione', description: 'Impianti termici e condizionamento', max_shares: 5, is_active: true, sort_order: 4, deleted_at: null, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 5, name: 'Assicurazioni', slug: 'assicurazioni', description: 'Polizze assicurative', max_shares: 2, is_active: true, sort_order: 5, deleted_at: null, created_at: '2024-01-01', updated_at: '2024-01-01' }
]

// Mock Provinces
const mockProvinces: Province[] = [
  { id: 1, name: 'Milano', code: 'MI', region: 'Lombardia', is_active: true },
  { id: 2, name: 'Roma', code: 'RM', region: 'Lazio', is_active: true },
  { id: 3, name: 'Napoli', code: 'NA', region: 'Campania', is_active: true },
  { id: 4, name: 'Torino', code: 'TO', region: 'Piemonte', is_active: true },
  { id: 5, name: 'Bologna', code: 'BO', region: 'Emilia-Romagna', is_active: true },
  { id: 6, name: 'Firenze', code: 'FI', region: 'Toscana', is_active: true },
  { id: 7, name: 'Bari', code: 'BA', region: 'Puglia', is_active: true },
  { id: 8, name: 'Palermo', code: 'PA', region: 'Sicilia', is_active: true },
  { id: 9, name: 'Genova', code: 'GE', region: 'Liguria', is_active: true },
  { id: 10, name: 'Venezia', code: 'VE', region: 'Veneto', is_active: true }
]

// Mock Lead Sources
const mockSources: LeadSource[] = [
  { id: 1, name: 'Meta Ads', slug: 'meta-ads', description: 'Lead da campagne Facebook/Instagram', api_key: 'meta_xxxxxx', is_active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 2, name: 'Google Ads', slug: 'google-ads', description: 'Lead da campagne Google', api_key: 'google_xxxxxx', is_active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 3, name: 'Sito Web', slug: 'website', description: 'Lead da form sul sito', api_key: 'web_xxxxxx', is_active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 4, name: 'Manuale', slug: 'manual', description: 'Inserimento manuale da backoffice', is_active: true, created_at: '2024-01-01', updated_at: '2024-01-01' }
]

// Mock Leads
const mockLeads: Lead[] = [
  {
    id: 1,
    category_id: 1,
    province_id: 1,
    source_id: 1,
    first_name: 'Mario',
    last_name: 'Rossi',
    email: 'mario.rossi@email.it',
    phone: '333 1234567',
    request_text: 'Vorrei un preventivo per la ristrutturazione del bagno',
    status: 'free',
    current_shares: 0,
    generated_at: '2024-01-20',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
    category: mockCategories[0],
    province: mockProvinces[0],
    source: mockSources[0]
  },
  {
    id: 2,
    category_id: 2,
    province_id: 2,
    source_id: 2,
    first_name: 'Laura',
    last_name: 'Bianchi',
    email: 'laura.bianchi@email.it',
    phone: '339 9876543',
    request_text: 'Interessata a impianto fotovoltaico da 6kW per villetta unifamiliare',
    status: 'sold_shared',
    current_shares: 1,
    generated_at: '2024-01-19',
    created_at: '2024-01-19T14:30:00Z',
    updated_at: '2024-01-21T09:00:00Z',
    category: mockCategories[1],
    province: mockProvinces[1],
    source: mockSources[1]
  },
  {
    id: 3,
    category_id: 1,
    province_id: 3,
    source_id: 1,
    first_name: 'Giuseppe',
    last_name: 'Verdi',
    email: 'g.verdi@email.it',
    phone: '340 5551234',
    request_text: 'Richiesta preventivo per ristrutturazione completa appartamento 80mq',
    status: 'sold_exclusive',
    current_shares: 0,
    generated_at: '2024-01-18',
    created_at: '2024-01-18T11:15:00Z',
    updated_at: '2024-01-19T16:00:00Z',
    category: mockCategories[0],
    province: mockProvinces[2],
    source: mockSources[0]
  },
  {
    id: 4,
    category_id: 3,
    province_id: 4,
    source_id: 3,
    first_name: 'Anna',
    last_name: 'Ferrari',
    email: 'anna.ferrari@email.it',
    phone: '347 1112233',
    request_text: 'Preventivo sostituzione infissi 5 finestre + porta finestra',
    status: 'sold_shared',
    current_shares: 2,
    generated_at: '2024-01-17',
    created_at: '2024-01-17T09:00:00Z',
    updated_at: '2024-01-22T10:00:00Z',
    category: mockCategories[2],
    province: mockProvinces[3],
    source: mockSources[2]
  },
  {
    id: 5,
    category_id: 4,
    province_id: 5,
    source_id: 1,
    first_name: 'Paolo',
    last_name: 'Colombo',
    email: 'paolo.colombo@email.it',
    phone: '335 4445566',
    request_text: 'Informazioni su caldaia a condensazione + condizionatore',
    status: 'exhausted',
    current_shares: 5,
    generated_at: '2024-01-15',
    created_at: '2024-01-15T15:00:00Z',
    updated_at: '2024-01-23T12:00:00Z',
    category: mockCategories[3],
    province: mockProvinces[4],
    source: mockSources[0]
  },
  {
    id: 6,
    category_id: 2,
    province_id: 6,
    source_id: 2,
    first_name: 'Francesca',
    last_name: 'Ricci',
    email: 'f.ricci@email.it',
    phone: '331 7778899',
    request_text: 'Preventivo impianto fotovoltaico con accumulo',
    status: 'free',
    current_shares: 0,
    generated_at: '2024-01-22',
    created_at: '2024-01-22T08:30:00Z',
    updated_at: '2024-01-22T08:30:00Z',
    category: mockCategories[1],
    province: mockProvinces[5],
    source: mockSources[1]
  },
  {
    id: 7,
    category_id: 5,
    province_id: 1,
    source_id: 3,
    first_name: 'Marco',
    last_name: 'Gallo',
    email: 'marco.gallo@email.it',
    phone: '338 2223344',
    request_text: 'Richiesta preventivo polizza casa',
    status: 'sold_shared',
    current_shares: 1,
    generated_at: '2024-01-21',
    created_at: '2024-01-21T16:45:00Z',
    updated_at: '2024-01-22T14:00:00Z',
    category: mockCategories[4],
    province: mockProvinces[0],
    source: mockSources[2]
  },
  {
    id: 8,
    category_id: 1,
    province_id: 7,
    source_id: 4,
    first_name: 'Claudia',
    last_name: 'Martini',
    email: 'claudia.martini@email.it',
    phone: '342 9990001',
    request_text: 'Ristrutturazione cucina e soggiorno open space',
    status: 'free',
    current_shares: 0,
    generated_at: '2024-01-23',
    created_at: '2024-01-23T09:00:00Z',
    updated_at: '2024-01-23T09:00:00Z',
    category: mockCategories[0],
    province: mockProvinces[6],
    source: mockSources[3]
  }
]

// Flag per usare mock data
const USE_MOCK_DATA = true

export const useLeadStore = defineStore('lead', {
  state: (): LeadState => ({
    leads: [],
    currentLead: null,
    stats: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    },
    filters: {
      search: '',
      category_id: '',
      province_id: '',
      source_id: '',
      status: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      page: 1,
      per_page: 10
    },
    categories: [],
    provinces: [],
    sources: [],
    loading: false,
    saving: false,
    importing: false,
    error: null
  }),

  getters: {
    hasLeads: (state): boolean => state.leads.length > 0,
    
    freeLeads: (state): Lead[] => 
      state.leads.filter(l => l.status === 'free'),
    
    soldExclusiveLeads: (state): Lead[] => 
      state.leads.filter(l => l.status === 'sold_exclusive'),
    
    soldSharedLeads: (state): Lead[] => 
      state.leads.filter(l => l.status === 'sold_shared'),
    
    exhaustedLeads: (state): Lead[] =>
      state.leads.filter(l => l.status === 'exhausted'),

    availableLeads: (state): Lead[] =>
      state.leads.filter(l => l.status === 'free' || l.status === 'sold_shared'),
    
    hasActiveFilters: (state): boolean => {
      return !!(
        state.filters.search ||
        state.filters.category_id ||
        state.filters.province_id ||
        state.filters.source_id ||
        state.filters.status ||
        state.filters.date_from ||
        state.filters.date_to ||
        state.filters.generated_from ||
        state.filters.generated_to
      )
    },

    getCategoryById: (state) => (id: number): Category | undefined => {
      return state.categories.find(c => c.id === id)
    },

    getProvinceById: (state) => (id: number): Province | undefined => {
      return state.provinces.find(p => p.id === id)
    },

    getSourceById: (state) => (id: number): LeadSource | undefined => {
      return state.sources.find(s => s.id === id)
    },

    activeCategories: (state): Category[] => 
      state.categories.filter(c => c.is_active),

    activeProvinces: (state): Province[] => 
      state.provinces.filter(p => p.is_active),

    activeSources: (state): LeadSource[] => 
      state.sources.filter(s => s.is_active)
  },

  actions: {
    /**
     * Carica dati di supporto (categorie, province, sorgenti)
     */
    async fetchSupportData() {
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          this.categories = [...mockCategories]
          this.provinces = [...mockProvinces]
          this.sources = [...mockSources]
          return
        }

        const { api } = useApi()
        const [categoriesRes, provincesRes, sourcesRes] = await Promise.all([
          api<{ data: Category[] }>('/admin/categories'),
          api<{ data: Province[] }>('/admin/provinces'),
          api<{ data: LeadSource[] }>('/admin/lead-sources')
        ])

        this.categories = categoriesRes.data
        this.provinces = provincesRes.data
        this.sources = sourcesRes.data
      } catch (error: any) {
        console.error('fetchSupportData error:', error)
      }
    },

    /**
     * Carica lista lead con filtri e paginazione
     */
    async fetchLeads() {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))

          // Applica filtri ai mock data
          let filtered = [...mockLeads]

          // Filtro ricerca
          if (this.filters.search) {
            const search = this.filters.search.toLowerCase()
            filtered = filtered.filter(l =>
              l.first_name.toLowerCase().includes(search) ||
              l.last_name.toLowerCase().includes(search) ||
              l.email.toLowerCase().includes(search) ||
              l.phone.includes(search) ||
              l.request_text?.toLowerCase().includes(search)
            )
          }

          // Filtro categoria
          if (this.filters.category_id) {
            filtered = filtered.filter(l => l.category_id === this.filters.category_id)
          }

          // Filtro provincia
          if (this.filters.province_id) {
            filtered = filtered.filter(l => l.province_id === this.filters.province_id)
          }

          // Filtro sorgente
          if (this.filters.source_id) {
            filtered = filtered.filter(l => l.source_id === this.filters.source_id)
          }

          // Filtro stato
          if (this.filters.status) {
            filtered = filtered.filter(l => l.status === this.filters.status)
          }

          // Filtro data generazione
          if (this.filters.generated_from) {
            filtered = filtered.filter(l => l.generated_at >= this.filters.generated_from!)
          }
          if (this.filters.generated_to) {
            filtered = filtered.filter(l => l.generated_at <= this.filters.generated_to!)
          }

          // Ordinamento
          const sortField = this.filters.sort_by || 'created_at'
          const sortOrder = this.filters.sort_order === 'asc' ? 1 : -1
          filtered.sort((a, b) => {
            const aVal = (a as any)[sortField]
            const bVal = (b as any)[sortField]
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

          this.leads = filtered.slice(start, end)
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
        if (this.filters.category_id) params.append('category_id', String(this.filters.category_id))
        if (this.filters.province_id) params.append('province_id', String(this.filters.province_id))
        if (this.filters.source_id) params.append('source_id', String(this.filters.source_id))
        if (this.filters.status) params.append('status', this.filters.status)
        if (this.filters.generated_from) params.append('generated_from', this.filters.generated_from)
        if (this.filters.generated_to) params.append('generated_to', this.filters.generated_to)
        if (this.filters.sort_by) params.append('sort_by', this.filters.sort_by)
        if (this.filters.sort_order) params.append('sort_order', this.filters.sort_order)
        params.append('page', String(this.filters.page || 1))
        params.append('per_page', String(this.filters.per_page || 10))

        const response = await api<{ data: Lead[], meta: PaginationMeta }>(
          `/admin/leads?${params.toString()}`
        )

        this.leads = response.data
        this.pagination = response.meta
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento lead'
        console.error('fetchLeads error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Carica singolo lead
     */
    async fetchLead(id: number) {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          const lead = mockLeads.find(l => l.id === id)
          this.currentLead = lead || null
          if (!lead) {
            this.error = 'Lead non trovato'
          }
          return
        }

        const { api } = useApi()
        const response = await api<{ data: Lead }>(`/admin/leads/${id}`)
        this.currentLead = response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento lead'
        console.error('fetchLead error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Crea nuovo lead
     */
    async createLead(data: LeadCreateForm): Promise<Lead | null> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const newLead: Lead = {
            id: Math.max(...mockLeads.map(l => l.id)) + 1,
            category_id: data.category_id!,
            province_id: data.province_id!,
            source_id: data.source_id!,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            request_text: data.request_text,
            extra_tags: data.extra_tags,
            status: 'free',
            current_shares: 0,
            external_id: data.external_id,
            generated_at: data.generated_at,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: this.categories.find(c => c.id === data.category_id),
            province: this.provinces.find(p => p.id === data.province_id),
            source: this.sources.find(s => s.id === data.source_id)
          }
          mockLeads.push(newLead)
          this.leads.unshift(newLead)
          this.pagination.total++
          return newLead
        }

        const { api } = useApi()
        const response = await api<{ data: Lead }>('/admin/leads', {
          method: 'POST',
          body: data
        })

        this.leads.unshift(response.data)
        this.pagination.total++

        return response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nella creazione lead'
        console.error('createLead error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    /**
     * Aggiorna lead
     */
    async updateLead(id: number, data: LeadUpdateForm): Promise<Lead | null> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const index = mockLeads.findIndex(l => l.id === id)
          if (index !== -1) {
            const updated: Lead = {
              ...mockLeads[index],
              ...data,
              updated_at: new Date().toISOString(),
              category: this.categories.find(c => c.id === data.category_id),
              province: this.provinces.find(p => p.id === data.province_id),
              source: this.sources.find(s => s.id === data.source_id)
            }
            mockLeads[index] = updated

            const listIndex = this.leads.findIndex(l => l.id === id)
            if (listIndex !== -1) {
              this.leads[listIndex] = updated
            }

            if (this.currentLead?.id === id) {
              this.currentLead = updated
            }

            return updated
          }
          this.error = 'Lead non trovato'
          return null
        }

        const { api } = useApi()
        const response = await api<{ data: Lead }>(`/admin/leads/${id}`, {
          method: 'PUT',
          body: data
        })

        const index = this.leads.findIndex(l => l.id === id)
        if (index !== -1) {
          this.leads[index] = response.data
        }

        if (this.currentLead?.id === id) {
          this.currentLead = response.data
        }

        return response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nell\'aggiornamento lead'
        console.error('updateLead error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    /**
     * Elimina lead (solo se non venduto)
     */
    async deleteLead(id: number): Promise<boolean> {
      this.saving = true
      this.error = null

      try {
        // Verifica che il lead non sia venduto
        const lead = mockLeads.find(l => l.id === id) || this.leads.find(l => l.id === id)
        if (lead && lead.status !== 'free') {
          this.error = 'Non è possibile eliminare un lead già venduto'
          return false
        }

        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const index = mockLeads.findIndex(l => l.id === id)
          if (index !== -1) {
            mockLeads.splice(index, 1)
            this.leads = this.leads.filter(l => l.id !== id)
            this.pagination.total--
            return true
          }
          this.error = 'Lead non trovato'
          return false
        }

        const { api } = useApi()
        await api(`/admin/leads/${id}`, { method: 'DELETE' })

        this.leads = this.leads.filter(l => l.id !== id)
        this.pagination.total--

        return true
      } catch (error: any) {
        this.error = error.message || 'Errore nell\'eliminazione lead'
        console.error('deleteLead error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Elimina lead multipli (bulk delete - solo spam/non venduti)
     */
    async deleteLeads(ids: number[]): Promise<{ success: number; failed: number }> {
      this.saving = true
      this.error = null

      let success = 0
      let failed = 0

      try {
        for (const id of ids) {
          const lead = mockLeads.find(l => l.id === id) || this.leads.find(l => l.id === id)
          if (lead && lead.status !== 'free') {
            failed++
            continue
          }

          if (USE_MOCK_DATA) {
            const index = mockLeads.findIndex(l => l.id === id)
            if (index !== -1) {
              mockLeads.splice(index, 1)
              success++
            } else {
              failed++
            }
          } else {
            try {
              const { api } = useApi()
              await api(`/admin/leads/${id}`, { method: 'DELETE' })
              success++
            } catch {
              failed++
            }
          }
        }

        // Aggiorna lista
        this.leads = this.leads.filter(l => !ids.includes(l.id) || l.status !== 'free')
        this.pagination.total -= success

        return { success, failed }
      } catch (error: any) {
        this.error = error.message || 'Errore nell\'eliminazione lead'
        return { success, failed }
      } finally {
        this.saving = false
      }
    },

    /**
     * Import lead da file CSV/XLSX
     */
    async importLeads(config: LeadImportConfig): Promise<LeadImportResult | null> {
      this.importing = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 2000))
          // Simula risultato import
          return {
            total_rows: 50,
            imported: 47,
            skipped: 2,
            errors: [
              { row: 12, message: 'Email non valida' },
              { row: 35, message: 'Provincia non trovata' }
            ]
          }
        }

        const { api } = useApi()
        const formData = new FormData()
        if (config.file) {
          formData.append('file', config.file)
        }
        if (config.category_id) {
          formData.append('category_id', String(config.category_id))
        }
        if (config.source_id) {
          formData.append('source_id', String(config.source_id))
        }
        formData.append('mapping', JSON.stringify(config.mapping))
        formData.append('skip_header', config.skip_header ? '1' : '0')
        formData.append('duplicate_strategy', config.duplicate_strategy)

        const response = await api<{ data: LeadImportResult }>('/admin/leads/import', {
          method: 'POST',
          body: formData
        })

        // Ricarica lista lead dopo import
        await this.fetchLeads()

        return response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nell\'import dei lead'
        console.error('importLeads error:', error)
        return null
      } finally {
        this.importing = false
      }
    },

    /**
     * Carica statistiche lead
     */
    async fetchStats() {
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          this.stats = {
            total: mockLeads.length,
            free: mockLeads.filter(l => l.status === 'free').length,
            sold_exclusive: mockLeads.filter(l => l.status === 'sold_exclusive').length,
            sold_shared: mockLeads.filter(l => l.status === 'sold_shared').length,
            exhausted: mockLeads.filter(l => l.status === 'exhausted').length,
            by_category: mockCategories.map(c => ({
              category_id: c.id,
              category_name: c.name,
              count: mockLeads.filter(l => l.category_id === c.id).length
            })),
            by_province: mockProvinces.slice(0, 5).map(p => ({
              province_id: p.id,
              province_name: p.name,
              count: mockLeads.filter(l => l.province_id === p.id).length
            })),
            by_source: mockSources.map(s => ({
              source_id: s.id,
              source_name: s.name,
              count: mockLeads.filter(l => l.source_id === s.id).length
            }))
          }
          return
        }

        const { api } = useApi()
        const response = await api<{ data: LeadStats }>('/admin/leads/stats')
        this.stats = response.data
      } catch (error: any) {
        console.error('fetchStats error:', error)
      }
    },

    // ============================================
    // GESTIONE SORGENTI LEAD
    // ============================================

    /**
     * Carica lista sorgenti
     */
    async fetchSources() {
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          this.sources = [...mockSources]
          return
        }

        const { api } = useApi()
        const response = await api<{ data: LeadSource[] }>('/admin/lead-sources')
        this.sources = response.data
      } catch (error: any) {
        console.error('fetchSources error:', error)
      }
    },

    /**
     * Crea nuova sorgente
     */
    async createSource(data: LeadSourceCreateForm): Promise<LeadSource | null> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const newSource: LeadSource = {
            id: Math.max(...mockSources.map(s => s.id)) + 1,
            name: data.name,
            slug: data.slug,
            description: data.description,
            api_key: `api_${Date.now()}`,
            is_active: data.is_active,
            config: data.config,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          mockSources.push(newSource)
          this.sources.push(newSource)
          return newSource
        }

        const { api } = useApi()
        const response = await api<{ data: LeadSource }>('/admin/lead-sources', {
          method: 'POST',
          body: data
        })

        this.sources.push(response.data)
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nella creazione sorgente'
        return null
      } finally {
        this.saving = false
      }
    },

    /**
     * Aggiorna sorgente
     */
    async updateSource(id: number, data: LeadSourceUpdateForm): Promise<LeadSource | null> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const index = mockSources.findIndex(s => s.id === id)
          if (index !== -1) {
            const updated: LeadSource = {
              ...mockSources[index],
              ...data,
              updated_at: new Date().toISOString()
            }
            mockSources[index] = updated
            const listIndex = this.sources.findIndex(s => s.id === id)
            if (listIndex !== -1) {
              this.sources[listIndex] = updated
            }
            return updated
          }
          return null
        }

        const { api } = useApi()
        const response = await api<{ data: LeadSource }>(`/admin/lead-sources/${id}`, {
          method: 'PUT',
          body: data
        })

        const index = this.sources.findIndex(s => s.id === id)
        if (index !== -1) {
          this.sources[index] = response.data
        }

        return response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nell\'aggiornamento sorgente'
        return null
      } finally {
        this.saving = false
      }
    },

    /**
     * Rigenera API key per una sorgente
     */
    async regenerateApiKey(id: number): Promise<string | null> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const newKey = `api_${Date.now()}_${Math.random().toString(36).substring(7)}`
          const index = mockSources.findIndex(s => s.id === id)
          if (index !== -1) {
            mockSources[index].api_key = newKey
            const listIndex = this.sources.findIndex(s => s.id === id)
            if (listIndex !== -1) {
              this.sources[listIndex].api_key = newKey
            }
          }
          return newKey
        }

        const { api } = useApi()
        const response = await api<{ data: { api_key: string } }>(`/admin/lead-sources/${id}/regenerate-key`, {
          method: 'POST'
        })

        const index = this.sources.findIndex(s => s.id === id)
        if (index !== -1) {
          this.sources[index].api_key = response.data.api_key
        }

        return response.data.api_key
      } catch (error: any) {
        this.error = error.message || 'Errore nella rigenerazione API key'
        return null
      } finally {
        this.saving = false
      }
    },

    /**
     * Elimina sorgente
     */
    async deleteSource(id: number): Promise<boolean> {
      this.saving = true
      this.error = null

      try {
        // Verifica che non ci siano lead associati
        const hasLeads = mockLeads.some(l => l.source_id === id)
        if (hasLeads) {
          this.error = 'Non è possibile eliminare una sorgente con lead associati'
          return false
        }

        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const index = mockSources.findIndex(s => s.id === id)
          if (index !== -1) {
            mockSources.splice(index, 1)
            this.sources = this.sources.filter(s => s.id !== id)
            return true
          }
          return false
        }

        const { api } = useApi()
        await api(`/admin/lead-sources/${id}`, { method: 'DELETE' })

        this.sources = this.sources.filter(s => s.id !== id)
        return true
      } catch (error: any) {
        this.error = error.message || 'Errore nell\'eliminazione sorgente'
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Imposta filtri
     */
    setFilters(filters: Partial<LeadFilters>) {
      this.filters = { ...this.filters, ...filters }
      // Reset page se cambiano altri filtri
      if (!('page' in filters)) {
        this.filters.page = 1
      }
    },

    /**
     * Reset filtri
     */
    resetFilters() {
      this.filters = {
        search: '',
        category_id: '',
        province_id: '',
        source_id: '',
        status: '',
        sort_by: 'created_at',
        sort_order: 'desc',
        page: 1,
        per_page: 10
      }
    },

    /**
     * Pulisci stato
     */
    clearState() {
      this.leads = []
      this.currentLead = null
      this.stats = null
      this.error = null
    }
  }
})
