/**
 * Report Store - Gestione Report e Statistiche
 * Qualeadfied B2B Lead Platform
 */

import { defineStore } from 'pinia'
import type {
  ReportPeriod,
  ReportFilters,
  SalesStats,
  SalesChartData,
  CategoryPerformance,
  ProvinceStats,
  RegionStats,
  DashboardKPIs,
  TopCategory,
  RecentOrder,
  CategoryAlert,
  DashboardData,
  ExportRequest,
  ExportStatus,
  ExportType
} from '~/types/report'

interface ReportState {
  // Dashboard
  dashboardData: DashboardData | null
  // Statistiche vendite
  salesStats: SalesStats | null
  salesChart: SalesChartData | null
  // Performance categorie
  categoryPerformance: CategoryPerformance[]
  // Analisi geografica
  provinceStats: ProvinceStats[]
  regionStats: RegionStats[]
  // Filtri attivi
  filters: ReportFilters
  // Export
  exports: ExportStatus[]
  currentExport: ExportStatus | null
  // Stati
  loading: boolean
  exporting: boolean
  error: string | null
}

// Mock data for development
const mockDashboardData: DashboardData = {
  kpis: {
    revenue_today: 1250.00,
    orders_today: 8,
    leads_sold_today: 12,
    new_clients_today: 2,
    revenue_week: 8540.00,
    orders_week: 45,
    leads_sold_week: 78,
    new_clients_week: 8,
    revenue_month: 32150.00,
    orders_month: 187,
    leads_sold_month: 312,
    new_clients_month: 24,
    total_clients: 156,
    total_leads_available: 1247,
    total_leads_sold: 3892,
    active_categories: 12
  },
  sales_chart: {
    labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
    datasets: {
      revenue: [1200, 1850, 1400, 2100, 1750, 890, 350],
      orders: [8, 12, 9, 14, 11, 6, 2],
      leads: [12, 18, 14, 21, 17, 9, 3]
    }
  },
  top_categories: [
    { id: 1, name: 'Fotovoltaico', leads_sold: 145, revenue: 10875.00, trend: 'up' },
    { id: 2, name: 'Caldaie', leads_sold: 98, revenue: 7350.00, trend: 'up' },
    { id: 3, name: 'Climatizzazione', leads_sold: 87, revenue: 6525.00, trend: 'stable' },
    { id: 4, name: 'Infissi', leads_sold: 76, revenue: 5700.00, trend: 'down' },
    { id: 5, name: 'Ristrutturazioni', leads_sold: 65, revenue: 4875.00, trend: 'up' }
  ],
  recent_orders: [
    { id: 1, order_number: 'ORD-2024-00187', client_name: 'Azienda Alpha Srl', total: 183.00, leads_count: 2, created_at: '2024-01-28T14:30:00Z' },
    { id: 2, order_number: 'ORD-2024-00186', client_name: 'Beta Solutions SpA', total: 549.00, leads_count: 6, created_at: '2024-01-28T12:15:00Z' },
    { id: 3, order_number: 'ORD-2024-00185', client_name: 'Gamma Tech Srl', total: 91.50, leads_count: 1, created_at: '2024-01-28T10:45:00Z' },
    { id: 4, order_number: 'ORD-2024-00184', client_name: 'Delta Corp', total: 366.00, leads_count: 4, created_at: '2024-01-28T09:20:00Z' },
    { id: 5, order_number: 'ORD-2024-00183', client_name: 'Epsilon Ltd', total: 274.50, leads_count: 3, created_at: '2024-01-27T16:50:00Z' }
  ],
  category_alerts: [
    { id: 3, name: 'Climatizzazione', available_leads: 12, threshold: 20, severity: 'warning' },
    { id: 7, name: 'Pompe di Calore', available_leads: 5, threshold: 15, severity: 'critical' }
  ],
  new_clients_chart: {
    labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
    data: [2, 3, 1, 4, 2, 1, 0]
  }
}

const mockSalesStats: SalesStats = {
  total_revenue: 32150.00,
  total_orders: 187,
  average_order_value: 171.93,
  total_leads_sold: 312,
  revenue_change_percent: 12.5,
  orders_change_percent: 8.3
}

