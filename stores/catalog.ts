/**
 * Catalog Store - Gestione Categorie, Province e Pacchetti
 * Qualeadfied B2B Lead Platform
 */

import { defineStore } from 'pinia'
import type {
  Category,
  CategoryCreateForm,
  CategoryUpdateForm,
  CategoryFilters,
  CategoryStats,
  CategoryPrice,
  CategoryPriceForm,
  CategoryPriceWithCategory,
  PriceHistoryEntry,
  PricingFilters,
  PricingStats,
  Province,
  ProvinceFilters,
  ProvinceStats,
  Package,
  PackageCreateForm,
  PackageUpdateForm,
  PackageFilters,
  PackageStats
} from '~/types/catalog'
import { ALL_PROVINCES, PROVINCES_BY_REGION } from '~/types/catalog'

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface CatalogState {
  // Categories
  categories: Category[]
  currentCategory: Category | null
  categoryStats: CategoryStats | null
  categoryPagination: PaginationMeta
  categoryFilters: CategoryFilters
  categoryPrices: CategoryPrice[]

  // Provinces
  provinces: Province[]
  currentProvince: Province | null
  provinceStats: ProvinceStats | null
  provincePagination: PaginationMeta
  provinceFilters: ProvinceFilters

  // Packages
  packages: Package[]
  currentPackage: Package | null
  packageStats: PackageStats | null
  packagePagination: PaginationMeta
  packageFilters: PackageFilters

  // Pricing
  categoryPricesWithCategory: CategoryPriceWithCategory[]
  priceHistory: PriceHistoryEntry[]
  pricingStats: PricingStats | null
  pricingPagination: PaginationMeta
  pricingFilters: PricingFilters

  // UI State
  loading: boolean
  saving: boolean
  error: string | null
}

// ============================================
// MOCK DATA
// ============================================

const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Fotovoltaico',
    slug: 'fotovoltaico',
    description: 'Lead interessati a impianti fotovoltaici residenziali e commerciali',
    max_shares: 3,
    is_active: true,
    sort_order: 1,
    leads_count: 150,
    available_leads_count: 85,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    deleted_at: null
  },
  {
    id: 2,
    name: 'Infissi e Serramenti',
    slug: 'infissi-serramenti',
    description: 'Lead per sostituzione infissi, serramenti e vetrate',
    max_shares: 3,
    is_active: true,
    sort_order: 2,
    leads_count: 120,
    available_leads_count: 62,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    deleted_at: null
  },
  {
    id: 3,
    name: 'Climatizzazione',
    slug: 'climatizzazione',
    description: 'Lead per impianti di condizionamento e riscaldamento',
    max_shares: 4,
    is_active: true,
    sort_order: 3,
    leads_count: 95,
    available_leads_count: 48,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z',
    deleted_at: null
  },
  {
    id: 4,
    name: 'Ristrutturazioni',
    slug: 'ristrutturazioni',
    description: 'Lead per lavori di ristrutturazione completa',
    max_shares: 2,
    is_active: true,
    sort_order: 4,
    leads_count: 200,
    available_leads_count: 110,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
    deleted_at: null
  },
  {
    id: 5,
    name: 'Caldaie',
    slug: 'caldaie',
    description: 'Lead per sostituzione e manutenzione caldaie',
    max_shares: 3,
    is_active: true,
    sort_order: 5,
    leads_count: 75,
    available_leads_count: 35,
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z',
    deleted_at: null
  },
  {
    id: 6,
    name: 'Pompe di Calore',
    slug: 'pompe-di-calore',
    description: 'Lead per installazione pompe di calore',
    max_shares: 3,
    is_active: false,
    sort_order: 6,
    leads_count: 45,
    available_leads_count: 20,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z',
    deleted_at: null
  }
]

const mockPackages: Package[] = [
  {
    id: 1,
    category_ids: [1],
    name: 'Starter Fotovoltaico',
    description: 'Pacchetto base per iniziare nel fotovoltaico',
    exclusive_lead_quantity: 5,
    exclusive_price: 175,
    shared_lead_quantity: 10,
    shared_price: 100,
    is_active: true,
    sort_order: 1,
    sales_count: 25,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    category_ids: [1, 3],
    name: 'Pro Energia',
    description: 'Pacchetto professionale per fotovoltaico e climatizzazione',
    exclusive_lead_quantity: 25,
    exclusive_price: 875,
    shared_lead_quantity: 50,
    shared_price: 500,
    is_active: true,
    sort_order: 2,
    sales_count: 12,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z'
  },
  {
    id: 3,
    category_ids: [2],
    name: 'Starter Infissi',
    description: 'Pacchetto base per il settore infissi',
    exclusive_lead_quantity: 5,
    exclusive_price: 140,
    shared_lead_quantity: 10,
    shared_price: 80,
    is_active: true,
    sort_order: 3,
    sales_count: 18,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: 4,
    category_ids: [],
    name: 'Multi-Categoria Standard',
    description: 'Pacchetto valido per tutte le categorie',
    exclusive_lead_quantity: 0,
    exclusive_price: 0,
    shared_lead_quantity: 20,
    shared_price: 280,
    is_active: true,
    sort_order: 4,
    sales_count: 8,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: 5,
    category_ids: [3, 5, 6],
    name: 'Enterprise Clima',
    description: 'Pacchetto enterprise per climatizzazione, caldaie e pompe di calore',
    exclusive_lead_quantity: 50,
    exclusive_price: 1750,
    shared_lead_quantity: 100,
    shared_price: 1000,
    is_active: false,
    sort_order: 5,
    sales_count: 3,
    created_at: '2024-01-06T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z'
  }
]

