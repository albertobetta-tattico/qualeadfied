/**
 * useReport Composable - Funzioni per gestione report
 * Qualeadfied B2B Lead Platform
 */

import type { ReportPeriod, ExportType, ExportFormat } from '~/types/report'

/**
 * Azioni e notifiche per report
 */
export function useReportActions() {
  const toast = useToast()
  const confirm = useConfirm()

  const confirmExport = (type: ExportType, onConfirm: () => void) => {
    const labels: Record<ExportType, string> = {
      leads: 'Lead',
      orders: 'Ordini',
      clients: 'Clienti',
      transactions: 'Transazioni'
    }

    confirm.require({
      message: `Vuoi procedere con l'export dei dati "${labels[type]}"? Il file sarà disponibile per il download una volta completato.`,
      header: 'Conferma Export',
      icon: 'pi pi-download',
      acceptLabel: 'Esporta',
      rejectLabel: 'Annulla',
      accept: onConfirm
    })
  }

  const showSuccess = (message: string) => {
    toast.add({
      severity: 'success',
      summary: 'Operazione completata',
      detail: message,
      life: 3000
    })
  }

  const showError = (message: string) => {
    toast.add({
      severity: 'error',
      summary: 'Errore',
      detail: message,
      life: 5000
    })
  }

  const showInfo = (message: string) => {
    toast.add({
      severity: 'info',
      summary: 'Informazione',
      detail: message,
      life: 3000
    })
  }

  const showExportStarted = () => {
    toast.add({
      severity: 'info',
      summary: 'Export avviato',
      detail: 'Il file sarà pronto a breve per il download',
      life: 4000
    })
  }

  const showExportReady = (downloadUrl: string) => {
    toast.add({
      severity: 'success',
      summary: 'Export completato',
      detail: 'Il file è pronto per il download',
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
  const formatPeriod = (period: ReportPeriod): string => {
    const labels: Record<ReportPeriod, string> = {
      today: 'Oggi',
      week: 'Questa settimana',
      month: 'Questo mese',
      quarter: 'Questo trimestre',
      year: 'Quest\'anno',
      custom: 'Personalizzato'
    }
    return labels[period] || period
  }

  const formatExportType = (type: ExportType): string => {
    const labels: Record<ExportType, string> = {
      leads: 'Lead',
      orders: 'Ordini',
      clients: 'Clienti',
      transactions: 'Transazioni'
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
  const periodOptions = [
    { label: 'Oggi', value: 'today' },
    { label: 'Questa settimana', value: 'week' },
    { label: 'Questo mese', value: 'month' },
    { label: 'Questo trimestre', value: 'quarter' },
    { label: 'Quest\'anno', value: 'year' },
    { label: 'Personalizzato', value: 'custom' }
  ]

  const exportTypeOptions = [
    { label: 'Lead', value: 'leads', icon: 'pi pi-list', description: 'Esporta tutti i lead con filtri applicati' },
    { label: 'Ordini', value: 'orders', icon: 'pi pi-shopping-cart', description: 'Esporta ordini per il periodo selezionato' },
    { label: 'Clienti', value: 'clients', icon: 'pi pi-users', description: 'Esporta anagrafica completa clienti' },
    { label: 'Transazioni', value: 'transactions', icon: 'pi pi-credit-card', description: 'Esporta transazioni per prima nota' }
  ]

  const exportFormatOptions = [
    { label: 'Excel (.xlsx)', value: 'xlsx' },
    { label: 'CSV (.csv)', value: 'csv' }
  ]

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
