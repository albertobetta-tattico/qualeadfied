export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'it',
  fallbackLocale: 'it',
  numberFormats: {
    it: {
      currency: {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
      }
    },
    en: {
      currency: {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
      }
    }
  },
  datetimeFormats: {
    it: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    },
    en: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    }
  }
}))
