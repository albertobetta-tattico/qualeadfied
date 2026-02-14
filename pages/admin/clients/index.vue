<script setup lang="ts">
/**
 * Admin Clients Page - Elenco Clienti B2B
 * Gestione completa dei clienti con filtri, azioni e paginazione
 */
import { useClientFormatters, useClientActions } from '~/composables/useClient'
import type { Client, ClientStatus } from '~/types/client'

definePageMeta({
  layout: 'admin'
})

const { t } = useI18n()

// Store & Composables
const clientStore = useClientStore()
const { formatStatus, getStatusSeverity, formatDate, getContactFullName, getFreeTrialRemaining } = useClientFormatters()
const { confirmDelete, confirmSuspend, confirmResetPassword, showSuccess, showError } = useClientActions()
const router = useRouter()

// Refs
const selectedClients = ref<Client[]>([])
const showFilters = ref(false)
const deleteDialog = ref(false)
const clientToDelete = ref<Client | null>(null)

// Filters
const searchQuery = ref('')
const statusFilter = ref<ClientStatus | ''>('')
const freeTrialFilter = ref<'active' | 'inactive' | 'exhausted' | ''>('')

// Status options for dropdown
const statusOptions = computed(() => [
  { label: t('admin.clients.list.filters.statusOptions.all'), value: '' },
  { label: t('admin.clients.list.filters.statusOptions.active'), value: 'active' },
  { label: t('admin.clients.list.filters.statusOptions.pending'), value: 'pending' },
  { label: t('admin.clients.list.filters.statusOptions.suspended'), value: 'suspended' }
])

// Free trial options
const freeTrialOptions = computed(() => [
  { label: t('admin.clients.list.filters.freeTrialOptions.all'), value: '' },
  { label: t('admin.clients.list.filters.freeTrialOptions.active'), value: 'active' },
  { label: t('admin.clients.list.filters.freeTrialOptions.inactive'), value: 'inactive' },
  { label: t('admin.clients.list.filters.freeTrialOptions.exhausted'), value: 'exhausted' }
])

// Computed
const clients = computed(() => clientStore.clients)
const loading = computed(() => clientStore.loading)
const pagination = computed(() => clientStore.pagination)
const hasActiveFilters = computed(() => clientStore.hasActiveFilters)

// Pagination
const first = ref(0)
const rows = ref(10)

// Methods
const loadClients = async () => {
  await clientStore.fetchClients()
}

const applyFilters = () => {
  clientStore.setFilters({
    search: searchQuery.value,
    status: statusFilter.value,
    free_trial: freeTrialFilter.value
  })
  loadClients()
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  freeTrialFilter.value = ''
  clientStore.resetFilters()
  loadClients()
}

const onPage = (event: any) => {
  clientStore.setFilters({
    page: event.page + 1,
    per_page: event.rows
  })
  loadClients()
}

const onSort = (event: any) => {
  clientStore.setFilters({
    sort_by: event.sortField,
    sort_order: event.sortOrder === 1 ? 'asc' : 'desc'
  })
  loadClients()
}

// Actions
const navigateToCreate = () => {
  router.push('/admin/clients/create')
}

const navigateToEdit = (client: Client) => {
  router.push(`/admin/clients/${client.id}`)
}

const handleSuspend = async (client: Client) => {
  confirmSuspend(client, async () => {
    const success = await clientStore.suspendClient(client.id)
    if (success) {
      showSuccess(t('admin.clients.list.toast.suspendSuccess', { name: client.company_name }))
    } else {
      showError(clientStore.error || t('admin.clients.list.toast.suspendError'))
    }
  })
}

const handleActivate = async (client: Client) => {
  const success = await clientStore.activateClient(client.id)
  if (success) {
    showSuccess(t('admin.clients.list.toast.activateSuccess', { name: client.company_name }))
  } else {
    showError(clientStore.error || t('admin.clients.list.toast.activateError'))
  }
}

const handleResetPassword = (client: Client) => {
  confirmResetPassword(client, async () => {
    const success = await clientStore.resetPassword(client.id)
    if (success) {
      showSuccess(t('admin.clients.list.toast.resetPasswordSuccess', { email: client.email }))
    } else {
      showError(clientStore.error || t('admin.clients.list.toast.resetPasswordError'))
    }
  })
}

const openDeleteDialog = (client: Client) => {
  clientToDelete.value = client
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!clientToDelete.value) return
  
  const success = await clientStore.deleteClient(clientToDelete.value.id)
  if (success) {
    showSuccess(t('admin.clients.list.toast.deleteSuccess', { name: clientToDelete.value.company_name }))
    deleteDialog.value = false
    clientToDelete.value = null
  } else {
    showError(clientStore.error || t('admin.clients.list.toast.deleteError'))
  }
}

const exportClients = () => {
  // TODO: Implementare export Excel
  showSuccess(t('admin.clients.list.toast.exportStarted'))
}

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>
const onSearchInput = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

