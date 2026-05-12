<script setup lang="ts">
/**
 * Page - Purchase Package
 * Checkout page for purchasing a lead package
 */
definePageMeta({
  layout: 'client'
})

const route = useRoute('pacchetti-id-acquista')
const router = useRouter()
const packageId = computed(() => {
  const id = route.params.id
  return Number(Array.isArray(id) ? id[0] : id)
})

const { t } = useI18n()
const packagesStore = usePackagesStore()
const profileStore = useClientProfileStore()
const { formatCurrency } = useClientFormatters()
const { showSuccess, showError } = useClientToast()
const { validateForm, errors, clearErrors } = useBillingValidation()

// Current package
const currentPackage = computed(() => {
  return packagesStore.availablePackages.find(p => p.id === packageId.value)
})

// Payment method
const paymentMethod = ref<'card' | 'sepa'>('card')

// Billing form
const billingForm = ref({
  billing_address: '',
  billing_city: '',
  billing_province: '',
  billing_zip: '',
  billing_country: 'IT',
  sdi_code: '',
  pec_email: ''
})

// Loading states
const processing = ref(false)

// Stripe state
const stripeCardForm = ref<{ confirmCard: () => Promise<{ id: string; status: string }>; cardComplete: boolean } | null>(null)
const clientSecret = ref<string | null>(null)

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    packagesStore.fetchPackages(),
    profileStore.fetchProfile()
  ])

  // Pre-fill billing form from profile
  if (profileStore.profile) {
    billingForm.value = {
      billing_address: profileStore.profile.billing_address || '',
      billing_city: profileStore.profile.billing_city || '',
      billing_province: profileStore.profile.billing_province || '',
      billing_zip: profileStore.profile.billing_zip || '',
      billing_country: profileStore.profile.billing_country || 'IT',
      sdi_code: profileStore.profile.sdi_code || '',
      pec_email: profileStore.profile.pec_email || ''
    }
  }

  // Redirect if package not found
  if (!currentPackage.value) {
    router.push('/pacchetti')
  }
})

// Calculate VAT
const vatRate = 22
const vatAmount = computed(() => {
  if (!currentPackage.value) return 0
  return (currentPackage.value.price * vatRate) / 100
})

const totalWithVat = computed(() => {
  if (!currentPackage.value) return 0
  return currentPackage.value.price + vatAmount.value
})

// Calculate discount
const calculateSavings = computed(() => {
  if (!currentPackage.value) return 0
  return currentPackage.value.original_price - currentPackage.value.price
})

