<script setup>
import { computed } from 'vue'
import { useDragDrop } from '../../composables/useDragDrop.js'

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
  },
  effect: {
    type: String,
    default: 'matte'
  }
})

// Use drag and drop composable
const { 
  isDragging,
  handleDragStart,
  handleDragEnd,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd
} = useDragDrop()

// Create color data object
const colorData = computed(() => ({
  colorName: props.colorName,
  hexCode: props.hexCode,
  bgColor: props.backgroundColor,
  isDark: props.isDark,
  effect: props.effect
}))

// Handle events with proper data
const onDragStart = (e) => handleDragStart(e, colorData.value, false)
const onDragEnd = (e) => handleDragEnd(e)
const onTouchStart = (e) => handleTouchStart(e, colorData.value, false)
const onTouchMove = (e) => handleTouchMove(e)
const onTouchEnd = (e) => handleTouchEnd(e)
</script>

<template>
  <div class="swatch-block">
    <div 
      class="swatch" 
      :class="`effect-${effect}`"
      :style="{ backgroundColor: backgroundColor }"
      draggable="true"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    ></div>
    <div class="color-name">{{ colorName }}</div>
    <div class="hex-code">{{ hexCode }}</div>
  </div>
</template>

<style scoped>
@import '../../styles/shared.css';

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
  white-space: normal;
  word-wrap: break-word;
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