**QUALEAD\*FIED**

Modello Dati

*Documento di Specifica del Database*

Versione 1.0 - Gennaio 2025

**1. Panoramica**

Il modello dati di Qualead\*fied è progettato per supportare una
piattaforma di vendita lead B2B con le seguenti caratteristiche chiave:

-   Vendita lead in modalità esclusiva o condivisa (fino a N acquirenti
    per categoria)

-   Sistema a pacchetti con monte lead da consumare manualmente

-   Prova gratuita configurabile per singolo cliente

-   Pagamenti via Stripe (carta e SEPA)

-   Fatturazione elettronica integrata con SDI

**2. Entità Principali**

**2.1 USERS (Clienti B2B)**

Rappresenta i clienti della piattaforma. Modello 1 account = 1 utente.

  ------------------------ ------------------ ---------------------------------
**Attributo**            **Tipo**           **Descrizione**

id                       PK                 Identificativo univoco

company_name             string             Ragione sociale

vat_number               string             Partita IVA

email                    string, unique     Email (usata per login)

phone                    string             Telefono aziendale

contact_first_name       string             Nome persona di riferimento

contact_last_name        string             Cognome persona di riferimento

password                 string             Password hash

status                   enum               pending \| active \| suspended

free_trial_enabled       boolean            Flag prova gratuita attiva

free_trial_leads_total   integer            N. lead gratuiti assegnati
(configurabile da admin)

free_trial_leads_used    integer            Lead gratuiti già utilizzati

billing_data             JSON               Dati fatturazione completi
(indirizzo, SDI, PEC, etc.)

terms_accepted           boolean            Accettazione T&C

privacy_accepted         boolean            Accettazione Privacy Policy

marketing_consent        boolean            Consenso marketing (opzionale)

notify_new_leads         boolean            Preferenza notifiche nuovi lead

email_verified_at        timestamp          Data verifica email

created_at               timestamp          Data registrazione
  ------------------------ ------------------ ---------------------------------

**Note:**

-   Lo stato pending indica utente in attesa di verifica email

-   I dati di fatturazione sono in JSON per flessibilità (SDI code, PEC,
    etc.)

-   La prova gratuita è configurabile per singolo cliente dall\'admin

**2.2 ADMINS (Operatori Backoffice)**

Operatori del backoffice amministrativo. Ruolo unico (no super admin).

  ------------------ ------------------ ---------------------------------
**Attributo**      **Tipo**           **Descrizione**

id                 PK                 Identificativo univoco

name               string             Nome operatore

email              string, unique     Email login

password           string             Password hash

is_active          boolean            Account attivo

last_login_at      timestamp          Ultimo accesso
  ------------------ ------------------ ---------------------------------

**Note:**

-   Tutti gli admin hanno gli stessi permessi

-   Separati da users per sicurezza e contesti distinti

**2.3 CATEGORIES (Categorie Merceologiche)**

Settori merceologici a cui appartengono i lead.

  ------------------ ------------------ ---------------------------------
**Attributo**      **Tipo**           **Descrizione**

id                 PK                 Identificativo univoco

name               string, unique     Nome categoria

slug               string, unique     Slug URL-friendly

description        text               Descrizione

max_shares         integer            N massimo condivisioni per lead
(default: 3)

is_active          boolean            Categoria attiva

sort_order         integer            Ordine visualizzazione

deleted_at         timestamp          Soft delete (per categorie
dismesse)
  ------------------ ------------------ ---------------------------------

**Note:**

-   Ogni categoria definisce il proprio valore N (max condivisioni)

-   Non esiste gerarchia tra categorie

-   L\'admin può creare nuove categorie o dismettere quelle esistenti

-   Soft delete per mantenere storico lead esistenti

**2.4 CATEGORY_PRICES (Prezzi per Categoria)**

Listino prezzi per categoria. Supporta storicizzazione.

  ------------------ ------------------ ---------------------------------
**Attributo**      **Tipo**           **Descrizione**

id                 PK                 Identificativo univoco

category_id        FK → Categories    Categoria di riferimento

exclusive_price    decimal            Prezzo lead esclusivo

shared_prices      JSON               Prezzi per ogni slot condiviso

valid_from         timestamp          Inizio validità

valid_to           timestamp          Fine validità (NULL = corrente)
  ------------------ ------------------ ---------------------------------

**Note:**

-   Il prezzo dipende SOLO dalla categoria e modalità (non dalla
    provincia)

-   Prezzo condiviso fisso indipendentemente dallo slot occupato

-   La struttura JSON permette flessibilità futura per prezzi
    differenziati

