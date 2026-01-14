<script setup lang="ts">
/**
 * Page - My Leads
 * User's purchased leads portfolio with filtering and status management
 */
import type { MyLead, ContactStatus, AcquisitionType } from '~/types/clientArea'

definePageMeta({
  layout: 'client'
})

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
const { contactStatusOptions, acquisitionTypeOptions } = useClientFilterOptions()
const { showSuccess, showError } = useClientToast()

// Filter state
const selectedCategory = ref<number | ''>('')
const selectedStatus = ref<ContactStatus | ''>('')
const selectedAcquisitionType = ref<AcquisitionType | ''>('')
const searchQuery = ref('')

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    myLeadsStore.fetchLeads(),
    catalogStore.fetchCategories()
  ])
})

// Apply filters
const applyFilters = async () => {
  myLeadsStore.setFilters({
    category_id: selectedCategory.value || undefined,
    contact_status: selectedStatus.value || undefined,
    acquisition_type: selectedAcquisitionType.value || undefined,
    search: searchQuery.value || undefined
  })
  await myLeadsStore.fetchLeads()
}

// Reset filters
const resetFilters = async () => {
  selectedCategory.value = ''
  selectedStatus.value = ''
  selectedAcquisitionType.value = ''
  searchQuery.value = ''
  myLeadsStore.resetFilters()
  await myLeadsStore.fetchLeads()
}

// Watch filters
watch([selectedCategory, selectedStatus, selectedAcquisitionType], () => {
  applyFilters()
})

// Pagination
const onPageChange = async (event: any) => {
  myLeadsStore.setPage(event.page + 1)
  await myLeadsStore.fetchLeads()
}

// Update lead status
const updateStatus = async (lead: MyLead, status: ContactStatus) => {
  const success = await myLeadsStore.updateLead(lead.id, { contact_status: status })
  if (success) {
    showSuccess('Stato aggiornato')
  } else {
    showError(myLeadsStore.error || 'Errore nell\'aggiornamento')
  }
}

