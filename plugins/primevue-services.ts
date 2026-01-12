/**
 * PrimeVue Services Plugin
 * Registra i servizi globali di PrimeVue
 */
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'

export default defineNuxtPlugin((nuxtApp) => {
  // Registra i servizi
  nuxtApp.vueApp.use(ConfirmationService)
  nuxtApp.vueApp.use(ToastService)
  
  // Registra le direttive
  nuxtApp.vueApp.directive('tooltip', Tooltip)
})
