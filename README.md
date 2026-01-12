# Qualeadfied - Design System & Styling

## 📋 Panoramica

Questo pacchetto contiene tutti i file di stile per l'applicazione Qualeadfied Admin, integrati con:
- **PrimeVue 4** (tema personalizzato basato su Aura)
- **Tailwind CSS** (configurazione estesa con design tokens)
- **SCSS** (variabili e mixin riutilizzabili)

## 📁 Struttura File

```
qualeadfied-styles/
├── assets/
│   └── styles/
│       ├── _variables.scss      # Variabili SCSS e CSS custom properties
│       ├── main.scss            # Stili globali dell'applicazione
│       ├── primevue-theme.ts    # Tema PrimeVue personalizzato
│       └── tailwind.css         # Entry point Tailwind + componenti custom
├── components/
│   └── admin/                   # Componenti riutilizzabili
├── layouts/
│   └── admin.vue                # Layout principale backoffice
├── pages/
│   └── admin/
│       └── index.vue            # Esempio pagina Dashboard
├── nuxt.config.ts               # Configurazione Nuxt completa
└── tailwind.config.ts           # Configurazione Tailwind
```

## 🎨 Palette Colori

### Colori Primari
| Nome | HEX | Utilizzo |
|------|-----|----------|
| Deep Navy | `#1A1A2E` | Sidebar, header |
| Dark Blue | `#16213E` | Hover states |
| Slate Blue | `#0F3460` | Bottoni primari, link |
| Accent | `#E94560` | CTA, notifiche, badge |

### Colori Semantici
| Nome | HEX | Utilizzo |
|------|-----|----------|
| Success | `#28A745` | Conferme, stati positivi |
| Warning | `#FFC107` | Alert, attenzione |
| Danger | `#DC3545` | Errori, eliminazioni |
| Info | `#17A2B8` | Informazioni |

### Stati Lead
| Stato | Background | Testo |
|-------|------------|-------|
| Libero | `#E8F5E9` | `#2E7D32` |
| Esclusivo | `#E3F2FD` | `#1565C0` |
| Condiviso | `#FFF3E0` | `#E65100` |
| Esaurito | `#FFEBEE` | `#C62828` |

## 🔧 Installazione

### 1. Copia i file nella struttura del progetto

```bash
# Copia i file di configurazione nella root
cp tailwind.config.ts /path/to/qualeadfied/
cp nuxt.config.ts /path/to/qualeadfied/

# Copia gli stili
cp -r assets/styles /path/to/qualeadfied/assets/

# Copia layouts e componenti
cp -r layouts /path/to/qualeadfied/
cp -r pages /path/to/qualeadfied/
```

### 2. Installa le dipendenze

```bash
npm install @primevue/nuxt-module @primevue/themes primeicons
npm install @nuxtjs/tailwindcss
npm install -D sass
```

### 3. Verifica la configurazione

Il file `nuxt.config.ts` include già tutte le configurazioni necessarie per:
- PrimeVue con tema personalizzato
- Tailwind CSS con CSS layers
- SCSS con variabili globali

## 💅 Utilizzo

### Classi Tailwind Custom

```html
<!-- Bottoni -->
<button class="btn-primary">Salva</button>
<button class="btn-secondary">Annulla</button>
<button class="btn-danger">Elimina</button>

<!-- Card -->
<div class="card">Contenuto</div>
<div class="card-elevated">Card con ombra</div>

<!-- Badge Lead Status -->
<span class="badge-lead-free">Libero</span>
<span class="badge-lead-exclusive">Esclusivo</span>
<span class="badge-lead-shared">Condiviso</span>
<span class="badge-lead-exhausted">Esaurito</span>

<!-- Input -->
<input class="input" placeholder="Email" />
<input class="input input-error" placeholder="Con errore" />

<!-- Label -->
<label class="label">Nome campo</label>
```

### Classi SCSS Custom

