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
        const token = localStorage.getItem('auth_token')
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      }

      return request
    },
  })

  return client
}
