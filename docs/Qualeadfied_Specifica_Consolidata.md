**QUALEAD\*FIED**

Specifica Tecnica e Funzionale Consolidata

*Piattaforma di Vendita Lead Qualificati B2B*

Versione 1.0 - Gennaio 2025

Indice

1\. Premessa

Il presente documento descrive le specifiche di progetto per lo sviluppo
di una piattaforma web denominata Qualead\*fied, dedicata alla vendita
di lead qualificati a clienti B2B appartenenti a diversi settori
merceologici che operano in settori B2C.

**La piattaforma deve consentire:**

-   **Gestione centralizzata dei lead:** inserimento automatico tramite
    API da Meta o da Google tramite connettore trasversale tipo Zapier.

-   **Vendita di lead in modalità:**

  -   **Esclusiva:** lead venduto una sola volta.

  -   **Condivisa:** lead vendibile fino a un massimo di N acquirenti
      (dove N dipende dalla categoria merceologica, default 3).

-   **Classificazione** dei lead per categoria merceologica e provincia.

-   **Gestione di pacchetti di lead** (bundle acquistabili con sistema a
    scalare).

-   **Prova gratuita** con un numero limitato di lead free per nuovi
    utenti.

-   **Pagamento online** tramite carta di credito e addebito diretto in
    conto corrente (SEPA).

-   **Consegna immediata** dei dati completi del lead all\'acquirente,
    via email e in area riservata.

-   Compliance in area legale gestita da tattico.it.

**Nota:** Sito vetrina escluso dalla presente offerta.

2\. Ambito di Fornitura

L\'ambito di progetto comprende:

-   Analisi dettagliata requisiti e definizione flussi.

-   Progettazione UX/UI per:

  -   Front-end pubblico applicazione (flusso di registrazione).

  -   Area riservata clienti applicazione (acquisti, lead, storico,
      pacchetti, dashboard).

  -   Backoffice amministratore applicazione (gestione lead, utenti,
      vendite, dashboard).

-   Sviluppo front-end e back-end (logiche di business, API,
    integrazioni).

-   Configurazione gateway di pagamento (Stripe con supporto carta di
    credito e SEPA Direct Debit).

