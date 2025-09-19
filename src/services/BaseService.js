/**
 * Base service class following Open/Closed Principle
 * Open for extension, closed for modification
 */
import api from './api.js'

export class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint
  }

  /**
   * Generic GET request
   * @param {string} path - API path
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response
   */
  async get(path = '', params = {}) {
    try {
      const response = await api.get(`${this.endpoint}${path}`, { params })
      return { success: true, data: response.data, meta: response.meta }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Generic POST request
   * @param {string} path - API path
   * @param {Object} data - Request data
   * @returns {Promise<Object>} API response
   */
  async post(path = '', data = {}) {
    try {
      const response = await api.post(`${this.endpoint}${path}`, data)
      return { success: true, data: response.data, meta: response.meta }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Generic PUT request
   * @param {string} path - API path
   * @param {Object} data - Request data
   * @returns {Promise<Object>} API response
   */
  async put(path = '', data = {}) {
    try {
      const response = await api.put(`${this.endpoint}${path}`, data)
      return { success: true, data: response.data, meta: response.meta }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Generic DELETE request
   * @param {string} path - API path
   * @returns {Promise<Object>} API response
   */
  async delete(path = '') {
    try {
      const response = await api.delete(`${this.endpoint}${path}`)
      return { success: true, data: response.data, meta: response.meta }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Handle API errors consistently
   * @param {Error} error - Error object
   * @returns {Object} Error response
   */
  handleError(error) {
    console.error(`${this.endpoint} service error:`, error)
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred',
      error: error.response?.data || error.message
    }
  }

  /**
   * Build query parameters for list requests
   * @param {Object} options - Query options
   * @returns {Object} Formatted query parameters
   */
  buildListParams(options = {}) {
    const {
      page = 1,
      limit = 20,
      search = '',
      sortBy = '',
      sortDirection = 'asc',
      filters = {}
    } = options

    return {
      page,
      limit,
      search,
      sortBy,
      sortDirection,
      ...filters
    }
  }
}
