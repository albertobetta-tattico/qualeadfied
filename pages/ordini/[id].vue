<script setup lang="ts">
/**
 * Page - Order Detail
 * Detailed view of an order with items, billing data and invoice
 */
definePageMeta({
  layout: 'client'
})

const route = useRoute('ordini-id')
const router = useRouter()
const orderId = computed(() => {
  const id = route.params.id
  return Number(Array.isArray(id) ? id[0] : id)
})

// Print helper
const printPage = () => {
  if (import.meta.client) {
    window.print()
  }
}

const ordersStore = useClientOrdersStore()
const {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatOrderStatus,
  getOrderStatusSeverity,
  formatOrderType,
  formatPurchaseMode
} = useClientFormatters()
const { showSuccess, showError } = useClientToast()

// Fetch order on mount
onMounted(async () => {
  const order = await ordersStore.fetchOrder(orderId.value)
  if (!order) {
    router.push('/ordini')
  }
})

// Current order
const order = computed(() => ordersStore.currentOrder)

// Download invoice
const downloadInvoice = async () => {
  if (!order.value) return

  const url = await ordersStore.downloadInvoice(order.value.id)
  if (url) {
    window.open(url, '_blank')
    showSuccess('Download avviato')
  } else {
    showError(ordersStore.error || 'Errore nel download')
  }
}

// Payment method label
const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    card: 'Carta di credito',
    sepa: 'Addebito SEPA',
    free: 'Gratuito'
  }
  return labels[method] || method
}
</script>

