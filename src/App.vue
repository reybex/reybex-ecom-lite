<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { STORAGE_KEYS, MESSAGE_TYPES } from './utils/constants'

const authStore = useAuthStore()
const router = useRouter()

// Listen for messages from parent window
const handleMessage = (event) => {
  if (event.data.type === MESSAGE_TYPES.REDIRECT_TO_LOGIN) {
    router.push('/login')
  } else if (event.data.type === MESSAGE_TYPES.TOKEN_RESPONSE && event.data.token) {
    // Use token from parent window
    authStore.token = event.data.token
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, event.data.token)
    authStore.checkAuth()
  }
}

onMounted(() => {
  // Listen for messages from parent window
  window.addEventListener('message', handleMessage)
  
  // Initialize token and check auth
  authStore.initializeToken()
  authStore.checkAuth()
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>
