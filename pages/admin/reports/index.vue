<script setup lang="ts">
/**
 * Admin Reports Page - Report e Statistiche
 * Dashboard analitica con grafici, KPI e export dati
 */
import { useReportFormatters, useReportActions, useReportFilterOptions, useChartColors } from '~/composables/useReport'
import type { ReportPeriod, ExportType, ExportFormat } from '~/types/report'

definePageMeta({
  layout: 'admin'
})

// i18n
const { t } = useI18n()

// Store & Composables
const reportStore = useReportStore()
const {
  formatPeriod,
  formatExportType,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatPercentChange,
  getChangeClass,
  getChangeIcon,
  getTrendIcon,
  getTrendClass,
  formatDateTime
} = useReportFormatters()
const { confirmExport, showSuccess, showError, showExportStarted, showExportReady } = useReportActions()
const { periodOptions, exportTypeOptions, exportFormatOptions } = useReportFilterOptions()
const { revenueChartConfig, ordersChartConfig, getChartColor } = useChartColors()

// Refs
const activeTab = ref(0)
const exportDialog = ref(false)
const selectedExportType = ref<ExportType>('leads')
const selectedExportFormat = ref<ExportFormat>('xlsx')

// Filtri
const periodFilter = ref<ReportPeriod>('month')
const showCustomDates = ref(false)
const dateFrom = ref<Date | null>(null)
const dateTo = ref<Date | null>(null)

// Helper per formattare date per API
const formatDateForApi = (date: Date | null): string | undefined => {
  if (!date) return undefined
  return date.toISOString().split('T')[0]
}

// Helper per aprire URL
const openDownloadUrl = (url: string) => {
  globalThis.window.open(url, '_blank')
}

// Computed
const loading = computed(() => reportStore.loading)
const dashboardData = computed(() => reportStore.dashboardData)
const salesStats = computed(() => reportStore.salesStats)
const salesChart = computed(() => reportStore.salesChart)
const categoryPerformance = computed(() => reportStore.categoryPerformance)
const provinceStats = computed(() => reportStore.provinceStats)
const regionStats = computed(() => reportStore.regionStats)

// Chart Data
const revenueChartData = computed(() => {
  if (!salesChart.value) return null
  return {
    labels: salesChart.value.labels,
    datasets: [
      {
        label: t('admin.reports.salesStats.chartLabels.revenue'),
        data: salesChart.value.datasets.revenue,
        ...revenueChartConfig
      }
    ]
  }
})

const ordersChartData = computed(() => {
  if (!salesChart.value) return null
  return {
    labels: salesChart.value.labels,
    datasets: [
      {
        label: t('admin.reports.salesStats.chartLabels.orders'),
        data: salesChart.value.datasets.orders,
        ...ordersChartConfig
      }
    ]
  }
})

const categoryChartData = computed(() => {
  if (!categoryPerformance.value.length) return null
  const top5 = [...categoryPerformance.value].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  return {
    labels: top5.map(c => c.name),
    datasets: [
      {
        data: top5.map(c => c.revenue),
        backgroundColor: top5.map((_, i) => getChartColor(i))
      }
    ]
  }
})

const regionChartData = computed(() => {
  if (!regionStats.value.length) return null
  const top5 = [...regionStats.value].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  return {
    labels: top5.map(r => r.region),
    datasets: [
      {
        data: top5.map(r => r.revenue),
        backgroundColor: top5.map((_, i) => getChartColor(i))
      }
    ]
  }
})

// Chart Options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
}

// Methods
const loadAllData = async () => {
  await Promise.all([
    reportStore.fetchSalesStats(),
    reportStore.fetchCategoryPerformance(),
    reportStore.fetchGeographicStats()
  ])
}

const onPeriodChange = () => {
  showCustomDates.value = periodFilter.value === 'custom'
  if (periodFilter.value !== 'custom') {
    reportStore.setFilters({ period: periodFilter.value })
    loadAllData()
  }
}

const applyCustomDates = () => {
  if (dateFrom.value && dateTo.value) {
    reportStore.setFilters({
      period: 'custom',
      date_from: formatDateForApi(dateFrom.value),
      date_to: formatDateForApi(dateTo.value)
    })
    loadAllData()
  }
}

