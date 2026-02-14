<script setup lang="ts">
/**
 * Admin Pricing History Page - Storico Variazioni Prezzi
 * Visualizza tutte le modifiche ai listini nel tempo
 */
import { useCatalogFormatters, useCatalogActions } from '~/composables/useCatalog'
import type { PriceHistoryEntry } from '~/types/catalog'

definePageMeta({
  layout: 'admin'
})

const { t } = useI18n()

// Store & Composables
const pricingStore = usePricingStore()
const { formatCurrency, formatDate, formatDateTime } = useCatalogFormatters()
const { showError } = useCatalogActions()
const router = useRouter()

// Refs
const showFilters = ref(false)
const detailDialog = ref(false)
const selectedEntry = ref<PriceHistoryEntry | null>(null)

// Filters
const searchQuery = ref('')
const categoryFilter = ref<number | ''>('')
const dateFromFilter = ref<Date | null>(null)
const dateToFilter = ref<Date | null>(null)

// Computed
const priceHistory = computed(() => pricingStore.priceHistory)
const categories = computed(() => pricingStore.categories)
const categoriesForSelect = computed(() => pricingStore.categoriesForSelect)
const loading = computed(() => pricingStore.loading)
const pagination = computed(() => pricingStore.historyPagination)

const hasActiveFilters = computed(() => {
  return !!searchQuery.value ||
         !!categoryFilter.value ||
         dateFromFilter.value !== null ||
         dateToFilter.value !== null
})

