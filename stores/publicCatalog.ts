/**
 * Store - Public Catalog
 * Pinia store for public lead catalog (anonymized)
 */
import { defineStore } from 'pinia'
import type { Category, Province } from '~/types/lead'
import type {
  PublicLead,
  PublicCatalogFilters,
  PublicCatalogStats,
  HomepageContent,
  PaginationMeta
} from '~/types/publicCatalog'

const USE_MOCK_DATA = true

// Mock categories
const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Ristrutturazioni',
    slug: 'ristrutturazioni',
    description: 'Lead per lavori di ristrutturazione edilizia',
    max_shares: 5,
    is_active: true,
    sort_order: 1,
    deleted_at: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Impianti Fotovoltaici',
    slug: 'fotovoltaico',
    description: 'Lead per installazione impianti fotovoltaici',
    max_shares: 4,
    is_active: true,
    sort_order: 2,
    deleted_at: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Serramenti',
    slug: 'serramenti',
    description: 'Lead per sostituzione infissi e serramenti',
    max_shares: 5,
    is_active: true,
    sort_order: 3,
    deleted_at: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Climatizzazione',
    slug: 'climatizzazione',
    description: 'Lead per impianti di climatizzazione',
    max_shares: 4,
    is_active: true,
    sort_order: 4,
    deleted_at: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    name: 'Caldaie',
    slug: 'caldaie',
    description: 'Lead per sostituzione caldaie',
    max_shares: 5,
    is_active: true,
    sort_order: 5,
    deleted_at: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

// Mock provinces
const mockProvinces: Province[] = [
  { id: 1, name: 'Milano', code: 'MI', region: 'Lombardia', is_active: true },
  { id: 2, name: 'Roma', code: 'RM', region: 'Lazio', is_active: true },
  { id: 3, name: 'Torino', code: 'TO', region: 'Piemonte', is_active: true },
  { id: 4, name: 'Napoli', code: 'NA', region: 'Campania', is_active: true },
  { id: 5, name: 'Bologna', code: 'BO', region: 'Emilia-Romagna', is_active: true },
  { id: 6, name: 'Firenze', code: 'FI', region: 'Toscana', is_active: true },
  { id: 7, name: 'Venezia', code: 'VE', region: 'Veneto', is_active: true },
  { id: 8, name: 'Bergamo', code: 'BG', region: 'Lombardia', is_active: true },
  { id: 9, name: 'Brescia', code: 'BS', region: 'Lombardia', is_active: true },
  { id: 10, name: 'Padova', code: 'PD', region: 'Veneto', is_active: true }
]

// Mock public leads
const mockPublicLeads: PublicLead[] = [
  {
    id: 1,
    category_id: 1,
    province_id: 1,
    request_preview: 'Richiesta preventivo per ristrutturaz***',
    generated_at: '2025-01-14T09:00:00Z',
    status: 'free',
    is_exclusive_available: true,
    shared_slots_available: 5,
    shared_slots_total: 5,
    base_price: 15,
    category: mockCategories[0],
    province: mockProvinces[0]
  },
  {
    id: 2,
    category_id: 2,
    province_id: 2,
    request_preview: 'Interessato a impianto fotovoltaico***',
    generated_at: '2025-01-14T08:30:00Z',
    status: 'free',
    is_exclusive_available: true,
    shared_slots_available: 4,
    shared_slots_total: 4,
    base_price: 20,
    category: mockCategories[1],
    province: mockProvinces[1]
  },
  {
    id: 3,
    category_id: 3,
    province_id: 3,
    request_preview: 'Sostituzione infissi appartamento***',
    generated_at: '2025-01-14T08:00:00Z',
    status: 'sold_shared',
    is_exclusive_available: false,
    shared_slots_available: 3,
    shared_slots_total: 5,
    base_price: 12,
    category: mockCategories[2],
    province: mockProvinces[2]
  },
  {
    id: 4,
    category_id: 4,
    province_id: 4,
    request_preview: 'Installazione climatizzatore dual***',
    generated_at: '2025-01-13T18:00:00Z',
    status: 'free',
    is_exclusive_available: true,
    shared_slots_available: 4,
    shared_slots_total: 4,
    base_price: 18,
    category: mockCategories[3],
    province: mockProvinces[3]
  },
  {
    id: 5,
    category_id: 5,
    province_id: 5,
    request_preview: 'Richiesta sostituzione caldaia a***',
    generated_at: '2025-01-13T16:30:00Z',
    status: 'sold_shared',
    is_exclusive_available: false,
    shared_slots_available: 2,
    shared_slots_total: 5,
    base_price: 15,
    category: mockCategories[4],
    province: mockProvinces[4]
  },
  {
    id: 6,
    category_id: 1,
    province_id: 6,
    request_preview: 'Ristrutturazione bagno completa***',
    generated_at: '2025-01-13T14:00:00Z',
    status: 'free',
    is_exclusive_available: true,
    shared_slots_available: 5,
    shared_slots_total: 5,
    base_price: 15,
    category: mockCategories[0],
    province: mockProvinces[5]
  },
  {
    id: 7,
    category_id: 2,
    province_id: 7,
    request_preview: 'Preventivo pannelli solari villa***',
    generated_at: '2025-01-13T12:00:00Z',
    status: 'sold_shared',
    is_exclusive_available: false,
    shared_slots_available: 1,
    shared_slots_total: 4,
    base_price: 20,
    category: mockCategories[1],
    province: mockProvinces[6]
  },
  {
    id: 8,
    category_id: 3,
    province_id: 8,
    request_preview: 'Nuovi serramenti in PVC per***',
    generated_at: '2025-01-13T10:00:00Z',
    status: 'free',
    is_exclusive_available: true,
    shared_slots_available: 5,
    shared_slots_total: 5,
    base_price: 12,
    category: mockCategories[2],
    province: mockProvinces[7]
  }
]

