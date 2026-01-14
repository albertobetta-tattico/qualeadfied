**QUALEAD\*FIED**

Specifica Architetturale

Backoffice Amministrativo

*Struttura Menù e Architettura Applicativa*

Versione 1.0

Gennaio 2025

Indice

1\. Decisioni Architetturali

Questa sezione documenta le scelte architetturali fondamentali per lo
sviluppo del backoffice Qualead\*fied.

1.1 Stack Tecnologico

  ----------------------- -----------------------------------------------
**Componente**          **Tecnologia**

Frontend                Vue.js 3 (Composition API) + PrimeVue

Backend                 Laravel 11+ con PHP 8.2+

Database                MySQL 8.0+

Build Tool              Vite

State Management        Pinia

Routing                 Vue Router 4

HTTP Client             Axios

Pagamenti               Stripe API (Card + SEPA)

Fatturazione            Fatture in Cloud API

Email                   SendGrid / Mailgun / Postmark
  ----------------------- -----------------------------------------------

1.2 Architettura Applicativa

L\'applicazione è composta da due progetti separati che comunicano via
API REST:

  ------------------- ---------------------------------------------------
**Progetto**        **Descrizione**

Frontend SPA        Applicazione Vue.js 3 standalone, compilata in
bundle JavaScript statico

Backend API         Laravel 11+ che espone API RESTful, gestisce
business logic e persistenza
  ------------------- ---------------------------------------------------

Strategia di Deploy

-   Server: Apache (no Docker/Portainer)

-   Il frontend viene compilato (npm run build) e i file statici vengono
    copiati nella directory pubblica di Laravel

-   Laravel serve sia le API che i file statici del frontend

-   Dominio: app.qualeadfied.com (terzo livello)

1.3 Sistema di Autenticazione

Sistema di autenticazione unificato per tutti gli utenti (admin e
clienti B2B):

-   Tecnologia: Laravel Sanctum (SPA Authentication)

-   Ruoli: admin, client (gestiti tramite campo role o tabella separata)

-   Middleware di autorizzazione per proteggere le route admin

-   Cookie-based session per SPA (più sicuro di JWT per browser)

1.4 Design System e Stili UI

Due stili distinti per Dashboard e sezioni CRUD:

  ------------------- ------------------------- -------------------------
**Aspetto**         **Dashboard**             **CRUD/Gestione**

Layout              Card-based, griglia       Tabelle dati, form
fluida                    strutturati

Colori              Accent colors per KPI,    Neutri, focus su
gradients                 leggibilità

Componenti          Charts, KPI cards,        DataTable, Dialog, Form
mini-tables

Densità             Spaziatura ampia, respiro Compatta, massima
informazione

Navigazione         Widget clickabili verso   Breadcrumb + azioni
sezioni                   contestuali
  ------------------- ------------------------- -------------------------

2\. Struttura Menù Backoffice

Il menù laterale (sidebar) del backoffice è organizzato in 8 sezioni
principali, raggruppate per area funzionale.

2.1 Dashboard

Icona suggerita: *pi-chart-bar*

  ------------------- ------------------------------- -------------------
**Voce**            **Descrizione**                 **Priorità**

Overview            Homepage admin con KPI e        Alta
grafici principali
  ------------------- ------------------------------- -------------------

**Widget previsti nella Dashboard:**

-   Lead disponibili vs venduti (per stato)

-   Vendite oggi/settimana/mese (importi e quantità)

-   Top 5 categorie per volume

-   Ultimi 5 ordini

-   Nuovi clienti registrati (ultimi 7 giorni)

-   Alert: categorie con lead in esaurimento

2.2 Clienti

Icona suggerita: *pi-users*

  ------------------- ------------------------------- -------------------
**Voce**            **Descrizione**                 **Priorità**

Elenco Clienti      Lista con filtri, stato,        Alta
categoria, azioni rapide

Nuovo Cliente       Form creazione manuale cliente  Media

Prove Gratuite      Gestione flag trial e lead      Alta
gratuiti per cliente
  ------------------- ------------------------------- -------------------

**Funzionalità Elenco Clienti:**

-   Filtri: stato (attivo/sospeso/pending), data registrazione

-   Azioni: modifica, sospendi/attiva, reset password, configura trial

-   Export Excel

2.3 Lead

Icona suggerita: *pi-list*

  ------------------- ------------------------------- -------------------
