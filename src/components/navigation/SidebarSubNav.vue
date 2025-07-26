<template>
  <div class="gps-sidebar-subnav" v-if="isVisible">
    <div class="gps-sidebar-subnav__container">
      <div class="gps-sidebar-subnav__header">
        <h3 class="gps-sidebar-subnav__title">{{ title }}</h3>
        <button 
          class="gps-sidebar-subnav__close"
          @click="$emit('close')"
          title="Close"
        >
          ✕
        </button>
      </div>
      
      <div class="gps-sidebar-subnav__buttons">
        <button 
          v-for="button in buttons" 
          :key="button.id"
          class="gps-sidebar-subnav__button"
          :class="button.class"
          @click="handleButtonClick(button)"
          :title="button.title"
        >
          {{ button.icon }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  buttons: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'action'])

function handleButtonClick(button) {
  emit('action', button.action)
}
</script>

<style>
.gps-sidebar-subnav {
  position: fixed;
  left: 70px; /* Position to the right of the sidebar */
  top: 70px; /* Position below the top bar */
  width: 180px;
  height: 180px;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow-medium);
  z-index: 300;
  animation: gps-sidebar-subnav-slide-in 0.2s ease-out;
}

@keyframes gps-sidebar-subnav-slide-in {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.gps-sidebar-subnav__container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

.gps-sidebar-subnav__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block-end: 1rem;
  padding-block-end: 0.5rem;
  border-block-end: 1px solid var(--color-border);
}

.gps-sidebar-subnav__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
  margin: 0;
}

.gps-sidebar-subnav__close {
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

.gps-sidebar-subnav__close:hover {
  background: var(--color-accent);
  color: var(--color-white);
}

.gps-sidebar-subnav__buttons {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  flex: 1;
}

.gps-sidebar-subnav__button {
  width: 100%;
  height: 40px;
  border: none;
  border-radius: var(--border-radius);
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-base);
  position: relative;
}

.gps-sidebar-subnav__button:hover {
  background: var(--color-accent);
  color: var(--color-white);
}

.gps-sidebar-subnav__button--primary:hover {
  background: var(--color-accent);
}

.gps-sidebar-subnav__button--warning:hover {
  background: var(--color-warning);
}

.gps-sidebar-subnav__button--danger:hover {
  background: var(--color-danger);
}

/* Tooltip styles */
.gps-sidebar-subnav__button::before {
  content: attr(title);
  position: absolute;
  left: 50%;
  bottom: -40px;
  transform: translateX(-50%);
  background: var(--color-panel);
  color: var(--color-text);
  padding: 0.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  font-size: var(--font-size-xs);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1000;
  box-shadow: var(--box-shadow-light);
}

.gps-sidebar-subnav__button:hover::before {
  opacity: 1;
}

/* Tablet and up - enhance for larger screens */
@media (min-width: 768px) {
  .gps-sidebar-subnav {
    width: 200px;
    height: 200px;
  }
  
  .gps-sidebar-subnav__buttons {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .gps-sidebar-subnav__button {
    height: 50px;
    font-size: var(--font-size-lg);
  }
}
</style> 