**QUALEAD\*FIED**

Specifica Architetturale

Area Cliente B2B

*Frontend Pubblico e Dashboard Utente*

Versione 1.0

Gennaio 2025

Indice

1\. Panoramica Area Cliente

L\'area cliente di Qualead\*fied è composta da due macro-sezioni: il
Frontend Pubblico (accessibile senza autenticazione) e l\'Area Riservata
(accessibile dopo login).

1.1 Frontend Pubblico

Sezioni accessibili senza autenticazione:

-   Homepage con presentazione servizio e CTA

-   Catalogo lead (versione anonimizzata/oscurata)

-   Form di registrazione

-   Login

-   Recupero password

1.2 Area Riservata Utente

Sezioni accessibili dopo autenticazione:

-   Dashboard personale con riepilogo e KPI

-   Catalogo lead (versione completa con prezzi)

-   Prova gratuita (onboarding nuovi utenti)

-   Carrello e checkout

-   Pacchetti lead

-   I miei lead (portafoglio)

-   I miei ordini (storico)

-   Profilo e dati di fatturazione

1.3 Design System Area Cliente

Due stili distinti per le diverse aree:

  ------------------- ------------------------- -------------------------
**Aspetto**         **Frontend Pubblico**     **Area Riservata**

Obiettivo           Conversione, impatto      Produttività, efficienza
visivo

Layout              Hero sections, cards      Sidebar + contenuto,
grandi                    tabelle

Colori              Brand colors, gradients   Neutri con accent per
azioni

Tipografia          Titoli grandi, ampi spazi Compatta, leggibile

CTA                 Bottoni prominenti        Azioni contestuali inline
  ------------------- ------------------------- -------------------------

2\. Struttura Navigazione

2.1 Header Pubblico (Non Autenticato)

Navbar visibile su tutte le pagine pubbliche:

  ------------------- ------------------------------- -------------------
**Elemento**        **Descrizione**                 **Posizione**

Logo                Link alla homepage              Sinistra

Catalogo Lead       Link al catalogo pubblico       Centro

Accedi              Apre modal/pagina login         Destra

Registrati          Bottone primario CTA            Destra
  ------------------- ------------------------------- -------------------

2.2 Sidebar Area Riservata (Autenticato)

Menu laterale dell\'area riservata cliente:

  ------------------- ----------------------------------- ------------------
**Voce**            **Descrizione**                     **Icona**

Dashboard           Panoramica account, KPI, notifiche  pi-home

Catalogo Lead       Ricerca e acquisto lead             pi-search

Pacchetti           Acquisto bundle e gestione monte    pi-box
lead

I Miei Lead         Portafoglio lead acquistati         pi-list

I Miei Ordini       Storico acquisti e fatture          pi-shopping-cart

Profilo             Dati azienda e fatturazione         pi-user
  ------------------- ----------------------------------- ------------------

**Header Area Riservata (barra superiore):**

-   Logo (link a dashboard)

-   Breadcrumb navigazione

-   Icona carrello con badge quantità

-   Icona notifiche (nuovi lead disponibili)

-   Menu utente (nome azienda, logout)

3\. Pagine Frontend Pubblico

3.1 Homepage

Landing page principale con obiettivo conversione:

  ----------------------- -----------------------------------------------
**Sezione**             **Contenuto**

Hero                    Headline, sottotitolo, CTA Registrati,
immagine/illustrazione

Value Proposition       3-4 card con vantaggi del servizio

Come Funziona           Step 1-2-3 del processo di acquisto

Categorie               Preview categorie merceologiche disponibili

Statistiche             Numeri (lead venduti, clienti soddisfatti,
etc.)

CTA Finale              Blocco con invito alla registrazione

Footer                  Link utili, contatti, legal
  ----------------------- -----------------------------------------------

3.2 Catalogo Lead Pubblico

Vista lead disponibili in forma anonimizzata:

**Filtri disponibili:**

-   Categoria merceologica (dropdown)

-   Provincia / Area geografica

-   Data generazione (range)

-   Tipo disponibilità (esclusivo/condiviso)

**Card Lead (versione pubblica):**

-   Categoria merceologica (badge)

-   Provincia

-   Data generazione

-   Preview richiesta (primi 50 caratteri oscurati)

-   Indicatore \"A partire da € XX\"

-   Badge disponibilità (Esclusivo disponibile / Condiviso X/N)

-   CTA \"Accedi per acquistare\" → redirect a login

3.3 Registrazione

