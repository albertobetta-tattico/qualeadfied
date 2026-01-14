<script setup lang="ts">
/**
 * Page - Dashboard
 * Client dashboard with KPIs, recent leads, recent orders and quick actions
 */
definePageMeta({
  layout: 'client'
})

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
  router.push('/i-miei-ordini')
}

// Status label helpers
const getContactStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    new: 'Nuovo',
    contacted: 'Contattato',
    in_progress: 'In corso',
    not_interested: 'Non interessato',
    converted: 'Convertito'
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
    exclusive: 'Esclusivo',
    shared: 'Condiviso',
    free_trial: 'Prova gratuita'
  }
  return labels[type] || type
}

const getOrderStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'In attesa',
    paid: 'Pagato',
    processing: 'In elaborazione',
    completed: 'Completato',
    failed: 'Fallito',
    refunded: 'Rimborsato'
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
            Benvenuto, {{ profileStore.fullName }}
          </h1>
          <p class="text-surface-600 dark:text-surface-400">
            {{ profileStore.companyName }}
          </p>
        </div>
        <div class="flex gap-2">
          <PrimeButton
            label="Cerca Lead"
            icon="pi pi-search"
            @click="goToLeads"
          />
          <PrimeButton
            label="Acquista Pacchetto"
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
                  Prova Gratuita Attiva
                </h3>
                <p class="text-primary-700 dark:text-primary-300">
                  Hai ancora <strong>{{ profileStore.freeTrialLeadsRemaining }}</strong> lead gratuiti da riscattare
                </p>
              </div>
            </div>
            <PrimeButton
              label="Riscatta Ora"
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
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                Lead Acquistati
              </div>
              <div class="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <i class="pi pi-arrow-up"></i>
                <span>+{{ profileStore.dashboardStats?.leads_this_month || 0 }} questo mese</span>
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
                Spesa Totale
              </div>
              <div class="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <i class="pi pi-arrow-up"></i>
                <span>+{{ formatCurrency(profileStore.dashboardStats?.spent_this_month || 0) }} questo mese</span>
              </div>
            </div>
          </template>
        </PrimeCard>

        <!-- Tasso conversione -->
        <PrimeCard class="kpi-card">
          <template #content>
            <div class="flex flex-col">
              <div class="flex items-start justify-between mb-3">
                <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <i class="pi pi-chart-line text-purple-500 text-xl"></i>
                </div>
              </div>
              <div class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-1">
                {{ profileStore.dashboardStats?.conversion_rate || 0 }}%
              </div>
              <div class="text-sm text-surface-500 dark:text-surface-400 mb-2">
                Tasso Conversione
              </div>
              <div class="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <i class="pi pi-arrow-up"></i>
                <span>Ottimo risultato</span>
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
                Pacchetti Attivi
              </div>
              <NuxtLink to="/pacchetti" class="text-xs text-primary hover:underline">
                Gestisci pacchetti
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
              <span>I Miei Lead Recenti</span>
              <NuxtLink to="/i-miei-lead" class="text-sm text-primary hover:text-primary-600 font-normal flex items-center gap-1">
                Vedi tutti <i class="pi pi-arrow-right"></i>
              </NuxtLink>
            </div>
          </template>
          <template #content>
            <div v-if="profileStore.recentLeads.length === 0" class="text-center py-8">
              <i class="pi pi-inbox text-4xl text-surface-300 dark:text-surface-600 mb-4"></i>
              <p class="text-surface-500 dark:text-surface-400">Nessun lead acquistato</p>
              <PrimeButton
                label="Cerca Lead"
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
              <PrimeColumn field="name" header="Nome">
                <template #body="{ data }">
                  <div>
                    <div class="font-medium text-surface-900 dark:text-surface-0">{{ data.name }}</div>
                    <div class="text-xs text-surface-500">{{ data.email }}</div>
                  </div>
                </template>
              </PrimeColumn>
              <PrimeColumn field="category" header="Categoria">
                <template #body="{ data }">
                  <span class="text-surface-700 dark:text-surface-300">{{ data.category }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="province" header="Provincia">
                <template #body="{ data }">
                  <span class="text-surface-600 dark:text-surface-400">{{ data.province }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="status" header="Stato">
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
              <span>Ordini Recenti</span>
              <NuxtLink to="/i-miei-ordini" class="text-sm text-primary hover:text-primary-600 font-normal flex items-center gap-1">
                Vedi tutti <i class="pi pi-arrow-right"></i>
              </NuxtLink>
            </div>
          </template>
          <template #content>
            <div v-if="profileStore.recentOrders.length === 0" class="text-center py-8">
              <i class="pi pi-shopping-cart text-4xl text-surface-300 dark:text-surface-600 mb-4"></i>
              <p class="text-surface-500 dark:text-surface-400">Nessun ordine effettuato</p>
              <PrimeButton
                label="Acquista Lead"
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
              <PrimeColumn field="id" header="Ordine">
                <template #body="{ data }">
                  <span class="font-mono text-primary">{{ data.id }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="items_count" header="Lead">
                <template #body="{ data }">
                  <span class="font-medium text-surface-900 dark:text-surface-0">{{ data.items_count }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="amount" header="Importo">
                <template #body="{ data }">
                  <span class="font-semibold text-surface-900 dark:text-surface-0">{{ formatCurrency(data.amount) }}</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="status" header="Stato">
                <template #body="{ data }">
                  <PrimeTag
                    :value="getOrderStatusLabel(data.status)"
                    :severity="getOrderStatusSeverity(data.status)"
                  />
                </template>
              </PrimeColumn>
              <PrimeColumn field="date" header="Data">
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
          <template #title>Azioni Rapide</template>
          <template #content>
            <div class="space-y-3">
              <PrimeButton
                label="Cerca nuovi lead"
                icon="pi pi-search"
                class="w-full"
                @click="goToLeads"
              />
              <PrimeButton
                label="I miei lead"
                icon="pi pi-list"
                class="w-full"
                severity="secondary"
                @click="goToMyLeads"
              />
              <PrimeButton
                label="I miei ordini"
                icon="pi pi-shopping-cart"
                class="w-full"
                severity="secondary"
                @click="goToOrders"
              />
              <PrimeButton
                label="Acquista pacchetto"
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
          <template #title>Stato Account</template>
          <template #content>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-surface-600 dark:text-surface-400">Dati fatturazione</span>
                <PrimeTag
                  :value="profileStore.hasBillingData ? 'Completi' : 'Da completare'"
                  :severity="profileStore.hasBillingData ? 'success' : 'warn'"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-surface-600 dark:text-surface-400">Prova gratuita</span>
                <PrimeTag
                  :value="profileStore.hasFreeTrial ? `${profileStore.freeTrialLeadsRemaining} lead` : 'Esaurita'"
                  :severity="profileStore.hasFreeTrial ? 'info' : 'secondary'"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-surface-600 dark:text-surface-400">Notifiche email</span>
                <PrimeTag
                  :value="profileStore.profile?.email_notifications_enabled ? 'Attive' : 'Disattive'"
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
              <span>Notifiche</span>
              <span v-if="profileStore.unreadNotificationsCount > 0" class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {{ profileStore.unreadNotificationsCount }}
              </span>
            </div>
          </template>
          <template #content>
            <div v-if="profileStore.notifications.length === 0" class="text-center py-4">
              <i class="pi pi-bell-slash text-3xl text-surface-300 dark:text-surface-600 mb-2"></i>
              <p class="text-surface-500 dark:text-surface-400 text-sm">Nessuna notifica</p>
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
