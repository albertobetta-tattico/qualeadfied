<script setup lang="ts">
/**
 * Admin Leads Page - Elenco Lead
 * Gestione completa dei lead con filtri avanzati, azioni e paginazione
 */
import { useLeadFormatters, useLeadActions } from '~/composables/useLead'
import type { Lead, LeadStatus, Category } from '~/types/lead'

definePageMeta({
  layout: 'admin'
})

const { t } = useI18n()

// Store & Composables
const leadStore = useLeadStore()
const {
  formatStatus,
  getStatusSeverity,
  getStatusIcon,
  formatSharesDisplay,
  formatDate,
  getFullName,
  truncateText,
  canDelete
} = useLeadFormatters()
const { confirmDelete, confirmBulkDelete, showSuccess, showError, showWarning } = useLeadActions()
const router = useRouter()

// Refs
const selectedLeads = ref<Lead[]>([])
const showFilters = ref(false)
const deleteDialog = ref(false)
const leadToDelete = ref<Lead | null>(null)

// Filters (Date filters use Date | null for DatePicker component)
const searchQuery = ref('')
const categoryFilter = ref<number | ''>('')
const provinceFilter = ref<number | ''>('')
const sourceFilter = ref<number | ''>('')
const statusFilter = ref<LeadStatus | ''>('')
const modeFilter = ref<'exclusive' | 'shared' | ''>('')
const dateRangeFilter = ref<Date[] | null>(null)

// Helper to format Date to string for API
const formatDateForApi = (date: Date | null | undefined): string => {
  if (!date) return ''
  return date.toISOString().split('T')[0]
}

// Status options for dropdown
const statusOptions = computed(() => [
  { label: t('admin.leads.list.filters.statusOptions.all'), value: '' },
  { label: t('admin.leads.list.filters.statusOptions.free'), value: 'free' },
  { label: t('admin.leads.list.filters.statusOptions.soldExclusive'), value: 'sold_exclusive' },
  { label: t('admin.leads.list.filters.statusOptions.shared'), value: 'sold_shared' },
  { label: t('admin.leads.list.filters.statusOptions.exhausted'), value: 'exhausted' }
])

// Mode options for dropdown
const modeOptions = computed(() => [
  { label: t('admin.leads.list.filters.modeOptions.all'), value: '' },
  { label: t('admin.leads.list.filters.modeOptions.exclusive'), value: 'exclusive' },
  { label: t('admin.leads.list.filters.modeOptions.shared'), value: 'shared' }
])

// Computed
const leads = computed(() => leadStore.leads)
const loading = computed(() => leadStore.loading)
const pagination = computed(() => leadStore.pagination)
const hasActiveFilters = computed(() => leadStore.hasActiveFilters)
const categories = computed(() => leadStore.activeCategories)
const provinces = computed(() => leadStore.activeProvinces)
const sources = computed(() => leadStore.activeSources)
const stats = computed(() => leadStore.stats)

// Computed for select options
const categoryOptions = computed(() => [
  { label: t('admin.leads.list.filters.allCategories'), value: '' },
  ...categories.value.map(c => ({ label: c.name, value: c.id }))
])

const provinceOptions = computed(() => [
  { label: t('admin.leads.list.filters.allProvinces'), value: '' },
  ...provinces.value.map(p => ({ label: `${p.name} (${p.code})`, value: p.id }))
])

const sourceOptions = computed(() => [
  { label: t('admin.leads.list.filters.allSources'), value: '' },
  ...sources.value.map(s => ({ label: s.name, value: s.id }))
])

// Pagination
const first = ref(0)
const rows = ref(10)

// Conta lead selezionabili per eliminazione
const deletableSelected = computed(() =>
  selectedLeads.value.filter(l => canDelete(l))
)

// Methods
const loadData = async () => {
  await Promise.all([
    leadStore.fetchSupportData(),
    leadStore.fetchLeads(),
    leadStore.fetchStats()
  ])
}

const loadLeads = async () => {
  await leadStore.fetchLeads()
}

const applyFilters = () => {
  leadStore.setFilters({
    search: searchQuery.value,
    category_id: categoryFilter.value,
    province_id: provinceFilter.value,
    source_id: sourceFilter.value,
    status: statusFilter.value,
    mode: modeFilter.value,
    generated_from: formatDateForApi(dateRangeFilter.value?.[0]),
    generated_to: formatDateForApi(dateRangeFilter.value?.[1])
  })
  loadLeads()
}

const clearFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  provinceFilter.value = ''
  sourceFilter.value = ''
  statusFilter.value = ''
  modeFilter.value = ''
  dateRangeFilter.value = null
  leadStore.resetFilters()
  loadLeads()
}

