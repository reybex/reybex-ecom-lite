<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <div v-if="isLoading" class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <LoadingSpinner />
    </div>

    <div v-else-if="!material" class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <EmptyState
        :description="t('products.noProductsDescription')"
        :title="t('products.noProducts')"
      />
    </div>

    <div v-else class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ material.name || 'İsimsiz Ürün' }}
              </h1>
              <p class="mt-1 text-sm text-gray-600">
                {{ material.matCode || 'Kod yok' }}
              </p>
            </div>
            <div class="flex space-x-3">
              <button
                @click="toggleEditMode"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>{{ isEditing ? t('productDetail.cancelEdit') : t('productDetail.editProduct') }}</span>
              </button>
              <router-link
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 space-x-2"
                to="/materials"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>{{ t('productDetail.backToList') }}</span>
              </router-link>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                {{ t('productDetail.basicInfo') }}
              </h3>
            </div>
            <div class="border-t border-gray-200">
              <!-- Düzenleme Formu -->
              <form v-if="isEditing" @submit.prevent="saveMaterial" class="p-6 space-y-6">
                <!-- Temel Bilgiler -->
                <div class="space-y-4">
                  <h4 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">{{ t('productDetail.basicInfo') }}</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">{{ t('productDetail.productName') }}</label>
                      <input
                        v-model="editForm.name"
                        type="text"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :placeholder="t('productDetail.productName')"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">{{ t('productDetail.productCode') }}</label>
                      <input
                        v-model="editForm.matCode"
                        type="text"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :placeholder="t('productDetail.productCode')"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">{{ t('productDetail.sku') }}</label>
                      <input
                        v-model="editForm.sku"
                        type="text"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :placeholder="t('productDetail.sku')"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">{{ t('productDetail.status') }}</label>
                      <select
                        v-model="editForm.matStatus"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">{{ t('productDetail.status') }} {{ t('common.select') }}</option>
                        <option value="active">{{ t('products.active') }}</option>
                        <option value="inactive">{{ t('products.inactive') }}</option>
                        <option value="draft">{{ t('products.draft') }}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Açıklama</label>
                    <textarea
                      v-model="editForm.description"
                      rows="3"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Ürün açıklamasını girin"
                    ></textarea>
                  </div>
                </div>


                <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    @click="cancelEdit"
                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    :disabled="isSaving"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {{ isSaving ? 'Kaydediliyor...' : 'Kaydet' }}
                  </button>
                </div>
              </form>
              
              <!-- Görüntüleme Modu -->
              <dl v-else>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Ürün Adı
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ material.name || 'İsimsiz Ürün' }}
                  </dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Ürün Kodu
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ material.matCode || 'Kod yok' }}
                  </dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    SKU
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ material.sku || 'SKU yok' }}
                  </dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Açıklama
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ material.description || 'Açıklama yok' }}
                  </dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Marka
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ material.brand?.name || material.brand?.translatedName || 'Marka yok' }}
                  </dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Durum
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span :class="getStatusClass(material.matStatus)">
                      {{ getStatusText(material.matStatus) }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Fiyat ve Stok Bilgileri
              </h3>
            </div>
            <div class="border-t border-gray-200">
              <!-- Düzenleme Modu -->
              <div v-if="isEditing" class="p-6 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Satış Fiyatı (Net) (₺)</label>
                  <input
                    v-model="editForm.salesPrice"
                    type="number"
                    step="0.01"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Satış Fiyatı (Brüt) (₺)</label>
                  <input
                    v-model="editForm.salesPriceGross"
                    type="number"
                    step="0.01"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Alış Fiyatı (₺)</label>
                  <input
                    v-model="editForm.purPrice"
                    type="number"
                    step="0.01"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Mevcut Stok</label>
                  <input
                    v-model="editForm.stock"
                    type="number"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <!-- Görüntüleme Modu -->
              <dl v-else>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Satış Fiyatı (Net)
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ formatPrice(material.salesPrice) }}
                  </dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Satış Fiyatı (Brüt)
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ formatPrice(material.salesPriceGross) }}
                  </dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Alış Fiyatı
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ formatPrice(material.purPrice) }}
                  </dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Mevcut Stok
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span :class="getStockClass(material.stock)">
                      {{ material.stock || 0 }}
                    </span>
                  </dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Birim
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ material.unit?.name || material.unit?.translatedName || 'Birim yok' }}
                  </dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Para Birimi
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ material.currency?.code || 'TRY' }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                E-ticaret Bilgileri
              </h3>
            </div>
            <div class="border-t border-gray-200">
              <!-- Düzenleme Modu -->
              <div v-if="isEditing" class="p-6 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">GTIN/EAN</label>
                  <input
                    v-model="editForm.gtin"
                    type="text"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="GTIN/EAN kodu girin"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">ASIN</label>
                  <input
                    v-model="editForm.asin"
                    type="text"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="ASIN kodu girin"
                  />
                </div>
              </div>
              
              <!-- Görüntüleme Modu -->
              <dl v-else>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    GTIN/EAN
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ material.gtin || 'GTIN yok' }}
                  </dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    ASIN
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ material.asin || 'ASIN yok' }}
                  </dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Vergi Sınıfı
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ material.vatKey?.name || material.vatKey?.translatedName || 'Vergi sınıfı yok' }}
                  </dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Pazaryerleri
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div v-if="material.marketplaces && material.marketplaces.length > 0" class="flex flex-wrap gap-2">
                      <div 
                        v-for="marketplace in material.marketplaces" 
                        :key="marketplace"
                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 space-x-2"
                      >
                        <img 
                          v-if="getMarketplaceIcon(marketplace)" 
                          :src="getMarketplaceIcon(marketplace)" 
                          :alt="getMarketplaceName(marketplace)" 
                          class="h-4 w-4"
                        />
                        <span>{{ getMarketplaceName(marketplace) }}</span>
                      </div>
                    </div>
                    <span v-else class="text-gray-400">Pazaryeri bilgisi yok</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Ürün Resmi
              </h3>
            </div>
            <div class="border-t border-gray-200 p-6">
              <div v-if="material.picture" class="flex justify-center">
                <div class="h-48 w-48 rounded-lg overflow-hidden bg-gray-100">
                  <div
                    class="h-full w-full flex items-center justify-center"
                    v-html="getMaterialImage(material.picture)"
                  />
                </div>
              </div>
              <div v-else class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
                <p class="mt-2 text-sm text-gray-500">
                  Ürün resmi yok
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMaterialStore } from '@/stores/material.js';
import { useI18nStore } from '@/stores/i18n';
import AppHeader from '@/components/AppHeader.vue';
import EmptyState from '@/components/EmptyState.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name: 'MaterialDetail',
  components: {
    AppHeader,
    EmptyState,
    LoadingSpinner,
  },
  setup() {
    const route = useRoute();
    const materialStore = useMaterialStore();
    const i18nStore = useI18nStore();

    const isLoading = ref(false);
    const isEditing = ref(false);
    const isSaving = ref(false);
    const materialId = route.params.id;

    const material = computed(() => materialStore.currentMaterial);
    
    const editForm = ref({
      name: '',
      matCode: '',
      sku: '',
      description: '',
      matStatus: '',
      salesPrice: '',
      salesPriceGross: '',
      purPrice: '',
      stock: '',
      gtin: '',
      asin: ''
    });

    const loadMaterial = async () => {
      try {
        isLoading.value = true;
        await materialStore.fetchMaterialById(materialId);
        // Form data
        if (material.value) {
          editForm.value = {
            name: material.value.name || '',
            matCode: material.value.matCode || '',
            sku: material.value.sku || '',
            description: material.value.description || '',
            matStatus: material.value.matStatus?.name || material.value.matStatus?.translatedName || material.value.matStatus || '',
            salesPrice: material.value.salesPrice || '',
            salesPriceGross: material.value.salesPriceGross || '',
            purPrice: material.value.purPrice || '',
            stock: material.value.stock || '',
            gtin: material.value.gtin || '',
            asin: material.value.asin || ''
          };
        }
      } catch (error) {
        console.error('Material loading error:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const toggleEditMode = () => {
      isEditing.value = !isEditing.value;
      if (isEditing.value && material.value) {
        editForm.value = {
          name: material.value.name || '',
          matCode: material.value.matCode || '',
          sku: material.value.sku || '',
          description: material.value.description || '',
          matStatus: material.value.matStatus?.name || material.value.matStatus?.translatedName || material.value.matStatus || '',
          salesPrice: material.value.salesPrice || '',
          salesPriceGross: material.value.salesPriceGross || '',
          purPrice: material.value.purPrice || '',
          stock: material.value.stock || '',
          gtin: material.value.gtin || '',
          asin: material.value.asin || ''
        };
      }
    };

    const cancelEdit = () => {
      isEditing.value = false;
      if (material.value) {
        editForm.value = {
          name: material.value.name || '',
          matCode: material.value.matCode || '',
          sku: material.value.sku || '',
          description: material.value.description || '',
          matStatus: material.value.matStatus?.name || material.value.matStatus?.translatedName || material.value.matStatus || '',
          salesPrice: material.value.salesPrice || '',
          salesPriceGross: material.value.salesPriceGross || '',
          purPrice: material.value.purPrice || '',
          stock: material.value.stock || '',
          gtin: material.value.gtin || '',
          asin: material.value.asin || ''
        };
      }
    };

    const saveMaterial = async () => {
      try {
        isSaving.value = true;
        await materialStore.updateMaterial(materialId, {
          name: editForm.value.name,
          matCode: editForm.value.matCode,
          sku: editForm.value.sku,
          description: editForm.value.description,
          matStatus: editForm.value.matStatus,
          salesPrice: parseFloat(editForm.value.salesPrice) || 0,
          salesPriceGross: parseFloat(editForm.value.salesPriceGross) || 0,
          purPrice: parseFloat(editForm.value.purPrice) || 0,
          stock: parseInt(editForm.value.stock, 10) || 0,
          gtin: editForm.value.gtin,
          asin: editForm.value.asin
        });
        isEditing.value = false;
        // Show success message
        alert('Ürün başarıyla güncellendi!');
      } catch (error) {
        console.error('Material update error:', error);
        alert('Ürün güncellenirken bir hata oluştu!');
      } finally {
        isSaving.value = false;
      }
    };

    const getMaterialImage = (pictureData) => {
      if (!pictureData) return null;

      if (typeof pictureData === 'string' && pictureData.includes('<img')) {
        return pictureData;
      }

      if (typeof pictureData === 'string') {
        if (pictureData.startsWith('data:')) {
          return `<img src="${pictureData}" alt="Ürün Resmi" class="h-full w-full object-cover" />`;
        }
        if (pictureData.startsWith('http')) {
          return `<img src="${pictureData}" alt="Ürün Resmi" class="h-full w-full object-cover" />`;
        }
        return `<img src="data:image/jpeg;base64,${pictureData}" alt="Ürün Resmi" class="h-full w-full object-cover" />`;
      }

      if (pictureData && pictureData.url) {
        return `<img src="${pictureData.url}" alt="Ürün Resmi" class="h-full w-full object-cover" />`;
      }

      if (pictureData && pictureData.data) {
        return `<img src="data:image/jpeg;base64,${pictureData.data}" alt="Ürün Resmi" class="h-full w-full object-cover" />`;
      }

      return null;
    };

    const getStockClass = (stock) => {
      const stockValue = parseInt(stock, 10) || 0;
      if (stockValue === 0) return 'text-red-600 font-medium';
      if (stockValue < 10) return 'text-yellow-600 font-medium';
      return 'text-green-600 font-medium';
    };

    const getStatusClass = (status) => {
      if (!status) return 'text-gray-500';
      const statusStr = typeof status === 'string' ? status : status.name || status.translatedName || '';
      if (statusStr.toLowerCase().includes('aktif')) return 'text-green-600 font-medium';
      if (statusStr.toLowerCase().includes('pasif')) return 'text-red-600 font-medium';
      return 'text-gray-500';
    };

    const getStatusText = (status) => {
      if (!status) return 'Bilinmiyor';

      if (typeof status === 'string') return status;
      if (status.translatedName) return status.translatedName;
      if (status.name) return status.name;
      if (status.code) return status.code;

      return 'Bilinmiyor';
    };

    const formatPrice = (price) => {
      if (!price) return '₺0';
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
      }).format(price);
    };

    const getMarketplaceName = (marketplace) => {
      if (!marketplace) return 'Bilinmiyor'
      
      const marketplaceMap = {
        'shopier': 'Shopier',
        'trendyol': 'Trendyol',
        'hepsiburada': 'Hepsiburada',
        'n11': 'N11',
        'gittigidiyor': 'GittiGidiyor',
        'amazon': 'Amazon',
        'ciceksepeti': 'Çiçeksepeti'
      }
      
      return marketplaceMap[marketplace.toLowerCase()] || marketplace
    }

    const getMarketplaceIcon = (marketplace) => {
      if (!marketplace) return null
      
      const iconMap = {
        'shopier': '/assets/marketplace-icons/shopier.png',
        'trendyol': '/assets/marketplace-icons/trendyol.png',
        'hepsiburada': '/assets/marketplace-icons/hepsiburada.png',
        'n11': '/assets/marketplace-icons/n11.png',
        'gittigidiyor': '/assets/marketplace-icons/gittigidiyor.png',
        'amazon': '/assets/marketplace-icons/amazon.png',
        'ciceksepeti': '/assets/marketplace-icons/ciceksepeti.png'
      }
      
      return iconMap[marketplace.toLowerCase()] || null
    }

    onMounted(() => {
      loadMaterial();
    });

    return {
      formatPrice,
      getMaterialImage,
      getStatusClass,
      getStatusText,
      getStockClass,
      getMarketplaceName,
      getMarketplaceIcon,
      isLoading,
      isEditing,
      isSaving,
      material,
      editForm,
      toggleEditMode,
      cancelEdit,
      saveMaterial,
      t: i18nStore.t,
    };
  },
};
</script>
