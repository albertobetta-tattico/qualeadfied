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

// Mock data for development
const mockClients: Client[] = [
  {
    id: 1,
    company_name: 'Azienda Alpha Srl',
    vat_number: '12345678901',
    email: 'info@alpha.it',
    phone: '02 1234567',
    contact_first_name: 'Mario',
    contact_last_name: 'Rossi',
    status: 'active',
    free_trial_enabled: true,
    free_trial_leads_total: 5,
    free_trial_leads_used: 2,
    billing_data: {
      address: 'Via Roma 1',
      city: 'Milano',
      province: 'MI',
      postal_code: '20100',
      country: 'IT',
      sdi_code: 'XXXXXXX',
      pec: 'alpha@pec.it'
    },
    bank_data: {
      iban: 'IT60X0542811101000000123456',
      bank_account_holder: 'Azienda Alpha Srl',
      bic_swift: 'BPPIITRRXXX',
      bank_name: 'Banca Popolare di Milano'
    },
    category_ids: [1, 2],
    terms_accepted: true,
    privacy_accepted: true,
    marketing_consent: true,
    notify_new_leads: true,
    email_verified_at: '2024-01-15T10:30:00Z',
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    company_name: 'Beta Solutions SpA',
    vat_number: '98765432109',
    email: 'contact@beta.it',
    phone: '06 9876543',
    contact_first_name: 'Laura',
    contact_last_name: 'Bianchi',
    status: 'active',
    free_trial_enabled: true,
    free_trial_leads_total: 3,
    free_trial_leads_used: 3,
    billing_data: {
      address: 'Via Nazionale 50',
      city: 'Roma',
      province: 'RM',
      postal_code: '00100',
      country: 'IT',
      sdi_code: 'YYYYYYY',
      pec: 'beta@pec.it'
    },
    bank_data: {
      iban: 'IT40S0300203280123456789012',
      bank_account_holder: 'Beta Solutions SpA',
      bic_swift: 'UNCRITM1XXX',
      bank_name: 'UniCredit'
    },
    category_ids: [1, 3, 4],
    terms_accepted: true,
    privacy_accepted: true,
    marketing_consent: false,
    notify_new_leads: true,
    email_verified_at: '2024-01-12T14:20:00Z',
    created_at: '2024-01-05T09:00:00Z',
    updated_at: '2024-01-12T14:20:00Z'
  },
  {
    id: 3,
    company_name: 'Gamma Tech Srl',
    vat_number: '11223344556',
    email: 'hello@gamma.it',
    phone: '011 5551234',
    contact_first_name: 'Paolo',
    contact_last_name: 'Verdi',
    status: 'pending',
    free_trial_enabled: true,
    free_trial_leads_total: 5,
    free_trial_leads_used: 0,
    billing_data: {
      address: 'Corso Francia 100',
      city: 'Torino',
      province: 'TO',
      postal_code: '10100',
      country: 'IT',
      sdi_code: '',
      pec: 'gamma@pec.it'
    },
    bank_data: null,
    category_ids: [2],
    terms_accepted: true,
    privacy_accepted: true,
    marketing_consent: true,
    notify_new_leads: true,
    email_verified_at: null,
    created_at: '2024-01-20T11:00:00Z',
    updated_at: '2024-01-20T11:00:00Z'
  },
  {
    id: 4,
    company_name: 'Delta Corp',
    vat_number: '55667788990',
    email: 'support@delta.it',
    phone: '081 4445566',
    contact_first_name: 'Anna',
    contact_last_name: 'Ferrari',
    status: 'suspended',
    free_trial_enabled: false,
    free_trial_leads_total: 0,
    free_trial_leads_used: 0,
    billing_data: {
      address: 'Via Partenope 10',
      city: 'Napoli',
      province: 'NA',
      postal_code: '80100',
      country: 'IT',
      sdi_code: 'ZZZZZZZ',
      pec: ''
    },
    bank_data: {
      iban: 'IT15T0306909606100000016746',
      bank_account_holder: 'Delta Corp',
      bic_swift: '',
      bank_name: 'Intesa Sanpaolo'
    },
    category_ids: [],
    terms_accepted: true,
    privacy_accepted: true,
    marketing_consent: false,
    notify_new_leads: false,
    email_verified_at: '2024-01-02T09:00:00Z',
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-02-01T15:00:00Z'
  },
  {
    id: 5,
    company_name: 'Epsilon Ltd',
    vat_number: '44332211009',
    email: 'office@epsilon.it',
    phone: '051 7778899',
    contact_first_name: 'Luca',
    contact_last_name: 'Neri',
    status: 'active',
    free_trial_enabled: true,
    free_trial_leads_total: 10,
    free_trial_leads_used: 5,
    billing_data: {
      address: 'Via Indipendenza 25',
      city: 'Bologna',
      province: 'BO',
      postal_code: '40100',
      country: 'IT',
      sdi_code: 'AAAAAAA',
      pec: 'epsilon@pec.it'
    },
    bank_data: {
      iban: 'IT28W8000000292100645211151',
      bank_account_holder: 'Epsilon Ltd',
      bic_swift: 'BPMOIT22XXX',
      bank_name: 'Banco BPM'
    },
    category_ids: [1, 2, 3],
    terms_accepted: true,
    privacy_accepted: true,
    marketing_consent: true,
    notify_new_leads: true,
    email_verified_at: '2024-01-08T16:45:00Z',
    created_at: '2024-01-07T10:00:00Z',
    updated_at: '2024-01-18T12:00:00Z'
  },
  {
    id: 6,
    company_name: 'Zeta Industries',
    vat_number: '99887766554',
    email: 'info@zeta.it',
    phone: '055 1112233',
    contact_first_name: 'Giulia',
    contact_last_name: 'Russo',
    status: 'active',
    free_trial_enabled: false,
    free_trial_leads_total: 0,
    free_trial_leads_used: 0,
    billing_data: {
      address: 'Via dei Calzaiuoli 5',
      city: 'Firenze',
      province: 'FI',
      postal_code: '50100',
      country: 'IT',
      sdi_code: 'BBBBBBB',
      pec: 'zeta@pec.it'
    },
    bank_data: null,
    category_ids: [4],
    terms_accepted: true,
    privacy_accepted: true,
    marketing_consent: false,
    notify_new_leads: true,
    email_verified_at: '2024-01-14T11:30:00Z',
    created_at: '2024-01-13T09:00:00Z',
    updated_at: '2024-01-22T10:00:00Z'
  }
]

