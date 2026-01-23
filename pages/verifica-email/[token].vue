<script setup lang="ts">
/**
 * Verify Email Page
 * Conferma email con token
 */
import { useAuthToast } from '~/composables/useAuth'

definePageMeta({
  layout: 'public'
})

const route = useRoute<'verifica-email-token'>()
const router = useRouter()
const authStore = useAuthStore()
const { showError, showSuccess } = useAuthToast()

// Get token from URL
const token = computed(() => String(route.params.token || ''))

// States
const verifying = ref(true)
const verified = ref(false)
const error = ref<string | null>(null)

// Verify email on mount
onMounted(async () => {
  if (!token.value) {
    error.value = 'Token di verifica mancante'
    verifying.value = false
    return
  }

  const success = await authStore.verifyEmail(token.value)

  verifying.value = false

  if (success) {
    verified.value = true
    showSuccess('Email verificata con successo!')
  } else {
    error.value = authStore.error || 'Token non valido o scaduto'
    showError(error.value)
  }
})

// Navigate to login
const goToLogin = () => {
  router.push('/')
}

// Navigate to resend
const goToResend = () => {
  router.push('/?resend=true')
}
</script>

<template>
  <div class="verify-email-page">
    <div class="verify-container">
      <div class="verify-card">
        <!-- Logo -->
        <NuxtLink to="/landing" class="verify-logo">
          <img src="/logo.png" alt="Qualeadfied" class="auth-logo-img" />
        </NuxtLink>

        <!-- Verifying State -->
        <div v-if="verifying" class="verify-loading">
          <div class="loading-spinner">
            <i class="pi pi-spin pi-spinner"></i>
          </div>
          <h2 class="verify-title">Verifica in corso...</h2>
          <p class="verify-text">Stiamo verificando il tuo indirizzo email.</p>
        </div>

        <!-- Verified State -->
        <div v-else-if="verified" class="verify-success">
          <div class="success-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <h2 class="verify-title">Email Verificata!</h2>
          <p class="verify-text">
            Il tuo account è stato attivato con successo.
            Ora puoi accedere e iniziare a utilizzare Qualeadfied.
          </p>
          <div class="verify-benefits">
            <div class="benefit">
              <i class="pi pi-gift"></i>
              <span>3 Lead Gratuiti pronti per te</span>
            </div>
            <div class="benefit">
              <i class="pi pi-search"></i>
              <span>Accesso completo al catalogo</span>
            </div>
            <div class="benefit">
              <i class="pi pi-bolt"></i>
              <span>Acquisti immediati</span>
            </div>
          </div>
          <PrimeButton
            label="Accedi al tuo Account"
            icon="pi pi-sign-in"
            class="w-full success-btn"
            @click="goToLogin"
          />
        </div>

        <!-- Error State -->
        <div v-else class="verify-error">
          <div class="error-icon">
            <i class="pi pi-times-circle"></i>
          </div>
          <h2 class="verify-title">Verifica Fallita</h2>
          <p class="verify-text">
            {{ error }}
          </p>
          <p class="verify-hint">
            Il link potrebbe essere scaduto o già utilizzato.
            Puoi richiedere un nuovo link di verifica.
          </p>
          <div class="error-actions">
            <PrimeButton
              label="Richiedi nuovo link"
              severity="secondary"
              outlined
              class="w-full"
              @click="goToResend"
            />
            <NuxtLink to="/" class="w-full">
              <PrimeButton
                label="Vai al Login"
                severity="primary"
                class="w-full"
              />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.verify-email-page {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.verify-container {
  width: 100%;
  max-width: 480px;
}

.verify-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.verify-logo {
  display: inline-block;
  text-decoration: none;
  margin-bottom: 2rem;
}

.auth-logo-img {
  height: 44px;
  width: auto;
}

.verify-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.75rem;
}

.verify-text {
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.verify-hint {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 2rem;
}

/* Loading State */
.verify-loading {
  padding: 2rem 0;
}

.loading-spinner {
  font-size: 3rem;
  color: #2563eb;
  margin-bottom: 1.5rem;
}

/* Success State */
.verify-success {
  padding: 1rem 0;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon i {
  font-size: 2.5rem;
  color: #16a34a;
}

.verify-benefits {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  text-align: left;
}

.benefit i {
  color: #2563eb;
  font-size: 1rem;
}

.benefit span {
  font-size: 0.9375rem;
  color: #374151;
}

.success-btn {
  background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
  border: none !important;
  height: 48px;
}

/* Error State */
.verify-error {
  padding: 1rem 0;
}

.error-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon i {
  font-size: 2.5rem;
  color: #dc2626;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
