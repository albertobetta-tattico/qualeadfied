export default {
  // Packages list page (pacchetti/index.vue)
  title: 'Pacchetti Lead',
  subtitle: 'Acquista pacchetti di lead a prezzi scontati. Piu lead acquisti, piu risparmi.',

  // Filter
  filters: {
    allCategories: 'Tutte le categorie',
    filterByCategory: 'Filtra per categoria',
  },

  // Active packages link
  myActivePackages: 'I miei pacchetti attivi',

  // Package card
  card: {
    allCategories: 'Tutte le categorie',
    leads: 'lead',
    perLead: '/ lead',
    exclusiveLeads: '{count} lead esclusivi + {shared} condivisi',
    validity: 'Validita {days} giorni',
    savings: 'Risparmi {amount}',
    freeSelection: 'Selezione libera dal catalogo',
    buyPackage: 'Acquista Pacchetto',
  },

  // Empty state
  empty: {
    title: 'Nessun pacchetto disponibile',
    subtitle: 'Al momento non ci sono pacchetti disponibili per questa categoria',
  },

  // Info section
  info: {
    savingsTitle: 'Risparmia fino al 30%',
    savingsDescription: 'I pacchetti offrono sconti significativi rispetto all\'acquisto singolo',
    freeSelectionTitle: 'Selezione Libera',
    freeSelectionDescription: 'Scegli tu quali lead riscattare dal catalogo durante la validita',
    flexibleTitle: 'Validita Flessibile',
    flexibleDescription: 'Hai tempo per utilizzare i tuoi lead, senza fretta',
  },

  // Active packages page (pacchetti/attivi.vue)
  active: {
    title: 'I Miei Pacchetti',
    subtitle: 'Gestisci i tuoi pacchetti lead attivi',
    buyNew: 'Acquista Nuovo Pacchetto',

    // Package card
    allCategories: 'Tutte le categorie',
    daysRemaining: '{count} giorni rimanenti',
    purchasedOn: 'Acquistato il {date} - Scade il {expiry}',
    leadsUsed: 'Lead utilizzati',
    leadsRemaining: '{count} lead rimanenti',
    selectLeads: 'Seleziona Lead',

    // Expiring warning
    expiringWarning: 'Questo pacchetto scade tra {days} giorni. Utilizza i {remaining} lead rimanenti prima della scadenza.',

    // Empty state
    empty: {
      title: 'Nessun pacchetto attivo',
      subtitle: 'Non hai ancora acquistato nessun pacchetto lead',
      explore: 'Esplora Pacchetti',
    },

    // Benefits reminder
    whyBuy: {
      title: 'Perche acquistare un pacchetto?',
      description: 'I pacchetti ti permettono di risparmiare fino al 30% rispetto all\'acquisto di singoli lead. Inoltre hai la flessibilita di scegliere quali lead riscattare durante il periodo di validita.',
      learnMore: 'Scopri di piu',
    },
  },

  // Select leads page (pacchetti/[id]/seleziona.vue)
  select: {
    title: 'Seleziona Lead',
    backToPackages: 'Torna ai pacchetti',
    leadsAvailable: '{name} - {count} lead disponibili',
    selectedCount: '{selected} / {total} selezionati',
    redeemLeads: 'Riscatta Lead',

    // Package info card
    packageInfo: {
      available: 'Disponibili',
      used: 'Utilizzati',
      total: 'Totale',
      exclusiveTitle: 'Esclusivi',
      sharedTitle: 'Condivisi',
      remainingOf: '{remaining} / {total}',
      pickingSummary: 'Stai selezionando: {exclusive} esclusivi + {shared} condivisi',
    },

    // Lead card
    leadCard: {
      leadId: 'Lead #{id}',
      availability: {
        exclusive: 'Esclusiva disponibile',
        shared: 'Condiviso ({available}/{total} slot)',
      },
      modeToggle: {
        exclusive: 'Esclusivo',
        shared: 'Condiviso',
      },
    },

    // Floating action bar
    floatingBar: {
      selected: '{count} lead selezionati',
      redeemHint: 'Clicca su "Riscatta Lead" per aggiungerli al tuo portafoglio',
      cancel: 'Annulla',
      redeem: 'Riscatta Lead',
      summaryMixed: 'Stai per acquisire {exclusive} in esclusiva e {shared} condivisi',
      summaryExclusiveOnly: 'Stai per acquisire {exclusive} in esclusiva',
      summarySharedOnly: 'Stai per acquisire {shared} condivisi',
      leadExclusiveSingular: '1 lead',
      leadExclusivePlural: '{count} lead',
      leadSharedSingular: '1 lead',
      leadSharedPlural: '{count} lead',
    },

    // Empty state
    empty: {
      title: 'Nessun lead disponibile',
      subtitle: 'Al momento non ci sono lead disponibili per questa categoria',
      categoryExhausted: 'Tutti i lead della categoria "{category}" sono già stati assegnati o non sono disponibili al momento. Puoi visualizzare tutti i lead disponibili oppure riprovare più tardi.',
      refresh: 'Ricarica',
      showAllCategories: 'Mostra tutti i lead disponibili',
    },

    // Toast
    toast: {
      redeemed: '{count} lead riscattati con successo!',
      errorRedeeming: 'Errore nel riscatto',
      selectAtLeast: 'Seleziona almeno un lead',
      bothBudgetsEmpty: 'Hai esaurito sia gli slot esclusivi sia quelli condivisi del pacchetto',
      noCapacityForLead: 'Questo lead non è disponibile nelle modalità rimaste nel pacchetto',
    },
  },

  // Purchase page (pacchetti/[id]/acquista.vue)
  purchase: {
    title: 'Acquista Pacchetto',
    subtitle: 'Completa l\'acquisto del pacchetto',
    backToPackages: 'Torna ai pacchetti',

    // Billing (shared with checkout)
    billing: {
      title: 'Dati di Fatturazione',
      companyName: 'Ragione Sociale',
      vatNumber: 'Partita IVA',
      address: 'Indirizzo',
      addressPlaceholder: 'Via, numero civico',
      city: 'Citta',
      cityPlaceholder: 'Citta',
      province: 'Provincia',
      provincePlaceholder: 'MI',
      zip: 'CAP',
      zipPlaceholder: '20100',
      country: 'Paese',
      sdiCode: 'Codice SDI',
      sdiCodePlaceholder: 'ABC1234',
      pecEmail: 'Email PEC',
      pecEmailPlaceholder: 'azienda@pec.it',
    },

    // Payment method
    payment: {
      title: 'Metodo di Pagamento',
      cardOption: 'Carta di Credito/Debito',
      cardDescription: 'Visa, Mastercard, American Express',
      sepaOption: 'Addebito SEPA',
      sepaDescription: 'Bonifico bancario diretto',
    },

    // Summary
    summary: {
      title: 'Riepilogo Ordine',
      leads: '{count} lead',
      savings: 'Risparmi',
      vat: 'IVA ({rate}%)',
      total: 'Totale',
      validity: 'Validita {days} giorni',
      exclusiveAndShared: '{exclusive} lead esclusivi + {shared} condivisi',
      freeSelection: 'Selezione libera dal catalogo',
      processing: 'Elaborazione...',
      payButton: 'Paga {amount}',
      securePayment: 'Pagamento sicuro con Stripe',
    },

    // Toast
    toast: {
      success: 'Pacchetto acquistato con successo!',
      sepaPending: 'Ordine ricevuto. Effettua il bonifico: l\'amministratore attiverà il pacchetto appena lo riceve.',
      errorPurchase: 'Errore nell\'acquisto',
      errorBilling: 'Errore nell\'aggiornamento dati fatturazione',
      errorFormValidation: 'Correggi gli errori nel form',
    },
  },

  // Free trial confirm
  confirm: {
    claimTrial: {
      message: 'Confermi il riscatto di {count} lead gratuiti?',
      header: 'Riscatta lead gratuiti',
      accept: 'Riscatta',
      reject: 'Annulla',
    },
  },
}
