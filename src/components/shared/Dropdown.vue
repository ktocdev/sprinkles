<template>
  <div class="gps-dropdown" :class="{ 'gps-dropdown--open': isOpen }">
    <button
      ref="triggerRef"
      class="gps-dropdown__trigger"
      :class="triggerClass"
      @click="toggleDropdown"
      @keydown="handleKeydown"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      type="button"
    >
      <span class="gps-dropdown__trigger-text">{{ selectedLabel || placeholder }}</span>
      <span class="gps-dropdown__trigger-icon">▼</span>
    </button>
    
    <Transition name="gps-dropdown">
      <div
        v-if="isOpen"
        ref="menuRef"
        class="gps-dropdown__menu"
        role="listbox"
        :aria-label="ariaLabel"
      >
        <button
          v-for="option in options"
          :key="option.value"
          class="gps-dropdown__option"
          :class="{ 'gps-dropdown__option--selected': option.value === modelValue }"
          @click="selectOption(option)"
          @keydown="handleOptionKeydown"
          role="option"
          :aria-selected="option.value === modelValue"
          type="button"
        >
          {{ option.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  },
  options: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(option => 
        typeof option === 'object' && 
        'value' in option && 
        'label' in option
      )
    }
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  triggerClass: {
    type: String,
    default: ''
  },
  ariaLabel: {
    type: String,
    default: 'Dropdown menu'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const triggerRef = ref(null)
const menuRef = ref(null)

const selectedLabel = computed(() => {
  const selectedOption = props.options.find(option => option.value === props.modelValue)
  return selectedOption ? selectedOption.label : null
})

function toggleDropdown() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

function selectOption(option) {
  emit('update:modelValue', option.value)
  emit('change', option)
  isOpen.value = false
}

function closeDropdown() {
  isOpen.value = false
}

function handleKeydown(event) {
  if (props.disabled) return
  
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      toggleDropdown()
      break
    case 'Escape':
      closeDropdown()
      break
    case 'ArrowDown':
      event.preventDefault()
      if (!isOpen.value) {
        isOpen.value = true
      }
      break
  }
}

function handleOptionKeydown(event) {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      const option = props.options.find(opt => opt.value === props.modelValue)
      if (option) {
        selectOption(option)
      }
      break
    case 'Escape':
      closeDropdown()
      break
  }
}

function handleClickOutside(event) {
  if (triggerRef.value && !triggerRef.value.contains(event.target) &&
      menuRef.value && !menuRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style>
.gps-dropdown {
  position: relative;
  display: inline-block;
}

.gps-dropdown__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  color: var(--color-text);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition);
  min-width: 120px;
}

.gps-dropdown__trigger:hover:not(:disabled) {
  border-color: var(--color-accent);
}

.gps-dropdown__trigger:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.gps-dropdown__trigger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.gps-dropdown__trigger-text {
  flex: 1;
  text-align: start;
}

.gps-dropdown__trigger-icon {
  font-size: var(--font-size-xs);
  transition: transform 0.2s ease;
}

.gps-dropdown--open .gps-dropdown__trigger-icon {
  transform: rotate(180deg);
}

.gps-dropdown__menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-block-start: 0.25rem;
  max-height: 200px;
  overflow-y: auto;
}

.gps-dropdown__option {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: none;
  border: none;
  color: var(--color-text);
  font-size: var(--font-size-base);
  text-align: start;
  cursor: pointer;
  transition: var(--transition);
}

.gps-dropdown__option:hover {
  background: var(--color-accent);
  color: var(--color-white);
}

.gps-dropdown__option--selected {
  background: var(--color-accent);
  color: var(--color-white);
  font-weight: var(--font-weight-semibold);
}

.gps-dropdown__option:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

/* Transition animations */
.gps-dropdown-enter-active,
.gps-dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.gps-dropdown-enter-from,
.gps-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Scrollbar styling */
.gps-dropdown__menu::-webkit-scrollbar {
  width: 6px;
}

.gps-dropdown__menu::-webkit-scrollbar-track {
  background: transparent;
}

.gps-dropdown__menu::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.gps-dropdown__menu::-webkit-scrollbar-thumb:hover {
  background: var(--color-accent);
}
</style> 