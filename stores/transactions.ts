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
    async fetchTransactions() {
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
        if (this.filters.order_id) query.order_id = this.filters.order_id
        if (this.filters.client_id) query.client_id = this.filters.client_id
        if (this.filters.status) query.status = this.filters.status
        if (this.filters.payment_type) query.payment_type = this.filters.payment_type
        if (this.filters.date_from) query.date_from = this.filters.date_from
        if (this.filters.date_to) query.date_to = this.filters.date_to
        if (this.filters.amount_min) query.amount_min = this.filters.amount_min
        if (this.filters.amount_max) query.amount_max = this.filters.amount_max
        if (this.filters.sort_by) query.sort_by = this.filters.sort_by
        if (this.filters.sort_order) query.sort_order = this.filters.sort_order

        const { data, error } = await client.GET('/admin/transactions', {
          params: { query }
        })
        if (error) throw error

        this.transactions = (data as any).data
        this.pagination = (data as any).meta
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchTransactions error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchTransaction(id: number) {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()

        const { data, error } = await client.GET('/admin/transactions/{transaction}', {
          params: { path: { transaction: id } }
        })
        if (error) throw error

        this.currentTransaction = (data as any).data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchTransaction error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchStats() {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: TransactionStats }>(`${config.public.apiBase}/admin/transactions/stats`, {
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

    setFilters(filters: Partial<TransactionFilters>) {
      this.filters = { ...this.filters, ...filters, page: 1 }
    },

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

    clearState() {
      this.transactions = []
      this.currentTransaction = null
      this.stats = null
      this.error = null
    }
  }
})
