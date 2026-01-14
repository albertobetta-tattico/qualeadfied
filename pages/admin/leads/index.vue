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
const dateFromFilter = ref<Date | null>(null)
const dateToFilter = ref<Date | null>(null)

// Helper to format Date to string for API
const formatDateForApi = (date: Date | null): string => {
  if (!date) return ''
  return date.toISOString().split('T')[0]
}

// Status options for dropdown
const statusOptions = [
  { label: 'Tutti gli stati', value: '' },
  { label: 'Disponibile', value: 'free' },
  { label: 'Venduto Esclusivo', value: 'sold_exclusive' },
  { label: 'Condiviso', value: 'sold_shared' },
  { label: 'Esaurito', value: 'exhausted' }
]

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
  { label: 'Tutte le categorie', value: '' },
  ...categories.value.map(c => ({ label: c.name, value: c.id }))
])

const provinceOptions = computed(() => [
  { label: 'Tutte le province', value: '' },
  ...provinces.value.map(p => ({ label: `${p.name} (${p.code})`, value: p.id }))
])

const sourceOptions = computed(() => [
  { label: 'Tutte le fonti', value: '' },
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
    generated_from: formatDateForApi(dateFromFilter.value),
    generated_to: formatDateForApi(dateToFilter.value)
  })
  loadLeads()
}

const clearFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  provinceFilter.value = ''
  sourceFilter.value = ''
  statusFilter.value = ''
  dateFromFilter.value = null
  dateToFilter.value = null
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

const navigateToSources = () => {
  router.push('/admin/leads/sources')
}

const openDeleteDialog = (lead: Lead) => {
  if (!canDelete(lead)) {
    showError('Non è possibile eliminare un lead già venduto')
    return
  }
  leadToDelete.value = lead
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!leadToDelete.value) return

  const success = await leadStore.deleteLead(leadToDelete.value.id)
  if (success) {
    showSuccess(`Lead di "${getFullName(leadToDelete.value)}" eliminato con successo`)
    deleteDialog.value = false
    leadToDelete.value = null
  } else {
    showError(leadStore.error || 'Errore nell\'eliminazione del lead')
  }
}

const handleBulkDelete = () => {
  if (deletableSelected.value.length === 0) {
    showWarning('Nessun lead selezionato può essere eliminato')
    return
  }

  confirmBulkDelete(deletableSelected.value.length, async () => {
    const ids = deletableSelected.value.map(l => l.id)
    const result = await leadStore.deleteLeads(ids)

    if (result.success > 0) {
      showSuccess(`${result.success} lead eliminati con successo`)
    }
    if (result.failed > 0) {
      showWarning(`${result.failed} lead non eliminati (già venduti)`)
    }

    selectedLeads.value = []
  })
}

