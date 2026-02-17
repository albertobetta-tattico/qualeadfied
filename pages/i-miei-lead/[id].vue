<script setup lang="ts">
/**
 * Page - Lead Detail
 * Detailed view of a purchased lead with contact info and status management
 */
import type { ContactStatus } from '~/types/clientArea'

definePageMeta({
  layout: 'client'
})

const { t } = useI18n()
const route = useRoute('i-miei-lead-id')
const router = useRouter()
const leadId = computed(() => {
  const id = route.params.id
  return Number(Array.isArray(id) ? id[0] : id)
})

const myLeadsStore = useMyLeadsStore()
const {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatContactStatus,
  getContactStatusSeverity,
  formatAcquisitionType,
  getAcquisitionTypeSeverity,
  formatPhoneLink,
  formatEmailLink
} = useClientFormatters()
const { contactStatusOptions } = useClientFilterOptions()
const { showSuccess, showError } = useClientToast()

// Notes editing
const isEditingNotes = ref(false)
const editedNotes = ref('')

// Selected status for update
const selectedStatus = ref<ContactStatus | ''>('')

// Fetch lead on mount
onMounted(async () => {
  const lead = await myLeadsStore.fetchLead(leadId.value)
  if (lead) {
    selectedStatus.value = lead.contact_status
    editedNotes.value = lead.notes || ''
  } else {
    router.push('/i-miei-lead')
  }
})

// Current lead
const lead = computed(() => myLeadsStore.currentLead)

// Update status
const updateStatus = async () => {
  if (!selectedStatus.value || !lead.value) return

  const success = await myLeadsStore.updateLead(lead.value.id, {
    contact_status: selectedStatus.value
  })

  if (success) {
    showSuccess(t('leads.detail.toast.statusUpdated'))
  } else {
    showError(myLeadsStore.error || t('leads.detail.toast.errorUpdating'))
  }
}

// Watch status changes
watch(selectedStatus, (newStatus) => {
  if (newStatus && lead.value && newStatus !== lead.value.contact_status) {
    updateStatus()
  }
})

// Save notes
const saveNotes = async () => {
  if (!lead.value) return

  const success = await myLeadsStore.updateLead(lead.value.id, {
    notes: editedNotes.value
  })

  if (success) {
    showSuccess(t('leads.detail.toast.notesSaved'))
    isEditingNotes.value = false
  } else {
    showError(myLeadsStore.error || t('leads.detail.toast.errorSavingNotes'))
  }
}

// Cancel notes editing
const cancelNotesEdit = () => {
  editedNotes.value = lead.value?.notes || ''
  isEditingNotes.value = false
}

// Copy to clipboard
const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text)
  showSuccess(t('leads.detail.toast.copiedToClipboard', { label }))
}
</script>

