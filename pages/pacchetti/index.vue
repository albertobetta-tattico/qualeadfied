<script setup lang="ts">
/**
 * Page - Available Packages
 * List of lead packages available for purchase
 */
import type { LeadPackage } from '~/types/clientArea'

definePageMeta({
  layout: 'client'
})

const packagesStore = usePackagesStore()
const { formatCurrency } = useClientFormatters()
const { showSuccess, showError } = useClientToast()

// Selected category filter
const selectedCategory = ref<number | ''>('')

// Fetch packages on mount
onMounted(async () => {
  await packagesStore.fetchPackages()
})

// Filtered packages
const filteredPackages = computed(() => {
  if (!selectedCategory.value) {
    return packagesStore.availablePackages
  }
  return packagesStore.availablePackages.filter(p => p.category_id === selectedCategory.value)
})

// Get unique categories from packages
const categories = computed(() => {
  const categoryMap = new Map()
  packagesStore.availablePackages.forEach(p => {
    if (p.category && !categoryMap.has(p.category_id)) {
      categoryMap.set(p.category_id, p.category)
    }
  })
  return Array.from(categoryMap.values())
})

// Calculate savings
const calculateSavings = (pkg: LeadPackage): number => {
  return pkg.original_price - pkg.price
}

// Purchase package
const router = useRouter()
const purchasePackage = async (pkg: LeadPackage) => {
  // Redirect to package purchase page
  router.push(`/pacchetti/${pkg.id}/acquista`)
}
</script>

<template>
  <div class="packages-page">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-2">
        Pacchetti Lead
      </h1>
      <p class="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
        Acquista pacchetti di lead a prezzi scontati. Più lead acquisti, più risparmi.
      </p>
    </div>

    <!-- Filter & Actions -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div class="flex items-center gap-4">
        <Select
          v-model="selectedCategory"
          :options="[{ id: '', name: 'Tutte le categorie' }, ...categories]"
          optionLabel="name"
          optionValue="id"
          placeholder="Filtra per categoria"
          class="w-64"
        />
      </div>
      <NuxtLink to="/pacchetti/attivi">
        <Button
          label="I miei pacchetti attivi"
          icon="pi pi-box"
          severity="secondary"
        />
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="packagesStore.loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>

    <!-- Packages Grid -->
    <div v-else-if="filteredPackages.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="pkg in filteredPackages"
        :key="pkg.id"
        class="package-card overflow-hidden"
      >
        <template #content>
          <div class="text-center mb-6">
            <!-- Category Badge -->
            <Tag v-if="pkg.category" :value="pkg.category.name" severity="info" class="mb-4" />
            <Tag v-else value="Tutte le categorie" severity="secondary" class="mb-4" />

            <!-- Package Name -->
            <h3 class="text-xl font-bold text-surface-900 dark:text-surface-0 mb-2">
              {{ pkg.name }}
            </h3>

            <!-- Description -->
            <p class="text-sm text-surface-600 dark:text-surface-400 mb-4">
              {{ pkg.description }}
            </p>

            <!-- Lead Count -->
            <div class="flex items-center justify-center gap-2 mb-4">
              <i class="pi pi-users text-primary text-2xl"></i>
              <span class="text-3xl font-bold text-surface-900 dark:text-surface-0">
                {{ pkg.total_leads }}
              </span>
              <span class="text-surface-500">lead</span>
            </div>

            <!-- Pricing -->
            <div class="space-y-2">
              <div class="flex items-center justify-center gap-2">
                <span class="text-surface-400 line-through">
                  {{ formatCurrency(pkg.original_price) }}
                </span>
                <Tag
                  :value="`-${pkg.discount_percent}%`"
                  severity="success"
                  size="small"
                />
              </div>
              <p class="text-4xl font-bold text-primary">
                {{ formatCurrency(pkg.price) }}
              </p>
              <p class="text-sm text-surface-500">
                {{ formatCurrency(Math.round(pkg.price / pkg.total_leads)) }} / lead
              </p>
            </div>
          </div>

          <!-- Features -->
          <div class="space-y-3 mb-6">
            <div class="flex items-center gap-2">
              <i class="pi pi-check-circle text-green-500"></i>
              <span class="text-sm text-surface-600 dark:text-surface-400">
                {{ pkg.exclusive_leads }} lead esclusivi + {{ pkg.shared_leads }} condivisi
              </span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-check-circle text-green-500"></i>
              <span class="text-sm text-surface-600 dark:text-surface-400">
                Validità {{ pkg.valid_days }} giorni
              </span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-check-circle text-green-500"></i>
              <span class="text-sm text-surface-600 dark:text-surface-400">
                Risparmi {{ formatCurrency(calculateSavings(pkg)) }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-check-circle text-green-500"></i>
              <span class="text-sm text-surface-600 dark:text-surface-400">
                Selezione libera dal catalogo
              </span>
            </div>
          </div>

          <!-- CTA -->
          <Button
            label="Acquista Pacchetto"
            icon="pi pi-shopping-cart"
            class="w-full"
            @click="purchasePackage(pkg)"
          />
        </template>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <i class="pi pi-box text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
      <h3 class="text-xl font-semibold text-surface-700 dark:text-surface-300 mb-2">
        Nessun pacchetto disponibile
      </h3>
      <p class="text-surface-500 dark:text-surface-400">
        Al momento non ci sono pacchetti disponibili per questa categoria
      </p>
    </div>

    <!-- Info Section -->
    <Card class="mt-8 bg-surface-50 dark:bg-surface-800">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-3">
              <i class="pi pi-percentage text-primary text-xl"></i>
            </div>
            <h4 class="font-semibold text-surface-900 dark:text-surface-0 mb-1">
              Risparmia fino al 30%
            </h4>
            <p class="text-sm text-surface-600 dark:text-surface-400">
              I pacchetti offrono sconti significativi rispetto all'acquisto singolo
            </p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
              <i class="pi pi-check-circle text-green-500 text-xl"></i>
            </div>
            <h4 class="font-semibold text-surface-900 dark:text-surface-0 mb-1">
              Selezione Libera
            </h4>
            <p class="text-sm text-surface-600 dark:text-surface-400">
              Scegli tu quali lead riscattare dal catalogo durante la validità
            </p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
              <i class="pi pi-clock text-blue-500 text-xl"></i>
            </div>
            <h4 class="font-semibold text-surface-900 dark:text-surface-0 mb-1">
              Validità Flessibile
            </h4>
            <p class="text-sm text-surface-600 dark:text-surface-400">
              Hai tempo per utilizzare i tuoi lead, senza fretta
            </p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.package-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.package-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}
</style>
