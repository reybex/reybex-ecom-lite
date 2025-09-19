/**
 * Validation utility functions
 * Single Responsibility: Only handles data validation
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} True if value exists
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && value !== ''
}

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length required
 * @returns {boolean} True if valid length
 */
export const hasMinLength = (value, minLength) => {
  return value && value.length >= minLength
}

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length allowed
 * @returns {boolean} True if valid length
 */
export const hasMaxLength = (value, maxLength) => {
  return !value || value.length <= maxLength
}

/**
 * Validate numeric value
 * @param {any} value - Value to validate
 * @returns {boolean} True if numeric
 */
export const isNumeric = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

/**
 * Validate positive number
 * @param {any} value - Value to validate
 * @returns {boolean} True if positive number
 */
export const isPositiveNumber = (value) => {
  return isNumeric(value) && parseFloat(value) > 0
}
