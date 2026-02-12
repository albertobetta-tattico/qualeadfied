/**
 * useClient Composable - Funzioni per gestione clienti
 * Qualeadfied B2B Lead Platform
 */

import { ref, reactive, computed } from 'vue'
import type { Client, ClientCreateForm, ClientUpdateForm, BillingData, BankData } from '~/types/client'

/**
 * Validazione campi cliente
 */
export function useClientValidation() {
  const { t } = useI18n()
  const errors = reactive<Record<string, string>>({})

  const validateCompanyName = (value: string): boolean => {
    if (!value || value.trim().length < 2) {
      errors.company_name = t('validation.required.companyName')
      return false
    }
    delete errors.company_name
    return true
  }

  const validateVatNumber = (value: string): boolean => {
    if (!value) {
      errors.vat_number = t('validation.required.vatNumber')
      return false
    }
    // Formato P.IVA italiana: 11 cifre
    const vatRegex = /^(IT)?[0-9]{11}$/i
    if (!vatRegex.test(value.replace(/\s/g, ''))) {
      errors.vat_number = t('admin.clients.validation.vatNumberFormat')
      return false
    }
    delete errors.vat_number
    return true
  }

  const validateEmail = (value: string): boolean => {
    if (!value) {
      errors.email = t('validation.required.email')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      errors.email = t('validation.invalid.email')
      return false
    }
    delete errors.email
    return true
  }

  const validatePhone = (value: string): boolean => {
    if (!value) {
      errors.phone = t('validation.required.phone')
      return false
    }
    // Formato telefono italiano
    const phoneRegex = /^(\+39)?[\s]?[0-9]{6,12}$/
    if (!phoneRegex.test(value.replace(/[\s\-\.]/g, ''))) {
      errors.phone = t('validation.invalid.phone')
      return false
    }
    delete errors.phone
    return true
  }

  const validatePassword = (value: string, isCreate: boolean = true): boolean => {
    if (isCreate && !value) {
      errors.password = t('validation.required.password')
      return false
    }
    if (value && value.length < 8) {
      errors.password = t('admin.clients.validation.passwordMinLength')
      return false
    }
    if (value && !/[A-Z]/.test(value)) {
      errors.password = t('admin.clients.validation.passwordUppercase')
      return false
    }
    if (value && !/[a-z]/.test(value)) {
      errors.password = t('admin.clients.validation.passwordLowercase')
      return false
    }
    if (value && !/[0-9]/.test(value)) {
      errors.password = t('admin.clients.validation.passwordNumber')
      return false
    }
    delete errors.password
    return true
  }

  const validatePasswordConfirmation = (password: string, confirmation: string): boolean => {
    if (password && password !== confirmation) {
      errors.password_confirmation = t('validation.password.mismatch')
      return false
    }
    delete errors.password_confirmation
    return true
  }

  const validateRequired = (field: string, value: string, label: string): boolean => {
    if (!value || value.trim() === '') {
      errors[field] = t('admin.clients.validation.fieldRequired', { field: label })
      return false
    }
    delete errors[field]
    return true
  }

  const validatePostalCode = (value: string): boolean => {
    if (value && !/^[0-9]{5}$/.test(value)) {
      errors.postal_code = t('validation.invalid.billingZip')
      return false
    }
    delete errors.postal_code
    return true
  }

  const validateSdiCode = (value: string): boolean => {
    if (value && !/^[A-Z0-9]{7}$/i.test(value)) {
      errors.sdi_code = t('validation.invalid.sdiCode')
      return false
    }
    delete errors.sdi_code
    return true
  }

  const validatePec = (value: string): boolean => {
    if (value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        errors.pec = t('validation.invalid.pecEmail')
        return false
      }
    }
    delete errors.pec
    return true
  }

  const validateField = (field: string, value: any, extra?: any): boolean => {
    switch (field) {
      case 'company_name':
        return validateCompanyName(value)
      case 'vat_number':
        return validateVatNumber(value)
      case 'email':
        return validateEmail(value)
      case 'phone':
        return validatePhone(value)
      case 'password':
        return validatePassword(value, extra)
      case 'password_confirmation':
        return validatePasswordConfirmation(extra, value)
      case 'contact_first_name':
        return validateRequired(field, value, t('common.labels.name'))
      case 'contact_last_name':
        return validateRequired(field, value, t('common.labels.lastName'))
      case 'postal_code':
        return validatePostalCode(value)
      case 'sdi_code':
        return validateSdiCode(value)
      case 'pec':
        return validatePec(value)
      default:
        return true
    }
  }

  const validateForm = (form: ClientCreateForm | ClientUpdateForm, isCreate: boolean = true): boolean => {
    let isValid = true

    isValid = validateCompanyName(form.company_name) && isValid
    isValid = validateVatNumber(form.vat_number) && isValid
    isValid = validateEmail(form.email) && isValid
    isValid = validatePhone(form.phone) && isValid
    isValid = validateRequired('contact_first_name', form.contact_first_name, t('common.labels.name')) && isValid
    isValid = validateRequired('contact_last_name', form.contact_last_name, t('common.labels.lastName')) && isValid

    if (isCreate && 'password' in form) {
      isValid = validatePassword(form.password, true) && isValid
      isValid = validatePasswordConfirmation(form.password, form.password_confirmation) && isValid
    }

    if (form.billing_data) {
      if (form.billing_data.postal_code) {
        isValid = validatePostalCode(form.billing_data.postal_code) && isValid
      }
      if (form.billing_data.sdi_code) {
        isValid = validateSdiCode(form.billing_data.sdi_code) && isValid
      }
      if (form.billing_data.pec) {
        isValid = validatePec(form.billing_data.pec) && isValid
      }
    }

    return isValid
  }

  const clearErrors = () => {
    Object.keys(errors).forEach(key => delete errors[key])
  }

  const hasErrors = computed(() => Object.keys(errors).length > 0)

  return {
    errors,
    hasErrors,
    validateField,
    validateForm,
    clearErrors
  }
}

