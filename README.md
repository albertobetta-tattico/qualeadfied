# Qualeadfied

Applicazione Nuxt 3 basata sui pattern dell'applicazione di riferimento pmi-fe.

## Stack tecnologico

- **Framework**: Nuxt 3 (SSR disabilitato)
- **UI**: PrimeVue 4 + Tailwind CSS
- **State management**: Pinia
- **Validazione**: Zod + Vuelidate
- **TypeScript**: Configurato senza typeCheck
- **Tema**: Aura (PrimeVue)

## Struttura directory

```
├── assets/           # CSS/SCSS
├── components/       # Componenti Vue organizzati per feature
│   └── commons/     # Componenti comuni
├── composables/      # Composables Vue
├── layouts/          # Layout Nuxt
├── middleware/       # Middleware Nuxt
├── pages/           # Route pages
├── plugins/         # Plugin Nuxt
├── schemas/         # Schema validazione Zod
│   └── validation/
├── stores/          # Pinia stores
└── helpers/         # Utility functions
```

## Setup

Installa le dipendenze:

```bash
npm install
```

Copia il file di environment:

```bash
cp .env.example .env.local
```

## Development Server

Avvia il server di sviluppo su `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build per produzione:

```bash
npm run build
```

Preview build di produzione:

```bash
npm run preview
```

## Pattern architetturali

- Componenti organizzati per feature
- Store Pinia per dominio
- Validazione centralizzata con Zod schemas
- Dark mode supportato nativamente
- Configurazione ESLint e TypeScript ottimizzata
