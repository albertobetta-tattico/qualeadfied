<script setup lang="ts">
/**
 * Page - My Leads
 * User's purchased leads portfolio with filtering and status management
 * Table format with row actions
 */
import type { MyLead, ContactStatus, AcquisitionType } from '~/types/clientArea'

definePageMeta({
  layout: 'client'
})

const { t } = useI18n()

const myLeadsStore = useMyLeadsStore()
const catalogStore = usePublicCatalogStore()
const {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  formatContactStatus,
  getContactStatusSeverity,
  formatAcquisitionType,
  getAcquisitionTypeSeverity
} = useClientFormatters()
const { contactStatusOptions } = useClientFilterOptions()
const { showSuccess, showError } = useClientToast()

// Filter state
const selectedCategory = ref<number | ''>('')
const selectedProvince = ref<number | ''>('')
const selectedStatus = ref<ContactStatus | ''>('')
const selectedMode = ref<'exclusive' | 'shared' | ''>('')
const dateRangeFilter = ref<Date[] | null>(null)

// Mode options (same as /leads page)
const modeOptions = computed(() => [
  { label: t('leads.myLeads.filters.allModes'), value: '' },
  { label: t('leads.myLeads.filters.exclusive'), value: 'exclusive' },
  { label: t('leads.myLeads.filters.shared'), value: 'shared' }
])

// Helper to format Date to string for API
const formatDateForApi = (date: Date | null | undefined): string => {
  if (!date) return ''
  return date.toISOString().split('T')[0]
}

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    myLeadsStore.fetchLeads(),
    catalogStore.fetchCategories(),
    catalogStore.fetchProvinces()
  ])
})

// Apply filters
const applyFilters = async () => {
  myLeadsStore.setFilters({
    category_id: selectedCategory.value || undefined,
    province_id: selectedProvince.value || undefined,
    contact_status: selectedStatus.value || undefined,
    acquisition_type: selectedMode.value || undefined,
    purchased_from: formatDateForApi(dateRangeFilter.value?.[0]) || undefined,
    purchased_to: formatDateForApi(dateRangeFilter.value?.[1]) || undefined
  })
  await myLeadsStore.fetchLeads()
}

// Reset filters
const resetFilters = async () => {
  selectedCategory.value = ''
  selectedProvince.value = ''
  selectedStatus.value = ''
  selectedMode.value = ''
  dateRangeFilter.value = null
  myLeadsStore.resetFilters()
  await myLeadsStore.fetchLeads()
}

// Watch filters
watch([selectedCategory, selectedProvince, selectedStatus, selectedMode], () => {
  applyFilters()
})

// Pagination
const onPageChange = async (event: any) => {
  myLeadsStore.setPage(event.page + 1)
  await myLeadsStore.fetchLeads()
}

// Sorting
const onSort = async (event: any) => {
  myLeadsStore.setFilters({
    sort_by: event.sortField,
    sort_order: event.sortOrder === 1 ? 'asc' : 'desc'
  })
  await myLeadsStore.fetchLeads()
}

// Update lead status
const updateStatus = async (lead: MyLead, status: ContactStatus) => {
  const success = await myLeadsStore.updateLead(lead.id, { contact_status: status })
  if (success) {
    showSuccess(t('leads.myLeads.toast.statusUpdated'))
  } else {
    showError(myLeadsStore.error || t('leads.myLeads.toast.errorUpdating'))
  }
}

// Export leads
const exportLeads = async (format: 'csv' | 'excel') => {
  const url = await myLeadsStore.exportLeads(format)
  if (url) {
    showSuccess(t('leads.myLeads.toast.exportCompleted'))
    // In production, this would trigger a download
    window.open(url, '_blank')
  } else {
    showError(myLeadsStore.error || t('leads.myLeads.toast.errorExport'))
  }
}

// Navigate to lead detail
const router = useRouter()
const viewLead = (lead: MyLead) => {
  router.push(`/i-miei-lead/${lead.id}`)
}
</script>

