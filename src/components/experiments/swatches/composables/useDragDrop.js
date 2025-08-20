import { ref } from 'vue'

/**
 * Composable for handling drag and drop operations
 * @returns {Object} Drag and drop utilities
 */
export function useDragDrop() {
  const isDragging = ref(false)
  const dragData = ref(null)
  
  /**
   * Create standardized color data object
   * @param {Object} color - Color object with various possible structures
   * @returns {Object} Standardized color data
   */
  const createColorData = (color) => {
    // Handle different color object structures
    if (color.colorName) {
      // Already in the right format
      return color
    }
    
    // Handle palette color format
    return {
      colorName: color.name,
      hexCode: color.hex,
      bgColor: color.hex,
      isDark: color.is_dark || false
    }
  }
  
  /**
   * Handle drag start for desktop/mouse events
   * @param {Event} event - Drag event
   * @param {Object} colorData - Color data to drag
   * @param {boolean} isFromGrid - Whether drag is from grid cell
   */
  const handleDragStart = (event, colorData, isFromGrid = false) => {
    try {
      const standardizedData = createColorData(colorData)
      
      dragData.value = standardizedData
      isDragging.value = true
      
      // Set data transfer for desktop drag
      const jsonData = JSON.stringify(standardizedData)
      event.dataTransfer.setData('application/json', jsonData)
      
      if (isFromGrid) {
        event.dataTransfer.setData('text/plain', 'grid-item')
      }
      
      // Add visual feedback
      event.target.classList.add('dragging')
    } catch (error) {
      console.error('Error in handleDragStart:', error, { colorData, isFromGrid })
    }
  }
  
  /**
   * Handle drag end for desktop/mouse events
   * @param {Event} event - Drag event
   */
  const handleDragEnd = (event) => {
    isDragging.value = false
    dragData.value = null
    event.target.classList.remove('dragging')
  }
  
  /**
   * Handle touch start for mobile events
   * @param {Event} event - Touch event
   * @param {Object} colorData - Color data to drag
   * @param {boolean} isFromGrid - Whether drag is from grid cell
   */
  const handleTouchStart = (event, colorData, isFromGrid = false) => {
    try {
      const standardizedData = createColorData(colorData)
      
      dragData.value = { ...standardizedData, isFromGrid }
      isDragging.value = true
      
      // Add visual feedback
      event.target.classList.add('dragging')
    } catch (error) {
      console.error('Error in handleTouchStart:', error, { colorData, isFromGrid })
    }
  }
  
  /**
   * Handle touch move for mobile events
   * @param {Event} event - Touch event
   */
  const handleTouchMove = (event) => {
    if (!isDragging.value) return
    
    event.preventDefault()
    const touch = event.touches[0]
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
    
    // Remove drag-over class from all grid cells
    document.querySelectorAll('.grid-cell').forEach(cell => {
      cell.classList.remove('drag-over')
    })
    
    // Add drag-over class to current cell
    const gridCell = elementBelow?.closest('.grid-cell')
    if (gridCell) {
      gridCell.classList.add('drag-over')
    }
  }
  
  /**
   * Handle touch end for mobile events
   * @param {Event} event - Touch event
   */
  const handleTouchEnd = (event) => {
    if (!isDragging.value) return
    
    const touch = event.changedTouches[0]
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
    const gridCell = elementBelow?.closest('.grid-cell')
    
    if (gridCell && dragData.value) {
      // Dispatch custom drop event
      const dropEvent = new CustomEvent('touchdrop', {
        detail: {
          dragData: dragData.value,
          targetCell: gridCell,
          isFromGrid: dragData.value.isFromGrid || false
        }
      })
      document.dispatchEvent(dropEvent)
    }
    
    // Clean up
    document.querySelectorAll('.grid-cell').forEach(cell => {
      cell.classList.remove('drag-over')
    })
    
    event.target.classList.remove('dragging')
    isDragging.value = false
    dragData.value = null
  }
  
  /**
   * Handle drop events for desktop/mouse
   * @param {Event} event - Drop event
   * @returns {Object|null} Parsed drag data or null if error
   */
  const handleDrop = (event) => {
    event.preventDefault()
    
    try {
      const jsonData = event.dataTransfer.getData('application/json')
      if (!jsonData) {
        console.warn('No JSON data found in drop event')
        return null
      }
      
      const colorData = JSON.parse(jsonData)
      const isGridItem = event.dataTransfer.getData('text/plain') === 'grid-item'
      
      // Validate color data structure
      if (!colorData || typeof colorData !== 'object') {
        console.warn('Invalid color data structure:', colorData)
        return null
      }
      
      return {
        colorData,
        isFromGrid: isGridItem
      }
    } catch (err) {
      console.error('Error parsing drop data:', err, {
        types: event.dataTransfer.types,
        jsonData: event.dataTransfer.getData('application/json')
      })
      return null
    }
  }
  
  /**
   * Handle drag over events
   * @param {Event} event - Drag over event
   */
  const handleDragOver = (event) => {
    event.preventDefault()
    event.currentTarget.classList.add('drag-over')
  }
  
  /**
   * Handle drag leave events
   * @param {Event} event - Drag leave event
   */
  const handleDragLeave = (event) => {
    event.currentTarget.classList.remove('drag-over')
  }
  
  /**
   * Reset drag state (useful for cleanup)
   */
  const resetDragState = () => {
    isDragging.value = false
    dragData.value = null
    
    // Remove any remaining drag visual feedback
    document.querySelectorAll('.dragging, .drag-over').forEach(element => {
      element.classList.remove('dragging', 'drag-over')
    })
  }
  
  return {
    isDragging,
    dragData,
    createColorData,
    handleDragStart,
    handleDragEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    resetDragState
  }
}