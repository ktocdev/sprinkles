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
  const baseClass = 'gps-main__button'
  return `${baseClass}--${props.type}`
})
</script>

<template>
  <button :class="buttonClass" :disabled="type === 'disabled'">
    <slot />
  </button>
</template>

<style scoped>
/* Base button styles */
.gps-main__button {
  border-radius: var(--border-radius);
  transition: var(--transition);
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
}

/* Primary button */
.gps-main__button--primary {
  background: var(--color-accent);
  color: var(--color-white);
}
.gps-main__button--primary:hover {
  background: var(--color-accent-hover);
}

/* Secondary button */
.gps-main__button--secondary {
  background: transparent;
  color: var(--color-text);
  border-color: var(--color-border);
}
.gps-main__button--secondary:hover {
  background: var(--color-panel);
  border-color: var(--color-accent);
}

/* Flat button */
.gps-main__button--flat {
  background: transparent;
  color: var(--color-text);
  border: none;
  padding: 0.4em 0.8em;
}
.gps-main__button--flat:hover {
  background: rgba(0, 0, 0, 0.3);
  color: var(--color-text);
}

/* Light theme override for flat button hover */
:global(body.theme-light) .gps-main__button--flat:hover {
  background: rgba(0, 0, 0, 0.05);
}

/* Disabled button */
.gps-main__button--disabled {
  background: var(--color-border);
  color: var(--color-text);
  opacity: 0.5;
  cursor: not-allowed;
}
.gps-main__button--disabled:hover {
  background: var(--color-border);
}

/* Danger button */
.gps-main__button--danger {
  background: var(--color-danger);
  color: var(--color-white);
}
.gps-main__button--danger:hover {
  background: var(--color-danger-hover);
}

/* Warning button */
.gps-main__button--warning {
  background: var(--color-warn);
  color: var(--color-white);
}
.gps-main__button--warning:hover {
  background: var(--color-warn-hover);
}
</style> 