/**
 * Azioni conferma per clienti
 */
export function useClientActions() {
  const { t } = useI18n()
  const toast = useToast()
  const confirm = useConfirm()

  const confirmDelete = (client: Client, onConfirm: () => void) => {
    confirm.require({
      message: t('admin.clients.list.dialog.deleteMessage', { name: client.company_name }),
      header: t('admin.clients.list.dialog.deleteTitle'),
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',
      acceptLabel: t('admin.clients.list.dialog.deleteConfirm'),
      rejectLabel: t('admin.clients.list.dialog.deleteCancel'),
      accept: onConfirm
    })
  }

  const confirmSuspend = (client: Client, onConfirm: () => void) => {
    confirm.require({
      message: t('admin.clients.confirm.suspendMessage', { name: client.company_name }),
      header: t('admin.clients.confirm.suspendHeader'),
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-warning',
      acceptLabel: t('admin.clients.confirm.suspendAccept'),
      rejectLabel: t('common.actions.cancel'),
      accept: onConfirm
    })
  }

  const confirmResetPassword = (client: Client, onConfirm: () => void) => {
    confirm.require({
      message: t('admin.clients.confirm.resetPasswordMessage', { email: client.email }),
      header: t('admin.clients.confirm.resetPasswordHeader'),
      icon: 'pi pi-envelope',
      acceptLabel: t('common.actions.send'),
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

  const showWarning = (message: string) => {
    toast.add({
      severity: 'warn',
      summary: t('notifications.toast.summaries.warning'),
      detail: message,
      life: 4000
    })
  }

  return {
    confirmDelete,
    confirmSuspend,
    confirmResetPassword,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}

/**
 * Form cliente
 */
export function useClientForm(initialData?: Client) {
  const isCreate = !initialData

  const defaultBillingData: BillingData = {
    address: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'IT',
    sdi_code: '',
    pec: ''
  }

  const defaultBankData: BankData = {
    iban: '',
    bank_account_holder: '',
    bic_swift: '',
    bank_name: ''
  }

  const form = reactive<ClientCreateForm>({
    company_name: initialData?.company_name || '',
    vat_number: initialData?.vat_number || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    contact_first_name: initialData?.contact_first_name || '',
    contact_last_name: initialData?.contact_last_name || '',
    password: '',
    password_confirmation: '',
    status: initialData?.status || 'active',
    free_trial_enabled: initialData?.free_trial_enabled ?? true,
    free_trial_leads_total: initialData?.free_trial_leads_total || 3,
    billing_data: initialData?.billing_data || { ...defaultBillingData },
    bank_data: initialData?.bank_data || { ...defaultBankData },
    category_ids: initialData?.category_ids || [],
    notify_new_leads: initialData?.notify_new_leads ?? true
  })

  const resetForm = () => {
    form.company_name = initialData?.company_name || ''
    form.vat_number = initialData?.vat_number || ''
    form.email = initialData?.email || ''
    form.phone = initialData?.phone || ''
    form.contact_first_name = initialData?.contact_first_name || ''
    form.contact_last_name = initialData?.contact_last_name || ''
    form.password = ''
    form.password_confirmation = ''
    form.status = initialData?.status || 'active'
    form.free_trial_enabled = initialData?.free_trial_enabled ?? true
    form.free_trial_leads_total = initialData?.free_trial_leads_total || 3
    form.billing_data = initialData?.billing_data || { ...defaultBillingData }
    form.bank_data = initialData?.bank_data || { ...defaultBankData }
    form.category_ids = initialData?.category_ids || []
    form.notify_new_leads = initialData?.notify_new_leads ?? true
  }

  return {
    form,
    isCreate,
    resetForm
  }
}

/**
 * Formattatori per visualizzazione
 */
export function useClientFormatters() {
  const { t } = useI18n()

  const formatStatus = (status: string): string => {
    const labels: Record<string, string> = {
      pending: t('admin.clients.list.filters.statusOptions.pending'),
      active: t('admin.clients.list.filters.statusOptions.active'),
      suspended: t('admin.clients.list.filters.statusOptions.suspended')
    }
    return labels[status] || status
  }

  const getStatusSeverity = (status: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined => {
    const severities: Record<string, "success" | "info" | "warn" | "danger" | "secondary"> = {
      pending: 'warn',
      active: 'success',
      suspended: 'danger'
    }
    return severities[status] || 'secondary'
  }

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

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

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }

  const formatVatNumber = (vat: string): string => {
    if (!vat) return '-'
    const clean = vat.replace(/\s/g, '').toUpperCase()
    return clean.startsWith('IT') ? clean : `IT${clean}`
  }

  const getContactFullName = (client: Client): string => {
    return `${client.contact_first_name} ${client.contact_last_name}`.trim() || '-'
  }

  const getFreeTrialProgress = (client: Client): number => {
    if (!client.free_trial_enabled || client.free_trial_leads_total === 0) return 0
    return Math.round((client.free_trial_leads_used / client.free_trial_leads_total) * 100)
  }

  const getFreeTrialRemaining = (client: Client): number => {
    return Math.max(0, client.free_trial_leads_total - client.free_trial_leads_used)
  }

  return {
    formatStatus,
    getStatusSeverity,
    formatDate,
    formatDateTime,
    formatCurrency,
    formatVatNumber,
    getContactFullName,
    getFreeTrialProgress,
    getFreeTrialRemaining
  }
}
