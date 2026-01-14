/**
 * Types - Public Catalog
 * Types for public lead catalog (anonymized version)
 */
import type { Category, Province, LeadStatus } from './lead'

// Lead availability type
export type LeadAvailability = 'exclusive' | 'shared' | 'both'

/**
 * Public lead (anonymized version for non-authenticated users)
 */
export interface PublicLead {
  id: number
  category_id: number
  province_id: number

  // Anonymized data
  request_preview: string // First 50 chars obscured
  generated_at: string

  // Status and availability
  status: LeadStatus
  is_exclusive_available: boolean
  shared_slots_available: number
  shared_slots_total: number

  // Pricing (shown as "A partire da")
  base_price: number

  // Relations (for display)
  category?: Category
  province?: Province
}

/**
 * Authenticated lead (full version for logged-in users)
 */
export interface AuthenticatedLead extends PublicLead {
  // Full request text (partial, not complete)
  request_text_partial: string

  // Full pricing
  exclusive_price: number | null // null if not available
  shared_price: number | null // null if not available
}

/**
 * Filters for public catalog
 */
export interface PublicCatalogFilters {
  category_id?: number | ''
  province_id?: number | ''
  date_from?: string
  date_to?: string
  availability?: LeadAvailability | ''
  sort_by?: 'date' | 'price'
  sort_order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

/**
 * Public catalog stats (for homepage)
 */
export interface PublicCatalogStats {
  total_leads_available: number
  categories_count: number
  provinces_covered: number
  satisfied_clients: number
}

/**
 * Homepage content
 */
export interface HomepageContent {
  hero: {
    headline: string
    subtitle: string
    cta_text: string
    image_url?: string
  }
  value_propositions: Array<{
    icon: string
    title: string
    description: string
  }>
  how_it_works: Array<{
    step: number
    title: string
    description: string
  }>
  stats: PublicCatalogStats
  featured_categories: Category[]
}

/**
 * Pagination info
 */
export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}
