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
    /**
     * Carica lista clienti con filtri e paginazione
     */
    async fetchClients() {
      this.loading = true
      this.error = null
      
      try {
        const { api } = useApi()
        const params = new URLSearchParams()
        
        // Aggiungi filtri
        if (this.filters.search) params.append('search', this.filters.search)
        if (this.filters.status) params.append('status', this.filters.status)
        if (this.filters.free_trial) params.append('free_trial', this.filters.free_trial)
        if (this.filters.date_from) params.append('date_from', this.filters.date_from)
        if (this.filters.date_to) params.append('date_to', this.filters.date_to)
        if (this.filters.sort_by) params.append('sort_by', this.filters.sort_by)
        if (this.filters.sort_order) params.append('sort_order', this.filters.sort_order)
        params.append('page', String(this.filters.page || 1))
        params.append('per_page', String(this.filters.per_page || 10))
        
        const response = await api<{ data: Client[], meta: PaginationMeta }>(
          `/admin/users?${params.toString()}`
        )
        
        this.clients = response.data
        this.pagination = response.meta
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento clienti'
        console.error('fetchClients error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Carica singolo cliente
     */
    async fetchClient(id: number) {
      this.loading = true
      this.error = null
      
      try {
        const { api } = useApi()
        const response = await api<{ data: Client }>(`/admin/users/${id}`)
        this.currentClient = response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento cliente'
        console.error('fetchClient error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Crea nuovo cliente
     */
    async createClient(data: ClientCreateForm): Promise<Client | null> {
      this.saving = true
      this.error = null
      
      try {
        const { api } = useApi()
        const response = await api<{ data: Client }>('/admin/users', {
          method: 'POST',
          body: data
        })
        
        // Aggiungi alla lista locale
        this.clients.unshift(response.data)
        this.pagination.total++
        
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nella creazione cliente'
        console.error('createClient error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    /**
     * Aggiorna cliente
     */
    async updateClient(id: number, data: ClientUpdateForm): Promise<Client | null> {
      this.saving = true
      this.error = null
      
      try {
        const { api } = useApi()
        const response = await api<{ data: Client }>(`/admin/users/${id}`, {
          method: 'PUT',
          body: data
        })
        
        // Aggiorna nella lista locale
        const index = this.clients.findIndex(c => c.id === id)
        if (index !== -1) {
          this.clients[index] = response.data
        }
        
        // Aggiorna currentClient se è lo stesso
        if (this.currentClient?.id === id) {
          this.currentClient = response.data
        }
        
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nell\'aggiornamento cliente'
        console.error('updateClient error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    /**
     * Elimina cliente
     */
    async deleteClient(id: number): Promise<boolean> {
      this.saving = true
      this.error = null
      
      try {
        const { api } = useApi()
        await api(`/admin/users/${id}`, { method: 'DELETE' })
        
        // Rimuovi dalla lista locale
        this.clients = this.clients.filter(c => c.id !== id)
        this.pagination.total--
        
        return true
      } catch (error: any) {
        this.error = error.message || 'Errore nell\'eliminazione cliente'
        console.error('deleteClient error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Sospendi cliente
     */
    async suspendClient(id: number): Promise<boolean> {
      this.saving = true
      this.error = null
      
      try {
        const { api } = useApi()
        const response = await api<{ data: Client }>(`/admin/users/${id}/suspend`, {
          method: 'POST'
        })
        
        // Aggiorna nella lista locale
        const index = this.clients.findIndex(c => c.id === id)
        if (index !== -1) {
          this.clients[index] = response.data
        }
        
        if (this.currentClient?.id === id) {
          this.currentClient = response.data
        }
        
        return true
      } catch (error: any) {
        this.error = error.message || 'Errore nella sospensione cliente'
        console.error('suspendClient error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Riattiva cliente
     */
    async activateClient(id: number): Promise<boolean> {
      this.saving = true
      this.error = null
      
      try {
        const { api } = useApi()
        const response = await api<{ data: Client }>(`/admin/users/${id}/activate`, {
          method: 'POST'
        })
        
        const index = this.clients.findIndex(c => c.id === id)
        if (index !== -1) {
          this.clients[index] = response.data
        }
        
        if (this.currentClient?.id === id) {
          this.currentClient = response.data
        }
        
        return true
      } catch (error: any) {
        this.error = error.message || 'Errore nell\'attivazione cliente'
        console.error('activateClient error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Reset password cliente
     */
    async resetPassword(id: number): Promise<boolean> {
      this.saving = true
      this.error = null
      
      try {
        const { api } = useApi()
        await api(`/admin/users/${id}/reset-password`, { method: 'POST' })
        return true
      } catch (error: any) {
        this.error = error.message || 'Errore nel reset password'
        console.error('resetPassword error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Aggiorna configurazione prova gratuita
     */
    async updateFreeTrial(id: number, config: FreeTrialConfig): Promise<boolean> {
      this.saving = true
      this.error = null
      
      try {
        const { api } = useApi()
        const response = await api<{ data: Client }>(`/admin/users/${id}/free-trial`, {
          method: 'PUT',
          body: {
            enabled: config.enabled,
            leads_total: config.leads_total
          }
        })
        
        const index = this.clients.findIndex(c => c.id === id)
        if (index !== -1) {
          this.clients[index] = response.data
        }
        
        if (this.currentClient?.id === id) {
          this.currentClient = response.data
        }
        
        return true
      } catch (error: any) {
        this.error = error.message || 'Errore nell\'aggiornamento prova gratuita'
        console.error('updateFreeTrial error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Carica statistiche clienti
     */
    async fetchStats() {
      try {
        const { api } = useApi()
        const response = await api<{ data: ClientStats }>('/admin/users/stats')
        this.stats = response.data
      } catch (error: any) {
        console.error('fetchStats error:', error)
      }
    },

    /**
     * Imposta filtri
     */
    setFilters(filters: Partial<ClientFilters>) {
      this.filters = { ...this.filters, ...filters, page: 1 }
    },

    /**
     * Reset filtri
     */
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

    /**
     * Pulisci stato
     */
    clearState() {
      this.clients = []
      this.currentClient = null
      this.stats = null
      this.error = null
    }
  }
})
