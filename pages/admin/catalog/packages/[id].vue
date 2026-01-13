<script setup lang="ts">
/**
 * Admin Packages - Edit Package
 * Form per la modifica di un pacchetto lead esistente
 */
import { usePackageValidation, useCatalogActions, useCatalogFormatters } from '~/composables/useCatalog'
import type { PackageUpdateForm } from '~/types/catalog'

definePageMeta({
  layout: 'admin'
})

// Route params
const route = useRoute()
const packageId = computed(() => {
  const params = route.params as { id: string }
  return Number(params.id)
})

// Store & Composables
const catalogStore = useCatalogStore()
const router = useRouter()
const { errors, hasErrors, validateField, validateForm, clearErrors } = usePackageValidation()
const { showSuccess, showError, showWarning } = useCatalogActions()
const { formatCurrency, formatNumber, formatDate } = useCatalogFormatters()

// Form State
const form = reactive<PackageUpdateForm>({
  category_id: null,
  name: '',
  description: '',
  lead_quantity: 10,
  price: 100,
  allows_exclusive: true,
  allows_shared: true,
  is_active: true,
  sort_order: 0
})

// Category selection mode
const categoryMode = ref<'all' | 'specific'>('all')

// Loading state
const initialLoading = ref(true)

// Current package
const pkg = computed(() => catalogStore.currentPackage)

// Computed
const categories = computed(() => catalogStore.categoriesForSelect)

const pricePerLead = computed(() => {
  if (form.lead_quantity > 0) {
    return form.price / form.lead_quantity
  }
  return 0
})

// Populate form when package is loaded
watch(pkg, (newPkg) => {
  if (newPkg) {
    form.category_id = newPkg.category_id
    form.name = newPkg.name
    form.description = newPkg.description || ''
    form.lead_quantity = newPkg.lead_quantity
    form.price = newPkg.price
    form.allows_exclusive = newPkg.allows_exclusive
    form.allows_shared = newPkg.allows_shared
    form.is_active = newPkg.is_active
    form.sort_order = newPkg.sort_order
    
    categoryMode.value = newPkg.category_id === null ? 'all' : 'specific'
  }
}, { immediate: true })

// Watch category mode to reset category_id
watch(categoryMode, (mode) => {
  if (mode === 'all') {
    form.category_id = null
  }
})

// Validation on blur
const onBlur = (field: string, value: any, extra?: any) => {
  validateField(field, value, extra)
}

// Validate acquisition modes
const validateModes = () => {
  validateField('acquisition_modes', form.allows_exclusive, form.allows_shared)
}

// Submit form
const onSubmit = async () => {
  clearErrors()
  
  if (!validateForm(form)) {
    showError('Correggi gli errori nel form prima di procedere')
    return
  }

  const updatedPkg = await catalogStore.updatePackage(packageId.value, form)
  
  if (updatedPkg) {
    showSuccess(`Pacchetto "${updatedPkg.name}" aggiornato con successo`)
    router.push('/admin/catalog/packages')
  } else {
    showError(catalogStore.error || 'Errore nell\'aggiornamento del pacchetto')
  }
}

// Cancel and go back
const onCancel = () => {
  router.push('/admin/catalog/packages')
}