const exportLeads = () => {
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
        <h1 class="page-title">Lead</h1>
        <p class="page-subtitle">Gestione lead della piattaforma</p>
      </div>
      <div class="page-header-actions">
        <PrimeButton
          label="Nuovo Lead"
          icon="pi pi-plus"
          severity="primary"
          @click="navigateToCreate"
        />
        <PrimeButton
          label="Import"
          icon="pi pi-upload"
          severity="secondary"
          outlined
          @click="navigateToImport"
        />
        <PrimeButton
          label="Sorgenti"
          icon="pi pi-link"
          severity="secondary"
          outlined
          @click="navigateToSources"
        />
        <PrimeButton
          label="Export"
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
        <div class="kpi-card-label">Lead Totali</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon success">
          <i class="pi pi-check-circle"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.free || 0 }}</div>
        <div class="kpi-card-label">Disponibili</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon info">
          <i class="pi pi-lock"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.sold_exclusive || 0 }}</div>
        <div class="kpi-card-label">Esclusivi</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon warning">
          <i class="pi pi-users"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.sold_shared || 0 }}</div>
        <div class="kpi-card-label">Condivisi</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon danger">
          <i class="pi pi-ban"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.exhausted || 0 }}</div>
        <div class="kpi-card-label">Esauriti</div>
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
              placeholder="Cerca per nome, email, telefono, richiesta..."
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
              {{ selectedLeads.length }} selezionati
            </span>
            <PrimeButton
              label="Elimina selezionati"
              icon="pi pi-trash"
              severity="danger"
              outlined
              size="small"
              @click="handleBulkDelete"
            />
            <PrimeDivider layout="vertical" class="h-8" />
          </template>

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
        <div v-if="showFilters" class="mt-6 pt-6 border-t border-neutral-200">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Category Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">Categoria</label>
              <PrimeSelect
                v-model="categoryFilter"
                :options="categoryOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleziona categoria"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Province Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">Provincia</label>
              <PrimeSelect
                v-model="provinceFilter"
                :options="provinceOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleziona provincia"
                class="w-full"
                :filter="true"
                filterPlaceholder="Cerca..."
                @change="applyFilters"
              />
            </div>

            <!-- Source Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">Fonte</label>
              <PrimeSelect
                v-model="sourceFilter"
                :options="sourceOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleziona fonte"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Status Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">Stato</label>
              <PrimeSelect
                v-model="statusFilter"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleziona stato"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Date From -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">Data generazione da</label>
              <PrimeDatePicker
                v-model="dateFromFilter"
                dateFormat="dd/mm/yy"
                placeholder="gg/mm/aaaa"
                class="w-full"
                showIcon
                @date-select="applyFilters"
              />
            </div>

            <!-- Date To -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">Data generazione a</label>
              <PrimeDatePicker
                v-model="dateToFilter"
                dateFormat="dd/mm/yy"
                placeholder="gg/mm/aaaa"
                class="w-full"
                showIcon
                @date-select="applyFilters"
              />
            </div>

            <!-- Apply Button -->
            <div class="flex items-end lg:col-span-2">
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
        currentPageReportTemplate="Mostra {first} - {last} di {totalRecords} lead"
        @page="onPage"
        @sort="onSort"
      >
        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-12">
            <i class="pi pi-list text-4xl text-neutral-400 mb-4 block"></i>
            <p class="text-neutral-600 mb-4">Nessun lead trovato</p>
            <div class="flex justify-center gap-3">
              <PrimeButton
                label="Aggiungi il primo lead"
                icon="pi pi-plus"
                severity="primary"
                @click="navigateToCreate"
              />
              <PrimeButton
                label="Importa da file"
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
            <span class="text-neutral-600">Caricamento lead...</span>
          </div>
        </template>

        <!-- Checkbox Column -->
        <PrimeColumn selectionMode="multiple" headerStyle="width: 3rem" />

        <!-- Contact Name -->
        <PrimeColumn field="first_name" header="Contatto" sortable style="min-width: 180px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm flex-shrink-0"
              >
                {{ data.first_name.charAt(0) }}{{ data.last_name.charAt(0) }}
              </div>
              <div>
                <div class="font-medium text-neutral-900">{{ getFullName(data) }}</div>
                <div class="text-xs text-neutral-500">{{ data.email }}</div>
              </div>
            </div>
          </template>
        </PrimeColumn>

        <!-- Phone -->
        <PrimeColumn field="phone" header="Telefono" style="min-width: 130px">
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
        <PrimeColumn field="category_id" header="Categoria" sortable style="min-width: 150px">
          <template #body="{ data }">
            <PrimeTag
              :value="data.category?.name || '-'"
              severity="secondary"
            />
          </template>
        </PrimeColumn>

        <!-- Province -->
        <PrimeColumn field="province_id" header="Provincia" sortable style="min-width: 120px">
          <template #body="{ data }">
            <span class="text-neutral-700">
              {{ data.province?.name || '-' }}
              <span v-if="data.province?.code" class="text-neutral-500">({{ data.province.code }})</span>
            </span>
          </template>
        </PrimeColumn>

        <!-- Request Preview -->
        <PrimeColumn field="request_text" header="Richiesta" style="min-width: 200px">
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
        <PrimeColumn field="status" header="Stato" sortable style="min-width: 140px">
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
        <PrimeColumn field="source_id" header="Fonte" style="min-width: 120px">
          <template #body="{ data }">
            <span class="text-neutral-600 text-sm">
              {{ data.source?.name || '-' }}
            </span>
          </template>
        </PrimeColumn>

        <!-- Generated Date -->
        <PrimeColumn field="generated_at" header="Data Lead" sortable style="min-width: 110px">
          <template #body="{ data }">
            <span class="text-neutral-600">{{ formatDate(data.generated_at) }}</span>
          </template>
        </PrimeColumn>

        <!-- Actions -->
        <PrimeColumn header="Azioni" style="min-width: 100px" frozen alignFrozen="right">
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

              <!-- Delete -->
              <PrimeButton
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                size="small"
                v-tooltip.top="canDelete(data) ? 'Elimina' : 'Non eliminabile'"
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
      header="Conferma Eliminazione"
      :style="{ width: '450px' }"
    >
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center flex-shrink-0">
          <i class="pi pi-exclamation-triangle text-2xl text-danger"></i>
        </div>
        <div>
          <p class="text-neutral-800 mb-2">
            Sei sicuro di voler eliminare il lead di <strong>{{ leadToDelete ? getFullName(leadToDelete) : '' }}</strong>?
          </p>
          <p class="text-sm text-neutral-600">
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
