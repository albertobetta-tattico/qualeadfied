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
  dashboardData: DashboardData | null
  salesStats: SalesStats | null
  salesChart: SalesChartData | null
  categoryPerformance: CategoryPerformance[]
  provinceStats: ProvinceStats[]
  regionStats: RegionStats[]
  filters: ReportFilters
  exports: ExportStatus[]
  currentExport: ExportStatus | null
  loading: boolean
  exporting: boolean
  error: string | null
}

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
      province_code: undefined,
      client_id: null
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
        state.filters.client_id ||
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
    // ALL report endpoints are NOT in the OpenAPI spec - using $fetch fallback

    async fetchDashboard() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: DashboardData }>(`${config.public.apiBase}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
            Accept: 'application/json'
          }
        })
        this.dashboardData = response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchDashboard error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchSalesStats() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const params = this.buildFilterParams()
        const response = await $fetch<{ data: { stats: SalesStats; chart: SalesChartData } }>(
          `${config.public.apiBase}/admin/reports/sales?${params.toString()}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
              Accept: 'application/json'
            }
          }
        )
        this.salesStats = response.data.stats
        this.salesChart = response.data.chart
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchSalesStats error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchCategoryPerformance() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const params = this.buildFilterParams()
        const response = await $fetch<{ data: CategoryPerformance[] }>(
          `${config.public.apiBase}/admin/reports/categories?${params.toString()}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
              Accept: 'application/json'
            }
          }
        )
        this.categoryPerformance = response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchCategoryPerformance error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchGeographicStats() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const params = this.buildFilterParams()
        const response = await $fetch<{ data: { provinces: ProvinceStats[]; regions: RegionStats[] } }>(
          `${config.public.apiBase}/admin/reports/geographic?${params.toString()}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
              Accept: 'application/json'
            }
          }
        )
        this.provinceStats = response.data.provinces
        this.regionStats = response.data.regions
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchGeographicStats error:', error)
      } finally {
        this.loading = false
      }
    },

    async startExport(request: ExportRequest): Promise<ExportStatus | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.exporting = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: ExportStatus }>(`${config.public.apiBase}/admin/reports/export`, {
          method: 'POST',
          body: request,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
            Accept: 'application/json'
          }
        })

        this.exports.unshift(response.data)
        this.currentExport = response.data
        return response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.exportError')
        console.error('startExport error:', error)
        return null
      } finally {
        this.exporting = false
      }
    },

    async checkExportStatus(exportId: string): Promise<ExportStatus | null> {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: ExportStatus }>(`${config.public.apiBase}/admin/reports/export/${exportId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
            Accept: 'application/json'
          }
        })

        const index = this.exports.findIndex(e => e.id === exportId)
        if (index !== -1) this.exports[index] = response.data

        return response.data
      } catch (error: any) {
        console.error('checkExportStatus error:', error)
        return null
      }
    },

    setFilters(filters: Partial<ReportFilters>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        period: 'month',
        date_from: undefined,
        date_to: undefined,
        category_id: null,
        province_code: undefined,
        client_id: null
      }
    },

    buildFilterParams(): URLSearchParams {
      const params = new URLSearchParams()
      if (this.filters.period) params.append('period', this.filters.period)
      if (this.filters.date_from) params.append('date_from', this.filters.date_from)
      if (this.filters.date_to) params.append('date_to', this.filters.date_to)
      if (this.filters.category_id) params.append('category_id', String(this.filters.category_id))
      if (this.filters.province_code) params.append('province_code', this.filters.province_code)
      if (this.filters.client_id) params.append('client_id', String(this.filters.client_id))
      return params
    },

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
