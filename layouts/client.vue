<script setup lang="ts">
/**
 * Client Layout - Layout for authenticated client area
 * Sidebar + header + content
 */

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const clientProfileStore = useClientProfileStore()

// Sidebar state
const sidebarCollapsed = ref(false)
const sidebarOpen = ref(false) // Mobile

// User data
const user = computed(() => authStore.currentUser)
const profile = computed(() => clientProfileStore.profile)
const companyName = computed(() => profile.value?.company_name || user?.value?.profile?.company_name || '')
const fullName = computed(() => {
  if (profile.value) {
    return `${profile.value.first_name} ${profile.value.last_name}`
  }
  return authStore.fullName
})

// Cart count
const cartCount = computed(() => cartStore.itemCount)

// Notifications
const unreadNotifications = computed(() => clientProfileStore.unreadNotificationsCount)
const notifications = computed(() => clientProfileStore.notifications)

// Trial banner
const hasFreeTrial = computed(() => clientProfileStore.hasFreeTrial)
const freeTrialLeads = computed(() => clientProfileStore.freeTrialLeadsRemaining)

// Menu items
const menuItems = computed(() => [
  { label: t('navigation.clientMenu.dashboard'), icon: 'pi pi-home', to: '/dashboard' },
  { label: t('navigation.clientMenu.catalogLead'), icon: 'pi pi-search', to: '/leads' },
  { label: t('navigation.clientMenu.packages'), icon: 'pi pi-box', to: '/pacchetti' },
  { label: t('navigation.clientMenu.myLeads'), icon: 'pi pi-list', to: '/i-miei-lead' },
  { label: t('navigation.clientMenu.myOrders'), icon: 'pi pi-receipt', to: '/ordini' },
  { label: t('navigation.clientMenu.cart'), icon: 'pi pi-shopping-cart', to: '/carrello', badge: true },
  { label: t('navigation.clientMenu.profile'), icon: 'pi pi-user', to: '/profilo' }
])

// Check if route is active
const isActive = (path: string): boolean => {
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path.startsWith(path)
}

// Toggle sidebar
const toggleSidebar = () => {
  if (globalThis.window && globalThis.window.innerWidth < 1024) {
    sidebarOpen.value = !sidebarOpen.value
  } else {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
}

// Logout
const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// User menu ref
const userMenuRef = ref()
const userMenuItems = computed(() => [
  {
    label: t('navigation.clientMenu.myProfile'),
    icon: 'pi pi-user',
    command: () => router.push('/profilo')
  },
  {
    label: t('navigation.clientMenu.settings'),
    icon: 'pi pi-cog',
    command: () => router.push('/profilo/preferenze')
  },
  { separator: true },
  {
    label: t('navigation.clientMenu.logout'),
    icon: 'pi pi-sign-out',
    command: handleLogout
  }
])

const toggleUserMenu = (event: Event) => {
  userMenuRef.value.toggle(event)
}

// Notifications menu ref
const notificationsMenuRef = ref()
const toggleNotifications = (event: Event) => {
  notificationsMenuRef.value.toggle(event)
}

// Load initial data
onMounted(async () => {
  // The `auth` middleware already gated the route on token presence.
  // Here we only validate the session in the background. Failure is NOT
  // treated as a hard logout (transient errors must not bounce to /login):
  // checkSession() / fetchUser() take care of clearing the token only on
  // a real 401 from /auth/me.
  if (!authStore.isLoggedIn) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) {
      router.push('/login?redirect=' + route.fullPath)
      return
    }
    await authStore.checkSession()
    if (!localStorage.getItem('auth_token')) {
      router.push('/login?redirect=' + route.fullPath)
      return
    }
  }

  // Load cart and notifications
  await Promise.all([
    cartStore.fetchCart(),
    clientProfileStore.fetchNotifications(),
    clientProfileStore.fetchTrialStatus()
  ])
})

// Close mobile sidebar on route change
watch(() => route.path, () => {
  sidebarOpen.value = false
})
</script>

