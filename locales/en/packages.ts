export default {
  // Packages list page (pacchetti/index.vue)
  title: 'Lead Packages',
  subtitle: 'Purchase lead packages at discounted prices. The more leads you buy, the more you save.',

  // Filter
  filters: {
    allCategories: 'All categories',
    filterByCategory: 'Filter by category',
  },

  // Active packages link
  myActivePackages: 'My active packages',

  // Package card
  card: {
    allCategories: 'All categories',
    leads: 'leads',
    perLead: '/ lead',
    exclusiveLeads: '{count} exclusive leads + {shared} shared',
    validity: 'Validity {days} days',
    savings: 'You save {amount}',
    freeSelection: 'Free selection from catalog',
    buyPackage: 'Buy Package',
  },

  // Empty state
  empty: {
    title: 'No packages available',
    subtitle: 'There are currently no packages available for this category',
  },

  // Info section
  info: {
    savingsTitle: 'Save up to 30%',
    savingsDescription: 'Packages offer significant discounts compared to individual purchases',
    freeSelectionTitle: 'Free Selection',
    freeSelectionDescription: 'Choose which leads to redeem from the catalog during the validity period',
    flexibleTitle: 'Flexible Validity',
    flexibleDescription: 'You have time to use your leads, no rush',
  },

  // Active packages page (pacchetti/attivi.vue)
  active: {
    title: 'My Packages',
    subtitle: 'Manage your active lead packages',
    buyNew: 'Buy New Package',

    // Package card
    allCategories: 'All categories',
    daysRemaining: '{count} days remaining',
    purchasedOn: 'Purchased on {date} - Expires on {expiry}',
    leadsUsed: 'Leads used',
    leadsRemaining: '{count} leads remaining',
    selectLeads: 'Select Leads',

    // Expiring warning
    expiringWarning: 'This package expires in {days} days. Use the {remaining} remaining leads before expiration.',

    // Empty state
    empty: {
      title: 'No active packages',
      subtitle: 'You have not purchased any lead packages yet',
      explore: 'Explore Packages',
    },

    // Benefits reminder
    whyBuy: {
      title: 'Why buy a package?',
      description: 'Packages allow you to save up to 30% compared to purchasing individual leads. Plus, you have the flexibility to choose which leads to redeem during the validity period.',
      learnMore: 'Learn more',
    },
  },

  // Select leads page (pacchetti/[id]/seleziona.vue)
  select: {
    title: 'Select Leads',
    backToPackages: 'Back to packages',
    leadsAvailable: '{name} - {count} leads available',
    selectedCount: '{selected} / {total} selected',
    redeemLeads: 'Redeem Leads',

    // Package info card
    packageInfo: {
      available: 'Available',
      used: 'Used',
      total: 'Total',
      exclusiveTitle: 'Exclusive',
      sharedTitle: 'Shared',
      remainingOf: '{remaining} / {total}',
      pickingSummary: 'Currently picking: {exclusive} exclusive + {shared} shared',
    },

    // Lead card
    leadCard: {
      leadId: 'Lead #{id}',
      availability: {
        exclusive: 'Exclusive available',
        shared: 'Shared ({available}/{total} slots)',
      },
      modeToggle: {
        exclusive: 'Exclusive',
        shared: 'Shared',
      },
    },

    // Floating action bar
    floatingBar: {
      selected: '{count} leads selected',
      redeemHint: 'Click "Redeem Leads" to add them to your portfolio',
      cancel: 'Cancel',
      redeem: 'Redeem Leads',
      summaryMixed: 'You are about to redeem {exclusive} as exclusive and {shared} shared',
      summaryExclusiveOnly: 'You are about to redeem {exclusive} as exclusive',
      summarySharedOnly: 'You are about to redeem {shared} shared',
      leadExclusiveSingular: '1 lead',
      leadExclusivePlural: '{count} leads',
      leadSharedSingular: '1 lead',
      leadSharedPlural: '{count} leads',
    },

    // Empty state
    empty: {
      title: 'No leads available',
      subtitle: 'There are currently no leads available for this category',
    },

    // Toast
    toast: {
      redeemed: '{count} leads redeemed successfully!',
      errorRedeeming: 'Error redeeming',
      selectAtLeast: 'Select at least one lead',
      bothBudgetsEmpty: 'You have used both exclusive and shared slots of this package',
      noCapacityForLead: 'This lead is not available in the modes remaining in the package',
    },
  },

  // Purchase page (pacchetti/[id]/acquista.vue)
  purchase: {
    title: 'Buy Package',
    subtitle: 'Complete the package purchase',
    backToPackages: 'Back to packages',

    // Billing (shared with checkout)
    billing: {
      title: 'Billing Details',
      companyName: 'Company Name',
      vatNumber: 'VAT Number',
      address: 'Address',
      addressPlaceholder: 'Street, number',
      city: 'City',
      cityPlaceholder: 'City',
      province: 'Province',
      provincePlaceholder: 'MI',
      zip: 'ZIP Code',
      zipPlaceholder: '20100',
      country: 'Country',
      sdiCode: 'SDI Code',
      sdiCodePlaceholder: 'ABC1234',
      pecEmail: 'PEC Email',
      pecEmailPlaceholder: 'company@pec.it',
    },

    // Payment method
    payment: {
      title: 'Payment Method',
      cardOption: 'Credit/Debit Card',
      cardDescription: 'Visa, Mastercard, American Express',
      sepaOption: 'SEPA Direct Debit',
      sepaDescription: 'Direct bank transfer',
    },

    // Summary
    summary: {
      title: 'Order Summary',
      leads: '{count} leads',
      savings: 'Savings',
      vat: 'VAT ({rate}%)',
      total: 'Total',
      validity: 'Validity {days} days',
      exclusiveAndShared: '{exclusive} exclusive leads + {shared} shared',
      freeSelection: 'Free selection from catalog',
      processing: 'Processing...',
      payButton: 'Pay {amount}',
      securePayment: 'Secure payment with Stripe',
    },

    // Toast
    toast: {
      success: 'Package purchased successfully!',
      errorPurchase: 'Error purchasing',
      errorBilling: 'Error updating billing details',
      errorFormValidation: 'Please correct the form errors',
    },
  },

  // Free trial confirm
  confirm: {
    claimTrial: {
      message: 'Do you confirm the redemption of {count} free leads?',
      header: 'Redeem free leads',
      accept: 'Redeem',
      reject: 'Cancel',
    },
  },
}
