<script setup lang="ts">
/**
 * Admin Transactions Page - Elenco Transazioni Stripe
 * Gestione completa delle transazioni con filtri, paginazione e dettagli
 */
import { useTransactionFormatters, useTransactionActions, useTransactionOptions } from '~/composables/useTransaction'
import type { Transaction, TransactionStatus, TransactionPaymentType } from '~/types/transaction'

definePageMeta({
  layout: 'admin'
})

// Store & Composables
const transactionStore = useTransactionStore()
const { 
  formatStatus, 
  getStatusSeverity,
  getStatusIcon,
  formatPaymentType,
  getPaymentTypeIcon,
  getPaymentTypeColor,
  formatDate, 
  formatDateTime,
  formatCurrency,
  formatPaymentIntentShort,
  getClientFullName,
  formatFailureCode
} = useTransactionFormatters()
const { showSuccess, showError, copyPaymentIntentId, openStripePayment } = useTransactionActions()
const { statusOptions, paymentTypeOptions } = useTransactionOptions()
const router = useRouter()

// Refs
const selectedTransactions = ref<Transaction[]>([])
const showFilters = ref(false)

// Filters
const searchQuery = ref('')
const statusFilter = ref<TransactionStatus | ''>('')
const paymentTypeFilter = ref<TransactionPaymentType | ''>('')
const dateFromFilter = ref<Date | null>(null)
const dateToFilter = ref<Date | null>(null)
const amountMinFilter = ref<number | undefined>(undefined)
const amountMaxFilter = ref<number | undefined>(undefined)

// Computed
const transactions = computed(() => transactionStore.transactions)
const loading = computed(() => transactionStore.loading)
const pagination = computed(() => transactionStore.pagination)
const stats = computed(() => transactionStore.stats)
const hasActiveFilters = computed(() => transactionStore.hasActiveFilters)

// Pagination
const first = ref(0)
const rows = ref(10)

// Methods
const loadTransactions = async () => {
  await transactionStore.fetchTransactions()
}

const loadStats = async () => {
  await transactionStore.fetchStats()
}

// Helper to format date for API
const formatDateForApi = (date: Date | null): string => {
  if (!date) return ''
  return date.toISOString().split('T')[0]
}

const applyFilters = () => {
  transactionStore.setFilters({
    search: searchQuery.value,
    status: statusFilter.value,
    payment_type: paymentTypeFilter.value,
    date_from: formatDateForApi(dateFromFilter.value),
    date_to: formatDateForApi(dateToFilter.value),
    amount_min: amountMinFilter.value,
    amount_max: amountMaxFilter.value
  })
  loadTransactions()
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  paymentTypeFilter.value = ''
  dateFromFilter.value = null
  dateToFilter.value = null
  amountMinFilter.value = undefined
  amountMaxFilter.value = undefined
  transactionStore.resetFilters()
  loadTransactions()
}

const onPage = (event: any) => {
  transactionStore.setFilters({
    page: event.page + 1,
    per_page: event.rows
  })
  loadTransactions()
}

const onSort = (event: any) => {
  transactionStore.setFilters({
    sort_by: event.sortField,
    sort_order: event.sortOrder === 1 ? 'asc' : 'desc'
  })
  loadTransactions()
}

// Actions
const navigateToDetail = (transaction: Transaction) => {
  router.push(`/admin/transactions/${transaction.id}`)
}

const navigateToOrder = (transaction: Transaction) => {
  if (transaction.order_id) {
    router.push(`/admin/orders/${transaction.order_id}`)
  }
}

const navigateToClient = (transaction: Transaction) => {
  if (transaction.client?.id) {
    router.push(`/admin/clients/${transaction.client.id}`)
  }
}

const handleCopyPaymentIntent = (transaction: Transaction) => {
  copyPaymentIntentId(transaction.stripe_payment_intent_id)
}

const handleOpenStripe = (transaction: Transaction) => {
  openStripePayment(transaction.stripe_payment_intent_id)
}

