<script setup lang="ts">
/**
 * Page - My Orders
 * Order history with filtering and invoice download
 */
import type { OrderStatus, OrderType } from '~/types/clientArea'

definePageMeta({
  layout: 'client'
})

const ordersStore = useClientOrdersStore()
const {
  formatCurrency,
  formatDate,
  formatOrderStatus,
  getOrderStatusSeverity,
  formatOrderType
} = useClientFormatters()
const { orderStatusOptions, orderTypeOptions } = useClientFilterOptions()
const { showSuccess, showError } = useClientToast()

// Filter state
const selectedStatus = ref<OrderStatus | ''>('')
const selectedType = ref<OrderType | ''>('')

// Fetch orders on mount
onMounted(async () => {
  await ordersStore.fetchOrders()
})

// Apply filters
const applyFilters = async () => {
  ordersStore.setFilters({
    status: selectedStatus.value || undefined,
    order_type: selectedType.value || undefined
  })
  await ordersStore.fetchOrders()
}

// Reset filters
const resetFilters = async () => {
  selectedStatus.value = ''
  selectedType.value = ''
  ordersStore.resetFilters()
  await ordersStore.fetchOrders()
}

// Watch filters
watch([selectedStatus, selectedType], () => {
  applyFilters()
})

// Pagination
const onPageChange = async (event: any) => {
  ordersStore.setPage(event.page + 1)
  await ordersStore.fetchOrders()
}

// Download invoice
const downloadInvoice = async (orderId: number) => {
  const url = await ordersStore.downloadInvoice(orderId)
  if (url) {
    window.open(url, '_blank')
    showSuccess('Download avviato')
  } else {
    showError(ordersStore.error || 'Errore nel download')
  }
}

// Navigate to order detail
const router = useRouter()
const viewOrder = (orderId: number) => {
  router.push(`/ordini/${orderId}`)
}
</script>

