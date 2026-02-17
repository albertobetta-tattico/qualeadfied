/**
 * Settings Store - Gestione Impostazioni Sistema
 * Qualeadfied B2B Lead Platform
 */

import { defineStore } from 'pinia'
import type {
  SystemConfig,
  SystemConfigForm,
  SmtpConfigForm,
  EmailApiConfigForm,
  CategoryNotificationConfig,
  AdminOperator,
  AdminOperatorCreateForm,
  AdminOperatorUpdateForm,
  AdminRole,
  ActivityLog,
  ActivityLogFilters,
  FattureCloudConfig,
  FattureCloudConfigForm,
  FattureCloudTestResult
} from '~/types/settings'

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface SettingsState {
  // Configurazione sistema
  systemConfig: SystemConfig | null
  // Notifiche
  notificationConfigs: CategoryNotificationConfig[]
  // Operatori
  operators: AdminOperator[]
  currentOperator: AdminOperator | null
  // Log attività
  activityLogs: ActivityLog[]
  logsPagination: PaginationMeta
  logsFilters: ActivityLogFilters
  // Fatture in Cloud
  fattureCloudConfig: FattureCloudConfig | null
  testingConnection: boolean
  // Stati
  loading: boolean
  saving: boolean
  error: string | null
}

// Mock data
const mockSystemConfig: SystemConfig = {
  default_free_trial_leads: 3,
  default_vat_rate: 22,
  order_number_prefix: 'ORD-2024-',
  invoice_number_prefix: 'FT-2024-',
  sender_email: 'noreply@qualeadfied.com',
  sender_name: 'Qualeadfied',
  smtp_host: 'smtp.sendgrid.net',
  smtp_port: 587,
  smtp_username: 'apikey',
  smtp_encryption: 'tls',
  api_provider: 'sendgrid'
}

const mockNotificationConfigs: CategoryNotificationConfig[] = [
  { category_id: 1, category_name: 'Fotovoltaico', frequency: 'instant', enabled: true },
  { category_id: 2, category_name: 'Caldaie', frequency: 'hourly', enabled: true },
  { category_id: 3, category_name: 'Climatizzazione', frequency: 'daily', enabled: true },
  { category_id: 4, category_name: 'Infissi', frequency: 'instant', enabled: true },
  { category_id: 5, category_name: 'Ristrutturazioni', frequency: 'weekly', enabled: false },
  { category_id: 6, category_name: 'Serramenti', frequency: 'daily', enabled: true },
  { category_id: 7, category_name: 'Pompe di Calore', frequency: 'instant', enabled: true },
  { category_id: 8, category_name: 'Isolamento Termico', frequency: 'disabled', enabled: false }
]

const mockOperators: AdminOperator[] = [
  {
    id: 1,
    email: 'admin@qualeadfied.com',
    first_name: 'Super',
    last_name: 'Admin',
    role: 'super_admin',
    status: 'active',
    last_login_at: '2024-01-28T09:30:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-28T09:30:00Z'
  },
  {
    id: 2,
    email: 'marco.rossi@qualeadfied.com',
    first_name: 'Marco',
    last_name: 'Rossi',
    role: 'admin',
    status: 'active',
    last_login_at: '2024-01-27T14:20:00Z',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-27T14:20:00Z'
  },
  {
    id: 3,
    email: 'laura.bianchi@qualeadfied.com',
    first_name: 'Laura',
    last_name: 'Bianchi',
    role: 'operator',
    status: 'active',
    last_login_at: '2024-01-28T08:45:00Z',
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-28T08:45:00Z'
  },
  {
    id: 4,
    email: 'paolo.verdi@qualeadfied.com',
    first_name: 'Paolo',
    last_name: 'Verdi',
    role: 'operator',
    status: 'inactive',
    last_login_at: '2024-01-10T11:30:00Z',
    created_at: '2024-01-05T14:00:00Z',
    updated_at: '2024-01-20T16:00:00Z'
  }
]

