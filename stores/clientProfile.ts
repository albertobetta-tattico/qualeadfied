/**
 * Store - Client Profile
 * Pinia store for client profile and dashboard data
 */
import { defineStore } from 'pinia'
import type {
  ClientProfileData,
  ProfileUpdateRequest,
  BillingUpdateRequest,
  PasswordChangeRequest,
  PreferencesUpdateRequest,
  TrialStatus,
  TrialClaimRequest,
  DashboardStats,
  DashboardNotification,
  DashboardRecentLead,
  DashboardRecentOrder
} from '~/types/clientArea'

interface ClientProfileState {
  profile: ClientProfileData | null
  dashboardStats: DashboardStats | null
  notifications: DashboardNotification[]
  trialStatus: TrialStatus | null
  recentLeads: DashboardRecentLead[]
  recentOrders: DashboardRecentOrder[]
  loading: boolean
  saving: boolean
  error: string | null
}

export const useClientProfileStore = defineStore('clientProfile', {
  state: (): ClientProfileState => ({
    profile: null,
    dashboardStats: null,
    notifications: [],
    trialStatus: null,
    recentLeads: [],
    recentOrders: [],
    loading: false,
    saving: false,
    error: null
  }),

  getters: {
    fullName: (state): string => {
      if (!state.profile) return ''
      return `${state.profile.first_name} ${state.profile.last_name}`
    },

    companyName: (state): string => {
      return state.profile?.company_name || ''
    },

    hasFreeTrial: (state): boolean => {
      return state.trialStatus?.enabled === true && (state.trialStatus?.leads_remaining ?? 0) > 0
    },

    freeTrialLeadsRemaining: (state): number => {
      return state.trialStatus?.leads_remaining ?? 0
    },

    unreadNotificationsCount: (state): number => {
      return state.notifications.filter(n => !n.read).length
    },

    hasBillingData: (state): boolean => {
      return !!(state.profile?.billing_address && state.profile?.billing_city)
    }
  },

  actions: {
    async fetchProfile(): Promise<void> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()
        const { data, error } = await client.GET('/client-profile')
        if (error) throw error

        this.profile = (data as any).data
      } catch (e: any) {
        this.error = e.data?.message || e.message || t('common.errors.loadError')
      } finally {
        this.loading = false
      }
    },

    async updateProfile(data: ProfileUpdateRequest): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const client = useTypedApi()
        const { error } = await client.PUT('/client-profile', {
          body: data as any
        })
        if (error) throw error

        if (this.profile) {
          Object.assign(this.profile, data)
        }

        return true
      } catch (e: any) {
        this.error = e.data?.message || e.message || t('common.errors.updateError')
        return false
      } finally {
        this.saving = false
      }
    },

    async updateBilling(data: BillingUpdateRequest): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/client/profile/billing`, {
          method: 'PUT',
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })

        if (this.profile) Object.assign(this.profile, data)

        return true
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.updateError')
        return false
      } finally {
        this.saving = false
      }
    },

    async changePassword(data: PasswordChangeRequest): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/client/profile/password`, {
          method: 'PUT',
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })

        return true
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.updateError')
        return false
      } finally {
        this.saving = false
      }
    },

    async updatePreferences(data: PreferencesUpdateRequest): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/client/profile/preferences`, {
          method: 'PUT',
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })

        if (this.profile) Object.assign(this.profile, data)

        return true
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.updateError')
        return false
      } finally {
        this.saving = false
      }
    },

    async fetchDashboardStats(): Promise<void> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: DashboardStats }>(`${config.public.apiBase}/client/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })
        this.dashboardStats = response.data
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.loadError')
      } finally {
        this.loading = false
      }
    },

    async fetchNotifications(): Promise<void> {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: DashboardNotification[] }>(`${config.public.apiBase}/client/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })
        this.notifications = response.data
      } catch (e: any) {
        console.error('Error fetching notifications:', e)
      }
    },

    async markNotificationRead(id: number): Promise<void> {
      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/client/notifications/${id}/read`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })

        const notification = this.notifications.find(n => n.id === id)
        if (notification) notification.read = true
      } catch (e: any) {
        console.error('Error marking notification as read:', e)
      }
    },

    async markAllNotificationsRead(): Promise<void> {
      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/client/notifications/read-all`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })

        this.notifications.forEach(n => n.read = true)
      } catch (e: any) {
        console.error('Error marking all notifications as read:', e)
      }
    },

    async fetchTrialStatus(): Promise<void> {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: TrialStatus }>(`${config.public.apiBase}/client/trial/status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })
        this.trialStatus = response.data
      } catch (e: any) {
        console.error('Error fetching trial status:', e)
      }
    },

    async claimTrialLeads(request: TrialClaimRequest): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.saving = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/client/trial/claim`, {
          method: 'POST',
          body: request,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })

        await this.fetchTrialStatus()

        return true
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.genericError')
        return false
      } finally {
        this.saving = false
      }
    },

    async fetchRecentLeads(): Promise<void> {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: DashboardRecentLead[] }>(`${config.public.apiBase}/client/dashboard/recent-leads`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })
        this.recentLeads = response.data
      } catch (e: any) {
        console.error('Error fetching recent leads:', e)
      }
    },

    async fetchRecentOrders(): Promise<void> {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: DashboardRecentOrder[] }>(`${config.public.apiBase}/client/dashboard/recent-orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })
        this.recentOrders = response.data
      } catch (e: any) {
        console.error('Error fetching recent orders:', e)
      }
    },

    async initializeDashboard(): Promise<void> {
      await Promise.all([
        this.fetchProfile(),
        this.fetchDashboardStats(),
        this.fetchNotifications(),
        this.fetchTrialStatus(),
        this.fetchRecentLeads(),
        this.fetchRecentOrders()
      ])
    }
  }
})
