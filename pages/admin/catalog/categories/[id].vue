<script setup lang="ts">
/**
 * Admin Categories - Edit Category
 * Form per la modifica di una categoria merceologica esistente
 */
import { useCategoryValidation, useCatalogActions, useCatalogFormatters } from '~/composables/useCatalog'
import type { CategoryUpdateForm, CustomFieldDefinition } from '~/types/catalog'

definePageMeta({
  layout: 'admin'
})

const { t } = useI18n()

// Route params
const route = useRoute()
const categoryId = computed(() => {
  const params = route.params as { id: string }
  return Number(params.id)
})

// Store & Composables
const catalogStore = useCatalogStore()
const router = useRouter()
const { errors, hasErrors, validateField, validateForm, clearErrors } = useCategoryValidation()
const { showSuccess, showError, showWarning } = useCatalogActions()
const { generateSlug, formatDate, formatNumber } = useCatalogFormatters()

// Form State
const form = reactive<CategoryUpdateForm>({
  name: '',
  slug: '',
  description: '',
  max_shares: 3,
  is_active: true,
  sort_order: 0,
  custom_fields: []
})

// Loading state
const initialLoading = ref(true)

// Current category
const category = computed(() => catalogStore.currentCategory)

// Populate form when category is loaded
watch(category, (newCategory) => {
  if (newCategory) {
    form.name = newCategory.name
    form.slug = newCategory.slug
    form.description = newCategory.description || ''
    form.max_shares = newCategory.max_shares
    form.is_active = newCategory.is_active
    form.sort_order = newCategory.sort_order
    form.custom_fields = newCategory.custom_fields ? newCategory.custom_fields.map(f => ({ ...f })) : []
  }
}, { immediate: true })

// Validation on blur
const onBlur = (field: string, value: any) => {
  validateField(field, value)
}

// Regenerate slug
const regenerateSlug = () => {
  if (form.name) {
    form.slug = generateSlug(form.name)
    showWarning(t('admin.catalog.categories.toast.slugRegenerated'))
  }
}

// Custom fields management
const addCustomField = () => {
  form.custom_fields.push({ key: '', label: '' })
}

const removeCustomField = (index: number) => {
  form.custom_fields.splice(index, 1)
}

const updateFieldKey = (index: number) => {
  const label = form.custom_fields[index].label
  if (label) {
    form.custom_fields[index].key = generateSlug(label).replace(/-/g, '_')
  }
}

// Submit form
const onSubmit = async () => {
  clearErrors()

  if (!validateForm(form)) {
    showError(t('admin.catalog.categories.toast.formError'))
    return
  }

  const updatedCategory = await catalogStore.updateCategory(categoryId.value, form)

  if (updatedCategory) {
    showSuccess(t('admin.catalog.categories.toast.updateSuccess', { name: updatedCategory.name }))
    router.push('/admin/catalog/categories')
  } else {
    showError(catalogStore.error || t('admin.catalog.categories.toast.updateError'))
  }
}

// Cancel and go back
const onCancel = () => {
  router.push('/admin/catalog/categories')
}

