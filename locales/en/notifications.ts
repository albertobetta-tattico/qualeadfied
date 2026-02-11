export default {
  toast: {
    summaries: {
      success: 'Success',
      error: 'Error',
      info: 'Info',
      warning: 'Warning',
    },
    auth: {
      loginSuccess: 'Logged in successfully',
      invalidCredentials: 'Invalid credentials',
      registrationComplete: 'Registration completed!',
      registrationError: 'Error during registration',
      formErrors: 'Please correct the errors in the form',
      emailSentSuccess: 'Email sent successfully',
      emailSentError: 'Error sending the email',
      emailResent: 'Email sent again',
      emailResendError: 'Error sending the email',
      passwordResetSuccess: 'Password reset successfully',
      passwordResetError: 'Error during password reset',
      emailVerifiedSuccess: 'Email verified successfully!',
      resendEmailSuccess: 'Email sent again',
    },
    cart: {
      addedToCart: 'Added to cart',
      addedToCartDetail: 'The lead has been added to the cart',
    },
    trial: {
      leadsRedeemed: '{count} leads redeemed successfully!',
      redeemError: 'Error redeeming',
      maxSelection: 'You can select a maximum of {count} leads',
      alreadyMaxSelected: 'You have already selected the maximum of {count} leads',
      addedWithLimit: '{count} leads added (limit reached)',
      selectAtLeastOne: 'Select at least one lead',
    },
  },
  confirm: {
    logout: {
      message: 'Are you sure you want to log out?',
      header: 'Confirm Logout',
      acceptLabel: 'Log Out',
      rejectLabel: 'Cancel',
    },
    removeFromCart: {
      message: 'Are you sure you want to remove this lead from the cart?',
      header: 'Remove from cart',
      acceptLabel: 'Remove',
      rejectLabel: 'Cancel',
    },
    clearCart: {
      message: 'Are you sure you want to clear the cart?',
      header: 'Clear cart',
      acceptLabel: 'Clear',
      rejectLabel: 'Cancel',
    },
    purchase: {
      message: 'Do you confirm the purchase for a total of {total}?',
      header: 'Confirm purchase',
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
    },
    claimTrial: {
      message: 'Do you confirm the redemption of {count} free leads?',
      header: 'Redeem free leads',
      acceptLabel: 'Redeem',
      rejectLabel: 'Cancel',
    },
  },
}
