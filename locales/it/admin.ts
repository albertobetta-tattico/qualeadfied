export default {
  // ==========================================
  // DASHBOARD (admin/index.vue)
  // ==========================================
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Panoramica attivit\u00e0 e performance della piattaforma',

    kpis: {
      availableLeads: 'Lead Disponibili',
      soldLeadsMonth: 'Lead Venduti (Mese)',
      revenueMonth: 'Fatturato Mese',
      newClients: 'Nuovi Clienti',
    },

    recentLeads: {
      title: 'Lead Recenti',
      viewAll: 'Vedi tutti',
      empty: 'Nessun lead recente',
      headers: {
        name: 'Nome',
        category: 'Categoria',
        province: 'Provincia',
        status: 'Stato',
      },
    },

    recentOrders: {
      title: 'Ordini Recenti',
      viewAll: 'Vedi tutti',
      empty: 'Nessun ordine recente',
      headers: {
        order: 'Ordine',
        client: 'Cliente',
        amount: 'Importo',
        status: 'Stato',
        date: 'Data',
      },
    },

    topCategories: 'Top Categorie',
    topProvinces: 'Top Province',
    activityFeed: 'Attivit\u00e0 Recenti',

    leadStatuses: {
      free: 'Libero',
      exclusive: 'Esclusivo',
      shared: 'Condiviso',
      exhausted: 'Esaurito',
    },

    orderStatuses: {
      paid: 'Pagato',
      processing: 'In elaborazione',
      failed: 'Fallito',
      pending: 'In attesa',
    },
  },

  // ==========================================
  // CLIENTS (admin/clients/)
  // ==========================================
  clients: {
    // List (index.vue)
    list: {
      title: 'Clienti',
      subtitle: 'Gestione clienti registrati sulla piattaforma',

      kpis: {
        totalClients: 'Clienti Totali',
        activeClients: 'Clienti Attivi',
        pending: 'In Attesa',
        withFreeTrial: 'Con Prova Gratuita',
      },

      search: {
        placeholder: 'Cerca per azienda, email, telefono...',
      },

      filters: {
        showFilters: 'Mostra filtri',
        hideFilters: 'Nascondi filtri',
        clearFilters: 'Pulisci filtri',
        applyFilters: 'Applica Filtri',
        status: 'Stato',
        freeTrial: 'Prova Gratuita',
        statusOptions: {
          all: 'Tutti gli stati',
          active: 'Attivo',
          pending: 'In Attesa',
          suspended: 'Sospeso',
        },
        freeTrialOptions: {
          all: 'Tutti',
          active: 'Prova attiva',
          inactive: 'Prova non attiva',
          exhausted: 'Prova esaurita',
        },
      },

      table: {
        headers: {
          company: 'Azienda',
          contact: 'Referente',
          email: 'Email',
          phone: 'Telefono',
          status: 'Stato',
          freeTrial: 'Prova Gratuita',
          registration: 'Registrazione',
          actions: 'Azioni',
        },
        empty: 'Nessun cliente trovato',
        loading: 'Caricamento clienti...',
        freeTrialLabels: {
          inactive: 'Non attiva',
          exhausted: 'Esaurita',
          remaining: '{remaining}/{total} rimanenti',
        },
      },

      actions: {
        newClient: 'Nuovo Cliente',
        export: 'Export',
      },

      contextMenu: {
        viewDetails: 'Visualizza dettagli',
        resetPassword: 'Reset password',
        suspend: 'Sospendi',
        reactivate: 'Riattiva',
        delete: 'Elimina',
      },

      dialog: {
        deleteTitle: 'Conferma Eliminazione',
        deleteMessage: 'Sei sicuro di voler eliminare il cliente "{name}"? Questa azione non pu\u00f2 essere annullata.',
        deleteConfirm: 'Elimina',
        deleteCancel: 'Annulla',
      },

      toast: {
        deleteSuccess: 'Cliente "{name}" eliminato con successo',
        deleteError: 'Errore nell\'eliminazione del cliente',
        suspendSuccess: 'Cliente "{name}" sospeso',
        reactivateSuccess: 'Cliente "{name}" riattivato',
        resetPasswordSuccess: 'Email di reset password inviata a {email}',
      },
    },

    // Detail/Edit ([id].vue)
    edit: {
      editTitle: 'Modifica Cliente',
      statusLabel: 'Stato',
      registeredAt: 'Registrato il {date}',

      infoCards: {
        freeTrial: 'Prova Gratuita',
        emailVerified: 'Email Verificata',
        leadNotifications: 'Notifiche Lead',
        marketingConsent: 'Consenso Marketing',
        yes: 'S\u00ec',
        no: 'No',
        active: 'Attiva',
        inactive: 'Non Attiva',
        freeTrialRemaining: '{remaining}/{total} rimanenti',
      },

      tabs: {
        companyData: 'Dati Aziendali',
        billing: 'Fatturazione',
        settings: 'Impostazioni',
        history: 'Storico',
      },

      companyForm: {
        companyName: 'Ragione Sociale',
        vatNumber: 'Partita IVA',
        email: 'Email',
        phone: 'Telefono',
        firstName: 'Nome Referente',
        lastName: 'Cognome Referente',
      },

      billingForm: {
        address: 'Indirizzo',
        zip: 'CAP',
        city: 'Citt\u00e0',
        province: 'Provincia',
        sdiCode: 'Codice SDI',
        pec: 'PEC',
        bankData: 'Dati Bancari',
        iban: 'IBAN',
        bankName: 'Banca',
      },

      settingsTab: {
        categoriesOfInterest: 'Categorie di Interesse',
        accountSettings: 'Impostazioni Account',
        status: 'Stato Account',
        freeTrial: 'Prova Gratuita',
        leadNotifications: 'Notifiche Lead',
        marketingConsent: 'Consenso Marketing',
        dangerZone: 'Zona Pericolosa',
        resetPassword: 'Reset Password',
        resetPasswordDesc: 'Invia un\'email di reset password al cliente',
        suspendAccount: 'Sospendi Account',
        suspendAccountDesc: 'Sospendi temporaneamente l\'accesso del cliente',
        deleteAccount: 'Elimina Account',
        deleteAccountDesc: 'Elimina permanentemente il cliente e tutti i suoi dati',
      },

      saveButton: 'Salva Modifiche',

      toast: {
        saveSuccess: 'Cliente aggiornato con successo',
        saveError: 'Errore nell\'aggiornamento del cliente',
      },
    },

    // Create (create.vue)
    create: {
      createTitle: 'Nuovo Cliente',
      createSubtitle: 'Inserisci i dati per creare un nuovo cliente',

      sections: {
        companyData: 'Dati Aziendali',
        contactPerson: 'Persona di Riferimento',
        credentials: 'Credenziali di Accesso',
        billingData: 'Dati di Fatturazione',
        bankData: 'Dati Bancari',
        categoriesOfInterest: 'Categorie di Interesse',
        accountSettings: 'Impostazioni Account',
      },

      form: {
        companyName: 'Ragione Sociale',
        vatNumber: 'Partita IVA',
        email: 'Email',
        phone: 'Telefono',
        firstName: 'Nome',
        lastName: 'Cognome',
        password: 'Password',
        confirmPassword: 'Conferma Password',
        address: 'Indirizzo',
        zip: 'CAP',
        city: 'Citt\u00e0',
        province: 'Provincia',
        iban: 'IBAN',
        bankName: 'Banca',
        sdiCode: 'Codice SDI',
        pec: 'PEC',
        status: 'Stato',
        freeTrial: 'Prova Gratuita',
        freeLeads: 'Lead Gratuiti',
        leadNotifications: 'Notifiche Lead',
        marketingConsent: 'Consenso Marketing',
      },

      buttons: {
        cancel: 'Annulla',
        create: 'Crea Cliente',
      },

      toast: {
        createSuccess: 'Cliente "{name}" creato con successo',
        createError: 'Errore nella creazione del cliente',
      },
    },
  },

  // ==========================================
  // LEADS (admin/leads/)
  // ==========================================
  leads: {
    // List (index.vue)
    list: {
      title: 'Lead',
      subtitle: 'Gestione completa dei lead sulla piattaforma',

      kpis: {
        totalLeads: 'Lead Totali',
        available: 'Disponibili',
        exclusive: 'Esclusivi',
        shared: 'Condivisi',
        exhausted: 'Esauriti',
      },

      search: {
        placeholder: 'Cerca per nome, email, telefono...',
      },

      filters: {
        category: 'Categoria',
        province: 'Provincia',
        source: 'Fonte',
        status: 'Stato',
        mode: 'Modalit\u00e0',
        dateFrom: 'Data Da',
        dateTo: 'Data A',
        statusOptions: {
          all: 'Tutti gli stati',
          available: 'Disponibile',
          soldExclusive: 'Venduto Esclusivo',
          shared: 'Condiviso',
          exhausted: 'Esaurito',
        },
        modeOptions: {
          all: 'Tutte le modalit\u00e0',
          exclusive: 'Esclusivo',
          shared: 'Condiviso',
        },
        allCategories: 'Tutte le categorie',
        allProvinces: 'Tutte le province',
        allSources: 'Tutte le fonti',
      },

      table: {
        headers: {
          contact: 'Contatto',
          phone: 'Telefono',
          category: 'Categoria',
          province: 'Provincia',
          request: 'Richiesta',
          status: 'Stato',
          source: 'Fonte',
          leadDate: 'Data Lead',
          actions: 'Azioni',
        },
        empty: 'Nessun lead trovato',
        loading: 'Caricamento lead...',
      },

      actions: {
        newLead: 'Nuovo Lead',
        import: 'Import',
        export: 'Export',
        bulkDelete: 'Elimina selezionati',
      },

      contextMenu: {
        edit: 'Modifica',
        viewHistory: 'Visualizza storico',
        delete: 'Elimina',
      },

      dialog: {
        deleteTitle: 'Conferma Eliminazione',
        deleteMessage: 'Sei sicuro di voler eliminare {count} lead? Questa azione non pu\u00f2 essere annullata.',
        deleteSingleMessage: 'Sei sicuro di voler eliminare il lead "{name}"? Questa azione non pu\u00f2 essere annullata.',
      },

      toast: {
        deleteSuccess: '{count} lead eliminati con successo',
        deleteError: 'Errore nell\'eliminazione dei lead',
      },
    },

    // Detail/Edit ([id].vue)
    edit: {
      editTitle: 'Modifica Lead',
      editSubtitle: 'Modifica i dati del lead',

      infoCards: {
        category: 'Categoria',
        province: 'Provincia',
        source: 'Fonte',
        insertedAt: 'Inserito il',
      },

      tabs: {
        contactData: 'Dati Contatto',
        classification: 'Classificazione',
        requestDetails: 'Dettagli Richiesta',
        salesHistory: 'Storico Vendite',
      },

      contactForm: {
        firstName: 'Nome',
        lastName: 'Cognome',
        email: 'Email',
        phone: 'Telefono',
      },

      classificationForm: {
        category: 'Categoria Merceologica',
        province: 'Provincia',
        source: 'Fonte Lead',
        sellingMode: 'Modalit\u00e0 Vendita',
        externalId: 'ID Esterno',
        sellingModeOptions: {
          exclusive: 'Esclusivo',
          shared: 'Condiviso',
        },
      },

      requestForm: {
        requestText: 'Testo Richiesta',
        generatedAt: 'Data Generazione',
      },

      salesHistory: {
        empty: 'Nessuna vendita registrata',
        headers: {
          buyer: 'Acquirente',
          order: 'Ordine',
          type: 'Tipo',
          price: 'Prezzo',
          date: 'Data',
        },
      },

      warning: {
        notEditable: 'Questo lead non pu\u00f2 essere modificato perch\u00e9 \u00e8 gi\u00e0 stato venduto.',
      },

      saveButton: 'Salva Modifiche',

      toast: {
        saveSuccess: 'Lead aggiornato con successo',
        saveError: 'Errore nell\'aggiornamento del lead',
      },
    },

    // Create (create.vue)
    create: {
      createTitle: 'Nuovo Lead',
      createSubtitle: 'Inserisci i dati per creare un nuovo lead',

      sections: {
        classification: 'Classificazione',
        contactData: 'Dati Contatto',
        requestDetails: 'Dettagli Richiesta',
      },

      form: {
        category: 'Categoria Merceologica',
        categoryPlaceholder: 'Seleziona categoria',
        province: 'Provincia',
        provincePlaceholder: 'Seleziona provincia',
        provinceFilter: 'Cerca provincia...',
        source: 'Fonte Lead',
        sourcePlaceholder: 'Seleziona fonte',
        firstName: 'Nome',
        lastName: 'Cognome',
        email: 'Email',
        phone: 'Telefono',
        requestText: 'Testo Richiesta',
        requestTextPlaceholder: 'Descrivi la richiesta del contatto...',
        requestTextHint: 'Il testo della richiesta aiuta a qualificare il lead',
        generatedAt: 'Data Generazione',
        generatedAtHint: 'Data in cui il lead \u00e8 stato generato',
        externalId: 'ID Esterno',
        externalIdPlaceholder: 'Riferimento dal sistema esterno',
        externalIdHint: 'Identificativo nel sistema di origine (opzionale)',
      },

      buttons: {
        cancel: 'Annulla',
        saveAndCreateAnother: 'Salva e Crea Altro',
        create: 'Crea Lead',
      },

      toast: {
        createSuccess: 'Lead di "{name}" creato con successo',
        createError: 'Errore nella creazione del lead',
        formError: 'Correggi gli errori nel form prima di procedere',
      },
    },

    // Import (import.vue)
    import: {
      importTitle: 'Import Lead',
      importSubtitle: 'Importa lead da file CSV',

      steps: {
        file: 'File',
        config: 'Config',
        mapping: 'Mapping',
        verify: 'Verifica',
        result: 'Risultato',
      },

      step1: {
        title: 'Carica File',
        dropText: 'Trascina qui il file CSV oppure',
        selectFile: 'Seleziona File',
        supportedFormats: 'Formati supportati: CSV (max 10MB)',
        previewTitle: 'Anteprima dati',
        previewRows: 'Mostrate le prime {count} righe',
        headerCheckbox: 'La prima riga contiene le intestazioni delle colonne',
        continue: 'Continua',
      },

      step2: {
        title: 'Configurazione Import',
        category: 'Categoria',
        categoryHint: 'Tutti i lead importati saranno assegnati a questa categoria',
        source: 'Fonte',
        sourceHint: 'Origine dei lead importati',
        sourcePlaceholder: 'Seleziona fonte (opzionale)',
        duplicateStrategy: 'Gestione Duplicati',
        duplicateHint: 'Come gestire lead con email gi\u00e0 presenti nel sistema',
        duplicateOptions: {
          skip: 'Salta duplicati',
          update: 'Aggiorna esistenti',
          createAnyway: 'Crea comunque',
        },
        back: 'Indietro',
      },

      step3: {
        title: 'Mapping Campi',
        description: 'Associa le colonne del file ai campi del lead. I campi con * sono obbligatori.',
        fields: {
          firstName: 'Nome',
          lastName: 'Cognome',
          email: 'Email',
          phone: 'Telefono',
          provinceCode: 'Provincia (codice)',
          requestText: 'Testo Richiesta',
          externalId: 'ID Esterno',
          generatedAt: 'Data Generazione',
        },
        noMap: '-- Non mappare --',
        selectColumn: 'Seleziona colonna',
      },

      step4: {
        title: 'Verifica e Conferma',
        summary: 'Riepilogo Import',
        file: 'File',
        rowsToImport: 'Righe da importare',
        estimated: '(stimate)',
        notSpecified: 'Non specificata',
        mappingConfigured: 'Mapping configurato',
        importWarning: 'L\'import potrebbe richiedere alcuni minuti a seconda del numero di righe.',
        startImport: 'Avvia Import',
      },

      step5: {
        title: 'Risultato Import',
        totalRows: 'Righe totali',
        imported: 'Importati',
        skipped: 'Saltati',
        errorsTitle: 'Errori riscontrati ({count})',
        errorRow: 'Riga',
        errorMessage: 'Errore',
        successMessage: 'Import completato! {count} lead sono stati aggiunti al sistema.',
        newImport: 'Nuovo Import',
        goToList: 'Vai all\'elenco lead',
      },

      toast: {
        importSuccess: '{count} lead importati con successo',
        importWarning: '{count} righe con errori',
        importError: 'Errore durante l\'import',
        selectFile: 'Seleziona un file da importare',
        selectCategory: 'Seleziona una categoria',
        mapRequiredFields: 'Mappa tutti i campi obbligatori',
        invalidConfig: 'Configurazione non valida',
        excelReading: 'Lettura file Excel in corso...',
        excelNotSupported: 'Per ora \u00e8 supportato solo il formato CSV',
        unsupportedFormat: 'Formato file non supportato. Usa CSV o XLSX.',
      },
    },
  },

  // ==========================================
  // CATALOG (admin/catalog/)
  // ==========================================
  catalog: {
    title: 'Catalogo',
    subtitle: 'Gestione categorie merceologiche, province e pacchetti lead',

    categories: {
      title: 'Categorie Merceologiche',
      description: 'Gestisci le categorie dei lead e le regole di condivisione',
      total: 'Totali',
      active: 'Attive',
      availableLeads: 'Lead Disponibili',
    },

    provinces: {
      title: 'Province',
      description: 'Anagrafica province italiane per filtro geografico',
      total: 'Totali',
      active: 'Attive',
      regions: 'Regioni',
    },

    packages: {
      title: 'Pacchetti Lead',
      description: 'Configura bundle di lead acquistabili dai clienti',
      total: 'Totali',
      active: 'Attivi',
      sales: 'Vendite',
    },

    quickActions: {
      title: 'Azioni Rapide',
      newCategory: 'Nuova Categoria',
      newPackage: 'Nuovo Pacchetto',
      managePricing: 'Gestione Listini',
    },
  },

  // ==========================================
  // ORDERS (admin/orders/)
  // ==========================================
  orders: {
    list: {
      title: 'Ordini',
      subtitle: 'Gestione e monitoraggio degli ordini clienti',

      kpis: {
        totalOrders: 'Ordini Totali',
        totalRevenue: 'Fatturato Totale',
        ordersThisMonth: 'Ordini Questo Mese',
        pendingProcessing: 'In Attesa/Elaborazione',
      },

      search: {
        placeholder: 'Cerca per numero ordine, cliente...',
      },

      filters: {
        status: 'Stato',
        orderType: 'Tipo Ordine',
        paymentMethod: 'Metodo Pagamento',
        dateFrom: 'Data Da',
        dateTo: 'Data A',
      },

      table: {
        headers: {
          orderNumber: 'N\u00b0 Ordine',
          client: 'Cliente',
          type: 'Tipo',
          payment: 'Pagamento',
          total: 'Totale',
          status: 'Stato',
          date: 'Data',
          paidAt: 'Pagato il',
          actions: 'Azioni',
        },
        empty: 'Nessun ordine trovato',
        emptySubtext: 'Gli ordini verranno visualizzati qui quando i clienti effettueranno acquisti',
        loading: 'Caricamento ordini...',
        paginatorTemplate: 'Mostra {first} - {last} di {totalRecords} ordini',
      },

      actions: {
        export: 'Export',
      },

      contextMenu: {
        viewDetails: 'Visualizza dettagli',
        copyOrderNumber: 'Copia numero ordine',
        goToClient: 'Vai al cliente',
      },

      tooltip: {
        copyNumber: 'Copia numero',
        viewDetails: 'Visualizza dettagli',
        moreActions: 'Altre azioni',
      },
    },
  },

  // ==========================================
  // PRICING (admin/pricing/)
  // ==========================================
  pricing: {
    list: {
      title: 'Listini Prezzi',
      subtitle: 'Gestione prezzi per categoria merceologica',

      kpis: {
        totalCategories: 'Categorie Totali',
        withPrices: 'Con Prezzi Configurati',
        withoutPrices: 'Senza Prezzi',
        avgExclusivePrice: 'Prezzo Medio Esclusivo',
      },

      search: {
        placeholder: 'Cerca per nome categoria...',
      },

      filters: {
        category: 'Categoria',
        allCategories: 'Tutte le categorie',
      },

      table: {
        headers: {
          category: 'Categoria',
          categoryStatus: 'Stato Cat.',
          exclusivePrice: 'Prezzo Esclusivo',
          sharedPrices: 'Prezzi Condivisi',
          validFrom: 'Valido Da',
          lastUpdate: 'Ultimo Agg.',
          actions: 'Azioni',
        },
        empty: 'Nessun listino prezzi trovato',
        emptySubtext: 'I listini vengono creati automaticamente quando configuri i prezzi per una categoria.',
        loading: 'Caricamento listini...',
        paginatorTemplate: 'Mostra {first} - {last} di {totalRecords} listini',
        maxShares: 'Max {count} condivisioni',
        slots: '{count} slot',
      },

      actions: {
        priceHistory: 'Storico Prezzi',
      },

      tooltip: {
        editPrices: 'Modifica prezzi',
      },

      alert: {
        noPrices: '{count} categorie non hanno ancora prezzi configurati.',
        andMore: 'e altre {count}...',
      },

      dialog: {
        editTitle: 'Modifica Prezzi',
        createTitle: 'Configura Prezzi',
        exclusivePrice: 'Prezzo Esclusivo',
        exclusivePriceDesc: 'Prezzo per acquisto in modalit\u00e0 esclusiva (lead venduto una sola volta)',
        sharedPrices: 'Prezzi Condivisi',
        sharedPricesDesc: 'Prezzo per ogni slot di condivisione',
        copyToAll: 'Copia su tutti',
        copyToAllTooltip: 'Copia il prezzo del primo slot su tutti gli altri',
        slot: 'Slot {number}',
        slotBuyer: '({number}\u00b0 acquirente)',
        sharedPriceInfo: 'In base alle specifiche, il prezzo condiviso \u00e8 fisso indipendentemente dallo slot gi\u00e0 occupato. Puoi comunque differenziare i prezzi se necessario.',
        cancel: 'Annulla',
        save: 'Salva Prezzi',
      },

      toast: {
        saveSuccess: 'Prezzi per "{name}" salvati con successo',
        saveError: 'Errore nel salvataggio dei prezzi',
        priceCopied: 'Prezzo copiato su tutti gli slot',
        exclusivePositive: 'Il prezzo esclusivo deve essere un valore positivo',
        slotPositive: 'Il prezzo per lo slot {number} deve essere positivo',
      },
    },
  },

  // ==========================================
  // TRANSACTIONS (admin/transactions/)
  // ==========================================
  transactions: {
    list: {
      title: 'Transazioni',
      subtitle: 'Log completo delle transazioni Stripe',

      kpis: {
        totalTransactions: 'Transazioni Totali',
        completedVolume: 'Volume Completato',
        successRate: 'Tasso di Successo',
        pendingProcessing: 'In Attesa/Elaborazione',
      },

      search: {
        placeholder: 'Cerca per Payment Intent, ordine, cliente...',
      },

      filters: {
        status: 'Stato',
        paymentType: 'Tipo Pagamento',
        dateFrom: 'Data Da',
        dateTo: 'Data A',
        amountMin: 'Importo Min (\u20ac)',
        amountMax: 'Importo Max (\u20ac)',
      },

      table: {
        headers: {
          paymentIntent: 'Payment Intent',
          order: 'Ordine',
          client: 'Cliente',
          type: 'Tipo',
          amount: 'Importo',
          status: 'Stato',
          error: 'Errore',
          date: 'Data',
          processedAt: 'Elaborato il',
          actions: 'Azioni',
        },
        empty: 'Nessuna transazione trovata',
        emptySubtext: 'Le transazioni verranno visualizzate qui quando i clienti effettueranno pagamenti',
        loading: 'Caricamento transazioni...',
        paginatorTemplate: 'Mostra {first} - {last} di {totalRecords} transazioni',
      },

      actions: {
        export: 'Export',
      },

      tooltip: {
        viewDetails: 'Visualizza dettagli',
        openStripe: 'Apri su Stripe',
        copyId: 'Copia ID',
      },

      contextMenu: {
        viewDetails: 'Visualizza dettagli',
        openStripe: 'Apri su Stripe',
        copyPaymentIntentId: 'Copia Payment Intent ID',
        goToOrder: 'Vai all\'ordine',
        goToClient: 'Vai al cliente',
      },
    },
  },

  // ==========================================
  // INVOICES (admin/invoices/)
  // ==========================================
  invoices: {
    list: {
      title: 'Fatture',
      subtitle: 'Gestione fatture elettroniche e note di credito',

      kpis: {
        totalInvoices: 'Fatture Totali',
        totalRevenue: 'Totale Fatturato',
        pendingSdi: 'In Attesa SDI',
        sdiIssues: 'Problemi SDI',
      },

      search: {
        placeholder: 'Cerca per numero, cliente, P.IVA...',
      },

      filters: {
        type: 'Tipo',
        sdiStatus: 'Stato SDI',
      },

      table: {
        headers: {
          number: 'Numero',
          client: 'Cliente',
          order: 'Ordine',
          amount: 'Importo',
          sdiStatus: 'Stato SDI',
          issueDate: 'Data Emissione',
          fattureCloudId: 'ID Fatture Cloud',
          actions: 'Azioni',
        },
        empty: 'Nessuna fattura trovata',
        loading: 'Caricamento fatture...',
        paginatorTemplate: 'Mostra {first} - {last} di {totalRecords} fatture',
        vatNumber: 'P.IVA: {vat}',
      },

      contextMenu: {
        viewDetails: 'Visualizza dettagli',
        downloadPdf: 'Scarica PDF',
        sendByEmail: 'Invia via email',
        resendToSdi: 'Reinvia a SDI',
        createCreditNote: 'Crea nota di credito',
      },

      creditNote: {
        dialogTitle: 'Crea Nota di Credito',
        amount: 'Importo nota di credito:',
        reason: 'Motivo (opzionale)',
        reasonPlaceholder: 'Inserisci il motivo della nota di credito...',
        warning: 'La nota di credito verr\u00e0 emessa e inviata automaticamente a SDI. Questa operazione non pu\u00f2 essere annullata.',
        cancel: 'Annulla',
        create: 'Crea Nota di Credito',
      },

      toast: {
        resendSdiSuccess: 'Fattura "{number}" reinviata a SDI',
        resendSdiError: 'Errore nel reinvio a SDI',
        sendEmailSuccess: 'Fattura "{number}" inviata via email',
        sendEmailError: 'Errore nell\'invio email',
        creditNoteSuccess: 'Nota di credito "{number}" creata con successo',
        creditNoteError: 'Errore nella creazione della nota di credito',
        downloadSuccess: 'Download PDF avviato',
        downloadError: 'Errore nel download del PDF',
      },

      actions: {
        export: 'Export',
      },

      tooltip: {
        view: 'Visualizza',
        moreActions: 'Altre azioni',
      },
    },
  },

  // ==========================================
  // REPORTS (admin/reports/)
  // ==========================================
  reports: {
    title: 'Report',
    subtitle: 'Statistiche vendite, performance e analisi dati',

    period: 'Periodo:',

    customDates: {
      startDate: 'Data inizio',
      endDate: 'Data fine',
      apply: 'Applica',
    },

    refresh: 'Aggiorna dati',
    exportData: 'Export Dati',

    tabs: {
      salesStats: 'Statistiche Vendite',
      categoryPerformance: 'Performance Categorie',
      geographicAnalysis: 'Analisi Geografica',
      dataExport: 'Export Dati',
    },

    salesStats: {
      kpis: {
        totalRevenue: 'Ricavi Totali',
        totalOrders: 'Ordini Totali',
        soldLeads: 'Lead Venduti',
        avgOrderValue: 'Valore Medio Ordine',
      },
      vsPreviousPeriod: 'vs periodo prec.',
      revenueChart: 'Andamento Ricavi',
      ordersChart: 'Andamento Ordini',
      chartLabels: {
        revenue: 'Ricavi',
        orders: 'Ordini',
      },
    },

    categoryPerformance: {
      top5Chart: 'Top 5 Categorie per Ricavi',
      detailTitle: 'Dettaglio Performance',
      headers: {
        category: 'Categoria',
        totalLeads: 'Lead Totali',
        sold: 'Venduti',
        available: 'Disponibili',
        revenue: 'Ricavi',
        sellThrough: 'Sell-through',
      },
    },

    geographicAnalysis: {
      top5RegionsChart: 'Top 5 Regioni per Ricavi',
      regionPerformance: 'Performance per Regione',
      regionHeaders: {
        region: 'Regione',
        provinces: 'Province',
        totalLeads: 'Lead Totali',
        sold: 'Venduti',
        revenue: 'Ricavi',
      },
      topProvinces: 'Top Province',
      provinceHeaders: {
        province: 'Provincia',
        name: 'Nome',
        region: 'Regione',
        topCategory: 'Top Categoria',
        leads: 'Lead',
        sold: 'Venduti',
        revenue: 'Ricavi',
      },
    },

    dataExport: {
      description: 'Esporta i dati della piattaforma in formato Excel o CSV per analisi esterne o integrazione con altri sistemi.',
      recentExports: 'Export Recenti',
      dialogTitle: 'Export Dati',
      dataType: 'Tipo di dati',
      format: 'Formato',
      periodInfo: 'L\'export includer\u00e0 i dati filtrati in base al periodo selezionato ({period}).',
      cancel: 'Annulla',
      export: 'Esporta',
    },

    toast: {
      exportError: 'Errore durante l\'export',
    },
  },

  // ==========================================
  // SETTINGS (admin/settings/)
  // ==========================================
  settings: {
    title: 'Impostazioni',
    subtitle: 'Configurazione sistema, notifiche e gestione operatori',
    leadSources: 'Sorgenti Lead',

    tabs: {
      systemConfig: 'Configurazione Sistema',
      emailNotifications: 'Notifiche Email',
      adminOperators: 'Operatori Admin',
      activityLog: 'Log Attivit\u00e0',
    },

    systemConfig: {
      leadAndTrial: 'Lead e Prova Gratuita',
      freeTrialLeads: 'Lead Prova Gratuita Default',
      freeTrialLeadsHint: 'Numero di lead gratuiti per nuovi clienti',
      billing: 'Fatturazione',
      vatRate: 'Aliquota IVA Default (%)',
      orderPrefix: 'Prefisso Numero Ordine',
      orderPrefixPlaceholder: 'es. ORD-2024-',
      invoicePrefix: 'Prefisso Numero Fattura',
      invoicePrefixPlaceholder: 'es. FT-2024-',
      email: 'Email',
      senderEmail: 'Email Mittente',
      senderName: 'Nome Mittente',
      sendTestEmail: 'Invia Email di Test',
      saveConfig: 'Salva Configurazione',
    },

    emailNotifications: {
      description: 'Configura la frequenza di invio delle notifiche per ogni categoria di lead.',
      headers: {
        category: 'Categoria',
        enabled: 'Abilitata',
        frequency: 'Frequenza',
        description: 'Descrizione',
      },
      descriptions: {
        disabled: 'Notifiche disabilitate',
        instant: 'Email immediata per ogni nuovo lead',
        hourly: 'Riepilogo ogni ora',
        daily: 'Riepilogo giornaliero',
        weekly: 'Riepilogo settimanale',
      },
    },

    operators: {
      description: 'Gestisci gli account degli operatori con accesso al backoffice.',
      newOperator: 'Nuovo Operatore',
      headers: {
        operator: 'Operatore',
        role: 'Ruolo',
        status: 'Stato',
        lastAccess: 'Ultimo Accesso',
        actions: 'Azioni',
      },
      tooltip: {
        edit: 'Modifica',
        resetPassword: 'Reset Password',
        deactivate: 'Disattiva',
        reactivate: 'Riattiva',
        delete: 'Elimina',
      },
      dialog: {
        createTitle: 'Nuovo Operatore',
        editTitle: 'Modifica Operatore',
        firstName: 'Nome',
        lastName: 'Cognome',
        email: 'Email',
        role: 'Ruolo',
        password: 'Password',
        passwordConfirmation: 'Conferma Password',
        cancel: 'Annulla',
        createButton: 'Crea Operatore',
        editButton: 'Salva Modifiche',
      },
    },

    activityLog: {
      empty: 'Nessuna attivit\u00e0 trovata',
      search: 'Cerca nei log...',
      typeFilter: 'Tipo attivit\u00e0',
      entityFilter: 'Entit\u00e0',
      clearFilters: 'Pulisci filtri',
      headers: {
        date: 'Data',
        type: 'Tipo',
        operator: 'Operatore',
        entity: 'Entit\u00e0',
        description: 'Descrizione',
        ip: 'IP',
      },
    },

    testEmail: {
      dialogTitle: 'Invia Email di Test',
      description: 'Inserisci l\'indirizzo email a cui inviare il messaggio di test.',
      recipient: 'Email destinatario',
      placeholder: 'email@esempio.it',
      cancel: 'Annulla',
      send: 'Invia Test',
    },

    toast: {
      configSaved: 'Configurazione salvata con successo',
      configError: 'Errore nel salvataggio',
      notificationUpdated: 'Frequenza notifica aggiornata',
      notificationEnabled: 'Notifica abilitata',
      notificationDisabled: 'Notifica disabilitata',
      notificationError: 'Errore nell\'aggiornamento',
      operatorCreated: 'Operatore creato con successo',
      operatorUpdated: 'Operatore aggiornato con successo',
      operatorDeleted: 'Operatore eliminato',
      operatorDeactivated: 'Operatore disattivato',
      operatorReactivated: 'Operatore riattivato',
      operatorError: 'Errore nell\'operazione',
      resetPasswordSent: 'Email di reset inviata a {email}',
      resetPasswordError: 'Errore nel reset password',
      testEmailSent: 'Email di test inviata',
      testEmailError: 'Errore nell\'invio',
      formError: 'Correggi gli errori nel form',
      emailRequired: 'Inserisci un indirizzo email',
    },
  },

  // ==========================================
  // COMMON ADMIN STRINGS
  // ==========================================
  common: {
    save: 'Salva',
    cancel: 'Annulla',
    delete: 'Elimina',
    edit: 'Modifica',
    create: 'Crea',
    back: 'Indietro',
    continue: 'Continua',
    search: 'Cerca',
    export: 'Export',
    import: 'Import',
    filters: {
      show: 'Mostra filtri',
      hide: 'Nascondi filtri',
      clear: 'Pulisci filtri',
      apply: 'Applica Filtri',
      selectStatus: 'Seleziona stato',
      selectType: 'Seleziona tipo',
      selectDate: 'Seleziona data',
    },
    actions: 'Azioni',
    viewDetails: 'Visualizza dettagli',
    moreActions: 'Altre azioni',
    loading: 'Caricamento...',
    noResults: 'Nessun risultato',
    confirmDelete: 'Conferma Eliminazione',
  },
}
