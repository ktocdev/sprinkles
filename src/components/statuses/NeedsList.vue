<template>
  <div class="gps-needs-list">
    <div class="gps-needs-list__content">
      <div class="gps-needs-list__header">
        <h4 class="gps-section-header">Current Needs</h4>
      </div>
      <StatusList
        :items="formattedItems"
        :showStatusBars="true"
        :showBadges="showUrgency"
        itemClass="gps-needs-list__item"
        listClass="gps-needs-list__list"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import StatusList from '../shared/StatusList.vue'

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

// Transform items to format expected by StatusList
const formattedItems = computed(() => {
  return props.items.map(item => {
    if (typeof item === 'string') {
      return { text: item }
    }
    
    // Extract value from message format like "Hunger: 85/100"
    const value = item.value || extractValueFromMessage(item.message)
    // Use provided status if available, otherwise calculate from value
    const status = item.status || getStatusFromValue(value)
    
    return {
      text: item.message || item.text || String(item),
      urgency: item.urgency,
      value: value,
      status: status,
      needName: item.needName,
      colors: item.colors,
      // For urgency badges, StatusList will handle the formatting
      badge: props.showUrgency && item.urgency !== undefined ? `${Math.round(item.urgency)}%` : undefined
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

// Color logic is now handled by StatusList component
</script>

<style>
.gps-needs-list {
  max-width: 640px;
  width: 100%;
}

.gps-needs-list__header {
  padding: 1rem 1rem 0;
}

.gps-needs-list__header .gps-section-header {
  margin-block-end: 0;
}

.gps-needs-list__content {
  background: var(--color-panel);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

/* StatusList styling is handled by the StatusList component */
/* These styles override the default StatusList styles for NeedsList-specific appearance */

/* Keep existing item and list styling by using the same class names that StatusList uses */
.gps-needs-list .gps-status-list__item {
  /* Any NeedsList-specific item overrides can go here if needed */
}

.gps-needs-list .gps-status-list__item-text {
  /* Any NeedsList-specific text styling can go here if needed */
}

.gps-needs-list .gps-status-list__item-status-bar {
  /* Any NeedsList-specific status bar styling can go here if needed */
}

.gps-needs-list .gps-status-list__item-badge {
  /* Any NeedsList-specific badge styling can go here if needed */
}
</style>
