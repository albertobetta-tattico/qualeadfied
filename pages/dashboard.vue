<script setup lang="ts">
/**
 * Page - Dashboard
 * Client dashboard with KPIs, notifications and quick actions
 */
definePageMeta({
  layout: 'client'
})

const profileStore = useClientProfileStore()
const { formatCurrency, formatDate, formatRelativeTime } = useClientFormatters()

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

const goToProfile = () => {
  router.push('/profilo')
}

// Notification click handler
const handleNotificationClick = async (notification: any) => {
  await profileStore.markNotificationRead(notification.id)
  if (notification.link) {
    router.push(notification.link)
  }
}

// Mark all notifications as read
const markAllRead = async () => {
  await profileStore.markAllNotificationsRead()
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
          <Button
            label="Cerca Lead"
            icon="pi pi-search"
            @click="goToLeads"
          />
          <Button
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
      <Card class="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
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
            <Button
              label="Riscatta Ora"
              icon="pi pi-arrow-right"
              @click="router.push('/prova-gratuita')"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Loading State -->
    <div v-if="profileStore.loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Lead acquistati -->
        <Card class="stat-card">
          <template #content>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <i class="pi pi-users text-blue-500 text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-surface-500 dark:text-surface-400 mb-1">Lead Acquistati</p>
                <p class="text-2xl font-bold text-surface-900 dark:text-surface-0">
                  {{ profileStore.dashboardStats?.total_leads_purchased || 0 }}
                </p>
                <p class="text-xs text-surface-400">
                  +{{ profileStore.dashboardStats?.leads_this_month || 0 }} questo mese
                </p>
              </div>
            </div>
          </template>
        </Card>

        <!-- Spesa totale -->
        <Card class="stat-card">
          <template #content>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <i class="pi pi-euro text-green-500 text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-surface-500 dark:text-surface-400 mb-1">Spesa Totale</p>
                <p class="text-2xl font-bold text-surface-900 dark:text-surface-0">
                  {{ formatCurrency(profileStore.dashboardStats?.total_spent || 0) }}
                </p>
                <p class="text-xs text-surface-400">
                  +{{ formatCurrency(profileStore.dashboardStats?.spent_this_month || 0) }} questo mese
                </p>
              </div>
            </div>
          </template>
        </Card>

        <!-- Tasso conversione -->
        <Card class="stat-card">
          <template #content>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <i class="pi pi-chart-line text-purple-500 text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-surface-500 dark:text-surface-400 mb-1">Tasso Conversione</p>
                <p class="text-2xl font-bold text-surface-900 dark:text-surface-0">
                  {{ profileStore.dashboardStats?.conversion_rate || 0 }}%
                </p>
                <p class="text-xs text-green-500">
                  <i class="pi pi-arrow-up mr-1"></i>Ottimo risultato
                </p>
              </div>
            </div>
          </template>
        </Card>

        <!-- Pacchetti attivi -->
        <Card class="stat-card">
          <template #content>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <i class="pi pi-box text-orange-500 text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-surface-500 dark:text-surface-400 mb-1">Pacchetti Attivi</p>
                <p class="text-2xl font-bold text-surface-900 dark:text-surface-0">
                  {{ profileStore.dashboardStats?.active_packages || 0 }}
                </p>
                <NuxtLink to="/pacchetti/attivi" class="text-xs text-primary hover:underline">
                  Gestisci pacchetti
                </NuxtLink>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Notifications Column -->
        <div class="lg:col-span-2">
          <Card>
            <template #title>
              <div class="flex items-center justify-between">
                <span>Notifiche</span>
                <Button
                  v-if="profileStore.unreadNotificationsCount > 0"
                  label="Segna tutto come letto"
                  text
                  size="small"
                  @click="markAllRead"
                />
              </div>
            </template>
            <template #content>
              <div v-if="profileStore.notifications.length === 0" class="text-center py-8">
                <i class="pi pi-bell-slash text-4xl text-surface-300 dark:text-surface-600 mb-4"></i>
                <p class="text-surface-500 dark:text-surface-400">Nessuna notifica</p>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="notification in profileStore.notifications"
                  :key="notification.id"
                  class="notification-item p-4 rounded-lg cursor-pointer transition-colors"
                  :class="[
                    notification.read
                      ? 'bg-surface-50 dark:bg-surface-800'
                      : 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary'
                  ]"
                  @click="handleNotificationClick(notification)"
                >
                  <div class="flex items-start gap-3">
                    <div
                      class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      :class="{
                        'bg-blue-100 dark:bg-blue-900/30': notification.type === 'new_leads',
                        'bg-orange-100 dark:bg-orange-900/30': notification.type === 'package_expiring',
                        'bg-green-100 dark:bg-green-900/30': notification.type === 'order_completed'
                      }"
                    >
                      <i
                        class="pi"
                        :class="{
                          'pi-users text-blue-500': notification.type === 'new_leads',
                          'pi-clock text-orange-500': notification.type === 'package_expiring',
                          'pi-check-circle text-green-500': notification.type === 'order_completed'
                        }"
                      ></i>
                    </div>
                    <div class="flex-grow">
                      <div class="flex items-start justify-between gap-2">
                        <h4 class="font-medium text-surface-900 dark:text-surface-0">
                          {{ notification.title }}
                        </h4>
                        <span class="text-xs text-surface-400 whitespace-nowrap">
                          {{ formatRelativeTime(notification.created_at) }}
                        </span>
                      </div>
                      <p class="text-sm text-surface-600 dark:text-surface-400 mt-1">
                        {{ notification.message }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Quick Actions Column -->
        <div>
          <Card>
            <template #title>Azioni Rapide</template>
            <template #content>
              <div class="space-y-3">
                <Button
                  label="Cerca nuovi lead"
                  icon="pi pi-search"
                  class="w-full"
                  @click="goToLeads"
                />
                <Button
                  label="I miei lead"
                  icon="pi pi-list"
                  class="w-full"
                  severity="secondary"
                  @click="goToMyLeads"
                />
                <Button
                  label="Acquista pacchetto"
                  icon="pi pi-box"
                  class="w-full"
                  severity="secondary"
                  @click="goToPackages"
                />
                <Button
                  label="Modifica profilo"
                  icon="pi pi-user-edit"
                  class="w-full"
                  severity="secondary"
                  @click="goToProfile"
                />
              </div>
            </template>
          </Card>

          <!-- Account Status -->
          <Card class="mt-4">
            <template #title>Stato Account</template>
            <template #content>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-surface-600 dark:text-surface-400">Dati fatturazione</span>
                  <Tag
                    :value="profileStore.hasBillingData ? 'Completi' : 'Da completare'"
                    :severity="profileStore.hasBillingData ? 'success' : 'warning'"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-surface-600 dark:text-surface-400">Prova gratuita</span>
                  <Tag
                    :value="profileStore.hasFreeTrial ? `${profileStore.freeTrialLeadsRemaining} lead` : 'Esaurita'"
                    :severity="profileStore.hasFreeTrial ? 'info' : 'secondary'"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-surface-600 dark:text-surface-400">Notifiche email</span>
                  <Tag
                    :value="profileStore.profile?.email_notifications_enabled ? 'Attive' : 'Disattive'"
                    :severity="profileStore.profile?.email_notifications_enabled ? 'success' : 'secondary'"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card :deep(.p-card-body) {
  padding: 1rem;
}

.notification-item:hover {
  opacity: 0.9;
}
</style>
