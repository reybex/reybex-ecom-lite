/**
 * Material service extending BaseService
 * Follows Open/Closed Principle - extends base functionality
 */
import { BaseService } from './BaseService.js'

export class MaterialService extends BaseService {
  constructor() {
    super('/material')
  }

  /**
   * Get materials list with filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Materials list response
   */
  async getMaterials(options = {}) {
    const params = this.buildListParams({
      ...options,
      showNotDeletedMaterials: 1
    })
    
    return await this.post('/list', params)
  }

  /**
   * Get material by ID
   * @param {string|number} id - Material ID
   * @returns {Promise<Object>} Material details response
   */
  async getMaterialById(id) {
    return await this.get(`/${id}`)
  }

  /**
   * Update material
   * @param {string|number} id - Material ID
   * @param {Object} data - Material data
   * @returns {Promise<Object>} Update response
   */
  async updateMaterial(id, data) {
    return await this.put(`/${id}`, data)
  }

  /**
   * Get material variants
   * @param {string|number} materialId - Material ID
   * @returns {Promise<Object>} Variants response
   */
  async getMaterialVariants(materialId) {
    return await this.get('/materialVariant', { materialId })
  }

  /**
   * Process materials data for marketplace information
   * @param {Array} materials - Raw materials data
   * @returns {Array} Processed materials with marketplace info
   */
  processMaterialsData(materials) {
    return materials.map(material => {
      let marketplaces = []
      if (material.materialMarktplace) {
        if (typeof material.materialMarktplace === 'string') {
          marketplaces = material.materialMarktplace.split(',').map(mp => {
            const parts = mp.split('#')
            return parts[1] || parts[0] || 'Diğer'
          })
        } else if (Array.isArray(material.materialMarktplace)) {
          marketplaces = material.materialMarktplace
        }
      }
      
      return {
        ...material,
        marketplaces: marketplaces
      }
    })
  }
}
