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

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface CatalogState {
  categories: Category[]
  currentCategory: Category | null
  categoryStats: CategoryStats | null
  categoryPagination: PaginationMeta
  categoryFilters: CategoryFilters
  categoryPrices: CategoryPrice[]
  provinces: Province[]
  currentProvince: Province | null
  provinceStats: ProvinceStats | null
  provincePagination: PaginationMeta
  provinceFilters: ProvinceFilters
  packages: Package[]
  currentPackage: Package | null
  packageStats: PackageStats | null
  packagePagination: PaginationMeta
  packageFilters: PackageFilters
  categoryPricesWithCategory: CategoryPriceWithCategory[]
  priceHistory: PriceHistoryEntry[]
  pricingStats: PricingStats | null
  pricingPagination: PaginationMeta
  pricingFilters: PricingFilters
  loading: boolean
  saving: boolean
  error: string | null
}

export const useCatalogStore = defineStore('catalog', {
  state: (): CatalogState => ({
    categories: [],
    currentCategory: null,
    categoryStats: null,
    categoryPagination: { current_page: 1, last_page: 1, per_page: 10, total: 0 },
    categoryFilters: { search: '', is_active: '', sort_by: 'sort_order', sort_order: 'asc', page: 1, per_page: 20 },
    categoryPrices: [],
    provinces: [],
    currentProvince: null,
    provinceStats: null,
    provincePagination: { current_page: 1, last_page: 1, per_page: 20, total: 0 },
    provinceFilters: { search: '', region: '', is_active: '', sort_by: 'region', sort_order: 'asc', page: 1, per_page: 20 },
    packages: [],
    currentPackage: null,
    packageStats: null,
    packagePagination: { current_page: 1, last_page: 1, per_page: 10, total: 0 },
    packageFilters: { search: '', category_id: '', is_active: '', sort_by: 'sort_order', sort_order: 'asc', page: 1, per_page: 20 },
    categoryPricesWithCategory: [],
    priceHistory: [],
    pricingStats: null,
    pricingPagination: { current_page: 1, last_page: 1, per_page: 20, total: 0 },
    pricingFilters: { search: '', category_id: '', page: 1, per_page: 20 },
    loading: false,
    saving: false,
    error: null
  }),

  getters: {
    hasCategories: (state): boolean => state.categories.length > 0,
    activeCategories: (state): Category[] => state.categories.filter(c => c.is_active),
    inactiveCategories: (state): Category[] => state.categories.filter(c => !c.is_active),
    categoriesForSelect: (state): { label: string; value: number }[] =>
      state.categories.filter(c => c.is_active).map(c => ({ label: c.name, value: c.id })),
    hasProvinces: (state): boolean => state.provinces.length > 0,
    activeProvinces: (state): Province[] => state.provinces.filter(p => p.is_active),
    provincesForSelect: (state): { label: string; value: number; code: string }[] =>
      state.provinces.filter(p => p.is_active).map(p => ({ label: `${p.name} (${p.code})`, value: p.id, code: p.code })),
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
    hasPackages: (state): boolean => state.packages.length > 0,
    activePackages: (state): Package[] => state.packages.filter(p => p.is_active),
    packagesWithCategories: (state): Package[] => state.packages.filter(p => p.category_ids.length > 0),
    packagesAllCategories: (state): Package[] => state.packages.filter(p => p.category_ids.length === 0),
    hasCategoryActiveFilters: (state): boolean => {
      return !!(state.categoryFilters.search || state.categoryFilters.is_active !== '')
    },
    hasProvinceActiveFilters: (state): boolean => {
      return !!(state.provinceFilters.search || state.provinceFilters.region || state.provinceFilters.is_active !== '')
    },
    hasPackageActiveFilters: (state): boolean => {
      return !!(state.packageFilters.search || state.packageFilters.category_id || state.packageFilters.is_active !== '')
    },
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
    // CATEGORIES
    async fetchCategories() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null
      try {
        const client = useTypedApi()
        const queryParams: Record<string, string> = {}
        if (this.categoryFilters.search) queryParams.search = this.categoryFilters.search
        if (this.categoryFilters.is_active !== '') queryParams.is_active = String(this.categoryFilters.is_active)
        queryParams.sort_by = this.categoryFilters.sort_by || 'sort_order'
        queryParams.sort_order = this.categoryFilters.sort_order || 'asc'
        queryParams.page = String(this.categoryFilters.page || 1)
        queryParams.per_page = String(this.categoryFilters.per_page || 20)
        const { data, error } = await client.GET('/admin/categories', { params: { query: queryParams as any } })
        if (error) throw error
        this.categories = (data as any).data
        this.categoryPagination = (data as any).meta
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
      } finally { this.loading = false }
    },

    async fetchAllCategories() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null
      try {
        const client = useTypedApi()
        const { data, error } = await client.GET('/admin/categories', { params: { query: { per_page: '999' } as any } })
        if (error) throw error
        this.categories = (data as any).data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
      } finally { this.loading = false }
    },

    async fetchCategory(id: number) {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null
      try {
        const client = useTypedApi()
        const { data, error } = await client.GET('/admin/categories/{category}', { params: { path: { category: id } } })
        if (error) throw error
        this.currentCategory = (data as any).data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
      } finally { this.loading = false }
    },

    async createCategory(data: CategoryCreateForm): Promise<Category | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null
      try {
        const client = useTypedApi()
        const { data: responseData, error } = await client.POST('/admin/categories', { body: data as any })
        if (error) throw error
        const created = (responseData as any).data
        this.categories.push(created)
        this.categoryPagination.total++
        return created
      } catch (error: any) {
        this.error = error.message || t('common.errors.createError')
        return null
      } finally { this.saving = false }
    },

    async updateCategory(id: number, data: CategoryUpdateForm): Promise<Category | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null
      try {
        const client = useTypedApi()
        const { data: responseData, error } = await client.PUT('/admin/categories/{category}', { params: { path: { category: id } }, body: data as any })
        if (error) throw error
        const updated = (responseData as any).data
        const index = this.categories.findIndex(c => c.id === id)
        if (index !== -1) this.categories[index] = updated
        if (this.currentCategory?.id === id) this.currentCategory = updated
        return updated
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
        return null
      } finally { this.saving = false }
    },

    async deleteCategory(id: number): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null
      try {
        const client = useTypedApi()
        const { error } = await client.DELETE('/admin/categories/{category}', { params: { path: { category: id } } })
        if (error) throw error
        this.categories = this.categories.filter(c => c.id !== id)
        this.categoryPagination.total--
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.deleteError')
        return false
      } finally { this.saving = false }
    },

    async toggleCategoryActive(id: number): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: Category }>(`${config.public.apiBase}/admin/categories/${id}/toggle-active`, { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}`, Accept: 'application/json' } })
        const index = this.categories.findIndex(c => c.id === id)
        if (index !== -1) this.categories[index] = response.data
        if (this.currentCategory?.id === id) this.currentCategory = response.data
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.toggleStatusError')
        return false
      } finally { this.saving = false }
    },

    async fetchCategoryStats() {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: CategoryStats }>(`${config.public.apiBase}/admin/categories/stats`, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}`, Accept: 'application/json' } })
        this.categoryStats = response.data
      } catch (error: any) { console.error('fetchCategoryStats error:', error) }
    },

    setCategoryFilters(filters: Partial<CategoryFilters>) { this.categoryFilters = { ...this.categoryFilters, ...filters, page: 1 } },
    resetCategoryFilters() { this.categoryFilters = { search: '', is_active: '', sort_by: 'sort_order', sort_order: 'asc', page: 1, per_page: 20 } },

    // PROVINCES
    async fetchProvinces() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null
      try {
        const client = useTypedApi()
        const queryParams: Record<string, string> = {}
        if (this.provinceFilters.search) queryParams.search = this.provinceFilters.search
        if (this.provinceFilters.region) queryParams.region = this.provinceFilters.region
        if (this.provinceFilters.is_active !== '') queryParams.is_active = String(this.provinceFilters.is_active)
        queryParams.sort_by = this.provinceFilters.sort_by || 'region'
        queryParams.sort_order = this.provinceFilters.sort_order || 'asc'
        queryParams.page = String(this.provinceFilters.page || 1)
        queryParams.per_page = String(this.provinceFilters.per_page || 20)
        const { data, error } = await client.GET('/admin/provinces', { params: { query: queryParams as any } })
        if (error) throw error
        this.provinces = (data as any).data
        this.provincePagination = (data as any).meta
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
      } finally { this.loading = false }
    },

    async fetchAllProvinces() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null
      try {
        const client = useTypedApi()
        const { data, error } = await client.GET('/admin/provinces', { params: { query: { per_page: '999' } as any } })
        if (error) throw error
        this.provinces = (data as any).data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
      } finally { this.loading = false }
    },

    async toggleProvinceActive(id: number): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: Province }>(`${config.public.apiBase}/admin/provinces/${id}/toggle-active`, { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}`, Accept: 'application/json' } })
        const index = this.provinces.findIndex(p => p.id === id)
        if (index !== -1) this.provinces[index] = response.data
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.toggleStatusError')
        return false
      } finally { this.saving = false }
    },

    async fetchProvinceStats() {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: ProvinceStats }>(`${config.public.apiBase}/admin/provinces/stats`, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}`, Accept: 'application/json' } })
        this.provinceStats = response.data
      } catch (error: any) { console.error('fetchProvinceStats error:', error) }
    },

    setProvinceFilters(filters: Partial<ProvinceFilters>) { this.provinceFilters = { ...this.provinceFilters, ...filters, page: 1 } },
    resetProvinceFilters() { this.provinceFilters = { search: '', region: '', is_active: '', sort_by: 'region', sort_order: 'asc', page: 1, per_page: 20 } },

    // PACKAGES
    async fetchPackages() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null
      try {
        const client = useTypedApi()
        const queryParams: Record<string, string> = {}
        if (this.packageFilters.search) queryParams.search = this.packageFilters.search
        if (this.packageFilters.category_id) queryParams.category_id = String(this.packageFilters.category_id)
        if (this.packageFilters.is_active !== '') queryParams.is_active = String(this.packageFilters.is_active)
        queryParams.sort_by = this.packageFilters.sort_by || 'sort_order'
        queryParams.sort_order = this.packageFilters.sort_order || 'asc'
        queryParams.page = String(this.packageFilters.page || 1)
        queryParams.per_page = String(this.packageFilters.per_page || 20)
        const { data, error } = await client.GET('/admin/packages', { params: { query: queryParams as any } })
        if (error) throw error
        this.packages = (data as any).data
        this.packagePagination = (data as any).meta
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
      } finally { this.loading = false }
    },

    async fetchPackage(id: number) {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null
      try {
        const client = useTypedApi()
        const { data, error } = await client.GET('/admin/packages/{package}', { params: { path: { 'package': id } } })
        if (error) throw error
        this.currentPackage = (data as any).data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
      } finally { this.loading = false }
    },

    async createPackage(data: PackageCreateForm): Promise<Package | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null
      try {
        const client = useTypedApi()
        const { data: responseData, error } = await client.POST('/admin/packages', { body: data as any })
        if (error) throw error
        const created = (responseData as any).data
        this.packages.push(created)
        this.packagePagination.total++
        return created
      } catch (error: any) {
        this.error = error.message || t('common.errors.createError')
        return null
      } finally { this.saving = false }
    },

    async updatePackage(id: number, data: PackageUpdateForm): Promise<Package | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null
      try {
        const client = useTypedApi()
        const { data: responseData, error } = await client.PUT('/admin/packages/{package}', { params: { path: { 'package': id } }, body: data as any })
        if (error) throw error
        const updated = (responseData as any).data
        const index = this.packages.findIndex(p => p.id === id)
        if (index !== -1) this.packages[index] = updated
        if (this.currentPackage?.id === id) this.currentPackage = updated
        return updated
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
        return null
      } finally { this.saving = false }
    },

    async deletePackage(id: number): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null
      try {
        const client = useTypedApi()
        const { error } = await client.DELETE('/admin/packages/{package}', { params: { path: { 'package': id } } })
        if (error) throw error
        this.packages = this.packages.filter(p => p.id !== id)
        this.packagePagination.total--
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.deleteError')
        return false
      } finally { this.saving = false }
    },

    async togglePackageActive(id: number): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: Package }>(`${config.public.apiBase}/admin/packages/${id}/toggle-active`, { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}`, Accept: 'application/json' } })
        const index = this.packages.findIndex(p => p.id === id)
        if (index !== -1) this.packages[index] = response.data
        if (this.currentPackage?.id === id) this.currentPackage = response.data
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.toggleStatusError')
        return false
      } finally { this.saving = false }
    },

    async fetchPackageStats() {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: PackageStats }>(`${config.public.apiBase}/admin/packages/stats`, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}`, Accept: 'application/json' } })
        this.packageStats = response.data
      } catch (error: any) { console.error('fetchPackageStats error:', error) }
    },

    setPackageFilters(filters: Partial<PackageFilters>) { this.packageFilters = { ...this.packageFilters, ...filters, page: 1 } },
    resetPackageFilters() { this.packageFilters = { search: '', category_id: '', is_active: '', sort_by: 'sort_order', sort_order: 'asc', page: 1, per_page: 20 } },

    // PRICING (all NOT in spec)
    async fetchCategoryPrices() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null
      try {
        const config = useRuntimeConfig()
        const params = new URLSearchParams()
        if (this.pricingFilters.search) params.append('search', this.pricingFilters.search)
        if (this.pricingFilters.category_id) params.append('category_id', String(this.pricingFilters.category_id))
        params.append('page', String(this.pricingFilters.page || 1))
        params.append('per_page', String(this.pricingFilters.per_page || 20))
        const response = await $fetch<{ data: CategoryPriceWithCategory[]; meta: PaginationMeta }>(`${config.public.apiBase}/admin/pricing?${params.toString()}`, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}`, Accept: 'application/json' } })
        this.categoryPricesWithCategory = response.data
        this.pricingPagination = response.meta
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
      } finally { this.loading = false }
    },

    async fetchPriceForCategory(categoryId: number): Promise<CategoryPrice | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: CategoryPrice }>(`${config.public.apiBase}/admin/pricing/${categoryId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}`, Accept: 'application/json' } })
        return response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        return null
      } finally { this.loading = false }
    },

    async updateCategoryPrice(categoryId: number, data: CategoryPriceForm): Promise<CategoryPrice | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: CategoryPrice }>(`${config.public.apiBase}/admin/pricing/${categoryId}`, { method: 'PUT', headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}`, Accept: 'application/json', 'Content-Type': 'application/json' }, body: data })
        const index = this.categoryPricesWithCategory.findIndex(p => p.category_id === categoryId)
        if (index !== -1) this.categoryPricesWithCategory[index] = { ...this.categoryPricesWithCategory[index], ...response.data }
        return response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
        return null
      } finally { this.saving = false }
    },

    async fetchPriceHistory(categoryId?: number) {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null
      try {
        const config = useRuntimeConfig()
        const params = categoryId ? `?category_id=${categoryId}` : ''
        const response = await $fetch<{ data: PriceHistoryEntry[] }>(`${config.public.apiBase}/admin/pricing/history${params}`, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}`, Accept: 'application/json' } })
        this.priceHistory = response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
      } finally { this.loading = false }
    },

    async fetchPricingStats() {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: PricingStats }>(`${config.public.apiBase}/admin/pricing/stats`, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}`, Accept: 'application/json' } })
        this.pricingStats = response.data
      } catch (error: any) { console.error('fetchPricingStats error:', error) }
    },

    setPricingFilters(filters: Partial<PricingFilters>) { this.pricingFilters = { ...this.pricingFilters, ...filters, page: 1 } },
    resetPricingFilters() { this.pricingFilters = { search: '', category_id: '', page: 1, per_page: 20 } },

    // GLOBAL
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
