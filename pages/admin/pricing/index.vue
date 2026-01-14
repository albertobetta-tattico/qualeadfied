<script setup lang="ts">
/**
 * Admin Pricing Page - Gestione Listini Prezzi per Categoria
 * Matrice prezzi esclusivo/condiviso per ogni categoria
 */
import { useCatalogFormatters, useCatalogActions, usePricingValidation } from '~/composables/useCatalog'
import type { Category, CategoryPriceWithCategory, CategoryPriceForm } from '~/types/catalog'

definePageMeta({
  layout: 'admin'
})

// Store & Composables
const pricingStore = usePricingStore()
const { formatCurrency, formatDate, formatDateTime, formatActiveStatus, getActiveStatusSeverity } = useCatalogFormatters()
const { showSuccess, showError, showWarning } = useCatalogActions()
const router = useRouter()

// Refs
const showFilters = ref(false)
const editDialog = ref(false)
const selectedCategory = ref<CategoryPriceWithCategory | null>(null)
const isCreatingNew = ref(false)

// Form state
const priceForm = reactive<CategoryPriceForm>({
  exclusive_price: 0,
  shared_prices: {}
})

// Filters
const searchQuery = ref('')
const categoryFilter = ref<number | ''>('')

// Computed
const categoryPrices = computed(() => pricingStore.categoryPricesWithCategory)
const categories = computed(() => pricingStore.categories)
const categoriesForSelect = computed(() => pricingStore.categoriesForSelect)
const categoriesWithoutPrices = computed(() => pricingStore.categoriesWithoutPrices)
const loading = computed(() => pricingStore.loading)
const saving = computed(() => pricingStore.saving)
const pagination = computed(() => pricingStore.pagination)
const stats = computed(() => pricingStore.pricingStats)
const hasActiveFilters = computed(() => pricingStore.hasActiveFilters)

// Pagination
const first = ref(0)
const rows = ref(20)

// Methods
const loadData = async () => {
  await Promise.all([
    pricingStore.fetchCategoryPrices(),
    pricingStore.fetchAllCategories(),
    pricingStore.fetchPricingStats()
  ])
}

const applyFilters = () => {
  pricingStore.setFilters({
    search: searchQuery.value,
    category_id: categoryFilter.value
  })
  pricingStore.fetchCategoryPrices()
}

const clearFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  pricingStore.resetFilters()
  pricingStore.fetchCategoryPrices()
}

const onPage = (event: any) => {
  pricingStore.setFilters({
    page: event.page + 1,
    per_page: event.rows
  })
  pricingStore.fetchCategoryPrices()
}

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>
const onSearchInput = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

// Edit Price Dialog
const openEditDialog = (priceData: CategoryPriceWithCategory) => {
  selectedCategory.value = priceData
  isCreatingNew.value = false
  
  // Populate form
  priceForm.exclusive_price = priceData.exclusive_price
  priceForm.shared_prices = { ...priceData.shared_prices }
  
  editDialog.value = true
}

