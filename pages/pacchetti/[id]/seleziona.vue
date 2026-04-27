<script setup lang="ts">
/**
 * Page - Select Leads from Package
 * Select leads to redeem from an active package
 */
import type { ActivePackage, PurchaseMode } from '~/types/clientArea'

definePageMeta({
  layout: 'client'
})

const route = useRoute('pacchetti-id-seleziona')
const router = useRouter()
const packageId = computed(() => {
  const id = route.params.id
  return Number(Array.isArray(id) ? id[0] : id)
})

const { t } = useI18n()
const packagesStore = usePackagesStore()
const catalogStore = usePublicCatalogStore()
const { formatRelativeTime } = useClientFormatters()
const { showSuccess, showError } = useClientToast()

// Selected leads
const selectedLeads = ref<number[]>([])

// Current active package
const currentPackage = computed(() => {
  return packagesStore.activePackages.find(p => p.id === packageId.value)
})

// Get remaining leads for package
const getRemainingLeads = (pkg: ActivePackage | undefined): number => {
  if (!pkg) return 0
  return pkg.total_leads - (pkg.exclusive_leads_used + pkg.shared_leads_used)
}

// Get used leads for package
const getUsedLeads = (pkg: ActivePackage | undefined): number => {
  if (!pkg) return 0
  return pkg.exclusive_leads_used + pkg.shared_leads_used
}

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    packagesStore.fetchActivePackages(),
    catalogStore.fetchCategories(),
    catalogStore.fetchProvinces(),
    catalogStore.fetchLeads()
  ])

  // Redirect if package not found
  if (!currentPackage.value) {
    router.push('/pacchetti/attivi')
  }
})

// Filter leads by package category (m2m: a lead may belong to multiple categories)
const availableLeads = computed(() => {
  const pkgCatId = currentPackage.value?.category_id
  if (!pkgCatId) {
    return catalogStore.leads
  }
  return catalogStore.leads.filter(l => l.categories?.some((c: any) => c.id === pkgCatId))
})

// Can select more leads
const canSelectMore = computed(() => {
  return selectedLeads.value.length < getRemainingLeads(currentPackage.value)
})

// Toggle lead selection
const toggleLeadSelection = (leadId: number) => {
  const index = selectedLeads.value.indexOf(leadId)
  if (index === -1) {
    if (canSelectMore.value) {
      selectedLeads.value.push(leadId)
    }
  } else {
    selectedLeads.value.splice(index, 1)
  }
}

// Check if lead is selected
const isSelected = (leadId: number): boolean => {
  return selectedLeads.value.includes(leadId)
}

// Redeem selected leads
const redeemLeads = async () => {
  if (selectedLeads.value.length === 0) {
    showError(t('packages.select.toast.selectAtLeast'))
    return
  }

  // Build purchase modes map (default to shared for simplicity)
  const purchaseModes: Record<number, PurchaseMode> = {}
  selectedLeads.value.forEach(leadId => {
    purchaseModes[leadId] = 'shared'
  })

  const success = await packagesStore.selectLeadsFromPackage(packageId.value, {
    lead_ids: selectedLeads.value,
    purchase_modes: purchaseModes
  })

  if (success) {
    showSuccess(t('packages.select.toast.redeemed', { count: selectedLeads.value.length }))
    selectedLeads.value = []
    // Refresh packages
    await packagesStore.fetchActivePackages()
    // Redirect to my leads
    router.push('/i-miei-lead')
  } else {
    showError(packagesStore.error || t('packages.select.toast.errorRedeeming'))
  }
}
</script>

