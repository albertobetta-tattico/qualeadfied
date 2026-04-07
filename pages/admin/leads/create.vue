<script setup lang="ts">
/**
 * Admin Leads - Create New Lead
 * Form per la creazione di un nuovo lead
 */
import { useLeadValidation, useLeadActions } from '~/composables/useLead'
import type { LeadCreateForm } from '~/types/lead'

definePageMeta({
  layout: 'admin'
})

const { t } = useI18n()

// Store & Composables
const leadStore = useLeadStore()
const router = useRouter()
const { errors, hasErrors, validateField, validateForm, clearErrors } = useLeadValidation()
const { showSuccess, showError } = useLeadActions()

// Form State - Date picker needs Date object
const formGeneratedAt = ref<Date | null>(new Date())

const form = reactive<Omit<LeadCreateForm, 'generated_at'>>({
  category_id: null,
  province_id: null,
  source_id: null,
  full_name: '',
  email: '',
  phone: '',
  address: '',
  request_text: '',
  extra_tags: {},
  external_id: '',
  medium: '',
  campaign: '',
  origin: '',
  country: 'IT'
})

// Helper to format Date to string for API
const formatDateForApi = (date: Date | null): string => {
  if (!date) return ''
  return date.toISOString().split('T')[0]
}

// Computed options
const categoryOptions = computed(() => 
  leadStore.activeCategories.map(c => ({ 
    label: c.name, 
    value: c.id,
    description: c.description 
  }))
)

const provinceOptions = computed(() => 
  leadStore.activeProvinces.map(p => ({ 
    label: `${p.name} (${p.code})`, 
    value: p.id,
    region: p.region 
  }))
)

const sourceOptions = computed(() => 
  leadStore.activeSources.map(s => ({ 
    label: s.name, 
    value: s.id,
    description: s.description 
  }))
)

// Set default source to "Manual"
const setDefaultSource = () => {
  const manualSource = leadStore.sources.find(s => s.slug === 'manual')
  if (manualSource) {
    form.source_id = manualSource.id
  }
}

// Load support data
const loadData = async () => {
  await leadStore.fetchSupportData()
  setDefaultSource()
}

// Validation on blur
const onBlur = (field: string, value: any) => {
  validateField(field, value)
}

// Validation for generated_at
const onBlurGeneratedAt = () => {
  const dateStr = formatDateForApi(formGeneratedAt.value)
  validateField('generated_at', dateStr)
}

// Submit form
const onSubmit = async () => {
  clearErrors()
  
  const formData: LeadCreateForm = {
    ...form,
    generated_at: formatDateForApi(formGeneratedAt.value)
  }
  
  if (!validateForm(formData)) {
    showError(t('admin.leads.create.toast.formErrors'))
    return
  }

  const lead = await leadStore.createLead(formData)

  if (lead) {
    showSuccess(t('admin.leads.create.toast.createSuccess', { name: lead.full_name }))
    router.push('/admin/leads')
  } else {
    showError(leadStore.error || t('admin.leads.create.toast.createError'))
  }
}

// Cancel and go back
const onCancel = () => {
  router.push('/admin/leads')
}

// Create another lead
const onCreateAnother = async () => {
  clearErrors()
  
  const formData: LeadCreateForm = {
    ...form,
    generated_at: formatDateForApi(formGeneratedAt.value)
  }
  
  if (!validateForm(formData)) {
    showError(t('admin.leads.create.toast.formErrors'))
    return
  }

  const lead = await leadStore.createLead(formData)

  if (lead) {
    showSuccess(t('admin.leads.create.toast.createSuccess', { name: lead.full_name }))
    // Reset form but keep category and source
    const savedCategoryId = form.category_id
    const savedSourceId = form.source_id
    const savedProvinceId = form.province_id
    
    form.full_name = ''
    form.email = ''
    form.phone = ''
    form.address = ''
    form.request_text = ''
    form.external_id = ''
    form.medium = ''
    form.campaign = ''
    formGeneratedAt.value = new Date()
    
    // Keep the context
    form.category_id = savedCategoryId
    form.source_id = savedSourceId
    form.province_id = savedProvinceId
  } else {
    showError(leadStore.error || t('admin.leads.create.toast.createError'))
  }
}

// Custom fields for selected category
const categoryCustomFields = computed(() => {
  if (!form.category_id) return []
  const cat = leadStore.activeCategories.find((c: any) => c.id === form.category_id)
  return cat?.custom_fields || []
})

// Initialize extra_tags when category changes
watch(() => form.category_id, (newCategoryId) => {
  if (!newCategoryId) {
    form.extra_tags = {}
    return
  }
  const cat = leadStore.activeCategories.find((c: any) => c.id === newCategoryId)
  if (cat?.custom_fields) {
    const newTags: Record<string, string> = {}
    for (const field of cat.custom_fields) {
      newTags[field.key] = form.extra_tags?.[field.key] || ''
    }
    form.extra_tags = newTags
  } else {
    form.extra_tags = {}
  }
})

