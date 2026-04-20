<script setup lang="ts">
/**
 * Page - Active Packages
 * User's active lead packages with remaining credits
 */
import type { ActivePackage } from '~/types/clientArea'

definePageMeta({
  layout: 'client'
})

const { t } = useI18n()
const packagesStore = usePackagesStore()
const { formatCurrency, formatDate } = useClientFormatters()

// Fetch active packages on mount
onMounted(async () => {
  await packagesStore.fetchActivePackages()
})

// Calculate days remaining
const getDaysRemaining = (expiresAt: string): number => {
  const now = new Date()
  const expires = new Date(expiresAt)
  const diffTime = expires.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
}

// Get total leads used
const getTotalLeadsUsed = (pkg: ActivePackage): number => {
  return pkg.exclusive_leads_used + pkg.shared_leads_used
}

// Get total leads
const getTotalLeads = (pkg: ActivePackage): number => {
  return pkg.total_leads
}

// Get remaining leads
const getRemainingLeads = (pkg: ActivePackage): number => {
  return getTotalLeads(pkg) - getTotalLeadsUsed(pkg)
}

// Get progress percentage
const getProgressPercentage = (pkg: ActivePackage): number => {
  return Math.round((getTotalLeadsUsed(pkg) / getTotalLeads(pkg)) * 100)
}

// Get status severity
const getStatusSeverity = (pkg: ActivePackage): 'success' | 'warning' | 'danger' => {
  const daysRemaining = getDaysRemaining(pkg.expires_at)
  if (daysRemaining <= 7) return 'danger'
  if (daysRemaining <= 30) return 'warning'
  return 'success'
}

// Navigate to select leads
const router = useRouter()
const selectLeads = (pkg: ActivePackage) => {
  router.push(`/pacchetti/${pkg.id}/seleziona`)
}
</script>

<template>
  <div class="active-packages-page">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ $t('packages.active.title') }}</h1>
        <p class="text-surface-600 dark:text-surface-400">
          {{ $t('packages.active.subtitle') }}
        </p>
      </div>
      <NuxtLink to="/pacchetti">
        <PrimeButton
          :label="$t('packages.active.buyNew')"
          icon="pi pi-plus"
        />
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="packagesStore.loading" class="flex justify-center py-12">
      <PrimeProgressSpinner />
    </div>

    <!-- Active Packages -->
    <div v-else-if="packagesStore.activePackages.length > 0" class="space-y-4">
      <PrimeCard
        v-for="pkg in packagesStore.activePackages"
        :key="pkg.id"
        class="active-package-card"
      >
        <template #content>
          <div class="flex flex-col lg:flex-row lg:items-center gap-6">
            <!-- Package Info -->
            <div class="flex-grow">
              <div class="flex items-center gap-3 mb-2">
                <PrimeTagv-if="pkg.category_id" :value="`Categoria #${pkg.category_id}`" severity="info" />
                <PrimeTagv-else :value="$t('packages.active.allCategories')" severity="secondary" />
                <Tag
                  :value="$t('packages.active.daysRemaining', { count: getDaysRemaining(pkg.expires_at) })"
                  :severity="getStatusSeverity(pkg)"
                />
              </div>
              <h3 class="text-xl font-bold text-surface-900 dark:text-surface-0 mb-1">
                {{ pkg.package_name }}
              </h3>
              <p class="text-sm text-surface-600 dark:text-surface-400">
                {{ $t('packages.active.purchasedOn', { date: formatDate(pkg.purchased_at), expiry: formatDate(pkg.expires_at) }) }}
              </p>
            </div>

            <!-- Usage Stats -->
            <div class="lg:w-64">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-surface-600 dark:text-surface-400">
                  {{ $t('packages.active.leadsUsed') }}
                </span>
                <span class="font-semibold text-surface-900 dark:text-surface-0">
                  {{ getTotalLeadsUsed(pkg) }} / {{ getTotalLeads(pkg) }}
                </span>
              </div>
              <PrimeProgressBar
                :value="getProgressPercentage(pkg)"
                :showValue="false"
                class="h-2"
              />
              <p class="text-sm text-surface-500 mt-2 text-right">
                {{ $t('packages.active.leadsRemaining', { count: getRemainingLeads(pkg) }) }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-2 lg:w-48">
              <PrimeButton
                :label="$t('packages.active.selectLeads')"
                icon="pi pi-list"
                :disabled="getRemainingLeads(pkg) === 0"
                @click="selectLeads(pkg)"
              />
            </div>
          </div>

          <!-- Warning if expiring soon -->
          <div
            v-if="getDaysRemaining(pkg.expires_at) <= 7 && getRemainingLeads(pkg) > 0"
            class="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
          >
            <div class="flex items-center gap-2">
              <i class="pi pi-exclamation-triangle text-orange-500"></i>
              <span class="text-sm text-orange-700 dark:text-orange-300">
                {{ $t('packages.active.expiringWarning', { days: getDaysRemaining(pkg.expires_at), remaining: getRemainingLeads(pkg) }) }}
              </span>
            </div>
          </div>
        </template>
      </PrimeCard>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <i class="pi pi-box text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
      <h2 class="text-2xl font-bold text-surface-700 dark:text-surface-300 mb-2">
        {{ $t('packages.active.empty.title') }}
      </h2>
      <p class="text-surface-500 dark:text-surface-400 mb-6">
        {{ $t('packages.active.empty.subtitle') }}
      </p>
      <NuxtLink to="/pacchetti">
        <PrimeButton :label="$t('packages.active.empty.explore')" icon="pi pi-box" size="large" />
      </NuxtLink>
    </div>

    <!-- Benefits Reminder -->
    <PrimeCard v-if="packagesStore.activePackages.length === 0" class="mt-8 bg-primary-50 dark:bg-primary-900/20">
      <template #content>
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="flex-shrink-0">
            <div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <i class="pi pi-gift text-primary text-2xl"></i>
            </div>
          </div>
          <div class="flex-grow text-center md:text-left">
            <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-1">
              {{ $t('packages.active.whyBuy.title') }}
            </h3>
            <p class="text-primary-700 dark:text-primary-300">
              {{ $t('packages.active.whyBuy.description') }}
            </p>
          </div>
          <div class="flex-shrink-0">
            <NuxtLink to="/pacchetti">
              <PrimeButton :label="$t('packages.active.whyBuy.learnMore')" icon="pi pi-arrow-right" />
            </NuxtLink>
          </div>
        </div>
      </template>
    </PrimeCard>
  </div>
</template>

<style scoped>
.active-package-card {
  transition: box-shadow 0.2s;
}

.active-package-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}
</style>
