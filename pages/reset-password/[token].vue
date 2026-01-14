<script setup lang="ts">
/**
 * Reset Password Page
 * Form per impostare nuova password con token
 */
import { usePasswordResetValidation, useAuthToast, usePasswordStrength } from '~/composables/useAuth'
import type { ResetPasswordForm } from '~/types/auth'

definePageMeta({
  layout: 'public'
})

const route = useRoute<'reset-password-token'>()
const router = useRouter()
const authStore = useAuthStore()
const { errors, validateResetPasswordForm, clearErrors } = usePasswordResetValidation()
const { showError, showSuccess } = useAuthToast()
const { getStrength } = usePasswordStrength()

// Get token from URL
const token = computed(() => String(route.params.token || ''))

// Get email from query (optional, sent by backend in link)
const email = computed(() => String(route.query.email || ''))

// Form data
const form = reactive<ResetPasswordForm>({
  email: email.value,
  token: token.value,
  password: '',
  password_confirmation: ''
})

// Update form when route changes
watch(email, (newEmail) => {
  form.email = newEmail
})

watch(token, (newToken) => {
  form.token = newToken
})

// States
const loading = computed(() => authStore.loading)
const resetComplete = ref(false)

// Password strength
const passwordStrength = computed(() => getStrength(form.password))

// Handle form submit
const handleSubmit = async () => {
  clearErrors()

  if (!validateResetPasswordForm(form)) {
    return
  }

  const success = await authStore.resetPassword(form)

  if (success) {
    resetComplete.value = true
    showSuccess('Password reimpostata con successo')
  } else {
    showError(authStore.error || 'Errore durante il reset della password')
  }
}

// Redirect to login
const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="reset-password-page">
    <div class="reset-container">
      <div class="reset-card">
        <!-- Logo -->
        <NuxtLink to="/" class="reset-logo">
          <div class="logo-icon">Q</div>
          <span class="logo-text">Qualeadfied<sup>®</sup></span>
        </NuxtLink>

        <!-- Reset Complete -->
        <div v-if="resetComplete" class="reset-complete">
          <div class="complete-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <h1 class="reset-title">Password reimpostata!</h1>
          <p class="reset-text">
            La tua password è stata aggiornata con successo.
            Ora puoi accedere con la nuova password.
          </p>
          <PrimeButton
            label="Vai al Login"
            icon="pi pi-sign-in"
            class="w-full complete-btn"
            @click="goToLogin"
          />
        </div>

        <!-- Reset Form -->
        <template v-else>
          <div class="reset-icon">
            <i class="pi pi-key"></i>
          </div>

          <h1 class="reset-title">Nuova Password</h1>
          <p class="reset-text">
            Inserisci la tua nuova password. Assicurati che sia sicura e facile da ricordare.
          </p>

          <form @submit.prevent="handleSubmit" class="reset-form">
            <!-- Email (hidden/readonly) -->
            <div v-if="email" class="form-group">
              <label for="email">Email</label>
              <PrimeInputText
                id="email"
                v-model="form.email"
                type="email"
                class="w-full"
                disabled
              />
            </div>

            <!-- New Password -->
            <div class="form-group">
              <label for="password">Nuova Password</label>
              <PrimePassword
                id="password"
                v-model="form.password"
                placeholder="Inserisci la nuova password"
                :class="{ 'p-invalid': errors.password }"
                class="w-full"
                toggleMask
                :feedback="false"
              />
              <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
              <div v-else-if="form.password" class="password-strength">
                <div class="strength-bar">
                  <div
                    class="strength-fill"
                    :class="passwordStrength.color"
                    :style="{ width: `${(passwordStrength.score / 6) * 100}%` }"
                  ></div>
                </div>
                <span :class="`strength-label text-${passwordStrength.color}`">{{ passwordStrength.label }}</span>
              </div>
              <small class="field-hint">Min. 8 caratteri, 1 maiuscola, 1 minuscola, 1 numero</small>
            </div>

            <!-- Confirm Password -->
            <div class="form-group">
              <label for="password_confirmation">Conferma Password</label>
              <PrimePassword
                id="password_confirmation"
                v-model="form.password_confirmation"
                placeholder="Ripeti la nuova password"
                :class="{ 'p-invalid': errors.password_confirmation }"
                class="w-full"
                toggleMask
                :feedback="false"
              />
              <small v-if="errors.password_confirmation" class="p-error">{{ errors.password_confirmation }}</small>
            </div>

            <PrimeButton
              type="submit"
              label="Reimposta Password"
              icon="pi pi-check"
              :loading="loading"
              class="w-full submit-btn"
            />
          </form>

          <NuxtLink to="/login" class="back-link">
            <i class="pi pi-arrow-left mr-2"></i>
            Torna al Login
          </NuxtLink>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reset-password-page {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.reset-container {
  width: 100%;
  max-width: 440px;
}

.reset-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.reset-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  margin-bottom: 2rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.logo-text sup {
  font-size: 0.65em;
  top: -0.4em;
}

.reset-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reset-icon i {
  font-size: 1.75rem;
  color: #2563eb;
}

.reset-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.75rem;
}

.reset-text {
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.reset-form {
  text-align: left;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.field-hint {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.p-error {
  display: block;
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.25rem;
}

/* Password Strength */
.password-strength {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s;
}

.strength-fill.danger {
  background: #ef4444;
}

.strength-fill.warning {
  background: #f59e0b;
}

.strength-fill.success {
  background: #22c55e;
}

.strength-label {
  font-size: 0.75rem;
}

.text-danger {
  color: #ef4444;
}

.text-warning {
  color: #f59e0b;
}

.text-success {
  color: #22c55e;
}

.submit-btn {
  background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
  border: none !important;
  height: 48px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: #64748b;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: #2563eb;
}

/* Reset Complete */
.reset-complete {
  text-align: center;
}

.complete-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.complete-icon i {
  font-size: 2.5rem;
  color: #16a34a;
}

.complete-btn {
  background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
  border: none !important;
  height: 48px;
}

/* Password field fix */
:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  width: 100%;
}
</style>
