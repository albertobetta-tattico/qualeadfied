<script setup lang="ts">
/**
 * Admin Clients - Create New Client
 * Form per la creazione di un nuovo cliente B2B
 */
import { useClientValidation, useClientForm, useClientActions } from '~/composables/useClient'
import type { ClientCreateForm, BillingData, BankData } from '~/types/client'
import type { Category } from '~/types/catalog'

definePageMeta({
  layout: 'admin'
})

const { t } = useI18n()

// Store & Composables
const clientStore = useClientStore()
const catalogStore = useCatalogStore()
const router = useRouter()
const { errors, hasErrors, validateField, validateForm, clearErrors } = useClientValidation()
const { showSuccess, showError } = useClientActions()

// Load categories
const categories = computed(() => catalogStore.categories)

onMounted(async () => {
  if (categories.value.length === 0) {
    await catalogStore.fetchCategories()
  }
})

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
  bank_data: {
    iban: '',
    bank_account_holder: '',
    bic_swift: '',
    bank_name: ''
  },
  category_ids: [],
  notify_new_leads: true
})

// Status options
const statusOptions = computed(() => [
  { label: t('admin.clients.list.filters.statusOptions.active'), value: 'active' },
  { label: t('admin.clients.list.filters.statusOptions.pending'), value: 'pending' },
  { label: t('admin.clients.list.filters.statusOptions.suspended'), value: 'suspended' }
])

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
    showError(t('admin.clients.create.toast.validationError'))
    return
  }

  const client = await clientStore.createClient(form)
  
  if (client) {
    showSuccess(t('admin.clients.create.toast.createSuccess', { name: client.company_name }))
    router.push('/admin/clients')
  } else {
    showError(clientStore.error || t('admin.clients.create.toast.createError'))
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
          <h1 class="page-title mb-0">{{ $t('admin.clients.create.createTitle') }}</h1>
        </div>
        <p class="page-subtitle ml-12">{{ $t('admin.clients.create.createSubtitle') }}</p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Company Information Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-building mr-2 text-primary-500"></i>
            {{ $t('admin.clients.create.sections.companyData') }}
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Company Name -->
            <div class="form-group">
              <label for="company_name">{{ $t('admin.clients.create.form.companyName') }} *</label>
              <PrimeInputText
                id="company_name"
                v-model="form.company_name"
                :class="{ 'p-invalid': errors.company_name }"
                :placeholder="$t('admin.clients.create.form.companyNamePlaceholder')"
                class="w-full"
                @blur="onBlur('company_name', form.company_name)"
              />
              <small v-if="errors.company_name" class="p-error">{{ errors.company_name }}</small>
            </div>

            <!-- VAT Number -->
            <div class="form-group">
              <label for="vat_number">{{ $t('admin.clients.create.form.vatNumber') }} *</label>
              <PrimeInputText
                id="vat_number"
                v-model="form.vat_number"
                :class="{ 'p-invalid': errors.vat_number }"
                :placeholder="$t('admin.clients.create.form.vatNumberPlaceholder')"
                class="w-full"
                @blur="onBlur('vat_number', form.vat_number)"
              />
              <small v-if="errors.vat_number" class="p-error">{{ errors.vat_number }}</small>
              <small v-else class="form-hint">{{ $t('admin.clients.create.form.vatNumberHint') }}</small>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email">{{ $t('admin.clients.create.form.email') }} *</label>
              <PrimeInputText
                id="email"
                v-model="form.email"
                type="email"
                :class="{ 'p-invalid': errors.email }"
                :placeholder="$t('admin.clients.create.form.emailPlaceholder')"
                class="w-full"
                @blur="onBlur('email', form.email)"
              />
              <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
            </div>

            <!-- Phone -->
            <div class="form-group">
              <label for="phone">{{ $t('admin.clients.create.form.phone') }} *</label>
              <PrimeInputText
                id="phone"
                v-model="form.phone"
                :class="{ 'p-invalid': errors.phone }"
                :placeholder="$t('admin.clients.create.form.phonePlaceholder')"
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
            {{ $t('admin.clients.create.sections.contactPerson') }}
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- First Name -->
            <div class="form-group">
              <label for="contact_first_name">{{ $t('admin.clients.create.form.firstName') }} *</label>
              <PrimeInputText
                id="contact_first_name"
                v-model="form.contact_first_name"
                :class="{ 'p-invalid': errors.contact_first_name }"
                :placeholder="$t('admin.clients.create.form.firstNamePlaceholder')"
                class="w-full"
                @blur="onBlur('contact_first_name', form.contact_first_name)"
              />
              <small v-if="errors.contact_first_name" class="p-error">{{ errors.contact_first_name }}</small>
            </div>

            <!-- Last Name -->
            <div class="form-group">
              <label for="contact_last_name">{{ $t('admin.clients.create.form.lastName') }} *</label>
              <PrimeInputText
                id="contact_last_name"
                v-model="form.contact_last_name"
                :class="{ 'p-invalid': errors.contact_last_name }"
                :placeholder="$t('admin.clients.create.form.lastNamePlaceholder')"
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
            {{ $t('admin.clients.create.sections.credentials') }}
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Password -->
            <div class="form-group">
              <label for="password">{{ $t('admin.clients.create.form.password') }} *</label>
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
              <small v-else class="form-hint">{{ $t('admin.clients.create.form.passwordHint') }}</small>
            </div>

            <!-- Password Confirmation -->
            <div class="form-group">
              <label for="password_confirmation">{{ $t('admin.clients.create.form.confirmPassword') }} *</label>
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
            {{ $t('admin.clients.create.sections.billingData') }}
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Address -->
            <div class="form-group md:col-span-2">
              <label for="address">{{ $t('admin.clients.create.form.address') }}</label>
              <PrimeInputText
                id="address"
                v-model="form.billing_data.address"
                :placeholder="$t('admin.clients.create.form.addressPlaceholder')"
                class="w-full"
              />
            </div>

            <!-- City -->
            <div class="form-group">
              <label for="city">{{ $t('admin.clients.create.form.city') }}</label>
              <PrimeInputText
                id="city"
                v-model="form.billing_data.city"
                :placeholder="$t('admin.clients.create.form.cityPlaceholder')"
                class="w-full"
              />
            </div>

            <!-- Province -->
            <div class="form-group">
              <label for="province">{{ $t('admin.clients.create.form.province') }}</label>
              <PrimeSelect
                id="province"
                v-model="form.billing_data.province"
                :options="provinceOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('admin.clients.list.filters.selectOption')"
                class="w-full"
                :filter="true"
                :filterPlaceholder="$t('admin.clients.create.form.provincePlaceholder')"
              />
            </div>

            <!-- Postal Code -->
            <div class="form-group">
              <label for="postal_code">{{ $t('admin.clients.create.form.zip') }}</label>
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
              <label for="country">{{ $t('admin.clients.create.form.country') }}</label>
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
              <label for="sdi_code">{{ $t('admin.clients.create.form.sdiCode') }}</label>
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
              <small v-else class="form-hint">{{ $t('admin.clients.create.form.sdiCodeHint') }}</small>
            </div>

            <!-- PEC -->
            <div class="form-group">
              <label for="pec">{{ $t('admin.clients.create.form.pec') }}</label>
              <PrimeInputText
                id="pec"
                v-model="form.billing_data.pec"
                :class="{ 'p-invalid': errors.pec }"
                :placeholder="$t('admin.clients.create.form.pecPlaceholder')"
                class="w-full"
                @blur="onBlur('pec', form.billing_data.pec)"
              />
              <small v-if="errors.pec" class="p-error">{{ errors.pec }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Bank Data Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-wallet mr-2 text-primary-500"></i>
            {{ $t('admin.clients.create.sections.bankData') }}
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- IBAN -->
            <div class="form-group md:col-span-2">
              <label for="iban">{{ $t('admin.clients.create.form.iban') }}</label>
              <PrimeInputText
                id="iban"
                v-model="form.bank_data.iban"
                class="w-full"
                placeholder="IT60X0542811101000000123456"
              />
              <small class="form-hint">{{ $t('admin.clients.create.form.ibanHint') }}</small>
            </div>

            <!-- Bank Account Holder -->
            <div class="form-group">
              <label for="bank_account_holder">{{ $t('admin.clients.create.form.bankAccountHolder') }}</label>
              <PrimeInputText
                id="bank_account_holder"
                v-model="form.bank_data.bank_account_holder"
                class="w-full"
                :placeholder="$t('admin.clients.create.form.bankAccountHolderPlaceholder')"
              />
            </div>

            <!-- Bank Name -->
            <div class="form-group">
              <label for="bank_name">{{ $t('admin.clients.create.form.bankName') }}</label>
              <PrimeInputText
                id="bank_name"
                v-model="form.bank_data.bank_name"
                class="w-full"
                :placeholder="$t('admin.clients.create.form.bankNamePlaceholder')"
              />
            </div>

            <!-- BIC/SWIFT -->
            <div class="form-group">
              <label for="bic_swift">{{ $t('admin.clients.create.form.bicSwift') }}</label>
              <PrimeInputText
                id="bic_swift"
                v-model="form.bank_data.bic_swift"
                class="w-full"
                :placeholder="$t('admin.clients.create.form.bicSwiftPlaceholder')"
              />
              <small class="form-hint">{{ $t('admin.clients.create.form.bicSwiftHint') }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-tags mr-2 text-primary-500"></i>
            {{ $t('admin.clients.create.sections.categoriesOfInterest') }}
          </h3>
        </div>
        <div class="q-card-body">
          <div class="form-group">
            <label for="category_ids">{{ $t('admin.clients.create.form.categoriesLabel') }}</label>
            <PrimeMultiSelect
              id="category_ids"
              v-model="form.category_ids"
              :options="categories"
              optionLabel="name"
              optionValue="id"
              :placeholder="$t('admin.clients.create.form.categoriesPlaceholder')"
              class="w-full"
              display="chip"
              :filter="true"
              :filterPlaceholder="$t('admin.clients.create.form.categoriesFilterPlaceholder')"
            >
              <template #option="slotProps">
                <div class="flex items-center gap-2">
                  <span>{{ slotProps.option.name }}</span>
                  <PrimeTag
                    v-if="!slotProps.option.is_active"
                    :value="$t('admin.clients.create.form.categoryInactive')"
                    severity="danger"
                    class="text-xs"
                  />
                </div>
              </template>
            </PrimeMultiSelect>
            <small class="form-hint">
              {{ $t('admin.clients.create.form.categoriesHint') }}
            </small>
          </div>
        </div>
      </div>

      <!-- Settings Card -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">
            <i class="pi pi-cog mr-2 text-primary-500"></i>
            {{ $t('admin.clients.create.sections.accountSettings') }}
          </h3>
        </div>
        <div class="q-card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Status -->
            <div class="form-group">
              <label for="status">{{ $t('admin.clients.create.form.status') }}</label>
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
              <label for="free_trial_leads">{{ $t('admin.clients.create.form.freeLeads') }}</label>
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
                {{ $t('admin.clients.create.form.freeTrial') }}
              </label>
            </div>

            <!-- Notify New Leads -->
            <div class="form-group flex items-center gap-3">
              <PrimeToggleSwitch
                id="notify_new_leads"
                v-model="form.notify_new_leads"
              />
              <label for="notify_new_leads" class="cursor-pointer mb-0">
                {{ $t('admin.clients.create.form.leadNotifications') }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-4 pt-4 border-t border-neutral-200">
        <PrimeButton
          type="button"
          :label="$t('admin.clients.create.buttons.cancel')"
          severity="secondary"
          outlined
          @click="onCancel"
        />
        <PrimeButton
          type="submit"
          :label="$t('admin.clients.create.buttons.create')"
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
