<script setup lang="ts">
/**
 * Page - Select Leads from Package
 * Select leads to redeem from an active package
 */
import type { ActivePackage, AuthenticatedLead, PurchaseMode } from '~/types/clientArea'

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

// Selected leads — map leadId → chosen purchase mode.
// Using a plain object instead of Map for cleaner reactivity & template iteration.
const selectedLeads = ref<Record<number, PurchaseMode>>({})

// When the package has a category but the catalogue has 0 leads in it, the
// user can opt to see leads of all categories as a fallback (e.g. tutti
// venduti in modalità esclusiva o slot esauriti).
const showAllCategories = ref(false)

// Current active package
const currentPackage = computed(() => {
  return packagesStore.activePackages.find(p => p.id === packageId.value)
})

// Package-level budgets (immutable for the session — they reflect the package
// definition minus what's already been redeemed in previous sessions).
const exclusiveBudget = computed(() => {
  const pkg = currentPackage.value
  if (!pkg) return 0
  return Math.max(0, pkg.exclusive_leads_total - pkg.exclusive_leads_used)
})
const sharedBudget = computed(() => {
  const pkg = currentPackage.value
  if (!pkg) return 0
  return Math.max(0, pkg.shared_leads_total - pkg.shared_leads_used)
})

// Live counters that reflect what the user is *currently* picking.
const selectedExclusive = computed(() =>
  Object.values(selectedLeads.value).filter(m => m === 'exclusive').length
)
const selectedShared = computed(() =>
  Object.values(selectedLeads.value).filter(m => m === 'shared').length
)
const exclusiveRemaining = computed(() => exclusiveBudget.value - selectedExclusive.value)
const sharedRemaining = computed(() => sharedBudget.value - selectedShared.value)

const totalSelected = computed(() => Object.keys(selectedLeads.value).length)
const totalBudget = computed(() => exclusiveBudget.value + sharedBudget.value)

// Fetch data on mount
onMounted(async () => {
  // Active packages first — we need the package's category_id to query the
  // right slice of the catalogue. Without it the previous code fetched only
  // the first 12 leads of any category, then filtered client-side, which
  // explained the "no leads found" empty state on a category that has many.
  await Promise.all([
    packagesStore.fetchActivePackages(),
    catalogStore.fetchCategories(),
    catalogStore.fetchProvinces()
  ])

  if (!currentPackage.value) {
    router.push('/pacchetti/attivi')
    return
  }

  // Server-side filter on the package category, no pagination so the user
  // sees every available lead they can pick from.
  const pkgCatId = currentPackage.value.category_id
  catalogStore.setFilters({
    category_id: pkgCatId ?? '',
    page: 1,
    per_page: 200,
  })
  await catalogStore.fetchLeads()
})

// Server-side already filtered by category; this stays as a defensive
// client-side guard in case the catalog has stale items from a previous fetch.
//
// NOTE: `currentPackage.category_id` arriva tipizzato come string dall'API
// (MySQL BIGINT serializzato → string in JSON), mentre `Lead.categories[].id`
// arriva come number. Un confronto strict `c.id === pkgCatId` ritornerebbe
// sempre false e la lista risulterebbe vuota. Normalizziamo entrambi a
// Number prima di confrontare.
const availableLeads = computed<AuthenticatedLead[]>(() => {
  const rawPkgCatId = currentPackage.value?.category_id
  // The store types its leads with a slimmer shape than the API actually returns;
  // double-cast through unknown is the documented escape hatch when two types
  // don't sufficiently overlap. At runtime the catalog payload already carries
  // is_exclusive_available / shared_slots_available (see PublicCatalogController).
  const all = catalogStore.leads as unknown as AuthenticatedLead[]
  if (!rawPkgCatId || showAllCategories.value) {
    return all
  }
  const pkgCatId = Number(rawPkgCatId)
  return all.filter(l => (l as any).categories?.some((c: any) => Number(c.id) === pkgCatId))
})

const reloadAvailableLeads = async () => {
  const pkgCatId = currentPackage.value?.category_id
  catalogStore.setFilters({
    category_id: showAllCategories.value ? '' : (pkgCatId ?? ''),
    page: 1,
    per_page: 200,
  })
  await catalogStore.fetchLeads()
}

const loadWithoutCategoryFilter = async () => {
  showAllCategories.value = true
  await reloadAvailableLeads()
}

