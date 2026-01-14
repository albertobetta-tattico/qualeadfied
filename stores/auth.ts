/**
 * Store - Authentication
 * Pinia store for user authentication and profile management
 */
import { defineStore } from 'pinia'
import type {
  User,
  UserWithProfile,
  ClientProfile,
  RegisterForm,
  LoginForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  AuthResponse,
  MessageResponse
} from '~/types/auth'

const USE_MOCK_DATA = true

// Mock user data
const mockUser: UserWithProfile = {
  id: 1,
  email: 'mario.rossi@example.com',
  email_verified_at: '2025-01-10T10:00:00Z',
  role: 'client',
  status: 'active',
  created_at: '2025-01-01T10:00:00Z',
  updated_at: '2025-01-10T10:00:00Z',
  profile: {
    id: 1,
    user_id: 1,
    company_name: 'Rossi Costruzioni S.r.l.',
    vat_number: 'IT12345678901',
    phone: '+39 02 1234567',
    first_name: 'Mario',
    last_name: 'Rossi',
    billing_address: 'Via Roma 123',
    billing_city: 'Milano',
    billing_province: 'MI',
    billing_zip: '20100',
    billing_country: 'IT',
    sdi_code: 'ABC1234',
    pec_email: 'rossisrl@pec.it',
    free_trial_enabled: true,
    free_trial_leads_remaining: 3,
    email_notifications_enabled: true,
    marketing_consent: false,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-10T10:00:00Z'
  }
}

interface AuthState {
  user: UserWithProfile | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false
  }),

  getters: {
    currentUser: (state): UserWithProfile | null => state.user,
    userProfile: (state): ClientProfile | null => state.user?.profile ?? null,
    isLoggedIn: (state): boolean => state.isAuthenticated && !!state.user,
    hasFreeTrial: (state): boolean => {
      return state.user?.profile?.free_trial_enabled === true &&
             (state.user?.profile?.free_trial_leads_remaining ?? 0) > 0
    },
    freeTrialLeadsRemaining: (state): number => {
      return state.user?.profile?.free_trial_leads_remaining ?? 0
    },
    companyName: (state): string => {
      return state.user?.profile?.company_name ?? ''
    },
    fullName: (state): string => {
      if (!state.user?.profile) return ''
      return `${state.user.profile.first_name} ${state.user.profile.last_name}`
    }
  },

  actions: {
    /**
     * Register a new user
     */
    async register(form: RegisterForm): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          // Simulate successful registration
          return true
        }

        const response = await $fetch<MessageResponse>('/api/auth/register', {
          method: 'POST',
          body: form
        })

        return true
      } catch (e: any) {
        this.error = e.data?.message || 'Errore durante la registrazione'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Login user
     */
    async login(form: LoginForm): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 800))

          // Mock validation
          if (form.email !== 'demo@example.com' && form.email !== 'mario.rossi@example.com') {
            this.error = 'Credenziali non valide'
            return false
          }

          this.user = mockUser
          this.token = 'mock-token-12345'
          this.isAuthenticated = true

          // Store token in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', this.token)
          }

          return true
        }

        const response = await $fetch<AuthResponse>('/api/auth/login', {
          method: 'POST',
          body: form
        })

        this.user = response.user
        this.token = response.token
        this.isAuthenticated = true

        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.token)
        }

        return true
      } catch (e: any) {
        this.error = e.data?.message || 'Credenziali non valide'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
      this.loading = true

      try {
        if (!USE_MOCK_DATA) {
          await $fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          })
        }
      } catch (e) {
        // Ignore logout errors
      } finally {
        this.user = null
        this.token = null
        this.isAuthenticated = false

        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
        }

        this.loading = false
      }
    },

    /**
     * Fetch current user from API
     */
    async fetchUser(): Promise<boolean> {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

      if (!token) {
        return false
      }

      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          this.user = mockUser
          this.token = token
          this.isAuthenticated = true
          return true
        }

        const response = await $fetch<{ user: UserWithProfile }>('/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        this.user = response.user
        this.token = token
        this.isAuthenticated = true

        return true
      } catch (e) {
        this.user = null
        this.token = null
        this.isAuthenticated = false
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
        }
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Request password reset
     */
    async forgotPassword(form: ForgotPasswordForm): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          return true
        }

        await $fetch<MessageResponse>('/api/auth/forgot-password', {
          method: 'POST',
          body: form
        })

        return true
      } catch (e: any) {
        this.error = e.data?.message || 'Errore durante l\'invio dell\'email'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Reset password with token
     */
    async resetPassword(form: ResetPasswordForm): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          return true
        }

        await $fetch<MessageResponse>('/api/auth/reset-password', {
          method: 'POST',
          body: form
        })

        return true
      } catch (e: any) {
        this.error = e.data?.message || 'Errore durante il reset della password'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Verify email with token
     */
    async verifyEmail(token: string): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          return true
        }

        await $fetch<MessageResponse>(`/api/auth/verify-email/${token}`)

        return true
      } catch (e: any) {
        this.error = e.data?.message || 'Token di verifica non valido o scaduto'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Resend verification email
     */
    async resendVerificationEmail(): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          return true
        }

        await $fetch<MessageResponse>('/api/auth/resend-verification', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })

        return true
      } catch (e: any) {
        this.error = e.data?.message || 'Errore durante l\'invio dell\'email'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Check if session is still valid
     */
    async checkSession(): Promise<boolean> {
      if (!this.token) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
        if (!token) return false
        this.token = token
      }

      return await this.fetchUser()
    },

    /**
     * Clear error state
     */
    clearError(): void {
      this.error = null
    }
  }
})
