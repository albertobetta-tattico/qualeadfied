/**
 * Auth Middleware
 * Verifica che l'utente sia autenticato prima di accedere alle pagine protette
 * 
 * TODO: Implementare la logica di autenticazione reale con Laravel Sanctum
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // Per ora, il middleware è un placeholder
  // La logica di autenticazione sarà implementata con l'integrazione backend
  
  // TODO: Verificare token di autenticazione
  // const { isAuthenticated } = useAuth()
  // if (!isAuthenticated.value) {
  //   return navigateTo('/')
  // }
  
  // Temporaneamente permettiamo l'accesso
  return
})
