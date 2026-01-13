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
    category_id: 1,
    name: 'Starter Fotovoltaico',
    description: 'Pacchetto base per iniziare nel fotovoltaico',
    lead_quantity: 10,
    price: 150,
    allows_exclusive: true,
    allows_shared: true,
    is_active: true,
    sort_order: 1,
    sales_count: 25,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    category_id: 1,
    name: 'Pro Fotovoltaico',
    description: 'Pacchetto professionale per aziende strutturate',
    lead_quantity: 50,
    price: 650,
    allows_exclusive: true,
    allows_shared: true,
    is_active: true,
    sort_order: 2,
    sales_count: 12,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z'
  },
  {
    id: 3,
    category_id: 2,
    name: 'Starter Infissi',
    description: 'Pacchetto base per il settore infissi',
    lead_quantity: 10,
    price: 120,
    allows_exclusive: true,
    allows_shared: true,
    is_active: true,
    sort_order: 3,
    sales_count: 18,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: 4,
    category_id: null,
    name: 'Multi-Categoria Standard',
    description: 'Pacchetto valido per tutte le categorie',
    lead_quantity: 20,
    price: 280,
    allows_exclusive: false,
    allows_shared: true,
    is_active: true,
    sort_order: 4,
    sales_count: 8,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: 5,
    category_id: 3,
    name: 'Enterprise Clima',
    description: 'Pacchetto enterprise per grandi installatori',
    lead_quantity: 100,
    price: 1200,
    allows_exclusive: true,
    allows_shared: false,
    is_active: false,
    sort_order: 5,
    sales_count: 3,
    created_at: '2024-01-06T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z'
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
    packagesWithCategory: (state): Package[] => state.packages.filter(p => p.category_id !== null),
    packagesAllCategories: (state): Package[] => state.packages.filter(p => p.category_id === null),

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
            category: mockCategories.find(c => c.id === p.category_id) || undefined
          }))

          // Filtro ricerca
          if (this.packageFilters.search) {
            const search = this.packageFilters.search.toLowerCase()
            filtered = filtered.filter(p =>
              p.name.toLowerCase().includes(search) ||
              (p.description && p.description.toLowerCase().includes(search))
            )
          }

          // Filtro categoria
          if (this.packageFilters.category_id) {
            filtered = filtered.filter(p => p.category_id === this.packageFilters.category_id)
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
              category: mockCategories.find(c => c.id === pkg.category_id) || undefined
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
            category_id: data.category_id,
            category: data.category_id ? mockCategories.find(c => c.id === data.category_id) : undefined,
            name: data.name,
            description: data.description,
            lead_quantity: data.lead_quantity,
            price: data.price,
            allows_exclusive: data.allows_exclusive,
            allows_shared: data.allows_shared,
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
            const updated = {
              ...mockPackages[index],
              ...data,
              category: data.category_id ? mockCategories.find(c => c.id === data.category_id) : undefined,
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
            total_revenue: mockPackages.reduce((acc, p) => acc + (p.price * (p.sales_count || 0)), 0)
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
