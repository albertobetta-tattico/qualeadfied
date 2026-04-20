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

const { t } = useI18n()

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
        <h1 class="page-title">{{ $t('admin.transactions.list.title') }}</h1>
        <p class="page-subtitle">{{ $t('admin.transactions.list.subtitle') }}</p>
      </div>
      <div class="page-header-actions">
        <PrimeButton
          :label="$t('admin.transactions.list.actions.export')"
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
        <div class="kpi-card-label">{{ $t('admin.transactions.list.kpis.totalTransactions') }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon success">
          <i class="pi pi-euro"></i>
        </div>
        <div class="kpi-card-value">{{ formatCurrency(stats?.successful_volume || 0) }}</div>
        <div class="kpi-card-label">{{ $t('admin.transactions.list.kpis.completedVolume') }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon info">
          <i class="pi pi-check-circle"></i>
        </div>
        <div class="kpi-card-value">{{ successRateFormatted }}</div>
        <div class="kpi-card-label">{{ $t('admin.transactions.list.kpis.successRate') }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon warning">
          <i class="pi pi-clock"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.pending_count || 0 }}</div>
        <div class="kpi-card-label">{{ $t('admin.transactions.list.kpis.pendingProcessing') }}</div>
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
              :placeholder="$t('admin.transactions.list.search.placeholder')"
              class="w-full"
              @input="onSearchInput"
            />
          </span>
        </div>

        <!-- Filter Actions -->
        <div class="flex gap-3 items-center">
          <PrimeButton
            :label="showFilters ? $t('admin.transactions.list.filters.hideFilters') : $t('admin.transactions.list.filters.showFilters')"
            :icon="showFilters ? 'pi pi-filter-slash' : 'pi pi-filter'"
            severity="secondary"
            text
            @click="showFilters = !showFilters"
          />

          <PrimeButton
            v-if="hasActiveFilters"
            :label="$t('admin.transactions.list.filters.clearFilters')"
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
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.transactions.list.filters.status') }}</label>
              <PrimeSelect
                v-model="statusFilter"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('admin.transactions.list.filters.selectStatus')"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Payment Type Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.transactions.list.filters.paymentType') }}</label>
              <PrimeSelect
                v-model="paymentTypeFilter"
                :options="paymentTypeOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('admin.transactions.list.filters.selectType')"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Date From -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.transactions.list.filters.dateFrom') }}</label>
              <PrimeDatePicker
                v-model="dateFromFilter"
                dateFormat="dd/mm/yy"
                :placeholder="$t('admin.transactions.list.filters.selectDate')"
                class="w-full"
                showIcon
                @date-select="applyFilters"
              />
            </div>

            <!-- Date To -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.transactions.list.filters.dateTo') }}</label>
              <PrimeDatePicker
                v-model="dateToFilter"
                dateFormat="dd/mm/yy"
                :placeholder="$t('admin.transactions.list.filters.selectDate')"
                class="w-full"
                showIcon
                @date-select="applyFilters"
              />
            </div>

            <!-- Amount Min -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.transactions.list.filters.amountMin') }}</label>
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
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.transactions.list.filters.amountMax') }}</label>
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
            <div class="form-group mb-0 text-right md:col-span-2">
              <label class="text-sm font-medium text-neutral-700 mb-2 block invisible">Azioni</label>
              <PrimeButton
                :label="$t('admin.transactions.list.filters.applyFilters')"
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
        :currentPageReportTemplate="$t('admin.transactions.list.table.paginatorTemplate')"
        @page="onPage"
        @sort="onSort"
      >
        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-12">
            <i class="pi pi-credit-card text-4xl text-neutral-400 mb-4 block"></i>
            <p class="text-neutral-600 mb-4">{{ $t('admin.transactions.list.table.empty') }}</p>
            <p class="text-sm text-neutral-500">
              {{ $t('admin.transactions.list.table.emptySubtext') }}
            </p>
          </div>
        </template>

        <!-- Loading -->
        <template #loading>
          <div class="flex items-center justify-center py-8">
            <i class="pi pi-spin pi-spinner text-2xl text-primary-500 mr-3"></i>
            <span class="text-neutral-600">{{ $t('admin.transactions.list.table.loading') }}</span>
          </div>
        </template>

        <!-- Checkbox Column -->
        <PrimeColumn selectionMode="multiple" headerStyle="width: 3rem" />

        <!-- Payment Intent ID -->
        <PrimeColumn field="stripe_payment_intent_id" :header="$t('admin.transactions.list.table.headers.paymentIntent')" sortable style="min-width: 180px">
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
                v-tooltip.top="$t('admin.transactions.list.tooltip.copyId')"
                @click.stop="handleCopyPaymentIntent(data)"
              />
            </div>
          </template>
        </PrimeColumn>

        <!-- Order -->
        <PrimeColumn field="order.order_number" :header="$t('admin.transactions.list.table.headers.order')" style="min-width: 140px">
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
        <PrimeColumn field="order.user.client_profile.company_name" :header="$t('admin.transactions.list.table.headers.client')" sortable style="min-width: 200px">
          <template #body="{ data }">
            <div
              v-if="(data as any).order?.user?.client_profile || (data as any).client"
              class="cursor-pointer"
              @click="navigateToClient(data)"
            >
              <div class="font-medium text-neutral-900 hover:text-primary-600">
                {{ (data as any).order?.user?.client_profile?.company_name || (data as any).client?.company_name }}
              </div>
              <div class="text-xs text-neutral-500">
                {{ (data as any).order?.user?.email || (data as any).client?.email }}
              </div>
            </div>
            <span v-else class="text-neutral-400">-</span>
          </template>
        </PrimeColumn>

        <!-- Payment Type -->
        <PrimeColumn field="payment_type" :header="$t('admin.transactions.list.table.headers.type')" style="min-width: 140px">
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
        <PrimeColumn field="amount" :header="$t('admin.transactions.list.table.headers.amount')" sortable style="min-width: 120px">
          <template #body="{ data }">
            <span class="font-semibold text-neutral-900">{{ formatCurrency(data.amount, data.currency) }}</span>
          </template>
        </PrimeColumn>

        <!-- Status -->
        <PrimeColumn field="status" :header="$t('admin.transactions.list.table.headers.status')" sortable style="min-width: 150px">
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
        <PrimeColumn field="failure_code" :header="$t('admin.transactions.list.table.headers.error')" style="min-width: 150px">
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
        <PrimeColumn field="created_at" :header="$t('admin.transactions.list.table.headers.date')" sortable style="min-width: 150px">
          <template #body="{ data }">
            <div>
              <div class="text-neutral-700">{{ formatDate(data.created_at) }}</div>
              <div class="text-xs text-neutral-500">{{ formatDateTime(data.created_at).split(' ')[1] }}</div>
            </div>
          </template>
        </PrimeColumn>

        <!-- Processed At -->
        <PrimeColumn field="processed_at" :header="$t('admin.transactions.list.table.headers.processedAt')" sortable style="min-width: 130px">
          <template #body="{ data }">
            <span v-if="data.processed_at" class="text-success-dark">
              {{ formatDate(data.processed_at) }}
            </span>
            <span v-else class="text-neutral-400">-</span>
          </template>
        </PrimeColumn>

        <!-- Actions -->
        <PrimeColumn :header="$t('admin.transactions.list.table.headers.actions')" style="min-width: 100px" frozen alignFrozen="right">
          <template #body="{ data }">
            <div class="flex gap-1 justify-end">
              <!-- View Details -->
              <PrimeButton
                icon="pi pi-eye"
                severity="primary"
                text
                rounded
                size="small"
                v-tooltip.top="$t('admin.transactions.list.tooltip.viewDetails')"
                @click="navigateToDetail(data)"
              />

              <!-- Open Stripe -->
              <PrimeButton
                icon="pi pi-external-link"
                severity="secondary"
                text
                rounded
                size="small"
                v-tooltip.top="$t('admin.transactions.list.tooltip.openStripe')"
                @click="handleOpenStripe(data)"
              />

              <!-- More Actions Menu -->
              <PrimeButton
                icon="pi pi-ellipsis-v"
                severity="secondary"
                text
                rounded
                size="small"
                v-tooltip.top="$t('admin.transactions.list.tooltip.moreActions')"
                @click="(event: Event) => ($refs[`menu-${data.id}`] as any)?.toggle(event)"
              />

              <PrimeMenu
                :ref="`menu-${data.id}`"
                :model="[
                  {
                    label: $t('admin.transactions.list.contextMenu.viewDetails'),
                    icon: 'pi pi-eye',
                    command: () => navigateToDetail(data)
                  },
                  {
                    label: $t('admin.transactions.list.contextMenu.openStripe'),
                    icon: 'pi pi-external-link',
                    command: () => handleOpenStripe(data)
                  },
                  {
                    label: $t('admin.transactions.list.contextMenu.copyPaymentIntentId'),
                    icon: 'pi pi-copy',
                    command: () => handleCopyPaymentIntent(data)
                  },
                  { separator: true },
                  {
                    label: $t('admin.transactions.list.contextMenu.goToOrder'),
                    icon: 'pi pi-shopping-cart',
                    command: () => navigateToOrder(data),
                    visible: !!data.order
                  },
                  {
                    label: $t('admin.transactions.list.contextMenu.goToClient'),
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
