<script setup lang="ts">
/**
 * Login Page
 * Form di accesso per utenti registrati
 */
import { useLoginValidation, useAuthToast } from '~/composables/useAuth'
import type { LoginForm } from '~/types/auth'

definePageMeta({
  layout: 'public'
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { errors, hasErrors, validateForm, clearErrors } = useLoginValidation()
const { showError, showSuccess } = useAuthToast()

// Form data
const form = reactive<LoginForm>({
  email: '',
  password: '',
  remember: false
})

// Loading state
const loading = computed(() => authStore.loading)

// Redirect URL after login
const redirectUrl = computed(() => {
  return (route.query.redirect as string) || '/dashboard'
})

// Handle form submit
const handleSubmit = async () => {
  clearErrors()

  if (!validateForm(form)) {
    return
  }

  const success = await authStore.login(form)

  if (success) {
    showSuccess('Accesso effettuato con successo')
    router.push(redirectUrl.value)
  } else {
    showError(authStore.error || 'Credenziali non valide')
  }
}

// Check if user is already logged in
onMounted(async () => {
  if (authStore.isLoggedIn) {
    router.push(redirectUrl.value)
  } else {
    // Try to restore session
    const restored = await authStore.checkSession()
    if (restored) {
      router.push(redirectUrl.value)
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
            <div class="logo-icon">Q</div>
            <span class="logo-text">Qualeadfied<sup>®</sup></span>
          </NuxtLink>

          <h1 class="login-title">Bentornato</h1>
          <p class="login-subtitle">Accedi al tuo account per gestire i tuoi lead</p>

          <!-- Demo credentials hint -->
          <div class="demo-hint">
            <i class="pi pi-info-circle mr-2"></i>
            <span>Demo: <strong>demo@example.com</strong> / qualsiasi password</span>
          </div>

          <form @submit.prevent="handleSubmit" class="login-form">
            <!-- Email -->
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

            <!-- Password -->
            <div class="form-group">
              <div class="flex justify-between items-center mb-2">
                <label for="password">Password</label>
                <NuxtLink to="/password-dimenticata" class="forgot-link">
                  Password dimenticata?
                </NuxtLink>
              </div>
              <PrimePassword
                id="password"
                v-model="form.password"
                placeholder="La tua password"
                :class="{ 'p-invalid': errors.password }"
                class="w-full"
                :feedback="false"
                toggleMask
                autocomplete="current-password"
              />
              <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
            </div>

            <!-- Remember me -->
            <div class="form-group-checkbox">
              <PrimeCheckbox
                id="remember"
                v-model="form.remember"
                binary
              />
              <label for="remember" class="ml-2">Ricordami</label>
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

          <!-- Register link -->
          <p class="register-link">
            Non hai un account?
            <NuxtLink to="/registrati">Registrati gratis</NuxtLink>
          </p>
        </div>
      </div>

      <!-- Right Side - Illustration -->
      <div class="login-illustration-section">
        <div class="illustration-content">
          <h2 class="illustration-title">Accedi alla tua area riservata</h2>
          <p class="illustration-text">
            Gestisci i tuoi lead, monitora gli acquisti e trova nuovi clienti qualificati.
          </p>
          <div class="illustration-features">
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>Lead verificati e di qualità</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>Consegna dati immediata</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>Supporto dedicato</span>
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
  min-height: calc(100vh - 72px);
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  margin-bottom: 2.5rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: #2D2D2D;
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
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #525252;
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

.forgot-link {
  font-size: 0.875rem;
  color: #2D2D2D;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.form-group-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-group-checkbox label {
  font-size: 0.875rem;
  color: #64748b;
  cursor: pointer;
}

.login-btn {
  background: #2D2D2D !important;
  border: none !important;
  height: 48px;
  font-size: 1rem;
}

.login-btn:hover {
  background: #3D3D3D !important;
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
  color: #2D2D2D;
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
  background: #2D2D2D;
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
  color: white;
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
