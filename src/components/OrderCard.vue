<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span class="text-sm font-semibold text-blue-600">
            {{ order.salesHead_docNumber?.charAt(0) || '#' }}
          </span>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-900">
            #{{ order.salesHead_docNumber || order.salesHead_hid }}
          </h4>
          <p class="text-xs text-gray-500">{{ formatDate(order.salesHead_docDate) }}</p>
        </div>
      </div>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Açık
      </span>
    </div>

    <!-- Customer Info -->
    <div class="mb-4">
      <p class="text-sm font-medium text-gray-900 truncate">
        {{ order.customer_name || 'Müşteri Adı Yok' }}
      </p>
      <p class="text-lg font-semibold text-blue-600">
        {{ formatPrice(order.salesHead_totalAmount) }}
      </p>
    </div>

    <!-- Status Badges -->
    <div class="flex flex-wrap gap-2 mb-4">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Tamamen ödenen
      </span>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Kısmi Teslimat
      </span>
    </div>

    <!-- Action Buttons -->
    <div class="space-y-2">
      <button
        @click="$emit('toggle-items', order.id)"
        class="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
        <span>{{ t('orderDetail.orderItems') }}</span>
      </button>
      
      <router-link
        :to="`/orders/${order.salesHead_hid}`"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
        <span>{{ t('orders.viewDetails') }}</span>
      </router-link>
    </div>

    <!-- Order Items (Collapsible) -->
    <div v-if="expanded" class="mt-4 pt-4 border-t border-gray-200">
      <div v-if="loadingItems" class="space-y-2">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div v-else-if="orderItems?.length > 0" class="space-y-2">
        <div
          v-for="item in orderItems"
          :key="item.id"
          class="flex items-center justify-between text-sm"
        >
          <div class="flex-1">
            <p class="font-medium text-gray-900">{{ item.material_name || 'Ürün Adı' }}</p>
            <p class="text-gray-500">Miktar: {{ item.quantity || 1 }}</p>
          </div>
          <p class="font-medium text-gray-900">{{ formatPrice(item.price) }}</p>
        </div>
      </div>
      <div v-else class="text-sm text-gray-500 text-center py-2">
        {{ t('orderDetail.noOrderItems') }}
      </div>
    </div>
  </div>
</template>

<script>
import { useI18nStore } from '@/stores/i18n'

export default {
  name: 'OrderCard',
  props: {
    order: {
      type: Object,
      required: true
    },
    expanded: {
      type: Boolean,
      default: false
    },
    orderItems: {
      type: Array,
      default: () => []
    },
    loadingItems: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-items'],
  setup() {
    const i18nStore = useI18nStore()
    return {
      t: i18nStore.t
    }
  },
  methods: {
    formatPrice(price) {
      if (!price) return '₺0'
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('tr-TR')
    }
  }
}
</script>