<template>
  <div class="my-leads-page">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ t('leads.myLeads.title') }}</h1>
        <p class="text-surface-600 dark:text-surface-400">
          {{ t('leads.myLeads.subtitle', { count: myLeadsStore.pagination.total }) }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <PrimeSplitButton
          :label="t('leads.myLeads.export.button')"
          icon="pi pi-download"
          severity="secondary"
          :model="[
            { label: t('leads.myLeads.export.csv'), icon: 'pi pi-file', command: () => exportLeads('csv') },
            { label: t('leads.myLeads.export.excel'), icon: 'pi pi-file-excel', command: () => exportLeads('excel') }
          ]"
        />
        <NuxtLink to="/leads">
          <PrimeButton :label="t('leads.myLeads.buyLead')" icon="pi pi-plus" />
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <PrimeCard class="text-center">
        <template #content>
          <p class="text-3xl font-bold text-surface-900 dark:text-surface-0">
            {{ myLeadsStore.pagination.total }}
          </p>
          <p class="text-sm text-surface-500">{{ t('leads.myLeads.stats.total') }}</p>
        </template>
      </PrimeCard>
      <PrimeCard class="text-center">
        <template #content>
          <p class="text-3xl font-bold text-blue-500">
            {{ myLeadsStore.newLeadsCount }}
          </p>
          <p class="text-sm text-surface-500">{{ t('leads.myLeads.stats.toContact') }}</p>
        </template>
      </PrimeCard>
      <PrimeCard class="text-center">
        <template #content>
          <p class="text-3xl font-bold text-green-500">
            {{ myLeadsStore.convertedLeadsCount }}
          </p>
          <p class="text-sm text-surface-500">{{ t('leads.myLeads.stats.converted') }}</p>
        </template>
      </PrimeCard>
      <PrimeCard class="text-center">
        <template #content>
          <p class="text-3xl font-bold text-primary">
            {{ myLeadsStore.conversionRate }}%
          </p>
          <p class="text-sm text-surface-500">{{ t('leads.myLeads.stats.conversionRate') }}</p>
        </template>
      </PrimeCard>
    </div>

    <!-- Filters -->
    <PrimeCard class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              {{ t('leads.myLeads.filters.category') }}
            </label>
            <PrimeSelect
              v-model="selectedCategory"
              :options="[{ id: '', name: t('leads.myLeads.filters.categoryAll') }, ...catalogStore.categories]"
              optionLabel="name"
              optionValue="id"
              :placeholder="t('leads.myLeads.filters.category')"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              {{ t('leads.myLeads.filters.province') }}
            </label>
            <PrimeSelect
              v-model="selectedProvince"
              :options="[{ id: '', name: t('leads.myLeads.filters.provinceAll') }, ...catalogStore.provinces]"
              optionLabel="name"
              optionValue="id"
              :placeholder="t('leads.myLeads.filters.province')"
              class="w-full"
              filter
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              {{ t('leads.myLeads.filters.status') }}
            </label>
            <PrimeSelect
              v-model="selectedStatus"
              :options="contactStatusOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="t('leads.myLeads.filters.status')"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              {{ t('leads.myLeads.filters.mode') }}
            </label>
            <PrimeSelect
              v-model="selectedMode"
              :options="modeOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="t('leads.myLeads.filters.mode')"
              class="w-full"
            />
          </div>
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              {{ t('leads.myLeads.filters.purchaseDate') }}
            </label>
            <PrimeDatePicker
              v-model="dateRangeFilter"
              selectionMode="range"
              dateFormat="dd/mm/yy"
              :placeholder="t('leads.myLeads.filters.datePlaceholder')"
              class="w-full"
              showIcon
              showButtonBar
              @date-select="applyFilters"
            />
          </div>
          <div class="flex items-end gap-2">
            <PrimeButton
              :label="t('leads.myLeads.filters.filter')"
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

    <!-- Loading State -->
    <div v-if="myLeadsStore.loading" class="flex justify-center py-12">
      <PrimeProgressSpinner />
    </div>

    <!-- Leads Table -->
    <PrimeCard v-else-if="myLeadsStore.leads.length > 0">
      <template #content>
        <PrimeDataTable
          :value="myLeadsStore.leads"
          dataKey="id"
          :paginator="true"
          :rows="myLeadsStore.pagination.per_page"
          :totalRecords="myLeadsStore.pagination.total"
          :lazy="true"
          :rowsPerPageOptions="[10, 25, 50]"
          stripedRows
          removableSort
          class="text-sm"
          @page="onPageChange"
          @sort="onSort"
        >
          <!-- Lead ID -->
          <PrimeColumn field="lead.id" :header="t('leads.myLeads.table.id')" sortable style="min-width: 70px">
            <template #body="{ data }">
              <span class="font-mono text-primary">#{{ data.lead.id }}</span>
            </template>
          </PrimeColumn>

          <!-- Contact Name -->
          <PrimeColumn field="lead.first_name" :header="t('leads.myLeads.table.contact')" sortable style="min-width: 180px">
            <template #body="{ data }">
              <div>
                <p class="font-semibold text-surface-900 dark:text-surface-0">
                  {{ data.lead.first_name }} {{ data.lead.last_name }}
                </p>
                <p class="text-xs text-surface-500">{{ data.lead.email }}</p>
              </div>
            </template>
          </PrimeColumn>

          <!-- Phone -->
          <PrimeColumn field="lead.phone" :header="t('leads.myLeads.table.phone')" style="min-width: 120px">
            <template #body="{ data }">
              <a :href="`tel:${data.lead.phone}`" class="text-surface-700 dark:text-surface-300 hover:text-primary">
                {{ data.lead.phone }}
              </a>
            </template>
          </PrimeColumn>

          <!-- Category -->
          <PrimeColumn field="lead.category.name" :header="t('leads.myLeads.table.category')" sortable style="min-width: 130px">
            <template #body="{ data }">
              <PrimeTag :value="data.lead.category?.name" severity="info" size="small" />
            </template>
          </PrimeColumn>

          <!-- Province -->
          <PrimeColumn field="lead.province.name" :header="t('leads.myLeads.table.province')" sortable style="min-width: 100px">
            <template #body="{ data }">
              <span class="text-surface-700 dark:text-surface-300">
                {{ data.lead.province?.name }}
                <span class="text-surface-500">({{ data.lead.province?.code }})</span>
              </span>
            </template>
          </PrimeColumn>

          <!-- Region -->
          <PrimeColumn field="lead.province.region" :header="t('leads.myLeads.table.region')" sortable style="min-width: 100px">
            <template #body="{ data }">
              <span class="text-surface-600 dark:text-surface-400">
                {{ data.lead.province?.region }}
              </span>
            </template>
          </PrimeColumn>

          <!-- Contact Status -->
          <PrimeColumn field="contact_status" :header="t('leads.myLeads.table.status')" sortable style="min-width: 130px">
            <template #body="{ data }">
              <PrimeTag
                :value="formatContactStatus(data.contact_status)"
                :severity="getContactStatusSeverity(data.contact_status)"
                size="small"
              />
            </template>
          </PrimeColumn>

          <!-- Acquisition Type -->
          <PrimeColumn field="acquisition_type" :header="t('leads.myLeads.table.mode')" sortable style="min-width: 100px">
            <template #body="{ data }">
              <PrimeTag
                :value="formatAcquisitionType(data.acquisition_type)"
                :severity="getAcquisitionTypeSeverity(data.acquisition_type)"
                size="small"
              />
            </template>
          </PrimeColumn>

          <!-- Purchase Price -->
          <PrimeColumn field="purchase_price" :header="t('leads.myLeads.table.price')" sortable style="min-width: 100px">
            <template #body="{ data }">
              <span class="font-semibold text-surface-900 dark:text-surface-0">
                {{ formatCurrency(data.purchase_price) }}
              </span>
            </template>
          </PrimeColumn>

          <!-- Purchase Date -->
          <PrimeColumn field="purchased_at" :header="t('leads.myLeads.table.purchaseDate')" sortable style="min-width: 120px">
            <template #body="{ data }">
              <span class="text-surface-500">{{ formatDate(data.purchased_at) }}</span>
            </template>
          </PrimeColumn>

          <!-- Actions -->
          <PrimeColumn :header="t('leads.myLeads.table.actions')" style="width: 80px" frozen alignFrozen="right">
            <template #body="{ data }">
              <div class="flex gap-1 justify-end">
                <PrimeButton
                  v-if="data.contact_status === 'new'"
                  icon="pi pi-phone"
                  size="small"
                  severity="info"
                  text
                  rounded
                  v-tooltip.top="t('leads.myLeads.actions.markContacted')"
                  @click.stop="updateStatus(data, 'contacted')"
                />
                <PrimeButton
                  icon="pi pi-eye"
                  size="small"
                  severity="secondary"
                  text
                  rounded
                  v-tooltip.top="t('leads.myLeads.actions.viewDetails')"
                  @click.stop="viewLead(data)"
                />
              </div>
            </template>
          </PrimeColumn>
        </PrimeDataTable>
      </template>
    </PrimeCard>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <i class="pi pi-users text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
      <h2 class="text-2xl font-bold text-surface-700 dark:text-surface-300 mb-2">
        {{ t('leads.myLeads.empty.title') }}
      </h2>
      <p class="text-surface-500 dark:text-surface-400 mb-6">
        {{ t('leads.myLeads.empty.subtitle') }}
      </p>
      <div class="flex justify-center gap-3">
        <NuxtLink to="/leads">
          <PrimeButton :label="t('leads.myLeads.empty.catalog')" icon="pi pi-search" size="large" />
        </NuxtLink>
        <NuxtLink to="/pacchetti">
          <PrimeButton :label="t('leads.myLeads.empty.buyPackage')" icon="pi pi-box" severity="secondary" size="large" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Table styling */
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  padding: 0.75rem 1rem;
  font-weight: 600;
}
</style>
