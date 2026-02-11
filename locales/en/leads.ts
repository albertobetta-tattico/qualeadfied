export default {
  // Catalog page (leads/index.vue)
  catalog: {
    title: 'Lead Catalog',
    available: '{count} leads available',
    cartButton: 'Cart ({count})',

    // Filters
    filters: {
      category: 'Category',
      categoryPlaceholder: 'Select category',
      allCategories: 'All categories',
      province: 'Province',
      provincePlaceholder: 'Select province',
      allProvinces: 'All provinces',
      mode: 'Mode',
      modePlaceholder: 'Select mode',
      allModes: 'All modes',
      exclusive: 'Exclusive',
      shared: 'Shared',
      dateGenerated: 'Generation date',
      datePlaceholder: 'Select period',
      filter: 'Filter',
      resetFilters: 'Reset filters',
    },

    // Bulk actions
    bulk: {
      selected: '{count} leads selected',
      purchasable: '({count} purchasable)',
      mode: 'Mode:',
      total: 'Total:',
      addToCart: 'Add {count} to cart',
      deselectAll: 'Deselect all',
    },

    // Table headers
    table: {
      id: 'ID',
      category: 'Category',
      province: 'Province',
      request: 'Request',
      availability: 'Availability',
      slots: '{count} slots',
      date: 'Date',
      price: 'Price',
      exclusivePrice: 'Exclusive',
      sharedPrice: 'Shared',
      actions: 'Actions',
    },

    // Cart status
    inCart: 'In cart',
    inCartExclusive: 'Excl.',
    inCartShared: 'Shrd.',
    addExclusive: 'Exclusive',
    addShared: 'Shared',

    // Empty state
    empty: {
      title: 'No leads found',
      subtitle: 'Try changing your search filters',
      resetFilters: 'Reset filters',
    },

    // Toast messages
    toast: {
      addedMultiple: '{count} leads added to cart',
      notAdded: '{count} leads not added',
      selectAtLeast: 'Select at least one lead',
    },
  },

  // My Leads page (i-miei-lead/index.vue)
  myLeads: {
    title: 'My Leads',
    subtitle: '{count} leads in your portfolio',

    // Stats
    stats: {
      total: 'Total Leads',
      toContact: 'To Contact',
      converted: 'Converted',
      conversionRate: 'Conversion',
    },

    // Filters
    filters: {
      category: 'Category',
      categoryAll: 'All',
      province: 'Province',
      provinceAll: 'All',
      status: 'Status',
      mode: 'Mode',
      allModes: 'All modes',
      exclusive: 'Exclusive',
      shared: 'Shared',
      purchaseDate: 'Purchase date',
      datePlaceholder: 'Select period',
      filter: 'Filter',
    },

    // Export
    export: {
      button: 'Export',
      csv: 'Export CSV',
      excel: 'Export Excel',
    },

    // Buy lead
    buyLead: 'Buy Lead',

    // Table
    table: {
      id: 'ID',
      contact: 'Contact',
      phone: 'Phone',
      category: 'Category',
      province: 'Province',
      status: 'Status',
      mode: 'Mode',
      price: 'Price',
      purchaseDate: 'Purchase Date',
      actions: 'Actions',
    },

    // Actions
    actions: {
      markContacted: 'Mark as contacted',
      viewDetails: 'View details',
    },

    // Empty state
    empty: {
      title: 'No leads in portfolio',
      subtitle: 'Start buying leads to build your client portfolio',
      catalog: 'Go to Catalog',
      buyPackage: 'Buy Package',
    },

    // Toast messages
    toast: {
      statusUpdated: 'Status updated',
      errorUpdating: 'Error updating',
      exportCompleted: 'Export completed',
      errorExport: 'Error exporting',
    },
  },

  // Lead Detail page (i-miei-lead/[id].vue)
  detail: {
    backToLeads: 'Back to my leads',
    purchasedOn: 'Purchased on {date}',
    status: 'Status:',

    // Contact info
    contactInfo: {
      title: 'Contact Information',
      email: 'Email',
      phone: 'Phone',
      sendEmail: 'Send Email',
      call: 'Call',
    },

    // Request details
    requestDetails: {
      title: 'Request Details',
      generatedAt: 'Request generated {time} ({date})',
    },

    // Notes
    notes: {
      title: 'Notes',
      placeholder: 'Add notes about the lead...',
      save: 'Save',
      cancel: 'Cancel',
      clickToAdd: 'Click to add notes',
    },

    // Status card
    statusCard: {
      title: 'Lead Status',
      lastContact: 'Last contact',
      purchased: 'Purchased',
    },

    // Purchase info
    purchaseInfo: {
      title: 'Purchase Details',
      price: 'Price',
      mode: 'Mode',
      order: 'Order',
    },

    // Quick actions
    quickActions: {
      title: 'Quick Actions',
      markContacted: 'Mark as contacted',
      inProgress: 'In progress',
      notInterested: 'Not interested',
    },

    // Toast messages
    toast: {
      statusUpdated: 'Status updated',
      errorUpdating: 'Error updating',
      notesSaved: 'Notes saved',
      errorSavingNotes: 'Error saving notes',
      copiedToClipboard: '{label} copied to clipboard',
    },
  },

  // Contact statuses
  status: {
    all: 'All statuses',
    new: 'New',
    contacted: 'Contacted',
    inProgress: 'In progress',
    notInterested: 'Not interested',
    converted: 'Converted',
  },

  // Lead statuses (admin/catalog)
  leadStatus: {
    free: 'Available',
    soldExclusive: 'Sold Exclusive',
    soldShared: 'Shared',
    exhausted: 'Exhausted',
  },

  // Acquisition types
  acquisitionType: {
    all: 'All types',
    exclusive: 'Exclusive',
    shared: 'Shared',
    freeTrial: 'Free Trial',
  },

  // Validation errors (from useLead.ts)
  validation: {
    required: '{field} is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email format',
    phoneRequired: 'Phone is required',
    phoneInvalid: 'Invalid phone format',
    selectCategory: 'Select a category',
    selectProvince: 'Select a province',
    selectSource: 'Select a source',
    dateRequired: 'Generation date is required',
    dateInvalid: 'Invalid date',
    dateFuture: 'Date cannot be in the future',
    firstNameRequired: 'First name is required',
    lastNameRequired: 'Last name is required',
    nameMinLength: 'First name must be at least 2 characters',
    lastNameMinLength: 'Last name must be at least 2 characters',
    slugMinLength: 'Slug must be at least 2 characters',
    slugFormat: 'Slug can only contain lowercase letters, numbers, and hyphens',
  },

  // Confirm dialogs (from useLead.ts)
  confirm: {
    delete: {
      message: 'Are you sure you want to delete the lead for "{name}"? This action cannot be undone.',
      header: 'Confirm Deletion',
      accept: 'Delete',
      reject: 'Cancel',
    },
    bulkDelete: {
      message: 'Are you sure you want to delete {count} selected leads? Already sold leads will be skipped.',
      header: 'Confirm Bulk Deletion',
      accept: 'Delete',
      reject: 'Cancel',
    },
    cannotDelete: {
      summary: 'Operation not allowed',
      detail: 'Cannot delete an already sold lead',
    },
  },

  // Toast summaries (from useLead.ts)
  toast: {
    success: 'Operation completed',
    error: 'Error',
    info: 'Information',
    warning: 'Warning',
  },
}
