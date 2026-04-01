<script setup lang="ts">
/**
 * Admin Leads - Import Lead
 * Upload e mapping CSV/XLSX per import massivo lead
 */
import { useLeadActions } from '~/composables/useLead'
import type { LeadImportConfig, LeadFieldMapping, LeadImportResult } from '~/types/lead'

definePageMeta({
  layout: 'admin'
})

const { t } = useI18n()

// Store & Composables
const leadStore = useLeadStore()
const router = useRouter()
const { showSuccess, showError, showWarning, showInfo } = useLeadActions()

// State
const currentStep = ref(1)
const file = ref<File | null>(null)
const previewData = ref<string[][]>([])
const fileHeaders = ref<string[]>([])
const importResult = ref<LeadImportResult | null>(null)

// Config
const config = reactive<LeadImportConfig>({
  file: null,
  category_id: null,
  source_id: null,
  mapping: {
    full_name: null,
    email: null,
    phone: null,
    address: null,
    province_code: null,
    request_text: null,
    external_id: null,
    generated_at: null
  },
  skip_header: true,
  duplicate_strategy: 'skip'
})

// Options
const categoryOptions = computed(() =>
  leadStore.activeCategories.map(c => ({
    label: c.name,
    value: c.id
  }))
)

const sourceOptions = computed(() =>
  leadStore.activeSources.map(s => ({
    label: s.name,
    value: s.id
  }))
)

const duplicateOptions = computed(() => [
  { label: t('admin.leads.import.step2.duplicateOptions.skip'), value: 'skip' },
  { label: t('admin.leads.import.step2.duplicateOptions.update'), value: 'update' },
  { label: t('admin.leads.import.step2.duplicateOptions.createAnyway'), value: 'create' }
])

// Field mapping labels
const mappingFields = computed(() => [
  { key: 'full_name', label: t('admin.leads.import.step3.fields.fullName'), required: true },
  { key: 'email', label: t('admin.leads.import.step3.fields.email'), required: true },
  { key: 'phone', label: t('admin.leads.import.step3.fields.phone'), required: true },
  { key: 'address', label: t('admin.leads.import.step3.fields.address'), required: false },
  { key: 'province_code', label: t('admin.leads.import.step3.fields.provinceCode'), required: false },
  { key: 'request_text', label: t('admin.leads.import.step3.fields.requestText'), required: false },
  { key: 'external_id', label: t('admin.leads.import.step3.fields.externalId'), required: false },
  { key: 'generated_at', label: t('admin.leads.import.step3.fields.generatedAt'), required: false }
])

// Computed for column options
const columnOptions = computed(() => {
  if (fileHeaders.value.length === 0) return []
  return [
    { label: t('admin.leads.import.step3.noMap'), value: null },
    ...fileHeaders.value.map((header, index) => ({
      label: `${index + 1}. ${header}`,
      value: index
    }))
  ]
})

// Check if mapping is valid
const isMappingValid = computed(() => {
  const requiredFields: (keyof LeadFieldMapping)[] = ['full_name', 'email', 'phone']
  return requiredFields.every(field => config.mapping[field] !== null)
})

// Load support data
const loadData = async () => {
  await leadStore.fetchSupportData()
}

// File upload handler
const onFileSelect = async (event: any) => {
  const uploadedFile = event.files?.[0]
  if (!uploadedFile) return

  file.value = uploadedFile
  config.file = uploadedFile

  // Read file for preview
  await readFilePreview(uploadedFile)
}

// Read file and extract preview data
const readFilePreview = async (uploadedFile: File) => {
  const extension = uploadedFile.name.split('.').pop()?.toLowerCase()

  if (extension === 'csv') {
    await readCSV(uploadedFile)
  } else if (extension === 'xlsx' || extension === 'xls') {
    showInfo(t('admin.leads.import.toast.readingExcel'))
    // Per semplicità, in fase di sviluppo gestiamo solo CSV
    // TODO: Implementare lettura XLSX con libreria apposita
    showWarning(t('admin.leads.import.toast.onlyCsv'))
    file.value = null
    config.file = null
  } else {
    showError(t('admin.leads.import.toast.unsupportedFormat'))
    file.value = null
    config.file = null
  }
}

