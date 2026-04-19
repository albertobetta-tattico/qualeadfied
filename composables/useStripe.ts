import { loadStripe, type Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

/**
 * Composable for initializing Stripe.js singleton
 * Loads Stripe with the publishable key from runtime config
 */
export const useStripe = () => {
  const config = useRuntimeConfig()

  const getStripe = (): Promise<Stripe | null> => {
    if (!stripePromise) {
      const publicKey = config.public.stripePublicKey as string
      if (!publicKey) {
        console.error('[useStripe] NUXT_PUBLIC_STRIPE_PUBLIC_KEY is not configured')
        return Promise.resolve(null)
      }
      stripePromise = loadStripe(publicKey)
    }
    return stripePromise
  }

  return { getStripe }
}
