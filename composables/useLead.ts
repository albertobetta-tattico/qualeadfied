/**
 * useLead Composable - Funzioni per gestione lead
 * Qualeadfied B2B Lead Platform
 */

import { reactive, computed } from 'vue'
import type { Lead, LeadCreateForm, LeadUpdateForm, LeadStatus, Category } from '~/types/lead'

/**
 * Validazione campi lead
 */
export function useLeadValidation() {
  const { t } = useI18n()
  const errors = reactive<Record<string, string>>({})

  const validateRequired = (field: string, value: any, label: string): boolean => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors[field] = t('leads.validation.required', { field: label })
      return false
    }
    delete errors[field]
    return true
  }

  const validateEmail = (value: string): boolean => {
    if (!value) {
      errors.email = t('leads.validation.emailRequired')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      errors.email = t('leads.validation.emailInvalid')
      return false
    }
    delete errors.email
    return true
  }

  const validatePhone = (value: string): boolean => {
    if (!value) {
      errors.phone = t('leads.validation.phoneRequired')
      return false
    }
    // Formato telefono italiano (più permissivo)
    const phoneRegex = /^(\+39)?[\s]?[0-9\s\-\.]{6,15}$/
    if (!phoneRegex.test(value.replace(/[\s\-\.]/g, ''))) {
      errors.phone = t('leads.validation.phoneInvalid')
      return false
    }
    delete errors.phone
    return true
  }

  const validateCategoryId = (value: number | null): boolean => {
    if (!value) {
      errors.category_id = t('leads.validation.selectCategory')
      return false
    }
    delete errors.category_id
    return true
  }

  const validateSourceId = (value: number | null): boolean => {
    if (!value) {
      errors.source_id = t('leads.validation.selectSource')
      return false
    }
    delete errors.source_id
    return true
  }

  const validateGeneratedAt = (value: string): boolean => {
    if (!value) {
      errors.generated_at = t('leads.validation.dateRequired')
      return false
    }
    // Verifica che sia una data valida
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      errors.generated_at = t('leads.validation.dateInvalid')
      return false
    }
    // Verifica che non sia nel futuro
    if (date > new Date()) {
      errors.generated_at = t('leads.validation.dateFuture')
      return false
    }
    delete errors.generated_at
    return true
  }

  const validateField = (field: string, value: any): boolean => {
    switch (field) {
      case 'full_name':
        return validateRequired(field, value, t('common.labels.fullName'))
      case 'email':
        return validateEmail(value)
      case 'phone':
        return validatePhone(value)
      case 'category_id':
        return validateCategoryId(value)
      case 'source_id':
        return validateSourceId(value)
      case 'generated_at':
        return validateGeneratedAt(value)
      case 'request_text':
        return validateRequired(field, value, t('admin.leads.create.form.requestText'))
      default:
        return true
    }
  }

  const validateForm = (form: LeadCreateForm | LeadUpdateForm): boolean => {
    let isValid = true

    isValid = validateRequired('full_name', form.full_name, t('common.labels.fullName')) && isValid
    isValid = validateEmail(form.email) && isValid
    isValid = validatePhone(form.phone) && isValid
    isValid = validateCategoryId((form as any).category_id ?? (form as any).category_ids?.[0]) && isValid
    isValid = validateSourceId(form.source_id) && isValid
    isValid = validateGeneratedAt(form.generated_at) && isValid
    isValid = validateRequired('request_text', form.request_text, t('admin.leads.create.form.requestText')) && isValid

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
 * Azioni conferma per lead
 */
export function useLeadActions() {
  const { t } = useI18n()
  const toast = useToast()
  const confirm = useConfirm()

  const confirmDelete = (lead: Lead, onConfirm: () => void) => {
    if (lead.status !== 'free') {
      toast.add({
        severity: 'error',
        summary: t('leads.confirm.cannotDelete.summary'),
        detail: t('leads.confirm.cannotDelete.detail'),
        life: 5000
      })
      return
    }

    confirm.require({
      message: t('leads.confirm.delete.message', { name: lead.full_name }),
      header: t('leads.confirm.delete.header'),
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',
      acceptLabel: t('leads.confirm.delete.accept'),
      rejectLabel: t('leads.confirm.delete.reject'),
      accept: onConfirm
    })
  }

  const confirmBulkDelete = (count: number, onConfirm: () => void) => {
    confirm.require({
      message: t('leads.confirm.bulkDelete.message', { count }),
      header: t('leads.confirm.bulkDelete.header'),
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',
      acceptLabel: t('leads.confirm.bulkDelete.accept'),
      rejectLabel: t('leads.confirm.bulkDelete.reject'),
      accept: onConfirm
    })
  }

  const showSuccess = (message: string) => {
    toast.add({
      severity: 'success',
      summary: t('leads.toast.success'),
      detail: message,
      life: 3000
    })
  }

  const showError = (message: string) => {
    toast.add({
      severity: 'error',
      summary: t('leads.toast.error'),
      detail: message,
      life: 5000
    })
  }

  const showInfo = (message: string) => {
    toast.add({
      severity: 'info',
      summary: t('leads.toast.info'),
      detail: message,
      life: 3000
    })
  }

  const showWarning = (message: string) => {
    toast.add({
      severity: 'warn',
      summary: t('leads.toast.warning'),
      detail: message,
      life: 4000
    })
  }

  return {
    confirmDelete,
    confirmBulkDelete,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}

/**
 * Formattatori per visualizzazione lead
 */
export function useLeadFormatters() {
  const { t } = useI18n()

  const formatStatus = (status: LeadStatus): string => {
    const labels: Record<LeadStatus, string> = {
      free: t('leads.leadStatus.free'),
      sold_exclusive: t('leads.leadStatus.soldExclusive'),
      sold_shared: t('leads.leadStatus.soldShared'),
      exhausted: t('leads.leadStatus.exhausted')
    }
    return labels[status] || status
  }

  const getStatusSeverity = (status: LeadStatus): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined => {
    const severities: Record<LeadStatus, "success" | "info" | "warn" | "danger" | "secondary"> = {
      free: 'success',
      sold_exclusive: 'info',
      sold_shared: 'warn',
      exhausted: 'danger'
    }
    return severities[status] || 'secondary'
  }

  const getStatusIcon = (status: LeadStatus): string => {
    const icons: Record<LeadStatus, string> = {
      free: 'pi-check-circle',
      sold_exclusive: 'pi-lock',
      sold_shared: 'pi-users',
      exhausted: 'pi-ban'
    }
    return icons[status] || 'pi-circle'
  }

  const formatSharesDisplay = (lead: Lead, category?: Category): string => {
    if (lead.status === 'free') return t('leads.leadStatus.free')
    if (lead.status === 'sold_exclusive') return t('leads.acquisitionType.exclusive')

    const maxShares = category?.max_shares || 3
    return `${lead.current_shares}/${maxShares}`
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

  const formatDateForInput = (dateString: string | null): string => {
    if (!dateString) return new Date().toISOString().split('T')[0]
    return new Date(dateString).toISOString().split('T')[0]
  }

  const getFullName = (lead: Lead): string => {
    return lead.full_name || '-'
  }

  const truncateText = (text: string | undefined, maxLength: number = 80): string => {
    if (!text) return '-'
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const formatPhone = (phone: string): string => {
    if (!phone) return '-'
    // Rimuovi spazi e caratteri speciali
    const clean = phone.replace(/[^\d+]/g, '')
    // Se inizia con +39, formatta come numero italiano
    if (clean.startsWith('+39')) {
      const national = clean.substring(3)
      if (national.length === 10) {
        return `+39 ${national.substring(0, 3)} ${national.substring(3, 6)} ${national.substring(6)}`
      }
    }
    return phone
  }

  const canEdit = (lead: Lead): boolean => {
    // Un lead può essere modificato solo se è ancora disponibile (free)
    // o parzialmente venduto (sold_shared)
    return lead.status === 'free' || lead.status === 'sold_shared'
  }

  const canDelete = (lead: Lead): boolean => {
    // Un lead può essere eliminato solo se non è mai stato venduto
    return lead.status === 'free'
  }

  return {
    formatStatus,
    getStatusSeverity,
    getStatusIcon,
    formatSharesDisplay,
    formatDate,
    formatDateTime,
    formatDateForInput,
    getFullName,
    truncateText,
    formatPhone,
    canEdit,
    canDelete
  }
}

/**
 * Form lead con valori di default
 */
export function useLeadForm(initialData?: Lead) {
  const today = new Date().toISOString().split('T')[0]

  const form = reactive<LeadCreateForm>({
    category_ids: initialData?.category_ids || [],
    province_id: initialData?.province_id ?? null,
    source_id: initialData?.source_id || null,
    full_name: initialData?.full_name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    request_text: initialData?.request_text || '',
    extra_tags: initialData?.extra_tags || {},
    generated_at: initialData?.generated_at || today,
    external_id: initialData?.external_id || ''
  })

  const resetForm = () => {
    form.category_ids = initialData?.category_ids || []
    form.province_id = initialData?.province_id ?? null
    form.source_id = initialData?.source_id || null
    form.full_name = initialData?.full_name || ''
    form.email = initialData?.email || ''
    form.phone = initialData?.phone || ''
    form.address = initialData?.address || ''
    form.request_text = initialData?.request_text || ''
    form.extra_tags = initialData?.extra_tags || {}
    form.generated_at = initialData?.generated_at || today
    form.external_id = initialData?.external_id || ''
  }

  const isCreate = !initialData

  return {
    form,
    isCreate,
    resetForm
  }
}

/**
 * Validazione sorgenti lead
 */
export function useLeadSourceValidation() {
  const { t } = useI18n()
  const errors = reactive<Record<string, string>>({})

  const validateName = (value: string): boolean => {
    if (!value || value.trim().length < 2) {
      errors.name = t('leads.validation.nameMinLength')
      return false
    }
    delete errors.name
    return true
  }

  const validateSlug = (value: string): boolean => {
    if (!value || value.trim().length < 2) {
      errors.slug = t('leads.validation.slugMinLength')
      return false
    }
    // Slug deve contenere solo lettere minuscole, numeri e trattini
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(value)) {
      errors.slug = t('leads.validation.slugFormat')
      return false
    }
    delete errors.slug
    return true
  }

  const validateField = (field: string, value: any): boolean => {
    switch (field) {
      case 'name':
        return validateName(value)
      case 'slug':
        return validateSlug(value)
      default:
        return true
    }
  }

  const clearErrors = () => {
    Object.keys(errors).forEach(key => delete errors[key])
  }

  const hasErrors = computed(() => Object.keys(errors).length > 0)

  return {
    errors,
    hasErrors,
    validateField,
    clearErrors
  }
}
