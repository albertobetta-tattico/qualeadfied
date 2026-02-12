/**
 * useOrder Composable - Funzioni per gestione ordini
 * Qualeadfied B2B Lead Platform
 */

import { computed } from 'vue'
import type {
  Order,
  OrderWithDetails,
  OrderStatus,
  OrderType,
  PaymentMethod,
  AcquisitionMode,
  OrderItem
} from '~/types/order'

/**
 * Formattatori per visualizzazione ordini
 */
export function useOrderFormatters() {
  const { t } = useI18n()

  /**
   * Formatta lo stato ordine
   */
  const formatStatus = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      pending: t('orders.status.pending'),
      processing: t('orders.status.processing'),
      paid: t('orders.status.paid'),
      failed: t('orders.status.failed'),
      refunded: t('orders.status.refunded'),
      cancelled: t('orders.status.cancelled')
    }
    return labels[status] || status
  }

  /**
   * Restituisce il severity per i tag PrimeVue
   */
  const getStatusSeverity = (status: OrderStatus): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined => {
    const severities: Record<OrderStatus, "success" | "info" | "warn" | "danger" | "secondary"> = {
      pending: 'warn',
      processing: 'info',
      paid: 'success',
      failed: 'danger',
      refunded: 'secondary',
      cancelled: 'secondary'
    }
    return severities[status] || 'secondary'
  }

  /**
   * Formatta il tipo ordine
   */
  const formatType = (type: OrderType): string => {
    const labels: Record<OrderType, string> = {
      single: t('orders.type.single'),
      package: t('orders.type.package'),
      free_trial: t('orders.type.freeTrial')
    }
    return labels[type] || type
  }

  /**
   * Restituisce il severity per il tipo ordine
   */
  const getTypeSeverity = (type: OrderType): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined => {
    const severities: Record<OrderType, "success" | "info" | "warn" | "secondary"> = {
      single: 'info',
      package: 'success',
      free_trial: 'warn'
    }
    return severities[type] || 'secondary'
  }

  /**
   * Formatta il metodo di pagamento
   */
  const formatPaymentMethod = (method: PaymentMethod): string => {
    const labels: Record<PaymentMethod, string> = {
      card: t('orders.paymentMethod.card'),
      sepa: t('orders.paymentMethod.sepa'),
      free: t('orders.paymentMethod.free')
    }
    return labels[method] || method
  }

  /**
   * Restituisce l'icona per il metodo di pagamento
   */
  const getPaymentMethodIcon = (method: PaymentMethod): string => {
    const icons: Record<PaymentMethod, string> = {
      card: 'pi-credit-card',
      sepa: 'pi-building',
      free: 'pi-gift'
    }
    return icons[method] || 'pi-wallet'
  }

  /**
   * Formatta la modalità di acquisizione lead
   */
  const formatAcquisitionMode = (mode: AcquisitionMode): string => {
    const labels: Record<AcquisitionMode, string> = {
      exclusive: t('orders.acquisitionMode.exclusive'),
      shared: t('orders.acquisitionMode.shared'),
      free: t('orders.acquisitionMode.free')
    }
    return labels[mode] || mode
  }

  /**
   * Restituisce il severity per la modalità di acquisizione
   */
  const getAcquisitionModeSeverity = (mode: AcquisitionMode): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined => {
    const severities: Record<AcquisitionMode, "success" | "info" | "warn" | "secondary"> = {
      exclusive: 'success',
      shared: 'info',
      free: 'warn'
    }
    return severities[mode] || 'secondary'
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
      minute: '2-digit'
    })
  }

  /**
   * Formatta un importo in valuta EUR
   */
  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '€ 0,00'
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }

  /**
   * Formatta la P.IVA con prefisso IT
   */
  const formatVatNumber = (vat: string | null | undefined): string => {
    if (!vat) return '-'
    const clean = vat.replace(/\s/g, '').toUpperCase()
    return clean.startsWith('IT') ? clean : `IT${clean}`
  }

  /**
   * Restituisce il nome completo del cliente
   */
  const getClientFullName = (order: Order): string => {
    if (!order.client) return '-'
    return `${order.client.contact_first_name} ${order.client.contact_last_name}`.trim() || '-'
  }

  /**
   * Conta il numero totale di lead in un ordine
   */
  const getLeadsCount = (items: OrderItem[] | undefined): number => {
    if (!items || items.length === 0) return 0
    return items.reduce((sum, item) => {
      if (item.package) return sum + item.package.lead_quantity
      return sum + item.quantity
    }, 0)
  }

  /**
   * Restituisce una descrizione breve dell'ordine
   */
  const getOrderDescription = (order: Order, items?: OrderItem[]): string => {
    if (order.type === 'package') {
      const packageItem = items?.find(i => i.package)
      if (packageItem?.package) {
        return packageItem.package.name
      }
      return t('orders.description.packagePurchase')
    }
    if (order.type === 'free_trial') {
      const count = items?.length || 0
      return t('orders.description.freeTrialLeads', { count })
    }
    const count = items?.length || 0
    return t('orders.description.singleLeads', { count })
  }

  /**
   * Formatta l'indirizzo di fatturazione
   */
  const formatBillingAddress = (order: Order): string => {
    if (!order.billing_snapshot) return '-'
    const { address, city, province, postal_code } = order.billing_snapshot
    const parts = [address, postal_code, city, province].filter(Boolean)
    return parts.join(', ') || '-'
  }

  return {
    formatStatus,
    getStatusSeverity,
    formatType,
    getTypeSeverity,
    formatPaymentMethod,
    getPaymentMethodIcon,
    formatAcquisitionMode,
    getAcquisitionModeSeverity,
    formatDate,
    formatDateTime,
    formatCurrency,
    formatVatNumber,
    getClientFullName,
    getLeadsCount,
    getOrderDescription,
    formatBillingAddress
  }
}

