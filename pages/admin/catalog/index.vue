<script setup lang="ts">
/**
 * Admin Catalog Overview - Panoramica Catalogo
 * Dashboard con accesso rapido a Categorie, Province e Pacchetti
 */
const { t } = useI18n()

definePageMeta({
  layout: 'admin'
})

// Store & Composables
const catalogStore = useCatalogStore()
const { formatNumber, formatCurrency } = useCatalogFormatters()
const router = useRouter()

// Load stats on mount
onMounted(async () => {
  await Promise.all([
    catalogStore.fetchCategoryStats(),
    catalogStore.fetchProvinceStats(),
    catalogStore.fetchPackageStats()
  ])
})

// Navigation
const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">{{ $t('admin.catalog.title') }}</h1>
        <p class="page-subtitle">{{ $t('admin.catalog.subtitle') }}</p>
      </div>
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Categories Card -->
      <div 
        class="q-card hover:shadow-lg transition-shadow cursor-pointer"
        @click="navigateTo('/admin/catalog/categories')"
      >
        <div class="q-card-body">
          <div class="flex items-start justify-between mb-4">
            <div class="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center">
              <i class="pi pi-tag text-2xl text-primary-600"></i>
            </div>
            <PrimeButton 
              icon="pi pi-arrow-right" 
              severity="secondary"
              text
              rounded
              size="small"
            />
          </div>
          
          <h3 class="text-lg font-semibold text-neutral-900 mb-2">{{ $t('admin.catalog.categories.title') }}</h3>
          <p class="text-sm text-neutral-600 mb-4">
            {{ $t('admin.catalog.categories.description') }}
          </p>
          
          <div class="flex items-center gap-4 pt-4 border-t border-neutral-200">
            <div>
              <div class="text-2xl font-bold text-neutral-900">
                {{ formatNumber(catalogStore.categoryStats?.total || 0) }}
              </div>
              <div class="text-xs text-neutral-500">{{ $t('admin.catalog.categories.total') }}</div>
            </div>
            <div class="w-px h-10 bg-neutral-200"></div>
            <div>
              <div class="text-2xl font-bold text-success">
                {{ formatNumber(catalogStore.categoryStats?.active || 0) }}
              </div>
              <div class="text-xs text-neutral-500">{{ $t('admin.catalog.categories.active') }}</div>
            </div>
            <div class="w-px h-10 bg-neutral-200"></div>
            <div>
              <div class="text-2xl font-bold text-primary-600">
                {{ formatNumber(catalogStore.categoryStats?.available_leads || 0) }}
              </div>
              <div class="text-xs text-neutral-500">{{ $t('admin.catalog.categories.availableLeads') }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Provinces Card -->
      <div 
        class="q-card hover:shadow-lg transition-shadow cursor-pointer"
        @click="navigateTo('/admin/catalog/provinces')"
      >
        <div class="q-card-body">
          <div class="flex items-start justify-between mb-4">
            <div class="w-14 h-14 rounded-xl bg-info-light flex items-center justify-center">
              <i class="pi pi-map-marker text-2xl text-info"></i>
            </div>
            <PrimeButton 
              icon="pi pi-arrow-right" 
              severity="secondary"
              text
              rounded
              size="small"
            />
          </div>
          
          <h3 class="text-lg font-semibold text-neutral-900 mb-2">{{ $t('admin.catalog.provinces.title') }}</h3>
          <p class="text-sm text-neutral-600 mb-4">
            {{ $t('admin.catalog.provinces.description') }}
          </p>
          
          <div class="flex items-center gap-4 pt-4 border-t border-neutral-200">
            <div>
              <div class="text-2xl font-bold text-neutral-900">
                {{ formatNumber(catalogStore.provinceStats?.total || 0) }}
              </div>
              <div class="text-xs text-neutral-500">{{ $t('admin.catalog.provinces.total') }}</div>
            </div>
            <div class="w-px h-10 bg-neutral-200"></div>
            <div>
              <div class="text-2xl font-bold text-success">
                {{ formatNumber(catalogStore.provinceStats?.active || 0) }}
              </div>
              <div class="text-xs text-neutral-500">{{ $t('admin.catalog.provinces.active') }}</div>
            </div>
            <div class="w-px h-10 bg-neutral-200"></div>
            <div>
              <div class="text-2xl font-bold text-info">
                {{ Object.keys(catalogStore.provinceStats?.by_region || {}).length }}
              </div>
              <div class="text-xs text-neutral-500">{{ $t('admin.catalog.provinces.regions') }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Packages Card -->
      <div 
        class="q-card hover:shadow-lg transition-shadow cursor-pointer"
        @click="navigateTo('/admin/catalog/packages')"
      >
        <div class="q-card-body">
          <div class="flex items-start justify-between mb-4">
            <div class="w-14 h-14 rounded-xl bg-warning-light flex items-center justify-center">
              <i class="pi pi-box text-2xl text-warning-dark"></i>
            </div>
            <PrimeButton 
              icon="pi pi-arrow-right" 
              severity="secondary"
              text
              rounded
              size="small"
            />
          </div>
          
          <h3 class="text-lg font-semibold text-neutral-900 mb-2">{{ $t('admin.catalog.packages.title') }}</h3>
          <p class="text-sm text-neutral-600 mb-4">
            {{ $t('admin.catalog.packages.description') }}
          </p>
          
          <div class="flex items-center gap-4 pt-4 border-t border-neutral-200">
            <div>
              <div class="text-2xl font-bold text-neutral-900">
                {{ formatNumber(catalogStore.packageStats?.total || 0) }}
              </div>
              <div class="text-xs text-neutral-500">{{ $t('admin.catalog.packages.total') }}</div>
            </div>
            <div class="w-px h-10 bg-neutral-200"></div>
            <div>
              <div class="text-2xl font-bold text-success">
                {{ formatNumber(catalogStore.packageStats?.active || 0) }}
              </div>
              <div class="text-xs text-neutral-500">{{ $t('admin.catalog.packages.active') }}</div>
            </div>
            <div class="w-px h-10 bg-neutral-200"></div>
            <div>
              <div class="text-2xl font-bold text-warning-dark">
                {{ formatNumber(catalogStore.packageStats?.total_sales || 0) }}
              </div>
              <div class="text-xs text-neutral-500">{{ $t('admin.catalog.packages.sales') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="q-card">
      <div class="q-card-header">
        <h3 class="card-title">
          <i class="pi pi-bolt mr-2 text-primary-500"></i>
          {{ $t('admin.catalog.quickActions.title') }}
        </h3>
      </div>
      <div class="q-card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PrimeButton
            :label="$t('admin.catalog.quickActions.newCategory')"
            icon="pi pi-plus"
            severity="primary"
            class="justify-start"
            @click="navigateTo('/admin/catalog/categories/create')"
          />
          <PrimeButton
            :label="$t('admin.catalog.quickActions.newPackage')"
            icon="pi pi-plus"
            severity="primary"
            class="justify-start"
            @click="navigateTo('/admin/catalog/packages/create')"
          />
          <PrimeButton
            :label="$t('admin.catalog.quickActions.managePricing')"
            icon="pi pi-euro"
            severity="secondary"
            outlined
            class="justify-start"
            @click="navigateTo('/admin/pricing')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.q-card:hover .pi-arrow-right {
  transform: translateX(4px);
  transition: transform 0.2s ease;
}
</style>
