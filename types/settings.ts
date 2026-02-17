/**
 * Settings Types - Tipi per Impostazioni Sistema
 * Qualeadfied B2B Lead Platform
 */

/**
 * Configurazione sistema globale
 */
export interface SystemConfig {
  // Lead e Trial
  default_free_trial_leads: number
  // Fatturazione
  default_vat_rate: number
  order_number_prefix: string
  invoice_number_prefix: string
  // Email
  sender_email: string
  sender_name: string
  // SMTP
  smtp_host?: string
  smtp_port?: number
  smtp_username?: string
  smtp_encryption?: 'tls' | 'ssl' | 'none'
  // API
  api_provider?: 'sendgrid' | 'mailgun' | 'postmark'
  api_key?: string
}

/**
 * Form per aggiornamento configurazione
 */
export interface SystemConfigForm {
  default_free_trial_leads: number
  default_vat_rate: number
  order_number_prefix: string
  invoice_number_prefix: string
  sender_email: string
  sender_name: string
}

/**
 * Configurazione SMTP
 */
export interface SmtpConfigForm {
  smtp_host: string
  smtp_port: number
  smtp_username: string
  smtp_password?: string
  smtp_encryption: 'tls' | 'ssl' | 'none'
}

/**
 * Configurazione API Email
 */
export interface EmailApiConfigForm {
  api_provider: 'sendgrid' | 'mailgun' | 'postmark'
  api_key: string
}

/**
 * Frequenza notifiche
 */
export type NotificationFrequency = 'instant' | 'hourly' | 'daily' | 'weekly' | 'disabled'

/**
 * Configurazione notifiche per categoria
 */
export interface CategoryNotificationConfig {
  category_id: number
  category_name: string
  frequency: NotificationFrequency
  enabled: boolean
}

/**
 * Ruolo operatore admin
 */
export type AdminRole = 'super_admin' | 'admin' | 'operator'

/**
 * Stato operatore
 */
export type AdminStatus = 'active' | 'inactive'

/**
 * Operatore admin
 */
export interface AdminOperator {
  id: number
  email: string
  first_name: string
  last_name: string
  role: AdminRole
  status: AdminStatus
  last_login_at: string | null
  created_at: string
  updated_at: string
}

/**
 * Form creazione operatore
 */
export interface AdminOperatorCreateForm {
  email: string
  first_name: string
  last_name: string
  password: string
  password_confirmation: string
  role: AdminRole
}

/**
 * Form modifica operatore
 */
export interface AdminOperatorUpdateForm {
  email: string
  first_name: string
  last_name: string
  role: AdminRole
  status: AdminStatus
}

/**
 * Tipo di attività loggata
 */
export type ActivityType =
  | 'login'
  | 'logout'
  | 'create'
  | 'update'
  | 'delete'
  | 'export'
  | 'import'
  | 'status_change'
  | 'password_reset'
  | 'config_change'

/**
 * Entità soggetta a log
 */
export type ActivityEntity =
  | 'user'
  | 'client'
  | 'lead'
  | 'order'
  | 'invoice'
  | 'category'
  | 'package'
  | 'pricing'
  | 'admin'
  | 'system'

/**
 * Log attività
 */
export interface ActivityLog {
  id: number
  admin_id: number
  admin_name: string
  admin_email: string
  type: ActivityType
  entity: ActivityEntity
  entity_id?: number
  entity_name?: string
  description: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

/**
 * Filtri per log attività
 */
export interface ActivityLogFilters {
  admin_id?: number | null
  type?: ActivityType | ''
  entity?: ActivityEntity | ''
  date_from?: string
  date_to?: string
  search?: string
  page?: number
  per_page?: number
}

/**
 * Metodo di pagamento Fatture in Cloud
 */
export type FicPaymentMethod = 'bonifico' | 'carta' | 'ri.ba.' | 'contanti' | 'altro'

/**
 * Configurazione Fatture in Cloud
 */
export interface FattureCloudConfig {
  enabled: boolean
  access_token: string
  company_id: number | null
  company_name: string
  auto_send_sdi: boolean
  default_payment_method: FicPaymentMethod
  connected_at: string | null
  last_sync_at: string | null
}

/**
 * Form configurazione Fatture in Cloud
 */
export interface FattureCloudConfigForm {
  enabled: boolean
  access_token: string
  company_id: number | null
  auto_send_sdi: boolean
  default_payment_method: FicPaymentMethod
}

/**
 * Risultato test connessione Fatture in Cloud
 */
export interface FattureCloudTestResult {
  success: boolean
  company_name?: string
  company_id?: number
  error?: string
}