<template>
  <div class="order-detail-page">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/ordini" class="inline-flex items-center gap-2 text-primary hover:underline mb-4">
        <i class="pi pi-arrow-left"></i>
        Torna agli ordini
      </NuxtLink>

      <div v-if="order" class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <Tag
              :value="formatOrderStatus(order.status)"
              :severity="getOrderStatusSeverity(order.status)"
            />
            <Tag
              :value="formatOrderType(order.order_type)"
              :severity="order.order_type === 'free_trial' ? 'secondary' : 'info'"
            />
          </div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">
            Ordine {{ order.order_number }}
          </h1>
          <p class="text-surface-600 dark:text-surface-400">
            Effettuato il {{ formatDateTime(order.created_at) }}
          </p>
        </div>

        <div class="flex gap-2">
          <Button
            v-if="order.invoice_url"
            label="Scarica Fattura"
            icon="pi pi-download"
            @click="downloadInvoice"
          />
          <Button
            label="Stampa"
            icon="pi pi-print"
            severity="secondary"
            @click="printPage"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="ordersStore.loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>

    <!-- Order Content -->
    <div v-else-if="order" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Order Items -->
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-list text-primary"></i>
              Lead Acquistati ({{ order.items_count }})
            </div>
          </template>
          <template #content>
            <div v-if="order.items && order.items.length > 0" class="space-y-4">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center gap-4 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg"
              >
                <div class="flex-grow">
                  <div class="flex items-center gap-2 mb-1">
                    <Tag :value="item.lead?.category?.name" severity="info" size="small" />
                    <Tag :value="item.lead?.province?.code" severity="secondary" size="small" />
                  </div>
                  <h4 class="font-medium text-surface-900 dark:text-surface-0">
                    {{ item.lead?.first_name }} {{ item.lead?.last_name?.charAt(0) }}.
                  </h4>
                  <p class="text-sm text-surface-500 line-clamp-1">
                    {{ item.lead?.request_text }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-surface-900 dark:text-surface-0">
                    {{ formatCurrency(item.price) }}
                  </p>
                  <p class="text-xs text-surface-500">
                    {{ formatPurchaseMode(item.purchase_mode) }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-surface-500">
              <i class="pi pi-info-circle text-2xl mb-2"></i>
              <p>Dettagli lead non disponibili</p>
            </div>
          </template>
        </Card>

        <!-- Billing Data -->
        <Card v-if="order.billing_data">
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-file-edit text-primary"></i>
              Dati di Fatturazione
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-surface-500 mb-1">Ragione Sociale</p>
                <p class="font-medium text-surface-900 dark:text-surface-0">
                  {{ order.billing_data.company_name }}
                </p>
              </div>
              <div>
                <p class="text-sm text-surface-500 mb-1">Partita IVA</p>
                <p class="font-medium text-surface-900 dark:text-surface-0">
                  {{ order.billing_data.vat_number }}
                </p>
              </div>
              <div class="md:col-span-2">
                <p class="text-sm text-surface-500 mb-1">Indirizzo</p>
                <p class="font-medium text-surface-900 dark:text-surface-0">
                  {{ order.billing_data.address }}<br>
                  {{ order.billing_data.zip }} {{ order.billing_data.city }} ({{ order.billing_data.province }})
                </p>
              </div>
              <div v-if="order.billing_data.sdi_code">
                <p class="text-sm text-surface-500 mb-1">Codice SDI</p>
                <p class="font-medium text-surface-900 dark:text-surface-0">
                  {{ order.billing_data.sdi_code }}
                </p>
              </div>
              <div v-if="order.billing_data.pec_email">
                <p class="text-sm text-surface-500 mb-1">PEC</p>
                <p class="font-medium text-surface-900 dark:text-surface-0">
                  {{ order.billing_data.pec_email }}
                </p>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Sidebar -->
      <div class="space-y-4">
        <!-- Order Summary -->
        <Card>
          <template #title>Riepilogo Ordine</template>
          <template #content>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-surface-600 dark:text-surface-400">Subtotale</span>
                <span class="text-surface-900 dark:text-surface-0">
                  {{ formatCurrency(order.subtotal) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-surface-600 dark:text-surface-400">
                  IVA ({{ order.vat_rate }}%)
                </span>
                <span class="text-surface-900 dark:text-surface-0">
                  {{ formatCurrency(order.vat_amount) }}
                </span>
              </div>
              <Divider />
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-surface-900 dark:text-surface-0">
                  Totale
                </span>
                <span class="text-2xl font-bold text-primary">
                  {{ formatCurrency(order.total) }}
                </span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Payment Info -->
        <Card>
          <template #title>Pagamento</template>
          <template #content>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-surface-600 dark:text-surface-400">Metodo</span>
                <span class="text-surface-900 dark:text-surface-0">
                  {{ getPaymentMethodLabel(order.payment_method) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-surface-600 dark:text-surface-400">Stato</span>
                <Tag
                  :value="formatOrderStatus(order.status)"
                  :severity="getOrderStatusSeverity(order.status)"
                  size="small"
                />
              </div>
              <div v-if="order.paid_at" class="flex justify-between">
                <span class="text-surface-600 dark:text-surface-400">Data pagamento</span>
                <span class="text-surface-900 dark:text-surface-0">
                  {{ formatDateTime(order.paid_at) }}
                </span>
              </div>
              <div v-if="order.payment_id" class="flex justify-between">
                <span class="text-surface-600 dark:text-surface-400">ID Transazione</span>
                <span class="text-xs text-surface-500 font-mono">
                  {{ order.payment_id }}
                </span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Invoice -->
        <Card v-if="order.invoice_number">
          <template #title>Fattura</template>
          <template #content>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-surface-600 dark:text-surface-400">Numero</span>
                <span class="font-medium text-surface-900 dark:text-surface-0">
                  {{ order.invoice_number }}
                </span>
              </div>
              <Button
                label="Scarica PDF"
                icon="pi pi-download"
                class="w-full"
                @click="downloadInvoice"
              />
            </div>
          </template>
        </Card>

        <!-- Help -->
        <Card class="bg-surface-50 dark:bg-surface-800">
          <template #content>
            <div class="text-center">
              <i class="pi pi-question-circle text-2xl text-surface-400 mb-2"></i>
              <p class="text-sm text-surface-600 dark:text-surface-400 mb-3">
                Hai bisogno di assistenza per questo ordine?
              </p>
              <Button
                label="Contatta Supporto"
                icon="pi pi-envelope"
                severity="secondary"
                size="small"
                @click="router.push('/supporto')"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media print {
  .no-print {
    display: none !important;
  }
}
</style>
