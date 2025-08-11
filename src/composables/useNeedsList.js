import { computed } from 'vue'
import { useNeedsQueueStore } from '../stores/needs/needsQueue'

/**
 * Composable for formatting needs data for NeedsList component
 * Ensures consistent needs display across all components
 */
export function useNeedsList() {
  const needsQueueStore = useNeedsQueueStore()

  // Format needs data for NeedsList component
  const needsItems = computed(() => {
    return needsQueueStore.queue
      .map(need => {
        const value = Math.round(need.currentValue) // Use actual current value
        
        // Determine status based on current value using needs store logic
        let status = 'normal'
        if (value >= 90) status = 'fulfilled'
        else if (value >= 70) status = 'normal'
        else if (value >= 50) status = 'urgent'
        else status = 'critical'
        
        return {
          message: `${formatNeedName(need.name)}: ${value}/100`,
          urgency: need.urgency,
          value: value,
          status: status
        }
      })
      .slice(0, 5) // Limit to top 5 needs (sorted by urgency)
  })

  // Check for urgent/critical items (useful for styling indicators)
  const hasUrgentItems = computed(() => {
    return needsItems.value.some(item => {
      const value = item.value
      return value >= 50 && value < 70 // Urgent range
    })
  })

  const hasCriticalItems = computed(() => {
    return needsItems.value.some(item => {
      const value = item.value
      return value < 50 // Critical range
    })
  })

  return {
    needsItems,
    hasUrgentItems,
    hasCriticalItems
  }
}

// Helper function to format need names consistently
function formatNeedName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}