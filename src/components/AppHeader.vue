<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <img
              alt="Reybex Logo"
              class="h-8 w-auto"
              src="https://www.reybex.com/wp-content/uploads/2024/04/Reybex_Logo_Wort-_Bildmarke_darkgreen_RGB.svg"
            />
            <span class="ml-2 mt-3 text-xs font-bold text-orange-500">E-Commerce</span>
          </router-link>
        </div>
        
        <div class="hidden md:flex items-center space-x-4">
          <!-- Dil Seçici -->
          <div class="relative">
            <select
              v-model="selectedLocale"
              @change="changeLanguage"
              class="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option
                v-for="locale in availableLocales"
                :key="locale.key"
                :value="locale.key"
              >
                {{ locale.flag }} {{ locale.name }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <router-link
            :class="$route.path === '/' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'"
            class="px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
            to="/"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
            </svg>
            <span>{{ t('navigation.dashboard') }}</span>
          </router-link>
          <router-link
            :class="$route.path === '/materials' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'"
            class="px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
            to="/materials"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>{{ t('navigation.products') }}</span>
          </router-link>
          <router-link
            :class="$route.path === '/orders' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'"
            class="px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
            to="/orders"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>{{ t('navigation.orders') }}</span>
          </router-link>
          <button
            class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
            @click="handleLogout"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>{{ t('navigation.logout') }}</span>
          </button>
        </div>

        <div class="md:hidden flex items-center">
          <button
            class="text-gray-500 hover:text-gray-700 p-2 rounded-md"
            @click="toggleMobileMenu"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!isMobileMenuOpen"
                d="M4 6h16M4 12h16M4 18h16"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
              <path
                v-else
                d="M6 18L18 6M6 6l12 12"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <!-- Mobil Dil Seçici -->
          <div class="px-3 py-2">
            <select
              v-model="selectedLocale"
              @change="changeLanguage"
              class="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option
                v-for="locale in availableLocales"
                :key="locale.key"
                :value="locale.key"
              >
                {{ locale.flag }} {{ locale.name }}
              </option>
            </select>
          </div>
          <router-link
            :class="$route.path === '/' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
            class="block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3"
            to="/"
            @click="closeMobileMenu"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
            </svg>
            <span>{{ t('navigation.dashboard') }}</span>
          </router-link>
          <router-link
            :class="$route.path === '/materials' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
            class="block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3"
            to="/materials"
            @click="closeMobileMenu"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>{{ t('navigation.products') }}</span>
          </router-link>
          <router-link
            :class="$route.path === '/orders' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
            class="block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3"
            to="/orders"
            @click="closeMobileMenu"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>{{ t('navigation.orders') }}</span>
          </router-link>
          <button
            class="block w-full text-left px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md text-base font-medium flex items-center space-x-3"
            @click="handleLogout"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>{{ t('navigation.logout') }}</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18nStore } from '@/stores/i18n'

export default {
  name: 'AppHeader',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const i18nStore = useI18nStore()
    const isMobileMenuOpen = ref(false)
    const selectedLocale = ref('tr')

    const availableLocales = i18nStore.getAvailableLocales()

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }

    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false
    }

    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }

    const changeLanguage = () => {
      i18nStore.setLocale(selectedLocale.value)
    }

    onMounted(() => {
      i18nStore.initializeLocale()
      selectedLocale.value = i18nStore.currentLocale
    })

    return {
      isMobileMenuOpen,
      selectedLocale,
      availableLocales,
      t: i18nStore.t,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout,
      changeLanguage
    }
  }
}
</script>
