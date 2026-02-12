/**
 * Transactions Store - Gestione Transazioni Stripe
 * Qualeadfied B2B Lead Platform
 */

import { defineStore } from 'pinia'
import type { 
  Transaction, 
  TransactionWithDetails,
  TransactionFilters, 
  TransactionStats,
  TransactionStatus,
  TransactionPaymentType,
  TransactionEvent,
  TransactionRefund
} from '~/types/transaction'

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface TransactionState {
  transactions: Transaction[]
  currentTransaction: TransactionWithDetails | null
  stats: TransactionStats | null
  pagination: PaginationMeta
  filters: TransactionFilters
  loading: boolean
  error: string | null
}

// Mock data per sviluppo
const mockTransactions: Transaction[] = [
  {
    id: 1,
    order_id: 1,
    stripe_payment_intent_id: 'pi_3PQ1234567890abcdefghij',
    stripe_charge_id: 'ch_3PQ1234567890abcdefghij',
    stripe_customer_id: 'cus_PQ1234567890',
    stripe_payment_method_id: 'pm_1PQ1234567890abcd',
    payment_type: 'card',
    amount: 183.00,
    currency: 'EUR',
    status: 'succeeded',
    stripe_response: {
      id: 'pi_3PQ1234567890abcdefghij',
      object: 'payment_intent',
      amount: 18300,
      currency: 'eur',
      status: 'succeeded'
    },
    metadata: {
      order_id: '1',
      order_number: 'ORD-2025-00001',
      client_id: '1'
    },
    failure_code: null,
    failure_message: null,
    processed_at: '2025-01-10T14:30:00Z',
    created_at: '2025-01-10T14:25:00Z',
    updated_at: '2025-01-10T14:30:00Z',
    order: {
      id: 1,
      order_number: 'ORD-2025-00001',
      type: 'single',
      total: 183.00,
      status: 'paid',
      created_at: '2025-01-10T14:25:00Z'
    },
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
    order_id: 2,
    stripe_payment_intent_id: 'pi_3PQ2345678901bcdefghijk',
    stripe_charge_id: null,
    stripe_customer_id: 'cus_PQ2345678901',
    stripe_payment_method_id: 'pm_1PQ2345678901bcde',
    payment_type: 'sepa_debit',
    amount: 610.00,
    currency: 'EUR',
    status: 'processing',
    stripe_response: {
      id: 'pi_3PQ2345678901bcdefghijk',
      object: 'payment_intent',
      amount: 61000,
      currency: 'eur',
      status: 'processing'
    },
    metadata: {
      order_id: '2',
      order_number: 'ORD-2025-00002',
      client_id: '2'
    },
    failure_code: null,
    failure_message: null,
    processed_at: null,
    created_at: '2025-01-12T09:15:00Z',
    updated_at: '2025-01-12T09:15:00Z',
    order: {
      id: 2,
      order_number: 'ORD-2025-00002',
      type: 'package',
      total: 610.00,
      status: 'processing',
      created_at: '2025-01-12T09:15:00Z'
    },
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
    order_id: 4,
    stripe_payment_intent_id: 'pi_3PQ3456789012cdefghijkl',
    stripe_charge_id: 'ch_3PQ3456789012cdefghijkl',
    stripe_customer_id: 'cus_PQ1234567890',
    stripe_payment_method_id: 'pm_1PQ3456789012cdef',
    payment_type: 'card',
    amount: 91.50,
    currency: 'EUR',
    status: 'failed',
    stripe_response: {
      id: 'pi_3PQ3456789012cdefghijkl',
      object: 'payment_intent',
      amount: 9150,
      currency: 'eur',
      status: 'requires_payment_method',
      last_payment_error: {
        code: 'card_declined',
        message: 'La carta è stata rifiutata'
      }
    },
    metadata: {
      order_id: '4',
      order_number: 'ORD-2025-00004',
      client_id: '1'
    },
    failure_code: 'card_declined',
    failure_message: 'La carta è stata rifiutata. Fondi insufficienti.',
    processed_at: '2025-01-14T16:50:00Z',
    created_at: '2025-01-14T16:45:00Z',
    updated_at: '2025-01-14T16:50:00Z',
    order: {
      id: 4,
      order_number: 'ORD-2025-00004',
      type: 'single',
      total: 91.50,
      status: 'failed',
      created_at: '2025-01-14T16:45:00Z'
    },
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
    id: 4,
    order_id: 5,
    stripe_payment_intent_id: 'pi_3PQ4567890123defghijklm',
    stripe_charge_id: 'ch_3PQ4567890123defghijklm',
    stripe_customer_id: 'cus_PQ4567890123',
    stripe_payment_method_id: 'pm_1PQ4567890123defg',
    payment_type: 'card',
    amount: 1220.00,
    currency: 'EUR',
    status: 'succeeded',
    stripe_response: {
      id: 'pi_3PQ4567890123defghijklm',
      object: 'payment_intent',
      amount: 122000,
      currency: 'eur',
      status: 'succeeded'
    },
    metadata: {
      order_id: '5',
      order_number: 'ORD-2025-00005',
      client_id: '5'
    },
    failure_code: null,
    failure_message: null,
    processed_at: '2025-01-13T10:20:00Z',
    created_at: '2025-01-13T10:15:00Z',
    updated_at: '2025-01-13T10:20:00Z',
    order: {
      id: 5,
      order_number: 'ORD-2025-00005',
      type: 'package',
      total: 1220.00,
      status: 'paid',
      created_at: '2025-01-13T10:15:00Z'
    },
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
    id: 5,
    order_id: 6,
    stripe_payment_intent_id: 'pi_3PQ5678901234efghijklmn',
    stripe_charge_id: null,
    stripe_customer_id: 'cus_PQ5678901234',
    stripe_payment_method_id: 'pm_1PQ5678901234efgh',
    payment_type: 'sepa_debit',
    amount: 274.50,
    currency: 'EUR',
    status: 'pending',
    stripe_response: {
      id: 'pi_3PQ5678901234efghijklmn',
      object: 'payment_intent',
      amount: 27450,
      currency: 'eur',
      status: 'requires_confirmation'
    },
    metadata: {
      order_id: '6',
      order_number: 'ORD-2025-00006',
      client_id: '6'
    },
    failure_code: null,
    failure_message: null,
    processed_at: null,
    created_at: '2025-01-16T08:30:00Z',
    updated_at: '2025-01-16T08:30:00Z',
    order: {
      id: 6,
      order_number: 'ORD-2025-00006',
      type: 'single',
      total: 274.50,
      status: 'pending',
      created_at: '2025-01-16T08:30:00Z'
    },
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
    id: 6,
    order_id: 7,
    stripe_payment_intent_id: 'pi_3PQ6789012345fghijklmno',
    stripe_charge_id: 'ch_3PQ6789012345fghijklmno',
    stripe_customer_id: 'cus_PQ2345678901',
    stripe_payment_method_id: 'pm_1PQ6789012345fghi',
    payment_type: 'card',
    amount: 366.00,
    currency: 'EUR',
    status: 'succeeded',
    stripe_response: {
      id: 'pi_3PQ6789012345fghijklmno',
      object: 'payment_intent',
      amount: 36600,
      currency: 'eur',
      status: 'succeeded'
    },
    metadata: {
      order_id: '7',
      order_number: 'ORD-2025-00007',
      client_id: '2'
    },
    failure_code: null,
    failure_message: null,
    processed_at: '2025-01-08T15:00:00Z',
    created_at: '2025-01-08T14:55:00Z',
    updated_at: '2025-01-11T09:00:00Z',
    order: {
      id: 7,
      order_number: 'ORD-2025-00007',
      type: 'single',
      total: 366.00,
      status: 'refunded',
      created_at: '2025-01-08T14:55:00Z'
    },
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
    id: 7,
    order_id: 8,
    stripe_payment_intent_id: 'pi_3PQ7890123456ghijklmnop',
    stripe_charge_id: null,
    stripe_customer_id: 'cus_PQ4567890123',
    stripe_payment_method_id: 'pm_1PQ7890123456ghij',
    payment_type: 'card',
    amount: 61.00,
    currency: 'EUR',
    status: 'canceled',
    stripe_response: {
      id: 'pi_3PQ7890123456ghijklmnop',
      object: 'payment_intent',
      amount: 6100,
      currency: 'eur',
      status: 'canceled'
    },
    metadata: {
      order_id: '8',
      order_number: 'ORD-2025-00008',
      client_id: '5'
    },
    failure_code: null,
    failure_message: null,
    processed_at: '2025-01-09T12:30:00Z',
    created_at: '2025-01-09T12:00:00Z',
    updated_at: '2025-01-09T12:30:00Z',
    order: {
      id: 8,
      order_number: 'ORD-2025-00008',
      type: 'single',
      total: 61.00,
      status: 'cancelled',
      created_at: '2025-01-09T12:00:00Z'
    },
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
    id: 8,
    order_id: 9,
    stripe_payment_intent_id: 'pi_3PQ8901234567hijklmnopq',
    stripe_charge_id: 'ch_3PQ8901234567hijklmnopq',
    stripe_customer_id: 'cus_PQ8901234567',
    stripe_payment_method_id: 'pm_1PQ8901234567hijk',
    payment_type: 'sepa_debit',
    amount: 450.00,
    currency: 'EUR',
    status: 'succeeded',
    stripe_response: {
      id: 'pi_3PQ8901234567hijklmnopq',
      object: 'payment_intent',
      amount: 45000,
      currency: 'eur',
      status: 'succeeded'
    },
    metadata: {
      order_id: '9',
      order_number: 'ORD-2025-00009',
      client_id: '7'
    },
    failure_code: null,
    failure_message: null,
    processed_at: '2025-01-15T16:45:00Z',
    created_at: '2025-01-15T14:30:00Z',
    updated_at: '2025-01-15T16:45:00Z',
    order: {
      id: 9,
      order_number: 'ORD-2025-00009',
      type: 'single',
      total: 450.00,
      status: 'paid',
      created_at: '2025-01-15T14:30:00Z'
    },
    client: {
      id: 7,
      company_name: 'Omega Corp',
      vat_number: '77665544332',
      email: 'admin@omega.it',
      contact_first_name: 'Francesco',
      contact_last_name: 'Milano'
    }
  },
  {
    id: 9,
    order_id: 10,
    stripe_payment_intent_id: 'pi_3PQ9012345678ijklmnopqr',
    stripe_charge_id: 'ch_3PQ9012345678ijklmnopqr',
    stripe_customer_id: 'cus_PQ1234567890',
    stripe_payment_method_id: 'pm_1PQ9012345678ijkl',
    payment_type: 'card',
    amount: 732.00,
    currency: 'EUR',
    status: 'requires_action',
    stripe_response: {
      id: 'pi_3PQ9012345678ijklmnopqr',
      object: 'payment_intent',
      amount: 73200,
      currency: 'eur',
      status: 'requires_action',
      next_action: {
        type: 'use_stripe_sdk',
        use_stripe_sdk: {
          type: 'three_d_secure_redirect'
        }
      }
    },
    metadata: {
      order_id: '10',
      order_number: 'ORD-2025-00010',
      client_id: '1'
    },
    failure_code: null,
    failure_message: null,
    processed_at: null,
    created_at: '2025-01-16T10:00:00Z',
    updated_at: '2025-01-16T10:00:00Z',
    order: {
      id: 10,
      order_number: 'ORD-2025-00010',
      type: 'package',
      total: 732.00,
      status: 'pending',
      created_at: '2025-01-16T10:00:00Z'
    },
    client: {
      id: 1,
      company_name: 'Azienda Alpha Srl',
      vat_number: '12345678901',
      email: 'info@alpha.it',
      contact_first_name: 'Mario',
      contact_last_name: 'Rossi'
    }
  }
]