// Mock homepage content
const mockHomepageContent: HomepageContent = {
  hero: {
    headline: 'Lead qualificati per far crescere il tuo business',
    subtitle: 'Accedi a richieste verificate di clienti pronti ad acquistare. Solo lead di qualità, nessuno spreco.',
    cta_text: 'Inizia Gratis',
    image_url: '/images/hero-illustration.svg'
  },
  value_propositions: [
    {
      icon: 'pi pi-verified',
      title: 'Lead Verificati',
      description: 'Ogni lead è verificato e validato prima di essere messo in vendita. Contatti reali con richieste concrete.'
    },
    {
      icon: 'pi pi-bolt',
      title: 'Consegna Immediata',
      description: 'Ricevi i dati completi del cliente immediatamente dopo l\'acquisto. Nessuna attesa.'
    },
    {
      icon: 'pi pi-shield',
      title: 'Esclusività Garantita',
      description: 'Scegli lead esclusivi per avere zero concorrenza, o condivisi per un prezzo più accessibile.'
    },
    {
      icon: 'pi pi-wallet',
      title: 'Paghi Solo Quello che Usi',
      description: 'Nessun abbonamento obbligatorio. Acquista singoli lead o pacchetti in base alle tue esigenze.'
    }
  ],
  how_it_works: [
    {
      step: 1,
      title: 'Registrati Gratis',
      description: 'Crea il tuo account in pochi minuti e ricevi 3 lead gratuiti per provare il servizio.'
    },
    {
      step: 2,
      title: 'Scegli i Tuoi Lead',
      description: 'Filtra per categoria e zona geografica. Scegli se acquistare in esclusiva o in condivisione.'
    },
    {
      step: 3,
      title: 'Contatta e Converti',
      description: 'Ricevi i dati completi e contatta subito il cliente. Trasforma i lead in contratti.'
    }
  ],
  stats: {
    total_leads_available: 1250,
    categories_count: 12,
    provinces_covered: 107,
    satisfied_clients: 850
  },
  featured_categories: mockCategories.slice(0, 4)
}

interface PublicCatalogState {
  leads: PublicLead[]
  categories: Category[]
  provinces: Province[]
  homepageContent: HomepageContent | null
  filters: PublicCatalogFilters
  pagination: PaginationMeta
  loading: boolean
  error: string | null
}

