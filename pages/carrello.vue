<script setup lang="ts">
/**
 * Page - Cart
 * Shopping cart with grouped lead items and checkout action
 */
import type { CartGroup } from '~/types/clientArea'

definePageMeta({
  layout: 'client'
})

const cartStore = useCartStore()
const { formatCurrency, formatPurchaseMode } = useClientFormatters()
const { showSuccess, showError } = useClientToast()
const { confirmClearCart } = useClientConfirm()
const confirm = useConfirm()

// Fetch cart on mount
onMounted(async () => {
  await cartStore.fetchCart()
})

// Remove entire group from cart
const removeGroup = (group: CartGroup) => {
  const modeLabel = group.purchase_mode === 'exclusive' ? 'esclusivi' : 'condivisi'
  confirm.require({
    message: `Vuoi rimuovere tutti i ${group.totalLeads} lead ${modeLabel} della categoria "${group.category.name}"?`,
    header: 'Rimuovi gruppo',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Rimuovi',
    rejectLabel: 'Annulla',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const success = await cartStore.removeGroup(group.key)
      if (success) {
        showSuccess(`Gruppo rimosso (${group.totalLeads} lead)`)
      } else {
        showError(cartStore.error || 'Errore nella rimozione')
      }
    }
  })
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

// Format provinces list
const formatProvinces = (provinces: { code: string; name: string }[]): string => {
  if (provinces.length === 0) return ''
  if (provinces.length <= 5) {
    return provinces.map(p => p.code).join(', ')
  }
  const first5 = provinces.slice(0, 5).map(p => p.code).join(', ')
  return `${first5} e altre ${provinces.length - 5}`
}

// Build group summary text
const buildGroupSummary = (group: CartGroup): string => {
  const modeLabel = group.purchase_mode === 'exclusive' ? 'esclusivi' : 'condivisi'
  const provinceCodes = formatProvinces(group.provinces)
  return `${group.totalLeads} lead ${modeLabel} per le province: ${provinceCodes}`
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
          <PrimeButton
            label="Continua lo shopping"
            icon="pi pi-arrow-left"
            severity="secondary"
          />
        </NuxtLink>
        <PrimeButton
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
      <PrimeProgressSpinner />
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
        <PrimeButton label="Vai al Catalogo" icon="pi pi-search" size="large" />
      </NuxtLink>
    </div>

    <!-- Cart Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Cart Groups -->
      <div class="lg:col-span-2 space-y-4">
        <PrimeCard
          v-for="group in cartStore.groupedItems"
          :key="group.key"
          class="cart-group"
        >
          <template #content>
            <div class="flex flex-col gap-4">
              <!-- Group Header -->
              <div class="flex items-start justify-between gap-4">
                <div class="flex-grow">
                  <!-- Category & Mode Badge -->
                  <div class="flex items-center gap-2 mb-3">
                    <PrimeTag
                      :value="group.category.name"
                      severity="info"
                    />
                    <PrimeTag
                      :value="formatPurchaseMode(group.purchase_mode)"
                      :severity="group.purchase_mode === 'exclusive' ? 'success' : 'warn'"
                    />
                  </div>

                  <!-- Summary Text -->
                  <p class="text-surface-700 dark:text-surface-300 mb-2">
                    Acquisto di <strong>{{ group.totalLeads }}</strong> lead categoria
                    <strong>{{ group.category.name }}</strong>
                    {{ group.purchase_mode === 'exclusive' ? 'esclusivi' : 'condivisi' }}
                  </p>

                  <!-- Provinces -->
                  <div class="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                    <i class="pi pi-map-marker"></i>
                    <span>Province: <strong>{{ formatProvinces(group.provinces) }}</strong></span>
                  </div>
                </div>

                <!-- Price & Remove -->
                <div class="flex flex-col items-end gap-3">
                  <div class="text-right">
                    <p class="text-2xl font-bold text-primary">
                      {{ formatCurrency(group.totalPrice) }}
                    </p>
                    <p class="text-xs text-surface-400">
                      {{ group.totalLeads }} lead
                    </p>
                  </div>

                  <PrimeButton
                    icon="pi pi-trash"
                    label="Rimuovi gruppo"
                    severity="danger"
                    outlined
                    size="small"
                    @click="removeGroup(group)"
                  />
                </div>
              </div>

              <!-- Provinces Details (expandable for many provinces) -->
              <div v-if="group.provinces.length > 5" class="provinces-detail">
                <PrimeAccordion>
                  <PrimeAccordionPanel value="provinces">
                    <PrimeAccordionHeader>
                      <span class="text-sm">Vedi tutte le {{ group.provinces.length }} province</span>
                    </PrimeAccordionHeader>
                    <PrimeAccordionContent>
                      <div class="flex flex-wrap gap-2">
                        <PrimeTag
                          v-for="province in group.provinces"
                          :key="province.id"
                          :value="`${province.code} - ${province.name}`"
                          severity="secondary"
                          size="small"
                        />
                      </div>
                    </PrimeAccordionContent>
                  </PrimeAccordionPanel>
                </PrimeAccordion>
              </div>

              <!-- Info note -->
              <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-3 text-sm text-surface-600 dark:text-surface-400">
                <i class="pi pi-info-circle mr-2"></i>
                La rimozione elimina tutti i {{ group.totalLeads }} lead di questo gruppo.
                Non è possibile modificare i singoli lead.
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>

      <!-- Order Summary -->
      <div>
        <PrimeCard class="sticky top-4">
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

              <PrimeDivider />

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
              <PrimeButton
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
        </PrimeCard>

        <!-- Benefits -->
        <PrimeCard class="mt-4">
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
        </PrimeCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-group {
  transition: box-shadow 0.2s;
}

.cart-group:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.provinces-detail :deep(.p-accordion-header-link) {
  padding: 0.5rem 0;
  background: transparent;
  border: none;
}

.provinces-detail :deep(.p-accordion-content) {
  padding: 0.75rem 0;
  border: none;
  background: transparent;
}
</style>
