# Qualeadfied Frontend — Operations Manual

SPA Nuxt 3 (in modalità `ssr: false`) per area cliente e backoffice admin di Qualeadfied. Il backend Laravel vive in `../qualeadfied-be/`. In produzione, il bundle viene buildato e copiato dentro `public/` del backend e servito da Apache su `https://qualeadfied.justskills.it/`.

## Stack

- **Framework**: Nuxt 3.14 + Vue 3 + TypeScript strict
- **UI kit**: PrimeVue 4 (tema custom in `assets/styles/primevue-theme.ts`) + Tailwind 3 + SCSS
- **State**: Pinia
- **API client**: `openapi-fetch` (type-safe da `types/api.generated.ts`) + `$fetch` Nuxt
- **i18n**: `@nuxtjs/i18n` (IT default, EN)
- **Pagamenti**: `@stripe/stripe-js`
- **SPA mode**: `ssr: false` (vedi [nuxt.config.ts:10](nuxt.config.ts))

## Comandi essenziali

```bash
# Setup (una tantum)
cp .env.example .env
npm install

# Dev (porta 3000)
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint
npm run lint:fix

# Sync tipi API dal backend (richiede backend up su :8000)
npm run api:sync     # scarica /docs/api.json e rigenera types/api.generated.ts

# Build SPA per deploy
npm run build        # output in .output/

# E2E (Playwright)
npm run test:e2e            # headless
npm run test:e2e:ui         # mode interattivo
npm run test:e2e:install    # scarica i browser (prima volta)
```

## Routing principale

| Path | Pagina | Note |
|---|---|---|
| `/` | `pages/index.vue` | Homepage pubblica |
| `/login` | `pages/login.vue` | Login client |
| `/admin/login` | `pages/admin/login.vue` | Login admin (separato) |
| `/dashboard` | `pages/dashboard.vue` | Area client post-login |
| `/admin` | `pages/admin/index.vue` | Dashboard admin post-login |

Il routing è file-based (Nuxt). Pagine in `pages/` con `definePageMeta({ layout: 'client' })` richiedono auth client (vedi `middleware/client-auth.global.ts`).

## Auth

Due store separati (client e admin):

- **Client**: `stores/auth.ts` (`useAuthStore`)
  - Token: `localStorage.auth_token`
  - Endpoint login: `POST /auth/login`
  - Redirect default post-login: `/dashboard`

- **Admin**: `stores/adminAuth.ts` (`useAdminAuthStore`)
  - Token: `localStorage.admin_token`
  - Endpoint login: `POST /admin/auth/login`
  - Redirect default post-login: `/admin`

`composables/useApi.ts` setta `Authorization: Bearer <token>` automaticamente leggendo `admin_token` (priorità) o `auth_token`.

## API client

- `composables/useApi.ts` → `$fetch.create()` con baseURL da `runtimeConfig.public.apiBase`
- `composables/useTypedApi.ts` → wrapper `openapi-fetch` (tipato dal contratto OpenAPI)
- Header automatici: `Accept: application/json`, `Content-Type: application/json`, `Authorization` se token presente

Base URL configurabile via `NUXT_PUBLIC_API_BASE` (default `http://localhost:8000/api`).

## Composables disponibili

| File | Scopo |
|---|---|
| `useAuth.ts` | Validazione form login/register + toast |
| `useApi.ts` | Factory `$fetch` con headers auth |
| `useTypedApi.ts` | Wrapper openapi-fetch type-safe |
| `useStripe.ts` | Singleton Stripe.js loader |
| `useCatalog.ts` | Categorie, filtri |
| `useClient.ts` | Profilo client |
| `useClientArea.ts` | Stato area client |
| `useLead.ts` | Lead operations |
| `useOrder.ts` | Ordini |
| `useInvoice.ts` | Fatture |
| `useTransaction.ts` | Transazioni Stripe |
| `useSettings.ts` | Settings admin |

## Variabili d'ambiente

Vedi [.env.example](.env.example):

| Var | Default | Note |
|---|---|---|
| `NUXT_PUBLIC_API_BASE` | `http://localhost:8000/api` | URL backend Laravel |
| `NUXT_PUBLIC_STRIPE_PUBLIC_KEY` | – | Stripe public key (test mode) |

In container Docker (`docker-compose.yml`), `NUXT_PUBLIC_API_BASE` punta a `http://host.docker.internal:8000/api` per parlare con il backend sul mac host.

## Convenzioni

- **Componenti PrimeVue**: prefisso auto `Prime*` (es: `<PrimeButton>`, `<PrimeDataTable>`).
- **Stores**: in `stores/`, pattern Pinia setup syntax o options.
- **Composables**: in `composables/`, auto-imported (no import statement nelle pagine).
- **i18n keys**: in `locales/it/index.ts` e `locales/en/index.ts`.
- **CSS layers**: ordine `tailwind-base → primevue → tailwind-utilities` (override Tailwind > PrimeVue).
- **Tema**: variabili colore e radius in `assets/styles/_variables.scss` + `assets/styles/primevue-theme.ts`.

## File da NON toccare a cuor leggero

- **`assets/styles/primevue-theme.ts`** — tema custom, modifiche = redesign-level. Discutere prima.
- **`dist`** (symlink → `.output/public`) — gestito automaticamente dal build, non versionarlo.
- **`types/api.generated.ts`** — generato da `npm run api:sync`, non modificare a mano.
- **`.nuxt/`, `.output/`** — output di build, già in `.gitignore`.

## Smoke test (Playwright)

In `tests/e2e/`. I test girano contro:
- Frontend su `http://localhost:3000` (dev server o webServer Playwright)
- Backend su `http://localhost:8000` (assicurati che sia up: `cd ../qualeadfied-be && docker compose up -d`, poi `docker compose exec app php artisan migrate`)

Override URL via env:
- `PLAYWRIGHT_BASE_URL` — URL del frontend (default `http://localhost:3000`)
- `PLAYWRIGHT_SKIP_WEBSERVER=1` — non avviare automaticamente `npm run dev` (utile in CI con stack già up)

I selettori usati nei test sono volutamente minimal: `#email`, `#password`, `button[type="submit"]`. Se in futuro emergessero fragilità, aggiungere `data-testid` ai punti instabili.

## Credenziali di test (seed backend)

| Ruolo | Email | Password |
|---|---|---|
| Admin | `admin@qualeadfied.com` | `Passw0rd!` |
| Client | `test@qualeadfied.com` | `Passw0rd!` |

## Deploy

Il deploy è gestito dal backend (`../qualeadfied-be/deploy.sh`) che:
1. esegue `npm run build` qui
2. copia `.output/public/` → `qualeadfied-be/public/`
3. carica via FTP su `ftp.justskills.it`

Quindi NON c'è un deploy frontend separato. Verificare sempre che `npm run build` non rompa prima di chiedere un deploy.