// Stats
const historyStats = computed(() => {
  const history = priceHistory.value
  const stats = pricingStore.pricingStats

  if (!stats) return null

  const uniqueCategories = new Set(history.map(h => h.category_id)).size
  const lastChange = history[0]?.changed_at || stats.last_price_change

  // Count changes this month
  const thisMonth = history.filter(h => {
    const date = new Date(h.changed_at)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length

  return {
    total_changes: stats.total_price_changes || history.length,
    unique_categories: uniqueCategories,
    changes_this_month: thisMonth,
    last_change: lastChange
  }
})

// Pagination
const first = ref(0)
const rows = ref(20)

// Methods
const loadData = async () => {
  await Promise.all([
    pricingStore.fetchPriceHistory(),
    pricingStore.fetchAllCategories(),
    pricingStore.fetchPricingStats()
  ])
}

const applyFilters = () => {
  pricingStore.setHistoryFilters({
    search: searchQuery.value,
    category_id: categoryFilter.value,
    date_from: dateFromFilter.value ? dateFromFilter.value.toISOString() : '',
    date_to: dateToFilter.value ? dateToFilter.value.toISOString() : ''
  })
  pricingStore.fetchPriceHistory()
}

const clearFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  dateFromFilter.value = null
  dateToFilter.value = null
  pricingStore.resetHistoryFilters()
  pricingStore.fetchPriceHistory()
}

const onPage = (event: any) => {
  pricingStore.setHistoryFilters({
    page: event.page + 1,
    per_page: event.rows
  })
  pricingStore.fetchPriceHistory()
}

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>
const onSearchInput = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

// View detail
const openDetailDialog = (entry: PriceHistoryEntry) => {
  selectedEntry.value = entry
  detailDialog.value = true
}

// Navigate back
const navigateBack = () => {
  router.push('/admin/pricing')
}

// Format shared price summary
const formatSharedPriceSummary = (sharedPrices: Record<string, number>): string => {
  const prices = Object.values(sharedPrices)
  if (prices.length === 0) return '-'

  const allSame = prices.every(p => p === prices[0])
  if (allSame) {
    return formatCurrency(prices[0])
  }

  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return `${formatCurrency(min)} - ${formatCurrency(max)}`
}

// Get sorted slot keys
const getSortedSlotKeys = (sharedPrices: Record<string, number>): string[] => {
  return Object.keys(sharedPrices).sort((a, b) => {
    const numA = parseInt(a.replace('slot_', ''))
    const numB = parseInt(b.replace('slot_', ''))
    return numA - numB
  })
}

// Get slot number from key
const getSlotNumber = (key: string): number => {
  return parseInt(key.replace('slot_', ''))
}

// Export to Excel (placeholder)
const exportHistory = () => {
  showError(t('admin.pricing.history.exportInDevelopment'))
}

// Lifecycle
onMounted(() => {
  loadData()
})

onUnmounted(() => {
  clearTimeout(searchTimeout)
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-left">
        <div class="flex items-center gap-4">
          <PrimeButton
            icon="pi pi-arrow-left"
            severity="secondary"
            text
            rounded
            @click="navigateBack"
            v-tooltip.right="$t('admin.pricing.history.backToPricing')"
          />
          <div>
            <h1 class="page-title">{{ $t('admin.pricing.list.actions.priceHistory') }}</h1>
            <p class="page-subtitle">{{ $t('admin.pricing.history.subtitle') }}</p>
          </div>
        </div>
      </div>
      <div class="page-header-actions">
        <PrimeButton
          :label="$t('admin.pricing.history.exportExcel')"
          icon="pi pi-file-excel"
          severity="success"
          outlined
          @click="exportHistory"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <div class="kpi-card">
        <div class="kpi-card-icon primary">
          <i class="pi pi-history"></i>
        </div>
        <div class="kpi-card-value">{{ historyStats?.total_changes || 0 }}</div>
        <div class="kpi-card-label">{{ $t('admin.pricing.history.stats.totalChanges') }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon info">
          <i class="pi pi-tag"></i>
        </div>
        <div class="kpi-card-value">{{ historyStats?.unique_categories || 0 }}</div>
        <div class="kpi-card-label">{{ $t('admin.pricing.history.stats.categoriesModified') }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon success">
          <i class="pi pi-calendar"></i>
        </div>
        <div class="kpi-card-value">{{ historyStats?.changes_this_month || 0 }}</div>
        <div class="kpi-card-label">{{ $t('admin.pricing.history.stats.changesThisMonth') }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card-icon warning">
          <i class="pi pi-clock"></i>
        </div>
        <div class="kpi-card-value text-base">
          {{ historyStats?.last_change ? formatDateTime(historyStats.last_change) : '-' }}
        </div>
        <div class="kpi-card-label">{{ $t('admin.pricing.history.stats.lastChange') }}</div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="q-card mb-6">
      <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <!-- Search -->
        <div class="flex-1 max-w-md">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search" />
            <PrimeInputText
              v-model="searchQuery"
              :placeholder="$t('admin.pricing.history.searchPlaceholder')"
              class="w-full"
              @input="onSearchInput"
            />
          </span>
        </div>

        <!-- Filter Actions -->
        <div class="flex gap-3 items-center">
          <PrimeButton
            :label="showFilters ? $t('admin.common.filters.hide') : $t('admin.common.filters.show')"
            :icon="showFilters ? 'pi pi-filter-slash' : 'pi pi-filter'"
            severity="secondary"
            text
            @click="showFilters = !showFilters"
          />

          <PrimeButton
            v-if="hasActiveFilters"
            :label="$t('admin.common.filters.clear')"
            icon="pi pi-times"
            severity="secondary"
            outlined
            size="small"
            @click="clearFilters"
          />
        </div>
      </div>

      <!-- Expanded Filters -->
      <Transition name="slide-up">
        <div v-if="showFilters" class="mt-4 pt-4 border-t border-neutral-200">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Category Filter -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.pricing.history.filters.category') }}</label>
              <PrimeSelect
                v-model="categoryFilter"
                :options="[{ label: $t('admin.pricing.history.filters.allCategories'), value: '' }, ...categoriesForSelect]"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('admin.pricing.history.filters.selectCategory')"
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Date From -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.pricing.history.filters.dateFrom') }}</label>
              <PrimeDatePicker
                v-model="dateFromFilter"
                dateFormat="dd/mm/yy"
                :placeholder="$t('admin.common.filters.selectDate')"
                showIcon
                class="w-full"
                @date-select="applyFilters"
              />
            </div>

            <!-- Date To -->
            <div class="form-group mb-0">
              <label class="text-sm font-medium text-neutral-700 mb-2 block">{{ $t('admin.pricing.history.filters.dateTo') }}</label>
              <PrimeDatePicker
                v-model="dateToFilter"
                dateFormat="dd/mm/yy"
                :placeholder="$t('admin.common.filters.selectDate')"
                showIcon
                class="w-full"
                @date-select="applyFilters"
              />
            </div>

            <!-- Apply Button -->
            <div class="form-group mb-0 text-right">
              <label class="text-sm font-medium text-neutral-700 mb-2 block invisible">Azioni</label>
              <PrimeButton
                :label="$t('admin.common.filters.apply')"
                icon="pi pi-check"
                severity="primary"
                @click="applyFilters"
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Data Table -->
    <div class="q-card">
      <PrimeDataTable
        :value="priceHistory"
        :loading="loading"
        :rows="rows"
        :totalRecords="pagination.total"
        :lazy="true"
        :paginator="true"
        :rowsPerPageOptions="[10, 20, 50]"
        :first="first"
        dataKey="id"
        stripedRows
        showGridlines
        class="text-sm"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :currentPageReportTemplate="$t('admin.pricing.history.paginatorTemplate')"
        @page="onPage"
      >
        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-12">
            <i class="pi pi-history text-4xl text-neutral-400 mb-4 block"></i>
            <p class="text-neutral-600 mb-4">{{ $t('admin.pricing.history.empty') }}</p>
            <p class="text-sm text-neutral-500">
              {{ $t('admin.pricing.history.emptySubtext') }}
            </p>
          </div>
        </template>

        <!-- Loading -->
        <template #loading>
          <div class="flex items-center justify-center py-8">
            <i class="pi pi-spin pi-spinner text-2xl text-primary-500 mr-3"></i>
            <span class="text-neutral-600">{{ $t('admin.pricing.history.loading') }}</span>
          </div>
        </template>

        <!-- Date/Time -->
        <PrimeColumn field="changed_at" :header="$t('admin.pricing.history.columns.changeDate')" sortable style="min-width: 180px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center flex-shrink-0">
                <i class="pi pi-clock"></i>
              </div>
              <div>
                <div class="font-medium text-neutral-900">{{ formatDate(data.changed_at) }}</div>
                <div class="text-xs text-neutral-500">
                  {{ new Date(data.changed_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) }}
                </div>
              </div>
            </div>
          </template>
        </PrimeColumn>

        <!-- Category -->
        <PrimeColumn field="category_name" :header="$t('admin.pricing.history.columns.category')" sortable style="min-width: 200px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
                <i class="pi pi-tag"></i>
              </div>
              <div class="font-medium text-neutral-900">{{ data.category_name }}</div>
            </div>
          </template>
        </PrimeColumn>

        <!-- Exclusive Price -->
        <PrimeColumn field="exclusive_price" :header="$t('admin.pricing.history.columns.exclusivePrice')" sortable style="min-width: 150px">
          <template #body="{ data }">
            <span class="font-semibold text-primary-700 text-lg">
              {{ formatCurrency(data.exclusive_price) }}
            </span>
          </template>
        </PrimeColumn>

        <!-- Shared Prices -->
        <PrimeColumn :header="$t('admin.pricing.history.columns.sharedPrices')" style="min-width: 180px">
          <template #body="{ data }">
            <div class="flex flex-col gap-1">
              <span class="font-medium text-neutral-700">
                {{ formatSharedPriceSummary(data.shared_prices) }}
              </span>
              <span class="text-xs text-neutral-500">
                {{ Object.keys(data.shared_prices).length }} slot
              </span>
            </div>
          </template>
        </PrimeColumn>

        <!-- Valid Period -->
        <PrimeColumn :header="$t('admin.pricing.history.columns.validityPeriod')" style="min-width: 200px">
          <template #body="{ data }">
            <div class="text-sm">
              <div class="flex items-center gap-2">
                <span class="text-neutral-500">{{ $t('admin.pricing.history.from') }}:</span>
                <span class="font-medium">{{ formatDate(data.valid_from) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-neutral-500">{{ $t('admin.pricing.history.to') }}:</span>
                <span class="font-medium">
                  <PrimeTag v-if="!data.valid_to" :value="$t('admin.pricing.history.inEffect')" severity="success" />
                  <template v-else>{{ formatDate(data.valid_to) }}</template>
                </span>
              </div>
            </div>
          </template>
        </PrimeColumn>

        <!-- Changed By -->
        <PrimeColumn field="changed_by" :header="$t('admin.pricing.history.columns.operator')" style="min-width: 130px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
                <i class="pi pi-user text-sm text-neutral-500"></i>
              </div>
              <span class="text-neutral-600">{{ data.changed_by || $t('admin.pricing.history.system') }}</span>
            </div>
          </template>
        </PrimeColumn>

        <!-- Actions -->
        <PrimeColumn :header="$t('admin.common.actions')" style="min-width: 80px" frozen alignFrozen="right">
          <template #body="{ data }">
            <PrimeButton
              icon="pi pi-eye"
              severity="secondary"
              text
              rounded
              size="small"
              v-tooltip.top="$t('admin.common.viewDetails')"
              @click="openDetailDialog(data)"
            />
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <!-- Detail Dialog -->
    <PrimeDialog
      v-model:visible="detailDialog"
      modal
      :header="$t('admin.pricing.history.dialog.title')"
      :style="{ width: '600px' }"
    >
      <div v-if="selectedEntry">
        <!-- Header Info -->
        <div class="bg-neutral-50 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
              <i class="pi pi-tag text-xl"></i>
            </div>
            <div>
              <div class="font-semibold text-neutral-900 text-lg">{{ selectedEntry.category_name }}</div>
              <div class="text-sm text-neutral-500">
                {{ $t('admin.pricing.history.dialog.modifiedOn') }} {{ formatDateTime(selectedEntry.changed_at) }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-neutral-500">{{ $t('admin.pricing.history.columns.operator') }}:</span>
              <span class="ml-2 font-medium">{{ selectedEntry.changed_by || $t('admin.pricing.history.system') }}</span>
            </div>
            <div>
              <span class="text-neutral-500">{{ $t('admin.pricing.history.dialog.status') }}:</span>
              <PrimeTag
                :value="selectedEntry.valid_to ? $t('admin.pricing.history.dialog.replaced') : $t('admin.pricing.history.dialog.active')"
                :severity="selectedEntry.valid_to ? 'secondary' : 'success'"
                class="ml-2"
              />
            </div>
          </div>
        </div>

        <!-- Price Details -->
        <div class="space-y-6">
          <!-- Exclusive Price -->
          <div>
            <h4 class="font-medium text-neutral-700 mb-3 flex items-center gap-2">
              <i class="pi pi-star-fill text-warning"></i>
              {{ $t('admin.pricing.history.dialog.exclusivePrice') }}
            </h4>
            <div class="bg-primary-50 rounded-lg p-4 text-center">
              <span class="text-2xl font-bold text-primary-700">
                {{ formatCurrency(selectedEntry.exclusive_price) }}
              </span>
            </div>
          </div>

          <!-- Shared Prices -->
          <div>
            <h4 class="font-medium text-neutral-700 mb-3 flex items-center gap-2">
              <i class="pi pi-users text-info"></i>
              {{ $t('admin.pricing.history.dialog.sharedPrices') }}
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div
                v-for="slotKey in getSortedSlotKeys(selectedEntry.shared_prices)"
                :key="slotKey"
                class="bg-info-50 rounded-lg p-3 text-center"
              >
                <div class="text-xs text-neutral-500 mb-1">Slot {{ getSlotNumber(slotKey) }}</div>
                <div class="font-semibold text-info-700">
                  {{ formatCurrency(selectedEntry.shared_prices[slotKey]) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Validity Period -->
          <div>
            <h4 class="font-medium text-neutral-700 mb-3 flex items-center gap-2">
              <i class="pi pi-calendar text-success"></i>
              {{ $t('admin.pricing.history.dialog.validityPeriod') }}
            </h4>
            <div class="flex gap-4">
              <div class="flex-1 bg-neutral-50 rounded-lg p-3">
                <div class="text-xs text-neutral-500 mb-1">{{ $t('admin.pricing.history.dialog.validFrom') }}</div>
                <div class="font-medium">{{ formatDate(selectedEntry.valid_from) }}</div>
              </div>
              <div class="flex-1 bg-neutral-50 rounded-lg p-3">
                <div class="text-xs text-neutral-500 mb-1">{{ $t('admin.pricing.history.dialog.validUntil') }}</div>
                <div class="font-medium">
                  {{ selectedEntry.valid_to ? formatDate(selectedEntry.valid_to) : $t('admin.pricing.history.dialog.currentlyInEffect') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <PrimeButton
          :label="$t('admin.pricing.history.dialog.close')"
          severity="secondary"
          @click="detailDialog = false"
        />
      </template>
    </PrimeDialog>
  </div>
</template>

<style scoped>
/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom styles */
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  font-weight: 600;
}

/* Info colors */
.bg-info-50 {
  background-color: #eff6ff;
}

.text-info-700 {
  color: #1d4ed8;
}

.bg-primary-50 {
  background-color: #f0f4ff;
}
</style>
