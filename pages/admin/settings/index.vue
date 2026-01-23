<script setup lang="ts">
/**
 * Admin Settings Page - Impostazioni Sistema
 * Configurazione sistema, notifiche, operatori e log attività
 */
import {
  useSettingsFormatters,
  useSettingsActions,
  useSettingsOptions,
  useOperatorValidation
} from '~/composables/useSettings'
import type {
  SystemConfigForm,
  AdminOperator,
  AdminOperatorCreateForm,
  AdminOperatorUpdateForm,
  AdminRole,
  AdminStatus,
  NotificationFrequency,
  ActivityType,
  ActivityEntity
} from '~/types/settings'

definePageMeta({
  layout: 'admin'
})

// Store & Composables
const settingsStore = useSettingsStore()
const {
  formatRole,
  getRoleSeverity,
  formatStatus,
  getStatusSeverity,
  formatFrequency,
  formatActivityType,
  getActivityTypeIcon,
  getActivityTypeSeverity,
  formatEntity,
  formatDateTime,
  formatRelativeTime,
  getOperatorFullName
} = useSettingsFormatters()
const {
  confirmDeleteOperator,
  confirmResetPassword,
  confirmDeactivateOperator,
  showSuccess,
  showError
} = useSettingsActions()
const {
  roleOptions,
  statusOptions,
  frequencyOptions,
  activityTypeOptions,
  activityEntityOptions
} = useSettingsOptions()
const { errors, hasErrors, validateForm, clearErrors } = useOperatorValidation()
const router = useRouter()

// Navigation
const navigateToSources = () => {
  router.push('/admin/leads/sources')
}

// Refs
const activeTab = ref(0)

// System Config Form
const systemConfigForm = reactive<SystemConfigForm>({
  default_free_trial_leads: 3,
  default_vat_rate: 22,
  order_number_prefix: 'ORD-2024-',
  invoice_number_prefix: 'FT-2024-',
  sender_email: '',
  sender_name: ''
})

// Operator Dialog
const operatorDialog = ref(false)
const operatorDialogMode = ref<'create' | 'edit'>('create')
const operatorForm = reactive<AdminOperatorCreateForm>({
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  password_confirmation: '',
  role: 'operator'
})
const editingOperatorId = ref<number | null>(null)

// Test Email Dialog
const testEmailDialog = ref(false)
const testEmailAddress = ref('')

// Log filters
const logTypeFilter = ref<ActivityType | ''>('')
const logEntityFilter = ref<ActivityEntity | ''>('')
const logSearchQuery = ref('')

// Computed
const loading = computed(() => settingsStore.loading)
const saving = computed(() => settingsStore.saving)
const systemConfig = computed(() => settingsStore.systemConfig)
const notificationConfigs = computed(() => settingsStore.notificationConfigs)
const operators = computed(() => settingsStore.operators)
const activityLogs = computed(() => settingsStore.activityLogs)
const logsPagination = computed(() => settingsStore.logsPagination)

// Methods
const loadSystemConfig = async () => {
  await settingsStore.fetchSystemConfig()
  if (systemConfig.value) {
    systemConfigForm.default_free_trial_leads = systemConfig.value.default_free_trial_leads
    systemConfigForm.default_vat_rate = systemConfig.value.default_vat_rate
    systemConfigForm.order_number_prefix = systemConfig.value.order_number_prefix
    systemConfigForm.invoice_number_prefix = systemConfig.value.invoice_number_prefix
    systemConfigForm.sender_email = systemConfig.value.sender_email
    systemConfigForm.sender_name = systemConfig.value.sender_name
  }
}

const saveSystemConfig = async () => {
  const success = await settingsStore.updateSystemConfig(systemConfigForm)
  if (success) {
    showSuccess('Configurazione salvata con successo')
  } else {
    showError(settingsStore.error || 'Errore nel salvataggio')
  }
}

const loadNotifications = async () => {
  await settingsStore.fetchNotificationConfigs()
}

const updateNotificationFrequency = async (categoryId: number, frequency: NotificationFrequency) => {
  const success = await settingsStore.updateNotificationConfig(categoryId, { frequency })
  if (success) {
    showSuccess('Frequenza notifica aggiornata')
  } else {
    showError(settingsStore.error || 'Errore nell\'aggiornamento')
  }
}

