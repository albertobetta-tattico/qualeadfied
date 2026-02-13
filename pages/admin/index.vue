<script setup lang="ts">
/**
 * Admin Dashboard Page
 * Shows KPI cards, charts, and recent data tables
 */
const { t } = useI18n()

definePageMeta({
  layout: 'admin'
})

// KPI Data
const kpiCards = computed(() => [
  {
    label: t('admin.dashboard.kpis.availableLeads'),
    value: '1,234',
    icon: 'pi pi-list',
    iconClass: 'primary',
    trend: '+12%',
    trendDirection: 'up'
  },
  {
    label: t('admin.dashboard.kpis.soldLeadsMonth'),
    value: '456',
    icon: 'pi pi-shopping-cart',
    iconClass: 'success',
    trend: '+8%',
    trendDirection: 'up'
  },
  {
    label: t('admin.dashboard.kpis.revenueMonth'),
    value: '€ 12,450',
    icon: 'pi pi-euro',
    iconClass: 'accent',
    trend: '+23%',
    trendDirection: 'up'
  },
  {
    label: t('admin.dashboard.kpis.newClients'),
    value: '28',
    icon: 'pi pi-users',
    iconClass: 'info',
    trend: '-5%',
    trendDirection: 'down'
  }
])

// Recent Leads Data
const recentLeads = ref([
  {
    id: 1,
    name: 'Mario Rossi',
    email: 'm.rossi@email.it',
    category: 'Fotovoltaico',
    province: 'Milano',
    status: 'free',
    date: '2026-01-12'
  },
  {
    id: 2,
    name: 'Giulia Bianchi',
    email: 'g.bianchi@email.it',
    category: 'Infissi',
    province: 'Roma',
    status: 'shared',
    slots: '1/3',
    date: '2026-01-12'
  },
  {
    id: 3,
    name: 'Luca Verdi',
    email: 'l.verdi@email.it',
    category: 'Climatizzazione',
    province: 'Napoli',
    status: 'exclusive',
    date: '2026-01-11'
  },
  {
    id: 4,
    name: 'Anna Ferrari',
    email: 'a.ferrari@email.it',
    category: 'Fotovoltaico',
    province: 'Torino',
    status: 'exhausted',
    date: '2026-01-11'
  },
  {
    id: 5,
    name: 'Paolo Russo',
    email: 'p.russo@email.it',
    category: 'Caldaie',
    province: 'Bologna',
    status: 'free',
    date: '2026-01-10'
  }
])

// Recent Orders
const recentOrders = ref([
  {
    id: 'ORD-2026-00142',
    client: 'Azienda Alpha Srl',
    amount: '€ 450,00',
    status: 'paid',
    date: '2026-01-12'
  },
  {
    id: 'ORD-2026-00141',
    client: 'Beta Solutions',
    amount: '€ 1.200,00',
    status: 'paid',
    date: '2026-01-12'
  },
  {
    id: 'ORD-2026-00140',
    client: 'Gamma Tech Srl',
    amount: '€ 300,00',
    status: 'processing',
    date: '2026-01-11'
  },
  {
    id: 'ORD-2026-00139',
    client: 'Delta Corp',
    amount: '€ 750,00',
    status: 'paid',
    date: '2026-01-11'
  },
  {
    id: 'ORD-2026-00138',
    client: 'Epsilon Ltd',
    amount: '€ 225,00',
    status: 'failed',
    date: '2026-01-10'
  }
])

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
        />
        <PrimeButton
          :label="$t('admin.common.export')"
          icon="pi pi-download"
          severity="secondary"
          outlined
        />
      </div>
    </div>

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
            <div class="flex items-center justify-between">
              <span class="text-neutral-700">Fotovoltaico</span>
              <div class="flex items-center gap-3">
                <div class="w-32 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div class="h-full bg-primary-500 rounded-full" style="width: 75%"></div>
                </div>
                <span class="text-sm font-medium text-neutral-900">345</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-neutral-700">Infissi</span>
              <div class="flex items-center gap-3">
                <div class="w-32 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div class="h-full bg-primary-500 rounded-full" style="width: 60%"></div>
                </div>
                <span class="text-sm font-medium text-neutral-900">278</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-neutral-700">Climatizzazione</span>
              <div class="flex items-center gap-3">
                <div class="w-32 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div class="h-full bg-primary-500 rounded-full" style="width: 45%"></div>
                </div>
                <span class="text-sm font-medium text-neutral-900">189</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-neutral-700">Caldaie</span>
              <div class="flex items-center gap-3">
                <div class="w-32 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div class="h-full bg-primary-500 rounded-full" style="width: 30%"></div>
                </div>
                <span class="text-sm font-medium text-neutral-900">124</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Provinces -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">{{ $t('admin.dashboard.topProvinces') }}</h3>
        </div>
        <div class="q-card-body">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-neutral-700">Milano (MI)</span>
              <span class="text-sm font-medium text-neutral-900">234</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-neutral-700">Roma (RM)</span>
              <span class="text-sm font-medium text-neutral-900">198</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-neutral-700">Torino (TO)</span>
              <span class="text-sm font-medium text-neutral-900">156</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-neutral-700">Napoli (NA)</span>
              <span class="text-sm font-medium text-neutral-900">134</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-neutral-700">Bologna (BO)</span>
              <span class="text-sm font-medium text-neutral-900">98</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Feed -->
      <div class="q-card">
        <div class="q-card-header">
          <h3 class="card-title">{{ $t('admin.dashboard.activityFeed') }}</h3>
        </div>
        <div class="q-card-body">
          <div class="space-y-4">
            <div class="flex gap-3">
              <div class="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0"></div>
              <div>
                <p class="text-sm text-neutral-700">Nuovo ordine <span class="font-mono text-primary-600">ORD-2026-00142</span></p>
                <p class="text-xs text-neutral-500">2 minuti fa</p>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-2 h-2 rounded-full bg-info mt-2 flex-shrink-0"></div>
              <div>
                <p class="text-sm text-neutral-700">Nuovo cliente registrato: <span class="font-medium">Beta Solutions</span></p>
                <p class="text-xs text-neutral-500">15 minuti fa</p>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0"></div>
              <div>
                <p class="text-sm text-neutral-700">Lead <span class="font-medium">Fotovoltaico MI</span> quasi esaurito</p>
                <p class="text-xs text-neutral-500">1 ora fa</p>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0"></div>
              <div>
                <p class="text-sm text-neutral-700">Import completato: <span class="font-medium">45 lead</span></p>
                <p class="text-xs text-neutral-500">3 ore fa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
