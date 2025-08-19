<script setup>
import { ref } from 'vue'

const props = defineProps({
  colorName: {
    type: String,
    required: true
  },
  hexCode: {
    type: String,
    required: true
  },
  backgroundColor: {
    type: String,
    required: true
  },
  isDark: {
    type: Boolean,
    default: false
  }
})

const isDragging = ref(false)
let dragData = null

function handleDragStart(e) {
  const swatchBlock = e.target.closest('.swatch-block')
  const colorName = swatchBlock.querySelector('.color-name').textContent
  const hexCode = swatchBlock.querySelector('.hex-code').textContent
  const bgColor = e.target.style.backgroundColor
  
  dragData = {
    colorName,
    hexCode,
    bgColor,
    isDark: props.isDark
  }
  
  e.dataTransfer.setData('application/json', JSON.stringify(dragData))
  e.target.classList.add('dragging')
  isDragging.value = true
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging')
  isDragging.value = false
  dragData = null
}

function handleTouchStart(e) {
  const swatchBlock = e.target.closest('.swatch-block')
  const colorName = swatchBlock.querySelector('.color-name').textContent
  const hexCode = swatchBlock.querySelector('.hex-code').textContent
  const bgColor = e.target.style.backgroundColor
  
  dragData = {
    colorName,
    hexCode,
    bgColor,
    isDark: props.isDark
  }
  
  e.target.classList.add('dragging')
  isDragging.value = true
  
  // Note: Touch drag data is passed via custom event, no global storage needed
}

function handleTouchMove(e) {
  if (!isDragging.value) return
  
  e.preventDefault()
  const touch = e.touches[0]
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

function handleTouchEnd(e) {
  if (!isDragging.value) return
  
  const touch = e.changedTouches[0]
  const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
  const gridCell = elementBelow?.closest('.grid-cell')
  
  if (gridCell && dragData) {
    // Simulate drop event
    const dropEvent = new CustomEvent('touchdrop', {
      detail: {
        dragData,
        targetCell: gridCell
      }
    })
    document.dispatchEvent(dropEvent)
  }
  
  // Clean up
  document.querySelectorAll('.grid-cell').forEach(cell => {
    cell.classList.remove('drag-over')
  })
  
  e.target.classList.remove('dragging')
  isDragging.value = false
  dragData = null
}
</script>

<template>
  <div class="swatch-block">
    <div 
      class="swatch" 
      :style="{ backgroundColor: backgroundColor }"
      draggable="true"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    ></div>
    <div class="color-name">{{ colorName }}</div>
    <div class="hex-code">{{ hexCode }}</div>
  </div>
</template>

<style scoped>
/* Mobile-first design */
.swatch-block {
  width: 60px;
  text-align: center;
}

.swatch {
  width: 60px;
  height: 60px;
  border: 1px solid #ccc;
  margin-bottom: 3px;
  cursor: grab;
  transition: transform 0.2s ease;
}

.swatch:active {
  cursor: grabbing;
}

.swatch.dragging {
  opacity: 0.5;
  transform: rotate(5deg) scale(0.95);
}

.color-name {
  font-size: 9px;
  font-weight: bold;
  line-height: 1.2;
}

.hex-code {
  font-size: 8px;
  color: #555;
  line-height: 1.1;
}

/* Tablet and up */
@media (min-width: 481px) {
  .swatch-block {
    width: 75px;
  }
  
  .swatch {
    width: 75px;
    height: 75px;
    margin-bottom: 4px;
  }
  
  .color-name {
    font-size: 10px;
  }
  
  .hex-code {
    font-size: 9px;
  }
}

/* Desktop and up */
@media (min-width: 769px) {
  .swatch-block {
    width: 100px;
  }
  
  .swatch {
    width: 100px;
    height: 100px;
    margin-bottom: 5px;
  }
  
  .color-name {
    font-size: 12px;
  }
  
  .hex-code {
    font-size: 11px;
  }
}

</style>