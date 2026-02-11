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
const { t } = useI18n()
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
    showSuccess(t('notifications.auth.passwordResetSent'))
  } else {
    showError(authStore.error || t('notifications.auth.passwordResetError'))
  }
}

// Resend email
const resendEmail = async () => {
  const success = await authStore.forgotPassword(form)
  if (success) {
    showSuccess(t('notifications.auth.emailResent'))
  } else {
    showError(authStore.error || t('notifications.auth.sendError'))
  }
}
</script>

<template>
  <div class="forgot-password-page">
    <div class="forgot-container">
      <div class="forgot-card">
        <!-- Logo -->
        <NuxtLink to="/landing" class="forgot-logo">
          <img src="/logo.png" alt="Qualeadfied" class="auth-logo-img" />
        </NuxtLink>

        <!-- Email Sent State -->
        <div v-if="emailSent" class="email-sent">
          <div class="sent-icon">
            <i class="pi pi-envelope"></i>
          </div>
          <h1 class="forgot-title">{{ $t('auth.forgotPassword.checkEmail') }}</h1>
          <p class="forgot-text" v-html="$t('auth.forgotPassword.instructionsSent', { email: form.email })"></p>
          <p class="forgot-hint">
            {{ $t('auth.forgotPassword.linkExpiry') }}
          </p>

          <div class="sent-actions">
            <PrimeButton
              :label="$t('auth.forgotPassword.resend')"
              severity="secondary"
              outlined
              :loading="loading"
              class="w-full"
              @click="resendEmail"
            />
            <NuxtLink to="/" class="w-full">
              <PrimeButton
                :label="$t('auth.forgotPassword.backToLogin')"
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

          <h1 class="forgot-title">{{ $t('auth.forgotPassword.title') }}</h1>
          <p class="forgot-text">
            {{ $t('auth.forgotPassword.subtitle') }}
          </p>

          <form @submit.prevent="handleSubmit" class="forgot-form">
            <div class="form-group">
              <label for="email">{{ $t('common.labels.email') }}</label>
              <PrimeInputText
                id="email"
                v-model="form.email"
                type="email"
                :placeholder="$t('auth.login.emailPlaceholder')"
                :class="{ 'p-invalid': errors.email }"
                class="w-full"
                autocomplete="email"
              />
              <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
            </div>

            <PrimeButton
              type="submit"
              :label="$t('auth.forgotPassword.submit')"
              icon="pi pi-send"
              :loading="loading"
              class="w-full submit-btn"
            />
          </form>

          <NuxtLink to="/" class="back-link">
            <i class="pi pi-arrow-left mr-2"></i>
            {{ $t('auth.forgotPassword.backToLogin') }}
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
  display: inline-block;
  text-decoration: none;
  margin-bottom: 2rem;
}

.auth-logo-img {
  height: 44px;
  width: auto;
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
