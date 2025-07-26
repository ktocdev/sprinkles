<template>
  <div 
    class="gps-form-group"
    :class="{
      'gps-form-group--inline': inline,
      'gps-form-group--required': required
    }"
  >
    <label v-if="label" :for="id" class="gps-form-group__label">
      {{ label }}
      <span v-if="required" class="gps-form-group__required">*</span>
    </label>
    
    <div class="gps-form-group__content">
      <slot />
    </div>
    
    <div v-if="errorMessage" :id="errorId" class="gps-form-group__error">
      {{ errorMessage }}
    </div>
    
    <div v-if="hint" class="gps-form-group__hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  inline: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  }
})

// Generate unique IDs for accessibility
const id = ref(`form-group-${Math.random().toString(36).substr(2, 9)}`)
const errorId = computed(() => `${id.value}-error`)
</script>

<style>
.gps-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-block-end: 1.5rem;
}

.gps-form-group:last-child {
  margin-block-end: 0;
}

.gps-form-group__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.gps-form-group__required {
  color: var(--color-danger);
  font-weight: var(--font-weight-bold);
}

.gps-form-group__content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gps-form-group__error {
  font-size: var(--font-size-sm);
  color: var(--color-danger);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.gps-form-group__error::before {
  content: '⚠️';
  font-size: 0.8em;
}

.gps-form-group__hint {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  opacity: 0.7;
}

/* Inline layout */
.gps-form-group--inline {
  flex-direction: row;
  align-items: flex-start;
  gap: 1rem;
}

.gps-form-group--inline .gps-form-group__label {
  min-width: 120px;
  flex-shrink: 0;
  padding-block-start: 0.75rem; /* Align with input padding */
}

.gps-form-group--inline .gps-form-group__content {
  flex: 1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .gps-form-group--inline {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .gps-form-group--inline .gps-form-group__label {
    min-width: auto;
    padding-block-start: 0;
  }
}
</style> 