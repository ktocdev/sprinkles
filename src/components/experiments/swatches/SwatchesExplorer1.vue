<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import SwatchBlock from './components/swatch/SwatchBlock.vue'
import colorsData from './data/colors.json'

const router = useRouter()

const gridSize = ref(4)
const gridData = new Map()

// Carousel state - responsive
const carouselPage = ref(0)
const colorsPerPage = ref(4) // Will be updated based on screen size

// Cache DOM references
let gridElement = null
let gridSizeSelect = null
const eventListeners = new Map()

// Store active event listeners for cleanup
const activeListeners = new Set()

const palette = computed(() => colorsData.palettes.appleCiderBoardGame)
const allColors = computed(() => {
  const colors = []
  Object.values(palette.value.categories).forEach(category => {
    colors.push(...category)
  })
  return colors
})

// Carousel computed properties
const totalPages = computed(() => Math.ceil(allColors.value.length / colorsPerPage.value))
const currentPageColors = computed(() => {
  const startIndex = carouselPage.value * colorsPerPage.value
  return allColors.value.slice(startIndex, startIndex + colorsPerPage.value)
})
const canGoPrev = computed(() => carouselPage.value > 0)
const canGoNext = computed(() => carouselPage.value < totalPages.value - 1)

onMounted(() => {
  document.body.style.overflow = 'hidden'
  
  // Cache DOM references
  gridElement = document.getElementById('paletteGrid')
  gridSizeSelect = document.getElementById('gridSize')
  
  // Set initial colors per page based on screen size
  updateColorsPerPage()
  
  // Listen for window resize to update colors per page
  window.addEventListener('resize', updateColorsPerPage)
  
  createGrid()
  bindEvents()
  bindTouchEvents()
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('resize', updateColorsPerPage)
  cleanup()
})

// Function to update colors per page based on screen size
function updateColorsPerPage() {
  const width = window.innerWidth
  const oldColorsPerPage = colorsPerPage.value
  
  if (width < 481) {
    // Mobile: 4 colors
    colorsPerPage.value = 4
  } else if (width < 769) {
    // Tablet: 6 colors
    colorsPerPage.value = 6
  } else {
    // Desktop: 8 colors
    colorsPerPage.value = 8
  }
  
  // Reset to first page if colors per page changed significantly
  if (oldColorsPerPage !== colorsPerPage.value) {
    carouselPage.value = 0
  }
}

// Cleanup function to remove all event listeners
function cleanup() {
  document.removeEventListener('touchdrop', handleTouchDrop)
  
  // Remove grid size event listener
  if (gridSizeSelect && eventListeners.has('gridSizeChange')) {
    gridSizeSelect.removeEventListener('change', eventListeners.get('gridSizeChange'))
    eventListeners.delete('gridSizeChange')
  }
  
  // Clear any remaining listeners
  activeListeners.clear()
  eventListeners.clear()
}



function createGrid() {
  if (!gridElement) return
  
  gridElement.style.gridTemplateColumns = `repeat(${gridSize.value}, 1fr)`
  
  // Clean up existing cells and their listeners
  cleanupGridCells()
  gridElement.innerHTML = ''

  for (let i = 0; i < gridSize.value * gridSize.value; i++) {
    const cell = document.createElement('div')
    cell.className = 'grid-cell'
    cell.dataset.index = i
    
    // Store listeners for cleanup
    const dragOverListener = (e) => handleDragOver(e)
    const dragLeaveListener = (e) => handleDragLeave(e)
    const dropListener = (e) => handleDrop(e)
    
    cell.addEventListener('dragover', dragOverListener)
    cell.addEventListener('dragleave', dragLeaveListener)
    cell.addEventListener('drop', dropListener)
    
    // Store references for cleanup
    eventListeners.set(`cell-${i}-dragover`, { element: cell, type: 'dragover', listener: dragOverListener })
    eventListeners.set(`cell-${i}-dragleave`, { element: cell, type: 'dragleave', listener: dragLeaveListener })
    eventListeners.set(`cell-${i}-drop`, { element: cell, type: 'drop', listener: dropListener })
    
    if (gridData.has(i)) {
      populateCell(cell, gridData.get(i))
    }
    
    gridElement.appendChild(cell)
  }
}