-   Storicizzazione prezzi per tracciare variazioni nel tempo

**2.5 PROVINCES (Province)**

Anagrafica province italiane.

  ------------------ ------------------ ---------------------------------
**Attributo**      **Tipo**           **Descrizione**

id                 PK                 Identificativo univoco

name               string             Nome provincia

code               string, unique     Sigla (MI, RM, TO, etc.)

region             string             Regione di appartenenza

is_active          boolean            Provincia attiva
  ------------------ ------------------ ---------------------------------

**Note:**

-   Pre-popolata con tutte le province italiane

-   Usata per filtro geografico dei lead

**2.6 LEAD_SOURCES (Fonti Lead)**

Sorgenti da cui provengono i lead.

  ------------------ ------------------ ---------------------------------
**Attributo**      **Tipo**           **Descrizione**

id                 PK                 Identificativo univoco

name               string             Nome sorgente (Meta Ads, Google,
Manual, etc.)

slug               string, unique     Identificativo tecnico

description        text               Descrizione

api_key            string, unique     API key per autenticazione (solo
sorgenti API)

is_active          boolean            Sorgente attiva

config             JSON               Configurazioni specifiche
  ------------------ ------------------ ---------------------------------

**Note:**

-   Ogni sorgente esterna ha una propria API key

-   Sorgente \"Manual\" per inserimenti da backoffice/upload

**2.7 LEADS (Lead)**

Entità principale: i lead da vendere.

  ------------------ ------------------ ---------------------------------
**Attributo**      **Tipo**           **Descrizione**

id                 PK                 Identificativo univoco

category_id        FK → Categories    Categoria merceologica

province_id        FK → Provinces     Provincia

source_id          FK → Lead_Sources  Fonte del lead

first_name         string             Nome contatto

last_name          string             Cognome contatto

email              string             Email contatto

phone              string             Telefono contatto

request_text       text               Testo della richiesta

extra_tags         JSON               Tag aggiuntivi

status             enum               Stato disponibilità (free,
sold_exclusive, sold_shared,
exhausted)

current_shares     integer            Numero condivisioni attuali

generated_at       date               Data generazione del lead

external_id        string             ID dal sistema esterno

created_at         timestamp          Data inserimento in piattaforma
  ------------------ ------------------ ---------------------------------

**Note:**

-   Un lead già condiviso NON può MAI tornare disponibile per esclusiva

-   Possono esistere duplicati (stessa email/telefono) su categorie
    diverse

-   Nessuna scadenza temporale dei lead

-   Hard delete solo da admin (es. spam)

-   Non si possono cancellare lead già acquistati

**2.8 PACKAGES (Pacchetti Lead)**

Pacchetti preconfigurati acquistabili.

  ------------------ ------------------ ---------------------------------
**Attributo**      **Tipo**           **Descrizione**

id                 PK                 Identificativo univoco

category_id        FK → Categories    Categoria (NULL = tutte)

name               string             Nome pacchetto

description        text               Descrizione

lead_quantity      integer            Quantità lead nel pacchetto

price              decimal            Prezzo totale (senza IVA)

allows_exclusive   boolean            Permette selezione lead esclusivi

allows_shared      boolean            Permette selezione lead condivisi

is_active          boolean            Pacchetto attivo

sort_order         integer            Ordine visualizzazione
  ------------------ ------------------ ---------------------------------

**Note:**

-   I prezzi NON sono scontati rispetto ai singoli lead

-   L\'utente specifica quanti esclusivi e quanti condivisi desidera

-   Sistema \"a scalare\": si acquista un monte lead, poi si selezionano
    manualmente

**2.9 ORDERS (Ordini)**

Ordini effettuati dai clienti.

  ------------------ ------------------ ---------------------------------
**Attributo**      **Tipo**           **Descrizione**

id                 PK                 Identificativo univoco

user_id            FK → Users         Cliente

order_number       string, unique     Numero ordine leggibile
(ORD-2024-00001)

type               enum               single \| package \| free_trial

payment_method     enum               card \| sepa \| free

subtotal           decimal            Totale senza IVA

vat_rate           decimal            Aliquota IVA (default 22%)

vat_amount         decimal            Importo IVA

total              decimal            Totale con IVA

status             enum               Stato ordine (pending,
processing, paid, failed,
refunded, cancelled)

billing_snapshot   JSON               Snapshot dati fatturazione al
momento ordine

paid_at            timestamp          Data/ora pagamento

created_at         timestamp          Data creazione
  ------------------ ------------------ ---------------------------------

**Note:**

-   IVA sempre esposta separatamente (B2B)

-   billing_snapshot congela i dati fatturazione al momento dell\'ordine

