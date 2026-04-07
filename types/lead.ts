/**
 * Lead Types - Tipi per Lead
 * Qualeadfied B2B Lead Platform
 */

/**
 * Stati possibili di un lead
 * - free: Disponibile per acquisto esclusivo O condiviso
 * - sold_exclusive: Venduto in esclusiva → non più disponibile
 * - sold_shared: Venduto in condivisione (current_shares < max_shares)
 * - exhausted: Condivisioni esaurite (current_shares = max_shares)
 */
export type LeadStatus = 'free' | 'sold_exclusive' | 'sold_shared' | 'exhausted'

/**
 * Definizione campo personalizzato (testo)
 */
export interface CustomFieldDefinition {
  key: string
  label: string
}

/**
 * Categoria merceologica
 */
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  max_shares: number
  is_active: boolean
  sort_order: number
  custom_fields?: CustomFieldDefinition[]
  deleted_at: string | null
  created_at: string
  updated_at: string
}

/**
 * Provincia
 */
export interface Province {
  id: number
  name: string
  code: string
  region: string
  is_active: boolean
}

/**
 * Fonte lead
 */
export interface LeadSource {
  id: number
  name: string
  slug: string
  description?: string
  api_key?: string
  is_active: boolean
  config?: Record<string, any>
  created_at: string
  updated_at: string
}

/**
 * Lead - Entità principale
 */
export interface Lead {
  id: number
  category_id: number
  province_id: number
  source_id: number
  
  // Dati anagrafici
  full_name: string
  email: string
  phone: string
  address?: string
  
  // Dati richiesta
  request_text: string
  extra_tags?: Record<string, any>

  // Tracciamento acquisizione
  medium?: string
  campaign?: string
  origin?: string | null
  country: string

  // Stato vendita
  status: LeadStatus
  current_shares: number

  // Riferimenti esterni
  external_id?: string
  generated_at: string
  
  // Timestamps
  created_at: string
  updated_at: string

  // Relazioni (opzionali, per visualizzazione)
  category?: Category
  province?: Province
  source?: LeadSource
}

/**
 * Form per creazione lead
 */
export interface LeadCreateForm {
  category_id: number | null
  province_id: number | null
  source_id: number | null
  full_name: string
  email: string
  phone: string
  address?: string
  request_text: string
  extra_tags?: Record<string, any>
  generated_at: string
  external_id?: string
  medium?: string
  campaign?: string
  origin?: string | null
  country: string
}

/**
 * Form per aggiornamento lead
 */
export interface LeadUpdateForm {
  category_id: number
  province_id: number | null
  source_id: number
  full_name: string
  email: string
  phone: string
  address?: string
  request_text: string
  extra_tags?: Record<string, any>
  generated_at: string
  external_id?: string
  medium?: string
  campaign?: string
  origin?: string | null
  country: string
}

/**
 * Filtri per lista lead
 */
export interface LeadFilters {
  search?: string
  category_id?: number | ''
  province_id?: number | ''
  source_id?: number | ''
  status?: LeadStatus | ''
  mode?: 'exclusive' | 'shared' | ''
  country?: string
  medium?: string
  campaign?: string
  date_from?: string
  date_to?: string
  generated_from?: string
  generated_to?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

/**
 * Statistiche lead
 */
export interface LeadStats {
  total: number
  free: number
  sold_exclusive: number
  sold_shared: number
  exhausted: number
  by_category: Array<{ category_id: number; category_name: string; count: number }>
  by_province: Array<{ province_id: number; province_name: string; count: number }>
  by_source: Array<{ source_id: number; source_name: string; count: number }>
}

/**
 * Configurazione import lead
 */
export interface LeadImportConfig {
  file: File | null
  category_id: number | null
  source_id: number | null
  mapping: LeadFieldMapping
  skip_header: boolean
  duplicate_strategy: 'skip' | 'update' | 'create'
}

/**
 * Mapping campi per import
 */
export interface LeadFieldMapping {
  full_name?: number | null
  email?: number | null
  phone?: number | null
  address?: number | null
  province_code?: number | null
  request_text?: number | null
  external_id?: number | null
  generated_at?: number | null
  medium?: number | null
  campaign?: number | null
  country?: number | null
}

/**
 * Risultato import lead
 */
export interface LeadImportResult {
  total_rows: number
  imported: number
  skipped: number
  errors: Array<{ row: number; message: string }>
}

/**
 * Form per creazione sorgente
 */
export interface LeadSourceCreateForm {
  name: string
  slug: string
  description?: string
  is_active: boolean
  config?: Record<string, any>
  generate_api_key?: boolean
}

/**
 * Form per aggiornamento sorgente
 */
export interface LeadSourceUpdateForm {
  name: string
  description?: string
  is_active: boolean
  config?: Record<string, any>
}

/**
 * Prezzi per categoria
 */
export interface CategoryPrices {
  id: number
  category_id: number
  exclusive_price: number
  shared_prices: Record<string, number>
  valid_from: string
  valid_to: string | null
}

/**
 * Form per invio lead da form pubblico
 */
export interface PublicLeadSubmission {
  category_slug: string
  province_id: number | null
  full_name: string
  email: string
  phone: string
  address?: string
  request_text: string
  extra_tags?: Record<string, string>
}
