/**
 * Composables - Client Area
 * Utilities for client area (formatting, validation, actions)
 */
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import type {
  ContactStatus,
  AcquisitionType,
  OrderStatus,
  OrderType,
  PurchaseMode
} from '~/types/clientArea'

/**
 * Formatters for client area
 */
export function useClientFormatters() {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    })
  }

  // Format date
  const formatDate = (date: string | null): string => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Format datetime
  const formatDateTime = (date: string | null): string => {
    if (!date) return '-'
    return new Date(date).toLocaleString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Format relative time
  const formatRelativeTime = (date: string | null): string => {
    if (!date) return '-'
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Adesso'
    if (diffMins < 60) return `${diffMins} min fa`
    if (diffHours < 24) return `${diffHours} ore fa`
    if (diffDays === 1) return 'Ieri'
    if (diffDays < 7) return `${diffDays} giorni fa`
    return formatDate(date)
  }

  // Format contact status
  const formatContactStatus = (status: ContactStatus): string => {
    const labels: Record<ContactStatus, string> = {
      new: 'Nuovo',
      contacted: 'Contattato',
      in_progress: 'In lavorazione',
      not_interested: 'Non interessato',
      converted: 'Convertito'
    }
    return labels[status] || status
  }

  // Get contact status severity
  const getContactStatusSeverity = (status: ContactStatus): 'info' | 'warning' | 'success' | 'danger' | 'secondary' => {
    const severities: Record<ContactStatus, 'info' | 'warning' | 'success' | 'danger' | 'secondary'> = {
      new: 'info',
      contacted: 'secondary',
      in_progress: 'warning',
      not_interested: 'danger',
      converted: 'success'
    }
    return severities[status] || 'secondary'
  }

  // Format acquisition type
  const formatAcquisitionType = (type: AcquisitionType): string => {
    const labels: Record<AcquisitionType, string> = {
      exclusive: 'Esclusivo',
      shared: 'Condiviso',
      free_trial: 'Prova Gratuita'
    }
    return labels[type] || type
  }

  // Get acquisition type severity
  const getAcquisitionTypeSeverity = (type: AcquisitionType): 'success' | 'info' | 'secondary' => {
    const severities: Record<AcquisitionType, 'success' | 'info' | 'secondary'> = {
      exclusive: 'success',
      shared: 'info',
      free_trial: 'secondary'
    }
    return severities[type] || 'secondary'
  }

  // Format purchase mode
  const formatPurchaseMode = (mode: PurchaseMode): string => {
    return mode === 'exclusive' ? 'Esclusivo' : 'Condiviso'
  }

  // Format order status
  const formatOrderStatus = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      pending: 'In attesa',
      paid: 'Pagato',
      processing: 'In elaborazione',
      completed: 'Completato',
      failed: 'Fallito',
      refunded: 'Rimborsato'
    }
    return labels[status] || status
  }

  // Get order status severity
  const getOrderStatusSeverity = (status: OrderStatus): 'info' | 'warning' | 'success' | 'danger' | 'secondary' => {
    const severities: Record<OrderStatus, 'info' | 'warning' | 'success' | 'danger' | 'secondary'> = {
      pending: 'warning',
      paid: 'info',
      processing: 'info',
      completed: 'success',
      failed: 'danger',
      refunded: 'secondary'
    }
    return severities[status] || 'secondary'
  }

  // Format order type
  const formatOrderType = (type: OrderType): string => {
    const labels: Record<OrderType, string> = {
      single: 'Singolo',
      package: 'Pacchetto',
      free_trial: 'Prova Gratuita'
    }
    return labels[type] || type
  }

  // Format phone for click-to-call
  const formatPhoneLink = (phone: string): string => {
    return `tel:${phone.replace(/\s/g, '')}`
  }

  // Format email for click-to-mail
  const formatEmailLink = (email: string): string => {
    return `mailto:${email}`
  }

  return {
    formatCurrency,
    formatDate,
    formatDateTime,
    formatRelativeTime,
    formatContactStatus,
    getContactStatusSeverity,
    formatAcquisitionType,
    getAcquisitionTypeSeverity,
    formatPurchaseMode,
    formatOrderStatus,
    getOrderStatusSeverity,
    formatOrderType,
    formatPhoneLink,
    formatEmailLink
  }
}

