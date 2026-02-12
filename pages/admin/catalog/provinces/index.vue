<script setup lang="ts">
/**
 * Admin Provinces Page - Gestione Province
 * Lista province italiane pre-popolate con possibilità di attivazione/disattivazione
 */
import { useCatalogFormatters, useCatalogActions } from '~/composables/useCatalog'
import type { Province } from '~/types/catalog'
import { ITALIAN_REGIONS } from '~/types/catalog'

definePageMeta({
  layout: 'admin'
})

const { t } = useI18n()

// Store & Composables
const catalogStore = useCatalogStore()
const { formatNumber, formatActiveStatus, getActiveStatusSeverity } = useCatalogFormatters()
const { showSuccess, showError } = useCatalogActions()
const router = useRouter()

// Refs
const selectedProvinces = ref<Province[]>([])
const showFilters = ref(false)

// Filters
const searchQuery = ref('')
const regionFilter = ref('')
const activeFilter = ref<boolean | ''>('')

// Filter options
const regionOptions = computed(() => [
  { label: t('admin.catalog.provinces.filters.allRegions'), value: '' },
  ...ITALIAN_REGIONS.map(r => ({ label: r, value: r }))
])

const activeOptions = computed(() => [
  { label: t('admin.catalog.provinces.filters.all'), value: '' },
  { label: t('admin.catalog.provinces.filters.active'), value: true },
  { label: t('admin.catalog.provinces.filters.inactive'), value: false }
])

// Computed
const provinces = computed(() => catalogStore.provinces)
const loading = computed(() => catalogStore.loading)
const pagination = computed(() => catalogStore.provincePagination)
const hasActiveFilters = computed(() => catalogStore.hasProvinceActiveFilters)
const stats = computed(() => catalogStore.provinceStats)
const uniqueRegions = computed(() => catalogStore.uniqueRegions)

// Pagination
const first = ref(0)
const rows = ref(20)

// Methods
const loadProvinces = async () => {
  await catalogStore.fetchProvinces()
}

const applyFilters = () => {
  catalogStore.setProvinceFilters({
    search: searchQuery.value,
    region: regionFilter.value,
    is_active: activeFilter.value
  })
  loadProvinces()
}

const clearFilters = () => {
  searchQuery.value = ''
  regionFilter.value = ''
  activeFilter.value = ''
  catalogStore.resetProvinceFilters()
  loadProvinces()
}

const onPage = (event: any) => {
  catalogStore.setProvinceFilters({
    page: event.page + 1,
    per_page: event.rows
  })
  loadProvinces()
}

const onSort = (event: any) => {
  catalogStore.setProvinceFilters({
    sort_by: event.sortField,
    sort_order: event.sortOrder === 1 ? 'asc' : 'desc'
  })
  loadProvinces()
}

// Actions
const handleToggleActive = async (province: Province) => {
  const success = await catalogStore.toggleProvinceActive(province.id)
  if (success) {
    const action = province.is_active ? t('admin.catalog.provinces.toast.deactivated') : t('admin.catalog.provinces.toast.activated')
    showSuccess(t('admin.catalog.provinces.toast.toggleSuccess', { name: province.name, action }))
  } else {
    showError(catalogStore.error || t('admin.catalog.provinces.toast.toggleError'))
  }
}

