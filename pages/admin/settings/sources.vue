<template>
  <div class="leads-sources-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-left">
        <PrimeButton
          icon="pi pi-arrow-left"
          severity="secondary"
          text
          rounded
          class="back-button"
          @click="navigateBack"
          v-tooltip.top="$t('admin.settings.sources.backToSettings')"
        />
        <div>
          <h1 class="page-title">{{ $t('admin.settings.sources.title') }}</h1>
          <p class="page-subtitle">
            {{ $t('admin.settings.sources.subtitle') }}
          </p>
        </div>
      </div>
      <div class="page-header-actions">
        <PrimeButton
          :label="$t('admin.settings.sources.newSource')"
          icon="pi pi-plus"
          @click="openCreateDialog"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon bg-primary-100 text-primary-700">
          <i class="pi pi-database"></i>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ sources.length }}</span>
          <span class="stat-label">{{ $t('admin.settings.sources.stats.totalSources') }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon bg-green-100 text-green-700">
          <i class="pi pi-check-circle"></i>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ activeSources.length }}</span>
          <span class="stat-label">{{ $t('admin.settings.sources.stats.active') }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon bg-gray-100 text-gray-700">
          <i class="pi pi-ban"></i>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ inactiveSources.length }}</span>
          <span class="stat-label">{{ $t('admin.settings.sources.stats.inactive') }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon bg-blue-100 text-blue-700">
          <i class="pi pi-key"></i>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ sourcesWithApiKey.length }}</span>
          <span class="stat-label">{{ $t('admin.settings.sources.stats.withApiKey') }}</span>
        </div>
      </div>
    </div>

    <!-- Info Banner -->
    <PrimeMessage severity="info" :closable="false" class="mb-6">
      <div class="flex items-center gap-2">
        <i class="pi pi-info-circle"></i>
        <span>
          {{ $t('admin.settings.sources.infoBanner') }}
        </span>
      </div>
    </PrimeMessage>

    <!-- Sources Table -->
    <PrimeCard class="q-card">
      <template #content>
        <PrimeDataTable
          :value="sources"
          :loading="loading"
          dataKey="id"
          stripedRows
          :rowHover="true"
          responsiveLayout="scroll"
          class="leads-sources-table"
        >
          <template #empty>
            <div class="empty-state">
              <div class="empty-icon">
                <i class="pi pi-database"></i>
              </div>
              <h3>{{ $t('admin.settings.sources.emptyState.title') }}</h3>
              <p>{{ $t('admin.settings.sources.emptyState.description') }}</p>
              <PrimeButton
                :label="$t('admin.settings.sources.emptyState.createButton')"
                icon="pi pi-plus"
                @click="openCreateDialog"
              />
            </div>
          </template>

          <!-- Nome -->
          <PrimeColumn field="name" :header="$t('admin.settings.sources.headers.name')" :sortable="true" style="min-width: 200px">
            <template #body="{ data }">
              <div class="source-name">
                <div class="source-icon" :class="data.is_active ? 'active' : 'inactive'">
                  <i :class="getSourceIcon(data.slug)"></i>
                </div>
                <div>
                  <span class="font-medium">{{ data.name }}</span>
                  <span class="text-sm text-gray-500 block">{{ data.slug }}</span>
                </div>
              </div>
            </template>
          </PrimeColumn>

          <!-- Descrizione -->
          <PrimeColumn field="description" :header="$t('admin.settings.sources.headers.description')" style="min-width: 250px">
            <template #body="{ data }">
              <span class="text-gray-600">{{ data.description || '-' }}</span>
            </template>
          </PrimeColumn>

          <!-- API Key -->
          <PrimeColumn :header="$t('admin.settings.sources.headers.apiKey')" style="min-width: 300px">
            <template #body="{ data }">
              <div v-if="data.api_key" class="api-key-field">
                <code class="api-key-code">
                  {{ showApiKey[data.id] ? data.api_key : maskApiKey(data.api_key) }}
                </code>
                <div class="api-key-actions">
                  <PrimeButton
                    :icon="showApiKey[data.id] ? 'pi pi-eye-slash' : 'pi pi-eye'"
                    text
                    rounded
                    size="small"
                    @click="toggleApiKeyVisibility(data.id)"
                    v-tooltip.top="showApiKey[data.id] ? $t('admin.settings.sources.tooltip.hide') : $t('admin.settings.sources.tooltip.show')"
                  />
                  <PrimeButton
                    icon="pi pi-copy"
                    text
                    rounded
                    size="small"
                    @click="copyApiKey(data.api_key)"
                    v-tooltip.top="$t('admin.settings.sources.tooltip.copy')"
                  />
                  <PrimeButton
                    icon="pi pi-refresh"
                    text
                    rounded
                    size="small"
                    severity="warning"
                    @click="confirmRegenerateKey(data)"
                    v-tooltip.top="$t('admin.settings.sources.tooltip.regenerate')"
                  />
                </div>
              </div>
              <span v-else class="text-gray-400 italic">{{ $t('admin.settings.sources.apiKeyNotConfigured') }}</span>
            </template>
          </PrimeColumn>

          <!-- Lead Count -->
          <PrimeColumn :header="$t('admin.settings.sources.headers.leads')" style="width: 100px">
            <template #body="{ data }">
              <PrimeTag :value="getLeadCountBySource(data.id)" rounded />
            </template>
          </PrimeColumn>

          <!-- Stato -->
          <PrimeColumn field="is_active" :header="$t('admin.settings.sources.headers.status')" style="width: 120px">
            <template #body="{ data }">
              <PrimeTag
                :value="data.is_active ? $t('admin.settings.sources.statusActive') : $t('admin.settings.sources.statusInactive')"
                :severity="data.is_active ? 'success' : 'secondary'"
                :icon="data.is_active ? 'pi pi-check' : 'pi pi-times'"
              />
            </template>
          </PrimeColumn>

          <!-- Data Creazione -->
          <PrimeColumn field="created_at" :header="$t('admin.settings.sources.headers.created')" :sortable="true" style="width: 130px">
            <template #body="{ data }">
              <span class="text-gray-600">{{ formatDate(data.created_at) }}</span>
            </template>
          </PrimeColumn>

          <!-- Azioni -->
          <PrimeColumn :header="$t('admin.settings.sources.headers.actions')" style="width: 120px" frozen alignFrozen="right">
            <template #body="{ data }">
              <div class="actions-cell">
                <PrimeButton
                  icon="pi pi-pencil"
                  text
                  rounded
                  severity="secondary"
                  @click="openEditDialog(data)"
                  v-tooltip.top="$t('admin.settings.sources.tooltip.edit')"
                />
                <PrimeButton
                  icon="pi pi-trash"
                  text
                  rounded
                  severity="danger"
                  :disabled="!canDeleteSource(data)"
                  @click="confirmDeleteSource(data)"
                  v-tooltip.top="canDeleteSource(data) ? $t('admin.settings.sources.tooltip.delete') : $t('admin.settings.sources.tooltip.hasLeads')"
                />
              </div>
            </template>
          </PrimeColumn>
        </PrimeDataTable>
      </template>
    </PrimeCard>

    <!-- API Documentation -->
    <PrimeCard class="q-card mt-6">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-book"></i>
          <span>{{ $t('admin.settings.sources.apiDocs.title') }}</span>
        </div>
      </template>
      <template #content>
        <div class="api-docs">
          <h4 class="text-lg font-semibold mb-3">{{ $t('admin.settings.sources.apiDocs.endpoint') }}</h4>

          <div class="code-block">
            <code>POST /api/external/leads</code>
          </div>

          <h4 class="text-lg font-semibold mt-6 mb-3">{{ $t('admin.settings.sources.apiDocs.requiredHeaders') }}</h4>
          <div class="code-block">
            <pre>Content-Type: application/json
