<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex-1 min-w-0">
            <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {{ t('orders.title') }}
            </h2>
          </div>
        </div>

        <!-- Filtre ve Arama Alanları -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
          <div class="flex flex-wrap items-end gap-3">
            <!-- Arama Kutusu -->
            <div class="min-w-64">
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('filters.search') }}</label>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="t('orders.searchPlaceholder')"
                  class="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  @input="handleSearch"
                />
                <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Durum Filtresi -->
            <div class="w-24">
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('filters.status') }}</label>
              <select
                v-model="selectedStatus"
                class="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                @change="handleFilterChange"
              >
                <option value="">{{ t('common.all') }}</option>
                <option value="Açık">{{ t('orders.open') }}</option>
                <option value="İşleniyor">{{ t('orders.processing') }}</option>
                <option value="İptal edildi">{{ t('orders.cancelled') }}</option>
                <option value="Kapalı">{{ t('orders.closed') }}</option>
                <option value="Beklemede">{{ t('orders.waiting') }}</option>
              </select>
            </div>

            <!-- Ödeme Durumu -->
            <div class="w-24">
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('filters.payment') }}</label>
              <select
                v-model="selectedPaymentStatus"
                class="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                @change="handleFilterChange"
              >
                <option value="">{{ t('common.all') }}</option>
                <option value="Tamamen ödenen">{{ t('orders.fullyPaid') }}</option>
                <option value="Kısmi ödeme">{{ t('orders.partialPayment') }}</option>
                <option value="Ödenmedi">{{ t('orders.unpaid') }}</option>
                <option value="açık">{{ t('orders.open') }}</option>
              </select>
            </div>

            <!-- Tarih Aralığı -->
            <div class="w-48">
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('filters.dateRange') }}</label>
              <div class="flex space-x-1">
                <input
                  v-model="dateRange.start"
                  type="date"
                  class="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  @change="handleFilterChange"
                />
                <input
                  v-model="dateRange.end"
                  type="date"
                  class="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  @change="handleFilterChange"
                />
              </div>
            </div>
          </div>

          <!-- Filtre Butonları ve Sonuç Sayısı -->
          <div class="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-200">
            <div class="flex space-x-2">
              <button
                @click="clearFilters"
                class="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {{ t('filters.clearFilters') }}
              </button>
              <button
                @click="applyFilters"
                class="px-2 py-1 text-xs font-medium text-white bg-blue-600 border border-transparent rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {{ t('filters.applyFilters') }}
              </button>
            </div>

            <div class="text-xs text-gray-500 whitespace-nowrap">
              {{ filteredOrders.length }} {{ t('orders.ordersFound') }}
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="mt-8">
          <LoadingSpinner />
        </div>

        <div v-else-if="orders.length === 0" class="mt-8">
          <EmptyState
            title="Sipariş bulunamadı"
            description="Arama kriterlerinize uygun sipariş bulunmuyor."
          />
        </div>

        <div v-else class="mt-8">
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="table-header">{{ t('orders.orderNumber') }}</th>
                    <th class="table-header hidden sm:table-cell">{{ t('orders.customer') }}</th>
                    <th class="table-header hidden lg:table-cell">{{ t('orders.date') }}</th>
                    <th class="table-header">{{ t('orders.amount') }}</th>
                    <th class="table-header hidden sm:table-cell">{{ t('orders.status') }}</th>
                    <th class="table-header hidden md:table-cell">{{ t('orders.payment') }}</th>
                    <th class="table-header hidden md:table-cell w-32">{{ t('orders.info') }}</th>
                    <th class="table-header">{{ t('common.actions') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-primary-600">
                        {{ order.salesHead_docNumber || order.salesHead_hid }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div class="text-sm font-medium text-gray-900">
                        {{ order.customer_name || 'Müşteri Adı Yok' }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ order.salesHead_orderEmail || order.customer_customerNo || '-' }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                      {{ formatDate(order.salesHead_docDate) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">
                        {{ formatPrice(order.salesHead_totalAmount) }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ order.currency_code || 'TRY' }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <span 
                        :class="getStatusChipClass(order.orderStatus_name)" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{ order.orderStatus_name || 'Bilinmiyor' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span 
                        :class="getPaymentChipClass(order.paymentStatusTrans_name)" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{ order.paymentStatusTrans_name || 'Bilinmiyor' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap hidden md:table-cell w-32">
                      <div class="flex items-center space-x-2">
                        <div v-if="getMarketplaceIcon(order.supportedMarketplace_provider)" class="flex-shrink-0">
                          <img :src="getMarketplaceIcon(order.supportedMarketplace_provider)" :alt="getMarketplaceName(order.supportedMarketplace_provider)" class="h-4 w-4" title="Pazaryeri">
                        </div>
                        <div v-if="getCarrierIcon(order.supportedCarrier_shortName)" class="flex-shrink-0">
                          <img :src="getCarrierIcon(order.supportedCarrier_shortName)" :alt="order.supportedCarrier_shortName" class="h-4 w-4" title="Kargo">
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex flex-col space-y-1">
                        <router-link
                          :to="`/orders/${order.salesHead_hid}`"
                          class="text-primary-600 hover:text-primary-900 text-center flex items-center justify-center space-x-1"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{{ t('orders.viewDetails') }}</span>
                        </router-link>
                        <button
                          class="text-gray-600 hover:text-gray-900 text-center flex items-center justify-center space-x-1"
                          @click="printOrder(order)"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                          <span>{{ t('orders.print') }}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            :pagination="pagination"
            :item-name="t('orders.ordersFound')"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useOrderStore } from '@/stores/order'
import { useI18nStore } from '@/stores/i18n'
import { useFilters } from '@/composables/useFilters'
import { usePagination } from '@/composables/usePagination'
import { formatPrice, formatDate } from '@/utils/formatters'
import { getMarketplaceIcon, getCarrierIcon, getPaymentChipClass } from '@/utils/marketplace'
import AppHeader from '@/components/AppHeader.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import Pagination from '@/components/Pagination.vue'

export default {
  name: 'OrderList',
  components: {
    AppHeader,
    LoadingSpinner,
    EmptyState,
    Pagination
  },
  setup() {
    const orderStore = useOrderStore()
    const i18nStore = useI18nStore()
    
    const isLoading = ref(false)

    // Filter and search data
    const searchQuery = ref('')
    const selectedStatus = ref('')
    const selectedPaymentStatus = ref('')
    const dateRange = ref({
      start: '',
      end: ''
    })

    const orders = computed(() => orderStore.orders)
    const pagination = computed(() => orderStore.pagination)

    // Filtered orders
    const filteredOrders = computed(() => {
      let filtered = [...orders.value]

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(order => 
          (order.salesHead_docNumber || '').toLowerCase().includes(query) ||
          (order.customer_name || '').toLowerCase().includes(query) ||
          (order.salesHead_hid || '').toString().includes(query)
        )
      }

      // Status filter - check salesHead_status field
      if (selectedStatus.value) {
        console.log('Filtering - Selected status:', selectedStatus.value)
        console.log('Filtering - Orders:', orders.value.map(o => ({ 
          id: o.salesHead_hid, 
          salesHead_status: o.salesHead_status, 
          status: o.status,
          orderStatus_name: o.orderStatus_name 
        })))
        
        filtered = filtered.filter(order => {
          const status = order.orderStatus_name || order.salesHead_status || order.status
          return String(status) === selectedStatus.value
        })
        
      }

      // Payment status filter - check paymentStatusTrans_name field
      if (selectedPaymentStatus.value) {
        
        filtered = filtered.filter(order => {
          const paymentStatus = order.paymentStatusTrans_name || order.paymentStatus || order.salesHead_paymentStatus
          const matches = String(paymentStatus).toLowerCase() === selectedPaymentStatus.value.toLowerCase()
          return matches
        })
        
      }

      // Date range filter
      if (dateRange.value.start) {
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.salesHead_docDate)
          const startDate = new Date(dateRange.value.start)
          return orderDate >= startDate
        })
      }
      if (dateRange.value.end) {
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.salesHead_docDate)
          const endDate = new Date(dateRange.value.end)
          return orderDate <= endDate
        })
      }

      return filtered
    })

    const handlePageChange = (page) => {
      orderStore.setPagination({ ...pagination.value, page })
      loadOrders()
    }

    // Filter functions
    const handleSearch = () => {
      // Go to first page when searching
      pagination.value.page = 1
    }

    const handleFilterChange = () => {
      // Go to first page when filter changes
      pagination.value.page = 1
    }

    const applyFilters = () => {
      // Apply filters
      handleFilterChange()
    }

    const clearFilters = () => {
      searchQuery.value = ''
      selectedStatus.value = ''
      selectedPaymentStatus.value = ''
      dateRange.value = {
        start: '',
        end: ''
      }
      handleFilterChange()
    }

    const loadOrders = async () => {
      try {
        isLoading.value = true
        await orderStore.fetchOrders()
      } catch (error) {
        console.error('Orders loading error:', error)
      } finally {
        isLoading.value = false
      }
    }

    const getMarketplaceName = (marketplace) => {
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

    const getMarketplaceIcon = (marketplace) => {
      if (!marketplace) return null
      
      const iconMap = {
        'amazon': '/assets/marketplace-icons/amazon.svg',
        'trendyol': '/assets/marketplace-icons/trendyol.png',
        'shopier': '/assets/marketplace-icons/shopier.png',
        'hepsiburada': '/assets/marketplace-icons/hepsiburada.svg',
        'n11': '/assets/marketplace-icons/n11.svg',
        'gittigidiyor': '/assets/marketplace-icons/gittigidiyor.svg',
        'ciceksepeti': '/assets/marketplace-icons/ciceksepeti.svg',
        'migros': '/assets/marketplace-icons/migros.svg',
        'carrefour': '/assets/marketplace-icons/carrefour.svg',
        'a101': '/assets/marketplace-icons/a101.svg',
        'bim': '/assets/marketplace-icons/bim.svg',
        'sok': '/assets/marketplace-icons/sok.svg',
        'trendyol.com': '/assets/marketplace-icons/trendyol.png',
        'shopier.com': '/assets/marketplace-icons/shopier.png',
        'hepsiburada.com': '/assets/marketplace-icons/hepsiburada.svg',
        'n11.com': '/assets/marketplace-icons/n11.svg'
      }
      
      const key = marketplace.toLowerCase()
      return iconMap[key] || null
    }

    const getCarrierIcon = (carrier) => {
      if (!carrier) return null
      
      const iconMap = {
        'yurtici': '/assets/cargo-icons/yurtici.png',
        'mng': '/assets/cargo-icons/mng.png',
        'yurtici kargo': '/assets/cargo-icons/yurtici.png',
        'mng kargo': '/assets/cargo-icons/mng.png'
      }
      
      const key = carrier.toLowerCase()
      return iconMap[key] || null
    }

    const getStatusChipClass = (status) => {
      if (!status) return 'bg-gray-100 text-gray-800'
      const statusStr = status.toLowerCase()
      if (statusStr.includes('açık')) return 'bg-blue-100 text-blue-800'
      if (statusStr.includes('tamamlandı')) return 'bg-green-100 text-green-800'
      if (statusStr.includes('iptal')) return 'bg-red-100 text-red-800'
      if (statusStr.includes('işleniyor')) return 'bg-yellow-100 text-yellow-800'
      if (statusStr.includes('beklemede')) return 'bg-orange-100 text-orange-800'
      return 'bg-gray-100 text-gray-800'
    }

    const getPaymentChipClass = (status) => {
      if (!status) return 'bg-gray-100 text-gray-800'
      const statusStr = status.toLowerCase()
      if (statusStr.includes('ödendi') || statusStr.includes('tamam')) return 'bg-green-100 text-green-800'
      if (statusStr.includes('beklemede') || statusStr.includes('açık')) return 'bg-yellow-100 text-yellow-800'
      if (statusStr.includes('başarısız') || statusStr.includes('iptal')) return 'bg-red-100 text-red-800'
      if (statusStr.includes('kısmi')) return 'bg-orange-100 text-orange-800'
      return 'bg-gray-100 text-gray-800'
    }

    const formatPrice = (price) => {
      if (!price) return '₺0'
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('tr-TR')
    }

    const printOrder = (order) => {
      console.log('Printing order:', order)
    }

    onMounted(() => {
      loadOrders()
    })

    return {
      isLoading,
      orders,
      pagination,
      searchQuery,
      selectedStatus,
      selectedPaymentStatus,
      dateRange,
      filteredOrders,
      handlePageChange,
      handleSearch,
      handleFilterChange,
      applyFilters,
      clearFilters,
      getMarketplaceName,
      getMarketplaceIcon,
      getCarrierIcon,
      getStatusChipClass,
      getPaymentChipClass,
      formatPrice,
      formatDate,
      printOrder,
      t: i18nStore.t
    }
  }
}
</script>

<style scoped>
.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900;
}
</style>