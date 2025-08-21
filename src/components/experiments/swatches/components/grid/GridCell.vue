<script setup>
import { ref, onMounted } from 'vue'
import { useDragDrop } from '../../composables/useDragDrop.js'
import { useEventCleanup } from '../../composables/useEventCleanup.js'

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  colorData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['drop', 'clear-cell'])

const cellRef = ref(null)
const { addEventListener } = useEventCleanup()

// Single instance of drag drop composable
const { 
  handleDragOver, 
  handleDragLeave, 
  handleDrop,
  handleDragStart: handleMiniDragStart, 
  handleDragEnd: handleMiniDragEnd,
  handleTouchStart: handleMiniTouchStart,
  handleTouchMove: handleMiniTouchMove,
  handleTouchEnd: handleMiniTouchEnd
} = useDragDrop()

onMounted(() => {
  if (cellRef.value) {
    // Set up drag and drop listeners
    addEventListener(cellRef.value, 'dragover', handleDragOver)
    addEventListener(cellRef.value, 'dragleave', handleDragLeave)
    addEventListener(cellRef.value, 'drop', (e) => {
      const dropData = handleDrop(e)
      if (dropData) {
        emit('drop', {
          index: props.index,
          colorData: dropData.colorData,
          isFromGrid: dropData.isFromGrid
        })
      }
    })
  }
})

const onMiniSwatchDragStart = (e) => {
  handleMiniDragStart(e, props.colorData, true)
}

const onMiniSwatchDragEnd = (e) => {
  handleMiniDragEnd(e)
  // Check if the swatch was moved and clear cell if needed
  setTimeout(() => {
    if (!cellRef.value?.querySelector('.mini-swatch')) {
      emit('clear-cell', props.index)
    }
  }, 100)
}

const onMiniSwatchTouchStart = (e) => {
  handleMiniTouchStart(e, props.colorData, true)
}

const onMiniSwatchTouchMove = (e) => {
  handleMiniTouchMove(e)
}

const onMiniSwatchTouchEnd = (e) => {
  handleMiniTouchEnd(e)
}
</script>

<template>
  <div 
    ref="cellRef"
    class="grid-cell"
    :class="{ occupied: !!colorData }"
    :data-index="index"
  >
    <div 
      v-if="colorData"
      class="mini-swatch"
      :class="[
        { 'dark-mini-swatch': colorData.isDark },
        `effect-${colorData.effect || 'matte'}`
      ]"
      :style="{ backgroundColor: colorData.bgColor }"
      draggable="true"
      @dragstart="onMiniSwatchDragStart"
      @dragend="onMiniSwatchDragEnd"
      @touchstart="onMiniSwatchTouchStart"
      @touchmove="onMiniSwatchTouchMove"
      @touchend="onMiniSwatchTouchEnd"
    >
      <div class="mini-color-name">{{ colorData.colorName }}</div>
    </div>
  </div>
</template>

<style scoped>
@import '../../styles/shared.css';

.grid-cell {
  aspect-ratio: 1;
  border: none;
  border-radius: 6px;
  background: linear-gradient(145deg, #f0f0f0, #e8e8e8);
  box-shadow: 
    inset 0 1px 2px rgba(0,0,0,0.08),
    inset 0 -1px 2px rgba(255,255,255,0.5),
    inset 1px 0 2px rgba(0,0,0,0.05),
    inset -1px 0 2px rgba(255,255,255,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
  height: 72px;
  width: 72px;
}

.grid-cell.drag-over {
  background: linear-gradient(145deg, #e8f2ff, #dae8ff);
  box-shadow: 
    inset 0 1px 2px rgba(0,123,255,0.12),
    inset 0 -1px 2px rgba(255,255,255,0.6),
    inset 1px 0 2px rgba(0,123,255,0.08),
    inset -1px 0 2px rgba(255,255,255,0.4);
  transform: scale(1.02);
}

.grid-cell.occupied {
  border: none;
  background: transparent;
}

.mini-swatch {
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

.mini-swatch:active {
  cursor: grabbing;
}

.mini-swatch.dragging {
  opacity: 0.5;
  transform: rotate(2deg) scale(0.98);
}

.mini-color-name {
  font-size: 8px;
  font-weight: bold;
  color: rgba(0,0,0,0.8);
  text-align: center;
  margin-top: 2px;
  text-shadow: 0 0 3px rgba(255,255,255,0.8);
  pointer-events: none;
  max-width: 64px;
}

.mini-swatch.dark-mini-swatch .mini-color-name {
  color: white;
  text-shadow: 0 0 3px rgba(0,0,0,0.8);
}
</style>