export const usePublicCatalogStore = defineStore('publicCatalog', {
  state: (): PublicCatalogState => ({
    leads: [],
    categories: [],
    provinces: [],
    homepageContent: null,
    filters: {
      category_id: '',
      province_id: '',
      date_from: '',
      date_to: '',
      availability: '',
      sort_by: 'date',
      sort_order: 'desc',
      page: 1,
      per_page: 12
    },
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 12,
      total: 0,
      from: 0,
      to: 0
    },
    loading: false,
    error: null
  }),

  getters: {
    availableCategories: (state): Category[] => {
      return state.categories.filter(c => c.is_active)
    },
    availableProvinces: (state): Province[] => {
      return state.provinces.filter(p => p.is_active)
    },
    provincesByRegion: (state): Record<string, Province[]> => {
      const grouped: Record<string, Province[]> = {}
      for (const province of state.provinces) {
        if (!grouped[province.region]) {
          grouped[province.region] = []
        }
        grouped[province.region].push(province)
      }
      return grouped
    },
    hasFilters: (state): boolean => {
      return !!(
        state.filters.category_id ||
        state.filters.province_id ||
        state.filters.date_from ||
        state.filters.date_to ||
        state.filters.availability
      )
    }
  },

  actions: {
    /**
     * Fetch categories
     */
    async fetchCategories(): Promise<void> {
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          this.categories = mockCategories
          return
        }

        const response = await $fetch<{ data: Category[] }>('/api/categories')
        this.categories = response.data
      } catch (e: any) {
        console.error('Error fetching categories:', e)
      }
    },

    /**
     * Fetch provinces
     */
    async fetchProvinces(): Promise<void> {
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          this.provinces = mockProvinces
          return
        }

        const response = await $fetch<{ data: Province[] }>('/api/provinces')
        this.provinces = response.data
      } catch (e: any) {
        console.error('Error fetching provinces:', e)
      }
    },

    /**
     * Fetch public leads catalog
     */
    async fetchLeads(): Promise<void> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))

          // Apply filters
          let filteredLeads = [...mockPublicLeads]

          if (this.filters.category_id) {
            filteredLeads = filteredLeads.filter(l => l.category_id === this.filters.category_id)
          }

          if (this.filters.province_id) {
            filteredLeads = filteredLeads.filter(l => l.province_id === this.filters.province_id)
          }

          if (this.filters.availability === 'exclusive') {
            filteredLeads = filteredLeads.filter(l => l.is_exclusive_available)
          } else if (this.filters.availability === 'shared') {
            filteredLeads = filteredLeads.filter(l => l.shared_slots_available > 0)
          }

          // Sort
          if (this.filters.sort_by === 'date') {
            filteredLeads.sort((a, b) => {
              const dateA = new Date(a.generated_at).getTime()
              const dateB = new Date(b.generated_at).getTime()
              return this.filters.sort_order === 'desc' ? dateB - dateA : dateA - dateB
            })
          } else if (this.filters.sort_by === 'price') {
            filteredLeads.sort((a, b) => {
              return this.filters.sort_order === 'desc'
                ? b.base_price - a.base_price
                : a.base_price - b.base_price
            })
          }

          // Pagination
          const total = filteredLeads.length
          const perPage = this.filters.per_page || 12
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
        if (this.filters.province_id) params.set('province_id', String(this.filters.province_id))
        if (this.filters.date_from) params.set('date_from', this.filters.date_from)
        if (this.filters.date_to) params.set('date_to', this.filters.date_to)
        if (this.filters.availability) params.set('availability', this.filters.availability)
        if (this.filters.sort_by) params.set('sort_by', this.filters.sort_by)
        if (this.filters.sort_order) params.set('sort_order', this.filters.sort_order)
        if (this.filters.page) params.set('page', String(this.filters.page))
        if (this.filters.per_page) params.set('per_page', String(this.filters.per_page))

        const response = await $fetch<{ data: PublicLead[]; meta: PaginationMeta }>(`/api/leads?${params}`)
        this.leads = response.data
        this.pagination = response.meta
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.loadError')
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch homepage content
     */
    async fetchHomepageContent(): Promise<void> {
      this.loading = true

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          this.homepageContent = mockHomepageContent
          return
        }

        const response = await $fetch<HomepageContent>('/api/homepage')
        this.homepageContent = response
      } catch (e: any) {
        console.error('Error fetching homepage content:', e)
        // Use fallback content
        this.homepageContent = mockHomepageContent
      } finally {
        this.loading = false
      }
    },

    /**
     * Set filters
     */
    setFilters(filters: Partial<PublicCatalogFilters>): void {
      this.filters = { ...this.filters, ...filters, page: 1 }
    },

    /**
     * Reset filters
     */
    resetFilters(): void {
      this.filters = {
        category_id: '',
        province_id: '',
        date_from: '',
        date_to: '',
        availability: '',
        sort_by: 'date',
        sort_order: 'desc',
        page: 1,
        per_page: 12
      }
    },

    /**
     * Change page
     */
    setPage(page: number): void {
      this.filters.page = page
    },

    /**
     * Initialize store (load categories and provinces)
     */
    async initialize(): Promise<void> {
      await Promise.all([
        this.fetchCategories(),
        this.fetchProvinces()
      ])
    }
  }
})
