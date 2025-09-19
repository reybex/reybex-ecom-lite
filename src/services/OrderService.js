/**
 * Order service extending BaseService
 * Follows Open/Closed Principle - extends base functionality
 */
import { BaseService } from './BaseService.js'

export class OrderService extends BaseService {
  constructor() {
    super('/salesHead')
  }

  /**
   * Get orders list with filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Orders list response
   */
  async getOrders(options = {}) {
    const params = this.buildListParams({
      ...options,
      showNotDeletedSalesHeads: true
    })
    
    return await this.get('/salesOrders', params)
  }

  /**
   * Get order by ID
   * @param {string|number} id - Order ID
   * @returns {Promise<Object>} Order details response
   */
  async getOrderById(id) {
    return await this.get(`/${id}`)
  }

  /**
   * Get order items
   * @param {string|number} orderId - Order ID
   * @returns {Promise<Object>} Order items response
   */
  async getOrderItems(orderId) {
    return await this.get('/salesItem', { salesHeadId: orderId })
  }

  /**
   * Update order
   * @param {string|number} id - Order ID
   * @param {Object} data - Order data
   * @returns {Promise<Object>} Update response
   */
  async updateOrder(id, data) {
    return await this.put(`/${id}`, data)
  }

  /**
   * Build order-specific query parameters
   * @param {Object} options - Query options
   * @returns {Object} Formatted query parameters
   */
  buildListParams(options = {}) {
    const {
      page = 1,
      limit = 100,
      search = '',
      status = 'open',
      dateFrom = '',
      dateTo = '',
      ...filters
    } = options

    return {
      page,
      take: limit,
      skip: (page - 1) * limit,
      pageSize: limit,
      status,
      dateFrom,
      dateTo,
      ...filters
    }
  }
}
