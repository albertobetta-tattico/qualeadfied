<script setup lang="ts">
/**
 * Page - Authenticated Lead Catalog
 * Full catalog with pricing and add to cart functionality
 */
definePageMeta({
  layout: 'client'
})

const catalogStore = usePublicCatalogStore()
const cartStore = useCartStore()
const { formatCurrency, formatRelativeTime } = useClientFormatters()
const { showAddedToCart, showError } = useClientToast()

// Filters state
const selectedCategory = ref<number | ''>('')
const selectedProvince = ref<number | ''>('')

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    catalogStore.fetchCategories(),
    catalogStore.fetchProvinces(),
    catalogStore.fetchLeads()
  ])
})

// Apply filters
const applyFilters = async () => {
  catalogStore.setFilters({
    category_id: selectedCategory.value || undefined,
    province_id: selectedProvince.value || undefined
  })
  await catalogStore.fetchLeads()
}

// Reset filters
const resetFilters = async () => {
  selectedCategory.value = ''
  selectedProvince.value = ''
  catalogStore.resetFilters()
  await catalogStore.fetchLeads()
}

// Watch filters for auto-apply
watch([selectedCategory, selectedProvince], () => {
  applyFilters()
})

// Pagination
const onPageChange = async (event: any) => {
  catalogStore.setFilters({ page: event.page + 1 })
  await catalogStore.fetchLeads()
}

// Add to cart
const addToCart = async (leadId: number, mode: 'exclusive' | 'shared') => {
  const success = await cartStore.addToCart({
    lead_id: leadId,
    purchase_mode: mode
  })

  if (success) {
    showAddedToCart()
  } else {
    showError(cartStore.error || 'Errore nell\'aggiunta al carrello')
  }
}

// Check if lead is in cart
const isInCart = (leadId: number): boolean => {
  return cartStore.isLeadInCart(leadId)
}

// Get cart item mode
const getCartItemMode = (leadId: number): string | null => {
  const item = cartStore.getItemByLeadId(leadId)
  return item?.purchase_mode || null
}
</script>

<template>
  <div class="leads-catalog-page">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Catalogo Lead</h1>
        <p class="text-surface-600 dark:text-surface-400">
          {{ catalogStore.pagination.total }} lead disponibili
        </p>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink to="/carrello">
          <Button
            :label="`Carrello (${cartStore.itemCount})`"
            icon="pi pi-shopping-cart"
            :badge="cartStore.itemCount > 0 ? String(cartStore.itemCount) : undefined"
            :severity="cartStore.itemCount > 0 ? 'primary' : 'secondary'"
          />
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <Card class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Categoria
            </label>
            <Select
              v-model="selectedCategory"
              :options="[{ id: '', name: 'Tutte le categorie' }, ...catalogStore.categories]"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleziona categoria"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Provincia
            </label>
            <Select
              v-model="selectedProvince"
              :options="[{ id: '', name: 'Tutte le province' }, ...catalogStore.provinces]"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleziona provincia"
              class="w-full"
            />
          </div>
          <div class="md:col-span-2 flex items-end gap-2">
            <Button
              label="Filtra"
              icon="pi pi-search"
              @click="applyFilters"
            />
            <Button
              label="Reset"
              icon="pi pi-times"
              severity="secondary"
              @click="resetFilters"
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- Loading State -->
    <div v-if="catalogStore.loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>

    <!-- Leads Grid -->
    <div v-else-if="catalogStore.leads.length > 0">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <Card
          v-for="lead in catalogStore.leads"
          :key="lead.id"
          class="lead-card"
        >
          <template #header>
            <div class="p-4 pb-0">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-2">
                  <Tag :value="lead.category?.name" severity="info" />
                  <Tag :value="lead.province?.code" severity="secondary" />
                </div>
                <span class="text-xs text-surface-400">
                  {{ formatRelativeTime(lead.generated_at) }}
                </span>
              </div>
            </div>
          </template>

          <template #content>
            <div class="space-y-3">
              <!-- Lead Info -->
              <div>
                <h3 class="font-semibold text-surface-900 dark:text-surface-0 mb-1">
                  Lead #{{ lead.id }}
                </h3>
                <p class="text-sm text-surface-600 dark:text-surface-400 line-clamp-3">
                  {{ lead.request_preview }}
                </p>
              </div>

              <!-- Availability -->
              <div class="flex items-center gap-2 text-sm">
                <i class="pi pi-users text-surface-400"></i>
                <span class="text-surface-600 dark:text-surface-400">
                  {{ lead.shared_slots_available }} condivisioni disponibili
                </span>
              </div>

              <!-- Pricing -->
              <div class="grid grid-cols-2 gap-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                <div class="text-center p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
                  <p class="text-xs text-surface-500 mb-1">Esclusivo</p>
                  <p class="text-lg font-bold text-primary">
                    {{ formatCurrency(lead.base_price * 3) }}
                  </p>
                </div>
                <div class="text-center p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
                  <p class="text-xs text-surface-500 mb-1">Condiviso</p>
                  <p class="text-lg font-bold text-surface-700 dark:text-surface-300">
                    {{ formatCurrency(lead.base_price) }}
                  </p>
                </div>
              </div>

              <!-- Actions -->
              <div v-if="isInCart(lead.id)" class="pt-2">
                <div class="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <i class="pi pi-check-circle text-green-500"></i>
                  <span class="text-green-700 dark:text-green-400 font-medium">
                    Nel carrello ({{ getCartItemMode(lead.id) === 'exclusive' ? 'Esclusivo' : 'Condiviso' }})
                  </span>
                </div>
              </div>
              <div v-else class="grid grid-cols-2 gap-2 pt-2">
                <Button
                  label="Esclusivo"
                  icon="pi pi-star"
                  size="small"
                  @click="addToCart(lead.id, 'exclusive')"
                />
                <Button
                  label="Condiviso"
                  icon="pi pi-users"
                  size="small"
                  severity="secondary"
                  @click="addToCart(lead.id, 'shared')"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center">
        <Paginator
          :rows="catalogStore.pagination.per_page"
          :totalRecords="catalogStore.pagination.total"
          :first="(catalogStore.pagination.current_page - 1) * catalogStore.pagination.per_page"
          @page="onPageChange"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <i class="pi pi-inbox text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
      <h3 class="text-xl font-semibold text-surface-700 dark:text-surface-300 mb-2">
        Nessun lead trovato
      </h3>
      <p class="text-surface-500 dark:text-surface-400 mb-4">
        Prova a modificare i filtri di ricerca
      </p>
      <Button
        label="Reset filtri"
        icon="pi pi-refresh"
        @click="resetFilters"
      />
    </div>
  </div>
</template>

<style scoped>
.lead-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.lead-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
