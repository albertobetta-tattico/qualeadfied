<script setup lang="ts">
/**
 * Page - Cart
 * Shopping cart with lead items and checkout action
 */
import type { CartItem, PurchaseMode } from '~/types/clientArea'

definePageMeta({
  layout: 'client'
})

const cartStore = useCartStore()
const { formatCurrency, formatRelativeTime, formatPurchaseMode } = useClientFormatters()
const { showSuccess, showError } = useClientToast()
const { confirmRemoveFromCart, confirmClearCart } = useClientConfirm()

// Fetch cart on mount
onMounted(async () => {
  await cartStore.fetchCart()
})

// Remove item from cart
const removeItem = (item: CartItem) => {
  confirmRemoveFromCart(async () => {
    const success = await cartStore.removeItem(item.id)
    if (success) {
      showSuccess('Lead rimosso dal carrello')
    } else {
      showError(cartStore.error || 'Errore nella rimozione')
    }
  })
}

// Update item mode
const updateItemMode = async (item: CartItem, mode: PurchaseMode) => {
  if (item.purchase_mode === mode) return

  const success = await cartStore.updateItem(item.id, mode)

  if (success) {
    showSuccess('Modalità aggiornata')
  } else {
    showError(cartStore.error || 'Errore nell\'aggiornamento')
  }
}

// Clear cart
const clearCart = () => {
  confirmClearCart(async () => {
    const success = await cartStore.clearCart()
    if (success) {
      showSuccess('Carrello svuotato')
    } else {
      showError(cartStore.error || 'Errore nello svuotamento')
    }
  })
}

// Proceed to checkout
const router = useRouter()
const proceedToCheckout = () => {
  router.push('/checkout')
}
</script>

<template>
  <div class="cart-page">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Carrello</h1>
        <p class="text-surface-600 dark:text-surface-400">
          {{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? 'lead' : 'lead' }} nel carrello
        </p>
      </div>
      <div v-if="cartStore.itemCount > 0" class="flex items-center gap-2">
        <NuxtLink to="/leads">
          <Button
            label="Continua lo shopping"
            icon="pi pi-arrow-left"
            severity="secondary"
          />
        </NuxtLink>
        <Button
          label="Svuota carrello"
          icon="pi pi-trash"
          severity="danger"
          outlined
          @click="clearCart"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="cartStore.loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>

    <!-- Empty Cart -->
    <div v-else-if="!cartStore.cart || cartStore.itemCount === 0" class="text-center py-16">
      <i class="pi pi-shopping-cart text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
      <h2 class="text-2xl font-bold text-surface-700 dark:text-surface-300 mb-2">
        Il carrello è vuoto
      </h2>
      <p class="text-surface-500 dark:text-surface-400 mb-6">
        Inizia ad aggiungere lead dal catalogo
      </p>
      <NuxtLink to="/leads">
        <Button label="Vai al Catalogo" icon="pi pi-search" size="large" />
      </NuxtLink>
    </div>

    <!-- Cart Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Cart Items -->
      <div class="lg:col-span-2">
        <Card>
          <template #content>
            <div class="space-y-4">
              <div
                v-for="item in cartStore.cart.items"
                :key="item.id"
                class="cart-item p-4 border border-surface-200 dark:border-surface-700 rounded-lg"
              >
                <div class="flex flex-col md:flex-row md:items-start gap-4">
                  <!-- Lead Info -->
                  <div class="flex-grow">
                    <div class="flex items-center gap-2 mb-2">
                      <Tag :value="item.lead?.category?.name" severity="info" size="small" />
                      <Tag :value="item.lead?.province?.code" severity="secondary" size="small" />
                    </div>
                    <h3 class="font-semibold text-surface-900 dark:text-surface-0 mb-1">
                      Lead #{{ item.lead_id }}
                    </h3>
                    <p class="text-sm text-surface-600 dark:text-surface-400 line-clamp-2 mb-2">
                      {{ item.lead?.request_text_partial }}
                    </p>
                    <p class="text-xs text-surface-400">
                      Generato {{ formatRelativeTime(item.lead?.generated_at || null) }}
                    </p>
                  </div>

                  <!-- Mode Selection & Price -->
                  <div class="flex flex-col items-end gap-3">
                    <!-- Mode Toggle -->
                    <SelectButton
                      :modelValue="item.purchase_mode"
                      :options="[
                        { label: 'Esclusivo', value: 'exclusive' },
                        { label: 'Condiviso', value: 'shared' }
                      ]"
                      optionLabel="label"
                      optionValue="value"
                      :allowEmpty="false"
                      @update:modelValue="(val: 'exclusive' | 'shared') => updateItemMode(item, val)"
                    />

                    <!-- Price -->
                    <div class="text-right">
                      <p class="text-2xl font-bold text-primary">
                        {{ formatCurrency(item.price) }}
                      </p>
                      <p class="text-xs text-surface-400">
                        {{ formatPurchaseMode(item.purchase_mode) }}
                      </p>
                    </div>

                    <!-- Remove Button -->
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      size="small"
                      @click="removeItem(item)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Order Summary -->
      <div>
        <Card class="sticky top-4">
          <template #title>Riepilogo Ordine</template>
          <template #content>
            <div class="space-y-4">
              <!-- Items Summary -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-surface-600 dark:text-surface-400">
                    Subtotale ({{ cartStore.itemCount }} lead)
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

              <!-- Checkout Button -->
              <Button
                label="Procedi al Checkout"
                icon="pi pi-credit-card"
                class="w-full"
                size="large"
                @click="proceedToCheckout"
              />

              <!-- Info -->
              <div class="text-center">
                <p class="text-xs text-surface-400">
                  <i class="pi pi-lock mr-1"></i>
                  Pagamento sicuro con Stripe
                </p>
              </div>
            </div>
          </template>
        </Card>

        <!-- Benefits -->
        <Card class="mt-4">
          <template #content>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <i class="pi pi-verified text-green-500"></i>
                <span class="text-sm text-surface-600 dark:text-surface-400">
                  Lead verificati e di qualità
                </span>
              </div>
              <div class="flex items-center gap-3">
                <i class="pi pi-bolt text-yellow-500"></i>
                <span class="text-sm text-surface-600 dark:text-surface-400">
                  Accesso immediato dopo il pagamento
                </span>
              </div>
              <div class="flex items-center gap-3">
                <i class="pi pi-shield text-blue-500"></i>
                <span class="text-sm text-surface-600 dark:text-surface-400">
                  Garanzia soddisfatti o rimborsati
                </span>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-item {
  transition: box-shadow 0.2s;
}

.cart-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
