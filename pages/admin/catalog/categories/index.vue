<script setup lang="ts">
/**
 * Admin Categories Page - Gestione Categorie Merceologiche
 * CRUD completo con filtri, azioni e paginazione
 */
import { useCatalogFormatters, useCatalogActions } from '~/composables/useCatalog'
import type { Category } from '~/types/catalog'

definePageMeta({
  layout: 'admin'
})

const { t } = useI18n()

// Store & Composables
const catalogStore = useCatalogStore()
const {
  formatNumber,
  formatDate,
  formatActiveStatus,
  getActiveStatusSeverity,
  formatLeadAvailability,
  getAvailabilityClass
} = useCatalogFormatters()
const { confirmDeleteCategory, confirmToggleCategory, showSuccess, showError } = useCatalogActions()
const router = useRouter()

// Refs
const selectedCategories = ref<Category[]>([])
const showFilters = ref(false)
const deleteDialog = ref(false)
const categoryToDelete = ref<Category | null>(null)

// Filters
const searchQuery = ref('')
const activeFilter = ref<boolean | ''>('')

// Filter options
const activeOptions = computed(() => [
  { label: t('admin.catalog.categories.filters.all'), value: '' },
  { label: t('admin.catalog.categories.filters.active'), value: true },
  { label: t('admin.catalog.categories.filters.inactive'), value: false }
])

// Computed
const categories = computed(() => catalogStore.categories)
const loading = computed(() => catalogStore.loading)
const pagination = computed(() => catalogStore.categoryPagination)
const hasActiveFilters = computed(() => catalogStore.hasCategoryActiveFilters)
const stats = computed(() => catalogStore.categoryStats)

// Pagination
const first = ref(0)
const rows = ref(20)

// Methods
const loadCategories = async () => {
  await catalogStore.fetchCategories()
}

const applyFilters = () => {
  catalogStore.setCategoryFilters({
    search: searchQuery.value,
    is_active: activeFilter.value
  })
  loadCategories()
}

const clearFilters = () => {
  searchQuery.value = ''
  activeFilter.value = ''
  catalogStore.resetCategoryFilters()
  loadCategories()
}

const onPage = (event: any) => {
  catalogStore.setCategoryFilters({
    page: event.page + 1,
    per_page: event.rows
  })
  loadCategories()
}

const onSort = (event: any) => {
  catalogStore.setCategoryFilters({
    sort_by: event.sortField,
    sort_order: event.sortOrder === 1 ? 'asc' : 'desc'
  })
  loadCategories()
}

// Actions
const navigateToCreate = () => {
  router.push('/admin/catalog/categories/create')
}

const navigateToEdit = (category: Category) => {
  router.push(`/admin/catalog/categories/${category.id}`)
}

const handleToggleActive = (category: Category) => {
  confirmToggleCategory(category, async () => {
    const success = await catalogStore.toggleCategoryActive(category.id)
    if (success) {
      const action = category.is_active ? t('admin.catalog.categories.toast.deactivated') : t('admin.catalog.categories.toast.activated')
      showSuccess(t('admin.catalog.categories.toast.toggleSuccess', { name: category.name, action }))
    } else {
      showError(catalogStore.error || t('admin.catalog.categories.toast.toggleError'))
    }
  })
}

const openDeleteDialog = (category: Category) => {
  categoryToDelete.value = category
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!categoryToDelete.value) return

  const success = await catalogStore.deleteCategory(categoryToDelete.value.id)
  if (success) {
    showSuccess(t('admin.catalog.categories.toast.deleteSuccess', { name: categoryToDelete.value.name }))
    deleteDialog.value = false
    categoryToDelete.value = null
  } else {
    showError(catalogStore.error || t('admin.catalog.categories.toast.deleteError'))
  }
}

