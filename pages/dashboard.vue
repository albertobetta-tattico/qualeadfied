<script setup lang="ts">
/**
 * Page - Dashboard
 * Client dashboard with KPIs, recent leads, recent orders and quick actions
 */
definePageMeta({
  layout: 'client'
})

const { t } = useI18n()

const profileStore = useClientProfileStore()
const { formatCurrency, formatDate } = useClientFormatters()

// Initialize dashboard data
onMounted(async () => {
  await profileStore.initializeDashboard()
})

// Quick actions
const router = useRouter()

const goToLeads = () => {
  router.push('/leads')
}

const goToPackages = () => {
  router.push('/pacchetti')
}

const goToMyLeads = () => {
  router.push('/i-miei-lead')
}

const goToOrders = () => {
  router.push('/ordini')
}

// Status label helpers
const getContactStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    new: t('dashboard.recentLeads.statusNew'),
    contacted: t('dashboard.recentLeads.statusContacted'),
    in_progress: t('dashboard.recentLeads.statusInProgress'),
    not_interested: t('dashboard.recentLeads.statusNotInterested'),
    converted: t('dashboard.recentLeads.statusConverted')
  }
  return labels[status] || status
}

const getContactStatusSeverity = (status: string) => {
  const severities: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined> = {
    new: 'info',
    contacted: 'warn',
    in_progress: 'warn',
    not_interested: 'danger',
    converted: 'success'
  }
  return severities[status] || 'secondary'
}

const getAcquisitionTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    exclusive: t('common.labels.exclusive'),
    shared: t('common.labels.shared'),
    free_trial: t('common.labels.freeTrial')
  }
  return labels[type] || type
}

const getOrderStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: t('orders.statuses.pending'),
    paid: t('orders.statuses.paid'),
    processing: t('orders.statuses.processing'),
    completed: t('orders.statuses.completed'),
    failed: t('orders.statuses.failed'),
    refunded: t('orders.statuses.refunded')
  }
  return labels[status] || status
}

const getOrderStatusSeverity = (status: string) => {
  const severities: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined> = {
    pending: 'warn',
    paid: 'success',
    processing: 'info',
    completed: 'success',
    failed: 'danger',
    refunded: 'secondary'
  }
  return severities[status] || 'secondary'
}

// KPI trend calculation helper
const getTrendInfo = (current: number, previous: number) => {
  if (previous === 0) return { value: '+0%', direction: 'neutral' }
  const percent = Math.round(((current - previous) / previous) * 100)
  return {
    value: `${percent >= 0 ? '+' : ''}${percent}%`,
    direction: percent >= 0 ? 'up' : 'down'
  }
}
</script>

