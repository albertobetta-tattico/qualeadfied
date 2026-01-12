export const useApi = () => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase as string,
    onRequest({ options }) {
      // Aggiungi headers dinamici (es. auth token)
      const headers = new Headers(options.headers as HeadersInit)
      headers.set('Accept', 'application/json')
      headers.set('Content-Type', 'application/json')
      options.headers = headers
    }
  })

  return { api }
}
