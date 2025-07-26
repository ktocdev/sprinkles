<template>
  <div class="gps-input-wrapper">
    <label v-if="label" :for="id" class="gps-input__label">
      {{ label }}
      <span v-if="required" class="gps-input__required">*</span>
    </label>
    
    <div class="gps-input__container">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :minlength="minlength"
        :maxlength="maxlength"
        :pattern="pattern"
        :autocomplete="autocomplete"
        :aria-describedby="errorId"
        class="gps-input"
        :class="{
          'gps-input--error': hasError,
          'gps-input--success': hasSuccess,
          'gps-input--disabled': disabled
        }"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
      />
      
      <div v-if="icon" class="gps-input__icon">
        {{ icon }}
      </div>
    </div>
    
    <div v-if="hasError && errorMessage" :id="errorId" class="gps-input__error">
      {{ errorMessage }}
    </div>
    
    <div v-if="hasSuccess && successMessage" class="gps-input__success">
      {{ successMessage }}
    </div>
    
    <div v-if="hint" class="gps-input__hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => [
      'text', 'email', 'password', 'number', 'tel', 'url', 
      'search', 'date', 'time', 'datetime-local', 'month', 'week'
    ].includes(value)
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  errorMessage: {
    type: String,
    default: ''
  },
  successMessage: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  min: {
    type: [String, Number],
    default: undefined
  },
  max: {
    type: [String, Number],
    default: undefined
  },
  step: {
    type: [String, Number],
    default: undefined
  },
  minlength: {
    type: [String, Number],
    default: undefined
  },
  maxlength: {
    type: [String, Number],
    default: undefined
  },
  pattern: {
    type: String,
    default: ''
  },
  autocomplete: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'keydown'])

// Generate unique IDs for accessibility
const id = ref(`input-${Math.random().toString(36).substr(2, 9)}`)
const errorId = computed(() => `${id.value}-error`)

// Computed properties for styling
const hasError = computed(() => !!props.errorMessage)
const hasSuccess = computed(() => !!props.successMessage)

// Event handlers
function handleInput(event) {
  emit('update:modelValue', event.target.value)
}

function handleBlur(event) {
  emit('blur', event)
}

function handleFocus(event) {
  emit('focus', event)
}

function handleKeydown(event) {
  emit('keydown', event)
}
</script>

<style>
.gps-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.gps-input__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.gps-input__required {
  color: var(--color-danger);
  font-weight: var(--font-weight-bold);
}

.gps-input__container {
  position: relative;
  display: flex;
  align-items: center;
}

.gps-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: var(--font-size-base);
  font-family: inherit;
  transition: var(--transition);
  box-sizing: border-box;
}

.gps-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(var(--color-accent-rgb), 0.1);
}

.gps-input:hover:not(:disabled) {
  border-color: var(--color-accent);
}

.gps-input--error {
  border-color: var(--color-danger);
}

.gps-input--error:focus {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px rgba(var(--color-danger-rgb), 0.1);
}

.gps-input--success {
  border-color: var(--color-success);
}

.gps-input--success:focus {
  border-color: var(--color-success);
  box-shadow: 0 0 0 3px rgba(var(--color-success-rgb), 0.1);
}

.gps-input--disabled {
  background: var(--color-panel);
  color: var(--color-text);
  opacity: 0.6;
  cursor: not-allowed;
}

.gps-input--disabled:hover {
  border-color: var(--color-border);
}

.gps-input__icon {
  position: absolute;
  right: 1rem;
  color: var(--color-text);
  opacity: 0.6;
  pointer-events: none;
  font-size: 1.2em;
}

.gps-input:focus + .gps-input__icon {
  opacity: 1;
  color: var(--color-accent);
}

.gps-input__error {
  font-size: var(--font-size-sm);
  color: var(--color-danger);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.gps-input__error::before {
  content: '⚠️';
  font-size: 0.8em;
}

.gps-input__success {
  font-size: var(--font-size-sm);
  color: var(--color-success);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.gps-input__success::before {
  content: '✅';
  font-size: 0.8em;
}

.gps-input__hint {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  opacity: 0.7;
}

/* Input with icon padding */
.gps-input__container:has(.gps-input__icon) .gps-input {
  padding-inline-end: 3rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .gps-input {
    padding: 0.875rem 1rem;
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
</style> 