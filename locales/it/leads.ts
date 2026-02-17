export default {
  // Catalog page (leads/index.vue)
  catalog: {
    title: 'Catalogo Lead',
    available: '{count} lead disponibili',
    cartButton: 'Carrello ({count})',

    // Filters
    filters: {
      category: 'Categoria',
      categoryPlaceholder: 'Seleziona categoria',
      allCategories: 'Tutte le categorie',
      province: 'Provincia',
      provincePlaceholder: 'Seleziona provincia',
      allProvinces: 'Tutte le province',
      mode: 'Modalita',
      modePlaceholder: 'Seleziona modalita',
      allModes: 'Tutte le modalita',
      exclusive: 'Esclusivo',
      shared: 'Condiviso',
      dateGenerated: 'Data generazione',
      datePlaceholder: 'Seleziona periodo',
      filter: 'Filtra',
      resetFilters: 'Reset filtri',
    },

    // Bulk actions
    bulk: {
      selected: '{count} lead selezionati',
      purchasable: '({count} acquistabili)',
      mode: 'Modalita:',
      total: 'Totale:',
      addToCart: 'Aggiungi {count} al carrello',
      deselectAll: 'Deseleziona tutti',
    },

    // Table headers
    table: {
      id: 'ID',
      category: 'Categoria',
      province: 'Provincia',
      region: 'Regione',
      request: 'Richiesta',
      availability: 'Disponibilita',
      slots: '{count} slot',
      date: 'Data',
      price: 'Prezzo',
      exclusivePrice: 'Esclusivo',
      sharedPrice: 'Condiviso',
      actions: 'Azioni',
    },

    // Cart status
    inCart: 'Nel carrello',
    inCartExclusive: 'Escl.',
    inCartShared: 'Cond.',
    addExclusive: 'Esclusivo',
    addShared: 'Condiviso',

    // Empty state
    empty: {
      title: 'Nessun lead trovato',
      subtitle: 'Prova a modificare i filtri di ricerca',
      resetFilters: 'Reset filtri',
    },

    // Toast messages
    toast: {
      addedMultiple: '{count} lead aggiunti al carrello',
      notAdded: '{count} lead non aggiunti',
      selectAtLeast: 'Seleziona almeno un lead',
    },
  },

  // My Leads page (i-miei-lead/index.vue)
  myLeads: {
    title: 'I Miei Lead',
    subtitle: '{count} lead nel tuo portafoglio',

    // Stats
    stats: {
      total: 'Totale Lead',
      toContact: 'Da Contattare',
      converted: 'Convertiti',
      conversionRate: 'Conversione',
    },

    // Filters
    filters: {
      category: 'Categoria',
      categoryAll: 'Tutte',
      province: 'Provincia',
      provinceAll: 'Tutte',
      status: 'Stato',
      mode: 'Modalita',
      allModes: 'Tutte le modalita',
      exclusive: 'Esclusivo',
      shared: 'Condiviso',
      purchaseDate: 'Data acquisto',
      datePlaceholder: 'Seleziona periodo',
      filter: 'Filtra',
    },

    // Export
    export: {
      button: 'Esporta',
      csv: 'Esporta CSV',
      excel: 'Esporta Excel',
    },

    // Buy lead
    buyLead: 'Acquista Lead',

    // Table
    table: {
      id: 'ID',
      contact: 'Contatto',
      phone: 'Telefono',
      category: 'Categoria',
      province: 'Provincia',
      region: 'Regione',
      status: 'Stato',
      mode: 'Modalita',
      price: 'Prezzo',
      purchaseDate: 'Data Acquisto',
      actions: 'Azioni',
    },

    // Actions
    actions: {
      markContacted: 'Segna come contattato',
      viewDetails: 'Vedi dettagli',
    },

    // Empty state
    empty: {
      title: 'Nessun lead nel portafoglio',
      subtitle: 'Inizia ad acquistare lead per costruire il tuo portafoglio clienti',
      catalog: 'Vai al Catalogo',
      buyPackage: 'Acquista Pacchetto',
    },

    // Toast messages
    toast: {
      statusUpdated: 'Stato aggiornato',
      errorUpdating: 'Errore nell\'aggiornamento',
      exportCompleted: 'Export completato',
      errorExport: 'Errore nell\'export',
    },
  },

  // Lead Detail page (i-miei-lead/[id].vue)
  detail: {
    backToLeads: 'Torna ai miei lead',
    purchasedOn: 'Acquistato il {date}',
    status: 'Stato:',

    // Contact info
    contactInfo: {
      title: 'Informazioni di Contatto',
      email: 'Email',
      phone: 'Telefono',
      sendEmail: 'Invia Email',
      call: 'Chiama',
    },

    // Request details
    requestDetails: {
      title: 'Dettagli Richiesta',
      generatedAt: 'Richiesta generata {time} ({date})',
    },

    // Custom fields
    customFields: {
      title: 'Informazioni Aggiuntive',
    },

    // Notes
    notes: {
      title: 'Note',
      placeholder: 'Aggiungi note sul lead...',
      save: 'Salva',
      cancel: 'Annulla',
      clickToAdd: 'Clicca per aggiungere note',
    },

    // Status card
    statusCard: {
      title: 'Stato Lead',
      lastContact: 'Ultimo contatto',
      purchased: 'Acquistato',
    },

    // Purchase info
    purchaseInfo: {
      title: 'Dettagli Acquisto',
      price: 'Prezzo',
      mode: 'Modalita',
      order: 'Ordine',
    },

    // Quick actions
    quickActions: {
      title: 'Azioni Rapide',
      markContacted: 'Segna come contattato',
      inProgress: 'In lavorazione',
      notInterested: 'Non interessato',
    },

    // Toast messages
    toast: {
      statusUpdated: 'Stato aggiornato',
      errorUpdating: 'Errore nell\'aggiornamento',
      notesSaved: 'Note salvate',
      errorSavingNotes: 'Errore nel salvataggio',
      copiedToClipboard: '{label} copiato negli appunti',
    },
  },

  // Contact statuses
  status: {
    all: 'Tutti gli stati',
    new: 'Nuovo',
    contacted: 'Contattato',
    inProgress: 'In lavorazione',
    notInterested: 'Non interessato',
    converted: 'Convertito',
  },

  // Lead statuses (admin/catalog)
  leadStatus: {
    free: 'Disponibile',
    soldExclusive: 'Venduto Esclusivo',
    soldShared: 'Condiviso',
    exhausted: 'Esaurito',
  },

  // Acquisition types
  acquisitionType: {
    all: 'Tutti i tipi',
    exclusive: 'Esclusivo',
    shared: 'Condiviso',
    freeTrial: 'Prova Gratuita',
  },

  // Validation errors (from useLead.ts)
  validation: {
    required: '{field} e obbligatorio',
    emailRequired: 'L\'email e obbligatoria',
    emailInvalid: 'Formato email non valido',
    phoneRequired: 'Il telefono e obbligatorio',
    phoneInvalid: 'Formato telefono non valido',
    selectCategory: 'Seleziona una categoria',
    selectProvince: 'Seleziona una provincia',
    selectSource: 'Seleziona una fonte',
    dateRequired: 'La data di generazione e obbligatoria',
    dateInvalid: 'Data non valida',
    dateFuture: 'La data non puo essere nel futuro',
    firstNameRequired: 'Il nome e obbligatorio',
    lastNameRequired: 'Il cognome e obbligatorio',
    nameMinLength: 'Il nome deve avere almeno 2 caratteri',
    lastNameMinLength: 'Il cognome deve avere almeno 2 caratteri',
    slugMinLength: 'Lo slug deve avere almeno 2 caratteri',
    slugFormat: 'Lo slug puo contenere solo lettere minuscole, numeri e trattini',
  },

  // Confirm dialogs (from useLead.ts)
  confirm: {
    delete: {
      message: 'Sei sicuro di voler eliminare il lead di "{name}"? Questa azione non puo essere annullata.',
      header: 'Conferma Eliminazione',
      accept: 'Elimina',
      reject: 'Annulla',
    },
    bulkDelete: {
      message: 'Sei sicuro di voler eliminare {count} lead selezionati? I lead gia venduti verranno ignorati.',
      header: 'Conferma Eliminazione Multipla',
      accept: 'Elimina',
      reject: 'Annulla',
    },
    cannotDelete: {
      summary: 'Operazione non consentita',
      detail: 'Non e possibile eliminare un lead gia venduto',
    },
  },

  // Toast summaries (from useLead.ts)
  toast: {
    success: 'Operazione completata',
    error: 'Errore',
    info: 'Informazione',
    warning: 'Attenzione',
  },
}
