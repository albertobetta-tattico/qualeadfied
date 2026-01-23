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
  const errors = reactive<Record<string, string>>({})

  const validateName = (value: string): boolean => {
    if (!value || value.trim().length < 2) {
      errors.name = 'Il nome deve avere almeno 2 caratteri'
      return false
    }
    if (value.length > 100) {
      errors.name = 'Il nome non può superare 100 caratteri'
      return false
    }
    delete errors.name
    return true
  }

  const validateSlug = (value: string): boolean => {
    if (!value || value.trim() === '') {
      errors.slug = 'Lo slug è obbligatorio'
      return false
    }
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(value)) {
      errors.slug = 'Lo slug può contenere solo lettere minuscole, numeri e trattini'
      return false
    }
    if (value.length > 100) {
      errors.slug = 'Lo slug non può superare 100 caratteri'
      return false
    }
    delete errors.slug
    return true
  }

  const validateMaxShares = (value: number): boolean => {
    if (value < 1) {
      errors.max_shares = 'Il numero minimo di condivisioni è 1'
      return false
    }
    if (value > 10) {
      errors.max_shares = 'Il numero massimo di condivisioni è 10'
      return false
    }
    delete errors.max_shares
    return true
  }

  const validateSortOrder = (value: number): boolean => {
    if (value < 0) {
      errors.sort_order = 'L\'ordine deve essere un numero positivo'
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
  const errors = reactive<Record<string, string>>({})

  const validateName = (value: string): boolean => {
    if (!value || value.trim().length < 2) {
      errors.name = 'Il nome deve avere almeno 2 caratteri'
      return false
    }
    if (value.length > 100) {
      errors.name = 'Il nome non può superare 100 caratteri'
      return false
    }
    delete errors.name
    return true
  }

  const validateLeadQuantity = (field: string, value: number): boolean => {
    if (value < 0) {
      errors[field] = 'La quantità minima è 0'
      return false
    }
    if (value > 1000) {
      errors[field] = 'La quantità massima è 1000'
      return false
    }
    delete errors[field]
    return true
  }

  const validatePrice = (field: string, value: number): boolean => {
    if (value < 0) {
      errors[field] = 'Il prezzo deve essere positivo'
      return false
    }
    if (value > 100000) {
      errors[field] = 'Il prezzo massimo è 100.000€'
      return false
    }
    delete errors[field]
    return true
  }

  const validateTotalLeads = (exclusiveQty: number, sharedQty: number): boolean => {
    if (exclusiveQty + sharedQty < 1) {
      errors.total_leads = 'Il pacchetto deve contenere almeno 1 lead'
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
  const errors = reactive<Record<string, string>>({})

  const validateExclusivePrice = (value: number): boolean => {
    if (value < 0) {
      errors.exclusive_price = 'Il prezzo deve essere un valore positivo'
      return false
    }
    if (value > 10000) {
      errors.exclusive_price = 'Il prezzo massimo è 10.000€'
      return false
    }
    delete errors.exclusive_price
    return true
  }

  const validateSharedPrice = (slotKey: string, value: number): boolean => {
    if (value < 0) {
      errors[slotKey] = 'Il prezzo deve essere positivo'
      return false
    }
    if (value > 10000) {
      errors[slotKey] = 'Il prezzo massimo è 10.000€'
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
  const toast = useToast()
  const confirm = useConfirm()

  // Category actions
  const confirmDeleteCategory = (category: Category, onConfirm: () => void) => {
    confirm.require({
      message: `Sei sicuro di voler eliminare la categoria "${category.name}"? ${category.leads_count ? `Questa categoria contiene ${category.leads_count} lead.` : ''}`,
      header: 'Conferma Eliminazione',
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',
      acceptLabel: 'Elimina',
      rejectLabel: 'Annulla',
      accept: onConfirm
    })
  }

  const confirmToggleCategory = (category: Category, onConfirm: () => void) => {
    const action = category.is_active ? 'disattivare' : 'attivare'
    confirm.require({
      message: `Sei sicuro di voler ${action} la categoria "${category.name}"?`,
      header: `Conferma ${category.is_active ? 'Disattivazione' : 'Attivazione'}`,
      icon: 'pi pi-info-circle',
      acceptLabel: category.is_active ? 'Disattiva' : 'Attiva',
      rejectLabel: 'Annulla',
      accept: onConfirm
    })
  }

  // Package actions
  const confirmDeletePackage = (pkg: Package, onConfirm: () => void) => {
    confirm.require({
      message: `Sei sicuro di voler eliminare il pacchetto "${pkg.name}"? ${pkg.sales_count ? `Questo pacchetto è stato venduto ${pkg.sales_count} volte.` : ''}`,
      header: 'Conferma Eliminazione',
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',
      acceptLabel: 'Elimina',
      rejectLabel: 'Annulla',
      accept: onConfirm
    })
  }

  const confirmTogglePackage = (pkg: Package, onConfirm: () => void) => {
    const action = pkg.is_active ? 'disattivare' : 'attivare'
    confirm.require({
      message: `Sei sicuro di voler ${action} il pacchetto "${pkg.name}"?`,
      header: `Conferma ${pkg.is_active ? 'Disattivazione' : 'Attivazione'}`,
      icon: 'pi pi-info-circle',
      acceptLabel: pkg.is_active ? 'Disattiva' : 'Attiva',
      rejectLabel: 'Annulla',
      accept: onConfirm
    })
  }

  // Toast notifications
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
    return isActive ? 'Attivo' : 'Non attivo'
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
    return categoryId ? 'Categoria Specifica' : 'Tutte le Categorie'
  }

  const formatAcquisitionModes = (allowsExclusive: boolean, allowsShared: boolean): string => {
    if (allowsExclusive && allowsShared) return 'Esclusivo + Condiviso'
    if (allowsExclusive) return 'Solo Esclusivo'
    if (allowsShared) return 'Solo Condiviso'
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
    sort_order: 0
  }

  const form = reactive<CategoryCreateForm>({
    name: initialData?.name || defaultForm.name,
    slug: initialData?.slug || defaultForm.slug,
    description: initialData?.description || defaultForm.description,
    max_shares: initialData?.max_shares || defaultForm.max_shares,
    is_active: initialData?.is_active ?? defaultForm.is_active,
    sort_order: initialData?.sort_order || defaultForm.sort_order
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