Form di registrazione nuovo cliente B2B:

  ----------------------- --------------------------- -------------------
**Campo**               **Tipo**                    **Validazione**

Ragione Sociale         Text                        Obbligatorio, min 2
caratteri

Partita IVA             Text                        Obbligatorio,
formato IT, univoco

Email                   Email                       Obbligatorio,
formato valido,
univoco

Telefono                Tel                         Obbligatorio,
formato italiano

Nome Referente          Text                        Obbligatorio

Cognome Referente       Text                        Obbligatorio

Password                Password                    Min 8 caratteri,
complessità

Conferma Password       Password                    Match con password

Termini e Condizioni    Checkbox                    Obbligatorio

Privacy Policy          Checkbox                    Obbligatorio

Consenso Marketing      Checkbox                    Opzionale
  ----------------------- --------------------------- -------------------

**Flusso post-registrazione:**

1.  Invio email di conferma con link di attivazione

2.  Pagina di conferma \"Controlla la tua email\"

3.  Click su link → attivazione account

4.  Redirect a login con messaggio di successo

3.4 Login e Recupero Password

**Form Login:**

-   Campo Email

-   Campo Password

-   Checkbox \"Ricordami\"

-   Link \"Password dimenticata?\"

-   Link \"Non hai un account? Registrati\"

**Flusso Recupero Password:**

5.  Utente inserisce email

6.  Sistema invia email con link di reset (token temporaneo)

7.  Utente clicca link → form nuova password

8.  Conferma reset → redirect a login

4\. Pagine Area Riservata

4.1 Dashboard Cliente

Homepage dell\'area riservata con panoramica account:

**Widget Dashboard:**

  --------------------------- -------------------------------------------
**Widget**                  **Contenuto**

Benvenuto                   Nome azienda, ultimo accesso

Prova Gratuita              Banner se trial disponibile (primo accesso)

Lead Disponibili            Contatore lead nella propria categoria

I Miei Lead                 Totale lead acquistati, link rapido

Pacchetti Attivi            Monte lead rimanente da utilizzare

Ultimi Acquisti             Lista ultimi 5 lead acquistati

Nuovi Lead                  Notifica nuovi lead nella categoria

Azioni Rapide               Bottoni: Cerca Lead, Acquista Pacchetto
  --------------------------- -------------------------------------------

**Onboarding Primo Accesso:**

9.  Modal di benvenuto con breve tour

10. Proposta prova gratuita (se abilitata)

11. Completamento dati di fatturazione

4.2 Catalogo Lead (Autenticato)

Vista completa lead con possibilità di acquisto:

**Filtri avanzati:**

-   Categoria merceologica (navigazione tra categorie)

-   Provincia (multipla)

-   Range data generazione

-   Disponibilità: Solo esclusivi / Solo condivisi / Tutti

-   Ordinamento: Data (recenti/vecchi), Prezzo

**Card Lead (versione autenticata):**

-   Checkbox selezione multipla

-   Categoria e Provincia

-   Data generazione

-   Preview richiesta (testo parziale)

-   Prezzo Esclusivo: € XX (se disponibile)

-   Prezzo Condiviso: € YY - Slot X/N disponibili

-   Bottone \"Acquista Esclusivo\" (disabilitato se già condiviso)

-   Bottone \"Acquista Condiviso\" (disabilitato se slot esauriti)

**Barra Azioni Selezione Multipla:**

-   Contatore lead selezionati

-   Toggle modalità: Esclusivo / Condiviso

-   Totale stimato

-   Bottone \"Aggiungi al carrello\"

4.3 Prova Gratuita

Flusso di selezione lead gratuiti per nuovi utenti:

**Condizioni:**

-   Flag prova gratuita attivo nel profilo utente

-   Lead gratuiti rimanenti \> 0

-   I lead gratuiti NON impattano il conteggio condivisioni

**Interfaccia:**

-   Banner in dashboard: \"Hai X lead gratuiti da riscattare!\"

-   Pagina dedicata con catalogo lead

-   Selezione manuale dei lead desiderati

-   Contatore lead selezionati / disponibili

-   Conferma selezione → lead aggiunti a \"I miei lead\"

4.4 Pacchetti Lead

Acquisto e gestione bundle lead con sistema a scalare:

**Sezione Acquisto Pacchetti:**

  ----------------------- -----------------------------------------------
**Elemento**            **Descrizione**

Lista Pacchetti         Card per ogni pacchetto disponibile

