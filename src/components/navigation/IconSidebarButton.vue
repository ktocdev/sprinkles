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
</style> 