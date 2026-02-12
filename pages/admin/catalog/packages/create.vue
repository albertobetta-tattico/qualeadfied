<script setup lang="ts">
/**
 * Admin Packages - Create New Package
 * Form per la creazione di un nuovo pacchetto lead
 */
import { usePackageValidation, useCatalogActions, useCatalogFormatters } from '~/composables/useCatalog'
import type { PackageCreateForm } from '~/types/catalog'

definePageMeta({
  layout: 'admin'
})

const { t } = useI18n()

// Store & Composables
const catalogStore = useCatalogStore()
const router = useRouter()
const { errors, hasErrors, validateField, validateForm, clearErrors } = usePackageValidation()
const { showSuccess, showError } = useCatalogActions()
const { formatCurrency } = useCatalogFormatters()

// Form State
const form = reactive<PackageCreateForm>({
  category_ids: [],
  name: '',
  description: '',
  exclusive_lead_quantity: 5,
  exclusive_price: 175,
  shared_lead_quantity: 10,
  shared_price: 100,
  is_active: true,
  sort_order: 0
})

// Category selection mode
const categoryMode = ref<'all' | 'specific'>('all')

// Watch category mode to reset category_ids
watch(categoryMode, (mode) => {
  if (mode === 'all') {
    form.category_ids = []
  }
})

// Computed
const categories = computed(() => catalogStore.categoriesForSelect)

// Computed per prezzi per lead
const exclusivePricePerLead = computed(() => {
  if (form.exclusive_lead_quantity > 0) {
    return form.exclusive_price / form.exclusive_lead_quantity
  }
  return 0
})

const sharedPricePerLead = computed(() => {
  if (form.shared_lead_quantity > 0) {
    return form.shared_price / form.shared_lead_quantity
  }
  return 0
})

// Totali
const totalLeads = computed(() => form.exclusive_lead_quantity + form.shared_lead_quantity)
const totalPrice = computed(() => form.exclusive_price + form.shared_price)

// Validation on blur
const onBlur = (field: string, value: any, extra?: any) => {
  validateField(field, value, extra)
}

// Submit form
const onSubmit = async () => {
  clearErrors()

  if (!validateForm(form)) {
    showError(t('admin.catalog.packages.toast.formError'))
    return
  }

  const pkg = await catalogStore.createPackage(form)

  if (pkg) {
    showSuccess(t('admin.catalog.packages.toast.createSuccess', { name: pkg.name }))
    router.push('/admin/catalog/packages')
  } else {
    showError(catalogStore.error || t('admin.catalog.packages.toast.createError'))
  }
}

// Cancel and go back
const onCancel = () => {
  router.push('/admin/catalog/packages')
}