// Flag per usare mock data (true in dev, false in prod)
const USE_MOCK_DATA = true

export const useTransactionStore = defineStore('transaction', {
  state: (): TransactionState => ({
    transactions: [],
    currentTransaction: null,
    stats: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    },
    filters: {
      search: '',
      order_id: null,
      client_id: null,
      status: '',
      payment_type: '',
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
    hasTransactions: (state): boolean => state.transactions.length > 0,
    
    successfulTransactions: (state): Transaction[] => 
      state.transactions.filter(t => t.status === 'succeeded'),
    
    pendingTransactions: (state): Transaction[] => 
      state.transactions.filter(t => ['pending', 'processing', 'requires_action'].includes(t.status)),
    
    failedTransactions: (state): Transaction[] => 
      state.transactions.filter(t => t.status === 'failed'),
    
    totalVolume: (state): number => 
      state.transactions
        .filter(t => t.status === 'succeeded')
        .reduce((sum, t) => sum + t.amount, 0),
    
    hasActiveFilters: (state): boolean => {
      return !!(
        state.filters.search ||
        state.filters.order_id ||
        state.filters.client_id ||
        state.filters.status ||
        state.filters.payment_type ||
        state.filters.date_from ||
        state.filters.date_to ||
        state.filters.amount_min ||
        state.filters.amount_max
      )
    },

    currentStripeId: (state): string | null => 
      state.currentTransaction?.stripe_payment_intent_id || null
  },

  actions: {
    /**
     * Carica lista transazioni con filtri e paginazione
     */
    async fetchTransactions() {
      const { t } = useI18n()
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          // Simula delay di rete
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Applica filtri ai mock data
          let filtered = [...mockTransactions]
          
          // Filtro ricerca (Payment Intent ID, Charge ID, numero ordine, nome cliente)
          if (this.filters.search) {
            const search = this.filters.search.toLowerCase()
            filtered = filtered.filter(t => 
              t.stripe_payment_intent_id.toLowerCase().includes(search) ||
              t.stripe_charge_id?.toLowerCase().includes(search) ||
              t.order?.order_number.toLowerCase().includes(search) ||
              t.client?.company_name.toLowerCase().includes(search) ||
              t.client?.email.toLowerCase().includes(search)
            )
          }
          
          // Filtro ordine
          if (this.filters.order_id) {
            filtered = filtered.filter(t => t.order_id === this.filters.order_id)
          }
          
          // Filtro cliente
          if (this.filters.client_id) {
            filtered = filtered.filter(t => t.client?.id === this.filters.client_id)
          }
          
          // Filtro stato
          if (this.filters.status) {
            filtered = filtered.filter(t => t.status === this.filters.status)
          }
          
          // Filtro tipo pagamento
          if (this.filters.payment_type) {
            filtered = filtered.filter(t => t.payment_type === this.filters.payment_type)
          }
          
          // Filtro data
          if (this.filters.date_from) {
            const from = new Date(this.filters.date_from)
            filtered = filtered.filter(t => new Date(t.created_at) >= from)
          }
          if (this.filters.date_to) {
            const to = new Date(this.filters.date_to)
            to.setHours(23, 59, 59, 999)
            filtered = filtered.filter(t => new Date(t.created_at) <= to)
          }
          
          // Filtro importo
          if (this.filters.amount_min !== undefined && this.filters.amount_min > 0) {
            filtered = filtered.filter(t => t.amount >= this.filters.amount_min!)
          }
          if (this.filters.amount_max !== undefined && this.filters.amount_max > 0) {
            filtered = filtered.filter(t => t.amount <= this.filters.amount_max!)
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
          
          this.transactions = filtered.slice(start, end)
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
        if (this.filters.order_id) params.append('order_id', String(this.filters.order_id))
        if (this.filters.client_id) params.append('client_id', String(this.filters.client_id))
        if (this.filters.status) params.append('status', this.filters.status)
        if (this.filters.payment_type) params.append('payment_type', this.filters.payment_type)
        if (this.filters.date_from) params.append('date_from', this.filters.date_from)
        if (this.filters.date_to) params.append('date_to', this.filters.date_to)
        if (this.filters.amount_min) params.append('amount_min', String(this.filters.amount_min))
        if (this.filters.amount_max) params.append('amount_max', String(this.filters.amount_max))
        if (this.filters.sort_by) params.append('sort_by', this.filters.sort_by)
        if (this.filters.sort_order) params.append('sort_order', this.filters.sort_order)
        params.append('page', String(this.filters.page || 1))
        params.append('per_page', String(this.filters.per_page || 10))
        
        const response = await api<{ data: Transaction[], meta: PaginationMeta }>(
          `/admin/transactions?${params.toString()}`
        )
        
        this.transactions = response.data
        this.pagination = response.meta
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchTransactions error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Carica singola transazione con dettagli completi
     */
    async fetchTransaction(id: number) {
      const { t } = useI18n()
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          const transaction = mockTransactions.find(t => t.id === id)
          if (transaction) {
            // Genera dettagli aggiuntivi per il mock
            const events: TransactionEvent[] = [
              {
                id: 1,
                type: 'payment_intent.created',
                status: 'created',
                message: 'Payment Intent creato',
                created_at: transaction.created_at
              }
            ]
            
            if (transaction.status === 'succeeded') {
              events.push({
                id: 2,
                type: 'payment_intent.succeeded',
                status: 'succeeded',
                message: 'Pagamento completato con successo',
                created_at: transaction.processed_at || transaction.created_at
              })
            } else if (transaction.status === 'failed') {
              events.push({
                id: 2,
                type: 'payment_intent.payment_failed',
                status: 'failed',
                message: transaction.failure_message || 'Pagamento fallito',
                created_at: transaction.processed_at || transaction.created_at
              })
            } else if (transaction.status === 'canceled') {
              events.push({
                id: 2,
                type: 'payment_intent.canceled',
                status: 'canceled',
                message: 'Pagamento annullato',
                created_at: transaction.processed_at || transaction.created_at
              })
            } else if (transaction.status === 'requires_action') {
              events.push({
                id: 2,
                type: 'payment_intent.requires_action',
                status: 'requires_action',
                message: 'Richiesta autenticazione 3D Secure',
                created_at: transaction.created_at
              })
            }

            // Genera dettagli carta/SEPA mock
            const cardDetails = transaction.payment_type === 'card' ? {
              brand: 'visa',
              last4: '4242',
              exp_month: 12,
              exp_year: 2027,
              country: 'IT'
            } : undefined

            const sepaDetails = transaction.payment_type === 'sepa_debit' ? {
              bank_code: 'INTESA',
              country: 'IT',
              last4: '1234'
            } : undefined

            // Mock rimborsi per ordini rimborsati
            const refunds: TransactionRefund[] = transaction.order?.status === 'refunded' ? [{
              id: `re_${Math.random().toString(36).substr(2, 24)}`,
              amount: transaction.amount,
              status: 'succeeded',
              reason: 'requested_by_customer',
              created_at: transaction.updated_at
            }] : []
            
            this.currentTransaction = {
              ...transaction,
              order: transaction.order!,
              client: transaction.client!,
              card_details: cardDetails,
              sepa_details: sepaDetails,
              events,
              refunds
            } as TransactionWithDetails
          } else {
            this.currentTransaction = null
            this.error = t('common.errors.notFound')
          }
          return
        }
        
        const { api } = useApi()
        const response = await api<{ data: TransactionWithDetails }>(`/admin/transactions/${id}`)
        this.currentTransaction = response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchTransaction error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Carica statistiche transazioni
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
          
          const succeeded = mockTransactions.filter(t => t.status === 'succeeded')
          const failed = mockTransactions.filter(t => t.status === 'failed')
          const pending = mockTransactions.filter(t => ['pending', 'processing', 'requires_action'].includes(t.status))
          
          const todayTx = mockTransactions.filter(t => new Date(t.created_at) >= today)
          const weekTx = mockTransactions.filter(t => new Date(t.created_at) >= weekAgo)
          const monthTx = mockTransactions.filter(t => new Date(t.created_at) >= monthAgo)
          
          const cardTx = mockTransactions.filter(t => t.payment_type === 'card')
          const sepaTx = mockTransactions.filter(t => t.payment_type === 'sepa_debit')
          
          const totalSucceeded = succeeded.length
          const successRate = mockTransactions.length > 0 
            ? (totalSucceeded / mockTransactions.length) * 100 
            : 0
          
          this.stats = {
            total_transactions: mockTransactions.length,
            total_volume: mockTransactions.reduce((sum, t) => sum + t.amount, 0),
            successful_count: succeeded.length,
            successful_volume: succeeded.reduce((sum, t) => sum + t.amount, 0),
            failed_count: failed.length,
            failed_volume: failed.reduce((sum, t) => sum + t.amount, 0),
            pending_count: pending.length,
            pending_volume: pending.reduce((sum, t) => sum + t.amount, 0),
            transactions_today: todayTx.length,
            volume_today: todayTx.filter(t => t.status === 'succeeded').reduce((sum, t) => sum + t.amount, 0),
            transactions_this_week: weekTx.length,
            volume_this_week: weekTx.filter(t => t.status === 'succeeded').reduce((sum, t) => sum + t.amount, 0),
            transactions_this_month: monthTx.length,
            volume_this_month: monthTx.filter(t => t.status === 'succeeded').reduce((sum, t) => sum + t.amount, 0),
            by_payment_type: {
              card: {
                count: cardTx.length,
                volume: cardTx.filter(t => t.status === 'succeeded').reduce((sum, t) => sum + t.amount, 0)
              },
              sepa_debit: {
                count: sepaTx.length,
                volume: sepaTx.filter(t => t.status === 'succeeded').reduce((sum, t) => sum + t.amount, 0)
              }
            },
            average_transaction_value: succeeded.length > 0 
              ? succeeded.reduce((sum, t) => sum + t.amount, 0) / succeeded.length 
              : 0,
            success_rate: successRate
          }
          return
        }
        
        const { api } = useApi()
        const response = await api<{ data: TransactionStats }>('/admin/transactions/stats')
        this.stats = response.data
      } catch (error: any) {
        console.error('fetchStats error:', error)
      }
    },

    /**
     * Imposta filtri
     */
    setFilters(filters: Partial<TransactionFilters>) {
      this.filters = { ...this.filters, ...filters, page: 1 }
    },

    /**
     * Reset filtri
     */
    resetFilters() {
      this.filters = {
        search: '',
        order_id: null,
        client_id: null,
        status: '',
        payment_type: '',
        date_from: '',
        date_to: '',
        amount_min: undefined,
        amount_max: undefined,
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
      this.transactions = []
      this.currentTransaction = null
      this.stats = null
      this.error = null
    }
  }
})