const bulkToggle = async (active: boolean) => {
  if (selectedProvinces.value.length === 0) return

  let successCount = 0

  for (const province of selectedProvinces.value) {
    if (province.is_active !== active) {
      const success = await catalogStore.toggleProvinceActive(province.id)
      if (success) successCount++
    }
  }

  if (successCount > 0) {
    showSuccess(t('admin.catalog.provinces.toast.bulkToggleSuccess', { count: successCount, action: active ? t('admin.catalog.provinces.toast.activatedPlural') : t('admin.catalog.provinces.toast.deactivatedPlural') }))
    selectedProvinces.value = []
  }
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
    loadProvinces(),
    catalogStore.fetchProvinceStats()
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
          <h1 class="page-title mb-0">{{ $t('admin.catalog.provinces.title') }}</h1>
        </div>
        <p class="page-subtitle ml-12">{{ $t('admin.catalog.provinces.subtitle') }}</p>
      </div>
      <div class="page-header-actions">
        <PrimeButton
          v-if="selectedProvinces.length > 0"
          :label="$t('admin.catalog.provinces.actions.activateSelected')"
          icon="pi pi-check"
          severity="success"
          size="small"
          @click="bulkToggle(true)"
        />
        <PrimeButton
          v-if="selectedProvinces.length > 0"
          :label="$t('admin.catalog.provinces.actions.deactivateSelected')"
          icon="pi pi-times"
          severity="warning"
          size="small"
          outlined
          @click="bulkToggle(false)"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <div class="kpi-card">
        <div class="kpi-card-icon primary">
          <i class="pi pi-map-marker"></i>
        </div>
        <div class="kpi-card-value">{{ formatNumber(stats?.total || 0) }}</div>
        <div class="kpi-card-label">{{ $t('admin.catalog.provinces.stats.totalProvinces') }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon success">
          <i class="pi pi-check-circle"></i>
        </div>
        <div class="kpi-card-value">{{ formatNumber(stats?.active || 0) }}</div>
        <div class="kpi-card-label">{{ $t('admin.catalog.provinces.stats.activeProvinces') }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon warning">
          <i class="pi pi-times-circle"></i>
        </div>
        <div class="kpi-card-value">{{ formatNumber(stats?.inactive || 0) }}</div>
        <div class="kpi-card-label">{{ $t('admin.catalog.provinces.stats.inactiveProvinces') }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon info">
          <i class="pi pi-globe"></i>
        </div>
        <div class="kpi-card-value">{{ Object.keys(stats?.by_region || {}).length }}</div>
        <div class="kpi-card-label">{{ $t('admin.catalog.provinces.regions') }}</div>
      </div>
    </div>

    <!-- Info Banner -->
    <div class="bg-info-light border border-info/20 rounded-lg p-4 mb-6">
      <div class="flex items-start gap-3">
        <i class="pi pi-info-circle text-info text-xl mt-0.5"></i>
        <div>
          <h4 class="font-medium text-info-dark mb-1">{{ $t('admin.catalog.provinces.info.title') }}</h4>
          <p class="text-sm text-info-dark/80">
            {{ $t('admin.catalog.provinces.info.description') }}
          </p>
        </div>
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
              :placeholder="$t('admin.catalog.provinces.search.placeholder')"
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
            <!-- Region Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.catalog.provinces.table.headers.region') }}</label>
              <PrimeSelect
                v-model="regionFilter"
                :options="regionOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('admin.catalog.provinces.filters.selectRegion')"
                class="w-full"
                :filter="true"
                :filterPlaceholder="$t('admin.catalog.provinces.filters.searchRegion')"
                @change="applyFilters"
              />
            </div>

            <!-- Status Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.catalog.provinces.table.headers.status') }}</label>
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
            <div class="flex items-end">
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
        v-model:selection="selectedProvinces"
        :value="provinces"
        :loading="loading"
        :rows="rows"
        :totalRecords="pagination.total"
        :lazy="true"
        :paginator="true"
        :rowsPerPageOptions="[20, 50, 100, 200]"
        :first="first"
        dataKey="id"
        stripedRows
        showGridlines
        removableSort
        class="text-sm"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :currentPageReportTemplate="$t('admin.catalog.provinces.table.paginatorTemplate')"
        @page="onPage"
        @sort="onSort"
      >
        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-12">
            <i class="pi pi-map-marker text-4xl text-neutral-400 mb-4 block"></i>
            <p class="text-neutral-600">{{ $t('admin.catalog.provinces.table.empty') }}</p>
          </div>
        </template>

        <!-- Loading -->
        <template #loading>
          <div class="flex items-center justify-center py-8">
            <i class="pi pi-spin pi-spinner text-2xl text-primary-500 mr-3"></i>
            <span class="text-neutral-600">{{ $t('admin.catalog.provinces.table.loading') }}</span>
          </div>
        </template>

        <!-- Checkbox Column -->
        <PrimeColumn selectionMode="multiple" headerStyle="width: 3rem" />

        <!-- Province Code -->
        <PrimeColumn field="code" :header="$t('admin.catalog.provinces.table.headers.code')" sortable style="min-width: 80px">
          <template #body="{ data }">
            <span class="font-mono font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded">
              {{ data.code }}
            </span>
          </template>
        </PrimeColumn>

        <!-- Province Name -->
        <PrimeColumn field="name" :header="$t('admin.catalog.provinces.table.headers.name')" sortable style="min-width: 200px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center flex-shrink-0"
              >
                <i class="pi pi-map-marker text-sm"></i>
              </div>
              <span class="font-medium text-neutral-900">{{ data.name }}</span>
            </div>
          </template>
        </PrimeColumn>

        <!-- Region -->
        <PrimeColumn field="region" :header="$t('admin.catalog.provinces.table.headers.region')" sortable style="min-width: 180px">
          <template #body="{ data }">
            <span class="text-neutral-700">{{ data.region }}</span>
          </template>
        </PrimeColumn>

        <!-- Lead Count (if available) -->
        <PrimeColumn v-if="provinces.some(p => p.leads_count !== undefined)" field="leads_count" header="Lead" sortable style="min-width: 100px">
          <template #body="{ data }">
            <span class="text-neutral-600">{{ formatNumber(data.leads_count || 0) }}</span>
          </template>
        </PrimeColumn>

        <!-- Status -->
        <PrimeColumn field="is_active" :header="$t('admin.catalog.provinces.table.headers.status')" sortable style="min-width: 100px">
          <template #body="{ data }">
            <PrimeTag
              :value="formatActiveStatus(data.is_active)"
              :severity="getActiveStatusSeverity(data.is_active)"
            />
          </template>
        </PrimeColumn>

        <!-- Actions -->
        <PrimeColumn :header="$t('admin.common.actions')" style="min-width: 80px" frozen alignFrozen="right">
          <template #body="{ data }">
            <div class="flex gap-1 justify-end">
              <!-- Toggle Active -->
              <PrimeButton
                :icon="data.is_active ? 'pi pi-eye-slash' : 'pi pi-eye'"
                :severity="data.is_active ? 'warning' : 'success'"
                text
                rounded
                size="small"
                v-tooltip.top="data.is_active ? $t('admin.catalog.provinces.actions.deactivate') : $t('admin.catalog.provinces.actions.activate')"
                @click="handleToggleActive(data)"
              />
            </div>
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>
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
