import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable for handling responsive behavior
 * @returns {Object} Responsive utilities
 */
export function useResponsive() {
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
  
  // Breakpoints (matching CSS)
  const breakpoints = {
    mobile: 481,
    tablet: 769
  }
  
  // Computed breakpoint checks
  const isMobile = () => windowWidth.value < breakpoints.mobile
  const isTablet = () => windowWidth.value >= breakpoints.mobile && windowWidth.value < breakpoints.tablet
  const isDesktop = () => windowWidth.value >= breakpoints.tablet
  
  // Get colors per page based on screen size
  const getColorsPerPage = () => {
    if (isMobile()) return 4
    if (isTablet()) return 6
    return 8
  }
  
  // Update window width
  const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth
  }
  
  // Setup resize listener
  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateWindowWidth)
      updateWindowWidth() // Initial call
    }
  })
  
  // Cleanup
  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateWindowWidth)
    }
  })
  
  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    getColorsPerPage,
    breakpoints
  }
}