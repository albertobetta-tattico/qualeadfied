<script setup lang="ts">
/**
 * Catalogo Lead Pubblico
 * Vista lead disponibili in forma anonimizzata
 */

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const router = useRouter()

// Store
const catalogStore = usePublicCatalogStore()
const authStore = useAuthStore()

// Data
const leads = computed(() => catalogStore.leads)
const categories = computed(() => catalogStore.availableCategories)
const provinces = computed(() => catalogStore.availableProvinces)
const pagination = computed(() => catalogStore.pagination)
const loading = computed(() => catalogStore.loading)
const isLoggedIn = computed(() => authStore.isLoggedIn)

// Filters
const selectedCategory = ref<number | ''>('')
const selectedProvince = ref<number | ''>('')
const selectedAvailability = ref<string>('')
const sortBy = ref<'date' | 'price'>('date')
const sortOrder = ref<'desc' | 'asc'>('desc')

// Filter panel state (mobile)
const showFilters = ref(false)

// Availability options
const availabilityOptions = [
  { label: 'Tutti', value: '' },
  { label: 'Solo Esclusivi', value: 'exclusive' },
  { label: 'Solo Condivisi', value: 'shared' }
]

// Sort options
const sortOptions = [
  { label: 'Più recenti', value: 'date-desc' },
  { label: 'Meno recenti', value: 'date-asc' },
  { label: 'Prezzo crescente', value: 'price-asc' },
  { label: 'Prezzo decrescente', value: 'price-desc' }
]

const selectedSort = computed({
  get: () => `${sortBy.value}-${sortOrder.value}`,
  set: (val: string) => {
    const [by, order] = val.split('-') as ['date' | 'price', 'desc' | 'asc']
    sortBy.value = by
    sortOrder.value = order
  }
})

// Initialize from URL params
onMounted(async () => {
  // Initialize store
  await catalogStore.initialize()

  // Read URL params
  if (route.query.category) {
    selectedCategory.value = Number(route.query.category)
  }
  if (route.query.province) {
    selectedProvince.value = Number(route.query.province)
  }
  if (route.query.availability) {
    selectedAvailability.value = route.query.availability as string
  }

  // Apply filters and fetch
  applyFilters()
})

// Watch for filter changes
watch([selectedCategory, selectedProvince, selectedAvailability, sortBy, sortOrder], () => {
  applyFilters()
})

// Apply filters
const applyFilters = () => {
  catalogStore.setFilters({
    category_id: selectedCategory.value,
    province_id: selectedProvince.value,
    availability: selectedAvailability.value as any,
    sort_by: sortBy.value,
    sort_order: sortOrder.value
  })

  // Update URL
  router.replace({
    query: {
      ...(selectedCategory.value ? { category: selectedCategory.value } : {}),
      ...(selectedProvince.value ? { province: selectedProvince.value } : {}),
      ...(selectedAvailability.value ? { availability: selectedAvailability.value } : {})
    }
  })

  catalogStore.fetchLeads()
}

// Reset filters
const resetFilters = () => {
  selectedCategory.value = ''
  selectedProvince.value = ''
  selectedAvailability.value = ''
  sortBy.value = 'date'
  sortOrder.value = 'desc'
}

