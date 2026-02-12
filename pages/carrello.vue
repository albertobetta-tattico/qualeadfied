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
const { t } = useI18n()
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
  const modeLabel = group.purchase_mode === 'exclusive' ? t('common.labels.exclusivePlural') : t('common.labels.sharedPlural')
  confirm.require({
    message: t('cart.confirm.removeGroup.message', { count: group.totalLeads, mode: modeLabel, category: group.category.name }),
    header: t('cart.confirm.removeGroup.header'),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: t('cart.confirm.removeGroup.accept'),
    rejectLabel: t('cart.confirm.removeGroup.reject'),
    acceptClass: 'p-button-danger',
    accept: async () => {
      const success = await cartStore.removeGroup(group.key)
      if (success) {
        showSuccess(t('cart.toast.groupRemoved', { count: group.totalLeads }))
      } else {
        showError(cartStore.error || t('cart.toast.errorRemoving'))
      }
    }
  })
}

// Clear cart
const clearCart = () => {
  confirmClearCart(async () => {
    const success = await cartStore.clearCart()
    if (success) {
      showSuccess(t('cart.toast.cartCleared'))
    } else {
      showError(cartStore.error || t('cart.toast.errorClearing'))
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
  return t('cart.item.andOthers', { list: first5, count: provinces.length - 5 })
}

// Build group summary text
const buildGroupSummary = (group: CartGroup): string => {
  const modeLabel = group.purchase_mode === 'exclusive' ? t('common.labels.exclusivePlural') : t('common.labels.sharedPlural')
  const provinceCodes = formatProvinces(group.provinces)
  return t('cart.item.groupSummary', { count: group.totalLeads, mode: modeLabel, provinces: provinceCodes })
}
</script>

<template>
  <div class="cart-page">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ $t('cart.title') }}</h1>
        <p class="text-surface-600 dark:text-surface-400">
          {{ $t('cart.itemsInCart', { count: cartStore.itemCount }) }}
        </p>
      </div>
      <div v-if="cartStore.itemCount > 0" class="flex items-center gap-2">
        <NuxtLink to="/leads">
          <PrimeButton
            :label="$t('cart.continueShopping')"
            icon="pi pi-arrow-left"
            severity="secondary"
          />
        </NuxtLink>
        <PrimeButton
          :label="$t('cart.emptyCartButton')"
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
        {{ $t('cart.empty.title') }}
      </h2>
      <p class="text-surface-500 dark:text-surface-400 mb-6">
        {{ $t('cart.empty.subtitle') }}
      </p>
      <NuxtLink to="/leads">
        <PrimeButton :label="$t('cart.empty.cta')" icon="pi pi-search" size="large" />
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
                  <p class="text-surface-700 dark:text-surface-300 mb-2" v-html="$t('cart.item.purchaseSummary', { count: group.totalLeads, category: group.category.name, mode: group.purchase_mode === 'exclusive' ? $t('common.labels.exclusivePlural') : $t('common.labels.sharedPlural') })">
                  </p>

                  <!-- Provinces -->
                  <div class="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                    <i class="pi pi-map-marker"></i>
                    <span>{{ $t('cart.item.provinces') }} <strong>{{ formatProvinces(group.provinces) }}</strong></span>
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
                    :label="$t('cart.item.removeGroup')"
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
                      <span class="text-sm">{{ $t('cart.item.seeAllProvinces', { count: group.provinces.length }) }}</span>
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
                {{ $t('cart.item.removalNote', { count: group.totalLeads }) }}
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>

      <!-- Order Summary -->
      <div>
        <PrimeCard class="sticky top-4">
          <template #title>{{ $t('cart.summary.title') }}</template>
          <template #content>
            <div class="space-y-4">
              <!-- Items Summary -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-surface-600 dark:text-surface-400">
                    {{ $t('cart.summary.subtotal', { count: cartStore.itemCount }) }}
                  </span>
                  <span class="text-surface-900 dark:text-surface-0">
                    {{ formatCurrency(cartStore.cart.subtotal) }}
                  </span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-surface-600 dark:text-surface-400">
                    {{ $t('cart.summary.vat', { rate: cartStore.cart.vat_rate }) }}
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
                  {{ $t('cart.summary.total') }}
                </span>
                <span class="text-2xl font-bold text-primary">
                  {{ formatCurrency(cartStore.cart.total) }}
                </span>
              </div>

              <!-- Checkout Button -->
              <PrimeButton
                :label="$t('cart.summary.checkout')"
                icon="pi pi-credit-card"
                class="w-full"
                size="large"
                @click="proceedToCheckout"
              />

              <!-- Info -->
              <div class="text-center">
                <p class="text-xs text-surface-400">
                  <i class="pi pi-lock mr-1"></i>
                  {{ $t('cart.summary.securePayment') }}
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
                  {{ $t('cart.benefits.verified') }}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <i class="pi pi-bolt text-yellow-500"></i>
                <span class="text-sm text-surface-600 dark:text-surface-400">
                  {{ $t('cart.benefits.immediate') }}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <i class="pi pi-shield text-blue-500"></i>
                <span class="text-sm text-surface-600 dark:text-surface-400">
                  {{ $t('cart.benefits.guarantee') }}
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
