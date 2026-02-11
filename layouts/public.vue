<script setup lang="ts">
/**
 * Public Layout - Layout for public pages (non-authenticated)
 * Homepage, Catalog, Login, Register, etc.
 */

const { t } = useI18n()
const authStore = useAuthStore()
const route = useRoute()

// Check if user is logged in
const isLoggedIn = computed(() => authStore.isLoggedIn)

// Mobile menu state
const mobileMenuOpen = ref(false)

// Navigation items
const navItems = computed(() => [
  { label: t('navigation.publicMenu.catalogLead'), to: '/catalogo', icon: 'pi pi-search' }
])

// Close mobile menu on route change
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

<template>
  <div class="public-layout">
    <!-- Toast Notifications -->
    <PrimeToast position="top-right" />

    <!-- Confirm Dialog -->
    <PrimeConfirmDialog />

    <!-- Header / Navbar -->
    <header class="public-header">
      <div class="public-header-container">
        <!-- Logo -->
        <NuxtLink to="/landing" class="public-logo">
          <img src="/logo.png" alt="Qualeadfied" class="public-logo-img" />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="public-nav hidden md:flex">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="public-nav-link"
            :class="{ 'active': route.path === item.to }"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Desktop Auth Buttons -->
        <div class="public-auth-buttons hidden md:flex">
          <LanguageSwitcher />
          <template v-if="isLoggedIn">
            <NuxtLink to="/dashboard">
              <PrimeButton
                :label="$t('navigation.publicMenu.reservedArea')"
                icon="pi pi-user"
                severity="primary"
              />
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/">
              <PrimeButton
                :label="$t('navigation.publicMenu.login')"
                severity="secondary"
                text
              />
            </NuxtLink>
            <NuxtLink to="/registrati">
              <PrimeButton
                :label="$t('navigation.publicMenu.register')"
                severity="primary"
              />
            </NuxtLink>
          </template>
        </div>

        <!-- Mobile Menu Toggle -->
        <button
          class="public-menu-toggle md:hidden"
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Toggle menu"
        >
          <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-xl"></i>
        </button>
      </div>

      <!-- Mobile Menu -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="public-mobile-menu md:hidden">
          <nav class="public-mobile-nav">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="public-mobile-nav-link"
            >
              <i :class="item.icon"></i>
              {{ item.label }}
            </NuxtLink>
          </nav>
          <div class="public-mobile-auth">
            <template v-if="isLoggedIn">
              <NuxtLink to="/dashboard" class="w-full">
                <PrimeButton
                  :label="$t('navigation.publicMenu.reservedArea')"
                  icon="pi pi-user"
                  severity="primary"
                  class="w-full"
                />
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/" class="w-full">
                <PrimeButton
                  :label="$t('navigation.publicMenu.login')"
                  severity="secondary"
                  outlined
                  class="w-full"
                />
              </NuxtLink>
              <NuxtLink to="/registrati" class="w-full">
                <PrimeButton
                  :label="$t('navigation.publicMenu.registerFree')"
                  severity="primary"
                  class="w-full"
                />
              </NuxtLink>
            </template>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Main Content -->
    <main class="public-main">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="public-footer">
      <div class="public-footer-container">
        <div class="public-footer-grid">
          <!-- Brand Column -->
          <div class="public-footer-brand">
            <div class="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Qualeadfied" class="footer-logo-img" />
            </div>
            <p class="text-neutral-400 text-sm">
              {{ $t('layouts.footer.description') }}
            </p>
          </div>

          <!-- Links Column -->
          <div class="public-footer-links">
            <h4 class="footer-heading">{{ $t('layouts.footer.usefulLinks') }}</h4>
            <ul>
              <li><NuxtLink to="/catalogo">{{ $t('layouts.footer.catalogLead') }}</NuxtLink></li>
              <li><NuxtLink to="/come-funziona">{{ $t('layouts.footer.howItWorks') }}</NuxtLink></li>
              <li><NuxtLink to="/prezzi">{{ $t('layouts.footer.pricing') }}</NuxtLink></li>
              <li><NuxtLink to="/faq">{{ $t('layouts.footer.faq') }}</NuxtLink></li>
            </ul>
          </div>

          <!-- Legal Column -->
          <div class="public-footer-links">
            <h4 class="footer-heading">{{ $t('layouts.footer.legal') }}</h4>
            <ul>
              <li><NuxtLink to="/privacy">{{ $t('layouts.footer.privacyPolicy') }}</NuxtLink></li>
              <li><NuxtLink to="/termini">{{ $t('layouts.footer.termsAndConditions') }}</NuxtLink></li>
              <li><NuxtLink to="/cookie">{{ $t('layouts.footer.cookiePolicy') }}</NuxtLink></li>
            </ul>
          </div>

          <!-- Contact Column -->
          <div class="public-footer-contact">
            <h4 class="footer-heading">{{ $t('layouts.footer.contacts') }}</h4>
            <ul>
              <li>
                <i class="pi pi-envelope mr-2"></i>
                <a href="mailto:info@qualeadfied.com">info@qualeadfied.com</a>
              </li>
              <li>
                <i class="pi pi-phone mr-2"></i>
                <a href="tel:+390212345678">+39 02 1234567</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Copyright -->
        <div class="public-footer-bottom">
          <p>{{ $t('layouts.footer.allRightsReserved', { year: new Date().getFullYear() }) }}</p>
          <p class="text-neutral-500 text-sm">{{ $t('layouts.footer.vatNumber') }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.public-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.public-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.public-header-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.public-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.public-logo-img {
  height: 40px;
  width: auto;
}

.footer-logo-img {
  height: 36px;
  width: auto;
}

/* Navigation */
.public-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.public-nav-link {
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.public-nav-link:hover,
.public-nav-link.active {
  color: #0F3460;
}

/* Auth buttons */
.public-auth-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Mobile menu toggle */
.public-menu-toggle {
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #374151;
}

/* Mobile menu */
.public-mobile-menu {
  padding: 1rem 1.5rem 1.5rem;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.public-mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.public-mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.public-mobile-nav-link:hover {
  background-color: #f3f4f6;
}

.public-mobile-auth {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Main content */
.public-main {
  flex: 1;
}

/* Footer */
.public-footer {
  background: #0f172a;
  color: #94a3b8;
  padding: 4rem 0 2rem;
  margin-top: auto;
}

.public-footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.public-footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

@media (max-width: 768px) {
  .public-footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.footer-heading {
  color: white;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.public-footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.public-footer-links li {
  margin-bottom: 0.5rem;
}

.public-footer-links a,
.public-footer-contact a {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s;
}

.public-footer-links a:hover,
.public-footer-contact a:hover {
  color: white;
}

.public-footer-contact ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.public-footer-contact li {
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
}

.public-footer-bottom {
  border-top: 1px solid #1e293b;
  padding-top: 2rem;
  text-align: center;
}

/* Slide down animation */
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