const onPage = (event: any) => {
  leadStore.setFilters({
    page: event.page + 1,
    per_page: event.rows
  })
  loadLeads()
}

const onSort = (event: any) => {
  leadStore.setFilters({
    sort_by: event.sortField,
    sort_order: event.sortOrder === 1 ? 'asc' : 'desc'
  })
  loadLeads()
}

// Actions
const navigateToCreate = () => {
  router.push('/admin/leads/create')
}

const navigateToEdit = (lead: Lead) => {
  router.push(`/admin/leads/${lead.id}`)
}

const navigateToImport = () => {
  router.push('/admin/leads/import')
}

const openDeleteDialog = (lead: Lead) => {
  if (!canDelete(lead)) {
    showError(t('admin.leads.list.toast.cannotDelete'))
    return
  }
  leadToDelete.value = lead
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!leadToDelete.value) return

  const success = await leadStore.deleteLead(leadToDelete.value.id)
  if (success) {
    showSuccess(t('admin.leads.list.toast.deleteSuccess', { name: getFullName(leadToDelete.value) }))
    deleteDialog.value = false
    leadToDelete.value = null
  } else {
    showError(leadStore.error || t('admin.leads.list.toast.deleteError'))
  }
}

const handleBulkDelete = () => {
  if (deletableSelected.value.length === 0) {
    showWarning(t('admin.leads.list.toast.noDeletable'))
    return
  }

  confirmBulkDelete(deletableSelected.value.length, async () => {
    const ids = deletableSelected.value.map(l => l.id)
    const result = await leadStore.deleteLeads(ids)

    if (result.success > 0) {
      showSuccess(t('admin.leads.list.toast.bulkDeleteSuccess', { count: result.success }))
    }
    if (result.failed > 0) {
      showWarning(t('admin.leads.list.toast.bulkDeleteFailed', { count: result.failed }))
    }

    selectedLeads.value = []
  })
}

const exportLeads = () => {
  // TODO: Implementare export Excel
  showSuccess(t('admin.leads.list.toast.exportStarted'))
}

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>
const onSearchInput = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

// Get category for lead (for max_shares display)
const getCategoryForLead = (lead: Lead): Category | undefined => {
  return leadStore.getCategoryById(lead.category_id)
}

// Badge styling per stato
const getStatusClass = (status: LeadStatus): string => {
  const classes: Record<LeadStatus, string> = {
    free: 'bg-success-light text-success-dark',
    sold_exclusive: 'bg-info-light text-info-dark',
    sold_shared: 'bg-warning-light text-warning-dark',
    exhausted: 'bg-danger-light text-danger-dark'
  }
  return classes[status] || 'bg-neutral-100 text-neutral-600'
}

