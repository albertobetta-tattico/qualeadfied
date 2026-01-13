<script setup lang="ts">
/**
 * Admin Leads - Edit Lead
 * Form per la modifica di un lead esistente
 */
import { useLeadValidation, useLeadFormatters, useLeadActions } from '~/composables/useLead'
import type { LeadUpdateForm } from '~/types/lead'

definePageMeta({
  layout: 'admin'
})

// Route & Store
const route = useRoute()
const router = useRouter()
const leadStore = useLeadStore()
const { errors, hasErrors, validateField, validateForm, clearErrors } = useLeadValidation()
const { 
  formatStatus, 
  getStatusSeverity, 
  getStatusIcon,
  formatSharesDisplay,
  formatDate, 
  formatDateTime,
  getFullName,
  canEdit,
  canDelete
} = useLeadFormatters()
const { confirmDelete, showSuccess, showError } = useLeadActions()

// Get lead ID from route
const leadId = computed(() => {
  const params = route.params as { id: string }
  return Number(params.id)
})

// Loading state
const initialLoading = ref(true)

// Form State (internal with Date for DatePicker)
const formGeneratedAt = ref<Date | null>(null)

const form = reactive<Omit<LeadUpdateForm, 'generated_at'>>({
  category_id: 0,
  province_id: 0,
  source_id: 0,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  request_text: '',
  extra_tags: {},
  external_id: ''
})

// Current lead
const lead = computed(() => leadStore.currentLead)

// Active tab
const activeTab = ref(0)