// Pagination
const onPageChange = (event: any) => {
  catalogStore.setPage(event.page + 1)
  catalogStore.fetchLeads()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Format date
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Format relative time
const formatRelativeTime = (date: string): string => {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'Appena aggiunto'
  if (diffHours < 24) return `${diffHours} ore fa`
  if (diffDays === 1) return 'Ieri'
  if (diffDays < 7) return `${diffDays} giorni fa`
  return formatDate(date)
}

// Format price
const formatPrice = (price: number): string => {
  return price.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

// Get availability badge
const getAvailabilityBadge = (lead: any) => {
  if (lead.is_exclusive_available) {
    return { label: 'Esclusivo disponibile', severity: 'success' as const }
  } else if (lead.shared_slots_available > 0) {
    return { label: `Condiviso ${lead.shared_slots_total - lead.shared_slots_available}/${lead.shared_slots_total}`, severity: 'info' as const }
  }
  return { label: 'Non disponibile', severity: 'secondary' as const }
}
</script>

<template>
  <div class="catalog-page">
    <!-- Page Header -->
    <div class="catalog-header">
      <div class="catalog-header-container">
        <h1 class="catalog-title">Catalogo Lead</h1>
        <p class="catalog-subtitle">
          Esplora i lead disponibili. Registrati per vedere i prezzi e acquistare.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="catalog-content">
      <div class="catalog-container">
        <!-- Filters Bar -->
        <div class="filters-bar">
          <div class="filters-left">
            <!-- Mobile filter toggle -->
            <PrimeButton
              icon="pi pi-filter"
              :label="showFilters ? 'Nascondi Filtri' : 'Filtri'"
              severity="secondary"
              outlined
              class="md:hidden"
              @click="showFilters = !showFilters"
            />

            <!-- Desktop filters -->
            <div class="hidden md:flex items-center gap-3">
              <PrimeSelect
                v-model="selectedCategory"
                :options="[{ id: '', name: 'Tutte le categorie' }, ...categories]"
                optionLabel="name"
                optionValue="id"
                placeholder="Categoria"
                class="w-48"
              />

              <PrimeSelect
                v-model="selectedProvince"
                :options="[{ id: '', name: 'Tutte le province' }, ...provinces]"
                optionLabel="name"
                optionValue="id"
                placeholder="Provincia"
                class="w-44"
              />

              <PrimeSelect
                v-model="selectedAvailability"
                :options="availabilityOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Disponibilità"
                class="w-40"
              />

              <PrimeButton
                v-if="selectedCategory || selectedProvince || selectedAvailability"
                icon="pi pi-filter-slash"
                severity="secondary"
                text
                v-tooltip.top="'Reset filtri'"
                @click="resetFilters"
              />
            </div>
          </div>

          <div class="filters-right">
            <span class="text-neutral-500 text-sm hidden lg:inline">Ordina per:</span>
            <PrimeSelect
              v-model="selectedSort"
              :options="sortOptions"
              optionLabel="label"
              optionValue="value"
              class="w-44"
            />
          </div>
        </div>

        <!-- Mobile Filters Panel -->
        <Transition name="slide-down">
          <div v-if="showFilters" class="mobile-filters md:hidden">
            <div class="grid grid-cols-1 gap-3">
              <PrimeSelect
                v-model="selectedCategory"
                :options="[{ id: '', name: 'Tutte le categorie' }, ...categories]"
                optionLabel="name"
                optionValue="id"
                placeholder="Categoria"
                class="w-full"
              />

              <PrimeSelect
                v-model="selectedProvince"
                :options="[{ id: '', name: 'Tutte le province' }, ...provinces]"
                optionLabel="name"
                optionValue="id"
                placeholder="Provincia"
                class="w-full"
              />

              <PrimeSelect
                v-model="selectedAvailability"
                :options="availabilityOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Disponibilità"
                class="w-full"
              />

              <PrimeButton
                v-if="selectedCategory || selectedProvince || selectedAvailability"
                label="Reset filtri"
                icon="pi pi-filter-slash"
                severity="secondary"
                outlined
                class="w-full"
                @click="resetFilters"
              />
            </div>
          </div>
        </Transition>

        <!-- Results count -->
        <div class="results-count">
          <span v-if="!loading">
            {{ pagination.total }} lead trovati
          </span>
        </div>

        <!-- Leads Grid -->
        <div v-if="loading" class="leads-loading">
          <div v-for="i in 6" :key="i" class="lead-card-skeleton">
            <div class="skeleton skeleton-badge"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text-short"></div>
            <div class="skeleton skeleton-price"></div>
          </div>
        </div>

        <div v-else-if="leads.length === 0" class="leads-empty">
          <i class="pi pi-search text-5xl text-neutral-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-neutral-700 mb-2">Nessun lead trovato</h3>
          <p class="text-neutral-500 mb-4">Prova a modificare i filtri di ricerca</p>
          <PrimeButton
            label="Reset Filtri"
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            @click="resetFilters"
          />
        </div>

        <div v-else class="leads-grid">
          <div
            v-for="lead in leads"
            :key="lead.id"
            class="lead-card"
          >
            <!-- Category Badge -->
            <div class="lead-card-header">
              <PrimeTag
                :value="lead.category?.name || 'Categoria'"
                severity="primary"
              />
              <span class="lead-date">{{ formatRelativeTime(lead.generated_at) }}</span>
            </div>

            <!-- Province -->
            <div class="lead-province">
              <i class="pi pi-map-marker mr-1"></i>
              {{ lead.province?.name || 'Provincia' }}
            </div>

            <!-- Request Preview (obscured) -->
            <p class="lead-preview">
              {{ lead.request_preview }}
            </p>

            <!-- Price -->
            <div class="lead-price">
              <span class="lead-price-label">A partire da</span>
              <span class="lead-price-value">{{ formatPrice(lead.base_price) }}</span>
            </div>

            <!-- Availability -->
            <div class="lead-availability">
              <PrimeTag
                :value="getAvailabilityBadge(lead).label"
                :severity="getAvailabilityBadge(lead).severity"
                class="text-xs"
              />
            </div>

            <!-- CTA -->
            <div class="lead-cta">
              <NuxtLink v-if="!isLoggedIn" to="/login" class="w-full">
                <PrimeButton
                  label="Accedi per acquistare"
                  icon="pi pi-lock"
                  severity="primary"
                  outlined
                  class="w-full"
                />
              </NuxtLink>
              <NuxtLink v-else :to="`/leads/${lead.id}`" class="w-full">
                <PrimeButton
                  label="Visualizza dettagli"
                  icon="pi pi-eye"
                  severity="primary"
                  class="w-full"
                />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > pagination.per_page" class="pagination-container">
          <PrimePaginator
            :rows="pagination.per_page"
            :totalRecords="pagination.total"
            :first="(pagination.current_page - 1) * pagination.per_page"
            :rowsPerPageOptions="[12, 24, 48]"
            @page="onPageChange"
          />
        </div>
      </div>
    </div>

    <!-- CTA Banner (for non-logged users) -->
    <div v-if="!isLoggedIn" class="cta-banner">
      <div class="cta-banner-container">
        <div class="cta-banner-content">
          <h2 class="cta-banner-title">Vuoi accedere ai lead completi?</h2>
          <p class="cta-banner-text">
            Registrati gratis e ricevi 3 lead in omaggio per provare la qualità del servizio.
          </p>
        </div>
        <NuxtLink to="/registrati">
          <PrimeButton
            label="Registrati Gratis"
            icon="pi pi-user-plus"
            size="large"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalog-page {
  min-height: 100vh;
  background: #f8fafc;
}

/* Header */
.catalog-header {
  background: linear-gradient(135deg, #1e3a8a, #2563eb);
  padding: 3rem 1.5rem;
  color: white;
}

.catalog-header-container {
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
}

.catalog-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.catalog-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
}

/* Content */
.catalog-content {
  padding: 2rem 1.5rem;
}

.catalog-container {
  max-width: 1280px;
  margin: 0 auto;
}

/* Filters Bar */
.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.filters-left,
.filters-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Mobile Filters */
.mobile-filters {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Results count */
.results-count {
  margin-bottom: 1.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

/* Loading skeleton */
.leads-loading {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 968px) {
  .leads-loading {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .leads-loading {
    grid-template-columns: 1fr;
  }
}

.lead-card-skeleton {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  height: 280px;
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-badge {
  width: 100px;
  height: 24px;
  margin-bottom: 1rem;
}

.skeleton-text {
  width: 100%;
  height: 16px;
  margin-bottom: 0.5rem;
}

.skeleton-text-short {
  width: 60%;
  height: 16px;
  margin-bottom: 1.5rem;
}

.skeleton-price {
  width: 80px;
  height: 32px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Empty state */
.leads-empty {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
}

/* Leads Grid */
.leads-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 968px) {
  .leads-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .leads-grid {
    grid-template-columns: 1fr;
  }
}

/* Lead Card */
.lead-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s;
  border: 1px solid #e2e8f0;
}

.lead-card:hover {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.lead-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.lead-date {
  font-size: 0.75rem;
  color: #94a3b8;
}

.lead-province {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.75rem;
}

.lead-preview {
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.5;
  margin-bottom: 1.25rem;
  min-height: 48px;
}

.lead-price {
  margin-bottom: 1rem;
}

.lead-price-label {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.lead-price-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.lead-availability {
  margin-bottom: 1rem;
}

.lead-cta {
  margin-top: auto;
}

/* Pagination */
.pagination-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

/* CTA Banner */
.cta-banner {
  background: #0f172a;
  padding: 3rem 1.5rem;
}

.cta-banner-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .cta-banner-container {
    flex-direction: column;
    text-align: center;
  }
}

.cta-banner-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.cta-banner-text {
  color: #94a3b8;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
