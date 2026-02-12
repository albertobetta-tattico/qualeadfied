<script setup lang="ts">
/**
 * Page - Preferences
 * Notification and marketing preferences
 */
definePageMeta({
  layout: 'client'
})

const { t } = useI18n()
const profileStore = useClientProfileStore()
const { showSuccess, showError } = useClientToast()

// Preferences form
const emailNotifications = ref(true)
const marketingConsent = ref(false)

// Fetch profile on mount
onMounted(async () => {
  await profileStore.fetchProfile()
  if (profileStore.profile) {
    emailNotifications.value = profileStore.profile.email_notifications_enabled
    marketingConsent.value = profileStore.profile.marketing_consent
  }
})

// Update email notifications
const updateEmailNotifications = async (value: boolean) => {
  const success = await profileStore.updatePreferences({
    email_notifications_enabled: value
  })

  if (success) {
    showSuccess(value ? t('profile.preferences.toast.emailEnabled') : t('profile.preferences.toast.emailDisabled'))
  } else {
    emailNotifications.value = !value
    showError(profileStore.error || t('profile.toast.errorUpdating'))
  }
}

// Update marketing consent
const updateMarketingConsent = async (value: boolean) => {
  const success = await profileStore.updatePreferences({
    marketing_consent: value
  })

  if (success) {
    showSuccess(value ? t('profile.preferences.toast.marketingEnabled') : t('profile.preferences.toast.marketingDisabled'))
  } else {
    marketingConsent.value = !value
    showError(profileStore.error || t('profile.toast.errorUpdating'))
  }
}

// Watch for changes
watch(emailNotifications, (newValue, oldValue) => {
  if (newValue !== oldValue && profileStore.profile) {
    updateEmailNotifications(newValue)
  }
})

watch(marketingConsent, (newValue, oldValue) => {
  if (newValue !== oldValue && profileStore.profile) {
    updateMarketingConsent(newValue)
  }
})
</script>

<template>
  <div class="preferences-page">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/profilo" class="inline-flex items-center gap-2 text-primary hover:underline mb-4">
        <i class="pi pi-arrow-left"></i>
        {{ $t('profile.preferences.backToProfile') }}
      </NuxtLink>
      <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ $t('profile.preferences.title') }}</h1>
      <p class="text-surface-600 dark:text-surface-400">
        {{ $t('profile.preferences.subtitle') }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="profileStore.loading" class="flex justify-center py-12">
      <PrimeProgressSpinner />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Email Notifications -->
        <PrimeCard>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-bell text-primary"></i>
              {{ $t('profile.preferences.emailNotifications.title') }}
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <div>
                  <h4 class="font-medium text-surface-900 dark:text-surface-0">
                    {{ $t('profile.preferences.emailNotifications.toggle') }}
                  </h4>
                  <p class="text-sm text-surface-600 dark:text-surface-400">
                    {{ $t('profile.preferences.emailNotifications.description') }}
                  </p>
                </div>
                <ToggleSwitch v-model="emailNotifications" />
              </div>

              <p class="text-sm text-surface-500">
                {{ $t('profile.preferences.emailNotifications.includes') }}
              </p>
              <ul class="text-sm text-surface-600 dark:text-surface-400 space-y-2 ml-4">
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-green-500"></i>
                  {{ $t('profile.preferences.emailNotifications.newLeads') }}
                </li>
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-green-500"></i>
                  {{ $t('profile.preferences.emailNotifications.orderConfirmations') }}
                </li>
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-green-500"></i>
                  {{ $t('profile.preferences.emailNotifications.packageExpiry') }}
                </li>
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-green-500"></i>
                  {{ $t('profile.preferences.emailNotifications.accountUpdates') }}
                </li>
              </ul>
            </div>
          </template>
        </PrimeCard>

        <!-- Marketing Consent -->
        <PrimeCard>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-megaphone text-primary"></i>
              {{ $t('profile.preferences.marketing.title') }}
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <div>
                  <h4 class="font-medium text-surface-900 dark:text-surface-0">
                    {{ $t('profile.preferences.marketing.toggle') }}
                  </h4>
                  <p class="text-sm text-surface-600 dark:text-surface-400">
                    {{ $t('profile.preferences.marketing.description') }}
                  </p>
                </div>
                <ToggleSwitch v-model="marketingConsent" />
              </div>

              <p class="text-sm text-surface-500">
                {{ $t('profile.preferences.marketing.includes') }}
              </p>
              <ul class="text-sm text-surface-600 dark:text-surface-400 space-y-2 ml-4">
                <li class="flex items-center gap-2">
                  <i class="pi pi-tag text-surface-400"></i>
                  {{ $t('profile.preferences.marketing.offers') }}
                </li>
                <li class="flex items-center gap-2">
                  <i class="pi pi-tag text-surface-400"></i>
                  {{ $t('profile.preferences.marketing.newPackages') }}
                </li>
                <li class="flex items-center gap-2">
                  <i class="pi pi-tag text-surface-400"></i>
                  {{ $t('profile.preferences.marketing.conversionTips') }}
                </li>
              </ul>

              <p class="text-xs text-surface-400 mt-4">
                {{ $t('profile.preferences.marketing.unsubscribeNote') }}
              </p>
            </div>
          </template>
        </PrimeCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-4">
        <!-- Current Status -->
        <PrimeCard>
          <template #title>{{ $t('profile.preferences.currentStatus.title') }}</template>
          <template #content>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-surface-600 dark:text-surface-400">{{ $t('profile.accountStatus.notificationsEmail') }}</span>
                <PrimeTag
                  :value="emailNotifications ? $t('profile.accountStatus.notificationsActive') : $t('profile.accountStatus.notificationsInactive')"
                  :severity="emailNotifications ? 'success' : 'secondary'"
                  size="small"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-surface-600 dark:text-surface-400">{{ $t('profile.accountStatus.marketing') }}</span>
                <PrimeTag
                  :value="marketingConsent ? $t('profile.accountStatus.marketingActive') : $t('profile.accountStatus.marketingInactive')"
                  :severity="marketingConsent ? 'success' : 'secondary'"
                  size="small"
                />
              </div>
            </div>
          </template>
        </PrimeCard>

        <!-- Privacy Info -->
        <PrimeCard class="bg-surface-50 dark:bg-surface-800">
          <template #content>
            <div class="flex items-start gap-3">
              <i class="pi pi-shield text-surface-400 mt-1"></i>
              <div>
                <h4 class="font-semibold text-surface-900 dark:text-surface-0 mb-1">
                  {{ $t('profile.preferences.privacy.title') }}
                </h4>
                <p class="text-sm text-surface-600 dark:text-surface-400 mb-3">
                  {{ $t('profile.preferences.privacy.description') }}
                </p>
                <NuxtLink to="/privacy" class="text-sm text-primary hover:underline">
                  {{ $t('profile.preferences.privacy.readPolicy') }}
                </NuxtLink>
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>