// Export leads
const exportLeads = async (format: 'csv' | 'excel') => {
  const url = await myLeadsStore.exportLeads(format)
  if (url) {
    showSuccess('Export completato')
    // In production, this would trigger a download
    window.open(url, '_blank')
  } else {
    showError(myLeadsStore.error || 'Errore nell\'export')
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
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">I Miei Lead</h1>
        <p class="text-surface-600 dark:text-surface-400">
          {{ myLeadsStore.pagination.total }} lead nel tuo portafoglio
        </p>
      </div>
      <div class="flex items-center gap-2">
        <PrimeSplitButton
          label="Esporta"
          icon="pi pi-download"
          severity="secondary"
          :model="[
            { label: 'Esporta CSV', icon: 'pi pi-file', command: () => exportLeads('csv') },
            { label: 'Esporta Excel', icon: 'pi pi-file-excel', command: () => exportLeads('excel') }
          ]"
        />
        <NuxtLink to="/leads">
          <PrimeButton label="Acquista Lead" icon="pi pi-plus" />
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
          <p class="text-sm text-surface-500">Totale Lead</p>
        </template>
      </PrimeCard>
      <PrimeCard class="text-center">
        <template #content>
          <p class="text-3xl font-bold text-blue-500">
            {{ myLeadsStore.newLeadsCount }}
          </p>
          <p class="text-sm text-surface-500">Da Contattare</p>
        </template>
      </PrimeCard>
      <PrimeCard class="text-center">
        <template #content>
          <p class="text-3xl font-bold text-green-500">
            {{ myLeadsStore.convertedLeadsCount }}
          </p>
          <p class="text-sm text-surface-500">Convertiti</p>
        </template>
      </PrimeCard>
      <PrimeCard class="text-center">
        <template #content>
          <p class="text-3xl font-bold text-primary">
            {{ myLeadsStore.conversionRate }}%
          </p>
          <p class="text-sm text-surface-500">Conversione</p>
        </template>
      </PrimeCard>
    </div>

    <!-- Filters -->
    <PrimeCard class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Categoria
            </label>
            <PrimeSelect
              v-model="selectedCategory"
              :options="[{ id: '', name: 'Tutte' }, ...catalogStore.categories]"
              optionLabel="name"
              optionValue="id"
              placeholder="Categoria"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Stato
            </label>
            <PrimeSelect
              v-model="selectedStatus"
              :options="contactStatusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Stato"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Tipo
            </label>
            <PrimeSelect
              v-model="selectedAcquisitionType"
              :options="acquisitionTypeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Tipo"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Cerca
            </label>
            <PrimeInputText
              v-model="searchQuery"
              placeholder="Nome, email, telefono..."
              class="w-full"
              @keyup.enter="applyFilters"
            />
          </div>
          <div class="flex items-end gap-2">
            <PrimeButton
              label="Filtra"
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

    <!-- Leads List -->
    <div v-else-if="myLeadsStore.leads.length > 0">
      <div class="space-y-4 mb-6">
        <PrimeCard
          v-for="lead in myLeadsStore.leads"
          :key="lead.id"
          class="lead-card cursor-pointer"
          @click="viewLead(lead)"
        >
          <template #content>
            <div class="flex flex-col lg:flex-row lg:items-center gap-4">
              <!-- Lead Info -->
              <div class="flex-grow">
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <PrimeTag :value="lead.lead.category?.name" severity="info" size="small" />
                  <PrimeTag :value="lead.lead.province?.code" severity="secondary" size="small" />
                  <PrimeTag
                    :value="formatContactStatus(lead.contact_status)"
                    :severity="getContactStatusSeverity(lead.contact_status)"
                    size="small"
                  />
                  <PrimeTag
                    :value="formatAcquisitionType(lead.acquisition_type)"
                    :severity="getAcquisitionTypeSeverity(lead.acquisition_type)"
                    size="small"
                  />
                </div>
                <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-1">
                  {{ lead.lead.first_name }} {{ lead.lead.last_name }}
                </h3>
                <p class="text-sm text-surface-600 dark:text-surface-400 line-clamp-2 mb-2">
                  {{ lead.lead.request_text }}
                </p>
                <div class="flex flex-wrap items-center gap-4 text-sm text-surface-500">
                  <span>
                    <i class="pi pi-envelope mr-1"></i>
                    {{ lead.lead.email }}
                  </span>
                  <span>
                    <i class="pi pi-phone mr-1"></i>
                    {{ lead.lead.phone }}
                  </span>
                </div>
              </div>

              <!-- Actions & Meta -->
              <div class="flex flex-col items-end gap-3 lg:w-48">
                <div class="text-right">
                  <p class="text-lg font-bold text-surface-900 dark:text-surface-0">
                    {{ formatCurrency(lead.purchase_price) }}
                  </p>
                  <p class="text-xs text-surface-400">
                    {{ formatDate(lead.purchased_at) }}
                  </p>
                </div>

                <!-- Quick Status Update -->
                <div class="flex gap-1" @click.stop>
                  <PrimeButton
                    v-if="lead.contact_status === 'new'"
                    icon="pi pi-phone"
                    size="small"
                    severity="info"
                    rounded
                    v-tooltip.top="'Segna come contattato'"
                    @click="updateStatus(lead, 'contacted')"
                  />
                  <PrimeButton
                    v-if="lead.contact_status !== 'converted' && lead.contact_status !== 'not_interested'"
                    icon="pi pi-check"
                    size="small"
                    severity="success"
                    rounded
                    v-tooltip.top="'Segna come convertito'"
                    @click="updateStatus(lead, 'converted')"
                  />
                  <PrimeButton
                    icon="pi pi-eye"
                    size="small"
                    severity="secondary"
                    rounded
                    v-tooltip.top="'Vedi dettagli'"
                    @click="viewLead(lead)"
                  />
                </div>
              </div>
            </div>

            <!-- Notes Preview -->
            <div
              v-if="lead.notes"
              class="mt-3 pt-3 border-t border-surface-100 dark:border-surface-800"
            >
              <p class="text-sm text-surface-500">
                <i class="pi pi-comment mr-1"></i>
                {{ lead.notes }}
              </p>
            </div>
          </template>
        </PrimeCard>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center">
        <PrimePaginator
          :rows="myLeadsStore.pagination.per_page"
          :totalRecords="myLeadsStore.pagination.total"
          :first="(myLeadsStore.pagination.current_page - 1) * myLeadsStore.pagination.per_page"
          @page="onPageChange"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <i class="pi pi-users text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
      <h2 class="text-2xl font-bold text-surface-700 dark:text-surface-300 mb-2">
        Nessun lead nel portafoglio
      </h2>
      <p class="text-surface-500 dark:text-surface-400 mb-6">
        Inizia ad acquistare lead per costruire il tuo portafoglio clienti
      </p>
      <div class="flex justify-center gap-3">
        <NuxtLink to="/leads">
          <PrimeButton label="Vai al Catalogo" icon="pi pi-search" size="large" />
        </NuxtLink>
        <NuxtLink to="/pacchetti">
          <PrimeButton label="Acquista Pacchetto" icon="pi pi-box" severity="secondary" size="large" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lead-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.lead-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
