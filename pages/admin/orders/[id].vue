<script setup lang="ts">
/**
 * Admin Orders - Order Detail
 * Visualizzazione dettagliata di un singolo ordine
 */
import { useOrderFormatters, useOrderActions } from '~/composables/useOrder'
import type { OrderItem } from '~/types/order'

definePageMeta({
  layout: 'admin'
})

// Route & Store
const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const { 
  formatStatus, 
  getStatusSeverity,
  formatType,
  getTypeSeverity,
  formatPaymentMethod,
  getPaymentMethodIcon,
  formatAcquisitionMode,
  getAcquisitionModeSeverity,
  formatDate, 
  formatDateTime,
  formatCurrency,
  formatVatNumber,
  getClientFullName,
  getLeadsCount,
  formatBillingAddress
} = useOrderFormatters()
const { showSuccess, showError, copyOrderNumber, openStripeTransaction } = useOrderActions()

// Get order ID from route
const orderId = computed(() => {
  const params = route.params as { id: string }
  return Number(params.id)
})

// Loading state
const initialLoading = ref(true)

// Current order
const order = computed(() => orderStore.currentOrder)

// Active tab
const activeTab = ref(0)

// Load order data
const loadOrder = async () => {
  initialLoading.value = true
  await orderStore.fetchOrder(orderId.value)
  initialLoading.value = false
}

// Actions
const handleCopyOrderNumber = () => {
  if (order.value) {
    copyOrderNumber(order.value.order_number)
  }
}

const handleOpenStripe = () => {
  if (order.value?.transaction?.stripe_payment_intent_id) {
    openStripeTransaction(order.value.transaction.stripe_payment_intent_id)
  }
}

const navigateToClient = () => {
  if (order.value?.client) {
    router.push(`/admin/clients/${order.value.user_id}`)
  }
}

// Go back
const goBack = () => {
  router.push('/admin/orders')
}

// Computed helpers
const totalLeads = computed(() => {
  if (!order.value?.items) return 0
  return getLeadsCount(order.value.items)
})

const hasInvoice = computed(() => !!order.value?.invoice)
const hasTransaction = computed(() => !!order.value?.transaction)

// Item type helpers
const isLeadItem = (item: OrderItem): boolean => item.lead_id !== null
const isPackageItem = (item: OrderItem): boolean => item.package_id !== null

