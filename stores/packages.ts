/**
 * Store - Packages
 * Pinia store for lead packages management
 */
import { defineStore } from 'pinia'
import type { Category } from '~/types/lead'
import type {
  LeadPackage,
  ActivePackage,
  PackageSelectRequest,
  PurchaseMode
} from '~/types/clientArea'

const USE_MOCK_DATA = true

// Mock categories
const mockCategories: Record<number, Category> = {
  1: { id: 1, name: 'Ristrutturazioni', slug: 'ristrutturazioni', max_shares: 5, is_active: true, sort_order: 1, deleted_at: null, created_at: '', updated_at: '' },
  2: { id: 2, name: 'Fotovoltaico', slug: 'fotovoltaico', max_shares: 4, is_active: true, sort_order: 2, deleted_at: null, created_at: '', updated_at: '' }
}

// Mock available packages
const mockPackages: LeadPackage[] = [
  {
    id: 1,
    name: 'Starter Pack',
    description: '10 lead per iniziare a testare il servizio',
    category_id: null,
    total_leads: 10,
    exclusive_leads: 3,
    shared_leads: 7,
    price: 199,
    discount_percent: 15,
    original_price: 234,
    is_active: true,
    valid_days: 90
  },
  {
    id: 2,
    name: 'Professional',
    description: '25 lead per professionisti attivi',
    category_id: null,
    total_leads: 25,
    exclusive_leads: 10,
    shared_leads: 15,
    price: 449,
    discount_percent: 20,
    original_price: 561,
    is_active: true,
    valid_days: 180
  },
  {
    id: 3,
    name: 'Business',
    description: '50 lead per aziende strutturate',
    category_id: null,
    total_leads: 50,
    exclusive_leads: 20,
    shared_leads: 30,
    price: 799,
    discount_percent: 25,
    original_price: 1065,
    is_active: true,
    valid_days: 365
  },
  {
    id: 4,
    name: 'Ristrutturazioni Pro',
    description: '20 lead specifici per ristrutturazioni',
    category_id: 1,
    total_leads: 20,
    exclusive_leads: 8,
    shared_leads: 12,
    price: 349,
    discount_percent: 18,
    original_price: 425,
    is_active: true,
    valid_days: 180,
    category: mockCategories[1]
  }
]

// Mock active packages
const mockActivePackages: ActivePackage[] = [
  {
    id: 1,
    package_id: 2,
    user_id: 1,
    package_name: 'Professional',
    category_id: null,
    total_leads: 25,
    exclusive_leads_total: 10,
    exclusive_leads_used: 3,
    shared_leads_total: 15,
    shared_leads_used: 5,
    purchased_at: '2025-01-01T10:00:00Z',
    expires_at: '2025-07-01T10:00:00Z',
    is_expired: false
  }
]

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
    /**
     * Fetch available packages
     */
    async fetchPackages(): Promise<void> {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          this.availablePackages = [...mockPackages]
          return
        }

        const response = await $fetch<{ data: LeadPackage[] }>('/api/packages')
        this.availablePackages = response.data
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nel caricamento pacchetti'
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch active packages for current user
     */
    async fetchActivePackages(): Promise<void> {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          this.activePackages = [...mockActivePackages]
          return
        }

        const response = await $fetch<{ data: ActivePackage[] }>('/api/client/packages', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        this.activePackages = response.data
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nel caricamento pacchetti attivi'
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch package details
     */
    async fetchPackageDetails(packageId: number): Promise<ActivePackage | null> {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          return mockActivePackages.find(p => p.id === packageId) || null
        }

        const response = await $fetch<{ data: ActivePackage }>(`/api/client/packages/${packageId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        return response.data
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nel caricamento dettagli'
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * Purchase a package
     */
    async purchasePackage(packageId: number, paymentMethod: 'card' | 'sepa'): Promise<{ orderId: number } | null> {
      this.purchasing = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Find the package
          const pkg = this.availablePackages.find(p => p.id === packageId)
          if (!pkg) {
            this.error = 'Pacchetto non trovato'
            return null
          }

          // Create new active package
          const newActivePackage: ActivePackage = {
            id: Date.now(),
            package_id: pkg.id,
            user_id: 1,
            package_name: pkg.name,
            category_id: pkg.category_id,
            total_leads: pkg.total_leads,
            exclusive_leads_total: pkg.exclusive_leads,
            exclusive_leads_used: 0,
            shared_leads_total: pkg.shared_leads,
            shared_leads_used: 0,
            purchased_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + pkg.valid_days * 24 * 60 * 60 * 1000).toISOString(),
            is_expired: false
          }

          this.activePackages.push(newActivePackage)

          return { orderId: Date.now() }
        }

        const response = await $fetch<{ data: { order_id: number; active_package: ActivePackage } }>('/api/client/packages/purchase', {
          method: 'POST',
          body: { package_id: packageId, payment_method: paymentMethod },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        this.activePackages.push(response.data.active_package)
        return { orderId: response.data.order_id }
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nell\'acquisto del pacchetto'
        return null
      } finally {
        this.purchasing = false
      }
    },

    /**
     * Select leads from active package
     */
    async selectLeadsFromPackage(
      packageId: number,
      request: PackageSelectRequest
    ): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))

          // Update active package counts
          const activePackage = this.activePackages.find(p => p.id === packageId)
          if (activePackage) {
            let exclusiveCount = 0
            let sharedCount = 0

            for (const leadId of request.lead_ids) {
              const mode = request.purchase_modes[leadId]
              if (mode === 'exclusive') {
                exclusiveCount++
              } else {
                sharedCount++
              }
            }

            activePackage.exclusive_leads_used += exclusiveCount
            activePackage.shared_leads_used += sharedCount
          }

          return true
        }

        await $fetch(`/api/client/packages/${packageId}/select-leads`, {
          method: 'POST',
          body: request,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        // Refresh active packages
        await this.fetchActivePackages()

        return true
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nella selezione lead'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Set selected package for purchase flow
     */
    setSelectedPackage(pkg: LeadPackage | null): void {
      this.selectedPackage = pkg
    }
  }
})
