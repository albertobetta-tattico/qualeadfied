/**
 * Orders Store - Gestione Ordini
 * Qualeadfied B2B Lead Platform
 */

import { defineStore } from 'pinia'
import type {
  Order,
  OrderWithDetails,
  OrderFilters,
  OrderStats
} from '~/types/order'

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface OrderState {
  orders: Order[]
  currentOrder: OrderWithDetails | null
  stats: OrderStats | null
  pagination: PaginationMeta
  filters: OrderFilters
  loading: boolean
  error: string | null
}

export const useOrderStore = defineStore('order', {
  state: (): OrderState => ({
    orders: [],
    currentOrder: null,
    stats: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    },
    filters: {
      search: '',
      client_id: null,
      status: '',
      type: '',
      payment_method: '',
      date_from: '',
      date_to: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      page: 1,
      per_page: 10
    },
    loading: false,
    error: null
  }),

  getters: {
    hasOrders: (state): boolean => state.orders.length > 0,

    paidOrders: (state): Order[] =>
      state.orders.filter(o => o.status === 'paid'),

    pendingOrders: (state): Order[] =>
      state.orders.filter(o => o.status === 'pending' || o.status === 'processing'),

    failedOrders: (state): Order[] =>
      state.orders.filter(o => o.status === 'failed'),

    totalRevenue: (state): number =>
      state.orders
        .filter(o => o.status === 'paid')
        .reduce((sum, o) => sum + o.total, 0),

    hasActiveFilters: (state): boolean => {
      return !!(
        state.filters.search ||
        state.filters.client_id ||
        state.filters.status ||
        state.filters.type ||
        state.filters.payment_method ||
        state.filters.date_from ||
        state.filters.date_to
      )
    },

    leadsCount: (state): number => {
      if (!state.currentOrder?.items) return 0
      return state.currentOrder.items.reduce((sum, item) => {
        if (item.package) return sum + item.package.lead_quantity
        return sum + item.quantity
      }, 0)
    }
  },

  actions: {
    async fetchOrders() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()

        const query: Record<string, unknown> = {
          page: this.filters.page || 1,
          per_page: this.filters.per_page || 10
        }

        if (this.filters.search) query.search = this.filters.search
        if (this.filters.client_id) query.client_id = this.filters.client_id
        if (this.filters.status) query.status = this.filters.status
        if (this.filters.type) query.type = this.filters.type
        if (this.filters.payment_method) query.payment_method = this.filters.payment_method
        if (this.filters.date_from) query.date_from = this.filters.date_from
        if (this.filters.date_to) query.date_to = this.filters.date_to
        if (this.filters.sort_by) query.sort_by = this.filters.sort_by
        if (this.filters.sort_order) query.sort_order = this.filters.sort_order

        const { data, error } = await client.GET('/admin/orders', {
          params: { query } as any
        })
        if (error) throw error

        this.orders = (data as any).data
        this.pagination = (data as any).meta
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchOrders error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchOrder(id: number) {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()

        const { data, error } = await client.GET('/admin/orders/{order}', {
          params: { path: { order: id } }
        })
        if (error) throw error

        this.currentOrder = (data as any).data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchOrder error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchStats() {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: OrderStats }>(`${config.public.apiBase}/admin/orders/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })
        this.stats = response.data
      } catch (error: any) {
        console.error('fetchStats error:', error)
      }
    },

    setFilters(filters: Partial<OrderFilters>) {
      this.filters = { ...this.filters, ...filters, page: 1 }
    },

    resetFilters() {
      this.filters = {
        search: '',
        client_id: null,
        status: '',
        type: '',
        payment_method: '',
        date_from: '',
        date_to: '',
        sort_by: 'created_at',
        sort_order: 'desc',
        page: 1,
        per_page: 10
      }
    },

    clearState() {
      this.orders = []
      this.currentOrder = null
      this.stats = null
      this.error = null
    }
  }
})
