<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="md:flex md:items-center md:justify-between mb-6">
          <div class="flex-1 min-w-0">
            <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {{ t('orderDetail.title') }}
            </h2>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4">
            <button
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 space-x-2"
              @click="printOrder"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>{{ t('orders.print') }}</span>
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="mt-8">
          <LoadingSpinner />
        </div>

        <div v-else-if="!order" class="mt-8">
          <EmptyState
            :title="t('orders.noOrders')"
            :description="t('orders.noOrdersDescription')"
          />
        </div>

        <div v-else class="space-y-6">
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">{{ t('orderDetail.orderInfo') }}</h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                Sipariş #{{ order.salesHead_docNumber || order.salesHead_hid }}
              </p>
            </div>
            <div class="border-t border-gray-200">
              <dl>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">{{ t('orderDetail.orderNumber') }}</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ order.salesHead_docNumber || order.salesHead_hid }}
                  </dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Müşteri Adı</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ order.customer_name || 'Müşteri Adı Yok' }}
                  </dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Pazaryeri</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div class="flex items-center">
                      <div v-if="getMarketplaceIcon(order.supportedMarketplace_provider)" class="flex-shrink-0 mr-2">
                        <img :src="getMarketplaceIcon(order.supportedMarketplace_provider)" :alt="getMarketplaceName(order.supportedMarketplace_provider)" class="h-5 w-5">
                      </div>
                      <span>{{ getMarketplaceName(order.supportedMarketplace_provider) }}</span>
                    </div>
                  </dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Sipariş Tarihi</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ formatDate(order.salesHead_docDate) }}
                  </dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Kargo Firması</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div class="flex items-center">
                      <div v-if="getCarrierIcon(order.supportedCarrier_shortName)" class="flex-shrink-0 mr-2">
                        <img :src="getCarrierIcon(order.supportedCarrier_shortName)" :alt="order.supportedCarrier_shortName" class="h-5 w-5">
                      </div>
                      <span>{{ order.supportedCarrier_shortName || 'Belirtilmemiş' }}</span>
                    </div>
                  </dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Toplam Tutar</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ formatPrice(order.salesHead_totalAmount) }} {{ order.currency_code || 'TRY' }}
                  </dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Sipariş Durumu</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span :class="getStatusClass(order.orderStatus_name)">
                      {{ order.orderStatus_name || 'Bilinmiyor' }}
                    </span>
                  </dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Ödeme Durumu</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span :class="getPaymentClass(order.paymentStatusTrans_name)">
                      {{ order.paymentStatusTrans_name || 'Bilinmiyor' }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div v-if="orderItems && orderItems.length > 0" class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Sipariş Kalemleri</h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                {{ orderItems.length }} ürün
              </p>
            </div>
            <div class="border-t border-gray-200">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miktar</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birim Fiyat</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toplam</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="item in orderItems" :key="item.id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div v-if="getItemImage(item)" class="flex-shrink-0 mr-3">
                            <div class="h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                              <div v-html="getItemImage(item)" class="h-full w-full flex items-center justify-center"></div>
                            </div>
                          </div>
                          <div class="flex-1 min-w-0">
                            <div class="text-sm font-medium text-gray-900">
                              {{ item.material_name || item.material?.name || 'Ürün Adı Yok' }}
                            </div>
                            <div class="text-sm text-gray-500">
                              {{ item.material_sku || item.material?.sku || 'SKU Yok' }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ item.quantity || 0 }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatPrice(item.unitPrice) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatPrice(item.totalPrice) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { useI18nStore } from '@/stores/i18n'
import AppHeader from '@/components/AppHeader.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'

export default {
  name: 'OrderDetail',
  components: {
    AppHeader,
    LoadingSpinner,
    EmptyState
  },
  setup() {
    const route = useRoute()
    const orderStore = useOrderStore()
    const i18nStore = useI18nStore()
    
    const isLoading = ref(false)
    const orderId = route.params.id

    const order = computed(() => orderStore.currentOrder)
    const orderItems = ref([])

    const loadOrder = async () => {
      try {
        isLoading.value = true
        await orderStore.fetchOrderById(orderId)
        const result = await orderStore.fetchOrderItems(orderId)
        if (result.success) {
          orderItems.value = result.data || []
        } else {
          console.error('Order items loading error:', result.message)
          orderItems.value = []
        }
      } catch (error) {
        console.error('Order loading error:', error)
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

    const getStatusClass = (status) => {
      if (!status) return 'text-gray-500'
      const statusStr = status.toLowerCase()
      if (statusStr.includes('açık')) return 'text-blue-600 font-medium'
      if (statusStr.includes('tamamlandı')) return 'text-green-600 font-medium'
      if (statusStr.includes('iptal')) return 'text-red-600 font-medium'
      return 'text-gray-500'
    }

    const getPaymentClass = (status) => {
      if (!status) return 'text-gray-500'
      const statusStr = status.toLowerCase()
      if (statusStr.includes('ödendi')) return 'text-green-600 font-medium'
      if (statusStr.includes('beklemede')) return 'text-yellow-600 font-medium'
      if (statusStr.includes('başarısız')) return 'text-red-600 font-medium'
      return 'text-gray-500'
    }

    const getItemImage = (item) => {
      const pictureData = item.material_picture || item.material?.picture
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

    const printOrder = () => {
      console.log('Printing order:', order.value)
    }

    onMounted(() => {
      loadOrder()
    })

    return {
      isLoading,
      order,
      orderItems,
      getMarketplaceName,
      getMarketplaceIcon,
      getCarrierIcon,
      getStatusClass,
      getPaymentClass,
      getItemImage,
      formatPrice,
      formatDate,
      printOrder,
      t: i18nStore.t
    }
  }
}
</script>