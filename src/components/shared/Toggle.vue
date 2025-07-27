<template>
  <button
    type="button"
    class="gps-toggle"
    :class="{
      'gps-toggle--checked': modelValue,
      'gps-toggle--disabled': disabled
    }"
    :disabled="disabled"
    @click="toggle"
    :aria-checked="modelValue"
    :aria-label="ariaLabel"
    role="switch"
  >
    <div class="gps-toggle__track">
      <div class="gps-toggle__thumb"></div>
    </div>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  ariaLabel: {
    type: String,
    default: 'Toggle switch'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

function toggle() {
  if (props.disabled) return
  
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
  emit('change', newValue)
}
</script>

<style>
.gps-toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 12px;
  transition: var(--transition);
  outline: none;
}

.gps-toggle:focus-visible {
  box-shadow: 0 0 0 2px var(--color-accent);
}

.gps-toggle__track {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--color-border);
  border-radius: 12px;
  transition: var(--transition);
  display: flex;
  align-items: center;
  padding: 2px;
}

.gps-toggle--checked .gps-toggle__track {
  background: var(--color-accent);
}

.gps-toggle__thumb {
  width: 20px;
  height: 20px;
  background: var(--color-white);
  border-radius: 50%;
  transition: var(--transition);
  transform: translateX(0);
  box-shadow: var(--box-shadow-light);
}

.gps-toggle--checked .gps-toggle__thumb {
  transform: translateX(20px);
}

.gps-toggle--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.gps-toggle--disabled .gps-toggle__track {
  background: var(--color-border);
}

.gps-toggle--disabled .gps-toggle__thumb {
  background: var(--color-text);
  opacity: 0.3;
}

/* Hover effects */
.gps-toggle:not(.gps-toggle--disabled):hover .gps-toggle__track {
  background: var(--color-accent);
  opacity: 0.8;
}

.gps-toggle:not(.gps-toggle--disabled):hover .gps-toggle__thumb {
  box-shadow: var(--box-shadow);
}

/* Active state */
.gps-toggle:not(.gps-toggle--disabled):active .gps-toggle__thumb {
  transform: scale(0.95);
}

.gps-toggle--checked:not(.gps-toggle--disabled):active .gps-toggle__thumb {
  transform: translateX(20px) scale(0.95);
}
</style> 