// Mock Category Prices - Prezzi per categoria
const mockCategoryPrices: CategoryPrice[] = [
  {
    id: 1,
    category_id: 1,
    exclusive_price: 35.00,
    shared_prices: { slot_1: 15.00, slot_2: 15.00, slot_3: 15.00 },
    valid_from: '2024-01-01T00:00:00Z',
    valid_to: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    category_id: 2,
    exclusive_price: 28.00,
    shared_prices: { slot_1: 12.00, slot_2: 12.00, slot_3: 12.00 },
    valid_from: '2024-01-01T00:00:00Z',
    valid_to: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z'
  },
  {
    id: 3,
    category_id: 3,
    exclusive_price: 32.00,
    shared_prices: { slot_1: 10.00, slot_2: 10.00, slot_3: 10.00, slot_4: 10.00 },
    valid_from: '2024-01-01T00:00:00Z',
    valid_to: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: 4,
    category_id: 4,
    exclusive_price: 45.00,
    shared_prices: { slot_1: 25.00, slot_2: 25.00 },
    valid_from: '2024-01-01T00:00:00Z',
    valid_to: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    category_id: 5,
    exclusive_price: 22.00,
    shared_prices: { slot_1: 10.00, slot_2: 10.00, slot_3: 10.00 },
    valid_from: '2024-01-01T00:00:00Z',
    valid_to: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z'
  }
]

// Mock Price History - Storico variazioni prezzi
const mockPriceHistory: PriceHistoryEntry[] = [
  {
    id: 1,
    category_id: 1,
    category_name: 'Fotovoltaico',
    exclusive_price: 25.00,
    shared_prices: { slot_1: 10.00, slot_2: 10.00, slot_3: 10.00 },
    valid_from: '2023-01-01T00:00:00Z',
    valid_to: '2023-05-31T23:59:59Z',
    changed_at: '2023-06-01T00:00:00Z',
    changed_by: 'Mario Rossi'
  },
  {
    id: 2,
    category_id: 1,
    category_name: 'Fotovoltaico',
    exclusive_price: 30.00,
    shared_prices: { slot_1: 12.00, slot_2: 12.00, slot_3: 12.00 },
    valid_from: '2023-06-01T00:00:00Z',
    valid_to: '2023-12-31T23:59:59Z',
    changed_at: '2023-06-01T00:00:00Z',
    changed_by: 'Mario Rossi'
  },
  {
    id: 3,
    category_id: 1,
    category_name: 'Fotovoltaico',
    exclusive_price: 35.00,
    shared_prices: { slot_1: 15.00, slot_2: 15.00, slot_3: 15.00 },
    valid_from: '2024-01-01T00:00:00Z',
    valid_to: null,
    changed_at: '2024-01-01T09:30:00Z',
    changed_by: 'Admin'
  },
  {
    id: 4,
    category_id: 2,
    category_name: 'Infissi e Serramenti',
    exclusive_price: 20.00,
    shared_prices: { slot_1: 8.00, slot_2: 8.00, slot_3: 8.00 },
    valid_from: '2023-01-01T00:00:00Z',
    valid_to: '2023-08-31T23:59:59Z',
    changed_at: '2023-09-01T00:00:00Z',
    changed_by: 'Mario Rossi'
  },
  {
    id: 5,
    category_id: 2,
    category_name: 'Infissi e Serramenti',
    exclusive_price: 25.00,
    shared_prices: { slot_1: 10.00, slot_2: 10.00, slot_3: 10.00 },
    valid_from: '2023-09-01T00:00:00Z',
    valid_to: '2024-01-04T23:59:59Z',
    changed_at: '2023-09-01T14:00:00Z',
    changed_by: 'Mario Rossi'
  },
  {
    id: 6,
    category_id: 2,
    category_name: 'Infissi e Serramenti',
    exclusive_price: 28.00,
    shared_prices: { slot_1: 12.00, slot_2: 12.00, slot_3: 12.00 },
    valid_from: '2024-01-05T00:00:00Z',
    valid_to: null,
    changed_at: '2024-01-05T11:15:00Z',
    changed_by: 'Admin'
  },
  {
    id: 7,
    category_id: 3,
    category_name: 'Climatizzazione',
    exclusive_price: 28.00,
    shared_prices: { slot_1: 8.00, slot_2: 8.00, slot_3: 8.00, slot_4: 8.00 },
    valid_from: '2023-03-01T00:00:00Z',
    valid_to: '2024-01-09T23:59:59Z',
    changed_at: '2024-01-10T00:00:00Z',
    changed_by: 'Giulia Bianchi'
  },
  {
    id: 8,
    category_id: 3,
    category_name: 'Climatizzazione',
    exclusive_price: 32.00,
    shared_prices: { slot_1: 10.00, slot_2: 10.00, slot_3: 10.00, slot_4: 10.00 },
    valid_from: '2024-01-10T00:00:00Z',
    valid_to: null,
    changed_at: '2024-01-10T16:45:00Z',
    changed_by: 'Giulia Bianchi'
  },
  {
    id: 9,
    category_id: 4,
    category_name: 'Ristrutturazioni',
    exclusive_price: 40.00,
    shared_prices: { slot_1: 22.00, slot_2: 22.00 },
    valid_from: '2023-06-01T00:00:00Z',
    valid_to: '2023-12-31T23:59:59Z',
    changed_at: '2024-01-01T00:00:00Z',
    changed_by: 'Admin'
  },
  {
    id: 10,
    category_id: 4,
    category_name: 'Ristrutturazioni',
    exclusive_price: 45.00,
    shared_prices: { slot_1: 25.00, slot_2: 25.00 },
    valid_from: '2024-01-01T00:00:00Z',
    valid_to: null,
    changed_at: '2024-01-01T10:00:00Z',
    changed_by: 'Admin'
  },
  {
    id: 11,
    category_id: 5,
    category_name: 'Caldaie',
    exclusive_price: 18.00,
    shared_prices: { slot_1: 8.00, slot_2: 8.00, slot_3: 8.00 },
    valid_from: '2023-01-01T00:00:00Z',
    valid_to: '2024-01-07T23:59:59Z',
    changed_at: '2024-01-08T00:00:00Z',
    changed_by: 'Mario Rossi'
  },
  {
    id: 12,
    category_id: 5,
    category_name: 'Caldaie',
    exclusive_price: 22.00,
    shared_prices: { slot_1: 10.00, slot_2: 10.00, slot_3: 10.00 },
    valid_from: '2024-01-08T00:00:00Z',
    valid_to: null,
    changed_at: '2024-01-08T09:00:00Z',
    changed_by: 'Mario Rossi'
  }
]

