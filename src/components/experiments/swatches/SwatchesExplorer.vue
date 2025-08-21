<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

// Components
import ColorCarousel from './components/carousel/ColorCarousel.vue'
import GridControls from './components/grid/GridControls.vue'
import PaletteGrid from './components/grid/PaletteGrid.vue'
import PaletteControls from './components/shared/PaletteControls.vue'

// Composables
import { useColorData } from './composables/useColorData.js'
import { ref } from 'vue'

const router = useRouter()

// Use color data composable
const { palette, allColors } = useColorData()

// Reference to PaletteGrid component
const paletteGridRef = ref(null)

// Track current grid size
const currentGridSize = ref(4)

// Handle navigation
const handleClose = () => {
  document.body.style.overflow = ''
  router.back()
}

// Handle grid size changes
const handleGridSizeChange = (newSize) => {
  currentGridSize.value = newSize
  console.log('Grid size changed to:', newSize)
}

// Handle palette controls
const handleClear = () => {
  paletteGridRef.value?.clearGrid()
}

const handleRandomize = () => {
  paletteGridRef.value?.generateRandomPalette()
}

// Setup and cleanup
onMounted(() => {
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="swatches-explorer page-container typography-base">
    
    <ColorCarousel
      :colors="allColors"
      :palette-name="palette.name"
    />
    
    <div class="main-content main-content-layout">
      <div class="palette-container">
        <PaletteGrid
          ref="paletteGridRef"
          :colors="allColors"
          :initial-grid-size="4"
          :grid-size="currentGridSize"
          @grid-size-change="handleGridSizeChange"
        />
        
        <!-- Palette lid with all controls -->
        <div class="palette-lid">
          <PaletteControls 
            @clear="handleClear"
            @randomize="handleRandomize"
          />
          
          <GridControls
            :grid-size="currentGridSize"
            @size-change="handleGridSizeChange"
          />

          <button @click="handleClose" class="btn-compact btn-gradient-gray">Back to Guinea Pig Simulator</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './styles/shared.css';

/* Component-specific styles */
.swatches-explorer {
  background: 
    radial-gradient(circle at 30% 20%, rgba(188, 179, 222, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(188, 179, 222, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 90%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
    radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.15) 0%, transparent 30%),
    linear-gradient(135deg, #bcb3de 0%, #e8e4f0 50%, #f5f2f8 100%);
}

/* Responsive adjustments */
@media (min-width: 769px) {
  .swatches-explorer {
    padding: 20px;
  }
  
  .main-content {
    padding: 20px;
  }

  .palette-container {
    max-width: max-content;
  }
}
</style>