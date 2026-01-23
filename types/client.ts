/**
 * Client Types - Tipi per Clienti B2B
 * Qualeadfied B2B Lead Platform
 */

export type ClientStatus = 'pending' | 'active' | 'suspended'

export type ContactStatus = 
  | 'new' 
  | 'contacted' 
  | 'in_progress' 
  | 'not_interested' 
  | 'converted' 
  | 'unreachable'

export interface BillingData {
  address?: string
  city?: string
  province?: string
  postal_code?: string
  country?: string
  sdi_code?: string
  pec?: string
}

export interface BankData {
  iban?: string
  bank_account_holder?: string
  bic_swift?: string
  bank_name?: string
}

export interface Client {
  id: number
  company_name: string
  vat_number: string
  email: string
  phone: string
  contact_first_name: string
  contact_last_name: string
  status: ClientStatus
  free_trial_enabled: boolean
  free_trial_leads_total: number
  free_trial_leads_used: number
  billing_data: BillingData | null
  bank_data: BankData | null
  category_ids: number[]
  terms_accepted: boolean
  privacy_accepted: boolean
  marketing_consent: boolean
  notify_new_leads: boolean
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface ClientCreateForm {
  company_name: string
  vat_number: string
  email: string
  phone: string
  contact_first_name: string
  contact_last_name: string
  password: string
  password_confirmation: string
  status: ClientStatus
  free_trial_enabled: boolean
  free_trial_leads_total: number
  billing_data: BillingData
  bank_data: BankData
  category_ids: number[]
  notify_new_leads: boolean
}

export interface ClientUpdateForm {
  company_name: string
  vat_number: string
  email: string
  phone: string
  contact_first_name: string
  contact_last_name: string
  status: ClientStatus
  free_trial_enabled: boolean
  free_trial_leads_total: number
  billing_data: BillingData
  bank_data: BankData
  category_ids: number[]
  notify_new_leads: boolean
}

export interface ClientFilters {
  search?: string
  status?: ClientStatus | ''
  free_trial?: 'active' | 'inactive' | 'exhausted' | ''
  date_from?: string
  date_to?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

export interface ClientStats {
  total: number
  active: number
  pending: number
  suspended: number
  with_free_trial: number
  free_trial_leads_used: number
  free_trial_leads_remaining: number
}

export interface FreeTrialConfig {
  enabled: boolean
  leads_total: number
  leads_used: number
  leads_remaining: number
}
