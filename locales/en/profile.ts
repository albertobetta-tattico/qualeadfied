export default {
  // Main profile page
  title: 'My Profile',
  subtitle: 'Manage your personal information',
  logout: 'Logout',

  // Tabs/navigation
  tabs: {
    personalInfo: 'Personal Info',
    preferences: 'Preferences',
    billing: 'Billing Details',
    security: 'Security',
  },

  // Company info
  company: {
    title: 'Company Details',
    companyName: 'Company Name',
    vatNumber: 'VAT Number',
    email: 'Email',
    editNote: 'To edit company details please contact support',
  },

  // Personal info
  personalInfo: {
    title: 'Personal Info',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone',
    save: 'Save',
    cancel: 'Cancel',
  },

  // Account management sidebar
  accountManagement: {
    title: 'Account Management',
    billingData: 'Billing Details',
    security: 'Security',
    preferences: 'Preferences',
  },

  // Account status
  accountStatus: {
    title: 'Account Status',
    billingData: 'Billing details',
    billingComplete: 'Complete',
    billingIncomplete: 'To be completed',
    freeTrial: 'Free trial',
    freeTrialLeads: '{count} leads',
    freeTrialExhausted: 'Exhausted',
    notifications: 'Notifications',
    notificationsEmail: 'Email notifications',
    notificationsActive: 'Active',
    notificationsInactive: 'Inactive',
    marketing: 'Marketing',
    marketingActive: 'Active',
    marketingInactive: 'Inactive',
  },

  // Support
  support: {
    needHelp: 'Need help?',
    contactSupport: 'Contact Support',
  },

  // Toast
  toast: {
    profileUpdated: 'Profile updated',
    errorUpdating: 'Error updating',
  },

  // Preferences page
  preferences: {
    title: 'Preferences',
    subtitle: 'Manage notifications and communications',
    backToProfile: 'Back to profile',

    // Email notifications
    emailNotifications: {
      title: 'Email Notifications',
      toggle: 'New lead notifications',
      description: 'Receive emails when there are new leads in your categories of interest',
      includes: 'Notifications include:',
      newLeads: 'New leads available in your categories',
      orderConfirmations: 'Order confirmations and invoices',
      packageExpiry: 'Active package expiration',
      accountUpdates: 'Important account updates',
    },

    // Marketing
    marketing: {
      title: 'Marketing Communications',
      toggle: 'Newsletter and promotions',
      description: 'Receive updates on special offers, promotions, and news',
      includes: 'Marketing communications include:',
      offers: 'Exclusive offers and discounts',
      newPackages: 'New packages and features',
      conversionTips: 'Tips to improve conversions',
      unsubscribeNote: 'You can unsubscribe at any time by clicking the link in every email.',
    },

    // Current status
    currentStatus: {
      title: 'Current Status',
    },

    // Privacy
    privacy: {
      title: 'Your privacy',
      description: 'Your data is protected and is never shared with third parties for marketing purposes.',
      readPolicy: 'Read the Privacy Policy',
    },

    // Toast
    toast: {
      emailEnabled: 'Email notifications enabled',
      emailDisabled: 'Email notifications disabled',
      marketingEnabled: 'Marketing consent enabled',
      marketingDisabled: 'Marketing consent disabled',
    },
  },

  // Billing page
  billing: {
    title: 'Billing Details',
    subtitle: 'Manage your electronic invoicing details',
    backToProfile: 'Back to profile',

    // Address section
    addressTitle: 'Billing Address',
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

    // Electronic invoicing
    electronicInvoicing: {
      title: 'Electronic Invoicing',
      description: 'Enter the SDI Code or PEC address to receive electronic invoices.',
      sdiCode: 'SDI Code',
      sdiCodePlaceholder: 'ABC1234',
      sdiCodeHelp: '7 alphanumeric characters',
      pecEmail: 'PEC Email',
      pecEmailPlaceholder: 'company@pec.it',
    },

    // Save
    saveChanges: 'Save Changes',

    // Info card
    infoTitle: 'Electronic Invoicing',
    infoDescription: 'Invoices are issued and sent electronically to the Exchange System (SDI) of the Revenue Agency.',

    // Help
    help: {
      title: 'Help',
      whatIsSdi: 'What is the SDI Code?',
      sdiDescription: 'It is the unique code that identifies the channel for receiving electronic invoices.',
      noSdi: 'I don\'t have an SDI Code',
      noSdiDescription: 'You can use your company\'s PEC address as an alternative.',
    },

    // Toast
    toast: {
      billingUpdated: 'Billing details updated',
      errorUpdating: 'Error updating',
      errorFormValidation: 'Please correct the form errors',
    },

    // Validation
    validation: {
      addressRequired: 'Enter the address',
      cityRequired: 'Enter the city',
      provinceRequired: 'Enter the province',
      zipRequired: 'Enter the ZIP code',
      zipInvalid: 'Invalid ZIP code (5 digits)',
      sdiOrPecRequired: 'Enter the SDI code or PEC',
      sdiInvalid: 'Invalid SDI code (7 characters)',
      pecInvalid: 'Invalid PEC email',
    },
  },

  // Security page
  security: {
    title: 'Security',
    subtitle: 'Manage your password and security settings',
    backToProfile: 'Back to profile',

    // Password change
    changePassword: {
      title: 'Change Password',
      currentPassword: 'Current Password',
      currentPasswordPlaceholder: 'Enter your current password',
      newPassword: 'New Password',
      newPasswordPlaceholder: 'Enter the new password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm the new password',
      submit: 'Change Password',
    },

    // Password strength
    strength: {
      weak: 'Weak',
      fair: 'Fair',
      good: 'Good',
      strong: 'Strong',
    },

    // Requirements
    requirements: {
      title: 'Password Requirements',
      minLength: 'At least 8 characters',
      uppercase: 'One uppercase letter',
      lowercase: 'One lowercase letter',
      number: 'At least one number',
    },

    // Tips
    tips: {
      title: 'Security Tips',
      noReuse: 'Do not reuse passwords from other sites',
      useManager: 'Use a password manager',
      noShare: 'Do not share your password',
    },

    // Validation
    validation: {
      currentRequired: 'Enter your current password',
      newRequired: 'Enter the new password',
      newWeak: 'Min. 8 characters, 1 uppercase, 1 lowercase, 1 number',
      confirmRequired: 'Confirm the new password',
      noMatch: 'Passwords do not match',
    },

    // Toast
    toast: {
      passwordChanged: 'Password changed successfully',
      errorChanging: 'Error changing password',
      errorFormValidation: 'Please correct the form errors',
    },
  },
}
