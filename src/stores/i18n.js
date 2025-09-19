import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { STORAGE_KEYS } from '../utils/constants'

// Import language files
import tr from '../locales/tr.json'
import en from '../locales/en.json'
import de from '../locales/de.json'

export const useI18nStore = defineStore('i18n', () => {
  const currentLocale = ref('tr')
  
  const locales = {
    tr: { name: 'Türkçe', flag: '🇹🇷', data: tr },
    en: { name: 'English', flag: '🇺🇸', data: en },
    de: { name: 'Deutsch', flag: '🇩🇪', data: de }
  }

  const t = computed(() => {
    return (key, params = {}) => {
      const keys = key.split('.')
      let value = locales[currentLocale.value].data
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k]
        } else {
          console.warn(`Translation key not found: ${key}`)
          return key
        }
      }
      
      if (typeof value === 'string') {
        // Replace parameters
        return value.replace(/\{(\w+)\}/g, (match, param) => {
          return params[param] || match
        })
      }
      
      return value
    }
  })

  const setLocale = (locale) => {
    if (locales[locale]) {
      currentLocale.value = locale
      localStorage.setItem(STORAGE_KEYS.PREFERRED_LOCALE, locale)
    }
  }

  const getCurrentLocale = () => {
    return locales[currentLocale.value]
  }

  const getAvailableLocales = () => {
    return Object.keys(locales).map(key => ({
      key,
      ...locales[key]
    }))
  }

  // Load saved language when page loads
  const initializeLocale = () => {
    const savedLocale = localStorage.getItem(STORAGE_KEYS.PREFERRED_LOCALE)
    if (savedLocale && locales[savedLocale]) {
      currentLocale.value = savedLocale
    }
  }

  return {
    currentLocale,
    t,
    setLocale,
    getCurrentLocale,
    getAvailableLocales,
    initializeLocale
  }
})
