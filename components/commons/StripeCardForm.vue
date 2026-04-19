<script setup lang="ts">
import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js'

/**
 * StripeCardForm
 * Mounts a Stripe Card Element and exposes a confirmCard() method to the parent.
 * The parent receives the PaymentIntent on success or an error message on failure.
 */
const props = defineProps<{
  clientSecret: string | null
  billingName?: string
  billingEmail?: string
}>()

const emit = defineEmits<{
  (e: 'ready'): void
  (e: 'change', complete: boolean): void
}>()

const { getStripe } = useStripe()

const cardMount = ref<HTMLDivElement | null>(null)
const stripe = ref<Stripe | null>(null)
const elements = ref<StripeElements | null>(null)
const card = ref<StripeCardElement | null>(null)
const cardError = ref<string | null>(null)
const cardComplete = ref(false)

onMounted(async () => {
  stripe.value = await getStripe()
  if (!stripe.value || !cardMount.value) return

  elements.value = stripe.value.elements()
  card.value = elements.value.create('card', {
    style: {
      base: {
        fontSize: '16px',
        color: '#1f2937',
        fontFamily: 'Inter, system-ui, sans-serif',
        '::placeholder': { color: '#9ca3af' }
      },
      invalid: { color: '#ef4444' }
    },
    hidePostalCode: true
  })
  card.value.mount(cardMount.value)
  card.value.on('change', (event) => {
    cardError.value = event.error?.message || null
    cardComplete.value = event.complete
    emit('change', event.complete)
  })
  emit('ready')
})

onBeforeUnmount(() => {
  card.value?.destroy()
})

/**
 * Confirms the card payment using the provided client_secret.
 * Returns the PaymentIntent on success, throws on error.
 */
const confirmCard = async (): Promise<{ id: string; status: string }> => {
  if (!stripe.value || !card.value || !props.clientSecret) {
    throw new Error('Stripe not initialized')
  }

  const result = await stripe.value.confirmCardPayment(props.clientSecret, {
    payment_method: {
      card: card.value,
      billing_details: {
        name: props.billingName || undefined,
        email: props.billingEmail || undefined
      }
    }
  })

  if (result.error) {
    cardError.value = result.error.message || 'Pagamento rifiutato'
    throw new Error(result.error.message || 'Pagamento rifiutato')
  }

  if (!result.paymentIntent) {
    throw new Error('Nessun PaymentIntent restituito')
  }

  return {
    id: result.paymentIntent.id,
    status: result.paymentIntent.status
  }
}

defineExpose({ confirmCard, cardComplete })
</script>

<template>
  <div class="stripe-card-form">
    <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
      Dati carta
    </label>
    <div
      ref="cardMount"
      class="stripe-card-mount p-3 border rounded-md bg-white dark:bg-surface-900"
      :class="cardError ? 'border-red-500' : 'border-surface-300 dark:border-surface-700'"
    />
    <small v-if="cardError" class="text-red-500 block mt-1">{{ cardError }}</small>
    <small v-else class="text-surface-500 block mt-1">
      Carta di test: 4242 4242 4242 4242 - qualunque scadenza futura - qualunque CVC
    </small>
  </div>
</template>

<style scoped>
.stripe-card-mount {
  min-height: 44px;
}
</style>
