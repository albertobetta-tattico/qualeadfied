export default {
  // Main profile page
  title: 'Il Mio Profilo',
  subtitle: 'Gestisci le tue informazioni personali',
  logout: 'Esci',

  // Tabs/navigation
  tabs: {
    personalInfo: 'Dati Personali',
    preferences: 'Preferenze',
    billing: 'Dati Fatturazione',
    security: 'Sicurezza',
  },

  // Company info
  company: {
    title: 'Dati Azienda',
    companyName: 'Ragione Sociale',
    vatNumber: 'Partita IVA',
    email: 'Email',
    editNote: 'Per modificare i dati aziendali contatta il supporto',
  },

  // Personal info
  personalInfo: {
    title: 'Dati Personali',
    firstName: 'Nome',
    lastName: 'Cognome',
    phone: 'Telefono',
    save: 'Salva',
    cancel: 'Annulla',
  },

  // Account management sidebar
  accountManagement: {
    title: 'Gestione Account',
    billingData: 'Dati Fatturazione',
    security: 'Sicurezza',
    preferences: 'Preferenze',
  },

  // Account status
  accountStatus: {
    title: 'Stato Account',
    billingData: 'Dati fatturazione',
    billingComplete: 'Completi',
    billingIncomplete: 'Da completare',
    freeTrial: 'Prova gratuita',
    freeTrialLeads: '{count} lead',
    freeTrialExhausted: 'Esaurita',
    notifications: 'Notifiche',
    notificationsEmail: 'Notifiche email',
    notificationsActive: 'Attive',
    notificationsInactive: 'Disattive',
    marketing: 'Marketing',
    marketingActive: 'Attivo',
    marketingInactive: 'Disattivo',
  },

  // Support
  support: {
    needHelp: 'Hai bisogno di aiuto?',
    contactSupport: 'Contatta Supporto',
  },

  // Toast
  toast: {
    profileUpdated: 'Profilo aggiornato',
    errorUpdating: 'Errore nell\'aggiornamento',
  },

  // Preferences page
  preferences: {
    title: 'Preferenze',
    subtitle: 'Gestisci le notifiche e le comunicazioni',
    backToProfile: 'Torna al profilo',

    // Email notifications
    emailNotifications: {
      title: 'Notifiche Email',
      toggle: 'Notifiche sui nuovi lead',
      description: 'Ricevi email quando ci sono nuovi lead nelle tue categorie di interesse',
      includes: 'Le notifiche includono:',
      newLeads: 'Nuovi lead disponibili nelle tue categorie',
      orderConfirmations: 'Conferme d\'ordine e fatture',
      packageExpiry: 'Scadenza pacchetti attivi',
      accountUpdates: 'Aggiornamenti importanti sull\'account',
    },

    // Marketing
    marketing: {
      title: 'Comunicazioni Marketing',
      toggle: 'Newsletter e promozioni',
      description: 'Ricevi aggiornamenti su offerte speciali, promozioni e novita',
      includes: 'Le comunicazioni marketing includono:',
      offers: 'Offerte e sconti esclusivi',
      newPackages: 'Nuovi pacchetti e funzionalita',
      conversionTips: 'Consigli per migliorare le conversioni',
      unsubscribeNote: 'Puoi annullare l\'iscrizione in qualsiasi momento cliccando sul link presente in ogni email.',
    },

    // Current status
    currentStatus: {
      title: 'Stato Attuale',
    },

    // Privacy
    privacy: {
      title: 'La tua privacy',
      description: 'I tuoi dati sono protetti e non vengono mai condivisi con terze parti per scopi di marketing.',
      readPolicy: 'Leggi la Privacy Policy',
    },

    // Toast
    toast: {
      emailEnabled: 'Notifiche email attivate',
      emailDisabled: 'Notifiche email disattivate',
      marketingEnabled: 'Consenso marketing attivato',
      marketingDisabled: 'Consenso marketing disattivato',
    },
  },

  // Billing page
  billing: {
    title: 'Dati di Fatturazione',
    subtitle: 'Gestisci i dati per la fatturazione elettronica',
    backToProfile: 'Torna al profilo',

    // Address section
    addressTitle: 'Indirizzo di Fatturazione',
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

    // Electronic invoicing
    electronicInvoicing: {
      title: 'Fatturazione Elettronica',
      description: 'Inserisci il Codice SDI oppure l\'indirizzo PEC per la ricezione delle fatture elettroniche.',
      sdiCode: 'Codice SDI',
      sdiCodePlaceholder: 'ABC1234',
      sdiCodeHelp: '7 caratteri alfanumerici',
      pecEmail: 'Email PEC',
      pecEmailPlaceholder: 'azienda@pec.it',
    },

    // Save
    saveChanges: 'Salva Modifiche',

    // Info card
    infoTitle: 'Fatturazione Elettronica',
    infoDescription: 'Le fatture vengono emesse e inviate elettronicamente al Sistema di Interscambio (SDI) dell\'Agenzia delle Entrate.',

    // Help
    help: {
      title: 'Aiuto',
      whatIsSdi: 'Cos\'e il Codice SDI?',
      sdiDescription: 'E il codice univoco che identifica il canale di ricezione delle fatture elettroniche.',
      noSdi: 'Non ho il Codice SDI',
      noSdiDescription: 'Puoi usare l\'indirizzo PEC della tua azienda come alternativa.',
    },

    // Toast
    toast: {
      billingUpdated: 'Dati fatturazione aggiornati',
      errorUpdating: 'Errore nell\'aggiornamento',
      errorFormValidation: 'Correggi gli errori nel form',
    },

    // Validation
    validation: {
      addressRequired: 'Inserisci l\'indirizzo',
      cityRequired: 'Inserisci la citta',
      provinceRequired: 'Inserisci la provincia',
      zipRequired: 'Inserisci il CAP',
      zipInvalid: 'CAP non valido (5 cifre)',
      sdiOrPecRequired: 'Inserisci il codice SDI o la PEC',
      sdiInvalid: 'Codice SDI non valido (7 caratteri)',
      pecInvalid: 'Email PEC non valida',
    },
  },

  // Security page
  security: {
    title: 'Sicurezza',
    subtitle: 'Gestisci la password e le impostazioni di sicurezza',
    backToProfile: 'Torna al profilo',

    // Password change
    changePassword: {
      title: 'Cambia Password',
      currentPassword: 'Password Attuale',
      currentPasswordPlaceholder: 'Inserisci la password attuale',
      newPassword: 'Nuova Password',
      newPasswordPlaceholder: 'Inserisci la nuova password',
      confirmPassword: 'Conferma Password',
      confirmPasswordPlaceholder: 'Conferma la nuova password',
      submit: 'Cambia Password',
    },

    // Password strength
    strength: {
      weak: 'Debole',
      fair: 'Discreta',
      good: 'Buona',
      strong: 'Forte',
    },

    // Requirements
    requirements: {
      title: 'Requisiti Password',
      minLength: 'Almeno 8 caratteri',
      uppercase: 'Una lettera maiuscola',
      lowercase: 'Una lettera minuscola',
      number: 'Almeno un numero',
    },

    // Tips
    tips: {
      title: 'Consigli di Sicurezza',
      noReuse: 'Non riutilizzare password di altri siti',
      useManager: 'Usa un password manager',
      noShare: 'Non condividere la tua password',
    },

    // Validation
    validation: {
      currentRequired: 'Inserisci la password attuale',
      newRequired: 'Inserisci la nuova password',
      newWeak: 'Min. 8 caratteri, 1 maiuscola, 1 minuscola, 1 numero',
      confirmRequired: 'Conferma la nuova password',
      noMatch: 'Le password non coincidono',
    },

    // Toast
    toast: {
      passwordChanged: 'Password modificata con successo',
      errorChanging: 'Errore nel cambio password',
      errorFormValidation: 'Correggi gli errori nel form',
    },
  },
}