const mockCategoryPerformance: CategoryPerformance[] = [
  { id: 1, name: 'Fotovoltaico', slug: 'fotovoltaico', total_leads: 450, leads_sold: 312, leads_available: 138, revenue: 23400.00, orders_count: 156, average_price: 75.00, sell_through_rate: 69.3 },
  { id: 2, name: 'Caldaie', slug: 'caldaie', total_leads: 320, leads_sold: 198, leads_available: 122, revenue: 14850.00, orders_count: 98, average_price: 75.00, sell_through_rate: 61.9 },
  { id: 3, name: 'Climatizzazione', slug: 'climatizzazione', total_leads: 280, leads_sold: 187, leads_available: 93, revenue: 14025.00, orders_count: 87, average_price: 75.00, sell_through_rate: 66.8 },
  { id: 4, name: 'Infissi', slug: 'infissi', total_leads: 210, leads_sold: 134, leads_available: 76, revenue: 10050.00, orders_count: 67, average_price: 75.00, sell_through_rate: 63.8 },
  { id: 5, name: 'Ristrutturazioni', slug: 'ristrutturazioni', total_leads: 180, leads_sold: 112, leads_available: 68, revenue: 8400.00, orders_count: 56, average_price: 75.00, sell_through_rate: 62.2 },
  { id: 6, name: 'Serramenti', slug: 'serramenti', total_leads: 150, leads_sold: 89, leads_available: 61, revenue: 6675.00, orders_count: 45, average_price: 75.00, sell_through_rate: 59.3 },
  { id: 7, name: 'Pompe di Calore', slug: 'pompe-di-calore', total_leads: 120, leads_sold: 78, leads_available: 42, revenue: 5850.00, orders_count: 39, average_price: 75.00, sell_through_rate: 65.0 },
  { id: 8, name: 'Isolamento Termico', slug: 'isolamento-termico', total_leads: 95, leads_sold: 56, leads_available: 39, revenue: 4200.00, orders_count: 28, average_price: 75.00, sell_through_rate: 58.9 }
]

const mockProvinceStats: ProvinceStats[] = [
  { province_code: 'MI', province_name: 'Milano', region: 'Lombardia', total_leads: 245, leads_sold: 178, revenue: 13350.00, top_category: 'Fotovoltaico' },
  { province_code: 'RM', province_name: 'Roma', region: 'Lazio', total_leads: 198, leads_sold: 142, revenue: 10650.00, top_category: 'Caldaie' },
  { province_code: 'TO', province_name: 'Torino', region: 'Piemonte', total_leads: 156, leads_sold: 112, revenue: 8400.00, top_category: 'Climatizzazione' },
  { province_code: 'NA', province_name: 'Napoli', region: 'Campania', total_leads: 134, leads_sold: 98, revenue: 7350.00, top_category: 'Fotovoltaico' },
  { province_code: 'BO', province_name: 'Bologna', region: 'Emilia-Romagna', total_leads: 112, leads_sold: 87, revenue: 6525.00, top_category: 'Infissi' },
  { province_code: 'FI', province_name: 'Firenze', region: 'Toscana', total_leads: 98, leads_sold: 72, revenue: 5400.00, top_category: 'Ristrutturazioni' },
  { province_code: 'VE', province_name: 'Venezia', region: 'Veneto', total_leads: 87, leads_sold: 65, revenue: 4875.00, top_category: 'Serramenti' },
  { province_code: 'GE', province_name: 'Genova', region: 'Liguria', total_leads: 76, leads_sold: 54, revenue: 4050.00, top_category: 'Caldaie' },
  { province_code: 'PA', province_name: 'Palermo', region: 'Sicilia', total_leads: 65, leads_sold: 48, revenue: 3600.00, top_category: 'Climatizzazione' },
  { province_code: 'BA', province_name: 'Bari', region: 'Puglia', total_leads: 54, leads_sold: 38, revenue: 2850.00, top_category: 'Fotovoltaico' }
]

