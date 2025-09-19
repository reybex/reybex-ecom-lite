<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex-1 min-w-0">
            <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {{ t('products.title') }}
            </h2>
          </div>
        </div>

        <!-- Filtre ve Arama Alanları -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
          <div class="flex flex-wrap items-end gap-3">
            <!-- Arama Kutusu -->
            <div class="flex-1 min-w-64">
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('filters.search') }}</label>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="t('products.searchPlaceholder')"
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
                <option value="1">{{ t('products.active') }}</option>
                <option value="0">{{ t('products.inactive') }}</option>
              </select>
            </div>

            <!-- Pazaryeri Filtresi -->
            <div class="w-32">
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('filters.marketplace') }}</label>
              <select
                v-model="selectedMarketplace"
                class="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                @change="handleFilterChange"
              >
                <option value="">{{ t('common.all') }}</option>
                <option value="trendyol">Trendyol</option>
                <option value="shopier">Shopier</option>
              </select>
            </div>

            <!-- Filtre Butonları -->
            <div class="flex space-x-2 mt-2">
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

            <!-- Sonuç Sayısı -->
            <div class="text-xs text-gray-500 whitespace-nowrap mt-2">
              {{ filteredMaterials.length }} {{ t('products.productsFound') }}
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="mt-8">
          <LoadingSpinner />
        </div>

        <div v-else-if="materials.length === 0" class="mt-8">
          <EmptyState
            title="Ürün bulunamadı"
            description="Arama kriterlerinize uygun ürün bulunmuyor."
          />
        </div>

        <div v-else class="mt-8">
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="table-header hidden sm:table-cell">{{ t('products.productImage') }}</th>
                    <th class="table-header cursor-pointer hover:bg-gray-100" @click="handleSort('matCode')">
                      <div class="flex items-center justify-between">
                        <span>{{ t('products.productCode') }}</span>
                        <span class="text-xs">{{ getSortIcon('matCode') }}</span>
                      </div>
                    </th>
                    <th class="table-header cursor-pointer hover:bg-gray-100 w-32 sm:w-48" @click="handleSort('material_name')">
                      <div class="flex items-center justify-between">
                        <span class="hidden sm:inline">{{ t('products.productName') }}</span>
                        <span class="sm:hidden">{{ t('products.productName') }}</span>
                        <span class="text-xs">{{ getSortIcon('material_name') }}</span>
                      </div>
                    </th>
                    <!-- <th class="table-header cursor-pointer hover:bg-gray-100 hidden md:table-cell" @click="handleSort('sku')">
                      <div class="flex items-center justify-between">
                        <span>SKU</span>
                        <span class="text-xs">{{ getSortIcon('sku') }}</span>
                      </div>
                    </th> -->
                    <th class="table-header cursor-pointer hover:bg-gray-100" @click="handleSort('material_stock')">
                      <div class="flex items-center justify-between">
                        <span>{{ t('products.stock') }}</span>
                        <span class="text-xs">{{ getSortIcon('material_stock') }}</span>
                      </div>
                    </th>
                    <th class="table-header cursor-pointer hover:bg-gray-100 hidden lg:table-cell" @click="handleSort('material_salesPrice')">
                      <div class="flex items-center justify-between">
                        <span>{{ t('products.price') }}</span>
                        <span class="text-xs">{{ getSortIcon('material_salesPrice') }}</span>
                      </div>
                    </th>
                    <!-- <th class="table-header cursor-pointer hover:bg-gray-100 hidden sm:table-cell" @click="handleSort('material_status')">
                      <div class="flex items-center justify-between">
                        <span>Durum</span>
                        <span class="text-xs">{{ getSortIcon('material_status') }}</span>
                      </div>
                    </th> -->
                    <th class="table-header hidden md:table-cell">{{ t('products.marketplace') }}</th>
                    <th class="table-header">{{ t('common.actions') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="material in filteredMaterials" :key="material.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div v-if="material.material_picture" class="h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                        <div v-html="getMaterialImage(material.material_picture)" class="h-full w-full flex items-center justify-center"></div>
                      </div>
                      <div v-else class="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-600">
                          {{ material.material_name?.charAt(0) || '?' }}
                        </span>
                      </div>
                    </td>
                    <td class="table-cell font-medium text-primary-600">
                      {{ material.material_matCode || material.matCode || '-' }}
                    </td>
                    <td class="table-cell w-24 sm:w-32">
                      <div class="text-sm font-medium text-gray-900 truncate" :title="material.material_name || 'İsimsiz Ürün'">
                        {{ (material.material_name || 'İsimsiz Ürün').substring(0, 20) }}{{ (material.material_name || 'İsimsiz Ürün').length > 20 ? '...' : '' }}
                      </div>
                      <div class="text-sm text-gray-500 truncate hidden sm:block">
                        {{ material.brand_name || 'Marka yok' }}
                      </div>
                    </td>
                    <!-- <td class="table-cell hidden md:table-cell">
                      {{ material.material_sku || '-' }}
                    </td> -->
                    <td class="table-cell">
                      <span :class="getStockClass(material.material_stock)">
                        {{ material.material_stock || 0 }}
                      </span>
                    </td>
                    <td class="table-cell hidden lg:table-cell">
                      <div v-if="material.material_salesPrice" class="text-sm">
                        <div class="font-medium">{{ formatPrice(material.material_salesPrice) }}</div>
                        <div v-if="material.material_salesPriceGross" class="text-gray-500">
                          (Brüt: {{ formatPrice(material.material_salesPriceGross) }})
                        </div>
                      </div>
                      <span v-else class="text-gray-400">-</span>
                    </td>
                    <!-- <td class="table-cell hidden sm:table-cell">
                      <span 
                        :class="getStatusChipClass(material.matStatusName || material.material_status || material.matStatus)" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{ getStatusText(material) }}
                      </span>
                    </td> -->
                    <td class="table-cell hidden md:table-cell">
                      <div v-if="material.marketplaces && material.marketplaces.length > 0" class="flex flex-wrap gap-1">
                        <div 
                          v-for="marketplace in material.marketplaces" 
                          :key="marketplace"
                          class="flex items-center space-x-1"
                          :title="marketplace"
                        >
                          <img 
                            :src="getMarketplaceIcon(marketplace)" 
                            :alt="marketplace"
                            class="h-4 w-4 rounded"
                            @error="handleImageError"
                          />
                          <span class="text-xs text-gray-600 hidden lg:inline">{{ marketplace }}</span>
                        </div>
                      </div>
                      <span v-else class="text-gray-400">-</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex space-x-2">
                        <router-link
                          :to="`/materials/${material.material_hid}`"
                          class="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{{ t('products.viewDetails') }}</span>
                        </router-link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            :pagination="pagination"
            :item-name="t('products.productsFound')"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useMaterialStore } from '@/stores/material'