<template>
  <div class="orders-page">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">I Miei Ordini</h1>
        <p class="text-surface-600 dark:text-surface-400">
          Storico dei tuoi ordini e fatture
        </p>
      </div>
      <NuxtLink to="/leads">
        <PrimeButton label="Acquista Lead" icon="pi pi-plus" />
      </NuxtLink>
    </div>

    <!-- Filters -->
    <PrimeCard class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Stato
            </label>
            <PrimeSelect
              v-model="selectedStatus"
              :options="orderStatusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Tutti gli stati"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Tipo Ordine
            </label>
            <PrimeSelect
              v-model="selectedType"
              :options="orderTypeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Tutti i tipi"
              class="w-full"
            />
          </div>
          <div class="md:col-span-2 flex items-end gap-2">
            <PrimeButton
              label="Filtra"
              icon="pi pi-search"
              @click="applyFilters"
            />
            <PrimeButton
              label="Reset"
              icon="pi pi-times"
              severity="secondary"
              @click="resetFilters"
            />
          </div>
        </div>
      </template>
    </PrimeCard>

    <!-- Loading State -->
    <div v-if="ordersStore.loading" class="flex justify-center py-12">
      <PrimeProgressSpinner />
    </div>

    <!-- Orders List -->
    <div v-else-if="ordersStore.orders.length > 0">
      <PrimeCard class="mb-6">
        <template #content>
          <PrimeDataTable
            :value="ordersStore.orders"
            responsiveLayout="scroll"
            class="orders-table"
            @row-click="(e: any) => viewOrder(e.data.id)"
          >
            <PrimeColumn field="order_number" header="Ordine" sortable>
              <template #body="{ data }">
                <span class="font-medium text-primary cursor-pointer hover:underline">
                  {{ data.order_number }}
                </span>
              </template>
            </PrimeColumn>

            <PrimeColumn field="created_at" header="Data" sortable>
              <template #body="{ data }">
                {{ formatDate(data.created_at) }}
              </template>
            </PrimeColumn>

            <PrimeColumn field="order_type" header="Tipo">
              <template #body="{ data }">
                <PrimeTag
                  :value="formatOrderType(data.order_type)"
                  :severity="data.order_type === 'free_trial' ? 'secondary' : 'info'"
                  size="small"
                />
              </template>
            </PrimeColumn>

            <PrimeColumn field="items_count" header="Lead">
              <template #body="{ data }">
                {{ data.items_count }}
              </template>
            </PrimeColumn>

            <PrimeColumn field="total" header="Totale" sortable>
              <template #body="{ data }">
                <span class="font-semibold">
                  {{ formatCurrency(data.total) }}
                </span>
              </template>
            </PrimeColumn>

            <PrimeColumn field="status" header="Stato">
              <template #body="{ data }">
                <PrimeTag
                  :value="formatOrderStatus(data.status)"
                  :severity="getOrderStatusSeverity(data.status)"
                  size="small"
                />
              </template>
            </PrimeColumn>

            <PrimeColumn header="Azioni" style="width: 150px">
              <template #body="{ data }">
                <div class="flex gap-1">
                  <PrimeButton
                    icon="pi pi-eye"
                    size="small"
                    rounded
                    text
                    v-tooltip.top="'Dettagli'"
                    @click.stop="viewOrder(data.id)"
                  />
                  <PrimeButton
                    v-if="data.invoice_url"
                    icon="pi pi-download"
                    size="small"
                    rounded
                    text
                    severity="secondary"
                    v-tooltip.top="'Scarica fattura'"
                    @click.stop="downloadInvoice(data.id)"
                  />
                </div>
              </template>
            </PrimeColumn>
          </PrimeDataTable>
        </template>
      </PrimeCard>

      <!-- Pagination -->
      <div class="flex justify-center">
        <PrimePaginator
          :rows="ordersStore.pagination.per_page"
          :totalRecords="ordersStore.pagination.total"
          :first="(ordersStore.pagination.current_page - 1) * ordersStore.pagination.per_page"
          @page="onPageChange"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <i class="pi pi-shopping-cart text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
      <h2 class="text-2xl font-bold text-surface-700 dark:text-surface-300 mb-2">
        Nessun ordine
      </h2>
      <p class="text-surface-500 dark:text-surface-400 mb-6">
        Non hai ancora effettuato nessun ordine
      </p>
      <div class="flex justify-center gap-3">
        <NuxtLink to="/leads">
          <PrimeButton label="Vai al Catalogo" icon="pi pi-search" size="large" />
        </NuxtLink>
        <NuxtLink to="/pacchetti">
          <PrimeButton label="Acquista Pacchetto" icon="pi pi-box" severity="secondary" size="large" />
        </NuxtLink>
      </div>
    </div>

    <!-- Summary Stats -->
    <PrimeCard v-if="ordersStore.orders.length > 0" class="mt-6 bg-surface-50 dark:bg-surface-800">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p class="text-3xl font-bold text-surface-900 dark:text-surface-0">
              {{ ordersStore.totalOrders }}
            </p>
            <p class="text-sm text-surface-500">Ordini totali</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-primary">
              {{ formatCurrency(ordersStore.totalSpent) }}
            </p>
            <p class="text-sm text-surface-500">Spesa totale</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-green-500">
              {{ ordersStore.completedOrders.length }}
            </p>
            <p class="text-sm text-surface-500">Ordini completati</p>
          </div>
        </div>
      </template>
    </PrimeCard>
  </div>
</template>

<style scoped>
:deep(.orders-table .p-datatable-tbody > tr) {
  cursor: pointer;
  transition: background-color 0.2s;
}

:deep(.orders-table .p-datatable-tbody > tr:hover) {
  background-color: var(--p-surface-50);
}

:deep(.dark .orders-table .p-datatable-tbody > tr:hover) {
  background-color: var(--p-surface-800);
}
</style>
