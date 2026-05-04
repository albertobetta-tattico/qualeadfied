/**
 * Store - Cart
 * Pinia store for shopping cart management
 */
import { defineStore } from 'pinia'
import type { Category, Province } from '~/types/lead'
import type {
  Cart,
  CartItem,
  CartGroup,
  AddToCartRequest,
  PurchaseMode,
  CheckoutData,
  PaymentIntent
} from '~/types/clientArea'

const VAT_RATE = 22

interface CartState {
  items: CartItem[]
  loading: boolean
  checkoutLoading: boolean
  error: string | null
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    loading: false,
    checkoutLoading: false,
    error: null
  }),

  getters: {
    itemCount: (state): number => state.items.length,

    subtotal: (state): number => {
      return state.items.reduce((sum, item) => sum + Number(item.price), 0)
    },

    vatAmount(): number {
      return Math.round((this.subtotal * VAT_RATE) / 100 * 100) / 100
    },

    total(): number {
      return this.subtotal + this.vatAmount
    },

    cart(): Cart {
      return {
        items: this.items,
        subtotal: this.subtotal,
        vat_amount: this.vatAmount,
        vat_rate: VAT_RATE,
        total: this.total
      }
    },

    isEmpty: (state): boolean => state.items.length === 0,

    isLeadInCart: (state) => (leadId: number): boolean => {
      return state.items.some(item => item.lead_id === leadId)
    },

    getItemByLeadId: (state) => (leadId: number): CartItem | undefined => {
      return state.items.find(item => item.lead_id === leadId)
    },

    groupedItems(state): CartGroup[] {
      const groupsMap = new Map<string, CartGroup>()

      for (const item of state.items) {
        // Backend returns `categories` (array) — use the first one for grouping
        const leadCategories = (item.lead as any)?.categories as Array<{ id: number; name: string; slug: string; max_shares: number; is_active: boolean; sort_order: number; deleted_at: string | null; created_at: string; updated_at: string }> | undefined
        const category = leadCategories?.[0] ?? item.lead?.category
        const categoryId = category?.id ?? item.lead?.category_id ?? 0
        const key = `${categoryId}-${item.purchase_mode}`

        if (!groupsMap.has(key)) {
          groupsMap.set(key, {
            key,
            category: category || { id: categoryId, name: 'Sconosciuta', slug: '', max_shares: 0, is_active: true, sort_order: 0, deleted_at: null, created_at: '', updated_at: '' },
            purchase_mode: item.purchase_mode,
            items: [],
            provinces: [],
            totalLeads: 0,
            totalPrice: 0
          })
        }

        const group = groupsMap.get(key)!
        group.items.push(item)
        group.totalLeads++
        group.totalPrice += Number(item.price)

        const province = item.lead?.province
        if (province && !group.provinces.some(p => p.id === province.id)) {
          group.provinces.push(province)
        }
      }

      for (const group of groupsMap.values()) {
        group.provinces.sort((a, b) => a.name.localeCompare(b.name))
      }

      return Array.from(groupsMap.values()).sort((a, b) => {
        const categoryCompare = a.category.name.localeCompare(b.category.name)
        if (categoryCompare !== 0) return categoryCompare
        return a.purchase_mode === 'exclusive' ? -1 : 1
      })
    }
  },

  actions: {
    async fetchCart(): Promise<void> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()
        const { data, error } = await client.GET('/cart')
        if (error) throw error
        this.items = (data.cart_items ?? []) as unknown as CartItem[]
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.loadError')
      } finally {
        this.loading = false
      }
    },

    async addToCart(request: AddToCartRequest): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        const client = useTypedApi()
        const { data, error } = await client.POST('/cart', {
          body: {
            lead_id: request.lead_id,
            purchase_mode: request.purchase_mode,
          } as any
        })
        if (error) throw error

        this.items.push(data.cart_item as unknown as CartItem)
        return true
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.createError')
        return false
      } finally {
        this.loading = false
      }
    },

    async updateItem(itemId: number, purchaseMode: PurchaseMode): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.error = null

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/cart/${itemId}`, {
          method: 'PUT',
          body: { purchase_mode: purchaseMode },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })

        const item = this.items.find(i => i.id === itemId)
        if (item) {
          item.purchase_mode = purchaseMode
        }

        return true
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.updateError')
        return false
      }
    },

    async removeItem(itemId: number): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.error = null

      try {
        const client = useTypedApi()
        const { error } = await client.DELETE('/cart/{cartItem}', {
          params: { path: { cartItem: itemId } }
        })
        if (error) throw error

        this.items = this.items.filter(i => i.id !== itemId)
        return true
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.deleteError')
        return false
      }
    },

    async removeGroup(groupKey: string): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.error = null

      const [categoryIdStr, purchaseMode] = groupKey.split('-')
      const categoryId = parseInt(categoryIdStr, 10)
      const itemsToRemove = this.items.filter(item => {
        const cats = (item.lead as any)?.categories as Array<{ id: number }> | undefined
        const itemCatId = cats?.[0]?.id ?? item.lead?.category?.id ?? item.lead?.category_id
        return itemCatId === categoryId && item.purchase_mode === purchaseMode
      })

      if (itemsToRemove.length === 0) return true

      try {
        const itemIds = itemsToRemove.map(i => i.id)
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/cart/remove-batch`, {
          method: 'POST',
          body: { item_ids: itemIds },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })

        const itemIdsSet = new Set(itemIds)
        this.items = this.items.filter(i => !itemIdsSet.has(i.id))
        return true
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.deleteError')
        return false
      }
    },

    async clearCart(): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.error = null

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/cart`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })

        this.items = []
        return true
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.deleteError')
        return false
      }
    },

    async createCheckout(data: CheckoutData): Promise<PaymentIntent | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.checkoutLoading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: PaymentIntent }>(`${config.public.apiBase}/checkout`, {
          method: 'POST',
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })

        return response.data
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.paymentError')
        return null
      } finally {
        this.checkoutLoading = false
      }
    },

    async confirmPayment(paymentIntentId: string): Promise<{ orderId: number } | null> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.checkoutLoading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: { order_id: number } }>(`${config.public.apiBase}/checkout/confirm`, {
          method: 'POST',
          body: { payment_intent_id: paymentIntentId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json'
          }
        })

        this.items = []
        return { orderId: response.data.order_id }
      } catch (e: any) {
        this.error = e.data?.message || t('common.errors.paymentError')
        return null
      } finally {
        this.checkoutLoading = false
      }
    }
  }
})