<template>
  <div class="client-layout">
    <!-- Toast -->
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
      class="client-sidebar"
      :class="{
        'collapsed': sidebarCollapsed,
        'open': sidebarOpen
      }"
    >
      <!-- Logo -->
      <div class="sidebar-logo">
        <NuxtLink to="/dashboard">
          <img v-if="sidebarCollapsed" src="/logo-mini.png" alt="Qualeadfied" class="sidebar-logo-mini" />
          <img v-else src="/logo.png" alt="Qualeadfied" class="sidebar-logo-img" />
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <ul class="sidebar-menu">
          <li v-for="item in menuItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="sidebar-menu-item"
              :class="{ 'active': isActive(item.to) }"
            >
              <span class="sidebar-menu-icon">
                <i :class="item.icon"></i>
              </span>
              <span class="sidebar-menu-text">{{ item.label }}</span>
              <span v-if="item.badge && cartCount > 0" class="sidebar-badge">{{ cartCount }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Trial Banner (in sidebar) -->
      <div v-if="hasFreeTrial && !sidebarCollapsed" class="sidebar-trial-banner">
        <i class="pi pi-gift"></i>
        <div>
          <span class="font-medium">{{ $t('layouts.trialBanner.title') }}</span>
          <span class="text-xs opacity-80 block">{{ $t('layouts.trialBanner.leadsAvailable', { count: freeTrialLeads }) }}</span>
        </div>
        <NuxtLink to="/prova-gratuita">
          <PrimeButton
            :label="$t('layouts.trialBanner.redeem')"
            size="small"
            class="trial-btn"
          />
        </NuxtLink>
      </div>

      <!-- Footer -->
      <!--
      <div class="sidebar-footer">
        <NuxtLink to="/" class="sidebar-menu-item">
          <span class="sidebar-menu-icon">
            <i class="pi pi-external-link"></i>
          </span>
          <span class="sidebar-menu-text">Torna al sito</span>
        </NuxtLink>
      </div>
      -->
    </aside>

    <!-- Main Content -->
    <main class="client-main" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Header -->
      <header class="client-header">
        <div class="client-header-left">
          <!-- Toggle Button -->
          <button
            class="client-header-toggle"
            @click="toggleSidebar"
            aria-label="Toggle sidebar"
          >
            <i class="pi pi-bars text-xl"></i>
          </button>
        </div>

        <div class="client-header-right">
          <LanguageSwitcher />

          <!-- Cart -->
          <NuxtLink to="/carrello" class="client-header-icon-btn">
            <i class="pi pi-shopping-cart text-lg"></i>
            <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
          </NuxtLink>

          <!-- Notifications -->
          <button class="client-header-icon-btn" @click="toggleNotifications">
            <i class="pi pi-bell text-lg"></i>
            <span v-if="unreadNotifications > 0" class="badge">{{ unreadNotifications }}</span>
          </button>
          <PrimeMenu ref="notificationsMenuRef" :popup="true" class="notifications-menu">
            <template #start>
              <div class="notifications-header">
                <span class="font-semibold">{{ $t('layouts.clientHeader.notifications') }}</span>
                <button
                  v-if="unreadNotifications > 0"
                  class="text-xs text-primary-600 hover:underline"
                  @click="clientProfileStore.markAllNotificationsRead()"
                >
                  {{ $t('layouts.clientHeader.markAllRead') }}
                </button>
              </div>
            </template>
            <template #item>
              <div v-if="notifications.length === 0" class="notification-empty">
                {{ $t('layouts.clientHeader.noNotifications') }}
              </div>
              <div
                v-for="notif in notifications.slice(0, 5)"
                :key="notif.id"
                class="notification-item"
                :class="{ 'unread': !notif.read }"
                @click="() => { clientProfileStore.markNotificationRead(notif.id); if (notif.link) router.push(notif.link) }"
              >
                <div class="notification-icon">
                  <i :class="{
                    'pi pi-bell': notif.type === 'new_leads',
                    'pi pi-clock': notif.type === 'package_expiring',
                    'pi pi-check-circle': notif.type === 'order_completed',
                    'pi pi-info-circle': notif.type === 'info'
                  }"></i>
                </div>
                <div class="notification-content">
                  <div class="notification-title">{{ notif.title }}</div>
                  <div class="notification-message">{{ notif.message }}</div>
                </div>
              </div>
            </template>
          </PrimeMenu>

          <!-- User Menu -->
          <button class="client-header-user" @click="toggleUserMenu">
            <div class="avatar">{{ fullName.charAt(0) }}</div>
            <div class="user-info hidden lg:block">
              <div class="name">{{ fullName }}</div>
              <div class="company">{{ companyName }}</div>
            </div>
            <i class="pi pi-chevron-down text-neutral-400 hidden lg:block"></i>
          </button>
          <PrimeMenu ref="userMenuRef" :model="userMenuItems" :popup="true" />
        </div>
      </header>

      <!-- Trial Banner (top of content, for mobile) -->
      <div v-if="hasFreeTrial" class="trial-banner-top lg:hidden">
        <i class="pi pi-gift"></i>
        <span v-html="$t('layouts.trialBanner.freeLeadsAvailableExclamation', { count: freeTrialLeads })"></span>
        <NuxtLink to="/prova-gratuita">
          <PrimeButton :label="$t('layouts.trialBanner.redeem')" size="small" />
        </NuxtLink>
      </div>

      <!-- Page Content -->
      <div class="client-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.client-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

