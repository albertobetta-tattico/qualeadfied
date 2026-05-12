/**
 * Store - Public Catalog
 * Pinia store for public lead catalog (anonymized)
 */
import { defineStore } from 'pinia'
import type { components } from '~/types/api.generated'
import type {
  PublicCatalogFilters,
  HomepageContent,
  PaginationMeta
} from '~/types/publicCatalog'

type Category = components['schemas']['Category']
type Province = components['schemas']['Province']

interface PublicCatalogState {
  leads: Array<{
    id: number
    category: Category
    province: Province
    request_preview: string
    generated_at: string
    status: components['schemas']['LeadStatus']
    current_shares: number
    base_price?: number
    category_id?: number
    province_id?: number
  }>
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
    async fetchCategories(): Promise<void> {
      try {
        const client = useTypedApi()
        const { data, error } = await client.GET('/public/categories')
        if (error) throw error
        this.categories = data.categories
      } catch (e: any) {
        console.error('Error fetching categories:', e)
      }
    },

    async fetchProvinces(): Promise<void> {
      try {
        const client = useTypedApi()
        const { data, error } = await client.GET('/public/provinces')
        if (error) throw error
        this.provinces = data.provinces
      } catch (e: any) {
        console.error('Error fetching provinces:', e)
      }
    },

    async fetchLeads(): Promise<void> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()
        const query: Record<string, string | number> = {}
        if (this.filters.category_id !== '' && this.filters.category_id != null) {
          query.category_id = Number(this.filters.category_id)
        }
        if (this.filters.province_id !== '' && this.filters.province_id != null) {
          query.province_id = Number(this.filters.province_id)
        }
        if (this.filters.availability) {
          query.availability = this.filters.availability
        }
        if (this.filters.date_from) {
          query.date_from = this.filters.date_from
        }
        if (this.filters.date_to) {
          query.date_to = this.filters.date_to
        }
        if (this.filters.sort_by) {
          query.sort_by = this.filters.sort_by
        }
        if (this.filters.sort_order) {
          query.sort_order = this.filters.sort_order
        }
        if (this.filters.page && this.filters.page > 1) {
          query.page = this.filters.page
        }
        if (this.filters.per_page) {
          query.per_page = this.filters.per_page
        }

        const { data, error } = await client.GET('/public/leads', {
          params: { query: query as any },
        })

        if (error) throw error

        this.leads = data.data
        // API response wraps pagination inside `meta` (Laravel API Resources convention)
        const meta = (data as any).meta ?? data
        this.pagination = {
          current_page: meta.current_page ?? 1,
          last_page: meta.last_page ?? 1,
          per_page: meta.per_page ?? 15,
          total: meta.total ?? this.leads.length,
          from: meta.from ?? 1,
          to: meta.to ?? this.leads.length
        }
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.loadError')
      } finally {
        this.loading = false
      }
    },

    async fetchHomepageContent(): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const config = useRuntimeConfig()
        const data = await $fetch<HomepageContent>('/public/homepage-content', {
          baseURL: config.public.apiBase as string,
        })
        this.homepageContent = data
      } catch (e: any) {
        console.error('Error fetching homepage content:', e)
        this.homepageContent = null
      } finally {
        this.loading = false
      }
    },

    setFilters(filters: Partial<PublicCatalogFilters>): void {
      // Only reset to page 1 when the filters change. If the caller explicitly
      // passes `page` (pagination clicks), respect it.
      const hasPage = Object.prototype.hasOwnProperty.call(filters, 'page')
      this.filters = {
        ...this.filters,
        ...filters,
        page: hasPage ? (filters.page as number) : 1,
      }
    },

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

    setPage(page: number): void {
      this.filters.page = page
    },

    async initialize(): Promise<void> {
      await Promise.all([
        this.fetchCategories(),
        this.fetchProvinces()
      ])
    }
  }
})
