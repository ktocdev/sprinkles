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
  primary: {
    type: Boolean,
    default: false
  },
  danger: {
    type: Boolean,
    default: false
  },
  warning: {
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
  'gps-icon-sidebar-button--active': props.active,
  'gps-icon-sidebar-button--primary': props.primary,
  'gps-icon-sidebar-button--danger': props.danger,
  'gps-icon-sidebar-button--warning': props.warning
}))
</script>

<style>
/* Custom button styles for sidebar buttons */
.gps-icon-sidebar-button {
  background: transparent !important;
  color: var(--color-text) !important;
  border: 1px solid transparent !important;
  transition: var(--transition) !important;
}

.gps-icon-sidebar-button:hover {
  background: var(--color-border) !important;
  color: var(--color-text) !important;
}

.gps-icon-sidebar-button:focus {
  background: var(--color-border) !important;
  color: var(--color-text) !important;
  box-shadow: var(--box-shadow-focus) !important;
  outline: none !important;
}

.gps-icon-sidebar-button--active {
  background: var(--color-accent) !important;
  color: var(--color-white) !important;
  border-color: var(--color-accent) !important;
}

.gps-icon-sidebar-button--active:hover {
  background: var(--color-accent-hover) !important;
  color: var(--color-white) !important;
}

.gps-icon-sidebar-button--primary {
  background: var(--color-accent) !important;
  color: var(--color-white) !important;
  border-color: var(--color-accent) !important;
}

.gps-icon-sidebar-button--primary:hover {
  background: var(--color-accent-hover) !important;
  color: var(--color-white) !important;
}

.gps-icon-sidebar-button--danger:hover {
  background: var(--color-danger) !important;
  color: var(--color-white) !important;
}

.gps-icon-sidebar-button--warning:hover {
  background: var(--color-warning) !important;
  color: var(--color-white) !important;
}

/* Tooltip styles */
.gps-icon-sidebar-button::before {
  content: attr(title);
  position: absolute;
  left: 50px;
  top: 50%;
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

.gps-icon-sidebar-button:hover::before {
  opacity: 1;
}
</style> 