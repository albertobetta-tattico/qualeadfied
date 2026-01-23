<script setup lang="ts">
/**
 * Admin Packages Page - Gestione Pacchetti Lead
 * CRUD completo con filtri, azioni e paginazione
 */
import { useCatalogFormatters, useCatalogActions } from '~/composables/useCatalog'
import type { Package } from '~/types/catalog'

definePageMeta({
  layout: 'admin'
})

// Store & Composables
const catalogStore = useCatalogStore()
const { 
  formatNumber, 
  formatCurrency,
  formatDate, 
  formatActiveStatus, 
  getActiveStatusSeverity,
  formatPackageType,
  formatAcquisitionModes
} = useCatalogFormatters()
const { confirmDeletePackage, confirmTogglePackage, showSuccess, showError } = useCatalogActions()
const router = useRouter()

// Refs
const selectedPackages = ref<Package[]>([])
const showFilters = ref(false)
const deleteDialog = ref(false)
const packageToDelete = ref<Package | null>(null)

// Filters
const searchQuery = ref('')
const categoryFilter = ref<number | ''>('')
const activeFilter = ref<boolean | ''>('')

// Filter options
const activeOptions = [
  { label: 'Tutti', value: '' },
  { label: 'Attivi', value: true },
  { label: 'Non attivi', value: false }
]

// Computed
const packages = computed(() => catalogStore.packages)
const loading = computed(() => catalogStore.loading)
const pagination = computed(() => catalogStore.packagePagination)
const hasActiveFilters = computed(() => catalogStore.hasPackageActiveFilters)
const stats = computed(() => catalogStore.packageStats)
const categoryOptions = computed(() => [
  { label: 'Tutte le categorie', value: '' },
  { label: '--- Multi-Categoria ---', value: null, disabled: true },
  { label: 'Tutte le categorie', value: -1 }, // Special value for null category_id
  ...catalogStore.categoriesForSelect
])

// Pagination
const first = ref(0)
const rows = ref(20)

// Methods
const loadPackages = async () => {
  await catalogStore.fetchPackages()
}

const applyFilters = () => {
  catalogStore.setPackageFilters({
    search: searchQuery.value,
    category_id: categoryFilter.value === -1 ? undefined : categoryFilter.value,
    is_active: activeFilter.value
  })
  loadPackages()
}

const clearFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  activeFilter.value = ''
  catalogStore.resetPackageFilters()
  loadPackages()
}

const onPage = (event: any) => {
  catalogStore.setPackageFilters({
    page: event.page + 1,
    per_page: event.rows
  })
  loadPackages()
}

const onSort = (event: any) => {
  catalogStore.setPackageFilters({
    sort_by: event.sortField,
    sort_order: event.sortOrder === 1 ? 'asc' : 'desc'
  })
  loadPackages()
}

// Actions
const navigateToCreate = () => {
  router.push('/admin/catalog/packages/create')
}

const navigateToEdit = (pkg: Package) => {
  router.push(`/admin/catalog/packages/${pkg.id}`)
}

const handleToggleActive = (pkg: Package) => {
  confirmTogglePackage(pkg, async () => {
    const success = await catalogStore.togglePackageActive(pkg.id)
    if (success) {
      const action = pkg.is_active ? 'disattivato' : 'attivato'
      showSuccess(`Pacchetto "${pkg.name}" ${action} con successo`)
    } else {
      showError(catalogStore.error || 'Errore nel cambio stato')
    }
  })
}

const openDeleteDialog = (pkg: Package) => {
  packageToDelete.value = pkg
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!packageToDelete.value) return
  
  const success = await catalogStore.deletePackage(packageToDelete.value.id)
  if (success) {
    showSuccess(`Pacchetto "${packageToDelete.value.name}" eliminato con successo`)
    deleteDialog.value = false
    packageToDelete.value = null
  } else {
    showError(catalogStore.error || 'Errore nell\'eliminazione del pacchetto')
  }
}

const exportPackages = () => {
  // TODO: Implementare export Excel
  showSuccess('Export in corso...')
}

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>
const onSearchInput = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

// Get category badge class
const getCategoryBadgeClass = (pkg: Package) => {
  if (pkg.category_ids.length === 0) {
    return 'bg-purple-100 text-purple-700'
  }
  return 'bg-primary-100 text-primary-700'
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadPackages(),
    catalogStore.fetchPackageStats(),
    catalogStore.fetchAllCategories()
  ])
})

