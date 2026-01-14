/**
 * useInvoice Composable - Funzioni per gestione fatture
 * Qualeadfied B2B Lead Platform
 */

import type { Invoice, InvoiceWithDetails, SdiStatus, InvoiceType } from '~/types/invoice'

/**
 * Azioni conferma per fatture
 */
export function useInvoiceActions() {
  const toast = useToast()
  const confirm = useConfirm()

  const confirmResendSdi = (invoice: Invoice, onConfirm: () => void) => {
    confirm.require({
      message: `Reinviare la fattura "${invoice.invoice_number}" a SDI?`,
      header: 'Reinvio a SDI',
      icon: 'pi pi-send',
      acceptLabel: 'Reinvia',
      rejectLabel: 'Annulla',
      accept: onConfirm
    })
  }

  const confirmSendEmail = (invoice: Invoice, onConfirm: () => void) => {
    confirm.require({
      message: `Inviare la fattura "${invoice.invoice_number}" via email al cliente?`,
      header: 'Invio Email',
      icon: 'pi pi-envelope',
      acceptLabel: 'Invia',
      rejectLabel: 'Annulla',
      accept: onConfirm
    })
  }

  const confirmCreateCreditNote = (invoice: Invoice, onConfirm: () => void) => {
    confirm.require({
      message: `Creare una nota di credito per la fattura "${invoice.invoice_number}"? L'importo sarà di ${formatCurrency(invoice.total)}.`,
      header: 'Crea Nota di Credito',
      icon: 'pi pi-file-edit',
      acceptClass: 'p-button-warning',
      acceptLabel: 'Crea',
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

  const showWarning = (message: string) => {
    toast.add({
      severity: 'warn',
      summary: 'Attenzione',
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
  const formatInvoiceType = (type: InvoiceType): string => {
    const labels: Record<InvoiceType, string> = {
      invoice: 'Fattura',
      credit_note: 'Nota di Credito'
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
      pending: 'In Attesa',
      sent: 'Inviata',
      delivered: 'Consegnata',
      accepted: 'Accettata',
      rejected: 'Rifiutata',
      not_delivered: 'Non Consegnata',
      error: 'Errore'
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
  const typeOptions = [
    { label: 'Tutti i tipi', value: '' },
    { label: 'Fatture', value: 'invoice' },
    { label: 'Note di Credito', value: 'credit_note' }
  ]

  const sdiStatusOptions = [
    { label: 'Tutti gli stati', value: '' },
    { label: 'In Attesa', value: 'pending' },
    { label: 'Inviata', value: 'sent' },
    { label: 'Consegnata', value: 'delivered' },
    { label: 'Accettata', value: 'accepted' },
    { label: 'Rifiutata', value: 'rejected' },
    { label: 'Non Consegnata', value: 'not_delivered' },
    { label: 'Errore', value: 'error' }
  ]

  return {
    typeOptions,
    sdiStatusOptions
  }
}
