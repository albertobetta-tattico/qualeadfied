<script setup lang="ts">
/**
 * Page - Billing Data
 * Manage billing information for invoicing
 */
definePageMeta({
  layout: 'client'
})

const profileStore = useClientProfileStore()
const { showSuccess, showError } = useClientToast()
const { validateForm, errors, clearErrors } = useBillingValidation()

// Billing form
const billingForm = ref({
  billing_address: '',
  billing_city: '',
  billing_province: '',
  billing_zip: '',
  billing_country: 'IT',
  sdi_code: '',
  pec_email: ''
})

// Fetch profile on mount
onMounted(async () => {
  await profileStore.fetchProfile()
  if (profileStore.profile) {
    billingForm.value = {
      billing_address: profileStore.profile.billing_address || '',
      billing_city: profileStore.profile.billing_city || '',
      billing_province: profileStore.profile.billing_province || '',
      billing_zip: profileStore.profile.billing_zip || '',
      billing_country: profileStore.profile.billing_country || 'IT',
      sdi_code: profileStore.profile.sdi_code || '',
      pec_email: profileStore.profile.pec_email || ''
    }
  }
})

// Save billing data
const saveBillingData = async () => {
  clearErrors()

  if (!validateForm(billingForm.value)) {
    showError('Correggi gli errori nel form')
    return
  }

  const success = await profileStore.updateBilling(billingForm.value)
  if (success) {
    showSuccess('Dati fatturazione aggiornati')
  } else {
    showError(profileStore.error || 'Errore nell\'aggiornamento')
  }
}
</script>

<template>
  <div class="billing-page">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/profilo" class="inline-flex items-center gap-2 text-primary hover:underline mb-4">
        <i class="pi pi-arrow-left"></i>
        Torna al profilo
      </NuxtLink>
      <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Dati di Fatturazione</h1>
      <p class="text-surface-600 dark:text-surface-400">
        Gestisci i dati per la fatturazione elettronica
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="profileStore.loading" class="flex justify-center py-12">
      <PrimeProgressSpinner />
    </div>

    <div v-else-if="profileStore.profile" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2">
        <PrimeCard>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-file-edit text-primary"></i>
              Indirizzo di Fatturazione
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Company info (readonly) -->
              <div class="md:col-span-2 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg mb-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-surface-500 mb-1">Ragione Sociale</p>
                    <p class="font-medium text-surface-900 dark:text-surface-0">
                      {{ profileStore.profile.company_name }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-surface-500 mb-1">Partita IVA</p>
                    <p class="font-medium text-surface-900 dark:text-surface-0">
                      {{ profileStore.profile.vat_number }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Billing Address -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Indirizzo *
                </label>
                <PrimeInputText
                  v-model="billingForm.billing_address"
                  placeholder="Via, numero civico"
                  class="w-full"
                  :invalid="!!errors.billing_address"
                />
                <small v-if="errors.billing_address" class="text-red-500">
                  {{ errors.billing_address }}
                </small>
              </div>

              <!-- City -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Città *
                </label>
                <PrimeInputText
                  v-model="billingForm.billing_city"
                  placeholder="Città"
                  class="w-full"
                  :invalid="!!errors.billing_city"
                />
                <small v-if="errors.billing_city" class="text-red-500">
                  {{ errors.billing_city }}
                </small>
              </div>

              <!-- Province -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Provincia *
                </label>
                <PrimeInputText
                  v-model="billingForm.billing_province"
                  placeholder="MI"
                  maxlength="2"
                  class="w-full uppercase"
                  :invalid="!!errors.billing_province"
                />
                <small v-if="errors.billing_province" class="text-red-500">
                  {{ errors.billing_province }}
                </small>
              </div>

              <!-- ZIP -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  CAP *
                </label>
                <PrimeInputText
                  v-model="billingForm.billing_zip"
                  placeholder="20100"
                  maxlength="5"
                  class="w-full"
                  :invalid="!!errors.billing_zip"
                />
                <small v-if="errors.billing_zip" class="text-red-500">
                  {{ errors.billing_zip }}
                </small>
              </div>

              <!-- Country -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Paese
                </label>
                <PrimeInputText
                  v-model="billingForm.billing_country"
                  disabled
                  class="w-full"
                />
              </div>
            </div>
          </template>
        </PrimeCard>

        <!-- Electronic Invoicing -->
        <PrimeCard class="mt-6">
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-send text-primary"></i>
              Fatturazione Elettronica
            </div>
          </template>
          <template #content>
            <p class="text-sm text-surface-600 dark:text-surface-400 mb-4">
              Inserisci il Codice SDI oppure l'indirizzo PEC per la ricezione delle fatture elettroniche.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- SDI Code -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Codice SDI
                </label>
                <PrimeInputText
                  v-model="billingForm.sdi_code"
                  placeholder="ABC1234"
                  maxlength="7"
                  class="w-full uppercase"
                  :invalid="!!errors.sdi_code"
                />
                <small v-if="errors.sdi_code" class="text-red-500">
                  {{ errors.sdi_code }}
                </small>
                <small v-else class="text-surface-400">
                  7 caratteri alfanumerici
                </small>
              </div>

              <!-- PEC Email -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Email PEC
                </label>
                <PrimeInputText
                  v-model="billingForm.pec_email"
                  placeholder="azienda@pec.it"
                  class="w-full"
                  :invalid="!!errors.pec_email"
                />
                <small v-if="errors.pec_email" class="text-red-500">
                  {{ errors.pec_email }}
                </small>
              </div>
            </div>

            <div class="flex justify-end mt-6">
              <PrimeButton
                label="Salva Modifiche"
                icon="pi pi-check"
                :loading="profileStore.saving"
                @click="saveBillingData"
              />
            </div>
          </template>
        </PrimeCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-4">
        <!-- Info Card -->
        <PrimeCard class="bg-blue-50 dark:bg-blue-900/20">
          <template #content>
            <div class="flex items-start gap-3">
              <i class="pi pi-info-circle text-blue-500 mt-1"></i>
              <div>
                <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Fatturazione Elettronica
                </h4>
                <p class="text-sm text-blue-700 dark:text-blue-300">
                  Le fatture vengono emesse e inviate elettronicamente al Sistema di Interscambio (SDI) dell'Agenzia delle Entrate.
                </p>
              </div>
            </div>
          </template>
        </PrimeCard>

        <!-- Help -->
        <PrimeCard>
          <template #title>Aiuto</template>
          <template #content>
            <div class="space-y-3 text-sm">
              <div>
                <p class="font-medium text-surface-900 dark:text-surface-0">Cos'è il Codice SDI?</p>
                <p class="text-surface-600 dark:text-surface-400">
                  È il codice univoco che identifica il canale di ricezione delle fatture elettroniche.
                </p>
              </div>
              <div>
                <p class="font-medium text-surface-900 dark:text-surface-0">Non ho il Codice SDI</p>
                <p class="text-surface-600 dark:text-surface-400">
                  Puoi usare l'indirizzo PEC della tua azienda come alternativa.
                </p>
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>
