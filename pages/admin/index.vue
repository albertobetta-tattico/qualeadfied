<script setup lang="ts">
/**
 * Admin Dashboard Page
 * Shows KPI cards, charts, and recent data tables
 * Connected to real API data via /api/admin/dashboard
 */
const { t } = useI18n()

definePageMeta({
  layout: 'admin'
})

// Dashboard data from API
const loading = ref(true)
const error = ref<string | null>(null)

interface DashboardApiData {
  kpis: {
    total_leads: number
    leads_this_month: number
    leads_trend: number
    orders_this_month: number
    orders_trend: number
    revenue_this_month: number
    revenue_trend: number
    new_clients_this_month: number
    new_clients_trend: number
  }
  recent_leads: Array<{
    id: number
    full_name: string
    email: string
    status: string
    current_shares: number
    created_at: string
    category: { id: number; name: string; max_shares: number } | null
    province: { id: number; name: string; code: string } | null
  }>
  recent_orders: Array<{
    id: number
    order_number: string
    total: string | number
    status: string
    created_at: string
    user: {
      id: number
      email: string
      client_profile?: { company_name: string } | null
    } | null
  }>
  top_categories: Array<{
    id: number
    name: string
    leads_count: number
  }>
}

const dashboardData = ref<DashboardApiData | null>(null)

