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
    const formattedNeeds = needsQueueStore.queue
      .map(need => {
        const value = Math.round(need.currentValue) // Use actual current value
        
        // Determine status based on current value using needs store logic
        let status = 'normal'
        if (value >= 90) status = 'fulfilled'
        else if (value >= 70) status = 'normal'
        else if (value >= 50) status = 'urgent'
        else status = 'critical'
        
        // Get the need store to access color configuration
        const needStore = needsQueueStore.getNeedStore(need.storeName)
        let colors = null
        if (needStore && needStore.colors) {
          colors = needStore.colors
        }
        
        return {
          message: `${formatNeedName(need.name)}: ${value}/100`,
          urgency: need.urgency,
          value: value,
          status: status,
          needName: need.name,
          colors: colors
        }
      })

    // Separate wellness from other needs
    const wellnessNeed = formattedNeeds.find(need => need.needName === 'wellness')
    const otherNeeds = formattedNeeds.filter(need => need.needName !== 'wellness')
    
    // Put wellness first, then other needs, limit total to 5
    const sortedNeeds = []
    if (wellnessNeed) {
      sortedNeeds.push(wellnessNeed)
    }
    sortedNeeds.push(...otherNeeds)
    
    return sortedNeeds.slice(0, 5) // Limit to top 5 needs
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