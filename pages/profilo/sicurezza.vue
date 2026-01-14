<script setup lang="ts">
/**
 * Page - Security
 * Password change and security settings
 */
definePageMeta({
  layout: 'client'
})

const profileStore = useClientProfileStore()
const { showSuccess, showError } = useClientToast()
const { validateForm, errors, clearErrors } = usePasswordChangeValidation()

// Password form
const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
})

// Show password toggles
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Change password
const changePassword = async () => {
  clearErrors()

  if (!validateForm(passwordForm.value)) {
    showError('Correggi gli errori nel form')
    return
  }

  const success = await profileStore.changePassword(passwordForm.value)
  if (success) {
    showSuccess('Password modificata con successo')
    // Reset form
    passwordForm.value = {
      current_password: '',
      password: '',
      password_confirmation: ''
    }
  } else {
    showError(profileStore.error || 'Errore nel cambio password')
  }
}

// Password strength
const passwordStrength = computed(() => {
  const password = passwordForm.value.password
  if (!password) return 0

  let strength = 0
  if (password.length >= 8) strength += 25
  if (/[A-Z]/.test(password)) strength += 25
  if (/[a-z]/.test(password)) strength += 25
  if (/\d/.test(password)) strength += 25

  return strength
})

const passwordStrengthColor = computed(() => {
  if (passwordStrength.value <= 25) return 'bg-red-500'
  if (passwordStrength.value <= 50) return 'bg-orange-500'
  if (passwordStrength.value <= 75) return 'bg-yellow-500'
  return 'bg-green-500'
})

const passwordStrengthLabel = computed(() => {
  if (passwordStrength.value <= 25) return 'Debole'
  if (passwordStrength.value <= 50) return 'Discreta'
  if (passwordStrength.value <= 75) return 'Buona'
  return 'Forte'
})
</script>

<template>
  <div class="security-page">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/profilo" class="inline-flex items-center gap-2 text-primary hover:underline mb-4">
        <i class="pi pi-arrow-left"></i>
        Torna al profilo
      </NuxtLink>
      <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Sicurezza</h1>
      <p class="text-surface-600 dark:text-surface-400">
        Gestisci la password e le impostazioni di sicurezza
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2">
        <PrimeCard>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-lock text-primary"></i>
              Cambia Password
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <!-- Current Password -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Password Attuale *
                </label>
                <div class="relative">
                  <PrimeInputText
                    v-model="passwordForm.current_password"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    placeholder="Inserisci la password attuale"
                    class="w-full pr-10"
                    :invalid="!!errors.current_password"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                    @click="showCurrentPassword = !showCurrentPassword"
                  >
                    <i :class="showCurrentPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                  </button>
                </div>
                <small v-if="errors.current_password" class="text-red-500">
                  {{ errors.current_password }}
                </small>
              </div>

              <!-- New Password -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Nuova Password *
                </label>
                <div class="relative">
                  <PrimeInputText
                    v-model="passwordForm.password"
                    :type="showNewPassword ? 'text' : 'password'"
                    placeholder="Inserisci la nuova password"
                    class="w-full pr-10"
                    :invalid="!!errors.password"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                    @click="showNewPassword = !showNewPassword"
                  >
                    <i :class="showNewPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                  </button>
                </div>
                <small v-if="errors.password" class="text-red-500">
                  {{ errors.password }}
                </small>

                <!-- Password Strength -->
                <div v-if="passwordForm.password" class="mt-2">
                  <div class="flex items-center gap-2 mb-1">
                    <div class="flex-grow h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                      <div
                        :class="passwordStrengthColor"
                        class="h-full transition-all duration-300"
                        :style="{ width: `${passwordStrength}%` }"
                      ></div>
                    </div>
                    <span class="text-xs text-surface-500 w-16">
                      {{ passwordStrengthLabel }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Conferma Password *
                </label>
                <div class="relative">
                  <PrimeInputText
                    v-model="passwordForm.password_confirmation"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="Conferma la nuova password"
                    class="w-full pr-10"
                    :invalid="!!errors.password_confirmation"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                  </button>
                </div>
                <small v-if="errors.password_confirmation" class="text-red-500">
                  {{ errors.password_confirmation }}
                </small>
              </div>

              <div class="flex justify-end pt-4">
                <PrimeButton
                  label="Cambia Password"
                  icon="pi pi-check"
                  :loading="profileStore.saving"
                  @click="changePassword"
                />
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-4">
        <!-- Requirements -->
        <PrimeCard>
          <template #title>Requisiti Password</template>
          <template #content>
            <ul class="space-y-2 text-sm">
              <li class="flex items-center gap-2">
                <i
                  class="pi"
                  :class="passwordForm.password.length >= 8
                    ? 'pi-check-circle text-green-500'
                    : 'pi-circle text-surface-300'"
                ></i>
                <span :class="passwordForm.password.length >= 8 ? 'text-green-700 dark:text-green-400' : 'text-surface-500'">
                  Almeno 8 caratteri
                </span>
              </li>
              <li class="flex items-center gap-2">
                <i
                  class="pi"
                  :class="/[A-Z]/.test(passwordForm.password)
                    ? 'pi-check-circle text-green-500'
                    : 'pi-circle text-surface-300'"
                ></i>
                <span :class="/[A-Z]/.test(passwordForm.password) ? 'text-green-700 dark:text-green-400' : 'text-surface-500'">
                  Una lettera maiuscola
                </span>
              </li>
              <li class="flex items-center gap-2">
                <i
                  class="pi"
                  :class="/[a-z]/.test(passwordForm.password)
                    ? 'pi-check-circle text-green-500'
                    : 'pi-circle text-surface-300'"
                ></i>
                <span :class="/[a-z]/.test(passwordForm.password) ? 'text-green-700 dark:text-green-400' : 'text-surface-500'">
                  Una lettera minuscola
                </span>
              </li>
              <li class="flex items-center gap-2">
                <i
                  class="pi"
                  :class="/\d/.test(passwordForm.password)
                    ? 'pi-check-circle text-green-500'
                    : 'pi-circle text-surface-300'"
                ></i>
                <span :class="/\d/.test(passwordForm.password) ? 'text-green-700 dark:text-green-400' : 'text-surface-500'">
                  Almeno un numero
                </span>
              </li>
            </ul>
          </template>
        </PrimeCard>

        <!-- Security Tips -->
        <PrimeCard class="bg-blue-50 dark:bg-blue-900/20">
          <template #content>
            <div class="flex items-start gap-3">
              <i class="pi pi-shield text-blue-500 mt-1"></i>
              <div>
                <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Consigli di Sicurezza
                </h4>
                <ul class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>Non riutilizzare password di altri siti</li>
                  <li>Usa un password manager</li>
                  <li>Non condividere la tua password</li>
                </ul>
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>
