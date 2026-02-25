/**
 * Store - Admin Authentication
 * Pinia store for admin login/logout/session
 */
import { defineStore } from 'pinia'
import type { AdminUser, AdminLoginForm } from '~/types/auth'

interface AdminAuthState {
  admin: AdminUser | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

export const useAdminAuthStore = defineStore('adminAuth', {
  state: (): AdminAuthState => ({
    admin: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false
  }),

  getters: {
    currentAdmin: (state): AdminUser | null => state.admin,

    isLoggedIn: (state): boolean => state.isAuthenticated && !!state.admin,

    adminFullName: (state): string => {
      if (!state.admin) return ''
      return `${state.admin.first_name} ${state.admin.last_name}`
    },

    adminInitials: (state): string => {
      if (!state.admin) return 'A'
      return `${state.admin.first_name.charAt(0)}${state.admin.last_name.charAt(0)}`.toUpperCase()
    },

    adminRole: (state): string => state.admin?.role ?? ''
  },

  actions: {
    async login(form: AdminLoginForm): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const data = await $fetch<{ message: string; admin: AdminUser; token: string }>(
          `${config.public.apiBase}/admin/auth/login`,
          {
            method: 'POST',
            body: { email: form.email, password: form.password },
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          }
        )

        this.admin = data.admin
        this.token = data.token
        this.isAuthenticated = true

        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', data.token)
        }

        return true
      } catch (e: any) {
        this.error = e.data?.message || e.message || 'Credenziali non valide'
        return false
      } finally {
        this.loading = false
      }
    },

    async logout(): Promise<void> {
      this.loading = true

      try {
        const config = useRuntimeConfig()
        const token = this.token || (typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null)

        if (token) {
          await $fetch(`${config.public.apiBase}/admin/auth/logout`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          })
        }
      } catch {
        // Ignore logout errors — clear state anyway
      } finally {
        this.admin = null
        this.token = null
        this.isAuthenticated = false

        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token')
        }

        this.loading = false
      }
    },

    async fetchAdmin(): Promise<boolean> {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
      if (!token) return false

      this.loading = true

      try {
        const config = useRuntimeConfig()
        const data = await $fetch<{ admin: AdminUser }>(
          `${config.public.apiBase}/admin/auth/me`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )

        this.admin = data.admin
        this.token = token
        this.isAuthenticated = true
        return true
      } catch {
        this.admin = null
        this.token = null
        this.isAuthenticated = false

        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token')
        }

        return false
      } finally {
        this.loading = false
      }
    },

    async checkSession(): Promise<boolean> {
      if (!this.token) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
        if (!token) return false
        this.token = token
      }

      return await this.fetchAdmin()
    },

    clearError(): void {
      this.error = null
    }
  }
})