const openExportDialog = () => {
  selectedExportType.value = 'leads'
  selectedExportFormat.value = 'xlsx'
  exportDialog.value = true
}

const handleExport = async () => {
  showExportStarted()
  exportDialog.value = false

  const result = await reportStore.startExport({
    type: selectedExportType.value,
    format: selectedExportFormat.value,
    filters: {
      date_from: formatDateForApi(dateFrom.value),
      date_to: formatDateForApi(dateTo.value)
    }
  })

  if (result) {
    if (result.download_url) {
      showExportReady(result.download_url)
      openDownloadUrl(result.download_url)
    }
  } else {
    showError(reportStore.error || t('admin.reports.toast.exportError'))
  }
}

// Lifecycle
onMounted(() => {
  loadAllData()
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">{{ $t('admin.reports.title') }}</h1>
        <p class="page-subtitle">{{ $t('admin.reports.subtitle') }}</p>
      </div>
      <div class="page-header-actions">
        <PrimeButton
          :label="$t('admin.reports.exportData')"
          icon="pi pi-download"
          severity="primary"
          @click="openExportDialog"
        />
      </div>
    </div>

    <!-- Period Filter -->
    <div class="q-card mb-6">
      <div class="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium text-neutral-700">{{ $t('admin.reports.period') }}</label>
          <PrimeSelect
            v-model="periodFilter"
            :options="periodOptions"
            optionLabel="label"
            optionValue="value"
            class="w-48"
            @change="onPeriodChange"
          />
        </div>

        <!-- Custom Date Range -->
        <Transition name="fade">
          <div v-if="showCustomDates" class="flex items-center gap-3">
            <PrimeDatePicker
              v-model="dateFrom"
              dateFormat="dd/mm/yy"
              :placeholder="$t('admin.reports.customDates.startDate')"
              class="w-40"
            />
            <span class="text-neutral-500">-</span>
            <PrimeDatePicker
              v-model="dateTo"
              dateFormat="dd/mm/yy"
              :placeholder="$t('admin.reports.customDates.endDate')"
              class="w-40"
            />
            <PrimeButton
              :label="$t('admin.reports.customDates.apply')"
              icon="pi pi-check"
              severity="primary"
              size="small"
              @click="applyCustomDates"
            />
          </div>
        </Transition>

        <div class="ml-auto">
          <PrimeButton
            icon="pi pi-refresh"
            severity="secondary"
            text
            rounded
            :loading="loading"
            v-tooltip.top="$t('admin.reports.refresh')"
            @click="loadAllData"
          />
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <PrimeTabView v-model:activeIndex="activeTab" class="q-card">
      <!-- Tab: Statistiche Vendite -->
      <PrimeTabPanel value="0" :header="$t('admin.reports.tabs.salesStats')">
        <div class="pt-4 space-y-6">
          <!-- KPI Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div class="kpi-card">
              <div class="kpi-card-icon primary">
                <i class="pi pi-euro"></i>
              </div>
              <div class="kpi-card-value">{{ formatCurrency(salesStats?.total_revenue || 0) }}</div>
              <div class="kpi-card-label">{{ $t('admin.reports.salesStats.kpis.totalRevenue') }}</div>
              <div
                v-if="salesStats?.revenue_change_percent !== undefined"
                class="mt-2 text-sm flex items-center gap-1"
                :class="getChangeClass(salesStats.revenue_change_percent)"
              >
                <i :class="getChangeIcon(salesStats.revenue_change_percent)"></i>
                {{ formatPercentChange(salesStats.revenue_change_percent) }}
                <span class="text-neutral-500 ml-1">{{ $t('admin.reports.salesStats.vsPreviousPeriod') }}</span>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-card-icon success">
                <i class="pi pi-shopping-cart"></i>
              </div>
              <div class="kpi-card-value">{{ formatNumber(salesStats?.total_orders || 0) }}</div>
              <div class="kpi-card-label">{{ $t('admin.reports.salesStats.kpis.totalOrders') }}</div>
              <div
                v-if="salesStats?.orders_change_percent !== undefined"
                class="mt-2 text-sm flex items-center gap-1"
                :class="getChangeClass(salesStats.orders_change_percent)"
              >
                <i :class="getChangeIcon(salesStats.orders_change_percent)"></i>
                {{ formatPercentChange(salesStats.orders_change_percent) }}
                <span class="text-neutral-500 ml-1">{{ $t('admin.reports.salesStats.vsPreviousPeriod') }}</span>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-card-icon info">
                <i class="pi pi-list"></i>
              </div>
              <div class="kpi-card-value">{{ formatNumber(salesStats?.total_leads_sold || 0) }}</div>
              <div class="kpi-card-label">{{ $t('admin.reports.salesStats.kpis.soldLeads') }}</div>
            </div>

            <div class="kpi-card">
              <div class="kpi-card-icon warning">
                <i class="pi pi-chart-line"></i>
              </div>
              <div class="kpi-card-value">{{ formatCurrency(salesStats?.average_order_value || 0) }}</div>
              <div class="kpi-card-label">{{ $t('admin.reports.salesStats.kpis.avgOrderValue') }}</div>
            </div>
          </div>

          <!-- Charts -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Revenue Chart -->
            <div class="bg-neutral-50 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">{{ $t('admin.reports.salesStats.revenueChart') }}</h4>
              <div class="h-64">
                <PrimeChart
                  v-if="revenueChartData"
                  type="line"
                  :data="revenueChartData"
                  :options="lineChartOptions"
                />
                <div v-else class="flex items-center justify-center h-full">
                  <i class="pi pi-spin pi-spinner text-2xl text-neutral-400"></i>
                </div>
              </div>
            </div>

            <!-- Orders Chart -->
            <div class="bg-neutral-50 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">{{ $t('admin.reports.salesStats.ordersChart') }}</h4>
              <div class="h-64">
                <PrimeChart
                  v-if="ordersChartData"
                  type="line"
                  :data="ordersChartData"
                  :options="lineChartOptions"
                />
                <div v-else class="flex items-center justify-center h-full">
                  <i class="pi pi-spin pi-spinner text-2xl text-neutral-400"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PrimeTabPanel>

      <!-- Tab: Performance Categorie -->
      <PrimeTabPanel value="1" :header="$t('admin.reports.tabs.categoryPerformance')">
        <div class="pt-4 space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Chart -->
            <div class="bg-neutral-50 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">{{ $t('admin.reports.categoryPerformance.top5Chart') }}</h4>
              <div class="h-64">
                <PrimeChart
                  v-if="categoryChartData"
                  type="doughnut"
                  :data="categoryChartData"
                  :options="pieChartOptions"
                />
                <div v-else class="flex items-center justify-center h-full">
                  <i class="pi pi-spin pi-spinner text-2xl text-neutral-400"></i>
                </div>
              </div>
            </div>

            <!-- Table -->
            <div class="lg:col-span-2">
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">{{ $t('admin.reports.categoryPerformance.detailTitle') }}</h4>
              <PrimeDataTable
                :value="categoryPerformance"
                :loading="loading"
                stripedRows
                class="text-sm"
              >
                <PrimeColumn field="name" :header="$t('admin.reports.categoryPerformance.headers.category')" sortable>
                  <template #body="{ data }">
                    <span class="font-medium text-neutral-900">{{ data.name }}</span>
                  </template>
                </PrimeColumn>
                <PrimeColumn field="total_leads" :header="$t('admin.reports.categoryPerformance.headers.totalLeads')" sortable>
                  <template #body="{ data }">
                    {{ formatNumber(data.total_leads) }}
                  </template>
                </PrimeColumn>
                <PrimeColumn field="leads_sold" :header="$t('admin.reports.categoryPerformance.headers.sold')" sortable>
                  <template #body="{ data }">
                    <span class="text-success-600 font-medium">{{ formatNumber(data.leads_sold) }}</span>
                  </template>
                </PrimeColumn>
                <PrimeColumn field="leads_available" :header="$t('admin.reports.categoryPerformance.headers.available')" sortable>
                  <template #body="{ data }">
                    <span :class="data.leads_available < 20 ? 'text-danger-600' : 'text-neutral-700'">
                      {{ formatNumber(data.leads_available) }}
                    </span>
                  </template>
                </PrimeColumn>
                <PrimeColumn field="revenue" :header="$t('admin.reports.categoryPerformance.headers.revenue')" sortable>
                  <template #body="{ data }">
                    <span class="font-semibold">{{ formatCurrency(data.revenue) }}</span>
                  </template>
                </PrimeColumn>
                <PrimeColumn field="sell_through_rate" :header="$t('admin.reports.categoryPerformance.headers.sellThrough')" sortable>
                  <template #body="{ data }">
                    <div class="flex items-center gap-2">
                      <div class="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          class="h-full bg-primary-500 rounded-full"
                          :style="{ width: `${data.sell_through_rate}%` }"
                        ></div>
                      </div>
                      <span class="text-xs text-neutral-600">{{ formatPercent(data.sell_through_rate) }}</span>
                    </div>
                  </template>
                </PrimeColumn>
              </PrimeDataTable>
            </div>
          </div>
        </div>
      </PrimeTabPanel>

      <!-- Tab: Analisi Geografica -->
      <PrimeTabPanel value="2" :header="$t('admin.reports.tabs.geographicAnalysis')">
        <div class="pt-4 space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Chart -->
            <div class="bg-neutral-50 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">{{ $t('admin.reports.geographicAnalysis.top5RegionsChart') }}</h4>
              <div class="h-64">
                <PrimeChart
                  v-if="regionChartData"
                  type="pie"
                  :data="regionChartData"
                  :options="pieChartOptions"
                />
                <div v-else class="flex items-center justify-center h-full">
                  <i class="pi pi-spin pi-spinner text-2xl text-neutral-400"></i>
                </div>
              </div>
            </div>

            <!-- Regions Table -->
            <div class="lg:col-span-2">
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">{{ $t('admin.reports.geographicAnalysis.regionPerformance') }}</h4>
              <PrimeDataTable
                :value="regionStats"
                :loading="loading"
                stripedRows
                class="text-sm"
              >
                <PrimeColumn field="region" :header="$t('admin.reports.geographicAnalysis.regionHeaders.region')" sortable>
                  <template #body="{ data }">
                    <span class="font-medium text-neutral-900">{{ data.region }}</span>
                  </template>
                </PrimeColumn>
                <PrimeColumn field="provinces_count" :header="$t('admin.reports.geographicAnalysis.regionHeaders.provinces')" sortable>
                  <template #body="{ data }">
                    {{ data.provinces_count }}
                  </template>
                </PrimeColumn>
                <PrimeColumn field="total_leads" :header="$t('admin.reports.geographicAnalysis.regionHeaders.totalLeads')" sortable>
                  <template #body="{ data }">
                    {{ formatNumber(data.total_leads) }}
                  </template>
                </PrimeColumn>
                <PrimeColumn field="leads_sold" :header="$t('admin.reports.geographicAnalysis.regionHeaders.sold')" sortable>
                  <template #body="{ data }">
                    <span class="text-success-600 font-medium">{{ formatNumber(data.leads_sold) }}</span>
                  </template>
                </PrimeColumn>
                <PrimeColumn field="revenue" :header="$t('admin.reports.geographicAnalysis.regionHeaders.revenue')" sortable>
                  <template #body="{ data }">
                    <span class="font-semibold">{{ formatCurrency(data.revenue) }}</span>
                  </template>
                </PrimeColumn>
              </PrimeDataTable>
            </div>
          </div>

          <!-- Province Detail -->
          <div>
            <h4 class="text-lg font-semibold text-neutral-900 mb-4">{{ $t('admin.reports.geographicAnalysis.topProvinces') }}</h4>
            <PrimeDataTable
              :value="provinceStats"
              :loading="loading"
              :rows="10"
              :paginator="true"
              stripedRows
              class="text-sm"
            >
              <PrimeColumn field="province_code" :header="$t('admin.reports.geographicAnalysis.provinceHeaders.province')" sortable style="width: 100px">
                <template #body="{ data }">
                  <span class="font-mono font-bold text-primary-600">{{ data.province_code }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="province_name" :header="$t('admin.reports.geographicAnalysis.provinceHeaders.name')" sortable>
                <template #body="{ data }">
                  <span class="font-medium text-neutral-900">{{ data.province_name }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="region" :header="$t('admin.reports.geographicAnalysis.provinceHeaders.region')" sortable>
                <template #body="{ data }">
                  <span class="text-neutral-600">{{ data.region }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="top_category" :header="$t('admin.reports.geographicAnalysis.provinceHeaders.topCategory')">
                <template #body="{ data }">
                  <PrimeTag :value="data.top_category" severity="info" v-if="data.top_category" />
                  <span v-else class="text-neutral-400">-</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="total_leads" :header="$t('admin.reports.geographicAnalysis.provinceHeaders.leads')" sortable>
                <template #body="{ data }">
                  {{ formatNumber(data.total_leads) }}
                </template>
              </PrimeColumn>
              <PrimeColumn field="leads_sold" :header="$t('admin.reports.geographicAnalysis.provinceHeaders.sold')" sortable>
                <template #body="{ data }">
                  <span class="text-success-600 font-medium">{{ formatNumber(data.leads_sold) }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="revenue" :header="$t('admin.reports.geographicAnalysis.provinceHeaders.revenue')" sortable>
                <template #body="{ data }">
                  <span class="font-semibold">{{ formatCurrency(data.revenue) }}</span>
                </template>
              </PrimeColumn>
            </PrimeDataTable>
          </div>
        </div>
      </PrimeTabPanel>

      <!-- Tab: Export Dati -->
      <PrimeTabPanel value="3" :header="$t('admin.reports.tabs.dataExport')">
        <div class="pt-4">
          <div class="max-w-2xl">
            <p class="text-neutral-600 mb-6">
              {{ $t('admin.reports.dataExport.description') }}
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="option in exportTypeOptions"
                :key="option.value"
                class="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors"
                @click="selectedExportType = option.value as ExportType; exportDialog = true"
              >
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                    <i :class="option.icon" class="text-lg"></i>
                  </div>
                  <div class="flex-1">
                    <h5 class="font-semibold text-neutral-900">{{ option.label }}</h5>
                    <p class="text-sm text-neutral-600 mt-1">{{ option.description }}</p>
                  </div>
                  <i class="pi pi-download text-neutral-400"></i>
                </div>
              </div>
            </div>

            <!-- Recent Exports -->
            <div v-if="reportStore.completedExports.length > 0" class="mt-8">
              <h4 class="text-lg font-semibold text-neutral-900 mb-4">{{ $t('admin.reports.dataExport.recentExports') }}</h4>
              <div class="space-y-2">
                <div
                  v-for="exp in reportStore.completedExports.slice(0, 5)"
                  :key="exp.id"
                  class="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                >
                  <div class="flex items-center gap-3">
                    <i class="pi pi-file-excel text-success-600"></i>
                    <div>
                      <span class="font-medium text-neutral-900">{{ formatExportType(exp.type) }}</span>
                      <span class="text-sm text-neutral-500 ml-2">{{ formatDateTime(exp.completed_at) }}</span>
                    </div>
                  </div>
                  <PrimeButton
                    v-if="exp.download_url"
                    icon="pi pi-download"
                    severity="secondary"
                    text
                    size="small"
                    @click="openDownloadUrl(exp.download_url!)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PrimeTabPanel>
    </PrimeTabView>

    <!-- Export Dialog -->
    <PrimeDialog
      v-model:visible="exportDialog"
      modal
      :header="$t('admin.reports.dataExport.dialogTitle')"
      :style="{ width: '450px' }"
    >
      <div class="space-y-4">
        <div class="form-group">
          <label class="block text-sm font-medium text-neutral-700 mb-2">{{ $t('admin.reports.dataExport.dataType') }}</label>
          <PrimeSelect
            v-model="selectedExportType"
            :options="exportTypeOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>

        <div class="form-group">
          <label class="block text-sm font-medium text-neutral-700 mb-2">{{ $t('admin.reports.dataExport.format') }}</label>
          <PrimeSelect
            v-model="selectedExportFormat"
            :options="exportFormatOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>

        <div class="p-3 bg-info-50 rounded-lg flex items-start gap-3">
          <i class="pi pi-info-circle text-info-600"></i>
          <p class="text-sm text-info-800">
            {{ $t('admin.reports.dataExport.periodInfo', { period: formatPeriod(periodFilter) }) }}
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <PrimeButton
            :label="$t('admin.reports.dataExport.cancel')"
            severity="secondary"
            outlined
            @click="exportDialog = false"
          />
          <PrimeButton
            :label="$t('admin.reports.dataExport.export')"
            severity="primary"
            icon="pi pi-download"
            :loading="reportStore.exporting"
            @click="handleExport"
          />
        </div>
      </template>
    </PrimeDialog>
  </div>
</template>

<style scoped>
/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
