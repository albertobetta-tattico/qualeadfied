/**
 * Store - Client Orders
 * Pinia store for client order history
 */
import { defineStore } from 'pinia'
import type { Category, Province } from '~/types/lead'
import type {
  Order,
  OrderDetail,
  OrderItem,
  OrderBillingData,
  OrderFilters,
  OrderStatus,
  OrderType,
  PaginationMeta
} from '~/types/clientArea'

const USE_MOCK_DATA = true

// Mock categories and provinces
const mockCategories: Record<number, Category> = {
  1: { id: 1, name: 'Ristrutturazioni', slug: 'ristrutturazioni', max_shares: 5, is_active: true, sort_order: 1, deleted_at: null, created_at: '', updated_at: '' },
  2: { id: 2, name: 'Fotovoltaico', slug: 'fotovoltaico', max_shares: 4, is_active: true, sort_order: 2, deleted_at: null, created_at: '', updated_at: '' }
}

const mockProvinces: Record<number, Province> = {
  1: { id: 1, name: 'Milano', code: 'MI', region: 'Lombardia', is_active: true },
  2: { id: 2, name: 'Roma', code: 'RM', region: 'Lazio', is_active: true }
}

// Mock billing data
const mockBillingData: OrderBillingData = {
  company_name: 'Rossi Costruzioni S.r.l.',
  vat_number: 'IT12345678901',
  address: 'Via Roma 123',
  city: 'Milano',
  province: 'MI',
  zip: '20100',
  country: 'IT',
  sdi_code: 'ABC1234',
  pec_email: 'rossisrl@pec.it'
}

// Mock orders
const mockOrders: Order[] = [
  {
    id: 1001,
    order_number: 'ORD-2025-00001',
    user_id: 1,
    order_type: 'single',
    status: 'completed',
    subtotal: 60,
    vat_rate: 22,
    vat_amount: 13.2,
    total: 73.2,
    payment_method: 'card',
    payment_id: 'pi_123456',
    paid_at: '2025-01-10T10:05:00Z',
    items_count: 2,
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-10T10:05:00Z',
    invoice_number: 'FT-2025-00001',
    invoice_url: '/invoices/FT-2025-00001.pdf'
  },
  {
    id: 1002,
    order_number: 'ORD-2025-00002',
    user_id: 1,
    order_type: 'package',
    status: 'completed',
    subtotal: 449,
    vat_rate: 22,
    vat_amount: 98.78,
    total: 547.78,
    payment_method: 'card',
    payment_id: 'pi_234567',
    paid_at: '2025-01-08T14:30:00Z',
    items_count: 25,
    created_at: '2025-01-08T14:25:00Z',
    updated_at: '2025-01-08T14:30:00Z',
    invoice_number: 'FT-2025-00002',
    invoice_url: '/invoices/FT-2025-00002.pdf'
  },
  {
    id: 1003,
    order_number: 'ORD-2025-00003',
    user_id: 1,
    order_type: 'single',
    status: 'completed',
    subtotal: 45,
    vat_rate: 22,
    vat_amount: 9.9,
    total: 54.9,
    payment_method: 'sepa',
    payment_id: 'seti_345678',
    paid_at: '2025-01-14T08:10:00Z',
    items_count: 1,
    created_at: '2025-01-14T08:00:00Z',
    updated_at: '2025-01-14T08:10:00Z',
    invoice_number: 'FT-2025-00003',
    invoice_url: '/invoices/FT-2025-00003.pdf'
  },
  {
    id: 1000,
    order_number: 'ORD-2025-00000',
    user_id: 1,
    order_type: 'free_trial',
    status: 'completed',
    subtotal: 0,
    vat_rate: 22,
    vat_amount: 0,
    total: 0,
    payment_method: 'free',
    payment_id: null,
    paid_at: '2025-01-05T09:00:00Z',
    items_count: 3,
    created_at: '2025-01-05T09:00:00Z',
    updated_at: '2025-01-05T09:00:00Z',
    invoice_number: null,
    invoice_url: null
  }
]

