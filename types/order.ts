/**
 * Order Types - Tipi per Ordini
 * Qualeadfied B2B Lead Platform
 */

export type OrderType = 'single' | 'package' | 'free_trial'

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'paid' 
  | 'failed' 
  | 'refunded' 
  | 'cancelled'

export type PaymentMethod = 'card' | 'sepa' | 'free'

export type AcquisitionMode = 'exclusive' | 'shared' | 'free'

/**
 * Snapshot dei dati di fatturazione al momento dell'ordine
 */
export interface BillingSnapshot {
  company_name: string
  vat_number: string
  address?: string
  city?: string
  province?: string
  postal_code?: string
  country?: string
  sdi_code?: string
  pec?: string
}

/**
 * Informazioni cliente associate all'ordine
 */
export interface OrderClient {
  id: number
  company_name: string
  vat_number: string
  email: string
  contact_first_name: string
  contact_last_name: string
}

/**
 * Informazioni lead per le righe ordine
 */
export interface OrderLead {
  id: number
  full_name: string
  email: string
  phone: string
  category_name: string
  province_code: string | null
}

/**
 * Informazioni pacchetto per le righe ordine
 */
export interface OrderPackage {
  id: number
  name: string
  lead_quantity: number
  category_name?: string
}

/**
 * Riga ordine
 */
export interface OrderItem {
  id: number
  order_id: number
  lead_id: number | null
  package_id: number | null
  acquisition_mode: AcquisitionMode
  unit_price: number
  quantity: number
  line_total: number
  // Relations (espanse dal backend)
  lead?: OrderLead
  package?: OrderPackage
}

/**
 * Transazione Stripe collegata
 */
export interface OrderTransaction {
  id: number
  stripe_payment_intent_id: string
  stripe_charge_id?: string
  payment_type: 'card' | 'sepa_debit'
  amount: number
  currency: string
  status: string
  processed_at: string | null
}

/**
 * Fattura collegata
 */
export interface OrderInvoice {
  id: number
  invoice_number: string
  fatture_cloud_id?: string
  sdi_status?: string
  issued_at: string
}

/**
 * Entità Ordine principale
 */
export interface Order {
  id: number
  user_id: number
  order_number: string
  type: OrderType
  payment_method: PaymentMethod
  subtotal: number
  vat_rate: number
  vat_amount: number
  total: number
  status: OrderStatus
  billing_snapshot: BillingSnapshot | null
  paid_at: string | null
  created_at: string
  updated_at: string
  // Relations (espanse dal backend)
  client?: OrderClient
  items?: OrderItem[]
  transaction?: OrderTransaction
  invoice?: OrderInvoice
}

/**
 * Ordine con dettagli completi (per vista dettaglio)
 */
export interface OrderWithDetails extends Order {
  client: OrderClient
  items: OrderItem[]
  transaction?: OrderTransaction
  invoice?: OrderInvoice
}

/**
 * Filtri per lista ordini
 */
export interface OrderFilters {
  search?: string
  client_id?: number | null
  status?: OrderStatus | ''
  type?: OrderType | ''
  payment_method?: PaymentMethod | ''
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
 * Statistiche ordini per dashboard
 */
export interface OrderStats {
  total_orders: number
  total_revenue: number
  orders_today: number
  revenue_today: number
  orders_this_week: number
  revenue_this_week: number
  orders_this_month: number
  revenue_this_month: number
  orders_by_status: {
    pending: number
    processing: number
    paid: number
    failed: number
    refunded: number
    cancelled: number
  }
  orders_by_type: {
    single: number
    package: number
    free_trial: number
  }
  average_order_value: number
}

/**
 * Riepilogo ordine per export
 */
export interface OrderExportRow {
  order_number: string
  date: string
  client_name: string
  client_vat: string
  type: string
  payment_method: string
  status: string
  subtotal: number
  vat_amount: number
  total: number
  leads_count: number
}
