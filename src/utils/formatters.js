/**
 * Utility functions for formatting data
 * Single Responsibility: Only handles data formatting
 */

/**
 * Format price to Turkish Lira
 * @param {number|string} price - Price to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  if (!price) return '₺0'
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(price)
}

/**
 * Format date to Turkish locale
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR')
}

/**
 * Format date to specific locale
 * @param {string} dateString - Date string to format
 * @param {string} locale - Locale code (default: 'tr-TR')
 * @returns {string} Formatted date string
 */
export const formatDateWithLocale = (dateString, locale = 'tr-TR') => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString(locale)
}

/**
 * Format number with thousand separators
 * @param {number|string} number - Number to format
 * @param {string} locale - Locale code (default: 'tr-TR')
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, locale = 'tr-TR') => {
  if (!number) return '0'
  return new Intl.NumberFormat(locale).format(number)
}