// Per-lead capability: can this specific lead be picked in a given mode given
// (a) the lead's own availability and (b) the package's remaining capacity?
// `currentMode` is passed so that the *currently* selected mode for the lead
// remains "selectable" (otherwise switching back from shared→exclusive after
// exhausting exclusive budget would be impossible).
const canPickAsExclusive = (lead: AuthenticatedLead, currentMode?: PurchaseMode): boolean => {
  if (!lead.is_exclusive_available) return false
  if (exclusiveBudget.value === 0) return false
  if (currentMode === 'exclusive') return true
  return exclusiveRemaining.value > 0
}
const canPickAsShared = (lead: AuthenticatedLead, currentMode?: PurchaseMode): boolean => {
  if (lead.shared_slots_available <= 0) return false
  if (sharedBudget.value === 0) return false
  if (currentMode === 'shared') return true
  return sharedRemaining.value > 0
}

const isSelected = (leadId: number): boolean => {
  return Object.prototype.hasOwnProperty.call(selectedLeads.value, leadId)
}

const selectedMode = (leadId: number): PurchaseMode | undefined => {
  return selectedLeads.value[leadId]
}

// Default mode when selecting a lead: prefer exclusive (the scarcer slot)
// when both lead availability and package capacity allow it; fallback to
// shared; otherwise the lead is not selectable.
const pickDefaultMode = (lead: AuthenticatedLead): PurchaseMode | null => {
  if (canPickAsExclusive(lead)) return 'exclusive'
  if (canPickAsShared(lead)) return 'shared'
  return null
}

const toggleLeadSelection = (lead: AuthenticatedLead) => {
  if (isSelected(lead.id)) {
    // Deselect — Vue 3 detects deletion on a ref'd object literal.
    delete selectedLeads.value[lead.id]
    // Force reactivity: replace the ref with a new object literal so child
    // computeds re-evaluate even if a downstream subscriber missed the delete.
    selectedLeads.value = { ...selectedLeads.value }
    return
  }
  const mode = pickDefaultMode(lead)
  if (!mode) {
    if (exclusiveBudget.value === 0 && sharedBudget.value === 0) {
      showError(t('packages.select.toast.bothBudgetsEmpty'))
    } else {
      showError(t('packages.select.toast.noCapacityForLead'))
    }
    return
  }
  selectedLeads.value = { ...selectedLeads.value, [lead.id]: mode }
}

const setLeadMode = (lead: AuthenticatedLead, mode: PurchaseMode) => {
  // Don't allow setting a mode the lead/package combo can't support.
  const current = selectedMode(lead.id)
  if (mode === 'exclusive' && !canPickAsExclusive(lead, current)) return
  if (mode === 'shared' && !canPickAsShared(lead, current)) return
  selectedLeads.value = { ...selectedLeads.value, [lead.id]: mode }
}

// Redeem selected leads
const redeemLeads = async () => {
  const entries = Object.entries(selectedLeads.value)
  if (entries.length === 0) {
    showError(t('packages.select.toast.selectAtLeast'))
    return
  }

  const leadIds: number[] = []
  const purchaseModes: Record<number, PurchaseMode> = {}
  for (const [id, mode] of entries) {
    const numId = Number(id)
    leadIds.push(numId)
    purchaseModes[numId] = mode
  }

  const success = await packagesStore.selectLeadsFromPackage(packageId.value, {
    lead_ids: leadIds,
    purchase_modes: purchaseModes
  })

  if (success) {
    showSuccess(t('packages.select.toast.redeemed', { count: leadIds.length }))
    selectedLeads.value = {}
    // Refresh packages
    await packagesStore.fetchActivePackages()
    // Redirect to my leads
    router.push('/i-miei-lead')
  } else {
    showError(packagesStore.error || t('packages.select.toast.errorRedeeming'))
  }
}