// Computed options
const categoryOptions = computed(() => 
  leadStore.activeCategories.map(c => ({ 
    label: c.name, 
    value: c.id,
    description: c.description,
    max_shares: c.max_shares
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

// Get category for current lead
const currentCategory = computed(() => 
  leadStore.getCategoryById(lead.value?.category_id || 0)
)

// Check if lead can be edited
const isEditable = computed(() => lead.value && canEdit(lead.value))
const isDeletable = computed(() => lead.value && canDelete(lead.value))

// Helper to convert date string to Date object
const parseDate = (dateStr: string | null): Date | null => {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d
}

// Helper to format Date to string for API
const formatDateForApi = (date: Date | null): string => {
  if (!date) return ''
  return date.toISOString().split('T')[0]
}

// Load lead data
const loadLead = async () => {
  initialLoading.value = true
  
  await Promise.all([
    leadStore.fetchSupportData(),
    leadStore.fetchLead(leadId.value)
  ])
  
  if (lead.value) {
    // Populate form with lead data
    form.category_id = lead.value.category_id
    form.province_id = lead.value.province_id
    form.source_id = lead.value.source_id
    form.first_name = lead.value.first_name
    form.last_name = lead.value.last_name
    form.email = lead.value.email
    form.phone = lead.value.phone
    form.request_text = lead.value.request_text || ''
    form.extra_tags = lead.value.extra_tags || {}
    form.external_id = lead.value.external_id || ''
    formGeneratedAt.value = parseDate(lead.value.generated_at)
  }
  
  initialLoading.value = false
}

// Validation on blur
const onBlur = (field: string, value: any) => {
  validateField(field, value)
}

// Validate generated_at
const onBlurGeneratedAt = () => {
  const dateStr = formatDateForApi(formGeneratedAt.value)
  validateField('generated_at', dateStr)
}

// Submit form
const onSubmit = async () => {
  if (!isEditable.value) {
    showError('Questo lead non può essere modificato')
    return
  }

  clearErrors()
  
  const formData: LeadUpdateForm = {
    ...form,
    generated_at: formatDateForApi(formGeneratedAt.value)
  }
  
  if (!validateForm(formData)) {
    showError('Correggi gli errori nel form prima di procedere')
    return
  }

  const updatedLead = await leadStore.updateLead(leadId.value, formData)
  
  if (updatedLead) {
    showSuccess(`Lead di "${getFullName(updatedLead)}" aggiornato con successo`)
  } else {
    showError(leadStore.error || 'Errore nell\'aggiornamento del lead')
  }
}

// Delete lead
const handleDelete = () => {
  if (!lead.value || !isDeletable.value) {
    showError('Questo lead non può essere eliminato')
    return
  }

  confirmDelete(lead.value, async () => {
    const success = await leadStore.deleteLead(leadId.value)
    if (success) {
      showSuccess('Lead eliminato con successo')
      router.push('/admin/leads')
    } else {
      showError(leadStore.error || 'Errore nell\'eliminazione del lead')
    }
  })
}

// Cancel and go back
const onCancel = () => {
  router.push('/admin/leads')
}

// Reload form data
const onReload = () => {
  loadLead()
}

// Status badge styling
const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    free: 'bg-success-light text-success-dark',
    sold_exclusive: 'bg-info-light text-info-dark',
    sold_shared: 'bg-warning-light text-warning-dark',
    exhausted: 'bg-danger-light text-danger-dark'
  }
  return classes[status] || 'bg-neutral-100 text-neutral-600'
}

// Lifecycle
onMounted(() => {
  loadLead()
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="initialLoading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <i class="pi pi-spin pi-spinner text-4xl text-primary-500 mb-4"></i>
        <p class="text-neutral-600">Caricamento lead...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!lead" class="text-center py-20">
      <div class="w-20 h-20 rounded-full bg-danger-light flex items-center justify-center mx-auto mb-4">
        <i class="pi pi-exclamation-triangle text-4xl text-danger"></i>
      </div>
      <h2 class="text-xl font-semibold text-neutral-900 mb-2">Lead non trovato</h2>
      <p class="text-neutral-600 mb-6">Il lead richiesto non esiste o è stato eliminato.</p>
      <PrimeButton
        label="Torna all'elenco"
        icon="pi pi-arrow-left"
        severity="primary"
        @click="onCancel"
      />
    </div>

    <!-- Main Content -->
    <template v-else>
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
            <div class="flex items-center gap-3">
              <div 
                class="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg"
              >
                {{ lead.first_name.charAt(0) }}{{ lead.last_name.charAt(0) }}
              </div>
              <div>
                <h1 class="page-title mb-0">{{ getFullName(lead) }}</h1>
                <div class="flex items-center gap-2 mt-1">
                  <span 
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="getStatusClass(lead.status)"
                  >
                    <i class="pi mr-1" :class="getStatusIcon(lead.status)"></i>
                    {{ formatStatus(lead.status) }}
                    <span v-if="lead.status === 'sold_shared'" class="ml-1">
                      ({{ formatSharesDisplay(lead, currentCategory) }})
                    </span>
                  </span>
                  <span class="text-sm text-neutral-500">
                    Lead del {{ formatDate(lead.generated_at) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="page-header-actions">
          <PrimeButton
            v-if="isDeletable"
            label="Elimina"
            icon="pi pi-trash"
            severity="danger"
            outlined
            @click="handleDelete"
          />
        </div>
      </div>

      <!-- Warning Banner for Non-Editable Lead -->
      <div v-if="!isEditable" class="mb-6">
        <PrimeMessage severity="warn" :closable="false">
          <template #icon>
            <i class="pi pi-exclamation-triangle"></i>
          </template>
          Questo lead è già stato venduto e non può essere modificato.
        </PrimeMessage>
      </div>

      <!-- Info Cards Row -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <!-- Category Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">Categoria</span>
            <i class="pi pi-tag text-lg text-primary-500"></i>
          </div>
          <div class="font-semibold text-neutral-900">
            {{ lead.category?.name || '-' }}
          </div>
          <div class="text-xs text-neutral-500 mt-1">
            Max condivisioni: {{ currentCategory?.max_shares || '-' }}
          </div>
        </div>

        <!-- Province Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">Provincia</span>
            <i class="pi pi-map-marker text-lg text-primary-500"></i>
          </div>
          <div class="font-semibold text-neutral-900">
            {{ lead.province?.name || '-' }}
            <span v-if="lead.province?.code" class="text-neutral-500 font-normal">
              ({{ lead.province.code }})
            </span>
          </div>
          <div class="text-xs text-neutral-500 mt-1">
            {{ lead.province?.region || '-' }}
          </div>
        </div>

        <!-- Source Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">Fonte</span>
            <i class="pi pi-link text-lg text-primary-500"></i>
          </div>
          <div class="font-semibold text-neutral-900">
            {{ lead.source?.name || '-' }}
          </div>
          <div v-if="lead.external_id" class="text-xs text-neutral-500 mt-1">
            ID: {{ lead.external_id }}
          </div>
        </div>

        <!-- Created Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">Inserito il</span>
            <i class="pi pi-calendar text-lg text-primary-500"></i>
          </div>
          <div class="font-semibold text-neutral-900">
            {{ formatDate(lead.created_at) }}
          </div>
          <div class="text-xs text-neutral-500 mt-1">
            Aggiornato: {{ formatDateTime(lead.updated_at) }}
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <PrimeTabView v-model:activeIndex="activeTab" class="q-card">
        <!-- Tab: Dati Contatto -->
        <PrimeTabPanel value="0" header="Dati Contatto">
          <form @submit.prevent="onSubmit" class="space-y-6 pt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- First Name -->
              <div class="form-group">
                <label for="first_name">Nome *</label>
                <PrimeInputText
                  id="first_name"
                  v-model="form.first_name"
                  :class="{ 'p-invalid': errors.first_name }"
                  class="w-full"
                  :disabled="!isEditable"
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
                  class="w-full"
                  :disabled="!isEditable"
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
                  class="w-full"
                  :disabled="!isEditable"
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
                  class="w-full"
                  :disabled="!isEditable"
                  @blur="onBlur('phone', form.phone)"
                />
                <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
              </div>
            </div>

            <!-- Action Buttons -->
            <div v-if="isEditable" class="flex justify-end gap-4 pt-4 border-t border-neutral-200">
              <PrimeButton
                type="button"
                label="Annulla modifiche"
                severity="secondary"
                outlined
                @click="onReload"
              />
              <PrimeButton
                type="submit"
                label="Salva Modifiche"
                icon="pi pi-check"
                severity="primary"
                :loading="leadStore.saving"
                :disabled="hasErrors"
              />
            </div>
          </form>
        </PrimeTabPanel>

        <!-- Tab: Classificazione -->
        <PrimeTabPanel value="1" header="Classificazione">
          <form @submit.prevent="onSubmit" class="space-y-6 pt-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Category -->
              <div class="form-group">
                <label for="category_id">Categoria *</label>
                <PrimeSelect
                  id="category_id"
                  v-model="form.category_id"
                  :options="categoryOptions"
                  optionLabel="label"
                  optionValue="value"
                  :class="{ 'p-invalid': errors.category_id }"
                  class="w-full"
                  :disabled="!isEditable"
                  @blur="onBlur('category_id', form.category_id)"
                />
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
                  :class="{ 'p-invalid': errors.province_id }"
                  class="w-full"
                  :filter="true"
                  :disabled="!isEditable"
                  @blur="onBlur('province_id', form.province_id)"
                />
                <small v-if="errors.province_id" class="p-error">{{ errors.province_id }}</small>
              </div>

              <!-- Source -->
              <div class="form-group">
                <label for="source_id">Fonte *</label>
                <PrimeSelect
                  id="source_id"
                  v-model="form.source_id"
                  :options="sourceOptions"
                  optionLabel="label"
                  optionValue="value"
                  :class="{ 'p-invalid': errors.source_id }"
                  class="w-full"
                  :disabled="!isEditable"
                  @blur="onBlur('source_id', form.source_id)"
                />
                <small v-if="errors.source_id" class="p-error">{{ errors.source_id }}</small>
              </div>
            </div>

            <!-- Action Buttons -->
            <div v-if="isEditable" class="flex justify-end gap-4 pt-4 border-t border-neutral-200">
              <PrimeButton
                type="button"
                label="Annulla modifiche"
                severity="secondary"
                outlined
                @click="onReload"
              />
              <PrimeButton
                type="submit"
                label="Salva Modifiche"
                icon="pi pi-check"
                severity="primary"
                :loading="leadStore.saving"
                :disabled="hasErrors"
              />
            </div>
          </form>
        </PrimeTabPanel>

        <!-- Tab: Dettagli Richiesta -->
        <PrimeTabPanel value="2" header="Dettagli Richiesta">
          <form @submit.prevent="onSubmit" class="space-y-6 pt-4">
            <div class="grid grid-cols-1 gap-6">
              <!-- Request Text -->
              <div class="form-group">
                <label for="request_text">Testo Richiesta</label>
                <PrimeTextarea
                  id="request_text"
                  v-model="form.request_text"
                  rows="6"
                  class="w-full"
                  :disabled="!isEditable"
                  autoResize
                />
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
                    :disabled="!isEditable"
                    @blur="onBlurGeneratedAt"
                  />
                  <small v-if="errors.generated_at" class="p-error">{{ errors.generated_at }}</small>
                </div>

                <!-- External ID -->
                <div class="form-group">
                  <label for="external_id">ID Esterno</label>
                  <PrimeInputText
                    id="external_id"
                    v-model="form.external_id"
                    class="w-full"
                    :disabled="!isEditable"
                  />
                  <small class="form-hint">Identificativo nel sistema di origine</small>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div v-if="isEditable" class="flex justify-end gap-4 pt-4 border-t border-neutral-200">
              <PrimeButton
                type="button"
                label="Annulla modifiche"
                severity="secondary"
                outlined
                @click="onReload"
              />
              <PrimeButton
                type="submit"
                label="Salva Modifiche"
                icon="pi pi-check"
                severity="primary"
                :loading="leadStore.saving"
                :disabled="hasErrors"
              />
            </div>
          </form>
        </PrimeTabPanel>

        <!-- Tab: Storico Vendite -->
        <PrimeTabPanel value="3" header="Storico Vendite">
          <div class="pt-4">
            <div v-if="lead.status === 'free'" class="text-center py-12">
              <i class="pi pi-shopping-cart text-4xl text-neutral-400 mb-4 block"></i>
              <p class="text-neutral-600 mb-2">Nessuna vendita registrata</p>
              <p class="text-sm text-neutral-500">
                Questo lead è ancora disponibile per l'acquisto
              </p>
            </div>
            <div v-else class="text-center py-12">
              <i class="pi pi-history text-4xl text-neutral-400 mb-4 block"></i>
              <p class="text-neutral-600 mb-2">Storico vendite</p>
              <p class="text-sm text-neutral-500">
                Qui verranno mostrate le vendite di questo lead
              </p>
              <!-- TODO: Implementare visualizzazione storico vendite -->
            </div>
          </div>
        </PrimeTabPanel>
      </PrimeTabView>
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
</style>
