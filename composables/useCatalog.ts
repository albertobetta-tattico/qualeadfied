/**
 * useCatalog Composable - Funzioni per gestione Categorie, Province e Pacchetti
 * Qualeadfied B2B Lead Platform
 */

import { reactive, computed } from 'vue'
import type {
  Category,
  CategoryCreateForm,
  CategoryUpdateForm,
  Province,
  Package,
  PackageCreateForm,
  PackageUpdateForm
} from '~/types/catalog'

// ============================================
// VALIDAZIONE CATEGORIE
// ============================================

export function useCategoryValidation() {
  const { t } = useI18n()
  const errors = reactive<Record<string, string>>({})

  const validateName = (value: string): boolean => {
    if (!value || value.trim().length < 2) {
      errors.name = t('admin.catalog.validation.nameMinLength')
      return false
    }
    if (value.length > 100) {
      errors.name = t('admin.catalog.validation.nameMaxLength')
      return false
    }
    delete errors.name
    return true
  }

  const validateSlug = (value: string): boolean => {
    if (!value || value.trim() === '') {
      errors.slug = t('admin.catalog.validation.slugRequired')
      return false
    }
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(value)) {
      errors.slug = t('leads.validation.slugFormat')
      return false
    }
    if (value.length > 100) {
      errors.slug = t('admin.catalog.validation.slugMaxLength')
      return false
    }
    delete errors.slug
    return true
  }

  const validateMaxShares = (value: number): boolean => {
    if (value < 1) {
      errors.max_shares = t('admin.catalog.validation.maxSharesMin')
      return false
    }
    if (value > 10) {
      errors.max_shares = t('admin.catalog.validation.maxSharesMax')
      return false
    }
    delete errors.max_shares
    return true
  }

  const validateSortOrder = (value: number): boolean => {
    if (value < 0) {
      errors.sort_order = t('admin.catalog.validation.sortOrderPositive')
      return false
    }
    delete errors.sort_order
    return true
  }

  const validateField = (field: string, value: any): boolean => {
    switch (field) {
      case 'name':
        return validateName(value)
      case 'slug':
        return validateSlug(value)
      case 'max_shares':
        return validateMaxShares(value)
      case 'sort_order':
        return validateSortOrder(value)
      default:
        return true
    }
  }

  const validateForm = (form: CategoryCreateForm | CategoryUpdateForm): boolean => {
    let isValid = true
    isValid = validateName(form.name) && isValid
    isValid = validateSlug(form.slug) && isValid
    isValid = validateMaxShares(form.max_shares) && isValid
    isValid = validateSortOrder(form.sort_order) && isValid
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

// ============================================
// VALIDAZIONE PACCHETTI
// ============================================

export function usePackageValidation() {
  const { t } = useI18n()
  const errors = reactive<Record<string, string>>({})

  const validateName = (value: string): boolean => {
    if (!value || value.trim().length < 2) {
      errors.name = t('admin.catalog.validation.nameMinLength')
      return false
    }
    if (value.length > 100) {
      errors.name = t('admin.catalog.validation.nameMaxLength')
      return false
    }
    delete errors.name
    return true
  }

  const validateLeadQuantity = (field: string, value: number): boolean => {
    if (value < 0) {
      errors[field] = t('admin.catalog.validation.quantityMin')
      return false
    }
    if (value > 1000) {
      errors[field] = t('admin.catalog.validation.quantityMax')
      return false
    }
    delete errors[field]
    return true
  }

  const validatePrice = (field: string, value: number): boolean => {
    if (value < 0) {
      errors[field] = t('admin.catalog.validation.pricePositive')
      return false
    }
    if (value > 100000) {
      errors[field] = t('admin.catalog.validation.priceMax')
      return false
    }
    delete errors[field]
    return true
  }

  const validateTotalLeads = (exclusiveQty: number, sharedQty: number): boolean => {
    if (exclusiveQty + sharedQty < 1) {
      errors.total_leads = t('admin.catalog.validation.packageMinLead')
      return false
    }
    delete errors.total_leads
    return true
  }

  const validateField = (field: string, value: any, extra?: any): boolean => {
    switch (field) {
      case 'name':
        return validateName(value)
      case 'exclusive_lead_quantity':
      case 'shared_lead_quantity':
        return validateLeadQuantity(field, value)
      case 'exclusive_price':
      case 'shared_price':
        return validatePrice(field, value)
      default:
        return true
    }
  }

  const validateForm = (form: PackageCreateForm | PackageUpdateForm): boolean => {
    let isValid = true
    isValid = validateName(form.name) && isValid
    isValid = validateLeadQuantity('exclusive_lead_quantity', form.exclusive_lead_quantity) && isValid
    isValid = validateLeadQuantity('shared_lead_quantity', form.shared_lead_quantity) && isValid
    isValid = validatePrice('exclusive_price', form.exclusive_price) && isValid
    isValid = validatePrice('shared_price', form.shared_price) && isValid
    isValid = validateTotalLeads(form.exclusive_lead_quantity, form.shared_lead_quantity) && isValid
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

// ============================================
// VALIDAZIONE PREZZI
// ============================================

export function usePricingValidation() {
  const { t } = useI18n()
  const errors = reactive<Record<string, string>>({})

  const validateExclusivePrice = (value: number): boolean => {
    if (value < 0) {
      errors.exclusive_price = t('admin.catalog.validation.pricePositive')
      return false
    }
    if (value > 10000) {
      errors.exclusive_price = t('admin.catalog.validation.pricingMax')
      return false
    }
    delete errors.exclusive_price
    return true
  }

  const validateSharedPrice = (slotKey: string, value: number): boolean => {
    if (value < 0) {
      errors[slotKey] = t('admin.catalog.validation.pricePositive')
      return false
    }
    if (value > 10000) {
      errors[slotKey] = t('admin.catalog.validation.pricingMax')
      return false
    }
    delete errors[slotKey]
    return true
  }

  const validateSharedPrices = (sharedPrices: Record<string, number>): boolean => {
    let isValid = true
    for (const [key, value] of Object.entries(sharedPrices)) {
      if (!validateSharedPrice(key, value)) {
        isValid = false
      }
    }
    return isValid
  }

  const validateForm = (exclusivePrice: number, sharedPrices: Record<string, number>): boolean => {
    let isValid = true
    isValid = validateExclusivePrice(exclusivePrice) && isValid
    isValid = validateSharedPrices(sharedPrices) && isValid
    return isValid
  }

  const clearErrors = () => {
    Object.keys(errors).forEach(key => delete errors[key])
  }

  const hasErrors = computed(() => Object.keys(errors).length > 0)

  return {
    errors,
    hasErrors,
    validateExclusivePrice,
    validateSharedPrice,
    validateSharedPrices,
    validateForm,
    clearErrors
  }
}

// ============================================
// AZIONI CATALOGO
// ============================================

export function useCatalogActions() {
  const { t } = useI18n()
  const toast = useToast()
  const confirm = useConfirm()

  // Category actions
  const confirmDeleteCategory = (category: Category, onConfirm: () => void) => {
    confirm.require({
      message: t('admin.catalog.confirm.deleteCategoryMessage', { name: category.name, count: category.leads_count || 0 }),
      header: t('admin.common.confirmDelete'),
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',
      acceptLabel: t('common.actions.delete'),
      rejectLabel: t('common.actions.cancel'),
      accept: onConfirm
    })
  }

  const confirmToggleCategory = (category: Category, onConfirm: () => void) => {
    const action = category.is_active ? t('admin.catalog.confirm.deactivate') : t('admin.catalog.confirm.activate')
    confirm.require({
      message: t('admin.catalog.confirm.toggleCategoryMessage', { action, name: category.name }),
      header: t('admin.catalog.confirm.toggleHeader', { action: category.is_active ? t('admin.catalog.confirm.deactivation') : t('admin.catalog.confirm.activation') }),
      icon: 'pi pi-info-circle',
      acceptLabel: category.is_active ? t('admin.catalog.confirm.deactivateBtn') : t('admin.catalog.confirm.activateBtn'),
      rejectLabel: t('common.actions.cancel'),
      accept: onConfirm
    })
  }

  // Package actions
  const confirmDeletePackage = (pkg: Package, onConfirm: () => void) => {
    confirm.require({
      message: t('admin.catalog.confirm.deletePackageMessage', { name: pkg.name, count: pkg.sales_count || 0 }),
      header: t('admin.common.confirmDelete'),
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',
      acceptLabel: t('common.actions.delete'),
      rejectLabel: t('common.actions.cancel'),
      accept: onConfirm
    })
  }

  const confirmTogglePackage = (pkg: Package, onConfirm: () => void) => {
    const action = pkg.is_active ? t('admin.catalog.confirm.deactivate') : t('admin.catalog.confirm.activate')
    confirm.require({
      message: t('admin.catalog.confirm.togglePackageMessage', { action, name: pkg.name }),
      header: t('admin.catalog.confirm.toggleHeader', { action: pkg.is_active ? t('admin.catalog.confirm.deactivation') : t('admin.catalog.confirm.activation') }),
      icon: 'pi pi-info-circle',
      acceptLabel: pkg.is_active ? t('admin.catalog.confirm.deactivateBtn') : t('admin.catalog.confirm.activateBtn'),
      rejectLabel: t('common.actions.cancel'),
      accept: onConfirm
    })
  }

  // Toast notifications
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
    confirmDeleteCategory,
    confirmToggleCategory,
    confirmDeletePackage,
    confirmTogglePackage,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}

// ============================================
// FORMATTATORI
// ============================================

export function useCatalogFormatters() {
  const { t } = useI18n()

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('it-IT').format(value)
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

  const formatActiveStatus = (isActive: boolean): string => {
    return isActive ? t('admin.catalog.statuses.active') : t('admin.catalog.statuses.inactive')
  }

  const getActiveStatusSeverity = (isActive: boolean): 'success' | 'danger' => {
    return isActive ? 'success' : 'danger'
  }

  const formatLeadAvailability = (available: number, total: number): string => {
    const percentage = total > 0 ? Math.round((available / total) * 100) : 0
    return `${available}/${total} (${percentage}%)`
  }

  const getAvailabilityClass = (available: number, total: number): string => {
    const percentage = total > 0 ? (available / total) * 100 : 0
    if (percentage > 50) return 'text-success'
    if (percentage > 20) return 'text-warning'
    return 'text-danger'
  }

  const formatPackageType = (categoryId: number | null): string => {
    return categoryId ? t('admin.catalog.packageTypes.specificCategory') : t('admin.catalog.packageTypes.allCategories')
  }

  const formatAcquisitionModes = (allowsExclusive: boolean, allowsShared: boolean): string => {
    if (allowsExclusive && allowsShared) return t('admin.catalog.acquisitionModes.both')
    if (allowsExclusive) return t('admin.catalog.acquisitionModes.exclusiveOnly')
    if (allowsShared) return t('admin.catalog.acquisitionModes.sharedOnly')
    return '-'
  }

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  return {
    formatCurrency,
    formatNumber,
    formatDate,
    formatDateTime,
    formatActiveStatus,
    getActiveStatusSeverity,
    formatLeadAvailability,
    getAvailabilityClass,
    formatPackageType,
    formatAcquisitionModes,
    generateSlug
  }
}

// ============================================
// FORM HELPERS
// ============================================

export function useCategoryForm(initialData?: Category) {
  const { generateSlug } = useCatalogFormatters()

  const defaultForm: CategoryCreateForm = {
    name: '',
    slug: '',
    description: '',
    max_shares: 3,
    is_active: true,
    sort_order: 0,
    custom_fields: []
  }

  const form = reactive<CategoryCreateForm>({
    name: initialData?.name || defaultForm.name,
    slug: initialData?.slug || defaultForm.slug,
    description: initialData?.description || defaultForm.description,
    max_shares: initialData?.max_shares || defaultForm.max_shares,
    is_active: initialData?.is_active ?? defaultForm.is_active,
    sort_order: initialData?.sort_order || defaultForm.sort_order,
    custom_fields: initialData?.custom_fields ? initialData.custom_fields.map(f => ({ ...f })) : []
  })

  const updateSlugFromName = () => {
    if (!initialData && form.name) {
      form.slug = generateSlug(form.name)
    }
  }

  const resetForm = () => {
    form.name = initialData?.name || defaultForm.name
    form.slug = initialData?.slug || defaultForm.slug
    form.description = initialData?.description || defaultForm.description
    form.max_shares = initialData?.max_shares || defaultForm.max_shares
    form.is_active = initialData?.is_active ?? defaultForm.is_active
    form.sort_order = initialData?.sort_order || defaultForm.sort_order
    form.custom_fields = initialData?.custom_fields ? initialData.custom_fields.map(f => ({ ...f })) : []
  }

  return {
    form,
    updateSlugFromName,
    resetForm
  }
}

export function usePackageForm(initialData?: Package) {
  const defaultForm: PackageCreateForm = {
    category_ids: [],
    name: '',
    description: '',
    exclusive_lead_quantity: 5,
    exclusive_price: 175,
    shared_lead_quantity: 10,
    shared_price: 100,
    is_active: true,
    sort_order: 0
  }

  const form = reactive<PackageCreateForm>({
    category_ids: initialData?.category_ids || defaultForm.category_ids,
    name: initialData?.name || defaultForm.name,
    description: initialData?.description || defaultForm.description,
    exclusive_lead_quantity: initialData?.exclusive_lead_quantity ?? defaultForm.exclusive_lead_quantity,
    exclusive_price: initialData?.exclusive_price ?? defaultForm.exclusive_price,
    shared_lead_quantity: initialData?.shared_lead_quantity ?? defaultForm.shared_lead_quantity,
    shared_price: initialData?.shared_price ?? defaultForm.shared_price,
    is_active: initialData?.is_active ?? defaultForm.is_active,
    sort_order: initialData?.sort_order || defaultForm.sort_order
  })

  const resetForm = () => {
    form.category_ids = initialData?.category_ids || defaultForm.category_ids
    form.name = initialData?.name || defaultForm.name
    form.description = initialData?.description || defaultForm.description
    form.exclusive_lead_quantity = initialData?.exclusive_lead_quantity ?? defaultForm.exclusive_lead_quantity
    form.exclusive_price = initialData?.exclusive_price ?? defaultForm.exclusive_price
    form.shared_lead_quantity = initialData?.shared_lead_quantity ?? defaultForm.shared_lead_quantity
    form.shared_price = initialData?.shared_price ?? defaultForm.shared_price
    form.is_active = initialData?.is_active ?? defaultForm.is_active
    form.sort_order = initialData?.sort_order || defaultForm.sort_order
  }

  return {
    form,
    resetForm
  }
}
