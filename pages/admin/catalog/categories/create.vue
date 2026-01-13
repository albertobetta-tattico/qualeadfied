<script setup lang="ts">
/**
 * Admin Categories - Create New Category
 * Form per la creazione di una nuova categoria merceologica
 */
import { useCategoryValidation, useCategoryForm, useCatalogActions, useCatalogFormatters } from '~/composables/useCatalog'
import type { CategoryCreateForm } from '~/types/catalog'

definePageMeta({
  layout: 'admin'
})

// Store & Composables
const catalogStore = useCatalogStore()
const router = useRouter()
const { errors, hasErrors, validateField, validateForm, clearErrors } = useCategoryValidation()
const { showSuccess, showError } = useCatalogActions()
const { generateSlug } = useCatalogFormatters()

// Form State
const form = reactive<CategoryCreateForm>({
  name: '',
  slug: '',
  description: '',
  max_shares: 3,
  is_active: true,
  sort_order: 0
})

// Auto-generate slug from name
const autoGenerateSlug = ref(true)

// Watch name changes to auto-generate slug
watch(() => form.name, (newName) => {
  if (autoGenerateSlug.value && newName) {
    form.slug = generateSlug(newName)
  }
})

// Validation on blur
const onBlur = (field: string, value: any) => {
  validateField(field, value)
}

// Disable auto-slug when manually editing
const onSlugFocus = () => {
  autoGenerateSlug.value = false
}

// Submit form
const onSubmit = async () => {
  clearErrors()
  
  if (!validateForm(form)) {
    showError('Correggi gli errori nel form prima di procedere')
    return
  }

  const category = await catalogStore.createCategory(form)
  
  if (category) {
    showSuccess(`Categoria "${category.name}" creata con successo`)
    router.push('/admin/catalog/categories')
  } else {
    showError(catalogStore.error || 'Errore nella creazione della categoria')
  }
}

// Cancel and go back
const onCancel = () => {
  router.push('/admin/catalog/categories')
}

// Load existing categories to get next sort order
onMounted(async () => {
  await catalogStore.fetchAllCategories()
  const maxSortOrder = Math.max(...catalogStore.categories.map(c => c.sort_order), 0)
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
          <h1 class="page-title mb-0">Nuova Categoria</h1>
        </div>
        <p class="page-subtitle ml-12">Crea una nuova categoria merceologica per i lead</p>
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
                  @focus="onSlugFocus"
                />
                <PrimeButton
                  icon="pi pi-sync"
                  severity="secondary"
                  outlined
                  v-tooltip.top="'Rigenera da nome'"
                  @click="form.slug = generateSlug(form.name); autoGenerateSlug = true"
                />
              </div>
              <small v-if="errors.slug" class="p-error">{{ errors.slug }}</small>
              <small v-else class="form-hint">Identificativo URL-friendly (solo lettere minuscole, numeri e trattini)</small>
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
                Numero massimo di volte che un lead può essere venduto in modalità condivisa (default: 3)
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
              <small v-else class="form-hint">Ordine di visualizzazione nelle liste (numeri più bassi vengono prima)</small>
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

      <!-- Info Box -->
      <div class="bg-info-light border border-info/20 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <i class="pi pi-info-circle text-info text-xl mt-0.5"></i>
          <div>
            <h4 class="font-medium text-info-dark mb-1">Informazioni sulla Categoria</h4>
            <p class="text-sm text-info-dark/80">
              Le categorie merceologiche definiscono il settore di appartenenza dei lead. 
              Il parametro "Max Condivisioni" stabilisce quante volte un lead può essere venduto 
              in modalità condivisa prima di diventare non disponibile.
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
          label="Crea Categoria"
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