// Fetch dashboard data
const fetchDashboard = async () => {
  loading.value = true
  error.value = null
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('admin_token')
    const response = await $fetch<{ data: DashboardApiData }>(`${config.public.apiBase}/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    })
    dashboardData.value = response.data
  } catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Errore nel caricamento della dashboard'
    console.error('Dashboard fetch error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboard()
})

// KPI Data - computed from API
const kpiCards = computed(() => {
  const kpis = dashboardData.value?.kpis
  if (!kpis) return []

  // Il backend ritorna `null` quando non c'è una baseline (mese precedente a 0).
  // In quel caso mostriamo "—" invece di un fuorviante "0%".
  const formatTrend = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '—'
    if (value === 0) return '0%'
    return value > 0 ? `+${value}%` : `${value}%`
  }

  const trendDirection = (value: number | null | undefined): 'up' | 'down' | 'neutral' => {
    if (value === null || value === undefined) return 'neutral'
    return value >= 0 ? 'up' : 'down'
  }

  return [
    {
      label: t('admin.dashboard.kpis.availableLeads'),
      value: kpis.total_leads.toLocaleString('it-IT'),
      icon: 'pi pi-list',
      iconClass: 'primary',
      trend: formatTrend(kpis.leads_trend),
      trendDirection: trendDirection(kpis.leads_trend)
    },
    {
      label: t('admin.dashboard.kpis.soldLeadsMonth'),
      value: kpis.orders_this_month.toLocaleString('it-IT'),
      icon: 'pi pi-shopping-cart',
      iconClass: 'success',
      trend: formatTrend(kpis.orders_trend),
      trendDirection: trendDirection(kpis.orders_trend)
    },
    {
      label: t('admin.dashboard.kpis.revenueMonth'),
      value: `€ ${Number(kpis.revenue_this_month).toLocaleString('it-IT', { minimumFractionDigits: 2 })}`,
      icon: 'pi pi-euro',
      iconClass: 'accent',
      trend: formatTrend(kpis.revenue_trend),
      trendDirection: trendDirection(kpis.revenue_trend)
    },
    {
      label: t('admin.dashboard.kpis.newClients'),
      value: kpis.new_clients_this_month.toLocaleString('it-IT'),
      icon: 'pi pi-users',
      iconClass: 'info',
      trend: formatTrend(kpis.new_clients_trend),
      trendDirection: trendDirection(kpis.new_clients_trend)
    }
  ]
})

// Recent Leads - from API
const recentLeads = computed(() => {
  if (!dashboardData.value?.recent_leads) return []
  return dashboardData.value.recent_leads.map(lead => ({
    id: lead.id,
    name: lead.full_name || '-',
    email: lead.email,
    category: lead.category?.name || '-',
    province: lead.province?.name || '-',
    status: lead.status,
    slots: lead.status === 'shared' && lead.category
      ? `${lead.current_shares}/${lead.category.max_shares}`
      : undefined,
    date: new Date(lead.created_at).toLocaleDateString('it-IT')
  }))
})

// Recent Orders - from API
const recentOrders = computed(() => {
  if (!dashboardData.value?.recent_orders) return []
  return dashboardData.value.recent_orders.map(order => ({
    id: order.order_number || `ORD-${order.id}`,
    client: order.user?.client_profile?.company_name || order.user?.email || '-',
    amount: `€ ${Number(order.total).toLocaleString('it-IT', { minimumFractionDigits: 2 })}`,
    status: order.status,
    date: new Date(order.created_at).toLocaleDateString('it-IT')
  }))
})

// Top Categories - from API
const topCategories = computed(() => {
  if (!dashboardData.value?.top_categories) return []
  const cats = dashboardData.value.top_categories
  const maxCount = cats.length > 0 ? Math.max(...cats.map(c => c.leads_count)) : 1
  return cats.map(cat => ({
    name: cat.name,
    count: cat.leads_count,
    percentage: maxCount > 0 ? Math.round((cat.leads_count / maxCount) * 100) : 0
  }))
})

// Status badge helpers
const getLeadStatusLabel = (status: string) => {
  const key = `admin.dashboard.leadStatuses.${status}`
  return t(key) !== key ? t(key) : status
}

const getOrderStatusLabel = (status: string) => {
  const key = `admin.dashboard.orderStatuses.${status}`
  return t(key) !== key ? t(key) : status
}

const getOrderStatusSeverity = (status: string) => {
  const severities: Record<string, string> = {
    paid: 'success',
    processing: 'info',
    failed: 'danger',
    pending: 'warn'
  }
  return severities[status] || 'secondary'
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">{{ $t('admin.dashboard.title') }}</h1>
        <p class="page-subtitle">{{ $t('admin.dashboard.subtitle') }}</p>
      </div>
      <div class="page-header-actions">
        <PrimeButton
          :label="$t('admin.leads.list.actions.newLead')"
          icon="pi pi-plus"
          severity="primary"
          @click="navigateTo('/admin/leads/create')"
        />
        <PrimeButton
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          :loading="loading"
          @click="fetchDashboard"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !dashboardData" class="flex justify-center items-center py-20">
      <PrimeProgressSpinner style="width: 50px; height: 50px" />
    </div>

    <!-- Error State -->
    <div v-else-if="error && !dashboardData" class="q-card">
      <div class="q-card-body text-center py-10">
        <i class="pi pi-exclamation-triangle text-4xl text-orange-500 mb-4"></i>
        <p class="text-neutral-600 mb-4">{{ error }}</p>
        <PrimeButton label="Riprova" icon="pi pi-refresh" @click="fetchDashboard" />
      </div>
    </div>

    <!-- Dashboard Content -->
    <template v-else>
      <!-- KPI Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div
          v-for="kpi in kpiCards"
          :key="kpi.label"
          class="kpi-card"
        >
          <div class="kpi-card-icon" :class="kpi.iconClass">
            <i :class="kpi.icon"></i>
          </div>
          <div class="kpi-card-value">{{ kpi.value }}</div>
          <div class="kpi-card-label">{{ kpi.label }}</div>
          <div class="kpi-card-trend" :class="kpi.trendDirection">
            <i
              v-if="kpi.trendDirection !== 'neutral'"
              class="trend-icon"
              :class="kpi.trendDirection === 'up' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
            ></i>
            <span>{{ $t('admin.dashboard.kpis.trend', { trend: kpi.trend }) }}</span>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <!-- Recent Leads Card -->
        <div class="q-card">
          <div class="q-card-header">
            <h3 class="card-title">{{ $t('admin.dashboard.recentLeads.title') }}</h3>
            <NuxtLink to="/admin/leads" class="text-sm text-primary-500 hover:text-primary-600">
              {{ $t('admin.dashboard.recentLeads.viewAll') }} <i class="pi pi-arrow-right ml-1"></i>
            </NuxtLink>
          </div>
          <div class="q-card-body">
            <PrimeDataTable
              :value="recentLeads"
              :rows="5"
              stripedRows
              class="text-sm"
            >
              <PrimeColumn field="name" :header="$t('admin.dashboard.recentLeads.headers.name')">
                <template #body="{ data }">
                  <div>
                    <div class="font-medium text-neutral-900">{{ data.name }}</div>
                    <div class="text-xs text-neutral-500">{{ data.email }}</div>
                  </div>
                </template>
              </PrimeColumn>
              <PrimeColumn field="category" :header="$t('admin.dashboard.recentLeads.headers.category')">
                <template #body="{ data }">
                  <span class="text-neutral-700">{{ data.category }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="province" :header="$t('admin.dashboard.recentLeads.headers.province')">
                <template #body="{ data }">
                  <span class="text-neutral-600">{{ data.province }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="status" :header="$t('admin.dashboard.recentLeads.headers.status')">
                <template #body="{ data }">
                  <span
                    class="lead-badge"
                    :class="data.status"
                  >
                    {{ getLeadStatusLabel(data.status) }}
                    <span v-if="data.slots" class="ml-1">({{ data.slots }})</span>
                  </span>
                </template>
              </PrimeColumn>
            </PrimeDataTable>
          </div>
        </div>

        <!-- Recent Orders Card -->
        <div class="q-card">
          <div class="q-card-header">
            <h3 class="card-title">{{ $t('admin.dashboard.recentOrders.title') }}</h3>
            <NuxtLink to="/admin/orders" class="text-sm text-primary-500 hover:text-primary-600">
              {{ $t('admin.dashboard.recentOrders.viewAll') }} <i class="pi pi-arrow-right ml-1"></i>
            </NuxtLink>
          </div>
          <div class="q-card-body">
            <PrimeDataTable
              :value="recentOrders"
              :rows="5"
              stripedRows
              class="text-sm"
            >
              <PrimeColumn field="id" :header="$t('admin.dashboard.recentOrders.headers.order')">
                <template #body="{ data }">
                  <span class="font-mono text-primary-600">{{ data.id }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="client" :header="$t('admin.dashboard.recentOrders.headers.client')">
                <template #body="{ data }">
                  <span class="font-medium text-neutral-900">{{ data.client }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="amount" :header="$t('admin.dashboard.recentOrders.headers.amount')">
                <template #body="{ data }">
                  <span class="font-semibold text-neutral-900">{{ data.amount }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="status" :header="$t('admin.dashboard.recentOrders.headers.status')">
                <template #body="{ data }">
                  <PrimeTag
                    :value="getOrderStatusLabel(data.status)"
                    :severity="getOrderStatusSeverity(data.status)"
                  />
                </template>
              </PrimeColumn>
              <PrimeColumn field="date" :header="$t('admin.dashboard.recentOrders.headers.date')">
                <template #body="{ data }">
                  <span class="text-neutral-600">{{ data.date }}</span>
                </template>
              </PrimeColumn>
            </PrimeDataTable>
          </div>
        </div>
      </div>

      <!-- Additional Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <!-- Top Categories -->
        <div class="q-card">
          <div class="q-card-header">
            <h3 class="card-title">{{ $t('admin.dashboard.topCategories') }}</h3>
          </div>
          <div class="q-card-body">
            <div class="space-y-4">
              <div
                v-for="cat in topCategories"
                :key="cat.name"
                class="flex items-center justify-between"
              >
                <span class="text-neutral-700">{{ cat.name }}</span>
                <div class="flex items-center gap-3">
                  <div class="w-32 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-primary-500 rounded-full"
                      :style="{ width: cat.percentage + '%' }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium text-neutral-900">{{ cat.count }}</span>
                </div>
              </div>
              <div v-if="topCategories.length === 0" class="text-neutral-500 text-sm text-center py-4">
                Nessuna categoria disponibile
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="q-card">
          <div class="q-card-header">
            <h3 class="card-title">{{ $t('admin.dashboard.topProvinces') }}</h3>
          </div>
          <div class="q-card-body">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-neutral-600 text-sm">Lead totali</span>
                <span class="text-lg font-semibold text-neutral-900">{{ dashboardData?.kpis.total_leads || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-neutral-600 text-sm">Lead questo mese</span>
                <span class="text-lg font-semibold text-neutral-900">{{ dashboardData?.kpis.leads_this_month || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-neutral-600 text-sm">Ordini questo mese</span>
                <span class="text-lg font-semibold text-neutral-900">{{ dashboardData?.kpis.orders_this_month || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-neutral-600 text-sm">Nuovi clienti</span>
                <span class="text-lg font-semibold text-neutral-900">{{ dashboardData?.kpis.new_clients_this_month || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-neutral-600 text-sm">Fatturato mese</span>
                <span class="text-lg font-semibold text-success">€ {{ Number(dashboardData?.kpis.revenue_this_month || 0).toLocaleString('it-IT', { minimumFractionDigits: 2 }) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="q-card">
          <div class="q-card-header">
            <h3 class="card-title">{{ $t('admin.dashboard.activityFeed') }}</h3>
          </div>
          <div class="q-card-body">
            <div class="space-y-3">
              <NuxtLink
                to="/admin/leads/create"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <i class="pi pi-plus text-primary-600 text-sm"></i>
                </div>
                <span class="text-sm text-neutral-700">Nuovo Lead</span>
              </NuxtLink>
              <NuxtLink
                to="/admin/leads/import"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-info-100 flex items-center justify-center">
                  <i class="pi pi-upload text-info-600 text-sm"></i>
                </div>
                <span class="text-sm text-neutral-700">Importa Lead</span>
              </NuxtLink>
              <NuxtLink
                to="/admin/reports"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center">
                  <i class="pi pi-chart-bar text-accent-600 text-sm"></i>
                </div>
                <span class="text-sm text-neutral-700">Report Vendite</span>
              </NuxtLink>
              <NuxtLink
                to="/admin/settings"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                  <i class="pi pi-cog text-neutral-600 text-sm"></i>
                </div>
                <span class="text-sm text-neutral-700">Impostazioni</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