**Voce**            **Descrizione**                 **Priorità**

Elenco Lead         Lista completa con filtri       Alta
avanzati

Nuovo Lead          Form inserimento singolo lead   Media

Import Lead         Upload CSV/XLSX con mapping     Alta
campi

API & Sorgenti      Gestione fonti lead e API keys  Media
  ------------------- ------------------------------- -------------------

**Funzionalità Elenco Lead:**

-   Filtri: categoria, provincia, stato, data generazione, fonte

-   Visualizzazione stato vendita: libero, esclusivo, condiviso (x/N)

-   Azioni: modifica, elimina (solo se non venduto)

-   Bulk actions: elimina spam (selezione multipla)

2.4 Catalogo

Icona suggerita: *pi-tag*

  ------------------- ------------------------------- -------------------
**Voce**            **Descrizione**                 **Priorità**

Categorie           CRUD categorie merceologiche +  Alta
max_shares

Province            Anagrafica province             Bassa
(pre-popolata)

Pacchetti           Configurazione bundle lead      Alta
  ------------------- ------------------------------- -------------------

**Dettaglio Gestione Categorie:**

-   Nome, slug, descrizione

-   Max condivisioni (N) - parametro fondamentale per business logic

-   Stato attivo/dismesso (soft delete)

-   Ordinamento visualizzazione

2.5 Listini

Icona suggerita: *pi-euro*

  ----------------------- ------------------------------- ---------------
**Voce**                **Descrizione**                 **Priorità**

Prezzi per Categoria    Matrice prezzi                  Alta
esclusivo/condiviso

Storico Prezzi          Visualizzazione variazioni nel  Bassa
tempo
  ----------------------- ------------------------------- ---------------

**Interfaccia Prezzi per Categoria:**

-   Selezione categoria da dropdown

-   Campo prezzo esclusivo

-   N campi prezzo condiviso (uno per ogni slot, dove N = max_shares
    della categoria)

-   Data validità (storicizzazione automatica)

2.6 Vendite

Icona suggerita: *pi-shopping-cart*

  ------------------- ------------------------------- -------------------
**Voce**            **Descrizione**                 **Priorità**

Ordini              Lista ordini con dettaglio      Alta
completo

Transazioni         Log pagamenti Stripe completo   Alta

Fatture             Ricerca fatture, stato SDI      Alta
  ------------------- ------------------------------- -------------------

**Dettaglio Sezione Ordini:**

-   Filtri: cliente, periodo, stato, tipo (singolo/pacchetto/trial)

-   Dettaglio: righe ordine, lead assegnati, pagamento

-   Link rapido a transazione Stripe e fattura

**Dettaglio Sezione Transazioni:**

-   Risposta Stripe completa archiviata (JSON viewer)

-   Stato pagamento con timeline

-   Eventuali errori con codice e messaggio

2.7 Report

Icona suggerita: *pi-chart-line*

  ----------------------- ------------------------------- ---------------
**Voce**                **Descrizione**                 **Priorità**

Statistiche Vendite     Grafici vendite per periodo     Media

Performance Categorie   Top categorie per volumi/ricavi Media

Analisi Geografica      Distribuzione per provincia     Bassa

Export Dati             Download Excel dataset          Alta
  ----------------------- ------------------------------- ---------------

**Export disponibili:**

-   Lead (tutti o filtrati)

-   Ordini (per periodo)

-   Clienti (anagrafica completa)

-   Transazioni per prima nota contabile

2.8 Impostazioni

Icona suggerita: *pi-cog*

  --------------------------- --------------------------- ---------------
**Voce**                    **Descrizione**             **Priorità**

Configurazione Sistema      Parametri globali           Media
applicazione

Notifiche Email             Frequenza invio per         Media
categoria

Operatori Admin             Gestione account            Alta
amministratori

Log Attività                Audit trail operazioni      Bassa
  --------------------------- --------------------------- ---------------

**Parametri Configurazione Sistema:**

-   Default lead prova gratuita (numero)

-   Aliquota IVA default (22%)

-   Prefisso numeri ordine (es. ORD-2025-)

-   Email mittente notifiche

-   Configurazione SMTP/API email

3\. Struttura File Frontend (Vue.js)

Organizzazione delle cartelle e dei file per il progetto frontend Vue.js
3 con PrimeVue.

