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
        selectOption: 'Select...',
        selectStatus: 'Select status',
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
        paginatorTemplate: 'Showing {first} - {last} of {totalRecords} clients',
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
        moreActions: 'More actions',
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
        suspendError: 'Error suspending client',
        reactivateSuccess: 'Client "{name}" reactivated',
        activateSuccess: 'Client "{name}" activated',
        activateError: 'Error activating client',
        resetPasswordSuccess: 'Password reset email sent to {email}',
        resetPasswordError: 'Error resetting password',
        exportStarted: 'Export started',
      },
    },

    // Detail/Edit ([id].vue)
    edit: {
      editTitle: 'Edit Client',
      statusLabel: 'Status',
      registeredAt: 'Registered on {date}',
      loading: 'Loading client...',
      notFound: 'Client not found',
      notFoundDesc: 'The requested client does not exist or has been removed.',

      infoCards: {
        freeTrial: 'Free Trial',
        emailVerified: 'Email Verified',
        leadNotifications: 'Lead Notifications',
        marketingConsent: 'Marketing Consent',
        pendingVerification: 'Pending verification',
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
        billingAddress: 'Billing Address',
        zip: 'ZIP Code',
        city: 'City',
        province: 'Province',
        country: 'Country',
        sdiCode: 'SDI Code',
        pec: 'PEC',
        bankData: 'Bank Details',
        iban: 'IBAN',
        ibanHint: 'Italian IBAN (27 characters)',
        bankName: 'Bank',
        bankNamePlaceholder: 'Bank name',
        bankAccountHolder: 'Account Holder',
        bankAccountHolderPlaceholder: 'Account holder name',
        bicSwift: 'BIC/SWIFT',
        bicSwiftPlaceholder: 'e.g. UNCRITM1XXX',
        bicSwiftHint: 'BIC/SWIFT code of the bank (optional)',
      },

      settingsTab: {
        categoriesOfInterest: 'Categories of Interest',
        categoriesOfInterestDesc: 'Categories for which the client receives lead notifications',
        categoriesPlaceholder: 'Select categories',
        categoriesFilterPlaceholder: 'Search categories...',
        categoriesHint: 'The client will receive notifications for leads in selected categories',
        categoryInactive: 'Inactive',
        accountSettings: 'Account Settings',
        status: 'Account Status',
        freeTrial: 'Free Trial',
        enableFreeTrial: 'Enable Free Trial',
        freeTrialHint: 'Number of free leads remaining for the client',
        freeTrialUsed: '{count} free leads used',
        leadNotifications: 'Lead Notifications',
        leadNotificationsHint: 'Enable email notifications for new available leads',
        marketingConsent: 'Marketing Consent',
        dangerZone: 'Danger Zone',
        resetPassword: 'Reset Password',
        resetPasswordDesc: 'Send a password reset email to the client',
        suspendAccount: 'Suspend Account',
        suspendAccountDesc: 'Temporarily suspend client access',
        deleteAccount: 'Delete Account',
        deleteAccountDesc: 'Permanently delete the client and all their data',
      },

      historyTab: {
        title: 'Order History',
        desc: 'Recent orders placed by the client',
      },

      saveButton: 'Save Changes',

      toast: {
        saveSuccess: 'Client successfully updated',
        saveError: 'Error updating client',
        validationError: 'Fix the errors in the form before proceeding',
        updateSuccess: 'Client "{name}" successfully updated',
        updateError: 'Error updating client',
        suspendSuccess: 'Client suspended successfully',
        suspendError: 'Error suspending client',
        activateSuccess: 'Client activated successfully',
        activateError: 'Error activating client',
        resetPasswordSuccess: 'Password reset email sent to {email}',
        resetPasswordError: 'Error resetting password',
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
        companyNamePlaceholder: 'Enter company name',
        vatNumber: 'VAT Number',
        vatNumberPlaceholder: 'e.g. IT01234567890',
        vatNumberHint: '11-digit Italian VAT number with country prefix',
        email: 'Email',
        emailPlaceholder: 'company@example.com',
        phone: 'Phone',
        phonePlaceholder: '+39 xxx xxx xxxx',
        firstName: 'First Name',
        firstNamePlaceholder: 'Contact first name',
        lastName: 'Last Name',
        lastNamePlaceholder: 'Contact last name',
        password: 'Password',
        passwordHint: 'At least 8 characters, one uppercase and one number',
        confirmPassword: 'Confirm Password',
        address: 'Address',
        addressPlaceholder: 'Street, number',
        city: 'City',
        cityPlaceholder: 'City',
        province: 'Province',
        provincePlaceholder: 'Search province...',
        zip: 'ZIP Code',
        country: 'Country',
        iban: 'IBAN',
        ibanHint: 'Italian IBAN (27 characters)',
        bankName: 'Bank',
        bankNamePlaceholder: 'Bank name',
        bankAccountHolder: 'Account Holder',
        bankAccountHolderPlaceholder: 'Account holder name',
        bicSwift: 'BIC/SWIFT',
        bicSwiftPlaceholder: 'e.g. UNCRITM1XXX',
        bicSwiftHint: 'BIC/SWIFT code of the bank (optional)',
        sdiCode: 'SDI Code',
        sdiCodeHint: 'SDI code or PEC for electronic invoicing',
        pec: 'PEC',
        pecPlaceholder: 'company@pec.it',
        status: 'Status',
        freeTrial: 'Free Trial',
        freeLeads: 'Free Leads',
        leadNotifications: 'Lead Notifications',
        marketingConsent: 'Marketing Consent',
        categoriesLabel: 'Select categories',
        categoriesPlaceholder: 'Choose categories of interest',
        categoriesFilterPlaceholder: 'Search categories...',
        categoriesHint: 'The client will receive notifications for leads in selected categories',
        categoryInactive: 'Inactive',
      },

      buttons: {
        cancel: 'Cancel',
        create: 'Create Client',
      },

      toast: {
        createSuccess: 'Client "{name}" successfully created',
        createError: 'Error creating client',
        validationError: 'Fix the errors in the form before proceeding',
      },
    },

    validation: {
      fieldRequired: '{field} is required',
      vatNumberFormat: 'Invalid VAT number (11 digits)',
      passwordMinLength: 'Password must be at least 8 characters',
      passwordUppercase: 'Password must contain at least one uppercase letter',
      passwordLowercase: 'Password must contain at least one lowercase letter',
      passwordNumber: 'Password must contain at least one number',
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
        showFilters: 'Show filters',
        hideFilters: 'Hide filters',
        clearFilters: 'Clear filters',
        searchPlaceholder: 'Search province...',
        apply: 'Apply',
        applyFilters: 'Apply Filters',
        statusOptions: {
          all: 'All statuses',
          free: 'Available',
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
        sourceCombined: 'Origin / Campaign / Medium',
        sourceCombinedPlaceholder: 'E.g. meta, summer-2026, cpc...',
      },

      table: {
        headers: {
          contact: 'Contact',
          phone: 'Phone',
          category: 'Category',
          province: 'Province',
          request: 'Request',
          status: 'Status',
          origin: 'Origin',
          campaign: 'Campaign',
          medium: 'Medium',
          leadDate: 'Lead Date',
          actions: 'Actions',
        },
        empty: 'No leads found',
        loading: 'Loading leads...',
        paginatorTemplate: 'From {first} to {last} of {totalRecords} leads',
      },

      actions: {
        newLead: 'New Lead',
        import: 'Import',
        export: 'Export',
        bulkDelete: 'Delete selected',
        selected: '{count} selected',
      },

      contextMenu: {
        edit: 'Edit',
        viewHistory: 'View history',
        delete: 'Delete',
        notDeletable: 'Not deletable (already sold)',
      },

      dialog: {
        deleteTitle: 'Confirm Deletion',
        deleteMessage: 'Are you sure you want to delete {count} leads? This action cannot be undone.',
        deleteSingleMessage: 'Are you sure you want to delete the lead "{name}"? This action cannot be undone.',
        deleteIrreversible: 'This action is irreversible.',
        cancel: 'Cancel',
        confirm: 'Delete',
      },

      toast: {
        deleteSuccess: 'Lead "{name}" successfully deleted',
        deleteError: 'Error deleting leads',
        cannotDelete: 'Cannot delete an already sold lead',
        noDeletable: 'No selected lead can be deleted',
        bulkDeleteSuccess: '{count} leads successfully deleted',
        bulkDeleteFailed: '{count} leads not deleted (already sold)',
        exportStarted: 'Export started',
      },
    },

    // Detail/Edit ([id].vue)
    edit: {
      editTitle: 'Edit Lead',
      editSubtitle: 'Edit lead data',
      loading: 'Loading lead...',
      notFound: 'Lead not found',
      notFoundDescription: 'The requested lead does not exist or has been removed.',
      backToList: 'Back to Leads',
      leadDate: 'Lead Date',
      cancelChanges: 'Cancel Changes',
      deleteButton: 'Delete Lead',

      infoCards: {
        category: 'Category',
        province: 'Province',
        source: 'Source',
        tracking: 'Origin / Campaign / Medium',
        origin: 'Origin',
        medium: 'Medium',
        campaign: 'Campaign',
        insertedAt: 'Inserted on',
        updatedAt: 'Updated on',
        maxShares: 'Max Shares',
      },

      tabs: {
        contactData: 'Contact Data',
        classification: 'Classification',
        requestDetails: 'Request Details',
        salesHistory: 'Sales History',
      },

      contactForm: {
        fullName: 'Full Name',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        addressHint: 'Full address or location data (optional)',
      },

      classificationForm: {
        category: 'Product Category',
        province: 'Province',
        source: 'Lead Source',
        origin: 'Origin',
        originPlaceholder: 'e.g. meta, google ads, google search',
        sellingMode: 'Selling Mode',
        externalId: 'External ID',
        externalIdHint: 'Identifier in the source system (optional)',
        sellingModeOptions: {
          exclusive: 'Exclusive',
          shared: 'Shared',
        },
      },

      requestForm: {
        requestText: 'Request Text',
        generatedAt: 'Generation Date',
        trackingTitle: 'Acquisition Tracking',
        country: 'Country',
        medium: 'Medium',
        campaign: 'Campaign',
      },

      customFields: {
        title: 'Additional Fields',
      },

      salesHistory: {
        title: 'Sales History',
        description: 'List of sales made for this lead',
        empty: 'No sales recorded',
        availableForPurchase: 'Available for purchase',
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
        updateSuccess: 'Lead "{name}" successfully updated',
        updateError: 'Error updating lead',
        deleteSuccess: 'Lead successfully deleted',
        deleteError: 'Error deleting lead',
        notEditable: 'This lead cannot be edited because it has already been sold.',
        notDeletable: 'This lead cannot be deleted because it has already been sold.',
        formErrors: 'Please fix the form errors before saving',
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
        tracking: 'Acquisition Tracking',
        customFields: 'Additional Fields',
      },

      form: {
        category: 'Product Category',
        categoryPlaceholder: 'Select category',
        province: 'Province',
        provincePlaceholder: 'Select province',
        provinceFilter: 'Search province...',
        source: 'Lead Source',
        sourcePlaceholder: 'Select source',
        origin: 'Origin',
        originPlaceholder: 'e.g. meta, google ads, google search',
        fullName: 'Full Name',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        addressHint: 'Full address or location data (optional)',
        requestText: 'Request Text',
        requestTextPlaceholder: 'Describe the contact\'s request...',
        requestTextHint: 'The request text helps qualify the lead',
        generatedAt: 'Generation Date',
        generatedAtHint: 'Date when the lead was generated',
        externalId: 'External ID',
        externalIdPlaceholder: 'Reference from external system',
        externalIdHint: 'Identifier in the source system (optional)',
        country: 'Country',
        countryHint: 'ISO 3166-1 alpha-2 code (e.g. IT, DE, FR)',
        medium: 'Medium',
        mediumPlaceholder: 'e.g. cpc, organic, social, email',
        mediumHint: 'The lead acquisition medium (optional)',
        campaign: 'Campaign',
        campaignPlaceholder: 'e.g. solar-spring-2026',
        campaignHint: 'Acquisition campaign name (optional)',
        customFieldsHint: 'These fields are defined in the selected category. All are optional.',
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
          fullName: 'Full Name',
          email: 'Email',
          phone: 'Phone',
          address: 'Address',
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
      createTitle: 'New Category',
      createSubtitle: 'Enter the details to create a new product category',
      editTitle: 'Edit Category',
      warning: {
        title: 'Warning',
        deactivateWithLeads: 'This category has {count} active leads. Deactivating it means new leads cannot be assigned to this category.',
      },
      form: {
        basicInfo: 'Basic Information',
        name: 'Category Name',
        namePlaceholder: 'e.g. Residential Photovoltaic',
        slug: 'Slug',
        slugPlaceholder: 'e.g. residential-photovoltaic',
        slugHint: 'Unique identifier for the category (auto-generated from name)',
        regenerateSlug: 'Regenerate slug from name',
        description: 'Description',
        descriptionPlaceholder: 'Describe the product category...',
        descriptionHint: 'The description helps classify leads in this category',
        businessRules: 'Business Rules',
        maxShares: 'Maximum Shares',
        maxSharesHint: 'Maximum number of clients a lead can be sold to in shared mode',
        maxSharesHintEdit: 'The change does not affect already sold leads',
        sortOrder: 'Display Order',
        sortOrderHint: 'Lower number = displayed first in the catalog',
        sortOrderHintEdit: 'Change the position in the catalog',
        slugEditHint: 'Changing the slug may affect existing links',
        isActive: 'Active Category',
        isActiveHint: 'Active categories are visible in the catalog and can receive new leads',
        createButton: 'Create Category',
        customFieldsTitle: 'Custom Fields',
        customFieldsHint: 'Define additional text fields that will appear in lead collection forms and in the lead detail view. All fields are optional.',
        fieldLabel: 'Field label',
        fieldLabelPlaceholder: 'e.g. Roof Area (sqm)',
        fieldKey: 'Technical key',
        fieldKeyHint: 'Auto-generated from the label',
        noCustomFields: 'No custom fields defined. Click the button below to add one.',
        addCustomField: 'Add field',
      },
      info: {
        title: 'How categories work',
        description: 'Product categories allow you to classify leads by industry. Each category has sharing rules that determine how many times a lead can be sold.',
      },
      toast: {
        formError: 'Fix the errors in the form before proceeding',
        createSuccess: 'Category "{name}" successfully created',
        createError: 'Error creating category',
        deactivated: 'Category "{name}" deactivated',
        activated: 'Category "{name}" activated',
        toggleSuccess: 'Category status updated successfully',
        toggleError: 'Error updating category status',
        deleteSuccess: 'Category "{name}" successfully deleted',
        deleteError: 'Error deleting category',
        exportInProgress: 'Exporting categories...',
        copyLeadchangeLink: 'Copy cross-selling link',
        linkCopied: 'Cross-selling link copied to clipboard',
        linkCopyError: 'Error copying link',
        slugRegenerated: 'Slug regenerated from name',
        updateSuccess: 'Category "{name}" successfully updated',
        updateError: 'Error updating category',
        notFound: 'Category not found',
      },
      stats: {
        totalCategories: 'Total Categories',
        activeCategories: 'Active Categories',
        totalLeads: 'Total Leads',
        availableLeads: 'Available Leads',
        categoryId: 'Category ID',
        createdAt: 'Created At',
      },
      search: {
        placeholder: 'Search categories by name...',
      },
      filters: {
        all: 'All',
        active: 'Active',
        inactive: 'Inactive',
      },
      table: {
        headers: {
          name: 'Name',
          description: 'Description',
          maxShares: 'Max Shares',
          status: 'Status',
          createdAt: 'Created At',
        },
        paginatorTemplate: 'Showing {first} - {last} of {totalRecords} categories',
        empty: 'No categories found',
        createFirst: 'Create the first category',
        loading: 'Loading categories...',
        noLeads: 'No leads',
      },
      actions: {
        deactivate: 'Deactivate',
        activate: 'Activate',
      },
      dialog: {
        deleteMessage: 'Are you sure you want to delete the category "{name}"?',
        hasLeadsWarning: 'Warning: this category contains {count} leads',
        irreversible: 'This action cannot be undone.',
      },
    },

    provinces: {
      title: 'Provinces',
      subtitle: 'Manage Italian provinces for geographic lead classification',
      description: 'Italian provinces directory for geographic filtering',
      total: 'Total',
      active: 'Active',
      regions: 'Regions',
      info: {
        title: 'How provinces work',
        description: 'Provinces are used to geographically classify leads. Clients can filter leads by province and receive notifications only for their areas of interest.',
      },
      stats: {
        totalProvinces: 'Total Provinces',
        activeProvinces: 'Active Provinces',
        inactiveProvinces: 'Inactive Provinces',
        totalRegions: 'Total Regions',
        totalLeads: 'Total Leads',
      },
      search: {
        placeholder: 'Search provinces by name or code...',
      },
      filters: {
        all: 'All',
        active: 'Active',
        inactive: 'Inactive',
        allRegions: 'All regions',
        selectRegion: 'Select region',
        searchRegion: 'Search region...',
      },
      table: {
        headers: {
          code: 'Code',
          name: 'Name',
          region: 'Region',
          leads: 'Leads',
          status: 'Status',
        },
        paginatorTemplate: 'Showing {first} - {last} of {totalRecords} provinces',
        empty: 'No provinces found',
        loading: 'Loading provinces...',
        noLeads: 'No leads',
      },
      actions: {
        deactivate: 'Deactivate',
        activate: 'Activate',
        activateSelected: 'Activate selected',
        deactivateSelected: 'Deactivate selected',
      },
      dialog: {
        deleteMessage: 'Are you sure you want to delete the province "{name}"?',
        hasLeadsWarning: 'Warning: this province contains {count} leads',
        irreversible: 'This action cannot be undone.',
      },
      toast: {
        deactivated: 'Province "{name}" deactivated',
        activated: 'Province "{name}" activated',
        toggleSuccess: 'Province status updated successfully',
        toggleError: 'Error updating province status',
        deleteSuccess: 'Province "{name}" successfully deleted',
        deleteError: 'Error deleting province',
        exportInProgress: 'Exporting provinces...',
      },
    },

    packages: {
      title: 'Lead Packages',
      description: 'Configure lead bundles purchasable by clients',
      total: 'Total',
      active: 'Active',
      sales: 'Sales',
      createTitle: 'New Package',
      createSubtitle: 'Configure a new lead package for clients',
      editTitle: 'Edit Package',
      allCategories: 'All Categories',
      warning: {
        title: 'Warning',
        deactivateWithSales: 'This package has {count} associated sales. Deactivating it will make it unavailable for purchase.',
      },
      form: {
        basicInfo: 'Basic Information',
        name: 'Package Name',
        namePlaceholder: 'e.g. Starter Pack Photovoltaic',
        packageType: 'Package Type',
        allCategories: 'All Categories',
        specificCategory: 'Specific Category',
        categories: 'Categories',
        categoriesPlaceholder: 'Select categories',
        categoriesFilterPlaceholder: 'Search categories...',
        categoriesHint: 'Select the product categories included in the package',
        description: 'Description',
        descriptionPlaceholder: 'Describe the package content and benefits...',
        descriptionHint: 'The description will be visible to clients in the catalog',
        exclusive: 'Exclusive',
        shared: 'Shared',
        specificCategories: 'Specific Categories',
        exclusiveLeads: 'Exclusive Leads',
        exclusiveLeadsSubtitle: 'Leads sold only to one client',
        leadQuantity: 'Quantity',
        exclusiveLeadQuantityLabel: 'Exclusive Lead Quantity',
        exclusiveLeadQuantityHint: 'Number of exclusive leads in the package',
        exclusivePriceLabel: 'Exclusive Leads Price',
        exclusivePriceHint: 'Total price for exclusive leads',
        exclusivePricePerLead: 'per lead',
        totalPrice: 'Total Price',
        totalPackagePrice: 'Total Package Price',
        priceExVat: 'ex VAT',
        pricePerLead: 'Price per lead',
        autoCalculated: 'auto-calculated',
        sharedLeads: 'Shared Leads',
        sharedLeadsSubtitle: 'Leads sold to multiple clients',
        sharedLeadQuantityLabel: 'Shared Lead Quantity',
        sharedLeadQuantityHint: 'Number of shared leads in the package',
        sharedPriceLabel: 'Shared Leads Price',
        sharedPriceHint: 'Total price for shared leads',
        sharedPricePerLead: 'per lead',
        summary: 'Package Summary',
        totalLeads: 'Total Leads',
        totalPriceLabel: 'Total Price',
        settings: 'Settings',
        sortOrder: 'Display Order',
        sortOrderHint: 'Lower number = displayed first',
        sortOrderHintEdit: 'Change the position in the catalog',
        isActive: 'Active',
        isActiveHint: 'Active packages are visible in the catalog',
        isActiveHintEdit: 'Deactivate to hide the package from the catalog',
        createButton: 'Create Package',
      },
      info: {
        title: 'How packages work',
        description: 'Packages allow clients to purchase lead bundles at a discounted price. Each package can include exclusive and/or shared leads.',
      },
      toast: {
        formError: 'Fix the errors in the form before proceeding',
        createSuccess: 'Package "{name}" successfully created',
        createError: 'Error creating package',
        deactivated: 'Package "{name}" deactivated',
        activated: 'Package "{name}" activated',
        toggleSuccess: 'Package status updated successfully',
        toggleError: 'Error updating package status',
        deleteSuccess: 'Package "{name}" successfully deleted',
        deleteError: 'Error deleting package',
        exportInProgress: 'Exporting packages...',
      },
      stats: {
        totalPackages: 'Total Packages',
        activePackages: 'Active Packages',
        totalSales: 'Total Sales',
        totalRevenue: 'Total Revenue',
        packageId: 'Package ID',
        createdAt: 'Created At',
        generatedRevenue: 'Generated Revenue',
      },
      search: {
        placeholder: 'Search packages by name...',
      },
      filters: {
        all: 'All',
        active: 'Active',
        inactive: 'Inactive',
        selectCategory: 'Select category',
      },
      table: {
        headers: {
          name: 'Name',
          description: 'Description',
          leads: 'Included Leads',
          exclusiveLeads: 'Exclusive Leads',
          sharedLeads: 'Shared Leads',
          categories: 'Categories',
          price: 'Price',
          total: 'Total',
          sales: 'Sales',
          salesCount: 'No. Sales',
          status: 'Status',
          createdAt: 'Created At',
        },
        paginatorTemplate: 'Showing {first} - {last} of {totalRecords} packages',
        empty: 'No packages found',
        createFirst: 'Create the first package',
        loading: 'Loading packages...',
      },
      actions: {
        deactivate: 'Deactivate',
        activate: 'Activate',
      },
      dialog: {
        deleteMessage: 'Are you sure you want to delete the package "{name}"?',
        hasSalesWarning: 'Warning: this package has {count} associated sales',
        irreversible: 'This action cannot be undone.',
      },
    },

    validation: {
      nameMinLength: 'Name must be at least 3 characters',
      nameMaxLength: 'Name must not exceed 100 characters',
      quantityMin: 'Quantity must be at least 1',
      quantityMax: 'Quantity must not exceed 1000',
      pricePositive: 'Price must be a positive value',
      priceMax: 'Price must not exceed 100,000',
      packageMinLead: 'Package must contain at least 1 lead',
    },

    statuses: {
      active: 'Active',
      inactive: 'Inactive',
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

    // Detail ([id].vue)
    detail: {
      loading: 'Loading order...',
      notFound: 'Order not found',
      notFoundDescription: 'The requested order does not exist or has been removed.',
      backToList: 'Back to orders',
      copyOrderNumber: 'Copy order number',
      viewOnStripe: 'View on Stripe',
      goToClient: 'Go to Client',
      goToClientProfile: 'Go to client profile',

      cards: {
        orderTotal: 'Order Total',
        includedLeads: 'Included Leads',
        payment: 'Payment',
        invoice: 'Invoice',
      },

      tabs: {
        orderDetails: 'Order Details',
        client: 'Client',
        payment: 'Payment',
        timeline: 'Timeline',
      },

      columns: {
        type: 'Type',
        description: 'Description',
        mode: 'Mode',
        qty: 'Qty',
        unitPrice: 'Unit Price',
        total: 'Total',
        package: 'Package',
      },

      orderLines: 'order lines',
      leadsIncluded: 'leads included',
      noOrderLines: 'No order lines',
      subtotal: 'Subtotal',
      vat: 'VAT',
      paidOn: 'Paid on',

      // Client tab
      clientData: 'Client Data',
      clientDataNotAvailable: 'Client data not available',
      contactPerson: 'Contact Person',
      companyName: 'Company Name',
      vatNumber: 'VAT Number',
      address: 'Address',
      sdiCode: 'SDI Code',
      billingData: 'Billing Data',
      billingDataNotAvailable: 'Billing data not available',

      // Payment/Invoice tab
      transaction: 'Transaction',
      amount: 'Amount',
      processingDate: 'Processing Date',
      creditCard: 'Credit Card',
      noTransaction: 'No transaction recorded',
      freeTrialOrder: 'Free trial order',
      paymentNotProcessed: 'Payment not yet processed',
      openOnStripe: 'Open on Stripe',

      invoiceIssued: 'Invoice Issued',
      invoiceNotIssued: 'Not issued',
      invoiceNotYetIssued: 'Invoice not yet issued',
      invoiceWillBeIssued: 'The invoice will be issued after payment',
      issueDate: 'Issue Date',
      sdiStatus: 'SDI Status',
      fattureCloudId: 'Fatture in Cloud ID',
      downloadPdf: 'Download PDF',

      // Timeline tab
      timeline: {
        orderCreated: 'Order Created',
        paymentCompleted: 'Payment Completed',
        invoiceIssued: 'Invoice Issued',
        leadsUnlocked: 'Leads Unlocked',
        paymentFailed: 'Payment Failed',
        orderCancelled: 'Order Cancelled',
        awaitingPayment: 'Awaiting Payment',
        awaitingPaymentDescription: 'Payment has not yet been completed',
        leadsAvailableInPortfolio: 'leads available in portfolio',
        orderLabel: 'Order',
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

    // History (history.vue)
    history: {
      subtitle: 'History of all price list changes',
      backToPricing: 'Back to Price Lists',
      searchPlaceholder: 'Search by category...',
      exportExcel: 'Export Excel',
      loading: 'Loading history...',
      empty: 'No price changes found',
      emptySubtext: 'The history is automatically populated when category prices are modified.',
      paginatorTemplate: 'Showing {first} - {last} of {totalRecords} changes',
      from: 'from',
      to: 'to',
      inEffect: 'In effect',
      system: 'System',

      stats: {
        totalChanges: 'Total Changes',
        changesThisMonth: 'Changes This Month',
        categoriesModified: 'Categories Modified',
        lastChange: 'Last Change',
      },

      filters: {
        category: 'Category',
        allCategories: 'All categories',
        selectCategory: 'Select category',
        dateFrom: 'Date From',
        dateTo: 'Date To',
      },

      columns: {
        category: 'Category',
        exclusivePrice: 'Exclusive Price',
        sharedPrices: 'Shared Prices',
        validityPeriod: 'Validity Period',
        changeDate: 'Change Date',
        operator: 'Operator',
      },

      dialog: {
        title: 'Price Change Detail',
        close: 'Close',
        exclusivePrice: 'Exclusive Price',
        sharedPrices: 'Shared Prices',
        validityPeriod: 'Validity Period',
        validFrom: 'Valid from',
        validUntil: 'Valid until',
        modifiedOn: 'Modified on',
        status: 'Status',
        active: 'Active',
        replaced: 'Replaced',
        currentlyInEffect: 'Currently in effect',
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
        showFilters: 'Show filters',
        hideFilters: 'Hide filters',
        clearFilters: 'Clear filters',
        applyFilters: 'Apply Filters',
        selectStatus: 'Select status',
        selectType: 'Select type',
        selectDate: 'Select date',
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
        moreActions: 'More actions',
      },

      contextMenu: {
        viewDetails: 'View details',
        openStripe: 'Open on Stripe',
        copyPaymentIntentId: 'Copy Payment Intent ID',
        goToOrder: 'Go to order',
        goToClient: 'Go to client',
      },
    },

    // Detail ([id].vue)
    detail: {
      loading: 'Loading transaction...',
      notFound: 'Transaction not found',
      notFoundDescription: 'The requested transaction does not exist or has been removed.',
      backToList: 'Back to transactions',
      copyPaymentIntentId: 'Copy Payment Intent ID',
      openOnStripe: 'Open on Stripe',
      goToOrder: 'Go to Order',
      goToOrderLink: 'Go to order',
      goToClientProfile: 'Go to client profile',

      cards: {
        amount: 'Amount',
        method: 'Method',
        order: 'Order',
        processing: 'Processing',
      },

      tabs: {
        details: 'Details',
        client: 'Client',
        timeline: 'Timeline',
        refunds: 'Refunds',
        stripeResponse: 'Stripe Response',
      },

      // Details tab
      paymentDetails: 'Payment Details',
      stripeIds: 'Stripe IDs',
      currency: 'Currency',
      cardDetails: 'Card Details',
      expiry: 'Expiry',
      country: 'Country',
      bank: 'Bank',
      sepaDetails: 'SEPA Details',
      sepaDebit: 'SEPA Debit',
      transactionError: 'Transaction Error',
      errorCode: 'Error Code',
      errorMessage: 'Error Message',

      // Order info
      associatedOrder: 'Associated Order',
      orderTotal: 'Order Total',
      orderType: 'Order Type',
      awaiting: 'Awaiting',

      // Client tab
      clientData: 'Client Data',
      clientDataNotAvailable: 'Client data not available',
      contactPerson: 'Contact Person',

      // Timeline tab
      noEvents: 'No events recorded',

      // Refunds tab
      noRefunds: 'No refunds recorded',
      totalRefunded: 'Total Refunded',
      refundsManagedOnStripe: 'Refunds are managed directly on Stripe.',
      refundColumns: {
        refundId: 'Refund ID',
        reason: 'Reason',
      },

      // Stripe Response tab
      fullApiResponse: 'Full API Response',
      copyJson: 'Copy JSON',
      expand: 'Expand',
      collapse: 'Collapse',
      responseArchiveNote: 'The API response is archived at the time of the transaction and may not reflect the current state on Stripe.',
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
        showFilters: 'Show filters',
        hideFilters: 'Hide filters',
        clearFilters: 'Clear filters',
        applyFilters: 'Apply Filters',
        selectType: 'Select type',
        selectStatus: 'Select status',
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

    // Detail ([id].vue)
    detail: {
      loading: 'Loading invoice...',
      notFound: 'Invoice not found',
      notFoundDescription: 'The requested invoice does not exist or has been removed.',
      backToList: 'Back to invoices',
      issuedOn: 'Issued on',
      downloadPdf: 'Download PDF',
      sendEmail: 'Send Email',
      resendSdi: 'Resend SDI',
      creditNote: 'Credit Note',

      cards: {
        totalAmount: 'Invoice Total',
        sdiStatus: 'SDI Status',
        fattureCloud: 'Fatture in Cloud',
        dates: 'Dates',
      },

      issueLabel: 'Issue',
      dueLabel: 'Due',
      sentLabel: 'SDI Sent',
      notSynced: 'Not synced',
      vatIncluded: 'VAT {rate}% included',

      tabs: {
        details: 'Details',
        billingData: 'Billing Data',
        client: 'Client',
        sdiStatus: 'SDI Status',
      },

      invoiceLines: 'Invoice Lines',
      columns: {
        description: 'Description',
        quantity: 'Quantity',
        unitPrice: 'Unit Price',
        vat: 'VAT',
        total: 'Total',
      },
      taxableAmount: 'Taxable Amount',
      vatLabel: 'VAT',
      notes: 'Notes',
      linkedOrder: 'Linked Order',
      viewOrder: 'View Order',

      // Billing tab
      holderData: 'Holder Data',
      companyName: 'Company Name',
      vatNumber: 'VAT Number',
      address: 'Address',
      sdiCode: 'SDI Code',
      goToClient: 'Go to Client',

      // SDI tab
      resendToSdi: 'Resend to SDI',
      sdiDescriptions: {
        pending: 'The invoice is awaiting submission to the Exchange System.',
        sent: 'The invoice has been sent to the Exchange System and is being processed.',
        delivered: 'The invoice has been delivered to the recipient.',
        accepted: 'The invoice has been accepted by the recipient.',
        rejected: 'The invoice was rejected. Please check the data and resend.',
        notDelivered: 'The invoice could not be delivered. Delivery will be retried.',
        error: 'An error occurred while sending the invoice.',
      },
      chronology: 'Chronology',
      timeline: {
        invoiceCreated: 'Invoice Created',
        invoiceIssued: 'Invoice Issued',
        sentToSdi: 'Sent to SDI',
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

    periods: {
      today: 'Today',
      week: 'This Week',
      month: 'This Month',
      quarter: 'This Quarter',
      year: 'This Year',
      custom: 'Custom',
    },

    customDates: {
      startDate: 'Start date',
      endDate: 'End date',
      apply: 'Apply',
    },

    filters: {
      client: 'Client:',
      allClients: 'All clients',
      searchClient: 'Search client...',
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
      types: {
        leads: 'Leads',
        orders: 'Orders',
        clients: 'Clients',
        transactions: 'Transactions',
      },
      descriptions: {
        leads: 'All leads with contact and classification details',
        orders: 'Orders with amounts and status',
        clients: 'Client registry with billing data',
        transactions: 'Stripe transaction log',
      },
    },

    confirm: {
      exportMessage: 'Do you want to export {type} data for the selected period?',
      exportHeader: 'Confirm Export',
      exportAccept: 'Export',
    },

    toast: {
      exportError: 'Error during export',
      exportStarted: 'Export started',
      exportStartedDetail: 'The export is being prepared',
      exportCompleted: 'Export completed',
      exportReadyDetail: 'The file is ready for download',
    },
  },

  // ==========================================
  // SETTINGS (admin/settings/)
  // ==========================================
  settings: {
    title: 'Settings',
    subtitle: 'System configuration, notifications, and operator management',
    leadSources: 'Lead Sources',

    roles: {
      superAdmin: 'Super Admin',
      admin: 'Admin',
      operator: 'Operator',
    },

    statuses: {
      active: 'Active',
      inactive: 'Inactive',
    },

    activityTypes: {
      login: 'Login',
      logout: 'Logout',
      create: 'Create',
      update: 'Update',
      delete: 'Delete',
      export: 'Export',
      import: 'Import',
      statusChange: 'Status Change',
      passwordReset: 'Password Reset',
      configChange: 'Config Change',
    },

    entities: {
      user: 'User',
      client: 'Client',
      lead: 'Lead',
      order: 'Order',
      invoice: 'Invoice',
      category: 'Category',
      package: 'Package',
      pricing: 'Pricing',
      admin: 'Admin',
      system: 'System',
    },

    frequencies: {
      instant: 'Instant',
      hourly: 'Hourly',
      daily: 'Daily',
      weekly: 'Weekly',
      disabled: 'Disabled',
    },

    time: {
      never: 'Never',
    },

    entityFilter: {
      all: 'All entities',
    },

    validation: {
      firstNameMinLength: 'First name must be at least 2 characters',
      lastNameMinLength: 'Last name must be at least 2 characters',
      passwordMinLength: 'Password must be at least 8 characters',
      passwordUppercase: 'Password must contain at least one uppercase letter',
      passwordNumber: 'Password must contain at least one number',
    },

    confirm: {
      deleteOperatorMessage: 'Are you sure you want to delete the operator "{name}"?',
      resetPasswordMessage: 'Send a password reset email to {email}?',
      resetPasswordHeader: 'Reset Password',
      deactivateMessage: 'Are you sure you want to deactivate the operator "{name}"?',
      deactivateHeader: 'Deactivate Operator',
      deactivateAccept: 'Deactivate',
    },

    smtpEncryption: {
      none: 'None',
    },

    tabs: {
      systemConfig: 'System Configuration',
      emailNotifications: 'Email Notifications',
      adminOperators: 'Admin Operators',
      activityLog: 'Activity Log',
      fattureCloud: 'Fatture in Cloud',
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

    fattureCloud: {
      integrationTitle: 'Fatture in Cloud Integration',
      integrationDescription: 'Enable Fatture in Cloud integration for automatic electronic invoice management.',

      credentials: 'API Credentials',
      accessToken: 'Access Token',
      accessTokenPlaceholder: 'Enter your Fatture in Cloud access token',
      accessTokenHint: 'Permanent authentication token generated from the Fatture in Cloud dashboard',
      companyId: 'Company ID',
      companyIdPlaceholder: 'e.g. 12345',
      companyIdHint: 'Numeric company ID on Fatture in Cloud',

      testConnection: 'Test Connection',
      connectionInfo: 'Active Connection',
      companyName: 'Company',
      connectedAt: 'Connected on',
      lastSync: 'Last Sync',

      options: 'Invoice Options',
      defaultPaymentMethod: 'Default Payment Method',
      defaultPaymentMethodHint: 'Payment method used in automatically generated invoices',
      autoSendSdi: 'Auto Send to SDI',
      autoSendSdiHint: 'Automatically send invoices to the Exchange System after creation',

      paymentMethods: {
        bonifico: 'Bank Transfer',
        carta: 'Credit Card',
        riba: 'Ri.Ba.',
        contanti: 'Cash',
        altro: 'Other',
      },

      saveConfig: 'Save Configuration',

      validation: {
        tokenRequired: 'Access token is required when integration is enabled',
        companyIdRequired: 'Company ID is required when integration is enabled',
      },

      toast: {
        configSaved: 'Fatture in Cloud configuration saved successfully',
        configError: 'Error saving configuration',
        connectionSuccess: 'Connection successful! Company: {name}',
        connectionError: 'Connection failed. Please check your credentials.',
      },
    },

    // Sources (settings/sources.vue)
    sources: {
      backToSettings: 'Back to Settings',
      title: 'Lead Sources',
      subtitle: 'Manage lead sources and API integrations',
      newSource: 'New Source',

      stats: {
        totalSources: 'Total Sources',
        active: 'Active',
        inactive: 'Inactive',
        withApiKey: 'With API Key',
      },

      infoBanner: 'Lead sources allow you to receive leads from different channels via API. Each source has its own API key for authentication.',

      emptyState: {
        title: 'No sources configured',
        description: 'Create your first lead source to start receiving leads via API.',
        createButton: 'Create Source',
      },

      headers: {
        name: 'Name',
        description: 'Description',
        apiKey: 'API Key',
        leads: 'Leads',
        status: 'Status',
        created: 'Created',
        actions: 'Actions',
      },

      tooltip: {
        hide: 'Hide API key',
        show: 'Show API key',
        copy: 'Copy API key',
        regenerate: 'Regenerate API key',
        edit: 'Edit',
        delete: 'Delete',
        hasLeads: 'Cannot delete: source has associated leads',
      },

      apiKeyNotConfigured: 'Not configured',
      statusActive: 'Active',
      statusInactive: 'Inactive',

      apiDocs: {
        title: 'API Documentation',
        endpoint: 'Endpoint',
        requiredHeaders: 'Required Headers',
        examplePayload: 'Example Payload',
        successResponse: 'Success Response',
      },

      dialog: {
        editTitle: 'Edit Source',
        createTitle: 'New Source',
        sourceName: 'Source Name',
        sourceNamePlaceholder: 'e.g. Meta Ads',
        slug: 'Slug',
        slugPlaceholder: 'e.g. meta-ads',
        slugHint: 'Unique identifier for the source (lowercase, hyphens allowed)',
        description: 'Description',
        descriptionPlaceholder: 'Describe the lead source...',
        activeSource: 'Active',
        activeSourceHint: 'Active sources can receive leads via API',
        generateApiKey: 'Generate API Key',
        generateApiKeyHint: 'Generate an API key for this source',
        cancel: 'Cancel',
        saveChanges: 'Save Changes',
        createSource: 'Create Source',
      },

      apiKeyDialog: {
        title: 'API Key',
        warning: 'Copy the API key now. For security reasons, it will not be shown again.',
        copied: 'Copied to clipboard',
      },

      confirmRegenerate: {
        message: 'Are you sure you want to regenerate the API key? The current key will stop working immediately.',
        header: 'Regenerate API Key',
        accept: 'Regenerate',
        reject: 'Cancel',
      },

      confirmDelete: {
        message: 'Are you sure you want to delete the source "{name}"? This action cannot be undone.',
        header: 'Confirm Deletion',
        accept: 'Delete',
        reject: 'Cancel',
      },

      toast: {
        apiKeyCopied: 'API key copied to clipboard',
        apiKeyCopyError: 'Error copying API key',
        sourceUpdated: 'Source "{name}" updated successfully',
        updateError: 'Error updating source',
        sourceCreated: 'Source "{name}" created successfully',
        createError: 'Error creating source',
        apiKeyRegenerated: 'API key regenerated successfully',
        regenerateError: 'Error regenerating API key',
        sourceDeleted: 'Source "{name}" deleted',
        deleteError: 'Error deleting source',
      },
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