function cleanupGridCells() {
  // Remove all cell event listeners
  eventListeners.forEach((listenerInfo, key) => {
    if (key.startsWith('cell-') || key.startsWith('mini-swatch-')) {
      listenerInfo.element.removeEventListener(listenerInfo.type, listenerInfo.listener)
      eventListeners.delete(key)
    }
  })
}

function handleDragOver(e) {
  e.preventDefault()
  e.currentTarget.classList.add('drag-over')
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove('drag-over')
}

function handleDrop(e) {
  e.preventDefault()
  const cell = e.currentTarget
  cell.classList.remove('drag-over')
  
  try {
    const colorData = JSON.parse(e.dataTransfer.getData('application/json'))
    const isGridItem = e.dataTransfer.getData('text/plain') === 'grid-item'
    const targetIndex = parseInt(cell.dataset.index)
    
    if (isGridItem) {
      // Handle grid-to-grid movement (swap or move)
      swapOrMoveGridColors(colorData, targetIndex)
    } else {
      // Handle swatch-to-grid (regular drop from swatch)
      gridData.set(targetIndex, colorData)
      populateCell(cell, colorData)
    }
  } catch (err) {
    console.error('Error handling drop:', err)
  }
}

function populateCell(cell, colorData) {
  const cellIndex = cell.dataset.index
  
  // Clean up existing mini-swatch listeners for this cell
  cleanupCellListeners(cellIndex)
  
  cell.classList.add('occupied')
  const darkClass = colorData.isDark ? 'dark-mini-swatch' : ''
  cell.innerHTML = `
    <div class="mini-swatch ${darkClass}" draggable="true" style="background-color: ${colorData.bgColor}">
      <div class="mini-color-name">${colorData.colorName}</div>
    </div>
  `
  
  const miniSwatch = cell.querySelector('.mini-swatch')
  
  // Create listeners with proper cleanup tracking
  const dragStartListener = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify(colorData))
    e.dataTransfer.setData('text/plain', 'grid-item')
  }
  
  const dragEndListener = () => {
    setTimeout(() => {
      if (!cell.querySelector('.mini-swatch')) {
        cell.classList.remove('occupied')
        gridData.delete(parseInt(cellIndex))
      }
    }, 100)
  }
  
  // Touch event handlers for grid items
  let isDraggingGrid = false
  
  const touchStartListener = (e) => {
    isDraggingGrid = true
    e.target.classList.add('dragging')
  }
  
  const touchMoveListener = (e) => {
    if (!isDraggingGrid) return
    
    e.preventDefault()
    const touch = e.touches[0]
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
    
    // Remove drag-over class from all grid cells
    document.querySelectorAll('.grid-cell').forEach(gridCell => {
      gridCell.classList.remove('drag-over')
    })
    
    // Add drag-over class to current cell
    const targetGridCell = elementBelow?.closest('.grid-cell')
    if (targetGridCell && targetGridCell !== cell) {
      targetGridCell.classList.add('drag-over')
    }
  }
  
  const touchEndListener = (e) => {
    if (!isDraggingGrid) return
    
    const touch = e.changedTouches[0]
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
    const targetGridCell = elementBelow?.closest('.grid-cell')
    
    if (targetGridCell && targetGridCell !== cell) {
      // Simulate drop event for grid-to-grid movement
      const dropEvent = new CustomEvent('touchdrop', {
        detail: {
          dragData: colorData,
          targetCell: targetGridCell,
          isFromGrid: true
        }
      })
      document.dispatchEvent(dropEvent)
    }
    
    // Clean up
    document.querySelectorAll('.grid-cell').forEach(gridCell => {
      gridCell.classList.remove('drag-over')
    })
    
    e.target.classList.remove('dragging')
    isDraggingGrid = false
  }
  
  miniSwatch.addEventListener('dragstart', dragStartListener)
  miniSwatch.addEventListener('dragend', dragEndListener)
  miniSwatch.addEventListener('touchstart', touchStartListener)
  miniSwatch.addEventListener('touchmove', touchMoveListener)
  miniSwatch.addEventListener('touchend', touchEndListener)
  
  // Store listeners for cleanup
  eventListeners.set(`mini-swatch-${cellIndex}-dragstart`, { element: miniSwatch, type: 'dragstart', listener: dragStartListener })
  eventListeners.set(`mini-swatch-${cellIndex}-dragend`, { element: miniSwatch, type: 'dragend', listener: dragEndListener })
  eventListeners.set(`mini-swatch-${cellIndex}-touchstart`, { element: miniSwatch, type: 'touchstart', listener: touchStartListener })
  eventListeners.set(`mini-swatch-${cellIndex}-touchmove`, { element: miniSwatch, type: 'touchmove', listener: touchMoveListener })
  eventListeners.set(`mini-swatch-${cellIndex}-touchend`, { element: miniSwatch, type: 'touchend', listener: touchEndListener })
}