// Lifecycle
onMounted(() => {
  loadOrder()
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="initialLoading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <i class="pi pi-spin pi-spinner text-4xl text-primary-500 mb-4"></i>
        <p class="text-neutral-600">Caricamento ordine...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!order" class="text-center py-20">
      <div class="w-20 h-20 rounded-full bg-danger-light flex items-center justify-center mx-auto mb-4">
        <i class="pi pi-exclamation-triangle text-4xl text-danger"></i>
      </div>
      <h2 class="text-xl font-semibold text-neutral-900 mb-2">Ordine non trovato</h2>
      <p class="text-neutral-600 mb-6">L'ordine richiesto non esiste o è stato eliminato.</p>
      <PrimeButton
        label="Torna all'elenco"
        icon="pi pi-arrow-left"
        severity="primary"
        @click="goBack"
      />
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header-left">
          <div class="flex items-center gap-4 mb-2">
            <PrimeButton
              icon="pi pi-arrow-left"
              severity="secondary"
              text
              rounded
              @click="goBack"
            />
            <div>
              <div class="flex items-center gap-3">
                <h1 class="page-title mb-0">{{ order.order_number }}</h1>
                <PrimeButton
                  icon="pi pi-copy"
                  severity="secondary"
                  text
                  rounded
                  size="small"
                  v-tooltip.top="'Copia numero ordine'"
                  @click="handleCopyOrderNumber"
                />
              </div>
              <div class="flex items-center gap-3 mt-2">
                <PrimeTag 
                  :value="formatStatus(order.status)"
                  :severity="getStatusSeverity(order.status)"
                />
                <PrimeTag 
                  :value="formatType(order.type)"
                  :severity="getTypeSeverity(order.type)"
                />
                <span class="text-sm text-neutral-500">
                  {{ formatDateTime(order.created_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="page-header-actions">
          <PrimeButton
            v-if="hasTransaction"
            label="Vedi su Stripe"
            icon="pi pi-external-link"
            severity="secondary"
            outlined
            @click="handleOpenStripe"
          />
          <PrimeButton
            v-if="order.client"
            label="Vai al Cliente"
            icon="pi pi-user"
            severity="primary"
            outlined
            @click="navigateToClient"
          />
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <!-- Total Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">Totale Ordine</span>
            <i class="pi pi-euro text-lg text-success"></i>
          </div>
          <div class="text-2xl font-bold text-neutral-900">
            {{ formatCurrency(order.total) }}
          </div>
          <div class="text-xs text-neutral-500 mt-1">
            {{ formatCurrency(order.subtotal) }} + IVA {{ order.vat_rate }}%
          </div>
        </div>

        <!-- Leads Count Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">Lead Inclusi</span>
            <i class="pi pi-list text-lg text-info"></i>
          </div>
          <div class="text-2xl font-bold text-neutral-900">
            {{ totalLeads }}
          </div>
          <div class="text-xs text-neutral-500 mt-1">
            {{ order.items?.length || 0 }} righe ordine
          </div>
        </div>

        <!-- Payment Status Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">Pagamento</span>
            <i 
              class="pi text-lg"
              :class="{
                'pi-check-circle text-success': order.status === 'paid',
                'pi-clock text-warning': order.status === 'pending' || order.status === 'processing',
                'pi-times-circle text-danger': order.status === 'failed',
                'pi-replay text-secondary': order.status === 'refunded',
                'pi-ban text-secondary': order.status === 'cancelled'
              }"
            ></i>
          </div>
          <div class="flex items-center gap-2">
            <i :class="`pi ${getPaymentMethodIcon(order.payment_method)}`"></i>
            <span class="font-medium text-neutral-900">
              {{ formatPaymentMethod(order.payment_method) }}
            </span>
          </div>
          <div v-if="order.paid_at" class="text-xs text-success-dark mt-1">
            Pagato il {{ formatDateTime(order.paid_at) }}
          </div>
        </div>

        <!-- Invoice Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">Fattura</span>
            <i 
              class="pi text-lg"
              :class="hasInvoice ? 'pi-file-check text-success' : 'pi-file text-neutral-400'"
            ></i>
          </div>
          <div v-if="hasInvoice" class="font-medium text-neutral-900">
            {{ order.invoice!.invoice_number }}
          </div>
          <div v-else class="text-neutral-500">
            Non emessa
          </div>
          <div v-if="order.invoice?.sdi_status" class="text-xs text-neutral-500 mt-1">
            SDI: {{ order.invoice.sdi_status }}
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <PrimeTabView v-model:activeIndex="activeTab" class="q-card">
        <!-- Tab: Dettagli Ordine -->
        <PrimeTabPanel value="0" header="Dettagli Ordine">
          <div class="pt-4 space-y-6">
            <!-- Order Items -->
            <div>
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">Righe Ordine</h4>
              <PrimeDataTable
                :value="order.items || []"
                class="text-sm"
                stripedRows
                showGridlines
              >
                <template #empty>
                  <div class="text-center py-8 text-neutral-500">
                    Nessuna riga ordine
                  </div>
                </template>

                <!-- Item Type -->
                <PrimeColumn header="Tipo" style="width: 100px">
                  <template #body="{ data }">
                    <span v-if="isLeadItem(data)" class="flex items-center gap-1">
                      <i class="pi pi-user text-info"></i>
                      Lead
                    </span>
                    <span v-else-if="isPackageItem(data)" class="flex items-center gap-1">
                      <i class="pi pi-box text-success"></i>
                      Pacchetto
                    </span>
                  </template>
                </PrimeColumn>

                <!-- Description -->
                <PrimeColumn header="Descrizione" style="min-width: 250px">
                  <template #body="{ data }">
                    <div v-if="data.lead">
                      <div class="font-medium text-neutral-900">
                        {{ data.lead.first_name }} {{ data.lead.last_name }}
                      </div>
                      <div class="text-xs text-neutral-500">
                        {{ data.lead.category_name }} - {{ data.lead.province_code }}
                      </div>
                      <div class="text-xs text-neutral-500">
                        {{ data.lead.email }} • {{ data.lead.phone }}
                      </div>
                    </div>
                    <div v-else-if="data.package">
                      <div class="font-medium text-neutral-900">
                        {{ data.package.name }}
                      </div>
                      <div class="text-xs text-neutral-500">
                        {{ data.package.lead_quantity }} lead inclusi
                        <span v-if="data.package.category_name"> • {{ data.package.category_name }}</span>
                      </div>
                    </div>
                    <span v-else class="text-neutral-400">-</span>
                  </template>
                </PrimeColumn>

                <!-- Acquisition Mode -->
                <PrimeColumn header="Modalità" style="width: 120px">
                  <template #body="{ data }">
                    <PrimeTag 
                      :value="formatAcquisitionMode(data.acquisition_mode)"
                      :severity="getAcquisitionModeSeverity(data.acquisition_mode)"
                      class="text-xs"
                    />
                  </template>
                </PrimeColumn>

                <!-- Quantity -->
                <PrimeColumn field="quantity" header="Qtà" style="width: 80px">
                  <template #body="{ data }">
                    <span class="text-neutral-700">{{ data.quantity }}</span>
                  </template>
                </PrimeColumn>

                <!-- Unit Price -->
                <PrimeColumn field="unit_price" header="Prezzo Unit." style="width: 120px">
                  <template #body="{ data }">
                    <span class="text-neutral-700">{{ formatCurrency(data.unit_price) }}</span>
                  </template>
                </PrimeColumn>

                <!-- Line Total -->
                <PrimeColumn field="line_total" header="Totale" style="width: 120px">
                  <template #body="{ data }">
                    <span class="font-semibold text-neutral-900">{{ formatCurrency(data.line_total) }}</span>
                  </template>
                </PrimeColumn>
              </PrimeDataTable>
            </div>

            <!-- Totals Summary -->
            <div class="flex justify-end">
              <div class="w-full max-w-xs bg-neutral-50 rounded-lg p-4">
                <div class="flex justify-between py-2 border-b border-neutral-200">
                  <span class="text-neutral-600">Subtotale</span>
                  <span class="font-medium">{{ formatCurrency(order.subtotal) }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-neutral-200">
                  <span class="text-neutral-600">IVA ({{ order.vat_rate }}%)</span>
                  <span class="font-medium">{{ formatCurrency(order.vat_amount) }}</span>
                </div>
                <div class="flex justify-between py-2 text-lg">
                  <span class="font-semibold text-neutral-900">Totale</span>
                  <span class="font-bold text-primary-700">{{ formatCurrency(order.total) }}</span>
                </div>
              </div>
            </div>
          </div>
        </PrimeTabPanel>

        <!-- Tab: Cliente -->
        <PrimeTabPanel value="1" header="Cliente">
          <div class="pt-4">
            <div v-if="order.client" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Client Info -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-neutral-900 mb-4">Dati Cliente</h4>
                
                <div class="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                  <div 
                    class="w-14 h-14 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg flex-shrink-0"
                  >
                    {{ order.client.company_name.substring(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <div class="font-semibold text-neutral-900">{{ order.client.company_name }}</div>
                    <div class="text-sm text-neutral-600">{{ formatVatNumber(order.client.vat_number) }}</div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-xs font-medium text-neutral-500 uppercase">Referente</label>
                    <p class="text-neutral-900">{{ getClientFullName(order) }}</p>
                  </div>
                  <div>
                    <label class="text-xs font-medium text-neutral-500 uppercase">Email</label>
                    <p>
                      <a :href="`mailto:${order.client.email}`" class="text-primary-600 hover:underline">
                        {{ order.client.email }}
                      </a>
                    </p>
                  </div>
                </div>

                <PrimeButton
                  label="Vai alla scheda cliente"
                  icon="pi pi-external-link"
                  severity="primary"
                  outlined
                  size="small"
                  @click="navigateToClient"
                />
              </div>

              <!-- Billing Info -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-neutral-900 mb-4">Dati Fatturazione</h4>
                
                <div v-if="order.billing_snapshot" class="space-y-3">
                  <div>
                    <label class="text-xs font-medium text-neutral-500 uppercase">Ragione Sociale</label>
                    <p class="text-neutral-900">{{ order.billing_snapshot.company_name }}</p>
                  </div>
                  <div>
                    <label class="text-xs font-medium text-neutral-500 uppercase">Partita IVA</label>
                    <p class="text-neutral-900">{{ formatVatNumber(order.billing_snapshot.vat_number) }}</p>
                  </div>
                  <div>
                    <label class="text-xs font-medium text-neutral-500 uppercase">Indirizzo</label>
                    <p class="text-neutral-900">{{ formatBillingAddress(order) }}</p>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-xs font-medium text-neutral-500 uppercase">Codice SDI</label>
                      <p class="text-neutral-900">{{ order.billing_snapshot.sdi_code || '-' }}</p>
                    </div>
                    <div>
                      <label class="text-xs font-medium text-neutral-500 uppercase">PEC</label>
                      <p class="text-neutral-900">{{ order.billing_snapshot.pec || '-' }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="text-neutral-500 italic">
                  Dati di fatturazione non disponibili
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12 text-neutral-500">
              Dati cliente non disponibili
            </div>
          </div>
        </PrimeTabPanel>

        <!-- Tab: Pagamento -->
        <PrimeTabPanel value="2" header="Pagamento">
          <div class="pt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Transaction Info -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-neutral-900 mb-4">Transazione</h4>
                
                <div v-if="order.transaction" class="space-y-3">
                  <div>
                    <label class="text-xs font-medium text-neutral-500 uppercase">Payment Intent ID</label>
                    <div class="flex items-center gap-2">
                      <code class="text-sm text-neutral-900 bg-neutral-100 px-2 py-1 rounded">
                        {{ order.transaction.stripe_payment_intent_id }}
                      </code>
                      <PrimeButton
                        icon="pi pi-external-link"
                        severity="secondary"
                        text
                        rounded
                        size="small"
                        v-tooltip.top="'Apri su Stripe'"
                        @click="handleOpenStripe"
                      />
                    </div>
                  </div>
                  
                  <div v-if="order.transaction.stripe_charge_id">
                    <label class="text-xs font-medium text-neutral-500 uppercase">Charge ID</label>
                    <code class="text-sm text-neutral-900 bg-neutral-100 px-2 py-1 rounded block">
                      {{ order.transaction.stripe_charge_id }}
                    </code>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-xs font-medium text-neutral-500 uppercase">Tipo</label>
                      <p class="text-neutral-900">
                        {{ order.transaction.payment_type === 'card' ? 'Carta di Credito' : 'SEPA Direct Debit' }}
                      </p>
                    </div>
                    <div>
                      <label class="text-xs font-medium text-neutral-500 uppercase">Stato</label>
                      <PrimeTag 
                        :value="order.transaction.status"
                        :severity="order.transaction.status === 'succeeded' ? 'success' : 'secondary'"
                      />
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-xs font-medium text-neutral-500 uppercase">Importo</label>
                      <p class="text-neutral-900 font-semibold">
                        {{ formatCurrency(order.transaction.amount) }}
                      </p>
                    </div>
                    <div>
                      <label class="text-xs font-medium text-neutral-500 uppercase">Data Elaborazione</label>
                      <p class="text-neutral-900">
                        {{ order.transaction.processed_at ? formatDateTime(order.transaction.processed_at) : '-' }}
                      </p>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8 bg-neutral-50 rounded-lg">
                  <i class="pi pi-info-circle text-3xl text-neutral-400 mb-2"></i>
                  <p class="text-neutral-600">Nessuna transazione associata</p>
                  <p class="text-sm text-neutral-500">
                    {{ order.type === 'free_trial' ? 'Ordine gratuito (prova gratuita)' : 'Pagamento non ancora elaborato' }}
                  </p>
                </div>
              </div>

              <!-- Invoice Info -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-neutral-900 mb-4">Fattura</h4>
                
                <div v-if="order.invoice" class="space-y-3">
                  <div class="p-4 bg-success-light rounded-lg flex items-center gap-3">
                    <i class="pi pi-file-check text-2xl text-success"></i>
                    <div>
                      <div class="font-semibold text-success-dark">Fattura Emessa</div>
                      <div class="text-sm text-neutral-700">{{ order.invoice.invoice_number }}</div>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-xs font-medium text-neutral-500 uppercase">Data Emissione</label>
                      <p class="text-neutral-900">{{ formatDateTime(order.invoice.issued_at) }}</p>
                    </div>
                    <div>
                      <label class="text-xs font-medium text-neutral-500 uppercase">Stato SDI</label>
                      <PrimeTag 
                        :value="order.invoice.sdi_status || 'N/A'"
                        :severity="order.invoice.sdi_status === 'delivered' ? 'success' : 'info'"
                      />
                    </div>
                  </div>
                  
                  <div v-if="order.invoice.fatture_cloud_id">
                    <label class="text-xs font-medium text-neutral-500 uppercase">ID Fatture in Cloud</label>
                    <code class="text-sm text-neutral-900 bg-neutral-100 px-2 py-1 rounded block">
                      {{ order.invoice.fatture_cloud_id }}
                    </code>
                  </div>

                  <div class="pt-2">
                    <PrimeButton
                      label="Scarica PDF"
                      icon="pi pi-download"
                      severity="primary"
                      outlined
                      size="small"
                      @click="showSuccess('Download in corso...')"
                    />
                  </div>
                </div>
                <div v-else class="text-center py-8 bg-neutral-50 rounded-lg">
                  <i class="pi pi-file text-3xl text-neutral-400 mb-2"></i>
                  <p class="text-neutral-600">Fattura non ancora emessa</p>
                  <p class="text-sm text-neutral-500">
                    La fattura verrà emessa al completamento del pagamento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PrimeTabPanel>

        <!-- Tab: Timeline -->
        <PrimeTabPanel value="3" header="Timeline">
          <div class="pt-4">
            <div class="max-w-2xl">
              <!-- Order Created -->
              <div class="flex gap-4 pb-6">
                <div class="flex flex-col items-center">
                  <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <i class="pi pi-shopping-cart text-primary-600"></i>
                  </div>
                  <div class="w-0.5 flex-1 bg-neutral-200 mt-2"></div>
                </div>
                <div class="pb-2">
                  <p class="font-medium text-neutral-900">Ordine creato</p>
                  <p class="text-sm text-neutral-600">{{ formatDateTime(order.created_at) }}</p>
                  <p class="text-sm text-neutral-500 mt-1">
                    Ordine {{ order.order_number }} - {{ formatType(order.type) }}
                  </p>
                </div>
              </div>

              <!-- Payment Processed -->
              <div v-if="order.paid_at" class="flex gap-4 pb-6">
                <div class="flex flex-col items-center">
                  <div class="w-10 h-10 rounded-full bg-success-light flex items-center justify-center">
                    <i class="pi pi-check text-success"></i>
                  </div>
                  <div class="w-0.5 flex-1 bg-neutral-200 mt-2"></div>
                </div>
                <div class="pb-2">
                  <p class="font-medium text-neutral-900">Pagamento completato</p>
                  <p class="text-sm text-neutral-600">{{ formatDateTime(order.paid_at) }}</p>
                  <p class="text-sm text-neutral-500 mt-1">
                    {{ formatPaymentMethod(order.payment_method) }} - {{ formatCurrency(order.total) }}
                  </p>
                </div>
              </div>

              <!-- Invoice Issued -->
              <div v-if="order.invoice" class="flex gap-4 pb-6">
                <div class="flex flex-col items-center">
                  <div class="w-10 h-10 rounded-full bg-info-light flex items-center justify-center">
                    <i class="pi pi-file text-info"></i>
                  </div>
                  <div class="w-0.5 flex-1 bg-neutral-200 mt-2"></div>
                </div>
                <div class="pb-2">
                  <p class="font-medium text-neutral-900">Fattura emessa</p>
                  <p class="text-sm text-neutral-600">{{ formatDateTime(order.invoice.issued_at) }}</p>
                  <p class="text-sm text-neutral-500 mt-1">
                    {{ order.invoice.invoice_number }}
                  </p>
                </div>
              </div>

              <!-- Leads Unlocked -->
              <div v-if="order.status === 'paid'" class="flex gap-4">
                <div class="flex flex-col items-center">
                  <div class="w-10 h-10 rounded-full bg-success-light flex items-center justify-center">
                    <i class="pi pi-unlock text-success"></i>
                  </div>
                </div>
                <div>
                  <p class="font-medium text-neutral-900">Lead sbloccati</p>
                  <p class="text-sm text-neutral-600">{{ formatDateTime(order.paid_at) }}</p>
                  <p class="text-sm text-neutral-500 mt-1">
                    {{ totalLeads }} lead disponibili nel portafoglio cliente
                  </p>
                </div>
              </div>

              <!-- Failed/Cancelled State -->
              <div v-else-if="order.status === 'failed' || order.status === 'cancelled'" class="flex gap-4">
                <div class="flex flex-col items-center">
                  <div class="w-10 h-10 rounded-full bg-danger-light flex items-center justify-center">
                    <i class="pi pi-times text-danger"></i>
                  </div>
                </div>
                <div>
                  <p class="font-medium text-neutral-900">
                    {{ order.status === 'failed' ? 'Pagamento fallito' : 'Ordine annullato' }}
                  </p>
                  <p class="text-sm text-neutral-600">{{ formatDateTime(order.updated_at) }}</p>
                </div>
              </div>

              <!-- Pending State -->
              <div v-else class="flex gap-4">
                <div class="flex flex-col items-center">
                  <div class="w-10 h-10 rounded-full bg-warning-light flex items-center justify-center">
                    <i class="pi pi-clock text-warning"></i>
                  </div>
                </div>
                <div>
                  <p class="font-medium text-neutral-900">In attesa di pagamento</p>
                  <p class="text-sm text-neutral-500 mt-1">
                    L'ordine è in attesa del completamento del pagamento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PrimeTabPanel>
      </PrimeTabView>
    </template>
  </div>
</template>

<style scoped>
label {
  display: block;
  margin-bottom: 0.25rem;
}

code {
  font-family: 'JetBrains Mono', monospace;
}
</style>