const toggleNotification = async (categoryId: number, enabled: boolean) => {
  const success = await settingsStore.updateNotificationConfig(categoryId, { enabled })
  if (success) {
    showSuccess(enabled ? 'Notifica abilitata' : 'Notifica disabilitata')
  } else {
    showError(settingsStore.error || 'Errore nell\'aggiornamento')
  }
}

const loadOperators = async () => {
  await settingsStore.fetchOperators()
}

const openCreateOperator = () => {
  operatorDialogMode.value = 'create'
  editingOperatorId.value = null
  operatorForm.email = ''
  operatorForm.first_name = ''
  operatorForm.last_name = ''
  operatorForm.password = ''
  operatorForm.password_confirmation = ''
  operatorForm.role = 'operator'
  clearErrors()
  operatorDialog.value = true
}

const openEditOperator = (operator: AdminOperator) => {
  operatorDialogMode.value = 'edit'
  editingOperatorId.value = operator.id
  operatorForm.email = operator.email
  operatorForm.first_name = operator.first_name
  operatorForm.last_name = operator.last_name
  operatorForm.password = ''
  operatorForm.password_confirmation = ''
  operatorForm.role = operator.role
  clearErrors()
  operatorDialog.value = true
}

const saveOperator = async () => {
  const isCreate = operatorDialogMode.value === 'create'

  if (!validateForm(operatorForm, isCreate)) {
    showError('Correggi gli errori nel form')
    return
  }

  if (isCreate) {
    const result = await settingsStore.createOperator(operatorForm)
    if (result) {
      showSuccess('Operatore creato con successo')
      operatorDialog.value = false
    } else {
      showError(settingsStore.error || 'Errore nella creazione')
    }
  } else if (editingOperatorId.value) {
    const updateData: AdminOperatorUpdateForm = {
      email: operatorForm.email,
      first_name: operatorForm.first_name,
      last_name: operatorForm.last_name,
      role: operatorForm.role,
      status: 'active'
    }
    const success = await settingsStore.updateOperator(editingOperatorId.value, updateData)
    if (success) {
      showSuccess('Operatore aggiornato con successo')
      operatorDialog.value = false
    } else {
      showError(settingsStore.error || 'Errore nell\'aggiornamento')
    }
  }
}

const handleDeleteOperator = (operator: AdminOperator) => {
  confirmDeleteOperator(operator, async () => {
    const success = await settingsStore.deleteOperator(operator.id)
    if (success) {
      showSuccess('Operatore eliminato')
    } else {
      showError(settingsStore.error || 'Errore nell\'eliminazione')
    }
  })
}

const handleResetPassword = (operator: AdminOperator) => {
  confirmResetPassword(operator, async () => {
    const success = await settingsStore.resetOperatorPassword(operator.id)
    if (success) {
      showSuccess(`Email di reset inviata a ${operator.email}`)
    } else {
      showError(settingsStore.error || 'Errore nel reset password')
    }
  })
}

const handleToggleStatus = async (operator: AdminOperator) => {
  const newStatus: AdminStatus = operator.status === 'active' ? 'inactive' : 'active'

  if (newStatus === 'inactive') {
    confirmDeactivateOperator(operator, async () => {
      const success = await settingsStore.updateOperator(operator.id, {
        ...operator,
        status: newStatus
      })
      if (success) {
        showSuccess('Operatore disattivato')
      } else {
        showError(settingsStore.error || 'Errore nella disattivazione')
      }
    })
  } else {
    const success = await settingsStore.updateOperator(operator.id, {
      ...operator,
      status: newStatus
    })
    if (success) {
      showSuccess('Operatore riattivato')
    } else {
      showError(settingsStore.error || 'Errore nella riattivazione')
    }
  }
}

const loadActivityLogs = async () => {
  await settingsStore.fetchActivityLogs()
}

const applyLogFilters = () => {
  settingsStore.setLogsFilters({
    type: logTypeFilter.value,
    entity: logEntityFilter.value,
    search: logSearchQuery.value
  })
  loadActivityLogs()
}

const clearLogFilters = () => {
  logTypeFilter.value = ''
  logEntityFilter.value = ''
  logSearchQuery.value = ''
  settingsStore.resetLogsFilters()
  loadActivityLogs()
}

const onLogPage = (event: any) => {
  settingsStore.setLogsFilters({
    page: event.page + 1,
    per_page: event.rows
  })
  loadActivityLogs()
}

