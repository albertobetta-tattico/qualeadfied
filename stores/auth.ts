/**
 * Store - Authentication
 * Pinia store for user authentication and profile management
 */
import { defineStore } from 'pinia'
import type { components } from '~/types/api.generated'
import type {
  UserWithProfile,
  ClientProfile,
  RegisterForm,
  LoginForm,
  ForgotPasswordForm,
  ResetPasswordForm
} from '~/types/auth'

type User = components['schemas']['User']

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
    async register(form: RegisterForm): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()
        const { error } = await client.POST('/auth/register', {
          body: {
            email: form.email,
            password: form.password,
            password_confirmation: form.password_confirmation,
          },
        })

        if (error) throw error
        return true
      } catch (e: any) {
        this.error = e.data?.message || e.message || t('common.errors.genericError')
        return false
      } finally {
        this.loading = false
      }
    },

    async login(form: LoginForm): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()
        const { data, error } = await client.POST('/auth/login', {
          body: {
            email: form.email,
            password: form.password,
          },
        })

        if (error) throw error

        // The API returns User without profile; cast for now
        // TODO: Load profile separately or extend the /auth/login endpoint
        this.user = data.user as unknown as UserWithProfile
        this.token = data.token
        this.isAuthenticated = true

        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', data.token)
        }

        return true
      } catch (e: any) {
        this.error = e.data?.message || e.message || t('common.errors.genericError')
        return false
      } finally {
        this.loading = false
      }
    },

    async logout(): Promise<void> {
      this.loading = true

      try {
        const client = useTypedApi()
        await client.POST('/auth/logout')
      } catch {
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

    async fetchUser(): Promise<boolean> {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

      if (!token) {
        return false
      }

      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()
        const { data, error } = await client.GET('/auth/me')

        if (error) throw error

        // The API returns User without profile; cast for now
        this.user = data.user as unknown as UserWithProfile
        this.token = token
        this.isAuthenticated = true

        return true
      } catch {
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

    async forgotPassword(form: ForgotPasswordForm): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()
        const { error } = await client.POST('/auth/forgot-password', {
          body: { email: form.email },
        })

        if (error) throw error
        return true
      } catch (e: any) {
        this.error = e.data?.message || e.message || t('common.errors.sendEmailError')
        return false
      } finally {
        this.loading = false
      }
    },

    async resetPassword(form: ResetPasswordForm): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()
        const { error } = await client.POST('/auth/reset-password', {
          body: {
            token: form.token,
            email: form.email,
            password: form.password,
            password_confirmation: form.password_confirmation,
          },
        })

        if (error) throw error
        return true
      } catch (e: any) {
        this.error = e.data?.message || e.message || t('common.errors.genericError')
        return false
      } finally {
        this.loading = false
      }
    },

    async verifyEmail(token: string): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/auth/verify-email`, {
          method: 'POST',
          body: { token },
          headers: {
            Accept: 'application/json'
          }
        })
        return true
      } catch (e: any) {
        this.error = e.data?.message || e.message || t('common.errors.genericError')
        return false
      } finally {
        this.loading = false
      }
    },

    async checkSession(): Promise<boolean> {
      if (!this.token) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
        if (!token) return false
        this.token = token
      }

      return await this.fetchUser()
    },

    clearError(): void {
      this.error = null
    }
  }
})
