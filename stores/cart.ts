/**
 * Store - Cart
 * Pinia store for shopping cart management
 */
import { defineStore } from 'pinia'
import type { Category, Province } from '~/types/lead'
import type {
  Cart,
  CartItem,
  AddToCartRequest,
  PurchaseMode,
  CheckoutData,
  PaymentIntent
} from '~/types/clientArea'

const USE_MOCK_DATA = true
const VAT_RATE = 22

// Mock categories and provinces
const mockCategories: Record<number, Category> = {
  1: { id: 1, name: 'Ristrutturazioni', slug: 'ristrutturazioni', max_shares: 5, is_active: true, sort_order: 1, deleted_at: null, created_at: '', updated_at: '' },
  2: { id: 2, name: 'Fotovoltaico', slug: 'fotovoltaico', max_shares: 4, is_active: true, sort_order: 2, deleted_at: null, created_at: '', updated_at: '' },
  3: { id: 3, name: 'Serramenti', slug: 'serramenti', max_shares: 5, is_active: true, sort_order: 3, deleted_at: null, created_at: '', updated_at: '' }
}

const mockProvinces: Record<number, Province> = {
  1: { id: 1, name: 'Milano', code: 'MI', region: 'Lombardia', is_active: true },
  2: { id: 2, name: 'Roma', code: 'RM', region: 'Lazio', is_active: true },
  3: { id: 3, name: 'Torino', code: 'TO', region: 'Piemonte', is_active: true }
}

// Mock cart items
const mockCartItems: CartItem[] = [
  {
    id: 1,
    lead_id: 101,
    purchase_mode: 'exclusive',
    price: 45,
    added_at: '2025-01-14T10:00:00Z',
    lead: {
      id: 101,
      category_id: 1,
      province_id: 1,
      request_text_partial: 'Richiesta preventivo per ristrutturazione completa appartamento 80mq...',
      generated_at: '2025-01-14T09:00:00Z',
      category: mockCategories[1],
      province: mockProvinces[1]
    }
  },
  {
    id: 2,
    lead_id: 102,
    purchase_mode: 'shared',
    price: 15,
    added_at: '2025-01-14T10:15:00Z',
    lead: {
      id: 102,
      category_id: 2,
      province_id: 2,
      request_text_partial: 'Interessato a impianto fotovoltaico per villetta unifamiliare...',
      generated_at: '2025-01-14T08:30:00Z',
      category: mockCategories[2],
      province: mockProvinces[2]
    }
  }
]

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
      return state.items.reduce((sum, item) => sum + item.price, 0)
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
    }
  },

  actions: {
    /**
     * Fetch cart from server
     */
    async fetchCart(): Promise<void> {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          this.items = [...mockCartItems]
          return
        }

        const response = await $fetch<{ data: CartItem[] }>('/api/client/cart', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        this.items = response.data
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nel caricamento del carrello'
      } finally {
        this.loading = false
      }
    },

    /**
     * Add lead to cart
     */
    async addToCart(request: AddToCartRequest): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))

          // Check if already in cart
          if (this.isLeadInCart(request.lead_id)) {
            this.error = 'Lead già presente nel carrello'
            return false
          }

          // Create mock cart item
          const newItem: CartItem = {
            id: Date.now(),
            lead_id: request.lead_id,
            purchase_mode: request.purchase_mode,
            price: request.purchase_mode === 'exclusive' ? 45 : 15,
            added_at: new Date().toISOString(),
            lead: {
              id: request.lead_id,
              category_id: 1,
              province_id: 1,
              request_text_partial: 'Nuova richiesta lead...',
              generated_at: new Date().toISOString(),
              category: mockCategories[1],
              province: mockProvinces[1]
            }
          }

          this.items.push(newItem)
          return true
        }

        const response = await $fetch<{ data: CartItem }>('/api/client/cart', {
          method: 'POST',
          body: request,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        this.items.push(response.data)
        return true
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nell\'aggiunta al carrello'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Update cart item (change purchase mode)
     */
    async updateItem(itemId: number, purchaseMode: PurchaseMode): Promise<boolean> {
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))

          const item = this.items.find(i => i.id === itemId)
          if (item) {
            item.purchase_mode = purchaseMode
            item.price = purchaseMode === 'exclusive' ? 45 : 15
          }
          return true
        }

        await $fetch(`/api/client/cart/${itemId}`, {
          method: 'PUT',
          body: { purchase_mode: purchaseMode },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        const item = this.items.find(i => i.id === itemId)
        if (item) {
          item.purchase_mode = purchaseMode
        }

        return true
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nell\'aggiornamento'
        return false
      }
    },

    /**
     * Remove item from cart
     */
    async removeItem(itemId: number): Promise<boolean> {
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          this.items = this.items.filter(i => i.id !== itemId)
          return true
        }

        await $fetch(`/api/client/cart/${itemId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        this.items = this.items.filter(i => i.id !== itemId)
        return true
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nella rimozione'
        return false
      }
    },

    /**
     * Clear entire cart
     */
    async clearCart(): Promise<boolean> {
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          this.items = []
          return true
        }

        await $fetch('/api/client/cart', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        this.items = []
        return true
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nello svuotamento'
        return false
      }
    },

    /**
     * Create checkout / payment intent
     */
    async createCheckout(data: CheckoutData): Promise<PaymentIntent | null> {
      this.checkoutLoading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))

          return {
            client_secret: 'mock_secret_' + Date.now(),
            amount: Math.round(this.total * 100),
            currency: 'eur'
          }
        }

        const response = await $fetch<{ data: PaymentIntent }>('/api/client/checkout', {
          method: 'POST',
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        return response.data
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nella creazione del pagamento'
        return null
      } finally {
        this.checkoutLoading = false
      }
    },

    /**
     * Confirm payment (after Stripe)
     */
    async confirmPayment(paymentIntentId: string): Promise<{ orderId: number } | null> {
      this.checkoutLoading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))

          // Clear cart after successful payment
          this.items = []

          return { orderId: Date.now() }
        }

        const response = await $fetch<{ data: { order_id: number } }>('/api/client/checkout/confirm', {
          method: 'POST',
          body: { payment_intent_id: paymentIntentId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        this.items = []
        return { orderId: response.data.order_id }
      } catch (e: any) {
        this.error = e.data?.message || 'Errore nella conferma del pagamento'
        return null
      } finally {
        this.checkoutLoading = false
      }
    }
  }
})
