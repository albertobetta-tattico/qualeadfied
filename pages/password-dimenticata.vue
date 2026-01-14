<script setup lang="ts">
/**
 * Forgot Password Page
 * Richiesta reset password via email
 */
import { usePasswordResetValidation, useAuthToast } from '~/composables/useAuth'
import type { ForgotPasswordForm } from '~/types/auth'

definePageMeta({
  layout: 'public'
})

const authStore = useAuthStore()
const { errors, validateForgotPasswordForm, clearErrors } = usePasswordResetValidation()
const { showError, showSuccess } = useAuthToast()

// Form data
const form = reactive<ForgotPasswordForm>({
  email: ''
})

// States
const loading = computed(() => authStore.loading)
const emailSent = ref(false)

// Handle form submit
const handleSubmit = async () => {
  clearErrors()

  if (!validateForgotPasswordForm(form)) {
    return
  }

  const success = await authStore.forgotPassword(form)

  if (success) {
    emailSent.value = true
    showSuccess('Email inviata con successo')
  } else {
    showError(authStore.error || 'Errore durante l\'invio dell\'email')
  }
}

// Resend email
const resendEmail = async () => {
  const success = await authStore.forgotPassword(form)
  if (success) {
    showSuccess('Email inviata nuovamente')
  } else {
    showError(authStore.error || 'Errore durante l\'invio')
  }
}
</script>

<template>
  <div class="forgot-password-page">
    <div class="forgot-container">
      <div class="forgot-card">
        <!-- Logo -->
        <NuxtLink to="/" class="forgot-logo">
          <div class="logo-icon">Q</div>
          <span class="logo-text">Qualeadfied<sup>®</sup></span>
        </NuxtLink>

        <!-- Email Sent State -->
        <div v-if="emailSent" class="email-sent">
          <div class="sent-icon">
            <i class="pi pi-envelope"></i>
          </div>
          <h1 class="forgot-title">Controlla la tua email</h1>
          <p class="forgot-text">
            Abbiamo inviato le istruzioni per il reset della password a
            <strong>{{ form.email }}</strong>
          </p>
          <p class="forgot-hint">
            Il link scadrà tra 60 minuti. Se non ricevi l'email, controlla la cartella spam.
          </p>

          <div class="sent-actions">
            <PrimeButton
              label="Invia di nuovo"
              severity="secondary"
              outlined
              :loading="loading"
              class="w-full"
              @click="resendEmail"
            />
            <NuxtLink to="/login" class="w-full">
              <PrimeButton
                label="Torna al Login"
                severity="primary"
                class="w-full"
              />
            </NuxtLink>
          </div>
        </div>

        <!-- Request Form -->
        <template v-else>
          <div class="forgot-icon">
            <i class="pi pi-lock"></i>
          </div>

          <h1 class="forgot-title">Password dimenticata?</h1>
          <p class="forgot-text">
            Inserisci l'email associata al tuo account e ti invieremo le istruzioni per reimpostare la password.
          </p>

          <form @submit.prevent="handleSubmit" class="forgot-form">
            <div class="form-group">
              <label for="email">Email</label>
              <PrimeInputText
                id="email"
                v-model="form.email"
                type="email"
                placeholder="nome@azienda.it"
                :class="{ 'p-invalid': errors.email }"
                class="w-full"
                autocomplete="email"
              />
              <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
            </div>

            <PrimeButton
              type="submit"
              label="Invia Istruzioni"
              icon="pi pi-send"
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
.forgot-password-page {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.forgot-container {
  width: 100%;
  max-width: 440px;
}

.forgot-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.forgot-logo {
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

.forgot-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.forgot-icon i {
  font-size: 1.75rem;
  color: #2563eb;
}

.forgot-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.75rem;
}

.forgot-text {
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.forgot-hint {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 2rem;
}

.forgot-form {
  text-align: left;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.p-error {
  display: block;
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.25rem;
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

/* Email Sent State */
.email-sent {
  text-align: center;
}

.sent-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sent-icon i {
  font-size: 2.5rem;
  color: #16a34a;
}

.sent-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
