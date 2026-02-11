<script setup lang="ts">
/**
 * Page - Free Trial
 * Lead catalog for free trial with same structure as /leads
 * Only shared mode, limited by remaining trial leads
 */
definePageMeta({
  layout: 'client'
})

const { t } = useI18n()

const profileStore = useClientProfileStore()
const catalogStore = usePublicCatalogStore()
const { formatCurrency, formatRelativeTime } = useClientFormatters()
const { showSuccess, showError } = useClientToast()
const { confirmClaimTrial } = useClientConfirm()

// Selected leads for trial
const selectedLeads = ref<any[]>([])

// Filters state
const selectedCategory = ref<number | ''>('')
const selectedProvince = ref<number | ''>('')
const dateRangeFilter = ref<Date[] | null>(null)

// Helper to format Date to string for API
const formatDateForApi = (date: Date | null | undefined): string => {
  if (!date) return ''
  return date.toISOString().split('T')[0]
}

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    profileStore.fetchTrialStatus(),
    catalogStore.fetchCategories(),
    catalogStore.fetchProvinces(),
    catalogStore.fetchLeads()
  ])
})

// Apply filters
const applyFilters = async () => {
  catalogStore.setFilters({
    category_id: selectedCategory.value || undefined,
    province_id: selectedProvince.value || undefined,
    generated_from: formatDateForApi(dateRangeFilter.value?.[0]) || undefined,
    generated_to: formatDateForApi(dateRangeFilter.value?.[1]) || undefined
  })
  await catalogStore.fetchLeads()
}

// Reset filters
const resetFilters = async () => {
  selectedCategory.value = ''
  selectedProvince.value = ''
  dateRangeFilter.value = null
  catalogStore.resetFilters()
  await catalogStore.fetchLeads()
}

// Watch filters for auto-apply
watch([selectedCategory, selectedProvince], () => {
  applyFilters()
})

// Pagination
const onPageChange = async (event: any) => {
  catalogStore.setFilters({ page: event.page + 1 })
  await catalogStore.fetchLeads()
}

// Sorting
const onSort = async (event: any) => {
  catalogStore.setFilters({
    sort_by: event.sortField,
    sort_order: event.sortOrder === 1 ? 'asc' : 'desc'
  })
  await catalogStore.fetchLeads()
}

// Trial status computed
const leadsRemaining = computed(() => profileStore.trialStatus?.leads_remaining || 0)
const leadsTotal = computed(() => profileStore.trialStatus?.leads_total || 0)
const leadsClaimed = computed(() => profileStore.trialStatus?.leads_claimed || 0)
const trialEnabled = computed(() => profileStore.trialStatus?.enabled && leadsRemaining.value > 0)

// Can select more leads (check limit)
const canSelectMore = computed(() => {
  return selectedLeads.value.length < leadsRemaining.value
})

// Check if lead is selected
const isSelected = (leadId: number): boolean => {
  return selectedLeads.value.some(l => l.id === leadId)
}

// Toggle lead selection
const toggleSelection = (lead: any) => {
  const index = selectedLeads.value.findIndex(l => l.id === lead.id)

  if (index >= 0) {
    // Already selected, remove it
    selectedLeads.value.splice(index, 1)
  } else {
    // Not selected, check if we can add more
    if (canSelectMore.value) {
      selectedLeads.value.push(lead)
    } else {
      showError(t('catalog.trial.maxSelectionError', { count: leadsRemaining.value }))
    }
  }
}

// Select all visible leads (up to the limit)
const selectAllVisible = () => {
  const availableSlots = leadsRemaining.value - selectedLeads.value.length
  if (availableSlots <= 0) {
    showError(t('catalog.trial.alreadyMaxError', { count: leadsRemaining.value }))
    return
  }

  const leadsToAdd = catalogStore.leads
    .filter(lead => !isSelected(lead.id))
    .slice(0, availableSlots)

  selectedLeads.value.push(...leadsToAdd)

  if (leadsToAdd.length < catalogStore.leads.filter(lead => !isSelected(lead.id)).length) {
    showSuccess(t('catalog.trial.addedLimitReached', { count: leadsToAdd.length }))
  }
}

// Deselect all
const deselectAll = () => {
  selectedLeads.value = []
}