3.1 Root Directory

  ----------------------- -----------------------------------------------
**Cartella/File**       **Descrizione**

src/                    Codice sorgente applicazione

public/                 Asset statici (favicon, etc.)

vite.config.ts          Configurazione Vite

tsconfig.json           Configurazione TypeScript

package.json            Dipendenze e script

.env.example            Template variabili ambiente
  ----------------------- -----------------------------------------------

3.2 Struttura src/

  --------------------------- -------------------------------------------
**Percorso**                **Contenuto**

src/assets/                 CSS globali, immagini, fonts

src/components/             Componenti riutilizzabili

src/composables/            Composition functions (hooks)

src/layouts/                Layout pagine (AdminLayout, AuthLayout)

src/router/                 Configurazione Vue Router

src/services/               Client API (axios instances)

src/stores/                 Pinia stores (state management)

src/types/                  TypeScript interfaces e types

src/utils/                  Funzioni utility

src/views/                  Pagine/viste dell\'applicazione

src/App.vue                 Componente root

src/main.ts                 Entry point applicazione
  --------------------------- -------------------------------------------

3.3 Dettaglio src/views/admin/

  ------------------------------------ ---------------------------------------
**Percorso**                         **Contenuto**

views/admin/Dashboard.vue            Homepage backoffice

views/admin/clients/Index.vue        Elenco clienti

views/admin/clients/Create.vue       Nuovo cliente

views/admin/clients/Edit.vue         Modifica cliente

views/admin/clients/FreeTrials.vue   Gestione prove gratuite

views/admin/leads/Index.vue          Elenco lead

views/admin/leads/Create.vue         Nuovo lead

views/admin/leads/Edit.vue           Modifica lead

views/admin/leads/Import.vue         Import CSV/XLSX

views/admin/leads/Sources.vue        Gestione sorgenti API

views/admin/catalog/categories/\*    CRUD categorie

views/admin/catalog/provinces/\*     Gestione province

views/admin/catalog/packages/\*      CRUD pacchetti

views/admin/pricing/Index.vue        Listino prezzi

views/admin/pricing/History.vue      Storico prezzi

views/admin/sales/orders/\*          Gestione ordini

views/admin/sales/transactions/\*    Transazioni Stripe

views/admin/sales/invoices/\*        Fatture

views/admin/reports/\*               Report e export

views/admin/settings/\*              Configurazioni
  ------------------------------------ ---------------------------------------

4\. Struttura File Backend (Laravel)

Organizzazione del progetto Laravel 11+ seguendo le best practices e il
pattern Repository/Service.

4.1 Directory Principali

  --------------------------- -------------------------------------------
**Percorso**                **Contenuto**

app/Http/Controllers/Api/   Controller API (Admin + Client)

app/Http/Requests/          Form Request validation

app/Http/Resources/         API Resources (JSON transformation)

app/Http/Middleware/        Middleware custom (es. EnsureIsAdmin)

app/Models/                 Eloquent Models

app/Services/               Business logic services

app/Repositories/           Data access layer

app/Events/                 Eventi applicazione

app/Listeners/              Event listeners

app/Jobs/                   Queue jobs

app/Notifications/          Notifiche email

app/Exports/                Export Excel (Laravel Excel)

database/migrations/        Migrazioni database

database/seeders/           Seeder dati iniziali

routes/api.php              Route API

config/                     Configurazioni applicazione
  --------------------------- -------------------------------------------

4.2 Dettaglio Controllers API

  ----------------------------------- -----------------------------------
**Controller**                      **Responsabilità**

Api/AuthController                  Login, logout, password reset

Api/Admin/DashboardController       KPI e statistiche dashboard

Api/Admin/UserController            CRUD clienti B2B

Api/Admin/LeadController            CRUD lead

Api/Admin/LeadImportController      Import CSV/XLSX

Api/Admin/LeadSourceController      Gestione sorgenti

Api/Admin/CategoryController        CRUD categorie

Api/Admin/ProvinceController        Gestione province

Api/Admin/PackageController         CRUD pacchetti

Api/Admin/PricingController         Listini prezzi

Api/Admin/OrderController           Gestione ordini

Api/Admin/TransactionController     Transazioni Stripe

Api/Admin/InvoiceController         Fatture SDI

Api/Admin/ReportController          Report e export

Api/Admin/SettingController         Configurazioni sistema

Api/Admin/AdminController           Gestione operatori

