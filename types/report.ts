/**
 * Report Types - Tipi per Report e Statistiche
 * Qualeadfied B2B Lead Platform
 */

/**
 * Periodo di riferimento per i report
 */
export type ReportPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'

/**
 * Tipo di export disponibili
 */
export type ExportType = 'leads' | 'orders' | 'clients' | 'transactions'

/**
 * Formato export
 */
export type ExportFormat = 'xlsx' | 'csv'

/**
 * Statistiche vendite aggregate
 */
export interface SalesStats {
  total_revenue: number
  total_orders: number
  average_order_value: number
  total_leads_sold: number
  // Confronto periodo precedente
  revenue_change_percent: number
  orders_change_percent: number
}

/**
 * Dati per grafico vendite nel tempo
 */
export interface SalesChartData {
  labels: string[]
  datasets: {
    revenue: number[]
    orders: number[]
    leads: number[]
  }
}

/**
 * Performance singola categoria
 */
export interface CategoryPerformance {
  id: number
  name: string
  slug: string
  total_leads: number
  leads_sold: number
  leads_available: number
  revenue: number
  orders_count: number
  average_price: number
  sell_through_rate: number // percentuale lead venduti su totali
}

/**
 * Statistiche per provincia
 */
export interface ProvinceStats {
  province_code: string
  province_name: string
  region: string
  total_leads: number
  leads_sold: number
  revenue: number
  top_category?: string
}

/**
 * Dati geografici aggregati per regione
 */
export interface RegionStats {
  region: string
  total_leads: number
  leads_sold: number
  revenue: number
  provinces_count: number
}

/**
 * KPI Dashboard principale
 */
export interface DashboardKPIs {
  // Oggi
  revenue_today: number
  orders_today: number
  leads_sold_today: number
  new_clients_today: number
  // Settimana
  revenue_week: number
  orders_week: number
  leads_sold_week: number
  new_clients_week: number
  // Mese
  revenue_month: number
  orders_month: number
  leads_sold_month: number
  new_clients_month: number
  // Totali
  total_clients: number
  total_leads_available: number
  total_leads_sold: number
  active_categories: number
}

/**
 * Top 5 categorie per il widget dashboard
 */
export interface TopCategory {
  id: number
  name: string
  leads_sold: number
  revenue: number
  trend: 'up' | 'down' | 'stable'
}

/**
 * Ultimi ordini per widget dashboard
 */
export interface RecentOrder {
  id: number
  order_number: string
  client_name: string
  total: number
  leads_count: number
  created_at: string
}

/**
 * Alert categorie in esaurimento
 */
export interface CategoryAlert {
  id: number
  name: string
  available_leads: number
  threshold: number
  severity: 'warning' | 'critical'
}

/**
 * Filtri per report
 */
export interface ReportFilters {
  period: ReportPeriod
  date_from?: string
  date_to?: string
  category_id?: number | null
  province_code?: string
}

/**
 * Richiesta export
 */
export interface ExportRequest {
  type: ExportType
  format: ExportFormat
  filters?: {
    date_from?: string
    date_to?: string
    status?: string
    category_id?: number
  }
}

/**
 * Stato export in corso
 */
export interface ExportStatus {
  id: string
  type: ExportType
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  download_url?: string
  error_message?: string
  created_at: string
  completed_at?: string
}

/**
 * Risposta completa dashboard
 */
export interface DashboardData {
  kpis: DashboardKPIs
  sales_chart: SalesChartData
  top_categories: TopCategory[]
  recent_orders: RecentOrder[]
  category_alerts: CategoryAlert[]
  new_clients_chart: {
    labels: string[]
    data: number[]
  }
}
