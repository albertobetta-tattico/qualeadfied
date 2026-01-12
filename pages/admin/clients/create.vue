<script setup lang="ts">
/**
 * Admin Clients - Create New Client
 * Form per la creazione di un nuovo cliente B2B
 */
import { useClientValidation, useClientForm, useClientActions } from '~/composables/useClient'
import type { ClientCreateForm, BillingData } from '~/types/client'

definePageMeta({
  layout: 'admin'
})

// Store & Composables
const clientStore = useClientStore()
const router = useRouter()
const { errors, hasErrors, validateField, validateForm, clearErrors } = useClientValidation()
const { showSuccess, showError } = useClientActions()

// Form State
const form = reactive<ClientCreateForm>({
  company_name: '',
  vat_number: '',
  email: '',
  phone: '',
  contact_first_name: '',
  contact_last_name: '',
  password: '',
  password_confirmation: '',
  status: 'active',
  free_trial_enabled: true,
  free_trial_leads_total: 3,
  billing_data: {
    address: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'IT',
    sdi_code: '',
    pec: ''
  },
  notify_new_leads: true
})

// Status options
const statusOptions = [
  { label: 'Attivo', value: 'active' },
  { label: 'In Attesa', value: 'pending' },
  { label: 'Sospeso', value: 'suspended' }
]

// Province options (Italian provinces)
const provinceOptions = [
  'AG', 'AL', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AT', 'AV', 'BA', 'BG', 'BI', 'BL', 'BN', 'BO',
  'BR', 'BS', 'BT', 'BZ', 'CA', 'CB', 'CE', 'CH', 'CL', 'CN', 'CO', 'CR', 'CS', 'CT', 'CZ',
  'EN', 'FC', 'FE', 'FG', 'FI', 'FM', 'FR', 'GE', 'GO', 'GR', 'IM', 'IS', 'KR', 'LC', 'LE',
  'LI', 'LO', 'LT', 'LU', 'MB', 'MC', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NA', 'NO', 'NU',
  'OR', 'PA', 'PC', 'PD', 'PE', 'PG', 'PI', 'PN', 'PO', 'PR', 'PT', 'PU', 'PV', 'PZ', 'RA',
  'RC', 'RE', 'RG', 'RI', 'RM', 'RN', 'RO', 'SA', 'SI', 'SO', 'SP', 'SR', 'SS', 'SU', 'SV',
  'TA', 'TE', 'TN', 'TO', 'TP', 'TR', 'TS', 'TV', 'UD', 'VA', 'VB', 'VC', 'VE', 'VI', 'VR', 'VT', 'VV'
].map(p => ({ label: p, value: p }))

// Validation on blur
const onBlur = (field: string, value: any, extra?: any) => {
  validateField(field, value, extra)
}

// Submit form
const onSubmit = async () => {
  clearErrors()
  
  if (!validateForm(form, true)) {
    showError('Correggi gli errori nel form prima di procedere')
    return
  }

  const client = await clientStore.createClient(form)
  
  if (client) {
    showSuccess(`Cliente "${client.company_name}" creato con successo`)
    router.push('/admin/clients')
  } else {
    showError(clientStore.error || 'Errore nella creazione del cliente')
  }
}

