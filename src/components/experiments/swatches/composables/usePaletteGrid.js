import { ref, computed, reactive } from 'vue'
import { useEventCleanup } from './useEventCleanup.js'

/**
 * Composable for managing palette grid state and operations
 * @param {Object} colors - All available colors
 * @returns {Object} Grid state and methods
 */
export function usePaletteGrid(colors) {
  const { addEventListener, removeListenersByPattern } = useEventCleanup()
  
  const gridSize = ref(4)
  const gridData = reactive(new Map())
  const gridDataTrigger = ref(0) // Used to force reactivity updates
  
  // Computed properties
  const totalCells = computed(() => gridSize.value * gridSize.value)
  const gridColumns = computed(() => `repeat(${gridSize.value}, 1fr)`)
  
  /**
   * Change grid size and clean up data if necessary
   * @param {number} newSize - New grid size
   */
  const changeGridSize = (newSize) => {
    const oldSize = gridSize.value
    gridSize.value = parseInt(newSize)
    
    // Remove data for cells that no longer exist
    if (gridSize.value < oldSize) {
      const maxIndex = totalCells.value - 1
      const keysToRemove = Array.from(gridData.keys()).filter(key => key > maxIndex)
      keysToRemove.forEach(key => gridData.delete(key))
      gridDataTrigger.value++ // Trigger reactivity if data was removed
    }
  }
  
  /**
   * Set color data for a specific grid cell
   * @param {number} index - Cell index
   * @param {Object} colorData - Color data to set
   */
  const setCellData = (index, colorData) => {
    gridData.set(index, colorData)
    gridDataTrigger.value++ // Trigger reactivity
  }
  
  /**
   * Get color data for a specific grid cell
   * @param {number} index - Cell index
   * @returns {Object|undefined} Color data or undefined
   */
  const getCellData = (index) => {
    // Access the trigger to ensure reactivity
    gridDataTrigger.value
    return gridData.get(index)
  }
  
  /**
   * Remove color data for a specific grid cell
   * @param {number} index - Cell index
   */
  const removeCellData = (index) => {
    gridData.delete(index)
    gridDataTrigger.value++ // Trigger reactivity
  }
  
  /**
   * Clear all grid data
   */
  const clearGrid = () => {
    gridData.clear()
    gridDataTrigger.value++ // Trigger reactivity
  }
  
  /**
   * Check if a cell is occupied
   * @param {number} index - Cell index
   * @returns {boolean} Whether the cell has data
   */
  const isCellOccupied = (index) => {
    return gridData.has(index)
  }
  
  /**
   * Get all occupied cells as an array
   * @returns {Array} Array of {index, colorData} objects
   */
  const getOccupiedCells = () => {
    return Array.from(gridData.entries()).map(([index, colorData]) => ({
      index,
      colorData
    }))
  }
  
  /**
   * Swap or move colors between grid cells
   * @param {Object} draggedColor - Color being dragged
   * @param {number} targetIndex - Target cell index
   * @param {number} sourceIndex - Source cell index
   */
  const swapOrMoveColors = (draggedColor, targetIndex, sourceIndex) => {
    if (sourceIndex === -1) return // Source not found
    
    const targetColorData = getCellData(targetIndex)
    
    // Place dragged color in target cell
    setCellData(targetIndex, draggedColor)
    
    if (targetColorData) {
      // Swap: Place target color in source cell
      setCellData(sourceIndex, targetColorData)
    } else {
      // Move: Clear source cell
      removeCellData(sourceIndex)
    }
  }
  
  /**
   * Find source cell index by background color
   * @param {string} bgColor - Background color to search for
   * @param {number} excludeIndex - Index to exclude from search
   * @returns {number} Source cell index or -1 if not found
   */
  const findSourceCellIndex = (bgColor, excludeIndex) => {
    for (const [index, colorData] of gridData.entries()) {
      if (index !== excludeIndex && colorData.bgColor === bgColor) {
        return index
      }
    }
    return -1
  }
  
  /**
   * Generate random palette
   */
  const generateRandomPalette = () => {
    clearGrid()
    
    if (!colors || !colors.value) return
    
    const availableColors = [...colors.value]
    const shuffledColors = availableColors.sort(() => Math.random() - 0.5)
    const colorsToUse = Math.min(totalCells.value, shuffledColors.length)
    
    for (let i = 0; i < colorsToUse; i++) {
      const selectedColor = shuffledColors[i]
      const colorData = {
        colorName: selectedColor.name,
        hexCode: selectedColor.hex,
        bgColor: selectedColor.hex,
        isDark: selectedColor.is_dark
      }
      gridData.set(i, colorData) // Direct set without triggering for each one
    }
    gridDataTrigger.value++ // Single trigger at the end
  }
  
  /**
   * Get grid data as array for export/serialization
   * @returns {Array} Array representation of grid data
   */
  const exportGridData = () => {
    const result = new Array(totalCells.value).fill(null)
    for (const [index, colorData] of gridData.entries()) {
      result[index] = colorData
    }
    return result
  }
  
  /**
   * Import grid data from array
   * @param {Array} data - Array of color data
   */
  const importGridData = (data) => {
    clearGrid()
    data.forEach((colorData, index) => {
      if (colorData && index < totalCells.value) {
        setCellData(index, colorData)
      }
    })
  }
  
  return {
    gridSize,
    gridData,
    totalCells,
    gridColumns,
    changeGridSize,
    setCellData,
    getCellData,
    removeCellData,
    clearGrid,
    isCellOccupied,
    getOccupiedCells,
    swapOrMoveColors,
    findSourceCellIndex,
    generateRandomPalette,
    exportGridData,
    importGridData
  }
}