/**
 * Transaction Types - Tipi per Transazioni Stripe
 * Qualeadfied B2B Lead Platform
 */

export type TransactionStatus = 
  | 'pending' 
  | 'requires_action' 
  | 'processing' 
  | 'succeeded' 
  | 'failed' 
  | 'canceled'

export type TransactionPaymentType = 'card' | 'sepa_debit'

/**
 * Informazioni ordine associate alla transazione
 */
export interface TransactionOrder {
  id: number
  order_number: string
  type: 'single' | 'package' | 'free_trial'
  total: number
  status: string
  created_at: string
}

/**
 * Informazioni cliente associate alla transazione
 */
export interface TransactionClient {
  id: number
  company_name: string
  vat_number: string
  email: string
  contact_first_name: string
  contact_last_name: string
}

/**
 * Dettagli carta di credito (mascherati)
 */
export interface CardDetails {
  brand: string
  last4: string
  exp_month: number
  exp_year: number
  country?: string
}

/**
 * Dettagli SEPA (mascherati)
 */
export interface SepaDetails {
  bank_code?: string
  branch_code?: string
  country?: string
  last4: string
}

/**
 * Metadati della transazione
 */
export interface TransactionMetadata {
  order_id?: string
  client_id?: string
  order_number?: string
  [key: string]: string | undefined
}

/**
 * Entità Transazione principale
 */
export interface Transaction {
  id: number
  order_id: number
  stripe_payment_intent_id: string
  stripe_charge_id: string | null
  stripe_customer_id: string | null
  stripe_payment_method_id: string | null
  payment_type: TransactionPaymentType
  amount: number
  currency: string
  status: TransactionStatus
  stripe_response: Record<string, unknown> | null
  metadata: TransactionMetadata | null
  failure_code: string | null
  failure_message: string | null
  processed_at: string | null
  created_at: string
  updated_at: string
  // Relations (espanse dal backend)
  order?: TransactionOrder
  client?: TransactionClient
}

/**
 * Transazione con dettagli completi (per vista dettaglio)
 */
export interface TransactionWithDetails extends Transaction {
  order: TransactionOrder
  client: TransactionClient
  card_details?: CardDetails
  sepa_details?: SepaDetails
  refunds?: TransactionRefund[]
  events?: TransactionEvent[]
}

/**
 * Evento/timeline della transazione
 */
export interface TransactionEvent {
  id: number
  type: string
  status: string
  message: string
  created_at: string
}

/**
 * Rimborso associato alla transazione
 */
export interface TransactionRefund {
  id: string
  amount: number
  status: string
  reason: string | null
  created_at: string
}

/**
 * Filtri per lista transazioni
 */
export interface TransactionFilters {
  search?: string
  order_id?: number | null
  client_id?: number | null
  status?: TransactionStatus | ''
  payment_type?: TransactionPaymentType | ''
  date_from?: string
  date_to?: string
  amount_min?: number
  amount_max?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

/**
 * Statistiche transazioni per dashboard
 */
export interface TransactionStats {
  total_transactions: number
  total_volume: number
  successful_count: number
  successful_volume: number
  failed_count: number
  failed_volume: number
  pending_count: number
  pending_volume: number
  transactions_today: number
  volume_today: number
  transactions_this_week: number
  volume_this_week: number
  transactions_this_month: number
  volume_this_month: number
  by_payment_type: {
    card: { count: number; volume: number }
    sepa_debit: { count: number; volume: number }
  }
  average_transaction_value: number
  success_rate: number
}

/**
 * Riepilogo transazione per export
 */
export interface TransactionExportRow {
  id: number
  stripe_payment_intent_id: string
  date: string
  order_number: string
  client_name: string
  payment_type: string
  amount: number
  currency: string
  status: string
  failure_code: string | null
  processed_at: string | null
}
