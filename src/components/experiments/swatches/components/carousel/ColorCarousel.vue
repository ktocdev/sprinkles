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
    <div class="carousel-container">
      <div class="carousel-left">
        <div class="carousel-info">{{ currentPage + 1 }} / {{ totalPages }}</div>
        <button 
          @click="goToPrevPage" 
          class="carousel-arrow prev-arrow"
          :disabled="!canGoPrev"
          :class="{ disabled: !canGoPrev }"
        >
          ‹
        </button>
      </div>
      
      <div class="carousel-swatches">
        <SwatchBlock 
          v-for="color in currentPageColors" 
          :key="color.id"
          :color-name="color.name" 
          :hex-code="color.hex" 
          :background-color="color.hex"
          :is-dark="color.is_dark"
          :effect="color.effect"
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
/* Color Carousel Styles - Responsive with Container Queries */
.color-carousel {
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(145deg, #e8e4f0, #d6d0e0);
  border-radius: 12px;
  box-shadow: 
    0 4px 16px rgba(0,0,0,0.15),
    inset 0 1px 0 rgba(255,255,255,0.6),
    inset 0 2px 6px rgba(139,129,165,0.2);
  border: 1px solid rgba(139,129,165,0.3);
  border-top: none;
  padding: 15px;
  container-type: inline-size;
}

.carousel-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.carousel-info {
  font-size: 10px;
  color: #666;
  font-weight: 500;
  text-align: center;
  min-width: 40px;
}

.carousel-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: min-content;
  margin: auto;
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
  border-radius: 6px;
  box-shadow: 
    inset 0 2px 0 rgba(0,0,0,0.1),
    inset 0 2px 0 rgba(255,255,255,0.2);
}

.carousel-swatches :deep(.color-name) {
  font-size: 7px;
  line-height: 1;
  text-align: center;
  max-width: 100%;
  white-space: normal;
  word-wrap: break-word;
  min-height: 12px;
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
    padding: 20px;
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
    border-radius: 8px;
  }

  .carousel-swatches :deep(.color-name) {
    font-size: 8px;
    min-height: 14px;
  }

  .carousel-swatches :deep(.hex-code) {
    font-size: 7px;
    height: 10px;
    margin-top: 2px;
  }
}

/* Desktop layout adjustments - container queries handle sizing */
@media (min-width: 769px) {
  .color-carousel {
    padding: 25px;
  }
  
  .carousel-swatches {
    min-height: 120px;
    gap: 10px;
  }

  .carousel-swatches :deep(.swatch) {
    margin-bottom: 4px;
    border-radius: 10px;
  }

  .carousel-swatches :deep(.hex-code) {
    height: 12px;
    margin-top: 2px;
  }
}

/* Container Queries for smooth responsive transitions */
@container (max-width: 320px) {
  .carousel-swatches :deep(.swatch-block) {
    width: 45px;
    height: 75px;
  }
  
  .carousel-swatches :deep(.swatch) {
    width: 45px;
    height: 45px;
    border-radius: 4px;
  }
  
  .carousel-swatches :deep(.color-name) {
    font-size: 6px;
  }
  
  .carousel-swatches :deep(.hex-code) {
    font-size: 5px;
  }
}

@container (min-width: 400px) and (max-width: 540px) {
  .carousel-swatches :deep(.swatch-block) {
    width: 55px;
    height: 85px;
  }
  
  .carousel-swatches :deep(.swatch) {
    width: 55px;
    height: 55px;
    border-radius: 6px;
  }
  
  .carousel-swatches :deep(.color-name) {
    font-size: 7.5px;
    min-height: 13px;
  }
  
  .carousel-swatches :deep(.hex-code) {
    font-size: 6.5px;
  }
}

@container (min-width: 540px) and (max-width: 650px) {
  .carousel-swatches :deep(.swatch-block) {
    width: 65px;
    height: 95px;
  }
  
  .carousel-swatches :deep(.swatch) {
    width: 65px;
    height: 65px;
    border-radius: 7px;
  }
  
  .carousel-swatches :deep(.color-name) {
    font-size: 8.5px;
    min-height: 14px;
  }
  
  .carousel-swatches :deep(.hex-code) {
    font-size: 7.5px;
  }
}

@container (min-width: 650px) and (max-width: 920px) {
  .carousel-swatches :deep(.swatch-block) {
    width: 85px;
    height: 115px;
  }
  
  .carousel-swatches :deep(.swatch) {
    width: 85px;
    height: 85px;
    border-radius: 9px;
  }
  
  .carousel-swatches :deep(.color-name) {
    font-size: 9.5px;
    min-height: 15px;
  }
  
  .carousel-swatches :deep(.hex-code) {
    font-size: 8.5px;
  }
}

@container (min-width: 920px) {
  .carousel-swatches :deep(.swatch-block) {
    width: 90px;
    height: 120px;
  }
  
  .carousel-swatches :deep(.swatch) {
    width: 90px;
    height: 90px;
    border-radius: 10px;
  }
  
  .carousel-swatches :deep(.color-name) {
    font-size: 10px;
    min-height: 16px;
  }
  
  .carousel-swatches :deep(.hex-code) {
    font-size: 8px;
  }
}
</style>