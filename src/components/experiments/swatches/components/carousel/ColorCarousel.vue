<script setup>
import { computed } from 'vue'
import SwatchBlock from '../swatch/SwatchBlock.vue'
import { useCarousel } from '../../composables/useCarousel.js'

const props = defineProps({
  colors: {
    type: Array,
    required: true
  },
  paletteName: {
    type: String,
    required: true
  }
})

// Use carousel composable
const { 
  currentPage, 
  totalPages, 
  currentPageColors, 
  canGoPrev, 
  canGoNext, 
  goToPrevPage, 
  goToNextPage 
} = useCarousel(computed(() => props.colors))
</script>

<template>
  <div class="color-carousel">
    <div class="carousel-header">
      <h3>{{ paletteName }} Colors</h3>
      <div class="carousel-info">{{ currentPage + 1 }} / {{ totalPages }}</div>
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
</template>

<style scoped>
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
</style>