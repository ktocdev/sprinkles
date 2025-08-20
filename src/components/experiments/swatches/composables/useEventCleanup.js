import { onUnmounted } from 'vue'

/**
 * Composable for managing event listeners with automatic cleanup
 * @returns {Object} Event management utilities
 */
export function useEventCleanup() {
  const listeners = new Map()
  
  /**
   * Add an event listener with automatic cleanup tracking
   * @param {Element|Document|Window} element - Element to attach listener to
   * @param {string} event - Event type
   * @param {Function} handler - Event handler function
   * @param {Object} options - Event listener options
   * @returns {string} Listener ID for manual removal
   */
  const addEventListener = (element, event, handler, options = {}) => {
    const id = `${event}-${Date.now()}-${Math.random()}`
    
    element.addEventListener(event, handler, options)
    
    listeners.set(id, {
      element,
      event,
      handler,
      options
    })
    
    return id
  }
  
  /**
   * Remove a specific event listener
   * @param {string} id - Listener ID returned from addEventListener
   */
  const removeEventListener = (id) => {
    const listener = listeners.get(id)
    if (listener) {
      listener.element.removeEventListener(listener.event, listener.handler)
      listeners.delete(id)
    }
  }
  
  /**
   * Remove all event listeners
   */
  const removeAllListeners = () => {
    listeners.forEach((listener) => {
      listener.element.removeEventListener(listener.event, listener.handler)
    })
    listeners.clear()
  }
  
  /**
   * Remove listeners by pattern (useful for removing all listeners of a specific type)
   * @param {string} pattern - Pattern to match against listener IDs
   */
  const removeListenersByPattern = (pattern) => {
    const toRemove = []
    listeners.forEach((listener, id) => {
      if (id.includes(pattern)) {
        toRemove.push(id)
      }
    })
    toRemove.forEach(id => removeEventListener(id))
  }
  
  /**
   * Get count of active listeners (for debugging)
   * @returns {number} Number of active listeners
   */
  const getListenerCount = () => listeners.size
  
  // Automatic cleanup on component unmount
  onUnmounted(() => {
    removeAllListeners()
  })
  
  return {
    addEventListener,
    removeEventListener,
    removeAllListeners,
    removeListenersByPattern,
    getListenerCount
  }
}