// Process payment
const processPayment = async () => {
  clearErrors()

  // Validate billing form
  if (!validateForm(billingForm.value)) {
    showError(t('packages.purchase.toast.errorFormValidation'))
    return
  }

  // Card must be filled when paying with card
  if (paymentMethod.value === 'card' && !stripeCardForm.value?.cardComplete) {
    showError('Compila i dati della carta')
    return
  }

  processing.value = true

  try {
    // First, update billing data if needed
    if (!profileStore.hasBillingData) {
      const billingSuccess = await profileStore.updateBilling(billingForm.value)
      if (!billingSuccess) {
        showError(profileStore.error || t('packages.purchase.toast.errorBilling'))
        return
      }
    }

    // Step 1: create the PaymentIntent on the backend (creates pending order)
    const intent = await packagesStore.purchasePackage(packageId.value, paymentMethod.value)
    if (!intent) {
      showError(packagesStore.error || t('packages.purchase.toast.errorPurchase'))
      return
    }

    clientSecret.value = intent.clientSecret

    // Step 2: confirm payment on Stripe with the card data
    if (paymentMethod.value === 'card') {
      await nextTick()
      try {
        const confirmed = await stripeCardForm.value!.confirmCard()
        if (confirmed.status !== 'succeeded') {
          showError(`Pagamento non completato (status: ${confirmed.status})`)
          return
        }
        // Step 3: notify backend to fulfill (create UserPackage)
        const result = await packagesStore.confirmPackagePurchase(confirmed.id)
        if (result) {
          showSuccess(t('packages.purchase.toast.success'))
          router.push('/pacchetti/attivi')
        } else {
          showError(packagesStore.error || t('packages.purchase.toast.errorPurchase'))
        }
      } catch (err: any) {
        showError(err.message || 'Pagamento rifiutato')
      }
    } else {
      // SEPA / bonifico bancario: l'ordine è stato creato in stato `pending`,
      // l'admin confermerà manualmente in seguito. Niente conferma Stripe lato
      // client. Avvisiamo l'utente e portiamolo alla lista ordini.
      showSuccess(t('packages.purchase.toast.sepaPending'))
      router.push('/ordini')
    }
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <div class="purchase-package-page">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/pacchetti" class="inline-flex items-center gap-2 text-primary hover:underline mb-4">
        <i class="pi pi-arrow-left"></i>
        {{ $t('packages.purchase.backToPackages') }}
      </NuxtLink>
      <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">
        {{ $t('packages.purchase.title') }}
      </h1>
      <p class="text-surface-600 dark:text-surface-400">
        {{ $t('packages.purchase.subtitle') }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="packagesStore.loading || profileStore.loading" class="flex justify-center py-12">
      <PrimeProgressSpinner />
    </div>

    <!-- Purchase Content -->
    <div v-else-if="currentPackage" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Package Summary -->
        <PrimeCard class="bg-primary-50 dark:bg-primary-900/20">
          <template #content>
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <i class="pi pi-box text-primary text-2xl"></i>
              </div>
              <div class="flex-grow">
                <PrimeTag v-if="currentPackage.category" :value="currentPackage.category.name" severity="info" class="mb-2" />
                <PrimeTag v-else :value="$t('packages.card.allCategories')" severity="secondary" class="mb-2" />
                <h3 class="text-xl font-bold text-surface-900 dark:text-surface-0">
                  {{ currentPackage.name }}
                </h3>
                <p class="text-surface-600 dark:text-surface-400">
                  {{ currentPackage.description }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-3xl font-bold text-primary">
                  {{ currentPackage.total_leads }}
                </p>
                <p class="text-sm text-surface-500">{{ $t('packages.card.leads') }}</p>
              </div>
            </div>
          </template>
        </PrimeCard>

        <!-- Billing Data -->
        <PrimeCard>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-file-edit text-primary"></i>
              {{ $t('packages.purchase.billing.title') }}
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Company info (readonly) -->
              <div class="md:col-span-2 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-surface-500 mb-1">{{ $t('packages.purchase.billing.companyName') }}</p>
                    <p class="font-medium text-surface-900 dark:text-surface-0">
                      {{ profileStore.profile?.company_name }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-surface-500 mb-1">{{ $t('packages.purchase.billing.vatNumber') }}</p>
                    <p class="font-medium text-surface-900 dark:text-surface-0">
                      {{ profileStore.profile?.vat_number }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Billing Address -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  {{ $t('packages.purchase.billing.address') }} *
                </label>
                <PrimeInputText
                  v-model="billingForm.billing_address"
                  :placeholder="$t('packages.purchase.billing.addressPlaceholder')"
                  class="w-full"
                  :invalid="!!errors.billing_address"
                />
                <small v-if="errors.billing_address" class="text-red-500">
                  {{ errors.billing_address }}
                </small>
              </div>

              <!-- City -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  {{ $t('packages.purchase.billing.city') }} *
                </label>
                <PrimeInputText
                  v-model="billingForm.billing_city"
                  :placeholder="$t('packages.purchase.billing.cityPlaceholder')"
                  class="w-full"
                  :invalid="!!errors.billing_city"
                />
                <small v-if="errors.billing_city" class="text-red-500">
                  {{ errors.billing_city }}
                </small>
              </div>

              <!-- Province -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  {{ $t('packages.purchase.billing.province') }} *
                </label>
                <PrimeInputText
                  v-model="billingForm.billing_province"
                  :placeholder="$t('packages.purchase.billing.provincePlaceholder')"
                  maxlength="2"
                  class="w-full"
                  :invalid="!!errors.billing_province"
                />
                <small v-if="errors.billing_province" class="text-red-500">
                  {{ errors.billing_province }}
                </small>
              </div>

              <!-- ZIP -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  {{ $t('packages.purchase.billing.zip') }} *
                </label>
                <PrimeInputText
                  v-model="billingForm.billing_zip"
                  :placeholder="$t('packages.purchase.billing.zipPlaceholder')"
                  maxlength="5"
                  class="w-full"
                  :invalid="!!errors.billing_zip"
                />
                <small v-if="errors.billing_zip" class="text-red-500">
                  {{ errors.billing_zip }}
                </small>
              </div>

              <!-- Country -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  {{ $t('packages.purchase.billing.country') }}
                </label>
                <PrimeInputText
                  v-model="billingForm.billing_country"
                  disabled
                  class="w-full"
                />
              </div>

              <PrimeDivider class="md:col-span-2" />

              <!-- SDI Code -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  {{ $t('packages.purchase.billing.sdiCode') }}
                </label>
                <PrimeInputText
                  v-model="billingForm.sdi_code"
                  :placeholder="$t('packages.purchase.billing.sdiCodePlaceholder')"
                  maxlength="7"
                  class="w-full uppercase"
                  :invalid="!!errors.sdi_code"
                />
                <small v-if="errors.sdi_code" class="text-red-500">
                  {{ errors.sdi_code }}
                </small>
              </div>

              <!-- PEC Email -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  {{ $t('packages.purchase.billing.pecEmail') }}
                </label>
                <PrimeInputText
                  v-model="billingForm.pec_email"
                  placeholder="azienda@pec.it"
                  class="w-full"
                  :invalid="!!errors.pec_email"
                />
                <small v-if="errors.pec_email" class="text-red-500">
                  {{ errors.pec_email }}
                </small>
              </div>
            </div>
          </template>
        </PrimeCard>

        <!-- Payment Method -->
        <PrimeCard>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-credit-card text-primary"></i>
              {{ $t('packages.purchase.payment.title') }}
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Card Option -->
              <div
                class="payment-option p-4 border-2 rounded-lg cursor-pointer transition-all"
                :class="paymentMethod === 'card'
                  ? 'border-primary bg-primary-50 dark:bg-primary-900/20'
                  : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'"
                @click="paymentMethod = 'card'"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    :class="paymentMethod === 'card'
                      ? 'border-primary bg-primary'
                      : 'border-surface-300'"
                  >
                    <i v-if="paymentMethod === 'card'" class="pi pi-check text-white text-xs"></i>
                  </div>
                  <div class="flex-grow">
                    <p class="font-medium text-surface-900 dark:text-surface-0">
                      {{ $t('packages.purchase.payment.cardOption') }}
                    </p>
                    <p class="text-sm text-surface-500">
                      {{ $t('packages.purchase.payment.cardDescription') }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- SEPA Option — nascosto temporaneamente, BE continua a supportarlo -->
              <!--
              <div
                class="payment-option p-4 border-2 rounded-lg cursor-pointer transition-all"
                :class="paymentMethod === 'sepa'
                  ? 'border-primary bg-primary-50 dark:bg-primary-900/20'
                  : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'"
                @click="paymentMethod = 'sepa'"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    :class="paymentMethod === 'sepa'
                      ? 'border-primary bg-primary'
                      : 'border-surface-300'"
                  >
                    <i v-if="paymentMethod === 'sepa'" class="pi pi-check text-white text-xs"></i>
                  </div>
                  <div class="flex-grow">
                    <p class="font-medium text-surface-900 dark:text-surface-0">
                      {{ $t('packages.purchase.payment.sepaOption') }}
                    </p>
                    <p class="text-sm text-surface-500">
                      {{ $t('packages.purchase.payment.sepaDescription') }}
                    </p>
                  </div>
                </div>
              </div>
              -->
            </div>

            <!-- Stripe Card Form (shown only when card is selected) -->
            <div v-if="paymentMethod === 'card'" class="mt-4">
              <StripeCardForm
                ref="stripeCardForm"
                :client-secret="clientSecret"
                :billing-name="profileStore.profile?.company_name"
              />
            </div>
          </template>
        </PrimeCard>
      </div>

      <!-- Order Summary Sidebar -->
      <div>
        <PrimeCard class="sticky top-4">
          <template #title>{{ $t('packages.purchase.summary.title') }}</template>
          <template #content>
            <div class="space-y-4">
              <!-- Package Details -->
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-surface-600 dark:text-surface-400">
                    {{ $t('packages.purchase.summary.leads', { count: currentPackage.total_leads }) }}
                  </span>
                  <span class="text-surface-900 dark:text-surface-0">
                    {{ formatCurrency(currentPackage.price) }}
                  </span>
                </div>
                <div class="flex justify-between text-sm text-green-600">
                  <span>{{ $t('packages.purchase.summary.savings') }}</span>
                  <span>-{{ formatCurrency(calculateSavings) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-surface-600 dark:text-surface-400">
                    {{ $t('packages.purchase.summary.vat', { rate: vatRate }) }}
                  </span>
                  <span class="text-surface-900 dark:text-surface-0">
                    {{ formatCurrency(vatAmount) }}
                  </span>
                </div>
              </div>

              <PrimeDivider />

              <!-- Total -->
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-surface-900 dark:text-surface-0">
                  {{ $t('packages.purchase.summary.total') }}
                </span>
                <span class="text-2xl font-bold text-primary">
                  {{ formatCurrency(totalWithVat) }}
                </span>
              </div>

              <!-- Package Benefits -->
              <div class="p-3 bg-surface-50 dark:bg-surface-800 rounded-lg space-y-2">
                <div class="flex items-center gap-2 text-sm">
                  <i class="pi pi-check-circle text-green-500"></i>
                  <span class="text-surface-600 dark:text-surface-400">
                    {{ $t('packages.purchase.summary.validity', { days: currentPackage.valid_days }) }}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <i class="pi pi-check-circle text-green-500"></i>
                  <span class="text-surface-600 dark:text-surface-400">
                    {{ $t('packages.purchase.summary.exclusiveAndShared', { exclusive: currentPackage.exclusive_leads, shared: currentPackage.shared_leads }) }}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <i class="pi pi-check-circle text-green-500"></i>
                  <span class="text-surface-600 dark:text-surface-400">
                    {{ $t('packages.purchase.summary.freeSelection') }}
                  </span>
                </div>
              </div>

              <!-- Pay Button -->
              <PrimeButton
                :label="processing ? $t('packages.purchase.summary.processing') : $t('packages.purchase.summary.payButton', { amount: formatCurrency(totalWithVat) })"
                icon="pi pi-lock"
                class="w-full"
                size="large"
                :loading="processing"
                :disabled="processing"
                @click="processPayment"
              />

              <!-- Security Info -->
              <div class="text-center">
                <p class="text-xs text-surface-400">
                  <i class="pi pi-lock mr-1"></i>
                  {{ $t('packages.purchase.summary.securePayment') }}
                </p>
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-option:hover {
  transform: translateY(-1px);
}
</style>