const mockActivityLogs: ActivityLog[] = [
  {
    id: 1,
    admin_id: 1,
    admin_name: 'Super Admin',
    admin_email: 'admin@qualeadfied.com',
    type: 'config_change',
    entity: 'system',
    description: 'Modificata configurazione sistema: prefisso ordini',
    old_values: { order_number_prefix: 'ORD-2023-' },
    new_values: { order_number_prefix: 'ORD-2024-' },
    ip_address: '192.168.1.100',
    created_at: '2024-01-28T10:30:00Z'
  },
  {
    id: 2,
    admin_id: 2,
    admin_name: 'Marco Rossi',
    admin_email: 'marco.rossi@qualeadfied.com',
    type: 'create',
    entity: 'client',
    entity_id: 156,
    entity_name: 'Nuova Azienda Srl',
    description: 'Creato nuovo cliente: Nuova Azienda Srl',
    ip_address: '192.168.1.101',
    created_at: '2024-01-28T09:15:00Z'
  },
  {
    id: 3,
    admin_id: 3,
    admin_name: 'Laura Bianchi',
    admin_email: 'laura.bianchi@qualeadfied.com',
    type: 'import',
    entity: 'lead',
    description: 'Importati 45 lead da file CSV',
    ip_address: '192.168.1.102',
    created_at: '2024-01-28T08:50:00Z'
  },
  {
    id: 4,
    admin_id: 2,
    admin_name: 'Marco Rossi',
    admin_email: 'marco.rossi@qualeadfied.com',
    type: 'status_change',
    entity: 'client',
    entity_id: 145,
    entity_name: 'Vecchio Cliente SpA',
    description: 'Sospeso cliente: Vecchio Cliente SpA',
    old_values: { status: 'active' },
    new_values: { status: 'suspended' },
    ip_address: '192.168.1.101',
    created_at: '2024-01-27T16:30:00Z'
  },
  {
    id: 5,
    admin_id: 1,
    admin_name: 'Super Admin',
    admin_email: 'admin@qualeadfied.com',
    type: 'create',
    entity: 'admin',
    entity_id: 4,
    entity_name: 'Paolo Verdi',
    description: 'Creato nuovo operatore: Paolo Verdi',
    ip_address: '192.168.1.100',
    created_at: '2024-01-27T14:00:00Z'
  },
  {
    id: 6,
    admin_id: 3,
    admin_name: 'Laura Bianchi',
    admin_email: 'laura.bianchi@qualeadfied.com',
    type: 'export',
    entity: 'lead',
    description: 'Esportati 230 lead in formato Excel',
    ip_address: '192.168.1.102',
    created_at: '2024-01-27T11:20:00Z'
  },
  {
    id: 7,
    admin_id: 2,
    admin_name: 'Marco Rossi',
    admin_email: 'marco.rossi@qualeadfied.com',
    type: 'update',
    entity: 'pricing',
    entity_id: 1,
    entity_name: 'Fotovoltaico',
    description: 'Aggiornato listino: Fotovoltaico',
    old_values: { price_exclusive: 70 },
    new_values: { price_exclusive: 75 },
    ip_address: '192.168.1.101',
    created_at: '2024-01-26T15:45:00Z'
  },
  {
    id: 8,
    admin_id: 1,
    admin_name: 'Super Admin',
    admin_email: 'admin@qualeadfied.com',
    type: 'login',
    entity: 'admin',
    entity_id: 1,
    description: 'Accesso al sistema',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    created_at: '2024-01-26T09:00:00Z'
  }
]

const mockFattureCloudConfig: FattureCloudConfig = {
  enabled: false,
  access_token: '',
  company_id: null,
  company_name: '',
  auto_send_sdi: false,
  default_payment_method: 'bonifico',
  connected_at: null,
  last_sync_at: null
}

