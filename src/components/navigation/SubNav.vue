<template>
  <div class="gps-subnav gps-scrollbar" v-if="isOpen">
    <div class="gps-subnav__container">
      <div class="gps-subnav__header">
        <h3 class="gps-subnav__title">{{ title }}</h3>
        <button 
          class="gps-subnav__close"
          @click="$emit('close')"
          title="Close"
        >
          ✕
        </button>
      </div>
      
      <div class="gps-subnav__content" :class="{ 'gps-subnav__grid': useGrid }">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  useGrid: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

// Note: Scroll prevention removed to allow body scrolling when subnav is open
</script>

<style>
@import '../../styles/scrollbar.css';

.gps-subnav {
  position: absolute;
  top: 3rem;
  left: 100%;
  width: 160px;
  max-height: calc(100vh - 5rem);
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow-medium);
  z-index: 300;
  animation: gps-subnav-slide-in 0.2s ease-out;
  overflow-y: auto;
  overflow-x: hidden;
  margin-inline-start: 0.5rem;
}

@keyframes gps-subnav-slide-in {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.gps-subnav__container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: .75rem;
  box-sizing: border-box;
}

.gps-subnav__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block-end: 1rem;
  padding-block-end: 0.5rem;
  border-block-end: 1px solid var(--color-border);
}

.gps-subnav__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
  margin: 0;
}

.gps-subnav__close {
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  font-size: var(--font-size-xl);
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.gps-subnav__close:hover {
  background: var(--color-accent);
  color: var(--color-white);
}

/* ===== SHARED SUBNAV CONTENT STYLES ===== */

.gps-subnav__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-inline-end: 0.5rem;
  min-height: 0;
}

/* ===== SHARED GRID LAYOUT ===== */

.gps-subnav__grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* ===== RESPONSIVE DESIGN ===== */

@media (min-width: 768px) {
  .gps-subnav {
    width: 200px;
    overflow: hidden;
    overflow-y: auto;
  }
  
  .gps-subnav__grid {
    gap: 0.5rem;
  }
}
</style> 