const exportTransactions = () => {
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

// Computed per success rate
const successRateFormatted = computed(() => {
  if (!stats.value) return '0%'
  return `${stats.value.success_rate.toFixed(1)}%`
})

// Lifecycle
onMounted(() => {
  loadTransactions()
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
        <h1 class="page-title">Transazioni</h1>
        <p class="page-subtitle">Log completo delle transazioni Stripe</p>
      </div>
      <div class="page-header-actions">
        <PrimeButton 
          label="Export" 
          icon="pi pi-download" 
          severity="secondary"
          outlined
          @click="exportTransactions"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <div class="kpi-card">
        <div class="kpi-card-icon primary">
          <i class="pi pi-credit-card"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.total_transactions || 0 }}</div>
        <div class="kpi-card-label">Transazioni Totali</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon success">
          <i class="pi pi-euro"></i>
        </div>
        <div class="kpi-card-value">{{ formatCurrency(stats?.successful_volume || 0) }}</div>
        <div class="kpi-card-label">Volume Completato</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon info">
          <i class="pi pi-check-circle"></i>
        </div>
        <div class="kpi-card-value">{{ successRateFormatted }}</div>
        <div class="kpi-card-label">Tasso di Successo</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon warning">
          <i class="pi pi-clock"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.pending_count || 0 }}</div>
        <div class="kpi-card-label">In Attesa/Elaborazione</div>
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
              placeholder="Cerca per Payment Intent, ordine, cliente..."
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            <!-- Payment Type Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">Tipo Pagamento</label>
              <PrimeSelect
                v-model="paymentTypeFilter"
                :options="paymentTypeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleziona tipo"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Date From -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">Data Da</label>
              <PrimeDatePicker
                v-model="dateFromFilter"
                dateFormat="dd/mm/yy"
                placeholder="Seleziona data"
                class="w-full"
                showIcon
                @date-select="applyFilters"
              />
            </div>

            <!-- Date To -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">Data A</label>
              <PrimeDatePicker
                v-model="dateToFilter"
                dateFormat="dd/mm/yy"
                placeholder="Seleziona data"
                class="w-full"
                showIcon
                @date-select="applyFilters"
              />
            </div>

            <!-- Amount Min -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">Importo Min (€)</label>
              <PrimeInputNumber
                v-model="amountMinFilter"
                mode="currency"
                currency="EUR"
                locale="it-IT"
                placeholder="Min"
                class="w-full"
                @input="applyFilters"
              />
            </div>

            <!-- Amount Max -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">Importo Max (€)</label>
              <PrimeInputNumber
                v-model="amountMaxFilter"
                mode="currency"
                currency="EUR"
                locale="it-IT"
                placeholder="Max"
                class="w-full"
                @input="applyFilters"
              />
            </div>

            <!-- Apply Button -->
            <div class="flex items-end md:col-span-2">
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
        v-model:selection="selectedTransactions"
        :value="transactions"
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
        currentPageReportTemplate="Mostra {first} - {last} di {totalRecords} transazioni"
        @page="onPage"
        @sort="onSort"
      >
        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-12">
            <i class="pi pi-credit-card text-4xl text-neutral-400 mb-4 block"></i>
            <p class="text-neutral-600 mb-4">Nessuna transazione trovata</p>
            <p class="text-sm text-neutral-500">
              Le transazioni verranno visualizzate qui quando i clienti effettueranno pagamenti
            </p>
          </div>
        </template>

        <!-- Loading -->
        <template #loading>
          <div class="flex items-center justify-center py-8">
            <i class="pi pi-spin pi-spinner text-2xl text-primary-500 mr-3"></i>
            <span class="text-neutral-600">Caricamento transazioni...</span>
          </div>
        </template>

        <!-- Checkbox Column -->
        <PrimeColumn selectionMode="multiple" headerStyle="width: 3rem" />

        <!-- Payment Intent ID -->
        <PrimeColumn field="stripe_payment_intent_id" header="Payment Intent" sortable style="min-width: 180px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <code 
                class="font-mono text-xs text-primary-700 bg-primary-50 px-2 py-1 rounded cursor-pointer hover:bg-primary-100"
                @click="navigateToDetail(data)"
                v-tooltip.top="data.stripe_payment_intent_id"
              >
                {{ formatPaymentIntentShort(data.stripe_payment_intent_id) }}
              </code>
              <PrimeButton
                icon="pi pi-copy"
                severity="secondary"
                text
                rounded
                size="small"
                class="p-0 w-6 h-6"
                v-tooltip.top="'Copia ID'"
                @click.stop="handleCopyPaymentIntent(data)"
              />
            </div>
          </template>
        </PrimeColumn>

        <!-- Order -->
        <PrimeColumn field="order.order_number" header="Ordine" style="min-width: 140px">
          <template #body="{ data }">
            <span 
              v-if="data.order"
              class="font-mono text-sm text-primary-600 cursor-pointer hover:underline"
              @click="navigateToOrder(data)"
            >
              {{ data.order.order_number }}
            </span>
            <span v-else class="text-neutral-400">-</span>
          </template>
        </PrimeColumn>

        <!-- Client -->
        <PrimeColumn field="client.company_name" header="Cliente" sortable style="min-width: 200px">
          <template #body="{ data }">
            <div v-if="data.client" class="cursor-pointer" @click="navigateToClient(data)">
              <div class="font-medium text-neutral-900 hover:text-primary-600">{{ data.client.company_name }}</div>
              <div class="text-xs text-neutral-500">{{ data.client.email }}</div>
            </div>
            <span v-else class="text-neutral-400">-</span>
          </template>
        </PrimeColumn>

        <!-- Payment Type -->
        <PrimeColumn field="payment_type" header="Tipo" style="min-width: 140px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <i 
                class="pi" 
                :class="[getPaymentTypeIcon(data.payment_type), getPaymentTypeColor(data.payment_type)]"
              ></i>
              <span class="text-neutral-700">{{ formatPaymentType(data.payment_type) }}</span>
            </div>
          </template>
        </PrimeColumn>

        <!-- Amount -->
        <PrimeColumn field="amount" header="Importo" sortable style="min-width: 120px">
          <template #body="{ data }">
            <span class="font-semibold text-neutral-900">{{ formatCurrency(data.amount, data.currency) }}</span>
          </template>
        </PrimeColumn>

        <!-- Status -->
        <PrimeColumn field="status" header="Stato" sortable style="min-width: 150px">
          <template #body="{ data }">
            <PrimeTag 
              :value="formatStatus(data.status)"
              :severity="getStatusSeverity(data.status)"
            >
              <template #default>
                <i :class="`pi ${getStatusIcon(data.status)} mr-1`"></i>
                {{ formatStatus(data.status) }}
              </template>
            </PrimeTag>
          </template>
        </PrimeColumn>

        <!-- Failure -->
        <PrimeColumn field="failure_code" header="Errore" style="min-width: 150px">
          <template #body="{ data }">
            <span 
              v-if="data.failure_code" 
              class="text-danger text-sm"
              v-tooltip.top="data.failure_message"
            >
              {{ formatFailureCode(data.failure_code) }}
            </span>
            <span v-else class="text-neutral-400">-</span>
          </template>
        </PrimeColumn>

        <!-- Date -->
        <PrimeColumn field="created_at" header="Data" sortable style="min-width: 150px">
          <template #body="{ data }">
            <div>
              <div class="text-neutral-700">{{ formatDate(data.created_at) }}</div>
              <div class="text-xs text-neutral-500">{{ formatDateTime(data.created_at).split(' ')[1] }}</div>
            </div>
          </template>
        </PrimeColumn>

        <!-- Processed At -->
        <PrimeColumn field="processed_at" header="Elaborato il" sortable style="min-width: 130px">
          <template #body="{ data }">
            <span v-if="data.processed_at" class="text-success-dark">
              {{ formatDate(data.processed_at) }}
            </span>
            <span v-else class="text-neutral-400">-</span>
          </template>
        </PrimeColumn>

        <!-- Actions -->
        <PrimeColumn header="Azioni" style="min-width: 100px" frozen alignFrozen="right">
          <template #body="{ data }">
            <div class="flex gap-1 justify-end">
              <!-- View Details -->
              <PrimeButton
                icon="pi pi-eye"
                severity="primary"
                text
                rounded
                size="small"
                v-tooltip.top="'Visualizza dettagli'"
                @click="navigateToDetail(data)"
              />

              <!-- Open Stripe -->
              <PrimeButton
                icon="pi pi-external-link"
                severity="secondary"
                text
                rounded
                size="small"
                v-tooltip.top="'Apri su Stripe'"
                @click="handleOpenStripe(data)"
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
                    label: 'Apri su Stripe',
                    icon: 'pi pi-external-link',
                    command: () => handleOpenStripe(data)
                  },
                  {
                    label: 'Copia Payment Intent ID',
                    icon: 'pi pi-copy',
                    command: () => handleCopyPaymentIntent(data)
                  },
                  { separator: true },
                  {
                    label: 'Vai all\'ordine',
                    icon: 'pi pi-shopping-cart',
                    command: () => navigateToOrder(data),
                    visible: !!data.order
                  },
                  {
                    label: 'Vai al cliente',
                    icon: 'pi pi-user',
                    command: () => navigateToClient(data),
                    visible: !!data.client
                  }
                ]"
                :popup="true"
              />
            </div>
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>
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

code {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
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
