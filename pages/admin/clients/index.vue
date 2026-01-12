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
const statusOptions = [
  { label: 'Tutti gli stati', value: '' },
  { label: 'Attivo', value: 'active' },
  { label: 'In Attesa', value: 'pending' },
  { label: 'Sospeso', value: 'suspended' }
]

// Free trial options
const freeTrialOptions = [
  { label: 'Tutti', value: '' },
  { label: 'Prova attiva', value: 'active' },
  { label: 'Prova non attiva', value: 'inactive' },
  { label: 'Prova esaurita', value: 'exhausted' }
]

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
      showSuccess(`Cliente "${client.company_name}" sospeso con successo`)
    } else {
      showError(clientStore.error || 'Errore nella sospensione del cliente')
    }
  })
}

const handleActivate = async (client: Client) => {
  const success = await clientStore.activateClient(client.id)
  if (success) {
    showSuccess(`Cliente "${client.company_name}" attivato con successo`)
  } else {
    showError(clientStore.error || 'Errore nell\'attivazione del cliente')
  }
}

const handleResetPassword = (client: Client) => {
  confirmResetPassword(client, async () => {
    const success = await clientStore.resetPassword(client.id)
    if (success) {
      showSuccess(`Email di reset password inviata a ${client.email}`)
    } else {
      showError(clientStore.error || 'Errore nell\'invio dell\'email di reset')
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
    showSuccess(`Cliente "${clientToDelete.value.company_name}" eliminato con successo`)
    deleteDialog.value = false
    clientToDelete.value = null
  } else {
    showError(clientStore.error || 'Errore nell\'eliminazione del cliente')
  }
}

const exportClients = () => {
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

// Free trial badge class
const getFreeTrialClass = (client: Client) => {
  if (!client.free_trial_enabled) return 'bg-neutral-100 text-neutral-600'
  const remaining = getFreeTrialRemaining(client)
  if (remaining === 0) return 'bg-danger-light text-danger-dark'
  if (remaining <= 1) return 'bg-warning-light text-warning-dark'
  return 'bg-success-light text-success-dark'
}

const getFreeTrialLabel = (client: Client) => {
  if (!client.free_trial_enabled) return 'Non attiva'
  const remaining = getFreeTrialRemaining(client)
  if (remaining === 0) return 'Esaurita'
  return `${remaining}/${client.free_trial_leads_total} rimanenti`
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
        <h1 class="page-title">Clienti</h1>
        <p class="page-subtitle">Gestione clienti B2B della piattaforma</p>
      </div>
      <div class="page-header-actions">
        <PrimeButton 
          label="Nuovo Cliente" 
          icon="pi pi-plus" 
          severity="primary"
          @click="navigateToCreate"
        />
        <PrimeButton 
          label="Export" 
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
        <div class="kpi-card-label">Clienti Totali</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon success">
          <i class="pi pi-check-circle"></i>
        </div>
        <div class="kpi-card-value">{{ clientStore.activeClients.length }}</div>
        <div class="kpi-card-label">Clienti Attivi</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon warning">
          <i class="pi pi-clock"></i>
        </div>
        <div class="kpi-card-value">{{ clientStore.pendingClients.length }}</div>
        <div class="kpi-card-label">In Attesa</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon info">
          <i class="pi pi-gift"></i>
        </div>
        <div class="kpi-card-value">{{ clientStore.clientsWithFreeTrial.length }}</div>
        <div class="kpi-card-label">Con Prova Gratuita</div>
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
              placeholder="Cerca per nome, email, P.IVA..."
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

            <!-- Free Trial Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">Prova Gratuita</label>
              <PrimeSelect
                v-model="freeTrialFilter"
                :options="freeTrialOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleziona..."
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
        currentPageReportTemplate="Mostra {first} - {last} di {totalRecords} clienti"
        @page="onPage"
        @sort="onSort"
      >
        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-12">
            <i class="pi pi-users text-4xl text-neutral-400 mb-4 block"></i>
            <p class="text-neutral-600 mb-4">Nessun cliente trovato</p>
            <PrimeButton
              label="Aggiungi il primo cliente"
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
            <span class="text-neutral-600">Caricamento clienti...</span>
          </div>
        </template>

        <!-- Checkbox Column -->
        <PrimeColumn selectionMode="multiple" headerStyle="width: 3rem" />

        <!-- Company Name -->
        <PrimeColumn field="company_name" header="Azienda" sortable style="min-width: 200px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <div 
                class="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm flex-shrink-0"
              >
                {{ data.company_name.substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <div class="font-medium text-neutral-900">{{ data.company_name }}</div>
                <div class="text-xs text-neutral-500">P.IVA: {{ data.vat_number }}</div>
              </div>
            </div>
          </template>
        </PrimeColumn>

        <!-- Contact Person -->
        <PrimeColumn field="contact_first_name" header="Referente" sortable style="min-width: 150px">
          <template #body="{ data }">
            <span class="text-neutral-700">{{ getContactFullName(data) }}</span>
          </template>
        </PrimeColumn>

        <!-- Email -->
        <PrimeColumn field="email" header="Email" sortable style="min-width: 200px">
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

        <!-- Status -->
        <PrimeColumn field="status" header="Stato" sortable style="min-width: 120px">
          <template #body="{ data }">
            <PrimeTag 
              :value="formatStatus(data.status)"
              :severity="getStatusSeverity(data.status)"
            />
          </template>
        </PrimeColumn>

        <!-- Free Trial -->
        <PrimeColumn field="free_trial_enabled" header="Prova Gratuita" style="min-width: 140px">
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
        <PrimeColumn field="created_at" header="Registrazione" sortable style="min-width: 120px">
          <template #body="{ data }">
            <span class="text-neutral-600">{{ formatDate(data.created_at) }}</span>
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

              <!-- More Actions Menu -->
              <PrimeButton
                icon="pi pi-ellipsis-v"
                severity="secondary"
                text
                rounded
                size="small"
                v-tooltip.top="'Altre azioni'"
                @click="(event: Event) => ($refs[`menu-${data.id}`] as any)?.toggle(event)"
              />
              
              <PrimeMenu
                :ref="`menu-${data.id}`"
                :model="[
                  {
                    label: 'Visualizza dettagli',
                    icon: 'pi pi-eye',
                    command: () => navigateToEdit(data)
                  },
                  {
                    label: 'Reset password',
                    icon: 'pi pi-key',
                    command: () => handleResetPassword(data)
                  },
                  { separator: true },
                  {
                    label: data.status === 'suspended' ? 'Riattiva' : 'Sospendi',
                    icon: data.status === 'suspended' ? 'pi pi-play' : 'pi pi-pause',
                    command: () => data.status === 'suspended' ? handleActivate(data) : handleSuspend(data)
                  },
                  { separator: true },
                  {
                    label: 'Elimina',
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
      header="Conferma Eliminazione"
      :style="{ width: '450px' }"
    >
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center flex-shrink-0">
          <i class="pi pi-exclamation-triangle text-2xl text-danger"></i>
        </div>
        <div>
          <p class="text-neutral-800 mb-2">
            Sei sicuro di voler eliminare il cliente <strong>{{ clientToDelete?.company_name }}</strong>?
          </p>
          <p class="text-sm text-neutral-600">
            Questa azione non può essere annullata. Tutti i dati del cliente verranno eliminati permanentemente.
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
