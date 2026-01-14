/**
 * useTransaction Composable - Funzioni per gestione transazioni Stripe
 * Qualeadfied B2B Lead Platform
 */

import type { 
  Transaction, 
  TransactionWithDetails,
  TransactionStatus, 
  TransactionPaymentType
} from '~/types/transaction'

/**
 * Formattatori per visualizzazione transazioni
 */
export function useTransactionFormatters() {
  /**
   * Formatta lo stato transazione in italiano
   */
  const formatStatus = (status: TransactionStatus): string => {
    const labels: Record<TransactionStatus, string> = {
      pending: 'In Attesa',
      requires_action: 'Azione Richiesta',
      processing: 'In Elaborazione',
      succeeded: 'Completata',
      failed: 'Fallita',
      canceled: 'Annullata'
    }
    return labels[status] || status
  }

  /**
   * Restituisce il severity per i tag PrimeVue
   */
  const getStatusSeverity = (status: TransactionStatus): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined => {
    const severities: Record<TransactionStatus, "success" | "info" | "warn" | "danger" | "secondary"> = {
      pending: 'warn',
      requires_action: 'warn',
      processing: 'info',
      succeeded: 'success',
      failed: 'danger',
      canceled: 'secondary'
    }
    return severities[status] || 'secondary'
  }

  /**
   * Restituisce l'icona per lo stato
   */
  const getStatusIcon = (status: TransactionStatus): string => {
    const icons: Record<TransactionStatus, string> = {
      pending: 'pi-clock',
      requires_action: 'pi-exclamation-triangle',
      processing: 'pi-spin pi-spinner',
      succeeded: 'pi-check-circle',
      failed: 'pi-times-circle',
      canceled: 'pi-ban'
    }
    return icons[status] || 'pi-question-circle'
  }

  /**
   * Formatta il tipo di pagamento in italiano
   */
  const formatPaymentType = (type: TransactionPaymentType): string => {
    const labels: Record<TransactionPaymentType, string> = {
      card: 'Carta di Credito',
      sepa_debit: 'Addebito SEPA'
    }
    return labels[type] || type
  }

  /**
   * Restituisce l'icona per il tipo di pagamento
   */
  const getPaymentTypeIcon = (type: TransactionPaymentType): string => {
    const icons: Record<TransactionPaymentType, string> = {
      card: 'pi-credit-card',
      sepa_debit: 'pi-building'
    }
    return icons[type] || 'pi-wallet'
  }

  /**
   * Restituisce il colore per il tipo di pagamento
   */
  const getPaymentTypeColor = (type: TransactionPaymentType): string => {
    const colors: Record<TransactionPaymentType, string> = {
      card: 'text-blue-600',
      sepa_debit: 'text-purple-600'
    }
    return colors[type] || 'text-neutral-600'
  }

  /**
   * Formatta una data in formato italiano
   */
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  /**
   * Formatta data e ora in formato italiano
   */
  const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  /**
   * Formatta un importo in valuta
   */
  const formatCurrency = (value: number | null | undefined, currency: string = 'EUR'): string => {
    if (value === null || value === undefined) return '€ 0,00'
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(value)
  }

  /**
   * Formatta il Payment Intent ID in formato breve
   */
  const formatPaymentIntentShort = (id: string): string => {
    if (!id) return '-'
    // pi_3PQ1234567890abcdefghij -> pi_3PQ...ghij
    if (id.length > 15) {
      return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`
    }
    return id
  }

  /**
   * Restituisce il nome completo del cliente
   */
  const getClientFullName = (transaction: Transaction): string => {
    if (!transaction.client) return '-'
    return `${transaction.client.contact_first_name} ${transaction.client.contact_last_name}`.trim() || '-'
  }

  /**
   * Formatta il brand della carta
   */
  const formatCardBrand = (brand: string): string => {
    const brands: Record<string, string> = {
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'American Express',
      discover: 'Discover',
      diners: 'Diners Club',
      jcb: 'JCB',
      unionpay: 'UnionPay'
    }
    return brands[brand?.toLowerCase()] || brand || '-'
  }

  /**
   * Restituisce l'icona per il brand della carta
   */
  const getCardBrandIcon = (brand: string): string => {
    const icons: Record<string, string> = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
    }
    return icons[brand?.toLowerCase()] || '💳'
  }

  /**
   * Formatta la scadenza della carta
   */
  const formatCardExpiry = (month: number, year: number): string => {
    if (!month || !year) return '-'
    return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`
  }

  /**
   * Formatta il codice di errore
   */
  const formatFailureCode = (code: string | null): string => {
    if (!code) return '-'
    const codes: Record<string, string> = {
      'card_declined': 'Carta Rifiutata',
      'insufficient_funds': 'Fondi Insufficienti',
      'expired_card': 'Carta Scaduta',
      'incorrect_cvc': 'CVC Non Valido',
      'processing_error': 'Errore di Elaborazione',
      'incorrect_number': 'Numero Carta Non Valido',
      'authentication_required': 'Autenticazione Richiesta',
      'bank_account_declined': 'Conto Rifiutato',
      'debit_not_authorized': 'Addebito Non Autorizzato'
    }
    return codes[code] || code
  }

  /**
   * Determina se una transazione è in uno stato finale
   */
  const isFinalStatus = (status: TransactionStatus): boolean => {
    return ['succeeded', 'failed', 'canceled'].includes(status)
  }

  /**
   * Determina se una transazione può essere rimborsata
   */
  const isRefundable = (transaction: Transaction): boolean => {
    return transaction.status === 'succeeded' && !!transaction.stripe_charge_id
  }

  return {
    formatStatus,
    getStatusSeverity,
    getStatusIcon,
    formatPaymentType,
    getPaymentTypeIcon,
    getPaymentTypeColor,
    formatDate,
    formatDateTime,
    formatCurrency,
    formatPaymentIntentShort,
    getClientFullName,
    formatCardBrand,
    getCardBrandIcon,
    formatCardExpiry,
    formatFailureCode,
    isFinalStatus,
    isRefundable
  }
}

/**
 * Azioni e conferme per transazioni
 */
export function useTransactionActions() {
  const toast = useToast()

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

  /**
   * Copia il Payment Intent ID negli appunti
   */
  const copyPaymentIntentId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id)
      showSuccess(`Payment Intent ID copiato negli appunti`)
    } catch {
      showError('Impossibile copiare negli appunti')
    }
  }

  /**
   * Copia il Charge ID negli appunti
   */
  const copyChargeId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id)
      showSuccess(`Charge ID copiato negli appunti`)
    } catch {
      showError('Impossibile copiare negli appunti')
    }
  }

  /**
   * Apre la dashboard Stripe per una transazione (Payment Intent)
   */
  const openStripePayment = (paymentIntentId: string) => {
    const stripeUrl = `https://dashboard.stripe.com/payments/${paymentIntentId}`
    window.open(stripeUrl, '_blank')
  }

  /**
   * Apre la dashboard Stripe per un cliente
   */
  const openStripeCustomer = (customerId: string) => {
    const stripeUrl = `https://dashboard.stripe.com/customers/${customerId}`
    window.open(stripeUrl, '_blank')
  }

  /**
   * Formatta JSON per visualizzazione
   */
  const formatJsonForDisplay = (json: Record<string, unknown> | null): string => {
    if (!json) return '{}'
    try {
      return JSON.stringify(json, null, 2)
    } catch {
      return '{}'
    }
  }

  /**
   * Copia JSON negli appunti
   */
  const copyJsonToClipboard = async (json: Record<string, unknown> | null) => {
    try {
      const formatted = formatJsonForDisplay(json)
      await navigator.clipboard.writeText(formatted)
      showSuccess('Risposta Stripe copiata negli appunti')
    } catch {
      showError('Impossibile copiare negli appunti')
    }
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    copyPaymentIntentId,
    copyChargeId,
    openStripePayment,
    openStripeCustomer,
    formatJsonForDisplay,
    copyJsonToClipboard
  }
}

/**
 * Opzioni per dropdown e filtri
 */
export function useTransactionOptions() {
  const statusOptions = [
    { label: 'Tutti gli stati', value: '' },
    { label: 'In Attesa', value: 'pending' },
    { label: 'Azione Richiesta', value: 'requires_action' },
    { label: 'In Elaborazione', value: 'processing' },
    { label: 'Completata', value: 'succeeded' },
    { label: 'Fallita', value: 'failed' },
    { label: 'Annullata', value: 'canceled' }
  ]

  const paymentTypeOptions = [
    { label: 'Tutti i tipi', value: '' },
    { label: 'Carta di Credito', value: 'card' },
    { label: 'Addebito SEPA', value: 'sepa_debit' }
  ]

  return {
    statusOptions,
    paymentTypeOptions
  }
}
