<script setup lang="ts">
/**
 * Page - Profile
 * User profile overview with navigation to sub-sections
 */
definePageMeta({
  layout: 'client'
})

const profileStore = useClientProfileStore()
const authStore = useAuthStore()
const { formatDate } = useClientFormatters()
const { showSuccess, showError } = useClientToast()

// Profile form
const profileForm = ref({
  first_name: '',
  last_name: '',
  phone: ''
})

// Editing state
const isEditing = ref(false)

// Fetch profile on mount
onMounted(async () => {
  await profileStore.fetchProfile()
  if (profileStore.profile) {
    profileForm.value = {
      first_name: profileStore.profile.first_name,
      last_name: profileStore.profile.last_name,
      phone: profileStore.profile.phone
    }
  }
})

// Save profile
const saveProfile = async () => {
  const success = await profileStore.updateProfile(profileForm.value)
  if (success) {
    showSuccess('Profilo aggiornato')
    isEditing.value = false
  } else {
    showError(profileStore.error || 'Errore nell\'aggiornamento')
  }
}

// Cancel editing
const cancelEdit = () => {
  if (profileStore.profile) {
    profileForm.value = {
      first_name: profileStore.profile.first_name,
      last_name: profileStore.profile.last_name,
      phone: profileStore.profile.phone
    }
  }
  isEditing.value = false
}

// Logout
const router = useRouter()
const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="profile-page">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Il Mio Profilo</h1>
        <p class="text-surface-600 dark:text-surface-400">
          Gestisci le tue informazioni personali
        </p>
      </div>
      <PrimeButton
        label="Esci"
        icon="pi pi-sign-out"
        severity="secondary"
        @click="logout"
      />
    </div>

    <!-- Loading State -->
    <div v-if="profileStore.loading" class="flex justify-center py-12">
      <PrimeProgressSpinner />
    </div>

    <div v-else-if="profileStore.profile" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Company Info (readonly) -->
        <PrimeCard>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-building text-primary"></i>
              Dati Azienda
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div>
                <p class="text-sm text-surface-500 mb-1">Email</p>
                <p class="font-medium text-surface-900 dark:text-surface-0">
                  {{ profileStore.profile.email }}
                </p>
              </div>
            </div>
            <p class="text-xs text-surface-400 mt-4">
              <i class="pi pi-info-circle mr-1"></i>
              Per modificare i dati aziendali contatta il supporto
            </p>
          </template>
        </PrimeCard>

        <!-- Personal Info (editable) -->
        <PrimeCard>
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="pi pi-user text-primary"></i>
                Dati Personali
              </div>
              <PrimeButton
                v-if="!isEditing"
                icon="pi pi-pencil"
                text
                @click="isEditing = true"
              />
            </div>
          </template>
          <template #content>
            <div v-if="isEditing" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Nome
                  </label>
                  <PrimeInputText
                    v-model="profileForm.first_name"
                    class="w-full"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Cognome
                  </label>
                  <PrimeInputText
                    v-model="profileForm.last_name"
                    class="w-full"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Telefono
                  </label>
                  <PrimeInputText
                    v-model="profileForm.phone"
                    class="w-full"
                  />
                </div>
              </div>
              <div class="flex justify-end gap-2">
                <PrimeButton
                  label="Annulla"
                  severity="secondary"
                  @click="cancelEdit"
                />
                <PrimeButton
                  label="Salva"
                  icon="pi pi-check"
                  :loading="profileStore.saving"
                  @click="saveProfile"
                />
              </div>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-surface-500 mb-1">Nome</p>
                <p class="font-medium text-surface-900 dark:text-surface-0">
                  {{ profileStore.profile.first_name }}
                </p>
              </div>
              <div>
                <p class="text-sm text-surface-500 mb-1">Cognome</p>
                <p class="font-medium text-surface-900 dark:text-surface-0">
                  {{ profileStore.profile.last_name }}
                </p>
              </div>
              <div>
                <p class="text-sm text-surface-500 mb-1">Telefono</p>
                <p class="font-medium text-surface-900 dark:text-surface-0">
                  {{ profileStore.profile.phone }}
                </p>
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-4">
        <!-- Quick Links -->
        <PrimeCard>
          <template #title>Gestione Account</template>
          <template #content>
            <div class="flex flex-col gap-2">
              <NuxtLink to="/profilo/fatturazione" class="block">
                <PrimeButton
                  label="Dati Fatturazione"
                  icon="pi pi-file-edit"
                  class="w-full"
                  severity="secondary"
                />
              </NuxtLink>
              <NuxtLink to="/profilo/sicurezza" class="block">
                <PrimeButton
                  label="Sicurezza"
                  icon="pi pi-shield"
                  class="w-full"
                  severity="secondary"
                />
              </NuxtLink>
              <NuxtLink to="/profilo/preferenze" class="block">
                <PrimeButton
                  label="Preferenze"
                  icon="pi pi-cog"
                  class="w-full"
                  severity="secondary"
                />
              </NuxtLink>
            </div>
          </template>
        </PrimeCard>

        <!-- Account Status -->
        <PrimeCard>
          <template #title>Stato Account</template>
          <template #content>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-surface-600 dark:text-surface-400">Dati fatturazione</span>
                <PrimeTag
                  :value="profileStore.hasBillingData ? 'Completi' : 'Da completare'"
                  :severity="profileStore.hasBillingData ? 'success' : 'warning'"
                  size="small"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-surface-600 dark:text-surface-400">Prova gratuita</span>
                <PrimeTag
                  :value="profileStore.hasFreeTrial ? `${profileStore.freeTrialLeadsRemaining} lead` : 'Esaurita'"
                  :severity="profileStore.hasFreeTrial ? 'info' : 'secondary'"
                  size="small"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-surface-600 dark:text-surface-400">Notifiche</span>
                <PrimeTag
                  :value="profileStore.profile.email_notifications_enabled ? 'Attive' : 'Disattive'"
                  :severity="profileStore.profile.email_notifications_enabled ? 'success' : 'secondary'"
                  size="small"
                />
              </div>
            </div>
          </template>
        </PrimeCard>

        <!-- Support -->
        <PrimeCard class="bg-surface-50 dark:bg-surface-800">
          <template #content>
            <div class="text-center">
              <i class="pi pi-headphones text-2xl text-surface-400 mb-2"></i>
              <p class="text-sm text-surface-600 dark:text-surface-400 mb-3">
                Hai bisogno di aiuto?
              </p>
              <PrimeButton
                label="Contatta Supporto"
                icon="pi pi-envelope"
                severity="secondary"
                size="small"
              />
            </div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>