/* Sidebar */
.client-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  z-index: 50;
  transition: all 0.3s ease;
}

.client-sidebar.collapsed {
  width: 72px;
}

.client-sidebar.collapsed .sidebar-menu-text,
.client-sidebar.collapsed .sidebar-trial-banner {
  display: none;
}

@media (max-width: 1023px) {
  .client-sidebar {
    transform: translateX(-100%);
  }

  .client-sidebar.open {
    transform: translateX(0);
  }
}

/* Logo */
.sidebar-logo {
  padding: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
}

.sidebar-logo a {
  text-decoration: none;
  display: block;
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

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  overflow-y: auto;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s;
  margin-bottom: 0.25rem;
}

.sidebar-menu-item:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.sidebar-menu-item.active {
  background: #eff6ff;
  color: #2563eb;
}

.sidebar-menu-icon {
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.sidebar-menu-text {
  font-size: 0.9375rem;
  font-weight: 500;
}

.sidebar-badge {
  margin-left: auto;
  min-width: 20px;
  height: 20px;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
}

.client-sidebar.collapsed .sidebar-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  font-size: 0.65rem;
  padding: 0 4px;
}

.client-sidebar.collapsed .sidebar-menu-item {
  position: relative;
}

/* Trial Banner in Sidebar */
.sidebar-trial-banner {
  margin: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.sidebar-trial-banner i {
  font-size: 1.5rem;
  color: #16a34a;
}

.trial-btn {
  background: #16a34a !important;
  border-color: #16a34a !important;
}

/* Footer */
.sidebar-footer {
  padding: 0.75rem;
  border-top: 1px solid #e2e8f0;
}

/* Main Content */
.client-main {
  flex: 1;
  margin-left: 260px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.client-main.sidebar-collapsed {
  margin-left: 72px;
}

@media (max-width: 1023px) {
  .client-main {
    margin-left: 0;
  }
}

/* Header */
.client-header {
  position: sticky;
  top: 0;
  height: 64px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 40;
}

.client-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.client-header-toggle {
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.client-header-toggle:hover {
  background: #f1f5f9;
}

.client-header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.client-header-icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #64748b;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
}

.client-header-icon-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.client-header-icon-btn .badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.client-header-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.client-header-user:hover {
  background: #f1f5f9;
}

.avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-info .name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  text-align: left;
}

.user-info .company {
  font-size: 0.75rem;
  color: #64748b;
  text-align: left;
}

/* Trial Banner Top */
.trial-banner-top {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #166534;
  font-size: 0.875rem;
}

/* Content */
.client-content {
  flex: 1;
  padding: 1.5rem;
}

/* Notifications Menu */
.notifications-menu {
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.notification-empty {
  padding: 2rem;
  text-align: center;
  color: #94a3b8;
}

.notification-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item.unread {
  background: #eff6ff;
}

.notification-icon {
  width: 32px;
  height: 32px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon i {
  font-size: 0.875rem;
  color: #64748b;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.notification-message {
  font-size: 0.75rem;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
