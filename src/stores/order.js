import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useOrderStore = defineStore('order', () => {
  const orders = ref([])
  const currentOrder = ref(null)
  const isLoading = ref(false)
  const pagination = ref({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 0
  })
  const filters = ref({
    search: '',
    status: 'open',
    dateFrom: '',
    dateTo: ''
  })

  const fetchOrders = async (params = {}) => {
    isLoading.value = true
    try {
      const queryParams = {
        page: pagination.value.page,
        take: pagination.value.limit,
        skip: (pagination.value.page - 1) * pagination.value.limit,
        pageSize: pagination.value.limit,
        showNotDeletedSalesHeads: true,
        status: filters.value.status,
        ...filters.value,
        ...params
      }

      const response = await api.get('/salesHead/salesOrders', { params: queryParams })
      
      orders.value = response.data || []
      
      if (response.meta) {
        pagination.value = {
          page: response.meta.current_page || 1,
          limit: response.meta.per_page || 100,
          total: response.meta.total || 0,
          totalPages: response.meta.last_page || 1
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Orders fetch error:', error)
      console.error('Error response:', error.response)
      console.error('Error response data:', error.response?.data)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Siparişler yüklenirken bir hata oluştu' 
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchOrderById = async (id) => {
    isLoading.value = true
    try {
      const response = await api.get(`/salesHead/${id}`)
      currentOrder.value = response.data
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Order fetch error:', error)
      console.error('Error response:', error.response)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Sipariş detayları yüklenirken bir hata oluştu' 
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchOrderItems = async (orderId) => {
    try {
      const response = await api.get(`/salesItem`, { 
        params: { salesHeadId: orderId } 
      })
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Order items fetch error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Sipariş kalemleri yüklenirken bir hata oluştu' 
      }
    }
  }

  const updateOrder = async (id, data) => {
    isLoading.value = true
    try {
      const response = await api.put(`/salesHead/${id}`, data)
      currentOrder.value = response.data
      
      const index = orders.value.findIndex(o => o.id === id)
      if (index !== -1) {
        orders.value[index] = response.data
      }
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Order update error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Sipariş güncellenirken bir hata oluştu' 
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

  const clearCurrentOrder = () => {
    currentOrder.value = null
  }

  return {
    orders,
    currentOrder,
    isLoading,
    pagination,
    filters,
    fetchOrders,
    fetchOrderById,
    fetchOrderItems,
    updateOrder,
    setFilters,
    setPagination,
    clearCurrentOrder
  }
})
