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
    first_name: null,
    last_name: null,
    email: null,
    phone: null,
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

const duplicateOptions = [
  { label: 'Salta duplicati', value: 'skip' },
  { label: 'Aggiorna esistenti', value: 'update' },
  { label: 'Crea comunque', value: 'create' }
]

// Field mapping labels
const mappingFields = [
  { key: 'first_name', label: 'Nome', required: true },
  { key: 'last_name', label: 'Cognome', required: true },
  { key: 'email', label: 'Email', required: true },
  { key: 'phone', label: 'Telefono', required: true },
  { key: 'province_code', label: 'Provincia (codice)', required: false },
  { key: 'request_text', label: 'Testo Richiesta', required: false },
  { key: 'external_id', label: 'ID Esterno', required: false },
  { key: 'generated_at', label: 'Data Generazione', required: false }
]

// Computed for column options
const columnOptions = computed(() => {
  if (fileHeaders.value.length === 0) return []
  return [
    { label: '-- Non mappare --', value: null },
    ...fileHeaders.value.map((header, index) => ({
      label: `${index + 1}. ${header}`,
      value: index
    }))
  ]
})

// Check if mapping is valid
const isMappingValid = computed(() => {
  const requiredFields: (keyof LeadFieldMapping)[] = ['first_name', 'last_name', 'email', 'phone']
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
    showInfo('Lettura file Excel in corso...')
    // Per semplicità, in fase di sviluppo gestiamo solo CSV
    // TODO: Implementare lettura XLSX con libreria apposita
    showWarning('Per ora è supportato solo il formato CSV')
    file.value = null
    config.file = null
  } else {
    showError('Formato file non supportato. Usa CSV o XLSX.')
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
    'nome': 'first_name',
    'first_name': 'first_name',
    'firstname': 'first_name',
    'cognome': 'last_name',
    'last_name': 'last_name',
    'lastname': 'last_name',
    'email': 'email',
    'e-mail': 'email',
    'mail': 'email',
    'telefono': 'phone',
    'phone': 'phone',
    'tel': 'phone',
    'cellulare': 'phone',
    'mobile': 'phone',
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
    first_name: null,
    last_name: null,
    email: null,
    phone: null,
    province_code: null,
    request_text: null,
    external_id: null,
    generated_at: null
  }
}