const openTestEmail = () => {
  testEmailAddress.value = ''
  testEmailDialog.value = true
}

const sendTestEmail = async () => {
  if (!testEmailAddress.value) {
    showError('Inserisci un indirizzo email')
    return
  }

  const success = await settingsStore.testEmailConfig(testEmailAddress.value)
  if (success) {
    showSuccess('Email di test inviata')
    testEmailDialog.value = false
  } else {
    showError(settingsStore.error || 'Errore nell\'invio')
  }
}

// Tab change handler
const onTabChange = (index: number) => {
  switch (index) {
    case 0:
      if (!systemConfig.value) loadSystemConfig()
      break
    case 1:
      if (!notificationConfigs.value.length) loadNotifications()
      break
    case 2:
      if (!operators.value.length) loadOperators()
      break
    case 3:
      if (!activityLogs.value.length) loadActivityLogs()
      break
  }
}

// Lifecycle
onMounted(() => {
  loadSystemConfig()
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Impostazioni</h1>
        <p class="page-subtitle">Configurazione sistema, notifiche e gestione operatori</p>
      </div>
      <div class="page-header-actions">
        <PrimeButton
          label="Sorgenti Lead"
          icon="pi pi-link"
          severity="secondary"
          outlined
          @click="navigateToSources"
        />
      </div>
    </div>

    <!-- Tabs -->
    <PrimeTabView v-model:activeIndex="activeTab" class="q-card" @update:activeIndex="onTabChange">
      <!-- Tab: Configurazione Sistema -->
      <PrimeTabPanel value="0" header="Configurazione Sistema">
        <div class="pt-4 max-w-3xl">
          <form @submit.prevent="saveSystemConfig" class="space-y-6">
            <!-- Lead e Trial -->
            <div class="bg-neutral-50 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">
                <i class="pi pi-gift mr-2"></i>Lead e Prova Gratuita
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="free_trial_leads">Lead Prova Gratuita Default</label>
                  <PrimeInputNumber
                    id="free_trial_leads"
                    v-model="systemConfigForm.default_free_trial_leads"
                    :min="0"
                    :max="100"
                    class="w-full"
                  />
                  <small class="text-neutral-500">Numero di lead gratuiti per nuovi clienti</small>
                </div>
              </div>
            </div>

            <!-- Fatturazione -->
            <div class="bg-neutral-50 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">
                <i class="pi pi-file mr-2"></i>Fatturazione
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="vat_rate">Aliquota IVA Default (%)</label>
                  <PrimeInputNumber
                    id="vat_rate"
                    v-model="systemConfigForm.default_vat_rate"
                    :min="0"
                    :max="100"
                    suffix="%"
                    class="w-full"
                  />
                </div>
                <div class="form-group">
                  <label for="order_prefix">Prefisso Numero Ordine</label>
                  <PrimeInputText
                    id="order_prefix"
                    v-model="systemConfigForm.order_number_prefix"
                    class="w-full"
                    placeholder="es. ORD-2024-"
                  />
                </div>
                <div class="form-group">
                  <label for="invoice_prefix">Prefisso Numero Fattura</label>
                  <PrimeInputText
                    id="invoice_prefix"
                    v-model="systemConfigForm.invoice_number_prefix"
                    class="w-full"
                    placeholder="es. FT-2024-"
                  />
                </div>
              </div>
            </div>

            <!-- Email -->
            <div class="bg-neutral-50 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">
                <i class="pi pi-envelope mr-2"></i>Email
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="sender_email">Email Mittente</label>
                  <PrimeInputText
                    id="sender_email"
                    v-model="systemConfigForm.sender_email"
                    type="email"
                    class="w-full"
                    placeholder="noreply@qualeadfied.com"
                  />
                </div>
                <div class="form-group">
                  <label for="sender_name">Nome Mittente</label>
                  <PrimeInputText
                    id="sender_name"
                    v-model="systemConfigForm.sender_name"
                    class="w-full"
                    placeholder="Qualeadfied"
                  />
                </div>
              </div>
              <div class="mt-4">
                <PrimeButton
                  label="Invia Email di Test"
                  icon="pi pi-send"
                  severity="secondary"
                  outlined
                  size="small"
                  @click="openTestEmail"
                />
              </div>
            </div>

            <!-- Save Button -->
            <div class="flex justify-end pt-4 border-t border-neutral-200">
              <PrimeButton
                type="submit"
                label="Salva Configurazione"
                icon="pi pi-check"
                severity="primary"
                :loading="saving"
              />
            </div>
          </form>
        </div>
      </PrimeTabPanel>

      <!-- Tab: Notifiche Email -->
      <PrimeTabPanel value="1" header="Notifiche Email">
        <div class="pt-4">
          <p class="text-neutral-600 mb-6">
            Configura la frequenza di invio delle notifiche per ogni categoria di lead.
          </p>

          <div class="overflow-x-auto">
            <PrimeDataTable
              :value="notificationConfigs"
              :loading="loading"
              stripedRows
              class="text-sm"
            >
              <PrimeColumn field="category_name" header="Categoria" style="min-width: 200px">
                <template #body="{ data }">
                  <span class="font-medium text-neutral-900">{{ data.category_name }}</span>
                </template>
              </PrimeColumn>

              <PrimeColumn field="enabled" header="Abilitata" style="width: 120px">
                <template #body="{ data }">
                  <PrimeToggleSwitch
                    :modelValue="data.enabled"
                    @update:modelValue="(val: boolean) => toggleNotification(data.category_id, val)"
                  />
                </template>
              </PrimeColumn>

              <PrimeColumn field="frequency" header="Frequenza" style="min-width: 180px">
                <template #body="{ data }">
                  <PrimeSelect
                    :modelValue="data.frequency"
                    :options="frequencyOptions"
                    optionLabel="label"
                    optionValue="value"
                    :disabled="!data.enabled"
                    class="w-full"
                    @update:modelValue="(val: NotificationFrequency) => updateNotificationFrequency(data.category_id, val)"
                  />
                </template>
              </PrimeColumn>

              <PrimeColumn header="Descrizione" style="min-width: 250px">
                <template #body="{ data }">
                  <span class="text-sm text-neutral-500">
                    <template v-if="!data.enabled">Notifiche disabilitate</template>
                    <template v-else-if="data.frequency === 'instant'">Email immediata per ogni nuovo lead</template>
                    <template v-else-if="data.frequency === 'hourly'">Riepilogo ogni ora</template>
                    <template v-else-if="data.frequency === 'daily'">Riepilogo giornaliero</template>
                    <template v-else-if="data.frequency === 'weekly'">Riepilogo settimanale</template>
                    <template v-else>Notifiche disabilitate</template>
                  </span>
                </template>
              </PrimeColumn>
            </PrimeDataTable>
          </div>
        </div>
      </PrimeTabPanel>

      <!-- Tab: Operatori Admin -->
      <PrimeTabPanel value="2" header="Operatori Admin">
        <div class="pt-4">
          <div class="flex justify-between items-center mb-6">
            <p class="text-neutral-600">
              Gestisci gli account degli operatori con accesso al backoffice.
            </p>
            <PrimeButton
              label="Nuovo Operatore"
              icon="pi pi-plus"
              severity="primary"
              @click="openCreateOperator"
            />
          </div>

          <PrimeDataTable
            :value="operators"
            :loading="loading"
            stripedRows
            class="text-sm"
          >
            <PrimeColumn header="Operatore" style="min-width: 250px">
              <template #body="{ data }">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm"
                    :class="data.status === 'active' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-200 text-neutral-500'"
                  >
                    {{ data.first_name.charAt(0) }}{{ data.last_name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-medium text-neutral-900">{{ getOperatorFullName(data) }}</div>
                    <div class="text-xs text-neutral-500">{{ data.email }}</div>
                  </div>
                </div>
              </template>
            </PrimeColumn>

            <PrimeColumn field="role" header="Ruolo" style="min-width: 140px">
              <template #body="{ data }">
                <PrimeTag
                  :value="formatRole(data.role)"
                  :severity="getRoleSeverity(data.role)"
                />
              </template>
            </PrimeColumn>

            <PrimeColumn field="status" header="Stato" style="min-width: 120px">
              <template #body="{ data }">
                <PrimeTag
                  :value="formatStatus(data.status)"
                  :severity="getStatusSeverity(data.status)"
                />
              </template>
            </PrimeColumn>

            <PrimeColumn field="last_login_at" header="Ultimo Accesso" style="min-width: 150px">
              <template #body="{ data }">
                <span class="text-neutral-600">{{ formatRelativeTime(data.last_login_at) }}</span>
              </template>
            </PrimeColumn>

            <PrimeColumn header="Azioni" style="min-width: 150px">
              <template #body="{ data }">
                <div class="flex gap-1">
                  <PrimeButton
                    icon="pi pi-pencil"
                    severity="primary"
                    text
                    rounded
                    size="small"
                    v-tooltip.top="'Modifica'"
                    @click="openEditOperator(data)"
                  />
                  <PrimeButton
                    icon="pi pi-key"
                    severity="secondary"
                    text
                    rounded
                    size="small"
                    v-tooltip.top="'Reset Password'"
                    @click="handleResetPassword(data)"
                  />
                  <PrimeButton
                    :icon="data.status === 'active' ? 'pi pi-user-minus' : 'pi pi-user-plus'"
                    :severity="data.status === 'active' ? 'warning' : 'success'"
                    text
                    rounded
                    size="small"
                    v-tooltip.top="data.status === 'active' ? 'Disattiva' : 'Riattiva'"
                    @click="handleToggleStatus(data)"
                  />
                  <PrimeButton
                    icon="pi pi-trash"
                    severity="danger"
                    text
                    rounded
                    size="small"
                    v-tooltip.top="'Elimina'"
                    :disabled="data.role === 'super_admin'"
                    @click="handleDeleteOperator(data)"
                  />
                </div>
              </template>
            </PrimeColumn>
          </PrimeDataTable>
        </div>
      </PrimeTabPanel>

      <!-- Tab: Log Attività -->
      <PrimeTabPanel value="3" header="Log Attività">
        <div class="pt-4">
          <!-- Filters -->
          <div class="flex flex-wrap gap-4 mb-6">
            <div class="flex-1 min-w-48 max-w-xs">
              <PrimeInputText
                v-model="logSearchQuery"
                placeholder="Cerca nei log..."
                class="w-full"
                @keyup.enter="applyLogFilters"
              />
            </div>
            <PrimeSelect
              v-model="logTypeFilter"
              :options="activityTypeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Tipo attività"
              class="w-40"
              @change="applyLogFilters"
            />
            <PrimeSelect
              v-model="logEntityFilter"
              :options="activityEntityOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Entità"
              class="w-40"
              @change="applyLogFilters"
            />
            <PrimeButton
              icon="pi pi-filter-slash"
              severity="secondary"
              outlined
              v-tooltip.top="'Pulisci filtri'"
              @click="clearLogFilters"
            />
          </div>

          <!-- Logs Table -->
          <PrimeDataTable
            :value="activityLogs"
            :loading="loading"
            :rows="20"
            :totalRecords="logsPagination.total"
            :lazy="true"
            :paginator="true"
            :rowsPerPageOptions="[20, 50, 100]"
            stripedRows
            class="text-sm"
            @page="onLogPage"
          >
            <template #empty>
              <div class="text-center py-8">
                <i class="pi pi-history text-4xl text-neutral-400 mb-4 block"></i>
                <p class="text-neutral-600">Nessuna attività trovata</p>
              </div>
            </template>

            <PrimeColumn field="created_at" header="Data" style="min-width: 160px">
              <template #body="{ data }">
                <span class="text-neutral-600">{{ formatDateTime(data.created_at) }}</span>
              </template>
            </PrimeColumn>

            <PrimeColumn field="type" header="Tipo" style="min-width: 130px">
              <template #body="{ data }">
                <PrimeTag
                  :value="formatActivityType(data.type)"
                  :severity="getActivityTypeSeverity(data.type)"
                  :icon="getActivityTypeIcon(data.type)"
                />
              </template>
            </PrimeColumn>

            <PrimeColumn field="admin_name" header="Operatore" style="min-width: 180px">
              <template #body="{ data }">
                <div>
                  <div class="font-medium text-neutral-900">{{ data.admin_name }}</div>
                  <div class="text-xs text-neutral-500">{{ data.admin_email }}</div>
                </div>
              </template>
            </PrimeColumn>

            <PrimeColumn field="entity" header="Entità" style="min-width: 120px">
              <template #body="{ data }">
                <span class="text-neutral-700">{{ formatEntity(data.entity) }}</span>
              </template>
            </PrimeColumn>

            <PrimeColumn field="description" header="Descrizione" style="min-width: 300px">
              <template #body="{ data }">
                <span class="text-neutral-800">{{ data.description }}</span>
              </template>
            </PrimeColumn>

            <PrimeColumn field="ip_address" header="IP" style="min-width: 130px">
              <template #body="{ data }">
                <span class="text-xs text-neutral-500 font-mono">{{ data.ip_address || '-' }}</span>
              </template>
            </PrimeColumn>
          </PrimeDataTable>
        </div>
      </PrimeTabPanel>
    </PrimeTabView>

    <!-- Operator Dialog -->
    <PrimeDialog
      v-model:visible="operatorDialog"
      :modal="true"
      :header="operatorDialogMode === 'create' ? 'Nuovo Operatore' : 'Modifica Operatore'"
      :style="{ width: '500px' }"
    >
      <form @submit.prevent="saveOperator" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label for="op_first_name">Nome *</label>
            <PrimeInputText
              id="op_first_name"
              v-model="operatorForm.first_name"
              :class="{ 'p-invalid': errors.first_name }"
              class="w-full"
            />
            <small v-if="errors.first_name" class="p-error">{{ errors.first_name }}</small>
          </div>
          <div class="form-group">
            <label for="op_last_name">Cognome *</label>
            <PrimeInputText
              id="op_last_name"
              v-model="operatorForm.last_name"
              :class="{ 'p-invalid': errors.last_name }"
              class="w-full"
            />
            <small v-if="errors.last_name" class="p-error">{{ errors.last_name }}</small>
          </div>
        </div>

        <div class="form-group">
          <label for="op_email">Email *</label>
          <PrimeInputText
            id="op_email"
            v-model="operatorForm.email"
            type="email"
            :class="{ 'p-invalid': errors.email }"
            class="w-full"
          />
          <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
        </div>

        <div class="form-group">
          <label for="op_role">Ruolo *</label>
          <PrimeSelect
            id="op_role"
            v-model="operatorForm.role"
            :options="roleOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>

        <template v-if="operatorDialogMode === 'create'">
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label for="op_password">Password *</label>
              <PrimePassword
                id="op_password"
                v-model="operatorForm.password"
                :class="{ 'p-invalid': errors.password }"
                class="w-full"
                toggleMask
                :feedback="false"
              />
              <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
            </div>
            <div class="form-group">
              <label for="op_password_confirm">Conferma Password *</label>
              <PrimePassword
                id="op_password_confirm"
                v-model="operatorForm.password_confirmation"
                :class="{ 'p-invalid': errors.password_confirmation }"
                class="w-full"
                toggleMask
                :feedback="false"
              />
              <small v-if="errors.password_confirmation" class="p-error">{{ errors.password_confirmation }}</small>
            </div>
          </div>
        </template>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <PrimeButton
            label="Annulla"
            severity="secondary"
            outlined
            @click="operatorDialog = false"
          />
          <PrimeButton
            :label="operatorDialogMode === 'create' ? 'Crea Operatore' : 'Salva Modifiche'"
            severity="primary"
            icon="pi pi-check"
            :loading="saving"
            @click="saveOperator"
          />
        </div>
      </template>
    </PrimeDialog>

    <!-- Test Email Dialog -->
    <PrimeDialog
      v-model:visible="testEmailDialog"
      modal
      header="Invia Email di Test"
      :style="{ width: '400px' }"
    >
      <div class="space-y-4">
        <p class="text-neutral-600">
          Inserisci l'indirizzo email a cui inviare il messaggio di test.
        </p>
        <div class="form-group">
          <label for="test_email">Email destinatario</label>
          <PrimeInputText
            id="test_email"
            v-model="testEmailAddress"
            type="email"
            class="w-full"
            placeholder="email@esempio.it"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <PrimeButton
            label="Annulla"
            severity="secondary"
            outlined
            @click="testEmailDialog = false"
          />
          <PrimeButton
            label="Invia Test"
            severity="primary"
            icon="pi pi-send"
            :loading="saving"
            @click="sendTestEmail"
          />
        </div>
      </template>
    </PrimeDialog>
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

.p-error {
  display: block;
  font-size: 0.75rem;
  color: #dc3545;
  margin-top: 0.25rem;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  font-weight: 600;
}
</style>