<template>
  <div class="lead-detail-page">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/i-miei-lead" class="inline-flex items-center gap-2 text-primary hover:underline mb-4">
        <i class="pi pi-arrow-left"></i>
        {{ $t('leads.detail.backToLeads') }}
      </NuxtLink>

      <div v-if="lead" class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <PrimeTag :value="lead.lead.category?.name" severity="info" />
            <PrimeTag :value="lead.lead.province?.name" severity="secondary" />
            <PrimeTag v-if="lead.lead.province?.region" :value="lead.lead.province.region" severity="warn" />
            <PrimeTag
              :value="formatAcquisitionType(lead.acquisition_type)"
              :severity="getAcquisitionTypeSeverity(lead.acquisition_type)"
            />
          </div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">
            {{ lead.lead.first_name }} {{ lead.lead.last_name }}
          </h1>
          <p class="text-surface-600 dark:text-surface-400">
            {{ $t('leads.detail.purchasedOn', { date: formatDate(lead.purchased_at) }) }}
          </p>
        </div>

        <!-- Status Selector -->
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
            {{ $t('leads.detail.status') }}
          </label>
          <PrimeSelect
            v-model="selectedStatus"
            :options="contactStatusOptions.filter(o => o.value)"
            optionLabel="label"
            optionValue="value"
            class="w-48"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="myLeadsStore.loading" class="flex justify-center py-12">
      <PrimeProgressSpinner />
    </div>

    <!-- Lead Content -->
    <div v-else-if="lead" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Contact Information -->
        <PrimeCard>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-user text-primary"></i>
              {{ $t('leads.detail.contactInfo.title') }}
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Email -->
              <div class="flex items-center gap-4 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <i class="pi pi-envelope text-blue-500 text-xl"></i>
                </div>
                <div class="flex-grow">
                  <p class="text-sm text-surface-500 mb-1">{{ $t('leads.detail.contactInfo.email') }}</p>
                  <a
                    :href="formatEmailLink(lead.lead.email)"
                    class="font-medium text-surface-900 dark:text-surface-0 hover:text-primary"
                  >
                    {{ lead.lead.email }}
                  </a>
                </div>
                <PrimeButton
                  icon="pi pi-copy"
                  text
                  rounded
                  @click="copyToClipboard(lead.lead.email, $t('leads.detail.contactInfo.email'))"
                />
              </div>

              <!-- Phone -->
              <div class="flex items-center gap-4 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <i class="pi pi-phone text-green-500 text-xl"></i>
                </div>
                <div class="flex-grow">
                  <p class="text-sm text-surface-500 mb-1">{{ $t('leads.detail.contactInfo.phone') }}</p>
                  <a
                    :href="formatPhoneLink(lead.lead.phone)"
                    class="font-medium text-surface-900 dark:text-surface-0 hover:text-primary"
                  >
                    {{ lead.lead.phone }}
                  </a>
                </div>
                <PrimeButton
                  icon="pi pi-copy"
                  text
                  rounded
                  @click="copyToClipboard(lead.lead.phone, $t('leads.detail.contactInfo.phone'))"
                />
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex gap-2 mt-4">
              <a :href="formatEmailLink(lead.lead.email)">
                <PrimeButton :label="$t('leads.detail.contactInfo.sendEmail')" icon="pi pi-envelope" severity="secondary" />
              </a>
              <a :href="formatPhoneLink(lead.lead.phone)">
                <PrimeButton :label="$t('leads.detail.contactInfo.call')" icon="pi pi-phone" severity="secondary" />
              </a>
            </div>
          </template>
        </PrimeCard>

        <!-- Request Details -->
        <PrimeCard>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-file-edit text-primary"></i>
              {{ $t('leads.detail.requestDetails.title') }}
            </div>
          </template>
          <template #content>
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-surface-700 dark:text-surface-300 whitespace-pre-wrap">
                {{ lead.lead.request_text }}
              </p>
            </div>
            <div class="mt-4 pt-4 border-t border-surface-100 dark:border-surface-800">
              <p class="text-sm text-surface-500">
                <i class="pi pi-clock mr-1"></i>
                {{ $t('leads.detail.requestDetails.generatedAt', { time: formatRelativeTime(lead.lead.generated_at), date: formatDateTime(lead.lead.generated_at) }) }}
              </p>
            </div>
          </template>
        </PrimeCard>

        <!-- Notes -->
        <PrimeCard>
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="pi pi-comment text-primary"></i>
                {{ $t('leads.detail.notes.title') }}
              </div>
              <PrimeButton
                v-if="!isEditingNotes"
                icon="pi pi-pencil"
                text
                size="small"
                @click="isEditingNotes = true"
              />
            </div>
          </template>
          <template #content>
            <div v-if="isEditingNotes">
              <PrimeTextarea
                v-model="editedNotes"
                rows="5"
                class="w-full"
                :placeholder="$t('leads.detail.notes.placeholder')"
                autoResize
              />
              <div class="flex justify-end gap-2 mt-3">
                <PrimeButton
                  :label="$t('leads.detail.notes.cancel')"
                  severity="secondary"
                  @click="cancelNotesEdit"
                />
                <PrimeButton
                  :label="$t('leads.detail.notes.save')"
                  icon="pi pi-check"
                  :loading="myLeadsStore.saving"
                  @click="saveNotes"
                />
              </div>
            </div>
            <div v-else>
              <p
                v-if="lead.notes"
                class="text-surface-700 dark:text-surface-300 whitespace-pre-wrap"
              >
                {{ lead.notes }}
              </p>
              <div
                v-else
                class="text-center py-6 bg-surface-50 dark:bg-surface-800 rounded-lg cursor-pointer"
                @click="isEditingNotes = true"
              >
                <i class="pi pi-plus-circle text-2xl text-surface-300 dark:text-surface-600 mb-2"></i>
                <p class="text-surface-500">
                  {{ $t('leads.detail.notes.clickToAdd') }}
                </p>
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-4">
        <!-- Status Card -->
        <PrimeCard>
          <template #title>{{ $t('leads.detail.statusCard.title') }}</template>
          <template #content>
            <div class="text-center py-4">
              <PrimeTag
                :value="formatContactStatus(lead.contact_status)"
                :severity="getContactStatusSeverity(lead.contact_status)"
                class="text-lg px-4 py-2"
              />
            </div>

            <!-- Status Timeline -->
            <div class="mt-4 space-y-3">
              <div
                v-if="lead.last_contacted_at"
                class="flex items-center gap-3 text-sm"
              >
                <i class="pi pi-phone text-surface-400"></i>
                <div>
                  <p class="text-surface-600 dark:text-surface-400">{{ $t('leads.detail.statusCard.lastContact') }}</p>
                  <p class="text-surface-900 dark:text-surface-0">
                    {{ formatDateTime(lead.last_contacted_at) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <i class="pi pi-shopping-cart text-surface-400"></i>
                <div>
                  <p class="text-surface-600 dark:text-surface-400">{{ $t('leads.detail.statusCard.purchased') }}</p>
                  <p class="text-surface-900 dark:text-surface-0">
                    {{ formatDateTime(lead.purchased_at) }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </PrimeCard>

        <!-- Purchase Info -->
        <PrimeCard>
          <template #title>{{ $t('leads.detail.purchaseInfo.title') }}</template>
          <template #content>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-surface-600 dark:text-surface-400">{{ $t('leads.detail.purchaseInfo.price') }}</span>
                <span class="font-semibold text-surface-900 dark:text-surface-0">
                  {{ formatCurrency(lead.purchase_price) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-surface-600 dark:text-surface-400">{{ $t('leads.detail.purchaseInfo.mode') }}</span>
                <PrimeTag
                  :value="formatAcquisitionType(lead.acquisition_type)"
                  :severity="getAcquisitionTypeSeverity(lead.acquisition_type)"
                  size="small"
                />
              </div>
              <div v-if="lead.order_id" class="flex justify-between">
                <span class="text-surface-600 dark:text-surface-400">{{ $t('leads.detail.purchaseInfo.order') }}</span>
                <NuxtLink
                  :to="`/ordini/${lead.order_id}`"
                  class="text-primary hover:underline"
                >
                  #{{ lead.order_id }}
                </NuxtLink>
              </div>
            </div>
          </template>
        </PrimeCard>

        <!-- Actions -->
        <PrimeCard>
          <template #title>{{ $t('leads.detail.quickActions.title') }}</template>
          <template #content>
            <div class="space-y-2">
              <PrimeButton
                v-if="lead.contact_status === 'new'"
                :label="$t('leads.detail.quickActions.markContacted')"
                icon="pi pi-phone"
                class="w-full"
                severity="info"
                @click="selectedStatus = 'contacted'"
              />
              <PrimeButton
                v-if="lead.contact_status !== 'in_progress' && lead.contact_status !== 'converted' && lead.contact_status !== 'not_interested'"
                :label="$t('leads.detail.quickActions.inProgress')"
                icon="pi pi-clock"
                class="w-full"
                severity="warning"
                @click="selectedStatus = 'in_progress'"
              />
              <PrimeButton
                v-if="lead.contact_status !== 'not_interested' && lead.contact_status !== 'converted'"
                :label="$t('leads.detail.quickActions.notInterested')"
                icon="pi pi-times-circle"
                class="w-full"
                severity="danger"
                outlined
                @click="selectedStatus = 'not_interested'"
              />
            </div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  line-height: 1.6;
}
</style>
