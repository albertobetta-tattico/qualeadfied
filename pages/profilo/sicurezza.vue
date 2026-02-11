<script setup lang="ts">
/**
 * Page - Security
 * Password change and security settings
 */
definePageMeta({
  layout: 'client'
})

const { t } = useI18n()
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
    showError(t('profile.security.toast.errorFormValidation'))
    return
  }

  const success = await profileStore.changePassword(passwordForm.value)
  if (success) {
    showSuccess(t('profile.security.toast.passwordChanged'))
    // Reset form
    passwordForm.value = {
      current_password: '',
      password: '',
      password_confirmation: ''
    }
  } else {
    showError(profileStore.error || t('profile.security.toast.errorChanging'))
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
  if (passwordStrength.value <= 25) return t('profile.security.strength.weak')
  if (passwordStrength.value <= 50) return t('profile.security.strength.fair')
  if (passwordStrength.value <= 75) return t('profile.security.strength.good')
  return t('profile.security.strength.strong')
})
</script>

<template>
  <div class="security-page">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/profilo" class="inline-flex items-center gap-2 text-primary hover:underline mb-4">
        <i class="pi pi-arrow-left"></i>
        {{ $t('profile.security.backToProfile') }}
      </NuxtLink>
      <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ $t('profile.security.title') }}</h1>
      <p class="text-surface-600 dark:text-surface-400">
        {{ $t('profile.security.subtitle') }}
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2">
        <PrimeCard>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-lock text-primary"></i>
              {{ $t('profile.security.changePassword.title') }}
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <!-- Current Password -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  {{ $t('profile.security.changePassword.currentPassword') }} *
                </label>
                <div class="relative">
                  <PrimeInputText
                    v-model="passwordForm.current_password"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    :placeholder="$t('profile.security.changePassword.currentPasswordPlaceholder')"
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
                  {{ $t('profile.security.changePassword.newPassword') }} *
                </label>
                <div class="relative">
                  <PrimeInputText
                    v-model="passwordForm.password"
                    :type="showNewPassword ? 'text' : 'password'"
                    :placeholder="$t('profile.security.changePassword.newPasswordPlaceholder')"
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
                  {{ $t('profile.security.changePassword.confirmPassword') }} *
                </label>
                <div class="relative">
                  <PrimeInputText
                    v-model="passwordForm.password_confirmation"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :placeholder="$t('profile.security.changePassword.confirmPasswordPlaceholder')"
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
                  :label="$t('profile.security.changePassword.submit')"
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
          <template #title>{{ $t('profile.security.requirements.title') }}</template>
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
                  {{ $t('profile.security.requirements.minLength') }}
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
                  {{ $t('profile.security.requirements.uppercase') }}
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
                  {{ $t('profile.security.requirements.lowercase') }}
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
                  {{ $t('profile.security.requirements.number') }}
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
                  {{ $t('profile.security.tips.title') }}
                </h4>
                <ul class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>{{ $t('profile.security.tips.noReuse') }}</li>
                  <li>{{ $t('profile.security.tips.useManager') }}</li>
                  <li>{{ $t('profile.security.tips.noShare') }}</li>
                </ul>
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>
