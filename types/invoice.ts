/**
 * Invoice Types - Tipi per Fatture
 * Qualeadfied B2B Lead Platform
 */

/**
 * Stato fattura SDI (Sistema di Interscambio)
 */
export type SdiStatus =
  | 'pending'        // In attesa di invio
  | 'sent'           // Inviata a SDI
  | 'delivered'      // Consegnata al destinatario
  | 'accepted'       // Accettata dal destinatario
  | 'rejected'       // Rifiutata dal destinatario
  | 'not_delivered'  // Mancata consegna (destinatario non raggiungibile)
  | 'error'          // Errore nell'invio

/**
 * Tipo di fattura
 */
export type InvoiceType = 'invoice' | 'credit_note'

/**
 * Cliente associato alla fattura
 */
export interface InvoiceClient {
  id: number
  company_name: string
  vat_number: string
  email: string
  contact_first_name: string
  contact_last_name: string
}

/**
 * Dati di fatturazione snapshot
 */
export interface InvoiceBillingData {
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
 * Ordine associato alla fattura
 */
export interface InvoiceOrder {
  id: number
  order_number: string
  type: 'single' | 'package' | 'free_trial'
  total: number
  paid_at: string | null
}

/**
 * Riga fattura
 */
export interface InvoiceItem {
  id: number
  invoice_id: number
  description: string
  quantity: number
  unit_price: number
  line_total: number
  vat_rate: number
  vat_amount: number
}

/**
 * Entità Fattura principale
 */
export interface Invoice {
  id: number
  order_id: number
  invoice_number: string
  type: InvoiceType
  fatture_cloud_id?: string
  sdi_status: SdiStatus
  sdi_message?: string
  subtotal: number
  vat_rate: number
  vat_amount: number
  total: number
  billing_data: InvoiceBillingData
  notes?: string
  issued_at: string
  due_at?: string
  sent_at?: string
  created_at: string
  updated_at: string
  // Relations (espanse dal backend)
  client?: InvoiceClient
  order?: InvoiceOrder
  items?: InvoiceItem[]
}

/**
 * Fattura con dettagli completi (per vista dettaglio)
 */
export interface InvoiceWithDetails extends Invoice {
  client: InvoiceClient
  order: InvoiceOrder
  items: InvoiceItem[]
}

/**
 * Filtri per lista fatture
 */
export interface InvoiceFilters {
  search?: string
  client_id?: number | null
  type?: InvoiceType | ''
  sdi_status?: SdiStatus | ''
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
 * Statistiche fatture per dashboard
 */
export interface InvoiceStats {
  total_invoices: number
  total_amount: number
  invoices_this_month: number
  amount_this_month: number
  by_sdi_status: {
    pending: number
    sent: number
    delivered: number
    accepted: number
    rejected: number
    not_delivered: number
    error: number
  }
  by_type: {
    invoice: number
    credit_note: number
  }
}

/**
 * Riepilogo fattura per export
 */
export interface InvoiceExportRow {
  invoice_number: string
  type: string
  date: string
  client_name: string
  client_vat: string
  subtotal: number
  vat_amount: number
  total: number
  sdi_status: string
  fatture_cloud_id?: string
}
