/**
 * Types - Client Area
 * Types for authenticated client area (cart, packages, my-leads, orders, profile)
 */
import type { Category, Province, LeadStatus } from './lead'

// =============================================================================
// CART
// =============================================================================

export type PurchaseMode = 'exclusive' | 'shared'

export interface CartItem {
  id: number
  lead_id: number
  purchase_mode: PurchaseMode
  price: number
  added_at: string
  // Lead details
  lead: {
    id: number
    category_id: number
    province_id: number
    request_text_partial: string
    generated_at: string
    category?: Category
    province?: Province
  }
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  vat_amount: number
  vat_rate: number
  total: number
}

export interface AddToCartRequest {
  lead_id: number
  purchase_mode: PurchaseMode
}

// =============================================================================
// CHECKOUT
// =============================================================================

export type PaymentMethod = 'card' | 'sepa'

export interface CheckoutData {
  billing_address: string
  billing_city: string
  billing_province: string
  billing_zip: string
  billing_country: string
  sdi_code: string | null
  pec_email: string | null
  payment_method: PaymentMethod
  accept_terms: boolean
}

export interface PaymentIntent {
  client_secret: string
  amount: number
  currency: string
}

// =============================================================================
// PACKAGES
// =============================================================================

export interface LeadPackage {
  id: number
  name: string
  description: string
  category_id: number | null // null = all categories
  total_leads: number
  exclusive_leads: number
  shared_leads: number
  price: number
  discount_percent: number
  original_price: number
  is_active: boolean
  valid_days: number // Validity period
  category?: Category
}

export interface ActivePackage {
  id: number
  package_id: number
  user_id: number
  package_name: string
  category_id: number | null
  total_leads: number
  exclusive_leads_total: number
  exclusive_leads_used: number
  shared_leads_total: number
  shared_leads_used: number
  purchased_at: string
  expires_at: string
  is_expired: boolean
  category?: Category
}

export interface PackageSelectRequest {
  lead_ids: number[]
  purchase_modes: Record<number, PurchaseMode> // lead_id -> mode
}

// =============================================================================
// MY LEADS (Portfolio)
// =============================================================================

export type ContactStatus = 'new' | 'contacted' | 'in_progress' | 'not_interested' | 'converted'
export type AcquisitionType = 'exclusive' | 'shared' | 'free_trial'

export interface MyLead {
  id: number
  lead_id: number
  user_id: number
  acquisition_type: AcquisitionType
  purchase_price: number
  purchased_at: string
  order_id: number | null

  // Contact management
  contact_status: ContactStatus
  notes: string | null
  last_contacted_at: string | null

  // Full lead data (visible after purchase)
  lead: {
    id: number
    category_id: number
    province_id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    request_text: string
    generated_at: string
    category?: Category
    province?: Province
  }
}

export interface MyLeadFilters {
  category_id?: number | ''
  contact_status?: ContactStatus | ''
  acquisition_type?: AcquisitionType | ''
  date_from?: string
  date_to?: string
  search?: string
  page?: number
  per_page?: number
}

export interface MyLeadUpdateRequest {
  contact_status?: ContactStatus
  notes?: string
}

// =============================================================================
// ORDERS
// =============================================================================

export type OrderType = 'single' | 'package' | 'free_trial'
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'failed' | 'refunded'

export interface Order {
  id: number
  order_number: string
  user_id: number
  order_type: OrderType
  status: OrderStatus

  // Amounts
  subtotal: number
  vat_rate: number
  vat_amount: number
  total: number

  // Payment
  payment_method: PaymentMethod | 'free'
  payment_id: string | null
  paid_at: string | null

  // Details
  items_count: number
  created_at: string
  updated_at: string

  // Invoice
  invoice_number: string | null
  invoice_url: string | null
}

export interface OrderDetail extends Order {
  items: OrderItem[]
  billing_data: OrderBillingData
}

export interface OrderItem {
  id: number
  order_id: number
  lead_id: number
  purchase_mode: PurchaseMode
  price: number
  lead: {
    id: number
    category_id: number
    province_id: number
    first_name: string
    last_name: string
    request_text: string
    generated_at: string
    category?: Category
    province?: Province
  }
}

export interface OrderBillingData {
  company_name: string
  vat_number: string
  address: string
  city: string
  province: string
  zip: string
  country: string
  sdi_code: string | null
  pec_email: string | null
}

export interface OrderFilters {
  status?: OrderStatus | ''
  order_type?: OrderType | ''
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
}

// =============================================================================
// PROFILE
// =============================================================================

export interface ClientProfileData {
  // Company
  company_name: string
  vat_number: string
  phone: string

  // Contact
  first_name: string
  last_name: string
  email: string

  // Billing
  billing_address: string
  billing_city: string
  billing_province: string
  billing_zip: string
  billing_country: string
  sdi_code: string | null
  pec_email: string | null

  // Preferences
  email_notifications_enabled: boolean
  marketing_consent: boolean

  // Trial
  free_trial_enabled: boolean
  free_trial_leads_remaining: number
}

export interface ProfileUpdateRequest {
  company_name?: string
  phone?: string
  first_name?: string
  last_name?: string
}

export interface BillingUpdateRequest {
  billing_address: string
  billing_city: string
  billing_province: string
  billing_zip: string
  billing_country: string
  sdi_code?: string | null
  pec_email?: string | null
}

export interface PasswordChangeRequest {
  current_password: string
  password: string
  password_confirmation: string
}

export interface PreferencesUpdateRequest {
  email_notifications_enabled?: boolean
  marketing_consent?: boolean
}

// =============================================================================
// TRIAL
// =============================================================================

export interface TrialStatus {
  enabled: boolean
  leads_remaining: number
  leads_total: number
  leads_claimed: number
}

export interface TrialClaimRequest {
  lead_ids: number[]
}

// =============================================================================
// DASHBOARD
// =============================================================================

export interface DashboardStats {
  total_leads_purchased: number
  leads_this_month: number
  total_spent: number
  spent_this_month: number
  conversion_rate: number
  active_packages: number
  free_trial_remaining: number
}

export interface DashboardNotification {
  id: number
  type: 'new_leads' | 'package_expiring' | 'order_completed' | 'info'
  title: string
  message: string
  link?: string
  created_at: string
  read: boolean
}

export interface DashboardRecentLead {
  id: number
  name: string
  email: string
  category: string
  province: string
  status: ContactStatus
  acquisition_type: AcquisitionType
  purchased_at: string
}

export interface DashboardRecentOrder {
  id: string
  items_count: number
  amount: number
  status: OrderStatus
  date: string
}

// =============================================================================
// AUTHENTICATED CATALOG
// =============================================================================

export interface AuthenticatedLead {
  id: number
  category_id: number
  province_id: number

  // Partial preview
  request_text_partial: string
  generated_at: string

  // Status
  status: LeadStatus
  is_exclusive_available: boolean
  shared_slots_available: number
  shared_slots_total: number

  // Full pricing
  exclusive_price: number | null
  shared_price: number | null

  // Relations
  category?: Category
  province?: Province

  // User state
  is_in_cart: boolean
  is_owned: boolean
}

export interface AuthCatalogFilters {
  category_id?: number | ''
  province_id?: number | ''
  date_from?: string
  date_to?: string
  availability?: 'exclusive' | 'shared' | 'both' | ''
  hide_owned?: boolean
  sort_by?: 'date' | 'price_exclusive' | 'price_shared'
  sort_order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

// =============================================================================
// PAGINATION
// =============================================================================

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}
