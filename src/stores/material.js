import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useMaterialStore = defineStore('material', () => {
  const materials = ref([])
  const currentMaterial = ref(null)
  const isLoading = ref(false)
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })
  const filters = ref({
    search: '',
    materialType: '',
    materialStatus: '',
    brand: ''
  })
  const sorting = ref({
    field: '',
    direction: 'asc'
  })

  const fetchMaterials = async (params = {}) => {
    isLoading.value = true
    try {
      const queryParams = {
        page: pagination.value.page,
        limit: pagination.value.limit,
        showNotDeletedMaterials: 1,
        ...filters.value,
        ...params
      }

      if (sorting.value.field) {
        queryParams.sortBy = sorting.value.field
        queryParams.sortDirection = sorting.value.direction
      }

      const response = await api.post('/material/list', queryParams)
      const processedMaterials = (response.data || []).map(material => {
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
      
      materials.value = processedMaterials
      
      if (response.meta) {
        pagination.value = {
          page: response.meta.current_page || 1,
          limit: response.meta.per_page || 20,
          total: response.meta.total || 0,
          totalPages: response.meta.last_page || 1
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Materials fetch error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Ürünler yüklenirken bir hata oluştu' 
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchMaterialById = async (id) => {
    isLoading.value = true
    try {
      const response = await api.get(`/material/${id}`)
      currentMaterial.value = response.data
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Material fetch error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Ürün detayları yüklenirken bir hata oluştu' 
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchMaterialVariants = async (materialId) => {
    try {
      const response = await api.get(`/materialVariant`, { 
        params: { materialId } 
      })
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Material variants fetch error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Ürün varyantları yüklenirken bir hata oluştu' 
      }
    }
  }

  const updateMaterial = async (id, data) => {
    isLoading.value = true
    try {
      const response = await api.put(`/material/${id}`, data)
      currentMaterial.value = response.data
      
      const index = materials.value.findIndex(m => m.material_hid === id)
      if (index !== -1) {
        materials.value[index] = response.data
      }
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Material update error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Ürün güncellenirken bir hata oluştu' 
      }
    } finally {
      isLoading.value = false
    }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const setPagination = (newPagination) => {
    pagination.value = { ...pagination.value, ...newPagination }
  }

  const setSorting = (newSorting) => {
    sorting.value = { ...sorting.value, ...newSorting }
  }

  const clearCurrentMaterial = () => {
    currentMaterial.value = null
  }

  return {
    materials,
    currentMaterial,
    isLoading,
    pagination,
    filters,
    sorting,
    fetchMaterials,
    fetchMaterialById,
    fetchMaterialVariants,
    updateMaterial,
    setFilters,
    setPagination,
    setSorting,
    clearCurrentMaterial
  }
})
