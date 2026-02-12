<script setup lang="ts">
/**
 * Admin Transactions - Transaction Detail
 * Visualizzazione dettagliata di una singola transazione Stripe
 */
import { useTransactionFormatters, useTransactionActions } from '~/composables/useTransaction'

definePageMeta({
  layout: 'admin'
})

const { t } = useI18n()

// Route & Store
const route = useRoute()
const router = useRouter()
const transactionStore = useTransactionStore()
const {
  formatStatus,
  getStatusSeverity,
  getStatusIcon,
  formatPaymentType,
  getPaymentTypeIcon,
  formatDate,
  formatDateTime,
  formatCurrency,
  formatCardBrand,
  formatCardExpiry,
  formatFailureCode,
  isFinalStatus,
  isRefundable
} = useTransactionFormatters()
const {
  showSuccess,
  showError,
  copyPaymentIntentId,
  copyChargeId,
  openStripePayment,
  openStripeCustomer,
  formatJsonForDisplay,
  copyJsonToClipboard
} = useTransactionActions()

// Get transaction ID from route
const transactionId = computed(() => {
  const params = route.params as { id: string }
  return Number(params.id)
})

// Loading state
const initialLoading = ref(true)

// Current transaction
const transaction = computed(() => transactionStore.currentTransaction)

// Active tab
const activeTab = ref(0)

// JSON expanded state
const jsonExpanded = ref(false)

// Load transaction data
const loadTransaction = async () => {
  initialLoading.value = true
  await transactionStore.fetchTransaction(transactionId.value)
  initialLoading.value = false
}

// Actions
const handleCopyPaymentIntent = () => {
  if (transaction.value) {
    copyPaymentIntentId(transaction.value.stripe_payment_intent_id)
  }
}

const handleCopyCharge = () => {
  if (transaction.value?.stripe_charge_id) {
    copyChargeId(transaction.value.stripe_charge_id)
  }
}

const handleOpenStripePayment = () => {
  if (transaction.value) {
    openStripePayment(transaction.value.stripe_payment_intent_id)
  }
}

const handleOpenStripeCustomer = () => {
  if (transaction.value?.stripe_customer_id) {
    openStripeCustomer(transaction.value.stripe_customer_id)
  }
}

const handleCopyJson = () => {
  if (transaction.value?.stripe_response) {
    copyJsonToClipboard(transaction.value.stripe_response)
  }
}

const navigateToOrder = () => {
  if (transaction.value?.order) {
    router.push(`/admin/orders/${transaction.value.order_id}`)
  }
}

const navigateToClient = () => {
  if (transaction.value?.client) {
    router.push(`/admin/clients/${transaction.value.client.id}`)
  }
}

// Go back
const goBack = () => {
  router.push('/admin/transactions')
}

// Computed helpers
const hasRefunds = computed(() =>
  transaction.value?.refunds && transaction.value.refunds.length > 0
)

const totalRefunded = computed(() => {
  if (!transaction.value?.refunds) return 0
  return transaction.value.refunds.reduce((sum, r) => sum + r.amount, 0)
})

