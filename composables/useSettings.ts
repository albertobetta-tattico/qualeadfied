/**
 * useSettings Composable - Funzioni per gestione impostazioni
 * Qualeadfied B2B Lead Platform
 */

import { reactive, computed } from 'vue'
import type {
  AdminOperator,
  AdminRole,
  AdminStatus,
  NotificationFrequency,
  ActivityType,
  ActivityEntity,
  AdminOperatorCreateForm,
  FattureCloudConfigForm
} from '~/types/settings'

/**
 * Validazione operatore admin
 */
export function useOperatorValidation() {
  const { t } = useI18n()
  const errors = reactive<Record<string, string>>({})

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

  const validateFirstName = (value: string): boolean => {
    if (!value || value.trim().length < 2) {
      errors.first_name = t('admin.settings.validation.firstNameMinLength')
      return false
    }
    delete errors.first_name
    return true
  }

  const validateLastName = (value: string): boolean => {
    if (!value || value.trim().length < 2) {
      errors.last_name = t('admin.settings.validation.lastNameMinLength')
      return false
    }
    delete errors.last_name
    return true
  }

  const validatePassword = (value: string, isCreate: boolean = true): boolean => {
    if (isCreate && !value) {
      errors.password = t('validation.required.password')
      return false
    }
    if (value && value.length < 8) {
      errors.password = t('admin.settings.validation.passwordMinLength')
      return false
    }
    if (value && !/[A-Z]/.test(value)) {
      errors.password = t('admin.settings.validation.passwordUppercase')
      return false
    }
    if (value && !/[0-9]/.test(value)) {
      errors.password = t('admin.settings.validation.passwordNumber')
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

  const validateForm = (form: AdminOperatorCreateForm, isCreate: boolean = true): boolean => {
    let isValid = true
    isValid = validateEmail(form.email) && isValid
    isValid = validateFirstName(form.first_name) && isValid
    isValid = validateLastName(form.last_name) && isValid
    if (isCreate) {
      isValid = validatePassword(form.password, true) && isValid
      isValid = validatePasswordConfirmation(form.password, form.password_confirmation) && isValid
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
    validateEmail,
    validateFirstName,
    validateLastName,
    validatePassword,
    validatePasswordConfirmation,
    validateForm,
    clearErrors
  }
}

/**
 * Azioni e notifiche per impostazioni
 */
export function useSettingsActions() {
  const { t } = useI18n()
  const toast = useToast()
  const confirm = useConfirm()

  const confirmDeleteOperator = (operator: AdminOperator, onConfirm: () => void) => {
    confirm.require({
      message: t('admin.settings.confirm.deleteOperatorMessage', { name: `${operator.first_name} ${operator.last_name}` }),
      header: t('admin.common.confirmDelete'),
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',
      acceptLabel: t('common.actions.delete'),
      rejectLabel: t('common.actions.cancel'),
      accept: onConfirm
    })
  }

  const confirmResetPassword = (operator: AdminOperator, onConfirm: () => void) => {
    confirm.require({
      message: t('admin.settings.confirm.resetPasswordMessage', { email: operator.email }),
      header: t('admin.settings.confirm.resetPasswordHeader'),
      icon: 'pi pi-envelope',
      acceptLabel: t('common.actions.send'),
      rejectLabel: t('common.actions.cancel'),
      accept: onConfirm
    })
  }

  const confirmDeactivateOperator = (operator: AdminOperator, onConfirm: () => void) => {
    confirm.require({
      message: t('admin.settings.confirm.deactivateMessage', { name: `${operator.first_name} ${operator.last_name}` }),
      header: t('admin.settings.confirm.deactivateHeader'),
      icon: 'pi pi-user-minus',
      acceptClass: 'p-button-warning',
      acceptLabel: t('admin.settings.confirm.deactivateAccept'),
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
    confirmDeleteOperator,
    confirmResetPassword,
    confirmDeactivateOperator,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}

/**
 * Formattatori per visualizzazione impostazioni
 */
export function useSettingsFormatters() {
  const { t } = useI18n()

  const formatRole = (role: AdminRole): string => {
    const labels: Record<AdminRole, string> = {
      super_admin: t('admin.settings.roles.superAdmin'),
      admin: t('admin.settings.roles.admin'),
      operator: t('admin.settings.roles.operator')
    }
    return labels[role] || role
  }

  const getRoleSeverity = (role: AdminRole): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined => {
    const severities: Record<AdminRole, "success" | "info" | "warn" | "danger" | "secondary"> = {
      super_admin: 'danger',
      admin: 'warn',
      operator: 'info'
    }
    return severities[role] || 'secondary'
  }

  const formatStatus = (status: AdminStatus): string => {
    const labels: Record<AdminStatus, string> = {
      active: t('admin.settings.statuses.active'),
      inactive: t('admin.settings.statuses.inactive')
    }
    return labels[status] || status
  }

  const getStatusSeverity = (status: AdminStatus): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined => {
    const severities: Record<AdminStatus, "success" | "danger"> = {
      active: 'success',
      inactive: 'danger'
    }
    return severities[status] || 'secondary'
  }

  const formatFrequency = (frequency: NotificationFrequency): string => {
    const labels: Record<NotificationFrequency, string> = {
      instant: t('admin.settings.frequencies.instant'),
      hourly: t('admin.settings.frequencies.hourly'),
      daily: t('admin.settings.frequencies.daily'),
      weekly: t('admin.settings.frequencies.weekly'),
      disabled: t('admin.settings.frequencies.disabled')
    }
    return labels[frequency] || frequency
  }

  const formatActivityType = (type: ActivityType): string => {
    const labels: Record<ActivityType, string> = {
      login: t('admin.settings.activityTypes.login'),
      logout: t('admin.settings.activityTypes.logout'),
      create: t('admin.settings.activityTypes.create'),
      update: t('admin.settings.activityTypes.update'),
      delete: t('admin.settings.activityTypes.delete'),
      export: t('admin.settings.activityTypes.export'),
      import: t('admin.settings.activityTypes.import'),
      status_change: t('admin.settings.activityTypes.statusChange'),
      password_reset: t('admin.settings.activityTypes.passwordReset'),
      config_change: t('admin.settings.activityTypes.configChange')
    }
    return labels[type] || type
  }

  const getActivityTypeIcon = (type: ActivityType): string => {
    const icons: Record<ActivityType, string> = {
      login: 'pi pi-sign-in',
      logout: 'pi pi-sign-out',
      create: 'pi pi-plus',
      update: 'pi pi-pencil',
      delete: 'pi pi-trash',
      export: 'pi pi-download',
      import: 'pi pi-upload',
      status_change: 'pi pi-sync',
      password_reset: 'pi pi-key',
      config_change: 'pi pi-cog'
    }
    return icons[type] || 'pi pi-circle'
  }

  const getActivityTypeSeverity = (type: ActivityType): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined => {
    const severities: Record<ActivityType, "success" | "info" | "warn" | "danger" | "secondary"> = {
      login: 'success',
      logout: 'secondary',
      create: 'success',
      update: 'info',
      delete: 'danger',
      export: 'info',
      import: 'info',
      status_change: 'warn',
      password_reset: 'warn',
      config_change: 'warn'
    }
    return severities[type] || 'secondary'
  }

  const formatEntity = (entity: ActivityEntity): string => {
    const labels: Record<ActivityEntity, string> = {
      user: t('admin.settings.entities.user'),
      client: t('admin.settings.entities.client'),
      lead: t('admin.settings.entities.lead'),
      order: t('admin.settings.entities.order'),
      invoice: t('admin.settings.entities.invoice'),
      category: t('admin.settings.entities.category'),
      package: t('admin.settings.entities.package'),
      pricing: t('admin.settings.entities.pricing'),
      admin: t('admin.settings.entities.admin'),
      system: t('admin.settings.entities.system')
    }
    return labels[entity] || entity
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

  const formatRelativeTime = (dateString: string | null | undefined): string => {
    if (!dateString) return t('admin.settings.time.never')

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return t('common.time.now')
    if (diffMins < 60) return t('common.time.minutesAgo', { count: diffMins })
    if (diffHours < 24) return t('common.time.hoursAgo', { count: diffHours })
    if (diffDays < 7) return t('common.time.daysAgo', { count: diffDays })
    return formatDate(dateString)
  }

  const getOperatorFullName = (operator: AdminOperator): string => {
    return `${operator.first_name} ${operator.last_name}`.trim()
  }

  return {
    formatRole,
    getRoleSeverity,
    formatStatus,
    getStatusSeverity,
    formatFrequency,
    formatActivityType,
    getActivityTypeIcon,
    getActivityTypeSeverity,
    formatEntity,
    formatDate,
    formatDateTime,
    formatRelativeTime,
    getOperatorFullName
  }
}

/**
 * Opzioni per filtri e form
 */
export function useSettingsOptions() {
  const { t } = useI18n()

  const roleOptions = computed(() => [
    { label: t('admin.settings.roles.superAdmin'), value: 'super_admin' },
    { label: t('admin.settings.roles.admin'), value: 'admin' },
    { label: t('admin.settings.roles.operator'), value: 'operator' }
  ])

  const statusOptions = computed(() => [
    { label: t('admin.settings.statuses.active'), value: 'active' },
    { label: t('admin.settings.statuses.inactive'), value: 'inactive' }
  ])

  const frequencyOptions = computed(() => [
    { label: t('admin.settings.frequencies.instant'), value: 'instant' },
    { label: t('admin.settings.frequencies.hourly'), value: 'hourly' },
    { label: t('admin.settings.frequencies.daily'), value: 'daily' },
    { label: t('admin.settings.frequencies.weekly'), value: 'weekly' },
    { label: t('admin.settings.frequencies.disabled'), value: 'disabled' }
  ])

  const activityTypeOptions = computed(() => [
    { label: t('common.filterDefaults.allTypes'), value: '' },
    { label: t('admin.settings.activityTypes.login'), value: 'login' },
    { label: t('admin.settings.activityTypes.logout'), value: 'logout' },
    { label: t('admin.settings.activityTypes.create'), value: 'create' },
    { label: t('admin.settings.activityTypes.update'), value: 'update' },
    { label: t('admin.settings.activityTypes.delete'), value: 'delete' },
    { label: t('admin.settings.activityTypes.export'), value: 'export' },
    { label: t('admin.settings.activityTypes.import'), value: 'import' },
    { label: t('admin.settings.activityTypes.statusChange'), value: 'status_change' },
    { label: t('admin.settings.activityTypes.passwordReset'), value: 'password_reset' },
    { label: t('admin.settings.activityTypes.configChange'), value: 'config_change' }
  ])

  const activityEntityOptions = computed(() => [
    { label: t('admin.settings.entityFilter.all'), value: '' },
    { label: t('admin.settings.entities.client'), value: 'client' },
    { label: t('admin.settings.entities.lead'), value: 'lead' },
    { label: t('admin.settings.entities.order'), value: 'order' },
    { label: t('admin.settings.entities.invoice'), value: 'invoice' },
    { label: t('admin.settings.entities.category'), value: 'category' },
    { label: t('admin.settings.entities.package'), value: 'package' },
    { label: t('admin.settings.entities.pricing'), value: 'pricing' },
    { label: t('admin.settings.entities.admin'), value: 'admin' },
    { label: t('admin.settings.entities.system'), value: 'system' }
  ])

  const smtpEncryptionOptions = computed(() => [
    { label: 'TLS', value: 'tls' },
    { label: 'SSL', value: 'ssl' },
    { label: t('admin.settings.smtpEncryption.none'), value: 'none' }
  ])

  const emailProviderOptions = computed(() => [
    { label: 'SendGrid', value: 'sendgrid' },
    { label: 'Mailgun', value: 'mailgun' },
    { label: 'Postmark', value: 'postmark' }
  ])

  return {
    roleOptions,
    statusOptions,
    frequencyOptions,
    activityTypeOptions,
    activityEntityOptions,
    smtpEncryptionOptions,
    emailProviderOptions
  }
}

/**
 * Opzioni per Fatture in Cloud
 */
export function useFattureCloudOptions() {
  const { t } = useI18n()

  const paymentMethodOptions = computed(() => [
    { label: t('admin.settings.fattureCloud.paymentMethods.bonifico'), value: 'bonifico' },
    { label: t('admin.settings.fattureCloud.paymentMethods.carta'), value: 'carta' },
    { label: t('admin.settings.fattureCloud.paymentMethods.riba'), value: 'ri.ba.' },
    { label: t('admin.settings.fattureCloud.paymentMethods.contanti'), value: 'contanti' },
    { label: t('admin.settings.fattureCloud.paymentMethods.altro'), value: 'altro' }
  ])

  return {
    paymentMethodOptions
  }
}

/**
 * Validazione configurazione Fatture in Cloud
 */
export function useFattureCloudValidation() {
  const { t } = useI18n()
  const errors = reactive<Record<string, string>>({})

  const validateAccessToken = (value: string, enabled: boolean): boolean => {
    if (enabled && !value.trim()) {
      errors.access_token = t('admin.settings.fattureCloud.validation.tokenRequired')
      return false
    }
    delete errors.access_token
    return true
  }

  const validateCompanyId = (value: number | null, enabled: boolean): boolean => {
    if (enabled && (!value || value <= 0)) {
      errors.company_id = t('admin.settings.fattureCloud.validation.companyIdRequired')
      return false
    }
    delete errors.company_id
    return true
  }

  const validateForm = (form: FattureCloudConfigForm): boolean => {
    let isValid = true
    isValid = validateAccessToken(form.access_token, form.enabled) && isValid
    isValid = validateCompanyId(form.company_id, form.enabled) && isValid
    return isValid
  }

  const clearErrors = () => {
    Object.keys(errors).forEach(key => delete errors[key])
  }

  const hasErrors = computed(() => Object.keys(errors).length > 0)

  return {
    errors,
    hasErrors,
    validateForm,
    clearErrors
  }
}
