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
  DashboardNotification
} from '~/types/clientArea'

const USE_MOCK_DATA = true

// Mock profile data
const mockProfile: ClientProfileData = {
  company_name: 'Rossi Costruzioni S.r.l.',
  vat_number: 'IT12345678901',
  phone: '+39 02 1234567',
  first_name: 'Mario',
  last_name: 'Rossi',
  email: 'mario.rossi@example.com',
  billing_address: 'Via Roma 123',
  billing_city: 'Milano',
  billing_province: 'MI',
  billing_zip: '20100',
  billing_country: 'IT',
  sdi_code: 'ABC1234',
  pec_email: 'rossisrl@pec.it',
  email_notifications_enabled: true,
  marketing_consent: false,
  free_trial_enabled: true,
  free_trial_leads_remaining: 2
}

// Mock dashboard stats
const mockDashboardStats: DashboardStats = {
  total_leads_purchased: 15,
  leads_this_month: 4,
  total_spent: 675.88,
  spent_this_month: 128.1,
  conversion_rate: 23,
  active_packages: 1,
  free_trial_remaining: 2
}

// Mock notifications
const mockNotifications: DashboardNotification[] = [
  {
    id: 1,
    type: 'new_leads',
    title: 'Nuovi lead disponibili',
    message: '12 nuovi lead nella categoria Ristrutturazioni',
    link: '/leads?category=1',
    created_at: '2025-01-14T10:00:00Z',
    read: false
  },
  {
    id: 2,
    type: 'package_expiring',
    title: 'Pacchetto in scadenza',
    message: 'Il tuo pacchetto Professional scade tra 30 giorni',
    link: '/pacchetti/attivi',
    created_at: '2025-01-13T09:00:00Z',
    read: false
  },
  {
    id: 3,
    type: 'order_completed',
    title: 'Ordine completato',
    message: 'Il tuo ordine ORD-2025-00003 è stato completato',
    link: '/ordini/1003',
    created_at: '2025-01-14T08:10:00Z',
    read: true
  }
]

// Mock trial status
const mockTrialStatus: TrialStatus = {
  enabled: true,
  leads_remaining: 2,
  leads_total: 3,
  leads_claimed: 1
}

interface ClientProfileState {
  profile: ClientProfileData | null
  dashboardStats: DashboardStats | null
  notifications: DashboardNotification[]
  trialStatus: TrialStatus | null
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
    /**
     * Fetch profile data
     */
    async fetchProfile(): Promise<void> {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          this.profile = { ...mockProfile }
          return
        }

        const response = await $fetch<{ data: ClientProfileData }>('/api/client/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        this.profile = response.data
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nel caricamento profilo'
      } finally {
        this.loading = false
      }
    },

    /**
     * Update profile data
     */
    async updateProfile(data: ProfileUpdateRequest): Promise<boolean> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          if (this.profile) {
            Object.assign(this.profile, data)
          }
          return true
        }

        await $fetch('/api/client/profile', {
          method: 'PUT',
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        if (this.profile) {
          Object.assign(this.profile, data)
        }

        return true
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nell\'aggiornamento profilo'
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Update billing data
     */
    async updateBilling(data: BillingUpdateRequest): Promise<boolean> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          if (this.profile) {
            this.profile.billing_address = data.billing_address
            this.profile.billing_city = data.billing_city
            this.profile.billing_province = data.billing_province
            this.profile.billing_zip = data.billing_zip
            this.profile.billing_country = data.billing_country
            if (data.sdi_code !== undefined) this.profile.sdi_code = data.sdi_code
            if (data.pec_email !== undefined) this.profile.pec_email = data.pec_email
          }
          return true
        }

        await $fetch('/api/client/profile/billing', {
          method: 'PUT',
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        if (this.profile) {
          Object.assign(this.profile, data)
        }

        return true
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nell\'aggiornamento dati fatturazione'
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Change password
     */
    async changePassword(data: PasswordChangeRequest): Promise<boolean> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          return true
        }

        await $fetch('/api/client/profile/password', {
          method: 'PUT',
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        return true
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nel cambio password'
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Update preferences
     */
    async updatePreferences(data: PreferencesUpdateRequest): Promise<boolean> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          if (this.profile) {
            if (data.email_notifications_enabled !== undefined) {
              this.profile.email_notifications_enabled = data.email_notifications_enabled
            }
            if (data.marketing_consent !== undefined) {
              this.profile.marketing_consent = data.marketing_consent
            }
          }
          return true
        }

        await $fetch('/api/client/profile/preferences', {
          method: 'PUT',
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        if (this.profile) {
          Object.assign(this.profile, data)
        }

        return true
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nell\'aggiornamento preferenze'
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Fetch dashboard stats
     */
    async fetchDashboardStats(): Promise<void> {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          this.dashboardStats = { ...mockDashboardStats }
          return
        }

        const response = await $fetch<{ data: DashboardStats }>('/api/client/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        this.dashboardStats = response.data
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nel caricamento statistiche'
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch notifications
     */
    async fetchNotifications(): Promise<void> {
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 100))
          this.notifications = [...mockNotifications]
          return
        }

        const response = await $fetch<{ data: DashboardNotification[] }>('/api/client/notifications', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        this.notifications = response.data
      } catch (e: any) {
        console.error('Error fetching notifications:', e)
      }
    },

    /**
     * Mark notification as read
     */
    async markNotificationRead(id: number): Promise<void> {
      try {
        if (USE_MOCK_DATA) {
          const notification = this.notifications.find(n => n.id === id)
          if (notification) notification.read = true
          return
        }

        await $fetch(`/api/client/notifications/${id}/read`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        const notification = this.notifications.find(n => n.id === id)
        if (notification) notification.read = true
      } catch (e: any) {
        console.error('Error marking notification as read:', e)
      }
    },

    /**
     * Mark all notifications as read
     */
    async markAllNotificationsRead(): Promise<void> {
      try {
        if (USE_MOCK_DATA) {
          this.notifications.forEach(n => n.read = true)
          return
        }

        await $fetch('/api/client/notifications/read-all', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        this.notifications.forEach(n => n.read = true)
      } catch (e: any) {
        console.error('Error marking all notifications as read:', e)
      }
    },

    /**
     * Fetch trial status
     */
    async fetchTrialStatus(): Promise<void> {
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 100))
          this.trialStatus = { ...mockTrialStatus }
          return
        }

        const response = await $fetch<{ data: TrialStatus }>('/api/client/trial/status', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        this.trialStatus = response.data
      } catch (e: any) {
        console.error('Error fetching trial status:', e)
      }
    },

    /**
     * Claim trial leads
     */
    async claimTrialLeads(request: TrialClaimRequest): Promise<boolean> {
      this.saving = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))

          // Update trial status
          if (this.trialStatus) {
            this.trialStatus.leads_claimed += request.lead_ids.length
            this.trialStatus.leads_remaining -= request.lead_ids.length
            if (this.trialStatus.leads_remaining <= 0) {
              this.trialStatus.enabled = false
            }
          }

          return true
        }

        await $fetch('/api/client/trial/claim', {
          method: 'POST',
          body: request,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        // Refresh trial status
        await this.fetchTrialStatus()

        return true
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nel riscatto lead gratuiti'
        return false
      } finally {
        this.saving = false
      }
    },

    /**
     * Initialize dashboard data
     */
    async initializeDashboard(): Promise<void> {
      await Promise.all([
        this.fetchProfile(),
        this.fetchDashboardStats(),
        this.fetchNotifications(),
        this.fetchTrialStatus()
      ])
    }
  }
})
