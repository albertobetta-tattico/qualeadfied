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
  categories: Category[]
  provinces: Province[]
  sources: LeadSource[]
  loading: boolean
  saving: boolean
  importing: boolean
  error: string | null
}

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
    async fetchSupportData() {
      try {
        const client = useTypedApi()
        const [categoriesRes, provincesRes, sourcesRes] = await Promise.all([
          client.GET('/admin/categories'),
          client.GET('/admin/provinces'),
          client.GET('/admin/lead-sources')
        ])

        if (categoriesRes.error) throw categoriesRes.error
        if (provincesRes.error) throw provincesRes.error
        if (sourcesRes.error) throw sourcesRes.error

        this.categories = (categoriesRes.data as any).data
        this.provinces = (provincesRes.data as any).data
        this.sources = (sourcesRes.data as any).data
      } catch (error: any) {
        console.error('fetchSupportData error:', error)
      }
    },

    async fetchLeads() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()

        const query: Record<string, string> = {}
        if (this.filters.search) query.search = this.filters.search
        if (this.filters.category_id) query.category_id = String(this.filters.category_id)
        if (this.filters.province_id) query.province_id = String(this.filters.province_id)
        if (this.filters.source_id) query.source_id = String(this.filters.source_id)
        if (this.filters.status) query.status = this.filters.status
        if (this.filters.generated_from) query.generated_from = this.filters.generated_from
        if (this.filters.generated_to) query.generated_to = this.filters.generated_to
        if (this.filters.sort_by) query.sort_by = this.filters.sort_by
        if (this.filters.sort_order) query.sort_order = this.filters.sort_order
        query.page = String(this.filters.page || 1)
        query.per_page = String(this.filters.per_page || 10)

        const { data, error } = await client.GET('/admin/leads', {
          params: { query }
        })

        if (error) throw error

        this.leads = (data as any).data
        this.pagination = (data as any).meta
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchLeads error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchLead(id: number) {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()
        const { data, error } = await client.GET('/admin/leads/{lead}', {
          params: { path: { lead: id } }
        })

        if (error) throw error

        this.currentLead = (data as any).data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchLead error:', error)
      } finally {
        this.loading = false
      }
    },

    async createLead(data: LeadCreateForm): Promise<Lead | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const client = useTypedApi()
        const { data: responseData, error } = await client.POST('/admin/leads', {
          body: data as any
        })

        if (error) throw error

        const newLead = (responseData as any).data
        this.leads.unshift(newLead)
        this.pagination.total++

        return newLead
      } catch (error: any) {
        this.error = error.message || t('common.errors.createError')
        console.error('createLead error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    async updateLead(id: number, data: LeadUpdateForm): Promise<Lead | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const client = useTypedApi()
        const { data: responseData, error } = await client.PUT('/admin/leads/{lead}', {
          params: { path: { lead: id } },
          body: data as any
        })

        if (error) throw error

        const updatedLead = (responseData as any).data

        const index = this.leads.findIndex(l => l.id === id)
        if (index !== -1) this.leads[index] = updatedLead
        if (this.currentLead?.id === id) this.currentLead = updatedLead

        return updatedLead
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
        console.error('updateLead error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    async deleteLead(id: number): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const lead = this.leads.find(l => l.id === id)
        if (lead && lead.status !== 'free') {
          this.error = t('common.errors.genericError')
          return false
        }

        const client = useTypedApi()
        const { error } = await client.DELETE('/admin/leads/{lead}', {
          params: { path: { lead: id } }
        })

        if (error) throw error

        this.leads = this.leads.filter(l => l.id !== id)
        this.pagination.total--

        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.deleteError')
        console.error('deleteLead error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    async deleteLeads(ids: number[]): Promise<{ success: number; failed: number }> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      let success = 0
      let failed = 0

      try {
        const client = useTypedApi()

        for (const id of ids) {
          const lead = this.leads.find(l => l.id === id)
          if (lead && lead.status !== 'free') {
            failed++
            continue
          }

          try {
            const { error } = await client.DELETE('/admin/leads/{lead}', {
              params: { path: { lead: id } }
            })
            if (error) throw error
            success++
          } catch {
            failed++
          }
        }

        this.leads = this.leads.filter(l => !ids.includes(l.id) || l.status !== 'free')
        this.pagination.total -= success

        return { success, failed }
      } catch (error: any) {
        this.error = error.message || t('common.errors.deleteError')
        return { success, failed }
      } finally {
        this.saving = false
      }
    },

    async importLeads(importConfig: LeadImportConfig): Promise<LeadImportResult | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.importing = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const formData = new FormData()
        if (importConfig.file) formData.append('file', importConfig.file)
        if (importConfig.category_id) formData.append('category_id', String(importConfig.category_id))
        if (importConfig.source_id) formData.append('source_id', String(importConfig.source_id))
        formData.append('mapping', JSON.stringify(importConfig.mapping))
        formData.append('skip_header', importConfig.skip_header ? '1' : '0')
        formData.append('duplicate_strategy', importConfig.duplicate_strategy)

        const response = await $fetch<{ data: LeadImportResult }>(`${config.public.apiBase}/admin/leads/import`, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
            Accept: 'application/json'
          }
        })

        await this.fetchLeads()

        return response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.importError')
        console.error('importLeads error:', error)
        return null
      } finally {
        this.importing = false
      }
    },

    async fetchStats() {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: LeadStats }>(`${config.public.apiBase}/admin/leads/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
            Accept: 'application/json'
          }
        })

        this.stats = response.data
      } catch (error: any) {
        console.error('fetchStats error:', error)
      }
    },

    // LEAD SOURCES
    async fetchSources() {
      try {
        const client = useTypedApi()
        const { data, error } = await client.GET('/admin/lead-sources')
        if (error) throw error
        this.sources = (data as any).data
      } catch (error: any) {
        console.error('fetchSources error:', error)
      }
    },

    async createSource(data: LeadSourceCreateForm): Promise<LeadSource | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const client = useTypedApi()
        const { data: responseData, error } = await client.POST('/admin/lead-sources', {
          body: data as any
        })
        if (error) throw error

        const newSource = (responseData as any).data
        return newSource
      } catch (error: any) {
        this.error = error.message || t('common.errors.createError')
        return null
      } finally {
        this.saving = false
      }
    },

    async updateSource(id: number, data: LeadSourceUpdateForm): Promise<LeadSource | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const client = useTypedApi()
        const { data: responseData, error } = await client.PUT('/admin/lead-sources/{leadSource}', {
          params: { path: { leadSource: id } },
          body: data as any
        })
        if (error) throw error

        const updatedSource = (responseData as any).data
        const index = this.sources.findIndex(s => s.id === id)
        if (index !== -1) this.sources[index] = updatedSource

        return updatedSource
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
        return null
      } finally {
        this.saving = false
      }
    },

    async regenerateApiKey(id: number): Promise<string | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: { api_key: string } }>(`${config.public.apiBase}/admin/lead-sources/${id}/regenerate-key`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
            Accept: 'application/json'
          }
        })

        const index = this.sources.findIndex(s => s.id === id)
        if (index !== -1) this.sources[index].api_key = response.data.api_key

        return response.data.api_key
      } catch (error: any) {
        this.error = error.message || t('common.errors.genericError')
        return null
      } finally {
        this.saving = false
      }
    },

    async deleteSource(id: number): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const client = useTypedApi()
        const { error } = await client.DELETE('/admin/lead-sources/{leadSource}', {
          params: { path: { leadSource: id } }
        })
        if (error) throw error

        this.sources = this.sources.filter(s => s.id !== id)
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.deleteError')
        return false
      } finally {
        this.saving = false
      }
    },

    setFilters(filters: Partial<LeadFilters>) {
      this.filters = { ...this.filters, ...filters }
      if (!('page' in filters)) this.filters.page = 1
    },

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

    clearState() {
      this.leads = []
      this.currentLead = null
      this.stats = null
      this.error = null
    }
  }
})