X-API-Key: {api_key}</pre>
          </div>

          <h4 class="text-lg font-semibold mt-6 mb-3">{{ $t('admin.settings.sources.apiDocs.examplePayload') }}</h4>
          <div class="code-block">
            <pre>{
  "first_name": "Mario",
  "last_name": "Rossi",
  "email": "mario.rossi@email.it",
  "phone": "+39 333 1234567",
  "category_slug": "ristrutturazioni",
  "province_code": "MI",
  "request_text": "Richiedo preventivo per...",
  "external_id": "ext_12345"
}</pre>
          </div>

          <h4 class="text-lg font-semibold mt-6 mb-3">{{ $t('admin.settings.sources.apiDocs.successResponse') }}</h4>
          <div class="code-block">
            <pre>{
  "success": true,
  "data": {
    "id": 123,
    "status": "free"
  }
}</pre>
          </div>
        </div>
      </template>
    </PrimeCard>

    <!-- Create/Edit Dialog -->
    <PrimeDialog
      v-model:visible="dialogVisible"
      :header="isEditing ? $t('admin.settings.sources.dialog.editTitle') : $t('admin.settings.sources.dialog.createTitle')"
      :modal="true"
      :closable="!saving"
      :closeOnEscape="!saving"
      :style="{ width: '500px' }"
      class="source-dialog"
    >
      <div class="dialog-content">
        <!-- Nome -->
        <div class="form-group">
          <label for="source-name" class="form-label required">
            {{ $t('admin.settings.sources.dialog.sourceName') }}
          </label>
          <PrimeInputText
            id="source-name"
            v-model="form.name"
            :placeholder="$t('admin.settings.sources.dialog.sourceNamePlaceholder')"
            class="w-full"
            :class="{ 'p-invalid': errors.name }"
            @blur="validateField('name', form.name)"
            @input="generateSlug"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <!-- Slug -->
        <div class="form-group">
          <label for="source-slug" class="form-label required">
            {{ $t('admin.settings.sources.dialog.slug') }}
          </label>
          <PrimeInputText
            id="source-slug"
            v-model="form.slug"
            :placeholder="$t('admin.settings.sources.dialog.slugPlaceholder')"
            class="w-full"
            :class="{ 'p-invalid': errors.slug }"
            :disabled="isEditing"
            @blur="validateField('slug', form.slug)"
          />
          <small v-if="errors.slug" class="p-error">{{ errors.slug }}</small>
          <small v-else class="text-gray-500">
            {{ $t('admin.settings.sources.dialog.slugHint') }}
          </small>
        </div>

        <!-- Descrizione -->
        <div class="form-group">
          <label for="source-description" class="form-label">
            {{ $t('admin.settings.sources.dialog.description') }}
          </label>
          <PrimeTextarea
            id="source-description"
            v-model="form.description"
            :placeholder="$t('admin.settings.sources.dialog.descriptionPlaceholder')"
            class="w-full"
            rows="3"
            autoResize
          />
        </div>

        <!-- Stato Attivo -->
        <div class="form-group">
          <div class="flex items-center gap-3">
            <PrimeToggleSwitch v-model="form.is_active" inputId="source-active" />
            <label for="source-active" class="form-label mb-0 cursor-pointer">
              {{ $t('admin.settings.sources.dialog.activeSource') }}
            </label>
          </div>
          <small class="text-gray-500 block mt-1">
            {{ $t('admin.settings.sources.dialog.activeSourceHint') }}
          </small>
        </div>

        <!-- Genera API Key (solo per nuove sorgenti) -->
        <div v-if="!isEditing" class="form-group">
          <div class="flex items-center gap-3">
            <PrimeCheckbox v-model="generateApiKey" inputId="generate-api-key" :binary="true" />
            <label for="generate-api-key" class="form-label mb-0 cursor-pointer">
              {{ $t('admin.settings.sources.dialog.generateApiKey') }}
            </label>
          </div>
          <small class="text-gray-500 block mt-1">
            {{ $t('admin.settings.sources.dialog.generateApiKeyHint') }}
          </small>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <PrimeButton
            :label="$t('admin.settings.sources.dialog.cancel')"
            severity="secondary"
            text
            @click="closeDialog"
            :disabled="saving"
          />
          <PrimeButton
            :label="isEditing ? $t('admin.settings.sources.dialog.saveChanges') : $t('admin.settings.sources.dialog.createSource')"
            :icon="saving ? 'pi pi-spinner pi-spin' : 'pi pi-check'"
            :loading="saving"
            @click="saveSource"
          />
        </div>
      </template>
    </PrimeDialog>

    <!-- API Key Display Dialog -->
    <PrimeDialog
      v-model:visible="apiKeyDialogVisible"
      :header="$t('admin.settings.sources.apiKeyDialog.title')"
      :modal="true"
      :closable="true"
      :style="{ width: '550px' }"
    >
      <div class="api-key-display">
        <PrimeMessage severity="warn" :closable="false" class="mb-4">
          <i class="pi pi-exclamation-triangle mr-2"></i>
          {{ $t('admin.settings.sources.apiKeyDialog.warning') }}
        </PrimeMessage>

        <div class="api-key-box">
          <code class="api-key-full">{{ newApiKey }}</code>
          <PrimeButton
            icon="pi pi-copy"
            :label="$t('admin.settings.sources.tooltip.copy')"
            severity="secondary"
            @click="copyApiKey(newApiKey)"
          />
        </div>
      </div>

      <template #footer>
        <PrimeButton
          :label="$t('admin.settings.sources.apiKeyDialog.copied')"
          icon="pi pi-check"
          @click="apiKeyDialogVisible = false"
        />
      </template>
    </PrimeDialog>

    <!-- Confirm Dialog -->
    <PrimeConfirmDialog />
    <PrimeToast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useLeadStore } from '~/stores/leads'
