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
  showClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

function handleBackdropClick(event) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="panel">
      <div v-if="isOpen" class="gps-panel" @click="handleBackdropClick" @keydown="handleEscapeKey" tabindex="0">
        <div class="gps-panel__content">
          <div class="gps-panel__header">
            <h3 class="gps-panel__title">{{ title }}</h3>
            <button v-if="showClose" class="gps-panel__close" @click="emit('close')" aria-label="Close panel">
              ×
            </button>
          </div>
          <div class="gps-panel__body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.gps-panel {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.gps-panel__content {
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  max-width: 90vw;
  max-height: 90vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.gps-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-block-end: 1px solid var(--color-border);
  background: var(--color-panel);
}

.gps-panel__title {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.gps-panel__close {
  background: none;
  border: none;
  font-size: var(--font-size-3xl);
  color: var(--color-text);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gps-panel__close:hover {
  background: var(--color-border);
}

.gps-panel__body {
  padding: 1.5rem;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
}

/* Mobile-first responsive design */
@media (max-width: 768px) {
  .gps-panel {
    padding: 0.5rem;
  }
  
  .gps-panel__content {
    max-width: 95vw;
    max-height: 95vh;
  }
  
  .gps-panel__header {
    padding: 0.75rem 1rem;
  }
  
  .gps-panel__body {
    padding: 1rem;
  }
  
  .gps-panel-content {
    padding: 0 0.5rem 1rem;
  }
}

.gps-panel-content {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 0 1rem 1rem;
  box-sizing: border-box;
}

.gps-panel-section {
  margin-block-end: 3rem;
  padding: 2rem;
  background: var(--color-panel);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-panel-section:last-child {
  margin-block-end: 0;
}

.gps-panel-section-title {
  font-size: var(--font-size-3xl);
  color: var(--color-accent);
  margin-block-end: 0.5rem;
  font-family: var(--font-family-header);
}

.gps-panel-controls {
  display: flex;
  gap: 1rem;
  margin-block-end: 2rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .gps-panel-content {
    padding: 1rem;
  }
  
  .gps-panel-section {
    padding: 1.5rem;
    margin-block-end: 2rem;
  }
  
  .gps-panel-controls {
    flex-direction: column;
  }
}

/* Animation transitions */
.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.3s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}

.panel-enter-active .gps-panel__content,
.panel-leave-active .gps-panel__content {
  transition: transform 0.3s ease;
}

.panel-enter-from .gps-panel__content,
.panel-leave-to .gps-panel__content {
  transform: scale(0.9);
}
</style> 