const mockRegionStats: RegionStats[] = [
  { region: 'Lombardia', total_leads: 412, leads_sold: 298, revenue: 22350.00, provinces_count: 12 },
  { region: 'Lazio', total_leads: 287, leads_sold: 198, revenue: 14850.00, provinces_count: 5 },
  { region: 'Piemonte', total_leads: 234, leads_sold: 167, revenue: 12525.00, provinces_count: 8 },
  { region: 'Campania', total_leads: 198, leads_sold: 142, revenue: 10650.00, provinces_count: 5 },
  { region: 'Emilia-Romagna', total_leads: 176, leads_sold: 134, revenue: 10050.00, provinces_count: 9 },
  { region: 'Veneto', total_leads: 156, leads_sold: 112, revenue: 8400.00, provinces_count: 7 },
  { region: 'Toscana', total_leads: 134, leads_sold: 98, revenue: 7350.00, provinces_count: 10 },
  { region: 'Sicilia', total_leads: 112, leads_sold: 78, revenue: 5850.00, provinces_count: 9 },
  { region: 'Puglia', total_leads: 98, leads_sold: 67, revenue: 5025.00, provinces_count: 6 },
  { region: 'Liguria', total_leads: 87, leads_sold: 62, revenue: 4650.00, provinces_count: 4 }
]

// Flag per usare mock data (true in dev, false in prod)
const USE_MOCK_DATA = true

