export default {
  // Page title
  title: 'Cart',
  itemsInCart: '{count} leads in cart',
  continueShopping: 'Continue shopping',
  emptyCartButton: 'Empty cart',

  // Empty state
  empty: {
    title: 'Your cart is empty',
    subtitle: 'Start adding leads from the catalog',
    subtitleCheckout: 'Add leads to the cart to proceed to checkout',
    cta: 'Go to Catalog',
    browseCatalog: 'Browse Catalog',
  },

  // Cart group items
  item: {
    purchaseOf: 'Purchase of',
    leadsCategory: 'leads category',
    exclusive: 'exclusive',
    shared: 'shared',
    provinces: 'Provinces',
    removeGroup: 'Remove group',
    seeAllProvinces: 'See all {count} provinces',
    removalNote: 'Removing will delete all {count} leads in this group. Individual leads cannot be modified.',
    andOthers: '{list} and {count} others',
    purchaseSummary: 'Purchase of <strong>{count}</strong> <strong>{category}</strong> leads in <strong>{mode}</strong> mode',
    groupSummary: '{count} {mode} leads - Provinces: {provinces}',
  },

  // Order summary
  summary: {
    title: 'Order Summary',
    subtotal: 'Subtotal ({count} leads)',
    vat: 'VAT ({rate}%)',
    total: 'Total',
    checkout: 'Proceed to Checkout',
    securePayment: 'Secure payment with Stripe',
  },

  // Benefits
  benefits: {
    verified: 'Verified and quality leads',
    immediate: 'Immediate access after payment',
    guarantee: 'Satisfaction guarantee or money back',
  },

  // Confirm dialogs
  confirm: {
    removeGroup: {
      message: 'Do you want to remove all {count} {mode} leads from the "{category}" category?',
      header: 'Remove group',
      accept: 'Remove',
      reject: 'Cancel',
    },
    clearCart: {
      message: 'Are you sure you want to empty the cart?',
      header: 'Empty cart',
      accept: 'Empty',
      reject: 'Cancel',
    },
    removeFromCart: {
      message: 'Are you sure you want to remove this lead from the cart?',
      header: 'Remove from cart',
      accept: 'Remove',
      reject: 'Cancel',
    },
    purchase: {
      message: 'Do you confirm the purchase for a total of {total}?',
      header: 'Confirm purchase',
      accept: 'Confirm',
      reject: 'Cancel',
    },
  },

  // Toast messages
  toast: {
    addedToCart: {
      summary: 'Added to cart',
      detail: 'The lead has been added to the cart',
    },
    groupRemoved: 'Group removed ({count} leads)',
    cartCleared: 'Cart emptied',
    errorRemoving: 'Error removing',
    errorClearing: 'Error emptying cart',
    errorAddingToCart: 'Error adding to cart',
    checkoutSuccess: 'Order completed successfully!',
  },

  // Checkout page
  checkout: {
    title: 'Checkout',
    subtitle: 'Complete your order',
    backToCart: 'Back to cart',

    // Billing
    billingTitle: 'Billing Details',
    billingData: 'Billing Details',
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
    pecPlaceholder: 'company@pec.it',
    sdiOrPecNote: '* Enter the SDI Code or PEC for electronic invoicing',
    sdiPecHint: '* Enter the SDI Code or PEC for electronic invoicing',

    // Payment
    paymentTitle: 'Payment Method',
    paymentMethod: 'Payment Method',
    cardOption: 'Credit/Debit Card',
    creditCard: 'Credit/Debit Card',
    cardDescription: 'Visa, Mastercard, American Express',
    cardBrands: 'Visa, Mastercard, American Express',
    sepaOption: 'SEPA Direct Debit',
    sepa: 'SEPA Direct Debit',
    sepaDescription: 'Direct bank transfer',
    stripeSecure: 'Payments are securely processed by Stripe. We do not store your card details.',
    stripeInfo: 'Payments are securely processed by Stripe. We do not store your card details.',

    // Summary
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    leadItem: 'Lead #{id}',
    processing: 'Processing...',
    payButton: 'Pay {amount}',
    pay: 'Pay {amount}',
    terms: 'By proceeding you accept the',
    termsOfService: 'Terms of Service',
    and: 'and the',
    privacyPolicy: 'Privacy Policy',
    termsAgreement: 'By proceeding you accept the {terms} and the {privacy}',

    // Empty cart on checkout
    emptyTitle: 'Empty cart',
    emptySubtitle: 'Add leads to the cart to proceed to checkout',
    emptyCta: 'Go to Catalog',

    // Toast
    orderCompleted: 'Order completed successfully!',
    errorPayment: 'Payment error',
    paymentError: 'Payment error',
    errorCreatingPayment: 'Error creating payment',
    paymentCreateError: 'Error creating payment',
    errorBillingUpdate: 'Error updating billing details',
    billingUpdateError: 'Error updating billing details',
    errorFormValidation: 'Please correct the form errors',
    fixErrors: 'Please correct the form errors',
  },

  // Purchase modes
  purchaseMode: {
    exclusive: 'Exclusive',
    shared: 'Shared',
  },
}
