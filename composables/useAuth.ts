/**
 * Composables - Authentication
 * Utilities for auth forms validation, actions and formatting
 */
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import type { RegisterForm, LoginForm, ForgotPasswordForm, ResetPasswordForm } from '~/types/auth'

/**
 * Registration form validation
 */
export function useRegisterValidation() {
  const { t } = useI18n()

  const errors = reactive<Record<string, string>>({
    company_name: '',
    vat_number: '',
    email: '',
    phone: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirmation: '',
    terms_accepted: '',
    privacy_accepted: ''
  })

  const hasErrors = computed(() => {
    return Object.values(errors).some(e => e !== '')
  })

  // VAT number validation (Italian format)
  const isValidVatNumber = (vat: string): boolean => {
    // Remove 'IT' prefix if present
    const cleanVat = vat.replace(/^IT/i, '').replace(/\s/g, '')
    // Italian VAT: 11 digits
    if (!/^\d{11}$/.test(cleanVat)) return false

    // Luhn check for Italian VAT
    let sum = 0
    for (let i = 0; i < 11; i++) {
      const digit = parseInt(cleanVat[i], 10)
      if (i % 2 === 0) {
        sum += digit
      } else {
        const doubled = digit * 2
        sum += doubled > 9 ? doubled - 9 : doubled
      }
    }
    return sum % 10 === 0
  }

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Phone validation (Italian format)
  const isValidPhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    // Italian phone: starts with +39 or 0, followed by 9-10 digits
    return /^(\+39)?[03]\d{8,10}$/.test(cleanPhone)
  }

  // Password strength validation
  const isStrongPassword = (password: string): boolean => {
    // Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /\d/.test(password)
  }

  const validateField = (field: keyof RegisterForm, value: any): boolean => {
    errors[field] = ''

    switch (field) {
      case 'company_name':
        if (!value || value.length < 2) {
          errors.company_name = t('validation.required.companyName')
          return false
        }
        break

      case 'vat_number':
        if (!value) {
          errors.vat_number = t('validation.required.vatNumber')
          return false
        }
        if (!isValidVatNumber(value)) {
          errors.vat_number = t('validation.invalid.vatNumber')
          return false
        }
        break

      case 'email':
        if (!value) {
          errors.email = t('validation.required.email')
          return false
        }
        if (!isValidEmail(value)) {
          errors.email = t('validation.invalid.email')
          return false
        }
        break

      case 'phone':
        if (!value) {
          errors.phone = t('validation.required.phone')
          return false
        }
        if (!isValidPhone(value)) {
          errors.phone = t('validation.invalid.phone')
          return false
        }
        break

      case 'first_name':
        if (!value || value.trim().length < 2) {
          errors.first_name = t('validation.required.firstName')
          return false
        }
        break

      case 'last_name':
        if (!value || value.trim().length < 2) {
          errors.last_name = t('validation.required.lastName')
          return false
        }
        break

      case 'password':
        if (!value) {
          errors.password = t('validation.required.password')
          return false
        }
        if (!isStrongPassword(value)) {
          errors.password = t('validation.password.tooWeak')
          return false
        }
        break

      case 'password_confirmation':
        if (!value) {
          errors.password_confirmation = t('validation.required.passwordConfirmation')
          return false
        }
        break

      case 'terms_accepted':
        if (!value) {
          errors.terms_accepted = t('validation.required.termsAccepted')
          return false
        }
        break

      case 'privacy_accepted':
        if (!value) {
          errors.privacy_accepted = t('validation.required.privacyAccepted')
          return false
        }
        break
    }

    return true
  }

  const validateForm = (form: RegisterForm): boolean => {
    let isValid = true

    isValid = validateField('company_name', form.company_name) && isValid
    isValid = validateField('vat_number', form.vat_number) && isValid
    isValid = validateField('email', form.email) && isValid
    isValid = validateField('phone', form.phone) && isValid
    isValid = validateField('first_name', form.first_name) && isValid
    isValid = validateField('last_name', form.last_name) && isValid
    isValid = validateField('password', form.password) && isValid
    isValid = validateField('password_confirmation', form.password_confirmation) && isValid
    isValid = validateField('terms_accepted', form.terms_accepted) && isValid
    isValid = validateField('privacy_accepted', form.privacy_accepted) && isValid

    // Check password match
    if (form.password !== form.password_confirmation) {
      errors.password_confirmation = t('validation.password.mismatch')
      isValid = false
    }

    return isValid
  }

  const clearErrors = () => {
    Object.keys(errors).forEach(key => {
      errors[key] = ''
    })
  }

  return {
    errors,
    hasErrors,
    validateField,
    validateForm,
    clearErrors,
    isValidEmail,
    isValidVatNumber,
    isValidPhone,
    isStrongPassword
  }
}