function cleanupCellListeners(cellIndex) {
  const keys = [
    `mini-swatch-${cellIndex}-dragstart`, 
    `mini-swatch-${cellIndex}-dragend`,
    `mini-swatch-${cellIndex}-touchstart`,
    `mini-swatch-${cellIndex}-touchmove`,
    `mini-swatch-${cellIndex}-touchend`
  ]
  keys.forEach(key => {
    const listenerInfo = eventListeners.get(key)
    if (listenerInfo) {
      listenerInfo.element.removeEventListener(listenerInfo.type, listenerInfo.listener)
      eventListeners.delete(key)
    }
  })
}

function handleGridSizeChange(newSize) {
  const oldSize = gridSize.value
  gridSize.value = parseInt(newSize)
  
  if (gridSize.value < oldSize) {
    const maxIndex = gridSize.value * gridSize.value - 1
    const keysToRemove = Array.from(gridData.keys()).filter(key => key > maxIndex)
    keysToRemove.forEach(key => gridData.delete(key))
  }
  
  createGrid()
}

function bindEvents() {
  if (!gridSizeSelect) return
  
  const changeListener = (e) => {
    handleGridSizeChange(e.target.value)
  }
  
  gridSizeSelect.addEventListener('change', changeListener)
  eventListeners.set('gridSizeChange', changeListener)
}

function bindTouchEvents() {
  document.addEventListener('touchdrop', handleTouchDrop)
}

function handleTouchDrop(e) {
  const { dragData, targetCell, isFromGrid } = e.detail
  const targetIndex = parseInt(targetCell.dataset.index)
  
  if (isFromGrid) {
    // Handle grid-to-grid movement (swap or move)
    swapOrMoveGridColors(dragData, targetIndex)
  } else {
    // Handle swatch-to-grid (regular drop from swatch)
    gridData.set(targetIndex, dragData)
    populateCell(targetCell, dragData)
  }
}

function clearPalette() {
  if (!gridElement) return
  
  // Clean up all mini-swatch listeners before clearing
  for (let i = 0; i < gridSize.value * gridSize.value; i++) {
    cleanupCellListeners(i)
  }
  
  const cells = gridElement.querySelectorAll('.grid-cell')
  cells.forEach(cell => {
    cell.classList.remove('occupied')
    cell.innerHTML = ''
  })
  
  gridData.clear()
}

function randomPalette() {
  clearPalette()
  
  const totalCells = gridSize.value * gridSize.value
  const availableColors = [...allColors.value]
  
  // Shuffle available colors
  const shuffledColors = availableColors.sort(() => Math.random() - 0.5)
  
  // Use only unique colors, up to the grid size or available colors
  const colorsToUse = Math.min(totalCells, shuffledColors.length)
  
  for (let i = 0; i < colorsToUse; i++) {
    const selectedColor = shuffledColors[i]
    const colorData = {
      colorName: selectedColor.name,
      hexCode: selectedColor.hex,
      bgColor: selectedColor.hex,
      isDark: selectedColor.is_dark
    }
    
    gridData.set(i, colorData)
    
    if (gridElement) {
      const cell = gridElement.querySelector(`.grid-cell[data-index="${i}"]`)
      if (cell) {
        populateCell(cell, colorData)
      }
    }
  }
}

