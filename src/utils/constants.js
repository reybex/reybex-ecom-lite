/**
 * Application constants
 * Single Responsibility: Only contains constant values
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: '/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json'
  }
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'rbx-auth-token',
  USER_ID: 'rbx-user-id',
  USER: 'user',
  PREFERRED_LOCALE: 'preferred-locale',
  CUSTOMER_PORTAL_TOKEN: 'rbx-customer-portal-token'
}

// Route Names
export const ROUTES = {
  DASHBOARD: 'Dashboard',
  LOGIN: 'Login',
  ORDER_LIST: 'OrderList',
  ORDER_DETAIL: 'OrderDetail',
  MATERIAL_LIST: 'MaterialList',
  MATERIAL_DETAIL: 'MaterialDetail'
}

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  ORDER_LIMIT: 100
}

// Status Values
export const STATUS = {
  ACTIVE: '1',
  INACTIVE: '0',
  OPEN: 'open',
  PROCESSING: 'processing',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  CLOSED: 'closed',
  WAITING: 'waiting'
}

// Payment Status
export const PAYMENT_STATUS = {
  FULLY_PAID: 'Tamamen ödenen',
  PARTIAL_PAYMENT: 'Kısmi ödeme',
  UNPAID: 'Ödenmedi',
  PAID: 'Ödendi',
  PARTIAL: 'Kısmi'
}

// Marketplace Icons
export const MARKETPLACE_ICONS = {
  'Trendyol': '/assets/marketplace-icons/trendyol.png',
  'Shopier': '/assets/marketplace-icons/shopier.png',
  'Hepsiburada': '/assets/marketplace-icons/hepsiburada.png',
  'GittiGidiyor': '/assets/marketplace-icons/gittigidiyor.png',
  'N11': '/assets/marketplace-icons/n11.png',
  'trendyol.com': '/assets/marketplace-icons/trendyol.png',
  'shopier.com': '/assets/marketplace-icons/shopier.png',
  'hepsiburada.com': '/assets/marketplace-icons/hepsiburada.png',
  'n11.com': '/assets/marketplace-icons/n11.png'
}

// Carrier Icons
export const CARRIER_ICONS = {
  'yurtici': '/assets/cargo-icons/yurtici.png',
  'mng': '/assets/cargo-icons/mng.png',
  'yurtici kargo': '/assets/cargo-icons/yurtici.png',
  'mng kargo': '/assets/cargo-icons/mng.png'
}

// Message Types for iframe communication
export const MESSAGE_TYPES = {
  REDIRECT_TO_LOGIN: 'REDIRECT_TO_LOGIN',
  TOKEN_RESPONSE: 'TOKEN_RESPONSE',
  REQUEST_TOKEN: 'REQUEST_TOKEN'
}
