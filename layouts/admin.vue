<script setup lang="ts">
/**
 * Admin Layout - Main layout for the backoffice application
 * Uses the Qualeadfied Design System
 */

const { t } = useI18n()
const sidebarCollapsed = ref(false)
const sidebarOpen = ref(false) // For mobile

const toggleSidebar = () => {
  if (window.innerWidth < 1024) {
    sidebarOpen.value = !sidebarOpen.value
  } else {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
}

// Menu items configuration
const menuItems = computed(() => [
  {
    section: t('navigation.adminMenu.sections.main'),
    items: [
      { label: t('navigation.adminMenu.items.dashboard'), icon: 'pi pi-chart-bar', to: '/admin', badge: null },
    ]
  },
  {
    section: t('navigation.adminMenu.sections.management'),
    items: [
      { label: t('navigation.adminMenu.items.clients'), icon: 'pi pi-users', to: '/admin/clients', badge: null },
      { label: t('navigation.adminMenu.items.leads'), icon: 'pi pi-list', to: '/admin/leads', badge: '12' },
      { label: t('navigation.adminMenu.items.catalog'), icon: 'pi pi-tag', to: '/admin/catalog', badge: null },
      { label: t('navigation.adminMenu.items.pricing'), icon: 'pi pi-euro', to: '/admin/pricing', badge: null },
    ]
  },
  {
    section: t('navigation.adminMenu.sections.sales'),
    items: [
      { label: t('navigation.adminMenu.items.orders'), icon: 'pi pi-shopping-cart', to: '/admin/orders', badge: null },
      { label: t('navigation.adminMenu.items.transactions'), icon: 'pi pi-credit-card', to: '/admin/transactions', badge: null },
      { label: t('navigation.adminMenu.items.invoices'), icon: 'pi pi-file', to: '/admin/invoices', badge: null },
    ]
  },
  {
    section: t('navigation.adminMenu.sections.analytics'),
    items: [
      { label: t('navigation.adminMenu.items.reports'), icon: 'pi pi-chart-line', to: '/admin/reports', badge: null },
    ]
  },
  {
    section: t('navigation.adminMenu.sections.system'),
    items: [
      { label: t('navigation.adminMenu.items.settings'), icon: 'pi pi-cog', to: '/admin/settings', badge: null },
    ]
  }
])

// Current route for active state
const route = useRoute()
const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}

// Get current page title for breadcrumb
const currentPageTitle = computed(() => {
  const path = route.path
  for (const section of menuItems.value) {
    for (const item of section.items) {
      if (path.startsWith(item.to) && item.to !== '/admin') {
        return item.label
      }
    }
  }
  return t('navigation.adminMenu.items.dashboard')
})
</script>

<template>
  <div class="admin-layout">
    <!-- Toast Notifications -->
    <PrimeToast position="top-right" />

    <!-- Confirm Dialog -->
    <PrimeConfirmDialog />

    <!-- Sidebar Overlay (Mobile) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      class="admin-sidebar"
      :class="{
        'collapsed': sidebarCollapsed,
        'open': sidebarOpen
      }"
    >
      <!-- Logo -->
      <div class="sidebar-logo">
        <NuxtLink to="/admin">
          <img v-if="sidebarCollapsed" src="/logo-mini.png" alt="Qualeadfied" class="sidebar-logo-mini" />
          <img v-else src="/logo.png" alt="Qualeadfied" class="sidebar-logo-img" />
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <template v-for="section in menuItems" :key="section.section">
          <div class="sidebar-section-title">{{ section.section }}</div>
          <ul class="sidebar-menu">
            <li v-for="item in section.items" :key="item.label">
              <NuxtLink
                :to="item.to"
                class="sidebar-menu-item"
                :class="{ 'active': isActive(item.to) }"
              >
                <span class="sidebar-menu-icon">
                  <i :class="item.icon"></i>
                </span>
                <span class="sidebar-menu-text">{{ item.label }}</span>
                <span v-if="item.badge" class="sidebar-menu-badge">
                  {{ item.badge }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </template>
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <div class="sidebar-menu-item" style="cursor: pointer;">
          <span class="sidebar-menu-icon">
            <i class="pi pi-question-circle"></i>
          </span>
          <span class="sidebar-menu-text">{{ $t('navigation.adminMenu.items.support') }}</span>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="admin-main" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Header -->
      <header class="admin-header">
        <div class="admin-header-left">
          <!-- Toggle Button -->
          <button
            class="admin-header-toggle"
            @click="toggleSidebar"
            aria-label="Toggle sidebar"
          >
            <i class="pi pi-bars text-xl"></i>
          </button>

          <!-- Breadcrumb -->
          <nav class="admin-header-breadcrumb">
            <NuxtLink to="/admin">{{ $t('navigation.breadcrumb.home') }}</NuxtLink>
            <span class="separator">/</span>
            <span class="current">{{ currentPageTitle }}</span>
          </nav>
        </div>

        <div class="admin-header-right">
          <!-- Search -->
          <div class="admin-header-search">
            <i class="pi pi-search search-icon"></i>
            <input
              type="text"
              :placeholder="$t('layouts.adminHeader.search')"
              class="focus:w-80 transition-all"
            />
          </div>

          <LanguageSwitcher />

          <!-- Notifications -->
          <button class="admin-header-icon-btn">
            <i class="pi pi-bell text-lg"></i>
            <span class="badge">3</span>
          </button>

          <!-- User Menu -->
          <div class="admin-header-user">
            <div class="avatar">AM</div>
            <div class="user-info">
              <div class="name">Admin User</div>
              <div class="role">{{ $t('layouts.adminHeader.administrator') }}</div>
            </div>
            <i class="pi pi-chevron-down text-neutral-400 hidden lg:block"></i>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="admin-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Responsive sidebar for mobile */
@media (max-width: 1023px) {
  .admin-sidebar {
    transform: translateX(-100%);
    z-index: 50;
  }

  .admin-sidebar.open {
    transform: translateX(0);
  }
}

/* Logo link styles */
.sidebar-logo a {
  display: block;
  text-decoration: none;
}

.sidebar-logo a:hover {
  opacity: 0.9;
}

.sidebar-logo-img {
  height: 36px;
  width: auto;
}

.sidebar-logo-mini {
  height: 32px;
  width: auto;
  min-width: 38px;
  position: relative;
  left: -4px;
}
</style>
