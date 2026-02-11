export default {
  // Orders list page (ordini/index.vue)
  list: {
    title: 'I Miei Ordini',
    subtitle: 'Storico dei tuoi ordini e fatture',
    buyLead: 'Acquista Lead',

    // Filters
    filters: {
      status: 'Stato',
      allStatuses: 'Tutti gli stati',
      orderType: 'Tipo Ordine',
      allTypes: 'Tutti i tipi',
      filter: 'Filtra',
      reset: 'Reset',
    },

    // Table
    table: {
      order: 'Ordine',
      date: 'Data',
      type: 'Tipo',
      leads: 'Lead',
      total: 'Totale',
      status: 'Stato',
      actions: 'Azioni',
    },

    // Actions
    actions: {
      details: 'Dettagli',
      downloadInvoice: 'Scarica fattura',
    },

    // Stats
    stats: {
      totalOrders: 'Ordini totali',
      totalSpent: 'Spesa totale',
      completedOrders: 'Ordini completati',
    },

    // Empty state
    empty: {
      title: 'Nessun ordine',
      subtitle: 'Non hai ancora effettuato nessun ordine',
      catalog: 'Vai al Catalogo',
      buyPackage: 'Acquista Pacchetto',
    },

    // Toast
    toast: {
      downloadStarted: 'Download avviato',
      errorDownload: 'Errore nel download',
    },
  },

  // Order detail page (ordini/[id].vue)
  detail: {
    backToOrders: 'Torna agli ordini',
    orderTitle: 'Ordine {number}',
    createdAt: 'Effettuato il {date}',
    downloadInvoice: 'Scarica Fattura',
    print: 'Stampa',

    // Items
    items: {
      title: 'Lead Acquistati ({count})',
      emptyMessage: 'Dettagli lead non disponibili',
    },

    // Billing
    billing: {
      title: 'Dati di Fatturazione',
      companyName: 'Ragione Sociale',
      vatNumber: 'Partita IVA',
      address: 'Indirizzo',
      sdiCode: 'Codice SDI',
      pec: 'PEC',
    },

    // Summary
    summary: {
      title: 'Riepilogo Ordine',
      subtotal: 'Subtotale',
      vat: 'IVA ({rate}%)',
      total: 'Totale',
    },

    // Payment
    payment: {
      title: 'Pagamento',
      method: 'Metodo',
      status: 'Stato',
      paidAt: 'Data pagamento',
      transactionId: 'ID Transazione',
    },

    // Invoice
    invoice: {
      title: 'Fattura',
      number: 'Numero',
      downloadPdf: 'Scarica PDF',
    },

    // Help
    help: {
      message: 'Hai bisogno di assistenza per questo ordine?',
      contactSupport: 'Contatta Supporto',
    },
  },

  // Order statuses
  status: {
    pending: 'In attesa',
    paid: 'Pagato',
    processing: 'In elaborazione',
    completed: 'Completato',
    failed: 'Fallito',
    refunded: 'Rimborsato',
    cancelled: 'Annullato',
  },

  // Order types
  type: {
    all: 'Tutti i tipi',
    single: 'Singolo',
    package: 'Pacchetto',
    freeTrial: 'Prova Gratuita',
  },

  // Payment methods
  paymentMethod: {
    all: 'Tutti i metodi',
    card: 'Carta di Credito',
    cardFull: 'Carta di credito',
    sepa: 'Addebito SEPA',
    free: 'Gratuito',
  },

  // Acquisition modes
  acquisitionMode: {
    exclusive: 'Esclusivo',
    shared: 'Condiviso',
    free: 'Gratuito',
  },

  // Order descriptions (from useOrder.ts)
  description: {
    packagePurchase: 'Acquisto pacchetto',
    freeTrialLeads: '{count} lead gratuiti',
    singleLeads: '{count} lead singoli',
  },

  // Toast (from useOrder.ts)
  toast: {
    success: 'Operazione completata',
    error: 'Errore',
    info: 'Informazione',
    warning: 'Attenzione',
    orderNumberCopied: 'Numero ordine "{number}" copiato negli appunti',
    cannotCopy: 'Impossibile copiare negli appunti',
  },

  // Transactions (from useTransaction.ts)
  transactions: {
    title: 'Transazioni',

    // Statuses
    status: {
      all: 'Tutti gli stati',
      pending: 'In Attesa',
      requiresAction: 'Azione Richiesta',
      processing: 'In Elaborazione',
      succeeded: 'Completata',
      failed: 'Fallita',
      canceled: 'Annullata',
    },

    // Payment types
    paymentType: {
      all: 'Tutti i tipi',
      card: 'Carta di Credito',
      sepaDebit: 'Addebito SEPA',
    },

    // Failure codes
    failureCodes: {
      cardDeclined: 'Carta Rifiutata',
      insufficientFunds: 'Fondi Insufficienti',
      expiredCard: 'Carta Scaduta',
      incorrectCvc: 'CVC Non Valido',
      processingError: 'Errore di Elaborazione',
      incorrectNumber: 'Numero Carta Non Valido',
      authenticationRequired: 'Autenticazione Richiesta',
      bankAccountDeclined: 'Conto Rifiutato',
      debitNotAuthorized: 'Addebito Non Autorizzato',
    },

    // Toast
    toast: {
      paymentIntentCopied: 'Payment Intent ID copiato negli appunti',
      chargeIdCopied: 'Charge ID copiato negli appunti',
      stripeResponseCopied: 'Risposta Stripe copiata negli appunti',
      cannotCopy: 'Impossibile copiare negli appunti',
    },
  },

  // Invoices (from useInvoice.ts)
  invoices: {
    title: 'Fatture',

    // Types
    type: {
      all: 'Tutti i tipi',
      invoice: 'Fattura',
      invoicePlural: 'Fatture',
      creditNote: 'Nota di Credito',
      creditNotePlural: 'Note di Credito',
    },

    // SDI statuses
    sdiStatus: {
      all: 'Tutti gli stati',
      pending: 'In Attesa',
      sent: 'Inviata',
      delivered: 'Consegnata',
      accepted: 'Accettata',
      rejected: 'Rifiutata',
      notDelivered: 'Non Consegnata',
      error: 'Errore',
    },

    // Confirm dialogs
    confirm: {
      resendSdi: {
        message: 'Reinviare la fattura "{number}" a SDI?',
        header: 'Reinvio a SDI',
        accept: 'Reinvia',
        reject: 'Annulla',
      },
      sendEmail: {
        message: 'Inviare la fattura "{number}" via email al cliente?',
        header: 'Invio Email',
        accept: 'Invia',
        reject: 'Annulla',
      },
      createCreditNote: {
        message: 'Creare una nota di credito per la fattura "{number}"? L\'importo sara di {amount}.',
        header: 'Crea Nota di Credito',
        accept: 'Crea',
        reject: 'Annulla',
      },
    },
  },
}