-   Configurazione sistema di invio email transazionali (utilizzo
    piattaforma esterna per l\'invio).

-   Integrazione con sistema di fatturazione elettronica (Fatture in
    Cloud API per invio a SDI).

-   Test, messa in produzione e breve fase di assistenza post go-live.

3\. Architettura e Tecnologia

3.1 Architettura Logica Applicazione

La soluzione prevede tre macro-livelli:

Front-end Pubblico

-   Form contatto e registrazione.

-   Recupera password.

-   Login.

Area Riservata Utente (Cliente B2B)

-   Onboarding, dashboard e scelta categoria merceologica (totale lead
    liberi).

-   Accesso a lead filtrati per categoria e provincia (anonimizzati).

-   Prova gratuita (download lead free).

-   Acquisto singoli lead e pacchetti:

  -   Acquisto tramite transazione con carta di credito o addebito
      diretto SEPA.

  -   Invio riepilogo via email e sblocco funzioni.

  -   Integrazione con sistema di fatturazione elettronica (Fatture in
      Cloud -\> SDI).

-   Storico degli acquisti, download CSV/Excel, gestione dati del
    profilo e dati di fatturazione.

-   Nessun pagamento automatico/ricorrente fatto dal sistema.

Backoffice Amministratore

-   Gestione utenti e profili.

-   Gestione categorie, province e regole di visibilità, listini,
    bundle.

-   Gestione lead (inserimento via API e/o upload, modifica,
    cancellazione).

-   Monitoraggio vendite, report base.

-   Estratti transazioni per prima nota.

-   Ricerca e visualizzazione fatture emesse.

3.2 Stack Tecnologico

In coerenza con la specifica funzionale di alto livello:

  ---------------------- ------------------------------------------------
**Componente**         **Tecnologia**

Piattaforma di         Framework JavaScript di front-end (Vue.js 3).
sviluppo               PHP su piattaforma Laravel 11+ per
backend/backoffice.

Database               MySQL interno.

Pagamenti              Integrazione con Stripe (carta di credito + SEPA
Direct Debit).

API input lead         Endpoint REST per inserimento automatico lead da
sorgenti esterne (con autenticazione API Key).

Email transazionali    A scelta tramite API (SendGrid, Mailgun,
Postmark).

Fatturazione           Integrazione API Fatture in Cloud per invio a
elettronica            SDI.

Hosting                400/600 EUR annui su dominio di terzo livello
tipo app.qualead.fied.com.

Volume stimato         Fino a 1.000 lead/mese (caso peggiore).
  ---------------------- ------------------------------------------------

4\. Requisiti Funzionali - Front-end Pubblico

4.1 Homepage e Presentazione Servizio

Pagina di atterraggio con:

-   Call-to-action a registrazione e login (e relativi flussi).

4.2 Catalogo Lead (Versione Pubblica)

Vista elenco di lead disponibili in forma parzialmente oscurata, con:

-   Categoria merceologica.

-   Provincia (o area geografica).

-   Data di generazione lead.

-   Indicatore prezzo \"a partire da\" (senza mostrare dati sensibili).

-   Possibilità di sbloccarlo in esclusiva (se non già preso) o
    condivisa.

-   Possibilità di selezionare più lead contemporaneamente.

**Filtri base:**

-   Categoria.

-   Provincia.

-   Data.

-   Tipo di condivisione (esclusivo/condiviso).

Clic su un lead -\> richiesta login/registrazione per vedere dettagli e
procedere all\'acquisto.

4.3 Registrazione e Login

Form registrazione con:

-   Dati azienda (ragione sociale, P.IVA, email, telefono).

-   Persona di riferimento.

-   Password.

-   Accettazione Termini & Condizioni + Privacy Policy + consenso
    marketing (opzionale).

-   Invio email di conferma/attivazione account.

-   Funzione \"password dimenticata\" con reset via email.

5\. Requisiti Funzionali - Area Riservata Utente

5.1 Profilo Utente e Categoria

All\'accesso, l\'utente vede:

-   Riepilogo profilo azienda.

-   Categoria merceologica assegnata (o scelta guidata).

**Regole di accesso alle categorie:**

-   L\'utente può spostarsi liberamente tra le categorie per
    visualizzare i lead disponibili.

-   I lead sono legati a una sola categoria specifica.

-   Non esiste gerarchia tra categorie: ogni categoria corrisponde a un
    settore merceologico.

-   L\'admin può creare nuove categorie o dismettere quelle esistenti.

5.2 Prova con Lead Gratuiti

Ogni nuovo utente ha diritto a una prova gratuita:

-   Pacchetto di X lead (numero configurabile dall\'admin per ogni
    cliente) a costo 0.

-   Lead con dati completi (telefono/email) come un normale lead
    acquistato.

-   I lead gratuiti sono veri lead presenti nel sistema.

**Flusso:**

1.  L\'utente accede per la prima volta -\> banner/box che propone la
    \"Prova gratuita\".

2.  L\'utente ha a disposizione un\'interfaccia dove vede i lead per
    categoria merceologica e li sceglie manualmente.

3.  I lead free vengono contrassegnati come \"gratuiti\" nello storico.

**Gestione lato Admin:**

-   Nell\'anagrafica cliente è presente un flag \"prova gratuita\"
    attivabile/disattivabile.

-   L\'admin può configurare il numero di lead gratuiti per ogni
    specifico cliente.

**Importante - Conteggio lead gratuiti:**

-   I lead gratuiti NON contano ai fini del conteggio
    esclusivo/condiviso.

-   Le quantità di lead esclusivi e condivisi rimangono indipendenti.

-   Un lead già condiviso non potrà mai diventare esclusivo.

5.3 Ricerca e Acquisto Singolo Lead

Lista lead con:

-   Filtri avanzati (categoria, provincia, range data lead).

-   Indicazione numero di \"slot\" ancora disponibili per lead condiviso
    (es.: 1/N, 2/N).

-   Prezzo in modalità esclusiva e condivisa (se prevista).

**Logica di disponibilità:**

-   Un lead nasce \"libero\" e può essere acquistato in modalità
    esclusiva o condivisa.

-   Se un lead viene acquistato in modalità condivisa, NON può più
    essere acquistato in esclusiva.

-   Il prezzo condiviso è fisso, indipendentemente dagli slot già
    occupati.

-   Il numero massimo di condivisioni (N) dipende dalla categoria
    merceologica.

**Azioni possibili:**

-   \"Acquista in esclusiva\" -\> prezzo A (solo se il lead è ancora
    libero).

