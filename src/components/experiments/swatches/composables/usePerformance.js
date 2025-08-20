import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable for performance monitoring and optimization
 * @returns {Object} Performance utilities
 */
export function usePerformance() {
  const performanceData = ref({
    renderTime: 0,
    interactionTime: 0,
    memoryUsage: 0
  })
  
  /**
   * Debounce function to limit function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
  
  /**
   * Throttle function to limit function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  const throttle = (func, limit) => {
    let inThrottle
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
  
  /**
   * Measure function execution time
   * @param {Function} func - Function to measure
   * @param {string} label - Label for the measurement
   * @returns {Function} Wrapped function that measures execution time
   */
  const measureExecutionTime = (func, label) => {
    return async (...args) => {
      const startTime = performance.now()
      const result = await func(...args)
      const endTime = performance.now()
      console.log(`${label} took ${endTime - startTime} milliseconds`)
      return result
    }
  }
  
  /**
   * RAF-based animation frame scheduler
   * @param {Function} callback - Callback to execute
   */
  const scheduleWork = (callback) => {
    requestAnimationFrame(() => {
      if (typeof callback === 'function') {
        callback()
      }
    })
  }
  
  /**
   * Idle callback scheduler for non-critical work
   * @param {Function} callback - Callback to execute when idle
   * @param {Object} options - Idle callback options
   */
  const scheduleIdleWork = (callback, options = {}) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback, {
        timeout: options.timeout || 5000,
        ...options
      })
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(callback, 0)
    }
  }
  
  /**
   * Batch DOM updates
   * @param {Array} updates - Array of update functions
   */
  const batchDOMUpdates = (updates) => {
    scheduleWork(() => {
      updates.forEach(update => {
        if (typeof update === 'function') {
          update()
        }
      })
    })
  }
  
  /**
   * Monitor memory usage (if available)
   */
  const updateMemoryUsage = () => {
    if ('memory' in performance) {
      performanceData.value.memoryUsage = {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
      }
    }
  }
  
  /**
   * Create a performance observer for monitoring
   * @param {string} entryType - Type of performance entries to observe
   * @param {Function} callback - Callback for performance entries
   */
  const createPerformanceObserver = (entryType, callback) => {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          callback(entries)
        })
        observer.observe({ entryTypes: [entryType] })
        return observer
      } catch (error) {
        console.warn('Performance observer not supported for:', entryType)
        return null
      }
    }
    return null
  }
  
  /**
   * Measure component render time
   */
  const measureRenderTime = () => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      performanceData.value.renderTime = endTime - startTime
    }
  }
  
  /**
   * Create optimized event handler
   * @param {Function} handler - Original event handler
   * @param {Object} options - Optimization options
   * @returns {Function} Optimized handler
   */
  const optimizeEventHandler = (handler, options = {}) => {
    const { throttleMs, debounceMs, passive = true } = options
    
    let optimizedHandler = handler
    
    if (throttleMs) {
      optimizedHandler = throttle(optimizedHandler, throttleMs)
    }
    
    if (debounceMs) {
      optimizedHandler = debounce(optimizedHandler, debounceMs)
    }
    
    return optimizedHandler
  }
  
  // Performance monitoring setup
  let memoryInterval
  let performanceObserver
  
  onMounted(() => {
    // Monitor memory usage every 5 seconds
    memoryInterval = setInterval(updateMemoryUsage, 5000)
    updateMemoryUsage()
    
    // Monitor long tasks
    performanceObserver = createPerformanceObserver('longtask', (entries) => {
      entries.forEach(entry => {
        if (entry.duration > 50) { // Tasks longer than 50ms
          console.warn('Long task detected:', entry.duration + 'ms')
        }
      })
    })
  })
  
  onUnmounted(() => {
    if (memoryInterval) {
      clearInterval(memoryInterval)
    }
    if (performanceObserver) {
      performanceObserver.disconnect()
    }
  })
  
  return {
    performanceData,
    debounce,
    throttle,
    measureExecutionTime,
    scheduleWork,
    scheduleIdleWork,
    batchDOMUpdates,
    updateMemoryUsage,
    createPerformanceObserver,
    measureRenderTime,
    optimizeEventHandler
  }
}