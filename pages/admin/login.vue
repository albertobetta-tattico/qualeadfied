<script setup lang="ts">
/**
 * Admin Login Page
 * Form di accesso per amministratori
 */
import type { AdminLoginForm } from '~/types/auth'

definePageMeta({
  layout: 'public'
})

const { t } = useI18n()
const router = useRouter()
const adminAuthStore = useAdminAuthStore()

// Form data
const form = reactive<AdminLoginForm>({
  email: '',
  password: ''
})

// Validation errors
const errors = reactive<{ email: string; password: string }>({
  email: '',
  password: ''
})

// Loading state
const loading = computed(() => adminAuthStore.loading)

// Validate form
const validateForm = (): boolean => {
  let valid = true
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email obbligatoria'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email non valida'
    valid = false
  }

  if (!form.password) {
    errors.password = 'Password obbligatoria'
    valid = false
  }

  return valid
}

// Handle form submit
const handleSubmit = async () => {
  if (!validateForm()) return

  const success = await adminAuthStore.login(form)

  if (success) {
    router.push('/admin')
  }
}

// Check if admin is already logged in
onMounted(async () => {
  if (adminAuthStore.isLoggedIn) {
    router.push('/admin')
  } else {
    const restored = await adminAuthStore.checkSession()
    if (restored) {
      router.push('/admin')
    }
  }
})
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left Side - Form -->
      <div class="login-form-section">
        <div class="login-form-wrapper">
          <!-- Logo -->
          <NuxtLink to="/" class="login-logo">
            <img src="/logo.png" alt="Qualeadfied" class="auth-logo-img" />
          </NuxtLink>

          <h1 class="login-title">Pannello di Amministrazione</h1>
          <p class="login-subtitle">Accedi con le tue credenziali admin</p>

          <!-- Credentials hint -->
          <div class="demo-hint">
            <i class="pi pi-shield mr-2"></i>
            <span>Accesso riservato agli amministratori</span>
          </div>

          <!-- Error message -->
          <div v-if="adminAuthStore.error" class="error-banner">
            <i class="pi pi-exclamation-triangle mr-2"></i>
            <span>{{ adminAuthStore.error }}</span>
          </div>

          <form @submit.prevent="handleSubmit" class="login-form">
            <!-- Email -->
            <div class="form-group">
              <label for="email">Email</label>
              <PrimeInputText
                id="email"
                v-model="form.email"
                type="email"
                placeholder="admin@qualeadfied.com"
                :class="{ 'p-invalid': errors.email }"
                class="w-full"
                autocomplete="email"
              />
              <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
            </div>

            <!-- Password -->
            <div class="form-group">
              <label for="password">Password</label>
              <PrimePassword
                id="password"
                v-model="form.password"
                placeholder="Inserisci la password"
                :class="{ 'p-invalid': errors.password }"
                class="w-full"
                :feedback="false"
                toggleMask
                autocomplete="current-password"
              />
              <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
            </div>

            <!-- Submit Button -->
            <PrimeButton
              type="submit"
              label="Accedi"
              icon="pi pi-sign-in"
              :loading="loading"
              class="w-full login-btn"
            />
          </form>

          <!-- Back to site link -->
          <p class="register-link">
            <NuxtLink to="/">
              <i class="pi pi-arrow-left mr-1"></i>
              Torna al sito
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Right Side - Illustration -->
      <div class="login-illustration-section admin-illustration">
        <div class="illustration-content">
          <h2 class="illustration-title">Gestisci la tua piattaforma</h2>
          <p class="illustration-text">
            Accedi al pannello di amministrazione per gestire clienti, lead, ordini e configurazioni del sistema.
          </p>
          <div class="illustration-features">
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>Gestione completa clienti e lead</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>Monitoraggio ordini e fatturazione</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>Report e analytics in tempo reale</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f8fafc;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

@media (max-width: 968px) {
  .login-container {
    grid-template-columns: 1fr;
  }
}

/* Form Section */
.login-form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: white;
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
}

.login-logo {
  display: block;
  text-decoration: none;
  margin-bottom: 2.5rem;
}

.auth-logo-img {
  height: 44px;
  width: auto;
}

.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.demo-hint {
  background: #f0f4ff;
  border: 1px solid #c7d2fe;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #4338ca;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #dc2626;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.login-form {
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

.login-btn {
  background: #1e293b !important;
  border: none !important;
  height: 48px;
  font-size: 1rem;
}

.login-btn:hover {
  background: #334155 !important;
}

.p-error {
  display: block;
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.25rem;
}

.register-link {
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
}

.register-link a {
  color: #1e293b;
  font-weight: 500;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

/* Illustration Section */
.login-illustration-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: #1e293b;
}

.admin-illustration {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

@media (max-width: 968px) {
  .login-illustration-section {
    display: none;
  }
}

.illustration-content {
  max-width: 400px;
  color: white;
}

.illustration-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  color: white;
}

.illustration-text {
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.illustration-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.feature-item i {
  color: #60a5fa;
  font-size: 1.25rem;
}

.feature-item span {
  font-size: 1rem;
  opacity: 0.95;
}

/* Password field fix */
:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  width: 100%;
}
</style>