/**
 * Login form validation
 */
export function useLoginValidation() {
  const { t } = useI18n()

  const errors = reactive<Record<string, string>>({
    email: '',
    password: ''
  })

  const hasErrors = computed(() => {
    return Object.values(errors).some(e => e !== '')
  })

  const validateForm = (form: LoginForm): boolean => {
    let isValid = true
    errors.email = ''
    errors.password = ''

    if (!form.email) {
      errors.email = t('validation.required.email')
      isValid = false
    }

    if (!form.password) {
      errors.password = t('validation.required.password')
      isValid = false
    }

    return isValid
  }

  const clearErrors = () => {
    errors.email = ''
    errors.password = ''
  }

  return {
    errors,
    hasErrors,
    validateForm,
    clearErrors
  }
}

/**
 * Password reset validation
 */
export function usePasswordResetValidation() {
  const { t } = useI18n()

  const errors = reactive<Record<string, string>>({
    email: '',
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

  const validateForgotPasswordForm = (form: ForgotPasswordForm): boolean => {
    errors.email = ''

    if (!form.email) {
      errors.email = t('validation.required.email')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      errors.email = t('validation.invalid.email')
      return false
    }

    return true
  }

  const validateResetPasswordForm = (form: ResetPasswordForm): boolean => {
    let isValid = true
    errors.password = ''
    errors.password_confirmation = ''

    if (!form.password) {
      errors.password = t('validation.required.newPassword')
      isValid = false
    } else if (!isStrongPassword(form.password)) {
      errors.password = t('validation.password.tooWeak')
      isValid = false
    }

    if (!form.password_confirmation) {
      errors.password_confirmation = t('validation.required.passwordConfirmation')
      isValid = false
    } else if (form.password !== form.password_confirmation) {
      errors.password_confirmation = t('validation.password.mismatch')
      isValid = false
    }

    return isValid
  }

  const clearErrors = () => {
    Object.keys(errors).forEach(key => {
      errors[key] = ''
    })
  }

  return {
    errors,
    hasErrors,
    validateForgotPasswordForm,
    validateResetPasswordForm,
    clearErrors
  }
}

/**
 * Auth toast notifications
 */
export function useAuthToast() {
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

  return {
    showSuccess,
    showError,
    showInfo,
    showWarn
  }
}

/**
 * Auth confirm dialogs
 */
export function useAuthConfirm() {
  const { t } = useI18n()
  const confirm = useConfirm()

  const confirmLogout = (onConfirm: () => void) => {
    confirm.require({
      message: t('notifications.confirm.logout.message'),
      header: t('notifications.confirm.logout.header'),
      icon: 'pi pi-sign-out',
      acceptLabel: t('notifications.confirm.logout.acceptLabel'),
      rejectLabel: t('notifications.confirm.logout.rejectLabel'),
      acceptClass: 'p-button-danger',
      accept: onConfirm
    })
  }

  return {
    confirmLogout
  }
}

/**
 * Password strength indicator
 */
export function usePasswordStrength() {
  const { t } = useI18n()

  const getStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) {
      return { score: 0, label: '', color: 'neutral' }
    }

    let score = 0

    // Length checks
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1

    // Character type checks
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/\d/.test(password)) score += 1
    if (/[^a-zA-Z\d]/.test(password)) score += 1

    // Map score to strength
    if (score <= 2) {
      return { score, label: t('auth.passwordStrength.weak'), color: 'danger' }
    } else if (score <= 4) {
      return { score, label: t('auth.passwordStrength.medium'), color: 'warning' }
    } else {
      return { score, label: t('auth.passwordStrength.strong'), color: 'success' }
    }
  }

  return {
    getStrength
  }
}