const exportCategories = () => {
  // TODO: Implementare export Excel
  showSuccess(t('admin.catalog.categories.toast.exportInProgress'))
}

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>
const onSearchInput = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadCategories(),
    catalogStore.fetchCategoryStats()
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
          <h1 class="page-title mb-0">{{ $t('admin.catalog.categories.title') }}</h1>
        </div>
        <p class="page-subtitle ml-12">{{ $t('admin.catalog.categories.description') }}</p>
      </div>
      <div class="page-header-actions">
        <PrimeButton
          :label="$t('admin.catalog.quickActions.newCategory')"
          icon="pi pi-plus"
          severity="primary"
          @click="navigateToCreate"
        />
        <PrimeButton
          :label="$t('admin.common.export')"
          icon="pi pi-download"
          severity="secondary"
          outlined
          @click="exportCategories"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <div class="kpi-card">
        <div class="kpi-card-icon primary">
          <i class="pi pi-tag"></i>
        </div>
        <div class="kpi-card-value">{{ formatNumber(stats?.total || 0) }}</div>
        <div class="kpi-card-label">{{ $t('admin.catalog.categories.stats.totalCategories') }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon success">
          <i class="pi pi-check-circle"></i>
        </div>
        <div class="kpi-card-value">{{ formatNumber(stats?.active || 0) }}</div>
        <div class="kpi-card-label">{{ $t('admin.catalog.categories.stats.activeCategories') }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon warning">
          <i class="pi pi-list"></i>
        </div>
        <div class="kpi-card-value">{{ formatNumber(stats?.total_leads || 0) }}</div>
        <div class="kpi-card-label">{{ $t('admin.catalog.categories.stats.totalLeads') }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon info">
          <i class="pi pi-check"></i>
        </div>
        <div class="kpi-card-value">{{ formatNumber(stats?.available_leads || 0) }}</div>
        <div class="kpi-card-label">{{ $t('admin.catalog.categories.stats.availableLeads') }}</div>
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
              :placeholder="$t('admin.catalog.categories.search.placeholder')"
              class="w-full"
              @input="onSearchInput"
            />
          </span>
        </div>

        <!-- Filter Actions -->
        <div class="flex gap-3 items-center">
          <PrimeButton
            :label="showFilters ? $t('admin.common.filters.hide') : $t('admin.common.filters.show')"
            :icon="showFilters ? 'pi pi-filter-slash' : 'pi pi-filter'"
            severity="secondary"
            text
            @click="showFilters = !showFilters"
          />

          <PrimeButton
            v-if="hasActiveFilters"
            :label="$t('admin.common.filters.clear')"
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
            <!-- Status Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.catalog.categories.table.headers.status') }}</label>
              <PrimeSelect
                v-model="activeFilter"
                :options="activeOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('admin.common.filters.selectStatus')"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Apply Button -->
            <div class="form-group mb-0 text-right">
              <label class="text-sm font-medium text-neutral-700 mb-2 block invisible">Azioni</label>
              <PrimeButton
                :label="$t('admin.common.filters.apply')"
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
        v-model:selection="selectedCategories"
        :value="categories"
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
        :currentPageReportTemplate="$t('admin.catalog.categories.table.paginatorTemplate')"
        @page="onPage"
        @sort="onSort"
      >
        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-12">
            <i class="pi pi-tag text-4xl text-neutral-400 mb-4 block"></i>
            <p class="text-neutral-600 mb-4">{{ $t('admin.catalog.categories.table.empty') }}</p>
            <PrimeButton
              :label="$t('admin.catalog.categories.table.createFirst')"
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
            <span class="text-neutral-600">{{ $t('admin.catalog.categories.table.loading') }}</span>
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
        <PrimeColumn field="name" :header="$t('admin.catalog.categories.table.headers.name')" sortable style="min-width: 200px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0"
              >
                <i class="pi pi-tag"></i>
              </div>
              <div>
                <div class="font-medium text-neutral-900">{{ data.name }}</div>
                <div class="text-xs text-neutral-500">{{ data.slug }}</div>
              </div>
            </div>
          </template>
        </PrimeColumn>

        <!-- Description -->
        <PrimeColumn field="description" :header="$t('admin.catalog.categories.table.headers.description')" style="min-width: 250px">
          <template #body="{ data }">
            <span class="text-neutral-600 text-sm line-clamp-2">
              {{ data.description || '-' }}
            </span>
          </template>
        </PrimeColumn>

        <!-- Max Shares -->
        <PrimeColumn field="max_shares" :header="$t('admin.catalog.categories.table.headers.maxShares')" sortable style="min-width: 130px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <i class="pi pi-users text-neutral-400"></i>
              <span class="font-medium">{{ data.max_shares }}</span>
            </div>
          </template>
        </PrimeColumn>

        <!-- Lead Count -->
        <PrimeColumn field="leads_count" header="Lead" sortable style="min-width: 140px">
          <template #body="{ data }">
            <div v-if="data.leads_count">
              <span :class="getAvailabilityClass(data.available_leads_count || 0, data.leads_count)">
                {{ formatLeadAvailability(data.available_leads_count || 0, data.leads_count) }}
              </span>
            </div>
            <span v-else class="text-neutral-400">{{ $t('admin.catalog.categories.table.noLeads') }}</span>
          </template>
        </PrimeColumn>

        <!-- Status -->
        <PrimeColumn field="is_active" :header="$t('admin.catalog.categories.table.headers.status')" sortable style="min-width: 100px">
          <template #body="{ data }">
            <PrimeTag
              :value="formatActiveStatus(data.is_active)"
              :severity="getActiveStatusSeverity(data.is_active)"
            />
          </template>
        </PrimeColumn>

        <!-- Created At -->
        <PrimeColumn field="created_at" :header="$t('admin.catalog.categories.table.headers.createdAt')" sortable style="min-width: 110px">
          <template #body="{ data }">
            <span class="text-neutral-600 text-sm">{{ formatDate(data.created_at) }}</span>
          </template>
        </PrimeColumn>

        <!-- Actions -->
        <PrimeColumn :header="$t('admin.common.actions')" style="min-width: 120px" frozen alignFrozen="right">
          <template #body="{ data }">
            <div class="flex gap-1 justify-end">
              <!-- Edit -->
              <PrimeButton
                icon="pi pi-pencil"
                severity="primary"
                text
                rounded
                size="small"
                v-tooltip.top="$t('admin.common.edit')"
                @click="navigateToEdit(data)"
              />

              <!-- Toggle Active -->
              <PrimeButton
                :icon="data.is_active ? 'pi pi-eye-slash' : 'pi pi-eye'"
                :severity="data.is_active ? 'warning' : 'success'"
                text
                rounded
                size="small"
                v-tooltip.top="data.is_active ? $t('admin.catalog.categories.actions.deactivate') : $t('admin.catalog.categories.actions.activate')"
                @click="handleToggleActive(data)"
              />

              <!-- Delete -->
              <PrimeButton
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                size="small"
                v-tooltip.top="$t('admin.common.delete')"
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
      :header="$t('admin.common.confirmDelete')"
      :style="{ width: '450px' }"
    >
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center flex-shrink-0">
          <i class="pi pi-exclamation-triangle text-2xl text-danger"></i>
        </div>
        <div>
          <p class="text-neutral-800 mb-2">
            {{ $t('admin.catalog.categories.dialog.deleteMessage', { name: categoryToDelete?.name }) }}
          </p>
          <p v-if="categoryToDelete?.leads_count" class="text-sm text-warning-dark bg-warning-light px-3 py-2 rounded">
            <i class="pi pi-exclamation-circle mr-1"></i>
            {{ $t('admin.catalog.categories.dialog.hasLeadsWarning', { count: categoryToDelete.leads_count }) }}
          </p>
          <p class="text-sm text-neutral-600 mt-2">
            {{ $t('admin.catalog.categories.dialog.irreversible') }}
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <PrimeButton
            :label="$t('admin.common.cancel')"
            severity="secondary"
            outlined
            @click="deleteDialog = false"
          />
          <PrimeButton
            :label="$t('admin.common.delete')"
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
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
