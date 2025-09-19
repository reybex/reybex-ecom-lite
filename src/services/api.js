import axios from 'axios'
import { API_CONFIG, STORAGE_KEYS } from '../utils/constants'

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
})

const addTokenToRequest = (config) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  const customerToken = localStorage.getItem(STORAGE_KEYS.CUSTOMER_PORTAL_TOKEN)

  if (token !== null) {
    config.headers.Authorization = `Basic ${token}`
  }

  if (customerToken !== null) {
    config.headers.customerPortalToken = customerToken
  }

  return config
}

api.interceptors.request.use(addTokenToRequest, (err) => Promise.reject(err))
const normalizeResponse = (response) => {
  const { data, meta } = response.data || {}

  if (meta) {
    response.data = data
    response.meta = meta
  }

  return Promise.resolve(response)
}

api.interceptors.response.use(normalizeResponse, (err) => {
  const { response } = err
  const { data } = response || {}
  
  if (data && data.data) {
    const { error } = err.response.data.data

    if (error && error === 'authenticate.user.session.expired') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_ID)
      localStorage.removeItem(STORAGE_KEYS.USER)
      window.location.href = '/login'
    }

    if (error && error === 'app.session.invalid') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_ID)
      localStorage.removeItem(STORAGE_KEYS.USER)
      window.location.href = '/login'
    }
  }

  return Promise.reject(err)
})

export default api