-   \"Acquista in condivisione\" -\> prezzo B (se il numero di vendite
    precedenti \< N).

**Carrello:**

-   Possibilità di selezionare più lead e procedere a pagamento unico.

-   Riepilogo totale con IVA esposta (B2B).

-   Selezione metodo di pagamento (Stripe - carta di credito o SEPA
    Direct Debit).

**Al pagamento andato a buon fine:**

-   Generazione ordine.

-   Sblocco immediato dei dati completi del lead in area riservata.

-   Invio email con riepilogo e lead acquistati.

-   Invio fattura elettronica tramite Fatture in Cloud -\> SDI.

5.4 Acquisto Pacchetti di Lead

Definizione da backoffice di pacchetti preconfigurati (es. 10/50/100
lead) per categoria specifica.

**Modalità di funzionamento (sistema a scalare):**

4.  L\'utente acquista la \"possibilità\" di comprare X lead a un prezzo
    predefinito.

5.  I lead vengono poi scelti manualmente dall\'utente tramite apposita
    interfaccia.

6.  Man mano che l\'utente seleziona i lead, questi vengono scalati dal
    monte lead acquistato.

7.  Se rimangono lead nel pacchetto, l\'utente può attendere l\'arrivo
    di nuovi lead nei giorni successivi.

**Il cliente può:**

-   Selezionare il pacchetto.

-   Scegliere eventuali filtri (es. solo alcune province, solo lead
    generati negli ultimi X giorni).

-   Specificare se vuole lead esclusivi, condivisi o un mix (le quantità
    rimangono indipendenti).

**Comportamento:**

-   Prima del pagamento il sistema chiede tutti i dati di fatturazione.

-   Prezzi sempre senza IVA, l\'IVA viene esposta solo nel check-out
    (B2B).