// Cancel and go back
const onCancel = () => {
  router.push('/admin/clients')
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-left">
        <div class="flex items-center gap-4 mb-2">
          <PrimeButton
            icon="pi pi-arrow-left"
            severity="secondary"
            text
            rounded
            @click="onCancel"
          />
          <h1 class="page-title mb-0">Nuovo Cliente</h1>
        </div>
        <p class="page-subtitle ml-12">Inserisci i dati per creare un nuovo cliente B2B</p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Company Information Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-building mr-2 text-primary-500"></i>
            Dati Aziendali
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Company Name -->
            <div class="form-group">
              <label for="company_name">Ragione Sociale *</label>
              <PrimeInputText
                id="company_name"
                v-model="form.company_name"
                :class="{ 'p-invalid': errors.company_name }"
                placeholder="Es. Azienda Srl"
                class="w-full"
                @blur="onBlur('company_name', form.company_name)"
              />
              <small v-if="errors.company_name" class="p-error">{{ errors.company_name }}</small>
            </div>

            <!-- VAT Number -->
            <div class="form-group">
              <label for="vat_number">Partita IVA *</label>
              <PrimeInputText
                id="vat_number"
                v-model="form.vat_number"
                :class="{ 'p-invalid': errors.vat_number }"
                placeholder="Es. 12345678901"
                class="w-full"
                @blur="onBlur('vat_number', form.vat_number)"
              />
              <small v-if="errors.vat_number" class="p-error">{{ errors.vat_number }}</small>
              <small v-else class="form-hint">11 cifre, senza prefisso IT</small>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email">Email *</label>
              <PrimeInputText
                id="email"
                v-model="form.email"
                type="email"
                :class="{ 'p-invalid': errors.email }"
                placeholder="email@azienda.it"
                class="w-full"
                @blur="onBlur('email', form.email)"
              />
              <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
            </div>

            <!-- Phone -->
            <div class="form-group">
              <label for="phone">Telefono *</label>
              <PrimeInputText
                id="phone"
                v-model="form.phone"
                :class="{ 'p-invalid': errors.phone }"
                placeholder="Es. 02 1234567"
                class="w-full"
                @blur="onBlur('phone', form.phone)"
              />
              <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Person Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-user mr-2 text-primary-500"></i>
            Persona di Riferimento
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- First Name -->
            <div class="form-group">
              <label for="contact_first_name">Nome *</label>
              <PrimeInputText
                id="contact_first_name"
                v-model="form.contact_first_name"
                :class="{ 'p-invalid': errors.contact_first_name }"
                placeholder="Mario"
                class="w-full"
                @blur="onBlur('contact_first_name', form.contact_first_name)"
              />
              <small v-if="errors.contact_first_name" class="p-error">{{ errors.contact_first_name }}</small>
            </div>

            <!-- Last Name -->
            <div class="form-group">
              <label for="contact_last_name">Cognome *</label>
              <PrimeInputText
                id="contact_last_name"
                v-model="form.contact_last_name"
                :class="{ 'p-invalid': errors.contact_last_name }"
                placeholder="Rossi"
                class="w-full"
                @blur="onBlur('contact_last_name', form.contact_last_name)"
              />
              <small v-if="errors.contact_last_name" class="p-error">{{ errors.contact_last_name }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Credentials Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-lock mr-2 text-primary-500"></i>
            Credenziali di Accesso
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Password -->
            <div class="form-group">
              <label for="password">Password *</label>
              <PrimePassword
                id="password"
                v-model="form.password"
                :class="{ 'p-invalid': errors.password }"
                :feedback="true"
                toggleMask
                class="w-full"
                inputClass="w-full"
                @blur="onBlur('password', form.password, true)"
              />
              <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
              <small v-else class="form-hint">Minimo 8 caratteri, una maiuscola, una minuscola e un numero</small>
            </div>

            <!-- Password Confirmation -->
            <div class="form-group">
              <label for="password_confirmation">Conferma Password *</label>
              <PrimePassword
                id="password_confirmation"
                v-model="form.password_confirmation"
                :class="{ 'p-invalid': errors.password_confirmation }"
                :feedback="false"
                toggleMask
                class="w-full"
                inputClass="w-full"
                @blur="onBlur('password_confirmation', form.password_confirmation, form.password)"
              />
              <small v-if="errors.password_confirmation" class="p-error">{{ errors.password_confirmation }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Billing Data Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-file mr-2 text-primary-500"></i>
            Dati di Fatturazione
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Address -->
            <div class="form-group md:col-span-2">
              <label for="address">Indirizzo</label>
              <PrimeInputText
                id="address"
                v-model="form.billing_data.address"
                placeholder="Via Roma, 1"
                class="w-full"
              />
            </div>

            <!-- City -->
            <div class="form-group">
              <label for="city">Città</label>
              <PrimeInputText
                id="city"
                v-model="form.billing_data.city"
                placeholder="Milano"
                class="w-full"
              />
            </div>

            <!-- Province -->
            <div class="form-group">
              <label for="province">Provincia</label>
              <PrimeSelect
                id="province"
                v-model="form.billing_data.province"
                :options="provinceOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleziona..."
                class="w-full"
                :filter="true"
                filterPlaceholder="Cerca provincia..."
              />
            </div>

            <!-- Postal Code -->
            <div class="form-group">
              <label for="postal_code">CAP</label>
              <PrimeInputText
                id="postal_code"
                v-model="form.billing_data.postal_code"
                :class="{ 'p-invalid': errors.postal_code }"
                placeholder="20100"
                class="w-full"
                maxlength="5"
                @blur="onBlur('postal_code', form.billing_data.postal_code)"
              />
              <small v-if="errors.postal_code" class="p-error">{{ errors.postal_code }}</small>
            </div>

            <!-- Country -->
            <div class="form-group">
              <label for="country">Paese</label>
              <PrimeInputText
                id="country"
                v-model="form.billing_data.country"
                placeholder="IT"
                class="w-full"
                disabled
              />
            </div>

            <!-- SDI Code -->
            <div class="form-group">
              <label for="sdi_code">Codice SDI</label>
              <PrimeInputText
                id="sdi_code"
                v-model="form.billing_data.sdi_code"
                :class="{ 'p-invalid': errors.sdi_code }"
                placeholder="XXXXXXX"
                class="w-full"
                maxlength="7"
                @blur="onBlur('sdi_code', form.billing_data.sdi_code)"
              />
              <small v-if="errors.sdi_code" class="p-error">{{ errors.sdi_code }}</small>
              <small v-else class="form-hint">7 caratteri alfanumerici</small>
            </div>

            <!-- PEC -->
            <div class="form-group">
              <label for="pec">PEC</label>
              <PrimeInputText
                id="pec"
                v-model="form.billing_data.pec"
                :class="{ 'p-invalid': errors.pec }"
                placeholder="azienda@pec.it"
                class="w-full"
                @blur="onBlur('pec', form.billing_data.pec)"
              />
              <small v-if="errors.pec" class="p-error">{{ errors.pec }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-cog mr-2 text-primary-500"></i>
            Impostazioni Account
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Status -->
            <div class="form-group">
              <label for="status">Stato Account</label>
              <PrimeSelect
                id="status"
                v-model="form.status"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              />
            </div>

            <!-- Free Trial Leads -->
            <div class="form-group">
              <label for="free_trial_leads">Lead Prova Gratuita</label>
              <PrimeInputNumber
                id="free_trial_leads"
                v-model="form.free_trial_leads_total"
                :min="0"
                :max="100"
                :disabled="!form.free_trial_enabled"
                class="w-full"
              />
            </div>

            <!-- Free Trial Toggle -->
            <div class="form-group flex items-center gap-3">
              <PrimeToggleSwitch
                id="free_trial_enabled"
                v-model="form.free_trial_enabled"
              />
              <label for="free_trial_enabled" class="cursor-pointer mb-0">
                Abilita prova gratuita
              </label>
            </div>

            <!-- Notify New Leads -->
            <div class="form-group flex items-center gap-3">
              <PrimeToggleSwitch
                id="notify_new_leads"
                v-model="form.notify_new_leads"
              />
              <label for="notify_new_leads" class="cursor-pointer mb-0">
                Notifiche nuovi lead
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-4 pt-4 border-t border-neutral-200">
        <PrimeButton
          type="button"
          label="Annulla"
          severity="secondary"
          outlined
          @click="onCancel"
        />
        <PrimeButton
          type="submit"
          label="Crea Cliente"
          icon="pi pi-check"
          severity="primary"
          :loading="clientStore.saving"
          :disabled="hasErrors"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-hint {
  display: block;
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.p-error {
  display: block;
  font-size: 0.75rem;
  color: #dc3545;
  margin-top: 0.25rem;
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  width: 100%;
}

:deep(.p-inputnumber) {
  width: 100%;
}

:deep(.p-inputnumber-input) {
  width: 100%;
}
</style>