// Flag per usare mock data
const USE_MOCK_DATA = true

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    systemConfig: null,
    notificationConfigs: [],
    operators: [],
    currentOperator: null,
    activityLogs: [],
    logsPagination: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0
    },
    logsFilters: {
      search: '',
      type: '',
      entity: '',
      page: 1,
      per_page: 20
    },
    fattureCloudConfig: null,
    testingConnection: false,
    loading: false,
    saving: false,
    error: null
  }),

  getters: {
    hasSystemConfig: (state): boolean => state.systemConfig !== null,

    activeOperators: (state): AdminOperator[] =>
      state.operators.filter(op => op.status === 'active'),

    operatorsByRole: (state) => (role: AdminRole): AdminOperator[] =>
      state.operators.filter(op => op.role === role),

    enabledNotifications: (state): CategoryNotificationConfig[] =>
      state.notificationConfigs.filter(nc => nc.enabled),

    recentLogs: (state): ActivityLog[] =>
      state.activityLogs.slice(0, 10),

    hasFattureCloudConfig: (state): boolean => state.fattureCloudConfig !== null,

    isFattureCloudConnected: (state): boolean =>
      state.fattureCloudConfig !== null &&
      state.fattureCloudConfig.enabled &&
      state.fattureCloudConfig.connected_at !== null
  },

  actions: {
    /**
     * Carica configurazione sistema
     */
    async fetchSystemConfig() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          this.systemConfig = mockSystemConfig
          return
        }

        const { api } = useApi()
        const response = await api<{ data: SystemConfig }>('/admin/settings/system')
        this.systemConfig = response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchSystemConfig error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Aggiorna configurazione sistema
     */
    async updateSystemConfig(config: SystemConfigForm): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          this.systemConfig = { ...this.systemConfig, ...config } as SystemConfig
          return true
        }

        const { api } = useApi()
        const response = await api<{ data: SystemConfig }>('/admin/settings/system', {
          method: 'PUT',
          body: config
        })
        this.systemConfig = response.data
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
        console.error('updateSystemConfig error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Aggiorna configurazione SMTP
     */
    async updateSmtpConfig(config: SmtpConfigForm): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          this.systemConfig = { ...this.systemConfig, ...config } as SystemConfig
          return true
        }

        const { api } = useApi()
        await api('/admin/settings/smtp', {
          method: 'PUT',
          body: config
        })
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
        console.error('updateSmtpConfig error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Testa configurazione email
     */
    async testEmailConfig(email: string): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          return true
        }

        const { api } = useApi()
        await api('/admin/settings/test-email', {
          method: 'POST',
          body: { email }
        })
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.sendEmailError')
        console.error('testEmailConfig error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Carica configurazioni notifiche
     */
    async fetchNotificationConfigs() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          this.notificationConfigs = mockNotificationConfigs
          return
        }

        const { api } = useApi()
        const response = await api<{ data: CategoryNotificationConfig[] }>('/admin/settings/notifications')
        this.notificationConfigs = response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchNotificationConfigs error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Aggiorna configurazione notifica categoria
     */
    async updateNotificationConfig(categoryId: number, config: Partial<CategoryNotificationConfig>): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          const index = this.notificationConfigs.findIndex(nc => nc.category_id === categoryId)
          if (index !== -1) {
            this.notificationConfigs[index] = { ...this.notificationConfigs[index], ...config }
          }
          return true
        }

        const { api } = useApi()
        await api(`/admin/settings/notifications/${categoryId}`, {
          method: 'PUT',
          body: config
        })
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
        console.error('updateNotificationConfig error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Carica lista operatori
     */
    async fetchOperators() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 400))
          this.operators = mockOperators
          return
        }

        const { api } = useApi()
        const response = await api<{ data: AdminOperator[] }>('/admin/operators')
        this.operators = response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchOperators error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Carica singolo operatore
     */
    async fetchOperator(id: number) {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          this.currentOperator = mockOperators.find(op => op.id === id) || null
          return
        }

        const { api } = useApi()
        const response = await api<{ data: AdminOperator }>(`/admin/operators/${id}`)
        this.currentOperator = response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchOperator error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Crea operatore
     */
    async createOperator(data: AdminOperatorCreateForm): Promise<AdminOperator | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const newOperator: AdminOperator = {
            id: Math.max(...mockOperators.map(op => op.id)) + 1,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            role: data.role,
            status: 'active',
            last_login_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          mockOperators.push(newOperator)
          this.operators.push(newOperator)
          return newOperator
        }

        const { api } = useApi()
        const response = await api<{ data: AdminOperator }>('/admin/operators', {
          method: 'POST',
          body: data
        })
        this.operators.push(response.data)
        return response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.createError')
        console.error('createOperator error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    /**
     * Aggiorna operatore
     */
    async updateOperator(id: number, data: AdminOperatorUpdateForm): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const index = mockOperators.findIndex(op => op.id === id)
          if (index !== -1) {
            mockOperators[index] = {
              ...mockOperators[index],
              ...data,
              updated_at: new Date().toISOString()
            }
            const listIndex = this.operators.findIndex(op => op.id === id)
            if (listIndex !== -1) {
              this.operators[listIndex] = mockOperators[index]
            }
            if (this.currentOperator?.id === id) {
              this.currentOperator = mockOperators[index]
            }
          }
          return true
        }

        const { api } = useApi()
        const response = await api<{ data: AdminOperator }>(`/admin/operators/${id}`, {
          method: 'PUT',
          body: data
        })
        const index = this.operators.findIndex(op => op.id === id)
        if (index !== -1) {
          this.operators[index] = response.data
        }
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
        console.error('updateOperator error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Elimina operatore
     */
    async deleteOperator(id: number): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const index = mockOperators.findIndex(op => op.id === id)
          if (index !== -1) {
            mockOperators.splice(index, 1)
            this.operators = this.operators.filter(op => op.id !== id)
          }
          return true
        }

        const { api } = useApi()
        await api(`/admin/operators/${id}`, { method: 'DELETE' })
        this.operators = this.operators.filter(op => op.id !== id)
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.deleteError')
        console.error('deleteOperator error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Reset password operatore
     */
    async resetOperatorPassword(id: number): Promise<boolean> {
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
        await api(`/admin/operators/${id}/reset-password`, { method: 'POST' })
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.genericError')
        console.error('resetOperatorPassword error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Carica log attività
     */
    async fetchActivityLogs() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 400))

          let filtered = [...mockActivityLogs]

          // Filtro ricerca
          if (this.logsFilters.search) {
            const search = this.logsFilters.search.toLowerCase()
            filtered = filtered.filter(log =>
              log.description.toLowerCase().includes(search) ||
              log.admin_name.toLowerCase().includes(search) ||
              log.admin_email.toLowerCase().includes(search) ||
              (log.entity_name && log.entity_name.toLowerCase().includes(search))
            )
          }

          // Filtro tipo
          if (this.logsFilters.type) {
            filtered = filtered.filter(log => log.type === this.logsFilters.type)
          }

          // Filtro entità
          if (this.logsFilters.entity) {
            filtered = filtered.filter(log => log.entity === this.logsFilters.entity)
          }

          // Filtro admin
          if (this.logsFilters.admin_id) {
            filtered = filtered.filter(log => log.admin_id === this.logsFilters.admin_id)
          }

          // Paginazione
          const page = this.logsFilters.page || 1
          const perPage = this.logsFilters.per_page || 20
          const start = (page - 1) * perPage
          const end = start + perPage

          this.activityLogs = filtered.slice(start, end)
          this.logsPagination = {
            current_page: page,
            last_page: Math.ceil(filtered.length / perPage),
            per_page: perPage,
            total: filtered.length
          }
          return
        }

        const { api } = useApi()
        const params = new URLSearchParams()

        if (this.logsFilters.search) params.append('search', this.logsFilters.search)
        if (this.logsFilters.type) params.append('type', this.logsFilters.type)
        if (this.logsFilters.entity) params.append('entity', this.logsFilters.entity)
        if (this.logsFilters.admin_id) params.append('admin_id', String(this.logsFilters.admin_id))
        if (this.logsFilters.date_from) params.append('date_from', this.logsFilters.date_from)
        if (this.logsFilters.date_to) params.append('date_to', this.logsFilters.date_to)
        params.append('page', String(this.logsFilters.page || 1))
        params.append('per_page', String(this.logsFilters.per_page || 20))

        const response = await api<{ data: ActivityLog[], meta: PaginationMeta }>(
          `/admin/activity-logs?${params.toString()}`
        )
        this.activityLogs = response.data
        this.logsPagination = response.meta
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchActivityLogs error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Imposta filtri log
     */
    setLogsFilters(filters: Partial<ActivityLogFilters>) {
      this.logsFilters = { ...this.logsFilters, ...filters, page: 1 }
    },

    /**
     * Reset filtri log
     */
    resetLogsFilters() {
      this.logsFilters = {
        search: '',
        type: '',
        entity: '',
        page: 1,
        per_page: 20
      }
    },

    /**
     * Carica configurazione Fatture in Cloud
     */
    async fetchFattureCloudConfig() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          this.fattureCloudConfig = { ...mockFattureCloudConfig }
          return
        }

        const { api } = useApi()
        const response = await api<{ data: FattureCloudConfig }>('/admin/settings/fatture-cloud')
        this.fattureCloudConfig = response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchFattureCloudConfig error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Aggiorna configurazione Fatture in Cloud
     */
    async updateFattureCloudConfig(config: FattureCloudConfigForm): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          this.fattureCloudConfig = {
            ...this.fattureCloudConfig,
            ...config,
            company_name: this.fattureCloudConfig?.company_name || '',
            connected_at: this.fattureCloudConfig?.connected_at || null,
            last_sync_at: this.fattureCloudConfig?.last_sync_at || null
          } as FattureCloudConfig
          return true
        }

        const { api } = useApi()
        const response = await api<{ data: FattureCloudConfig }>('/admin/settings/fatture-cloud', {
          method: 'PUT',
          body: config
        })
        this.fattureCloudConfig = response.data
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
        console.error('updateFattureCloudConfig error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Testa connessione Fatture in Cloud
     */
    async testFattureCloudConnection(): Promise<FattureCloudTestResult> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.testingConnection = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 1500))
          const result: FattureCloudTestResult = {
            success: true,
            company_name: 'Qualeadfied Srl',
            company_id: 12345
          }
          if (this.fattureCloudConfig) {
            this.fattureCloudConfig.company_name = result.company_name!
            this.fattureCloudConfig.company_id = result.company_id!
            this.fattureCloudConfig.connected_at = new Date().toISOString()
          }
          return result
        }

        const { api } = useApi()
        const response = await api<{ data: FattureCloudTestResult }>('/admin/settings/fatture-cloud/test', {
          method: 'POST'
        })
        if (response.data.success && this.fattureCloudConfig) {
          this.fattureCloudConfig.company_name = response.data.company_name || ''
          this.fattureCloudConfig.company_id = response.data.company_id || null
          this.fattureCloudConfig.connected_at = new Date().toISOString()
        }
        return response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.genericError')
        console.error('testFattureCloudConnection error:', error)
        return { success: false, error: error.message }
      } finally {
        this.testingConnection = false
      }
    },

    /**
     * Pulisci stato
     */
    clearState() {
      this.systemConfig = null
      this.notificationConfigs = []
      this.operators = []
      this.currentOperator = null
      this.activityLogs = []
      this.fattureCloudConfig = null
      this.testingConnection = false
      this.error = null
    }
  }
})