-   Disclaimer legale su utilizzo lead (gestito dall\'ufficio legale).

-   Al pagamento, il sistema invia fattura elettronica tramite Fatture
    in Cloud.

**I lead inclusi nel pacchetto vengono:**

-   Contrassegnati come venduti (esclusivi o condivisi secondo la scelta
    dell\'utente).

-   Resi disponibili nel \"Portafoglio lead\" del cliente.

*Nota: Opzionale per fase 2 - gestione pacchetti come wallet di crediti
da usare successivamente.*

5.5 Portafoglio Lead e Storico Ordini

**Sezione \"I miei lead\":**

-   Elenco di tutti i lead (gratuiti + acquistati).

-   Dati completi (nome, telefono, email, note).

-   Stato (nuovo / contattato / non interessato, ecc. - opzionale).

**Sezione \"I miei ordini\":**

-   Elenco ordini, data, importo, modalità (singolo/pacchetto), metodo
    di pagamento.

-   Download fattura elettronica.

6\. Requisiti Funzionali - Backoffice Amministratore

6.1 Gestione Utenti

Elenco utenti con:

-   Dati aziendali.

-   Categoria/e associate.

-   Stato account (attivo/sospeso).

-   Flag \"prova gratuita\" e numero lead gratuiti configurabile per
    cliente.

**Funzioni:**

-   Creazione, modifica, sospensione, cancellazione utenti.

-   Reset password (invio email).

-   Modifica categorie associate.

-   Configurazione prova gratuita per singolo cliente.

**Modello account:**

-   1 account = 1 utente (no multi-utente per azienda).

-   Ruolo admin unico applicabile su più operatori (no super admin).

6.2 Gestione Lead

Elenco lead con filtri su:

-   Categoria, provincia, data creazione.

-   Stato (disponibile, venduto esclusivo, venduto 1/N, 2/N, N/N).

-   Regole e periodicità di avviso via email dei \"nuovi lead\".

**Inserimento lead:**

-   Via API REST (endpoint dedicato con autenticazione API Key) da
    sistemi esterni.

-   Via upload manuale (CSV/XLSX).

-   Via form singolo lead.

**Campi principali lead:**

-   Dati anagrafici del contatto (nome, cognome).

-   Dati di contatto (telefono, email).

-   Dati di contesto (categoria, provincia, eventuali tag extra).

-   Testo richiesta.

-   Fonte lead.

-   Data generazione.

**Logiche di disponibilità:**

-   Lead esclusivo: venduto 1 volta -\> passa a stato \"non
    disponibile\".

-   Lead condiviso: contatore vendite incrementale fino a max N -\> poi
    \"non disponibile\".

-   Un lead già condiviso non può mai diventare esclusivo.

**Gestione duplicati:**

-   Possono esistere duplicati (stessa email/telefono) su categorie
    diverse.

**Cancellazione lead:**

-   Hard delete (no soft delete).

-   Solo l\'admin può cancellare lead (es. spam).

-   Non si possono cancellare lead già acquistati.

**Nota:** Nessuna scadenza lead né validazione qualità automatica.

6.3 Prezzi e Configurazione Business

**Matrice prezzi:**

-   Prezzo lead esclusivo: dipende solo dalla categoria (non dalla
    provincia).

-   Prezzo lead condiviso: dipende dalla categoria e ha N prezzi (dove N
    = numero massimo condivisioni).

-   Nessun prezzo minimo/massimo per lead.

-   I prezzi dei pacchetti NON sono scontati rispetto alla somma dei
    singoli lead.

**Definizione di:**

-   Prezzo lead in esclusiva per categoria.

-   Prezzo lead condiviso per categoria (N livelli).

-   Configurazione pacchetti (nome, quantità, prezzo, regole di
    assegnazione).

-   Numero massimo vendite per lead condiviso per categoria.

-   Numero lead gratuiti per prova (configurabile per cliente).

**Gestione IVA:**

-   Prezzi sempre esposti senza IVA.

-   IVA visibile solo nel check-out (B2B).

6.4 Monitoraggio Vendite e Report

Dashboard admin con indicatori base:

-   Numero lead disponibili / venduti.

-   Vendite per periodo (giorno/settimana/mese).

-   Top categorie / province per volumi.

-   Utilizzo prove gratuite.

-   Esportazione Excel dei principali dataset (lead, ordini, utenti).

-   Interfaccia ricerca e visualizzazione fatture emesse.

**Audit e Log:**

-   Le operazioni di pagamento (transazioni) sono tracciate a database
    con log accurato.

-   Tutte le risposte di Stripe sono archiviate integralmente per
    gestione contestazioni.

7\. Flussi di Utilizzo Principali

7.1 Flusso Registrazione e Prova Gratuita

8.  Utente compila form di registrazione.

9.  Riceve email di conferma e attiva l\'account.

10. Primo login -\> onboarding con scelta/assegnazione categoria.

11. Il sistema propone la prova gratuita (X lead configurati
    dall\'admin).

12. L\'utente accede all\'interfaccia di selezione lead e sceglie
    manualmente i lead gratuiti.

13. I lead free vengono assegnati e mostrati in \"I miei lead\".

7.2 Flusso Acquisto Singolo Lead

14. L\'utente accede alla lista lead (può navigare tra categorie).

15. Seleziona uno o più lead (esclusivi o condivisi).

16. Aggiunge al carrello e conferma l\'acquisto.

17. Il sistema mostra il totale con IVA esposta e richiede dati
    fatturazione.

18. Viene reindirizzato a Stripe, paga con carta o SEPA.

19. Al pagamento riuscito:

  -   L\'ordine viene registrato.

  -   I lead vengono contrassegnati come venduti (esclusivi o x/N).

  -   L\'utente riceve email con i dati lead.

  -   Il sistema invia fattura elettronica a SDI.

  -   I lead appaiono in \"I miei lead\" con dati completi.

7.3 Flusso Acquisto Pacchetto

20. L\'utente apre la sezione \"Pacchetti lead\".

21. Seleziona un pacchetto (es.: 50 lead categoria X).

22. Specifica quanti lead esclusivi e quanti condivisi desidera.

23. Procede al pagamento via Stripe.

24. Il sistema registra il \"monte lead\" acquistato.

25. L\'utente accede all\'interfaccia di selezione e sceglie manualmente
    i lead.

26. I lead scelti vengono scalati dal monte e resi disponibili nel
    portafoglio.

27. Se rimangono lead nel pacchetto, l\'utente può attendere nuovi lead.

7.4 Flusso Inserimento Lead via API

28. Sistema esterno invia POST verso endpoint REST con payload JSON del
    lead.

29. Backend valida autenticazione (API Key).

30. Backend valida i dati (campi richiesti, formato).

31. Se validi, lead inserito in DB con stato \"disponibile\".

32. In caso di errore -\> risposta con codice di errore e descrizione al
    connettore.

8\. Funzionalità in Background

8.1 Notifiche Nuovi Lead

-   **Frequenza:** quotidiana (configurabile per categoria).

-   **Destinatari:** clienti che hanno acquistato lead in quella
    categoria.

-   **Contenuto:** numero di nuovi lead disponibili + preview della
    richiesta.

8.2 Email Transazionali

Email previste nel sistema:

-   Conferma registrazione account.

-   Reset password.

-   Conferma acquisto con riepilogo lead.

-   Notifica nuovi lead disponibili (quotidiana).

*Nota: No email per lead in scadenza o reminder carrello abbandonato.*

9\. Requisiti Non Funzionali

9.1 Sicurezza e GDPR

-   Accesso consentito solo ad utenti autenticati per la parte
    riservata.

-   Dati lead completi (telefono, email) visibili solo dopo l\'acquisto
    o nell\'ambito della prova gratuita.

-   Connessione HTTPS obbligatoria.

-   Gestione log accessi e operazioni principali.

-   Pagamenti gestiti da Stripe nel rispetto dei requisiti PCI-DSS.

-   Privacy Policy e Terms of Service visibili e accettati in fase di
    registrazione.

-   Log dettagliato di tutte le transazioni con archiviazione integrale
    risposte Stripe.

9.2 Prestazioni

-   Tempi di risposta adeguati al carico previsto (catalogo lead,
    ricerche, ecc.).

-   Volume stimato: fino a 1.000 lead/mese.

-   Possibilità di scalare verticalmente/orizzontalmente in base alla
    crescita.

9.3 Affidabilità

-   Backup regolari del database (policy da definire).

-   Gestione degli errori con messaggi chiari all\'utente e log tecnici
    per l\'amministratore.

9.4 UX/UI

-   Approccio desktop-first con responsive design.

-   Predisposizione multilingua (italiano come lingua di default).

-   Linee guida grafiche esistenti da seguire.

9.5 API Input Lead

-   Autenticazione: API Key.

-   No rate limiting.

-   No webhook di conferma verso la sorgente.

-   Export dati: formato Excel.

10\. Roadmap di Progetto e Deliverable

Fase 1 - Analisi e Design

-   Workshop iniziale di raccolta requisiti.

-   Definizione dettagliata dei flussi.

-   Wireframe principali (pubblico, area riservata, backoffice).

-   Documento di analisi definitiva approvato.

Fase 2 - Sviluppo MVP

-   Implementazione front-end pubblico.

-   Implementazione area riservata (registrazione, login, prova
    gratuita, acquisti singoli).

-   Implementazione backoffice base (lead, utenti, prezzi).

-   Integrazione Stripe (carta + SEPA) e servizio email.

-   Integrazione Fatture in Cloud per fatturazione elettronica.

-   Implementazione API di input lead.

Fase 3 - Test e Messa in Produzione

-   Test funzionali, test di sicurezza base.

-   Ambiente di staging e UAT con cliente.

-   Correzione bug e rifiniture UI/UX.

-   Go-live in ambiente produzione.

Fase 4 - Opzioni Evolutive (Extra)

-   Integrazione CRM (Pipedrive, HubSpot, ecc.).

-   Wallet crediti prepagati.

-   Notifiche email/Telegram per nuovi lead.

-   Dashboard analytics avanzate.

-   AI Lead Scoring.

11\. Fuori Ambito (Perimetro Negativo)

Per chiarezza in offerta, sono da considerarsi non inclusi, salvo
esplicita indicazione:

-   Implementazione di integrazioni custom con CRM terzi oltre a quanto
    indicato nel MVP.

-   Funzionalità di call center, VOIP, o dialer integrati.

-   Implementazioni di AI avanzate (lead scoring, predictive, ecc.)
    oltre a quanto definito come evoluzione futura.

-   Gestione rimborsi/dispute Stripe (gestiti al di fuori del sistema).

-   Validazione automatica qualità lead (email valida, telefono
    esistente).

-   Scadenza temporale dei lead.

Appendice A - Riepilogo Regole di Business

A.1 Stati del Lead

Un lead può trovarsi in uno dei seguenti stati:

  ------------------ ----------------------------------------------------
**Stato**          **Descrizione**

Libero             Disponibile per acquisto esclusivo O condiviso.

Venduto Esclusivo  Acquistato in esclusiva, non più disponibile.

Venduto Condiviso  Acquistato da x clienti su un massimo di N.
(x/N)

Esaurito Condiviso Raggiunto il massimo di condivisioni.
(N/N)
  ------------------ ----------------------------------------------------

A.2 Transizioni di Stato

-   **Libero -\> Venduto Esclusivo:** quando un cliente acquista in
    esclusiva.

-   **Libero -\> Venduto Condiviso (1/N):** quando il primo cliente
    acquista in condivisione.

-   **Venduto Condiviso (x/N) -\> Venduto Condiviso ((x+1)/N):**
    acquisti successivi in condivisione.

-   **Venduto Condiviso ((N-1)/N) -\> Esaurito Condiviso (N/N):** ultimo
    slot condiviso occupato.

**Nota importante:** Un lead già condiviso non può MAI tornare
disponibile per acquisto esclusivo.

A.3 Matrice Prezzi

-   **Dimensioni:** Categoria x Modalità (Esclusivo/Condiviso).

-   La provincia NON influisce sul prezzo.

-   Prezzo condiviso fisso indipendentemente dallo slot (1/N, 2/N,
    ecc.).

-   Ogni categoria ha un valore N diverso per il massimo di
    condivisioni.

A.4 Prova Gratuita

-   Configurabile per singolo cliente dall\'admin.

-   Lead gratuiti = lead reali (non demo).

-   NON impatta il conteggio esclusivo/condiviso.

-   Attivabile/disattivabile tramite flag in anagrafica cliente.

A.5 Pacchetti Lead

-   Sistema a scalare (monte lead da consumare manualmente).

-   Nessuna assegnazione automatica.

-   Quantità esclusivi e condivisi indipendenti.

-   Lead non utilizzati restano disponibili per selezione futura.

*\-\-- Fine Documento \-\--*

Documento generato per il progetto Qualead\*fied

Versione 1.0 - Gennaio 2025