import { useI18nStore } from '@/stores/i18n'
import { useFilters } from '@/composables/useFilters'
import { usePagination } from '@/composables/usePagination'
import AppHeader from '@/components/AppHeader.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import Pagination from '@/components/Pagination.vue'

export default {
  name: 'MaterialList',
  components: {
    AppHeader,
    LoadingSpinner,
    EmptyState,
    Pagination
  },
  setup() {
    const materialStore = useMaterialStore()
    const i18nStore = useI18nStore()
    
    const isLoading = ref(false)
    const sortField = ref('')
    const sortDirection = ref('asc')

    // Filter and search data
    const searchQuery = ref('')
    const selectedStatus = ref('')
    const selectedMarketplace = ref('')

    const materials = computed(() => materialStore.materials)
    const pagination = computed(() => materialStore.pagination)

    // Filtered products
    const filteredMaterials = computed(() => {
      let filtered = [...materials.value]

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(material => 
          (material.material_name || '').toLowerCase().includes(query) ||
          (material.material_matCode || material.matCode || '').toLowerCase().includes(query) ||
          (material.material_description || '').toLowerCase().includes(query)
        )
      }

      // Status filter - check material_status field
      if (selectedStatus.value) {
        filtered = filtered.filter(material => 
          String(material.material_status) === selectedStatus.value
        )
      }

      // Marketplace filter - check supportedMarketplace_provider field
      if (selectedMarketplace.value) {
        
        filtered = filtered.filter(material => {
          const marketplaces = material.supportedMarketplace_provider || material.marketplaces || []
          const hasMarketplace = marketplaces.some(mp => 
            mp.toLowerCase().includes(selectedMarketplace.value.toLowerCase())
          )
          return hasMarketplace
        })
        
      }

      return filtered
    })

    const handleSort = (field) => {
      if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortField.value = field
        sortDirection.value = 'asc'
      }
      materialStore.setSorting({ field: sortField.value, direction: sortDirection.value })
      loadMaterials()
    }

    const getSortIcon = (field) => {
      if (sortField.value !== field) return '↕'
      return sortDirection.value === 'asc' ? '↑' : '↓'
    }

    const handlePageChange = (page) => {
      materialStore.setPagination({ ...pagination.value, page })
      loadMaterials()
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
      selectedMarketplace.value = ''
      handleFilterChange()
    }

    const loadMaterials = async () => {
      try {
        isLoading.value = true
        await materialStore.fetchMaterials()
      } catch (error) {
        console.error('Materials loading error:', error)
      } finally {
        isLoading.value = false
      }
    }

    const getMaterialImage = (pictureData) => {
      if (!pictureData) return null

      if (typeof pictureData === 'string' && pictureData.includes('<img')) {
        return pictureData
      }

      if (typeof pictureData === 'string') {
        if (pictureData.startsWith('data:')) {
          return `<img src="${pictureData}" alt="Ürün Resmi" class="h-full w-full object-cover" />`
        }
        if (pictureData.startsWith('http')) {
          return `<img src="${pictureData}" alt="Ürün Resmi" class="h-full w-full object-cover" />`
        }
        return `<img src="data:image/jpeg;base64,${pictureData}" alt="Ürün Resmi" class="h-full w-full object-cover" />`
      }

      if (pictureData && pictureData.url) {
        return `<img src="${pictureData.url}" alt="Ürün Resmi" class="h-full w-full object-cover" />`
      }

      if (pictureData && pictureData.data) {
        return `<img src="data:image/jpeg;base64,${pictureData.data}" alt="Ürün Resmi" class="h-full w-full object-cover" />`
      }

      return null
    }

    const getStockClass = (stock) => {
      const stockValue = parseInt(stock) || 0
      if (stockValue === 0) return 'text-red-600 font-medium'
      if (stockValue < 10) return 'text-yellow-600 font-medium'
      return 'text-green-600 font-medium'
    }

    const getStatusChipClass = (status) => {
      if (!status) return 'bg-gray-100 text-gray-800'
      const statusStr = typeof status === 'string' ? status : status.name || status.translatedName || ''
      const lowerStatus = statusStr.toLowerCase()
      if (lowerStatus.includes('aktif')) return 'bg-green-100 text-green-800'
      if (lowerStatus.includes('pasif')) return 'bg-red-100 text-red-800'
      if (lowerStatus.includes('beklemede')) return 'bg-yellow-100 text-yellow-800'
      if (lowerStatus.includes('draft')) return 'bg-orange-100 text-orange-800'
      if (lowerStatus.includes('inactive')) return 'bg-red-100 text-red-800'
      if (lowerStatus.includes('active')) return 'bg-green-100 text-green-800'
      return 'bg-gray-100 text-gray-800'
    }

    const getStatusText = (material) => {
      return material.matStatusName || material.material_status?.translatedName || material.matStatus?.translatedName || 'Bilinmiyor'
    }

    const getMarketplaceIcon = (marketplace) => {
      if (!marketplace) return null
      
      const iconMap = {
        'trendyol': '/assets/marketplace-icons/trendyol.png',
        'shopier': '/assets/marketplace-icons/shopier.png',
        'amazon': '/assets/marketplace-icons/amazon.png',
        'hepsiburada': '/assets/marketplace-icons/hepsiburada.png',
        'n11': '/assets/marketplace-icons/n11.png',
        'gittigidiyor': '/assets/marketplace-icons/gittigidiyor.png',
        'ciceksepeti': '/assets/marketplace-icons/ciceksepeti.png',
        'migros': '/assets/marketplace-icons/migros.png',
        'carrefour': '/assets/marketplace-icons/carrefour.png',
        'a101': '/assets/marketplace-icons/a101.png',
        'bim': '/assets/marketplace-icons/bim.png',
        'sok': '/assets/marketplace-icons/sok.png'
      }
      
      const key = marketplace.toLowerCase()
      return iconMap[key] || null
    }

    const handleImageError = (event) => {
      event.target.style.display = 'none'
    }

    const formatPrice = (price) => {
      if (!price) return '₺0'
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    onMounted(() => {
      loadMaterials()
    })

    return {
      isLoading,
      materials,
      pagination,
      searchQuery,
      selectedStatus,
      selectedMarketplace,
      filteredMaterials,
      handleSort,
      getSortIcon,
      handlePageChange,
      handleSearch,
      handleFilterChange,
      applyFilters,
      clearFilters,
      getMaterialImage,
      getStockClass,
      getStatusChipClass,
      getStatusText,
      getMarketplaceIcon,
      handleImageError,
      formatPrice,
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