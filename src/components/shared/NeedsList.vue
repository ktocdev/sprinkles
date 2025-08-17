<template>
  <div class="gps-needs-list">
    <div class="gps-needs-list__header">
      <h4 class="gps-section-header">Current Needs</h4>
    </div>
    <div class="gps-needs-list__content">
      <ul class="gps-needs-list__list" v-if="items.length > 0">
        <li 
          v-for="(item, index) in formattedItems" 
          :key="index"
          class="gps-needs-list__item"
          :class="{
            'gps-needs-list__item--fulfilled': item.status === 'fulfilled',
            'gps-needs-list__item--normal': item.status === 'normal',
            'gps-needs-list__item--urgent': item.status === 'urgent',
            'gps-needs-list__item--critical': item.status === 'critical'
          }"
        >
          <div class="gps-needs-list__item-content">
            <span class="gps-needs-list__item-text">{{ item.message }}</span>
            <StatusBar 
              v-if="item.value !== null && item.value !== undefined"
              :value="item.value"
              :color="getNeedColor(item)"
              :displayValue="`${item.value}/100`"
              :showLabel="false"
              :class="[
                'gps-needs-list__item-status-bar',
                { 'gps-needs-list__item-status-bar--rainbow': item.needName === 'wellness' && item.colors?.rainbow }
              ]"
            />
            <span 
              v-else-if="showUrgency && item.urgency !== undefined" 
              class="gps-needs-list__item-urgency"
            >
              {{ Math.round(item.urgency) }}%
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import StatusBar from './StatusBar.vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  showUrgency: {
    type: Boolean,
    default: false
  },
})

// Transform items to consistent format
const formattedItems = computed(() => {
  return props.items.map(item => {
    if (typeof item === 'string') {
      return { message: item }
    }
    
    // Extract value from message format like "Hunger: 85/100"
    const value = item.value || extractValueFromMessage(item.message)
    // Use provided status if available, otherwise calculate from value
    const status = item.status || getStatusFromValue(value)
    
    return {
      message: item.message || item.text || String(item),
      urgency: item.urgency,
      value: value,
      status: status,
      needName: item.needName,
      colors: item.colors
    }
  })
})

// Helper function to extract value from message like "Hunger: 85/100"
function extractValueFromMessage(message) {
  if (!message) return null
  const match = message.match(/(\d+)\/100$/)
  return match ? parseInt(match[1]) : null
}

// Helper function to determine status based on value
function getStatusFromValue(value) {
  if (value === null || value === undefined) return 'normal'
  if (value >= 90) return 'fulfilled'
  if (value >= 70) return 'normal'
  if (value >= 50) return 'urgent'
  return 'critical'
}

// Helper function to get color for a specific need
function getNeedColor(item) {
  // If the item has custom colors, use them
  if (item.colors) {
    // Special handling for rainbow (wellness)
    if (item.colors.rainbow && item.needName === 'wellness') {
      // For rainbow, we'll return a gradient string
      if (item.colors.pattern && item.colors.pattern.length > 0) {
        return `linear-gradient(90deg, ${item.colors.pattern.join(', ')})`
      }
    }
    
    // For urgent and critical status, apply overlays to the need's gradient
    if (item.status === 'urgent' || item.status === 'critical') {
      const overlayColor = item.status === 'urgent' ? 'rgba(230, 126, 34, 0.3)' : 'rgba(231, 76, 60, 0.4)'
      
      // Use gradient if available, with status overlay
      if (item.colors.gradient && item.colors.gradient.length >= 2) {
        return `linear-gradient(90deg, ${item.colors.gradient.join(', ')}), linear-gradient(90deg, ${overlayColor}, ${overlayColor})`
      }
      
      // Use primary color with status overlay
      if (item.colors.primary) {
        return `linear-gradient(90deg, ${item.colors.primary}, ${item.colors.primary}), linear-gradient(90deg, ${overlayColor}, ${overlayColor})`
      }
    }
    
    // For normal and fulfilled status, use pure need colors
    if (item.status === 'normal' || item.status === 'fulfilled') {
      // Prioritize gradient to maintain need's color identity
      if (item.colors.gradient && item.colors.gradient.length >= 2) {
        return `linear-gradient(90deg, ${item.colors.gradient.join(', ')})`
      }
      
      // Use status-specific color as fallback
      if (item.colors[item.status]) {
        return item.colors[item.status]
      }
      
      // Use primary color as final fallback
      if (item.colors.primary) {
        return item.colors.primary
      }
    }
  }
  
  // Fallback to default status colors
  return getStatusColor(item.status)
}