import { useLeadSourceValidation, useLeadFormatters, useLeadActions } from '~/composables/useLead'
import type { LeadSource, LeadSourceCreateForm } from '~/types/lead'

// Page meta
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

// i18n
const { t } = useI18n()

// Store
const leadStore = useLeadStore()
const router = useRouter()

// Navigation
const navigateBack = () => {
  router.push('/admin/settings')
}

// Composables
const { errors, validateField, clearErrors, hasErrors } = useLeadSourceValidation()
const { formatDate } = useLeadFormatters()
const { showSuccess, showError, showWarning } = useLeadActions()
const confirm = useConfirm()
const toast = useToast()

// State
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const apiKeyDialogVisible = ref(false)
const isEditing = ref(false)
const currentSource = ref<LeadSource | null>(null)
const generateApiKey = ref(true)
const newApiKey = ref('')
const showApiKey = ref<Record<number, boolean>>({})

// Form
const form = reactive<LeadSourceCreateForm>({
  name: '',
  slug: '',
  description: '',
  is_active: true
})

// Computed
const sources = computed(() => leadStore.sources)
const activeSources = computed(() => sources.value.filter(s => s.is_active))
const inactiveSources = computed(() => sources.value.filter(s => !s.is_active))
const sourcesWithApiKey = computed(() => sources.value.filter(s => s.api_key))

