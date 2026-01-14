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
  /**
   * Formatta lo stato ordine in italiano
   */
  const formatStatus = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      pending: 'In Attesa',
      processing: 'In Elaborazione',
      paid: 'Pagato',
      failed: 'Fallito',
      refunded: 'Rimborsato',
      cancelled: 'Annullato'
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
   * Formatta il tipo ordine in italiano
   */
  const formatType = (type: OrderType): string => {
    const labels: Record<OrderType, string> = {
      single: 'Singolo',
      package: 'Pacchetto',
      free_trial: 'Prova Gratuita'
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
   * Formatta il metodo di pagamento in italiano
   */
  const formatPaymentMethod = (method: PaymentMethod): string => {
    const labels: Record<PaymentMethod, string> = {
      card: 'Carta di Credito',
      sepa: 'Addebito SEPA',
      free: 'Gratuito'
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
      exclusive: 'Esclusivo',
      shared: 'Condiviso',
      free: 'Gratuito'
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
      return 'Acquisto pacchetto'
    }
    if (order.type === 'free_trial') {
      const count = items?.length || 0
      return `${count} lead gratuiti`
    }
    const count = items?.length || 0
    return `${count} lead singoli`
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
   * Copia il numero ordine negli appunti
   */
  const copyOrderNumber = async (orderNumber: string) => {
    try {
      await navigator.clipboard.writeText(orderNumber)
      showSuccess(`Numero ordine "${orderNumber}" copiato negli appunti`)
    } catch {
      showError('Impossibile copiare negli appunti')
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
  const statusOptions = [
    { label: 'Tutti gli stati', value: '' },
    { label: 'In Attesa', value: 'pending' },
    { label: 'In Elaborazione', value: 'processing' },
    { label: 'Pagato', value: 'paid' },
    { label: 'Fallito', value: 'failed' },
    { label: 'Rimborsato', value: 'refunded' },
    { label: 'Annullato', value: 'cancelled' }
  ]

  const typeOptions = [
    { label: 'Tutti i tipi', value: '' },
    { label: 'Singolo', value: 'single' },
    { label: 'Pacchetto', value: 'package' },
    { label: 'Prova Gratuita', value: 'free_trial' }
  ]

  const paymentMethodOptions = [
    { label: 'Tutti i metodi', value: '' },
    { label: 'Carta di Credito', value: 'card' },
    { label: 'Addebito SEPA', value: 'sepa' },
    { label: 'Gratuito', value: 'free' }
  ]

  return {
    statusOptions,
    typeOptions,
    paymentMethodOptions
  }
}