// Helper function to swap or move colors between grid cells
function swapOrMoveGridColors(draggedColor, targetIndex) {
  if (!gridElement) return
  
  // Find the source cell that contains the dragged color
  const sourceIndex = findSourceCellIndex(draggedColor.bgColor, targetIndex)
  if (sourceIndex === -1) return // Source not found
  
  // Get target cell data (if any)
  const targetColorData = gridData.get(targetIndex)
  const targetCell = gridElement.querySelector(`.grid-cell[data-index="${targetIndex}"]`)
  const sourceCell = gridElement.querySelector(`.grid-cell[data-index="${sourceIndex}"]`)
  
  if (!targetCell || !sourceCell) return
  
  // Place dragged color in target cell
  gridData.set(targetIndex, draggedColor)
  populateCell(targetCell, draggedColor)
  
  if (targetColorData) {
    // Swap: Place target color in source cell
    gridData.set(sourceIndex, targetColorData)
    populateCell(sourceCell, targetColorData)
  } else {
    // Move: Clear source cell (make it white/empty)
    cleanupCellListeners(sourceIndex)
    sourceCell.classList.remove('occupied')
    sourceCell.innerHTML = ''
    gridData.delete(sourceIndex)
  }
}

// Helper function to find the source cell index by background color
function findSourceCellIndex(bgColor, excludeIndex) {
  if (!gridElement) return -1
  
  const allCells = gridElement.querySelectorAll('.grid-cell')
  for (let i = 0; i < allCells.length; i++) {
    if (i === excludeIndex) continue
    
    const cell = allCells[i]
    const existingSwatch = cell.querySelector('.mini-swatch')
    if (existingSwatch) {
      const existingColor = existingSwatch.style.backgroundColor
      if (existingColor === bgColor) {
        return i
      }
    }
  }
  return -1
}

// Carousel navigation functions
function goToPrevPage() {
  if (canGoPrev.value) {
    carouselPage.value--
  }
}

function goToNextPage() {
  if (canGoNext.value) {
    carouselPage.value++
  }
}

function goBack() {
  document.body.style.overflow = ''
  cleanup()
  router.back()
}
</script>

<template>
  <div class="swatches-explorer">
    <div class="swatches-header">
      <h2>{{ palette.name }}</h2>
      <button @click="goBack" class="close-button">✕ Close</button>
    </div>
    
    <!-- Color Carousel (responsive) -->
    <div class="color-carousel">
      <div class="carousel-header">
        <h3>{{ palette.name }} Colors</h3>
        <div class="carousel-info">{{ carouselPage + 1 }} / {{ totalPages }}</div>
      </div>
      <div class="carousel-container">
        <button 
          @click="goToPrevPage" 
          class="carousel-arrow prev-arrow"
          :disabled="!canGoPrev"
          :class="{ disabled: !canGoPrev }"
        >
          ‹
        </button>
        
        <div class="carousel-swatches">
          <SwatchBlock 
            v-for="color in currentPageColors" 
            :key="color.id"
            :color-name="color.name" 
            :hex-code="color.hex" 
            :background-color="color.hex"
            :is-dark="color.is_dark" 
          />
        </div>
        
        <button 
          @click="goToNextPage" 
          class="carousel-arrow next-arrow"
          :disabled="!canGoNext"
          :class="{ disabled: !canGoNext }"
        >
          ›
        </button>
      </div>
    </div>
    
    <div class="grid-controls">
      <label for="gridSize">Palette Grid Size:</label>
      <select id="gridSize">
        <option value="2">2×2</option>
        <option value="3">3×3</option>
        <option value="4" selected>4×4</option>
        <option value="5">5×5</option>
      </select>
    </div>
    
    <div class="main-content">

      <div class="palette-grid-container">
      <div class="palette-header">
        <h3>Your Custom Palette</h3>
        <div class="palette-controls">
          <button @click="clearPalette" class="palette-button clear-button">Clear Palette</button>
          <button @click="randomPalette" class="palette-button random-button">Random Palette</button>
        </div>
      </div>
      <div class="palette-grid" id="paletteGrid">
        <!-- Grid cells will be generated here -->
      </div>
      </div>
    </div>

    <div class="footer">
      Generated by Swatch and Palette Maker by Katie O'Connor
    </div>
  </div>
