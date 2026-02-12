<script setup lang="ts">
/**
 * Admin Invoices - Invoice Detail
 * Vista dettagliata di una fattura con tutte le informazioni
 */
import { useInvoiceFormatters, useInvoiceActions, formatCurrency } from '~/composables/useInvoice'
import type { Invoice } from '~/types/invoice'

definePageMeta({
  layout: 'admin'
})

const { t } = useI18n()

// Route & Store
const route = useRoute()
const router = useRouter()
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
  formatDateTime,
  formatVatNumber,
  formatBillingAddress
} = useInvoiceFormatters()
const { confirmResendSdi, confirmSendEmail, confirmCreateCreditNote, showSuccess, showError } = useInvoiceActions()

// Get invoice ID from route
const invoiceId = computed(() => {
  const params = route.params as { id: string }
  return Number(params.id)
})

// Loading state
const initialLoading = ref(true)

// Credit note dialog
const creditNoteDialog = ref(false)
const creditNoteReason = ref('')

// Current invoice
const invoice = computed(() => invoiceStore.currentInvoice)

// Active tab
const activeTab = ref(0)

// Load invoice data
const loadInvoice = async () => {
  initialLoading.value = true
  await invoiceStore.fetchInvoice(invoiceId.value)
  initialLoading.value = false
}

// Actions
const handleResendSdi = () => {
  if (!invoice.value) return

  confirmResendSdi(invoice.value, async () => {
    const success = await invoiceStore.resendToSdi(invoiceId.value)
    if (success) {
      showSuccess(t('admin.invoices.list.toast.resendSdiSuccess', { number: invoice.value!.invoice_number }))
    } else {
      showError(invoiceStore.error || t('admin.invoices.list.toast.resendSdiError'))
    }
  })
}

const handleSendEmail = () => {
  if (!invoice.value) return

  confirmSendEmail(invoice.value, async () => {
    const success = await invoiceStore.sendByEmail(invoiceId.value)
    if (success) {
      showSuccess(t('admin.invoices.list.toast.sendEmailSuccess', { number: invoice.value!.invoice_number }))
    } else {
      showError(invoiceStore.error || t('admin.invoices.list.toast.sendEmailError'))
    }
  })
}

const handleDownloadPdf = async () => {
  const url = await invoiceStore.downloadPdf(invoiceId.value)
  if (url) {
    window.open(url, '_blank')
    showSuccess(t('admin.invoices.list.toast.downloadSuccess'))
  } else {
    showError(invoiceStore.error || t('admin.invoices.list.toast.downloadError'))
  }
}

const openCreditNoteDialog = () => {
  creditNoteReason.value = ''
  creditNoteDialog.value = true
}

const handleCreateCreditNote = async () => {
  if (!invoice.value) return

  const creditNote = await invoiceStore.createCreditNote(
    invoiceId.value,
    creditNoteReason.value || undefined
  )

  if (creditNote) {
    showSuccess(t('admin.invoices.list.toast.creditNoteSuccess', { number: creditNote.invoice_number }))
    creditNoteDialog.value = false
    router.push(`/admin/invoices/${creditNote.id}`)
  } else {
    showError(invoiceStore.error || t('admin.invoices.list.toast.creditNoteError'))
  }
}

// Go back to list
const onBack = () => {
  router.push('/admin/invoices')
}

// Navigate to order
const navigateToOrder = () => {
  if (invoice.value?.order) {
    router.push(`/admin/orders/${invoice.value.order.id}`)
  }
}

// Navigate to client
const navigateToClient = () => {
  if (invoice.value?.client) {
    router.push(`/admin/clients/${invoice.value.client.id}`)
  }
}