// Load categories and get next sort order
onMounted(async () => {
  await Promise.all([
    catalogStore.fetchAllCategories(),
    catalogStore.fetchPackages()
  ])

  const maxSortOrder = Math.max(...catalogStore.packages.map(p => p.sort_order), 0)
  form.sort_order = maxSortOrder + 1
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-left">
        <div class="flex items-center gap-4 mb-2">
          <PrimeButton
            icon="pi pi-arrow-left"
            severity="secondary"
            text
            rounded
            @click="onCancel"
          />
          <h1 class="page-title mb-0">{{ $t('admin.catalog.packages.createTitle') }}</h1>
        </div>
        <p class="page-subtitle ml-12">{{ $t('admin.catalog.packages.createSubtitle') }}</p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Basic Information Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-box mr-2 text-primary-500"></i>
            {{ $t('admin.catalog.packages.form.basicInfo') }}
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name -->
            <div class="form-group">
              <label for="name">{{ $t('admin.catalog.packages.form.name') }} *</label>
              <PrimeInputText
                id="name"
                v-model="form.name"
                :class="{ 'p-invalid': errors.name }"
                :placeholder="$t('admin.catalog.packages.form.namePlaceholder')"
                class="w-full"
                @blur="onBlur('name', form.name)"
              />
              <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
            </div>

            <!-- Category Mode -->
            <div class="form-group">
              <label>{{ $t('admin.catalog.packages.form.packageType') }} *</label>
              <div class="flex gap-4 mt-2">
                <div class="flex items-center gap-2">
                  <PrimeRadioButton
                    v-model="categoryMode"
                    inputId="cat-all"
                    value="all"
                  />
                  <label for="cat-all" class="cursor-pointer text-sm">{{ $t('admin.catalog.packages.form.allCategories') }}</label>
                </div>
                <div class="flex items-center gap-2">
                  <PrimeRadioButton
                    v-model="categoryMode"
                    inputId="cat-specific"
                    value="specific"
                  />
                  <label for="cat-specific" class="cursor-pointer text-sm">{{ $t('admin.catalog.packages.form.specificCategory') }}</label>
                </div>
              </div>
            </div>

            <!-- Category Selection (if specific) -->
            <div v-if="categoryMode === 'specific'" class="form-group md:col-span-2">
              <label for="category_ids">{{ $t('admin.catalog.packages.form.categories') }} *</label>
              <PrimeMultiSelect
                id="category_ids"
                v-model="form.category_ids"
                :options="categories"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('admin.catalog.packages.form.categoriesPlaceholder')"
                class="w-full"
                :filter="categories.length > 5"
                :filterPlaceholder="$t('admin.catalog.packages.form.categoriesFilterPlaceholder')"
                display="chip"
              />
              <small class="form-hint">{{ $t('admin.catalog.packages.form.categoriesHint') }}</small>
            </div>

            <!-- Description -->
            <div class="form-group md:col-span-2">
              <label for="description">{{ $t('admin.catalog.packages.form.description') }}</label>
              <PrimeTextarea
                id="description"
                v-model="form.description"
                rows="3"
                :placeholder="$t('admin.catalog.packages.form.descriptionPlaceholder')"
                class="w-full"
                autoResize
              />
              <small class="form-hint">{{ $t('admin.catalog.packages.form.descriptionHint') }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Lead Esclusivi Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-star-fill mr-2 text-blue-500"></i>
            {{ $t('admin.catalog.packages.form.exclusiveLeads') }}
          </h3>
          <span class="text-sm text-neutral-500">{{ $t('admin.catalog.packages.form.exclusiveLeadsSubtitle') }}</span>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Exclusive Lead Quantity -->
            <div class="form-group">
              <label for="exclusive_lead_quantity">{{ $t('admin.catalog.packages.form.leadQuantity') }} *</label>
              <PrimeInputNumber
                id="exclusive_lead_quantity"
                v-model="form.exclusive_lead_quantity"
                :min="0"
                :max="1000"
                :showButtons="true"
                class="w-full"
              />
              <small class="form-hint">{{ $t('admin.catalog.packages.form.exclusiveLeadQuantityHint') }}</small>
            </div>

            <!-- Exclusive Price -->
            <div class="form-group">
              <label for="exclusive_price">{{ $t('admin.catalog.packages.form.totalPrice') }} *</label>
              <PrimeInputNumber
                id="exclusive_price"
                v-model="form.exclusive_price"
                :min="0"
                :max="100000"
                :minFractionDigits="2"
                :maxFractionDigits="2"
                mode="currency"
                currency="EUR"
                locale="it-IT"
                class="w-full"
              />
              <small class="form-hint">{{ $t('admin.catalog.packages.form.priceExVat') }}</small>
            </div>

            <!-- Exclusive Price per Lead (calculated) -->
            <div class="form-group">
              <label>{{ $t('admin.catalog.packages.form.pricePerLead') }}</label>
              <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div class="text-2xl font-bold text-blue-600">
                  {{ formatCurrency(exclusivePricePerLead) }}
                </div>
                <div class="text-xs text-blue-500 mt-1">{{ $t('admin.catalog.packages.form.autoCalculated') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lead Condivisi Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-users mr-2 text-orange-500"></i>
            {{ $t('admin.catalog.packages.form.sharedLeads') }}
          </h3>
          <span class="text-sm text-neutral-500">{{ $t('admin.catalog.packages.form.sharedLeadsSubtitle') }}</span>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Shared Lead Quantity -->
            <div class="form-group">
              <label for="shared_lead_quantity">{{ $t('admin.catalog.packages.form.leadQuantity') }} *</label>
              <PrimeInputNumber
                id="shared_lead_quantity"
                v-model="form.shared_lead_quantity"
                :min="0"
                :max="1000"
                :showButtons="true"
                class="w-full"
              />
              <small class="form-hint">{{ $t('admin.catalog.packages.form.sharedLeadQuantityHint') }}</small>
            </div>

            <!-- Shared Price -->
            <div class="form-group">
              <label for="shared_price">{{ $t('admin.catalog.packages.form.totalPrice') }} *</label>
              <PrimeInputNumber
                id="shared_price"
                v-model="form.shared_price"
                :min="0"
                :max="100000"
                :minFractionDigits="2"
                :maxFractionDigits="2"
                mode="currency"
                currency="EUR"
                locale="it-IT"
                class="w-full"
              />
              <small class="form-hint">{{ $t('admin.catalog.packages.form.priceExVat') }}</small>
            </div>

            <!-- Shared Price per Lead (calculated) -->
            <div class="form-group">
              <label>{{ $t('admin.catalog.packages.form.pricePerLead') }}</label>
              <div class="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div class="text-2xl font-bold text-orange-600">
                  {{ formatCurrency(sharedPricePerLead) }}
                </div>
                <div class="text-xs text-orange-500 mt-1">{{ $t('admin.catalog.packages.form.autoCalculated') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Card -->
      <div class="q-card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-calculator mr-2 text-primary-600"></i>
            {{ $t('admin.catalog.packages.form.summary') }}
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="text-center p-4 bg-white/60 rounded-lg">
              <div class="text-sm text-neutral-600 mb-1">{{ $t('admin.catalog.packages.form.exclusiveLeads') }}</div>
              <div class="text-2xl font-bold text-blue-600">{{ form.exclusive_lead_quantity }}</div>
            </div>
            <div class="text-center p-4 bg-white/60 rounded-lg">
              <div class="text-sm text-neutral-600 mb-1">{{ $t('admin.catalog.packages.form.sharedLeads') }}</div>
              <div class="text-2xl font-bold text-orange-600">{{ form.shared_lead_quantity }}</div>
            </div>
            <div class="text-center p-4 bg-white/60 rounded-lg">
              <div class="text-sm text-neutral-600 mb-1">{{ $t('admin.catalog.packages.form.totalLeads') }}</div>
              <div class="text-2xl font-bold text-primary-600">{{ totalLeads }}</div>
            </div>
            <div class="text-center p-4 bg-white/60 rounded-lg">
              <div class="text-sm text-neutral-600 mb-1">{{ $t('admin.catalog.packages.form.totalPriceLabel') }}</div>
              <div class="text-2xl font-bold text-primary-600">{{ formatCurrency(totalPrice) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-cog mr-2 text-primary-500"></i>
            {{ $t('admin.catalog.packages.form.settings') }}
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Sort Order -->
            <div class="form-group">
              <label for="sort_order">{{ $t('admin.catalog.packages.form.sortOrder') }}</label>
              <PrimeInputNumber
                id="sort_order"
                v-model="form.sort_order"
                :min="0"
                :showButtons="true"
                class="w-full"
              />
              <small class="form-hint">{{ $t('admin.catalog.packages.form.sortOrderHint') }}</small>
            </div>

            <!-- Is Active Toggle -->
            <div class="form-group flex items-end">
              <div class="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg w-full">
                <PrimeToggleSwitch
                  id="is_active"
                  v-model="form.is_active"
                />
                <div>
                  <label for="is_active" class="cursor-pointer font-medium text-neutral-800 mb-0">
                    {{ $t('admin.catalog.packages.form.isActive') }}
                  </label>
                  <p class="text-sm text-neutral-600 mt-1">
                    {{ $t('admin.catalog.packages.form.isActiveHint') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Box -->
      <div class="bg-info-light border border-info/20 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <i class="pi pi-info-circle text-info text-xl mt-0.5"></i>
          <div>
            <h4 class="font-medium text-info-dark mb-1">{{ $t('admin.catalog.packages.info.title') }}</h4>
            <p class="text-sm text-info-dark/80">
              {{ $t('admin.catalog.packages.info.description') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-4 pt-4 border-t border-neutral-200">
        <PrimeButton
          type="button"
          :label="$t('admin.common.cancel')"
          severity="secondary"
          outlined
          @click="onCancel"
        />
        <PrimeButton
          type="submit"
          :label="$t('admin.catalog.packages.form.createButton')"
          icon="pi pi-check"
          severity="primary"
          :loading="catalogStore.saving"
          :disabled="hasErrors"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-hint {
  display: block;
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.p-error {
  display: block;
  font-size: 0.75rem;
  color: #dc3545;
  margin-top: 0.25rem;
}

:deep(.p-inputnumber) {
  width: 100%;
}

:deep(.p-inputnumber-input) {
  width: 100%;
}
</style>