/**
 * Toast notifications for client area
 */
export function useClientToast() {
  const toast = useToast()

  const showSuccess = (message: string) => {
    toast.add({
      severity: 'success',
      summary: 'Successo',
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
      summary: 'Info',
      detail: message,
      life: 3000
    })
  }

  const showWarn = (message: string) => {
    toast.add({
      severity: 'warn',
      summary: 'Attenzione',
      detail: message,
      life: 4000
    })
  }

  const showAddedToCart = () => {
    toast.add({
      severity: 'success',
      summary: 'Aggiunto al carrello',
      detail: 'Il lead è stato aggiunto al carrello',
      life: 3000
    })
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarn,
    showAddedToCart
  }
}

/**
 * Confirm dialogs for client area
 */
export function useClientConfirm() {
  const confirm = useConfirm()

  const confirmRemoveFromCart = (onConfirm: () => void) => {
    confirm.require({
      message: 'Sei sicuro di voler rimuovere questo lead dal carrello?',
      header: 'Rimuovi dal carrello',
      icon: 'pi pi-trash',
      acceptLabel: 'Rimuovi',
      rejectLabel: 'Annulla',
      acceptClass: 'p-button-danger',
      accept: onConfirm
    })
  }

  const confirmClearCart = (onConfirm: () => void) => {
    confirm.require({
      message: 'Sei sicuro di voler svuotare il carrello?',
      header: 'Svuota carrello',
      icon: 'pi pi-trash',
      acceptLabel: 'Svuota',
      rejectLabel: 'Annulla',
      acceptClass: 'p-button-danger',
      accept: onConfirm
    })
  }

  const confirmPurchase = (total: string, onConfirm: () => void) => {
    confirm.require({
      message: `Confermi l'acquisto per un totale di ${total}?`,
      header: 'Conferma acquisto',
      icon: 'pi pi-shopping-cart',
      acceptLabel: 'Conferma',
      rejectLabel: 'Annulla',
      accept: onConfirm
    })
  }

  const confirmClaimTrial = (count: number, onConfirm: () => void) => {
    confirm.require({
      message: `Confermi il riscatto di ${count} lead gratuiti?`,
      header: 'Riscatta lead gratuiti',
      icon: 'pi pi-gift',
      acceptLabel: 'Riscatta',
      rejectLabel: 'Annulla',
      accept: onConfirm
    })
  }

  return {
    confirmRemoveFromCart,
    confirmClearCart,
    confirmPurchase,
    confirmClaimTrial
  }
}

/**
 * Filter options for client area
 */
export function useClientFilterOptions() {
  const contactStatusOptions = [
    { label: 'Tutti gli stati', value: '' },
    { label: 'Nuovo', value: 'new' },
    { label: 'Contattato', value: 'contacted' },
    { label: 'In lavorazione', value: 'in_progress' },
    { label: 'Non interessato', value: 'not_interested' },
    { label: 'Convertito', value: 'converted' }
  ]

  const acquisitionTypeOptions = [
    { label: 'Tutti i tipi', value: '' },
    { label: 'Esclusivo', value: 'exclusive' },
    { label: 'Condiviso', value: 'shared' },
    { label: 'Prova Gratuita', value: 'free_trial' }
  ]

  const orderStatusOptions = [
    { label: 'Tutti gli stati', value: '' },
    { label: 'Completato', value: 'completed' },
    { label: 'In elaborazione', value: 'processing' },
    { label: 'In attesa', value: 'pending' },
    { label: 'Fallito', value: 'failed' }
  ]

  const orderTypeOptions = [
    { label: 'Tutti i tipi', value: '' },
    { label: 'Singolo', value: 'single' },
    { label: 'Pacchetto', value: 'package' },
    { label: 'Prova Gratuita', value: 'free_trial' }
  ]

  const purchaseModeOptions = [
    { label: 'Esclusivo', value: 'exclusive' },
    { label: 'Condiviso', value: 'shared' }
  ]

  return {
    contactStatusOptions,
    acquisitionTypeOptions,
    orderStatusOptions,
    orderTypeOptions,
    purchaseModeOptions
  }
}

