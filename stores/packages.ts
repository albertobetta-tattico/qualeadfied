/**
 * Store - Packages
 * Pinia store for lead packages management
 */
import { defineStore } from 'pinia'
import type {
  LeadPackage,
  ActivePackage,
  PackageSelectRequest
} from '~/types/clientArea'

interface PackagesState {
  availablePackages: LeadPackage[]
  activePackages: ActivePackage[]
  selectedPackage: LeadPackage | null
  loading: boolean
  purchasing: boolean
  error: string | null
}

export const usePackagesStore = defineStore('packages', {
  state: (): PackagesState => ({
    availablePackages: [],
    activePackages: [],
    selectedPackage: null,
    loading: false,
    purchasing: false,
    error: null
  }),

  getters: {
    hasActivePackages: (state): boolean => state.activePackages.length > 0,

    totalRemainingLeads: (state): number => {
      return state.activePackages.reduce((sum, pkg) => {
        const exclusiveRemaining = pkg.exclusive_leads_total - pkg.exclusive_leads_used
        const sharedRemaining = pkg.shared_leads_total - pkg.shared_leads_used
        return sum + exclusiveRemaining + sharedRemaining
      }, 0)
    },

    activePackageById: (state) => (id: number): ActivePackage | undefined => {
      return state.activePackages.find(p => p.id === id)
    },

    packagesByCategory: (state) => (categoryId: number | null): LeadPackage[] => {
      if (categoryId === null) {
        return state.availablePackages.filter(p => p.category_id === null)
      }
      return state.availablePackages.filter(p => p.category_id === categoryId || p.category_id === null)
    }
  },

  actions: {
    async fetchPackages(): Promise<void> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: LeadPackage[] }>(`${config.public.apiBase}/packages`, {
          headers: {
            Accept: 'application/json'
          }
        })
        this.availablePackages = response.data
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.loadError')
      } finally {
        this.loading = false
      }
    },

    async fetchActivePackages(): Promise<void> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()

        const { data, error } = await client.GET('/user-packages')
        if (error) throw error

        this.activePackages = (data as any).data
      } catch (e: any) {
        this.error = e.data?.message || e.message || t('common.errors.loadError')
      } finally {
        this.loading = false
      }
    },

    async fetchPackageDetails(packageId: number): Promise<ActivePackage | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()

        const { data, error } = await client.GET('/user-packages/{userPackage}', {
          params: { path: { userPackage: packageId } }
        })
        if (error) throw error

        return (data as any).data
      } catch (e: any) {
        this.error = e.data?.message || e.message || t('common.errors.loadError')
        return null
      } finally {
        this.loading = false
      }
    },

    async purchasePackage(packageId: number, paymentMethod: 'card' | 'sepa'): Promise<{ clientSecret: string; orderId: number } | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.purchasing = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: { client_secret: string; order_id: number; package_id: number; amount: number } }>(`${config.public.apiBase}/packages/purchase`, {
          method: 'POST',
          body: { package_id: packageId, payment_method: paymentMethod },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })

        return { clientSecret: response.data.client_secret, orderId: response.data.order_id }
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.paymentError')
        return null
      } finally {
        this.purchasing = false
      }
    },

    async confirmPackagePurchase(paymentIntentId: string): Promise<{ orderId: number } | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.purchasing = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: { order_id: number; active_package: ActivePackage } }>(`${config.public.apiBase}/packages/purchase/confirm`, {
          method: 'POST',
          body: { payment_intent_id: paymentIntentId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })

        this.activePackages.push(response.data.active_package)
        return { orderId: response.data.order_id }
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.paymentError')
        return null
      } finally {
        this.purchasing = false
      }
    },

    async selectLeadsFromPackage(
      packageId: number,
      request: PackageSelectRequest
    ): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/packages/${packageId}/select-leads`, {
          method: 'POST',
          body: request,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })

        await this.fetchActivePackages()

        return true
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.genericError')
        return false
      } finally {
        this.loading = false
      }
    },

    setSelectedPackage(pkg: LeadPackage | null): void {
      this.selectedPackage = pkg
    }
  }
})
