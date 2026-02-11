<script setup lang="ts">
/**
 * Registration Page
 * Form di registrazione nuovo cliente B2B
 */
import { useRegisterValidation, useAuthToast, usePasswordStrength } from '~/composables/useAuth'
import type { RegisterForm } from '~/types/auth'
import type { Category } from '~/types/catalog'

definePageMeta({
  layout: 'public'
})

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const catalogStore = useCatalogStore()
const { errors, hasErrors, validateField, validateForm, clearErrors } = useRegisterValidation()
const { showError, showSuccess, showInfo } = useAuthToast()
const { getStrength } = usePasswordStrength()

// Categories
const categories = computed(() => catalogStore.categories.filter(c => c.is_active))

// Form data
const form = reactive<RegisterForm>({
  company_name: '',
  vat_number: '',
  email: '',
  phone: '',
  first_name: '',
  last_name: '',
  password: '',
  password_confirmation: '',
  terms_accepted: false,
  privacy_accepted: false,
  marketing_consent: false,
  category_ids: []
})

// Step state (for multi-step form)
const currentStep = ref(1)
const totalSteps = 3

// Loading state
const loading = computed(() => authStore.loading)

// Password strength
const passwordStrength = computed(() => getStrength(form.password))

// Registration complete
const registrationComplete = ref(false)

// Step validation
const canProceedStep1 = computed(() => {
  return form.company_name.length >= 2 && form.vat_number.length >= 11
})

const canProceedStep2 = computed(() => {
  return form.email && form.phone && form.first_name && form.last_name
})

const canProceedStep3 = computed(() => {
  return form.password.length >= 8 && form.password === form.password_confirmation &&
         form.terms_accepted && form.privacy_accepted
})