/**
 * Azioni e conferme per ordini
 */
export function useOrderActions() {
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
   * Copia il numero ordine negli appunti
   */
  const copyOrderNumber = async (orderNumber: string) => {
    try {
      await navigator.clipboard.writeText(orderNumber)
      showSuccess(t('orders.toast.orderNumberCopied', { number: orderNumber }))
    } catch {
      showError(t('orders.toast.cannotCopy'))
    }
  }

  /**
   * Apre la dashboard Stripe per una transazione
   */
  const openStripeTransaction = (paymentIntentId: string) => {
    const stripeUrl = `https://dashboard.stripe.com/payments/${paymentIntentId}`
    window.open(stripeUrl, '_blank')
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    copyOrderNumber,
    openStripeTransaction
  }
}

/**
 * Opzioni per dropdown e filtri
 */
export function useOrderOptions() {
  const { t } = useI18n()

  const statusOptions = computed(() => [
    { label: t('common.filterDefaults.allStatuses'), value: '' },
    { label: t('orders.status.pending'), value: 'pending' },
    { label: t('orders.status.processing'), value: 'processing' },
    { label: t('orders.status.paid'), value: 'paid' },
    { label: t('orders.status.failed'), value: 'failed' },
    { label: t('orders.status.refunded'), value: 'refunded' },
    { label: t('orders.status.cancelled'), value: 'cancelled' }
  ])

  const typeOptions = computed(() => [
    { label: t('common.filterDefaults.allTypes'), value: '' },
    { label: t('orders.type.single'), value: 'single' },
    { label: t('orders.type.package'), value: 'package' },
    { label: t('orders.type.freeTrial'), value: 'free_trial' }
  ])

  const paymentMethodOptions = computed(() => [
    { label: t('orders.paymentMethod.all'), value: '' },
    { label: t('orders.paymentMethod.card'), value: 'card' },
    { label: t('orders.paymentMethod.sepa'), value: 'sepa' },
    { label: t('orders.paymentMethod.free'), value: 'free' }
  ])

  return {
    statusOptions,
    typeOptions,
    paymentMethodOptions
  }
}