export const useReportStore = defineStore('report', {
  state: (): ReportState => ({
    dashboardData: null,
    salesStats: null,
    salesChart: null,
    categoryPerformance: [],
    provinceStats: [],
    regionStats: [],
    filters: {
      period: 'month',
      date_from: undefined,
      date_to: undefined,
      category_id: null,
      province_code: undefined
    },
    exports: [],
    currentExport: null,
    loading: false,
    exporting: false,
    error: null
  }),

  getters: {
    hasDashboardData: (state): boolean => state.dashboardData !== null,

    topPerformingCategories: (state): CategoryPerformance[] =>
      [...state.categoryPerformance].sort((a, b) => b.revenue - a.revenue).slice(0, 5),

    lowStockCategories: (state): CategoryPerformance[] =>
      state.categoryPerformance.filter(c => c.leads_available < 20),

    totalRevenue: (state): number =>
      state.salesStats?.total_revenue || 0,

    revenueByRegion: (state): RegionStats[] =>
      [...state.regionStats].sort((a, b) => b.revenue - a.revenue),

    hasActiveFilters: (state): boolean => {
      return !!(
        state.filters.period !== 'month' ||
        state.filters.category_id ||
        state.filters.province_code ||
        state.filters.date_from ||
        state.filters.date_to
      )
    },

    pendingExports: (state): ExportStatus[] =>
      state.exports.filter(e => ['pending', 'processing'].includes(e.status)),

    completedExports: (state): ExportStatus[] =>
      state.exports.filter(e => e.status === 'completed')
  },

  actions: {
    /**
     * Carica dati dashboard completi
     */
    async fetchDashboard() {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          this.dashboardData = mockDashboardData
          return
        }

        const { api } = useApi()
        const response = await api<{ data: DashboardData }>('/admin/dashboard')
        this.dashboardData = response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento dashboard'
        console.error('fetchDashboard error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Carica statistiche vendite
     */
    async fetchSalesStats() {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          this.salesStats = mockSalesStats

          // Genera dati grafico basati sul periodo
          const labels = this.generatePeriodLabels()
          this.salesChart = {
            labels,
            datasets: {
              revenue: labels.map(() => Math.floor(Math.random() * 3000) + 500),
              orders: labels.map(() => Math.floor(Math.random() * 20) + 5),
              leads: labels.map(() => Math.floor(Math.random() * 30) + 10)
            }
          }
          return
        }

        const { api } = useApi()
        const params = this.buildFilterParams()
        const response = await api<{ data: { stats: SalesStats, chart: SalesChartData } }>(
          `/admin/reports/sales?${params.toString()}`
        )
        this.salesStats = response.data.stats
        this.salesChart = response.data.chart
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento statistiche vendite'
        console.error('fetchSalesStats error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Carica performance categorie
     */
    async fetchCategoryPerformance() {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 400))
          this.categoryPerformance = mockCategoryPerformance
          return
        }

        const { api } = useApi()
        const params = this.buildFilterParams()
        const response = await api<{ data: CategoryPerformance[] }>(
          `/admin/reports/categories?${params.toString()}`
        )
        this.categoryPerformance = response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento performance categorie'
        console.error('fetchCategoryPerformance error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Carica statistiche geografiche
     */
    async fetchGeographicStats() {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 400))
          this.provinceStats = mockProvinceStats
          this.regionStats = mockRegionStats
          return
        }

        const { api } = useApi()
        const params = this.buildFilterParams()
        const response = await api<{ data: { provinces: ProvinceStats[], regions: RegionStats[] } }>(
          `/admin/reports/geographic?${params.toString()}`
        )
        this.provinceStats = response.data.provinces
        this.regionStats = response.data.regions
      } catch (error: any) {
        this.error = error.message || 'Errore nel caricamento statistiche geografiche'
        console.error('fetchGeographicStats error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Avvia export dati
     */
    async startExport(request: ExportRequest): Promise<ExportStatus | null> {
      this.exporting = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))

          const exportStatus: ExportStatus = {
            id: `exp-${Date.now()}`,
            type: request.type,
            status: 'completed',
            progress: 100,
            download_url: `/mock-exports/${request.type}-export.${request.format}`,
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString()
          }

          this.exports.unshift(exportStatus)
          this.currentExport = exportStatus
          return exportStatus
        }

        const { api } = useApi()
        const response = await api<{ data: ExportStatus }>('/admin/reports/export', {
          method: 'POST',
          body: request
        })

        this.exports.unshift(response.data)
        this.currentExport = response.data
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Errore nell\'avvio dell\'export'
        console.error('startExport error:', error)
        return null
      } finally {
        this.exporting = false
      }
    },

    /**
     * Controlla stato export
     */
    async checkExportStatus(exportId: string): Promise<ExportStatus | null> {
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          const exp = this.exports.find(e => e.id === exportId)
          return exp || null
        }

        const { api } = useApi()
        const response = await api<{ data: ExportStatus }>(`/admin/reports/export/${exportId}`)

        // Aggiorna nella lista
        const index = this.exports.findIndex(e => e.id === exportId)
        if (index !== -1) {
          this.exports[index] = response.data
        }

        return response.data
      } catch (error: any) {
        console.error('checkExportStatus error:', error)
        return null
      }
    },

    /**
     * Imposta filtri
     */
    setFilters(filters: Partial<ReportFilters>) {
      this.filters = { ...this.filters, ...filters }
    },

    /**
     * Reset filtri
     */
    resetFilters() {
      this.filters = {
        period: 'month',
        date_from: undefined,
        date_to: undefined,
        category_id: null,
        province_code: undefined
      }
    },

    /**
     * Costruisce parametri filtro per API
     */
    buildFilterParams(): URLSearchParams {
      const params = new URLSearchParams()

      if (this.filters.period) params.append('period', this.filters.period)
      if (this.filters.date_from) params.append('date_from', this.filters.date_from)
      if (this.filters.date_to) params.append('date_to', this.filters.date_to)
      if (this.filters.category_id) params.append('category_id', String(this.filters.category_id))
      if (this.filters.province_code) params.append('province_code', this.filters.province_code)

      return params
    },

    /**
     * Genera etichette periodo per grafici
     */
    generatePeriodLabels(): string[] {
      switch (this.filters.period) {
        case 'today':
          return ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
        case 'week':
          return ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
        case 'month':
          return Array.from({ length: 30 }, (_, i) => `${i + 1}`)
        case 'quarter':
          return ['Gen', 'Feb', 'Mar']
        case 'year':
          return ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']
        default:
          return []
      }
    },

    /**
     * Pulisci stato
     */
    clearState() {
      this.dashboardData = null
      this.salesStats = null
      this.salesChart = null
      this.categoryPerformance = []
      this.provinceStats = []
      this.regionStats = []
      this.error = null
    }
  }
})
