<template>
  <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
    <div class="flex-1 flex justify-between sm:hidden">
      <button
        :disabled="pagination.page === 1"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="previousPage"
      >
        {{ t('pagination.previous') }}
      </button>
      <button
        :disabled="pagination.page === pagination.totalPages"
        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="nextPage"
      >
        {{ t('pagination.next') }}
      </button>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          {{ t('pagination.showing') }} <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
          -
          <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
          {{ t('pagination.of') }} <span class="font-medium">{{ pagination.total }}</span> {{ itemName }}
        </p>
      </div>
      <div>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button
            :disabled="pagination.page === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="previousPage"
          >
            {{ t('pagination.previous') }}
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            :class="page === pagination.page ? 'bg-primary-50 border-primary-500 text-primary-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
            class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            :disabled="pagination.page === pagination.totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="nextPage"
          >
            {{ t('pagination.next') }}
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useI18nStore } from '@/stores/i18n'

export default {
  name: 'Pagination',
  props: {
    pagination: {
      type: Object,
      required: true
    },
    itemName: {
      type: String,
      default: 'öğe'
    }
  },
  emits: ['page-change'],
  setup(props, { emit }) {
    const i18nStore = useI18nStore()
    const t = i18nStore.t
    
    const visiblePages = computed(() => {
      const pages = []
      const current = props.pagination.page
      const total = props.pagination.totalPages
      
      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        } else if (current >= total - 3) {
          pages.push(1)
          pages.push('...')
          for (let i = total - 4; i <= total; i++) {
            pages.push(i)
          }
        } else {
          pages.push(1)
          pages.push('...')
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        }
      }
      
      return pages
    })

    const previousPage = () => {
      if (props.pagination.page > 1) {
        emit('page-change', props.pagination.page - 1)
      }
    }

    const nextPage = () => {
      if (props.pagination.page < props.pagination.totalPages) {
        emit('page-change', props.pagination.page + 1)
      }
    }

    const goToPage = (page) => {
      if (typeof page === 'number' && page !== props.pagination.page) {
        emit('page-change', page)
      }
    }

    return {
      visiblePages,
      previousPage,
      nextPage,
      goToPage,
      t
    }
  }
}
</script>
