/**
 * Types - Authentication & User
 * Types for public authentication and user profile
 */

// User roles
export type UserRole = 'client' | 'admin' | 'super_admin'

// User status
export type UserStatus = 'pending' | 'active' | 'suspended' | 'blocked'

// Base user interface
export interface User {
  id: number
  email: string
  email_verified_at: string | null
  role: UserRole
  status: UserStatus
  created_at: string
  updated_at: string
}

// Client profile (B2B user)
export interface ClientProfile {
  id: number
  user_id: number
  company_name: string
  vat_number: string
  phone: string
  first_name: string
  last_name: string

  // Billing address
  billing_address: string | null
  billing_city: string | null
  billing_province: string | null
  billing_zip: string | null
  billing_country: string

  // SDI/PEC
  sdi_code: string | null
  pec_email: string | null

  // Trial
  free_trial_enabled: boolean
  free_trial_leads_remaining: number

  // Preferences
  email_notifications_enabled: boolean
  marketing_consent: boolean

  created_at: string
  updated_at: string
}

// Full user with profile
export interface UserWithProfile extends User {
  profile: ClientProfile
}

// Registration form data
export interface RegisterForm {
  company_name: string
  vat_number: string
  email: string
  phone: string
  first_name: string
  last_name: string
  password: string
  password_confirmation: string
  terms_accepted: boolean
  privacy_accepted: boolean
  marketing_consent: boolean
  category_ids: number[]
}

// Login form data
export interface LoginForm {
  email: string
  password: string
  remember: boolean
}

// Forgot password form
export interface ForgotPasswordForm {
  email: string
}

// Reset password form
export interface ResetPasswordForm {
  email: string
  token: string
  password: string
  password_confirmation: string
}

// Change password form
export interface ChangePasswordForm {
  current_password: string
  password: string
  password_confirmation: string
}

// Auth API responses
export interface AuthResponse {
  user: UserWithProfile
  token: string
}

export interface MessageResponse {
  message: string
}

// Validation errors from API
export interface ValidationErrors {
  [key: string]: string[]
}

// API error response
export interface ApiError {
  message: string
  errors?: ValidationErrors
}

// ──────────────────────────────────────────────────────────────
// Admin Authentication Types
// ──────────────────────────────────────────────────────────────

export type AdminRole = 'super_admin' | 'admin' | 'operator'
export type AdminStatusType = 'active' | 'inactive'

export interface AdminUser {
  id: number
  email: string
  first_name: string
  last_name: string
  role: AdminRole
  status: AdminStatusType
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export interface AdminLoginForm {
  email: string
  password: string
}

export interface AdminAuthResponse {
  message: string
  admin: AdminUser
  token: string
}
