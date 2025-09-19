import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { useAuthStore } from './stores/auth'
import { MESSAGE_TYPES } from './utils/constants'
import './assets/main.css'

// Views
import Dashboard from './views/Dashboard.vue'
import Login from './views/Login.vue'
import OrderList from './views/OrderList.vue'
import OrderDetail from './views/OrderDetail.vue'
import MaterialList from './views/MaterialList.vue'
import MaterialDetail from './views/MaterialDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/orders',
    name: 'OrderList',
    component: OrderList,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/materials',
    name: 'MaterialList',
    component: MaterialList,
    meta: { requiresAuth: true }
  },
  {
    path: '/materials/:id',
    name: 'MaterialDetail',
    component: MaterialDetail,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize token
const authStore = useAuthStore()
authStore.initializeToken()

// Initialize i18n store
import { useI18nStore } from './stores/i18n'
const i18nStore = useI18nStore()
i18nStore.initializeLocale()

app.mount('#app')

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check token from parent window
  const parentToken = authStore.getTokenFromParent ? authStore.getTokenFromParent() : null;
  
  if (to.meta.requiresAuth) {
    const isAuth = await authStore.checkAuth()
    
    if (!isAuth) {
      // If token exists in parent window and we're in iframe, redirect to login
      if (parentToken && window.parent && window.parent !== window) {
        // Send message to parent window to redirect to login page
        try {
          window.parent.postMessage({ type: MESSAGE_TYPES.REDIRECT_TO_LOGIN }, '*');
        } catch (error) {
          console.log('Could not send message to parent window:', error);
        }
        next('/login');
        return;
      }
      next('/login');
      return;
    }
  }
  
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
    return
  }
  
  next()
})