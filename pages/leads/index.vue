<script setup lang="ts">
/**
 * Page - Authenticated Lead Catalog
 * Full catalog with pricing and add to cart functionality
 * Table view with multi-selection for bulk cart add
 */
definePageMeta({
  layout: 'client'
})

const catalogStore = usePublicCatalogStore()
const cartStore = useCartStore()
const { formatCurrency, formatRelativeTime, formatDate } = useClientFormatters()
const { showAddedToCart, showError, showSuccess } = useClientToast()

// Selected leads for bulk actions
const selectedLeads = ref<any[]>([])
const bulkPurchaseMode = ref<'exclusive' | 'shared'>('shared')

// Filters state
const selectedCategory = ref<number | ''>('')
const selectedProvince = ref<number | ''>('')
const selectedMode = ref<'exclusive' | 'shared' | ''>('')
const dateRangeFilter = ref<Date[] | null>(null)

// Mode options
const modeOptions = [
  { label: 'Tutte le modalità', value: '' },
  { label: 'Esclusivo', value: 'exclusive' },
  { label: 'Condiviso', value: 'shared' }
]

// Bulk purchase mode options
const bulkModeOptions = [
  { label: 'Condiviso', value: 'shared' },
  { label: 'Esclusivo', value: 'exclusive' }
]

// Helper to format Date to string for API
const formatDateForApi = (date: Date | null | undefined): string => {
  if (!date) return ''
  return date.toISOString().split('T')[0]
}

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    catalogStore.fetchCategories(),
    catalogStore.fetchProvinces(),
    catalogStore.fetchLeads()
  ])
})

// Apply filters
const applyFilters = async () => {
  catalogStore.setFilters({
    category_id: selectedCategory.value || undefined,
    province_id: selectedProvince.value || undefined,
    mode: selectedMode.value || undefined,
    generated_from: formatDateForApi(dateRangeFilter.value?.[0]) || undefined,
    generated_to: formatDateForApi(dateRangeFilter.value?.[1]) || undefined
  })
  await catalogStore.fetchLeads()
}

// Reset filters
const resetFilters = async () => {
  selectedCategory.value = ''
  selectedProvince.value = ''
  selectedMode.value = ''
  dateRangeFilter.value = null
  catalogStore.resetFilters()
  await catalogStore.fetchLeads()
}

// Watch filters for auto-apply
watch([selectedCategory, selectedProvince, selectedMode], () => {
  applyFilters()
})

// Pagination
const onPageChange = async (event: any) => {
  catalogStore.setFilters({ page: event.page + 1 })
  await catalogStore.fetchLeads()
}

// Add single lead to cart
const addToCart = async (leadId: number, mode: 'exclusive' | 'shared') => {
  const success = await cartStore.addToCart({
    lead_id: leadId,
    purchase_mode: mode
  })

  if (success) {
    showAddedToCart()
  } else {
    showError(cartStore.error || 'Errore nell\'aggiunta al carrello')
  }
}

// Add multiple leads to cart
const addSelectedToCart = async () => {
  if (selectedLeads.value.length === 0) {
    showError('Seleziona almeno un lead')
    return
  }

  let addedCount = 0
  let errorCount = 0

  for (const lead of selectedLeads.value) {
    // Skip leads already in cart
    if (isInCart(lead.id)) {
      continue
    }

    const success = await cartStore.addToCart({
      lead_id: lead.id,
      purchase_mode: bulkPurchaseMode.value
    })

    if (success) {
      addedCount++
    } else {
      errorCount++
    }
  }

  if (addedCount > 0) {
    showSuccess(`${addedCount} lead aggiunti al carrello`)
  }
  if (errorCount > 0) {
    showError(`${errorCount} lead non aggiunti`)
  }

  selectedLeads.value = []
}

// Check if lead is in cart
const isInCart = (leadId: number): boolean => {
  return cartStore.isLeadInCart(leadId)
}

// Get cart item mode
const getCartItemMode = (leadId: number): string | null => {
  const item = cartStore.getItemByLeadId(leadId)
  return item?.purchase_mode || null
}

