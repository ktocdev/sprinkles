<template>
  <div v-if="isVisible" class="gps-modal">
    <div class="gps-modal__content">
      <div class="gps-modal__header">
        <h3 class="gps-modal__title">{{ title }}</h3>
        <button 
          class="gps-modal__close"
          @click="$emit('close')"
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>
      
      <div class="gps-modal__body">
        <slot />
      </div>
      
      <div v-if="$slots.actions" class="gps-modal__actions">
        <slot name="actions" />
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
  }
})

const emit = defineEmits(['close'])
</script>

<style>
.gps-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.gps-modal__content {
  background: var(--color-bg);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  box-shadow: var(--box-shadow-medium);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.gps-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-block-end: 1px solid var(--color-border);
  margin-block-end: 1rem;
}

.gps-modal__title {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--color-text);
  font-weight: var(--font-weight-semibold);
}

.gps-modal__close {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: var(--font-size-lg);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.gps-modal__close:hover {
  background: var(--color-accent);
  color: var(--color-white);
}

.gps-modal__body {
  padding: 0 1.5rem 1rem 1.5rem;
}

.gps-modal__actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border-block-start: 1px solid var(--color-border);
  margin-block-start: 1rem;
}

/* Mobile-first responsive adjustments */
@media (max-width: 768px) {
  .gps-modal {
    padding: 0.5rem;
  }
  
  .gps-modal__content {
    max-width: 100%;
    max-height: 95vh;
  }
  
  .gps-modal__header,
  .gps-modal__body,
  .gps-modal__actions {
    padding-inline: 1rem;
  }
  
  .gps-modal__actions {
    flex-direction: column;
  }
}
</style> 