// Flag per usare mock data
const USE_MOCK_DATA = true

export const useCatalogStore = defineStore('catalog', {
  state: (): CatalogState => ({
    // Categories
    categories: [],
    currentCategory: null,
    categoryStats: null,
    categoryPagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    },
    categoryFilters: {
      search: '',
      is_active: '',
      sort_by: 'sort_order',
      sort_order: 'asc',
      page: 1,
      per_page: 20
    },
    categoryPrices: [],

    // Provinces
    provinces: [],
    currentProvince: null,
    provinceStats: null,
    provincePagination: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0
    },
    provinceFilters: {
      search: '',
      region: '',
      is_active: '',
      sort_by: 'region',
      sort_order: 'asc',
      page: 1,
      per_page: 20
    },

    // Packages
    packages: [],
    currentPackage: null,
    packageStats: null,
    packagePagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    },
    packageFilters: {
      search: '',
      category_id: '',
      is_active: '',
      sort_by: 'sort_order',
      sort_order: 'asc',
      page: 1,
      per_page: 20
    },

    // Pricing
    categoryPricesWithCategory: [],
    priceHistory: [],
    pricingStats: null,
    pricingPagination: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0
    },
    pricingFilters: {
      search: '',
      category_id: '',
      page: 1,
      per_page: 20
    },

    // UI State
    loading: false,
    saving: false,
    error: null
  }),

  getters: {
    // Categories
    hasCategories: (state): boolean => state.categories.length > 0,
    activeCategories: (state): Category[] => state.categories.filter(c => c.is_active),
    inactiveCategories: (state): Category[] => state.categories.filter(c => !c.is_active),
    categoriesForSelect: (state): { label: string; value: number }[] =>
      state.categories
        .filter(c => c.is_active)
        .map(c => ({ label: c.name, value: c.id })),

    // Provinces
    hasProvinces: (state): boolean => state.provinces.length > 0,
    activeProvinces: (state): Province[] => state.provinces.filter(p => p.is_active),
    provincesForSelect: (state): { label: string; value: number; code: string }[] =>
      state.provinces
        .filter(p => p.is_active)
        .map(p => ({ label: `${p.name} (${p.code})`, value: p.id, code: p.code })),
    provincesByRegion: (state): Record<string, Province[]> => {
      const grouped: Record<string, Province[]> = {}
      state.provinces.forEach(p => {
        if (!grouped[p.region]) grouped[p.region] = []
        grouped[p.region].push(p)
      })
      return grouped
    },
    uniqueRegions: (state): string[] => {
      return [...new Set(state.provinces.map(p => p.region))].sort()
    },

    // Packages
    hasPackages: (state): boolean => state.packages.length > 0,
    activePackages: (state): Package[] => state.packages.filter(p => p.is_active),
    packagesWithCategories: (state): Package[] => state.packages.filter(p => p.category_ids.length > 0),
    packagesAllCategories: (state): Package[] => state.packages.filter(p => p.category_ids.length === 0),

    // Filters
    hasCategoryActiveFilters: (state): boolean => {
      return !!(state.categoryFilters.search || state.categoryFilters.is_active !== '')
    },
    hasProvinceActiveFilters: (state): boolean => {
      return !!(
        state.provinceFilters.search ||
        state.provinceFilters.region ||
        state.provinceFilters.is_active !== ''
      )
    },
    hasPackageActiveFilters: (state): boolean => {
      return !!(
        state.packageFilters.search ||
        state.packageFilters.category_id ||
        state.packageFilters.is_active !== ''
      )
    },

    // Pricing
    hasPrices: (state): boolean => state.categoryPricesWithCategory.length > 0,
    categoriesWithPrices: (state): number[] => state.categoryPricesWithCategory.map(p => p.category_id),
    categoriesWithoutPrices: (state): Category[] => {
      const withPrices = state.categoryPricesWithCategory.map(p => p.category_id)
      return state.categories.filter(c => !withPrices.includes(c.id) && c.is_active)
    },
    getPriceForCategory: (state) => (categoryId: number): CategoryPriceWithCategory | undefined => {
      return state.categoryPricesWithCategory.find(p => p.category_id === categoryId)
    },
    hasPricingActiveFilters: (state): boolean => {
      return !!(state.pricingFilters.search || state.pricingFilters.category_id)
    }
  },

  actions: {
    // ============================================
    // CATEGORIES
    // ============================================

    async fetchCategories() {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))

          let filtered = [...mockCategories]

          // Filtro ricerca
          if (this.categoryFilters.search) {
            const search = this.categoryFilters.search.toLowerCase()
            filtered = filtered.filter(c =>
              c.name.toLowerCase().includes(search) ||
              c.slug.toLowerCase().includes(search) ||
              (c.description && c.description.toLowerCase().includes(search))
            )
          }

          // Filtro attivo
          if (this.categoryFilters.is_active !== '') {
            filtered = filtered.filter(c => c.is_active === this.categoryFilters.is_active)
          }

          // Ordinamento
          const sortField = this.categoryFilters.sort_by || 'sort_order'
          const sortOrder = this.categoryFilters.sort_order === 'asc' ? 1 : -1
          filtered.sort((a, b) => {
            const aVal = (a as any)[sortField]
            const bVal = (b as any)[sortField]
            if (typeof aVal === 'string') {
              return aVal.localeCompare(bVal) * sortOrder
            }
            return (aVal - bVal) * sortOrder
          })

          // Paginazione
          const page = this.categoryFilters.page || 1
          const perPage = this.categoryFilters.per_page || 20
          const start = (page - 1) * perPage
          const end = start + perPage

          this.categories = filtered.slice(start, end)
          this.categoryPagination = {
            current_page: page,
            last_page: Math.ceil(filtered.length / perPage),
            per_page: perPage,
            total: filtered.length
          }
          return
        }

        // API reale
        const { api } = useApi()
        const params = new URLSearchParams()
        if (this.categoryFilters.search) params.append('search', this.categoryFilters.search)
        if (this.categoryFilters.is_active !== '') params.append('is_active', String(this.categoryFilters.is_active))
        params.append('sort_by', this.categoryFilters.sort_by || 'sort_order')
        params.append('sort_order', this.categoryFilters.sort_order || 'asc')
        params.append('page', String(this.categoryFilters.page || 1))
        params.append('per_page', String(this.categoryFilters.per_page || 20))

        const response = await api<{ data: Category[]; meta: PaginationMeta }>(
          `/admin/categories?${params.toString()}`
        )
        this.categories = response.data
        this.categoryPagination = response.meta
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento categorie'
        console.error('fetchCategories error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchAllCategories() {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          this.categories = [...mockCategories]
          return
        }

        const { api } = useApi()
        const response = await api<{ data: Category[] }>('/admin/categories?per_page=999')
        this.categories = response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento categorie'
        console.error('fetchAllCategories error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchCategory(id: number) {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          const category = mockCategories.find(c => c.id === id)
          this.currentCategory = category || null
          if (!category) {
            this.error = 'Categoria non trovata'
          }
          return
        }

        const { api } = useApi()
        const response = await api<{ data: Category }>(`/admin/categories/${id}`)
        this.currentCategory = response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento categoria'
        console.error('fetchCategory error:', error)
      } finally {
        this.loading = false
      }
    },

    async createCategory(data: CategoryCreateForm): Promise<Category | null> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const newCategory: Category = {
            id: Math.max(...mockCategories.map(c => c.id)) + 1,
            name: data.name,
            slug: data.slug,
            description: data.description,
            max_shares: data.max_shares,
            is_active: data.is_active,
            sort_order: data.sort_order,
            leads_count: 0,
            available_leads_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null
          }
          mockCategories.push(newCategory)
          this.categories.push(newCategory)
          this.categoryPagination.total++
          return newCategory
        }

        const { api } = useApi()
        const response = await api<{ data: Category }>('/admin/categories', {
          method: 'POST',
          body: data
        })
        this.categories.push(response.data)
        this.categoryPagination.total++
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nella creazione categoria'
        console.error('createCategory error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    async updateCategory(id: number, data: CategoryUpdateForm): Promise<Category | null> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const index = mockCategories.findIndex(c => c.id === id)
          if (index !== -1) {
            const updated = {
              ...mockCategories[index],
              ...data,
              updated_at: new Date().toISOString()
            }
            mockCategories[index] = updated

            const listIndex = this.categories.findIndex(c => c.id === id)
            if (listIndex !== -1) {
              this.categories[listIndex] = updated
            }

            if (this.currentCategory?.id === id) {
              this.currentCategory = updated
            }

            return updated
          }
          this.error = 'Categoria non trovata'
          return null
        }

        const { api } = useApi()
        const response = await api<{ data: Category }>(`/admin/categories/${id}`, {
          method: 'PUT',
          body: data
        })

        const index = this.categories.findIndex(c => c.id === id)
        if (index !== -1) {
          this.categories[index] = response.data
        }

        if (this.currentCategory?.id === id) {
          this.currentCategory = response.data
        }

        return response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nell\'aggiornamento categoria'
        console.error('updateCategory error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    async deleteCategory(id: number): Promise<boolean> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const index = mockCategories.findIndex(c => c.id === id)
          if (index !== -1) {
            mockCategories.splice(index, 1)
            this.categories = this.categories.filter(c => c.id !== id)
            this.categoryPagination.total--
            return true
          }
          this.error = 'Categoria non trovata'
          return false
        }

        const { api } = useApi()
        await api(`/admin/categories/${id}`, { method: 'DELETE' })
        this.categories = this.categories.filter(c => c.id !== id)
        this.categoryPagination.total--
        return true
      } catch (error: any) {
        this.error = error.message || 'Errore nell\'eliminazione categoria'
        console.error('deleteCategory error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    async toggleCategoryActive(id: number): Promise<boolean> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          const index = mockCategories.findIndex(c => c.id === id)
          if (index !== -1) {
            mockCategories[index].is_active = !mockCategories[index].is_active
            mockCategories[index].updated_at = new Date().toISOString()

            const listIndex = this.categories.findIndex(c => c.id === id)
            if (listIndex !== -1) {
              this.categories[listIndex] = { ...mockCategories[index] }
            }

            if (this.currentCategory?.id === id) {
              this.currentCategory = { ...mockCategories[index] }
            }

            return true
          }
          return false
        }

        const { api } = useApi()
        const response = await api<{ data: Category }>(`/admin/categories/${id}/toggle-active`, {
          method: 'POST'
        })

        const index = this.categories.findIndex(c => c.id === id)
        if (index !== -1) {
          this.categories[index] = response.data
        }

        if (this.currentCategory?.id === id) {
          this.currentCategory = response.data
        }

        return true
      } catch (error: any) {
        this.error = error.message || 'Errore nel cambio stato categoria'
        console.error('toggleCategoryActive error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    async fetchCategoryStats() {
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          this.categoryStats = {
            total: mockCategories.length,
            active: mockCategories.filter(c => c.is_active).length,
            inactive: mockCategories.filter(c => !c.is_active).length,
            total_leads: mockCategories.reduce((acc, c) => acc + (c.leads_count || 0), 0),
            available_leads: mockCategories.reduce((acc, c) => acc + (c.available_leads_count || 0), 0)
          }
          return
        }

        const { api } = useApi()
        const response = await api<{ data: CategoryStats }>('/admin/categories/stats')
        this.categoryStats = response.data
      } catch (error: any) {
        console.error('fetchCategoryStats error:', error)
      }
    },

    setCategoryFilters(filters: Partial<CategoryFilters>) {
      this.categoryFilters = { ...this.categoryFilters, ...filters, page: 1 }
    },

    resetCategoryFilters() {
      this.categoryFilters = {
        search: '',
        is_active: '',
        sort_by: 'sort_order',
        sort_order: 'asc',
        page: 1,
        per_page: 20
      }
    },

    // ============================================
    // PROVINCES
    // ============================================

    async fetchProvinces() {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 400))

          let filtered = [...ALL_PROVINCES]

          // Filtro ricerca
          if (this.provinceFilters.search) {
            const search = this.provinceFilters.search.toLowerCase()
            filtered = filtered.filter(p =>
              p.name.toLowerCase().includes(search) ||
              p.code.toLowerCase().includes(search)
            )
          }

          // Filtro regione
          if (this.provinceFilters.region) {
            filtered = filtered.filter(p => p.region === this.provinceFilters.region)
          }

          // Filtro attivo
          if (this.provinceFilters.is_active !== '') {
            filtered = filtered.filter(p => p.is_active === this.provinceFilters.is_active)
          }

          // Ordinamento
          const sortField = this.provinceFilters.sort_by || 'region'
          const sortOrder = this.provinceFilters.sort_order === 'asc' ? 1 : -1
          filtered.sort((a, b) => {
            const aVal = (a as any)[sortField]
            const bVal = (b as any)[sortField]
            if (typeof aVal === 'string') {
              return aVal.localeCompare(bVal) * sortOrder
            }
            return (aVal - bVal) * sortOrder
          })

          // Paginazione
          const page = this.provinceFilters.page || 1
          const perPage = this.provinceFilters.per_page || 20
          const start = (page - 1) * perPage
          const end = start + perPage

          this.provinces = filtered.slice(start, end)
          this.provincePagination = {
            current_page: page,
            last_page: Math.ceil(filtered.length / perPage),
            per_page: perPage,
            total: filtered.length
          }
          return
        }

        const { api } = useApi()
        const params = new URLSearchParams()
        if (this.provinceFilters.search) params.append('search', this.provinceFilters.search)
        if (this.provinceFilters.region) params.append('region', this.provinceFilters.region)
        if (this.provinceFilters.is_active !== '') params.append('is_active', String(this.provinceFilters.is_active))
        params.append('sort_by', this.provinceFilters.sort_by || 'region')
        params.append('sort_order', this.provinceFilters.sort_order || 'asc')
        params.append('page', String(this.provinceFilters.page || 1))
        params.append('per_page', String(this.provinceFilters.per_page || 20))

        const response = await api<{ data: Province[]; meta: PaginationMeta }>(
          `/admin/provinces?${params.toString()}`
        )
        this.provinces = response.data
        this.provincePagination = response.meta
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento province'
        console.error('fetchProvinces error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchAllProvinces() {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          this.provinces = [...ALL_PROVINCES]
          return
        }

        const { api } = useApi()
        const response = await api<{ data: Province[] }>('/admin/provinces?per_page=999')
        this.provinces = response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento province'
        console.error('fetchAllProvinces error:', error)
      } finally {
        this.loading = false
      }
    },

    async toggleProvinceActive(id: number): Promise<boolean> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          const index = this.provinces.findIndex(p => p.id === id)
          if (index !== -1) {
            this.provinces[index] = {
              ...this.provinces[index],
              is_active: !this.provinces[index].is_active
            }
            return true
          }
          return false
        }

        const { api } = useApi()
        const response = await api<{ data: Province }>(`/admin/provinces/${id}/toggle-active`, {
          method: 'POST'
        })

        const index = this.provinces.findIndex(p => p.id === id)
        if (index !== -1) {
          this.provinces[index] = response.data
        }

        return true
      } catch (error: any) {
        this.error = error.message || 'Errore nel cambio stato provincia'
        console.error('toggleProvinceActive error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    async fetchProvinceStats() {
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          const byRegion: Record<string, number> = {}
          ALL_PROVINCES.forEach(p => {
            byRegion[p.region] = (byRegion[p.region] || 0) + 1
          })
          this.provinceStats = {
            total: ALL_PROVINCES.length,
            active: ALL_PROVINCES.filter(p => p.is_active).length,
            inactive: ALL_PROVINCES.filter(p => !p.is_active).length,
            by_region: byRegion
          }
          return
        }

        const { api } = useApi()
        const response = await api<{ data: ProvinceStats }>('/admin/provinces/stats')
        this.provinceStats = response.data
      } catch (error: any) {
        console.error('fetchProvinceStats error:', error)
      }
    },

    setProvinceFilters(filters: Partial<ProvinceFilters>) {
      this.provinceFilters = { ...this.provinceFilters, ...filters, page: 1 }
    },

    resetProvinceFilters() {
      this.provinceFilters = {
        search: '',
        region: '',
        is_active: '',
        sort_by: 'region',
        sort_order: 'asc',
        page: 1,
        per_page: 20
      }
    },

    // ============================================
    // PACKAGES
    // ============================================

    async fetchPackages() {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))

          let filtered = mockPackages.map(p => ({
            ...p,
            categories: p.category_ids.length > 0
              ? mockCategories.filter(c => p.category_ids.includes(c.id))
              : undefined
          }))

          // Filtro ricerca
          if (this.packageFilters.search) {
            const search = this.packageFilters.search.toLowerCase()
            filtered = filtered.filter(p =>
              p.name.toLowerCase().includes(search) ||
              (p.description && p.description.toLowerCase().includes(search))
            )
          }

          // Filtro categoria (pacchetti che contengono almeno una delle categorie selezionate)
          if (this.packageFilters.category_id) {
            const categoryId = Number(this.packageFilters.category_id)
            filtered = filtered.filter(p => p.category_ids.includes(categoryId))
          }

          // Filtro attivo
          if (this.packageFilters.is_active !== '') {
            filtered = filtered.filter(p => p.is_active === this.packageFilters.is_active)
          }

          // Ordinamento
          const sortField = this.packageFilters.sort_by || 'sort_order'
          const sortOrder = this.packageFilters.sort_order === 'asc' ? 1 : -1
          filtered.sort((a, b) => {
            const aVal = (a as any)[sortField]
            const bVal = (b as any)[sortField]
            if (typeof aVal === 'string') {
              return aVal.localeCompare(bVal) * sortOrder
            }
            return (aVal - bVal) * sortOrder
          })

          // Paginazione
          const page = this.packageFilters.page || 1
          const perPage = this.packageFilters.per_page || 20
          const start = (page - 1) * perPage
          const end = start + perPage

          this.packages = filtered.slice(start, end)
          this.packagePagination = {
            current_page: page,
            last_page: Math.ceil(filtered.length / perPage),
            per_page: perPage,
            total: filtered.length
          }
          return
        }

        const { api } = useApi()
        const params = new URLSearchParams()
        if (this.packageFilters.search) params.append('search', this.packageFilters.search)
        if (this.packageFilters.category_id) params.append('category_id', String(this.packageFilters.category_id))
        if (this.packageFilters.is_active !== '') params.append('is_active', String(this.packageFilters.is_active))
        params.append('sort_by', this.packageFilters.sort_by || 'sort_order')
        params.append('sort_order', this.packageFilters.sort_order || 'asc')
        params.append('page', String(this.packageFilters.page || 1))
        params.append('per_page', String(this.packageFilters.per_page || 20))

        const response = await api<{ data: Package[]; meta: PaginationMeta }>(
          `/admin/packages?${params.toString()}`
        )
        this.packages = response.data
        this.packagePagination = response.meta
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento pacchetti'
        console.error('fetchPackages error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchPackage(id: number) {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          const pkg = mockPackages.find(p => p.id === id)
          if (pkg) {
            this.currentPackage = {
              ...pkg,
              categories: pkg.category_ids.length > 0
                ? mockCategories.filter(c => pkg.category_ids.includes(c.id))
                : undefined
            }
          } else {
            this.currentPackage = null
            this.error = 'Pacchetto non trovato'
          }
          return
        }

        const { api } = useApi()
        const response = await api<{ data: Package }>(`/admin/packages/${id}`)
        this.currentPackage = response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento pacchetto'
        console.error('fetchPackage error:', error)
      } finally {
        this.loading = false
      }
    },

    async createPackage(data: PackageCreateForm): Promise<Package | null> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const newPackage: Package = {
            id: Math.max(...mockPackages.map(p => p.id)) + 1,
            category_ids: data.category_ids,
            categories: data.category_ids.length > 0
              ? mockCategories.filter(c => data.category_ids.includes(c.id))
              : undefined,
            name: data.name,
            description: data.description,
            exclusive_lead_quantity: data.exclusive_lead_quantity,
            exclusive_price: data.exclusive_price,
            shared_lead_quantity: data.shared_lead_quantity,
            shared_price: data.shared_price,
            is_active: data.is_active,
            sort_order: data.sort_order,
            sales_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          mockPackages.push(newPackage)
          this.packages.push(newPackage)
          this.packagePagination.total++
          return newPackage
        }

        const { api } = useApi()
        const response = await api<{ data: Package }>('/admin/packages', {
          method: 'POST',
          body: data
        })
        this.packages.push(response.data)
        this.packagePagination.total++
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nella creazione pacchetto'
        console.error('createPackage error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    async updatePackage(id: number, data: PackageUpdateForm): Promise<Package | null> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const index = mockPackages.findIndex(p => p.id === id)
          if (index !== -1) {
            const categoryIds = data.category_ids ?? mockPackages[index].category_ids
            const updated = {
              ...mockPackages[index],
              ...data,
              categories: categoryIds.length > 0
                ? mockCategories.filter(c => categoryIds.includes(c.id))
                : undefined,
              updated_at: new Date().toISOString()
            }
            mockPackages[index] = updated

            const listIndex = this.packages.findIndex(p => p.id === id)
            if (listIndex !== -1) {
              this.packages[listIndex] = updated
            }

            if (this.currentPackage?.id === id) {
              this.currentPackage = updated
            }

            return updated
          }
          this.error = 'Pacchetto non trovato'
          return null
        }

        const { api } = useApi()
        const response = await api<{ data: Package }>(`/admin/packages/${id}`, {
          method: 'PUT',
          body: data
        })

        const index = this.packages.findIndex(p => p.id === id)
        if (index !== -1) {
          this.packages[index] = response.data
        }

        if (this.currentPackage?.id === id) {
          this.currentPackage = response.data
        }

        return response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nell\'aggiornamento pacchetto'
        console.error('updatePackage error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    async deletePackage(id: number): Promise<boolean> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const index = mockPackages.findIndex(p => p.id === id)
          if (index !== -1) {
            mockPackages.splice(index, 1)
            this.packages = this.packages.filter(p => p.id !== id)
            this.packagePagination.total--
            return true
          }
          this.error = 'Pacchetto non trovato'
          return false
        }

        const { api } = useApi()
        await api(`/admin/packages/${id}`, { method: 'DELETE' })
        this.packages = this.packages.filter(p => p.id !== id)
        this.packagePagination.total--
        return true
      } catch (error: any) {
        this.error = error.message || 'Errore nell\'eliminazione pacchetto'
        console.error('deletePackage error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    async togglePackageActive(id: number): Promise<boolean> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          const index = mockPackages.findIndex(p => p.id === id)
          if (index !== -1) {
            mockPackages[index].is_active = !mockPackages[index].is_active
            mockPackages[index].updated_at = new Date().toISOString()

            const listIndex = this.packages.findIndex(p => p.id === id)
            if (listIndex !== -1) {
              this.packages[listIndex] = { ...mockPackages[index] }
            }

            if (this.currentPackage?.id === id) {
              this.currentPackage = { ...mockPackages[index] }
            }

            return true
          }
          return false
        }

        const { api } = useApi()
        const response = await api<{ data: Package }>(`/admin/packages/${id}/toggle-active`, {
          method: 'POST'
        })

        const index = this.packages.findIndex(p => p.id === id)
        if (index !== -1) {
          this.packages[index] = response.data
        }

        if (this.currentPackage?.id === id) {
          this.currentPackage = response.data
        }

        return true
      } catch (error: any) {
        this.error = error.message || 'Errore nel cambio stato pacchetto'
        console.error('togglePackageActive error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    async fetchPackageStats() {
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          this.packageStats = {
            total: mockPackages.length,
            active: mockPackages.filter(p => p.is_active).length,
            inactive: mockPackages.filter(p => !p.is_active).length,
            total_sales: mockPackages.reduce((acc, p) => acc + (p.sales_count || 0), 0),
            total_revenue: mockPackages.reduce((acc, p) => acc + ((p.exclusive_price + p.shared_price) * (p.sales_count || 0)), 0)
          }
          return
        }

        const { api } = useApi()
        const response = await api<{ data: PackageStats }>('/admin/packages/stats')
        this.packageStats = response.data
      } catch (error: any) {
        console.error('fetchPackageStats error:', error)
      }
    },

    setPackageFilters(filters: Partial<PackageFilters>) {
      this.packageFilters = { ...this.packageFilters, ...filters, page: 1 }
    },

    resetPackageFilters() {
      this.packageFilters = {
        search: '',
        category_id: '',
        is_active: '',
        sort_by: 'sort_order',
        sort_order: 'asc',
        page: 1,
        per_page: 20
      }
    },

    // ============================================
    // PRICING
    // ============================================

    async fetchCategoryPrices() {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))

          // Unisci prezzi con categorie
          let pricesWithCategory: CategoryPriceWithCategory[] = mockCategoryPrices.map(price => {
            const category = mockCategories.find(c => c.id === price.category_id)
            return {
              ...price,
              category: category!
            }
          }).filter(p => p.category)

          // Filtro ricerca
          if (this.pricingFilters.search) {
            const search = this.pricingFilters.search.toLowerCase()
            pricesWithCategory = pricesWithCategory.filter(p =>
              p.category.name.toLowerCase().includes(search)
            )
          }

          // Filtro categoria
          if (this.pricingFilters.category_id) {
            pricesWithCategory = pricesWithCategory.filter(p =>
              p.category_id === this.pricingFilters.category_id
            )
          }

          // Ordinamento per nome categoria
          pricesWithCategory.sort((a, b) => a.category.name.localeCompare(b.category.name))

          // Paginazione
          const page = this.pricingFilters.page || 1
          const perPage = this.pricingFilters.per_page || 20
          const start = (page - 1) * perPage
          const end = start + perPage

          this.categoryPricesWithCategory = pricesWithCategory.slice(start, end)
          this.pricingPagination = {
            current_page: page,
            last_page: Math.ceil(pricesWithCategory.length / perPage),
            per_page: perPage,
            total: pricesWithCategory.length
          }
          return
        }

        const { api } = useApi()
        const params = new URLSearchParams()
        if (this.pricingFilters.search) params.append('search', this.pricingFilters.search)
        if (this.pricingFilters.category_id) params.append('category_id', String(this.pricingFilters.category_id))
        params.append('page', String(this.pricingFilters.page || 1))
        params.append('per_page', String(this.pricingFilters.per_page || 20))

        const response = await api<{ data: CategoryPriceWithCategory[]; meta: PaginationMeta }>(
          `/admin/pricing?${params.toString()}`
        )
        this.categoryPricesWithCategory = response.data
        this.pricingPagination = response.meta
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento prezzi'
        console.error('fetchCategoryPrices error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchPriceForCategory(categoryId: number): Promise<CategoryPrice | null> {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          const price = mockCategoryPrices.find(p => p.category_id === categoryId)
          return price || null
        }

        const { api } = useApi()
        const response = await api<{ data: CategoryPrice }>(`/admin/pricing/${categoryId}`)
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento prezzo'
        console.error('fetchPriceForCategory error:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    async updateCategoryPrice(categoryId: number, data: CategoryPriceForm): Promise<CategoryPrice | null> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const index = mockCategoryPrices.findIndex(p => p.category_id === categoryId)
          
          if (index !== -1) {
            // Aggiorna prezzo esistente
            mockCategoryPrices[index] = {
              ...mockCategoryPrices[index],
              exclusive_price: data.exclusive_price,
              shared_prices: data.shared_prices,
              updated_at: new Date().toISOString()
            }

            // Aggiorna anche la lista con categoria
            const listIndex = this.categoryPricesWithCategory.findIndex(p => p.category_id === categoryId)
            if (listIndex !== -1) {
              this.categoryPricesWithCategory[listIndex] = {
                ...this.categoryPricesWithCategory[listIndex],
                exclusive_price: data.exclusive_price,
                shared_prices: data.shared_prices,
                updated_at: new Date().toISOString()
              }
            }

            return mockCategoryPrices[index]
          } else {
            // Crea nuovo prezzo
            const newPrice: CategoryPrice = {
              id: Math.max(...mockCategoryPrices.map(p => p.id)) + 1,
              category_id: categoryId,
              exclusive_price: data.exclusive_price,
              shared_prices: data.shared_prices,
              valid_from: new Date().toISOString(),
              valid_to: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            mockCategoryPrices.push(newPrice)

            // Aggiungi alla lista con categoria
            const category = mockCategories.find(c => c.id === categoryId)
            if (category) {
              this.categoryPricesWithCategory.push({
                ...newPrice,
                category
              })
            }

            return newPrice
          }
        }

        const { api } = useApi()
        const response = await api<{ data: CategoryPrice }>(`/admin/pricing/${categoryId}`, {
          method: 'PUT',
          body: data
        })

        // Aggiorna la lista
        const index = this.categoryPricesWithCategory.findIndex(p => p.category_id === categoryId)
        if (index !== -1) {
          this.categoryPricesWithCategory[index] = {
            ...this.categoryPricesWithCategory[index],
            ...response.data
          }
        }

        return response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nell\'aggiornamento prezzo'
        console.error('updateCategoryPrice error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    async fetchPriceHistory(categoryId?: number) {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 400))
          
          let history = [...mockPriceHistory]
          
          // Filtro per categoria
          if (categoryId) {
            history = history.filter(h => h.category_id === categoryId)
          }

          // Ordinamento per data (più recente prima)
          history.sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime())

          this.priceHistory = history
          return
        }

        const { api } = useApi()
        const params = categoryId ? `?category_id=${categoryId}` : ''
        const response = await api<{ data: PriceHistoryEntry[] }>(`/admin/pricing/history${params}`)
        this.priceHistory = response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento storico prezzi'
        console.error('fetchPriceHistory error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchPricingStats() {
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          
          const categoriesWithPrices = mockCategoryPrices.length
          const categoriesTotal = mockCategories.filter(c => c.is_active).length
          const avgExclusive = mockCategoryPrices.reduce((acc, p) => acc + p.exclusive_price, 0) / mockCategoryPrices.length
          const allSharedPrices = mockCategoryPrices.flatMap(p => Object.values(p.shared_prices))
          const avgShared = allSharedPrices.reduce((acc, p) => acc + p, 0) / allSharedPrices.length
          
          const lastUpdate = mockCategoryPrices.reduce((latest, p) => {
            const date = new Date(p.updated_at)
            return date > latest ? date : latest
          }, new Date(0))

          this.pricingStats = {
            total_categories: categoriesTotal,
            categories_with_prices: categoriesWithPrices,
            categories_without_prices: categoriesTotal - categoriesWithPrices,
            avg_exclusive_price: Math.round(avgExclusive * 100) / 100,
            avg_shared_price: Math.round(avgShared * 100) / 100,
            last_update: lastUpdate.toISOString()
          }
          return
        }

        const { api } = useApi()
        const response = await api<{ data: PricingStats }>('/admin/pricing/stats')
        this.pricingStats = response.data
      } catch (error: any) {
        console.error('fetchPricingStats error:', error)
      }
    },

    setPricingFilters(filters: Partial<PricingFilters>) {
      this.pricingFilters = { ...this.pricingFilters, ...filters, page: 1 }
    },

    resetPricingFilters() {
      this.pricingFilters = {
        search: '',
        category_id: '',
        page: 1,
        per_page: 20
      }
    },

    // ============================================
    // GLOBAL
    // ============================================

    clearState() {
      this.categories = []
      this.currentCategory = null
      this.categoryStats = null
      this.provinces = []
      this.currentProvince = null
      this.provinceStats = null
      this.packages = []
      this.currentPackage = null
      this.packageStats = null
      this.error = null
    }
  }
})