<template>
  <div class="dashboard-page">
    <!-- Welcome Section -->
    <div class="welcome-section mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-0 mb-2">
            {{ $t('dashboard.welcome.title', { name: profileStore.fullName }) }}
          </h1>
          <p class="text-surface-600 dark:text-surface-400">
            {{ profileStore.companyName }}
          </p>
        </div>
        <div class="flex gap-2">
          <PrimeButton
            :label="$t('dashboard.quickActions.searchLeads')"
            icon="pi pi-search"
            @click="goToLeads"
          />
          <PrimeButton
            :label="$t('dashboard.quickActions.buyPackage')"
            icon="pi pi-box"
            severity="secondary"
            @click="goToPackages"
          />
        </div>
      </div>
    </div>

    <!-- Free Trial Banner -->
    <div v-if="profileStore.hasFreeTrial" class="trial-banner mb-6">
      <PrimeCard class="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
        <template #content>
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <i class="pi pi-gift text-white text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100">
                  {{ $t('dashboard.trialBanner.title') }}
                </h3>
                <p class="text-primary-700 dark:text-primary-300" v-html="$t('dashboard.trialBanner.subtitle', { count: profileStore.freeTrialLeadsRemaining })">
                </p>
              </div>
            </div>
            <PrimeButton
              :label="$t('dashboard.trialBanner.redeem')"
              icon="pi pi-arrow-right"
              @click="router.push('/prova-gratuita')"
            />
          </div>
        </template>
      </PrimeCard>
    </div>

    <!-- Loading State -->
    <div v-if="profileStore.loading" class="flex justify-center py-12">
      <PrimeProgressSpinner />
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- KPI Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <!-- Lead acquistati -->
        <PrimeCard class="kpi-card">
          <template #content>
            <div class="flex flex-col">
              <div class="flex items-start justify-between mb-3">
                <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <i class="pi pi-users text-blue-500 text-xl"></i>
                </div>
              </div>
              <div class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-1">
                {{ profileStore.dashboardStats?.total_leads_purchased || 0 }}
              </div>
              <div class="text-sm text-surface-500 dark:text-surface-400 mb-2">
                {{ $t('dashboard.kpi.leadsPurchased') }}
              </div>
              <div class="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <i class="pi pi-arrow-up"></i>
                <span>{{ $t('dashboard.kpi.thisMonth', { count: profileStore.dashboardStats?.leads_this_month || 0 }) }}</span>
              </div>
            </div>
          </template>
        </PrimeCard>

        <!-- Spesa totale -->
        <PrimeCard class="kpi-card">
          <template #content>
            <div class="flex flex-col">
              <div class="flex items-start justify-between mb-3">
                <div class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <i class="pi pi-euro text-green-500 text-xl"></i>
                </div>
              </div>
              <div class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-1">
                {{ formatCurrency(profileStore.dashboardStats?.total_spent || 0) }}
              </div>
              <div class="text-sm text-surface-500 dark:text-surface-400 mb-2">
                {{ $t('dashboard.kpi.totalSpent') }}
              </div>
              <div class="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <i class="pi pi-arrow-up"></i>
                <span>{{ $t('dashboard.kpi.thisMonth', { count: formatCurrency(profileStore.dashboardStats?.spent_this_month || 0) }) }}</span>
              </div>
            </div>
          </template>
        </PrimeCard>

        <!-- Pacchetti attivi -->
        <PrimeCard class="kpi-card">
          <template #content>
            <div class="flex flex-col">
              <div class="flex items-start justify-between mb-3">
                <div class="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <i class="pi pi-box text-orange-500 text-xl"></i>
                </div>
              </div>
              <div class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-1">
                {{ profileStore.dashboardStats?.active_packages || 0 }}
              </div>
              <div class="text-sm text-surface-500 dark:text-surface-400 mb-2">
                {{ $t('dashboard.kpi.activePackages') }}
              </div>
              <NuxtLink to="/pacchetti" class="text-xs text-primary hover:underline">
                {{ $t('dashboard.kpi.managePackages') }}
              </NuxtLink>
            </div>
          </template>
        </PrimeCard>
      </div>

      <!-- Main Content Grid: Tables -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <!-- Recent Leads Table -->
        <PrimeCard>
          <template #title>
            <div class="flex items-center justify-between">
              <span>{{ $t('dashboard.recentLeads.title') }}</span>
              <NuxtLink to="/i-miei-lead" class="text-sm text-primary hover:text-primary-600 font-normal flex items-center gap-1">
                {{ $t('dashboard.recentLeads.viewAll') }} <i class="pi pi-arrow-right"></i>
              </NuxtLink>
            </div>
          </template>
          <template #content>
            <div v-if="profileStore.recentLeads.length === 0" class="text-center py-8">
              <i class="pi pi-inbox text-4xl text-surface-300 dark:text-surface-600 mb-4"></i>
              <p class="text-surface-500 dark:text-surface-400">{{ $t('dashboard.recentLeads.empty') }}</p>
              <PrimeButton
                :label="$t('dashboard.quickActions.searchLeads')"
                icon="pi pi-search"
                class="mt-4"
                size="small"
                @click="goToLeads"
              />
            </div>
            <PrimeDataTable
              v-else
              :value="profileStore.recentLeads"
              :rows="5"
              stripedRows
              class="text-sm"
            >
              <PrimeColumn field="name" :header="$t('dashboard.recentLeads.columnName')">
                <template #body="{ data }">
                  <div>
                    <div class="font-medium text-surface-900 dark:text-surface-0">{{ data.name }}</div>
                    <div class="text-xs text-surface-500">{{ data.email }}</div>
                  </div>
                </template>
              </PrimeColumn>
              <PrimeColumn field="category" :header="$t('dashboard.recentLeads.columnCategory')">
                <template #body="{ data }">
                  <span class="text-surface-700 dark:text-surface-300">{{ data.category }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="province" :header="$t('dashboard.recentLeads.columnProvince')">
                <template #body="{ data }">
                  <span class="text-surface-600 dark:text-surface-400">{{ data.province }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="status" :header="$t('dashboard.recentLeads.columnStatus')">
                <template #body="{ data }">
                  <PrimeTag
                    :value="getContactStatusLabel(data.status)"
                    :severity="getContactStatusSeverity(data.status)"
                  />
                </template>
              </PrimeColumn>
            </PrimeDataTable>
          </template>
        </PrimeCard>

        <!-- Recent Orders Table -->
        <PrimeCard>
          <template #title>
            <div class="flex items-center justify-between">
              <span>{{ $t('dashboard.recentOrders.title') }}</span>
              <NuxtLink to="/ordini" class="text-sm text-primary hover:text-primary-600 font-normal flex items-center gap-1">
                {{ $t('dashboard.recentLeads.viewAll') }} <i class="pi pi-arrow-right"></i>
              </NuxtLink>
            </div>
          </template>
          <template #content>
            <div v-if="profileStore.recentOrders.length === 0" class="text-center py-8">
              <i class="pi pi-shopping-cart text-4xl text-surface-300 dark:text-surface-600 mb-4"></i>
              <p class="text-surface-500 dark:text-surface-400">{{ $t('dashboard.recentOrders.empty') }}</p>
              <PrimeButton
                :label="$t('dashboard.quickActions.buyLeads')"
                icon="pi pi-shopping-cart"
                class="mt-4"
                size="small"
                @click="goToLeads"
              />
            </div>
            <PrimeDataTable
              v-else
              :value="profileStore.recentOrders"
              :rows="5"
              stripedRows
              class="text-sm"
            >
              <PrimeColumn field="id" :header="$t('dashboard.recentOrders.columnOrder')">
                <template #body="{ data }">
                  <span class="font-mono text-primary">{{ data.id }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="items_count" :header="$t('dashboard.recentOrders.columnLead')">
                <template #body="{ data }">
                  <span class="font-medium text-surface-900 dark:text-surface-0">{{ data.items_count }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="amount" :header="$t('dashboard.recentOrders.columnAmount')">
                <template #body="{ data }">
                  <span class="font-semibold text-surface-900 dark:text-surface-0">{{ formatCurrency(data.amount) }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="status" :header="$t('dashboard.recentOrders.columnStatus')">
                <template #body="{ data }">
                  <PrimeTag
                    :value="getOrderStatusLabel(data.status)"
                    :severity="getOrderStatusSeverity(data.status)"
                  />
                </template>
              </PrimeColumn>
              <PrimeColumn field="date" :header="$t('dashboard.recentOrders.columnDate')">
                <template #body="{ data }">
                  <span class="text-surface-600 dark:text-surface-400">{{ data.date }}</span>
                </template>
              </PrimeColumn>
            </PrimeDataTable>
          </template>
        </PrimeCard>
      </div>

      <!-- Bottom Row: Quick Actions + Account Status -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Quick Actions -->
        <PrimeCard>
          <template #title>{{ $t('dashboard.quickActions.title') }}</template>
          <template #content>
            <div class="space-y-3">
              <PrimeButton
                :label="$t('dashboard.quickActions.searchLeads')"
                icon="pi pi-search"
                class="w-full"
                @click="goToLeads"
              />
              <PrimeButton
                :label="$t('dashboard.quickActions.myLeads')"
                icon="pi pi-list"
                class="w-full"
                severity="secondary"
                @click="goToMyLeads"
              />
              <PrimeButton
                :label="$t('dashboard.quickActions.myOrders')"
                icon="pi pi-shopping-cart"
                class="w-full"
                severity="secondary"
                @click="goToOrders"
              />
              <PrimeButton
                :label="$t('dashboard.quickActions.buyPackage')"
                icon="pi pi-box"
                class="w-full"
                severity="secondary"
                @click="goToPackages"
              />
            </div>
          </template>
        </PrimeCard>

        <!-- Account Status -->
        <PrimeCard>
          <template #title>{{ $t('dashboard.accountStatus.title') }}</template>
          <template #content>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-surface-600 dark:text-surface-400">{{ $t('dashboard.accountStatus.billingData') }}</span>
                <PrimeTag
                  :value="profileStore.hasBillingData ? $t('dashboard.accountStatus.complete') : $t('dashboard.accountStatus.incomplete')"
                  :severity="profileStore.hasBillingData ? 'success' : 'warn'"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-surface-600 dark:text-surface-400">{{ $t('dashboard.accountStatus.freeTrial') }}</span>
                <PrimeTag
                  :value="profileStore.hasFreeTrial ? `${profileStore.freeTrialLeadsRemaining} lead` : $t('dashboard.accountStatus.exhausted')"
                  :severity="profileStore.hasFreeTrial ? 'info' : 'secondary'"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-surface-600 dark:text-surface-400">{{ $t('dashboard.accountStatus.emailNotifications') }}</span>
                <PrimeTag
                  :value="profileStore.profile?.email_notifications_enabled ? $t('dashboard.accountStatus.active') : $t('dashboard.accountStatus.inactive')"
                  :severity="profileStore.profile?.email_notifications_enabled ? 'success' : 'secondary'"
                />
              </div>
            </div>
          </template>
        </PrimeCard>

        <!-- Notifications Summary -->
        <PrimeCard>
          <template #title>
            <div class="flex items-center justify-between">
              <span>{{ $t('dashboard.notifications.title') }}</span>
              <span v-if="profileStore.unreadNotificationsCount > 0" class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {{ profileStore.unreadNotificationsCount }}
              </span>
            </div>
          </template>
          <template #content>
            <div v-if="profileStore.notifications.length === 0" class="text-center py-4">
              <i class="pi pi-bell-slash text-3xl text-surface-300 dark:text-surface-600 mb-2"></i>
              <p class="text-surface-500 dark:text-surface-400 text-sm">{{ $t('dashboard.notifications.empty') }}</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="notification in profileStore.notifications.slice(0, 3)"
                :key="notification.id"
                class="p-3 rounded-lg cursor-pointer transition-colors"
                :class="[
                  notification.read
                    ? 'bg-surface-50 dark:bg-surface-800'
                    : 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary'
                ]"
                @click="notification.link && router.push(notification.link)"
              >
                <div class="flex items-start gap-2">
                  <i
                    class="pi mt-0.5"
                    :class="{
                      'pi-users text-blue-500': notification.type === 'new_leads',
                      'pi-clock text-orange-500': notification.type === 'package_expiring',
                      'pi-check-circle text-green-500': notification.type === 'order_completed',
                      'pi-info-circle text-gray-500': notification.type === 'info'
                    }"
                  ></i>
                  <div class="flex-grow min-w-0">
                    <h4 class="font-medium text-sm text-surface-900 dark:text-surface-0 truncate">
                      {{ notification.title }}
                    </h4>
                    <p class="text-xs text-surface-500 truncate">
                      {{ notification.message }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kpi-card :deep(.p-card-body) {
  padding: 1.25rem;
}
</style>