// Lifecycle
onMounted(() => {
  loadData()
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
        <h1 class="page-title">{{ $t('admin.leads.list.title') }}</h1>
        <p class="page-subtitle">{{ $t('admin.leads.list.subtitle') }}</p>
      </div>
      <div class="page-header-actions">
        <PrimeButton
          :label="$t('admin.leads.list.actions.newLead')"
          icon="pi pi-plus"
          severity="primary"
          @click="navigateToCreate"
        />
        <PrimeButton
          :label="$t('admin.leads.list.actions.import')"
          icon="pi pi-upload"
          severity="secondary"
          outlined
          @click="navigateToImport"
        />
        <PrimeButton
          :label="$t('admin.leads.list.actions.export')"
          icon="pi pi-download"
          severity="secondary"
          text
          @click="exportLeads"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      <div class="kpi-card">
        <div class="kpi-card-icon primary">
          <i class="pi pi-list"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.total || 0 }}</div>
        <div class="kpi-card-label">{{ $t('admin.leads.list.kpis.totalLeads') }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon success">
          <i class="pi pi-check-circle"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.free || 0 }}</div>
        <div class="kpi-card-label">{{ $t('admin.leads.list.kpis.available') }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon info">
          <i class="pi pi-lock"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.sold_exclusive || 0 }}</div>
        <div class="kpi-card-label">{{ $t('admin.leads.list.kpis.exclusive') }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon warning">
          <i class="pi pi-users"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.sold_shared || 0 }}</div>
        <div class="kpi-card-label">{{ $t('admin.leads.list.kpis.shared') }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon danger">
          <i class="pi pi-ban"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.exhausted || 0 }}</div>
        <div class="kpi-card-label">{{ $t('admin.leads.list.kpis.exhausted') }}</div>
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
              :placeholder="$t('admin.leads.list.search.placeholder')"
              class="w-full"
              @input="onSearchInput"
            />
          </span>
        </div>

        <!-- Filter Actions -->
        <div class="flex gap-3 items-center">
          <!-- Bulk Actions -->
          <template v-if="selectedLeads.length > 0">
            <span class="text-sm text-neutral-600">
              {{ $t('admin.leads.list.actions.selected', { count: selectedLeads.length }) }}
            </span>
            <PrimeButton
              :label="$t('admin.leads.list.actions.bulkDelete')"
              icon="pi pi-trash"
              severity="danger"
              outlined
              size="small"
              @click="handleBulkDelete"
            />
            <PrimeDivider layout="vertical" class="h-8" />
          </template>

          <PrimeButton
            :label="showFilters ? $t('admin.leads.list.filters.hideFilters') : $t('admin.leads.list.filters.showFilters')"
            :icon="showFilters ? 'pi pi-filter-slash' : 'pi pi-filter'"
            severity="secondary"
            text
            @click="showFilters = !showFilters"
          />

          <PrimeButton
            v-if="hasActiveFilters"
            :label="$t('admin.leads.list.filters.clearFilters')"
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
        <div v-if="showFilters" class="mt-6 pt-6 border-t border-neutral-200">
          <!-- First row: 4 filters -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <!-- Category Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.leads.list.filters.category') }}</label>
              <PrimeSelect
                v-model="categoryFilter"
                :options="categoryOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('admin.leads.list.filters.category')"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Province Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.leads.list.filters.province') }}</label>
              <PrimeSelect
                v-model="provinceFilter"
                :options="provinceOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('admin.leads.list.filters.province')"
                class="w-full"
                :filter="true"
                :filterPlaceholder="$t('admin.leads.list.filters.searchPlaceholder')"
                @change="applyFilters"
              />
            </div>

            <!-- Source Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.leads.list.filters.source') }}</label>
              <PrimeSelect
                v-model="sourceFilter"
                :options="sourceOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('admin.leads.list.filters.source')"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Status Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.leads.list.filters.status') }}</label>
              <PrimeSelect
                v-model="statusFilter"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('admin.leads.list.filters.status')"
                class="w-full"
                @change="applyFilters"
              />
            </div>
          </div>

          <!-- Second row: Mode, Date Range, Apply Button -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Mode Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.leads.list.filters.mode') }}</label>
              <PrimeSelect
                v-model="modeFilter"
                :options="modeOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('admin.leads.list.filters.mode')"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Date Range -->
            <div class="form-group mb-0 lg:col-span-2">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.leads.list.filters.dateFrom') }}</label>
              <PrimeDatePicker
                v-model="dateRangeFilter"
                selectionMode="range"
                dateFormat="dd/mm/yy"
                :placeholder="$t('admin.leads.list.filters.dateTo')"
                class="w-full"
                showIcon
                showButtonBar
                @date-select="applyFilters"
              />
            </div>

            <!-- Apply Button -->
            <div class="form-group mb-0 text-right">
              <label class="text-sm font-medium text-neutral-700 mb-2 block invisible">Azioni</label>
              <PrimeButton
                :label="$t('admin.leads.list.filters.applyFilters')"
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
        v-model:selection="selectedLeads"
        :value="leads"
        :loading="loading"
        :rows="rows"
        :totalRecords="pagination.total"
        :lazy="true"
        :paginator="true"
        :rowsPerPageOptions="[10, 25, 50, 100]"
        :first="first"
        dataKey="id"
        stripedRows
        showGridlines
        removableSort
        class="text-sm"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :currentPageReportTemplate="$t('admin.leads.list.table.paginatorTemplate')"
        @page="onPage"
        @sort="onSort"
      >
        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-12">
            <i class="pi pi-list text-4xl text-neutral-400 mb-4 block"></i>
            <p class="text-neutral-600 mb-4">{{ $t('admin.leads.list.table.empty') }}</p>
            <div class="flex justify-center gap-3">
              <PrimeButton
                :label="$t('admin.leads.list.actions.newLead')"
                icon="pi pi-plus"
                severity="primary"
                @click="navigateToCreate"
              />
              <PrimeButton
                :label="$t('admin.leads.list.actions.import')"
                icon="pi pi-upload"
                severity="secondary"
                outlined
                @click="navigateToImport"
              />
            </div>
          </div>
        </template>

        <!-- Loading -->
        <template #loading>
          <div class="flex items-center justify-center py-8">
            <i class="pi pi-spin pi-spinner text-2xl text-primary-500 mr-3"></i>
            <span class="text-neutral-600">{{ $t('admin.leads.list.table.loading') }}</span>
          </div>
        </template>

        <!-- Checkbox Column -->
        <PrimeColumn selectionMode="multiple" headerStyle="width: 3rem" />

        <!-- Contact Name -->
        <PrimeColumn field="full_name" :header="$t('admin.leads.list.table.headers.contact')" sortable style="min-width: 180px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm flex-shrink-0"
              >
                {{ data.full_name?.charAt(0) || '?' }}
              </div>
              <div>
                <div class="font-medium text-neutral-900">{{ data.full_name }}</div>
                <div class="text-xs text-neutral-500">{{ data.email }}</div>
              </div>
            </div>
          </template>
        </PrimeColumn>

        <!-- Phone -->
        <PrimeColumn field="phone" :header="$t('admin.leads.list.table.headers.phone')" style="min-width: 130px">
          <template #body="{ data }">
            <a
              :href="`tel:${data.phone}`"
              class="text-neutral-700 hover:text-primary-600"
            >
              {{ data.phone }}
            </a>
          </template>
        </PrimeColumn>

        <!-- Category -->
        <PrimeColumn field="category_id" :header="$t('admin.leads.list.table.headers.category')" sortable style="min-width: 150px">
          <template #body="{ data }">
            <PrimeTag
              :value="data.category?.name || '-'"
              severity="secondary"
            />
          </template>
        </PrimeColumn>

        <!-- Province -->
        <PrimeColumn field="province_id" :header="$t('admin.leads.list.table.headers.province')" sortable style="min-width: 120px">
          <template #body="{ data }">
            <span class="text-neutral-700">
              <template v-if="data.province">
                {{ data.province.name }}
                <span class="text-neutral-500">({{ data.province.code }})</span>
              </template>
              <span v-else class="text-neutral-400">N/D</span>
            </span>
          </template>
        </PrimeColumn>

        <!-- Request Preview -->
        <PrimeColumn field="request_text" :header="$t('admin.leads.list.table.headers.request')" style="min-width: 200px">
          <template #body="{ data }">
            <span
              class="text-neutral-600 text-sm"
              v-tooltip.top="data.request_text"
            >
              {{ truncateText(data.request_text, 60) }}
            </span>
          </template>
        </PrimeColumn>

        <!-- Status -->
        <PrimeColumn field="status" :header="$t('admin.leads.list.table.headers.status')" sortable style="min-width: 140px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                :class="getStatusClass(data.status)"
              >
                <i class="pi mr-1" :class="getStatusIcon(data.status)"></i>
                {{ formatStatus(data.status) }}
              </span>
              <span
                v-if="data.status === 'sold_shared'"
                class="text-xs text-neutral-500"
              >
                ({{ formatSharesDisplay(data, getCategoryForLead(data)) }})
              </span>
            </div>
          </template>
        </PrimeColumn>

        <!-- Source -->
        <PrimeColumn field="source_id" :header="$t('admin.leads.list.table.headers.source')" style="min-width: 120px">
          <template #body="{ data }">
            <span class="text-neutral-600 text-sm">
              {{ data.source?.name || '-' }}
            </span>
          </template>
        </PrimeColumn>

        <!-- Generated Date -->
        <PrimeColumn field="generated_at" :header="$t('admin.leads.list.table.headers.leadDate')" sortable style="min-width: 110px">
          <template #body="{ data }">
            <span class="text-neutral-600">{{ formatDate(data.generated_at) }}</span>
          </template>
        </PrimeColumn>

        <!-- Actions -->
        <PrimeColumn :header="$t('admin.leads.list.table.headers.actions')" style="min-width: 100px" frozen alignFrozen="right">
          <template #body="{ data }">
            <div class="flex gap-1 justify-end">
              <!-- Edit -->
              <PrimeButton
                icon="pi pi-pencil"
                severity="primary"
                text
                rounded
                size="small"
                v-tooltip.top="$t('admin.leads.list.contextMenu.edit')"
                @click="navigateToEdit(data)"
              />

              <!-- Delete -->
              <PrimeButton
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                size="small"
                v-tooltip.top="canDelete(data) ? $t('admin.leads.list.contextMenu.delete') : $t('admin.leads.list.contextMenu.notDeletable')"
                :disabled="!canDelete(data)"
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
      :header="$t('admin.leads.list.dialog.deleteTitle')"
      :style="{ width: '450px' }"
    >
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center flex-shrink-0">
          <i class="pi pi-exclamation-triangle text-2xl text-danger"></i>
        </div>
        <div>
          <p class="text-neutral-800 mb-2">
            {{ $t('admin.leads.list.dialog.deleteSingleMessage', { name: leadToDelete ? getFullName(leadToDelete) : '' }) }}
          </p>
          <p class="text-sm text-neutral-600">
            {{ $t('admin.leads.list.dialog.deleteIrreversible') }}
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <PrimeButton
            :label="$t('admin.leads.list.dialog.cancel')"
            severity="secondary"
            outlined
            @click="deleteDialog = false"
          />
          <PrimeButton
            :label="$t('admin.leads.list.dialog.confirm')"
            severity="danger"
            icon="pi pi-trash"
            :loading="leadStore.saving"
            @click="handleDelete"
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
