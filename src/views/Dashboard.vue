<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Welcome Section -->
      <div class="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-lg shadow-lg mb-6">
        <div class="px-6 py-8">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <h1 class="text-2xl font-bold mb-2">{{ t('dashboard.welcome') }} {{ user?.firstname || user?.username }}! 👋</h1>
              <p class="text-lg text-white/90">
                {{ t('dashboard.welcomeMessage') }}
              </p>
            </div>
            <div class="text-right text-white">
              <p class="text-lg font-medium">{{ t('dashboard.boostSales') }} 🚀</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div v-if="!showOrderDetails && isLoadingStats" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div v-for="i in 4" :key="i" class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="animate-pulse">
              <div class="h-6 w-6 bg-gray-200 rounded mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div class="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!showOrderDetails" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <!-- Toplam Ürün -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-500">{{ t('dashboard.totalProducts') }}</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.totalMaterials || 150 }}</p>
                <router-link to="/materials" class="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{{ t('dashboard.viewProducts') }}</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Aktif Ürünler -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-500">{{ t('dashboard.activeProducts') }}</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.activeMaterials || 120 }}</p>
                <router-link to="/materials" class="mt-2 text-sm text-green-600 hover:text-green-800 font-medium flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ t('dashboard.viewActiveProducts') }}</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Düşük Stok -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-500">{{ t('dashboard.lowStock') }}</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.lowStock || 8 }}</p>
                <button class="mt-2 text-sm text-yellow-600 hover:text-yellow-800 font-medium flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>{{ t('dashboard.viewLowStock') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Açık Siparişler -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-500">{{ t('dashboard.openOrders') }}</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.openOrders || 25 }}</p>
                <button 
                  @click="showOrderDetails = true"
                  class="mt-2 text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center space-x-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{{ t('dashboard.viewOpenOrders') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div v-if="!showOrderDetails" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Pazaryeri Bazlı Siparişler -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">{{ t('dashboard.marketplaceOrders') }}</h3>
          </div>
          <div class="p-6">
            <div v-if="marketplaceStats.length === 0" class="text-center py-4">
              <p class="text-sm text-gray-500">{{ t('common.loading') }}</p>
            </div>
            <div v-else class="space-y-3">
              <div 
                v-for="marketplace in marketplaceStats" 
                :key="marketplace.name"
                class="flex items-center"
              >
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    v-if="getMarketplaceIcon(marketplace.name)" 
                    :src="getMarketplaceIcon(marketplace.name)" 
                    :alt="marketplace.name"
                    class="w-12 h-12 object-cover rounded-full"
                  />
                  <span v-else class="text-lg font-semibold text-gray-600">
                    {{ marketplace.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div class="ml-4 flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ marketplace.name }}</p>
                  <p class="text-sm text-gray-500">{{ marketplace.count }} {{ t('common.orders') }}</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-semibold text-gray-900">{{ formatPrice(marketplace.total) }}</p>
                  <p class="text-sm text-gray-500">{{ marketplace.percentage }}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sipariş İstatistikleri -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">{{ t('dashboard.orderStats') }}</h3>
          </div>
          <div class="p-6 space-y-4">
            <!-- Bu Ay Sipariş -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ t('dashboard.thisMonthOrders') }}</p>
                <p class="text-sm text-gray-500">Eylül 2025</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">25</p>
                <p class="text-sm text-gray-500">23.631,38 ₺</p>
              </div>
            </div>

            <!-- Günlük Ortalama -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ t('dashboard.dailyAverage') }}</p>
                <p class="text-sm text-gray-500">Son 30 gün</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">0.8</p>
                <p class="text-sm text-gray-500">{{ t('common.orders') }}/gün</p>
              </div>
            </div>

            <!-- Bu Hafta -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ t('dashboard.thisWeek') }}</p>
                <p class="text-sm text-gray-500">Haftalık toplam</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">16</p>
                <p class="text-sm text-gray-500">15.766,38 ₺</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ek İstatistikler -->
      <div v-if="!showOrderDetails" class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Ürün Performansı -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">{{ t('dashboard.productPerformance') }}</h3>
          </div>
          <div class="p-6 space-y-4">
            <!-- En Çok Satan Ürün -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ t('dashboard.bestSeller') }}</p>
                <p class="text-sm text-gray-500">{{ t('dashboard.thisMonth') }}</p>
              </div>
              <div class="text-right">
                <router-link 
                  to="/materials/38301929" 
                  class="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                >
                  Terlik #38301929
                </router-link>
                <p class="text-sm text-gray-500">45 {{ t('common.items') }}</p>
              </div>
            </div>

            <!-- Ortalama Sipariş Değeri -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ t('dashboard.averageOrder') }}</p>
                <p class="text-sm text-gray-500">{{ t('dashboard.value') }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">₺945</p>
                <p class="text-sm text-gray-500">per {{ t('common.orders') }}</p>
              </div>
            </div>

            <!-- Stok Uyarıları -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ t('dashboard.stockWarnings') }}</p>
                <p class="text-sm text-gray-500">{{ t('dashboard.lowStockProducts') }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">8</p>
                <p class="text-sm text-gray-500">{{ t('common.products') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Müşteri Analizi -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">{{ t('dashboard.customerAnalysis') }}</h3>
          </div>
          <div class="p-6 space-y-4">
            <!-- Aktif Müşteriler -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ t('dashboard.activeCustomers') }}</p>
                <p class="text-sm text-gray-500">{{ t('dashboard.thisMonth') }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">142</p>
                <p class="text-sm text-gray-500">{{ t('common.people') }}</p>
              </div>
            </div>

            <!-- Yeni Müşteriler -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ t('dashboard.newCustomers') }}</p>
                <p class="text-sm text-gray-500">{{ t('dashboard.thisMonth') }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">23</p>
                <p class="text-sm text-gray-500">{{ t('common.people') }}</p>
              </div>
            </div>

            <!-- Müşteri Memnuniyeti -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ t('dashboard.satisfaction') }}</p>
                <p class="text-sm text-gray-500">{{ t('dashboard.averageScore') }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">4.8</p>
                <p class="text-sm text-gray-500">/ 5.0</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Finansal Özet -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">{{ t('dashboard.financialSummary') }}</h3>
          </div>
          <div class="p-6 space-y-4">
            <!-- Toplam Ciro -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ t('dashboard.totalRevenue') }}</p>
                <p class="text-sm text-gray-500">{{ t('dashboard.thisMonth') }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">₺23.631</p>
                <p class="text-sm text-gray-500">+12% {{ t('common.lastMonth') }}</p>
              </div>
            </div>

            <!-- Kar Marjı -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ t('dashboard.profitMargin') }}</p>
                <p class="text-sm text-gray-500">{{ t('common.average') }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">%28</p>
                <p class="text-sm text-gray-500">₺6.617 {{ t('common.profit') }}</p>
              </div>
            </div>

            <!-- Bekleyen Ödemeler -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ t('dashboard.pendingPayments') }}</p>
                <p class="text-sm text-gray-500">{{ t('dashboard.toCollect') }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">₺5.420</p>
                <p class="text-sm text-gray-500">3 {{ t('common.orders') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pazaryeri Performansı -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">{{ t('dashboard.marketplacePerformance') }}</h3>
          </div>
          <div class="p-6 space-y-4">
            <!-- En İyi Pazaryeri -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <img src="/assets/marketplace-icons/trendyol.png" alt="Trendyol" class="w-6 h-6 rounded">
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ t('dashboard.bestMarketplace') }}</p>
                <p class="text-sm text-gray-500">{{ t('dashboard.thisMonth') }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">Trendyol</p>
                <p class="text-sm text-gray-500">₺14.606</p>
              </div>
            </div>

            <!-- En Hızlı Büyüyen -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <img src="/assets/marketplace-icons/shopier.png" alt="Shopier" class="w-6 h-6 rounded">
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ t('dashboard.fastestGrowing') }}</p>
                <p class="text-sm text-gray-500">{{ t('dashboard.growthRate') }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">Shopier</p>
                <p class="text-sm text-gray-500">+25%</p>
              </div>
            </div>

            <!-- Ortalama Sipariş Değeri -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ t('dashboard.averageOrderValue') }}</p>
                <p class="text-sm text-gray-500">{{ t('dashboard.marketplaceBased') }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">₺1.004</p>
                <p class="text-sm text-gray-500">per {{ t('common.orders') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Details View -->
      <div v-if="showOrderDetails" class="mt-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-4">
            <button 
              @click="showOrderDetails = false"
              class="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Geri Dön</span>
            </button>
            <h3 class="text-lg font-medium text-gray-900">Açık Siparişler</h3>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <button
                @click="viewMode = 'cards'"
                :class="viewMode === 'cards' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'"
                class="p-2 rounded-md text-sm font-medium"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                @click="viewMode = 'table'"
                :class="viewMode === 'table' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'"
                class="p-2 rounded-md text-sm font-medium"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
                </svg>
              </button>
            </div>
            <router-link to="/orders" class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1">
              <span>Tümünü Görüntüle</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </div>
        
        <!-- Sipariş Kartları Görünümü -->
        <div v-if="viewMode === 'cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-if="isLoadingOrders" v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-md p-6">
            <div class="animate-pulse">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div class="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div class="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
          <OrderCard
            v-else-if="orders.length > 0"
            v-for="order in orders"
            :key="order.id"
            :order="order"
            :expanded="expandedOrders.includes(order.id)"
            :order-items="orderItems[order.id] || []"
            :loading-items="orderItemsLoading"
            @toggle-items="toggleOrderItems"
          />
          <div v-else class="col-span-full text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Açık sipariş bulunamadı</h3>
            <p class="mt-1 text-sm text-gray-500">Henüz açık siparişiniz bulunmuyor.</p>
          </div>
        </div>
        
        <!-- Sipariş Listesi Tablosu -->
        <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="table-header">Sipariş No</th>
                    <th class="table-header hidden sm:table-cell">Müşteri</th>
                    <th class="table-header hidden lg:table-cell">Tarih</th>
                    <th class="table-header">Tutar</th>
                    <th class="table-header hidden sm:table-cell">Durum</th>
                    <th class="table-header hidden md:table-cell">Ödeme</th>
                    <th class="table-header hidden md:table-cell w-32">Bilgi</th>
                    <th class="table-header">İşlemler</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="isLoadingOrders">
                    <td colspan="8" class="px-6 py-4 text-center">
                      <div class="animate-pulse">
                        <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                      </div>
                    </td>
                  </tr>
                  <tr v-else-if="orders.length === 0">
                    <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                      Açık sipariş bulunamadı
                    </td>
                  </tr>
                  <tr v-else v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{{ order.salesHead_docNumber || order.salesHead_hid }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                      {{ order.customer_name || 'Müşteri Adı Yok' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {{ formatDate(order.salesHead_docDate) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ formatPrice(order.salesHead_totalAmount) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Açık
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
                      <div class="flex items-center space-x-2">
                        <router-link
                          :to="`/orders/${order.salesHead_hid}`"
                          class="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>Detay</span>
                        </router-link>
                        <button
                          @click="printOrder(order)"
                          class="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                          <span>Yazdır</span>
                        </button>
                      </div>
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
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/order'
import { useI18nStore } from '@/stores/i18n'
import AppHeader from '@/components/AppHeader.vue'
import OrderCard from '@/components/OrderCard.vue'
import { formatPrice, formatDate } from '@/utils/formatters'
import { getMarketplaceName, getMarketplaceIcon, getCarrierIcon, getPaymentChipClass } from '@/utils/marketplace'
import api from '@/services/api'

export default {
  name: 'Dashboard',
  components: {
    AppHeader,
    OrderCard
  },
  setup() {
    const authStore = useAuthStore()
    const orderStore = useOrderStore()
    const i18nStore = useI18nStore()
    
    const isLoadingStats = ref(true)
    const isLoadingOrders = ref(true)
    const user = ref(null)
    const stats = ref({
      totalMaterials: 150,
      activeMaterials: 120,
      lowStock: 8,
      openOrders: 25
    })
    const orders = ref([])
    const expandedOrders = ref([])
    const orderItems = ref({})
    const orderItemsLoading = ref(false)
    const showOrderDetails = ref(false)
    const viewMode = ref('cards')
    const marketplaceStats = ref([])

    // Formatting functions are now imported from utils

    const loadDashboardData = async () => {
      try {
        isLoadingStats.value = true
        isLoadingOrders.value = true

        await Promise.all([
          loadStats(),
          loadOrders(),
          loadUserProfile()
        ])
      } catch (error) {
        console.error('Dashboard data loading error:', error)
      } finally {
        isLoadingStats.value = false
        isLoadingOrders.value = false
      }
    }

    const loadStats = async () => {
      try {
        const now = new Date()
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        
        const dateFrom = firstDay.toISOString().split('T')[0]
        const dateTo = lastDay.toISOString().split('T')[0]

        const [materialsResponse, ordersResponse, monthlyOrdersResponse] = await Promise.all([
          api.get('/material?page=1&take=1'),
          api.get('/salesHead/salesOrders?page=1&take=1&status=open'),
          api.get(`/salesHead/salesOrders?page=1&take=1&status=open&dateFrom=${dateFrom}&dateTo=${dateTo}`)
        ])

        stats.value = {
          totalMaterials: materialsResponse.data.meta?.total || 150,
          activeMaterials: Math.floor((materialsResponse.data.meta?.total || 150) * 0.8),
          lowStock: 8,
          openOrders: ordersResponse.data.meta?.total || 25,
          monthlyOrders: monthlyOrdersResponse.data.meta?.total || 0
        }
      } catch (error) {
        console.error('Stats loading error:', error)
      }
    }

    const loadOrders = async () => {
      try {
        await orderStore.fetchOrders()
        orders.value = orderStore.orders
        
        calculateMarketplaceStats()
      } catch (error) {
        console.error('Orders loading error:', error)
      }
    }

    const calculateMarketplaceStats = () => {
      const marketplaceMap = new Map()
      
      orders.value.forEach(order => {
        const marketplaceName = order.supportedMarketplace_provider || order.marktplace_name || 'Diğer'
        const total = order.salesHead_totalAmount || 0
        
        if (marketplaceMap.has(marketplaceName)) {
          const existing = marketplaceMap.get(marketplaceName)
          existing.count += 1
          existing.total += total
        } else {
          marketplaceMap.set(marketplaceName, {
            name: marketplaceName,
            count: 1,
            total: total
          })
        }
      })
      
      const totalOrders = orders.value.length
      const totalAmount = Array.from(marketplaceMap.values()).reduce((sum, mp) => sum + mp.total, 0)
      
      marketplaceStats.value = Array.from(marketplaceMap.values()).map(mp => ({
        ...mp,
        percentage: totalOrders > 0 ? Math.round((mp.count / totalOrders) * 100) : 0
      }))
    }

    // Marketplace utility functions are now imported from utils

    const printOrder = (order) => {
      console.log('Print order:', order)
      // Print functionality can be implemented here
    }

    const loadUserProfile = async () => {
      try {
        const userId = localStorage.getItem('rbx-user-id')
        if (userId) {
          await authStore.fetchUserProfile(userId)
          user.value = authStore.user
        }
      } catch (error) {
        console.error('User profile loading error:', error)
      }
    }

    const toggleOrderItems = async (orderId) => {
      if (expandedOrders.value.includes(orderId)) {
        expandedOrders.value = expandedOrders.value.filter(id => id !== orderId)
      } else {
        expandedOrders.value.push(orderId)
        if (!orderItems.value[orderId]) {
          orderItemsLoading.value = true
          try {
            const result = await orderStore.fetchOrderItems(orderId)
            if (result.success) {
              orderItems.value[orderId] = result.data || []
            } else {
              console.error('Order items loading error:', result.message)
              orderItems.value[orderId] = []
            }
          } catch (error) {
            console.error('Order items loading error:', error)
            orderItems.value[orderId] = []
          } finally {
            orderItemsLoading.value = false
          }
        }
      }
    }

    onMounted(() => {
      loadDashboardData()
    })

    return {
      isLoadingStats,
      isLoadingOrders,
      user,
      stats,
      orders,
      expandedOrders,
      orderItems,
      orderItemsLoading,
      showOrderDetails,
      viewMode,
      marketplaceStats,
      t: i18nStore.t,
      formatPrice,
      formatDate,
      toggleOrderItems,
      getMarketplaceName,
      getMarketplaceIcon,
      getCarrierIcon,
      getPaymentChipClass,
      printOrder
    }
  }
}
</script>