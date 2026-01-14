<script setup lang="ts">
/**
 * Admin Invoices Page - Elenco Fatture
 * Gestione completa delle fatture con filtri, azioni e paginazione
 */
import { useInvoiceFormatters, useInvoiceActions, useInvoiceFilterOptions, formatCurrency } from '~/composables/useInvoice'
import type { Invoice, SdiStatus, InvoiceType } from '~/types/invoice'

definePageMeta({
  layout: 'admin'
})

// Store & Composables
const invoiceStore = useInvoiceStore()
const {
  formatInvoiceType,
  getInvoiceTypeSeverity,
  formatSdiStatus,
  getSdiStatusSeverity,
  getSdiStatusIcon,
  canResendToSdi,
  canCreateCreditNote,
  formatDate,
  formatDateTime
} = useInvoiceFormatters()
const { confirmResendSdi, confirmSendEmail, confirmCreateCreditNote, showSuccess, showError } = useInvoiceActions()
const { typeOptions, sdiStatusOptions } = useInvoiceFilterOptions()
const router = useRouter()

// Refs
const selectedInvoices = ref<Invoice[]>([])
const showFilters = ref(false)
const creditNoteDialog = ref(false)
const invoiceForCreditNote = ref<Invoice | null>(null)
const creditNoteReason = ref('')

// Filters
const searchQuery = ref('')
const typeFilter = ref<InvoiceType | ''>('')
const sdiStatusFilter = ref<SdiStatus | ''>('')

// Computed
const invoices = computed(() => invoiceStore.invoices)
const loading = computed(() => invoiceStore.loading)
const pagination = computed(() => invoiceStore.pagination)
const hasActiveFilters = computed(() => invoiceStore.hasActiveFilters)
const stats = computed(() => invoiceStore.stats)

// Pagination
const first = ref(0)
const rows = ref(10)

// Methods
const loadInvoices = async () => {
  await invoiceStore.fetchInvoices()
}

const loadStats = async () => {
  await invoiceStore.fetchStats()
}

const applyFilters = () => {
  invoiceStore.setFilters({
    search: searchQuery.value,
    type: typeFilter.value,
    sdi_status: sdiStatusFilter.value
  })
  loadInvoices()
}

const clearFilters = () => {
  searchQuery.value = ''
  typeFilter.value = ''
  sdiStatusFilter.value = ''
  invoiceStore.resetFilters()
  loadInvoices()
}

const onPage = (event: any) => {
  invoiceStore.setFilters({
    page: event.page + 1,
    per_page: event.rows
  })
  loadInvoices()
}

const onSort = (event: any) => {
  invoiceStore.setFilters({
    sort_by: event.sortField,
    sort_order: event.sortOrder === 1 ? 'asc' : 'desc'
  })
  loadInvoices()
}

// Actions
const navigateToDetail = (invoice: Invoice) => {
  router.push(`/admin/invoices/${invoice.id}`)
}

const handleResendSdi = (invoice: Invoice) => {
  confirmResendSdi(invoice, async () => {
    const success = await invoiceStore.resendToSdi(invoice.id)
    if (success) {
      showSuccess(`Fattura "${invoice.invoice_number}" reinviata a SDI`)
    } else {
      showError(invoiceStore.error || 'Errore nel reinvio a SDI')
    }
  })
}

const handleSendEmail = (invoice: Invoice) => {
  confirmSendEmail(invoice, async () => {
    const success = await invoiceStore.sendByEmail(invoice.id)
    if (success) {
      showSuccess(`Fattura "${invoice.invoice_number}" inviata via email`)
    } else {
      showError(invoiceStore.error || 'Errore nell\'invio email')
    }
  })
}

const openCreditNoteDialog = (invoice: Invoice) => {
  invoiceForCreditNote.value = invoice
  creditNoteReason.value = ''
  creditNoteDialog.value = true
}

const handleCreateCreditNote = async () => {
  if (!invoiceForCreditNote.value) return

  const creditNote = await invoiceStore.createCreditNote(
    invoiceForCreditNote.value.id,
    creditNoteReason.value || undefined
  )

  if (creditNote) {
    showSuccess(`Nota di credito "${creditNote.invoice_number}" creata con successo`)
    creditNoteDialog.value = false
    invoiceForCreditNote.value = null
    loadStats()
  } else {
    showError(invoiceStore.error || 'Errore nella creazione della nota di credito')
  }
}