// Free trial badge class
const getFreeTrialClass = (client: Client) => {
  if (!client.free_trial_enabled) return 'bg-neutral-100 text-neutral-600'
  const remaining = getFreeTrialRemaining(client)
  if (remaining === 0) return 'bg-danger-light text-danger-dark'
  if (remaining <= 1) return 'bg-warning-light text-warning-dark'
  return 'bg-success-light text-success-dark'
}

const getFreeTrialLabel = (client: Client) => {
  if (!client.free_trial_enabled) return t('admin.clients.list.table.freeTrialLabels.inactive')
  const remaining = getFreeTrialRemaining(client)
  if (remaining === 0) return t('admin.clients.list.table.freeTrialLabels.exhausted')
  return t('admin.clients.list.table.freeTrialLabels.remaining', { remaining, total: client.free_trial_leads_total })
}

// Lifecycle
onMounted(() => {
  loadClients()
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
        <h1 class="page-title">{{ $t('admin.clients.list.title') }}</h1>
        <p class="page-subtitle">{{ $t('admin.clients.list.subtitle') }}</p>
      </div>
      <div class="page-header-actions">
        <PrimeButton
          :label="$t('admin.clients.list.actions.newClient')"
          icon="pi pi-plus"
          severity="primary"
          @click="navigateToCreate"
        />
        <PrimeButton
          :label="$t('admin.clients.list.actions.export')"
          icon="pi pi-download"
          severity="secondary"
          outlined
          @click="exportClients"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <div class="kpi-card">
        <div class="kpi-card-icon primary">
          <i class="pi pi-users"></i>
        </div>
        <div class="kpi-card-value">{{ pagination.total || 0 }}</div>
        <div class="kpi-card-label">{{ $t('admin.clients.list.kpis.totalClients') }}</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon success">
          <i class="pi pi-check-circle"></i>
        </div>
        <div class="kpi-card-value">{{ clientStore.activeClients.length }}</div>
        <div class="kpi-card-label">{{ $t('admin.clients.list.kpis.activeClients') }}</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon warning">
          <i class="pi pi-clock"></i>
        </div>
        <div class="kpi-card-value">{{ clientStore.pendingClients.length }}</div>
        <div class="kpi-card-label">{{ $t('admin.clients.list.kpis.pending') }}</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon info">
          <i class="pi pi-gift"></i>
        </div>
        <div class="kpi-card-value">{{ clientStore.clientsWithFreeTrial.length }}</div>
        <div class="kpi-card-label">{{ $t('admin.clients.list.kpis.withFreeTrial') }}</div>
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
              :placeholder="$t('admin.clients.list.search.placeholder')"
              class="w-full"
              @input="onSearchInput"
            />
          </span>
        </div>

        <!-- Filter Actions -->
        <div class="flex gap-3 items-center">
          <PrimeButton
            :label="showFilters ? $t('admin.clients.list.filters.hideFilters') : $t('admin.clients.list.filters.showFilters')"
            :icon="showFilters ? 'pi pi-filter-slash' : 'pi pi-filter'"
            severity="secondary"
            text
            @click="showFilters = !showFilters"
          />

          <PrimeButton
            v-if="hasActiveFilters"
            :label="$t('admin.clients.list.filters.clearFilters')"
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
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.clients.list.filters.status') }}</label>
              <PrimeSelect
                v-model="statusFilter"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('admin.clients.list.filters.selectStatus')"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Free Trial Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.clients.list.filters.freeTrial') }}</label>
              <PrimeSelect
                v-model="freeTrialFilter"
                :options="freeTrialOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('admin.clients.list.filters.selectOption')"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Apply Button -->
            <div class="form-group mb-0 text-right">
              <label class="text-sm font-medium text-neutral-700 mb-2 block invisible">Azioni</label>
              <PrimeButton
                :label="$t('admin.clients.list.filters.applyFilters')"
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
        v-model:selection="selectedClients"
        :value="clients"
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
        :currentPageReportTemplate="$t('admin.clients.list.table.paginatorTemplate')"
        @page="onPage"
        @sort="onSort"
      >
        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-12">
            <i class="pi pi-users text-4xl text-neutral-400 mb-4 block"></i>
            <p class="text-neutral-600 mb-4">{{ $t('admin.clients.list.table.empty') }}</p>
            <PrimeButton
              :label="$t('admin.clients.list.actions.newClient')"
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
            <span class="text-neutral-600">{{ $t('admin.clients.list.table.loading') }}</span>
          </div>
        </template>

        <!-- Checkbox Column -->
        <PrimeColumn selectionMode="multiple" headerStyle="width: 3rem" />

        <!-- Company Name -->
        <PrimeColumn field="company_name" :header="$t('admin.clients.list.table.headers.company')" sortable style="min-width: 200px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <div 
                class="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm flex-shrink-0"
              >
                {{ data.company_name.substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <div class="font-medium text-neutral-900">{{ data.company_name }}</div>
                <div class="text-xs text-neutral-500">{{ $t('admin.clients.list.table.vatPrefix') }}: {{ data.vat_number }}</div>
              </div>
            </div>
          </template>
        </PrimeColumn>

        <!-- Contact Person -->
        <PrimeColumn field="contact_first_name" :header="$t('admin.clients.list.table.headers.contact')" sortable style="min-width: 150px">
          <template #body="{ data }">
            <span class="text-neutral-700">{{ getContactFullName(data) }}</span>
          </template>
        </PrimeColumn>

        <!-- Email -->
        <PrimeColumn field="email" :header="$t('admin.clients.list.table.headers.email')" sortable style="min-width: 200px">
          <template #body="{ data }">
            <a 
              :href="`mailto:${data.email}`" 
              class="text-primary-600 hover:text-primary-700 hover:underline"
            >
              {{ data.email }}
            </a>
          </template>
        </PrimeColumn>

        <!-- Phone -->
        <PrimeColumn field="phone" :header="$t('admin.clients.list.table.headers.phone')" style="min-width: 130px">
          <template #body="{ data }">
            <a 
              :href="`tel:${data.phone}`"
              class="text-neutral-700 hover:text-primary-600"
            >
              {{ data.phone }}
            </a>
          </template>
        </PrimeColumn>

        <!-- Status -->
        <PrimeColumn field="status" :header="$t('admin.clients.list.table.headers.status')" sortable style="min-width: 120px">
          <template #body="{ data }">
            <PrimeTag 
              :value="formatStatus(data.status)"
              :severity="getStatusSeverity(data.status)"
            />
          </template>
        </PrimeColumn>

        <!-- Free Trial -->
        <PrimeColumn field="free_trial_enabled" :header="$t('admin.clients.list.table.headers.freeTrial')" style="min-width: 140px">
          <template #body="{ data }">
            <span 
              class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
              :class="getFreeTrialClass(data)"
            >
              <i 
                class="pi mr-1" 
                :class="data.free_trial_enabled ? 'pi-check' : 'pi-times'"
              ></i>
              {{ getFreeTrialLabel(data) }}
            </span>
          </template>
        </PrimeColumn>

        <!-- Registration Date -->
        <PrimeColumn field="created_at" :header="$t('admin.clients.list.table.headers.registration')" sortable style="min-width: 120px">
          <template #body="{ data }">
            <span class="text-neutral-600">{{ formatDate(data.created_at) }}</span>
          </template>
        </PrimeColumn>

        <!-- Actions -->
        <PrimeColumn :header="$t('admin.clients.list.table.headers.actions')" style="min-width: 120px" frozen alignFrozen="right">
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

              <!-- More Actions Menu -->
              <PrimeButton
                icon="pi pi-ellipsis-v"
                severity="secondary"
                text
                rounded
                size="small"
                v-tooltip.top="$t('admin.clients.list.contextMenu.moreActions')"
                @click="(event: Event) => ($refs[`menu-${data.id}`] as any)?.toggle(event)"
              />
              
              <PrimeMenu
                :ref="`menu-${data.id}`"
                :model="[
                  {
                    label: $t('admin.clients.list.contextMenu.viewDetails'),
                    icon: 'pi pi-eye',
                    command: () => navigateToEdit(data)
                  },
                  {
                    label: $t('admin.clients.list.contextMenu.resetPassword'),
                    icon: 'pi pi-key',
                    command: () => handleResetPassword(data)
                  },
                  { separator: true },
                  {
                    label: data.status === 'suspended' ? $t('admin.clients.list.contextMenu.reactivate') : $t('admin.clients.list.contextMenu.suspend'),
                    icon: data.status === 'suspended' ? 'pi pi-play' : 'pi pi-pause',
                    command: () => data.status === 'suspended' ? handleActivate(data) : handleSuspend(data)
                  },
                  { separator: true },
                  {
                    label: $t('admin.clients.list.contextMenu.delete'),
                    icon: 'pi pi-trash',
                    class: 'text-danger',
                    command: () => openDeleteDialog(data)
                  }
                ]"
                :popup="true"
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
      :header="$t('admin.clients.list.dialog.deleteTitle')"
      :style="{ width: '450px' }"
    >
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center flex-shrink-0">
          <i class="pi pi-exclamation-triangle text-2xl text-danger"></i>
        </div>
        <div>
          <p class="text-neutral-800 mb-2">
            {{ $t('admin.clients.list.dialog.deleteMessage', { name: clientToDelete?.company_name }) }}
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <PrimeButton
            :label="$t('admin.clients.list.dialog.deleteCancel')"
            severity="secondary"
            outlined
            @click="deleteDialog = false"
          />
          <PrimeButton
            :label="$t('admin.clients.list.dialog.deleteConfirm')"
            severity="danger"
            icon="pi pi-trash"
            :loading="clientStore.saving"
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

:deep(.p-menu) {
  min-width: 180px;
}

:deep(.p-menu .p-menuitem-link) {
  padding: 0.625rem 1rem;
}

.text-danger :deep(.p-menuitem-text),
.text-danger :deep(.p-menuitem-icon) {
  color: #dc3545 !important;
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