</template>

<style scoped>
/* Mobile-first design */
.swatches-explorer {
  font-family: Arial, sans-serif;
  padding: 10px;
  background-color: #fff;
  color: #333;
  min-height: 100vh;
}

/* Color Carousel Styles - Responsive */
.color-carousel {
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(145deg, #f8f9fa, #ffffff);
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  margin: -10px -10px 20px -10px;
  padding: 15px;
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.carousel-header h3 {
  font-size: 14px;
  margin: 0;
  font-weight: bold;
  color: #333;
}

.carousel-info {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.carousel-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.carousel-arrow {
  background: linear-gradient(135deg, #6A5ACD, #2C2A4A);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  touch-action: manipulation;
}

.carousel-arrow:hover:not(.disabled) {
  background: linear-gradient(135deg, #5A4AB7, #242240);
  transform: scale(1.05);
}

.carousel-arrow.disabled {
  background: #ddd;
  color: #999;
  cursor: not-allowed;
  opacity: 0.5;
}

.carousel-swatches {
  display: flex;
  gap: 6px;
  flex: 1;
  justify-content: center;
  min-height: 80px;
  align-items: flex-start;
}

/* Mobile carousel swatch blocks - fixed sizing */
.carousel-swatches :deep(.swatch-block) {
  width: 50px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.carousel-swatches :deep(.swatch) {
  width: 50px;
  height: 50px;
  margin-bottom: 2px;
  flex-shrink: 0;
}

.carousel-swatches :deep(.color-name) {
  font-size: 7px;
  line-height: 1;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-swatches :deep(.hex-code) {
  font-size: 6px;
  line-height: 1;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

/* Tablet swatch sizing - fixed dimensions */
@media (min-width: 481px) {
  .carousel-swatches :deep(.swatch-block) {
    width: 70px;
    height: 100px;
  }

  .carousel-swatches :deep(.swatch) {
    width: 70px;
    height: 70px;
    margin-bottom: 3px;
  }

  .carousel-swatches :deep(.color-name) {
    font-size: 8px;
    height: 14px;
  }

  .carousel-swatches :deep(.hex-code) {
    font-size: 7px;
    height: 10px;
    margin-top: 2px;
  }
}

/* Desktop swatch sizing - fixed dimensions */
@media (min-width: 769px) {
  .carousel-swatches :deep(.swatch-block) {
    width: 90px;
    height: 120px;
  }

  .carousel-swatches :deep(.swatch) {
    width: 90px;
    height: 90px;
    margin-bottom: 4px;
  }

  .carousel-swatches :deep(.color-name) {
    font-size: 10px;
    height: 16px;
  }

  .carousel-swatches :deep(.hex-code) {
    font-size: 8px;
    height: 12px;
    margin-top: 2px;
  }
}

/* Responsive carousel adjustments */
@media (min-width: 481px) {
  .color-carousel {
    margin: -15px -15px 25px -15px;
    padding: 20px;
  }
  
  .carousel-header h3 {
    font-size: 16px;
  }
  
  .carousel-info {
    font-size: 14px;
  }
  
  .carousel-swatches {
    min-height: 100px;
    gap: 8px;
  }
}

@media (min-width: 769px) {
  .color-carousel {
    margin: -20px -20px 30px -20px;
    padding: 25px;
  }
  
  .carousel-header h3 {
    font-size: 18px;
  }
  
  .carousel-swatches {
    min-height: 120px;
    gap: 10px;
  }
}

.swatches-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.swatches-header h2 {
  font-size: 18px;
  margin: 0;
}

/* Tablet and up */
@media (min-width: 481px) {
  .swatches-explorer {
    padding: 15px;
  }
  
  .swatches-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
  }
  
  .swatches-header h2 {
    font-size: 22px;
  }
}

/* Desktop and up */
@media (min-width: 769px) {
  .swatches-explorer {
    padding: 20px;
  }
  
  .swatches-header {
    margin-bottom: 20px;
  }
  
  .swatches-header h2 {
    font-size: 24px;
  }
}

.close-button {
  background: linear-gradient(135deg, #6B0F1A, #FF0055);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.close-button:hover {
  background: linear-gradient(135deg, #5A0D16, #E6004C);
}

/* Main content layout */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

/* Desktop and up */
@media (min-width: 769px) {
  .main-content {
    gap: 30px;
  }
}


.footer {
  margin-top: 40px;
  font-size: 10px;
  color: #888;
}

/* Mobile-first grid controls */
.grid-controls {
  margin: 15px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.grid-controls label {
  font-weight: bold;
  font-size: 14px;
}

.grid-controls select {
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 120px;
}

/* Tablet and up */
@media (min-width: 481px) {
  .grid-controls {
    flex-direction: row;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;
  }
  
  .grid-controls select {
    font-size: 14px;
    padding: 6px 10px;
  }
}

/* Desktop and up */
@media (min-width: 769px) {
  .grid-controls {
    justify-content: flex-start;
    margin: 30px 0 20px 0;
  }
  
  .grid-controls select {
    padding: 5px 10px;
  }
}

/* Mobile-first palette grid container */
.palette-grid-container {
  margin-top: 20px;
  padding: 15px;
  background: linear-gradient(145deg, #f0f0f0, #ffffff);
  border-radius: 8px;
  box-shadow: 
    0 4px 16px rgba(0,0,0,0.1),
    inset 0 1px 0 rgba(255,255,255,0.8);
  max-width: 100%;
}

/* Tablet and up */
@media (min-width: 481px) {
  .palette-grid-container {
    margin-top: 25px;
    padding: 18px;
    border-radius: 10px;
    max-width: 600px;
  }
}

/* Desktop and up */
@media (min-width: 769px) {
  .palette-grid-container {
    margin-top: 0;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 
      0 8px 32px rgba(0,0,0,0.1),
      inset 0 1px 0 rgba(255,255,255,0.8);
    max-width: 400px;
    flex: 1 1 auto;
    min-width: 300px;
  }
}

.palette-grid {
  display: grid;
  gap: 8px;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 8px;
  box-shadow: inset 0 2px 6px rgba(0,0,0,0.15);
}

:deep(.grid-cell) {
  aspect-ratio: 1;
  border: 2px dashed #ddd;
  border-radius: 6px;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
  min-height: 60px;
}

:deep(.grid-cell.drag-over) {
  border-color: #007bff;
  background: #e7f3ff;
  transform: scale(1.02);
}

:deep(.grid-cell.occupied) {
  border: none;
  background: transparent;
}

:deep(.grid-cell .mini-swatch) {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.1);
  cursor: grab;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

:deep(.grid-cell .mini-swatch:active) {
  cursor: grabbing;
}

:deep(.grid-cell .mini-swatch .mini-color-name) {
  font-size: 8px;
  font-weight: bold;
  color: rgba(0,0,0,0.8);
  text-align: center;
  margin-top: 2px;
  text-shadow: 0 0 3px rgba(255,255,255,0.8);
}

:deep(.grid-cell .mini-swatch.dark-mini-swatch .mini-color-name) {
  color: white;
  text-shadow: 0 0 3px rgba(0,0,0,0.8);
}

/* Mobile-first palette header */
.palette-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

.palette-header h3 {
  font-size: 16px;
  margin: 0;
  text-align: center;
}

.palette-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.palette-button {
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
}

/* Tablet and up */
@media (min-width: 481px) {
  .palette-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .palette-header h3 {
    font-size: 18px;
    text-align: left;
  }
  
  .palette-controls {
    flex-direction: row;
    gap: 10px;
  }
  
  .palette-button {
    padding: 10px 16px;
    font-size: 14px;
  }
}

/* Desktop and up */
@media (min-width: 769px) {
  .palette-button {
    padding: 8px 16px;
  }
}

.clear-button {
  background: linear-gradient(135deg, #6B0F1A, #FF0055);
  color: white;
}

.clear-button:hover {
  background: linear-gradient(135deg, #5A0D16, #E6004C);
}

.random-button {
  background: linear-gradient(135deg, #6A5ACD, #2C2A4A);
  color: white;
}

.random-button:hover {
  background: linear-gradient(135deg, #5A4AB7, #242240);
}

</style>