// Read CSV file
const readCSV = (uploadedFile: File): Promise<void> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      const rows = lines.map(line => parseCSVLine(line))

      if (rows.length > 0) {
        fileHeaders.value = rows[0]
        previewData.value = rows.slice(0, 6) // Preview first 5 rows + header
        
        // Auto-map columns based on header names
        autoMapColumns()
      }
      resolve()
    }
    reader.readAsText(uploadedFile)
  })
}

// Parse CSV line (handles quoted values)
const parseCSVLine = (line: string): string[] => {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if ((char === ',' || char === ';') && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  
  return result
}

// Auto-map columns based on header names
const autoMapColumns = () => {
  const headerMap: Record<string, keyof LeadFieldMapping> = {
    'nome': 'full_name',
    'full_name': 'full_name',
    'fullname': 'full_name',
    'nome completo': 'full_name',
    'nome e cognome': 'full_name',
    'nominativo': 'full_name',
    'name': 'full_name',
    'email': 'email',
    'e-mail': 'email',
    'mail': 'email',
    'telefono': 'phone',
    'phone': 'phone',
    'tel': 'phone',
    'cellulare': 'phone',
    'mobile': 'phone',
    'indirizzo': 'address',
    'address': 'address',
    'via': 'address',
    'provincia': 'province_code',
    'province': 'province_code',
    'prov': 'province_code',
    'richiesta': 'request_text',
    'request': 'request_text',
    'messaggio': 'request_text',
    'message': 'request_text',
    'note': 'request_text',
    'id': 'external_id',
    'external_id': 'external_id',
    'data': 'generated_at',
    'date': 'generated_at',
    'created': 'generated_at'
  }

  fileHeaders.value.forEach((header, index) => {
    const normalizedHeader = header.toLowerCase().trim()
    const fieldKey = headerMap[normalizedHeader]
    if (fieldKey && config.mapping[fieldKey] === null) {
      config.mapping[fieldKey] = index
    }
  })
}

// Clear file
const clearFile = () => {
  file.value = null
  config.file = null
  previewData.value = []
  fileHeaders.value = []
  config.mapping = {
    full_name: null,
    email: null,
    phone: null,
    address: null,
    province_code: null,
    request_text: null,
    external_id: null,
    generated_at: null
  }
}

// Next step
const nextStep = () => {
  if (currentStep.value === 1 && !file.value) {
    showError(t('admin.leads.import.toast.selectFile'))
    return
  }
  if (currentStep.value === 2 && !config.category_id) {
    showError(t('admin.leads.import.toast.selectCategory'))
    return
  }
  if (currentStep.value === 3 && !isMappingValid.value) {
    showError(t('admin.leads.import.toast.mapRequired'))
    return
  }
  currentStep.value++
}

// Previous step
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Execute import
const executeImport = async () => {
  if (!config.file || !config.category_id) {
    showError(t('admin.leads.import.toast.invalidConfig'))
    return
  }

  const result = await leadStore.importLeads(config)
  
  if (result) {
    importResult.value = result
    currentStep.value = 5 // Go to results
    
    if (result.imported > 0) {
      showSuccess(t('admin.leads.import.step5.successMessage', { count: result.imported }))
    }
    if (result.errors.length > 0) {
      showWarning(t('admin.leads.import.toast.rowsWithErrors', { count: result.errors.length }))
    }
  } else {
    showError(leadStore.error || t('admin.leads.import.toast.importError'))
  }
}

// Go back to list
const goToList = () => {
  router.push('/admin/leads')
}

// Start new import
const startNewImport = () => {
  currentStep.value = 1
  clearFile()
  importResult.value = null
  config.category_id = null
  config.source_id = null
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
            @click="goToList"
          />
          <h1 class="page-title mb-0">{{ $t('admin.leads.import.importTitle') }}</h1>
        </div>
        <p class="page-subtitle ml-12">{{ $t('admin.leads.import.importSubtitle') }}</p>
      </div>
    </div>

    <!-- Stepper -->
    <div class="q-card mb-6">
      <div class="flex items-center justify-between p-4">
        <div 
          v-for="step in 5" 
          :key="step"
          class="flex items-center"
          :class="{ 'flex-1': step < 5 }"
        >
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors"
            :class="[
              currentStep >= step 
                ? 'bg-primary-500 text-white' 
                : 'bg-neutral-200 text-neutral-500'
            ]"
          >
            <i v-if="currentStep > step" class="pi pi-check"></i>
            <span v-else>{{ step }}</span>
          </div>
          <div v-if="step < 5" class="flex-1 h-1 mx-2" :class="currentStep > step ? 'bg-primary-500' : 'bg-neutral-200'"></div>
        </div>
      </div>
      <div class="flex justify-between px-4 pb-4 text-xs text-neutral-600">
        <span class="w-10 text-center">{{ $t('admin.leads.import.steps.file') }}</span>
        <span class="w-10 text-center">{{ $t('admin.leads.import.steps.config') }}</span>
        <span class="w-10 text-center">{{ $t('admin.leads.import.steps.mapping') }}</span>
        <span class="w-10 text-center">{{ $t('admin.leads.import.steps.verify') }}</span>
        <span class="w-10 text-center">{{ $t('admin.leads.import.steps.result') }}</span>
      </div>
    </div>

    <!-- Step 1: File Upload -->
    <div v-if="currentStep === 1" class="q-card">
      <div class="q-card-header">
        <h3 class="card-title">
          <i class="pi pi-upload mr-2 text-primary-500"></i>
          {{ $t('admin.leads.import.step1.title') }}
        </h3>
      </div>
      <div class="q-card-body">
        <div v-if="!file" class="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
          <i class="pi pi-cloud-upload text-5xl text-neutral-400 mb-4"></i>
          <p class="text-neutral-600 mb-4">{{ $t('admin.leads.import.step1.dropText') }}</p>
          <PrimeFileUpload
            mode="basic"
            accept=".csv,.xlsx,.xls"
            :maxFileSize="10000000"
            :chooseLabel="$t('admin.leads.import.step1.selectFile')"
            class="p-button-primary"
            @select="onFileSelect"
          />
          <p class="text-xs text-neutral-500 mt-4">{{ $t('admin.leads.import.step1.supportedFormats') }}</p>
        </div>

        <div v-else class="space-y-6">
          <div class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div class="flex items-center gap-3">
              <i class="pi pi-file text-2xl text-primary-500"></i>
              <div>
                <p class="font-medium text-neutral-900">{{ file.name }}</p>
                <p class="text-sm text-neutral-500">{{ (file.size / 1024).toFixed(1) }} KB</p>
              </div>
            </div>
            <PrimeButton
              icon="pi pi-times"
              severity="secondary"
              text
              rounded
              @click="clearFile"
            />
          </div>

          <!-- Preview Table -->
          <div v-if="previewData.length > 0">
            <h4 class="font-medium text-neutral-700 mb-3">{{ $t('admin.leads.import.step1.previewTitle') }}</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-sm border border-neutral-200 rounded-lg overflow-hidden">
                <thead>
                  <tr class="bg-neutral-100">
                    <th class="px-3 py-2 text-left text-neutral-600 font-medium">#</th>
                    <th 
                      v-for="(header, index) in fileHeaders" 
                      :key="index"
                      class="px-3 py-2 text-left text-neutral-600 font-medium"
                    >
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(row, rowIndex) in previewData.slice(config.skip_header ? 1 : 0)" 
                    :key="rowIndex"
                    class="border-t border-neutral-200"
                    :class="rowIndex % 2 === 0 ? 'bg-white' : 'bg-neutral-50'"
                  >
                    <td class="px-3 py-2 text-neutral-500">{{ rowIndex + 1 }}</td>
                    <td 
                      v-for="(cell, cellIndex) in row" 
                      :key="cellIndex"
                      class="px-3 py-2 text-neutral-700"
                    >
                      {{ cell || '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="text-xs text-neutral-500 mt-2">
              {{ $t('admin.leads.import.step1.previewRows', { count: Math.min(5, previewData.length - 1) }) }}
            </p>
          </div>

          <!-- Skip Header Option -->
          <div class="flex items-center gap-3">
            <PrimeCheckbox
              v-model="config.skip_header"
              inputId="skip_header"
              :binary="true"
            />
            <label for="skip_header" class="text-neutral-700 cursor-pointer">
              {{ $t('admin.leads.import.step1.headerCheckbox') }}
            </label>
          </div>
        </div>
      </div>
      <div class="q-card-footer flex justify-end">
        <PrimeButton
          :label="$t('admin.leads.import.step1.continue')"
          icon="pi pi-arrow-right"
          iconPos="right"
          severity="primary"
          :disabled="!file"
          @click="nextStep"
        />
      </div>
    </div>

    <!-- Step 2: Configuration -->
    <div v-if="currentStep === 2" class="q-card">
      <div class="q-card-header">
        <h3 class="card-title">
          <i class="pi pi-cog mr-2 text-primary-500"></i>
          {{ $t('admin.leads.import.step2.title') }}
        </h3>
      </div>
      <div class="q-card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Category -->
          <div class="form-group">
            <label for="category_id">{{ $t('admin.leads.import.step2.category') }} *</label>
            <PrimeSelect
              id="category_id"
              v-model="config.category_id"
              :options="categoryOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('admin.leads.import.step2.category')"
              class="w-full"
            />
            <small class="form-hint">{{ $t('admin.leads.import.step2.categoryHint') }}</small>
          </div>

          <!-- Source -->
          <div class="form-group">
            <label for="source_id">{{ $t('admin.leads.import.step2.source') }}</label>
            <PrimeSelect
              id="source_id"
              v-model="config.source_id"
              :options="sourceOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('admin.leads.import.step2.sourcePlaceholder')"
              class="w-full"
              showClear
            />
            <small class="form-hint">{{ $t('admin.leads.import.step2.sourceHint') }}</small>
          </div>

          <!-- Duplicate Strategy -->
          <div class="form-group md:col-span-2">
            <label>{{ $t('admin.leads.import.step2.duplicateStrategy') }}</label>
            <div class="flex gap-4 mt-2">
              <div 
                v-for="option in duplicateOptions" 
                :key="option.value"
                class="flex items-center gap-2"
              >
                <PrimeRadioButton
                  v-model="config.duplicate_strategy"
                  :inputId="`dup_${option.value}`"
                  :value="option.value"
                />
                <label :for="`dup_${option.value}`" class="cursor-pointer">{{ option.label }}</label>
              </div>
            </div>
            <small class="form-hint">{{ $t('admin.leads.import.step2.duplicateHint') }}</small>
          </div>
        </div>
      </div>
      <div class="q-card-footer flex justify-between">
        <PrimeButton
          :label="$t('admin.leads.import.step2.back')"
          icon="pi pi-arrow-left"
          severity="secondary"
          outlined
          @click="prevStep"
        />
        <PrimeButton
          :label="$t('admin.leads.import.step1.continue')"
          icon="pi pi-arrow-right"
          iconPos="right"
          severity="primary"
          :disabled="!config.category_id"
          @click="nextStep"
        />
      </div>
    </div>

    <!-- Step 3: Field Mapping -->
    <div v-if="currentStep === 3" class="q-card">
      <div class="q-card-header">
        <h3 class="card-title">
          <i class="pi pi-link mr-2 text-primary-500"></i>
          {{ $t('admin.leads.import.step3.title') }}
        </h3>
      </div>
      <div class="q-card-body">
        <p class="text-neutral-600 mb-6">
          {{ $t('admin.leads.import.step3.description') }}
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="field in mappingFields" 
            :key="field.key"
            class="form-group"
          >
            <label :for="`map_${field.key}`">
              {{ field.label }} {{ field.required ? '*' : '' }}
            </label>
            <PrimeSelect
              :id="`map_${field.key}`"
              v-model="config.mapping[field.key as keyof LeadFieldMapping]"
              :options="columnOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('admin.leads.import.step3.selectColumn')"
              class="w-full"
              :class="{ 'p-invalid': field.required && config.mapping[field.key as keyof LeadFieldMapping] === null }"
            />
          </div>
        </div>
      </div>
      <div class="q-card-footer flex justify-between">
        <PrimeButton
          :label="$t('admin.leads.import.step2.back')"
          icon="pi pi-arrow-left"
          severity="secondary"
          outlined
          @click="prevStep"
        />
        <PrimeButton
          :label="$t('admin.leads.import.step1.continue')"
          icon="pi pi-arrow-right"
          iconPos="right"
          severity="primary"
          :disabled="!isMappingValid"
          @click="nextStep"
        />
      </div>
    </div>

    <!-- Step 4: Review & Confirm -->
    <div v-if="currentStep === 4" class="q-card">
      <div class="q-card-header">
        <h3 class="card-title">
          <i class="pi pi-check-circle mr-2 text-primary-500"></i>
          {{ $t('admin.leads.import.step4.title') }}
        </h3>
      </div>
      <div class="q-card-body">
        <div class="space-y-6">
          <!-- Summary -->
          <div class="bg-neutral-50 rounded-lg p-6">
            <h4 class="font-semibold text-neutral-900 mb-4">{{ $t('admin.leads.import.step4.summary') }}</h4>
            <dl class="grid grid-cols-2 gap-4">
              <div>
                <dt class="text-sm text-neutral-500">{{ $t('admin.leads.import.step4.file') }}</dt>
                <dd class="font-medium text-neutral-900">{{ file?.name }}</dd>
              </div>
              <div>
                <dt class="text-sm text-neutral-500">{{ $t('admin.leads.import.step4.rowsToImport') }}</dt>
                <dd class="font-medium text-neutral-900">
                  {{ previewData.length - (config.skip_header ? 1 : 0) }} ({{ $t('admin.leads.import.step4.estimated') }})
                </dd>
              </div>
              <div>
                <dt class="text-sm text-neutral-500">{{ $t('admin.leads.import.step2.category') }}</dt>
                <dd class="font-medium text-neutral-900">
                  {{ categoryOptions.find(c => c.value === config.category_id)?.label || '-' }}
                </dd>
              </div>
              <div>
                <dt class="text-sm text-neutral-500">{{ $t('admin.leads.import.step2.source') }}</dt>
                <dd class="font-medium text-neutral-900">
                  {{ sourceOptions.find(s => s.value === config.source_id)?.label || $t('admin.leads.import.step4.notSpecified') }}
                </dd>
              </div>
              <div>
                <dt class="text-sm text-neutral-500">{{ $t('admin.leads.import.step2.duplicateStrategy') }}</dt>
                <dd class="font-medium text-neutral-900">
                  {{ duplicateOptions.find(d => d.value === config.duplicate_strategy)?.label }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- Mapping Summary -->
          <div>
            <h4 class="font-semibold text-neutral-900 mb-3">{{ $t('admin.leads.import.step4.mappingConfigured') }}</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div 
                v-for="field in mappingFields" 
                :key="field.key"
                class="text-sm"
              >
                <span class="text-neutral-500">{{ field.label }}:</span>
                <span class="ml-1 font-medium">
                  {{ 
                    config.mapping[field.key as keyof LeadFieldMapping] !== null 
                      ? fileHeaders[config.mapping[field.key as keyof LeadFieldMapping]!]
                      : '-'
                  }}
                </span>
              </div>
            </div>
          </div>

          <!-- Warning -->
          <PrimeMessage severity="info" :closable="false">
            <p>{{ $t('admin.leads.import.step4.importWarning') }}</p>
          </PrimeMessage>
        </div>
      </div>
      <div class="q-card-footer flex justify-between">
        <PrimeButton
          :label="$t('admin.leads.import.step2.back')"
          icon="pi pi-arrow-left"
          severity="secondary"
          outlined
          @click="prevStep"
        />
        <PrimeButton
          :label="$t('admin.leads.import.step4.startImport')"
          icon="pi pi-play"
          severity="primary"
          :loading="leadStore.importing"
          @click="executeImport"
        />
      </div>
    </div>

    <!-- Step 5: Results -->
    <div v-if="currentStep === 5" class="q-card">
      <div class="q-card-header">
        <h3 class="card-title">
          <i class="pi pi-chart-bar mr-2 text-primary-500"></i>
          {{ $t('admin.leads.import.step5.title') }}
        </h3>
      </div>
      <div class="q-card-body">
        <div v-if="importResult" class="space-y-6">
          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center p-6 bg-neutral-50 rounded-lg">
              <div class="text-3xl font-bold text-neutral-900">{{ importResult.total_rows }}</div>
              <div class="text-sm text-neutral-500 mt-1">{{ $t('admin.leads.import.step5.totalRows') }}</div>
            </div>
            <div class="text-center p-6 bg-success-light rounded-lg">
              <div class="text-3xl font-bold text-success-dark">{{ importResult.imported }}</div>
              <div class="text-sm text-success-dark mt-1">{{ $t('admin.leads.import.step5.imported') }}</div>
            </div>
            <div class="text-center p-6 bg-warning-light rounded-lg">
              <div class="text-3xl font-bold text-warning-dark">{{ importResult.skipped }}</div>
              <div class="text-sm text-warning-dark mt-1">{{ $t('admin.leads.import.step5.skipped') }}</div>
            </div>
          </div>

          <!-- Errors -->
          <div v-if="importResult.errors.length > 0">
            <h4 class="font-semibold text-danger mb-3">
              <i class="pi pi-exclamation-triangle mr-2"></i>
              {{ $t('admin.leads.import.step5.errorsTitle', { count: importResult.errors.length }) }}
            </h4>
            <div class="max-h-48 overflow-y-auto border border-neutral-200 rounded-lg">
              <table class="w-full text-sm">
                <thead class="bg-neutral-100 sticky top-0">
                  <tr>
                    <th class="px-3 py-2 text-left">{{ $t('admin.leads.import.step5.errorRow') }}</th>
                    <th class="px-3 py-2 text-left">{{ $t('admin.leads.import.step5.errorMessage') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="error in importResult.errors" 
                    :key="error.row"
                    class="border-t border-neutral-200"
                  >
                    <td class="px-3 py-2 text-neutral-600">{{ error.row }}</td>
                    <td class="px-3 py-2 text-danger">{{ error.message }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Success message -->
          <PrimeMessage v-if="importResult.imported > 0" severity="success" :closable="false">
            <p>{{ $t('admin.leads.import.step5.successMessage', { count: importResult.imported }) }}</p>
          </PrimeMessage>
        </div>
      </div>
      <div class="q-card-footer flex justify-between">
        <PrimeButton
          :label="$t('admin.leads.import.step5.newImport')"
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          @click="startNewImport"
        />
        <PrimeButton
          :label="$t('admin.leads.import.step5.goToList')"
          icon="pi pi-list"
          iconPos="right"
          severity="primary"
          @click="goToList"
        />
      </div>
    </div>
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

.q-card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  background-color: #f8f9fa;
}
</style>
