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
  systemConfig: SystemConfig | null
  notificationConfigs: CategoryNotificationConfig[]
  operators: AdminOperator[]
  currentOperator: AdminOperator | null
  activityLogs: ActivityLog[]
  logsPagination: PaginationMeta
  logsFilters: ActivityLogFilters
  fattureCloudConfig: FattureCloudConfig | null
  testingConnection: boolean
  loading: boolean
  saving: boolean
  error: string | null
}

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
    // SYSTEM CONFIG (via /admin/system-settings in spec)
    async fetchSystemConfig() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()
        const { data, error } = await client.GET('/admin/system-settings')
        if (error) throw error
        this.systemConfig = (data as any).data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchSystemConfig error:', error)
      } finally {
        this.loading = false
      }
    },

    async updateSystemConfig(configData: SystemConfigForm): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const data = await $fetch<{ data: SystemConfig }>(`${config.public.apiBase}/admin/system-settings`, {
          method: 'PUT',
          body: configData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })
        this.systemConfig = data.data
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
        console.error('updateSystemConfig error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    // SMTP (NOT in spec)
    async updateSmtpConfig(configData: SmtpConfigForm): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/admin/settings/smtp`, {
          method: 'PUT',
          body: configData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
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

    // TEST EMAIL (NOT in spec)
    async testEmailConfig(email: string): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/admin/settings/test-email`, {
          method: 'POST',
          body: { email },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
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

    // NOTIFICATIONS (NOT in spec)
    async fetchNotificationConfigs() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: CategoryNotificationConfig[] }>(`${config.public.apiBase}/admin/settings/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })
        this.notificationConfigs = response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchNotificationConfigs error:', error)
      } finally {
        this.loading = false
      }
    },

    async updateNotificationConfig(categoryId: number, configData: Partial<CategoryNotificationConfig>): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/admin/settings/notifications/${categoryId}`, {
          method: 'PUT',
          body: configData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })

        const index = this.notificationConfigs.findIndex(nc => nc.category_id === categoryId)
        if (index !== -1) {
          this.notificationConfigs[index] = { ...this.notificationConfigs[index], ...configData }
        }

        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
        console.error('updateNotificationConfig error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    // OPERATORS (via /admin/admins in spec)
    async fetchOperators() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()
        const { data, error } = await client.GET('/admin/admins')
        if (error) throw error
        this.operators = (data as any).data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchOperators error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchOperator(id: number) {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()
        const { data, error } = await client.GET('/admin/admins/{admin}', {
          params: { path: { admin: id } }
        })
        if (error) throw error
        this.currentOperator = (data as any).data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchOperator error:', error)
      } finally {
        this.loading = false
      }
    },

    async createOperator(data: AdminOperatorCreateForm): Promise<AdminOperator | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const client = useTypedApi()
        const { data: responseData, error } = await client.POST('/admin/admins', {
          body: data as any
        })
        if (error) throw error

        const newOperator = (responseData as any).data
        this.operators.push(newOperator)
        return newOperator
      } catch (error: any) {
        this.error = error.message || t('common.errors.createError')
        console.error('createOperator error:', error)
        return null
      } finally {
        this.saving = false
      }
    },

    async updateOperator(id: number, data: AdminOperatorUpdateForm): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const client = useTypedApi()
        const { data: responseData, error } = await client.PUT('/admin/admins/{admin}', {
          params: { path: { admin: id } },
          body: data as any
        })
        if (error) throw error

        const updated = (responseData as any).data
        const index = this.operators.findIndex(op => op.id === id)
        if (index !== -1) this.operators[index] = updated
        if (this.currentOperator?.id === id) this.currentOperator = updated

        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.updateError')
        console.error('updateOperator error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    async deleteOperator(id: number): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const client = useTypedApi()
        const { error } = await client.DELETE('/admin/admins/{admin}', {
          params: { path: { admin: id } }
        })
        if (error) throw error

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

    // OPERATOR RESET PASSWORD (NOT in spec)
    async resetOperatorPassword(id: number): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/admin/admins/${id}/reset-password`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.genericError')
        console.error('resetOperatorPassword error:', error)
        return false
      } finally {
        this.saving = false
      }
    },

    // ACTIVITY LOGS (via /admin/activity-logs in spec)
    async fetchActivityLogs() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()

        const query: Record<string, unknown> = {
          page: this.logsFilters.page || 1,
          per_page: this.logsFilters.per_page || 20
        }

        if (this.logsFilters.search) query.search = this.logsFilters.search
        if (this.logsFilters.type) query.type = this.logsFilters.type
        if (this.logsFilters.entity) query.entity = this.logsFilters.entity
        if (this.logsFilters.admin_id) query.admin_id = this.logsFilters.admin_id
        if (this.logsFilters.date_from) query.date_from = this.logsFilters.date_from
        if (this.logsFilters.date_to) query.date_to = this.logsFilters.date_to

        const { data, error } = await client.GET('/admin/activity-logs', {
          params: { query }
        })
        if (error) throw error

        this.activityLogs = (data as any).data
        this.logsPagination = (data as any).meta
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchActivityLogs error:', error)
      } finally {
        this.loading = false
      }
    },

    setLogsFilters(filters: Partial<ActivityLogFilters>) {
      this.logsFilters = { ...this.logsFilters, ...filters, page: 1 }
    },

    resetLogsFilters() {
      this.logsFilters = {
        search: '',
        type: '',
        entity: '',
        page: 1,
        per_page: 20
      }
    },

    // FATTURE IN CLOUD (NOT in spec)
    async fetchFattureCloudConfig() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: FattureCloudConfig }>(`${config.public.apiBase}/admin/settings/fatture-cloud`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })
        this.fattureCloudConfig = response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchFattureCloudConfig error:', error)
      } finally {
        this.loading = false
      }
    },

    async updateFattureCloudConfig(configData: FattureCloudConfigForm): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: FattureCloudConfig }>(`${config.public.apiBase}/admin/settings/fatture-cloud`, {
          method: 'PUT',
          body: configData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
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

    async testFattureCloudConnection(): Promise<FattureCloudTestResult> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.testingConnection = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: FattureCloudTestResult }>(`${config.public.apiBase}/admin/settings/fatture-cloud/test`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
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
