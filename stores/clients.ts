/**
 * Client Store - Gestione Clienti B2B
 * Qualeadfied B2B Lead Platform
 */

import { defineStore } from 'pinia'
import type {
  Client,
  ClientFilters,
  ClientStats,
  ClientCreateForm,
  ClientUpdateForm,
  FreeTrialConfig
} from '~/types/client'

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface ClientState {
  clients: Client[]
  currentClient: Client | null
  stats: ClientStats | null
  pagination: PaginationMeta
  filters: ClientFilters
  loading: boolean
  saving: boolean
  error: string | null
}

export const useClientStore = defineStore('client', {
  state: (): ClientState => ({
    clients: [],
    currentClient: null,
    stats: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    },
    filters: {
      search: '',
      status: '',
      free_trial: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      page: 1,
      per_page: 10
    },
    loading: false,
    saving: false,
    error: null
  }),

  getters: {
    hasClients: (state): boolean => state.clients.length > 0,

    activeClients: (state): Client[] =>
      state.clients.filter(c => c.status === 'active'),

    pendingClients: (state): Client[] =>
      state.clients.filter(c => c.status === 'pending'),

    suspendedClients: (state): Client[] =>
      state.clients.filter(c => c.status === 'suspended'),

    clientsWithFreeTrial: (state): Client[] =>
      state.clients.filter(c => c.free_trial_enabled),

    hasActiveFilters: (state): boolean => {
      return !!(
        state.filters.search ||
        state.filters.status ||
        state.filters.free_trial ||
        state.filters.date_from ||
        state.filters.date_to
      )
    },

    freeTrialLeadsRemaining: (state): number => {
      if (!state.currentClient) return 0
      return state.currentClient.free_trial_leads_total - state.currentClient.free_trial_leads_used
    }
  },

  actions: {
    async fetchClients() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()

        const queryParams: Record<string, string | number> = {}
        if (this.filters.search) queryParams.search = this.filters.search
        if (this.filters.status) queryParams.status = this.filters.status
        if (this.filters.free_trial) queryParams.free_trial = this.filters.free_trial
        if (this.filters.date_from) queryParams.date_from = this.filters.date_from
        if (this.filters.date_to) queryParams.date_to = this.filters.date_to
        if (this.filters.sort_by) queryParams.sort_by = this.filters.sort_by
        if (this.filters.sort_order) queryParams.sort_order = this.filters.sort_order
        queryParams.page = this.filters.page || 1
        queryParams.per_page = this.filters.per_page || 10

        const { data, error } = await client.GET('/admin/users', {
          params: { query: queryParams as any }
        })
        if (error) throw error

        // Transform User+clientProfile into flat Client objects
        this.clients = ((data as any).data || []).map((user: any) => this._transformUserToClient(user))
        this.pagination = (data as any).meta
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchClients error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchClient(id: number) {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()
        const { data, error } = await client.GET('/admin/users/{user}', {
          params: { path: { user: id } }
        })
        if (error) throw error

        this.currentClient = this._transformUserToClient((data as any).data)
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchClient error:', error)
      } finally {
        this.loading = false
      }
    },

    async createClient(data: ClientCreateForm): Promise<Client | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const responseData = await $fetch<{ data: Client }>(`${config.public.apiBase}/admin/users`, {
          method: 'POST',
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
            Accept: 'application/json'
          }
        })

        const newClient = responseData.data
        this.clients.unshift(newClient)
        this.pagination.total++

        return newClient
      } catch (error: any) {
        this.error = error.message || t('common.errors.createError')
        console.error('createClient error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    async updateClient(id: number, data: ClientUpdateForm): Promise<Client | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const client = useTypedApi()
        const { data: responseData, error } = await client.PUT('/admin/users/{user}', {
          params: { path: { user: id } },
          body: data as any
        })
        if (error) throw error

        const updated = (responseData as any).data

        const index = this.clients.findIndex(c => c.id === id)
        if (index !== -1) {
          this.clients[index] = updated
        }

        if (this.currentClient?.id === id) {
          this.currentClient = updated
        }

        return updated
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
        console.error('updateClient error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    async deleteClient(id: number): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const client = useTypedApi()
        const { error } = await client.DELETE('/admin/users/{user}', {
          params: { path: { user: id } }
        })
        if (error) throw error

        this.clients = this.clients.filter(c => c.id !== id)
        this.pagination.total--

        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.deleteError')
        console.error('deleteClient error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    async suspendClient(id: number): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: Client }>(`${config.public.apiBase}/admin/users/${id}/suspend`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
            Accept: 'application/json'
          }
        })

        const index = this.clients.findIndex(c => c.id === id)
        if (index !== -1) this.clients[index] = response.data
        if (this.currentClient?.id === id) this.currentClient = response.data

        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
        console.error('suspendClient error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    async activateClient(id: number): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: Client }>(`${config.public.apiBase}/admin/users/${id}/activate`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
            Accept: 'application/json'
          }
        })

        const index = this.clients.findIndex(c => c.id === id)
        if (index !== -1) this.clients[index] = response.data
        if (this.currentClient?.id === id) this.currentClient = response.data

        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
        console.error('activateClient error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    async resetPassword(id: number): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/admin/users/${id}/reset-password`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
            Accept: 'application/json'
          }
        })
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.genericError')
        console.error('resetPassword error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    async updateFreeTrial(id: number, trialConfig: FreeTrialConfig): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: Client }>(`${config.public.apiBase}/admin/users/${id}/free-trial`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
            Accept: 'application/json'
          },
          body: {
            enabled: trialConfig.enabled,
            leads_total: trialConfig.leads_total
          }
        })

        const index = this.clients.findIndex(c => c.id === id)
        if (index !== -1) this.clients[index] = response.data
        if (this.currentClient?.id === id) this.currentClient = response.data

        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
        console.error('updateFreeTrial error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    async fetchStats() {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: ClientStats }>(`${config.public.apiBase}/admin/users/stats`, {
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

    setFilters(filters: Partial<ClientFilters>) {
      this.filters = { ...this.filters, ...filters, page: 1 }
    },

    resetFilters() {
      this.filters = {
        search: '',
        status: '',
        free_trial: '',
        sort_by: 'created_at',
        sort_order: 'desc',
        page: 1,
        per_page: 10
      }
    },

    clearState() {
      this.clients = []
      this.currentClient = null
      this.stats = null
      this.error = null
    },

    /**
     * Transform backend User+clientProfile into flat Client object
     * Backend returns: { id, email, status, role, client_profile: { company_name, ... } }
     * Frontend expects: { id, company_name, email, status, ... }
     */
    _transformUserToClient(user: any): Client {
      const cp = user.client_profile || {}
      return {
        id: user.id,
        company_name: cp.company_name || user.email || '-',
        vat_number: cp.vat_number || '',
        email: user.email || '',
        phone: cp.phone || '',
        contact_first_name: cp.contact_first_name || '',
        contact_last_name: cp.contact_last_name || '',
        status: user.status || 'pending',
        free_trial_enabled: cp.free_trial_enabled || false,
        free_trial_leads_total: cp.free_trial_leads_total || 0,
        free_trial_leads_used: cp.free_trial_leads_used || 0,
        billing_data: cp.billing_data || null,
        bank_data: cp.bank_data || null,
        category_ids: cp.category_ids || [],
        terms_accepted: cp.terms_accepted || false,
        privacy_accepted: cp.privacy_accepted || false,
        marketing_consent: cp.marketing_consent || false,
        notify_new_leads: cp.notify_new_leads || false,
        email_verified_at: user.email_verified_at || null,
        created_at: user.created_at || '',
        updated_at: user.updated_at || '',
      }
    }
  }
})