-   Nessun pagamento automatico/ricorrente

**2.10 ORDER_ITEMS (Righe Ordine)**

Dettaglio righe di ogni ordine.

  ------------------ ------------------ ---------------------------------
**Attributo**      **Tipo**           **Descrizione**

id                 PK                 Identificativo univoco

order_id           FK → Orders        Ordine padre

lead_id            FK → Leads         Lead singolo (se applicabile)

package_id         FK → Packages      Pacchetto (se applicabile)

acquisition_mode   enum               exclusive \| shared \| free

unit_price         decimal            Prezzo unitario

quantity           integer            Quantità

line_total         decimal            Totale riga
  ------------------ ------------------ ---------------------------------

**Note:**

-   Una riga ha SEMPRE o lead_id o package_id valorizzato (mai entrambi)

-   acquisition_mode si applica solo ai lead singoli

**2.11 USER_PACKAGES (Pacchetti Acquistati)**

Monte lead da consumare per ogni pacchetto acquistato.

  --------------------------- ------------------ ---------------------------------
**Attributo**               **Tipo**           **Descrizione**

id                          PK                 Identificativo univoco

user_id                     FK → Users         Cliente

package_id                  FK → Packages      Pacchetto acquistato

order_id                    FK → Orders        Ordine di riferimento

total_leads                 integer            Lead totali acquistati

exclusive_leads_total       integer            Lead esclusivi richiesti

exclusive_leads_remaining   integer            Lead esclusivi ancora da
selezionare

shared_leads_total          integer            Lead condivisi richiesti

shared_leads_remaining      integer            Lead condivisi ancora da
selezionare

status                      enum               active \| exhausted \| expired

filters                     JSON               Filtri opzionali (province, date
range, etc.)

purchased_at                timestamp          Data acquisto

exhausted_at                timestamp          Data esaurimento
  --------------------------- ------------------ ---------------------------------

**Note:**

-   Le quantità esclusivi/condivisi sono indipendenti

-   Se rimangono lead, l\'utente può attendere nuovi lead

-   Nessuna assegnazione automatica

**2.12 LEAD_SALES (Vendite Lead)**

Registro di ogni singola vendita/assegnazione lead.

  ------------------ ------------------ ---------------------------------
**Attributo**      **Tipo**           **Descrizione**

id                 PK                 Identificativo univoco

lead_id            FK → Leads         Lead venduto

user_id            FK → Users         Acquirente

order_id           FK → Orders        Ordine (NULL per gratuiti senza
ordine)

user_package_id    FK → User_Packages Se da pacchetto

mode               enum               exclusive \| shared \| free

share_slot         integer            Slot condivisione (1, 2, 3\...) -
NULL per esclusivi

price_paid         decimal            Prezzo pagato (0 per gratuiti)

sold_at            timestamp          Data/ora vendita
  ------------------ ------------------ ---------------------------------

**Note:**

-   UNIQUE (lead_id, user_id): un utente non può comprare lo stesso lead
    due volte

-   share_slot è sequenziale per ogni lead (1 = primo acquirente
    condiviso, 2 = secondo, etc.)

**2.13 USER_LEADS (Portafoglio Lead Utente)**

\"I miei lead\" - Lead posseduti da ogni utente.

  ------------------- ------------------ ---------------------------------
**Attributo**       **Tipo**           **Descrizione**

id                  PK                 Identificativo univoco

user_id             FK → Users         Proprietario

lead_id             FK → Leads         Lead

lead_sale_id        FK → Lead_Sales    Riferimento vendita

user_package_id     FK → User_Packages Se da pacchetto

acquisition_mode    enum               exclusive \| shared \| free

contact_status      enum               Stato contatto (new, contacted,
in_progress, not_interested,
converted, unreachable)

notes               text               Note dell\'utente

acquired_at         timestamp          Data acquisizione

last_contacted_at   timestamp          Ultimo contatto
  ------------------- ------------------ ---------------------------------

**Note:**

-   UNIQUE (user_id, lead_id): un lead può apparire una sola volta nel
    portafoglio di un utente

**2.14 CART_ITEMS (Carrello)**

Carrello temporaneo pre-acquisto.

  ------------------ ------------------ ---------------------------------
**Attributo**      **Tipo**           **Descrizione**

id                 PK                 Identificativo univoco

user_id            FK → Users         Utente

lead_id            FK → Leads         Lead (se singolo)

package_id         FK → Packages      Pacchetto (se pacchetto)

mode               enum               exclusive \| shared (per lead
singoli)

price              decimal            Prezzo al momento aggiunta

