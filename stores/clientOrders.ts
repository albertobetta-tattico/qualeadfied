/**
 * Store - Client Orders
 * Pinia store for client order history
 */
import { defineStore } from 'pinia'
import type {
  Order,
  OrderDetail,
  OrderFilters,
  PaginationMeta
} from '~/types/clientArea'

interface ClientOrdersState {
  orders: Order[]
  currentOrder: OrderDetail | null
  filters: OrderFilters
  pagination: PaginationMeta
  loading: boolean
  error: string | null
}

export const useClientOrdersStore = defineStore('clientOrders', {
  state: (): ClientOrdersState => ({
    orders: [],
    currentOrder: null,
    filters: {
      status: '',
      order_type: '',
      date_from: '',
      date_to: '',
      page: 1,
      per_page: 20
    },
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0,
      from: 0,
      to: 0
    },
    loading: false,
    error: null
  }),

  getters: {
    totalOrders: (state): number => state.pagination.total,

    totalSpent: (state): number => {
      return state.orders.reduce((sum, order) => sum + Number(order.total), 0)
    },

    completedOrders: (state): Order[] => {
      return state.orders.filter(o => o.status === 'completed')
    },

    orderById: (state) => (id: number): Order | undefined => {
      return state.orders.find(o => o.id === id)
    }
  },

  actions: {
    async fetchOrders(): Promise<void> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()

        const query: Record<string, unknown> = {}
        if (this.filters.status) query.status = this.filters.status
        if (this.filters.order_type) query.order_type = this.filters.order_type
        if (this.filters.date_from) query.date_from = this.filters.date_from
        if (this.filters.date_to) query.date_to = this.filters.date_to
        if (this.filters.page) query.page = this.filters.page
        if (this.filters.per_page) query.per_page = this.filters.per_page

        const { data, error } = await client.GET('/orders', {
          params: { query } as any
        })
        if (error) throw error

        this.orders = (data as any).data
        this.pagination = (data as any).meta
      } catch (e: any) {
        this.error = e.data?.message || e.message || t('common.errors.loadError')
      } finally {
        this.loading = false
      }
    },

    async fetchOrder(id: number): Promise<OrderDetail | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()

        const { data, error } = await client.GET('/orders/{order}', {
          params: { path: { order: id } }
        })
        if (error) throw error

        this.currentOrder = (data as any).data
        return (data as any).data
      } catch (e: any) {
        this.error = e.data?.message || e.message || t('common.errors.loadError')
        return null
      } finally {
        this.loading = false
      }
    },

    async downloadInvoice(orderId: number): Promise<string | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: { url: string } }>(`${config.public.apiBase}/orders/${orderId}/invoice`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })

        return response.data.url
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.downloadError')
        return null
      }
    },

    setFilters(filters: Partial<OrderFilters>): void {
      this.filters = { ...this.filters, ...filters, page: 1 }
    },

    resetFilters(): void {
      this.filters = {
        status: '',
        order_type: '',
        date_from: '',
        date_to: '',
        page: 1,
        per_page: 20
      }
    },

    setPage(page: number): void {
      this.filters.page = page
    },

    clearCurrentOrder(): void {
      this.currentOrder = null
    }
  }
})
