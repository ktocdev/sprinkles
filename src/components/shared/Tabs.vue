<template>
  <div 
    :class="[
      'gps-tabs',
      `gps-tabs--${variant}`
    ]"
  >
    <!-- Tab headers -->
    <div class="gps-tabs__header" role="tablist">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.id || tab.label"
        :class="[
          'gps-tabs__tab',
          { 'gps-tabs__tab--active': activeTabIndex === index }
        ]"
        :aria-selected="activeTabIndex === index"
        :tabindex="activeTabIndex === index ? 0 : -1"
        role="tab"
        @click="setActiveTab(index)"
        @keydown="handleTabKeydown($event, index)"
      >
        <span v-if="tab.icon" class="gps-tabs__tab-icon">{{ tab.icon }}</span>
        <span class="gps-tabs__tab-label">{{ tab.label }}</span>
        <span v-if="tab.badge" class="gps-tabs__tab-badge">{{ tab.badge }}</span>
      </button>
    </div>

    <!-- Tab content -->
    <div class="gps-tabs__content">
      <div
        v-for="(tab, index) in tabs"
        :key="tab.id || tab.label"
        v-show="activeTabIndex === index"
        :class="[
          'gps-tabs__panel',
          { 'gps-tabs__panel--active': activeTabIndex === index }
        ]"
        role="tabpanel"
        :aria-labelledby="`tab-${index}`"
      >
        <slot :name="tab.id || tab.label.toLowerCase()" :tab="tab" :index="index">
          <div v-if="tab.content" v-html="tab.content"></div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: (tabs) => tabs.every(tab => tab.label)
  },
  modelValue: {
    type: [String, Number],
    default: 0
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'compact', 'rounded'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'tabChange'])

const activeTabIndex = ref(0)

// Convert modelValue to index
const getTabIndex = (value) => {
  if (typeof value === 'number') return value
  return props.tabs.findIndex(tab => tab.id === value || tab.label === value)
}

// Initialize active tab
onMounted(() => {
  const initialIndex = getTabIndex(props.modelValue)
  if (initialIndex >= 0 && initialIndex < props.tabs.length) {
    activeTabIndex.value = initialIndex
  }
})

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  const newIndex = getTabIndex(newValue)
  if (newIndex >= 0 && newIndex < props.tabs.length && newIndex !== activeTabIndex.value) {
    activeTabIndex.value = newIndex
  }
})

// Set active tab
const setActiveTab = (index) => {
  if (index >= 0 && index < props.tabs.length && index !== activeTabIndex.value) {
    activeTabIndex.value = index
    const tab = props.tabs[index]
    emit('update:modelValue', tab.id || index)
    emit('tabChange', { tab, index })
  }
}

// Keyboard navigation
const handleTabKeydown = (event, index) => {
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      const prevIndex = index > 0 ? index - 1 : props.tabs.length - 1
      setActiveTab(prevIndex)
      break
    case 'ArrowRight':
      event.preventDefault()
      const nextIndex = index < props.tabs.length - 1 ? index + 1 : 0
      setActiveTab(nextIndex)
      break
    case 'Home':
      event.preventDefault()
      setActiveTab(0)
      break
    case 'End':
      event.preventDefault()
      setActiveTab(props.tabs.length - 1)
      break
  }
}
</script>

<style>
.gps-tabs {
  width: 100%;
}

.gps-tabs__header {
  display: flex;
  border-bottom: 2px solid var(--color-border);
  margin-bottom: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.gps-tabs__header::-webkit-scrollbar {
  display: none;
}

.gps-tabs__tab {
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text);
  opacity: 0.7;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  position: relative;
  min-height: 44px; /* Touch-friendly minimum */
}

.gps-tabs__tab:hover {
  opacity: 0.9;
  background: var(--color-panel);
  border-radius: 4px 4px 0 0;
  border-bottom-color: transparent; /* Ensure border stays transparent on hover */
}

.gps-tabs__tab:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--color-accent);
  border-bottom-color: transparent; /* Keep border transparent on focus */
}

.gps-tabs__tab--active {
  opacity: 1;
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
  background: var(--color-panel);
  border-radius: 4px 4px 0 0;
  font-weight: var(--font-weight-semibold);
}

.gps-tabs__tab--active:focus {
  box-shadow: none; /* Remove focus outline on active tab */
}

.gps-tabs__tab-icon {
  font-size: 1em;
}

.gps-tabs__tab-label {
  font-size: var(--font-size-sm);
}

.gps-tabs__tab-badge {
  background: var(--color-accent);
  color: var(--color-white);
  border-radius: 12px;
  padding: 0.2rem 0.5rem;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  min-width: 1.2rem;
  text-align: center;
}

.gps-tabs__content {
  width: 100%;
}

.gps-tabs__panel {
  width: 100%;
}

.gps-tabs__panel--active {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Compact variant */
.gps-tabs--compact .gps-tabs__tab {
  padding: 0.5rem 0.75rem;
  font-size: var(--font-size-xs);
}

/* Rounded variant */
.gps-tabs--rounded .gps-tabs__header {
  border-bottom: none;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.gps-tabs--rounded .gps-tabs__tab {
  border-radius: calc(var(--border-radius) * 2);
  border: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 0;
  background: var(--color-panel);
}

.gps-tabs--rounded .gps-tabs__tab:hover {
  background: var(--color-bg);
  border-color: var(--color-accent);
}

.gps-tabs--rounded .gps-tabs__tab--active {
  background: var(--color-accent);
  color: var(--color-white);
  border-color: var(--color-accent);
  box-shadow: var(--box-shadow-medium);
}

.gps-tabs--rounded .gps-tabs__tab:focus {
  border-radius: calc(var(--border-radius) * 2);
}

/* Responsive design */
@media (max-width: 768px) {
  .gps-tabs__tab {
    padding: 0.5rem 0.75rem;
    font-size: var(--font-size-xs);
  }
  
  .gps-tabs__tab-label {
    font-size: var(--font-size-xs);
  }
}

@media (max-width: 480px) {
  .gps-tabs__header {
    padding: 0 0.5rem;
    margin: 0 -0.5rem 1rem -0.5rem;
  }
  
  .gps-tabs__tab {
    padding: 0.5rem;
    min-width: fit-content;
  }
}
</style>