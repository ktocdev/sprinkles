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
/* ===== PANEL CORE STRUCTURE ===== */

.gps-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 0.5rem;
}

.gps-panel__content {
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  max-width: 95vw;
  max-height: 95vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  margin: auto;
}

/* ===== PANEL HEADER ===== */

.gps-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-block-end: 1px solid var(--color-border);
  background: var(--color-panel);
}

.gps-panel__title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.gps-panel__close {
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
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

/* ===== PANEL BODY ===== */

.gps-panel__body {
  padding: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
}

/* ===== PANEL CONTENT UTILITIES ===== */

.gps-panel-content {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

/* ===== PANEL SECTIONS ===== */

.gps-panel-section {
  margin-block-end: 2rem;
  padding: 1.5rem;
  background: var(--color-panel);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-panel-section:last-child {
  margin-block-end: 0;
}

.gps-panel-section-title {
  font-size: var(--font-size-2xl);
  color: var(--color-accent);
  margin-block-end: 0.5rem;
  font-family: var(--font-family-header);
  font-weight: var(--font-weight-semibold);
}

/* ===== PANEL CONTROLS ===== */

.gps-panel-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-block-end: 2rem;
}

/* ===== PANEL ACTIONS ===== */

.gps-panel-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.gps-panel-action-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.gps-panel-action-button {
  width: max-content;
  justify-content: center;
}

.gps-panel-action-description {
  color: var(--color-text);
  opacity: 0.7;
  font-size: var(--font-size-xs);
  text-align: center;
  line-height: 1.4;
  max-width: 250px;
  margin: 0;
}

/* ===== RESPONSIVE DESIGN (MOBILE-FIRST) ===== */

@media (min-width: 768px) {
  /* Panel core */
  .gps-panel {
    padding: 1rem;
  }
  
  .gps-panel__content {
    max-width: 90vw;
    max-height: 90vh;
  }
  
  /* Panel header */
  .gps-panel__header {
    padding: 1rem 1.5rem;
  }
  
  .gps-panel__title {
    font-size: var(--font-size-2xl);
  }
  
  .gps-panel__close {
    font-size: var(--font-size-3xl);
  }
  
  /* Panel body */
  .gps-panel__body {
    padding: 1.5rem;
  }
  
  /* Panel content */
  .gps-panel-content {
    padding: 0 1rem 1rem;
  }
  
  /* Panel sections */
  .gps-panel-section {
    padding: 2rem;
    margin-block-end: 3rem;
  }
  
  .gps-panel-section-title {
    font-size: var(--font-size-3xl);
  }
  
  /* Panel controls */
  .gps-panel-controls {
    flex-direction: row;
    gap: 1rem;
  }
  
  /* Panel actions */
  .gps-panel-actions {
    gap: 1.25rem;
  }
  
  .gps-panel-action-button {
    width: max-content;
  }
  
  .gps-panel-action-description {
    max-width: 300px;
  }
}

/* ===== ANIMATIONS ===== */

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