Dettaglio Pacchetto     Nome, quantità lead, prezzo, categoria

Selezione Modalità      Slider/input: quanti esclusivi, quanti
condivisi

Filtri Opzionali        Province preferite, range date

Riepilogo               Totale con IVA esposta

CTA                     Bottone \"Acquista Pacchetto\"
  ----------------------- -----------------------------------------------

**Sezione Pacchetti Attivi (Monte Lead):**

-   Lista pacchetti acquistati non ancora esauriti

-   Progress bar: lead utilizzati / totali

-   Dettaglio: esclusivi rimanenti, condivisi rimanenti

-   Bottone \"Seleziona Lead\" → apre catalogo filtrato

-   I lead selezionati vengono scalati dal monte

4.5 Carrello e Checkout

Flusso di acquisto lead singoli:

**Pagina Carrello:**

-   Lista lead nel carrello con dettagli

-   Modalità acquisto per ogni lead (esclusivo/condiviso)

-   Prezzo unitario e subtotale

-   Azione rimuovi dal carrello

-   Riepilogo: Subtotale, IVA 22%, Totale

**Pagina Checkout:**

12. Verifica/modifica dati di fatturazione

13. Riepilogo ordine con totale IVA inclusa

14. Selezione metodo pagamento: Carta / SEPA

15. Accettazione termini utilizzo lead

16. Bottone \"Procedi al pagamento\" → Stripe

**Post-Pagamento:**

-   Pagina conferma ordine con riepilogo

-   Lead sbloccati immediatamente in \"I miei lead\"

-   Email con riepilogo e dati lead

-   Fattura elettronica inviata a SDI

4.6 I Miei Lead (Portafoglio)

Gestione lead acquistati e gratuiti:

**Funzionalità:**

  ----------------------- -----------------------------------------------
**Funzione**            **Descrizione**

Lista Lead              Tabella con tutti i lead posseduti

Filtri                  Categoria, data acquisto, stato contatto

Dettaglio Lead          Dati completi: nome, telefono, email, richiesta

Stato Contatto          Dropdown: Nuovo, Contattato, In lavorazione,
Non interessato, Convertito

Note                    Campo testo per annotazioni personali

Tipo Acquisto           Badge: Esclusivo, Condiviso, Gratuito

Export                  Download CSV/Excel dei lead selezionati
  ----------------------- -----------------------------------------------

**Card/Riga Lead:**

-   Nome e Cognome contatto

-   Telefono (click-to-call)

-   Email (click-to-mail)

-   Categoria e Provincia

-   Testo richiesta completo

-   Data generazione e data acquisto

-   Stato contatto modificabile

4.7 I Miei Ordini

Storico acquisti e fatture:

  ----------------------- -----------------------------------------------
**Colonna**             **Contenuto**

Numero Ordine           Codice univoco (es. ORD-2025-00123)

Data                    Data e ora acquisto

Tipo                    Singolo / Pacchetto / Prova Gratuita

Quantità                Numero lead acquistati

Importo                 Totale IVA inclusa

Metodo                  Carta / SEPA / Gratuito

Stato                   Pagato / In elaborazione / Fallito

Azioni                  Visualizza dettaglio, Scarica fattura
  ----------------------- -----------------------------------------------

**Dettaglio Ordine:**

-   Riepilogo dati fatturazione

-   Lista lead inclusi nell\'ordine

-   Dettaglio importi: subtotale, IVA, totale

-   Download fattura PDF

4.8 Profilo Utente

Gestione dati account e fatturazione:

**Tab Dati Azienda:**

-   Ragione Sociale (modificabile)

-   Partita IVA (sola lettura dopo registrazione)

-   Email account (sola lettura)

-   Telefono

-   Nome e Cognome referente

**Tab Dati Fatturazione:**

-   Indirizzo sede legale

-   CAP, Città, Provincia

-   Codice SDI (7 caratteri)

-   PEC (alternativa a SDI)

**Tab Sicurezza:**

-   Cambio password

**Tab Preferenze:**

-   Notifiche email nuovi lead (on/off)

-   Consenso marketing (modifica)

5\. Struttura File Frontend

5.1 Views Area Pubblica

  ----------------------------------- -----------------------------------
**Percorso**                        **Descrizione**

views/public/Home.vue               Landing page

views/public/Catalog.vue            Catalogo lead pubblico

views/auth/Login.vue                Form login

views/auth/Register.vue             Form registrazione

views/auth/ForgotPassword.vue       Richiesta reset password

