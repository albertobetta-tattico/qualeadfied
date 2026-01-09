import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_BASE_URL
    }
  },
  cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities',
  css: [
    'primeicons/primeicons.css',
    '~/assets/scss/theme.scss',
    '~/assets/scss/overrides.scss',
    '~/assets/scss/dark-mode.scss'
  ],
  typescript: {
    typeCheck: false
  },
  modules: [
    '@primevue/nuxt-module',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/image'
  ],
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    loading: '~/components/commons/LoadingPage.vue'
  },
  primevue: {
    autoImport: true,
    dark: true,
    options: {
      ripple: false,
      theme: {
        preset: Aura
      },
      directives: {
        tooltip: true
      }
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }
})
