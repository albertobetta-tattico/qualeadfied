<script setup lang="ts">
/**
 * Admin Orders Page - Elenco Ordini
 * Gestione completa degli ordini con filtri, paginazione e dettagli
 */
import { useOrderFormatters, useOrderActions, useOrderOptions } from '~/composables/useOrder'
import type { Order, OrderStatus, OrderType, PaymentMethod } from '~/types/order'

definePageMeta({
  layout: 'admin'
})

const { t } = useI18n()

// Store & Composables
const orderStore = useOrderStore()
const { 
  formatStatus, 
  getStatusSeverity, 
  formatType,
  getTypeSeverity,
  formatPaymentMethod,
  getPaymentMethodIcon,
  formatDate, 
  formatDateTime,
  formatCurrency,
  getClientFullName 
} = useOrderFormatters()
const { showSuccess, showError, copyOrderNumber } = useOrderActions()
const { statusOptions, typeOptions, paymentMethodOptions } = useOrderOptions()
const router = useRouter()

// Refs
const selectedOrders = ref<Order[]>([])
const showFilters = ref(false)

// Filters
const searchQuery = ref('')
const statusFilter = ref<OrderStatus | ''>('')
const typeFilter = ref<OrderType | ''>('')
const paymentMethodFilter = ref<PaymentMethod | ''>('')
const dateFromFilter = ref<Date | null>(null)
const dateToFilter = ref<Date | null>(null)

// Computed
const orders = computed(() => orderStore.orders)
const loading = computed(() => orderStore.loading)
const pagination = computed(() => orderStore.pagination)
const stats = computed(() => orderStore.stats)
const hasActiveFilters = computed(() => orderStore.hasActiveFilters)

// Pagination
const first = ref(0)
const rows = ref(10)

// Methods
const loadOrders = async () => {
  await orderStore.fetchOrders()
}

const loadStats = async () => {
  await orderStore.fetchStats()
}

// Helper to format date for API
const formatDateForApi = (date: Date | null): string => {
  if (!date) return ''
  return date.toISOString().split('T')[0]
}

const applyFilters = () => {
  orderStore.setFilters({
    search: searchQuery.value,
    status: statusFilter.value,
    type: typeFilter.value,
    payment_method: paymentMethodFilter.value,
    date_from: formatDateForApi(dateFromFilter.value),
    date_to: formatDateForApi(dateToFilter.value)
  })
  loadOrders()
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  typeFilter.value = ''
  paymentMethodFilter.value = ''
  dateFromFilter.value = null
  dateToFilter.value = null
  orderStore.resetFilters()
  loadOrders()
}

const onPage = (event: any) => {
  orderStore.setFilters({
    page: event.page + 1,
    per_page: event.rows
  })
  loadOrders()
}

const onSort = (event: any) => {
  orderStore.setFilters({
    sort_by: event.sortField,
    sort_order: event.sortOrder === 1 ? 'asc' : 'desc'
  })
  loadOrders()
}

// Actions
const navigateToDetail = (order: Order) => {
  router.push(`/admin/orders/${order.id}`)
}

const handleCopyOrderNumber = (order: Order) => {
  copyOrderNumber(order.order_number)
}