views/auth/ResetPassword.vue        Form nuova password

views/auth/VerifyEmail.vue          Conferma email
  ----------------------------------- -----------------------------------

5.2 Views Area Riservata Cliente

  -------------------------------------- -----------------------------------
**Percorso**                           **Descrizione**

views/client/Dashboard.vue             Homepage area riservata

views/client/catalog/Index.vue         Catalogo lead autenticato

views/client/catalog/LeadDetail.vue    Dettaglio singolo lead

views/client/trial/Index.vue           Selezione lead gratuiti

views/client/packages/Index.vue        Lista pacchetti disponibili

views/client/packages/Active.vue       Pacchetti attivi (monte lead)

views/client/packages/Select.vue       Selezione lead da pacchetto

views/client/cart/Index.vue            Carrello

views/client/checkout/Index.vue        Checkout e pagamento

views/client/checkout/Success.vue      Conferma ordine

views/client/leads/Index.vue           I miei lead (portafoglio)

views/client/leads/Detail.vue          Dettaglio lead acquistato

views/client/orders/Index.vue          I miei ordini

views/client/orders/Detail.vue         Dettaglio ordine

views/client/profile/Index.vue         Profilo utente

views/client/profile/Billing.vue       Dati fatturazione

views/client/profile/Security.vue      Cambio password

views/client/profile/Preferences.vue   Preferenze notifiche
  -------------------------------------- -----------------------------------

5.3 Componenti Riutilizzabili

  ---------------------------------------- -----------------------------------
**Componente**                           **Utilizzo**

components/client/LeadCard.vue           Card lead in catalogo

components/client/LeadCardPublic.vue     Card lead versione pubblica

components/client/LeadFilters.vue        Pannello filtri catalogo

components/client/LeadDetail.vue         Modale dettaglio lead

components/client/CartItem.vue           Riga carrello

components/client/PackageCard.vue        Card pacchetto

components/client/OrderRow.vue           Riga tabella ordini

components/client/LeadRow.vue            Riga tabella lead

components/common/Navbar.vue             Header pubblico

components/common/Sidebar.vue            Menu laterale area riservata

components/common/CartIcon.vue           Icona carrello con badge

components/common/NotificationBell.vue   Icona notifiche
  ---------------------------------------- -----------------------------------

6\. API Endpoints Cliente

6.1 Autenticazione

  ------------ -------------------------------- ---------------------------
**Metodo**   **Endpoint**                     **Descrizione**

POST         /api/auth/register               Registrazione nuovo utente

POST         /api/auth/login                  Login

POST         /api/auth/logout                 Logout

POST         /api/auth/forgot-password        Richiesta reset password

POST         /api/auth/reset-password         Esegui reset password

GET          /api/auth/verify-email/{token}   Verifica email

GET          /api/auth/user                   Utente corrente
  ------------ -------------------------------- ---------------------------

6.2 Catalogo e Lead

  ------------ ------------------------------- ---------------------------
**Metodo**   **Endpoint**                    **Descrizione**

GET          /api/leads                      Lista lead (pubblico:
oscurati)

GET          /api/leads/{id}                 Dettaglio lead (auth
required)

GET          /api/categories                 Lista categorie

GET          /api/provinces                  Lista province

GET          /api/client/leads               I miei lead acquistati

GET          /api/client/leads/{id}          Dettaglio mio lead

PUT          /api/client/leads/{id}          Aggiorna stato/note lead

GET          /api/client/leads/export        Export CSV/Excel
  ------------ ------------------------------- ---------------------------

6.3 Carrello e Ordini

  ------------ --------------------------------- ---------------------------
**Metodo**   **Endpoint**                      **Descrizione**

GET          /api/client/cart                  Contenuto carrello

POST         /api/client/cart                  Aggiungi lead al carrello

PUT          /api/client/cart/{id}             Modifica item carrello

DELETE       /api/client/cart/{id}             Rimuovi da carrello

DELETE       /api/client/cart                  Svuota carrello

POST         /api/client/checkout              Crea ordine e payment
intent

GET          /api/client/orders                Lista ordini

GET          /api/client/orders/{id}           Dettaglio ordine

GET          /api/client/orders/{id}/invoice   Download fattura
  ------------ --------------------------------- ---------------------------

6.4 Pacchetti

  ------------ ---------------------------------------- -----------------------
**Metodo**   **Endpoint**                             **Descrizione**

GET          /api/packages                            Lista pacchetti
disponibili

POST         /api/client/packages/purchase            Acquista pacchetto

