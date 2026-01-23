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
const { showSuccess, showError } = useCatalogActions()
const { formatCurrency, formatNumber, formatDate } = useCatalogFormatters()

// Form State
const form = reactive<PackageUpdateForm>({
  category_ids: [],
  name: '',
  description: '',
  exclusive_lead_quantity: 0,
  exclusive_price: 0,
  shared_lead_quantity: 0,
  shared_price: 0,
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

const totalLeads = computed(() => form.exclusive_lead_quantity + form.shared_lead_quantity)
const totalPrice = computed(() => form.exclusive_price + form.shared_price)

// Populate form when package is loaded
watch(pkg, (newPkg) => {
  if (newPkg) {
    form.category_ids = newPkg.category_ids || []
    form.name = newPkg.name
    form.description = newPkg.description || ''
    form.exclusive_lead_quantity = newPkg.exclusive_lead_quantity
    form.exclusive_price = newPkg.exclusive_price
    form.shared_lead_quantity = newPkg.shared_lead_quantity
    form.shared_price = newPkg.shared_price
    form.is_active = newPkg.is_active
    form.sort_order = newPkg.sort_order

    categoryMode.value = newPkg.category_ids.length === 0 ? 'all' : 'specific'
  }
}, { immediate: true })

// Watch category mode to reset category_ids
watch(categoryMode, (mode) => {
  if (mode === 'all') {
    form.category_ids = []
  }
})

// Validation on blur
const onBlur = (field: string, value: any) => {
  validateField(field, value)
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
          <div class="text-lg font-semibold text-success">{{ formatCurrency((pkg.sales_count || 0) * (pkg.exclusive_price + pkg.shared_price)) }}</div>
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
                    <label for="cat-specific" class="cursor-pointer text-sm">Categorie specifiche</label>
                  </div>
                </div>
              </div>

              <!-- Category Selection (if specific) -->
              <div v-if="categoryMode === 'specific'" class="form-group md:col-span-2">
                <label for="category_ids">Categorie *</label>
                <PrimeMultiSelect
                  id="category_ids"
                  v-model="form.category_ids"
                  :options="categories"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Seleziona una o più categorie"
                  class="w-full"
                  :filter="categories.length > 5"
                  filterPlaceholder="Cerca categoria..."
                  display="chip"
                />
                <small class="form-hint">I clienti potranno selezionare lead delle categorie selezionate</small>
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

        <!-- Exclusive Leads Card -->
        <div class="q-card">
          <div class="q-card-header">
            <h3 class="card-title">
              <i class="pi pi-star mr-2 text-blue-500"></i>
              Lead Esclusivi
            </h3>
          </div>
          <div class="q-card-body">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Exclusive Lead Quantity -->
              <div class="form-group">
                <label for="exclusive_lead_quantity">Quantità Lead Esclusivi</label>
                <PrimeInputNumber
                  id="exclusive_lead_quantity"
                  v-model="form.exclusive_lead_quantity"
                  :min="0"
                  :max="1000"
                  :showButtons="true"
                  class="w-full"
                />
                <small class="form-hint">Numero di lead esclusivi inclusi</small>
              </div>

              <!-- Exclusive Price -->
              <div class="form-group">
                <label for="exclusive_price">Prezzo Lead Esclusivi (€)</label>
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
                <small class="form-hint">Prezzo totale per i lead esclusivi</small>
              </div>

              <!-- Exclusive Price per Lead (calculated) -->
              <div class="form-group">
                <label>Prezzo per Lead Esclusivo</label>
                <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div class="text-2xl font-bold text-blue-600">
                    {{ formatCurrency(exclusivePricePerLead) }}
                  </div>
                  <div class="text-xs text-blue-500 mt-1">calcolato automaticamente</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Shared Leads Card -->
        <div class="q-card">
          <div class="q-card-header">
            <h3 class="card-title">
              <i class="pi pi-users mr-2 text-orange-500"></i>
              Lead Condivisi
            </h3>
          </div>
          <div class="q-card-body">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Shared Lead Quantity -->
              <div class="form-group">
                <label for="shared_lead_quantity">Quantità Lead Condivisi</label>
                <PrimeInputNumber
                  id="shared_lead_quantity"
                  v-model="form.shared_lead_quantity"
                  :min="0"
                  :max="1000"
                  :showButtons="true"
                  class="w-full"
                />
                <small class="form-hint">Numero di lead condivisi inclusi</small>
              </div>

              <!-- Shared Price -->
              <div class="form-group">
                <label for="shared_price">Prezzo Lead Condivisi (€)</label>
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
                <small class="form-hint">Prezzo totale per i lead condivisi</small>
              </div>

              <!-- Shared Price per Lead (calculated) -->
              <div class="form-group">
                <label>Prezzo per Lead Condiviso</label>
                <div class="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div class="text-2xl font-bold text-orange-600">
                    {{ formatCurrency(sharedPricePerLead) }}
                  </div>
                  <div class="text-xs text-orange-500 mt-1">calcolato automaticamente</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Card -->
        <div class="q-card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
          <div class="q-card-header">
            <h3 class="card-title">
              <i class="pi pi-calculator mr-2 text-primary-500"></i>
              Riepilogo Pacchetto
            </h3>
          </div>
          <div class="q-card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="p-4 bg-white rounded-lg">
                <div class="text-sm text-neutral-600 mb-1">Totale Lead</div>
                <div class="text-3xl font-bold text-primary-600">{{ formatNumber(totalLeads) }}</div>
                <div class="text-xs text-neutral-500 mt-1">
                  {{ form.exclusive_lead_quantity }} esclusivi + {{ form.shared_lead_quantity }} condivisi
                </div>
              </div>
              <div class="p-4 bg-white rounded-lg">
                <div class="text-sm text-neutral-600 mb-1">Prezzo Totale Pacchetto</div>
                <div class="text-3xl font-bold text-success">{{ formatCurrency(totalPrice) }}</div>
                <div class="text-xs text-neutral-500 mt-1">
                  {{ formatCurrency(form.exclusive_price) }} esclusivi + {{ formatCurrency(form.shared_price) }} condivisi
                </div>
              </div>
            </div>
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
