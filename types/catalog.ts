/**
 * Catalog Types - Tipi per Categorie, Province e Pacchetti
 * Qualeadfied B2B Lead Platform
 */

// ============================================
// CATEGORIES
// ============================================

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  max_shares: number
  is_active: boolean
  sort_order: number
  leads_count?: number
  available_leads_count?: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CategoryCreateForm {
  name: string
  slug: string
  description: string
  max_shares: number
  is_active: boolean
  sort_order: number
}

export interface CategoryUpdateForm {
  name: string
  slug: string
  description: string
  max_shares: number
  is_active: boolean
  sort_order: number
}

export interface CategoryFilters {
  search?: string
  is_active?: boolean | ''
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

export interface CategoryPrice {
  id: number
  category_id: number
  category?: Category
  exclusive_price: number
  shared_prices: Record<string, number> // { "slot_1": 25.00, "slot_2": 25.00, ... }
  valid_from: string
  valid_to: string | null
  created_at: string
  updated_at: string
}

export interface CategoryPriceForm {
  exclusive_price: number
  shared_prices: Record<string, number>
}

export interface CategoryPriceWithCategory extends CategoryPrice {
  category: Category
}

export interface PriceHistoryEntry {
  id: number
  category_id: number
  category_name: string
  exclusive_price: number
  shared_prices: Record<string, number>
  valid_from: string
  valid_to: string | null
  changed_at: string
  changed_by: string | null
}

export interface PricingFilters {
  search?: string
  category_id?: number | ''
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
}

export interface PricingStats {
  total_categories: number
  categories_with_prices: number
  categories_without_prices: number
  avg_exclusive_price: number
  avg_shared_price?: number
  last_update?: string | null
  // Additional stats for history page
  total_price_changes?: number
  last_price_change?: string | null
}

export interface CategoryStats {
  total: number
  active: number
  inactive: number
  total_leads: number
  available_leads: number
}

// ============================================
// PROVINCES
// ============================================

export interface Province {
  id: number
  name: string
  code: string
  region: string
  is_active: boolean
  leads_count?: number
}

export interface ProvinceFilters {
  search?: string
  region?: string
  is_active?: boolean | ''
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

export interface ProvinceStats {
  total: number
  active: number
  inactive: number
  by_region: Record<string, number>
}

// ============================================
// PACKAGES
// ============================================

export type PackageType = 'category_specific' | 'all_categories'

export interface Package {
  id: number
  category_ids: number[]
  categories?: Category[]
  name: string
  description: string | null
  lead_quantity: number
  price: number
  allows_exclusive: boolean
  allows_shared: boolean
  is_active: boolean
  sort_order: number
  sales_count?: number
  created_at: string
  updated_at: string
}

export interface PackageCreateForm {
  category_ids: number[]
  name: string
  description: string
  lead_quantity: number
  price: number
  allows_exclusive: boolean
  allows_shared: boolean
  is_active: boolean
  sort_order: number
}

export interface PackageUpdateForm {
  category_ids: number[]
  name: string
  description: string
  lead_quantity: number
  price: number
  allows_exclusive: boolean
  allows_shared: boolean
  is_active: boolean
  sort_order: number
}

export interface PackageFilters {
  search?: string
  category_id?: number | ''
  category_ids?: number[]
  is_active?: boolean | ''
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

export interface PackageStats {
  total: number
  active: number
  inactive: number
  total_sales: number
  total_revenue: number
}

// ============================================
// ITALIAN REGIONS
// ============================================

export const ITALIAN_REGIONS = [
  'Abruzzo',
  'Basilicata',
  'Calabria',
  'Campania',
  'Emilia-Romagna',
  'Friuli-Venezia Giulia',
  'Lazio',
  'Liguria',
  'Lombardia',
  'Marche',
  'Molise',
  'Piemonte',
  'Puglia',
  'Sardegna',
  'Sicilia',
  'Toscana',
  'Trentino-Alto Adige',
  'Umbria',
  'Valle d\'Aosta',
  'Veneto'
] as const

export type ItalianRegion = typeof ITALIAN_REGIONS[number]

// ============================================
// ITALIAN PROVINCES DATA
// ============================================

export const PROVINCES_BY_REGION: Record<string, { code: string; name: string }[]> = {
  'Abruzzo': [
    { code: 'AQ', name: 'L\'Aquila' },
    { code: 'CH', name: 'Chieti' },
    { code: 'PE', name: 'Pescara' },
    { code: 'TE', name: 'Teramo' }
  ],
  'Basilicata': [
    { code: 'MT', name: 'Matera' },
    { code: 'PZ', name: 'Potenza' }
  ],
  'Calabria': [
    { code: 'CZ', name: 'Catanzaro' },
    { code: 'CS', name: 'Cosenza' },
    { code: 'KR', name: 'Crotone' },
    { code: 'RC', name: 'Reggio Calabria' },
    { code: 'VV', name: 'Vibo Valentia' }
  ],
  'Campania': [
    { code: 'AV', name: 'Avellino' },
    { code: 'BN', name: 'Benevento' },
    { code: 'CE', name: 'Caserta' },
    { code: 'NA', name: 'Napoli' },
    { code: 'SA', name: 'Salerno' }
  ],
  'Emilia-Romagna': [
    { code: 'BO', name: 'Bologna' },
    { code: 'FE', name: 'Ferrara' },
    { code: 'FC', name: 'Forlì-Cesena' },
    { code: 'MO', name: 'Modena' },
    { code: 'PR', name: 'Parma' },
    { code: 'PC', name: 'Piacenza' },
    { code: 'RA', name: 'Ravenna' },
    { code: 'RE', name: 'Reggio Emilia' },
    { code: 'RN', name: 'Rimini' }
  ],
  'Friuli-Venezia Giulia': [
    { code: 'GO', name: 'Gorizia' },
    { code: 'PN', name: 'Pordenone' },
    { code: 'TS', name: 'Trieste' },
    { code: 'UD', name: 'Udine' }
  ],
  'Lazio': [
    { code: 'FR', name: 'Frosinone' },
    { code: 'LT', name: 'Latina' },
    { code: 'RI', name: 'Rieti' },
    { code: 'RM', name: 'Roma' },
    { code: 'VT', name: 'Viterbo' }
  ],
  'Liguria': [
    { code: 'GE', name: 'Genova' },
    { code: 'IM', name: 'Imperia' },
    { code: 'SP', name: 'La Spezia' },
    { code: 'SV', name: 'Savona' }
  ],
  'Lombardia': [
    { code: 'BG', name: 'Bergamo' },
    { code: 'BS', name: 'Brescia' },
    { code: 'CO', name: 'Como' },
    { code: 'CR', name: 'Cremona' },
    { code: 'LC', name: 'Lecco' },
    { code: 'LO', name: 'Lodi' },
    { code: 'MN', name: 'Mantova' },
    { code: 'MI', name: 'Milano' },
    { code: 'MB', name: 'Monza e Brianza' },
    { code: 'PV', name: 'Pavia' },
    { code: 'SO', name: 'Sondrio' },
    { code: 'VA', name: 'Varese' }
  ],
  'Marche': [
    { code: 'AN', name: 'Ancona' },
    { code: 'AP', name: 'Ascoli Piceno' },
    { code: 'FM', name: 'Fermo' },
    { code: 'MC', name: 'Macerata' },
    { code: 'PU', name: 'Pesaro e Urbino' }
  ],
  'Molise': [
    { code: 'CB', name: 'Campobasso' },
    { code: 'IS', name: 'Isernia' }
  ],
  'Piemonte': [
    { code: 'AL', name: 'Alessandria' },
    { code: 'AT', name: 'Asti' },
    { code: 'BI', name: 'Biella' },
    { code: 'CN', name: 'Cuneo' },
    { code: 'NO', name: 'Novara' },
    { code: 'TO', name: 'Torino' },
    { code: 'VB', name: 'Verbano-Cusio-Ossola' },
    { code: 'VC', name: 'Vercelli' }
  ],
  'Puglia': [
    { code: 'BA', name: 'Bari' },
    { code: 'BT', name: 'Barletta-Andria-Trani' },
    { code: 'BR', name: 'Brindisi' },
    { code: 'FG', name: 'Foggia' },
    { code: 'LE', name: 'Lecce' },
    { code: 'TA', name: 'Taranto' }
  ],
  'Sardegna': [
    { code: 'CA', name: 'Cagliari' },
    { code: 'NU', name: 'Nuoro' },
    { code: 'OR', name: 'Oristano' },
    { code: 'SS', name: 'Sassari' },
    { code: 'SU', name: 'Sud Sardegna' }
  ],
  'Sicilia': [
    { code: 'AG', name: 'Agrigento' },
    { code: 'CL', name: 'Caltanissetta' },
    { code: 'CT', name: 'Catania' },
    { code: 'EN', name: 'Enna' },
    { code: 'ME', name: 'Messina' },
    { code: 'PA', name: 'Palermo' },
    { code: 'RG', name: 'Ragusa' },
    { code: 'SR', name: 'Siracusa' },
    { code: 'TP', name: 'Trapani' }
  ],
  'Toscana': [
    { code: 'AR', name: 'Arezzo' },
    { code: 'FI', name: 'Firenze' },
    { code: 'GR', name: 'Grosseto' },
    { code: 'LI', name: 'Livorno' },
    { code: 'LU', name: 'Lucca' },
    { code: 'MS', name: 'Massa-Carrara' },
    { code: 'PI', name: 'Pisa' },
    { code: 'PT', name: 'Pistoia' },
    { code: 'PO', name: 'Prato' },
    { code: 'SI', name: 'Siena' }
  ],
  'Trentino-Alto Adige': [
    { code: 'BZ', name: 'Bolzano' },
    { code: 'TN', name: 'Trento' }
  ],
  'Umbria': [
    { code: 'PG', name: 'Perugia' },
    { code: 'TR', name: 'Terni' }
  ],
  'Valle d\'Aosta': [
    { code: 'AO', name: 'Aosta' }
  ],
  'Veneto': [
    { code: 'BL', name: 'Belluno' },
    { code: 'PD', name: 'Padova' },
    { code: 'RO', name: 'Rovigo' },
    { code: 'TV', name: 'Treviso' },
    { code: 'VE', name: 'Venezia' },
    { code: 'VR', name: 'Verona' },
    { code: 'VI', name: 'Vicenza' }
  ]
}

// Flatten all provinces
export const ALL_PROVINCES: Province[] = Object.entries(PROVINCES_BY_REGION).flatMap(
  ([region, provinces], regionIndex) =>
    provinces.map((p, index) => ({
      id: regionIndex * 100 + index + 1,
      name: p.name,
      code: p.code,
      region: region,
      is_active: true
    }))
)