// Lifecycle
onMounted(() => {
  loadTransaction()
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="initialLoading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <i class="pi pi-spin pi-spinner text-4xl text-primary-500 mb-4"></i>
        <p class="text-neutral-600">{{ $t('admin.transactions.detail.loading') }}</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!transaction" class="text-center py-20">
      <div class="w-20 h-20 rounded-full bg-danger-light flex items-center justify-center mx-auto mb-4">
        <i class="pi pi-exclamation-triangle text-4xl text-danger"></i>
      </div>
      <h2 class="text-xl font-semibold text-neutral-900 mb-2">{{ $t('admin.transactions.detail.notFound') }}</h2>
      <p class="text-neutral-600 mb-6">{{ $t('admin.transactions.detail.notFoundDescription') }}</p>
      <PrimeButton
        :label="$t('admin.transactions.detail.backToList')"
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
                <h1 class="page-title mb-0 font-mono text-lg">
                  {{ transaction.stripe_payment_intent_id }}
                </h1>
                <PrimeButton
                  icon="pi pi-copy"
                  severity="secondary"
                  text
                  rounded
                  size="small"
                  v-tooltip.top="$t('admin.transactions.detail.copyPaymentIntentId')"
                  @click="handleCopyPaymentIntent"
                />
              </div>
              <div class="flex items-center gap-3 mt-2">
                <PrimeTag
                  :severity="getStatusSeverity(transaction.status)"
                >
                  <i :class="`pi ${getStatusIcon(transaction.status)} mr-1`"></i>
                  {{ formatStatus(transaction.status) }}
                </PrimeTag>
                <div class="flex items-center gap-1 text-sm text-neutral-600">
                  <i :class="`pi ${getPaymentTypeIcon(transaction.payment_type)}`"></i>
                  {{ formatPaymentType(transaction.payment_type) }}
                </div>
                <span class="text-sm text-neutral-500">
                  {{ formatDateTime(transaction.created_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="page-header-actions">
          <PrimeButton
            :label="$t('admin.transactions.detail.openOnStripe')"
            icon="pi pi-external-link"
            severity="secondary"
            outlined
            @click="handleOpenStripePayment"
          />
          <PrimeButton
            v-if="transaction.order"
            :label="$t('admin.transactions.detail.goToOrder')"
            icon="pi pi-shopping-cart"
            severity="primary"
            outlined
            @click="navigateToOrder"
          />
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <!-- Amount Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">{{ $t('admin.transactions.detail.cards.amount') }}</span>
            <i class="pi pi-euro text-lg text-primary"></i>
          </div>
          <div class="text-2xl font-bold text-neutral-900">
            {{ formatCurrency(transaction.amount, transaction.currency) }}
          </div>
          <div class="text-xs text-neutral-500 mt-1 uppercase">
            {{ transaction.currency }}
          </div>
        </div>

        <!-- Order Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">{{ $t('admin.transactions.detail.cards.order') }}</span>
            <i class="pi pi-shopping-cart text-lg text-info"></i>
          </div>
          <div
            v-if="transaction.order"
            class="font-mono font-medium text-primary-700 cursor-pointer hover:text-primary-900"
            @click="navigateToOrder"
          >
            {{ transaction.order.order_number }}
          </div>
          <div v-else class="text-neutral-500">-</div>
          <div v-if="transaction.order" class="text-xs text-neutral-500 mt-1">
            {{ formatCurrency(transaction.order.total) }}
          </div>
        </div>

        <!-- Payment Method Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">{{ $t('admin.transactions.detail.cards.method') }}</span>
            <i :class="`pi ${getPaymentTypeIcon(transaction.payment_type)} text-lg text-purple-600`"></i>
          </div>
          <div class="font-medium text-neutral-900">
            {{ formatPaymentType(transaction.payment_type) }}
          </div>
          <div v-if="transaction.card_details" class="text-xs text-neutral-500 mt-1">
            {{ formatCardBrand(transaction.card_details.brand) }} •••• {{ transaction.card_details.last4 }}
          </div>
          <div v-else-if="transaction.sepa_details" class="text-xs text-neutral-500 mt-1">
            IBAN •••• {{ transaction.sepa_details.last4 }}
          </div>
        </div>

        <!-- Processed Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">{{ $t('admin.transactions.detail.cards.processing') }}</span>
            <i
              class="pi text-lg"
              :class="{
                'pi-check-circle text-success': transaction.status === 'succeeded',
                'pi-clock text-warning': ['pending', 'processing', 'requires_action'].includes(transaction.status),
                'pi-times-circle text-danger': transaction.status === 'failed',
                'pi-ban text-secondary': transaction.status === 'canceled'
              }"
            ></i>
          </div>
          <div v-if="transaction.processed_at" class="text-neutral-900">
            {{ formatDate(transaction.processed_at) }}
          </div>
          <div v-else class="text-neutral-500">{{ $t('admin.transactions.detail.awaiting') }}</div>
          <div v-if="transaction.processed_at" class="text-xs text-neutral-500 mt-1">
            {{ formatDateTime(transaction.processed_at).split(' ')[1] }}
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <PrimeTabView v-model:activeIndex="activeTab" class="q-card">
        <!-- Tab: Dettagli Transazione -->
        <PrimeTabPanel value="0" :header="$t('admin.transactions.detail.tabs.details')">
          <div class="pt-4 space-y-6">
            <!-- IDs Section -->
            <div>
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">{{ $t('admin.transactions.detail.stripeIds') }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-neutral-50 rounded-lg p-4">
                  <label class="text-xs font-medium text-neutral-500 uppercase block mb-1">Payment Intent ID</label>
                  <div class="flex items-center gap-2">
                    <code class="text-sm text-neutral-900 font-mono break-all">
                      {{ transaction.stripe_payment_intent_id }}
                    </code>
                    <PrimeButton
                      icon="pi pi-copy"
                      severity="secondary"
                      text
                      rounded
                      size="small"
                      @click="handleCopyPaymentIntent"
                    />
                  </div>
                </div>

                <div class="bg-neutral-50 rounded-lg p-4">
                  <label class="text-xs font-medium text-neutral-500 uppercase block mb-1">Charge ID</label>
                  <div v-if="transaction.stripe_charge_id" class="flex items-center gap-2">
                    <code class="text-sm text-neutral-900 font-mono break-all">
                      {{ transaction.stripe_charge_id }}
                    </code>
                    <PrimeButton
                      icon="pi pi-copy"
                      severity="secondary"
                      text
                      rounded
                      size="small"
                      @click="handleCopyCharge"
                    />
                  </div>
                  <span v-else class="text-neutral-500">-</span>
                </div>

                <div class="bg-neutral-50 rounded-lg p-4">
                  <label class="text-xs font-medium text-neutral-500 uppercase block mb-1">Customer ID</label>
                  <div v-if="transaction.stripe_customer_id" class="flex items-center gap-2">
                    <code class="text-sm text-neutral-900 font-mono">
                      {{ transaction.stripe_customer_id }}
                    </code>
                    <PrimeButton
                      icon="pi pi-external-link"
                      severity="secondary"
                      text
                      rounded
                      size="small"
                      v-tooltip.top="$t('admin.transactions.detail.openOnStripe')"
                      @click="handleOpenStripeCustomer"
                    />
                  </div>
                  <span v-else class="text-neutral-500">-</span>
                </div>

                <div class="bg-neutral-50 rounded-lg p-4">
                  <label class="text-xs font-medium text-neutral-500 uppercase block mb-1">Payment Method ID</label>
                  <code v-if="transaction.stripe_payment_method_id" class="text-sm text-neutral-900 font-mono">
                    {{ transaction.stripe_payment_method_id }}
                  </code>
                  <span v-else class="text-neutral-500">-</span>
                </div>
              </div>
            </div>

            <!-- Payment Details Section -->
            <div>
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">{{ $t('admin.transactions.detail.paymentDetails') }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label class="text-xs font-medium text-neutral-500 uppercase">{{ $t('admin.transactions.list.table.headers.type') }}</label>
                  <p class="text-neutral-900 flex items-center gap-2 mt-1">
                    <i :class="`pi ${getPaymentTypeIcon(transaction.payment_type)}`"></i>
                    {{ formatPaymentType(transaction.payment_type) }}
                  </p>
                </div>
                <div>
                  <label class="text-xs font-medium text-neutral-500 uppercase">{{ $t('admin.transactions.detail.cards.amount') }}</label>
                  <p class="text-neutral-900 font-semibold mt-1">
                    {{ formatCurrency(transaction.amount, transaction.currency) }}
                  </p>
                </div>
                <div>
                  <label class="text-xs font-medium text-neutral-500 uppercase">{{ $t('admin.transactions.detail.currency') }}</label>
                  <p class="text-neutral-900 uppercase mt-1">{{ transaction.currency }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-neutral-500 uppercase">{{ $t('admin.transactions.list.table.headers.status') }}</label>
                  <div class="mt-1">
                    <PrimeTag
                      :value="formatStatus(transaction.status)"
                      :severity="getStatusSeverity(transaction.status)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Card/SEPA Details -->
            <div v-if="transaction.card_details || transaction.sepa_details">
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">
                {{ transaction.payment_type === 'card' ? $t('admin.transactions.detail.cardDetails') : $t('admin.transactions.detail.sepaDetails') }}
              </h4>

              <!-- Card Details -->
              <div v-if="transaction.card_details" class="bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-xl p-6 text-white max-w-md">
                <div class="flex justify-between items-start mb-8">
                  <span class="text-sm opacity-70">{{ formatCardBrand(transaction.card_details.brand) }}</span>
                  <i class="pi pi-credit-card text-2xl"></i>
                </div>
                <div class="mb-6">
                  <span class="font-mono text-xl tracking-wider">•••• •••• •••• {{ transaction.card_details.last4 }}</span>
                </div>
                <div class="flex justify-between items-end">
                  <div>
                    <span class="text-xs opacity-70 block">{{ $t('admin.transactions.detail.expiry') }}</span>
                    <span class="font-mono">{{ formatCardExpiry(transaction.card_details.exp_month, transaction.card_details.exp_year) }}</span>
                  </div>
                  <div v-if="transaction.card_details.country">
                    <span class="text-xs opacity-70 block">{{ $t('admin.transactions.detail.country') }}</span>
                    <span>{{ transaction.card_details.country }}</span>
                  </div>
                </div>
              </div>

              <!-- SEPA Details -->
              <div v-else-if="transaction.sepa_details" class="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md">
                <div class="flex items-center gap-3 mb-3">
                  <i class="pi pi-building text-purple-600 text-xl"></i>
                  <span class="font-medium text-purple-900">{{ $t('admin.transactions.detail.sepaDebit') }}</span>
                </div>
                <div class="space-y-2">
                  <div>
                    <span class="text-xs text-purple-600 uppercase">IBAN</span>
                    <p class="font-mono text-neutral-900">•••• •••• •••• {{ transaction.sepa_details.last4 }}</p>
                  </div>
                  <div v-if="transaction.sepa_details.bank_code" class="grid grid-cols-2 gap-4">
                    <div>
                      <span class="text-xs text-purple-600 uppercase">{{ $t('admin.transactions.detail.bank') }}</span>
                      <p class="text-neutral-900">{{ transaction.sepa_details.bank_code }}</p>
                    </div>
                    <div v-if="transaction.sepa_details.country">
                      <span class="text-xs text-purple-600 uppercase">{{ $t('admin.transactions.detail.country') }}</span>
                      <p class="text-neutral-900">{{ transaction.sepa_details.country }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error Section (if failed) -->
            <div v-if="transaction.failure_code" class="bg-danger-light border border-danger-200 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <i class="pi pi-exclamation-triangle text-danger"></i>
                <h4 class="font-semibold text-danger">{{ $t('admin.transactions.detail.transactionError') }}</h4>
              </div>
              <div class="space-y-2">
                <div>
                  <span class="text-xs text-danger-dark uppercase">{{ $t('admin.transactions.detail.errorCode') }}</span>
                  <p class="font-mono text-neutral-900">{{ transaction.failure_code }}</p>
                </div>
                <div v-if="transaction.failure_message">
                  <span class="text-xs text-danger-dark uppercase">{{ $t('admin.transactions.detail.errorMessage') }}</span>
                  <p class="text-neutral-900">{{ transaction.failure_message }}</p>
                </div>
              </div>
            </div>

            <!-- Metadata -->
            <div v-if="transaction.metadata && Object.keys(transaction.metadata).length > 0">
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">Metadata</h4>
              <div class="bg-neutral-50 rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div v-for="(value, key) in transaction.metadata" :key="key">
                    <span class="text-xs text-neutral-500 uppercase">{{ key }}</span>
                    <p class="text-neutral-900 font-mono">{{ value || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PrimeTabPanel>

        <!-- Tab: Cliente -->
        <PrimeTabPanel value="1" :header="$t('admin.transactions.detail.tabs.client')">
          <div class="pt-4">
            <div v-if="transaction.client" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Client Info -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-neutral-900 mb-4">{{ $t('admin.transactions.detail.clientData') }}</h4>

                <div class="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                  <div
                    class="w-14 h-14 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg flex-shrink-0"
                  >
                    {{ transaction.client.company_name.substring(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <div class="font-semibold text-neutral-900">{{ transaction.client.company_name }}</div>
                    <div class="text-sm text-neutral-600">P.IVA: IT{{ transaction.client.vat_number }}</div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-xs font-medium text-neutral-500 uppercase">{{ $t('admin.transactions.detail.contactPerson') }}</label>
                    <p class="text-neutral-900">
                      {{ transaction.client.contact_first_name }} {{ transaction.client.contact_last_name }}
                    </p>
                  </div>
                  <div>
                    <label class="text-xs font-medium text-neutral-500 uppercase">Email</label>
                    <p>
                      <a :href="`mailto:${transaction.client.email}`" class="text-primary-600 hover:underline">
                        {{ transaction.client.email }}
                      </a>
                    </p>
                  </div>
                </div>

                <PrimeButton
                  :label="$t('admin.transactions.detail.goToClientProfile')"
                  icon="pi pi-external-link"
                  severity="primary"
                  outlined
                  size="small"
                  @click="navigateToClient"
                />
              </div>

              <!-- Order Info -->
              <div v-if="transaction.order" class="space-y-4">
                <h4 class="text-lg font-semibold text-neutral-900 mb-4">{{ $t('admin.transactions.detail.associatedOrder') }}</h4>

                <div class="p-4 bg-info-light rounded-lg">
                  <div class="flex items-center gap-3 mb-3">
                    <i class="pi pi-shopping-cart text-info text-xl"></i>
                    <span
                      class="font-mono font-semibold text-info cursor-pointer hover:underline"
                      @click="navigateToOrder"
                    >
                      {{ transaction.order.order_number }}
                    </span>
                  </div>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-neutral-600">{{ $t('admin.transactions.detail.orderType') }}:</span>
                      <span class="ml-1 text-neutral-900 capitalize">{{ transaction.order.type.replace('_', ' ') }}</span>
                    </div>
                    <div>
                      <span class="text-neutral-600">{{ $t('admin.transactions.detail.orderTotal') }}:</span>
                      <span class="ml-1 text-neutral-900 font-semibold">{{ formatCurrency(transaction.order.total) }}</span>
                    </div>
                    <div>
                      <span class="text-neutral-600">{{ $t('admin.transactions.list.table.headers.status') }}:</span>
                      <span class="ml-1 text-neutral-900 capitalize">{{ transaction.order.status }}</span>
                    </div>
                    <div>
                      <span class="text-neutral-600">{{ $t('admin.transactions.list.table.headers.date') }}:</span>
                      <span class="ml-1 text-neutral-900">{{ formatDate(transaction.order.created_at) }}</span>
                    </div>
                  </div>
                </div>

                <PrimeButton
                  :label="$t('admin.transactions.detail.goToOrderLink')"
                  icon="pi pi-external-link"
                  severity="primary"
                  outlined
                  size="small"
                  @click="navigateToOrder"
                />
              </div>
            </div>
            <div v-else class="text-center py-12 text-neutral-500">
              {{ $t('admin.transactions.detail.clientDataNotAvailable') }}
            </div>
          </div>
        </PrimeTabPanel>

        <!-- Tab: Timeline -->
        <PrimeTabPanel value="2" :header="$t('admin.transactions.detail.tabs.timeline')">
          <div class="pt-4">
            <div class="max-w-2xl">
              <!-- Events Timeline -->
              <div v-if="transaction.events && transaction.events.length > 0">
                <div
                  v-for="(event, index) in transaction.events"
                  :key="event.id"
                  class="flex gap-4 pb-6"
                >
                  <div class="flex flex-col items-center">
                    <div
                      class="w-10 h-10 rounded-full flex items-center justify-center"
                      :class="{
                        'bg-primary-100': event.status === 'created',
                        'bg-success-light': event.status === 'succeeded',
                        'bg-danger-light': event.status === 'failed',
                        'bg-warning-light': event.status === 'requires_action',
                        'bg-neutral-200': event.status === 'canceled'
                      }"
                    >
                      <i
                        class="pi"
                        :class="{
                          'pi-plus text-primary-600': event.status === 'created',
                          'pi-check text-success': event.status === 'succeeded',
                          'pi-times text-danger': event.status === 'failed',
                          'pi-exclamation-triangle text-warning': event.status === 'requires_action',
                          'pi-ban text-neutral-500': event.status === 'canceled'
                        }"
                      ></i>
                    </div>
                    <div
                      v-if="index < transaction.events.length - 1"
                      class="w-0.5 flex-1 bg-neutral-200 mt-2"
                    ></div>
                  </div>
                  <div class="pb-2">
                    <p class="font-medium text-neutral-900">{{ event.message }}</p>
                    <p class="text-sm text-neutral-600">{{ formatDateTime(event.created_at) }}</p>
                    <code class="text-xs text-neutral-500 mt-1 block">{{ event.type }}</code>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-neutral-500">
                {{ $t('admin.transactions.detail.noEvents') }}
              </div>
            </div>
          </div>
        </PrimeTabPanel>

        <!-- Tab: Rimborsi -->
        <PrimeTabPanel value="3" :header="$t('admin.transactions.detail.tabs.refunds')">
          <div class="pt-4">
            <div v-if="hasRefunds">
              <div class="mb-4 p-4 bg-warning-light rounded-lg">
                <div class="flex items-center gap-2">
                  <i class="pi pi-info-circle text-warning"></i>
                  <span class="font-medium text-warning-dark">
                    {{ $t('admin.transactions.detail.totalRefunded') }}: {{ formatCurrency(totalRefunded, transaction.currency) }}
                  </span>
                </div>
              </div>

              <PrimeDataTable
                :value="transaction.refunds"
                class="text-sm"
                stripedRows
              >
                <PrimeColumn field="id" :header="$t('admin.transactions.detail.refundColumns.refundId')" style="min-width: 200px">
                  <template #body="{ data }">
                    <code class="font-mono text-xs">{{ data.id }}</code>
                  </template>
                </PrimeColumn>
                <PrimeColumn field="amount" :header="$t('admin.transactions.detail.cards.amount')" style="min-width: 120px">
                  <template #body="{ data }">
                    <span class="font-semibold">{{ formatCurrency(data.amount, transaction.currency) }}</span>
                  </template>
                </PrimeColumn>
                <PrimeColumn field="status" :header="$t('admin.transactions.list.table.headers.status')" style="min-width: 100px">
                  <template #body="{ data }">
                    <PrimeTag
                      :value="data.status"
                      :severity="data.status === 'succeeded' ? 'success' : 'warn'"
                    />
                  </template>
                </PrimeColumn>
                <PrimeColumn field="reason" :header="$t('admin.transactions.detail.refundColumns.reason')" style="min-width: 150px">
                  <template #body="{ data }">
                    <span>{{ data.reason || '-' }}</span>
                  </template>
                </PrimeColumn>
                <PrimeColumn field="created_at" :header="$t('admin.transactions.list.table.headers.date')" style="min-width: 150px">
                  <template #body="{ data }">
                    {{ formatDateTime(data.created_at) }}
                  </template>
                </PrimeColumn>
              </PrimeDataTable>
            </div>
            <div v-else class="text-center py-12">
              <i class="pi pi-replay text-4xl text-neutral-400 mb-4 block"></i>
              <p class="text-neutral-600">{{ $t('admin.transactions.detail.noRefunds') }}</p>
              <p class="text-sm text-neutral-500 mt-2">
                {{ $t('admin.transactions.detail.refundsManagedOnStripe') }}
              </p>
            </div>
          </div>
        </PrimeTabPanel>

        <!-- Tab: Risposta Stripe (JSON) -->
        <PrimeTabPanel value="4" :header="$t('admin.transactions.detail.tabs.stripeResponse')">
          <div class="pt-4">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-lg font-semibold text-neutral-900">{{ $t('admin.transactions.detail.fullApiResponse') }}</h4>
              <div class="flex gap-2">
                <PrimeButton
                  :label="jsonExpanded ? $t('admin.transactions.detail.collapse') : $t('admin.transactions.detail.expand')"
                  :icon="jsonExpanded ? 'pi pi-minus' : 'pi pi-plus'"
                  severity="secondary"
                  text
                  size="small"
                  @click="jsonExpanded = !jsonExpanded"
                />
                <PrimeButton
                  :label="$t('admin.transactions.detail.copyJson')"
                  icon="pi pi-copy"
                  severity="secondary"
                  outlined
                  size="small"
                  @click="handleCopyJson"
                />
              </div>
            </div>

            <div
              class="bg-neutral-900 rounded-lg p-4 overflow-auto"
              :class="jsonExpanded ? 'max-h-none' : 'max-h-96'"
            >
              <pre class="text-sm text-green-400 font-mono whitespace-pre-wrap">{{ formatJsonForDisplay(transaction.stripe_response) }}</pre>
            </div>

            <p class="text-xs text-neutral-500 mt-2">
              <i class="pi pi-info-circle mr-1"></i>
              {{ $t('admin.transactions.detail.responseArchiveNote') }}
            </p>
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
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}

pre {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}
</style>
