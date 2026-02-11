<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const flags: Record<string, string> = {
  it: '🇮🇹',
  en: '🇬🇧'
}

const currentFlag = computed(() => flags[locale.value] || '🌐')

const otherLocale = computed(() => {
  return (locales.value as Array<{ code: string; name: string }>).find(l => l.code !== locale.value)
})

const switchLanguage = () => {
  if (otherLocale.value) {
    setLocale(otherLocale.value.code)
  }
}
</script>

<template>
  <button
    class="language-switcher"
    :title="otherLocale?.name"
    @click="switchLanguage"
  >
    <span class="language-switcher-flag">{{ currentFlag }}</span>
    <span class="language-switcher-code">{{ locale.toUpperCase() }}</span>
  </button>
</template>

<style scoped lang="scss">
.language-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: inherit;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
  }

  &-flag {
    font-size: 1.125rem;
    line-height: 1;
  }

  &-code {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
  }
}
</style>
