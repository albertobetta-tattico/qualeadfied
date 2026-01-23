<script setup lang="ts">
/**
 * Homepage - Landing page pubblica
 * Presentazione servizio e CTA per conversione
 */

definePageMeta({
  layout: 'public'
})

// Store
const catalogStore = usePublicCatalogStore()
const homepageContent = computed(() => catalogStore.homepageContent)
const loading = computed(() => catalogStore.loading)

// Load homepage content
onMounted(async () => {
  await catalogStore.fetchHomepageContent()
})

// Format number with thousands separator
const formatNumber = (num: number): string => {
  return num.toLocaleString('it-IT')
}
</script>

<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">
            {{ homepageContent?.hero.headline || 'Lead qualificati per far crescere il tuo business' }}
          </h1>
          <p class="hero-subtitle">
            {{ homepageContent?.hero.subtitle || 'Accedi a richieste verificate di clienti pronti ad acquistare. Solo lead di qualità, nessuno spreco.' }}
          </p>
          <div class="hero-cta">
            <NuxtLink to="/registrati">
              <PrimeButton
                :label="homepageContent?.hero.cta_text || 'Inizia Gratis'"
                icon="pi pi-arrow-right"
                iconPos="right"
                size="large"
                class="hero-btn-primary"
              />
            </NuxtLink>
            <NuxtLink to="/catalogo">
              <PrimeButton
                label="Esplora il Catalogo"
                severity="secondary"
                outlined
                size="large"
              />
            </NuxtLink>
          </div>
          <p class="hero-note">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            Prova gratuita: 3 lead inclusi senza impegno
          </p>
        </div>
        <div class="hero-image">
          <div class="hero-illustration">
            <div class="hero-card hero-card-1">
              <i class="pi pi-user text-2xl text-primary-500"></i>
              <div>
                <div class="text-sm font-semibold text-neutral-900">Nuovo Lead</div>
                <div class="text-xs text-neutral-500">Ristrutturazione - Milano</div>
              </div>
            </div>
            <div class="hero-card hero-card-2">
              <i class="pi pi-check-circle text-2xl text-green-500"></i>
              <div>
                <div class="text-sm font-semibold text-neutral-900">Verificato</div>
                <div class="text-xs text-neutral-500">Contatto confermato</div>
              </div>
            </div>
            <div class="hero-card hero-card-3">
              <i class="pi pi-euro text-2xl text-amber-500"></i>
              <div>
                <div class="text-sm font-semibold text-neutral-900">Esclusivo</div>
                <div class="text-xs text-neutral-500">Solo per te</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Value Proposition Section -->
    <section class="value-section">
      <div class="section-container">
        <h2 class="section-title">Perché scegliere Qualeadfied</h2>
        <p class="section-subtitle">
          La piattaforma B2B pensata per professionisti che vogliono risultati concreti
        </p>
        <div class="value-grid">
          <div
            v-for="(item, index) in homepageContent?.value_propositions"
            :key="index"
            class="value-card"
          >
            <div class="value-icon">
              <i :class="item.icon"></i>
            </div>
            <h3 class="value-title">{{ item.title }}</h3>
            <p class="value-description">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-section">
      <div class="section-container">
        <h2 class="section-title">Come Funziona</h2>
        <p class="section-subtitle">
          Tre semplici passaggi per iniziare a ricevere lead qualificati
        </p>
        <div class="how-grid">
          <div
            v-for="(step, index) in homepageContent?.how_it_works"
            :key="index"
            class="how-step"
          >
            <div class="how-step-number">{{ step.step }}</div>
            <h3 class="how-step-title">{{ step.title }}</h3>
            <p class="how-step-description">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Preview Section -->
    <section class="categories-section">
      <div class="section-container">
        <h2 class="section-title">Categorie Disponibili</h2>
        <p class="section-subtitle">
          Lead qualificati per i settori più richiesti
        </p>
        <div class="categories-grid">
          <NuxtLink
            v-for="category in homepageContent?.featured_categories"
            :key="category.id"
            :to="`/catalogo?category=${category.id}`"
            class="category-card"
          >
            <div class="category-icon">
              <i class="pi pi-tag"></i>
            </div>
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-description">{{ category.description }}</p>
            <span class="category-link">
              Esplora <i class="pi pi-arrow-right text-sm"></i>
            </span>
          </NuxtLink>
        </div>
        <div class="text-center mt-8">
          <NuxtLink to="/catalogo">
            <PrimeButton
              label="Vedi Tutte le Categorie"
              severity="secondary"
              outlined
            />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="section-container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ formatNumber(homepageContent?.stats.total_leads_available || 0) }}+</div>
            <div class="stat-label">Lead Disponibili</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ homepageContent?.stats.categories_count || 0 }}</div>
            <div class="stat-label">Categorie</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ homepageContent?.stats.provinces_covered || 0 }}</div>
            <div class="stat-label">Province Coperte</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ formatNumber(homepageContent?.stats.satisfied_clients || 0) }}+</div>
            <div class="stat-label">Clienti Soddisfatti</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="section-container">
        <div class="cta-content">
          <h2 class="cta-title">Pronto a far crescere il tuo business?</h2>
          <p class="cta-subtitle">
            Registrati ora e ricevi 3 lead gratuiti per provare la qualità del nostro servizio.
            Nessun impegno, nessuna carta di credito richiesta.
          </p>
          <div class="cta-buttons">
            <NuxtLink to="/registrati">
              <PrimeButton
                label="Registrati Gratis"
                icon="pi pi-user-plus"
                size="large"
                class="cta-btn"
              />
            </NuxtLink>
            <NuxtLink to="/catalogo">
              <PrimeButton
                label="Esplora il Catalogo"
                severity="secondary"
                size="large"
                class="cta-btn-secondary"
              />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 5rem 1.5rem;
}