// Navigate steps
const nextStep = () => {
  if (currentStep.value === 1) {
    const companyValid = validateField('company_name', form.company_name)
    const vatValid = validateField('vat_number', form.vat_number)
    if (companyValid && vatValid) {
      currentStep.value = 2
    }
  } else if (currentStep.value === 2) {
    const emailValid = validateField('email', form.email)
    const phoneValid = validateField('phone', form.phone)
    const firstNameValid = validateField('first_name', form.first_name)
    const lastNameValid = validateField('last_name', form.last_name)
    if (emailValid && phoneValid && firstNameValid && lastNameValid) {
      currentStep.value = 3
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Handle form submit
const handleSubmit = async () => {
  clearErrors()

  if (!validateForm(form)) {
    showError(t('auth.register.fixErrors'))
    return
  }

  const success = await authStore.register(form)

  if (success) {
    registrationComplete.value = true
    showSuccess(t('notifications.auth.registerSuccess'))
  } else {
    showError(authStore.error || t('notifications.auth.registerError'))
  }
}

// Format VAT number as user types
const formatVatNumber = (event: Event) => {
  const input = event.target as HTMLInputElement

  let value = input.value.replace(/[^0-9]/g, '')

  // Limit to 11 digits
  if (value.length > 11) {
    value = value.slice(0, 11)
  }

  form.vat_number = value
}

// Check if user is already logged in & load categories
onMounted(async () => {
  if (authStore.isLoggedIn) {
    router.push('/dashboard')
  }
  // Load categories for selection
  if (catalogStore.categories.length === 0) {
    await catalogStore.fetchCategories()
  }
})
</script>

<template>
  <div class="register-page">
    <div class="register-container">
      <!-- Left Side - Form -->
      <div class="register-form-section">
        <div class="register-form-wrapper">
          <!-- Logo -->
          <NuxtLink to="/landing" class="register-logo">
            <img src="/logo.png" alt="Qualeadfied" class="auth-logo-img" />
          </NuxtLink>

          <!-- Registration Complete -->
          <div v-if="registrationComplete" class="registration-complete">
            <div class="complete-icon">
              <i class="pi pi-envelope"></i>
            </div>
            <h2 class="complete-title">{{ $t('auth.register.checkEmail') }}</h2>
            <p class="complete-text" v-html="$t('auth.register.emailSentText', { email: form.email })"></p>
            <div class="complete-actions">
              <NuxtLink to="/">
                <PrimeButton
                  :label="$t('auth.register.goToLogin')"
                  severity="primary"
                  class="w-full"
                />
              </NuxtLink>
            </div>
            <p class="complete-note">
              {{ $t('auth.register.noEmailReceived') }}
              <a href="#" @click.prevent="showInfo(t('notifications.auth.emailResent'))">{{ $t('auth.register.resend') }}</a>
            </p>
          </div>

          <!-- Registration Form -->
          <template v-else>
            <h1 class="register-title">{{ $t('auth.register.title') }}</h1>
            <p class="register-subtitle">{{ $t('auth.register.subtitle') }}</p>

            <!-- Progress Steps -->
            <div class="steps-indicator">
              <div
                v-for="step in totalSteps"
                :key="step"
                class="step-dot"
                :class="{ 'active': step === currentStep, 'completed': step < currentStep }"
              >
                <i v-if="step < currentStep" class="pi pi-check"></i>
                <span v-else>{{ step }}</span>
              </div>
            </div>

            <form @submit.prevent="handleSubmit" class="register-form">
              <!-- Step 1: Company Data -->
              <div v-show="currentStep === 1" class="form-step">
                <h3 class="step-title">{{ $t('auth.register.step1Title') }}</h3>

                <div class="form-group">
                  <label for="company_name">{{ $t('auth.register.companyName') }}</label>
                  <PrimeInputText
                    id="company_name"
                    v-model="form.company_name"
                    :placeholder="$t('auth.register.companyNamePlaceholder')"
                    :class="{ 'p-invalid': errors.company_name }"
                    class="w-full"
                  />
                  <small v-if="errors.company_name" class="p-error">{{ errors.company_name }}</small>
                </div>

                <div class="form-group">
                  <label for="vat_number">{{ $t('auth.register.vatNumber') }}</label>
                  <PrimeInputText
                    id="vat_number"
                    v-model="form.vat_number"
                    placeholder="12345678901"
                    :class="{ 'p-invalid': errors.vat_number }"
                    class="w-full"
                    maxlength="11"
                    @input="formatVatNumber"
                  />
                  <small v-if="errors.vat_number" class="p-error">{{ errors.vat_number }}</small>
                  <small v-else class="field-hint">{{ $t('auth.register.vatHint') }}</small>
                </div>

                <PrimeButton
                  type="button"
                  :label="$t('common.actions.continue')"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  class="w-full step-btn"
                  @click="nextStep"
                />
              </div>

              <!-- Step 2: Contact Data -->
              <div v-show="currentStep === 2" class="form-step">
                <h3 class="step-title">{{ $t('auth.register.step2Title') }}</h3>

                <div class="form-row">
                  <div class="form-group">
                    <label for="first_name">{{ $t('auth.register.firstName') }}</label>
                    <PrimeInputText
                      id="first_name"
                      v-model="form.first_name"
                      :placeholder="$t('auth.register.firstNamePlaceholder')"
                      :class="{ 'p-invalid': errors.first_name }"
                      class="w-full"
                    />
                    <small v-if="errors.first_name" class="p-error">{{ errors.first_name }}</small>
                  </div>

                  <div class="form-group">
                    <label for="last_name">{{ $t('auth.register.lastName') }}</label>
                    <PrimeInputText
                      id="last_name"
                      v-model="form.last_name"
                      :placeholder="$t('auth.register.lastNamePlaceholder')"
                      :class="{ 'p-invalid': errors.last_name }"
                      class="w-full"
                    />
                    <small v-if="errors.last_name" class="p-error">{{ errors.last_name }}</small>
                  </div>
                </div>

                <div class="form-group">
                  <label for="email">{{ $t('auth.register.email') }}</label>
                  <PrimeInputText
                    id="email"
                    v-model="form.email"
                    type="email"
                    :placeholder="$t('auth.register.emailPlaceholder')"
                    :class="{ 'p-invalid': errors.email }"
                    class="w-full"
                  />
                  <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
                </div>

                <div class="form-group">
                  <label for="phone">{{ $t('auth.register.phone') }}</label>
                  <PrimeInputText
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    :placeholder="$t('auth.register.phonePlaceholder')"
                    :class="{ 'p-invalid': errors.phone }"
                    class="w-full"
                  />
                  <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
                </div>

                <!-- Categories Selection -->
                <div class="form-group">
                  <label for="category_ids">
                    <i class="pi pi-tags mr-1"></i>
                    {{ $t('auth.register.categoriesOfInterest') }}
                  </label>
                  <PrimeMultiSelect
                    id="category_ids"
                    v-model="form.category_ids"
                    :options="categories"
                    optionLabel="name"
                    optionValue="id"
                    :placeholder="$t('auth.register.categoriesPlaceholder')"
                    class="w-full"
                    display="chip"
                    :filter="true"
                    :filterPlaceholder="$t('auth.register.searchCategory')"
                  />
                  <small class="field-hint">
                    {{ $t('auth.register.categoriesHint') }}
                  </small>
                </div>

                <div class="form-buttons">
                  <PrimeButton
                    type="button"
                    :label="$t('common.actions.back')"
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    outlined
                    @click="prevStep"
                  />
                  <PrimeButton
                    type="button"
                    :label="$t('common.actions.continue')"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    class="step-btn"
                    @click="nextStep"
                  />
                </div>
              </div>

              <!-- Step 3: Password & Consent -->
              <div v-show="currentStep === 3" class="form-step">
                <h3 class="step-title">{{ $t('auth.register.step3Title') }}</h3>

                <div class="form-group">
                  <label for="password">{{ $t('auth.register.password') }}</label>
                  <PrimePassword
                    id="password"
                    v-model="form.password"
                    :placeholder="$t('auth.register.passwordPlaceholder')"
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
                    <span :class="`text-${passwordStrength.color}`">{{ passwordStrength.label }}</span>
                  </div>
                  <small class="field-hint">{{ $t('auth.register.passwordHint') }}</small>
                </div>

                <div class="form-group">
                  <label for="password_confirmation">{{ $t('auth.register.confirmPassword') }}</label>
                  <PrimePassword
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    :placeholder="$t('auth.register.confirmPasswordPlaceholder')"
                    :class="{ 'p-invalid': errors.password_confirmation }"
                    class="w-full"
                    toggleMask
                    :feedback="false"
                  />
                  <small v-if="errors.password_confirmation" class="p-error">{{ errors.password_confirmation }}</small>
                </div>

                <!-- Consents -->
                <div class="consents-section">
                  <div class="consent-item" :class="{ 'error': errors.terms_accepted }">
                    <PrimeCheckbox
                      id="terms"
                      v-model="form.terms_accepted"
                      binary
                    />
                    <label for="terms" v-html="$t('auth.register.acceptTerms')"></label>
                  </div>
                  <small v-if="errors.terms_accepted" class="p-error">{{ errors.terms_accepted }}</small>

                  <div class="consent-item" :class="{ 'error': errors.privacy_accepted }">
                    <PrimeCheckbox
                      id="privacy"
                      v-model="form.privacy_accepted"
                      binary
                    />
                    <label for="privacy" v-html="$t('auth.register.acceptPrivacy')"></label>
                  </div>
                  <small v-if="errors.privacy_accepted" class="p-error">{{ errors.privacy_accepted }}</small>

                  <div class="consent-item">
                    <PrimeCheckbox
                      id="marketing"
                      v-model="form.marketing_consent"
                      binary
                    />
                    <label for="marketing">
                      {{ $t('auth.register.marketingConsent') }}
                    </label>
                  </div>
                </div>

                <div class="form-buttons">
                  <PrimeButton
                    type="button"
                    :label="$t('common.actions.back')"
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    outlined
                    @click="prevStep"
                  />
                  <PrimeButton
                    type="submit"
                    :label="$t('auth.register.submit')"
                    icon="pi pi-check"
                    :loading="loading"
                    class="step-btn"
                  />
                </div>
              </div>
            </form>

            <!-- Login link -->
            <p class="login-link">
              {{ $t('auth.register.hasAccount') }}
              <NuxtLink to="/">{{ $t('auth.register.login') }}</NuxtLink>
            </p>
          </template>
        </div>
      </div>

      <!-- Right Side - Benefits -->
      <div class="register-benefits-section">
        <div class="benefits-content">
          <h2 class="benefits-title">{{ $t('auth.register.whyRegister') }}</h2>

          <div class="benefits-list">
            <div class="benefit-item">
              <div class="benefit-icon">
                <i class="pi pi-gift"></i>
              </div>
              <div class="benefit-text">
                <h4>{{ $t('auth.register.benefit1Title') }}</h4>
                <p>{{ $t('auth.register.benefit1Text') }}</p>
              </div>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon">
                <i class="pi pi-verified"></i>
              </div>
              <div class="benefit-text">
                <h4>{{ $t('auth.register.benefit2Title') }}</h4>
                <p>{{ $t('auth.register.benefit2Text') }}</p>
              </div>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon">
                <i class="pi pi-bolt"></i>
              </div>
              <div class="benefit-text">
                <h4>{{ $t('auth.register.benefit3Title') }}</h4>
                <p>{{ $t('auth.register.benefit3Text') }}</p>
              </div>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon">
                <i class="pi pi-shield"></i>
              </div>
              <div class="benefit-text">
                <h4>{{ $t('auth.register.benefit4Title') }}</h4>
                <p>{{ $t('auth.register.benefit4Text') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  background: #f8fafc;
}

.register-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: calc(100vh - 72px);
}

@media (max-width: 968px) {
  .register-container {
    grid-template-columns: 1fr;
  }
}

/* Form Section */
.register-form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: white;
}

.register-form-wrapper {
  width: 100%;
  max-width: 440px;
}

.register-logo {
  display: block;
  text-decoration: none;
  margin-bottom: 2rem;
}

.auth-logo-img {
  height: 44px;
  width: auto;
}

.register-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.register-subtitle {
  color: #64748b;
  margin-bottom: 1.5rem;
}

/* Steps Indicator */
.steps-indicator {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  background: #e2e8f0;
  color: #64748b;
  transition: all 0.3s;
}

.step-dot.active {
  background: #2D2D2D;
  color: white;
}

.step-dot.completed {
  background: #22c55e;
  color: white;
}

/* Form */
.register-form {
  margin-bottom: 1.5rem;
}

.form-step {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.step-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1.25rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.text-danger {
  color: #ef4444;
  font-size: 0.75rem;
}

.text-warning {
  color: #f59e0b;
  font-size: 0.75rem;
}

.text-success {
  color: #22c55e;
  font-size: 0.75rem;
}

/* Consents */
.consents-section {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.consent-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.consent-item.error {
  color: #dc2626;
}

.consent-item label {
  font-size: 0.875rem;
  color: #64748b;
  cursor: pointer;
  line-height: 1.4;
}

.consent-item a {
  color: #0F3460;
  text-decoration: none;
}

.consent-item a:hover {
  text-decoration: underline;
}

/* Form Buttons */
.form-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.form-buttons > * {
  flex: 1;
}

.step-btn {
  background: #2D2D2D !important;
  border: none !important;
}

.login-link {
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
}

.login-link a {
  color: #0F3460;
  font-weight: 500;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

/* Registration Complete */
.registration-complete {
  text-align: center;
  padding: 2rem 0;
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

.complete-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1rem;
}

.complete-text {
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.complete-actions {
  margin-bottom: 1.5rem;
}

.complete-note {
  font-size: 0.875rem;
  color: #94a3b8;
}

.complete-note a {
  color: #0F3460;
  text-decoration: none;
}

.complete-note a:hover {
  text-decoration: underline;
}

/* Benefits Section */
.register-benefits-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: #2D2D2D;
}

@media (max-width: 968px) {
  .register-benefits-section {
    display: none;
  }
}

.benefits-content {
  max-width: 400px;
  color: white;
}

.benefits-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: white;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.benefit-item {
  display: flex;
  gap: 1rem;
}

.benefit-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.benefit-icon i {
  font-size: 1.25rem;
  color: white;
}

.benefit-text h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: white;
}

.benefit-text p {
  font-size: 0.875rem;
  opacity: 0.85;
  line-height: 1.5;
}

/* Password field fix */
:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  width: 100%;
}
</style>
