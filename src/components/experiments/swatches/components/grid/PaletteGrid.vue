<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'
import GridCell from './GridCell.vue'
import PaletteControls from '../shared/PaletteControls.vue'
import { usePaletteGrid } from '../../composables/usePaletteGrid.js'
import { useEventCleanup } from '../../composables/useEventCleanup.js'

const props = defineProps({
  colors: {
    type: Array,
    required: true
  },
  initialGridSize: {
    type: Number,
    default: 4
  },
  gridSize: {
    type: Number,
    default: 4
  }
})

const emit = defineEmits(['grid-size-change'])

// Use palette grid composable
const {
  gridSize,
  gridColumns,
  changeGridSize,
  setCellData,
  getCellData,
  removeCellData,
  clearGrid,
  findSourceCellIndex,
  swapOrMoveColors,
  generateRandomPalette
} = usePaletteGrid(computed(() => props.colors))

// Set initial grid size
gridSize.value = props.initialGridSize

// Watch for external grid size changes
watch(() => props.gridSize, (newSize) => {
  if (newSize !== gridSize.value) {
    changeGridSize(newSize)
  }
})

// Event cleanup composable
const { addEventListener } = useEventCleanup()

// Handle grid cell drops
const handleCellDrop = ({ index, colorData, isFromGrid }) => {
  if (isFromGrid) {
    // Handle grid-to-grid movement (swap or move)
    const sourceIndex = findSourceCellIndex(colorData.bgColor, index)
    swapOrMoveColors(colorData, index, sourceIndex)
  } else {
    // Handle swatch-to-grid (regular drop from swatch)
    setCellData(index, colorData)
  }
}

// Handle cell clearing
const handleCellClear = (index) => {
  removeCellData(index)
}

// Handle grid size change
const handleGridSizeChange = (newSize) => {
  changeGridSize(newSize)
  emit('grid-size-change', newSize)
}

// Handle palette controls
const handleClear = () => {
  clearGrid()
}

const handleRandomize = () => {
  generateRandomPalette()
}

// Handle touch drop events
const handleTouchDrop = (e) => {
  const { dragData, targetCell, isFromGrid } = e.detail
  const targetIndex = parseInt(targetCell.dataset.index)
  
  handleCellDrop({
    index: targetIndex,
    colorData: dragData,
    isFromGrid
  })
}

// Setup global touch drop listener
onMounted(() => {
  addEventListener(document, 'touchdrop', handleTouchDrop)
})

// Generate grid cells array
const gridCells = computed(() => {
  const cells = []
  const totalCells = gridSize.value * gridSize.value
  
  for (let i = 0; i < totalCells; i++) {
    cells.push({
      index: i,
      colorData: getCellData(i)
    })
  }
  
  return cells
})
</script>

<template>
  <div class="palette-grid-container">
    <PaletteControls 
      @clear="handleClear"
      @randomize="handleRandomize"
    />
    
    <div 
      class="palette-grid"
      :style="{ gridTemplateColumns: gridColumns }"
    >
      <GridCell
        v-for="cell in gridCells"
        :key="`cell-${cell.index}`"
        :index="cell.index"
        :color-data="cell.colorData"
        @drop="handleCellDrop"
        @clear-cell="handleCellClear"
      />
    </div>
  </div>
</template>

<style scoped>
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

.palette-grid {
  display: grid;
  gap: 8px;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 8px;
  box-shadow: inset 0 2px 6px rgba(0,0,0,0.15);
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
</style>