.hero-container {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

@media (max-width: 968px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 968px) {
  .hero-cta {
    justify-content: center;
    flex-wrap: wrap;
  }
}

.hero-btn-primary {
  background: linear-gradient(135deg, #EC4899, #DB2777) !important;
  border: none !important;
}

.hero-note {
  display: flex;
  align-items: center;
  color: #64748b;
  font-size: 0.875rem;
}

@media (max-width: 968px) {
  .hero-note {
    justify-content: center;
  }
}

.hero-image {
  display: flex;
  justify-content: center;
}

@media (max-width: 968px) {
  .hero-image {
    display: none;
  }
}

.hero-illustration {
  position: relative;
  width: 400px;
  height: 350px;
}

.hero-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.hero-card-1 {
  top: 0;
  left: 0;
  animation: float 6s ease-in-out infinite;
}

.hero-card-2 {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  animation: float 6s ease-in-out infinite 1s;
}

.hero-card-3 {
  bottom: 0;
  left: 20%;
  animation: float 6s ease-in-out infinite 2s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.hero-card-2 {
  animation: float2 6s ease-in-out infinite 1s;
}

@keyframes float2 {
  0%, 100% {
    transform: translateY(-50%);
  }
  50% {
    transform: translateY(calc(-50% - 10px));
  }
}

/* Section Common Styles */
.section-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
  margin-bottom: 0.75rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #64748b;
  text-align: center;
  margin-bottom: 3rem;
}

/* Value Proposition Section */
.value-section {
  padding: 5rem 1.5rem;
  background: white;
}

.value-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

@media (max-width: 968px) {
  .value-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .value-grid {
    grid-template-columns: 1fr;
  }
}

.value-card {
  text-align: center;
  padding: 2rem;
  border-radius: 16px;
  transition: all 0.3s;
}

.value-card:hover {
  background: #f8fafc;
  transform: translateY(-4px);
}

.value-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(236, 72, 153, 0.05));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.value-icon i {
  font-size: 1.75rem;
  color: #EC4899;
}

.value-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.75rem;
}

.value-description {
  color: #64748b;
  font-size: 0.9375rem;
  line-height: 1.6;
}

/* How It Works Section */
.how-section {
  padding: 5rem 1.5rem;
  background: #f8fafc;
}

.how-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
}

@media (max-width: 768px) {
  .how-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.how-step {
  text-align: center;
  position: relative;
}

.how-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 40px;
  right: -1.5rem;
  width: 3rem;
  height: 2px;
  background: #cbd5e1;
}

@media (max-width: 768px) {
  .how-step:not(:last-child)::after {
    display: none;
  }
}

.how-step-number {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: #2D2D2D;
  color: white;
  font-size: 2rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.how-step-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.75rem;
}

.how-step-description {
  color: #64748b;
  line-height: 1.6;
}

/* Categories Section */
.categories-section {
  padding: 5rem 1.5rem;
  background: white;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

@media (max-width: 968px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
}

.category-card {
  display: block;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.category-card:hover {
  background: white;
  border-color: #e2e8f0;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
}

.category-icon {
  width: 48px;
  height: 48px;
  background: #2D2D2D;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.category-icon i {
  color: white;
  font-size: 1.25rem;
}

.category-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.category-description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.category-link {
  color: #EC4899;
  font-weight: 500;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

/* Stats Section */
.stats-section {
  padding: 4rem 1.5rem;
  background: #2D2D2D;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  text-align: center;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #93c5fd;
  font-size: 1rem;
  font-weight: 500;
}

/* CTA Section */
.cta-section {
  padding: 5rem 1.5rem;
  background: #2D2D2D;
}

.cta-content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1.125rem;
  color: #94a3b8;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-btn {
  background: linear-gradient(135deg, #EC4899, #DB2777) !important;
  border: none !important;
}

.cta-btn-secondary {
  color: white !important;
  border-color: #475569 !important;
}

.cta-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}
</style>
