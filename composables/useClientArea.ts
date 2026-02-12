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
  const { t } = useI18n()

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

    if (diffMins < 1) return t('common.time.now')
    if (diffMins < 60) return t('common.time.minutesAgo', { count: diffMins })
    if (diffHours < 24) return t('common.time.hoursAgo', { count: diffHours })
    if (diffDays === 1) return t('common.time.yesterday')
    if (diffDays < 7) return t('common.time.daysAgo', { count: diffDays })
    return formatDate(date)
  }

  // Format contact status
  const formatContactStatus = (status: ContactStatus): string => {
    const labels: Record<ContactStatus, string> = {
      new: t('leads.status.new'),
      contacted: t('leads.status.contacted'),
      in_progress: t('leads.status.inProgress'),
      not_interested: t('leads.status.notInterested'),
      converted: t('leads.status.converted')
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
      exclusive: t('leads.acquisitionType.exclusive'),
      shared: t('leads.acquisitionType.shared'),
      free_trial: t('leads.acquisitionType.freeTrial')
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
    return mode === 'exclusive' ? t('common.purchaseMode.exclusive') : t('common.purchaseMode.shared')
  }

  // Format order status
  const formatOrderStatus = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      pending: t('orders.status.pending'),
      paid: t('orders.status.paid'),
      processing: t('orders.status.processing'),
      completed: t('orders.status.completed'),
      failed: t('orders.status.failed'),
      refunded: t('orders.status.refunded')
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
      single: t('common.orderType.single'),
      package: t('common.orderType.package'),
      free_trial: t('common.orderType.freeTrial')
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
  const { t } = useI18n()
  const toast = useToast()

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

  const showWarn = (message: string) => {
    toast.add({
      severity: 'warn',
      summary: t('notifications.toast.summaries.warning'),
      detail: message,
      life: 4000
    })
  }

  const showAddedToCart = () => {
    toast.add({
      severity: 'success',
      summary: t('notifications.toast.cart.addedToCart'),
      detail: t('notifications.toast.cart.addedToCartDetail'),
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
  const { t } = useI18n()
  const confirm = useConfirm()

  const confirmRemoveFromCart = (onConfirm: () => void) => {
    confirm.require({
      message: t('notifications.confirm.removeFromCart.message'),
      header: t('notifications.confirm.removeFromCart.header'),
      icon: 'pi pi-trash',
      acceptLabel: t('notifications.confirm.removeFromCart.acceptLabel'),
      rejectLabel: t('notifications.confirm.removeFromCart.rejectLabel'),
      acceptClass: 'p-button-danger',
      accept: onConfirm
    })
  }

  const confirmClearCart = (onConfirm: () => void) => {
    confirm.require({
      message: t('notifications.confirm.clearCart.message'),
      header: t('notifications.confirm.clearCart.header'),
      icon: 'pi pi-trash',
      acceptLabel: t('notifications.confirm.clearCart.acceptLabel'),
      rejectLabel: t('notifications.confirm.clearCart.rejectLabel'),
      acceptClass: 'p-button-danger',
      accept: onConfirm
    })
  }

  const confirmPurchase = (total: string, onConfirm: () => void) => {
    confirm.require({
      message: t('notifications.confirm.purchase.message', { total }),
      header: t('notifications.confirm.purchase.header'),
      icon: 'pi pi-shopping-cart',
      acceptLabel: t('notifications.confirm.purchase.acceptLabel'),
      rejectLabel: t('notifications.confirm.purchase.rejectLabel'),
      accept: onConfirm
    })
  }

  const confirmClaimTrial = (count: number, onConfirm: () => void) => {
    confirm.require({
      message: t('notifications.confirm.claimTrial.message', { count }),
      header: t('notifications.confirm.claimTrial.header'),
      icon: 'pi pi-gift',
      acceptLabel: t('notifications.confirm.claimTrial.acceptLabel'),
      rejectLabel: t('notifications.confirm.claimTrial.rejectLabel'),
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
  const { t } = useI18n()

  const contactStatusOptions = computed(() => [
    { label: t('leads.status.all'), value: '' },
    { label: t('leads.status.new'), value: 'new' },
    { label: t('leads.status.contacted'), value: 'contacted' },
    { label: t('leads.status.inProgress'), value: 'in_progress' },
    { label: t('leads.status.notInterested'), value: 'not_interested' },
    { label: t('leads.status.converted'), value: 'converted' }
  ])

  const acquisitionTypeOptions = computed(() => [
    { label: t('leads.acquisitionType.all'), value: '' },
    { label: t('leads.acquisitionType.exclusive'), value: 'exclusive' },
    { label: t('leads.acquisitionType.shared'), value: 'shared' },
    { label: t('leads.acquisitionType.freeTrial'), value: 'free_trial' }
  ])

  const orderStatusOptions = computed(() => [
    { label: t('common.filterDefaults.allStatuses'), value: '' },
    { label: t('orders.status.completed'), value: 'completed' },
    { label: t('orders.status.processing'), value: 'processing' },
    { label: t('orders.status.pending'), value: 'pending' },
    { label: t('orders.status.failed'), value: 'failed' }
  ])

  const orderTypeOptions = computed(() => [
    { label: t('common.filterDefaults.allTypes'), value: '' },
    { label: t('common.orderType.single'), value: 'single' },
    { label: t('common.orderType.package'), value: 'package' },
    { label: t('common.orderType.freeTrial'), value: 'free_trial' }
  ])

  const purchaseModeOptions = computed(() => [
    { label: t('common.purchaseMode.exclusive'), value: 'exclusive' },
    { label: t('common.purchaseMode.shared'), value: 'shared' }
  ])

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
  const { t } = useI18n()

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
      errors.billing_address = t('validation.required.billingAddress')
      isValid = false
    }

    if (!data.billing_city) {
      errors.billing_city = t('validation.required.billingCity')
      isValid = false
    }

    if (!data.billing_province) {
      errors.billing_province = t('validation.required.billingProvince')
      isValid = false
    }

    if (!data.billing_zip) {
      errors.billing_zip = t('validation.required.billingZip')
      isValid = false
    } else if (!/^\d{5}$/.test(data.billing_zip)) {
      errors.billing_zip = t('validation.invalid.billingZip')
      isValid = false
    }

    // SDI code or PEC required
    if (!data.sdi_code && !data.pec_email) {
      errors.sdi_code = t('validation.required.sdiOrPec')
      isValid = false
    }

    if (data.sdi_code && !/^[A-Z0-9]{7}$/.test(data.sdi_code)) {
      errors.sdi_code = t('validation.invalid.sdiCode')
      isValid = false
    }

    if (data.pec_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.pec_email)) {
      errors.pec_email = t('validation.invalid.pecEmail')
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
  const { t } = useI18n()

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
      errors.current_password = t('validation.required.currentPassword')
      isValid = false
    }

    if (!data.password) {
      errors.password = t('validation.required.newPassword')
      isValid = false
    } else if (!isStrongPassword(data.password)) {
      errors.password = t('validation.password.tooWeakShort')
      isValid = false
    }

    if (!data.password_confirmation) {
      errors.password_confirmation = t('validation.required.newPasswordConfirmation')
      isValid = false
    } else if (data.password !== data.password_confirmation) {
      errors.password_confirmation = t('validation.password.mismatch')
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
