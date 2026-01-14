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
        <Button label="Acquista Lead" icon="pi pi-plus" />
      </NuxtLink>
    </div>

    <!-- Filters -->
    <Card class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Stato
            </label>
            <Select
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
            <Select
              v-model="selectedType"
              :options="orderTypeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Tutti i tipi"
              class="w-full"
            />
          </div>
          <div class="md:col-span-2 flex items-end gap-2">
            <Button
              label="Filtra"
              icon="pi pi-search"
              @click="applyFilters"
            />
            <Button
              label="Reset"
              icon="pi pi-times"
              severity="secondary"
              @click="resetFilters"
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- Loading State -->
    <div v-if="ordersStore.loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>

    <!-- Orders List -->
    <div v-else-if="ordersStore.orders.length > 0">
      <Card class="mb-6">
        <template #content>
          <DataTable
            :value="ordersStore.orders"
            responsiveLayout="scroll"
            class="orders-table"
            @row-click="(e: any) => viewOrder(e.data.id)"
          >
            <Column field="order_number" header="Ordine" sortable>
              <template #body="{ data }">
                <span class="font-medium text-primary cursor-pointer hover:underline">
                  {{ data.order_number }}
                </span>
              </template>
            </Column>

            <Column field="created_at" header="Data" sortable>
              <template #body="{ data }">
                {{ formatDate(data.created_at) }}
              </template>
            </Column>

            <Column field="order_type" header="Tipo">
              <template #body="{ data }">
                <Tag
                  :value="formatOrderType(data.order_type)"
                  :severity="data.order_type === 'free_trial' ? 'secondary' : 'info'"
                  size="small"
                />
              </template>
            </Column>

            <Column field="items_count" header="Lead">
              <template #body="{ data }">
                {{ data.items_count }}
              </template>
            </Column>

            <Column field="total" header="Totale" sortable>
              <template #body="{ data }">
                <span class="font-semibold">
                  {{ formatCurrency(data.total) }}
                </span>
              </template>
            </Column>

            <Column field="status" header="Stato">
              <template #body="{ data }">
                <Tag
                  :value="formatOrderStatus(data.status)"
                  :severity="getOrderStatusSeverity(data.status)"
                  size="small"
                />
              </template>
            </Column>

            <Column header="Azioni" style="width: 150px">
              <template #body="{ data }">
                <div class="flex gap-1">
                  <Button
                    icon="pi pi-eye"
                    size="small"
                    rounded
                    text
                    v-tooltip.top="'Dettagli'"
                    @click.stop="viewOrder(data.id)"
                  />
                  <Button
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
            </Column>
          </DataTable>
        </template>
      </Card>

      <!-- Pagination -->
      <div class="flex justify-center">
        <Paginator
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
          <Button label="Vai al Catalogo" icon="pi pi-search" size="large" />
        </NuxtLink>
        <NuxtLink to="/pacchetti">
          <Button label="Acquista Pacchetto" icon="pi pi-box" severity="secondary" size="large" />
        </NuxtLink>
      </div>
    </div>

    <!-- Summary Stats -->
    <Card v-if="ordersStore.orders.length > 0" class="mt-6 bg-surface-50 dark:bg-surface-800">
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
    </Card>
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
