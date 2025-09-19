import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'
import { STORAGE_KEYS, MESSAGE_TYPES } from '../utils/constants'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const userProfile = ref(null);
  const token = ref(null);
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  // Get token from parent window
  const getTokenFromParent = () => {
    // First check local storage
    const localToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (localToken) {
      return localToken;
    }
    
    // Get token from URL parameter (sent to iframe)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, urlToken);
      return urlToken;
    }
    
    // Request token from parent window
    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage({ type: MESSAGE_TYPES.REQUEST_TOKEN }, '*');
      } catch (error) {
        console.log('Could not communicate with parent window:', error);
      }
    }
    
    return null;
  };

  // Initialize token
  const initializeToken = () => {
    const newToken = getTokenFromParent();
    token.value = newToken;
  };

  const fetchUserProfile = async (userId) => {
    try {
      isLoading.value = true;
      const response = await api.get(`/user/${userId}`);
      userProfile.value = response.data;
      return response.data;
    } catch (error) {
      console.error('User profile fetch error:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (credentials) => {
    try {
      isLoading.value = true;
      console.log('Login credentials:', credentials);
      console.log('API base URL:', api.defaults.baseURL);
      const response = await api.post('/login', {
        ...credentials,
        keepLoggedIn: true
      });
      console.log('Login response:', response);
      
      if (response.data && response.data.token) {
        token.value = response.data.token;
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        
        if (response.data.user) {
          user.value = response.data.user;
        }
        
        return response.data;
      } else {
        throw new Error('Token alınamadı');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    userProfile.value = null;
    token.value = null;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  };

  const checkAuth = async () => {
    // First check token from parent window
    const currentToken = getTokenFromParent();
    
    if (!currentToken) {
      return false;
    }

    // Update if token has changed
    if (token.value !== currentToken) {
      token.value = currentToken;
    }

    // If token exists, auth is successful, we'll load user info later
    return true;
  };

  const updateUser = (userData) => {
    user.value = { ...user.value, ...userData };
  };

  return {
    user,
    userProfile,
    token,
    isLoading,
    isAuthenticated,
    initializeToken,
    getTokenFromParent,
    login,
    logout,
    checkAuth,
    updateUser,
    fetchUserProfile,
  };
});