// Methods
const loadData = async () => {
  loading.value = true
  try {
    await Promise.all([
      leadStore.fetchSources(),
      leadStore.fetchLeads()
    ])
  } finally {
    loading.value = false
  }
}

const getSourceIcon = (slug: string): string => {
  const icons: Record<string, string> = {
    'meta-ads': 'pi pi-facebook',
    'google-ads': 'pi pi-google',
    'website': 'pi pi-globe',
    'manual': 'pi pi-user',
    'zapier': 'pi pi-bolt',
    'webhook': 'pi pi-code'
  }
  return icons[slug] || 'pi pi-database'
}

const maskApiKey = (key: string): string => {
  if (!key || key.length < 8) return '••••••••'
  return key.substring(0, 8) + '••••••••'
}

const toggleApiKeyVisibility = (id: number) => {
  showApiKey.value[id] = !showApiKey.value[id]
}

const copyApiKey = async (key: string) => {
  try {
    await navigator.clipboard.writeText(key)
    showSuccess(t('admin.settings.sources.toast.apiKeyCopied'))
  } catch {
    showError(t('admin.settings.sources.toast.apiKeyCopyError'))
  }
}

const getLeadCountBySource = (sourceId: number): string => {
  const count = leadStore.leads.filter(l => l.source_id === sourceId).length
  return String(count)
}

const canDeleteSource = (source: LeadSource): boolean => {
  const hasLeads = leadStore.leads.some(l => l.source_id === source.id)
  return !hasLeads && source.slug !== 'manual'
}

