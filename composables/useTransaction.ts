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
  const { t } = useI18n()

  /**
   * Formatta lo stato transazione
   */
  const formatStatus = (status: TransactionStatus): string => {
    const labels: Record<TransactionStatus, string> = {
      pending: t('orders.transactions.status.pending'),
      requires_action: t('orders.transactions.status.requiresAction'),
      processing: t('orders.transactions.status.processing'),
      succeeded: t('orders.transactions.status.succeeded'),
      failed: t('orders.transactions.status.failed'),
      canceled: t('orders.transactions.status.canceled')
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
   * Formatta il tipo di pagamento
   */
  const formatPaymentType = (type: TransactionPaymentType): string => {
    const labels: Record<TransactionPaymentType, string> = {
      card: t('orders.transactions.paymentType.card'),
      sepa_debit: t('orders.transactions.paymentType.sepaDebit')
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
      'card_declined': t('orders.transactions.failureCodes.cardDeclined'),
      'insufficient_funds': t('orders.transactions.failureCodes.insufficientFunds'),
      'expired_card': t('orders.transactions.failureCodes.expiredCard'),
      'incorrect_cvc': t('orders.transactions.failureCodes.incorrectCvc'),
      'processing_error': t('orders.transactions.failureCodes.processingError'),
      'incorrect_number': t('orders.transactions.failureCodes.incorrectNumber'),
      'authentication_required': t('orders.transactions.failureCodes.authenticationRequired'),
      'bank_account_declined': t('orders.transactions.failureCodes.bankAccountDeclined'),
      'debit_not_authorized': t('orders.transactions.failureCodes.debitNotAuthorized')
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
  const { t } = useI18n()
  const toast = useToast()

  const showSuccess = (message: string) => {
    toast.add({
      severity: 'success',
      summary: t('orders.toast.success'),
      detail: message,
      life: 3000
    })
  }

  const showError = (message: string) => {
    toast.add({
      severity: 'error',
      summary: t('orders.toast.error'),
      detail: message,
      life: 5000
    })
  }

  const showInfo = (message: string) => {
    toast.add({
      severity: 'info',
      summary: t('orders.toast.info'),
      detail: message,
      life: 3000
    })
  }

  const showWarning = (message: string) => {
    toast.add({
      severity: 'warn',
      summary: t('orders.toast.warning'),
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
      showSuccess(t('orders.transactions.toast.paymentIntentCopied'))
    } catch {
      showError(t('orders.transactions.toast.cannotCopy'))
    }
  }

  /**
   * Copia il Charge ID negli appunti
   */
  const copyChargeId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id)
      showSuccess(t('orders.transactions.toast.chargeIdCopied'))
    } catch {
      showError(t('orders.transactions.toast.cannotCopy'))
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
      showSuccess(t('orders.transactions.toast.stripeResponseCopied'))
    } catch {
      showError(t('orders.transactions.toast.cannotCopy'))
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
  const { t } = useI18n()

  const statusOptions = computed(() => [
    { label: t('orders.transactions.status.all'), value: '' },
    { label: t('orders.transactions.status.pending'), value: 'pending' },
    { label: t('orders.transactions.status.requiresAction'), value: 'requires_action' },
    { label: t('orders.transactions.status.processing'), value: 'processing' },
    { label: t('orders.transactions.status.succeeded'), value: 'succeeded' },
    { label: t('orders.transactions.status.failed'), value: 'failed' },
    { label: t('orders.transactions.status.canceled'), value: 'canceled' }
  ])

  const paymentTypeOptions = computed(() => [
    { label: t('orders.transactions.paymentType.all'), value: '' },
    { label: t('orders.transactions.paymentType.card'), value: 'card' },
    { label: t('orders.transactions.paymentType.sepaDebit'), value: 'sepa_debit' }
  ])

  return {
    statusOptions,
    paymentTypeOptions
  }
}
