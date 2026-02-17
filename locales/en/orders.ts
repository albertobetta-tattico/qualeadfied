export default {
  // Orders list page (ordini/index.vue)
  list: {
    title: 'My Orders',
    subtitle: 'History of your orders and invoices',
    buyLead: 'Buy Lead',

    // Filters
    filters: {
      status: 'Status',
      allStatuses: 'All statuses',
      orderType: 'Order Type',
      allTypes: 'All types',
      filter: 'Filter',
      reset: 'Reset',
    },

    // Table
    table: {
      order: 'Order',
      date: 'Date',
      type: 'Type',
      leads: 'Leads',
      total: 'Total',
      status: 'Status',
      actions: 'Actions',
    },

    // Actions
    actions: {
      details: 'Details',
      downloadInvoice: 'Download invoice',
    },

    // Stats
    stats: {
      totalOrders: 'Total orders',
      totalSpent: 'Total spent',
      completedOrders: 'Completed orders',
    },

    // Empty state
    empty: {
      title: 'No orders',
      subtitle: 'You have not placed any orders yet',
      catalog: 'Go to Catalog',
      buyPackage: 'Buy Package',
    },

    // Toast
    toast: {
      downloadStarted: 'Download started',
      errorDownload: 'Download error',
    },
  },

  // Order detail page (ordini/[id].vue)
  detail: {
    backToOrders: 'Back to orders',
    orderTitle: 'Order {number}',
    createdAt: 'Placed on {date}',
    downloadInvoice: 'Download Invoice',
    print: 'Print',

    // Items
    items: {
      title: 'Purchased Leads ({count})',
      emptyMessage: 'Lead details not available',
    },

    // Billing
    billing: {
      title: 'Billing Details',
      companyName: 'Company Name',
      vatNumber: 'VAT Number',
      address: 'Address',
      sdiCode: 'SDI Code',
      pec: 'PEC',
    },

    // Summary
    summary: {
      title: 'Order Summary',
      subtotal: 'Subtotal',
      vat: 'VAT ({rate}%)',
      total: 'Total',
    },

    // Payment
    payment: {
      title: 'Payment',
      method: 'Method',
      status: 'Status',
      paidAt: 'Payment date',
      transactionId: 'Transaction ID',
    },

    // Invoice
    invoice: {
      title: 'Invoice',
      number: 'Number',
      downloadPdf: 'Download PDF',
    },

    // Help
    help: {
      message: 'Need help with this order?',
      contactSupport: 'Contact Support',
    },
  },

  // Order statuses
  status: {
    pending: 'Pending',
    paid: 'Paid',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    refunded: 'Refunded',
    cancelled: 'Cancelled',
  },

  // Alias for dashboard.vue compatibility (uses orders.statuses.*)
  statuses: {
    pending: 'Pending',
    paid: 'Paid',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    refunded: 'Refunded',
    cancelled: 'Cancelled',
  },

  // Order types
  type: {
    all: 'All types',
    single: 'Single',
    package: 'Package',
    freeTrial: 'Free Trial',
  },

  // Payment methods
  paymentMethod: {
    all: 'All methods',
    card: 'Credit Card',
    cardFull: 'Credit card',
    sepa: 'SEPA Direct Debit',
    free: 'Free',
  },

  // Acquisition modes
  acquisitionMode: {
    exclusive: 'Exclusive',
    shared: 'Shared',
    free: 'Free',
  },

  // Order descriptions (from useOrder.ts)
  description: {
    packagePurchase: 'Package purchase',
    freeTrialLeads: '{count} free leads',
    singleLeads: '{count} single leads',
  },

  // Toast (from useOrder.ts)
  toast: {
    success: 'Operation completed',
    error: 'Error',
    info: 'Information',
    warning: 'Warning',
    orderNumberCopied: 'Order number "{number}" copied to clipboard',
    cannotCopy: 'Unable to copy to clipboard',
  },

  // Transactions (from useTransaction.ts)
  transactions: {
    title: 'Transactions',

    // Statuses
    status: {
      all: 'All statuses',
      pending: 'Pending',
      requiresAction: 'Action Required',
      processing: 'Processing',
      succeeded: 'Completed',
      failed: 'Failed',
      canceled: 'Canceled',
    },

    // Payment types
    paymentType: {
      all: 'All types',
      card: 'Credit Card',
      sepaDebit: 'SEPA Direct Debit',
    },

    // Failure codes
    failureCodes: {
      cardDeclined: 'Card Declined',
      insufficientFunds: 'Insufficient Funds',
      expiredCard: 'Expired Card',
      incorrectCvc: 'Invalid CVC',
      processingError: 'Processing Error',
      incorrectNumber: 'Invalid Card Number',
      authenticationRequired: 'Authentication Required',
      bankAccountDeclined: 'Account Declined',
      debitNotAuthorized: 'Debit Not Authorized',
    },

    // Toast
    toast: {
      paymentIntentCopied: 'Payment Intent ID copied to clipboard',
      chargeIdCopied: 'Charge ID copied to clipboard',
      stripeResponseCopied: 'Stripe response copied to clipboard',
      cannotCopy: 'Unable to copy to clipboard',
    },
  },

  // Invoices (from useInvoice.ts)
  invoices: {
    title: 'Invoices',

    // Types
    type: {
      all: 'All types',
      invoice: 'Invoice',
      invoicePlural: 'Invoices',
      creditNote: 'Credit Note',
      creditNotePlural: 'Credit Notes',
    },

    // SDI statuses
    sdiStatus: {
      all: 'All statuses',
      pending: 'Pending',
      sent: 'Sent',
      delivered: 'Delivered',
      accepted: 'Accepted',
      rejected: 'Rejected',
      notDelivered: 'Not Delivered',
      error: 'Error',
    },

    // Confirm dialogs
    confirm: {
      resendSdi: {
        message: 'Resend invoice "{number}" to SDI?',
        header: 'Resend to SDI',
        accept: 'Resend',
        reject: 'Cancel',
      },
      sendEmail: {
        message: 'Send invoice "{number}" via email to the customer?',
        header: 'Send Email',
        accept: 'Send',
        reject: 'Cancel',
      },
      createCreditNote: {
        message: 'Create a credit note for invoice "{number}"? The amount will be {amount}.',
        header: 'Create Credit Note',
        accept: 'Create',
        reject: 'Cancel',
      },
    },
  },
}
