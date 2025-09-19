/**
 * Filtering composable
 * Interface Segregation: Focused on filtering functionality only
 */
import { ref, computed } from 'vue'

export function useFilters(initialFilters = {}) {
  const filters = ref({ ...initialFilters })
  const searchQuery = ref('')
  const sortBy = ref('')
  const sortDirection = ref('asc')

  /**
   * Update filter value
   * @param {string} key - Filter key
   * @param {any} value - Filter value
   */
  const setFilter = (key, value) => {
    filters.value[key] = value
  }

  /**
   * Update multiple filters
   * @param {Object} newFilters - Filters to update
   */
  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    filters.value = { ...initialFilters }
    searchQuery.value = ''
    sortBy.value = ''
    sortDirection.value = 'asc'
  }

  /**
   * Clear specific filter
   * @param {string} key - Filter key to clear
   */
  const clearFilter = (key) => {
    if (key in initialFilters) {
      filters.value[key] = initialFilters[key]
    } else {
      delete filters.value[key]
    }
  }

  /**
   * Get active filters count
   */
  const activeFiltersCount = computed(() => {
    let count = 0
    Object.keys(filters.value).forEach(key => {
      const value = filters.value[key]
      if (value !== null && value !== undefined && value !== '') {
        count++
      }
    })
    if (searchQuery.value) count++
    if (sortBy.value) count++
    return count
  })

  /**
   * Check if filters are active
   */
  const hasActiveFilters = computed(() => activeFiltersCount.value > 0)

  return {
    // State
    filters: computed(() => filters.value),
    searchQuery,
    sortBy,
    sortDirection,
    activeFiltersCount,
    hasActiveFilters,
    
    // Methods
    setFilter,
    setFilters,
    clearFilters,
    clearFilter
  }
}