const exportOrders = () => {
  // TODO: Implementare export Excel
  showSuccess(t('admin.orders.list.actions.exportInProgress'))
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
  loadOrders()
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
        <h1 class="page-title">{{ $t('admin.orders.list.title') }}</h1>
        <p class="page-subtitle">{{ $t('admin.orders.list.subtitle') }}</p>
      </div>
      <div class="page-header-actions">
        <PrimeButton
          :label="$t('admin.orders.list.actions.export')"
          icon="pi pi-download"
          severity="secondary"
          outlined
          @click="exportOrders"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <div class="kpi-card">
        <div class="kpi-card-icon primary">
          <i class="pi pi-shopping-cart"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.total_orders || 0 }}</div>
        <div class="kpi-card-label">{{ $t('admin.orders.list.kpis.totalOrders') }}</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon success">
          <i class="pi pi-euro"></i>
        </div>
        <div class="kpi-card-value">{{ formatCurrency(stats?.total_revenue || 0) }}</div>
        <div class="kpi-card-label">{{ $t('admin.orders.list.kpis.totalRevenue') }}</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon info">
          <i class="pi pi-calendar"></i>
        </div>
        <div class="kpi-card-value">{{ stats?.orders_this_month || 0 }}</div>
        <div class="kpi-card-label">{{ $t('admin.orders.list.kpis.ordersThisMonth') }}</div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-card-icon warning">
          <i class="pi pi-clock"></i>
        </div>
        <div class="kpi-card-value">{{ (stats?.orders_by_status?.pending || 0) + (stats?.orders_by_status?.processing || 0) }}</div>
        <div class="kpi-card-label">{{ $t('admin.orders.list.kpis.pendingProcessing') }}</div>
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
              :placeholder="$t('admin.orders.list.search.placeholder')"
              class="w-full"
              @input="onSearchInput"
            />
          </span>
        </div>

        <!-- Filter Actions -->
        <div class="flex gap-3 items-center">
          <PrimeButton
            :label="showFilters ? $t('common.hideFilters') : $t('common.showFilters')"
            :icon="showFilters ? 'pi pi-filter-slash' : 'pi pi-filter'"
            severity="secondary"
            text
            @click="showFilters = !showFilters"
          />

          <PrimeButton
            v-if="hasActiveFilters"
            :label="$t('common.clearFilters')"
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
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.orders.list.filters.status') }}</label>
              <PrimeSelect
                v-model="statusFilter"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('common.selectStatus')"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Type Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.orders.list.filters.orderType') }}</label>
              <PrimeSelect
                v-model="typeFilter"
                :options="typeOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('common.selectType')"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Payment Method Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.orders.list.filters.paymentMethod') }}</label>
              <PrimeSelect
                v-model="paymentMethodFilter"
                :options="paymentMethodOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('common.selectMethod')"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Date From -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.orders.list.filters.dateFrom') }}</label>
              <PrimeDatePicker
                v-model="dateFromFilter"
                dateFormat="dd/mm/yy"
                :placeholder="$t('common.selectDate')"
                class="w-full"
                showIcon
                @date-select="applyFilters"
              />
            </div>

            <!-- Date To -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.orders.list.filters.dateTo') }}</label>
              <PrimeDatePicker
                v-model="dateToFilter"
                dateFormat="dd/mm/yy"
                :placeholder="$t('common.selectDate')"
                class="w-full"
                showIcon
                @date-select="applyFilters"
              />
            </div>

            <!-- Apply Button -->
            <div class="form-group mb-0 text-right md:col-span-2 lg:col-span-3">
              <label class="text-sm font-medium text-neutral-700 mb-2 block invisible">Azioni</label>
              <PrimeButton
                :label="$t('common.applyFilters')"
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
        v-model:selection="selectedOrders"
        :value="orders"
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
        :currentPageReportTemplate="$t('admin.orders.list.table.paginatorTemplate')"
        @page="onPage"
        @sort="onSort"
      >
        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-12">
            <i class="pi pi-shopping-cart text-4xl text-neutral-400 mb-4 block"></i>
            <p class="text-neutral-600 mb-4">{{ $t('admin.orders.list.table.empty') }}</p>
            <p class="text-sm text-neutral-500">
              {{ $t('admin.orders.list.table.emptySubtext') }}
            </p>
          </div>
        </template>

        <!-- Loading -->
        <template #loading>
          <div class="flex items-center justify-center py-8">
            <i class="pi pi-spin pi-spinner text-2xl text-primary-500 mr-3"></i>
            <span class="text-neutral-600">{{ $t('admin.orders.list.table.loading') }}</span>
          </div>
        </template>

        <!-- Checkbox Column -->
        <PrimeColumn selectionMode="multiple" headerStyle="width: 3rem" />

        <!-- Order Number -->
        <PrimeColumn field="order_number" :header="$t('admin.orders.list.table.headers.orderNumber')" sortable style="min-width: 150px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <span 
                class="font-mono font-medium text-primary-700 cursor-pointer hover:text-primary-900"
                @click="navigateToDetail(data)"
              >
                {{ data.order_number }}
              </span>
              <PrimeButton
                icon="pi pi-copy"
                severity="secondary"
                text
                rounded
                size="small"
                class="p-0 w-6 h-6"
                v-tooltip.top="$t('admin.orders.list.tooltip.copyNumber')"
                @click.stop="handleCopyOrderNumber(data)"
              />
            </div>
          </template>
        </PrimeColumn>

        <!-- Client -->
        <PrimeColumn field="client.company_name" :header="$t('admin.orders.list.table.headers.client')" sortable style="min-width: 200px">
          <template #body="{ data }">
            <div v-if="data.client">
              <div class="font-medium text-neutral-900">{{ data.client.company_name }}</div>
              <div class="text-xs text-neutral-500">{{ data.client.email }}</div>
            </div>
            <span v-else class="text-neutral-400">-</span>
          </template>
        </PrimeColumn>

        <!-- Type -->
        <PrimeColumn field="type" :header="$t('admin.orders.list.table.headers.type')" sortable style="min-width: 120px">
          <template #body="{ data }">
            <PrimeTag 
              :value="formatType(data.type)"
              :severity="getTypeSeverity(data.type)"
            />
          </template>
        </PrimeColumn>

        <!-- Payment Method -->
        <PrimeColumn field="payment_method" :header="$t('admin.orders.list.table.headers.payment')" style="min-width: 140px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <i 
                class="pi" 
                :class="getPaymentMethodIcon(data.payment_method)"
              ></i>
              <span class="text-neutral-700">{{ formatPaymentMethod(data.payment_method) }}</span>
            </div>
          </template>
        </PrimeColumn>

        <!-- Total -->
        <PrimeColumn field="total" :header="$t('admin.orders.list.table.headers.total')" sortable style="min-width: 120px">
          <template #body="{ data }">
            <span class="font-semibold text-neutral-900">{{ formatCurrency(data.total) }}</span>
          </template>
        </PrimeColumn>

        <!-- Status -->
        <PrimeColumn field="status" :header="$t('admin.orders.list.table.headers.status')" sortable style="min-width: 130px">
          <template #body="{ data }">
            <PrimeTag 
              :value="formatStatus(data.status)"
              :severity="getStatusSeverity(data.status)"
            />
          </template>
        </PrimeColumn>

        <!-- Date -->
        <PrimeColumn field="created_at" :header="$t('admin.orders.list.table.headers.date')" sortable style="min-width: 150px">
          <template #body="{ data }">
            <div>
              <div class="text-neutral-700">{{ formatDate(data.created_at) }}</div>
              <div class="text-xs text-neutral-500">{{ formatDateTime(data.created_at).split(' ')[1] }}</div>
            </div>
          </template>
        </PrimeColumn>

        <!-- Paid At -->
        <PrimeColumn field="paid_at" :header="$t('admin.orders.list.table.headers.paidAt')" sortable style="min-width: 130px">
          <template #body="{ data }">
            <span v-if="data.paid_at" class="text-success-dark">
              {{ formatDate(data.paid_at) }}
            </span>
            <span v-else class="text-neutral-400">-</span>
          </template>
        </PrimeColumn>

        <!-- Actions -->
        <PrimeColumn :header="$t('admin.orders.list.table.headers.actions')" style="min-width: 100px" frozen alignFrozen="right">
          <template #body="{ data }">
            <div class="flex gap-1 justify-end">
              <!-- View Details -->
              <PrimeButton
                icon="pi pi-eye"
                severity="primary"
                text
                rounded
                size="small"
                v-tooltip.top="$t('admin.orders.list.tooltip.viewDetails')"
                @click="navigateToDetail(data)"
              />

              <!-- More Actions Menu -->
              <PrimeButton
                icon="pi pi-ellipsis-v"
                severity="secondary"
                text
                rounded
                size="small"
                v-tooltip.top="$t('admin.orders.list.tooltip.moreActions')"
                @click="(event: Event) => ($refs[`menu-${data.id}`] as any)?.toggle(event)"
              />

              <PrimeMenu
                :ref="`menu-${data.id}`"
                :model="[
                  {
                    label: $t('admin.orders.list.contextMenu.viewDetails'),
                    icon: 'pi pi-eye',
                    command: () => navigateToDetail(data)
                  },
                  {
                    label: $t('admin.orders.list.contextMenu.copyOrderNumber'),
                    icon: 'pi pi-copy',
                    command: () => handleCopyOrderNumber(data)
                  },
                  {
                    label: $t('admin.orders.list.contextMenu.goToClient'),
                    icon: 'pi pi-user',
                    command: () => router.push(`/admin/clients/${data.user_id}`),
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
  min-width: 180px;
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
