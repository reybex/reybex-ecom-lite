/**
 * Pagination composable
 * Interface Segregation: Focused on pagination functionality only
 */
import { ref, computed } from 'vue'

export function usePagination(initialPage = 1, initialLimit = 20) {
  const currentPage = ref(initialPage)
  const limit = ref(initialLimit)
  const total = ref(0)
  const isLoading = ref(false)

  /**
   * Total pages calculated from total items and limit
   */
  const totalPages = computed(() => {
    return Math.ceil(total.value / limit.value)
  })

  /**
   * Check if there's a next page
   */
  const hasNextPage = computed(() => {
    return currentPage.value < totalPages.value
  })

  /**
   * Check if there's a previous page
   */
  const hasPreviousPage = computed(() => {
    return currentPage.value > 1
  })

  /**
   * Get visible page numbers for pagination UI
   */
  const visiblePages = computed(() => {
    const pages = []
    const current = currentPage.value
    const total = totalPages.value
    
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

  /**
   * Go to specific page
   * @param {number} page - Page number
   */
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  /**
   * Go to next page
   */
  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  /**
   * Go to previous page
   */
  const previousPage = () => {
    if (hasPreviousPage.value) {
      currentPage.value--
    }
  }

  /**
   * Go to first page
   */
  const firstPage = () => {
    currentPage.value = 1
  }

  /**
   * Go to last page
   */
  const lastPage = () => {
    currentPage.value = totalPages.value
  }

  /**
   * Update pagination data
   * @param {Object} data - Pagination data
   */
  const updatePagination = (data) => {
    if (data.page) currentPage.value = data.page
    if (data.limit) limit.value = data.limit
    if (data.total !== undefined) total.value = data.total
  }

  /**
   * Reset pagination to initial state
   */
  const resetPagination = () => {
    currentPage.value = initialPage
    limit.value = initialLimit
    total.value = 0
  }

  return {
    // State
    currentPage: computed(() => currentPage.value),
    limit: computed(() => limit.value),
    total: computed(() => total.value),
    isLoading: computed(() => isLoading.value),
    totalPages,
    hasNextPage,
    hasPreviousPage,
    visiblePages,
    
    // Methods
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    updatePagination,
    resetPagination
  }
}