const generateSlug = () => {
  if (!isEditing.value && form.name) {
    form.slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  currentSource.value = null
  clearErrors()
  form.name = ''
  form.slug = ''
  form.description = ''
  form.is_active = true
  generateApiKey.value = true
  dialogVisible.value = true
}

const openEditDialog = (source: LeadSource) => {
  isEditing.value = true
  currentSource.value = source
  clearErrors()
  form.name = source.name
  form.slug = source.slug
  form.description = source.description || ''
  form.is_active = source.is_active
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  currentSource.value = null
}

const saveSource = async () => {
  // Validazione
  let isValid = true
  isValid = validateField('name', form.name) && isValid
  if (!isEditing.value) {
    isValid = validateField('slug', form.slug) && isValid
  }

  if (!isValid) {
    showError(t('admin.settings.toast.formError'))
    return
  }

  saving.value = true

  try {
    if (isEditing.value && currentSource.value) {
      // Update
      const result = await leadStore.updateSource(currentSource.value.id, {
        name: form.name,
        description: form.description,
        is_active: form.is_active
      })

      if (result) {
        showSuccess(t('admin.settings.sources.toast.sourceUpdated'))
        closeDialog()
      } else {
        showError(leadStore.error || t('admin.settings.sources.toast.updateError'))
      }
    } else {
      // Create
      const result = await leadStore.createSource({
        name: form.name,
        slug: form.slug,
        description: form.description,
        is_active: form.is_active
      })

      if (result) {
        showSuccess(t('admin.settings.sources.toast.sourceCreated'))
        closeDialog()

        // Se è stata generata una API key, mostrala
        if (generateApiKey.value && result.api_key) {
          newApiKey.value = result.api_key
          apiKeyDialogVisible.value = true
        }
      } else {
        showError(leadStore.error || t('admin.settings.sources.toast.createError'))
      }
    }
  } finally {
    saving.value = false
  }
}

const confirmRegenerateKey = (source: LeadSource) => {
  confirm.require({
    message: t('admin.settings.sources.confirmRegenerate.message', { name: source.name }),
    header: t('admin.settings.sources.confirmRegenerate.header'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-warning',
    acceptLabel: t('admin.settings.sources.confirmRegenerate.accept'),
    rejectLabel: t('admin.settings.sources.confirmRegenerate.reject'),
    accept: async () => {
      saving.value = true
      try {
        const newKey = await leadStore.regenerateApiKey(source.id)
        if (newKey) {
          newApiKey.value = newKey
          apiKeyDialogVisible.value = true
          showSuccess(t('admin.settings.sources.toast.apiKeyRegenerated'))
        } else {
          showError(leadStore.error || t('admin.settings.sources.toast.regenerateError'))
        }
      } finally {
        saving.value = false
      }
    }
  })
}

const confirmDeleteSource = (source: LeadSource) => {
  confirm.require({
    message: t('admin.settings.sources.confirmDelete.message', { name: source.name }),
    header: t('admin.settings.sources.confirmDelete.header'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    acceptLabel: t('admin.settings.sources.confirmDelete.accept'),
    rejectLabel: t('admin.settings.sources.confirmDelete.reject'),
    accept: async () => {
      saving.value = true
      try {
        const success = await leadStore.deleteSource(source.id)
        if (success) {
          showSuccess(t('admin.settings.sources.toast.sourceDeleted'))
        } else {
          showError(leadStore.error || t('admin.settings.sources.toast.deleteError'))
        }
      } finally {
        saving.value = false
      }
    }
  })
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.leads-sources-page {
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.page-header-left {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.back-button {
  margin-top: 0.25rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
}

.page-subtitle {
  color: var(--color-gray-500);
  margin-top: 0.25rem;
  margin-bottom: 0;
}

// Stats Grid
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-gray-900);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-gray-500);
}

// Table styles
.q-card {
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.source-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.source-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;

  &.active {
    background: var(--green-100);
    color: var(--green-700);
  }

  &.inactive {
    background: var(--gray-100);
    color: var(--gray-500);
  }
}

.api-key-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.api-key-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8125rem;
  background: var(--gray-100);
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  color: var(--gray-700);
}

.api-key-actions {
  display: flex;
  gap: 0.25rem;
}

.actions-cell {
  display: flex;
  gap: 0.25rem;
}

// Empty state
.empty-state {
  text-align: center;
  padding: 3rem 2rem;

  .empty-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    background: var(--gray-100);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 2rem;
      color: var(--gray-400);
    }
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--gray-500);
    margin-bottom: 1.5rem;
  }
}

// API Documentation
.api-docs {
  h4 {
    color: var(--gray-900);
  }
}

.code-block {
  background: var(--gray-900);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;

  code, pre {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.875rem;
    color: var(--green-400);
    margin: 0;
    white-space: pre;
  }
}

// Dialog
.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--color-gray-700);

  &.required::after {
    content: ' *';
    color: var(--red-500);
  }
}

// API Key Display Dialog
.api-key-display {
  .api-key-box {
    background: var(--gray-100);
    border: 1px solid var(--gray-200);
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .api-key-full {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9375rem;
    word-break: break-all;
    text-align: center;
    color: var(--gray-800);
  }
}

// Utility classes
.bg-primary-100 {
  background-color: rgba(15, 52, 96, 0.1);
}

.text-primary-700 {
  color: var(--color-primary-700, #0F3460);
}

.bg-green-100 {
  background-color: rgba(34, 197, 94, 0.1);
}

.text-green-700 {
  color: rgb(21, 128, 61);
}

.bg-gray-100 {
  background-color: var(--gray-100);
}

.text-gray-700 {
  color: var(--gray-700);
}

.bg-blue-100 {
  background-color: rgba(59, 130, 246, 0.1);
}

.text-blue-700 {
  color: rgb(29, 78, 216);
}
</style>
