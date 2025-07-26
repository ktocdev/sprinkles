<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'flat', 'disabled', 'warning', 'danger'].includes(value)
  }
})

const buttonClass = computed(() => {
  const baseClass = 'gps-button'
  return `${baseClass}--${props.type}`
})

// Event handlers for disabled state
const handleClick = (event) => {
  if (props.type === 'disabled') {
    event.preventDefault()
    event.stopPropagation()
  }
}

const handleKeydown = (event) => {
  if (props.type === 'disabled') {
    // Prevent Enter and Space key events
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      event.stopPropagation()
    }
  }
}
</script>

<template>
  <button 
    :class="buttonClass" 
    :aria-disabled="type === 'disabled' ? true : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot />
  </button>
</template>

<style>
/* Base button styles */
.gps-button {
  border-radius: var(--border-radius);
  transition: var(--transition);
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  font-family: inherit;
  cursor: pointer;
}

/* Primary button */
.gps-button--primary {
  background: var(--color-accent);
  color: var(--color-white);
}
.gps-button--primary:hover {
  background: var(--color-accent-hover);
}

/* Secondary button */
.gps-button--secondary {
  background: transparent;
  color: var(--color-text);
  border-color: var(--color-border);
}
.gps-button--secondary:hover {
  background: var(--color-panel);
  border-color: var(--color-accent);
}

/* Flat button */
.gps-button--flat {
  background: transparent;
  color: var(--color-text);
  border: none;
  padding: 0.4em 0.8em;
}
.gps-button--flat:hover {
  background: rgba(0, 0, 0, 0.3);
  color: var(--color-text);
}

/* Light theme override for flat button hover */
:global(body.theme-light) .gps-button--flat:hover {
  background: rgba(0, 0, 0, 0.05);
}

/* Disabled button */
.gps-button--disabled {
  background: var(--color-border);
  color: var(--color-text);
  opacity: 0.5;
  cursor: not-allowed;
}
.gps-button--disabled:hover {
  background: var(--color-border);
}

/* Danger button */
.gps-button--danger {
  background: var(--color-danger);
  color: var(--color-white);
}
.gps-button--danger:hover {
  background: var(--color-danger-hover);
}

/* Warning button */
.gps-button--warning {
  background: var(--color-warning);
  color: var(--color-white);
}
.gps-button--warning:hover {
  background: var(--color-warning-hover);
}
</style> 