/**
 * Authentication composable
 * Interface Segregation: Focused on auth-related functionality only
 */
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { STORAGE_KEYS, MESSAGE_TYPES } from '@/utils/constants'

export function useAuth() {
  const authStore = useAuthStore()
  const isLoading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const token = computed(() => authStore.token)

  /**
   * Login with credentials
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} Login result
   */
  const login = async (credentials) => {
    try {
      isLoading.value = true
      error.value = null
      
      const result = await authStore.login(credentials)
      
      if (result.success) {
        return { success: true, data: result }
      } else {
        error.value = result.message
        return { success: false, message: result.message }
      }
    } catch (err) {
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logout user
   */
  const logout = () => {
    authStore.logout()
    error.value = null
  }

  /**
   * Check authentication status
   * @returns {Promise<boolean>} Authentication status
   */
  const checkAuth = async () => {
    try {
      return await authStore.checkAuth()
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  /**
   * Initialize authentication
   */
  const initializeAuth = () => {
    authStore.initializeToken()
  }

  /**
   * Get token from parent window
   * @returns {string|null} Token or null
   */
  const getTokenFromParent = () => {
    return authStore.getTokenFromParent()
  }

  return {
    // State
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    isAuthenticated,
    user,
    token,
    
    // Methods
    login,
    logout,
    checkAuth,
    initializeAuth,
    getTokenFromParent
  }
}
