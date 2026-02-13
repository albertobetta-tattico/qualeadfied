export default {
  // ==========================================
  // DASHBOARD (admin/index.vue)
  // ==========================================
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Platform activity and performance overview',

    kpis: {
      availableLeads: 'Available Leads',
      soldLeadsMonth: 'Sold Leads (Month)',
      revenueMonth: 'Monthly Revenue',
      newClients: 'New Clients',
      trend: '{trend} compared to last month',
    },

    recentLeads: {
      title: 'Recent Leads',
      viewAll: 'View all',
      empty: 'No recent leads',
      headers: {
        name: 'Name',
        category: 'Category',
        province: 'Province',
        status: 'Status',
      },
    },

    recentOrders: {
      title: 'Recent Orders',
      viewAll: 'View all',
      empty: 'No recent orders',
      headers: {
        order: 'Order',
        client: 'Client',
        amount: 'Amount',
        status: 'Status',
        date: 'Date',
      },
    },

    topCategories: 'Top Categories',
    topProvinces: 'Top Provinces',
    activityFeed: 'Recent Activity',

    leadStatuses: {
      free: 'Free',
      exclusive: 'Exclusive',
      shared: 'Shared',
      exhausted: 'Exhausted',
    },

    orderStatuses: {
      paid: 'Paid',
      processing: 'Processing',
      failed: 'Failed',
      pending: 'Pending',
    },
  },

  // ==========================================
  // CLIENTS (admin/clients/)
  // ==========================================
  clients: {
    // List (index.vue)
    list: {
      title: 'Clients',
      subtitle: 'Manage clients registered on the platform',

      kpis: {
        totalClients: 'Total Clients',
        activeClients: 'Active Clients',
        pending: 'Pending',
        withFreeTrial: 'With Free Trial',
      },

      search: {
        placeholder: 'Search by company, email, phone...',
      },

      filters: {
        showFilters: 'Show filters',
        hideFilters: 'Hide filters',
        clearFilters: 'Clear filters',
        applyFilters: 'Apply Filters',
        status: 'Status',
        freeTrial: 'Free Trial',
        statusOptions: {
          all: 'All statuses',
          active: 'Active',
          pending: 'Pending',
          suspended: 'Suspended',
        },
        freeTrialOptions: {
          all: 'All',
          active: 'Trial active',
          inactive: 'Trial not active',
          exhausted: 'Trial exhausted',
        },
      },

      table: {
        headers: {
          company: 'Company',
          contact: 'Contact Person',
          email: 'Email',
          phone: 'Phone',
          status: 'Status',
          freeTrial: 'Free Trial',
          registration: 'Registration',
          actions: 'Actions',
        },
        vatPrefix: 'VAT',
        empty: 'No clients found',
        loading: 'Loading clients...',
        freeTrialLabels: {
          inactive: 'Not active',
          exhausted: 'Exhausted',
          remaining: '{remaining}/{total} remaining',
        },
      },

      actions: {
        newClient: 'New Client',
        export: 'Export',
      },

      contextMenu: {
        viewDetails: 'View details',
        resetPassword: 'Reset password',
        suspend: 'Suspend',
        reactivate: 'Reactivate',
        delete: 'Delete',
      },

      dialog: {
        deleteTitle: 'Confirm Deletion',
        deleteMessage: 'Are you sure you want to delete the client "{name}"? This action cannot be undone.',
        deleteConfirm: 'Delete',
        deleteCancel: 'Cancel',
      },

      toast: {
        deleteSuccess: 'Client "{name}" successfully deleted',
        deleteError: 'Error deleting client',
        suspendSuccess: 'Client "{name}" suspended',
        reactivateSuccess: 'Client "{name}" reactivated',
        resetPasswordSuccess: 'Password reset email sent to {email}',
      },
    },

    // Detail/Edit ([id].vue)
    edit: {
      editTitle: 'Edit Client',
      statusLabel: 'Status',
      registeredAt: 'Registered on {date}',

      infoCards: {
        freeTrial: 'Free Trial',
        emailVerified: 'Email Verified',
        leadNotifications: 'Lead Notifications',
        marketingConsent: 'Marketing Consent',
        yes: 'Yes',
        no: 'No',
        active: 'Active',
        inactive: 'Not Active',
        freeTrialRemaining: '{remaining}/{total} remaining',
      },

      tabs: {
        companyData: 'Company Data',
        billing: 'Billing',
        settings: 'Settings',
        history: 'History',
      },

      companyForm: {
        companyName: 'Company Name',
        vatNumber: 'VAT Number',
        email: 'Email',
        phone: 'Phone',
        firstName: 'Contact Person First Name',
        lastName: 'Contact Person Last Name',
      },

      billingForm: {
        address: 'Address',
        zip: 'ZIP Code',
        city: 'City',
        province: 'Province',
        sdiCode: 'SDI Code',
        pec: 'PEC',
        bankData: 'Bank Details',
        iban: 'IBAN',
        bankName: 'Bank',
      },

      settingsTab: {
        categoriesOfInterest: 'Categories of Interest',
        accountSettings: 'Account Settings',
        status: 'Account Status',
        freeTrial: 'Free Trial',
        leadNotifications: 'Lead Notifications',
        marketingConsent: 'Marketing Consent',
        dangerZone: 'Danger Zone',
        resetPassword: 'Reset Password',
        resetPasswordDesc: 'Send a password reset email to the client',
        suspendAccount: 'Suspend Account',
        suspendAccountDesc: 'Temporarily suspend client access',
        deleteAccount: 'Delete Account',
        deleteAccountDesc: 'Permanently delete the client and all their data',
      },

      saveButton: 'Save Changes',

      toast: {
        saveSuccess: 'Client successfully updated',
        saveError: 'Error updating client',
      },
    },

    // Create (create.vue)
    create: {
      createTitle: 'New Client',
      createSubtitle: 'Enter the details to create a new client',

      sections: {
        companyData: 'Company Data',
        contactPerson: 'Contact Person',
        credentials: 'Access Credentials',
        billingData: 'Billing Data',
        bankData: 'Bank Details',
        categoriesOfInterest: 'Categories of Interest',
        accountSettings: 'Account Settings',
      },

      form: {
        companyName: 'Company Name',
        vatNumber: 'VAT Number',
        email: 'Email',
        phone: 'Phone',
        firstName: 'First Name',
        lastName: 'Last Name',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        address: 'Address',
        zip: 'ZIP Code',
        city: 'City',
        province: 'Province',
        iban: 'IBAN',
        bankName: 'Bank',
        sdiCode: 'SDI Code',
        pec: 'PEC',
        status: 'Status',
        freeTrial: 'Free Trial',
        freeLeads: 'Free Leads',
        leadNotifications: 'Lead Notifications',
        marketingConsent: 'Marketing Consent',
      },

      buttons: {
        cancel: 'Cancel',
        create: 'Create Client',
      },

      toast: {
        createSuccess: 'Client "{name}" successfully created',
        createError: 'Error creating client',
      },
    },
  },

  // ==========================================
  // LEADS (admin/leads/)
  // ==========================================
  leads: {
    // List (index.vue)
    list: {
      title: 'Leads',
      subtitle: 'Complete lead management on the platform',

      kpis: {
        totalLeads: 'Total Leads',
        available: 'Available',
        exclusive: 'Exclusive',
        shared: 'Shared',
        exhausted: 'Exhausted',
      },

      search: {
        placeholder: 'Search by name, email, phone...',
      },

      filters: {
        category: 'Category',
        province: 'Province',
        source: 'Source',
        status: 'Status',
        mode: 'Mode',
        dateFrom: 'Date From',
        dateTo: 'Date To',
        statusOptions: {
          all: 'All statuses',
          available: 'Available',
          soldExclusive: 'Sold Exclusive',
          shared: 'Shared',
          exhausted: 'Exhausted',
        },
        modeOptions: {
          all: 'All modes',
          exclusive: 'Exclusive',
          shared: 'Shared',
        },
        allCategories: 'All categories',
        allProvinces: 'All provinces',
        allSources: 'All sources',
      },

      table: {
        headers: {
          contact: 'Contact',
          phone: 'Phone',
          category: 'Category',
          province: 'Province',
          request: 'Request',
          status: 'Status',
          source: 'Source',
          leadDate: 'Lead Date',
          actions: 'Actions',
        },
        empty: 'No leads found',
        loading: 'Loading leads...',
      },

      actions: {
        newLead: 'New Lead',
        import: 'Import',
        export: 'Export',
        bulkDelete: 'Delete selected',
      },

      contextMenu: {
        edit: 'Edit',
        viewHistory: 'View history',
        delete: 'Delete',
      },

      dialog: {
        deleteTitle: 'Confirm Deletion',
        deleteMessage: 'Are you sure you want to delete {count} leads? This action cannot be undone.',
        deleteSingleMessage: 'Are you sure you want to delete the lead "{name}"? This action cannot be undone.',
      },

      toast: {
        deleteSuccess: '{count} leads successfully deleted',
        deleteError: 'Error deleting leads',
      },
    },

    // Detail/Edit ([id].vue)
    edit: {
      editTitle: 'Edit Lead',
      editSubtitle: 'Edit lead data',

      infoCards: {
        category: 'Category',
        province: 'Province',
        source: 'Source',
        insertedAt: 'Inserted on',
      },

      tabs: {
        contactData: 'Contact Data',
        classification: 'Classification',
        requestDetails: 'Request Details',
        salesHistory: 'Sales History',
      },

      contactForm: {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
      },

      classificationForm: {
        category: 'Product Category',
        province: 'Province',
        source: 'Lead Source',
        sellingMode: 'Selling Mode',
        externalId: 'External ID',
        sellingModeOptions: {
          exclusive: 'Exclusive',
          shared: 'Shared',
        },
      },

      requestForm: {
        requestText: 'Request Text',
        generatedAt: 'Generation Date',
      },

      salesHistory: {
        empty: 'No sales recorded',
        headers: {
          buyer: 'Buyer',
          order: 'Order',
          type: 'Type',
          price: 'Price',
          date: 'Date',
        },
      },

      warning: {
        notEditable: 'This lead cannot be edited because it has already been sold.',
      },

      saveButton: 'Save Changes',

      toast: {
        saveSuccess: 'Lead successfully updated',
        saveError: 'Error updating lead',
      },
    },

    // Create (create.vue)
    create: {
      createTitle: 'New Lead',
      createSubtitle: 'Enter the details to create a new lead',

      sections: {
        classification: 'Classification',
        contactData: 'Contact Data',
        requestDetails: 'Request Details',
      },

      form: {
        category: 'Product Category',
        categoryPlaceholder: 'Select category',
        province: 'Province',
        provincePlaceholder: 'Select province',
        provinceFilter: 'Search province...',
        source: 'Lead Source',
        sourcePlaceholder: 'Select source',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        requestText: 'Request Text',
        requestTextPlaceholder: 'Describe the contact\'s request...',
        requestTextHint: 'The request text helps qualify the lead',
        generatedAt: 'Generation Date',
        generatedAtHint: 'Date when the lead was generated',
        externalId: 'External ID',
        externalIdPlaceholder: 'Reference from external system',
        externalIdHint: 'Identifier in the source system (optional)',
      },

      buttons: {
        cancel: 'Cancel',
        saveAndCreateAnother: 'Save and Create Another',
        create: 'Create Lead',
      },

      toast: {
        createSuccess: 'Lead for "{name}" successfully created',
        createError: 'Error creating lead',
        formError: 'Fix the errors in the form before proceeding',
      },
    },

    // Import (import.vue)
    import: {
      importTitle: 'Import Leads',
      importSubtitle: 'Import leads from CSV file',

      steps: {
        file: 'File',
        config: 'Config',
        mapping: 'Mapping',
        verify: 'Verify',
        result: 'Result',
      },

      step1: {
        title: 'Upload File',
        dropText: 'Drag the CSV file here or',
        selectFile: 'Select File',
        supportedFormats: 'Supported formats: CSV (max 10MB)',
        previewTitle: 'Data preview',
        previewRows: 'Showing first {count} rows',
        headerCheckbox: 'The first row contains column headers',
        continue: 'Continue',
      },

      step2: {
        title: 'Import Configuration',
        category: 'Category',
        categoryHint: 'All imported leads will be assigned to this category',
        source: 'Source',
        sourceHint: 'Origin of imported leads',
        sourcePlaceholder: 'Select source (optional)',
        duplicateStrategy: 'Duplicate Management',
        duplicateHint: 'How to handle leads with emails already in the system',
        duplicateOptions: {
          skip: 'Skip duplicates',
          update: 'Update existing',
          createAnyway: 'Create anyway',
        },
        back: 'Back',
      },

      step3: {
        title: 'Field Mapping',
        description: 'Map the file columns to lead fields. Fields marked with * are required.',
        fields: {
          firstName: 'First Name',
          lastName: 'Last Name',
          email: 'Email',
          phone: 'Phone',
          provinceCode: 'Province (code)',
          requestText: 'Request Text',
          externalId: 'External ID',
          generatedAt: 'Generation Date',
        },
        noMap: '-- Do not map --',
        selectColumn: 'Select column',
      },

      step4: {
        title: 'Verify and Confirm',
        summary: 'Import Summary',
        file: 'File',
        rowsToImport: 'Rows to import',
        estimated: '(estimated)',
        notSpecified: 'Not specified',
        mappingConfigured: 'Mapping configured',
        importWarning: 'The import may take a few minutes depending on the number of rows.',
        startImport: 'Start Import',
      },

      step5: {
        title: 'Import Result',
        totalRows: 'Total rows',
        imported: 'Imported',
        skipped: 'Skipped',
        errorsTitle: 'Errors found ({count})',
        errorRow: 'Row',
        errorMessage: 'Error',
        successMessage: 'Import completed! {count} leads have been added to the system.',
        newImport: 'New Import',
        goToList: 'Go to lead list',
      },

      toast: {
        importSuccess: '{count} leads successfully imported',
        importWarning: '{count} rows with errors',
        importError: 'Error during import',
        selectFile: 'Select a file to import',
        selectCategory: 'Select a category',
        mapRequiredFields: 'Map all required fields',
        invalidConfig: 'Invalid configuration',
        excelReading: 'Reading Excel file...',
        excelNotSupported: 'Only CSV format is currently supported',
        unsupportedFormat: 'Unsupported file format. Use CSV or XLSX.',
      },
    },
  },

  // ==========================================
  // CATALOG (admin/catalog/)
  // ==========================================
  catalog: {
    title: 'Catalog',
    subtitle: 'Manage product categories, provinces, and lead packages',

    categories: {
      title: 'Product Categories',
      description: 'Manage lead categories and sharing rules',
      total: 'Total',
      active: 'Active',
      availableLeads: 'Available Leads',
    },

    provinces: {
      title: 'Provinces',
      description: 'Italian provinces directory for geographic filtering',
      total: 'Total',
      active: 'Active',
      regions: 'Regions',
    },

    packages: {
      title: 'Lead Packages',
      description: 'Configure lead bundles purchasable by clients',
      total: 'Total',
      active: 'Active',
      sales: 'Sales',
    },

    quickActions: {
      title: 'Quick Actions',
      newCategory: 'New Category',
      newPackage: 'New Package',
      managePricing: 'Manage Pricing',
    },
  },

  // ==========================================
  // ORDERS (admin/orders/)
  // ==========================================
  orders: {
    list: {
      title: 'Orders',
      subtitle: 'Client order management and monitoring',

      kpis: {
        totalOrders: 'Total Orders',
        totalRevenue: 'Total Revenue',
        ordersThisMonth: 'Orders This Month',
        pendingProcessing: 'Pending/Processing',
      },

      search: {
        placeholder: 'Search by order number, client...',
      },

      filters: {
        status: 'Status',
        orderType: 'Order Type',
        paymentMethod: 'Payment Method',
        dateFrom: 'Date From',
        dateTo: 'Date To',
      },

      table: {
        headers: {
          orderNumber: 'Order No.',
          client: 'Client',
          type: 'Type',
          payment: 'Payment',
          total: 'Total',
          status: 'Status',
          date: 'Date',
          paidAt: 'Paid on',
          actions: 'Actions',
        },
        empty: 'No orders found',
        emptySubtext: 'Orders will appear here when clients make purchases',
        loading: 'Loading orders...',
        paginatorTemplate: 'Showing {first} - {last} of {totalRecords} orders',
      },

      actions: {
        export: 'Export',
      },

      contextMenu: {
        viewDetails: 'View details',
        copyOrderNumber: 'Copy order number',
        goToClient: 'Go to client',
      },

      tooltip: {
        copyNumber: 'Copy number',
        viewDetails: 'View details',
        moreActions: 'More actions',
      },
    },
  },

  // ==========================================
  // PRICING (admin/pricing/)
  // ==========================================
  pricing: {
    list: {
      title: 'Price Lists',
      subtitle: 'Price management by product category',

      kpis: {
        totalCategories: 'Total Categories',
        withPrices: 'With Configured Prices',
        withoutPrices: 'Without Prices',
        avgExclusivePrice: 'Average Exclusive Price',
      },

      search: {
        placeholder: 'Search by category name...',
      },

      filters: {
        category: 'Category',
        allCategories: 'All categories',
      },

      table: {
        headers: {
          category: 'Category',
          categoryStatus: 'Cat. Status',
          exclusivePrice: 'Exclusive Price',
          sharedPrices: 'Shared Prices',
          validFrom: 'Valid From',
          lastUpdate: 'Last Update',
          actions: 'Actions',
        },
        empty: 'No price lists found',
        emptySubtext: 'Price lists are automatically created when you configure prices for a category.',
        loading: 'Loading price lists...',
        paginatorTemplate: 'Showing {first} - {last} of {totalRecords} price lists',
        maxShares: 'Max {count} shares',
        slots: '{count} slots',
      },

      actions: {
        priceHistory: 'Price History',
      },

      tooltip: {
        editPrices: 'Edit prices',
      },

      alert: {
        noPrices: '{count} categories do not have configured prices yet.',
        andMore: 'and {count} more...',
      },

      dialog: {
        editTitle: 'Edit Prices',
        createTitle: 'Configure Prices',
        exclusivePrice: 'Exclusive Price',
        exclusivePriceDesc: 'Price for exclusive purchase (lead sold only once)',
        sharedPrices: 'Shared Prices',
        sharedPricesDesc: 'Price for each sharing slot',
        copyToAll: 'Copy to all',
        copyToAllTooltip: 'Copy the first slot price to all others',
        slot: 'Slot {number}',
        slotBuyer: '({number}st buyer)',
        sharedPriceInfo: 'Based on specifications, the shared price is fixed regardless of the slot already occupied. You can still differentiate prices if needed.',
        cancel: 'Cancel',
        save: 'Save Prices',
      },

      toast: {
        saveSuccess: 'Prices for "{name}" saved successfully',
        saveError: 'Error saving prices',
        priceCopied: 'Price copied to all slots',
        exclusivePositive: 'The exclusive price must be a positive value',
        slotPositive: 'The price for slot {number} must be positive',
      },
    },
  },

  // ==========================================
  // TRANSACTIONS (admin/transactions/)
  // ==========================================
  transactions: {
    list: {
      title: 'Transactions',
      subtitle: 'Complete Stripe transaction log',

      kpis: {
        totalTransactions: 'Total Transactions',
        completedVolume: 'Completed Volume',
        successRate: 'Success Rate',
        pendingProcessing: 'Pending/Processing',
      },

      search: {
        placeholder: 'Search by Payment Intent, order, client...',
      },

      filters: {
        status: 'Status',
        paymentType: 'Payment Type',
        dateFrom: 'Date From',
        dateTo: 'Date To',
        amountMin: 'Min Amount (\u20ac)',
        amountMax: 'Max Amount (\u20ac)',
      },

      table: {
        headers: {
          paymentIntent: 'Payment Intent',
          order: 'Order',
          client: 'Client',
          type: 'Type',
          amount: 'Amount',
          status: 'Status',
          error: 'Error',
          date: 'Date',
          processedAt: 'Processed on',
          actions: 'Actions',
        },
        empty: 'No transactions found',
        emptySubtext: 'Transactions will appear here when clients make payments',
        loading: 'Loading transactions...',
        paginatorTemplate: 'Showing {first} - {last} of {totalRecords} transactions',
      },

      actions: {
        export: 'Export',
      },

      tooltip: {
        viewDetails: 'View details',
        openStripe: 'Open on Stripe',
        copyId: 'Copy ID',
      },

      contextMenu: {
        viewDetails: 'View details',
        openStripe: 'Open on Stripe',
        copyPaymentIntentId: 'Copy Payment Intent ID',
        goToOrder: 'Go to order',
        goToClient: 'Go to client',
      },
    },
  },

  // ==========================================
  // INVOICES (admin/invoices/)
  // ==========================================
  invoices: {
    list: {
      title: 'Invoices',
      subtitle: 'Electronic invoices and credit notes management',

      kpis: {
        totalInvoices: 'Total Invoices',
        totalRevenue: 'Total Revenue',
        pendingSdi: 'Pending SDI',
        sdiIssues: 'SDI Issues',
      },

      search: {
        placeholder: 'Search by number, client, VAT Number...',
      },

      filters: {
        type: 'Type',
        sdiStatus: 'SDI Status',
      },

      table: {
        headers: {
          number: 'Number',
          client: 'Client',
          order: 'Order',
          amount: 'Amount',
          sdiStatus: 'SDI Status',
          issueDate: 'Issue Date',
          fattureCloudId: 'Fatture Cloud ID',
          actions: 'Actions',
        },
        empty: 'No invoices found',
        loading: 'Loading invoices...',
        paginatorTemplate: 'Showing {first} - {last} of {totalRecords} invoices',
        vatNumber: 'VAT: {vat}',
      },

      contextMenu: {
        viewDetails: 'View details',
        downloadPdf: 'Download PDF',
        sendByEmail: 'Send by email',
        resendToSdi: 'Resend to SDI',
        createCreditNote: 'Create credit note',
      },

      creditNote: {
        dialogTitle: 'Create Credit Note',
        amount: 'Credit note amount:',
        reason: 'Reason (optional)',
        reasonPlaceholder: 'Enter the reason for the credit note...',
        warning: 'The credit note will be issued and automatically sent to SDI. This action cannot be undone.',
        cancel: 'Cancel',
        create: 'Create Credit Note',
      },

      toast: {
        resendSdiSuccess: 'Invoice "{number}" resent to SDI',
        resendSdiError: 'Error resending to SDI',
        sendEmailSuccess: 'Invoice "{number}" sent by email',
        sendEmailError: 'Error sending email',
        creditNoteSuccess: 'Credit note "{number}" successfully created',
        creditNoteError: 'Error creating credit note',
        downloadSuccess: 'PDF download started',
        downloadError: 'Error downloading PDF',
      },

      actions: {
        export: 'Export',
      },

      tooltip: {
        view: 'View',
        moreActions: 'More actions',
      },
    },
  },

  // ==========================================
  // REPORTS (admin/reports/)
  // ==========================================
  reports: {
    title: 'Reports',
    subtitle: 'Sales statistics, performance, and data analysis',

    period: 'Period:',

    customDates: {
      startDate: 'Start date',
      endDate: 'End date',
      apply: 'Apply',
    },

    refresh: 'Refresh data',
    exportData: 'Export Data',

    tabs: {
      salesStats: 'Sales Statistics',
      categoryPerformance: 'Category Performance',
      geographicAnalysis: 'Geographic Analysis',
      dataExport: 'Data Export',
    },

    salesStats: {
      kpis: {
        totalRevenue: 'Total Revenue',
        totalOrders: 'Total Orders',
        soldLeads: 'Sold Leads',
        avgOrderValue: 'Average Order Value',
      },
      vsPreviousPeriod: 'vs previous period',
      revenueChart: 'Revenue Trend',
      ordersChart: 'Orders Trend',
      chartLabels: {
        revenue: 'Revenue',
        orders: 'Orders',
      },
    },

    categoryPerformance: {
      top5Chart: 'Top 5 Categories by Revenue',
      detailTitle: 'Performance Detail',
      headers: {
        category: 'Category',
        totalLeads: 'Total Leads',
        sold: 'Sold',
        available: 'Available',
        revenue: 'Revenue',
        sellThrough: 'Sell-through',
      },
    },

    geographicAnalysis: {
      top5RegionsChart: 'Top 5 Regions by Revenue',
      regionPerformance: 'Performance by Region',
      regionHeaders: {
        region: 'Region',
        provinces: 'Provinces',
        totalLeads: 'Total Leads',
        sold: 'Sold',
        revenue: 'Revenue',
      },
      topProvinces: 'Top Provinces',
      provinceHeaders: {
        province: 'Province',
        name: 'Name',
        region: 'Region',
        topCategory: 'Top Category',
        leads: 'Leads',
        sold: 'Sold',
        revenue: 'Revenue',
      },
    },

    dataExport: {
      description: 'Export platform data in Excel or CSV format for external analysis or integration with other systems.',
      recentExports: 'Recent Exports',
      dialogTitle: 'Data Export',
      dataType: 'Data type',
      format: 'Format',
      periodInfo: 'The export will include data filtered based on the selected period ({period}).',
      cancel: 'Cancel',
      export: 'Export',
    },

    toast: {
      exportError: 'Error during export',
    },
  },

  // ==========================================
  // SETTINGS (admin/settings/)
  // ==========================================
  settings: {
    title: 'Settings',
    subtitle: 'System configuration, notifications, and operator management',
    leadSources: 'Lead Sources',

    tabs: {
      systemConfig: 'System Configuration',
      emailNotifications: 'Email Notifications',
      adminOperators: 'Admin Operators',
      activityLog: 'Activity Log',
    },

    systemConfig: {
      leadAndTrial: 'Lead and Free Trial',
      freeTrialLeads: 'Default Free Trial Leads',
      freeTrialLeadsHint: 'Number of free leads for new clients',
      billing: 'Billing',
      vatRate: 'Default VAT Rate (%)',
      orderPrefix: 'Order Number Prefix',
      orderPrefixPlaceholder: 'e.g. ORD-2024-',
      invoicePrefix: 'Invoice Number Prefix',
      invoicePrefixPlaceholder: 'e.g. INV-2024-',
      email: 'Email',
      senderEmail: 'Sender Email',
      senderName: 'Sender Name',
      sendTestEmail: 'Send Test Email',
      saveConfig: 'Save Configuration',
    },

    emailNotifications: {
      description: 'Configure the sending frequency of notifications for each lead category.',
      headers: {
        category: 'Category',
        enabled: 'Enabled',
        frequency: 'Frequency',
        description: 'Description',
      },
      descriptions: {
        disabled: 'Notifications disabled',
        instant: 'Immediate email for each new lead',
        hourly: 'Hourly summary',
        daily: 'Daily summary',
        weekly: 'Weekly summary',
      },
    },

    operators: {
      description: 'Manage operator accounts with back office access.',
      newOperator: 'New Operator',
      headers: {
        operator: 'Operator',
        role: 'Role',
        status: 'Status',
        lastAccess: 'Last Access',
        actions: 'Actions',
      },
      tooltip: {
        edit: 'Edit',
        resetPassword: 'Reset Password',
        deactivate: 'Deactivate',
        reactivate: 'Reactivate',
        delete: 'Delete',
      },
      dialog: {
        createTitle: 'New Operator',
        editTitle: 'Edit Operator',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        role: 'Role',
        password: 'Password',
        passwordConfirmation: 'Confirm Password',
        cancel: 'Cancel',
        createButton: 'Create Operator',
        editButton: 'Save Changes',
      },
    },

    activityLog: {
      empty: 'No activity found',
      search: 'Search logs...',
      typeFilter: 'Activity type',
      entityFilter: 'Entity',
      clearFilters: 'Clear filters',
      headers: {
        date: 'Date',
        type: 'Type',
        operator: 'Operator',
        entity: 'Entity',
        description: 'Description',
        ip: 'IP',
      },
    },

    testEmail: {
      dialogTitle: 'Send Test Email',
      description: 'Enter the email address to send the test message to.',
      recipient: 'Recipient email',
      placeholder: 'email@example.com',
      cancel: 'Cancel',
      send: 'Send Test',
    },

    toast: {
      configSaved: 'Configuration saved successfully',
      configError: 'Error saving configuration',
      notificationUpdated: 'Notification frequency updated',
      notificationEnabled: 'Notification enabled',
      notificationDisabled: 'Notification disabled',
      notificationError: 'Error updating',
      operatorCreated: 'Operator successfully created',
      operatorUpdated: 'Operator successfully updated',
      operatorDeleted: 'Operator deleted',
      operatorDeactivated: 'Operator deactivated',
      operatorReactivated: 'Operator reactivated',
      operatorError: 'Error in operation',
      resetPasswordSent: 'Reset email sent to {email}',
      resetPasswordError: 'Error resetting password',
      testEmailSent: 'Test email sent',
      testEmailError: 'Error sending',
      formError: 'Fix the errors in the form',
      emailRequired: 'Enter an email address',
    },
  },

  // ==========================================
  // COMMON ADMIN STRINGS
  // ==========================================
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    back: 'Back',
    continue: 'Continue',
    search: 'Search',
    export: 'Export',
    import: 'Import',
    filters: {
      show: 'Show filters',
      hide: 'Hide filters',
      clear: 'Clear filters',
      apply: 'Apply Filters',
      selectStatus: 'Select status',
      selectType: 'Select type',
      selectDate: 'Select date',
    },
    actions: 'Actions',
    viewDetails: 'View details',
    moreActions: 'More actions',
    loading: 'Loading...',
    noResults: 'No results',
    confirmDelete: 'Confirm Deletion',
  },
}
