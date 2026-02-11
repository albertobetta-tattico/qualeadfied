<script setup lang="ts">
/**
 * Page - Billing Data
 * Manage billing information for invoicing
 */
definePageMeta({
  layout: 'client'
})

const { t } = useI18n()
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
    showError(t('profile.billing.toast.errorFormValidation'))
    return
  }

  const success = await profileStore.updateBilling(billingForm.value)
  if (success) {
    showSuccess(t('profile.billing.toast.billingUpdated'))
  } else {
    showError(profileStore.error || t('profile.billing.toast.errorUpdating'))
  }
}
</script>

<template>
  <div class="billing-page">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/profilo" class="inline-flex items-center gap-2 text-primary hover:underline mb-4">
        <i class="pi pi-arrow-left"></i>
        {{ $t('profile.billing.backToProfile') }}
      </NuxtLink>
      <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ $t('profile.billing.title') }}</h1>
      <p class="text-surface-600 dark:text-surface-400">
        {{ $t('profile.billing.subtitle') }}
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
              {{ $t('profile.billing.addressTitle') }}
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Company info (readonly) -->
              <div class="md:col-span-2 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg mb-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-surface-500 mb-1">{{ $t('profile.billing.companyName') }}</p>
                    <p class="font-medium text-surface-900 dark:text-surface-0">
                      {{ profileStore.profile.company_name }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-surface-500 mb-1">{{ $t('profile.billing.vatNumber') }}</p>
                    <p class="font-medium text-surface-900 dark:text-surface-0">
                      {{ profileStore.profile.vat_number }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Billing Address -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  {{ $t('profile.billing.address') }} *
                </label>
                <PrimeInputText
                  v-model="billingForm.billing_address"
                  :placeholder="$t('profile.billing.addressPlaceholder')"
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
                  {{ $t('profile.billing.city') }} *
                </label>
                <PrimeInputText
                  v-model="billingForm.billing_city"
                  :placeholder="$t('profile.billing.cityPlaceholder')"
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
                  {{ $t('profile.billing.province') }} *
                </label>
                <PrimeInputText
                  v-model="billingForm.billing_province"
                  :placeholder="$t('profile.billing.provincePlaceholder')"
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
                  {{ $t('profile.billing.zip') }} *
                </label>
                <PrimeInputText
                  v-model="billingForm.billing_zip"
                  :placeholder="$t('profile.billing.zipPlaceholder')"
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
                  {{ $t('profile.billing.country') }}
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
              {{ $t('profile.billing.electronicInvoicing.title') }}
            </div>
          </template>
          <template #content>
            <p class="text-sm text-surface-600 dark:text-surface-400 mb-4">
              {{ $t('profile.billing.electronicInvoicing.description') }}
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- SDI Code -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  {{ $t('profile.billing.electronicInvoicing.sdiCode') }}
                </label>
                <PrimeInputText
                  v-model="billingForm.sdi_code"
                  :placeholder="$t('profile.billing.electronicInvoicing.sdiCodePlaceholder')"
                  maxlength="7"
                  class="w-full uppercase"
                  :invalid="!!errors.sdi_code"
                />
                <small v-if="errors.sdi_code" class="text-red-500">
                  {{ errors.sdi_code }}
                </small>
                <small v-else class="text-surface-400">
                  {{ $t('profile.billing.electronicInvoicing.sdiCodeHelp') }}
                </small>
              </div>

              <!-- PEC Email -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  {{ $t('profile.billing.electronicInvoicing.pecEmail') }}
                </label>
                <PrimeInputText
                  v-model="billingForm.pec_email"
                  :placeholder="$t('profile.billing.electronicInvoicing.pecEmailPlaceholder')"
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
                :label="$t('profile.billing.saveChanges')"
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
                  {{ $t('profile.billing.infoTitle') }}
                </h4>
                <p class="text-sm text-blue-700 dark:text-blue-300">
                  {{ $t('profile.billing.infoDescription') }}
                </p>
              </div>
            </div>
          </template>
        </PrimeCard>

        <!-- Help -->
        <PrimeCard>
          <template #title>{{ $t('profile.billing.help.title') }}</template>
          <template #content>
            <div class="space-y-3 text-sm">
              <div>
                <p class="font-medium text-surface-900 dark:text-surface-0">{{ $t('profile.billing.help.whatIsSdi') }}</p>
                <p class="text-surface-600 dark:text-surface-400">
                  {{ $t('profile.billing.help.sdiDescription') }}
                </p>
              </div>
              <div>
                <p class="font-medium text-surface-900 dark:text-surface-0">{{ $t('profile.billing.help.noSdi') }}</p>
                <p class="text-surface-600 dark:text-surface-400">
                  {{ $t('profile.billing.help.noSdiDescription') }}
                </p>
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>
