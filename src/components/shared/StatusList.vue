<template>
  <ul 
    :class="[
      'gps-status-list',
      listClass
    ]" 
    v-if="items.length > 0"
  >
    <li 
      v-for="(item, index) in formattedItems" 
      :key="index"
      :class="[
        'gps-status-list__item',
        itemClass,
        {
          'gps-status-list__item--fulfilled': item.status === 'fulfilled',
          'gps-status-list__item--normal': item.status === 'normal',
          'gps-status-list__item--urgent': item.status === 'urgent',
          'gps-status-list__item--critical': item.status === 'critical'
        }
      ]"
    >
      <div class="gps-status-list__item-content">
        <span class="gps-status-list__item-text">{{ item.text }}</span>
        <StatusBar 
          v-if="showStatusBars && item.value !== null && item.value !== undefined"
          :value="item.value"
          :color="getItemColor(item)"
          :displayValue="`${item.value}/100`"
          :showLabel="false"
          :class="[
            'gps-status-list__item-status-bar',
            { 'gps-status-list__item-status-bar--rainbow': item.needName === 'wellness' && item.colors?.rainbow }
          ]"
        />
        <span 
          v-else-if="showBadges && item.badge !== undefined" 
          :class="[
            'gps-status-list__item-badge',
            item.badgeClass
          ]"
        >
          {{ item.badge }}
        </span>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import StatusBar from './StatusBar.vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  showStatusBars: {
    type: Boolean,
    default: true
  },
  showBadges: {
    type: Boolean,
    default: false
  },
  itemClass: {
    type: String,
    default: ''
  },
  listClass: {
    type: String,
    default: ''
  }
})

// Transform items to consistent format
const formattedItems = computed(() => {
  return props.items.map(item => {
    if (typeof item === 'string') {
      return { text: item, status: 'normal' }
    }
    
    // Extract value from message format like "Hunger: 85/100" if not provided
    const value = item.value !== undefined ? item.value : extractValueFromText(item.text || item.message)
    // Use provided status if available, otherwise calculate from value
    const status = item.status || getStatusFromValue(value)
    
    return {
      text: item.text || item.message || String(item),
      value: value,
      status: status,
      needName: item.needName,
      colors: item.colors,
      badge: item.badge || (props.showBadges && item.urgency !== undefined ? `${Math.round(item.urgency)}%` : undefined),
      badgeClass: item.badgeClass
    }
  })
})

// Helper function to extract value from text like "Hunger: 85/100"
function extractValueFromText(text) {
  if (!text) return null
  const match = text.match(/(\d+)\/100$/)
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

// Helper function to get color for a specific item
function getItemColor(item) {
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
.gps-status-list {
  list-style: none;
  padding: 1rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gps-status-list__item {
  padding: 0.5rem 0.75rem;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  transition: var(--transition);
  font-family: var(--font-family-body);
}

.gps-status-list__item:hover {
  background: var(--color-bg);
  border-color: var(--color-accent);
}

.gps-status-list__item--fulfilled {
  border-color: var(--color-success);
  background: rgba(39, 174, 96, 0.1);
}

.gps-status-list__item--normal {
  border-color: var(--color-accent);
  background: rgba(66, 184, 131, 0.05);
}

.gps-status-list__item--urgent {
  border-color: var(--color-warning);
  background: rgba(230, 126, 34, 0.1);
}

.gps-status-list__item--critical {
  border-color: var(--color-danger);
  background: rgba(231, 76, 60, 0.1);
}

.gps-status-list__item-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.gps-status-list__item-text {
  width: 100%;
  color: var(--color-text);
  flex: 1;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

.gps-status-list__item-badge {
  align-self: flex-end;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
  background: var(--color-bg);
  padding: 0.25rem 0.5rem;
  border-radius: calc(var(--border-radius) / 2);
  border: 1px solid var(--color-border);
}

.gps-status-list__item-status-bar {
  width: 100%;
  margin-top: 0.5rem;
}

.gps-status-list__item-status-bar--rainbow {
  /* Ensure rainbow gradients display properly */
  background-clip: padding-box;
}

/* Status-specific badge colors */
.gps-status-list__item--fulfilled .gps-status-list__item-badge {
  color: var(--color-success);
  border-color: var(--color-success);
}

.gps-status-list__item--normal .gps-status-list__item-badge {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.gps-status-list__item--urgent .gps-status-list__item-badge {
  color: var(--color-warning);
  border-color: var(--color-warning);
}

.gps-status-list__item--critical .gps-status-list__item-badge {
  color: var(--color-danger);
  border-color: var(--color-danger);
}

/* Mobile-first responsive design */
.gps-status-list__item {
  padding: 0.75rem 1rem;
}

.gps-status-list__item-content {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.gps-status-list__item-status-bar {
  flex: 1;
  max-width: 200px;
  margin-top: 0;
}

.gps-status-list__item-badge {
  align-self: auto;
  flex-shrink: 0;
  font-size: var(--font-size-sm);
}

@media (min-width: 768px) {
  .gps-status-list__item {
    padding: 1rem 1.25rem;
  }
  
  .gps-status-list__item-badge {
    font-size: var(--font-size-base);
  }

  .gps-status-list__item-text {
    flex: 1;
    font-size: var(--font-size-base);
  }
}
</style>