// Mock order items
const mockOrderItems: Record<number, OrderItem[]> = {
  1001: [
    {
      id: 1,
      order_id: 1001,
      lead_id: 101,
      purchase_mode: 'exclusive',
      price: 45,
      lead: {
        id: 101,
        category_id: 1,
        province_id: 1,
        first_name: 'Marco',
        last_name: 'Rossi',
        request_text: 'Richiesta ristrutturazione appartamento...',
        generated_at: '2025-01-09T15:00:00Z',
        category: mockCategories[1],
        province: mockProvinces[1]
      }
    },
    {
      id: 2,
      order_id: 1001,
      lead_id: 102,
      purchase_mode: 'shared',
      price: 15,
      lead: {
        id: 102,
        category_id: 2,
        province_id: 2,
        first_name: 'Anna',
        last_name: 'Bianchi',
        request_text: 'Interessata a impianto fotovoltaico...',
        generated_at: '2025-01-07T10:00:00Z',
        category: mockCategories[2],
        province: mockProvinces[2]
      }
    }
  ],
  1003: [
    {
      id: 3,
      order_id: 1003,
      lead_id: 104,
      purchase_mode: 'exclusive',
      price: 45,
      lead: {
        id: 104,
        category_id: 1,
        province_id: 1,
        first_name: 'Laura',
        last_name: 'Neri',
        request_text: 'Ristrutturazione bagno zona Navigli...',
        generated_at: '2025-01-13T18:00:00Z',
        category: mockCategories[1],
        province: mockProvinces[1]
      }
    }
  ]
}

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
      return state.orders.reduce((sum, order) => sum + order.total, 0)
    },

    completedOrders: (state): Order[] => {
      return state.orders.filter(o => o.status === 'completed')
    },

    orderById: (state) => (id: number): Order | undefined => {
      return state.orders.find(o => o.id === id)
    }
  },

  actions: {
    /**
     * Fetch orders
     */
    async fetchOrders(): Promise<void> {
      const { t } = useI18n()
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))

          // Apply filters
          let filteredOrders = [...mockOrders]

          if (this.filters.status) {
            filteredOrders = filteredOrders.filter(o => o.status === this.filters.status)
          }

          if (this.filters.order_type) {
            filteredOrders = filteredOrders.filter(o => o.order_type === this.filters.order_type)
          }

          // Sort by date (most recent first)
          filteredOrders.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )

          // Pagination
          const total = filteredOrders.length
          const perPage = this.filters.per_page || 20
          const page = this.filters.page || 1
          const start = (page - 1) * perPage
          const end = start + perPage

          this.orders = filteredOrders.slice(start, end)
          this.pagination = {
            current_page: page,
            last_page: Math.ceil(total / perPage),
            per_page: perPage,
            total: total,
            from: start + 1,
            to: Math.min(end, total)
          }

          return
        }

        const params = new URLSearchParams()
        if (this.filters.status) params.set('status', this.filters.status)
        if (this.filters.order_type) params.set('order_type', this.filters.order_type)
        if (this.filters.date_from) params.set('date_from', this.filters.date_from)
        if (this.filters.date_to) params.set('date_to', this.filters.date_to)
        if (this.filters.page) params.set('page', String(this.filters.page))
        if (this.filters.per_page) params.set('per_page', String(this.filters.per_page))

        const response = await $fetch<{ data: Order[]; meta: PaginationMeta }>(`/api/client/orders?${params}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        this.orders = response.data
        this.pagination = response.meta
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.loadError')
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch order details
     */
    async fetchOrder(id: number): Promise<OrderDetail | null> {
      const { t } = useI18n()
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))

          const order = mockOrders.find(o => o.id === id)
          if (!order) {
            this.error = t('common.errors.notFound')
            return null
          }

          const orderDetail: OrderDetail = {
            ...order,
            items: mockOrderItems[id] || [],
            billing_data: mockBillingData
          }

          this.currentOrder = orderDetail
          return orderDetail
        }

        const response = await $fetch<{ data: OrderDetail }>(`/api/client/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        this.currentOrder = response.data
        return response.data
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.loadError')
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * Download invoice
     */
    async downloadInvoice(orderId: number): Promise<string | null> {
      const { t } = useI18n()
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          const order = mockOrders.find(o => o.id === orderId)
          return order?.invoice_url || null
        }

        const response = await $fetch<{ data: { url: string } }>(`/api/client/orders/${orderId}/invoice`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        return response.data.url
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.downloadError')
        return null
      }
    },

    /**
     * Set filters
     */
    setFilters(filters: Partial<OrderFilters>): void {
      this.filters = { ...this.filters, ...filters, page: 1 }
    },

    /**
     * Reset filters
     */
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

    /**
     * Set page
     */
    setPage(page: number): void {
      this.filters.page = page
    },

    /**
     * Clear current order
     */
    clearCurrentOrder(): void {
      this.currentOrder = null
    }
  }
})
