export default {
  // Page title
  title: 'Carrello',
  itemsInCart: '{count} lead nel carrello',
  continueShopping: 'Continua lo shopping',
  emptyCartButton: 'Svuota carrello',

  // Empty state
  empty: {
    title: 'Il carrello è vuoto',
    subtitle: 'Inizia ad aggiungere lead dal catalogo',
    cta: 'Vai al Catalogo',
  },

  // Cart group items
  item: {
    purchaseOf: 'Acquisto di',
    leadsCategory: 'lead categoria',
    exclusive: 'esclusivi',
    shared: 'condivisi',
    provinces: 'Province',
    removeGroup: 'Rimuovi gruppo',
    seeAllProvinces: 'Vedi tutte le {count} province',
    removalNote: 'La rimozione elimina tutti i {count} lead di questo gruppo. Non è possibile modificare i singoli lead.',
    andOthers: 'e altre {count}',
  },

  // Order summary
  summary: {
    title: 'Riepilogo Ordine',
    subtotal: 'Subtotale ({count} lead)',
    vat: 'IVA ({rate}%)',
    total: 'Totale',
    checkout: 'Procedi al Checkout',
    securePayment: 'Pagamento sicuro con Stripe',
  },

  // Benefits
  benefits: {
    verified: 'Lead verificati e di qualita',
    immediate: 'Accesso immediato dopo il pagamento',
    guarantee: 'Garanzia soddisfatti o rimborsati',
  },

  // Confirm dialogs
  confirm: {
    removeGroup: {
      message: 'Vuoi rimuovere tutti i {count} lead {mode} della categoria "{category}"?',
      header: 'Rimuovi gruppo',
      accept: 'Rimuovi',
      reject: 'Annulla',
    },
    clearCart: {
      message: 'Sei sicuro di voler svuotare il carrello?',
      header: 'Svuota carrello',
      accept: 'Svuota',
      reject: 'Annulla',
    },
    removeFromCart: {
      message: 'Sei sicuro di voler rimuovere questo lead dal carrello?',
      header: 'Rimuovi dal carrello',
      accept: 'Rimuovi',
      reject: 'Annulla',
    },
    purchase: {
      message: 'Confermi l\'acquisto per un totale di {total}?',
      header: 'Conferma acquisto',
      accept: 'Conferma',
      reject: 'Annulla',
    },
  },

  // Toast messages
  toast: {
    addedToCart: {
      summary: 'Aggiunto al carrello',
      detail: 'Il lead e stato aggiunto al carrello',
    },
    groupRemoved: 'Gruppo rimosso ({count} lead)',
    cartCleared: 'Carrello svuotato',
    errorRemoving: 'Errore nella rimozione',
    errorClearing: 'Errore nello svuotamento',
    errorAddingToCart: 'Errore nell\'aggiunta al carrello',
  },

  // Checkout page
  checkout: {
    title: 'Checkout',
    subtitle: 'Completa il tuo ordine',
    backToCart: 'Torna al carrello',

    // Billing
    billingTitle: 'Dati di Fatturazione',
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
    sdiOrPecNote: '* Inserisci il Codice SDI oppure la PEC per la fatturazione elettronica',

    // Payment
    paymentTitle: 'Metodo di Pagamento',
    cardOption: 'Carta di Credito/Debito',
    cardDescription: 'Visa, Mastercard, American Express',
    sepaOption: 'Addebito SEPA',
    sepaDescription: 'Bonifico bancario diretto',
    stripeSecure: 'I pagamenti sono processati in modo sicuro da Stripe. Non memorizziamo i dati della tua carta.',

    // Summary
    subtotal: 'Subtotale',
    leadItem: 'Lead #{id}',
    processing: 'Elaborazione...',
    payButton: 'Paga {amount}',
    terms: 'Procedendo accetti i',
    termsOfService: 'Termini di Servizio',
    and: 'e la',
    privacyPolicy: 'Privacy Policy',

    // Empty cart on checkout
    emptyTitle: 'Carrello vuoto',
    emptySubtitle: 'Aggiungi dei lead al carrello per procedere al checkout',
    emptyCta: 'Vai al Catalogo',

    // Toast
    orderCompleted: 'Ordine completato con successo!',
    errorPayment: 'Errore nel pagamento',
    errorCreatingPayment: 'Errore nella creazione del pagamento',
    errorBillingUpdate: 'Errore nell\'aggiornamento dati fatturazione',
    errorFormValidation: 'Correggi gli errori nel form',
  },

  // Purchase modes
  purchaseMode: {
    exclusive: 'Esclusivo',
    shared: 'Condiviso',
  },
}