const handleDownloadPdf = async (invoice: Invoice) => {
  const url = await invoiceStore.downloadPdf(invoice.id)
  if (url) {
    window.open(url, '_blank')
    showSuccess('Download PDF avviato')
  } else {
    showError(invoiceStore.error || 'Errore nel download del PDF')
  }
}

const exportInvoices = () => {
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

// Lifecycle
onMounted(() => {
  loadInvoices()
  loadStats()
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
        <h1 class="page-title">Fatture</h1>
        <p class="page-subtitle">Gestione fatture elettroniche e note di credito</p>
      </div>
      <div class="page-header-actions">
        <PrimeButton
          label="Export"
          icon="pi pi-download"
          severity="secondary"
          outlined
          @click="exportInvoices"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <div class="kpi-card">
        <div class="kpi-card-icon primary">
          <i class="pi pi-file"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.total_invoices || 0 }}</div>
        <div class="kpi-card-label">Fatture Totali</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon success">
          <i class="pi pi-euro"></i>
        </div>
        <div class="kpi-card-value">{{ formatCurrency(stats?.total_amount || 0) }}</div>
        <div class="kpi-card-label">Totale Fatturato</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon warning">
          <i class="pi pi-clock"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.by_sdi_status?.pending || 0 }}</div>
        <div class="kpi-card-label">In Attesa SDI</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon danger">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <div class="kpi-card-value">{{ (stats?.by_sdi_status?.rejected || 0) + (stats?.by_sdi_status?.error || 0) }}</div>
        <div class="kpi-card-label">Problemi SDI</div>
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
              placeholder="Cerca per numero, cliente, P.IVA..."
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
            <!-- Type Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">Tipo</label>
              <PrimeSelect
                v-model="typeFilter"
                :options="typeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleziona tipo"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- SDI Status Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">Stato SDI</label>
              <PrimeSelect
                v-model="sdiStatusFilter"
                :options="sdiStatusOptions"
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
        v-model:selection="selectedInvoices"
        :value="invoices"
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
        currentPageReportTemplate="Mostra {first} - {last} di {totalRecords} fatture"
        @page="onPage"
        @sort="onSort"
      >
        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-12">
            <i class="pi pi-file text-4xl text-neutral-400 mb-4 block"></i>
            <p class="text-neutral-600">Nessuna fattura trovata</p>
          </div>
        </template>

        <!-- Loading -->
        <template #loading>
          <div class="flex items-center justify-center py-8">
            <i class="pi pi-spin pi-spinner text-2xl text-primary-500 mr-3"></i>
            <span class="text-neutral-600">Caricamento fatture...</span>
          </div>
        </template>

        <!-- Checkbox Column -->
        <PrimeColumn selectionMode="multiple" headerStyle="width: 3rem" />

        <!-- Invoice Number -->
        <PrimeColumn field="invoice_number" header="Numero" sortable style="min-width: 160px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <i
                class="pi text-lg"
                :class="data.type === 'credit_note' ? 'pi-file-edit text-warning-600' : 'pi pi-file text-primary-600'"
              ></i>
              <div>
                <div class="font-medium text-neutral-900">{{ data.invoice_number }}</div>
                <div class="text-xs text-neutral-500">{{ formatInvoiceType(data.type) }}</div>
              </div>
            </div>
          </template>
        </PrimeColumn>

        <!-- Client -->
        <PrimeColumn field="billing_data.company_name" header="Cliente" sortable style="min-width: 200px">
          <template #body="{ data }">
            <div>
              <div class="font-medium text-neutral-900">{{ data.billing_data?.company_name || '-' }}</div>
              <div class="text-xs text-neutral-500">P.IVA: {{ data.billing_data?.vat_number || '-' }}</div>
            </div>
          </template>
        </PrimeColumn>

        <!-- Order -->
        <PrimeColumn field="order.order_number" header="Ordine" style="min-width: 150px">
          <template #body="{ data }">
            <NuxtLink
              v-if="data.order"
              :to="`/admin/orders/${data.order.id}`"
              class="text-primary-600 hover:text-primary-700 hover:underline"
            >
              {{ data.order.order_number }}
            </NuxtLink>
            <span v-else class="text-neutral-400">-</span>
          </template>
        </PrimeColumn>

        <!-- Amount -->
        <PrimeColumn field="total" header="Importo" sortable style="min-width: 120px">
          <template #body="{ data }">
            <span
              class="font-semibold"
              :class="data.total < 0 ? 'text-danger-600' : 'text-neutral-900'"
            >
              {{ formatCurrency(data.total) }}
            </span>
          </template>
        </PrimeColumn>

        <!-- SDI Status -->
        <PrimeColumn field="sdi_status" header="Stato SDI" sortable style="min-width: 140px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <PrimeTag
                :value="formatSdiStatus(data.sdi_status)"
                :severity="getSdiStatusSeverity(data.sdi_status)"
                :icon="getSdiStatusIcon(data.sdi_status)"
              />
            </div>
          </template>
        </PrimeColumn>

        <!-- Issue Date -->
        <PrimeColumn field="issued_at" header="Data Emissione" sortable style="min-width: 130px">
          <template #body="{ data }">
            <span class="text-neutral-600">{{ formatDate(data.issued_at) }}</span>
          </template>
        </PrimeColumn>

        <!-- Fatture Cloud ID -->
        <PrimeColumn field="fatture_cloud_id" header="ID Fatture Cloud" style="min-width: 140px">
          <template #body="{ data }">
            <span v-if="data.fatture_cloud_id" class="text-xs text-neutral-500 font-mono">
              {{ data.fatture_cloud_id }}
            </span>
            <span v-else class="text-neutral-400">-</span>
          </template>
        </PrimeColumn>

        <!-- Actions -->
        <PrimeColumn header="Azioni" style="min-width: 120px" frozen alignFrozen="right">
          <template #body="{ data }">
            <div class="flex gap-1 justify-end">
              <!-- View -->
              <PrimeButton
                icon="pi pi-eye"
                severity="primary"
                text
                rounded
                size="small"
                v-tooltip.top="'Visualizza'"
                @click="navigateToDetail(data)"
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
                    command: () => navigateToDetail(data)
                  },
                  {
                    label: 'Scarica PDF',
                    icon: 'pi pi-download',
                    command: () => handleDownloadPdf(data)
                  },
                  {
                    label: 'Invia via email',
                    icon: 'pi pi-envelope',
                    command: () => handleSendEmail(data)
                  },
                  { separator: true },
                  ...(canResendToSdi(data) ? [{
                    label: 'Reinvia a SDI',
                    icon: 'pi pi-send',
                    command: () => handleResendSdi(data)
                  }] : []),
                  ...(canCreateCreditNote(data) ? [{
                    label: 'Crea nota di credito',
                    icon: 'pi pi-file-edit',
                    command: () => openCreditNoteDialog(data)
                  }] : [])
                ].filter(Boolean)"
                :popup="true"
              />
            </div>
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <!-- Credit Note Dialog -->
    <PrimeDialog
      v-model:visible="creditNoteDialog"
      modal
      header="Crea Nota di Credito"
      :style="{ width: '500px' }"
    >
      <div class="space-y-4">
        <div class="p-4 bg-neutral-50 rounded-lg">
          <div class="flex items-center gap-3 mb-3">
            <i class="pi pi-file text-2xl text-primary-600"></i>
            <div>
              <div class="font-semibold text-neutral-900">{{ invoiceForCreditNote?.invoice_number }}</div>
              <div class="text-sm text-neutral-600">{{ invoiceForCreditNote?.billing_data?.company_name }}</div>
            </div>
          </div>
          <div class="text-sm text-neutral-600">
            Importo nota di credito:
            <span class="font-semibold text-danger-600">
              {{ formatCurrency(-(invoiceForCreditNote?.total || 0)) }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Motivo (opzionale)
          </label>
          <PrimeTextarea
            v-model="creditNoteReason"
            rows="3"
            placeholder="Inserisci il motivo della nota di credito..."
            class="w-full"
          />
        </div>

        <div class="p-3 bg-warning-50 rounded-lg flex items-start gap-3">
          <i class="pi pi-exclamation-triangle text-warning-600"></i>
          <p class="text-sm text-warning-800">
            La nota di credito verrà emessa e inviata automaticamente a SDI. Questa operazione non può essere annullata.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <PrimeButton
            label="Annulla"
            severity="secondary"
            outlined
            @click="creditNoteDialog = false"
          />
          <PrimeButton
            label="Crea Nota di Credito"
            severity="warning"
            icon="pi pi-file-edit"
            :loading="invoiceStore.saving"
            @click="handleCreateCreditNote"
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
  min-width: 200px;
}

:deep(.p-menu .p-menuitem-link) {
  padding: 0.625rem 1rem;
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