exclusive_count    integer            Lead esclusivi desiderati (per
pacchetti)

shared_count       integer            Lead condivisi desiderati (per
pacchetti)
  ------------------ ------------------ ---------------------------------

**Note:**

-   UNIQUE (user_id, lead_id): stesso lead non può essere nel carrello
    due volte

**2.15 TRANSACTIONS (Transazioni Stripe)**

Log completo transazioni pagamento.

  -------------------------- ------------------ ---------------------------------
**Attributo**              **Tipo**           **Descrizione**

id                         PK                 Identificativo univoco

order_id                   FK → Orders        Ordine

stripe_payment_intent_id   string, unique     Payment Intent ID

stripe_charge_id           string             Charge ID

stripe_customer_id         string             Customer ID

stripe_payment_method_id   string             Payment Method ID

payment_type               enum               card \| sepa_debit

amount                     decimal            Importo

currency                   string             Valuta (EUR)

status                     enum               Stato transazione (pending,
requires_action, processing,
succeeded, failed, canceled)

stripe_response            JSON               Risposta Stripe completa

metadata                   JSON               Metadati aggiuntivi

failure_code               string             Codice errore (se fallita)

failure_message            text               Messaggio errore

processed_at               timestamp          Data elaborazione
  -------------------------- ------------------ ---------------------------------

**Note:**

-   TUTTE le risposte Stripe sono archiviate integralmente (campo
    stripe_response)

-   Log estremamente accurato per gestione contestazioni

-   Rimborsi gestiti esternamente al sistema

**2.16 INVOICES (Fatture)**

Fatture elettroniche emesse.

  ------------------ ------------------ ---------------------------------
**Attributo**      **Tipo**           **Descrizione**

id                 PK                 Identificativo univoco

order_id           FK → Orders,       Ordine (1:1)
unique

invoice_number     string, unique     Numero fattura progressivo

fatture_cloud_id   string             ID su Fatture in Cloud

sdi_status         string             Stato invio SDI

invoice_data       JSON               Dati completi fattura

sdi_response       JSON               Risposta SDI

issued_at          timestamp          Data emissione

sent_to_sdi_at     timestamp          Data invio SDI
  ------------------ ------------------ ---------------------------------

**Note:**

-   Integrazione con Fatture in Cloud per invio a SDI

-   Fatture memorizzate localmente e ricercabili da backoffice

**2.17 NOTIFICATION_SETTINGS (Impostazioni Notifiche)**

Configurazione notifiche per categoria.

  ------------------ ------------------ ---------------------------------
**Attributo**      **Tipo**           **Descrizione**

id                 PK                 Identificativo univoco

category_id        FK → Categories    Categoria

email_enabled      boolean            Notifiche email attive

frequency          string             daily \| weekly \| custom

send_at            time               Ora di invio

days_of_week       JSON               Giorni settimana (se custom)
  ------------------ ------------------ ---------------------------------

**Note:**

-   Notifiche nuovi lead quotidiane (configurabili per categoria)

-   Inviate ai clienti che hanno acquistato in quella categoria

**2.18 ADMIN_ACTIVITY_LOGS (Log Attività Admin)**

Audit trail operazioni amministrative.

  ------------------ ------------------ ---------------------------------
**Attributo**      **Tipo**           **Descrizione**

id                 PK                 Identificativo univoco

admin_id           FK → Admins        Operatore

action             string             Azione (create, update, delete,
login, etc.)

entity_type        string             Tipo entità (Lead, User, Order,
etc.)

entity_id          bigint             ID entità

old_values         JSON               Valori precedenti

new_values         JSON               Nuovi valori

ip_address         string             IP

user_agent         string             Browser/client

created_at         timestamp          Data/ora
  ------------------ ------------------ ---------------------------------

**2.19 SYSTEM_SETTINGS (Configurazioni Sistema)**

Parametri configurabili globali.

  ------------------ ------------------ ---------------------------------
**Attributo**      **Tipo**           **Descrizione**

id                 PK                 Identificativo univoco

key                string, unique     Chiave configurazione

value              JSON               Valore

description        string             Descrizione
  ------------------ ------------------ ---------------------------------

**Note:**

-   default_free_trial_leads: numero default lead prova gratuita

-   default_vat_rate: aliquota IVA default

-   order_number_prefix: prefisso numeri ordine

**3. Stati del Lead**

Un lead può trovarsi in uno dei seguenti stati:

  ------------------ ----------------------------------------------------
**Stato**          **Descrizione**

free               Disponibile per acquisto esclusivo O condiviso

sold_exclusive     Venduto in esclusiva → non più disponibile

