/**
 * Bridge types - Re-export commonly used types from the auto-generated OpenAPI spec.
 *
 * Usage:
 *   import type { ApiLead, ApiUser, ApiCategory } from '~/types/api'
 *
 * For full path/operation types used with useTypedApi(), import directly:
 *   import type { paths, operations, components } from '~/types/api.generated'
 */
import type { components } from './api.generated'

// Re-export the full generated namespace for convenience
export type { paths, operations, components } from './api.generated'

// ── Schema shortcuts ─────────────────────────────────────────────────────────

// Core entities
export type ApiUser = components['schemas']['User']
export type ApiAdmin = components['schemas']['Admin']
export type ApiClientProfile = components['schemas']['ClientProfile']

// Catalog
export type ApiCategory = components['schemas']['Category']
export type ApiCategoryPrice = components['schemas']['CategoryPrice']
export type ApiProvince = components['schemas']['Province']
export type ApiPackage = components['schemas']['Package']

// Leads
export type ApiLead = components['schemas']['Lead']
export type ApiLeadSource = components['schemas']['LeadSource']
export type ApiLeadSale = components['schemas']['LeadSale']
export type ApiUserLead = components['schemas']['UserLead']

// Commerce
export type ApiOrder = components['schemas']['Order']
export type ApiOrderItem = components['schemas']['OrderItem']
export type ApiCartItem = components['schemas']['CartItem']
export type ApiUserPackage = components['schemas']['UserPackage']
export type ApiInvoice = components['schemas']['Invoice']
export type ApiTransaction = components['schemas']['Transaction']

// Settings & System
export type ApiNotificationSetting = components['schemas']['NotificationSetting']
export type ApiSystemSetting = components['schemas']['SystemSetting']

// ── Enum shortcuts ───────────────────────────────────────────────────────────

export type ApiLeadStatus = components['schemas']['LeadStatus']
export type ApiUserRole = components['schemas']['UserRole']
export type ApiUserStatus = components['schemas']['UserStatus']
export type ApiOrderStatus = components['schemas']['OrderStatus']
export type ApiOrderType = components['schemas']['OrderType']
export type ApiAdminRole = components['schemas']['AdminRole']
export type ApiAdminStatus = components['schemas']['AdminStatus']
export type ApiAcquisitionMode = components['schemas']['AcquisitionMode']
export type ApiAcquisitionType = components['schemas']['AcquisitionType']
export type ApiPurchaseMode = components['schemas']['PurchaseMode']
export type ApiPaymentMethod = components['schemas']['PaymentMethod']
export type ApiTransactionStatus = components['schemas']['TransactionStatus']
export type ApiTransactionPaymentType = components['schemas']['TransactionPaymentType']
export type ApiInvoiceType = components['schemas']['InvoiceType']
export type ApiSdiStatus = components['schemas']['SdiStatus']
export type ApiContactStatus = components['schemas']['ContactStatus']
export type ApiPackageStatus = components['schemas']['PackageStatus']
export type ApiNotificationFrequency = components['schemas']['NotificationFrequency']
