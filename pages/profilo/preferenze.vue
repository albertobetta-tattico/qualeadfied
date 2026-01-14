<script setup lang="ts">
/**
 * Page - Preferences
 * Notification and marketing preferences
 */
definePageMeta({
  layout: 'client'
})

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
    showSuccess(value ? 'Notifiche email attivate' : 'Notifiche email disattivate')
  } else {
    emailNotifications.value = !value
    showError(profileStore.error || 'Errore nell\'aggiornamento')
  }
}

// Update marketing consent
const updateMarketingConsent = async (value: boolean) => {
  const success = await profileStore.updatePreferences({
    marketing_consent: value
  })

  if (success) {
    showSuccess(value ? 'Consenso marketing attivato' : 'Consenso marketing disattivato')
  } else {
    marketingConsent.value = !value
    showError(profileStore.error || 'Errore nell\'aggiornamento')
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
        Torna al profilo
      </NuxtLink>
      <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Preferenze</h1>
      <p class="text-surface-600 dark:text-surface-400">
        Gestisci le notifiche e le comunicazioni
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="profileStore.loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Email Notifications -->
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-bell text-primary"></i>
              Notifiche Email
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <div>
                  <h4 class="font-medium text-surface-900 dark:text-surface-0">
                    Notifiche sui nuovi lead
                  </h4>
                  <p class="text-sm text-surface-600 dark:text-surface-400">
                    Ricevi email quando ci sono nuovi lead nelle tue categorie di interesse
                  </p>
                </div>
                <ToggleSwitch v-model="emailNotifications" />
              </div>

              <p class="text-sm text-surface-500">
                Le notifiche includono:
              </p>
              <ul class="text-sm text-surface-600 dark:text-surface-400 space-y-2 ml-4">
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-green-500"></i>
                  Nuovi lead disponibili nelle tue categorie
                </li>
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-green-500"></i>
                  Conferme d'ordine e fatture
                </li>
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-green-500"></i>
                  Scadenza pacchetti attivi
                </li>
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-green-500"></i>
                  Aggiornamenti importanti sull'account
                </li>
              </ul>
            </div>
          </template>
        </Card>

        <!-- Marketing Consent -->
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-megaphone text-primary"></i>
              Comunicazioni Marketing
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <div>
                  <h4 class="font-medium text-surface-900 dark:text-surface-0">
                    Newsletter e promozioni
                  </h4>
                  <p class="text-sm text-surface-600 dark:text-surface-400">
                    Ricevi aggiornamenti su offerte speciali, promozioni e novità
                  </p>
                </div>
                <ToggleSwitch v-model="marketingConsent" />
              </div>

              <p class="text-sm text-surface-500">
                Le comunicazioni marketing includono:
              </p>
              <ul class="text-sm text-surface-600 dark:text-surface-400 space-y-2 ml-4">
                <li class="flex items-center gap-2">
                  <i class="pi pi-tag text-surface-400"></i>
                  Offerte e sconti esclusivi
                </li>
                <li class="flex items-center gap-2">
                  <i class="pi pi-tag text-surface-400"></i>
                  Nuovi pacchetti e funzionalità
                </li>
                <li class="flex items-center gap-2">
                  <i class="pi pi-tag text-surface-400"></i>
                  Consigli per migliorare le conversioni
                </li>
              </ul>

              <p class="text-xs text-surface-400 mt-4">
                Puoi annullare l'iscrizione in qualsiasi momento cliccando sul link presente in ogni email.
              </p>
            </div>
          </template>
        </Card>
      </div>

      <!-- Sidebar -->
      <div class="space-y-4">
        <!-- Current Status -->
        <Card>
          <template #title>Stato Attuale</template>
          <template #content>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-surface-600 dark:text-surface-400">Notifiche email</span>
                <Tag
                  :value="emailNotifications ? 'Attive' : 'Disattive'"
                  :severity="emailNotifications ? 'success' : 'secondary'"
                  size="small"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-surface-600 dark:text-surface-400">Marketing</span>
                <Tag
                  :value="marketingConsent ? 'Attivo' : 'Disattivo'"
                  :severity="marketingConsent ? 'success' : 'secondary'"
                  size="small"
                />
              </div>
            </div>
          </template>
        </Card>

        <!-- Privacy Info -->
        <Card class="bg-surface-50 dark:bg-surface-800">
          <template #content>
            <div class="flex items-start gap-3">
              <i class="pi pi-shield text-surface-400 mt-1"></i>
              <div>
                <h4 class="font-semibold text-surface-900 dark:text-surface-0 mb-1">
                  La tua privacy
                </h4>
                <p class="text-sm text-surface-600 dark:text-surface-400 mb-3">
                  I tuoi dati sono protetti e non vengono mai condivisi con terze parti per scopi di marketing.
                </p>
                <NuxtLink to="/privacy" class="text-sm text-primary hover:underline">
                  Leggi la Privacy Policy
                </NuxtLink>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