// Helper function to get default status colors (fallback)
function getStatusColor(status) {
  switch (status) {
    case 'fulfilled': return 'var(--color-success)'
    case 'normal': return 'var(--color-accent)'
    case 'urgent': return 'var(--color-warning)'
    case 'critical': return 'var(--color-danger)'
    default: return 'var(--color-accent)'
  }
}
</script>

<style>
.gps-needs-list {
  max-width: 640px;
  width: 100%;
}

.gps-needs-list__header {
  margin-bottom: 0.75rem;
}

.gps-needs-list__content {
  background: var(--color-panel);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-needs-list__list {
  list-style: none;
  padding: 1rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gps-needs-list__item {
  padding: 0.5rem 0.75rem;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  transition: var(--transition);
  font-family: var(--font-family-body);
}

.gps-needs-list__item:hover {
  background: var(--color-bg);
  border-color: var(--color-accent);
}

.gps-needs-list__item--fulfilled {
  border-color: var(--color-success);
  background: rgba(39, 174, 96, 0.1);
}

.gps-needs-list__item--normal {
  border-color: var(--color-accent);
  background: rgba(66, 184, 131, 0.05);
}

.gps-needs-list__item--urgent {
  border-color: var(--color-warning);
  background: rgba(230, 126, 34, 0.1);
}

.gps-needs-list__item--critical {
  border-color: var(--color-danger);
  background: rgba(231, 76, 60, 0.1);
}

.gps-needs-list__item-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.gps-needs-list__item-text {
  width: 100%;
  color: var(--color-text);
  flex: 1;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

.gps-needs-list__item-urgency {
  align-self: flex-end;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
  background: var(--color-bg);
  padding: 0.25rem 0.5rem;
  border-radius: calc(var(--border-radius) / 2);
  border: 1px solid var(--color-border);
}

.gps-needs-list__item-status-bar {
  width: 100%;
  margin-top: 0.5rem;
}

.gps-needs-list__item-status-bar--rainbow {
  /* Ensure rainbow gradients display properly */
  background-clip: padding-box;
}

.gps-needs-list__item--fulfilled .gps-needs-list__item-urgency {
  color: var(--color-success);
  border-color: var(--color-success);
}

.gps-needs-list__item--normal .gps-needs-list__item-urgency {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.gps-needs-list__item--urgent .gps-needs-list__item-urgency {
  color: var(--color-warning);
  border-color: var(--color-warning);
}

.gps-needs-list__item--critical .gps-needs-list__item-urgency {
  color: var(--color-danger);
  border-color: var(--color-danger);
}

/* Mobile-first responsive design */
.gps-needs-list__item {
  padding: 0.75rem 1rem;
}

.gps-needs-list__item-content {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.gps-needs-list__item-status-bar {
  flex: 1;
  max-width: 200px;
  margin-top: 0;
}

.gps-needs-list__item-urgency {
  align-self: auto;
  flex-shrink: 0;
  font-size: var(--font-size-sm);
}

@media (min-width: 768px) {
  .gps-needs-list__item {
    padding: 1rem 1.25rem;
  }
  
  .gps-needs-list__item-urgency {
    font-size: var(--font-size-base);
  }

  .gps-needs-list__item-text {
    flex: 1;
    font-size: var(  --font-size-base);
  }
}
</style>
