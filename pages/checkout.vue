<script setup lang="ts">
/**
 * Page - Checkout
 * Payment page with billing confirmation and payment method selection
 */
definePageMeta({
  layout: 'client'
})

const cartStore = useCartStore()
const profileStore = useClientProfileStore()
const { formatCurrency, formatPurchaseMode } = useClientFormatters()
const { showSuccess, showError } = useClientToast()
const { validateForm, errors, clearErrors } = useBillingValidation()

const router = useRouter()

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

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    cartStore.fetchCart(),
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

  // Redirect if cart is empty
  if (cartStore.itemCount === 0) {
    router.push('/carrello')
  }
})

// Process payment
const processPayment = async () => {
  clearErrors()

  // Validate billing form
  if (!validateForm(billingForm.value)) {
    showError('Correggi gli errori nel form')
    return
  }

  processing.value = true

  try {
    // First, update billing data if needed
    if (!profileStore.hasBillingData) {
      const billingSuccess = await profileStore.updateBilling(billingForm.value)
      if (!billingSuccess) {
        showError(profileStore.error || 'Errore nell\'aggiornamento dati fatturazione')
        return
      }
    }

    // Process checkout - create checkout data and confirm payment
    const checkoutData = {
      billing_address: billingForm.value.billing_address,
      billing_city: billingForm.value.billing_city,
      billing_province: billingForm.value.billing_province,
      billing_zip: billingForm.value.billing_zip,
      billing_country: billingForm.value.billing_country,
      sdi_code: billingForm.value.sdi_code || null,
      pec_email: billingForm.value.pec_email || null,
      payment_method: paymentMethod.value,
      accept_terms: true
    }
    const paymentIntent = await cartStore.createCheckout(checkoutData)
    if (!paymentIntent) {
      showError(cartStore.error || 'Errore nella creazione del pagamento')
      return
    }

    // In a real app, we would use Stripe.js here. For mock, just confirm
    const result = await cartStore.confirmPayment(paymentIntent.client_secret)

    if (result) {
      showSuccess('Ordine completato con successo!')
      // Redirect to order confirmation
      router.push(`/ordini/${result.orderId}`)
    } else {
      showError(cartStore.error || 'Errore nel pagamento')
    }
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <div class="checkout-page">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/carrello" class="inline-flex items-center gap-2 text-primary hover:underline mb-4">
        <i class="pi pi-arrow-left"></i>
        Torna al carrello
      </NuxtLink>
      <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Checkout</h1>
      <p class="text-surface-600 dark:text-surface-400">
        Completa il tuo ordine
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="cartStore.loading || profileStore.loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>

    <!-- Checkout Content -->
    <div v-else-if="cartStore.cart && cartStore.itemCount > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Billing Data -->
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-file-edit text-primary"></i>
              Dati di Fatturazione
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Company info (readonly) -->
              <div class="md:col-span-2 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-surface-500 mb-1">Ragione Sociale</p>
                    <p class="font-medium text-surface-900 dark:text-surface-0">
                      {{ profileStore.profile?.company_name }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-surface-500 mb-1">Partita IVA</p>
                    <p class="font-medium text-surface-900 dark:text-surface-0">
                      {{ profileStore.profile?.vat_number }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Billing Address -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Indirizzo *
                </label>
                <InputText
                  v-model="billingForm.billing_address"
                  placeholder="Via, numero civico"
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
                  Città *
                </label>
                <InputText
                  v-model="billingForm.billing_city"
                  placeholder="Città"
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
                  Provincia *
                </label>
                <InputText
                  v-model="billingForm.billing_province"
                  placeholder="MI"
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
                  CAP *
                </label>
                <InputText
                  v-model="billingForm.billing_zip"
                  placeholder="20100"
                  maxlength="5"
                  class="w-full"
                  :invalid="!!errors.billing_zip"
                />
                <small v-if="errors.billing_zip" class="text-red-500">
                  {{ errors.billing_zip }}
                </small>
              </div>

              <!-- Country (readonly) -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Paese
                </label>
                <InputText
                  v-model="billingForm.billing_country"
                  disabled
                  class="w-full"
                />
              </div>

              <Divider class="md:col-span-2" />

              <!-- SDI Code -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Codice SDI
                </label>
                <InputText
                  v-model="billingForm.sdi_code"
                  placeholder="ABC1234"
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
                  Email PEC
                </label>
                <InputText
                  v-model="billingForm.pec_email"
                  placeholder="azienda@pec.it"
                  class="w-full"
                  :invalid="!!errors.pec_email"
                />
                <small v-if="errors.pec_email" class="text-red-500">
                  {{ errors.pec_email }}
                </small>
              </div>

              <div class="md:col-span-2">
                <small class="text-surface-500">
                  * Inserisci il Codice SDI oppure la PEC per la fatturazione elettronica
                </small>
              </div>
            </div>
          </template>
        </Card>

        <!-- Payment Method -->
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-credit-card text-primary"></i>
              Metodo di Pagamento
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
                      Carta di Credito/Debito
                    </p>
                    <p class="text-sm text-surface-500">
                      Visa, Mastercard, American Express
                    </p>
                  </div>
                  <div class="flex gap-1">
                    <i class="pi pi-credit-card text-2xl text-surface-400"></i>
                  </div>
                </div>
              </div>

              <!-- SEPA Option -->
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
                      Addebito SEPA
                    </p>
                    <p class="text-sm text-surface-500">
                      Bonifico bancario diretto
                    </p>
                  </div>
                  <div>
                    <i class="pi pi-building text-2xl text-surface-400"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stripe info -->
            <div class="mt-4 p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
              <div class="flex items-center gap-2">
                <i class="pi pi-lock text-green-500"></i>
                <span class="text-sm text-surface-600 dark:text-surface-400">
                  I pagamenti sono processati in modo sicuro da Stripe. Non memorizziamo i dati della tua carta.
                </span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Order Summary Sidebar -->
      <div>
        <Card class="sticky top-4">
          <template #title>Riepilogo Ordine</template>
          <template #content>
            <div class="space-y-4">
              <!-- Items List -->
              <div class="space-y-3 max-h-64 overflow-y-auto">
                <div
                  v-for="item in cartStore.cart.items"
                  :key="item.id"
                  class="flex justify-between items-start py-2 border-b border-surface-100 dark:border-surface-800 last:border-0"
                >
                  <div class="flex-grow">
                    <p class="text-sm font-medium text-surface-900 dark:text-surface-0">
                      Lead #{{ item.lead_id }}
                    </p>
                    <p class="text-xs text-surface-500">
                      {{ item.lead?.category?.name }} - {{ formatPurchaseMode(item.purchase_mode) }}
                    </p>
                  </div>
                  <p class="text-sm font-medium text-surface-900 dark:text-surface-0">
                    {{ formatCurrency(item.price) }}
                  </p>
                </div>
              </div>

              <Divider />

              <!-- Totals -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-surface-600 dark:text-surface-400">
                    Subtotale
                  </span>
                  <span class="text-surface-900 dark:text-surface-0">
                    {{ formatCurrency(cartStore.cart.subtotal) }}
                  </span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-surface-600 dark:text-surface-400">
                    IVA ({{ cartStore.cart.vat_rate }}%)
                  </span>
                  <span class="text-surface-900 dark:text-surface-0">
                    {{ formatCurrency(cartStore.cart.vat_amount) }}
                  </span>
                </div>
              </div>

              <Divider />

              <!-- Total -->
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-surface-900 dark:text-surface-0">
                  Totale
                </span>
                <span class="text-2xl font-bold text-primary">
                  {{ formatCurrency(cartStore.cart.total) }}
                </span>
              </div>

              <!-- Pay Button -->
              <Button
                :label="processing ? 'Elaborazione...' : `Paga ${formatCurrency(cartStore.cart.total)}`"
                icon="pi pi-lock"
                class="w-full"
                size="large"
                :loading="processing"
                :disabled="processing"
                @click="processPayment"
              />

              <!-- Terms -->
              <p class="text-xs text-center text-surface-400">
                Procedendo accetti i <NuxtLink to="/termini" class="text-primary hover:underline">Termini di Servizio</NuxtLink>
                e la <NuxtLink to="/privacy" class="text-primary hover:underline">Privacy Policy</NuxtLink>
              </p>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Empty Cart -->
    <div v-else class="text-center py-12">
      <i class="pi pi-shopping-cart text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
      <h2 class="text-xl font-bold text-surface-700 dark:text-surface-300 mb-2">
        Carrello vuoto
      </h2>
      <p class="text-surface-500 mb-4">
        Aggiungi dei lead al carrello per procedere al checkout
      </p>
      <NuxtLink to="/leads">
        <Button label="Vai al Catalogo" icon="pi pi-search" />
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.payment-option:hover {
  transform: translateY(-1px);
}
</style>
