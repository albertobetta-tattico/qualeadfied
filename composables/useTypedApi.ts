import createClient from 'openapi-fetch'
import type { paths } from '~/types/api.generated'

export const useTypedApi = () => {
  const config = useRuntimeConfig()

  const client = createClient<paths>({
    baseUrl: config.public.apiBase as string,
  })

  client.use({
    onRequest({ request }) {
      request.headers.set('Accept', 'application/json')

      if (typeof window !== 'undefined') {
        // Scegli il token in base al target dell'API, non all'ordine in
        // localStorage. Senza questa logica, se l'utente ha fatto il login
        // sia come admin che come client (o viceversa) i token coesistono
        // in localStorage e ogni richiesta — anche quelle del lato client —
        // partiva firmata col token sbagliato (es. admin), causando 401
        // sull'API /cart o esclusioni errate su /public/leads.
        const url = request.url || ''
        const isAdminEndpoint = /\/api\/admin(\/|\?|$)/.test(url)
        const adminToken = localStorage.getItem('admin_token')
        const authToken = localStorage.getItem('auth_token')
        const token = isAdminEndpoint
          ? (adminToken || authToken)
          : (authToken || adminToken)
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      }

      return request
    },
  })

  return client
}
