/**
 * Client-area auth gate (global middleware, client-only, SPA mode).
 *
 * Runs on every navigation. If the page declares `layout: 'client'` (the
 * authenticated client area) and there is no token in localStorage, redirect
 * to /login *before* the layout mounts. With a token we let the page render
 * — `useAuthStore.checkSession()` will then validate it in the background.
 *
 * We deliberately do NOT call /auth/me here, because a network blip or
 * transient 5xx must not trigger a logout. Only a real 401 from /auth/me
 * (handled in the auth store) wipes the token.
 */
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  if (to.meta?.layout !== 'client') return

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  if (!token) {
    return navigateTo('/login?redirect=' + encodeURIComponent(to.fullPath))
  }
})