// Next step
const nextStep = () => {
  if (currentStep.value === 1 && !file.value) {
    showError('Seleziona un file da importare')
    return
  }
  if (currentStep.value === 2 && !config.category_id) {
    showError('Seleziona una categoria')
    return
  }
  if (currentStep.value === 3 && !isMappingValid.value) {
    showError('Mappa tutti i campi obbligatori')
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
    showError('Configurazione non valida')
    return
  }

  const result = await leadStore.importLeads(config)
  
  if (result) {
    importResult.value = result
    currentStep.value = 5 // Go to results
    
    if (result.imported > 0) {
      showSuccess(`${result.imported} lead importati con successo`)
    }
    if (result.errors.length > 0) {
      showWarning(`${result.errors.length} righe con errori`)
    }
  } else {
    showError(leadStore.error || 'Errore durante l\'import')
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
          <h1 class="page-title mb-0">Import Lead</h1>
        </div>
        <p class="page-subtitle ml-12">Importa lead da file CSV</p>
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
        <span class="w-10 text-center">File</span>
        <span class="w-10 text-center">Config</span>
        <span class="w-10 text-center">Mapping</span>
        <span class="w-10 text-center">Verifica</span>
        <span class="w-10 text-center">Risultato</span>
      </div>
    </div>

    <!-- Step 1: File Upload -->
    <div v-if="currentStep === 1" class="q-card">
      <div class="q-card-header">
        <h3 class="card-title">
          <i class="pi pi-upload mr-2 text-primary-500"></i>
          Carica File
        </h3>
      </div>
      <div class="q-card-body">
        <div v-if="!file" class="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
          <i class="pi pi-cloud-upload text-5xl text-neutral-400 mb-4"></i>
          <p class="text-neutral-600 mb-4">Trascina qui il file CSV oppure</p>
          <PrimeFileUpload
            mode="basic"
            accept=".csv,.xlsx,.xls"
            :maxFileSize="10000000"
            chooseLabel="Seleziona File"
            class="p-button-primary"
            @select="onFileSelect"
          />
          <p class="text-xs text-neutral-500 mt-4">Formati supportati: CSV (max 10MB)</p>
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
            <h4 class="font-medium text-neutral-700 mb-3">Anteprima dati</h4>
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
              Mostrate le prime {{ Math.min(5, previewData.length - 1) }} righe
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
              La prima riga contiene le intestazioni delle colonne
            </label>
          </div>
        </div>
      </div>
      <div class="q-card-footer flex justify-end">
        <PrimeButton
          label="Continua"
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
          Configurazione Import
        </h3>
      </div>
      <div class="q-card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Category -->
          <div class="form-group">
            <label for="category_id">Categoria *</label>
            <PrimeSelect
              id="category_id"
              v-model="config.category_id"
              :options="categoryOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleziona categoria"
              class="w-full"
            />
            <small class="form-hint">Tutti i lead importati saranno assegnati a questa categoria</small>
          </div>

          <!-- Source -->
          <div class="form-group">
            <label for="source_id">Fonte</label>
            <PrimeSelect
              id="source_id"
              v-model="config.source_id"
              :options="sourceOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleziona fonte (opzionale)"
              class="w-full"
              showClear
            />
            <small class="form-hint">Origine dei lead importati</small>
          </div>

          <!-- Duplicate Strategy -->
          <div class="form-group md:col-span-2">
            <label>Gestione Duplicati</label>
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
            <small class="form-hint">Come gestire lead con email già presenti nel sistema</small>
          </div>
        </div>
      </div>
      <div class="q-card-footer flex justify-between">
        <PrimeButton
          label="Indietro"
          icon="pi pi-arrow-left"
          severity="secondary"
          outlined
          @click="prevStep"
        />
        <PrimeButton
          label="Continua"
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
          Mapping Campi
        </h3>
      </div>
      <div class="q-card-body">
        <p class="text-neutral-600 mb-6">
          Associa le colonne del file ai campi del lead. I campi con * sono obbligatori.
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
              placeholder="Seleziona colonna"
              class="w-full"
              :class="{ 'p-invalid': field.required && config.mapping[field.key as keyof LeadFieldMapping] === null }"
            />
          </div>
        </div>
      </div>
      <div class="q-card-footer flex justify-between">
        <PrimeButton
          label="Indietro"
          icon="pi pi-arrow-left"
          severity="secondary"
          outlined
          @click="prevStep"
        />
        <PrimeButton
          label="Continua"
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
          Verifica e Conferma
        </h3>
      </div>
      <div class="q-card-body">
        <div class="space-y-6">
          <!-- Summary -->
          <div class="bg-neutral-50 rounded-lg p-6">
            <h4 class="font-semibold text-neutral-900 mb-4">Riepilogo Import</h4>
            <dl class="grid grid-cols-2 gap-4">
              <div>
                <dt class="text-sm text-neutral-500">File</dt>
                <dd class="font-medium text-neutral-900">{{ file?.name }}</dd>
              </div>
              <div>
                <dt class="text-sm text-neutral-500">Righe da importare</dt>
                <dd class="font-medium text-neutral-900">
                  {{ previewData.length - (config.skip_header ? 1 : 0) }} (stimate)
                </dd>
              </div>
              <div>
                <dt class="text-sm text-neutral-500">Categoria</dt>
                <dd class="font-medium text-neutral-900">
                  {{ categoryOptions.find(c => c.value === config.category_id)?.label || '-' }}
                </dd>
              </div>
              <div>
                <dt class="text-sm text-neutral-500">Fonte</dt>
                <dd class="font-medium text-neutral-900">
                  {{ sourceOptions.find(s => s.value === config.source_id)?.label || 'Non specificata' }}
                </dd>
              </div>
              <div>
                <dt class="text-sm text-neutral-500">Gestione duplicati</dt>
                <dd class="font-medium text-neutral-900">
                  {{ duplicateOptions.find(d => d.value === config.duplicate_strategy)?.label }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- Mapping Summary -->
          <div>
            <h4 class="font-semibold text-neutral-900 mb-3">Mapping configurato</h4>
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
            <p>L'import potrebbe richiedere alcuni minuti a seconda del numero di righe.</p>
          </PrimeMessage>
        </div>
      </div>
      <div class="q-card-footer flex justify-between">
        <PrimeButton
          label="Indietro"
          icon="pi pi-arrow-left"
          severity="secondary"
          outlined
          @click="prevStep"
        />
        <PrimeButton
          label="Avvia Import"
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
          Risultato Import
        </h3>
      </div>
      <div class="q-card-body">
        <div v-if="importResult" class="space-y-6">
          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center p-6 bg-neutral-50 rounded-lg">
              <div class="text-3xl font-bold text-neutral-900">{{ importResult.total_rows }}</div>
              <div class="text-sm text-neutral-500 mt-1">Righe totali</div>
            </div>
            <div class="text-center p-6 bg-success-light rounded-lg">
              <div class="text-3xl font-bold text-success-dark">{{ importResult.imported }}</div>
              <div class="text-sm text-success-dark mt-1">Importati</div>
            </div>
            <div class="text-center p-6 bg-warning-light rounded-lg">
              <div class="text-3xl font-bold text-warning-dark">{{ importResult.skipped }}</div>
              <div class="text-sm text-warning-dark mt-1">Saltati</div>
            </div>
          </div>

          <!-- Errors -->
          <div v-if="importResult.errors.length > 0">
            <h4 class="font-semibold text-danger mb-3">
              <i class="pi pi-exclamation-triangle mr-2"></i>
              Errori riscontrati ({{ importResult.errors.length }})
            </h4>
            <div class="max-h-48 overflow-y-auto border border-neutral-200 rounded-lg">
              <table class="w-full text-sm">
                <thead class="bg-neutral-100 sticky top-0">
                  <tr>
                    <th class="px-3 py-2 text-left">Riga</th>
                    <th class="px-3 py-2 text-left">Errore</th>
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
            <p>Import completato! {{ importResult.imported }} lead sono stati aggiunti al sistema.</p>
          </PrimeMessage>
        </div>
      </div>
      <div class="q-card-footer flex justify-between">
        <PrimeButton
          label="Nuovo Import"
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          @click="startNewImport"
        />
        <PrimeButton
          label="Vai all'elenco lead"
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
