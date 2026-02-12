/**
 * useReport Composable - Funzioni per gestione report
 * Qualeadfied B2B Lead Platform
 */

import type { ReportPeriod, ExportType, ExportFormat } from '~/types/report'

/**
 * Azioni e notifiche per report
 */
export function useReportActions() {
  const { t } = useI18n()
  const toast = useToast()
  const confirm = useConfirm()

  const confirmExport = (type: ExportType, onConfirm: () => void) => {
    const labels: Record<ExportType, string> = {
      leads: t('admin.reports.dataExport.types.leads'),
      orders: t('admin.reports.dataExport.types.orders'),
      clients: t('admin.reports.dataExport.types.clients'),
      transactions: t('admin.reports.dataExport.types.transactions')
    }

    confirm.require({
      message: t('admin.reports.confirm.exportMessage', { type: labels[type] }),
      header: t('admin.reports.confirm.exportHeader'),
      icon: 'pi pi-download',
      acceptLabel: t('admin.reports.confirm.exportAccept'),
      rejectLabel: t('common.actions.cancel'),
      accept: onConfirm
    })
  }

  const showSuccess = (message: string) => {
    toast.add({
      severity: 'success',
      summary: t('notifications.toast.summaries.success'),
      detail: message,
      life: 3000
    })
  }

  const showError = (message: string) => {
    toast.add({
      severity: 'error',
      summary: t('notifications.toast.summaries.error'),
      detail: message,
      life: 5000
    })
  }

  const showInfo = (message: string) => {
    toast.add({
      severity: 'info',
      summary: t('notifications.toast.summaries.info'),
      detail: message,
      life: 3000
    })
  }

  const showExportStarted = () => {
    toast.add({
      severity: 'info',
      summary: t('admin.reports.toast.exportStarted'),
      detail: t('admin.reports.toast.exportStartedDetail'),
      life: 4000
    })
  }

  const showExportReady = (downloadUrl: string) => {
    toast.add({
      severity: 'success',
      summary: t('admin.reports.toast.exportCompleted'),
      detail: t('admin.reports.toast.exportReadyDetail'),
      life: 5000
    })
  }

  return {
    confirmExport,
    showSuccess,
    showError,
    showInfo,
    showExportStarted,
    showExportReady
  }
}

/**
 * Formattatori per visualizzazione report
 */
export function useReportFormatters() {
  const { t } = useI18n()

  const formatPeriod = (period: ReportPeriod): string => {
    const labels: Record<ReportPeriod, string> = {
      today: t('admin.reports.periods.today'),
      week: t('admin.reports.periods.week'),
      month: t('admin.reports.periods.month'),
      quarter: t('admin.reports.periods.quarter'),
      year: t('admin.reports.periods.year'),
      custom: t('admin.reports.periods.custom')
    }
    return labels[period] || period
  }

  const formatExportType = (type: ExportType): string => {
    const labels: Record<ExportType, string> = {
      leads: t('admin.reports.dataExport.types.leads'),
      orders: t('admin.reports.dataExport.types.orders'),
      clients: t('admin.reports.dataExport.types.clients'),
      transactions: t('admin.reports.dataExport.types.transactions')
    }
    return labels[type] || type
  }

  const formatExportFormat = (format: ExportFormat): string => {
    const labels: Record<ExportFormat, string> = {
      xlsx: 'Excel (.xlsx)',
      csv: 'CSV (.csv)'
    }
    return labels[format] || format
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('it-IT').format(value)
  }

  const formatPercent = (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`
  }

  const formatPercentChange = (value: number): string => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  const getChangeClass = (value: number): string => {
    if (value > 0) return 'text-success-600'
    if (value < 0) return 'text-danger-600'
    return 'text-neutral-500'
  }

  const getChangeIcon = (value: number): string => {
    if (value > 0) return 'pi pi-arrow-up'
    if (value < 0) return 'pi pi-arrow-down'
    return 'pi pi-minus'
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable'): string => {
    const icons: Record<string, string> = {
      up: 'pi pi-arrow-up',
      down: 'pi pi-arrow-down',
      stable: 'pi pi-minus'
    }
    return icons[trend] || 'pi pi-minus'
  }

  const getTrendClass = (trend: 'up' | 'down' | 'stable'): string => {
    const classes: Record<string, string> = {
      up: 'text-success-600',
      down: 'text-danger-600',
      stable: 'text-neutral-500'
    }
    return classes[trend] || 'text-neutral-500'
  }

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatShortDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short'
    })
  }

  return {
    formatPeriod,
    formatExportType,
    formatExportFormat,
    formatCurrency,
    formatNumber,
    formatPercent,
    formatPercentChange,
    getChangeClass,
    getChangeIcon,
    getTrendIcon,
    getTrendClass,
    formatDate,
    formatDateTime,
    formatShortDate
  }
}

/**
 * Opzioni per filtri report
 */
export function useReportFilterOptions() {
  const { t } = useI18n()

  const periodOptions = computed(() => [
    { label: t('admin.reports.periods.today'), value: 'today' },
    { label: t('admin.reports.periods.week'), value: 'week' },
    { label: t('admin.reports.periods.month'), value: 'month' },
    { label: t('admin.reports.periods.quarter'), value: 'quarter' },
    { label: t('admin.reports.periods.year'), value: 'year' },
    { label: t('admin.reports.periods.custom'), value: 'custom' }
  ])

  const exportTypeOptions = computed(() => [
    { label: t('admin.reports.dataExport.types.leads'), value: 'leads', icon: 'pi pi-list', description: t('admin.reports.dataExport.descriptions.leads') },
    { label: t('admin.reports.dataExport.types.orders'), value: 'orders', icon: 'pi pi-shopping-cart', description: t('admin.reports.dataExport.descriptions.orders') },
    { label: t('admin.reports.dataExport.types.clients'), value: 'clients', icon: 'pi pi-users', description: t('admin.reports.dataExport.descriptions.clients') },
    { label: t('admin.reports.dataExport.types.transactions'), value: 'transactions', icon: 'pi pi-credit-card', description: t('admin.reports.dataExport.descriptions.transactions') }
  ])

  const exportFormatOptions = computed(() => [
    { label: 'Excel (.xlsx)', value: 'xlsx' },
    { label: 'CSV (.csv)', value: 'csv' }
  ])

  return {
    periodOptions,
    exportTypeOptions,
    exportFormatOptions
  }
}

/**
 * Colori per grafici
 */
export function useChartColors() {
  const primaryColor = '#4F46E5'
  const successColor = '#10B981'
  const warningColor = '#F59E0B'
  const dangerColor = '#EF4444'
  const infoColor = '#3B82F6'

  const chartColors = [
    '#4F46E5', // primary
    '#10B981', // success
    '#F59E0B', // warning
    '#EF4444', // danger
    '#3B82F6', // info
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316'  // orange
  ]

  const getChartColor = (index: number): string => {
    return chartColors[index % chartColors.length]
  }

  const revenueChartConfig = {
    borderColor: primaryColor,
    backgroundColor: `${primaryColor}20`,
    fill: true,
    tension: 0.4
  }

  const ordersChartConfig = {
    borderColor: successColor,
    backgroundColor: `${successColor}20`,
    fill: true,
    tension: 0.4
  }

  const leadsChartConfig = {
    borderColor: infoColor,
    backgroundColor: `${infoColor}20`,
    fill: true,
    tension: 0.4
  }

  return {
    primaryColor,
    successColor,
    warningColor,
    dangerColor,
    infoColor,
    chartColors,
    getChartColor,
    revenueChartConfig,
    ordersChartConfig,
    leadsChartConfig
  }
}
