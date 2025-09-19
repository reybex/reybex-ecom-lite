/**
 * Data service interface
 * Dependency Inversion: Depend on abstractions, not concretions
 */

export class IDataService {
  /**
   * Get list of items
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Items list response
   */
  async getList(options = {}) {
    throw new Error('getList method must be implemented')
  }

  /**
   * Get item by ID
   * @param {string|number} id - Item ID
   * @returns {Promise<Object>} Item details response
   */
  async getById(id) {
    throw new Error('getById method must be implemented')
  }

  /**
   * Create new item
   * @param {Object} data - Item data
   * @returns {Promise<Object>} Create response
   */
  async create(data) {
    throw new Error('create method must be implemented')
  }

  /**
   * Update item
   * @param {string|number} id - Item ID
   * @param {Object} data - Item data
   * @returns {Promise<Object>} Update response
   */
  async update(id, data) {
    throw new Error('update method must be implemented')
  }

  /**
   * Delete item
   * @param {string|number} id - Item ID
   * @returns {Promise<Object>} Delete response
   */
  async delete(id) {
    throw new Error('delete method must be implemented')
  }
}