// Flag per usare mock data (true in dev, false in prod)
const USE_MOCK_DATA = true

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
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          // Simula delay di rete
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Applica filtri ai mock data
          let filtered = [...mockClients]
          
          // Filtro ricerca
          if (this.filters.search) {
            const search = this.filters.search.toLowerCase()
            filtered = filtered.filter(c => 
              c.company_name.toLowerCase().includes(search) ||
              c.email.toLowerCase().includes(search) ||
              c.vat_number.includes(search) ||
              c.contact_first_name.toLowerCase().includes(search) ||
              c.contact_last_name.toLowerCase().includes(search)
            )
          }
          
          // Filtro stato
          if (this.filters.status) {
            filtered = filtered.filter(c => c.status === this.filters.status)
          }
          
          // Filtro prova gratuita
          if (this.filters.free_trial) {
            switch (this.filters.free_trial) {
              case 'active':
                filtered = filtered.filter(c => 
                  c.free_trial_enabled && 
                  c.free_trial_leads_used < c.free_trial_leads_total
                )
                break
              case 'inactive':
                filtered = filtered.filter(c => !c.free_trial_enabled)
                break
              case 'exhausted':
                filtered = filtered.filter(c => 
                  c.free_trial_enabled && 
                  c.free_trial_leads_used >= c.free_trial_leads_total
                )
                break
            }
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
          
          this.clients = filtered.slice(start, end)
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
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchClients error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Carica singolo cliente
     */
    async fetchClient(id: number) {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          const client = mockClients.find(c => c.id === id)
          this.currentClient = client || null
          if (!client) {
            this.error = t('common.errors.notFound')
          }
          return
        }

        const { api } = useApi()
        const response = await api<{ data: Client }>(`/admin/users/${id}`)
        this.currentClient = response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchClient error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Crea nuovo cliente
     */
    async createClient(data: ClientCreateForm): Promise<Client | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const newClient: Client = {
            id: Math.max(...mockClients.map(c => c.id)) + 1,
            company_name: data.company_name,
            vat_number: data.vat_number,
            email: data.email,
            phone: data.phone,
            contact_first_name: data.contact_first_name,
            contact_last_name: data.contact_last_name,
            status: data.status,
            free_trial_enabled: data.free_trial_enabled,
            free_trial_leads_total: data.free_trial_leads_total,
            free_trial_leads_used: 0,
            billing_data: data.billing_data,
            bank_data: data.bank_data || null,
            category_ids: data.category_ids || [],
            terms_accepted: true,
            privacy_accepted: true,
            marketing_consent: false,
            notify_new_leads: data.notify_new_leads,
            email_verified_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          mockClients.push(newClient)
          this.clients.unshift(newClient)
          this.pagination.total++
          return newClient
        }
        
        const { api } = useApi()
        const response = await api<{ data: Client }>('/admin/users', {
          method: 'POST',
          body: data
        })
        
        this.clients.unshift(response.data)
        this.pagination.total++
        
        return response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.createError')
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
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const index = mockClients.findIndex(c => c.id === id)
          if (index !== -1) {
            const updated = {
              ...mockClients[index],
              ...data,
              updated_at: new Date().toISOString()
            }
            mockClients[index] = updated
            
            const listIndex = this.clients.findIndex(c => c.id === id)
            if (listIndex !== -1) {
              this.clients[listIndex] = updated
            }
            
            if (this.currentClient?.id === id) {
              this.currentClient = updated
            }
            
            return updated
          }
          this.error = t('common.errors.notFound')
          return null
        }

        const { api } = useApi()
        const response = await api<{ data: Client }>(`/admin/users/${id}`, {
          method: 'PUT',
          body: data
        })

        const index = this.clients.findIndex(c => c.id === id)
        if (index !== -1) {
          this.clients[index] = response.data
        }

        if (this.currentClient?.id === id) {
          this.currentClient = response.data
        }

        return response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
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
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const index = mockClients.findIndex(c => c.id === id)
          if (index !== -1) {
            mockClients.splice(index, 1)
            this.clients = this.clients.filter(c => c.id !== id)
            this.pagination.total--
            return true
          }
          this.error = t('common.errors.notFound')
          return false
        }

        const { api } = useApi()
        await api(`/admin/users/${id}`, { method: 'DELETE' })

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

    /**
     * Sospendi cliente
     */
    async suspendClient(id: number): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          const index = mockClients.findIndex(c => c.id === id)
          if (index !== -1) {
            mockClients[index].status = 'suspended'
            mockClients[index].updated_at = new Date().toISOString()
            
            const listIndex = this.clients.findIndex(c => c.id === id)
            if (listIndex !== -1) {
              this.clients[listIndex] = { ...mockClients[index] }
            }
            
            if (this.currentClient?.id === id) {
              this.currentClient = { ...mockClients[index] }
            }
            
            return true
          }
          return false
        }
        
        const { api } = useApi()
        const response = await api<{ data: Client }>(`/admin/users/${id}/suspend`, {
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
        this.error = error.message || t('common.errors.updateError')
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
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null
      
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          const index = mockClients.findIndex(c => c.id === id)
          if (index !== -1) {
            mockClients[index].status = 'active'
            mockClients[index].updated_at = new Date().toISOString()
            
            const listIndex = this.clients.findIndex(c => c.id === id)
            if (listIndex !== -1) {
              this.clients[listIndex] = { ...mockClients[index] }
            }
            
            if (this.currentClient?.id === id) {
              this.currentClient = { ...mockClients[index] }
            }
            
            return true
          }
          return false
        }
        
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
        this.error = error.message || t('common.errors.updateError')
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
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null
      
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          return true
        }
        
        const { api } = useApi()
        await api(`/admin/users/${id}/reset-password`, { method: 'POST' })
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.genericError')
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
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null
      
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          const index = mockClients.findIndex(c => c.id === id)
          if (index !== -1) {
            mockClients[index].free_trial_enabled = config.enabled
            mockClients[index].free_trial_leads_total = config.leads_total
            mockClients[index].updated_at = new Date().toISOString()
            
            const listIndex = this.clients.findIndex(c => c.id === id)
            if (listIndex !== -1) {
              this.clients[listIndex] = { ...mockClients[index] }
            }
            
            if (this.currentClient?.id === id) {
              this.currentClient = { ...mockClients[index] }
            }
            
            return true
          }
          return false
        }
        
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
        this.error = error.message || t('common.errors.updateError')
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
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          this.stats = {
            total: mockClients.length,
            active: mockClients.filter(c => c.status === 'active').length,
            pending: mockClients.filter(c => c.status === 'pending').length,
            suspended: mockClients.filter(c => c.status === 'suspended').length,
            with_free_trial: mockClients.filter(c => c.free_trial_enabled).length,
            free_trial_leads_used: mockClients.reduce((acc, c) => acc + c.free_trial_leads_used, 0),
            free_trial_leads_remaining: mockClients.reduce((acc, c) => 
              acc + (c.free_trial_leads_total - c.free_trial_leads_used), 0)
          }
          return
        }
        
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
