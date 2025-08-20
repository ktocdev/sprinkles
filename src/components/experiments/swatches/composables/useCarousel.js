import { ref, computed, watch } from 'vue'
import { useResponsive } from './useResponsive.js'

/**
 * Composable for managing carousel state and navigation
 * @param {Array} colors - Array of colors to display in carousel
 * @returns {Object} Carousel state and methods
 */
export function useCarousel(colors) {
  const { getColorsPerPage } = useResponsive()
  
  const currentPage = ref(0)
  const colorsPerPage = ref(getColorsPerPage())
  
  // Update colors per page when window resizes
  const { windowWidth } = useResponsive()
  watch(windowWidth, () => {
    const newColorsPerPage = getColorsPerPage()
    if (newColorsPerPage !== colorsPerPage.value) {
      colorsPerPage.value = newColorsPerPage
      // Reset to first page when colors per page changes significantly
      currentPage.value = 0
    }
  })
  
  // Computed properties
  const totalPages = computed(() => {
    if (!colors || !colors.value) return 0
    return Math.ceil(colors.value.length / colorsPerPage.value)
  })
  
  const currentPageColors = computed(() => {
    if (!colors || !colors.value) return []
    const startIndex = currentPage.value * colorsPerPage.value
    return colors.value.slice(startIndex, startIndex + colorsPerPage.value)
  })
  
  const canGoPrev = computed(() => currentPage.value > 0)
  const canGoNext = computed(() => currentPage.value < totalPages.value - 1)
  
  // Navigation methods
  const goToPrevPage = () => {
    if (canGoPrev.value) {
      currentPage.value--
    }
  }
  
  const goToNextPage = () => {
    if (canGoNext.value) {
      currentPage.value++
    }
  }
  
  const goToPage = (page) => {
    if (page >= 0 && page < totalPages.value) {
      currentPage.value = page
    }
  }
  
  const resetToFirstPage = () => {
    currentPage.value = 0
  }
  
  return {
    currentPage,
    colorsPerPage,
    totalPages,
    currentPageColors,
    canGoPrev,
    canGoNext,
    goToPrevPage,
    goToNextPage,
    goToPage,
    resetToFirstPage
  }
}