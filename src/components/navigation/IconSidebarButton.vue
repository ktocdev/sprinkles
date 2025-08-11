<template>
  <Button 
    type="flat"
    size="compact"
    :class="buttonClasses"
    @click="$emit('click')"
    :title="title"
  >
    <slot />
  </Button>
</template>

<script setup>
import { computed } from 'vue'
import Button from '../shared/Button.vue'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => ({
  'gps-icon-sidebar-button': true,
  'gps-icon-sidebar-button--active': props.active
}))
</script>

<style>
.gps-button--compact.gps-icon-sidebar-button {
  padding: 0.3rem;
  position: relative;
  background: transparent !important;
  color: var(--color-text) !important;
  border: 1px solid transparent !important;
  transition: var(--transition) !important;

  &:hover {
    background: var(--color-border) !important;
    color: var(--color-text) !important;
  }

  &:focus {
    background: var(--color-border) !important;
    color: var(--color-text) !important;
    box-shadow: var(--box-shadow-focus) !important;
    outline: none !important;
  }

  &.gps-icon-sidebar-button--active {
    background: var(--color-accent) !important;
    color: var(--color-white) !important;
    border-color: var(--color-accent) !important;

    &:hover {
      background: var(--color-accent-hover) !important;
      color: var(--color-white) !important;
    }
  }



  /* Tooltip styles */
  &::before {
    content: attr(title);
    position: absolute;
    inset-inline-start: 40px;
    inset-block-start: 50%;
    transform: translateY(-50%);
    background: var(--color-panel);
    color: var(--color-text);
    padding: 0.5rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border);
    font-size: 0.8em;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    z-index: 1000;
    box-shadow: var(--box-shadow-light);
  }

  &:hover::before {
    opacity: 1;
  }
}

/* Tablet and above styles - larger, playful buttons */
@media (min-width: 768px) {
  .gps-button--compact.gps-icon-sidebar-button {
    padding: 0.75rem;
    font-size: var(--font-size-2xl);
    border-radius: 12px !important;
    transform: scale(1) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;

    &:hover {
      transform: scale(1.05) translateY(-2px) !important;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
      background: var(--color-border) !important;
    }

    &:active {
      transform: scale(0.98) !important;
      transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    &.gps-icon-sidebar-button--active {
      background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover)) !important;
      box-shadow: 0 4px 16px rgba(var(--color-accent-rgb), 0.3) !important;
      transform: scale(1.02) !important;

      &:hover {
        transform: scale(1.08) translateY(-3px) !important;
        box-shadow: 0 6px 20px rgba(var(--color-accent-rgb), 0.4) !important;
        background: linear-gradient(135deg, var(--color-accent-hover), var(--color-accent)) !important;
      }

      &:active {
        transform: scale(1) !important;
      }
    }

    /* Enhanced tooltip for larger screens */
    &::before {
      inset-inline-start: 50px;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
  }
}
</style> 