sold_shared        Venduto in condivisione (current_shares \<
max_shares)

exhausted          Condivisioni esaurite (current_shares = max_shares)
  ------------------ ----------------------------------------------------

**Transizioni di Stato:**

-   Libero → Venduto Esclusivo: quando un cliente acquista in esclusiva

-   Libero → Venduto Condiviso (1/N): quando il primo cliente acquista
    in condivisione

-   Venduto Condiviso (x/N) → Venduto Condiviso ((x+1)/N): acquisti
    successivi in condivisione

-   Venduto Condiviso ((N-1)/N) → Esaurito Condiviso (N/N): ultimo slot
    condiviso occupato

*Nota importante: Un lead già condiviso non può MAI tornare disponibile
per acquisto esclusivo.*

**4. Regole di Business**

**4.1 Ciclo di Vita del Lead**

1.  Inserimento: Lead entra con status = \'free\', current_shares = 0

2.  Acquisto Esclusivo: status → \'sold_exclusive\' (finale)

3.  Acquisto Condiviso: status → \'sold_shared\', current_shares += 1.
    Quando current_shares = category.max_shares → status → \'exhausted\'

**4.2 Vincoli di Integrità**

  ----------------------------------- -----------------------------------
**Vincolo**                         **Implementazione**

Un utente non può comprare lo       UNIQUE(lead_id, user_id) su
stesso lead due volte               LEAD_SALES

Lead esclusivo non più modificabile Check su status prima di ogni
vendita

Lead condiviso non può diventare    Business logic + status check
esclusivo

Lead acquistati non cancellabili    Check esistenza in LEAD_SALES prima
di DELETE
  ----------------------------------- -----------------------------------

**4.3 Prova Gratuita**

-   Flag free_trial_enabled su USER

-   Contatori free_trial_leads_total e free_trial_leads_used

-   Lead gratuiti NON contano nel conteggio condivisioni del lead

-   Registrati in LEAD_SALES con mode = \'free\'

**4.4 Sistema Pacchetti a Scalare**

4.  Acquisto crea record in USER_PACKAGES con remaining \> 0

5.  Ogni selezione lead scala il contatore appropriato
    (exclusive/shared)

6.  Quando entrambi i remaining = 0 → status = \'exhausted\'

7.  Lead non utilizzati restano disponibili indefinitamente

**5. Indici Consigliati**

Indici per performance query frequenti:

  ----------------------- ---------------------------- -----------------------
**Tabella**             **Indice**                   **Utilizzo**

LEADS                   (category_id, status,        Listing lead
generated_at)                disponibili

LEADS                   (category_id, province_id,   Filtro geografico
status)

LEAD_SALES              (lead_id, user_id)           Verifica doppio
acquisto

LEAD_SALES              (user_id, sold_at)           Storico acquisti utente

USER_LEADS              (user_id, contact_status)    Portafoglio per stato

ORDERS                  (user_id, status,            Lista ordini utente
created_at)

TRANSACTIONS            (stripe_payment_intent_id)   Lookup webhook Stripe
  ----------------------- ---------------------------- -----------------------

**6. Considerazioni di Scalabilità**

**6.1 Volume Stimato**

-   \~1.000 lead/mese (caso peggiore)

-   Crescita prevista: lineare

**6.2 Strategie di Scaling**

-   Partitioning: Possibile partizionamento LEADS per generated_at

-   Archiving: Lead vecchi e esauriti archiviabili su tabella separata

-   Read Replicas: Per query di reporting pesanti

-   Caching: Redis per catalogo lead e prezzi

**6.3 Manutenzione**

-   Pulizia periodica CART_ITEMS (carrelli abbandonati)

-   Archiviazione log API dopo X mesi

-   Backup giornalieri con retention policy

**7. Note Implementative**

**7.1 Transazionalità Critica**

Le seguenti operazioni devono essere atomiche:

**Acquisto Lead Singolo:**

-   Verifica disponibilità

-   Creazione order + order_item

-   Creazione lead_sale

-   Update lead status/current_shares

-   Creazione user_lead

**Acquisto Pacchetto:**

-   Creazione order + order_item

-   Creazione user_package

**Selezione Lead da Pacchetto:**

-   Verifica remaining \> 0

-   Verifica disponibilità lead

-   Decremento remaining

-   Creazione lead_sale

-   Update lead status

-   Creazione user_lead

**7.2 Concorrenza**

-   Optimistic Locking su LEADS (version column) per evitare race
    condition

-   Row-level locking durante acquisto per consistenza slot condivisi

*Documento generato per il progetto Qualead\*fied*

*Versione: 1.0*