// Lifecycle
onMounted(() => {
  loadInvoice()
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="initialLoading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <i class="pi pi-spin pi-spinner text-4xl text-primary-500 mb-4"></i>
        <p class="text-neutral-600">{{ $t('admin.invoices.detail.loading') }}</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!invoice" class="text-center py-20">
      <div class="w-20 h-20 rounded-full bg-danger-light flex items-center justify-center mx-auto mb-4">
        <i class="pi pi-exclamation-triangle text-4xl text-danger"></i>
      </div>
      <h2 class="text-xl font-semibold text-neutral-900 mb-2">{{ $t('admin.invoices.detail.notFound') }}</h2>
      <p class="text-neutral-600 mb-6">{{ $t('admin.invoices.detail.notFoundDescription') }}</p>
      <PrimeButton
        :label="$t('admin.invoices.detail.backToList')"
        icon="pi pi-arrow-left"
        severity="primary"
        @click="onBack"
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
              @click="onBack"
            />
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center"
                :class="invoice.type === 'credit_note' ? 'bg-warning-100 text-warning-700' : 'bg-primary-100 text-primary-700'"
              >
                <i
                  class="pi text-xl"
                  :class="invoice.type === 'credit_note' ? 'pi-file-edit' : 'pi-file'"
                ></i>
              </div>
              <div>
                <h1 class="page-title mb-0">{{ invoice.invoice_number }}</h1>
                <div class="flex items-center gap-2 mt-1">
                  <PrimeTag
                    :value="formatInvoiceType(invoice.type)"
                    :severity="getInvoiceTypeSeverity(invoice.type)"
                    class="text-xs"
                  />
                  <PrimeTag
                    :value="formatSdiStatus(invoice.sdi_status)"
                    :severity="getSdiStatusSeverity(invoice.sdi_status)"
                    :icon="getSdiStatusIcon(invoice.sdi_status)"
                    class="text-xs"
                  />
                  <span class="text-sm text-neutral-500">
                    {{ $t('admin.invoices.detail.issuedOn') }} {{ formatDate(invoice.issued_at) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="page-header-actions">
          <PrimeButton
            :label="$t('admin.invoices.detail.downloadPdf')"
            icon="pi pi-download"
            severity="secondary"
            outlined
            @click="handleDownloadPdf"
          />
          <PrimeButton
            :label="$t('admin.invoices.detail.sendEmail')"
            icon="pi pi-envelope"
            severity="secondary"
            outlined
            @click="handleSendEmail"
          />
          <PrimeButton
            v-if="canResendToSdi(invoice)"
            :label="$t('admin.invoices.detail.resendSdi')"
            icon="pi pi-send"
            severity="primary"
            @click="handleResendSdi"
          />
          <PrimeButton
            v-if="canCreateCreditNote(invoice)"
            :label="$t('admin.invoices.detail.creditNote')"
            icon="pi pi-file-edit"
            severity="warning"
            @click="openCreditNoteDialog"
          />
        </div>
      </div>

      <!-- Info Cards Row -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <!-- Total Amount Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">{{ $t('admin.invoices.detail.cards.totalAmount') }}</span>
            <i class="pi pi-euro text-lg text-primary-600"></i>
          </div>
          <div
            class="text-2xl font-bold"
            :class="invoice.total < 0 ? 'text-danger-600' : 'text-neutral-900'"
          >
            {{ formatCurrency(invoice.total) }}
          </div>
          <div class="text-xs text-neutral-500 mt-1">
            {{ $t('admin.invoices.detail.vatIncluded', { rate: invoice.vat_rate }) }}
          </div>
        </div>

        <!-- SDI Status Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">{{ $t('admin.invoices.detail.cards.sdiStatus') }}</span>
            <i :class="[getSdiStatusIcon(invoice.sdi_status), 'text-lg']"></i>
          </div>
          <div class="flex items-center gap-2">
            <PrimeTag
              :value="formatSdiStatus(invoice.sdi_status)"
              :severity="getSdiStatusSeverity(invoice.sdi_status)"
            />
          </div>
          <div v-if="invoice.sdi_message" class="text-xs text-danger-600 mt-2">
            {{ invoice.sdi_message }}
          </div>
        </div>

        <!-- Fatture Cloud Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">{{ $t('admin.invoices.detail.cards.fattureCloud') }}</span>
            <i class="pi pi-cloud text-lg text-info-600"></i>
          </div>
          <div v-if="invoice.fatture_cloud_id" class="font-mono text-sm text-neutral-900">
            {{ invoice.fatture_cloud_id }}
          </div>
          <div v-else class="text-sm text-neutral-500">
            {{ $t('admin.invoices.detail.notSynced') }}
          </div>
        </div>

        <!-- Dates Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">{{ $t('admin.invoices.detail.cards.dates') }}</span>
            <i class="pi pi-calendar text-lg text-neutral-600"></i>
          </div>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-neutral-500">{{ $t('admin.invoices.detail.issueLabel') }}:</span>
              <span class="text-neutral-900">{{ formatDate(invoice.issued_at) }}</span>
            </div>
            <div v-if="invoice.due_at" class="flex justify-between">
              <span class="text-neutral-500">{{ $t('admin.invoices.detail.dueLabel') }}:</span>
              <span class="text-neutral-900">{{ formatDate(invoice.due_at) }}</span>
            </div>
            <div v-if="invoice.sent_at" class="flex justify-between">
              <span class="text-neutral-500">{{ $t('admin.invoices.detail.sentLabel') }}:</span>
              <span class="text-neutral-900">{{ formatDateTime(invoice.sent_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <PrimeTabView v-model:activeIndex="activeTab" class="q-card">
        <!-- Tab: Dettagli -->
        <PrimeTabPanel value="0" :header="$t('admin.invoices.detail.tabs.details')">
          <div class="pt-4 space-y-6">
            <!-- Invoice Items -->
            <div v-if="invoice.items && invoice.items.length > 0">
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">{{ $t('admin.invoices.detail.invoiceLines') }}</h4>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50">
                      <th class="px-4 py-3 text-left font-semibold text-neutral-700">{{ $t('admin.invoices.detail.columns.description') }}</th>
                      <th class="px-4 py-3 text-right font-semibold text-neutral-700">{{ $t('admin.invoices.detail.columns.quantity') }}</th>
                      <th class="px-4 py-3 text-right font-semibold text-neutral-700">{{ $t('admin.invoices.detail.columns.unitPrice') }}</th>
                      <th class="px-4 py-3 text-right font-semibold text-neutral-700">{{ $t('admin.invoices.detail.columns.vat') }}</th>
                      <th class="px-4 py-3 text-right font-semibold text-neutral-700">{{ $t('admin.invoices.detail.columns.total') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in invoice.items" :key="item.id" class="border-b border-neutral-100">
                      <td class="px-4 py-3 text-neutral-900">{{ item.description }}</td>
                      <td class="px-4 py-3 text-right text-neutral-700">{{ item.quantity }}</td>
                      <td class="px-4 py-3 text-right text-neutral-700">{{ formatCurrency(item.unit_price) }}</td>
                      <td class="px-4 py-3 text-right text-neutral-700">{{ item.vat_rate }}%</td>
                      <td class="px-4 py-3 text-right font-medium text-neutral-900">{{ formatCurrency(item.line_total) }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="bg-neutral-50">
                      <td colspan="4" class="px-4 py-3 text-right font-medium text-neutral-700">{{ $t('admin.invoices.detail.taxableAmount') }}:</td>
                      <td class="px-4 py-3 text-right font-medium text-neutral-900">{{ formatCurrency(invoice.subtotal) }}</td>
                    </tr>
                    <tr class="bg-neutral-50">
                      <td colspan="4" class="px-4 py-3 text-right font-medium text-neutral-700">{{ $t('admin.invoices.detail.vatLabel') }} ({{ invoice.vat_rate }}%):</td>
                      <td class="px-4 py-3 text-right font-medium text-neutral-900">{{ formatCurrency(invoice.vat_amount) }}</td>
                    </tr>
                    <tr class="bg-primary-50">
                      <td colspan="4" class="px-4 py-3 text-right font-bold text-neutral-900">{{ $t('admin.invoices.detail.columns.total') }}:</td>
                      <td class="px-4 py-3 text-right font-bold text-primary-700 text-lg">{{ formatCurrency(invoice.total) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="invoice.notes" class="p-4 bg-neutral-50 rounded-lg">
              <h5 class="font-medium text-neutral-700 mb-2">{{ $t('admin.invoices.detail.notes') }}</h5>
              <p class="text-neutral-600">{{ invoice.notes }}</p>
            </div>

            <!-- Order Link -->
            <div v-if="invoice.order" class="p-4 bg-info-50 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <i class="pi pi-shopping-cart text-2xl text-info-600"></i>
                  <div>
                    <div class="font-semibold text-neutral-900">{{ $t('admin.invoices.detail.linkedOrder') }}</div>
                    <div class="text-sm text-neutral-600">{{ invoice.order.order_number }}</div>
                  </div>
                </div>
                <PrimeButton
                  :label="$t('admin.invoices.detail.viewOrder')"
                  icon="pi pi-external-link"
                  severity="info"
                  text
                  @click="navigateToOrder"
                />
              </div>
            </div>
          </div>
        </PrimeTabPanel>

        <!-- Tab: Dati Fatturazione -->
        <PrimeTabPanel value="1" :header="$t('admin.invoices.detail.tabs.billingData')">
          <div class="pt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Company Info -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-neutral-900 mb-4">{{ $t('admin.invoices.detail.holderData') }}</h4>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm text-neutral-500">{{ $t('admin.invoices.detail.companyName') }}</label>
                    <p class="font-medium text-neutral-900">{{ invoice.billing_data?.company_name || '-' }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-neutral-500">{{ $t('admin.invoices.detail.vatNumber') }}</label>
                    <p class="font-medium text-neutral-900">{{ formatVatNumber(invoice.billing_data?.vat_number) }}</p>
                  </div>
                </div>

                <div>
                  <label class="text-sm text-neutral-500">{{ $t('admin.invoices.detail.address') }}</label>
                  <p class="font-medium text-neutral-900">{{ formatBillingAddress(invoice) }}</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm text-neutral-500">{{ $t('admin.invoices.detail.sdiCode') }}</label>
                    <p class="font-medium text-neutral-900 font-mono">{{ invoice.billing_data?.sdi_code || '-' }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-neutral-500">PEC</label>
                    <p class="font-medium text-neutral-900">{{ invoice.billing_data?.pec || '-' }}</p>
                  </div>
                </div>
              </div>

              <!-- Client Info -->
              <div v-if="invoice.client" class="space-y-4">
                <h4 class="text-lg font-semibold text-neutral-900 mb-4">{{ $t('admin.invoices.detail.tabs.client') }}</h4>

                <div class="p-4 bg-neutral-50 rounded-lg">
                  <div class="flex items-center gap-3 mb-4">
                    <div
                      class="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold"
                    >
                      {{ invoice.client.company_name.substring(0, 2).toUpperCase() }}
                    </div>
                    <div>
                      <div class="font-semibold text-neutral-900">{{ invoice.client.company_name }}</div>
                      <div class="text-sm text-neutral-500">P.IVA: {{ invoice.client.vat_number }}</div>
                    </div>
                  </div>

                  <div class="space-y-2 text-sm">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-user text-neutral-400"></i>
                      <span>{{ invoice.client.contact_first_name }} {{ invoice.client.contact_last_name }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-envelope text-neutral-400"></i>
                      <a :href="`mailto:${invoice.client.email}`" class="text-primary-600 hover:underline">
                        {{ invoice.client.email }}
                      </a>
                    </div>
                  </div>

                  <div class="mt-4 pt-4 border-t border-neutral-200">
                    <PrimeButton
                      :label="$t('admin.invoices.detail.goToClient')"
                      icon="pi pi-external-link"
                      severity="secondary"
                      text
                      size="small"
                      @click="navigateToClient"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PrimeTabPanel>

        <!-- Tab: SDI -->
        <PrimeTabPanel value="2" :header="$t('admin.invoices.detail.tabs.sdiStatus')">
          <div class="pt-4">
            <div class="max-w-2xl">
              <!-- Current Status -->
              <div class="p-6 rounded-lg mb-6" :class="{
                'bg-warning-50': invoice.sdi_status === 'pending',
                'bg-info-50': invoice.sdi_status === 'sent',
                'bg-success-50': ['delivered', 'accepted'].includes(invoice.sdi_status),
                'bg-danger-50': ['rejected', 'not_delivered', 'error'].includes(invoice.sdi_status)
              }">
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center" :class="{
                    'bg-warning-100': invoice.sdi_status === 'pending',
                    'bg-info-100': invoice.sdi_status === 'sent',
                    'bg-success-100': ['delivered', 'accepted'].includes(invoice.sdi_status),
                    'bg-danger-100': ['rejected', 'not_delivered', 'error'].includes(invoice.sdi_status)
                  }">
                    <i :class="[getSdiStatusIcon(invoice.sdi_status), 'text-2xl']"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-neutral-900 mb-1">
                      {{ formatSdiStatus(invoice.sdi_status) }}
                    </h4>
                    <p class="text-sm text-neutral-600 mb-3">
                      <template v-if="invoice.sdi_status === 'pending'">
                        {{ $t('admin.invoices.detail.sdiDescriptions.pending') }}
                      </template>
                      <template v-else-if="invoice.sdi_status === 'sent'">
                        {{ $t('admin.invoices.detail.sdiDescriptions.sent') }}
                      </template>
                      <template v-else-if="invoice.sdi_status === 'delivered'">
                        {{ $t('admin.invoices.detail.sdiDescriptions.delivered') }}
                      </template>
                      <template v-else-if="invoice.sdi_status === 'accepted'">
                        {{ $t('admin.invoices.detail.sdiDescriptions.accepted') }}
                      </template>
                      <template v-else-if="invoice.sdi_status === 'rejected'">
                        {{ $t('admin.invoices.detail.sdiDescriptions.rejected') }}
                      </template>
                      <template v-else-if="invoice.sdi_status === 'not_delivered'">
                        {{ $t('admin.invoices.detail.sdiDescriptions.notDelivered') }}
                      </template>
                      <template v-else-if="invoice.sdi_status === 'error'">
                        {{ $t('admin.invoices.detail.sdiDescriptions.error') }}
                      </template>
                    </p>

                    <!-- Error Message -->
                    <div v-if="invoice.sdi_message" class="p-3 bg-white rounded border border-danger-200 mb-3">
                      <p class="text-sm text-danger-700">
                        <i class="pi pi-exclamation-circle mr-2"></i>
                        {{ invoice.sdi_message }}
                      </p>
                    </div>

                    <!-- Resend Button -->
                    <PrimeButton
                      v-if="canResendToSdi(invoice)"
                      :label="$t('admin.invoices.detail.resendToSdi')"
                      icon="pi pi-send"
                      severity="primary"
                      size="small"
                      @click="handleResendSdi"
                    />
                  </div>
                </div>
              </div>

              <!-- Timeline -->
              <div class="space-y-4">
                <h5 class="font-semibold text-neutral-900">{{ $t('admin.invoices.detail.chronology') }}</h5>

                <div class="relative pl-8 border-l-2 border-neutral-200 space-y-6">
                  <!-- Created -->
                  <div class="relative">
                    <div class="absolute -left-10 w-4 h-4 rounded-full bg-success-500"></div>
                    <div class="text-sm">
                      <div class="font-medium text-neutral-900">{{ $t('admin.invoices.detail.timeline.invoiceCreated') }}</div>
                      <div class="text-neutral-500">{{ formatDateTime(invoice.created_at) }}</div>
                    </div>
                  </div>

                  <!-- Issued -->
                  <div class="relative">
                    <div class="absolute -left-10 w-4 h-4 rounded-full bg-success-500"></div>
                    <div class="text-sm">
                      <div class="font-medium text-neutral-900">{{ $t('admin.invoices.detail.timeline.invoiceIssued') }}</div>
                      <div class="text-neutral-500">{{ formatDateTime(invoice.issued_at) }}</div>
                    </div>
                  </div>

                  <!-- Sent -->
                  <div v-if="invoice.sent_at" class="relative">
                    <div class="absolute -left-10 w-4 h-4 rounded-full bg-info-500"></div>
                    <div class="text-sm">
                      <div class="font-medium text-neutral-900">{{ $t('admin.invoices.detail.timeline.sentToSdi') }}</div>
                      <div class="text-neutral-500">{{ formatDateTime(invoice.sent_at) }}</div>
                    </div>
                  </div>

                  <!-- Current Status -->
                  <div class="relative">
                    <div
                      class="absolute -left-10 w-4 h-4 rounded-full"
                      :class="{
                        'bg-warning-500': invoice.sdi_status === 'pending',
                        'bg-info-500': invoice.sdi_status === 'sent',
                        'bg-success-500': ['delivered', 'accepted'].includes(invoice.sdi_status),
                        'bg-danger-500': ['rejected', 'not_delivered', 'error'].includes(invoice.sdi_status)
                      }"
                    ></div>
                    <div class="text-sm">
                      <div class="font-medium text-neutral-900">{{ formatSdiStatus(invoice.sdi_status) }}</div>
                      <div class="text-neutral-500">{{ formatDateTime(invoice.updated_at) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PrimeTabPanel>
      </PrimeTabView>
    </template>

    <!-- Credit Note Dialog -->
    <PrimeDialog
      v-model:visible="creditNoteDialog"
      modal
      :header="$t('admin.invoices.list.creditNote.dialogTitle')"
      :style="{ width: '500px' }"
    >
      <div v-if="invoice" class="space-y-4">
        <div class="p-4 bg-neutral-50 rounded-lg">
          <div class="flex items-center gap-3 mb-3">
            <i class="pi pi-file text-2xl text-primary-600"></i>
            <div>
              <div class="font-semibold text-neutral-900">{{ invoice.invoice_number }}</div>
              <div class="text-sm text-neutral-600">{{ invoice.billing_data?.company_name }}</div>
            </div>
          </div>
          <div class="text-sm text-neutral-600">
            {{ $t('admin.invoices.list.creditNote.amount') }}
            <span class="font-semibold text-danger-600">
              {{ formatCurrency(-invoice.total) }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            {{ $t('admin.invoices.list.creditNote.reason') }}
          </label>
          <PrimeTextarea
            v-model="creditNoteReason"
            rows="3"
            :placeholder="$t('admin.invoices.list.creditNote.reasonPlaceholder')"
            class="w-full"
          />
        </div>

        <div class="p-3 bg-warning-50 rounded-lg flex items-start gap-3">
          <i class="pi pi-exclamation-triangle text-warning-600"></i>
          <p class="text-sm text-warning-800">
            {{ $t('admin.invoices.list.creditNote.warning') }}
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <PrimeButton
            :label="$t('admin.invoices.list.creditNote.cancel')"
            severity="secondary"
            outlined
            @click="creditNoteDialog = false"
          />
          <PrimeButton
            :label="$t('admin.invoices.list.creditNote.create')"
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
.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}
</style>