```html
<!-- KPI Card -->
<div class="kpi-card">
  <div class="kpi-card-icon primary">
    <i class="pi pi-chart-bar"></i>
  </div>
  <div class="kpi-card-value">1,234</div>
  <div class="kpi-card-label">Lead Disponibili</div>
  <div class="kpi-card-trend up">
    <i class="pi pi-arrow-up trend-icon"></i>
    +12%
  </div>
</div>

<!-- Lead Badge (SCSS version) -->
<span class="lead-badge free">Libero</span>
<span class="lead-badge exclusive">Esclusivo</span>
```

### Componenti PrimeVue

I componenti PrimeVue sono automaticamente stilizzati con il tema Qualeadfied:

```vue
<template>
  <!-- Bottoni -->
  <PrimeButton label="Primario" severity="primary" />
  <PrimeButton label="Secondario" severity="secondary" outlined />
  <PrimeButton label="Pericolo" severity="danger" />
  
  <!-- Tag/Badge -->
  <PrimeTag value="Success" severity="success" />
  <PrimeTag value="Info" severity="info" />
  
  <!-- DataTable -->
  <PrimeDataTable :value="data" stripedRows>
    <PrimeColumn field="name" header="Nome" />
    <PrimeColumn field="email" header="Email" />
  </PrimeDataTable>
  
  <!-- Input -->
  <PrimeInputText v-model="value" placeholder="Inserisci..." />
  
  <!-- Select -->
  <PrimeSelect v-model="selected" :options="options" />
</template>
```

## 🎯 Best Practices

### 1. Usa le variabili SCSS nei componenti

```scss
// Nel tuo componente .vue
<style lang="scss" scoped>
.my-component {
  background-color: $color-primary;
  border-radius: $radius-lg;
  padding: $space-4;
  box-shadow: $shadow-card;
}
</style>
```

### 2. Combina Tailwind e SCSS

```html
<!-- Usa Tailwind per layout e spacing -->
<div class="flex items-center gap-4 p-6">
  <!-- Usa classi SCSS per componenti specifici -->
  <div class="kpi-card">
    <!-- Contenuto -->
  </div>
</div>
```

### 3. Usa i colori semantici

```html
<!-- Invece di colori hardcoded -->
<span class="text-green-600">✓ Successo</span>

<!-- Usa i colori semantici -->
<span class="text-success">✓ Successo</span>
```

### 4. Responsive Design

```scss
// Usa i mixin responsive
.my-element {
  padding: $space-4;
  
  @include md {
    padding: $space-6;
  }
  
  @include lg {
    padding: $space-8;
  }
}
```

## 📐 Layout

### Admin Layout

Il layout admin include:
- Sidebar fissa (260px, collassabile a 64px)
- Header sticky (64px)
- Area contenuto con padding
- Supporto responsive (sidebar drawer su mobile)

```vue
<template>
  <NuxtLayout name="admin">
    <!-- Il tuo contenuto pagina -->
  </NuxtLayout>
</template>
```

### Breakpoints

| Nome | Larghezza | Utilizzo |
|------|-----------|----------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet portrait |
| lg | 1024px | Tablet landscape |
| xl | 1280px | Desktop |
| 2xl | 1440px | Desktop large |

## 🔄 CSS Layers

L'ordine dei CSS layers è configurato per evitare conflitti:

1. `tailwind-base` - Reset e stili base Tailwind
2. `primevue` - Stili dei componenti PrimeVue
3. `tailwind-utilities` - Utility classes Tailwind

Questo permette di sovrascrivere gli stili PrimeVue con le utilities Tailwind.

## 📝 Note

- I font Google (Inter, Montserrat, JetBrains Mono) sono caricati tramite CDN
- Le icone PrimeIcons sono incluse automaticamente
- Il tema supporta dark mode (da abilitare con classe `.dark` sul body)

---

**Versione**: 1.0  
**Ultima modifica**: Gennaio 2026
