export const useApi = () => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase as string,
    onRequest({ options }) {
      const headers = new Headers(options.headers as HeadersInit)
      headers.set('Accept', 'application/json')
      headers.set('Content-Type', 'application/json')

      // Add auth token - check admin_token first (admin pages), then auth_token (client pages)
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token')
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
      }

      options.headers = headers
    }
  })

  return { api }
}