// Claim trial leads
const claimTrialLeads = () => {
  if (selectedLeads.value.length === 0) {
    showError(t('catalog.trial.selectAtLeastOne'))
    return
  }

  confirmClaimTrial(selectedLeads.value.length, async () => {
    const leadIds = selectedLeads.value.map(l => l.id)
    const success = await profileStore.claimTrialLeads({
      lead_ids: leadIds
    })

    if (success) {
      showSuccess(t('catalog.trial.claimSuccess', { count: selectedLeads.value.length }))
      selectedLeads.value = []
      // Redirect to my leads
      navigateTo('/i-miei-lead')
    } else {
      showError(profileStore.error || t('catalog.trial.claimError'))
    }
  })
}
</script>

<template>
  <div class="trial-page">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <i class="pi pi-gift text-primary text-xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ $t('catalog.trial.title') }}</h1>
        </div>
        <p class="text-surface-600 dark:text-surface-400">
          {{ $t('catalog.trial.subtitle', { count: leadsRemaining }) }}
        </p>
      </div>
      <NuxtLink to="/i-miei-lead">
        <PrimeButton
          :label="$t('navigation.clientMenu.myLeads')"
          icon="pi pi-list"
          severity="secondary"
        />
      </NuxtLink>
    </div>

    <!-- Trial Status Card -->
    <PrimeCard v-if="profileStore.trialStatus" class="mb-6">
      <template #content>
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-6">
            <div class="text-center">
              <p class="text-3xl font-bold text-primary">
                {{ leadsRemaining }}
              </p>
              <p class="text-sm text-surface-500">{{ $t('catalog.trial.available') }}</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-bold text-green-500">
                {{ leadsClaimed }}
              </p>
              <p class="text-sm text-surface-500">{{ $t('catalog.trial.claimed') }}</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-bold text-surface-400">
                {{ leadsTotal }}
              </p>
              <p class="text-sm text-surface-500">{{ $t('catalog.trial.total') }}</p>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="flex-grow max-w-xs w-full">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-surface-600 dark:text-surface-400">{{ $t('catalog.trial.progress') }}</span>
              <span class="text-surface-900 dark:text-surface-0 font-medium">
                {{ leadsClaimed }}/{{ leadsTotal }}
              </span>
            </div>
            <ProgressBar
              :value="(leadsClaimed / leadsTotal) * 100"
              :showValue="false"
              class="h-2"
            />
          </div>
        </div>

        <!-- Info note -->
        <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
          <i class="pi pi-info-circle mr-2"></i>
          <span v-html="$t('catalog.trial.sharedModeInfo')"></span>
        </div>
      </template>
    </PrimeCard>

    <!-- No Trial Available -->
    <div
      v-if="!trialEnabled"
      class="text-center py-12"
    >
      <i class="pi pi-check-circle text-6xl text-green-500 mb-4"></i>
      <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-2">
        {{ $t('catalog.trial.completed') }}
      </h2>
      <p class="text-surface-600 dark:text-surface-400 mb-6">
        {{ $t('catalog.trial.completedText') }}
      </p>
      <div class="flex justify-center gap-3">
        <NuxtLink to="/leads">
          <PrimeButton :label="$t('catalog.trial.goToCatalog')" icon="pi pi-search" />
        </NuxtLink>
        <NuxtLink to="/pacchetti">
          <PrimeButton :label="$t('catalog.trial.buyPackage')" icon="pi pi-box" severity="secondary" />
        </NuxtLink>
      </div>
    </div>

    <!-- Lead Selection (Trial Active) -->
    <template v-else>
      <!-- Filters -->
      <PrimeCard class="mb-6">
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                {{ $t('catalog.filters.category') }}
              </label>
              <PrimeSelect
                v-model="selectedCategory"
                :options="[{ id: '', name: $t('catalog.filters.allCategories') }, ...catalogStore.categories]"
                optionLabel="name"
                optionValue="id"
                :placeholder="$t('catalog.filters.selectCategory')"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                {{ $t('catalog.filters.province') }}
              </label>
              <PrimeSelect
                v-model="selectedProvince"
                :options="[{ id: '', name: $t('catalog.filters.allProvinces') }, ...catalogStore.provinces]"
                optionLabel="name"
                optionValue="id"
                :placeholder="$t('catalog.filters.selectProvince')"
                class="w-full"
              />
            </div>
            <div class="lg:col-span-2">
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                {{ $t('catalog.trial.generationDate') }}
              </label>
              <PrimeDatePicker
                v-model="dateRangeFilter"
                selectionMode="range"
                dateFormat="dd/mm/yy"
                :placeholder="$t('catalog.trial.selectPeriod')"
                class="w-full"
                showIcon
                showButtonBar
                @date-select="applyFilters"
              />
            </div>
            <div class="flex items-end gap-2">
              <PrimeButton
                :label="$t('common.actions.filter')"
                icon="pi pi-search"
                @click="applyFilters"
              />
              <PrimeButton
                icon="pi pi-times"
                severity="secondary"
                @click="resetFilters"
              />
            </div>
          </div>
        </template>
      </PrimeCard>

      <!-- Limit Reached Warning -->
      <Transition name="slide-down">
        <div v-if="!canSelectMore && selectedLeads.length > 0" class="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <div class="flex items-center gap-3">
            <i class="pi pi-exclamation-triangle text-orange-600 text-xl"></i>
            <div>
              <p class="font-medium text-orange-700 dark:text-orange-300">
                {{ $t('catalog.trial.limitReached') }}
              </p>
              <p class="text-sm text-orange-600 dark:text-orange-400">
                {{ $t('catalog.trial.limitReachedText', { count: leadsRemaining }) }}
              </p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Bulk Actions Bar -->
      <Transition name="slide-down">
        <div v-if="selectedLeads.length > 0" class="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex items-center gap-4">
              <i class="pi pi-gift text-green-600 text-xl"></i>
              <span class="text-green-700 dark:text-green-300 font-medium">
                {{ $t('catalog.trial.selectedOf', { selected: selectedLeads.length, total: leadsRemaining }) }}
              </span>
              <PrimeTag :value="$t('catalog.trial.sharedMode')" severity="info" />
            </div>
            <div class="flex items-center gap-3">
              <PrimeButton
                :label="$t('catalog.trial.claimLeads', { count: selectedLeads.length })"
                icon="pi pi-gift"
                severity="success"
                @click="claimTrialLeads"
              />
              <PrimeButton
                icon="pi pi-times"
                severity="secondary"
                text
                rounded
                @click="deselectAll"
                v-tooltip.top="$t('catalog.trial.deselectAll')"
              />
            </div>
          </div>
        </div>
      </Transition>

      <!-- Loading State -->
      <div v-if="catalogStore.loading" class="flex justify-center py-12">
        <PrimeProgressSpinner />
      </div>

      <!-- Leads Table -->
      <PrimeCard v-else-if="catalogStore.leads.length > 0">
        <template #content>
          <!-- Table header with select all -->
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-surface-200 dark:border-surface-700">
            <div class="flex items-center gap-3">
              <PrimeButton
                :label="$t('catalog.trial.selectVisible')"
                icon="pi pi-check-square"
                size="small"
                severity="secondary"
                outlined
                :disabled="!canSelectMore"
                @click="selectAllVisible"
              />
              <PrimeButton
                v-if="selectedLeads.length > 0"
                :label="$t('catalog.trial.deselectAll')"
                icon="pi pi-times"
                size="small"
                severity="secondary"
                text
                @click="deselectAll"
              />
            </div>
            <div class="text-sm text-surface-600 dark:text-surface-400">
              {{ selectedLeads.length }}/{{ leadsRemaining }} {{ $t('catalog.trial.selected') }}
            </div>
          </div>

          <PrimeDataTable
            :value="catalogStore.leads"
            dataKey="id"
            :paginator="true"
            :rows="catalogStore.pagination.per_page"
            :totalRecords="catalogStore.pagination.total"
            :lazy="true"
            :rowsPerPageOptions="[10, 25, 50]"
            stripedRows
            removableSort
            class="text-sm trial-table"
            @page="onPageChange"
            @sort="onSort"
            @row-click="(e) => toggleSelection(e.data)"
          >
            <!-- Lead ID -->
            <PrimeColumn field="id" :header="$t('catalog.columns.id')" sortable style="min-width: 80px">
              <template #body="{ data }">
                <span class="font-mono text-primary">#{{ data.id }}</span>
              </template>
            </PrimeColumn>

            <!-- Category -->
            <PrimeColumn field="category.name" :header="$t('catalog.columns.category')" sortable style="min-width: 130px">
              <template #body="{ data }">
                <PrimeTag :value="data.category?.name" severity="info" size="small" />
              </template>
            </PrimeColumn>

            <!-- Province -->
            <PrimeColumn field="province.name" :header="$t('catalog.columns.province')" sortable style="min-width: 100px">
              <template #body="{ data }">
                <span class="text-surface-700 dark:text-surface-300">
                  {{ data.province?.name }}
                  <span class="text-surface-500">({{ data.province?.code }})</span>
                </span>
              </template>
            </PrimeColumn>

            <!-- Request Preview -->
            <PrimeColumn :header="$t('catalog.columns.request')" style="min-width: 250px">
              <template #body="{ data }">
                <p class="text-surface-600 dark:text-surface-400 line-clamp-2">
                  {{ data.request_preview }}
                </p>
              </template>
            </PrimeColumn>

            <!-- Availability -->
            <PrimeColumn field="shared_slots_available" :header="$t('catalog.columns.availability')" sortable style="min-width: 120px">
              <template #body="{ data }">
                <div class="flex items-center gap-2">
                  <i class="pi pi-users text-surface-400"></i>
                  <span class="text-surface-600 dark:text-surface-400">
                    {{ data.shared_slots_available }} slot
                  </span>
                </div>
              </template>
            </PrimeColumn>

            <!-- Date -->
            <PrimeColumn field="generated_at" :header="$t('catalog.columns.date')" sortable style="min-width: 100px">
              <template #body="{ data }">
                <span class="text-surface-500">{{ formatRelativeTime(data.generated_at) }}</span>
              </template>
            </PrimeColumn>

            <!-- Price (Free) -->
            <PrimeColumn :header="$t('catalog.columns.price')" style="min-width: 100px">
              <template #body>
                <div class="flex items-center gap-2">
                  <span class="text-green-600 dark:text-green-400 font-bold">{{ $t('catalog.trial.free') }}</span>
                  <PrimeTag :value="$t('catalog.trial.shared')" severity="secondary" size="small" />
                </div>
              </template>
            </PrimeColumn>

            <!-- Status -->
            <PrimeColumn :header="$t('catalog.columns.status')" style="min-width: 120px" frozen alignFrozen="right">
              <template #body="{ data }">
                <div v-if="isSelected(data.id)" class="flex items-center gap-2">
                  <i class="pi pi-check-circle text-green-500"></i>
                  <span class="text-green-700 dark:text-green-400 text-sm font-medium">
                    {{ $t('catalog.trial.statusSelected') }}
                  </span>
                </div>
                <div v-else-if="!canSelectMore" class="flex items-center gap-2">
                  <i class="pi pi-ban text-surface-400"></i>
                  <span class="text-surface-500 text-sm">
                    {{ $t('catalog.trial.statusLimitReached') }}
                  </span>
                </div>
                <div v-else class="flex items-center gap-2">
                  <i class="pi pi-circle text-surface-300"></i>
                  <span class="text-surface-500 text-sm">
                    {{ $t('catalog.trial.statusAvailable') }}
                  </span>
                </div>
              </template>
            </PrimeColumn>
          </PrimeDataTable>
        </template>
      </PrimeCard>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <i class="pi pi-inbox text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
        <h3 class="text-xl font-semibold text-surface-700 dark:text-surface-300 mb-2">
          {{ $t('catalog.empty.title') }}
        </h3>
        <p class="text-surface-500 dark:text-surface-400 mb-4">
          {{ $t('catalog.empty.subtitle') }}
        </p>
        <PrimeButton
          :label="$t('catalog.filters.resetFilters')"
          icon="pi pi-refresh"
          @click="resetFilters"
        />
      </div>

      <!-- Fixed Bottom Bar when leads selected -->
      <div
        v-if="selectedLeads.length > 0"
        class="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700 shadow-lg z-50 md:left-64"
      >
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p class="font-semibold text-surface-900 dark:text-surface-0">
              {{ $t('catalog.trial.leadsSelected', { count: selectedLeads.length }) }}
            </p>
            <p class="text-sm text-surface-500">
              {{ $t('catalog.trial.willBeShared') }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <PrimeButton
              :label="$t('common.actions.cancel')"
              severity="secondary"
              @click="deselectAll"
            />
            <PrimeButton
              :label="$t('catalog.trial.redeemLeads')"
              icon="pi pi-gift"
              severity="success"
              @click="claimTrialLeads"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Slide down transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Make rows clickable */
.trial-table :deep(.p-datatable-tbody > tr) {
  cursor: pointer;
  transition: background-color 0.2s;
}

.trial-table :deep(.p-datatable-tbody > tr:hover) {
  background-color: rgba(59, 130, 246, 0.05) !important;
}

/* Add bottom padding when fixed bar is visible */
.trial-page {
  padding-bottom: 100px;
}
</style>
