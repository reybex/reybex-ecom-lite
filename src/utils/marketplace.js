/**
 * Marketplace utility functions
 * Single Responsibility: Only handles marketplace-related operations
 */

import { MARKETPLACE_ICONS, CARRIER_ICONS } from './constants.js'

/**
 * Get marketplace name from provider string
 * @param {string} marketplace - Marketplace provider string
 * @returns {string} Formatted marketplace name
 */
export const getMarketplaceName = (marketplace) => {
  if (!marketplace) return 'Bilinmiyor'
  
  const marketplaceMap = {
    'amazon': 'Amazon',
    'trendyol': 'Trendyol',
    'shopier': 'Shopier',
    'hepsiburada': 'Hepsiburada',
    'n11': 'N11',
    'gittigidiyor': 'GittiGidiyor',
    'ciceksepeti': 'Çiçeksepeti',
    'migros': 'Migros',
    'carrefour': 'Carrefour',
    'a101': 'A101',
    'bim': 'BIM',
    'sok': 'ŞOK',
    'trendyol.com': 'Trendyol',
    'shopier.com': 'Shopier',
    'hepsiburada.com': 'Hepsiburada',
    'n11.com': 'N11'
  }
  
  const key = marketplace.toLowerCase()
  return marketplaceMap[key] || marketplace
}

/**
 * Get marketplace icon URL
 * @param {string} marketplaceName - Marketplace name
 * @returns {string|null} Icon URL or null if not found
 */
export const getMarketplaceIcon = (marketplaceName) => {
  return MARKETPLACE_ICONS[marketplaceName] || null
}

/**
 * Get carrier icon URL
 * @param {string} carrier - Carrier name
 * @returns {string|null} Icon URL or null if not found
 */
export const getCarrierIcon = (carrier) => {
  if (!carrier) return null
  
  const key = carrier.toLowerCase()
  return CARRIER_ICONS[key] || null
}

/**
 * Get payment status CSS class
 * @param {string} paymentStatus - Payment status string
 * @returns {string} CSS class string
 */
export const getPaymentChipClass = (paymentStatus) => {
  if (!paymentStatus) return 'bg-gray-100 text-gray-800'
  
  const status = paymentStatus.toLowerCase()
  if (status.includes('tamamen') || status.includes('ödendi')) {
    return 'bg-green-100 text-green-800'
  } else if (status.includes('kısmi') || status.includes('kısmen')) {
    return 'bg-yellow-100 text-yellow-800'
  } else if (status.includes('beklemede') || status.includes('bekliyor')) {
    return 'bg-orange-100 text-orange-800'
  } else if (status.includes('ödendi') || status.includes('tamamlandı')) {
    return 'bg-blue-100 text-blue-800'
  }
  
  return 'bg-gray-100 text-gray-800'
}
