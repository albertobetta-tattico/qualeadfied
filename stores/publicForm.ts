/**
 * Public Form Store - Gestione form pubblico invio lead
 * Qualeadfied B2B Lead Platform
 */

import { defineStore } from 'pinia'
import type { Category, Province, PublicLeadSubmission } from '~/types/lead'

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
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: Category }>(`${config.public.apiBase}/public/categories/${slug}`, {
          headers: {
            Accept: 'application/json'
          }
        })
        this.category = response.data
      } catch (error: any) {
        this.error = error.data?.message || error.message || t('common.errors.loadError')
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
        const client = useTypedApi()
        const { data, error } = await client.GET('/public/provinces')
        if (error) throw error
        this.provinces = (data.provinces ?? []) as unknown as Province[]
      } catch (error: any) {
        this.error = error.data?.message || error.message || t('common.errors.loadError')
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
        const client = useTypedApi()
        const { error } = await client.POST('/public/lead-submissions', {
          body: data as any
        })
        if (error) throw error
        this.submitted = true
        return true
      } catch (error: any) {
        this.error = error.data?.message || error.message || t('common.errors.createError')
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
