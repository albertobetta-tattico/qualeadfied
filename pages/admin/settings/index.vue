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

// i18n
const { t } = useI18n()

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
  router.push('/admin/settings/sources')
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
    showSuccess(t('admin.settings.toast.configSaved'))
  } else {
    showError(settingsStore.error || t('admin.settings.toast.configError'))
  }
}

const loadNotifications = async () => {
  await settingsStore.fetchNotificationConfigs()
}

const updateNotificationFrequency = async (categoryId: number, frequency: NotificationFrequency) => {
  const success = await settingsStore.updateNotificationConfig(categoryId, { frequency })
  if (success) {
    showSuccess(t('admin.settings.toast.notificationUpdated'))
  } else {
    showError(settingsStore.error || t('admin.settings.toast.notificationError'))
  }
}

const toggleNotification = async (categoryId: number, enabled: boolean) => {
  const success = await settingsStore.updateNotificationConfig(categoryId, { enabled })
  if (success) {
    showSuccess(enabled ? t('admin.settings.toast.notificationEnabled') : t('admin.settings.toast.notificationDisabled'))
  } else {
    showError(settingsStore.error || t('admin.settings.toast.notificationError'))
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
    showError(t('admin.settings.toast.formError'))
    return
  }

  if (isCreate) {
    const result = await settingsStore.createOperator(operatorForm)
    if (result) {
      showSuccess(t('admin.settings.toast.operatorCreated'))
      operatorDialog.value = false
    } else {
      showError(settingsStore.error || t('admin.settings.toast.operatorError'))
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
      showSuccess(t('admin.settings.toast.operatorUpdated'))
      operatorDialog.value = false
    } else {
      showError(settingsStore.error || t('admin.settings.toast.operatorError'))
    }
  }
}

const handleDeleteOperator = (operator: AdminOperator) => {
  confirmDeleteOperator(operator, async () => {
    const success = await settingsStore.deleteOperator(operator.id)
    if (success) {
      showSuccess(t('admin.settings.toast.operatorDeleted'))
    } else {
      showError(settingsStore.error || t('admin.settings.toast.operatorError'))
    }
  })
}