// Load package data
onMounted(async () => {
  await Promise.all([
    catalogStore.fetchPackage(packageId.value),
    catalogStore.fetchAllCategories()
  ])
  initialLoading.value = false
  
  if (!pkg.value) {
    showError('Pacchetto non trovato')
    router.push('/admin/catalog/packages')
  }
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="initialLoading" class="flex items-center justify-center py-20">
      <i class="pi pi-spin pi-spinner text-4xl text-primary-500"></i>
    </div>

    <template v-else-if="pkg">
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
            <h1 class="page-title mb-0">Modifica Pacchetto</h1>
          </div>
          <p class="page-subtitle ml-12">{{ pkg.name }}</p>
        </div>
        <div class="page-header-actions">
          <PrimeTag 
            :value="pkg.is_active ? 'Attivo' : 'Non attivo'"
            :severity="pkg.is_active ? 'success' : 'danger'"
            class="text-sm"
          />
        </div>
      </div>

      <!-- Package Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-neutral-50 rounded-lg p-4">
          <div class="text-sm text-neutral-600">ID Pacchetto</div>
          <div class="text-lg font-semibold text-neutral-900">#{{ pkg.id }}</div>
        </div>
        <div class="bg-neutral-50 rounded-lg p-4">
          <div class="text-sm text-neutral-600">Vendite Totali</div>
          <div class="text-lg font-semibold text-neutral-900">{{ formatNumber(pkg.sales_count || 0) }}</div>
        </div>
        <div class="bg-neutral-50 rounded-lg p-4">
          <div class="text-sm text-neutral-600">Ricavi Generati</div>
          <div class="text-lg font-semibold text-success">{{ formatCurrency((pkg.sales_count || 0) * pkg.price) }}</div>
        </div>
        <div class="bg-neutral-50 rounded-lg p-4">
          <div class="text-sm text-neutral-600">Creato il</div>
          <div class="text-lg font-semibold text-neutral-900">{{ formatDate(pkg.created_at) }}</div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- Basic Information Card -->
        <div class="q-card">
          <div class="q-card-header">
            <h3 class="card-title">
              <i class="pi pi-box mr-2 text-primary-500"></i>
              Informazioni Base
            </h3>
          </div>
          <div class="q-card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Name -->
              <div class="form-group">
                <label for="name">Nome Pacchetto *</label>
                <PrimeInputText
                  id="name"
                  v-model="form.name"
                  :class="{ 'p-invalid': errors.name }"
                  placeholder="Es. Starter Fotovoltaico"
                  class="w-full"
                  @blur="onBlur('name', form.name)"
                />
                <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
              </div>

              <!-- Category Mode -->
              <div class="form-group">
                <label>Tipo Pacchetto *</label>
                <div class="flex gap-4 mt-2">
                  <div class="flex items-center gap-2">
                    <PrimeRadioButton
                      v-model="categoryMode"
                      inputId="cat-all"
                      value="all"
                    />
                    <label for="cat-all" class="cursor-pointer text-sm">Tutte le categorie</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <PrimeRadioButton
                      v-model="categoryMode"
                      inputId="cat-specific"
                      value="specific"
                    />
                    <label for="cat-specific" class="cursor-pointer text-sm">Categoria specifica</label>
                  </div>
                </div>
              </div>

              <!-- Category Selection (if specific) -->
              <div v-if="categoryMode === 'specific'" class="form-group md:col-span-2">
                <label for="category_id">Categoria *</label>
                <PrimeSelect
                  id="category_id"
                  v-model="form.category_id"
                  :options="categories"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Seleziona una categoria"
                  class="w-full"
                  :filter="categories.length > 5"
                  filterPlaceholder="Cerca categoria..."
                />
                <small class="form-hint">I clienti potranno selezionare solo lead di questa categoria</small>
              </div>

              <!-- Description -->
              <div class="form-group md:col-span-2">
                <label for="description">Descrizione</label>
                <PrimeTextarea
                  id="description"
                  v-model="form.description"
                  rows="3"
                  placeholder="Descrizione del pacchetto e vantaggi per il cliente..."
                  class="w-full"
                  autoResize
                />
                <small class="form-hint">Descrizione opzionale visibile ai clienti</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Pricing Card -->
        <div class="q-card">
          <div class="q-card-header">
            <h3 class="card-title">
              <i class="pi pi-euro mr-2 text-primary-500"></i>
              Prezzo e Quantità
            </h3>
          </div>
          <div class="q-card-body">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Lead Quantity -->
              <div class="form-group">
                <label for="lead_quantity">Quantità Lead *</label>
                <PrimeInputNumber
                  id="lead_quantity"
                  v-model="form.lead_quantity"
                  :class="{ 'p-invalid': errors.lead_quantity }"
                  :min="1"
                  :max="1000"
                  :showButtons="true"
                  class="w-full"
                  @blur="onBlur('lead_quantity', form.lead_quantity)"
                />
                <small v-if="errors.lead_quantity" class="p-error">{{ errors.lead_quantity }}</small>
                <small v-else class="form-hint">Numero di lead inclusi nel pacchetto</small>
              </div>

              <!-- Price -->
              <div class="form-group">
                <label for="price">Prezzo Totale (€) *</label>
                <PrimeInputNumber
                  id="price"
                  v-model="form.price"
                  :class="{ 'p-invalid': errors.price }"
                  :min="0"
                  :max="100000"
                  :minFractionDigits="2"
                  :maxFractionDigits="2"
                  mode="currency"
                  currency="EUR"
                  locale="it-IT"
                  class="w-full"
                  @blur="onBlur('price', form.price)"
                />
                <small v-if="errors.price" class="p-error">{{ errors.price }}</small>
                <small v-else class="form-hint">Prezzo senza IVA</small>
              </div>

              <!-- Price per Lead (calculated) -->
              <div class="form-group">
                <label>Prezzo per Lead</label>
                <div class="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div class="text-2xl font-bold text-primary-600">
                    {{ formatCurrency(pricePerLead) }}
                  </div>
                  <div class="text-xs text-neutral-500 mt-1">calcolato automaticamente</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Acquisition Modes Card -->
        <div class="q-card">
          <div class="q-card-header">
            <h3 class="card-title">
              <i class="pi pi-sliders-h mr-2 text-primary-500"></i>
              Modalità di Acquisizione
            </h3>
          </div>
          <div class="q-card-body">
            <p class="text-sm text-neutral-600 mb-4">
              Seleziona quali modalità di acquisizione saranno disponibili per i clienti che acquistano questo pacchetto.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Allows Exclusive -->
              <div 
                class="p-4 rounded-lg border-2 transition-all cursor-pointer"
                :class="form.allows_exclusive ? 'border-blue-500 bg-blue-50' : 'border-neutral-200 bg-neutral-50'"
                @click="form.allows_exclusive = !form.allows_exclusive; validateModes()"
              >
                <div class="flex items-start gap-3">
                  <PrimeCheckbox
                    v-model="form.allows_exclusive"
                    :binary="true"
                    @change="validateModes"
                  />
                  <div>
                    <div class="font-medium text-neutral-900">Lead Esclusivi</div>
                    <p class="text-sm text-neutral-600 mt-1">
                      I clienti potranno selezionare lead in modalità esclusiva
                    </p>
                  </div>
                </div>
              </div>

              <!-- Allows Shared -->
              <div 
                class="p-4 rounded-lg border-2 transition-all cursor-pointer"
                :class="form.allows_shared ? 'border-orange-500 bg-orange-50' : 'border-neutral-200 bg-neutral-50'"
                @click="form.allows_shared = !form.allows_shared; validateModes()"
              >
                <div class="flex items-start gap-3">
                  <PrimeCheckbox
                    v-model="form.allows_shared"
                    :binary="true"
                    @change="validateModes"
                  />
                  <div>
                    <div class="font-medium text-neutral-900">Lead Condivisi</div>
                    <p class="text-sm text-neutral-600 mt-1">
                      I clienti potranno selezionare lead in modalità condivisa
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <small v-if="errors.acquisition_modes" class="p-error mt-2 block">
              {{ errors.acquisition_modes }}
            </small>
          </div>
        </div>

        <!-- Settings Card -->
        <div class="q-card">
          <div class="q-card-header">
            <h3 class="card-title">
              <i class="pi pi-cog mr-2 text-primary-500"></i>
              Impostazioni
            </h3>
          </div>
          <div class="q-card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Sort Order -->
              <div class="form-group">
                <label for="sort_order">Ordine di Visualizzazione</label>
                <PrimeInputNumber
                  id="sort_order"
                  v-model="form.sort_order"
                  :min="0"
                  :showButtons="true"
                  class="w-full"
                />
                <small class="form-hint">Ordine di visualizzazione nelle liste</small>
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
                      Pacchetto Attivo
                    </label>
                    <p class="text-sm text-neutral-600 mt-1">
                      Se attivo, il pacchetto sarà visibile e acquistabile
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Warning if has sales and deactivating -->
        <div 
          v-if="pkg.sales_count && pkg.sales_count > 0 && !form.is_active && pkg.is_active"
          class="bg-warning-light border border-warning/20 rounded-lg p-4"
        >
          <div class="flex items-start gap-3">
            <i class="pi pi-exclamation-triangle text-warning-dark text-xl mt-0.5"></i>
            <div>
              <h4 class="font-medium text-warning-dark mb-1">Attenzione</h4>
              <p class="text-sm text-warning-dark/80">
                Questo pacchetto è stato venduto {{ pkg.sales_count }} volte.
                Disattivandolo, non sarà più acquistabile dai nuovi clienti, ma i clienti che lo hanno già 
                acquistato potranno continuare ad utilizzare il loro monte lead.
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4 pt-4 border-t border-neutral-200">
          <PrimeButton
            type="button"
            label="Annulla"
            severity="secondary"
            outlined
            @click="onCancel"
          />
          <PrimeButton
            type="submit"
            label="Salva Modifiche"
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