GET          /api/client/packages                     I miei pacchetti attivi

GET          /api/client/packages/{id}                Dettaglio pacchetto
attivo

POST         /api/client/packages/{id}/select-leads   Seleziona lead da
pacchetto
  ------------ ---------------------------------------- -----------------------

6.5 Prova Gratuita

  ------------ ----------------------------------- -----------------------
**Metodo**   **Endpoint**                        **Descrizione**

GET          /api/client/trial/status            Stato prova gratuita

POST         /api/client/trial/claim             Riscatta lead gratuiti
  ------------ ----------------------------------- -----------------------

6.6 Profilo

  ------------ --------------------------------- ---------------------------
**Metodo**   **Endpoint**                      **Descrizione**

GET          /api/client/profile               Dati profilo

PUT          /api/client/profile               Aggiorna profilo

PUT          /api/client/profile/billing       Aggiorna dati fatturazione

PUT          /api/client/profile/password      Cambio password

PUT          /api/client/profile/preferences   Aggiorna preferenze
  ------------ --------------------------------- ---------------------------

7\. Schema Routing Frontend

7.1 Route Pubbliche

  ------------------------------- ------------------------------- ------------
**Path**                        **Componente**                  **Guard**

/                               views/public/Home.vue           none

/catalog                        views/public/Catalog.vue        none

/login                          views/auth/Login.vue            guest

/register                       views/auth/Register.vue         guest

/forgot-password                views/auth/ForgotPassword.vue   guest

/reset-password/:token          views/auth/ResetPassword.vue    guest

/verify-email/:token            views/auth/VerifyEmail.vue      guest
  ------------------------------- ------------------------------- ------------

7.2 Route Area Riservata

  ------------------------------- -------------------------------------- ------------
**Path**                        **Componente**                         **Guard**

/dashboard                      views/client/Dashboard.vue             auth

/leads                          views/client/catalog/Index.vue         auth

/leads/:id                      views/client/catalog/LeadDetail.vue    auth

/trial                          views/client/trial/Index.vue           auth

/packages                       views/client/packages/Index.vue        auth

/packages/active                views/client/packages/Active.vue       auth

/packages/:id/select            views/client/packages/Select.vue       auth

/cart                           views/client/cart/Index.vue            auth

/checkout                       views/client/checkout/Index.vue        auth

/checkout/success               views/client/checkout/Success.vue      auth

/my-leads                       views/client/leads/Index.vue           auth

/my-leads/:id                   views/client/leads/Detail.vue          auth

/orders                         views/client/orders/Index.vue          auth

/orders/:id                     views/client/orders/Detail.vue         auth

/profile                        views/client/profile/Index.vue         auth

/profile/billing                views/client/profile/Billing.vue       auth

/profile/security               views/client/profile/Security.vue      auth

/profile/preferences            views/client/profile/Preferences.vue   auth
  ------------------------------- -------------------------------------- ------------

8\. Priorità di Sviluppo

8.1 Sprint 1 - Autenticazione e Base

17. Layout pubblico (Navbar, Footer)

18. Homepage con CTA

19. Registrazione con verifica email

20. Login e recupero password

21. Layout area riservata (Sidebar)

8.2 Sprint 2 - Catalogo e Dashboard

22. Dashboard cliente con widget

23. Catalogo lead pubblico (oscurato)

24. Catalogo lead autenticato

25. Filtri e ricerca lead

26. Profilo utente e dati fatturazione

8.3 Sprint 3 - Acquisto Singoli Lead

27. Carrello (aggiungi, rimuovi, modifica)

28. Checkout con dati fatturazione

29. Integrazione Stripe (carta + SEPA)

30. Conferma ordine e sblocco lead

31. Email conferma acquisto

8.4 Sprint 4 - Portafoglio e Ordini

32. I miei lead (lista, filtri, dettaglio)

33. Gestione stato contatto e note

34. Export CSV/Excel

35. Storico ordini

36. Download fatture

8.5 Sprint 5 - Pacchetti e Trial

37. Lista pacchetti disponibili

38. Acquisto pacchetto

39. Gestione pacchetti attivi (monte lead)

40. Selezione lead da pacchetto

41. Prova gratuita (onboarding)

8.6 Sprint 6 - Notifiche e Refinement

42. Sistema notifiche in-app

43. Email notifica nuovi lead

44. Preferenze notifiche

45. Ottimizzazione UX mobile

46. Testing e bug fixing

*--- Fine Documento ---*
