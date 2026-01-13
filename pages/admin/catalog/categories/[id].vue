<script setup lang="ts">
/**
 * Admin Categories - Edit Category
 * Form per la modifica di una categoria merceologica esistente
 */
import { useCategoryValidation, useCatalogActions, useCatalogFormatters } from '~/composables/useCatalog'
import type { CategoryUpdateForm } from '~/types/catalog'

definePageMeta({
  layout: 'admin'
})

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
  sort_order: 0
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
    showWarning('Slug rigenerato. Ricorda che cambiare lo slug potrebbe influenzare i link esistenti.')
  }
}

// Submit form
const onSubmit = async () => {
  clearErrors()
  
  if (!validateForm(form)) {
    showError('Correggi gli errori nel form prima di procedere')
    return
  }

  const updatedCategory = await catalogStore.updateCategory(categoryId.value, form)
  
  if (updatedCategory) {
    showSuccess(`Categoria "${updatedCategory.name}" aggiornata con successo`)
    router.push('/admin/catalog/categories')
  } else {
    showError(catalogStore.error || 'Errore nell\'aggiornamento della categoria')
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
    showError('Categoria non trovata')
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
            <h1 class="page-title mb-0">Modifica Categoria</h1>
          </div>
          <p class="page-subtitle ml-12">{{ category.name }}</p>
        </div>
        <div class="page-header-actions">
          <PrimeTag 
            :value="category.is_active ? 'Attiva' : 'Non attiva'"
            :severity="category.is_active ? 'success' : 'danger'"
            class="text-sm"
          />
        </div>
      </div>

      <!-- Category Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-neutral-50 rounded-lg p-4">
          <div class="text-sm text-neutral-600">ID Categoria</div>
          <div class="text-lg font-semibold text-neutral-900">#{{ category.id }}</div>
        </div>
        <div class="bg-neutral-50 rounded-lg p-4">
          <div class="text-sm text-neutral-600">Lead Totali</div>
          <div class="text-lg font-semibold text-neutral-900">{{ formatNumber(category.leads_count || 0) }}</div>
        </div>
        <div class="bg-neutral-50 rounded-lg p-4">
          <div class="text-sm text-neutral-600">Lead Disponibili</div>
          <div class="text-lg font-semibold text-success">{{ formatNumber(category.available_leads_count || 0) }}</div>
        </div>
        <div class="bg-neutral-50 rounded-lg p-4">
          <div class="text-sm text-neutral-600">Creata il</div>
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
              Informazioni Base
            </h3>
          </div>
          <div class="q-card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Name -->
              <div class="form-group">
                <label for="name">Nome Categoria *</label>
                <PrimeInputText
                  id="name"
                  v-model="form.name"
                  :class="{ 'p-invalid': errors.name }"
                  placeholder="Es. Fotovoltaico"
                  class="w-full"
                  @blur="onBlur('name', form.name)"
                />
                <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
              </div>

              <!-- Slug -->
              <div class="form-group">
                <label for="slug">Slug (URL) *</label>
                <div class="p-inputgroup">
                  <PrimeInputText
                    id="slug"
                    v-model="form.slug"
                    :class="{ 'p-invalid': errors.slug }"
                    placeholder="es-fotovoltaico"
                    class="w-full"
                    @blur="onBlur('slug', form.slug)"
                  />
                  <PrimeButton
                    icon="pi pi-sync"
                    severity="secondary"
                    outlined
                    v-tooltip.top="'Rigenera da nome'"
                    @click="regenerateSlug"
                  />
                </div>
                <small v-if="errors.slug" class="p-error">{{ errors.slug }}</small>
                <small v-else class="form-hint">Attenzione: modificare lo slug potrebbe invalidare eventuali link esistenti</small>
              </div>

              <!-- Description -->
              <div class="form-group md:col-span-2">
                <label for="description">Descrizione</label>
                <PrimeTextarea
                  id="description"
                  v-model="form.description"
                  rows="3"
                  placeholder="Descrizione della categoria e tipologia di lead..."
                  class="w-full"
                  autoResize
                />
                <small class="form-hint">Descrizione opzionale per identificare la tipologia di lead</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Business Rules Card -->
        <div class="q-card">
          <div class="q-card-header">
            <h3 class="card-title">
              <i class="pi pi-cog mr-2 text-primary-500"></i>
              Regole di Business
            </h3>
          </div>
          <div class="q-card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Max Shares -->
              <div class="form-group">
                <label for="max_shares">Numero Massimo Condivisioni *</label>
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
                  Numero massimo di volte che un lead può essere venduto in modalità condivisa
                </small>
              </div>

              <!-- Sort Order -->
              <div class="form-group">
                <label for="sort_order">Ordine di Visualizzazione</label>
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
                <small v-else class="form-hint">Ordine di visualizzazione nelle liste</small>
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
                      Categoria Attiva
                    </label>
                    <p class="text-sm text-neutral-600 mt-1">
                      Se attiva, i lead di questa categoria saranno visibili e acquistabili dai clienti
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
              <h4 class="font-medium text-warning-dark mb-1">Attenzione</h4>
              <p class="text-sm text-warning-dark/80">
                Questa categoria contiene {{ category.leads_count }} lead. 
                Disattivandola, questi lead non saranno più visibili né acquistabili dai clienti.
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
