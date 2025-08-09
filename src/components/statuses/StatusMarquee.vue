<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useGuineaPigStore } from '../../stores/guineaPig'
import { useCageStore } from '../../stores/cage'
import { useMarketStore } from '../../stores/market'
import { usePoopStore } from '../../stores/poop'
import { useStatusStore } from '../../stores/status'

const guineaPigStore = useGuineaPigStore()
const cageStore = useCageStore()
const marketStore = useMarketStore()
const poopStore = usePoopStore()
const statusStore = useStatusStore()

const shouldBounce = ref(false)
const poopMessage = ref(null)
const poopMessageTimer = ref(null)

// Helper function to format item names
const formatItemName = (itemName) => {
  return itemName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Get the item at the guinea pig's current position
const currentItem = computed(() => {
  const { x, y } = cageStore.guineaPigPos
  return cageStore.items.find(item => item.x === x && item.y === y)
})

// Check if guinea pig is on poop
const isOnPoop = computed(() => {
  const { x, y } = cageStore.guineaPigPos
  return poopStore.isPoopAtPosition(x, y)
})

// Check if guinea pig is on fresh poop (just created)
const isOnFreshPoop = computed(() => {
  const { x, y } = cageStore.guineaPigPos
  const poopAtPosition = poopStore.getPoopAtPosition(x, y)
  
  if (!poopAtPosition) return false
  
  const poopAge = Date.now() - poopAtPosition.timestamp
  return poopAge < 2000 // 2 seconds
})

// Priority-based status text computation
const statusText = computed(() => {
  // Check for temporary poop message first (highest priority)
  if (poopMessage.value) {
    return poopMessage.value
  }
  
  // Check if guinea pig is on fresh poop (highest priority)
  if (isOnFreshPoop.value) {
    return 'The guinea pig just made a poop!'
  }
  
  // Check if guinea pig is on an item (medium priority)
  if (currentItem.value) {
    const itemData = marketStore.getItemData(currentItem.value.name)
    if (itemData && itemData.actionWord) {
      const itemName = formatItemName(currentItem.value.name)
      return `The guinea pig is ${itemData.actionWord} the ${itemName}.`
    }
  }
  
  // Check for urgency messages (managed by Status store)
  const urgencyMessage = statusStore.getCurrentPriorityMessage
  if (urgencyMessage) {
    return urgencyMessage.message
  }
  
  // Default status based on sitting/moving (lowest priority)
  if (guineaPigStore.sitting) {
    return 'The guinea pig is sitting.'
  } else {
    return 'The guinea pig is moving...'
  }
})

// Priority-based emoji computation
const statusEmoji = computed(() => {
  // Check if guinea pig is on fresh poop (highest priority)
  if (isOnFreshPoop.value) {
    return '💩'
  }
  
  // Check if guinea pig is on old poop (high priority)
  if (isOnPoop.value) {
    return '💩'
  }
  
  // Check if guinea pig is on an item (medium priority)
  if (currentItem.value) {
    const itemData = marketStore.getItemData(currentItem.value.name)
    if (itemData) {
      // Return appropriate emoji based on item type
      const needType = itemData.needType
      if (needType === 'hunger') return '🥕'
      if (needType === 'chew') return '🦷'
      if (needType === 'enrichment') return '🎾'
      if (needType === 'shelter') return '🏠'
    }
  }
  
  // Check for urgency messages (managed by Status store)
  const urgencyMessage = statusStore.getCurrentPriorityMessage
  if (urgencyMessage) {
    return urgencyMessage.emoji
  }
  
  // Default emoji based on sitting/moving (lowest priority)
  if (guineaPigStore.sitting) {
    return '🛋️'
  } else {
    return '🏃'
  }
})

// Watch for poop interaction to show timed message
watch(isOnPoop, (newValue, oldValue) => {
  if (newValue && !oldValue && !isOnFreshPoop.value) {
    // Guinea pig just stepped on poop (not fresh poop)
    showTemporaryPoopMessage('The guinea pig stepped on poop!')
  }
})

// Function to show temporary poop message
function showTemporaryPoopMessage(message) {
  // Clear any existing timer
  if (poopMessageTimer.value) {
    clearTimeout(poopMessageTimer.value)
  }
  
  // Set the temporary message
  poopMessage.value = message
  
  // Clear the message after 2 seconds
  poopMessageTimer.value = setTimeout(() => {
    poopMessage.value = null
    poopMessageTimer.value = null
  }, 2000)
}

// Watch for status changes and trigger bounce animation
watch(() => [
  guineaPigStore.sitting, 
  currentItem.value, 
  isOnPoop.value, 
  isOnFreshPoop.value,
  statusStore.getCurrentPriorityMessage,
  poopMessage.value
], (newValue, oldValue) => {
  if (oldValue !== undefined) { // Don't trigger on initial mount
    shouldBounce.value = true
    setTimeout(() => {
      shouldBounce.value = false
    }, 2000) // Reset after animation duration
  }
}, { deep: true })

// Initialize status system on mount - always start fresh
onMounted(() => {
  console.log('StatusMarquee mounted, starting status store...')
  statusStore.startUpdates()
})

// Cleanup timers on unmount
onUnmounted(() => {
  if (poopMessageTimer.value) {
    clearTimeout(poopMessageTimer.value)
  }
})

</script>

<template>
  <div class="gps-cage__status-marquee">
    <div class="gps-cage__status-marquee-content">
      <div class="gps-cage__status-emoji-container">
        <span class="gps-cage__status-emoji" :class="{ 'gps-cage__status-emoji--bounce': shouldBounce }">{{ statusEmoji }}</span>
      </div>
      <div class="gps-cage__status-text-container">
        <span class="gps-cage__status-text">{{ statusText }}</span>
      </div>
    </div>
  </div>
</template>

<style>
.gps-cage__status-marquee {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  border: 2px solid var(--color-accent-light);
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  margin-block-start: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  width: 320px;
}

.gps-cage__status-marquee-content {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
}

.gps-cage__status-emoji-container {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gps-cage__status-text-container {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gps-cage__status-emoji {
  font-size: 1.2em;
}

.gps-cage__status-emoji--bounce {
  animation: bounce 2s ease-in-out;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
}

.gps-cage__status-text {
  font-weight: 600;
  color: var(--color-text);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  font-size: 1.1em;
  letter-spacing: 0.5px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-align: center;
  line-height: 1.2;
}

/* Mobile-first responsive design */
@media (max-width: 480px) {
  .gps-cage__status-marquee {
    padding: 0.5rem 1rem;
    margin-block-start: 1rem;
  }
  
  .gps-cage__status-marquee-content {
    gap: 0.5rem;
  }
  
  .gps-cage__status-emoji {
    font-size: 1em;
  }
  
  .gps-cage__status-text {
    font-size: 1em;
  }
}

@media (min-width: 768px) {
  .gps-cage__status-marquee {
    padding: 1rem 2rem;
  }
  
  .gps-cage__status-emoji {
    font-size: 1.4em;
  }
  
  .gps-cage__status-text {
    font-size: 1.2em;
  }
}
</style> 