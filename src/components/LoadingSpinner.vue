<template>
  <div class="flex justify-center items-center py-12">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    <span class="ml-2 text-gray-600">{{ message || t('common.loading') }}</span>
  </div>
</template>

<script>
import { useI18nStore } from '@/stores/i18n'

export default {
  name: 'LoadingSpinner',
  props: {
    message: {
      type: String,
      default: ''
    }
  },
  setup() {
    const i18nStore = useI18nStore()
    return {
      t: i18nStore.t
    }
  }
}
</script>
