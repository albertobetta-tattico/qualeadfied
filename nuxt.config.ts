// https://nuxt.com/docs/api/configuration/nuxt-config
import QualeadfiedPreset from './assets/styles/primevue-theme'

export default defineNuxtConfig({
  // ============================================
  // CORE CONFIGURATION
  // ============================================
  devtools: { enabled: true },

  ssr: false, // SPA mode

  compatibilityDate: '2024-11-01',

  // ============================================
  // TYPESCRIPT
  // ============================================
  typescript: {
    strict: true,
    typeCheck: true
  },

  // ============================================
  // APP CONFIGURATION
  // ============================================
  app: {
    head: {
      title: 'Qualeadfied - Admin',
      htmlAttrs: {
        lang: 'it'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Qualeadfied - Piattaforma di vendita lead qualificati B2B' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // Google Fonts - Inter & Montserrat
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'
        }
      ]
    }
  },

  // ============================================
  // MODULES
  // ============================================
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  // ============================================
  // PRIMEVUE CONFIGURATION
  // ============================================
  primevue: {
    usePrimeVue: true,

    // Theme configuration
    options: {
      theme: {
        preset: QualeadfiedPreset,
        options: {
          prefix: 'p',
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities'
          }
        }
      },
      ripple: true,
      inputVariant: 'outlined'
    },

    // Auto-import components
    components: {
      prefix: 'Prime',
      include: '*'
    },

    // Auto-import composables
    composables: {
      include: '*'
    },

    // Auto-import directives
    directives: {
      include: '*'
    }
  },

  // ============================================
  // TAILWIND CSS
  // ============================================
  tailwindcss: {
    cssPath: '~/assets/styles/tailwind.css',
    configPath: 'tailwind.config.ts',
    exposeConfig: true,
    viewer: true
  },

  // ============================================
  // PINIA (State Management)
  // ============================================
  pinia: {
    storesDirs: ['./stores/**']
  },

  // ============================================
  // CSS
  // ============================================
  css: [
    'primeicons/primeicons.css',
    '~/assets/styles/main.scss'
  ],

  // ============================================
  // VITE CONFIGURATION
  // ============================================
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: `@use "@/assets/styles/_variables" as *;`
        }
      }
    }
  },

  // ============================================
  // RUNTIME CONFIG
  // ============================================
  runtimeConfig: {
    // Private keys (server-side only)
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,

    // Public keys (exposed to client)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api',
      stripePublicKey: process.env.NUXT_PUBLIC_STRIPE_PUBLIC_KEY,
      appName: 'Qualeadfied'
    }
  },

  // ============================================
  // EXPERIMENTAL FEATURES
  // ============================================
  experimental: {
    typedPages: true
  },

  // ============================================
  // IMPORTS
  // ============================================
  imports: {
    dirs: [
      'composables/**',
      'utils/**'
    ]
  },

  // ============================================
  // COMPONENTS
  // ============================================
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ]
})