<template>
  <div class="select-leads-page">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/pacchetti/attivi" class="inline-flex items-center gap-2 text-primary hover:underline mb-4">
        <i class="pi pi-arrow-left"></i>
        {{ $t('packages.select.backToPackages') }}
      </NuxtLink>

      <div v-if="currentPackage" class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">
            {{ $t('packages.select.title') }}
          </h1>
          <p class="text-surface-600 dark:text-surface-400">
            {{ $t('packages.select.leadsAvailable', { name: currentPackage.package_name, count: getRemainingLeads(currentPackage) }) }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-surface-500">
            {{ $t('packages.select.selectedCount', { selected: selectedLeads.length, total: getRemainingLeads(currentPackage) }) }}
          </span>
          <Button
            :label="$t('packages.select.redeemLeads')"
            icon="pi pi-check"
            :disabled="selectedLeads.length === 0"
            :badge="selectedLeads.length > 0 ? String(selectedLeads.length) : undefined"
            @click="redeemLeads"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="packagesStore.loading || catalogStore.loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>

    <!-- Package Info Card -->
    <Card v-else-if="currentPackage" class="mb-6 bg-surface-50 dark:bg-surface-800">
      <template #content>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <i class="pi pi-box text-primary text-xl"></i>
            </div>
            <div>
              <h3 class="font-semibold text-surface-900 dark:text-surface-0">
                {{ currentPackage.package_name }}
              </h3>
              <p class="text-sm text-surface-500">
                {{ currentPackage.category_id ? `Categoria #${currentPackage.category_id}` : $t('packages.active.allCategories') }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-6">
            <div class="text-center">
              <p class="text-2xl font-bold text-primary">
                {{ getRemainingLeads(currentPackage) }}
              </p>
              <p class="text-xs text-surface-500">{{ $t('packages.select.packageInfo.available') }}</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-500">
                {{ getUsedLeads(currentPackage) }}
              </p>
              <p class="text-xs text-surface-500">{{ $t('packages.select.packageInfo.used') }}</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-surface-400">
                {{ currentPackage.total_leads }}
              </p>
              <p class="text-xs text-surface-500">{{ $t('packages.select.packageInfo.total') }}</p>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Leads Grid -->
    <div v-if="availableLeads.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card
        v-for="lead in availableLeads"
        :key="lead.id"
        class="lead-card cursor-pointer transition-all"
        :class="{
          'ring-2 ring-primary bg-primary-50 dark:bg-primary-900/20': isSelected(lead.id),
          'opacity-50 cursor-not-allowed': !canSelectMore && !isSelected(lead.id)
        }"
        @click="toggleLeadSelection(lead.id)"
      >
        <template #content>
          <div class="flex items-start gap-3">
            <!-- Selection Checkbox -->
            <div
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
              :class="isSelected(lead.id)
                ? 'bg-primary border-primary'
                : 'border-surface-300 dark:border-surface-600'"
            >
              <i v-if="isSelected(lead.id)" class="pi pi-check text-white text-xs"></i>
            </div>

            <div class="flex-grow">
              <!-- Tags -->
              <div class="flex items-center gap-2 mb-2">
                <Tag v-for="cat in ((lead as any).categories || [])" :key="cat.id" :value="cat.name" severity="info" size="small" class="mr-1" />
                <Tag :value="lead.province?.code" severity="secondary" size="small" />
              </div>

              <!-- Lead Info -->
              <h4 class="font-medium text-surface-900 dark:text-surface-0 mb-1">
                {{ $t('packages.select.leadCard.leadId', { id: lead.id }) }}
              </h4>
              <p class="text-sm text-surface-600 dark:text-surface-400 line-clamp-2 mb-2">
                {{ lead.request_preview }}
              </p>

              <!-- Meta -->
              <div class="text-xs text-surface-400">
                {{ formatRelativeTime(lead.generated_at) }}
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-else-if="!packagesStore.loading && !catalogStore.loading" class="text-center py-12">
      <i class="pi pi-inbox text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
      <h3 class="text-xl font-semibold text-surface-700 dark:text-surface-300 mb-2">
        {{ $t('packages.select.empty.title') }}
      </h3>
      <p class="text-surface-500 dark:text-surface-400">
        {{ $t('packages.select.empty.subtitle') }}
      </p>
    </div>

    <!-- Floating Action Bar -->
    <div
      v-if="selectedLeads.length > 0"
      class="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700 shadow-lg md:left-64"
    >
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <p class="font-semibold text-surface-900 dark:text-surface-0">
            {{ $t('packages.select.floatingBar.selected', { count: selectedLeads.length }) }}
          </p>
          <p class="text-sm text-surface-500">
            {{ $t('packages.select.floatingBar.redeemHint') }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <Button
            :label="$t('packages.select.floatingBar.cancel')"
            severity="secondary"
            @click="selectedLeads = []"
          />
          <Button
            :label="$t('packages.select.redeemLeads')"
            icon="pi pi-check"
            @click="redeemLeads"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lead-card:hover:not(.opacity-50) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