const handleResetPassword = (operator: AdminOperator) => {
  confirmResetPassword(operator, async () => {
    const success = await settingsStore.resetOperatorPassword(operator.id)
    if (success) {
      showSuccess(t('admin.settings.toast.resetPasswordSent', { email: operator.email }))
    } else {
      showError(settingsStore.error || t('admin.settings.toast.resetPasswordError'))
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
        showSuccess(t('admin.settings.toast.operatorDeactivated'))
      } else {
        showError(settingsStore.error || t('admin.settings.toast.operatorError'))
      }
    })
  } else {
    const success = await settingsStore.updateOperator(operator.id, {
      ...operator,
      status: newStatus
    })
    if (success) {
      showSuccess(t('admin.settings.toast.operatorReactivated'))
    } else {
      showError(settingsStore.error || t('admin.settings.toast.operatorError'))
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
    showError(t('admin.settings.toast.emailRequired'))
    return
  }

  const success = await settingsStore.testEmailConfig(testEmailAddress.value)
  if (success) {
    showSuccess(t('admin.settings.toast.testEmailSent'))
    testEmailDialog.value = false
  } else {
    showError(settingsStore.error || t('admin.settings.toast.testEmailError'))
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
        <h1 class="page-title">{{ $t('admin.settings.title') }}</h1>
        <p class="page-subtitle">{{ $t('admin.settings.subtitle') }}</p>
      </div>
      <div class="page-header-actions">
        <PrimeButton
          :label="$t('admin.settings.leadSources')"
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
      <PrimeTabPanel value="0" :header="$t('admin.settings.tabs.systemConfig')">
        <div class="pt-4 max-w-3xl">
          <form @submit.prevent="saveSystemConfig" class="space-y-6">
            <!-- Lead e Trial -->
            <div class="bg-neutral-50 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">
                <i class="pi pi-gift mr-2"></i>{{ $t('admin.settings.systemConfig.leadAndTrial') }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="free_trial_leads">{{ $t('admin.settings.systemConfig.freeTrialLeads') }}</label>
                  <PrimeInputNumber
                    id="free_trial_leads"
                    v-model="systemConfigForm.default_free_trial_leads"
                    :min="0"
                    :max="100"
                    class="w-full"
                  />
                  <small class="text-neutral-500">{{ $t('admin.settings.systemConfig.freeTrialLeadsHint') }}</small>
                </div>
              </div>
            </div>

            <!-- Fatturazione -->
            <div class="bg-neutral-50 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">
                <i class="pi pi-file mr-2"></i>{{ $t('admin.settings.systemConfig.billing') }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="vat_rate">{{ $t('admin.settings.systemConfig.vatRate') }}</label>
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
                  <label for="order_prefix">{{ $t('admin.settings.systemConfig.orderPrefix') }}</label>
                  <PrimeInputText
                    id="order_prefix"
                    v-model="systemConfigForm.order_number_prefix"
                    class="w-full"
                    :placeholder="$t('admin.settings.systemConfig.orderPrefixPlaceholder')"
                  />
                </div>
                <div class="form-group">
                  <label for="invoice_prefix">{{ $t('admin.settings.systemConfig.invoicePrefix') }}</label>
                  <PrimeInputText
                    id="invoice_prefix"
                    v-model="systemConfigForm.invoice_number_prefix"
                    class="w-full"
                    :placeholder="$t('admin.settings.systemConfig.invoicePrefixPlaceholder')"
                  />
                </div>
              </div>
            </div>

            <!-- Email -->
            <div class="bg-neutral-50 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">
                <i class="pi pi-envelope mr-2"></i>{{ $t('admin.settings.systemConfig.email') }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="sender_email">{{ $t('admin.settings.systemConfig.senderEmail') }}</label>
                  <PrimeInputText
                    id="sender_email"
                    v-model="systemConfigForm.sender_email"
                    type="email"
                    class="w-full"
                    placeholder="noreply@qualeadfied.com"
                  />
                </div>
                <div class="form-group">
                  <label for="sender_name">{{ $t('admin.settings.systemConfig.senderName') }}</label>
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
                  :label="$t('admin.settings.systemConfig.sendTestEmail')"
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
                :label="$t('admin.settings.systemConfig.saveConfig')"
                icon="pi pi-check"
                severity="primary"
                :loading="saving"
              />
            </div>
          </form>
        </div>
      </PrimeTabPanel>

      <!-- Tab: Notifiche Email -->
      <PrimeTabPanel value="1" :header="$t('admin.settings.tabs.emailNotifications')">
        <div class="pt-4">
          <p class="text-neutral-600 mb-6">
            {{ $t('admin.settings.emailNotifications.description') }}
          </p>

          <div class="overflow-x-auto">
            <PrimeDataTable
              :value="notificationConfigs"
              :loading="loading"
              stripedRows
              class="text-sm"
            >
              <PrimeColumn field="category_name" :header="$t('admin.settings.emailNotifications.headers.category')" style="min-width: 200px">
                <template #body="{ data }">
                  <span class="font-medium text-neutral-900">{{ data.category_name }}</span>
                </template>
              </PrimeColumn>

              <PrimeColumn field="enabled" :header="$t('admin.settings.emailNotifications.headers.enabled')" style="width: 120px">
                <template #body="{ data }">
                  <PrimeToggleSwitch
                    :modelValue="data.enabled"
                    @update:modelValue="(val: boolean) => toggleNotification(data.category_id, val)"
                  />
                </template>
              </PrimeColumn>

              <PrimeColumn field="frequency" :header="$t('admin.settings.emailNotifications.headers.frequency')" style="min-width: 180px">
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

              <PrimeColumn :header="$t('admin.settings.emailNotifications.headers.description')" style="min-width: 250px">
                <template #body="{ data }">
                  <span class="text-sm text-neutral-500">
                    <template v-if="!data.enabled">{{ $t('admin.settings.emailNotifications.descriptions.disabled') }}</template>
                    <template v-else-if="data.frequency === 'instant'">{{ $t('admin.settings.emailNotifications.descriptions.instant') }}</template>
                    <template v-else-if="data.frequency === 'hourly'">{{ $t('admin.settings.emailNotifications.descriptions.hourly') }}</template>
                    <template v-else-if="data.frequency === 'daily'">{{ $t('admin.settings.emailNotifications.descriptions.daily') }}</template>
                    <template v-else-if="data.frequency === 'weekly'">{{ $t('admin.settings.emailNotifications.descriptions.weekly') }}</template>
                    <template v-else>{{ $t('admin.settings.emailNotifications.descriptions.disabled') }}</template>
                  </span>
                </template>
              </PrimeColumn>
            </PrimeDataTable>
          </div>
        </div>
      </PrimeTabPanel>

      <!-- Tab: Operatori Admin -->
      <PrimeTabPanel value="2" :header="$t('admin.settings.tabs.adminOperators')">
        <div class="pt-4">
          <div class="flex justify-between items-center mb-6">
            <p class="text-neutral-600">
              {{ $t('admin.settings.operators.description') }}
            </p>
            <PrimeButton
              :label="$t('admin.settings.operators.newOperator')"
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
            <PrimeColumn :header="$t('admin.settings.operators.headers.operator')" style="min-width: 250px">
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

            <PrimeColumn field="role" :header="$t('admin.settings.operators.headers.role')" style="min-width: 140px">
              <template #body="{ data }">
                <PrimeTag
                  :value="formatRole(data.role)"
                  :severity="getRoleSeverity(data.role)"
                />
              </template>
            </PrimeColumn>

            <PrimeColumn field="status" :header="$t('admin.settings.operators.headers.status')" style="min-width: 120px">
              <template #body="{ data }">
                <PrimeTag
                  :value="formatStatus(data.status)"
                  :severity="getStatusSeverity(data.status)"
                />
              </template>
            </PrimeColumn>

            <PrimeColumn field="last_login_at" :header="$t('admin.settings.operators.headers.lastAccess')" style="min-width: 150px">
              <template #body="{ data }">
                <span class="text-neutral-600">{{ formatRelativeTime(data.last_login_at) }}</span>
              </template>
            </PrimeColumn>

            <PrimeColumn :header="$t('admin.settings.operators.headers.actions')" style="min-width: 150px">
              <template #body="{ data }">
                <div class="flex gap-1">
                  <PrimeButton
                    icon="pi pi-pencil"
                    severity="primary"
                    text
                    rounded
                    size="small"
                    v-tooltip.top="$t('admin.settings.operators.tooltip.edit')"
                    @click="openEditOperator(data)"
                  />
                  <PrimeButton
                    icon="pi pi-key"
                    severity="secondary"
                    text
                    rounded
                    size="small"
                    v-tooltip.top="$t('admin.settings.operators.tooltip.resetPassword')"
                    @click="handleResetPassword(data)"
                  />
                  <PrimeButton
                    :icon="data.status === 'active' ? 'pi pi-user-minus' : 'pi pi-user-plus'"
                    :severity="data.status === 'active' ? 'warning' : 'success'"
                    text
                    rounded
                    size="small"
                    v-tooltip.top="data.status === 'active' ? $t('admin.settings.operators.tooltip.deactivate') : $t('admin.settings.operators.tooltip.reactivate')"
                    @click="handleToggleStatus(data)"
                  />
                  <PrimeButton
                    icon="pi pi-trash"
                    severity="danger"
                    text
                    rounded
                    size="small"
                    v-tooltip.top="$t('admin.settings.operators.tooltip.delete')"
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
      <PrimeTabPanel value="3" :header="$t('admin.settings.tabs.activityLog')">
        <div class="pt-4">
          <!-- Filters -->
          <div class="flex flex-wrap gap-4 mb-6">
            <div class="flex-1 min-w-48 max-w-xs">
              <PrimeInputText
                v-model="logSearchQuery"
                :placeholder="$t('admin.settings.activityLog.search')"
                class="w-full"
                @keyup.enter="applyLogFilters"
              />
            </div>
            <PrimeSelect
              v-model="logTypeFilter"
              :options="activityTypeOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('admin.settings.activityLog.typeFilter')"
              class="w-40"
              @change="applyLogFilters"
            />
            <PrimeSelect
              v-model="logEntityFilter"
              :options="activityEntityOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('admin.settings.activityLog.entityFilter')"
              class="w-40"
              @change="applyLogFilters"
            />
            <PrimeButton
              icon="pi pi-filter-slash"
              severity="secondary"
              outlined
              v-tooltip.top="$t('admin.settings.activityLog.clearFilters')"
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
                <p class="text-neutral-600">{{ $t('admin.settings.activityLog.empty') }}</p>
              </div>
            </template>

            <PrimeColumn field="created_at" :header="$t('admin.settings.activityLog.headers.date')" style="min-width: 160px">
              <template #body="{ data }">
                <span class="text-neutral-600">{{ formatDateTime(data.created_at) }}</span>
              </template>
            </PrimeColumn>

            <PrimeColumn field="type" :header="$t('admin.settings.activityLog.headers.type')" style="min-width: 130px">
              <template #body="{ data }">
                <PrimeTag
                  :value="formatActivityType(data.type)"
                  :severity="getActivityTypeSeverity(data.type)"
                  :icon="getActivityTypeIcon(data.type)"
                />
              </template>
            </PrimeColumn>

            <PrimeColumn field="admin_name" :header="$t('admin.settings.activityLog.headers.operator')" style="min-width: 180px">
              <template #body="{ data }">
                <div>
                  <div class="font-medium text-neutral-900">{{ data.admin_name }}</div>
                  <div class="text-xs text-neutral-500">{{ data.admin_email }}</div>
                </div>
              </template>
            </PrimeColumn>

            <PrimeColumn field="entity" :header="$t('admin.settings.activityLog.headers.entity')" style="min-width: 120px">
              <template #body="{ data }">
                <span class="text-neutral-700">{{ formatEntity(data.entity) }}</span>
              </template>
            </PrimeColumn>

            <PrimeColumn field="description" :header="$t('admin.settings.activityLog.headers.description')" style="min-width: 300px">
              <template #body="{ data }">
                <span class="text-neutral-800">{{ data.description }}</span>
              </template>
            </PrimeColumn>

            <PrimeColumn field="ip_address" :header="$t('admin.settings.activityLog.headers.ip')" style="min-width: 130px">
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
      :header="operatorDialogMode === 'create' ? $t('admin.settings.operators.dialog.createTitle') : $t('admin.settings.operators.dialog.editTitle')"
      :style="{ width: '500px' }"
    >
      <form @submit.prevent="saveOperator" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label for="op_first_name">{{ $t('admin.settings.operators.dialog.firstName') }} *</label>
            <PrimeInputText
              id="op_first_name"
              v-model="operatorForm.first_name"
              :class="{ 'p-invalid': errors.first_name }"
              class="w-full"
            />
            <small v-if="errors.first_name" class="p-error">{{ errors.first_name }}</small>
          </div>
          <div class="form-group">
            <label for="op_last_name">{{ $t('admin.settings.operators.dialog.lastName') }} *</label>
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
          <label for="op_email">{{ $t('admin.settings.operators.dialog.email') }} *</label>
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
          <label for="op_role">{{ $t('admin.settings.operators.dialog.role') }} *</label>
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
              <label for="op_password">{{ $t('admin.settings.operators.dialog.password') }} *</label>
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
              <label for="op_password_confirm">{{ $t('admin.settings.operators.dialog.passwordConfirmation') }} *</label>
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
            :label="$t('admin.settings.operators.dialog.cancel')"
            severity="secondary"
            outlined
            @click="operatorDialog = false"
          />
          <PrimeButton
            :label="operatorDialogMode === 'create' ? $t('admin.settings.operators.dialog.createButton') : $t('admin.settings.operators.dialog.editButton')"
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
      :header="$t('admin.settings.testEmail.dialogTitle')"
      :style="{ width: '400px' }"
    >
      <div class="space-y-4">
        <p class="text-neutral-600">
          {{ $t('admin.settings.testEmail.description') }}
        </p>
        <div class="form-group">
          <label for="test_email">{{ $t('admin.settings.testEmail.recipient') }}</label>
          <PrimeInputText
            id="test_email"
            v-model="testEmailAddress"
            type="email"
            class="w-full"
            :placeholder="$t('admin.settings.testEmail.placeholder')"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <PrimeButton
            :label="$t('admin.settings.testEmail.cancel')"
            severity="secondary"
            outlined
            @click="testEmailDialog = false"
          />
          <PrimeButton
            :label="$t('admin.settings.testEmail.send')"
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
