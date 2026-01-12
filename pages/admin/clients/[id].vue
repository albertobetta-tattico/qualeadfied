<script setup lang="ts">
/**
 * Admin Clients - Edit Client
 * Form per la modifica di un cliente B2B esistente
 */
import { useClientValidation, useClientFormatters, useClientActions } from '~/composables/useClient'
import type { ClientUpdateForm, FreeTrialConfig } from '~/types/client'

definePageMeta({
  layout: 'admin'
})

// Route & Store
const route = useRoute()
const router = useRouter()
const clientStore = useClientStore()
const { errors, hasErrors, validateField, validateForm, clearErrors } = useClientValidation()
const { formatStatus, getStatusSeverity, formatDate, formatDateTime, getFreeTrialRemaining, getFreeTrialProgress } = useClientFormatters()
const { confirmSuspend, confirmResetPassword, showSuccess, showError } = useClientActions()

// Get client ID from route
const clientId = computed(() => {
  const params = route.params as { id: string }
  return Number(params.id)
})

// Loading state
const initialLoading = ref(true)

// Form State
const form = reactive<ClientUpdateForm>({
  company_name: '',
  vat_number: '',
  email: '',
  phone: '',
  contact_first_name: '',
  contact_last_name: '',
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

// Current client
const client = computed(() => clientStore.currentClient)

// Active tab
const activeTab = ref(0)

// Status options
const statusOptions = [
  { label: 'Attivo', value: 'active' },
  { label: 'In Attesa', value: 'pending' },
  { label: 'Sospeso', value: 'suspended' }
]

// Province options
const provinceOptions = [
  'AG', 'AL', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AT', 'AV', 'BA', 'BG', 'BI', 'BL', 'BN', 'BO',
  'BR', 'BS', 'BT', 'BZ', 'CA', 'CB', 'CE', 'CH', 'CL', 'CN', 'CO', 'CR', 'CS', 'CT', 'CZ',
  'EN', 'FC', 'FE', 'FG', 'FI', 'FM', 'FR', 'GE', 'GO', 'GR', 'IM', 'IS', 'KR', 'LC', 'LE',
  'LI', 'LO', 'LT', 'LU', 'MB', 'MC', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NA', 'NO', 'NU',
  'OR', 'PA', 'PC', 'PD', 'PE', 'PG', 'PI', 'PN', 'PO', 'PR', 'PT', 'PU', 'PV', 'PZ', 'RA',
  'RC', 'RE', 'RG', 'RI', 'RM', 'RN', 'RO', 'SA', 'SI', 'SO', 'SP', 'SR', 'SS', 'SU', 'SV',
  'TA', 'TE', 'TN', 'TO', 'TP', 'TR', 'TS', 'TV', 'UD', 'VA', 'VB', 'VC', 'VE', 'VI', 'VR', 'VT', 'VV'
].map(p => ({ label: p, value: p }))

// Load client data
const loadClient = async () => {
  initialLoading.value = true
  await clientStore.fetchClient(clientId.value)
  
  if (client.value) {
    // Populate form with client data
    form.company_name = client.value.company_name
    form.vat_number = client.value.vat_number
    form.email = client.value.email
    form.phone = client.value.phone
    form.contact_first_name = client.value.contact_first_name
    form.contact_last_name = client.value.contact_last_name
    form.status = client.value.status
    form.free_trial_enabled = client.value.free_trial_enabled
    form.free_trial_leads_total = client.value.free_trial_leads_total
    form.billing_data = client.value.billing_data || {
      address: '',
      city: '',
      province: '',
      postal_code: '',
      country: 'IT',
      sdi_code: '',
      pec: ''
    }
    form.notify_new_leads = client.value.notify_new_leads
  }
  
  initialLoading.value = false
}

// Validation on blur
const onBlur = (field: string, value: any, extra?: any) => {
  validateField(field, value, extra)
}

// Submit form
const onSubmit = async () => {
  clearErrors()
  
  if (!validateForm(form, false)) {
    showError('Correggi gli errori nel form prima di procedere')
    return
  }

  const updatedClient = await clientStore.updateClient(clientId.value, form)
  
  if (updatedClient) {
    showSuccess(`Cliente "${updatedClient.company_name}" aggiornato con successo`)
  } else {
    showError(clientStore.error || 'Errore nell\'aggiornamento del cliente')
  }
}

// Actions
const handleSuspend = () => {
  if (!client.value) return
  
  confirmSuspend(client.value, async () => {
    const success = await clientStore.suspendClient(clientId.value)
    if (success) {
      showSuccess('Cliente sospeso con successo')
    } else {
      showError(clientStore.error || 'Errore nella sospensione')
    }
  })
}

const handleActivate = async () => {
  const success = await clientStore.activateClient(clientId.value)
  if (success) {
    showSuccess('Cliente attivato con successo')
  } else {
    showError(clientStore.error || 'Errore nell\'attivazione')
  }
}

const handleResetPassword = () => {
  if (!client.value) return
  
  confirmResetPassword(client.value, async () => {
    const success = await clientStore.resetPassword(clientId.value)
    if (success) {
      showSuccess(`Email di reset password inviata a ${client.value?.email}`)
    } else {
      showError(clientStore.error || 'Errore nell\'invio dell\'email')
    }
  })
}

// Cancel and go back
const onCancel = () => {
  router.push('/admin/clients')
}

// Lifecycle
onMounted(() => {
  loadClient()
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="initialLoading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <i class="pi pi-spin pi-spinner text-4xl text-primary-500 mb-4"></i>
        <p class="text-neutral-600">Caricamento cliente...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!client" class="text-center py-20">
      <div class="w-20 h-20 rounded-full bg-danger-light flex items-center justify-center mx-auto mb-4">
        <i class="pi pi-exclamation-triangle text-4xl text-danger"></i>
      </div>
      <h2 class="text-xl font-semibold text-neutral-900 mb-2">Cliente non trovato</h2>
      <p class="text-neutral-600 mb-6">Il cliente richiesto non esiste o è stato eliminato.</p>
      <PrimeButton
        label="Torna all'elenco"
        icon="pi pi-arrow-left"
        severity="primary"
        @click="onCancel"
      />
    </div>

    <!-- Main Content -->
    <template v-else>
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
            <div class="flex items-center gap-3">
              <div 
                class="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg"
              >
                {{ client.company_name.substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <h1 class="page-title mb-0">{{ client.company_name }}</h1>
                <div class="flex items-center gap-2 mt-1">
                  <PrimeTag 
                    :value="formatStatus(client.status)"
                    :severity="getStatusSeverity(client.status)"
                    class="text-xs"
                  />
                  <span class="text-sm text-neutral-500">
                    Registrato il {{ formatDate(client.created_at) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="page-header-actions">
          <PrimeButton
            v-if="client.status === 'suspended'"
            label="Riattiva"
            icon="pi pi-play"
            severity="success"
            outlined
            @click="handleActivate"
          />
          <PrimeButton
            v-else
            label="Sospendi"
            icon="pi pi-pause"
            severity="warning"
            outlined
            @click="handleSuspend"
          />
          <PrimeButton
            label="Reset Password"
            icon="pi pi-key"
            severity="secondary"
            outlined
            @click="handleResetPassword"
          />
        </div>
      </div>

      <!-- Info Cards Row -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <!-- Free Trial Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">Prova Gratuita</span>
            <i 
              class="pi text-lg"
              :class="client.free_trial_enabled ? 'pi-check-circle text-success' : 'pi-times-circle text-neutral-400'"
            ></i>
          </div>
          <div v-if="client.free_trial_enabled">
            <div class="text-2xl font-bold text-neutral-900 mb-1">
              {{ getFreeTrialRemaining(client) }} / {{ client.free_trial_leads_total }}
            </div>
            <div class="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div 
                class="h-full bg-primary-500 rounded-full transition-all"
                :style="{ width: `${getFreeTrialProgress(client)}%` }"
              ></div>
            </div>
            <span class="text-xs text-neutral-500 mt-1">lead rimanenti</span>
          </div>
          <div v-else class="text-sm text-neutral-500">
            Non attiva
          </div>
        </div>

        <!-- Email Verified Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">Email Verificata</span>
            <i 
              class="pi text-lg"
              :class="client.email_verified_at ? 'pi-check-circle text-success' : 'pi-clock text-warning'"
            ></i>
          </div>
          <div class="text-sm">
            <span v-if="client.email_verified_at" class="text-success-dark">
              {{ formatDateTime(client.email_verified_at) }}
            </span>
            <span v-else class="text-warning-dark">
              In attesa di verifica
            </span>
          </div>
        </div>

        <!-- Notifications Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">Notifiche Lead</span>
            <i 
              class="pi text-lg"
              :class="client.notify_new_leads ? 'pi-bell text-info' : 'pi-bell-slash text-neutral-400'"
            ></i>
          </div>
          <div class="text-sm">
            <span :class="client.notify_new_leads ? 'text-info-dark' : 'text-neutral-500'">
              {{ client.notify_new_leads ? 'Attive' : 'Disattivate' }}
            </span>
          </div>
        </div>

        <!-- Marketing Consent Card -->
        <div class="q-card p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">Consenso Marketing</span>
            <i 
              class="pi text-lg"
              :class="client.marketing_consent ? 'pi-check-circle text-success' : 'pi-times-circle text-neutral-400'"
            ></i>
          </div>
          <div class="text-sm">
            <span :class="client.marketing_consent ? 'text-success-dark' : 'text-neutral-500'">
              {{ client.marketing_consent ? 'Acconsentito' : 'Non acconsentito' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <PrimeTabView v-model:activeIndex="activeTab" class="q-card">
        <!-- Tab: Dati Aziendali -->
        <PrimeTabPanel value="0" header="Dati Aziendali">
          <form @submit.prevent="onSubmit" class="space-y-6 pt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Company Name -->
              <div class="form-group">
                <label for="company_name">Ragione Sociale *</label>
                <PrimeInputText
                  id="company_name"
                  v-model="form.company_name"
                  :class="{ 'p-invalid': errors.company_name }"
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
                  class="w-full"
                  @blur="onBlur('vat_number', form.vat_number)"
                />
                <small v-if="errors.vat_number" class="p-error">{{ errors.vat_number }}</small>
              </div>

              <!-- Email -->
              <div class="form-group">
                <label for="email">Email *</label>
                <PrimeInputText
                  id="email"
                  v-model="form.email"
                  type="email"
                  :class="{ 'p-invalid': errors.email }"
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
                  class="w-full"
                  @blur="onBlur('phone', form.phone)"
                />
                <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
              </div>

              <!-- First Name -->
              <div class="form-group">
                <label for="contact_first_name">Nome Referente *</label>
                <PrimeInputText
                  id="contact_first_name"
                  v-model="form.contact_first_name"
                  :class="{ 'p-invalid': errors.contact_first_name }"
                  class="w-full"
                  @blur="onBlur('contact_first_name', form.contact_first_name)"
                />
                <small v-if="errors.contact_first_name" class="p-error">{{ errors.contact_first_name }}</small>
              </div>

              <!-- Last Name -->
              <div class="form-group">
                <label for="contact_last_name">Cognome Referente *</label>
                <PrimeInputText
                  id="contact_last_name"
                  v-model="form.contact_last_name"
                  :class="{ 'p-invalid': errors.contact_last_name }"
                  class="w-full"
                  @blur="onBlur('contact_last_name', form.contact_last_name)"
                />
                <small v-if="errors.contact_last_name" class="p-error">{{ errors.contact_last_name }}</small>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-4 pt-4 border-t border-neutral-200">
              <PrimeButton
                type="button"
                label="Annulla modifiche"
                severity="secondary"
                outlined
                @click="loadClient"
              />
              <PrimeButton
                type="submit"
                label="Salva Modifiche"
                icon="pi pi-check"
                severity="primary"
                :loading="clientStore.saving"
                :disabled="hasErrors"
              />
            </div>
          </form>
        </PrimeTabPanel>

        <!-- Tab: Fatturazione -->
        <PrimeTabPanel value="1" header="Fatturazione">
          <form @submit.prevent="onSubmit" class="space-y-6 pt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Address -->
              <div class="form-group md:col-span-2">
                <label for="address">Indirizzo</label>
                <PrimeInputText
                  id="address"
                  v-model="form.billing_data.address"
                  class="w-full"
                />
              </div>

              <!-- City -->
              <div class="form-group">
                <label for="city">Città</label>
                <PrimeInputText
                  id="city"
                  v-model="form.billing_data.city"
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
                />
              </div>

              <!-- Postal Code -->
              <div class="form-group">
                <label for="postal_code">CAP</label>
                <PrimeInputText
                  id="postal_code"
                  v-model="form.billing_data.postal_code"
                  :class="{ 'p-invalid': errors.postal_code }"
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
                  class="w-full"
                  maxlength="7"
                  @blur="onBlur('sdi_code', form.billing_data.sdi_code)"
                />
                <small v-if="errors.sdi_code" class="p-error">{{ errors.sdi_code }}</small>
              </div>

              <!-- PEC -->
              <div class="form-group">
                <label for="pec">PEC</label>
                <PrimeInputText
                  id="pec"
                  v-model="form.billing_data.pec"
                  :class="{ 'p-invalid': errors.pec }"
                  class="w-full"
                  @blur="onBlur('pec', form.billing_data.pec)"
                />
                <small v-if="errors.pec" class="p-error">{{ errors.pec }}</small>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-4 pt-4 border-t border-neutral-200">
              <PrimeButton
                type="button"
                label="Annulla modifiche"
                severity="secondary"
                outlined
                @click="loadClient"
              />
              <PrimeButton
                type="submit"
                label="Salva Modifiche"
                icon="pi pi-check"
                severity="primary"
                :loading="clientStore.saving"
                :disabled="hasErrors"
              />
            </div>
          </form>
        </PrimeTabPanel>

        <!-- Tab: Impostazioni -->
        <PrimeTabPanel value="2" header="Impostazioni">
          <form @submit.prevent="onSubmit" class="space-y-6 pt-4">
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
                <div class="flex gap-2">
                  <PrimeInputNumber
                    id="free_trial_leads"
                    v-model="form.free_trial_leads_total"
                    :min="client.free_trial_leads_used"
                    :max="100"
                    :disabled="!form.free_trial_enabled"
                    class="flex-1"
                  />
                  <span class="text-sm text-neutral-500 self-center">
                    ({{ client.free_trial_leads_used }} già usati)
                  </span>
                </div>
              </div>

              <!-- Free Trial Toggle -->
              <div class="form-group">
                <div class="flex items-center gap-3">
                  <PrimeToggleSwitch
                    id="free_trial_enabled"
                    v-model="form.free_trial_enabled"
                  />
                  <label for="free_trial_enabled" class="cursor-pointer mb-0">
                    Abilita prova gratuita
                  </label>
                </div>
                <small class="form-hint">
                  Se attiva, il cliente può riscattare lead gratuiti
                </small>
              </div>

              <!-- Notify New Leads -->
              <div class="form-group">
                <div class="flex items-center gap-3">
                  <PrimeToggleSwitch
                    id="notify_new_leads"
                    v-model="form.notify_new_leads"
                  />
                  <label for="notify_new_leads" class="cursor-pointer mb-0">
                    Notifiche nuovi lead
                  </label>
                </div>
                <small class="form-hint">
                  Riceve email quando sono disponibili nuovi lead
                </small>
              </div>
            </div>

            <!-- Danger Zone -->
            <div class="mt-8 pt-6 border-t border-danger-light">
              <h4 class="text-lg font-semibold text-danger mb-4">Zona Pericolosa</h4>
              <div class="flex items-center justify-between p-4 bg-danger-light rounded-lg">
                <div>
                  <p class="font-medium text-danger-dark">Elimina questo cliente</p>
                  <p class="text-sm text-neutral-600">
                    Una volta eliminato, tutti i dati del cliente saranno persi permanentemente.
                  </p>
                </div>
                <PrimeButton
                  label="Elimina Cliente"
                  icon="pi pi-trash"
                  severity="danger"
                  outlined
                />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-4 pt-4 border-t border-neutral-200">
              <PrimeButton
                type="button"
                label="Annulla modifiche"
                severity="secondary"
                outlined
                @click="loadClient"
              />
              <PrimeButton
                type="submit"
                label="Salva Modifiche"
                icon="pi pi-check"
                severity="primary"
                :loading="clientStore.saving"
                :disabled="hasErrors"
              />
            </div>
          </form>
        </PrimeTabPanel>

        <!-- Tab: Storico -->
        <PrimeTabPanel value="3" header="Storico">
          <div class="pt-4">
            <div class="text-center py-12">
              <i class="pi pi-history text-4xl text-neutral-400 mb-4 block"></i>
              <p class="text-neutral-600 mb-2">Storico ordini e attività</p>
              <p class="text-sm text-neutral-500">
                Qui verranno mostrati gli ordini e le attività del cliente
              </p>
            </div>
          </div>
        </PrimeTabPanel>
      </PrimeTabView>
    </template>
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

:deep(.p-tabview-panels) {
  padding: 0 !important;
}

:deep(.p-tabview-nav) {
  border-bottom: 1px solid #e9ecef;
}

:deep(.p-tabview-nav-link) {
  padding: 1rem 1.5rem !important;
}
</style>
