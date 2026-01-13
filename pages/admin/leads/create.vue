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
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  request_text: '',
  extra_tags: {},
  external_id: ''
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
    showError('Correggi gli errori nel form prima di procedere')
    return
  }

  const lead = await leadStore.createLead(formData)
  
  if (lead) {
    showSuccess(`Lead di "${lead.first_name} ${lead.last_name}" creato con successo`)
    router.push('/admin/leads')
  } else {
    showError(leadStore.error || 'Errore nella creazione del lead')
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
    showError('Correggi gli errori nel form prima di procedere')
    return
  }

  const lead = await leadStore.createLead(formData)
  
  if (lead) {
    showSuccess(`Lead di "${lead.first_name} ${lead.last_name}" creato con successo`)
    // Reset form but keep category and source
    const savedCategoryId = form.category_id
    const savedSourceId = form.source_id
    const savedProvinceId = form.province_id
    
    form.first_name = ''
    form.last_name = ''
    form.email = ''
    form.phone = ''
    form.request_text = ''
    form.external_id = ''
    formGeneratedAt.value = new Date()
    
    // Keep the context
    form.category_id = savedCategoryId
    form.source_id = savedSourceId
    form.province_id = savedProvinceId
  } else {
    showError(leadStore.error || 'Errore nella creazione del lead')
  }
}

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
          <h1 class="page-title mb-0">Nuovo Lead</h1>
        </div>
        <p class="page-subtitle ml-12">Inserisci i dati per creare un nuovo lead</p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Context Card (Category, Province, Source) -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-tag mr-2 text-primary-500"></i>
            Classificazione
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Category -->
            <div class="form-group">
              <label for="category_id">Categoria Merceologica *</label>
              <PrimeSelect
                id="category_id"
                v-model="form.category_id"
                :options="categoryOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleziona categoria"
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

            <!-- Province -->
            <div class="form-group">
              <label for="province_id">Provincia *</label>
              <PrimeSelect
                id="province_id"
                v-model="form.province_id"
                :options="provinceOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleziona provincia"
                :class="{ 'p-invalid': errors.province_id }"
                class="w-full"
                :filter="true"
                filterPlaceholder="Cerca provincia..."
                @blur="onBlur('province_id', form.province_id)"
              >
                <template #option="slotProps">
                  <div class="flex justify-between items-center w-full">
                    <span>{{ slotProps.option.label }}</span>
                    <span class="text-xs text-neutral-500">{{ slotProps.option.region }}</span>
                  </div>
                </template>
              </PrimeSelect>
              <small v-if="errors.province_id" class="p-error">{{ errors.province_id }}</small>
            </div>

            <!-- Source -->
            <div class="form-group">
              <label for="source_id">Fonte Lead *</label>
              <PrimeSelect
                id="source_id"
                v-model="form.source_id"
                :options="sourceOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleziona fonte"
                :class="{ 'p-invalid': errors.source_id }"
                class="w-full"
                @blur="onBlur('source_id', form.source_id)"
              />
              <small v-if="errors.source_id" class="p-error">{{ errors.source_id }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-user mr-2 text-primary-500"></i>
            Dati Contatto
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- First Name -->
            <div class="form-group">
              <label for="first_name">Nome *</label>
              <PrimeInputText
                id="first_name"
                v-model="form.first_name"
                :class="{ 'p-invalid': errors.first_name }"
                placeholder="Mario"
                class="w-full"
                @blur="onBlur('first_name', form.first_name)"
              />
              <small v-if="errors.first_name" class="p-error">{{ errors.first_name }}</small>
            </div>

            <!-- Last Name -->
            <div class="form-group">
              <label for="last_name">Cognome *</label>
              <PrimeInputText
                id="last_name"
                v-model="form.last_name"
                :class="{ 'p-invalid': errors.last_name }"
                placeholder="Rossi"
                class="w-full"
                @blur="onBlur('last_name', form.last_name)"
              />
              <small v-if="errors.last_name" class="p-error">{{ errors.last_name }}</small>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email">Email *</label>
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
              <label for="phone">Telefono *</label>
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
          </div>
        </div>
      </div>

      <!-- Request Details Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-file-edit mr-2 text-primary-500"></i>
            Dettagli Richiesta
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 gap-6">
            <!-- Request Text -->
            <div class="form-group">
              <label for="request_text">Testo Richiesta</label>
              <PrimeTextarea
                id="request_text"
                v-model="form.request_text"
                rows="4"
                placeholder="Descrivi la richiesta del contatto..."
                class="w-full"
                autoResize
              />
              <small class="form-hint">Il testo della richiesta aiuta a qualificare il lead</small>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Generated At -->
              <div class="form-group">
                <label for="generated_at">Data Generazione *</label>
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
                <small v-else class="form-hint">Data in cui il lead è stato generato</small>
              </div>

              <!-- External ID -->
              <div class="form-group">
                <label for="external_id">ID Esterno</label>
                <PrimeInputText
                  id="external_id"
                  v-model="form.external_id"
                  placeholder="Riferimento dal sistema esterno"
                  class="w-full"
                />
                <small class="form-hint">Identificativo nel sistema di origine (opzionale)</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between pt-4 border-t border-neutral-200">
        <PrimeButton
          type="button"
          label="Annulla"
          severity="secondary"
          outlined
          @click="onCancel"
        />
        <div class="flex gap-3">
          <PrimeButton
            type="button"
            label="Salva e Crea Altro"
            icon="pi pi-plus"
            severity="secondary"
            :loading="leadStore.saving"
            :disabled="hasErrors"
            @click="onCreateAnother"
          />
          <PrimeButton
            type="submit"
            label="Crea Lead"
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
