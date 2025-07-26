<template>
  <div class="gps-specimen gps-panel-content">
    <div class="gps-specimen__header">
      <div class="gps-specimen__header-content">
        <div class="gps-specimen__header-top">
          <Button 
            type="flat" 
            @click="handleBackClick"
            class="gps-specimen__back-button"
          >
            ← Back to Specimens
          </Button>
          <ThemeToggle class="gps-specimen__theme-toggle" />
        </div>
        <h2 class="gps-specimen__title">{{ title }}</h2>
        <p class="gps-specimen__desc">{{ description }}</p>
      </div>
    </div>

    <!-- Default slot for specimen content -->
    <slot />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import Button from '../shared/Button.vue'
import ThemeToggle from '../shared/ThemeToggle.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['backToLanding'])

function handleBackClick() {
  emit('backToLanding')
}
</script>

<style>
/* Header top row with back button and theme toggle */
.gps-specimen__header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block-end: 1.5rem;
}

.gps-specimen__back-button {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  opacity: 0.8;
  transition: var(--transition);
}

.gps-specimen__back-button:hover {
  opacity: 1;
  color: var(--color-accent);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .gps-specimen__header-top {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style> 