// Load category data
onMounted(async () => {
  await catalogStore.fetchCategory(categoryId.value)
  initialLoading.value = false

  if (!category.value) {
    showError(t('admin.catalog.categories.toast.notFound'))
    router.push('/admin/catalog/categories')
  }
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="initialLoading" class="flex items-center justify-center py-20">
      <i class="pi pi-spin pi-spinner text-4xl text-primary-500"></i>
    </div>

    <template v-else-if="category">
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
            <h1 class="page-title mb-0">{{ $t('admin.catalog.categories.editTitle') }}</h1>
          </div>
          <p class="page-subtitle ml-12">{{ category.name }}</p>
        </div>
        <div class="page-header-actions">
          <PrimeTag
            :value="category.is_active ? $t('admin.catalog.categories.filters.active') : $t('admin.catalog.categories.filters.inactive')"
            :severity="category.is_active ? 'success' : 'danger'"
            class="text-sm"
          />
        </div>
      </div>

      <!-- Category Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-neutral-50 rounded-lg p-4">
          <div class="text-sm text-neutral-600">{{ $t('admin.catalog.categories.stats.categoryId') }}</div>
          <div class="text-lg font-semibold text-neutral-900">#{{ category.id }}</div>
        </div>
        <div class="bg-neutral-50 rounded-lg p-4">
          <div class="text-sm text-neutral-600">{{ $t('admin.catalog.categories.stats.totalLeads') }}</div>
          <div class="text-lg font-semibold text-neutral-900">{{ formatNumber(category.leads_count || 0) }}</div>
        </div>
        <div class="bg-neutral-50 rounded-lg p-4">
          <div class="text-sm text-neutral-600">{{ $t('admin.catalog.categories.stats.availableLeads') }}</div>
          <div class="text-lg font-semibold text-success">{{ formatNumber(category.available_leads_count || 0) }}</div>
        </div>
        <div class="bg-neutral-50 rounded-lg p-4">
          <div class="text-sm text-neutral-600">{{ $t('admin.catalog.categories.stats.createdAt') }}</div>
          <div class="text-lg font-semibold text-neutral-900">{{ formatDate(category.created_at) }}</div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- Basic Information Card -->
        <div class="q-card">
          <div class="q-card-header">
            <h3 class="card-title">
              <i class="pi pi-tag mr-2 text-primary-500"></i>
              {{ $t('admin.catalog.categories.form.basicInfo') }}
            </h3>
          </div>
          <div class="q-card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Name -->
              <div class="form-group">
                <label for="name">{{ $t('admin.catalog.categories.form.name') }} *</label>
                <PrimeInputText
                  id="name"
                  v-model="form.name"
                  :class="{ 'p-invalid': errors.name }"
                  :placeholder="$t('admin.catalog.categories.form.namePlaceholder')"
                  class="w-full"
                  @blur="onBlur('name', form.name)"
                />
                <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
              </div>

              <!-- Slug -->
              <div class="form-group">
                <label for="slug">{{ $t('admin.catalog.categories.form.slug') }} *</label>
                <div class="p-inputgroup">
                  <PrimeInputText
                    id="slug"
                    v-model="form.slug"
                    :class="{ 'p-invalid': errors.slug }"
                    :placeholder="$t('admin.catalog.categories.form.slugPlaceholder')"
                    class="w-full"
                    @blur="onBlur('slug', form.slug)"
                  />
                  <PrimeButton
                    icon="pi pi-sync"
                    severity="secondary"
                    outlined
                    v-tooltip.top="$t('admin.catalog.categories.form.regenerateSlug')"
                    @click="regenerateSlug"
                  />
                </div>
                <small v-if="errors.slug" class="p-error">{{ errors.slug }}</small>
                <small v-else class="form-hint">{{ $t('admin.catalog.categories.form.slugEditHint') }}</small>
              </div>

              <!-- Description -->
              <div class="form-group md:col-span-2">
                <label for="description">{{ $t('admin.catalog.categories.form.description') }}</label>
                <PrimeTextarea
                  id="description"
                  v-model="form.description"
                  rows="3"
                  :placeholder="$t('admin.catalog.categories.form.descriptionPlaceholder')"
                  class="w-full"
                  autoResize
                />
                <small class="form-hint">{{ $t('admin.catalog.categories.form.descriptionHint') }}</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Business Rules Card -->
        <div class="q-card">
          <div class="q-card-header">
            <h3 class="card-title">
              <i class="pi pi-cog mr-2 text-primary-500"></i>
              {{ $t('admin.catalog.categories.form.businessRules') }}
            </h3>
          </div>
          <div class="q-card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Max Shares -->
              <div class="form-group">
                <label for="max_shares">{{ $t('admin.catalog.categories.form.maxShares') }} *</label>
                <PrimeInputNumber
                  id="max_shares"
                  v-model="form.max_shares"
                  :class="{ 'p-invalid': errors.max_shares }"
                  :min="1"
                  :max="10"
                  :showButtons="true"
                  class="w-full"
                  @blur="onBlur('max_shares', form.max_shares)"
                />
                <small v-if="errors.max_shares" class="p-error">{{ errors.max_shares }}</small>
                <small v-else class="form-hint">
                  {{ $t('admin.catalog.categories.form.maxSharesHintEdit') }}
                </small>
              </div>

              <!-- Sort Order -->
              <div class="form-group">
                <label for="sort_order">{{ $t('admin.catalog.categories.form.sortOrder') }}</label>
                <PrimeInputNumber
                  id="sort_order"
                  v-model="form.sort_order"
                  :class="{ 'p-invalid': errors.sort_order }"
                  :min="0"
                  :showButtons="true"
                  class="w-full"
                  @blur="onBlur('sort_order', form.sort_order)"
                />
                <small v-if="errors.sort_order" class="p-error">{{ errors.sort_order }}</small>
                <small v-else class="form-hint">{{ $t('admin.catalog.categories.form.sortOrderHintEdit') }}</small>
              </div>

              <!-- Is Active Toggle -->
              <div class="form-group md:col-span-2">
                <div class="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg">
                  <PrimeToggleSwitch
                    id="is_active"
                    v-model="form.is_active"
                  />
                  <div>
                    <label for="is_active" class="cursor-pointer font-medium text-neutral-800 mb-0">
                      {{ $t('admin.catalog.categories.form.isActive') }}
                    </label>
                    <p class="text-sm text-neutral-600 mt-1">
                      {{ $t('admin.catalog.categories.form.isActiveHint') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Custom Fields Card -->
        <div class="q-card">
          <div class="q-card-header">
            <h3 class="card-title">
              <i class="pi pi-list mr-2 text-primary-500"></i>
              {{ $t('admin.catalog.categories.form.customFieldsTitle') }}
            </h3>
          </div>
          <div class="q-card-body">
            <p class="text-sm text-neutral-600 mb-4">
              {{ $t('admin.catalog.categories.form.customFieldsHint') }}
            </p>

            <!-- Field list -->
            <div
              v-for="(field, index) in form.custom_fields"
              :key="index"
              class="flex items-end gap-4 mb-4"
            >
              <div class="form-group flex-1">
                <label>{{ $t('admin.catalog.categories.form.fieldLabel') }}</label>
                <PrimeInputText
                  v-model="field.label"
                  :placeholder="$t('admin.catalog.categories.form.fieldLabelPlaceholder')"
                  class="w-full"
                  @blur="updateFieldKey(index)"
                />
              </div>
              <div class="form-group flex-1">
                <label>{{ $t('admin.catalog.categories.form.fieldKey') }}</label>
                <PrimeInputText
                  v-model="field.key"
                  class="w-full"
                  disabled
                />
                <small class="form-hint">{{ $t('admin.catalog.categories.form.fieldKeyHint') }}</small>
              </div>
              <PrimeButton
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                @click="removeCustomField(index)"
              />
            </div>

            <!-- Empty state -->
            <div
              v-if="form.custom_fields.length === 0"
              class="text-center py-6 bg-neutral-50 rounded-lg mb-4"
            >
              <i class="pi pi-inbox text-2xl text-neutral-400 mb-2 block"></i>
              <p class="text-sm text-neutral-500">
                {{ $t('admin.catalog.categories.form.noCustomFields') }}
              </p>
            </div>

            <!-- Add button -->
            <PrimeButton
              :label="$t('admin.catalog.categories.form.addCustomField')"
              icon="pi pi-plus"
              severity="secondary"
              outlined
              @click="addCustomField"
            />
          </div>
        </div>

        <!-- Warning if has leads and deactivating -->
        <div
          v-if="category.leads_count && category.leads_count > 0 && !form.is_active && category.is_active"
          class="bg-warning-light border border-warning/20 rounded-lg p-4"
        >
          <div class="flex items-start gap-3">
            <i class="pi pi-exclamation-triangle text-warning-dark text-xl mt-0.5"></i>
            <div>
              <h4 class="font-medium text-warning-dark mb-1">{{ $t('admin.catalog.categories.warning.title') }}</h4>
              <p class="text-sm text-warning-dark/80">
                {{ $t('admin.catalog.categories.warning.deactivateWithLeads', { count: category.leads_count }) }}
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
            :label="$t('admin.common.save')"
            icon="pi pi-check"
            severity="primary"
            :loading="catalogStore.saving"
            :disabled="hasErrors"
          />
        </div>
      </form>
    </template>
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
