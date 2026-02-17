export default {
  toast: {
    summaries: {
      success: 'Successo',
      error: 'Errore',
      info: 'Info',
      warning: 'Attenzione',
    },
    auth: {
      loginSuccess: 'Accesso effettuato con successo',
      invalidCredentials: 'Credenziali non valide',
      registrationComplete: 'Registrazione completata!',
      registrationError: 'Errore durante la registrazione',
      formErrors: 'Correggi gli errori nel form',
      emailSentSuccess: 'Email inviata con successo',
      emailSentError: 'Errore durante l\'invio dell\'email',
      emailResent: 'Email inviata nuovamente',
      emailResendError: 'Errore durante l\'invio',
      passwordResetSuccess: 'Password reimpostata con successo',
      passwordResetError: 'Errore durante il reset della password',
      emailVerifiedSuccess: 'Email verificata con successo!',
      resendEmailSuccess: 'Email inviata nuovamente',
    },
    cart: {
      addedToCart: 'Aggiunto al carrello',
      addedToCartDetail: 'Il lead \u00e8 stato aggiunto al carrello',
    },
    trial: {
      leadsRedeemed: '{count} lead riscattati con successo!',
      redeemError: 'Errore nel riscatto',
      maxSelection: 'Puoi selezionare al massimo {count} lead',
      alreadyMaxSelected: 'Hai gi\u00e0 selezionato il massimo di {count} lead',
      addedWithLimit: 'Aggiunti {count} lead (limite raggiunto)',
      selectAtLeastOne: 'Seleziona almeno un lead',
    },
  },
  // Alias flat keys usati da registrati.vue (notifications.auth.*)
  auth: {
    loginSuccess: 'Accesso effettuato con successo',
    loginError: 'Credenziali non valide',
    registerSuccess: 'Registrazione completata!',
    registerError: 'Errore durante la registrazione',
    emailResent: 'Email inviata nuovamente',
  },
  confirm: {
    logout: {
      message: 'Sei sicuro di voler uscire?',
      header: 'Conferma Logout',
      acceptLabel: 'Esci',
      rejectLabel: 'Annulla',
    },
    removeFromCart: {
      message: 'Sei sicuro di voler rimuovere questo lead dal carrello?',
      header: 'Rimuovi dal carrello',
      acceptLabel: 'Rimuovi',
      rejectLabel: 'Annulla',
    },
    clearCart: {
      message: 'Sei sicuro di voler svuotare il carrello?',
      header: 'Svuota carrello',
      acceptLabel: 'Svuota',
      rejectLabel: 'Annulla',
    },
    purchase: {
      message: 'Confermi l\'acquisto per un totale di {total}?',
      header: 'Conferma acquisto',
      acceptLabel: 'Conferma',
      rejectLabel: 'Annulla',
    },
    claimTrial: {
      message: 'Confermi il riscatto di {count} lead gratuiti?',
      header: 'Riscatta lead gratuiti',
      acceptLabel: 'Riscatta',
      rejectLabel: 'Annulla',
    },
  },
}