// Floating bar summary key picks the right phrasing based on composition.
const floatingSummaryKey = computed(() => {
  if (selectedExclusive.value > 0 && selectedShared.value > 0) return 'packages.select.floatingBar.summaryMixed'
  if (selectedExclusive.value > 0) return 'packages.select.floatingBar.summaryExclusiveOnly'
  return 'packages.select.floatingBar.summarySharedOnly'
})
const floatingSummaryParams = computed(() => ({
  exclusive: selectedExclusive.value === 1
    ? t('packages.select.floatingBar.leadExclusiveSingular')
    : t('packages.select.floatingBar.leadExclusivePlural', { count: selectedExclusive.value }),
  shared: selectedShared.value === 1
    ? t('packages.select.floatingBar.leadSharedSingular')
    : t('packages.select.floatingBar.leadSharedPlural', { count: selectedShared.value }),
}))
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
            {{ $t('packages.select.leadsAvailable', { name: currentPackage.package_name, count: totalBudget }) }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-surface-500">
            {{ $t('packages.select.selectedCount', { selected: totalSelected, total: totalBudget }) }}
          </span>
          <PrimeButton
            :label="$t('packages.select.redeemLeads')"
            icon="pi pi-check"
            :disabled="totalSelected === 0"
            :badge="totalSelected > 0 ? String(totalSelected) : undefined"
            @click="redeemLeads"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="packagesStore.loading || catalogStore.loading" class="flex justify-center py-12">
      <PrimeProgressSpinner />
    </div>

    <!-- Package Info Card -->
    <PrimeCard v-else-if="currentPackage" class="mb-6 bg-surface-50 dark:bg-surface-800">
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
                {{ currentPackage.category?.name
                    ? `Categoria: ${currentPackage.category.name}`
                    : (currentPackage.category_id
                        ? `Categoria #${currentPackage.category_id}`
                        : $t('packages.active.allCategories')) }}
              </p>
            </div>
          </div>

          <!-- Two separate budget tiles: exclusive and shared, live -->
          <div class="flex items-center gap-3">
            <div
              class="px-4 py-2 rounded-lg border-2 text-center min-w-[110px]"
              :class="exclusiveBudget > 0
                ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20'
                : 'border-surface-200 dark:border-surface-700 opacity-60'"
            >
              <p class="text-xs uppercase tracking-wide text-surface-500 mb-1">
                {{ $t('packages.select.packageInfo.exclusiveTitle') }}
              </p>
              <p class="text-xl font-bold text-amber-700 dark:text-amber-400">
                {{ $t('packages.select.packageInfo.remainingOf', { remaining: exclusiveRemaining, total: exclusiveBudget }) }}
              </p>
            </div>
            <div
              class="px-4 py-2 rounded-lg border-2 text-center min-w-[110px]"
              :class="sharedBudget > 0
                ? 'border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-900/20'
                : 'border-surface-200 dark:border-surface-700 opacity-60'"
            >
              <p class="text-xs uppercase tracking-wide text-surface-500 mb-1">
                {{ $t('packages.select.packageInfo.sharedTitle') }}
              </p>
              <p class="text-xl font-bold text-sky-700 dark:text-sky-400">
                {{ $t('packages.select.packageInfo.remainingOf', { remaining: sharedRemaining, total: sharedBudget }) }}
              </p>
            </div>
          </div>
        </div>
        <p v-if="totalSelected > 0" class="text-sm text-surface-500 mt-3 md:text-right">
          {{ $t('packages.select.packageInfo.pickingSummary', { exclusive: selectedExclusive, shared: selectedShared }) }}
        </p>
      </template>
    </PrimeCard>

    <!-- Leads Grid -->
    <div v-if="availableLeads.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <PrimeCard
        v-for="lead in availableLeads"
        :key="lead.id"
        class="lead-card cursor-pointer transition-all"
        :class="{
          'ring-2 ring-primary bg-primary-50 dark:bg-primary-900/20': isSelected(lead.id),
          'opacity-50 cursor-not-allowed': !isSelected(lead.id) && !canPickAsExclusive(lead) && !canPickAsShared(lead)
        }"
        @click="toggleLeadSelection(lead)"
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
              <!-- Category + Province tags -->
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <PrimeTag v-for="cat in ((lead as any).categories || [])" :key="cat.id" :value="cat.name" severity="info" size="small" class="mr-1" />
                <PrimeTag v-if="(lead as any).province?.code" :value="(lead as any).province.code" severity="secondary" size="small" />
              </div>

              <!-- Availability badges (informativi: cosa offre realmente questo lead) -->
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  v-if="lead.is_exclusive_available"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                >
                  <i class="pi pi-lock text-[10px]"></i>
                  {{ $t('packages.select.leadCard.availability.exclusive') }}
                </span>
                <span
                  v-if="lead.shared_slots_available > 0"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300"
                >
                  <i class="pi pi-users text-[10px]"></i>
                  {{ $t('packages.select.leadCard.availability.shared', { available: lead.shared_slots_available, total: lead.shared_slots_total }) }}
                </span>
              </div>

              <!-- Lead Info -->
              <h4 class="font-medium text-surface-900 dark:text-surface-0 mb-1">
                {{ $t('packages.select.leadCard.leadId', { id: lead.id }) }}
              </h4>
              <p class="text-sm text-surface-600 dark:text-surface-400 line-clamp-2 mb-2">
                {{ (lead as any).request_preview }}
              </p>

              <!-- Mode toggle (visible only when this lead is selected) -->
              <div v-if="isSelected(lead.id)" class="flex items-center gap-2 mt-3" @click.stop>
                <button
                  type="button"
                  class="px-3 py-1 text-xs rounded border-2 font-medium transition-colors"
                  :class="selectedMode(lead.id) === 'exclusive'
                    ? 'bg-amber-500 border-amber-500 text-white'
                    : canPickAsExclusive(lead, selectedMode(lead.id))
                      ? 'border-amber-300 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                      : 'border-surface-200 dark:border-surface-700 text-surface-300 dark:text-surface-600 cursor-not-allowed'"
                  :disabled="!canPickAsExclusive(lead, selectedMode(lead.id))"
                  @click="setLeadMode(lead, 'exclusive')"
                >
                  <i class="pi pi-lock text-[10px] mr-1"></i>
                  {{ $t('packages.select.leadCard.modeToggle.exclusive') }}
                </button>
                <button
                  type="button"
                  class="px-3 py-1 text-xs rounded border-2 font-medium transition-colors"
                  :class="selectedMode(lead.id) === 'shared'
                    ? 'bg-sky-500 border-sky-500 text-white'
                    : canPickAsShared(lead, selectedMode(lead.id))
                      ? 'border-sky-300 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/20'
                      : 'border-surface-200 dark:border-surface-700 text-surface-300 dark:text-surface-600 cursor-not-allowed'"
                  :disabled="!canPickAsShared(lead, selectedMode(lead.id))"
                  @click="setLeadMode(lead, 'shared')"
                >
                  <i class="pi pi-users text-[10px] mr-1"></i>
                  {{ $t('packages.select.leadCard.modeToggle.shared') }}
                </button>
              </div>

              <!-- Meta -->
              <div class="text-xs text-surface-400 mt-2">
                {{ formatRelativeTime((lead as any).generated_at) }}
              </div>
            </div>
          </div>
        </template>
      </PrimeCard>
    </div>

    <!-- Empty State -->
    <div v-else-if="!packagesStore.loading && !catalogStore.loading" class="text-center py-12">
      <i class="pi pi-inbox text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
      <h3 class="text-xl font-semibold text-surface-700 dark:text-surface-300 mb-2">
        {{ $t('packages.select.empty.title') }}
      </h3>
      <p class="text-surface-500 dark:text-surface-400 mb-4">
        <template v-if="currentPackage?.category_id">
          {{ $t('packages.select.empty.categoryExhausted', { category: currentPackage.category?.name || `#${currentPackage.category_id}` }) }}
        </template>
        <template v-else>
          {{ $t('packages.select.empty.subtitle') }}
        </template>
      </p>
      <div class="flex gap-3 justify-center">
        <PrimeButton
          :label="$t('packages.select.empty.refresh')"
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          @click="reloadAvailableLeads"
        />
        <PrimeButton
          v-if="currentPackage?.category_id && !showAllCategories"
          :label="$t('packages.select.empty.showAllCategories')"
          icon="pi pi-eye"
          severity="secondary"
          @click="loadWithoutCategoryFilter"
        />
      </div>
    </div>

    <!-- Floating Action Bar -->
    <div
      v-if="totalSelected > 0"
      class="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700 shadow-lg md:left-64"
    >
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <p class="font-semibold text-surface-900 dark:text-surface-0">
            {{ $t(floatingSummaryKey, floatingSummaryParams) }}
          </p>
          <p class="text-sm text-surface-500">
            {{ $t('packages.select.floatingBar.redeemHint') }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <PrimeButton
            :label="$t('packages.select.floatingBar.cancel')"
            severity="secondary"
            @click="selectedLeads = {}"
          />
          <PrimeButton
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