const openCreateDialog = (category: Category) => {
  selectedCategory.value = {
    id: 0,
    category_id: category.id,
    category: category,
    exclusive_price: 0,
    shared_prices: generateEmptySharedPrices(category.max_shares),
    valid_from: new Date().toISOString(),
    valid_to: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  isCreatingNew.value = true
  
  // Initialize form
  priceForm.exclusive_price = 0
  priceForm.shared_prices = generateEmptySharedPrices(category.max_shares)
  
  editDialog.value = true
}

// Generate empty shared prices object
const generateEmptySharedPrices = (maxShares: number): Record<string, number> => {
  const prices: Record<string, number> = {}
  for (let i = 1; i <= maxShares; i++) {
    prices[`slot_${i}`] = 0
  }
  return prices
}

// Ensure shared_prices has all slots for category
const ensureAllSlots = (maxShares: number) => {
  for (let i = 1; i <= maxShares; i++) {
    const key = `slot_${i}`
    if (!(key in priceForm.shared_prices)) {
      priceForm.shared_prices[key] = 0
    }
  }
}

// Get sorted slot keys
const getSortedSlotKeys = (sharedPrices: Record<string, number>): string[] => {
  return Object.keys(sharedPrices).sort((a, b) => {
    const numA = parseInt(a.replace('slot_', ''))
    const numB = parseInt(b.replace('slot_', ''))
    return numA - numB
  })
}

// Get slot number from key
const getSlotNumber = (key: string): number => {
  return parseInt(key.replace('slot_', ''))
}

// Validate form
const validateForm = (): boolean => {
  if (priceForm.exclusive_price < 0) {
    showError('Il prezzo esclusivo deve essere un valore positivo')
    return false
  }
  
  for (const [key, value] of Object.entries(priceForm.shared_prices)) {
    if (value < 0) {
      showError(`Il prezzo per lo slot ${getSlotNumber(key)} deve essere positivo`)
      return false
    }
  }
  
  return true
}

// Save price
const savePrice = async () => {
  if (!selectedCategory.value) return
  if (!validateForm()) return
  
  const result = await pricingStore.updateCategoryPrice(
    selectedCategory.value.category_id,
    priceForm
  )
  
  if (result) {
    showSuccess(`Prezzi per "${selectedCategory.value.category.name}" salvati con successo`)
    editDialog.value = false
    await loadData()
  } else {
    showError(pricingStore.error || 'Errore nel salvataggio dei prezzi')
  }
}

// Copy price to all shared slots
const copyToAllSlots = () => {
  if (!selectedCategory.value) return
  
  const slots = getSortedSlotKeys(priceForm.shared_prices)
  if (slots.length === 0) return
  
  const firstSlotPrice = priceForm.shared_prices[slots[0]] || 0
  
  slots.forEach(key => {
    priceForm.shared_prices[key] = firstSlotPrice
  })
  
  showSuccess('Prezzo copiato su tutti gli slot')
}

// Format shared price summary
const formatSharedPriceSummary = (sharedPrices: Record<string, number>): string => {
  const prices = Object.values(sharedPrices)
  if (prices.length === 0) return '-'
  
  const allSame = prices.every(p => p === prices[0])
  if (allSame) {
    return formatCurrency(prices[0])
  }
  
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return `${formatCurrency(min)} - ${formatCurrency(max)}`
}

// Navigate to history
const navigateToHistory = () => {
  router.push('/admin/pricing/history')
}

// Lifecycle
onMounted(() => {
  loadData()
})

onUnmounted(() => {
  clearTimeout(searchTimeout)
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Listini Prezzi</h1>
        <p class="page-subtitle">Gestione prezzi per categoria merceologica</p>
      </div>
      <div class="page-header-actions">
        <PrimeButton
          label="Storico Prezzi"
          icon="pi pi-history"
          severity="secondary"
          outlined
          @click="navigateToHistory"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <div class="kpi-card">
        <div class="kpi-card-icon primary">
          <i class="pi pi-tag"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.total_categories || 0 }}</div>
        <div class="kpi-card-label">Categorie Totali</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon success">
          <i class="pi pi-euro"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.categories_with_prices || 0 }}</div>
        <div class="kpi-card-label">Con Prezzi Configurati</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon warning">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.categories_without_prices || 0 }}</div>
        <div class="kpi-card-label">Senza Prezzi</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon info">
          <i class="pi pi-calculator"></i>
        </div>
        <div class="kpi-card-value">{{ formatCurrency(stats?.avg_exclusive_price || 0) }}</div>
        <div class="kpi-card-label">Prezzo Medio Esclusivo</div>
      </div>
    </div>

    <!-- Alert for categories without prices -->
    <PrimeMessage 
      v-if="categoriesWithoutPrices.length > 0"
      severity="warn"
      :closable="false"
      class="mb-6"
    >
      <template #icon>
        <i class="pi pi-exclamation-triangle"></i>
      </template>
      <div class="flex items-center gap-4">
        <span>
          <strong>{{ categoriesWithoutPrices.length }} categorie</strong> non hanno ancora prezzi configurati.
        </span>
        <div class="flex gap-2 flex-wrap">
          <PrimeButton
            v-for="cat in categoriesWithoutPrices.slice(0, 3)"
            :key="cat.id"
            :label="cat.name"
            icon="pi pi-plus"
            severity="warning"
            text
            size="small"
            @click="openCreateDialog(cat)"
          />
          <span v-if="categoriesWithoutPrices.length > 3" class="text-sm text-warning-dark">
            e altre {{ categoriesWithoutPrices.length - 3 }}...
          </span>
        </div>
      </div>
    </PrimeMessage>

    <!-- Filters & Search -->
    <div class="q-card mb-6">
      <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <!-- Search -->
        <div class="flex-1 max-w-md">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search" />
            <PrimeInputText
              v-model="searchQuery"
              placeholder="Cerca per nome categoria..."
              class="w-full"
              @input="onSearchInput"
            />
          </span>
        </div>

        <!-- Filter Actions -->
        <div class="flex gap-3 items-center">
          <PrimeButton
            :label="showFilters ? 'Nascondi filtri' : 'Mostra filtri'"
            :icon="showFilters ? 'pi pi-filter-slash' : 'pi pi-filter'"
            severity="secondary"
            text
            @click="showFilters = !showFilters"
          />
          
          <PrimeButton
            v-if="hasActiveFilters"
            label="Pulisci filtri"
            icon="pi pi-times"
            severity="secondary"
            outlined
            size="small"
            @click="clearFilters"
          />
        </div>
      </div>

      <!-- Expanded Filters -->
      <Transition name="slide-up">
        <div v-if="showFilters" class="mt-4 pt-4 border-t border-neutral-200">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Category Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">Categoria</label>
              <PrimeSelect
                v-model="categoryFilter"
                :options="[{ label: 'Tutte le categorie', value: '' }, ...categoriesForSelect]"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleziona categoria"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Apply Button -->
            <div class="flex items-end">
              <PrimeButton
                label="Applica Filtri"
                icon="pi pi-check"
                severity="primary"
                @click="applyFilters"
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Data Table -->
    <div class="q-card">
      <PrimeDataTable
        :value="categoryPrices"
        :loading="loading"
        :rows="rows"
        :totalRecords="pagination.total"
        :lazy="true"
        :paginator="true"
        :rowsPerPageOptions="[10, 20, 50]"
        :first="first"
        dataKey="id"
        stripedRows
        showGridlines
        class="text-sm"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Mostra {first} - {last} di {totalRecords} listini"
        @page="onPage"
      >
        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-12">
            <i class="pi pi-euro text-4xl text-neutral-400 mb-4 block"></i>
            <p class="text-neutral-600 mb-4">Nessun listino prezzi trovato</p>
            <p class="text-sm text-neutral-500">
              I listini vengono creati automaticamente quando configuri i prezzi per una categoria.
            </p>
          </div>
        </template>

        <!-- Loading -->
        <template #loading>
          <div class="flex items-center justify-center py-8">
            <i class="pi pi-spin pi-spinner text-2xl text-primary-500 mr-3"></i>
            <span class="text-neutral-600">Caricamento listini...</span>
          </div>
        </template>

        <!-- Category Name -->
        <PrimeColumn field="category.name" header="Categoria" sortable style="min-width: 200px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <div 
                class="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm flex-shrink-0"
              >
                <i class="pi pi-tag"></i>
              </div>
              <div>
                <div class="font-medium text-neutral-900">{{ data.category.name }}</div>
                <div class="text-xs text-neutral-500">Max {{ data.category.max_shares }} condivisioni</div>
              </div>
            </div>
          </template>
        </PrimeColumn>

        <!-- Category Status -->
        <PrimeColumn field="category.is_active" header="Stato Cat." style="min-width: 100px">
          <template #body="{ data }">
            <PrimeTag 
              :value="formatActiveStatus(data.category.is_active)"
              :severity="getActiveStatusSeverity(data.category.is_active)"
            />
          </template>
        </PrimeColumn>

        <!-- Exclusive Price -->
        <PrimeColumn field="exclusive_price" header="Prezzo Esclusivo" sortable style="min-width: 150px">
          <template #body="{ data }">
            <span class="font-semibold text-primary-700 text-lg">
              {{ formatCurrency(data.exclusive_price) }}
            </span>
          </template>
        </PrimeColumn>

        <!-- Shared Prices -->
        <PrimeColumn header="Prezzi Condivisi" style="min-width: 180px">
          <template #body="{ data }">
            <div class="flex flex-col gap-1">
              <span class="font-medium text-neutral-700">
                {{ formatSharedPriceSummary(data.shared_prices) }}
              </span>
              <span class="text-xs text-neutral-500">
                {{ Object.keys(data.shared_prices).length }} slot
              </span>
            </div>
          </template>
        </PrimeColumn>

        <!-- Valid From -->
        <PrimeColumn field="valid_from" header="Valido Da" sortable style="min-width: 130px">
          <template #body="{ data }">
            <span class="text-neutral-600">{{ formatDate(data.valid_from) }}</span>
          </template>
        </PrimeColumn>

        <!-- Last Update -->
        <PrimeColumn field="updated_at" header="Ultimo Agg." sortable style="min-width: 130px">
          <template #body="{ data }">
            <span class="text-neutral-600">{{ formatDateTime(data.updated_at) }}</span>
          </template>
        </PrimeColumn>

        <!-- Actions -->
        <PrimeColumn header="Azioni" style="min-width: 100px" frozen alignFrozen="right">
          <template #body="{ data }">
            <div class="flex gap-1 justify-end">
              <PrimeButton
                icon="pi pi-pencil"
                severity="primary"
                text
                rounded
                size="small"
                v-tooltip.top="'Modifica prezzi'"
                @click="openEditDialog(data)"
              />
            </div>
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <!-- Edit Price Dialog -->
    <PrimeDialog
      v-model:visible="editDialog"
      modal
      :header="isCreatingNew ? 'Configura Prezzi' : 'Modifica Prezzi'"
      :style="{ width: '600px' }"
      class="pricing-dialog"
    >
      <div v-if="selectedCategory">
        <!-- Category Info -->
        <div class="bg-neutral-50 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
              <i class="pi pi-tag text-xl"></i>
            </div>
            <div>
              <div class="font-semibold text-neutral-900">{{ selectedCategory.category.name }}</div>
              <div class="text-sm text-neutral-500">
                Massimo {{ selectedCategory.category.max_shares }} condivisioni per lead
              </div>
            </div>
          </div>
        </div>

        <!-- Exclusive Price -->
        <div class="form-group">
          <label class="font-medium">
            <i class="pi pi-star-fill text-warning mr-2"></i>
            Prezzo Esclusivo
          </label>
          <p class="text-sm text-neutral-500 mb-3">
            Prezzo per acquisto in modalità esclusiva (lead venduto una sola volta)
          </p>
          <PrimeInputNumber
            v-model="priceForm.exclusive_price"
            :min="0"
            :max="10000"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            mode="currency"
            currency="EUR"
            locale="it-IT"
            class="w-full"
          />
        </div>

        <!-- Shared Prices -->
        <div class="form-group">
          <div class="flex items-center justify-between mb-3">
            <div>
              <label class="font-medium block">
                <i class="pi pi-users text-info mr-2"></i>
                Prezzi Condivisi
              </label>
              <p class="text-sm text-neutral-500">
                Prezzo per ogni slot di condivisione
              </p>
            </div>
            <PrimeButton
              label="Copia su tutti"
              icon="pi pi-copy"
              severity="secondary"
              text
              size="small"
              @click="copyToAllSlots"
              v-tooltip.left="'Copia il prezzo del primo slot su tutti gli altri'"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div 
              v-for="slotKey in getSortedSlotKeys(priceForm.shared_prices)" 
              :key="slotKey"
              class="flex flex-col"
            >
              <label class="text-sm text-neutral-600 mb-1">
                Slot {{ getSlotNumber(slotKey) }}
                <span class="text-xs text-neutral-400">
                  ({{ getSlotNumber(slotKey) }}° acquirente)
                </span>
              </label>
              <PrimeInputNumber
                v-model="priceForm.shared_prices[slotKey]"
                :min="0"
                :max="10000"
                :minFractionDigits="2"
                :maxFractionDigits="2"
                mode="currency"
                currency="EUR"
                locale="it-IT"
                class="w-full"
              />
            </div>
          </div>

          <PrimeMessage severity="info" :closable="false" class="mt-4">
            <span class="text-sm">
              In base alle specifiche, il prezzo condiviso è <strong>fisso</strong> indipendentemente 
              dallo slot già occupato. Puoi comunque differenziare i prezzi se necessario.
            </span>
          </PrimeMessage>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <PrimeButton
            label="Annulla"
            severity="secondary"
            outlined
            @click="editDialog = false"
          />
          <PrimeButton
            label="Salva Prezzi"
            severity="primary"
            icon="pi pi-check"
            :loading="saving"
            @click="savePrice"
          />
        </div>
      </template>
    </PrimeDialog>
  </div>
</template>

<style scoped>
/* Additional custom styles */
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  font-weight: 600;
}

:deep(.pricing-dialog .p-dialog-content) {
  padding-top: 1.5rem;
}

:deep(.p-inputnumber) {
  width: 100%;
}

:deep(.p-inputnumber-input) {
  width: 100%;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