// Cleanup
onUnmounted(() => {
  clearTimeout(searchTimeout)
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
            @click="router.push('/admin/catalog')"
          />
          <h1 class="page-title mb-0">Pacchetti Lead</h1>
        </div>
        <p class="page-subtitle ml-12">Configura bundle di lead acquistabili dai clienti</p>
      </div>
      <div class="page-header-actions">
        <PrimeButton 
          label="Nuovo Pacchetto" 
          icon="pi pi-plus" 
          severity="primary"
          @click="navigateToCreate"
        />
        <PrimeButton 
          label="Export" 
          icon="pi pi-download" 
          severity="secondary"
          outlined
          @click="exportPackages"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <div class="kpi-card">
        <div class="kpi-card-icon primary">
          <i class="pi pi-box"></i>
        </div>
        <div class="kpi-card-value">{{ formatNumber(stats?.total || 0) }}</div>
        <div class="kpi-card-label">Pacchetti Totali</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon success">
          <i class="pi pi-check-circle"></i>
        </div>
        <div class="kpi-card-value">{{ formatNumber(stats?.active || 0) }}</div>
        <div class="kpi-card-label">Pacchetti Attivi</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon warning">
          <i class="pi pi-shopping-cart"></i>
        </div>
        <div class="kpi-card-value">{{ formatNumber(stats?.total_sales || 0) }}</div>
        <div class="kpi-card-label">Vendite Totali</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon info">
          <i class="pi pi-euro"></i>
        </div>
        <div class="kpi-card-value">{{ formatCurrency(stats?.total_revenue || 0) }}</div>
        <div class="kpi-card-label">Ricavi Totali</div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="q-card mb-6">
      <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <!-- Search -->
        <div class="flex-1 max-w-md">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search" />
            <PrimeInputText
              v-model="searchQuery"
              placeholder="Cerca per nome, descrizione..."
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
                :options="categoryOptions"
                optionLabel="label"
                optionValue="value"
                optionDisabled="disabled"
                placeholder="Seleziona categoria"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Status Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">Stato</label>
              <PrimeSelect
                v-model="activeFilter"
                :options="activeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleziona stato"
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
        v-model:selection="selectedPackages"
        :value="packages"
        :loading="loading"
        :rows="rows"
        :totalRecords="pagination.total"
        :lazy="true"
        :paginator="true"
        :rowsPerPageOptions="[10, 20, 50, 100]"
        :first="first"
        dataKey="id"
        stripedRows
        showGridlines
        removableSort
        class="text-sm"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Mostra {first} - {last} di {totalRecords} pacchetti"
        @page="onPage"
        @sort="onSort"
      >
        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-12">
            <i class="pi pi-box text-4xl text-neutral-400 mb-4 block"></i>
            <p class="text-neutral-600 mb-4">Nessun pacchetto trovato</p>
            <PrimeButton
              label="Crea il primo pacchetto"
              icon="pi pi-plus"
              severity="primary"
              @click="navigateToCreate"
            />
          </div>
        </template>

        <!-- Loading -->
        <template #loading>
          <div class="flex items-center justify-center py-8">
            <i class="pi pi-spin pi-spinner text-2xl text-primary-500 mr-3"></i>
            <span class="text-neutral-600">Caricamento pacchetti...</span>
          </div>
        </template>

        <!-- Checkbox Column -->
        <PrimeColumn selectionMode="multiple" headerStyle="width: 3rem" />

        <!-- Sort Order -->
        <PrimeColumn field="sort_order" header="#" sortable style="min-width: 60px">
          <template #body="{ data }">
            <span class="text-neutral-500 text-sm">{{ data.sort_order }}</span>
          </template>
        </PrimeColumn>

        <!-- Name -->
        <PrimeColumn field="name" header="Nome Pacchetto" sortable style="min-width: 200px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <div 
                class="w-10 h-10 rounded-lg bg-warning-light text-warning-dark flex items-center justify-center flex-shrink-0"
              >
                <i class="pi pi-box"></i>
              </div>
              <div>
                <div class="font-medium text-neutral-900">{{ data.name }}</div>
                <div class="text-xs text-neutral-500 line-clamp-1">{{ data.description || '-' }}</div>
              </div>
            </div>
          </template>
        </PrimeColumn>

        <!-- Categories -->
        <PrimeColumn header="Categorie" style="min-width: 200px">
          <template #body="{ data }">
            <div v-if="data.category_ids.length === 0" class="flex flex-wrap gap-1">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"
              >
                <i class="pi pi-globe mr-1"></i>
                Tutte le categorie
              </span>
            </div>
            <div v-else class="flex flex-wrap gap-1">
              <span
                v-for="category in data.categories"
                :key="category.id"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700"
              >
                {{ category.name }}
              </span>
            </div>
          </template>
        </PrimeColumn>

        <!-- Lead Quantity -->
        <PrimeColumn field="lead_quantity" header="Lead" sortable style="min-width: 100px">
          <template #body="{ data }">
            <span class="font-semibold text-neutral-900">{{ formatNumber(data.lead_quantity) }}</span>
          </template>
        </PrimeColumn>

        <!-- Price -->
        <PrimeColumn field="price" header="Prezzo" sortable style="min-width: 120px">
          <template #body="{ data }">
            <span class="font-semibold text-success">{{ formatCurrency(data.price) }}</span>
          </template>
        </PrimeColumn>

        <!-- Acquisition Modes -->
        <PrimeColumn header="Modalità" style="min-width: 150px">
          <template #body="{ data }">
            <div class="flex flex-wrap gap-1">
              <span 
                v-if="data.allows_exclusive" 
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700"
              >
                Esclusivo
              </span>
              <span 
                v-if="data.allows_shared" 
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700"
              >
                Condiviso
              </span>
            </div>
          </template>
        </PrimeColumn>

        <!-- Sales Count -->
        <PrimeColumn field="sales_count" header="Vendite" sortable style="min-width: 90px">
          <template #body="{ data }">
            <span class="text-neutral-600">{{ formatNumber(data.sales_count || 0) }}</span>
          </template>
        </PrimeColumn>

        <!-- Status -->
        <PrimeColumn field="is_active" header="Stato" sortable style="min-width: 100px">
          <template #body="{ data }">
            <PrimeTag 
              :value="formatActiveStatus(data.is_active)"
              :severity="getActiveStatusSeverity(data.is_active)"
            />
          </template>
        </PrimeColumn>

        <!-- Actions -->
        <PrimeColumn header="Azioni" style="min-width: 120px" frozen alignFrozen="right">
          <template #body="{ data }">
            <div class="flex gap-1 justify-end">
              <!-- Edit -->
              <PrimeButton
                icon="pi pi-pencil"
                severity="primary"
                text
                rounded
                size="small"
                v-tooltip.top="'Modifica'"
                @click="navigateToEdit(data)"
              />

              <!-- Toggle Active -->
              <PrimeButton
                :icon="data.is_active ? 'pi pi-eye-slash' : 'pi pi-eye'"
                :severity="data.is_active ? 'warning' : 'success'"
                text
                rounded
                size="small"
                v-tooltip.top="data.is_active ? 'Disattiva' : 'Attiva'"
                @click="handleToggleActive(data)"
              />

              <!-- Delete -->
              <PrimeButton
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                size="small"
                v-tooltip.top="'Elimina'"
                @click="openDeleteDialog(data)"
              />
            </div>
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <!-- Delete Confirmation Dialog -->
    <PrimeDialog
      v-model:visible="deleteDialog"
      modal
      header="Conferma Eliminazione"
      :style="{ width: '450px' }"
    >
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center flex-shrink-0">
          <i class="pi pi-exclamation-triangle text-2xl text-danger"></i>
        </div>
        <div>
          <p class="text-neutral-800 mb-2">
            Sei sicuro di voler eliminare il pacchetto <strong>{{ packageToDelete?.name }}</strong>?
          </p>
          <p v-if="packageToDelete?.sales_count" class="text-sm text-warning-dark bg-warning-light px-3 py-2 rounded">
            <i class="pi pi-exclamation-circle mr-1"></i>
            Questo pacchetto è stato venduto {{ packageToDelete.sales_count }} volte.
          </p>
          <p class="text-sm text-neutral-600 mt-2">
            Questa azione non può essere annullata.
          </p>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-3">
          <PrimeButton
            label="Annulla"
            severity="secondary"
            outlined
            @click="deleteDialog = false"
          />
          <PrimeButton
            label="Elimina"
            severity="danger"
            icon="pi pi-trash"
            :loading="catalogStore.saving"
            @click="handleDelete"
          />
        </div>
      </template>
    </PrimeDialog>
  </div>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  font-weight: 600;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
