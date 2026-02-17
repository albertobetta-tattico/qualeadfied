/**
 * Pricing Store - Gestione Listini e Storico Prezzi
 * Qualeadfied B2B Lead Platform
 */

import { defineStore } from 'pinia'
import type {
  Category,
  CategoryPrice,
  CategoryPriceForm,
  CategoryPriceWithCategory,
  PriceHistoryEntry,
  PricingFilters,
  PricingStats
} from '~/types/catalog'

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface PricingState {
  // Category Prices
  categoryPrices: CategoryPrice[]
  categoryPricesWithCategory: CategoryPriceWithCategory[]
  currentPrice: CategoryPriceWithCategory | null
  
  // Price History
  priceHistory: PriceHistoryEntry[]
  
  // Stats
  pricingStats: PricingStats | null
  
  // Pagination & Filters
  pagination: PaginationMeta
  filters: PricingFilters
  historyPagination: PaginationMeta
  historyFilters: PricingFilters
  
  // Categories (cached for lookups)
  categories: Category[]
  
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

export const usePricingStore = defineStore('pricing', {
  state: (): PricingState => ({
    // Category Prices
    categoryPrices: [],
    categoryPricesWithCategory: [],
    currentPrice: null,
    
    // Price History
    priceHistory: [],
    
    // Stats
    pricingStats: null,
    
    // Pagination & Filters
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0
    },
    filters: {
      search: '',
      category_id: '',
      page: 1,
      per_page: 20
    },
    historyPagination: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0
    },
    historyFilters: {
      search: '',
      category_id: '',
      date_from: '',
      date_to: '',
      page: 1,
      per_page: 20
    },
    
    // Categories
    categories: [],
    
    // UI State
    loading: false,
    saving: false,
    error: null
  }),

  getters: {
    // Category Prices
    hasPrices: (state): boolean => state.categoryPricesWithCategory.length > 0,
    
    categoriesWithPrices: (state): number[] => 
      state.categoryPricesWithCategory.map(p => p.category_id),
    
    categoriesWithoutPrices: (state): Category[] => {
      const withPrices = state.categoryPricesWithCategory.map(p => p.category_id)
      return state.categories.filter(c => !withPrices.includes(c.id) && c.is_active)
    },
    
    getPriceForCategory: (state) => (categoryId: number): CategoryPriceWithCategory | undefined => {
      return state.categoryPricesWithCategory.find(p => p.category_id === categoryId)
    },
    
    // Categories
    activeCategories: (state): Category[] => state.categories.filter(c => c.is_active),
    
    categoriesForSelect: (state): { label: string; value: number }[] =>
      state.categories
        .filter(c => c.is_active)
        .map(c => ({ label: c.name, value: c.id })),
    
    // Filters
    hasActiveFilters: (state): boolean => {
      return !!(state.filters.search || state.filters.category_id)
    },
    
    hasHistoryActiveFilters: (state): boolean => {
      return !!(
        state.historyFilters.search || 
        state.historyFilters.category_id ||
        state.historyFilters.date_from ||
        state.historyFilters.date_to
      )
    }
  },

  actions: {
    // ============================================
    // CATEGORIES (for reference)
    // ============================================
    
    async fetchAllCategories() {
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          this.categories = [...mockCategories]
          return
        }

        const { api } = useApi()
        const response = await api<{ data: Category[] }>('/admin/categories?per_page=999')
        this.categories = response.data
      } catch (error: any) {
        console.error('fetchAllCategories error:', error)
      }
    },

    // ============================================
    // CATEGORY PRICES
    // ============================================

    async fetchCategoryPrices() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 400))

          // Ensure categories are loaded
          if (this.categories.length === 0) {
            await this.fetchAllCategories()
          }

          // Join prices with categories
          let pricesWithCategory: CategoryPriceWithCategory[] = mockCategoryPrices.map(price => {
            const category = this.categories.find(c => c.id === price.category_id)
            return {
              ...price,
              category: category!
            }
          }).filter(p => p.category)

          // Apply search filter
          if (this.filters.search) {
            const search = this.filters.search.toLowerCase()
            pricesWithCategory = pricesWithCategory.filter(p =>
              p.category.name.toLowerCase().includes(search)
            )
          }

          // Apply category filter
          if (this.filters.category_id) {
            pricesWithCategory = pricesWithCategory.filter(p =>
              p.category_id === this.filters.category_id
            )
          }

          // Pagination
          const page = this.filters.page || 1
          const perPage = this.filters.per_page || 20
          const start = (page - 1) * perPage
          const end = start + perPage

          this.categoryPricesWithCategory = pricesWithCategory.slice(start, end)
          this.pagination = {
            current_page: page,
            last_page: Math.ceil(pricesWithCategory.length / perPage),
            per_page: perPage,
            total: pricesWithCategory.length
          }
          return
        }

        // API reale
        const { api } = useApi()
        const params = new URLSearchParams()
        if (this.filters.search) params.append('search', this.filters.search)
        if (this.filters.category_id) params.append('category_id', String(this.filters.category_id))
        params.append('page', String(this.filters.page || 1))
        params.append('per_page', String(this.filters.per_page || 20))

        const response = await api<{ data: CategoryPriceWithCategory[]; meta: PaginationMeta }>(
          `/admin/pricing?${params.toString()}`
        )
        this.categoryPricesWithCategory = response.data
        this.pagination = response.meta
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchCategoryPrices error:', error)
      } finally {
        this.loading = false
      }
    },

    async updateCategoryPrice(categoryId: number, data: CategoryPriceForm): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 600))

          // Find and update mock data
          const index = mockCategoryPrices.findIndex(p => p.category_id === categoryId)
          if (index !== -1) {
            mockCategoryPrices[index] = {
              ...mockCategoryPrices[index],
              exclusive_price: data.exclusive_price,
              shared_prices: { ...data.shared_prices },
              updated_at: new Date().toISOString()
            }
          } else {
            // Create new price entry
            const newId = Math.max(...mockCategoryPrices.map(p => p.id)) + 1
            mockCategoryPrices.push({
              id: newId,
              category_id: categoryId,
              exclusive_price: data.exclusive_price,
              shared_prices: { ...data.shared_prices },
              valid_from: new Date().toISOString(),
              valid_to: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          }

          // Add to history
          const category = this.categories.find(c => c.id === categoryId)
          if (category) {
            const historyId = Math.max(...mockPriceHistory.map(h => h.id)) + 1
            mockPriceHistory.unshift({
              id: historyId,
              category_id: categoryId,
              category_name: category.name,
              exclusive_price: data.exclusive_price,
              shared_prices: { ...data.shared_prices },
              valid_from: new Date().toISOString(),
              valid_to: null,
              changed_at: new Date().toISOString(),
              changed_by: 'Admin'
            })
          }

          return true
        }

        // API reale
        const { api } = useApi()
        await api(`/admin/pricing/${categoryId}`, {
          method: 'PUT',
          body: data
        })
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.saveError')
        console.error('updateCategoryPrice error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    // ============================================
    // PRICE HISTORY
    // ============================================

    async fetchPriceHistory(categoryId?: number) {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 400))

          // Ensure categories are loaded
          if (this.categories.length === 0) {
            await this.fetchAllCategories()
          }

          let history = [...mockPriceHistory]

          // Filter by category if specified
          if (categoryId || this.historyFilters.category_id) {
            const catId = categoryId || this.historyFilters.category_id
            history = history.filter(h => h.category_id === catId)
          }

          // Search filter
          if (this.historyFilters.search) {
            const search = this.historyFilters.search.toLowerCase()
            history = history.filter(h =>
              h.category_name.toLowerCase().includes(search)
            )
          }

          // Date from filter
          if (this.historyFilters.date_from) {
            const fromDate = new Date(this.historyFilters.date_from)
            history = history.filter(h => new Date(h.changed_at) >= fromDate)
          }

          // Date to filter
          if (this.historyFilters.date_to) {
            const toDate = new Date(this.historyFilters.date_to)
            toDate.setHours(23, 59, 59, 999)
            history = history.filter(h => new Date(h.changed_at) <= toDate)
          }

          // Sort by changed_at descending (most recent first)
          history.sort((a, b) => 
            new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()
          )

          // Pagination
          const page = this.historyFilters.page || 1
          const perPage = this.historyFilters.per_page || 20
          const start = (page - 1) * perPage
          const end = start + perPage

          this.priceHistory = history.slice(start, end)
          this.historyPagination = {
            current_page: page,
            last_page: Math.ceil(history.length / perPage),
            per_page: perPage,
            total: history.length
          }
          return
        }

        // API reale
        const { api } = useApi()
        const params = new URLSearchParams()
        if (categoryId) params.append('category_id', String(categoryId))
        if (this.historyFilters.search) params.append('search', this.historyFilters.search)
        if (this.historyFilters.date_from) params.append('date_from', this.historyFilters.date_from)
        if (this.historyFilters.date_to) params.append('date_to', this.historyFilters.date_to)
        params.append('page', String(this.historyFilters.page || 1))
        params.append('per_page', String(this.historyFilters.per_page || 20))

        const response = await api<{ data: PriceHistoryEntry[]; meta: PaginationMeta }>(
          `/admin/pricing/history?${params.toString()}`
        )
        this.priceHistory = response.data
        this.historyPagination = response.meta
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchPriceHistory error:', error)
      } finally {
        this.loading = false
      }
    },

    // ============================================
    // STATS
    // ============================================

    async fetchPricingStats() {
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))

          // Ensure categories are loaded
          if (this.categories.length === 0) {
            await this.fetchAllCategories()
          }

          const activeCategories = this.categories.filter(c => c.is_active)
          const categoriesWithPrices = mockCategoryPrices.filter(p =>
            activeCategories.some(c => c.id === p.category_id)
          )

          const avgExclusive = categoriesWithPrices.length > 0
            ? categoriesWithPrices.reduce((sum, p) => sum + p.exclusive_price, 0) / categoriesWithPrices.length
            : 0

          this.pricingStats = {
            total_categories: activeCategories.length,
            categories_with_prices: categoriesWithPrices.length,
            categories_without_prices: activeCategories.length - categoriesWithPrices.length,
            avg_exclusive_price: Math.round(avgExclusive * 100) / 100,
            total_price_changes: mockPriceHistory.length,
            last_price_change: mockPriceHistory[0]?.changed_at || null
          }
          return
        }

        // API reale
        const { api } = useApi()
        const response = await api<PricingStats>('/admin/pricing/stats')
        this.pricingStats = response
      } catch (error: any) {
        console.error('fetchPricingStats error:', error)
      }
    },

    // ============================================
    // FILTERS
    // ============================================

    setFilters(filters: Partial<PricingFilters>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        search: '',
        category_id: '',
        page: 1,
        per_page: 20
      }
    },

    setHistoryFilters(filters: Partial<PricingFilters>) {
      this.historyFilters = { ...this.historyFilters, ...filters }
    },

    resetHistoryFilters() {
      this.historyFilters = {
        search: '',
        category_id: '',
        date_from: '',
        date_to: '',
        page: 1,
        per_page: 20
      }
    },

    // ============================================
    // UTILS
    // ============================================

    clearError() {
      this.error = null
    }
  }
})
