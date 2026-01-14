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
  AdminOperatorCreateForm
} from '~/types/settings'

/**
 * Validazione operatore admin
 */
export function useOperatorValidation() {
  const errors = reactive<Record<string, string>>({})

  const validateEmail = (value: string): boolean => {
    if (!value) {
      errors.email = 'L\'email è obbligatoria'
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      errors.email = 'Formato email non valido'
      return false
    }
    delete errors.email
    return true
  }

  const validateFirstName = (value: string): boolean => {
    if (!value || value.trim().length < 2) {
      errors.first_name = 'Il nome deve avere almeno 2 caratteri'
      return false
    }
    delete errors.first_name
    return true
  }

  const validateLastName = (value: string): boolean => {
    if (!value || value.trim().length < 2) {
      errors.last_name = 'Il cognome deve avere almeno 2 caratteri'
      return false
    }
    delete errors.last_name
    return true
  }

  const validatePassword = (value: string, isCreate: boolean = true): boolean => {
    if (isCreate && !value) {
      errors.password = 'La password è obbligatoria'
      return false
    }
    if (value && value.length < 8) {
      errors.password = 'La password deve avere almeno 8 caratteri'
      return false
    }
    if (value && !/[A-Z]/.test(value)) {
      errors.password = 'La password deve contenere almeno una maiuscola'
      return false
    }
    if (value && !/[0-9]/.test(value)) {
      errors.password = 'La password deve contenere almeno un numero'
      return false
    }
    delete errors.password
    return true
  }

  const validatePasswordConfirmation = (password: string, confirmation: string): boolean => {
    if (password && password !== confirmation) {
      errors.password_confirmation = 'Le password non coincidono'
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
  const toast = useToast()
  const confirm = useConfirm()

  const confirmDeleteOperator = (operator: AdminOperator, onConfirm: () => void) => {
    confirm.require({
      message: `Sei sicuro di voler eliminare l'operatore "${operator.first_name} ${operator.last_name}"? Questa azione non può essere annullata.`,
      header: 'Conferma Eliminazione',
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',
      acceptLabel: 'Elimina',
      rejectLabel: 'Annulla',
      accept: onConfirm
    })
  }

  const confirmResetPassword = (operator: AdminOperator, onConfirm: () => void) => {
    confirm.require({
      message: `Inviare un'email di reset password a "${operator.email}"?`,
      header: 'Reset Password',
      icon: 'pi pi-envelope',
      acceptLabel: 'Invia',
      rejectLabel: 'Annulla',
      accept: onConfirm
    })
  }

  const confirmDeactivateOperator = (operator: AdminOperator, onConfirm: () => void) => {
    confirm.require({
      message: `Disattivare l'operatore "${operator.first_name} ${operator.last_name}"? Non potrà più accedere al sistema.`,
      header: 'Disattiva Operatore',
      icon: 'pi pi-user-minus',
      acceptClass: 'p-button-warning',
      acceptLabel: 'Disattiva',
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
  const formatRole = (role: AdminRole): string => {
    const labels: Record<AdminRole, string> = {
      super_admin: 'Super Admin',
      admin: 'Amministratore',
      operator: 'Operatore'
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
      active: 'Attivo',
      inactive: 'Disattivato'
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
      instant: 'Immediato',
      hourly: 'Ogni ora',
      daily: 'Giornaliero',
      weekly: 'Settimanale',
      disabled: 'Disabilitato'
    }
    return labels[frequency] || frequency
  }

  const formatActivityType = (type: ActivityType): string => {
    const labels: Record<ActivityType, string> = {
      login: 'Accesso',
      logout: 'Disconnessione',
      create: 'Creazione',
      update: 'Modifica',
      delete: 'Eliminazione',
      export: 'Export',
      import: 'Import',
      status_change: 'Cambio Stato',
      password_reset: 'Reset Password',
      config_change: 'Modifica Config'
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
      user: 'Utente',
      client: 'Cliente',
      lead: 'Lead',
      order: 'Ordine',
      invoice: 'Fattura',
      category: 'Categoria',
      package: 'Pacchetto',
      pricing: 'Listino',
      admin: 'Operatore',
      system: 'Sistema'
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
    if (!dateString) return 'Mai'

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Adesso'
    if (diffMins < 60) return `${diffMins} min fa`
    if (diffHours < 24) return `${diffHours} ore fa`
    if (diffDays < 7) return `${diffDays} giorni fa`
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
  const roleOptions = [
    { label: 'Super Admin', value: 'super_admin' },
    { label: 'Amministratore', value: 'admin' },
    { label: 'Operatore', value: 'operator' }
  ]

  const statusOptions = [
    { label: 'Attivo', value: 'active' },
    { label: 'Disattivato', value: 'inactive' }
  ]

  const frequencyOptions = [
    { label: 'Immediato', value: 'instant' },
    { label: 'Ogni ora', value: 'hourly' },
    { label: 'Giornaliero', value: 'daily' },
    { label: 'Settimanale', value: 'weekly' },
    { label: 'Disabilitato', value: 'disabled' }
  ]

  const activityTypeOptions = [
    { label: 'Tutti i tipi', value: '' },
    { label: 'Accesso', value: 'login' },
    { label: 'Disconnessione', value: 'logout' },
    { label: 'Creazione', value: 'create' },
    { label: 'Modifica', value: 'update' },
    { label: 'Eliminazione', value: 'delete' },
    { label: 'Export', value: 'export' },
    { label: 'Import', value: 'import' },
    { label: 'Cambio Stato', value: 'status_change' },
    { label: 'Reset Password', value: 'password_reset' },
    { label: 'Modifica Config', value: 'config_change' }
  ]

  const activityEntityOptions = [
    { label: 'Tutte le entità', value: '' },
    { label: 'Clienti', value: 'client' },
    { label: 'Lead', value: 'lead' },
    { label: 'Ordini', value: 'order' },
    { label: 'Fatture', value: 'invoice' },
    { label: 'Categorie', value: 'category' },
    { label: 'Pacchetti', value: 'package' },
    { label: 'Listini', value: 'pricing' },
    { label: 'Operatori', value: 'admin' },
    { label: 'Sistema', value: 'system' }
  ]

  const smtpEncryptionOptions = [
    { label: 'TLS', value: 'tls' },
    { label: 'SSL', value: 'ssl' },
    { label: 'Nessuna', value: 'none' }
  ]

  const emailProviderOptions = [
    { label: 'SendGrid', value: 'sendgrid' },
    { label: 'Mailgun', value: 'mailgun' },
    { label: 'Postmark', value: 'postmark' }
  ]

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