// Lifecycle
onMounted(() => {
  loadData()
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
          <h1 class="page-title mb-0">{{ $t('admin.leads.create.createTitle') }}</h1>
        </div>
        <p class="page-subtitle ml-12">{{ $t('admin.leads.create.createSubtitle') }}</p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Context Card (Category, Province, Source) -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-tag mr-2 text-primary-500"></i>
            {{ $t('admin.leads.create.sections.classification') }}
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Category -->
            <div class="form-group">
              <label for="category_id">{{ $t('admin.leads.create.form.category') }} *</label>
              <PrimeSelect
                id="category_id"
                v-model="form.category_id"
                :options="categoryOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('admin.leads.create.form.categoryPlaceholder')"
                :class="{ 'p-invalid': errors.category_id }"
                class="w-full"
                @blur="onBlur('category_id', form.category_id)"
              >
                <template #option="slotProps">
                  <div>
                    <div class="font-medium">{{ slotProps.option.label }}</div>
                    <div v-if="slotProps.option.description" class="text-xs text-neutral-500">
                      {{ slotProps.option.description }}
                    </div>
                  </div>
                </template>
              </PrimeSelect>
              <small v-if="errors.category_id" class="p-error">{{ errors.category_id }}</small>
            </div>

            <!-- Province (facoltativa) -->
            <div class="form-group">
              <label for="province_id">{{ $t('admin.leads.create.form.province') }}</label>
              <PrimeSelect
                id="province_id"
                v-model="form.province_id"
                :options="provinceOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('admin.leads.create.form.provincePlaceholder')"
                class="w-full"
                :filter="true"
                :filterPlaceholder="$t('admin.leads.create.form.provinceFilter')"
                showClear
              >
                <template #option="slotProps">
                  <div class="flex justify-between items-center w-full">
                    <span>{{ slotProps.option.label }}</span>
                    <span class="text-xs text-neutral-500">{{ slotProps.option.region }}</span>
                  </div>
                </template>
              </PrimeSelect>
            </div>

            <!-- Source -->
            <div class="form-group">
              <label for="source_id">{{ $t('admin.leads.create.form.source') }} *</label>
              <PrimeSelect
                id="source_id"
                v-model="form.source_id"
                :options="sourceOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('admin.leads.create.form.sourcePlaceholder')"
                :class="{ 'p-invalid': errors.source_id }"
                class="w-full"
                @blur="onBlur('source_id', form.source_id)"
              />
              <small v-if="errors.source_id" class="p-error">{{ errors.source_id }}</small>
            </div>

            <!-- Origin / Sorgente (facoltativa) -->
            <div class="form-group">
              <label for="origin">{{ $t('admin.leads.create.form.origin') }}</label>
              <PrimeInputText
                id="origin"
                v-model="form.origin"
                class="w-full"
                :placeholder="$t('admin.leads.create.form.originPlaceholder')"
                maxlength="50"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-user mr-2 text-primary-500"></i>
            {{ $t('admin.leads.create.sections.contactData') }}
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Full Name -->
            <div class="form-group md:col-span-2">
              <label for="full_name">{{ $t('admin.leads.create.form.fullName') }} *</label>
              <PrimeInputText
                id="full_name"
                v-model="form.full_name"
                :class="{ 'p-invalid': errors.full_name }"
                placeholder="Mario Rossi"
                class="w-full"
                @blur="onBlur('full_name', form.full_name)"
              />
              <small v-if="errors.full_name" class="p-error">{{ errors.full_name }}</small>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email">{{ $t('admin.leads.create.form.email') }} *</label>
              <PrimeInputText
                id="email"
                v-model="form.email"
                type="email"
                :class="{ 'p-invalid': errors.email }"
                placeholder="mario.rossi@email.it"
                class="w-full"
                @blur="onBlur('email', form.email)"
              />
              <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
            </div>

            <!-- Phone -->
            <div class="form-group">
              <label for="phone">{{ $t('admin.leads.create.form.phone') }} *</label>
              <PrimeInputText
                id="phone"
                v-model="form.phone"
                :class="{ 'p-invalid': errors.phone }"
                placeholder="333 1234567"
                class="w-full"
                @blur="onBlur('phone', form.phone)"
              />
              <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
            </div>

            <!-- Address -->
            <div class="form-group md:col-span-2">
              <label for="address">{{ $t('admin.leads.create.form.address') }}</label>
              <PrimeInputText
                id="address"
                v-model="form.address"
                placeholder="Via Roma 1, Milano"
                class="w-full"
              />
              <small class="form-hint">{{ $t('admin.leads.create.form.addressHint') }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Request Details Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-file-edit mr-2 text-primary-500"></i>
            {{ $t('admin.leads.create.sections.requestDetails') }}
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 gap-6">
            <!-- Request Text -->
            <div class="form-group">
              <label for="request_text">{{ $t('admin.leads.create.form.requestText') }} *</label>
              <PrimeTextarea
                id="request_text"
                v-model="form.request_text"
                rows="4"
                :placeholder="$t('admin.leads.create.form.requestTextPlaceholder')"
                :class="{ 'p-invalid': errors.request_text }"
                class="w-full"
                autoResize
                @blur="onBlur('request_text', form.request_text)"
              />
              <small v-if="errors.request_text" class="p-error">{{ errors.request_text }}</small>
              <small v-else class="form-hint">{{ $t('admin.leads.create.form.requestTextHint') }}</small>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Generated At -->
              <div class="form-group">
                <label for="generated_at">{{ $t('admin.leads.create.form.generatedAt') }} *</label>
                <PrimeDatePicker
                  id="generated_at"
                  v-model="formGeneratedAt"
                  dateFormat="dd/mm/yy"
                  :class="{ 'p-invalid': errors.generated_at }"
                  class="w-full"
                  showIcon
                  :maxDate="new Date()"
                  @blur="onBlurGeneratedAt"
                />
                <small v-if="errors.generated_at" class="p-error">{{ errors.generated_at }}</small>
                <small v-else class="form-hint">{{ $t('admin.leads.create.form.generatedAtHint') }}</small>
              </div>

              <!-- External ID -->
              <div class="form-group">
                <label for="external_id">{{ $t('admin.leads.create.form.externalId') }}</label>
                <PrimeInputText
                  id="external_id"
                  v-model="form.external_id"
                  :placeholder="$t('admin.leads.create.form.externalIdPlaceholder')"
                  class="w-full"
                />
                <small class="form-hint">{{ $t('admin.leads.create.form.externalIdHint') }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tracking & Acquisition Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-chart-line mr-2 text-primary-500"></i>
            {{ $t('admin.leads.create.sections.tracking') }}
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Country -->
            <div class="form-group">
              <label for="country">{{ $t('admin.leads.create.form.country') }} *</label>
              <PrimeInputText
                id="country"
                v-model="form.country"
                placeholder="IT"
                class="w-full"
                maxlength="2"
              />
              <small class="form-hint">{{ $t('admin.leads.create.form.countryHint') }}</small>
            </div>

            <!-- Medium -->
            <div class="form-group">
              <label for="medium">{{ $t('admin.leads.create.form.medium') }}</label>
              <PrimeInputText
                id="medium"
                v-model="form.medium"
                :placeholder="$t('admin.leads.create.form.mediumPlaceholder')"
                class="w-full"
              />
              <small class="form-hint">{{ $t('admin.leads.create.form.mediumHint') }}</small>
            </div>

            <!-- Campaign -->
            <div class="form-group">
              <label for="campaign">{{ $t('admin.leads.create.form.campaign') }}</label>
              <PrimeInputText
                id="campaign"
                v-model="form.campaign"
                :placeholder="$t('admin.leads.create.form.campaignPlaceholder')"
                class="w-full"
              />
              <small class="form-hint">{{ $t('admin.leads.create.form.campaignHint') }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Custom Fields Card -->
      <div v-if="categoryCustomFields.length > 0" class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-list mr-2 text-primary-500"></i>
            {{ $t('admin.leads.create.sections.customFields') }}
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="field in categoryCustomFields" :key="field.key" class="form-group">
              <label :for="'cf_' + field.key">{{ field.label }}</label>
              <PrimeInputText
                :id="'cf_' + field.key"
                v-model="(form.extra_tags as Record<string, any>)[field.key]"
                class="w-full"
              />
            </div>
          </div>
          <small class="form-hint mt-2">
            {{ $t('admin.leads.create.form.customFieldsHint') }}
          </small>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between pt-4 border-t border-neutral-200">
        <PrimeButton
          type="button"
          :label="$t('admin.leads.create.buttons.cancel')"
          severity="secondary"
          outlined
          @click="onCancel"
        />
        <div class="flex gap-3">
          <PrimeButton
            type="button"
            :label="$t('admin.leads.create.buttons.saveAndCreateAnother')"
            icon="pi pi-plus"
            severity="secondary"
            :loading="leadStore.saving"
            :disabled="hasErrors"
            @click="onCreateAnother"
          />
          <PrimeButton
            type="submit"
            :label="$t('admin.leads.create.buttons.create')"
            icon="pi pi-check"
            severity="primary"
            :loading="leadStore.saving"
            :disabled="hasErrors"
          />
        </div>
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

:deep(.p-datepicker) {
  width: 100%;
}

:deep(.p-textarea) {
  resize: none;
}
</style>