// Computed: count of selected leads not in cart
const selectableCount = computed(() => {
  return selectedLeads.value.filter(lead => !isInCart(lead.id)).length
})

// Calculate bulk total price
const bulkTotalPrice = computed(() => {
  return selectedLeads.value
    .filter(lead => !isInCart(lead.id))
    .reduce((sum, lead) => {
      const price = bulkPurchaseMode.value === 'exclusive'
        ? lead.base_price * 3
        : lead.base_price
      return sum + price
    }, 0)
})
</script>

<template>
  <div class="leads-catalog-page">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Catalogo Lead</h1>
        <p class="text-surface-600 dark:text-surface-400">
          {{ catalogStore.pagination.total }} lead disponibili
        </p>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink to="/carrello">
          <PrimeButton
            :label="`Carrello (${cartStore.itemCount})`"
            icon="pi pi-shopping-cart"
            :badge="cartStore.itemCount > 0 ? String(cartStore.itemCount) : undefined"
            :severity="cartStore.itemCount > 0 ? 'primary' : 'secondary'"
          />
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <PrimeCard class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Categoria
            </label>
            <PrimeSelect
              v-model="selectedCategory"
              :options="[{ id: '', name: 'Tutte le categorie' }, ...catalogStore.categories]"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleziona categoria"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Provincia
            </label>
            <PrimeSelect
              v-model="selectedProvince"
              :options="[{ id: '', name: 'Tutte le province' }, ...catalogStore.provinces]"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleziona provincia"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Modalità
            </label>
            <PrimeSelect
              v-model="selectedMode"
              :options="modeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleziona modalità"
              class="w-full"
            />
          </div>
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Data generazione
            </label>
            <PrimeDatePicker
              v-model="dateRangeFilter"
              selectionMode="range"
              dateFormat="dd/mm/yy"
              placeholder="Seleziona periodo"
              class="w-full"
              showIcon
              showButtonBar
              @date-select="applyFilters"
            />
          </div>
          <div class="flex items-end gap-2">
            <PrimeButton
              label="Filtra"
              icon="pi pi-search"
              @click="applyFilters"
            />
            <PrimeButton
              icon="pi pi-times"
              severity="secondary"
              @click="resetFilters"
            />
          </div>
        </div>
      </template>
    </PrimeCard>

    <!-- Bulk Actions Bar -->
    <Transition name="slide-down">
      <div v-if="selectedLeads.length > 0" class="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-4">
            <span class="text-primary-700 dark:text-primary-300 font-medium">
              {{ selectedLeads.length }} lead selezionati
              <span v-if="selectableCount < selectedLeads.length" class="text-sm text-primary-500">
                ({{ selectableCount }} acquistabili)
              </span>
            </span>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <label class="text-sm text-primary-700 dark:text-primary-300">Modalità:</label>
              <PrimeSelect
                v-model="bulkPurchaseMode"
                :options="bulkModeOptions"
                optionLabel="label"
                optionValue="value"
                class="w-32"
              />
            </div>
            <div class="text-right">
              <span class="text-sm text-primary-600 dark:text-primary-400">Totale:</span>
              <span class="ml-2 text-lg font-bold text-primary-700 dark:text-primary-300">
                {{ formatCurrency(bulkTotalPrice) }}
              </span>
            </div>
            <PrimeButton
              :label="`Aggiungi ${selectableCount} al carrello`"
              icon="pi pi-shopping-cart"
              @click="addSelectedToCart"
              :disabled="selectableCount === 0"
            />
            <PrimeButton
              icon="pi pi-times"
              severity="secondary"
              text
              rounded
              @click="selectedLeads = []"
              v-tooltip.top="'Deseleziona tutti'"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Loading State -->
    <div v-if="catalogStore.loading" class="flex justify-center py-12">
      <PrimeProgressSpinner />
    </div>

    <!-- Leads Table -->
    <PrimeCard v-else-if="catalogStore.leads.length > 0">
      <template #content>
        <PrimeDataTable
          v-model:selection="selectedLeads"
          :value="catalogStore.leads"
          dataKey="id"
          :paginator="true"
          :rows="catalogStore.pagination.per_page"
          :totalRecords="catalogStore.pagination.total"
          :lazy="true"
          :rowsPerPageOptions="[10, 25, 50]"
          stripedRows
          class="text-sm"
          @page="onPageChange"
        >
          <!-- Checkbox Column -->
          <PrimeColumn selectionMode="multiple" headerStyle="width: 3rem" />

          <!-- Lead ID -->
          <PrimeColumn field="id" header="ID" style="min-width: 80px">
            <template #body="{ data }">
              <span class="font-mono text-primary">#{{ data.id }}</span>
            </template>
          </PrimeColumn>

          <!-- Category -->
          <PrimeColumn header="Categoria" style="min-width: 130px">
            <template #body="{ data }">
              <PrimeTag :value="data.category?.name" severity="info" size="small" />
            </template>
          </PrimeColumn>

          <!-- Province -->
          <PrimeColumn header="Provincia" style="min-width: 100px">
            <template #body="{ data }">
              <span class="text-surface-700 dark:text-surface-300">
                {{ data.province?.name }}
                <span class="text-surface-500">({{ data.province?.code }})</span>
              </span>
            </template>
          </PrimeColumn>

          <!-- Request Preview -->
          <PrimeColumn header="Richiesta" style="min-width: 250px">
            <template #body="{ data }">
              <p class="text-surface-600 dark:text-surface-400 line-clamp-2">
                {{ data.request_preview }}
              </p>
            </template>
          </PrimeColumn>

          <!-- Availability -->
          <PrimeColumn header="Disponibilità" style="min-width: 120px">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <i class="pi pi-users text-surface-400"></i>
                <span class="text-surface-600 dark:text-surface-400">
                  {{ data.shared_slots_available }} slot
                </span>
              </div>
            </template>
          </PrimeColumn>

          <!-- Date -->
          <PrimeColumn header="Data" style="min-width: 100px">
            <template #body="{ data }">
              <span class="text-surface-500">{{ formatRelativeTime(data.generated_at) }}</span>
            </template>
          </PrimeColumn>

          <!-- Pricing -->
          <PrimeColumn header="Prezzo" style="min-width: 180px">
            <template #body="{ data }">
              <div class="flex gap-3">
                <div class="text-center">
                  <p class="text-xs text-surface-500">Esclusivo</p>
                  <p class="font-bold text-primary">{{ formatCurrency(data.base_price * 3) }}</p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-surface-500">Condiviso</p>
                  <p class="font-bold text-surface-700 dark:text-surface-300">{{ formatCurrency(data.base_price) }}</p>
                </div>
              </div>
            </template>
          </PrimeColumn>

          <!-- Actions -->
          <PrimeColumn header="Azioni" style="min-width: 200px" frozen alignFrozen="right">
            <template #body="{ data }">
              <div v-if="isInCart(data.id)" class="flex items-center gap-2">
                <i class="pi pi-check-circle text-green-500"></i>
                <span class="text-green-700 dark:text-green-400 text-sm font-medium">
                  Nel carrello ({{ getCartItemMode(data.id) === 'exclusive' ? 'Escl.' : 'Cond.' }})
                </span>
              </div>
              <div v-else class="flex gap-2">
                <PrimeButton
                  label="Esclusivo"
                  icon="pi pi-star"
                  size="small"
                  @click="addToCart(data.id, 'exclusive')"
                />
                <PrimeButton
                  label="Condiviso"
                  icon="pi pi-users"
                  size="small"
                  severity="secondary"
                  @click="addToCart(data.id, 'shared')"
                />
              </div>
            </template>
          </PrimeColumn>
        </PrimeDataTable>
      </template>
    </PrimeCard>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <i class="pi pi-inbox text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
      <h3 class="text-xl font-semibold text-surface-700 dark:text-surface-300 mb-2">
        Nessun lead trovato
      </h3>
      <p class="text-surface-500 dark:text-surface-400 mb-4">
        Prova a modificare i filtri di ricerca
      </p>
      <PrimeButton
        label="Reset filtri"
        icon="pi pi-refresh"
        @click="resetFilters"
      />
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Slide down transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
