<template>
  <div class="embed-layout min-h-screen bg-white">
    <slot />
    <PrimeToast position="top-center" />
  </div>
</template>

<style>
.embed-layout {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
</style>
