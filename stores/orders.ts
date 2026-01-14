/**
 * Orders Store - Gestione Ordini
 * Qualeadfied B2B Lead Platform
 */

import { defineStore } from 'pinia'
import type { 
  Order, 
  OrderWithDetails,
  OrderFilters, 
  OrderStats,
  OrderType,
  OrderStatus,
  PaymentMethod,
  OrderItem
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

// Mock data per sviluppo
const mockOrders: Order[] = [
  {
    id: 1,
    user_id: 1,
    order_number: 'ORD-2025-00001',
    type: 'single',
    payment_method: 'card',
    subtotal: 150.00,
    vat_rate: 22,
    vat_amount: 33.00,
    total: 183.00,
    status: 'paid',
    billing_snapshot: {
      company_name: 'Azienda Alpha Srl',
      vat_number: '12345678901',
      address: 'Via Roma 1',
      city: 'Milano',
      province: 'MI',
      postal_code: '20100',
      country: 'IT',
      sdi_code: 'XXXXXXX',
      pec: 'alpha@pec.it'
    },
    paid_at: '2025-01-10T14:30:00Z',
    created_at: '2025-01-10T14:25:00Z',
    updated_at: '2025-01-10T14:30:00Z',
    client: {
      id: 1,
      company_name: 'Azienda Alpha Srl',
      vat_number: '12345678901',
      email: 'info@alpha.it',
      contact_first_name: 'Mario',
      contact_last_name: 'Rossi'
    }
  },
  {
    id: 2,
    user_id: 2,
    order_number: 'ORD-2025-00002',
    type: 'package',
    payment_method: 'sepa',
    subtotal: 500.00,
    vat_rate: 22,
    vat_amount: 110.00,
    total: 610.00,
    status: 'processing',
    billing_snapshot: {
      company_name: 'Beta Solutions SpA',
      vat_number: '98765432109',
      address: 'Via Nazionale 50',
      city: 'Roma',
      province: 'RM',
      postal_code: '00100',
      country: 'IT',
      sdi_code: 'YYYYYYY',
      pec: 'beta@pec.it'
    },
    paid_at: null,
    created_at: '2025-01-12T09:15:00Z',
    updated_at: '2025-01-12T09:15:00Z',
    client: {
      id: 2,
      company_name: 'Beta Solutions SpA',
      vat_number: '98765432109',
      email: 'contact@beta.it',
      contact_first_name: 'Laura',
      contact_last_name: 'Bianchi'
    }
  },
  {
    id: 3,
    user_id: 3,
    order_number: 'ORD-2025-00003',
    type: 'free_trial',
    payment_method: 'free',
    subtotal: 0,
    vat_rate: 22,
    vat_amount: 0,
    total: 0,
    status: 'paid',
    billing_snapshot: {
      company_name: 'Gamma Tech Srl',
      vat_number: '11223344556',
      address: 'Corso Francia 100',
      city: 'Torino',
      province: 'TO',
      postal_code: '10100',
      country: 'IT',
      sdi_code: '',
      pec: 'gamma@pec.it'
    },
    paid_at: '2025-01-15T11:00:00Z',
    created_at: '2025-01-15T11:00:00Z',
    updated_at: '2025-01-15T11:00:00Z',
    client: {
      id: 3,
      company_name: 'Gamma Tech Srl',
      vat_number: '11223344556',
      email: 'hello@gamma.it',
      contact_first_name: 'Paolo',
      contact_last_name: 'Verdi'
    }
  },
  {
    id: 4,
    user_id: 1,
    order_number: 'ORD-2025-00004',
    type: 'single',
    payment_method: 'card',
    subtotal: 75.00,
    vat_rate: 22,
    vat_amount: 16.50,
    total: 91.50,
    status: 'failed',
    billing_snapshot: {
      company_name: 'Azienda Alpha Srl',
      vat_number: '12345678901',
      address: 'Via Roma 1',
      city: 'Milano',
      province: 'MI',
      postal_code: '20100',
      country: 'IT',
      sdi_code: 'XXXXXXX',
      pec: 'alpha@pec.it'
    },
    paid_at: null,
    created_at: '2025-01-14T16:45:00Z',
    updated_at: '2025-01-14T16:50:00Z',
    client: {
      id: 1,
      company_name: 'Azienda Alpha Srl',
      vat_number: '12345678901',
      email: 'info@alpha.it',
      contact_first_name: 'Mario',
      contact_last_name: 'Rossi'
    }
  },
  {
    id: 5,
    user_id: 5,
    order_number: 'ORD-2025-00005',
    type: 'package',
    payment_method: 'card',
    subtotal: 1000.00,
    vat_rate: 22,
    vat_amount: 220.00,
    total: 1220.00,
    status: 'paid',
    billing_snapshot: {
      company_name: 'Epsilon Ltd',
      vat_number: '44332211009',
      address: 'Via Indipendenza 25',
      city: 'Bologna',
      province: 'BO',
      postal_code: '40100',
      country: 'IT',
      sdi_code: 'AAAAAAA',
      pec: 'epsilon@pec.it'
    },
    paid_at: '2025-01-13T10:20:00Z',
    created_at: '2025-01-13T10:15:00Z',
    updated_at: '2025-01-13T10:20:00Z',
    client: {
      id: 5,
      company_name: 'Epsilon Ltd',
      vat_number: '44332211009',
      email: 'office@epsilon.it',
      contact_first_name: 'Luca',
      contact_last_name: 'Neri'
    }
  },
  {
    id: 6,
    user_id: 6,
    order_number: 'ORD-2025-00006',
    type: 'single',
    payment_method: 'sepa',
    subtotal: 225.00,
    vat_rate: 22,
    vat_amount: 49.50,
    total: 274.50,
    status: 'pending',
    billing_snapshot: {
      company_name: 'Zeta Industries',
      vat_number: '99887766554',
      address: 'Via dei Calzaiuoli 5',
      city: 'Firenze',
      province: 'FI',
      postal_code: '50100',
      country: 'IT',
      sdi_code: 'BBBBBBB',
      pec: 'zeta@pec.it'
    },
    paid_at: null,
    created_at: '2025-01-16T08:30:00Z',
    updated_at: '2025-01-16T08:30:00Z',
    client: {
      id: 6,
      company_name: 'Zeta Industries',
      vat_number: '99887766554',
      email: 'info@zeta.it',
      contact_first_name: 'Giulia',
      contact_last_name: 'Russo'
    }
  },
  {
    id: 7,
    user_id: 2,
    order_number: 'ORD-2025-00007',
    type: 'single',
    payment_method: 'card',
    subtotal: 300.00,
    vat_rate: 22,
    vat_amount: 66.00,
    total: 366.00,
    status: 'refunded',
    billing_snapshot: {
      company_name: 'Beta Solutions SpA',
      vat_number: '98765432109',
      address: 'Via Nazionale 50',
      city: 'Roma',
      province: 'RM',
      postal_code: '00100',
      country: 'IT',
      sdi_code: 'YYYYYYY',
      pec: 'beta@pec.it'
    },
    paid_at: '2025-01-08T15:00:00Z',
    created_at: '2025-01-08T14:55:00Z',
    updated_at: '2025-01-11T09:00:00Z',
    client: {
      id: 2,
      company_name: 'Beta Solutions SpA',
      vat_number: '98765432109',
      email: 'contact@beta.it',
      contact_first_name: 'Laura',
      contact_last_name: 'Bianchi'
    }
  },
  {
    id: 8,
    user_id: 5,
    order_number: 'ORD-2025-00008',
    type: 'single',
    payment_method: 'card',
    subtotal: 50.00,
    vat_rate: 22,
    vat_amount: 11.00,
    total: 61.00,
    status: 'cancelled',
    billing_snapshot: {
      company_name: 'Epsilon Ltd',
      vat_number: '44332211009',
      address: 'Via Indipendenza 25',
      city: 'Bologna',
      province: 'BO',
      postal_code: '40100',
      country: 'IT',
      sdi_code: 'AAAAAAA',
      pec: 'epsilon@pec.it'
    },
    paid_at: null,
    created_at: '2025-01-09T12:00:00Z',
    updated_at: '2025-01-09T12:30:00Z',
    client: {
      id: 5,
      company_name: 'Epsilon Ltd',
      vat_number: '44332211009',
      email: 'office@epsilon.it',
      contact_first_name: 'Luca',
      contact_last_name: 'Neri'
    }
  }
]

// Mock items per ordine dettagliato
const mockOrderItems: Record<number, OrderItem[]> = {
  1: [
    {
      id: 1,
      order_id: 1,
      lead_id: 101,
      package_id: null,
      acquisition_mode: 'exclusive',
      unit_price: 50.00,
      quantity: 1,
      line_total: 50.00,
      lead: {
        id: 101,
        first_name: 'Marco',
        last_name: 'Bianchi',
        email: 'marco.bianchi@email.it',
        phone: '333 1234567',
        category_name: 'Pannelli Solari',
        province_code: 'MI'
      }
    },
    {
      id: 2,
      order_id: 1,
      lead_id: 102,
      package_id: null,
      acquisition_mode: 'shared',
      unit_price: 25.00,
      quantity: 1,
      line_total: 25.00,
      lead: {
        id: 102,
        first_name: 'Giovanna',
        last_name: 'Verdi',
        email: 'giovanna.verdi@email.it',
        phone: '335 9876543',
        category_name: 'Pannelli Solari',
        province_code: 'MI'
      }
    },
    {
      id: 3,
      order_id: 1,
      lead_id: 103,
      package_id: null,
      acquisition_mode: 'exclusive',
      unit_price: 75.00,
      quantity: 1,
      line_total: 75.00,
      lead: {
        id: 103,
        first_name: 'Stefano',
        last_name: 'Rossi',
        email: 'stefano.rossi@email.it',
        phone: '340 5551234',
        category_name: 'Caldaie',
        province_code: 'LO'
      }
    }
  ],
  2: [
    {
      id: 4,
      order_id: 2,
      lead_id: null,
      package_id: 1,
      acquisition_mode: 'shared',
      unit_price: 500.00,
      quantity: 1,
      line_total: 500.00,
      package: {
        id: 1,
        name: 'Pacchetto 50 Lead - Pannelli Solari',
        lead_quantity: 50,
        category_name: 'Pannelli Solari'
      }
    }
  ],
  3: [
    {
      id: 5,
      order_id: 3,
      lead_id: 104,
      package_id: null,
      acquisition_mode: 'free',
      unit_price: 0,
      quantity: 1,
      line_total: 0,
      lead: {
        id: 104,
        first_name: 'Anna',
        last_name: 'Neri',
        email: 'anna.neri@email.it',
        phone: '347 1112233',
        category_name: 'Finestre',
        province_code: 'TO'
      }
    },
    {
      id: 6,
      order_id: 3,
      lead_id: 105,
      package_id: null,
      acquisition_mode: 'free',
      unit_price: 0,
      quantity: 1,
      line_total: 0,
      lead: {
        id: 105,
        first_name: 'Pietro',
        last_name: 'Belli',
        email: 'pietro.belli@email.it',
        phone: '348 4445566',
        category_name: 'Finestre',
        province_code: 'TO'
      }
    },
    {
      id: 7,
      order_id: 3,
      lead_id: 106,
      package_id: null,
      acquisition_mode: 'free',
      unit_price: 0,
      quantity: 1,
      line_total: 0,
      lead: {
        id: 106,
        first_name: 'Claudia',
        last_name: 'Ferri',
        email: 'claudia.ferri@email.it',
        phone: '349 7778899',
        category_name: 'Finestre',
        province_code: 'TO'
      }
    }
  ],
  5: [
    {
      id: 8,
      order_id: 5,
      lead_id: null,
      package_id: 2,
      acquisition_mode: 'exclusive',
      unit_price: 1000.00,
      quantity: 1,
      line_total: 1000.00,
      package: {
        id: 2,
        name: 'Pacchetto 100 Lead - Caldaie',
        lead_quantity: 100,
        category_name: 'Caldaie'
      }
    }
  ]
}

// Flag per usare mock data (true in dev, false in prod)
const USE_MOCK_DATA = true

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
    /**
     * Carica lista ordini con filtri e paginazione
     */
    async fetchOrders() {
      this.loading = true
      this.error = null
      
      try {
        if (USE_MOCK_DATA) {
          // Simula delay di rete
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Applica filtri ai mock data
          let filtered = [...mockOrders]
          
          // Filtro ricerca (numero ordine, nome cliente)
          if (this.filters.search) {
            const search = this.filters.search.toLowerCase()
            filtered = filtered.filter(o => 
              o.order_number.toLowerCase().includes(search) ||
              o.client?.company_name.toLowerCase().includes(search) ||
              o.client?.email.toLowerCase().includes(search)
            )
          }
          
          // Filtro cliente
          if (this.filters.client_id) {
            filtered = filtered.filter(o => o.user_id === this.filters.client_id)
          }
          
          // Filtro stato
          if (this.filters.status) {
            filtered = filtered.filter(o => o.status === this.filters.status)
          }
          
          // Filtro tipo
          if (this.filters.type) {
            filtered = filtered.filter(o => o.type === this.filters.type)
          }
          
          // Filtro metodo pagamento
          if (this.filters.payment_method) {
            filtered = filtered.filter(o => o.payment_method === this.filters.payment_method)
          }
          
          // Filtro data
          if (this.filters.date_from) {
            const from = new Date(this.filters.date_from)
            filtered = filtered.filter(o => new Date(o.created_at) >= from)
          }
          if (this.filters.date_to) {
            const to = new Date(this.filters.date_to)
            to.setHours(23, 59, 59, 999)
            filtered = filtered.filter(o => new Date(o.created_at) <= to)
          }
          
          // Ordinamento
          const sortField = this.filters.sort_by || 'created_at'
          const sortOrder = this.filters.sort_order === 'asc' ? 1 : -1
          filtered.sort((a, b) => {
            const aVal = (a as any)[sortField]
            const bVal = (b as any)[sortField]
            if (typeof aVal === 'string') {
              return aVal.localeCompare(bVal) * sortOrder
            }
            return ((aVal || 0) - (bVal || 0)) * sortOrder
          })
          
          // Paginazione
          const page = this.filters.page || 1
          const perPage = this.filters.per_page || 10
          const start = (page - 1) * perPage
          const end = start + perPage
          
          this.orders = filtered.slice(start, end)
          this.pagination = {
            current_page: page,
            last_page: Math.ceil(filtered.length / perPage),
            per_page: perPage,
            total: filtered.length
          }
          return
        }
        
        // Chiamata API reale
        const { api } = useApi()
        const params = new URLSearchParams()
        
        if (this.filters.search) params.append('search', this.filters.search)
        if (this.filters.client_id) params.append('client_id', String(this.filters.client_id))
        if (this.filters.status) params.append('status', this.filters.status)
        if (this.filters.type) params.append('type', this.filters.type)
        if (this.filters.payment_method) params.append('payment_method', this.filters.payment_method)
        if (this.filters.date_from) params.append('date_from', this.filters.date_from)
        if (this.filters.date_to) params.append('date_to', this.filters.date_to)
        if (this.filters.sort_by) params.append('sort_by', this.filters.sort_by)
        if (this.filters.sort_order) params.append('sort_order', this.filters.sort_order)
        params.append('page', String(this.filters.page || 1))
        params.append('per_page', String(this.filters.per_page || 10))
        
        const response = await api<{ data: Order[], meta: PaginationMeta }>(
          `/admin/orders?${params.toString()}`
        )
        
        this.orders = response.data
        this.pagination = response.meta
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento ordini'
        console.error('fetchOrders error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Carica singolo ordine con dettagli completi
     */
    async fetchOrder(id: number) {
      this.loading = true
      this.error = null
      
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          const order = mockOrders.find(o => o.id === id)
          if (order) {
            const items = mockOrderItems[id] || []
            this.currentOrder = {
              ...order,
              client: order.client!,
              items,
              transaction: order.status === 'paid' || order.status === 'refunded' ? {
                id: id * 10,
                stripe_payment_intent_id: `pi_${Math.random().toString(36).substr(2, 24)}`,
                stripe_charge_id: `ch_${Math.random().toString(36).substr(2, 24)}`,
                payment_type: order.payment_method === 'sepa' ? 'sepa_debit' : 'card',
                amount: order.total,
                currency: 'EUR',
                status: order.status === 'refunded' ? 'refunded' : 'succeeded',
                processed_at: order.paid_at
              } : undefined,
              invoice: order.status === 'paid' ? {
                id: id * 100,
                invoice_number: `FT-2025-${String(id).padStart(5, '0')}`,
                fatture_cloud_id: `fc_${Math.random().toString(36).substr(2, 10)}`,
                sdi_status: 'delivered',
                issued_at: order.paid_at || order.created_at
              } : undefined
            } as OrderWithDetails
          } else {
            this.currentOrder = null
            this.error = 'Ordine non trovato'
          }
          return
        }
        
        const { api } = useApi()
        const response = await api<{ data: OrderWithDetails }>(`/admin/orders/${id}`)
        this.currentOrder = response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento ordine'
        console.error('fetchOrder error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Carica statistiche ordini
     */
    async fetchStats() {
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          
          const now = new Date()
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          const weekAgo = new Date(today)
          weekAgo.setDate(weekAgo.getDate() - 7)
          const monthAgo = new Date(today)
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          
          const paidOrders = mockOrders.filter(o => o.status === 'paid')
          const todayOrders = paidOrders.filter(o => new Date(o.created_at) >= today)
          const weekOrders = paidOrders.filter(o => new Date(o.created_at) >= weekAgo)
          const monthOrders = paidOrders.filter(o => new Date(o.created_at) >= monthAgo)
          
          this.stats = {
            total_orders: mockOrders.length,
            total_revenue: paidOrders.reduce((sum, o) => sum + o.total, 0),
            orders_today: todayOrders.length,
            revenue_today: todayOrders.reduce((sum, o) => sum + o.total, 0),
            orders_this_week: weekOrders.length,
            revenue_this_week: weekOrders.reduce((sum, o) => sum + o.total, 0),
            orders_this_month: monthOrders.length,
            revenue_this_month: monthOrders.reduce((sum, o) => sum + o.total, 0),
            orders_by_status: {
              pending: mockOrders.filter(o => o.status === 'pending').length,
              processing: mockOrders.filter(o => o.status === 'processing').length,
              paid: mockOrders.filter(o => o.status === 'paid').length,
              failed: mockOrders.filter(o => o.status === 'failed').length,
              refunded: mockOrders.filter(o => o.status === 'refunded').length,
              cancelled: mockOrders.filter(o => o.status === 'cancelled').length
            },
            orders_by_type: {
              single: mockOrders.filter(o => o.type === 'single').length,
              package: mockOrders.filter(o => o.type === 'package').length,
              free_trial: mockOrders.filter(o => o.type === 'free_trial').length
            },
            average_order_value: paidOrders.length > 0 
              ? paidOrders.reduce((sum, o) => sum + o.total, 0) / paidOrders.length 
              : 0
          }
          return
        }
        
        const { api } = useApi()
        const response = await api<{ data: OrderStats }>('/admin/orders/stats')
        this.stats = response.data
      } catch (error: any) {
        console.error('fetchStats error:', error)
      }
    },

    /**
     * Imposta filtri
     */
    setFilters(filters: Partial<OrderFilters>) {
      this.filters = { ...this.filters, ...filters, page: 1 }
    },

    /**
     * Reset filtri
     */
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

    /**
     * Pulisci stato
     */
    clearState() {
      this.orders = []
      this.currentOrder = null
      this.stats = null
      this.error = null
    }
  }
})
