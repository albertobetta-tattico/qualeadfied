/**
 * Public Form Store - Gestione form pubblico invio lead
 * Qualeadfied B2B Lead Platform
 */

import { defineStore } from 'pinia'
import type { Category, Province, PublicLeadSubmission } from '~/types/lead'

// Flag per usare mock data
const USE_MOCK_DATA = true

// ============================================
// MOCK DATA
// ============================================

const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Fotovoltaico',
    slug: 'fotovoltaico',
    description: 'Lead interessati a impianti fotovoltaici residenziali e commerciali',
    max_shares: 3,
    is_active: true,
    sort_order: 1,
    custom_fields: [
      { key: 'superficie_tetto', label: 'Superficie tetto (mq)' },
      { key: 'tipo_impianto', label: 'Tipo impianto desiderato' }
    ],
    deleted_at: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    name: 'Infissi e Serramenti',
    slug: 'infissi-serramenti',
    description: 'Lead per sostituzione infissi, serramenti e vetrate',
    max_shares: 3,
    is_active: true,
    sort_order: 2,
    custom_fields: [
      { key: 'numero_finestre', label: 'Numero finestre' },
      { key: 'materiale_preferito', label: 'Materiale preferito' }
    ],
    deleted_at: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: 3,
    name: 'Climatizzazione',
    slug: 'climatizzazione',
    description: 'Lead per impianti di condizionamento e riscaldamento',
    max_shares: 4,
    is_active: true,
    sort_order: 3,
    custom_fields: [
      { key: 'metratura_locale', label: 'Metratura locale' }
    ],
    deleted_at: null,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z'
  },
  {
    id: 4,
    name: 'Ristrutturazioni',
    slug: 'ristrutturazioni',
    description: 'Lead per lavori di ristrutturazione completa',
    max_shares: 2,
    is_active: true,
    sort_order: 4,
    custom_fields: [],
    deleted_at: null,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: 5,
    name: 'Caldaie',
    slug: 'caldaie',
    description: 'Lead per sostituzione e manutenzione caldaie',
    max_shares: 3,
    is_active: true,
    sort_order: 5,
    deleted_at: null,
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z'
  }
]

const mockProvinces: Province[] = [
  { id: 1, name: 'Milano', code: 'MI', region: 'Lombardia', is_active: true },
  { id: 2, name: 'Roma', code: 'RM', region: 'Lazio', is_active: true },
  { id: 3, name: 'Napoli', code: 'NA', region: 'Campania', is_active: true },
  { id: 4, name: 'Torino', code: 'TO', region: 'Piemonte', is_active: true },
  { id: 5, name: 'Bologna', code: 'BO', region: 'Emilia-Romagna', is_active: true }
]

interface PublicFormState {
  category: Category | null
  provinces: Province[]
  loading: boolean
  submitting: boolean
  submitted: boolean
  error: string | null
}

export const usePublicFormStore = defineStore('publicForm', {
  state: (): PublicFormState => ({
    category: null,
    provinces: [],
    loading: false,
    submitting: false,
    submitted: false,
    error: null
  }),

  getters: {
    hasCategory: (state): boolean => state.category !== null,
    categoryCustomFields: (state) => state.category?.custom_fields ?? [],
    provincesForSelect: (state): { label: string; value: number }[] =>
      state.provinces
        .filter(p => p.is_active)
        .map(p => ({ label: `${p.name} (${p.code})`, value: p.id }))
  },

  actions: {
    async fetchCategoryBySlug(slug: string) {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300))
          const category = mockCategories.find(c => c.slug === slug && c.is_active)
          this.category = category || null
          if (!category) {
            this.error = t('common.errors.notFound')
          }
          return
        }

        const { api } = useApi()
        const response = await api<{ data: Category }>(`/public/categories/${slug}`)
        this.category = response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchCategoryBySlug error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchProvinces() {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.loading = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 200))
          this.provinces = [...mockProvinces]
          return
        }

        const { api } = useApi()
        const response = await api<{ data: Province[] }>('/public/provinces')
        this.provinces = response.data
      } catch (error: any) {
        this.error = error.message || t('common.errors.loadError')
        console.error('fetchProvinces error:', error)
      } finally {
        this.loading = false
      }
    },

    async submitLead(data: PublicLeadSubmission): Promise<boolean> {
      const { $i18n } = useNuxtApp()
      const t = $i18n.t
      this.submitting = true
      this.error = null

      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 800))
          console.log('Mock lead submission:', data)
          this.submitted = true
          return true
        }

        const { api } = useApi()
        await api('/public/leads', {
          method: 'POST',
          body: data
        })
        this.submitted = true
        return true
      } catch (error: any) {
        this.error = error.message || t('common.errors.createError')
        console.error('submitLead error:', error)
        return false
      } finally {
        this.submitting = false
      }
    },

    resetForm() {
      this.submitted = false
      this.error = null
    }
  }
})
