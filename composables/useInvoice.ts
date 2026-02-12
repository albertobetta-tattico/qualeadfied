/**
 * useInvoice Composable - Funzioni per gestione fatture
 * Qualeadfied B2B Lead Platform
 */

import type { Invoice, InvoiceWithDetails, SdiStatus, InvoiceType } from '~/types/invoice'

/**
 * Azioni conferma per fatture
 */
export function useInvoiceActions() {
  const { t } = useI18n()
  const toast = useToast()
  const confirm = useConfirm()

  const confirmResendSdi = (invoice: Invoice, onConfirm: () => void) => {
    confirm.require({
      message: t('orders.invoices.confirm.resendSdi.message', { number: invoice.invoice_number }),
      header: t('orders.invoices.confirm.resendSdi.header'),
      icon: 'pi pi-send',
      acceptLabel: t('orders.invoices.confirm.resendSdi.accept'),
      rejectLabel: t('orders.invoices.confirm.resendSdi.reject'),
      accept: onConfirm
    })
  }

  const confirmSendEmail = (invoice: Invoice, onConfirm: () => void) => {
    confirm.require({
      message: t('orders.invoices.confirm.sendEmail.message', { number: invoice.invoice_number }),
      header: t('orders.invoices.confirm.sendEmail.header'),
      icon: 'pi pi-envelope',
      acceptLabel: t('orders.invoices.confirm.sendEmail.accept'),
      rejectLabel: t('orders.invoices.confirm.sendEmail.reject'),
      accept: onConfirm
    })
  }

  const confirmCreateCreditNote = (invoice: Invoice, onConfirm: () => void) => {
    confirm.require({
      message: t('orders.invoices.confirm.createCreditNote.message', { number: invoice.invoice_number, amount: formatCurrency(invoice.total) }),
      header: t('orders.invoices.confirm.createCreditNote.header'),
      icon: 'pi pi-file-edit',
      acceptClass: 'p-button-warning',
      acceptLabel: t('orders.invoices.confirm.createCreditNote.accept'),
      rejectLabel: t('orders.invoices.confirm.createCreditNote.reject'),
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

  const showWarning = (message: string) => {
    toast.add({
      severity: 'warn',
      summary: t('notifications.toast.summaries.warning'),
      detail: message,
      life: 4000
    })
  }

  return {
    confirmResendSdi,
    confirmSendEmail,
    confirmCreateCreditNote,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}

/**
 * Formattatori per visualizzazione fatture
 */
export function useInvoiceFormatters() {
  const { t } = useI18n()

  const formatInvoiceType = (type: InvoiceType): string => {
    const labels: Record<InvoiceType, string> = {
      invoice: t('orders.invoices.type.invoice'),
      credit_note: t('orders.invoices.type.creditNote')
    }
    return labels[type] || type
  }

  const getInvoiceTypeSeverity = (type: InvoiceType): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined => {
    const severities: Record<InvoiceType, "success" | "info" | "warn" | "danger" | "secondary"> = {
      invoice: 'info',
      credit_note: 'warn'
    }
    return severities[type] || 'secondary'
  }

  const formatSdiStatus = (status: SdiStatus): string => {
    const labels: Record<SdiStatus, string> = {
      pending: t('orders.invoices.sdiStatus.pending'),
      sent: t('orders.invoices.sdiStatus.sent'),
      delivered: t('orders.invoices.sdiStatus.delivered'),
      accepted: t('orders.invoices.sdiStatus.accepted'),
      rejected: t('orders.invoices.sdiStatus.rejected'),
      not_delivered: t('orders.invoices.sdiStatus.notDelivered'),
      error: t('orders.invoices.sdiStatus.error')
    }
    return labels[status] || status
  }

  const getSdiStatusSeverity = (status: SdiStatus): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined => {
    const severities: Record<SdiStatus, "success" | "info" | "warn" | "danger" | "secondary"> = {
      pending: 'warn',
      sent: 'info',
      delivered: 'success',
      accepted: 'success',
      rejected: 'danger',
      not_delivered: 'danger',
      error: 'danger'
    }
    return severities[status] || 'secondary'
  }

  const getSdiStatusIcon = (status: SdiStatus): string => {
    const icons: Record<SdiStatus, string> = {
      pending: 'pi pi-clock',
      sent: 'pi pi-send',
      delivered: 'pi pi-check',
      accepted: 'pi pi-check-circle',
      rejected: 'pi pi-times-circle',
      not_delivered: 'pi pi-exclamation-triangle',
      error: 'pi pi-exclamation-circle'
    }
    return icons[status] || 'pi pi-question'
  }

  const canResendToSdi = (invoice: Invoice): boolean => {
    return ['pending', 'rejected', 'not_delivered', 'error'].includes(invoice.sdi_status)
  }

  const canCreateCreditNote = (invoice: Invoice): boolean => {
    return invoice.type === 'invoice' && invoice.total > 0
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

  const formatVatNumber = (vat: string | undefined): string => {
    if (!vat) return '-'
    const clean = vat.replace(/\s/g, '').toUpperCase()
    return clean.startsWith('IT') ? clean : `IT${clean}`
  }

  const getClientFullName = (invoice: Invoice | InvoiceWithDetails): string => {
    if (invoice.client) {
      return `${invoice.client.contact_first_name} ${invoice.client.contact_last_name}`.trim() || '-'
    }
    return '-'
  }

  const formatBillingAddress = (invoice: Invoice | InvoiceWithDetails): string => {
    const data = invoice.billing_data
    if (!data) return '-'

    const parts: string[] = []
    if (data.address) parts.push(data.address)
    if (data.postal_code || data.city) {
      parts.push([data.postal_code, data.city].filter(Boolean).join(' '))
    }
    if (data.province) parts.push(`(${data.province})`)

    return parts.join(', ') || '-'
  }

  return {
    formatInvoiceType,
    getInvoiceTypeSeverity,
    formatSdiStatus,
    getSdiStatusSeverity,
    getSdiStatusIcon,
    canResendToSdi,
    canCreateCreditNote,
    formatDate,
    formatDateTime,
    formatCurrency,
    formatVatNumber,
    getClientFullName,
    formatBillingAddress
  }
}

/**
 * Formatta valuta in Euro
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}

/**
 * Opzioni per filtri fatture
 */
export function useInvoiceFilterOptions() {
  const { t } = useI18n()

  const typeOptions = computed(() => [
    { label: t('orders.invoices.type.all'), value: '' },
    { label: t('orders.invoices.type.invoicePlural'), value: 'invoice' },
    { label: t('orders.invoices.type.creditNotePlural'), value: 'credit_note' }
  ])

  const sdiStatusOptions = computed(() => [
    { label: t('orders.invoices.sdiStatus.all'), value: '' },
    { label: t('orders.invoices.sdiStatus.pending'), value: 'pending' },
    { label: t('orders.invoices.sdiStatus.sent'), value: 'sent' },
    { label: t('orders.invoices.sdiStatus.delivered'), value: 'delivered' },
    { label: t('orders.invoices.sdiStatus.accepted'), value: 'accepted' },
    { label: t('orders.invoices.sdiStatus.rejected'), value: 'rejected' },
    { label: t('orders.invoices.sdiStatus.notDelivered'), value: 'not_delivered' },
    { label: t('orders.invoices.sdiStatus.error'), value: 'error' }
  ])

  return {
    typeOptions,
    sdiStatusOptions
  }
}