Api/Admin/ActivityLogController     Audit log

Api/External/LeadIngestController   API pubblica input lead
  ----------------------------------- -----------------------------------

5\. Schema Routing

5.1 Route Frontend (Vue Router)

  ------------------------------- ------------------------------------------ ------------
**Path**                        **Componente**                             **Guard**

/login                          views/auth/Login.vue                       guest

/forgot-password                views/auth/ForgotPassword.vue              guest

/reset-password/:token          views/auth/ResetPassword.vue               guest

/admin                          views/admin/Dashboard.vue                  admin

/admin/clients                  views/admin/clients/Index.vue              admin

/admin/clients/create           views/admin/clients/Create.vue             admin

/admin/clients/:id/edit         views/admin/clients/Edit.vue               admin

/admin/clients/trials           views/admin/clients/FreeTrials.vue         admin

/admin/leads                    views/admin/leads/Index.vue                admin

/admin/leads/create             views/admin/leads/Create.vue               admin

/admin/leads/:id/edit           views/admin/leads/Edit.vue                 admin

/admin/leads/import             views/admin/leads/Import.vue               admin

/admin/leads/sources            views/admin/leads/Sources.vue              admin

/admin/catalog/categories       views/admin/catalog/categories/Index.vue   admin

/admin/catalog/packages         views/admin/catalog/packages/Index.vue     admin

/admin/pricing                  views/admin/pricing/Index.vue              admin

/admin/sales/orders             views/admin/sales/orders/Index.vue         admin

/admin/sales/transactions       views/admin/sales/transactions/Index.vue   admin

/admin/sales/invoices           views/admin/sales/invoices/Index.vue       admin

/admin/reports                  views/admin/reports/Index.vue              admin

/admin/settings                 views/admin/settings/Index.vue             admin
  ------------------------------- ------------------------------------------ ------------

5.2 Route Backend (Laravel API)

  --------------- ----------------------------------- ----------------------------
**Metodo**      **Endpoint**                        **Descrizione**

POST            /api/auth/login                     Login

POST            /api/auth/logout                    Logout

POST            /api/auth/forgot-password           Richiesta reset

POST            /api/auth/reset-password            Reset password

GET             /api/auth/user                      Utente corrente

GET             /api/admin/dashboard                KPI dashboard

GET/POST        /api/admin/users                    Lista/crea clienti

GET/PUT/DEL     /api/admin/users/{id}               Dettaglio/modifica/elimina

GET/POST        /api/admin/leads                    Lista/crea lead

POST            /api/admin/leads/import             Import CSV

GET/POST        /api/admin/categories               CRUD categorie

GET/POST        /api/admin/packages                 CRUD pacchetti

GET/PUT         /api/admin/pricing/{category}       Prezzi categoria

GET             /api/admin/orders                   Lista ordini

GET             /api/admin/transactions             Lista transazioni

GET             /api/admin/invoices                 Lista fatture

GET             /api/admin/reports/export/{type}    Export Excel

POST            /api/external/leads                 API pubblica lead
  --------------- ----------------------------------- ----------------------------

6\. Priorità di Sviluppo

Ordine suggerito per lo sviluppo incrementale del backoffice:

6.1 Sprint 1 - Fondamenta

1.  Setup progetto Laravel + Vue.js + PrimeVue

2.  Sistema autenticazione (Sanctum)

3.  Layout base AdminLayout con sidebar

4.  Dashboard con widget placeholder

6.2 Sprint 2 - Catalogo Base

5.  CRUD Categorie (con max_shares)

6.  Seeder Province italiane

7.  Gestione Listini prezzi

6.3 Sprint 3 - Lead Management

8.  CRUD Lead completo

9.  Import CSV/XLSX con validazione

10. API pubblica input lead

11. Gestione sorgenti e API keys

6.4 Sprint 4 - Clienti e Trial

12. CRUD Clienti B2B

13. Gestione prove gratuite

14. CRUD Pacchetti

6.5 Sprint 5 - Vendite

15. Visualizzazione Ordini

16. Visualizzazione Transazioni Stripe

17. Gestione Fatture e stato SDI

6.6 Sprint 6 - Report e Impostazioni

18. Dashboard con KPI reali

19. Report statistiche

20. Export Excel

21. Impostazioni sistema e operatori admin

22. Log attività

*--- Fine Documento ---*