/**
 * Billing form validation
 */
export function useBillingValidation() {
  const errors = reactive<Record<string, string>>({
    billing_address: '',
    billing_city: '',
    billing_province: '',
    billing_zip: '',
    sdi_code: '',
    pec_email: ''
  })

  const hasErrors = computed(() => {
    return Object.values(errors).some(e => e !== '')
  })

  const validateForm = (data: {
    billing_address: string
    billing_city: string
    billing_province: string
    billing_zip: string
    sdi_code?: string | null
    pec_email?: string | null
  }): boolean => {
    let isValid = true

    // Reset errors
    Object.keys(errors).forEach(key => errors[key] = '')

    if (!data.billing_address) {
      errors.billing_address = 'Inserisci l\'indirizzo'
      isValid = false
    }

    if (!data.billing_city) {
      errors.billing_city = 'Inserisci la città'
      isValid = false
    }

    if (!data.billing_province) {
      errors.billing_province = 'Inserisci la provincia'
      isValid = false
    }

    if (!data.billing_zip) {
      errors.billing_zip = 'Inserisci il CAP'
      isValid = false
    } else if (!/^\d{5}$/.test(data.billing_zip)) {
      errors.billing_zip = 'CAP non valido (5 cifre)'
      isValid = false
    }

    // SDI code or PEC required
    if (!data.sdi_code && !data.pec_email) {
      errors.sdi_code = 'Inserisci il codice SDI o la PEC'
      isValid = false
    }

    if (data.sdi_code && !/^[A-Z0-9]{7}$/.test(data.sdi_code)) {
      errors.sdi_code = 'Codice SDI non valido (7 caratteri)'
      isValid = false
    }

    if (data.pec_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.pec_email)) {
      errors.pec_email = 'Email PEC non valida'
      isValid = false
    }

    return isValid
  }

  const clearErrors = () => {
    Object.keys(errors).forEach(key => errors[key] = '')
  }

  return {
    errors,
    hasErrors,
    validateForm,
    clearErrors
  }
}

/**
 * Password change validation
 */
export function usePasswordChangeValidation() {
  const errors = reactive<Record<string, string>>({
    current_password: '',
    password: '',
    password_confirmation: ''
  })

  const hasErrors = computed(() => {
    return Object.values(errors).some(e => e !== '')
  })

  const isStrongPassword = (password: string): boolean => {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /\d/.test(password)
  }

  const validateForm = (data: {
    current_password: string
    password: string
    password_confirmation: string
  }): boolean => {
    let isValid = true

    // Reset errors
    Object.keys(errors).forEach(key => errors[key] = '')

    if (!data.current_password) {
      errors.current_password = 'Inserisci la password attuale'
      isValid = false
    }

    if (!data.password) {
      errors.password = 'Inserisci la nuova password'
      isValid = false
    } else if (!isStrongPassword(data.password)) {
      errors.password = 'Min. 8 caratteri, 1 maiuscola, 1 minuscola, 1 numero'
      isValid = false
    }

    if (!data.password_confirmation) {
      errors.password_confirmation = 'Conferma la nuova password'
      isValid = false
    } else if (data.password !== data.password_confirmation) {
      errors.password_confirmation = 'Le password non coincidono'
      isValid = false
    }

    return isValid
  }

  const clearErrors = () => {
    Object.keys(errors).forEach(key => errors[key] = '')
  }

  return {
    errors,
    hasErrors,
    validateForm,
    clearErrors
  }
}
