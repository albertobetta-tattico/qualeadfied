<script setup lang="ts">
/**
 * Page - Free Trial
 * Onboarding page for new users to claim free trial leads
 */
definePageMeta({
  layout: 'client'
})

const profileStore = useClientProfileStore()
const catalogStore = usePublicCatalogStore()
const { formatCurrency, formatRelativeTime } = useClientFormatters()
const { showSuccess, showError } = useClientToast()
const { confirmClaimTrial } = useClientConfirm()

// Selected leads for trial
const selectedLeads = ref<number[]>([])

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    profileStore.fetchTrialStatus(),
    catalogStore.fetchCategories(),
    catalogStore.fetchProvinces(),
    catalogStore.fetchLeads()
  ])
})

// Filter state
const selectedCategory = ref<number | ''>('')

// Filtered leads
const filteredLeads = computed(() => {
  if (!selectedCategory.value) {
    return catalogStore.leads
  }
  return catalogStore.leads.filter(l => l.category_id === selectedCategory.value)
})

// Can select more leads
const canSelectMore = computed(() => {
  return selectedLeads.value.length < (profileStore.trialStatus?.leads_remaining || 0)
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

// Claim trial leads
const claimTrialLeads = () => {
  if (selectedLeads.value.length === 0) {
    showError('Seleziona almeno un lead')
    return
  }

  confirmClaimTrial(selectedLeads.value.length, async () => {
    const success = await profileStore.claimTrialLeads({
      lead_ids: selectedLeads.value
    })

    if (success) {
      showSuccess(`${selectedLeads.value.length} lead riscattati con successo!`)
      selectedLeads.value = []
      // Redirect to my leads
      navigateTo('/i-miei-lead')
    } else {
      showError(profileStore.error || 'Errore nel riscatto')
    }
  })
}
</script>

<template>
  <div class="trial-page">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
        <i class="pi pi-gift text-primary text-4xl"></i>
      </div>
      <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-2">
        Prova Gratuita
      </h1>
      <p class="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
        Benvenuto su Qualeadfied! Abbiamo riservato per te alcuni lead gratuiti per farti scoprire la qualità del nostro servizio.
      </p>
    </div>

    <!-- Trial Status -->
    <PrimeCard v-if="profileStore.trialStatus" class="mb-6 max-w-2xl mx-auto">
      <template #content>
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="text-center md:text-left">
            <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-1">
              Il tuo credito gratuito
            </h3>
            <p class="text-surface-600 dark:text-surface-400">
              Hai diritto a <strong>{{ profileStore.trialStatus.leads_total }}</strong> lead gratuiti
            </p>
          </div>
          <div class="flex items-center gap-6">
            <div class="text-center">
              <p class="text-3xl font-bold text-primary">
                {{ profileStore.trialStatus.leads_remaining }}
              </p>
              <p class="text-sm text-surface-500">Disponibili</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-bold text-green-500">
                {{ profileStore.trialStatus.leads_claimed }}
              </p>
              <p class="text-sm text-surface-500">Riscattati</p>
            </div>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="mt-4">
          <ProgressBar
            :value="(profileStore.trialStatus.leads_claimed / profileStore.trialStatus.leads_total) * 100"
            :showValue="false"
            class="h-2"
          />
        </div>
      </template>
    </PrimeCard>

    <!-- No Trial Available -->
    <div
      v-if="!profileStore.trialStatus?.enabled || profileStore.trialStatus?.leads_remaining === 0"
      class="text-center py-12"
    >
      <i class="pi pi-check-circle text-6xl text-green-500 mb-4"></i>
      <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-2">
        Prova gratuita completata
      </h2>
      <p class="text-surface-600 dark:text-surface-400 mb-6">
        Hai già utilizzato tutti i tuoi lead gratuiti. Ora puoi acquistare lead dal catalogo.
      </p>
      <div class="flex justify-center gap-3">
        <NuxtLink to="/leads">
          <PrimeButton label="Vai al Catalogo" icon="pi pi-search" />
        </NuxtLink>
        <NuxtLink to="/pacchetti">
          <PrimeButton label="Acquista Pacchetto" icon="pi pi-box" severity="secondary" />
        </NuxtLink>
      </div>
    </div>

    <!-- Lead Selection -->
    <div v-else>
      <!-- Instructions -->
      <PrimeCard class="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <template #content>
          <div class="flex items-start gap-4">
            <i class="pi pi-info-circle text-blue-500 text-xl mt-1"></i>
            <div>
              <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-1">Come funziona</h4>
              <ol class="list-decimal list-inside text-blue-700 dark:text-blue-300 space-y-1">
                <li>Sfoglia i lead disponibili nel catalogo qui sotto</li>
                <li>Seleziona fino a {{ profileStore.trialStatus?.leads_remaining }} lead che ti interessano</li>
                <li>Clicca su "Riscatta Lead" per aggiungerli al tuo portafoglio</li>
                <li>I lead gratuiti vengono assegnati in modalità <strong>condivisa</strong></li>
              </ol>
            </div>
          </div>
        </template>
      </PrimeCard>

      <!-- Selection Status -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 class="text-xl font-semibold text-surface-900 dark:text-surface-0">
            Seleziona i tuoi lead gratuiti
          </h2>
          <p class="text-surface-600 dark:text-surface-400">
            {{ selectedLeads.length }} di {{ profileStore.trialStatus?.leads_remaining }} selezionati
          </p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Category Filter -->
          <PrimeSelect
            v-model="selectedCategory"
            :options="[{ id: '', name: 'Tutte le categorie' }, ...catalogStore.categories]"
            optionLabel="name"
            optionValue="id"
            placeholder="Filtra per categoria"
            class="w-48"
          />
          <PrimeButton
            label="Riscatta Lead"
            icon="pi pi-gift"
            :disabled="selectedLeads.length === 0"
            :badge="selectedLeads.length > 0 ? String(selectedLeads.length) : undefined"
            @click="claimTrialLeads"
          />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="catalogStore.loading" class="flex justify-center py-12">
        <PrimeProgressSpinner />
      </div>

      <!-- Leads Grid -->
      <div v-else-if="filteredLeads.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PrimeCard
          v-for="lead in filteredLeads"
          :key="lead.id"
          class="trial-lead-card cursor-pointer transition-all"
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
                  <PrimeTag :value="lead.category?.name" severity="info" size="small" />
                  <PrimeTag :value="lead.province?.code" severity="secondary" size="small" />
                </div>

                <!-- Lead Info -->
                <h4 class="font-medium text-surface-900 dark:text-surface-0 mb-1">
                  Lead #{{ lead.id }}
                </h4>
                <p class="text-sm text-surface-600 dark:text-surface-400 line-clamp-2 mb-2">
                  {{ lead.request_preview }}
                </p>

                <!-- Meta -->
                <div class="flex items-center justify-between text-xs text-surface-400">
                  <span>{{ formatRelativeTime(lead.generated_at) }}</span>
                  <span class="text-green-500 font-medium">Gratuito</span>
                </div>
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <i class="pi pi-inbox text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
        <h3 class="text-xl font-semibold text-surface-700 dark:text-surface-300 mb-2">
          Nessun lead disponibile
        </h3>
        <p class="text-surface-500 dark:text-surface-400">
          Al momento non ci sono lead disponibili per la prova gratuita
        </p>
      </div>

      <!-- Selected Leads Summary -->
      <div
        v-if="selectedLeads.length > 0"
        class="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700 shadow-lg md:left-64"
      >
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p class="font-semibold text-surface-900 dark:text-surface-0">
              {{ selectedLeads.length }} lead selezionati
            </p>
            <p class="text-sm text-surface-500">
              Clicca su "Riscatta Lead" per aggiungerli al tuo portafoglio
            </p>
          </div>
          <div class="flex items-center gap-3">
            <PrimeButton
              label="Annulla"
              severity="secondary"
              @click="selectedLeads = []"
            />
            <PrimeButton
              label="Riscatta Lead"
              icon="pi pi-gift"
              @click="claimTrialLeads"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trial-lead-card:hover:not(.opacity-50) {
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
