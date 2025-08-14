<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useGuineaPigStore } from '../../stores/guineaPig'
import { useCageStore } from '../../stores/cage'
import { useMarketStore } from '../../stores/market'
import { usePoopStore } from '../../stores/poop'
import { useNeedsQueueStore } from '../../stores/needs/needsQueue'

const guineaPigStore = useGuineaPigStore()
const cageStore = useCageStore()
const marketStore = useMarketStore()
const poopStore = usePoopStore()
const needsQueueStore = useNeedsQueueStore()

const shouldBounce = ref(false)

// Get current message from needsQueue or fallback to guinea pig state
const currentStatus = computed(() => {
  // Check if there's a message in the queue
  if (needsQueueStore.currentMessage) {
    return {
      message: needsQueueStore.currentMessage.text,
      emoji: needsQueueStore.currentMessage.emoji
    }
  }
  
  // Fallback to guinea pig location/state
  const { x, y } = cageStore.guineaPigPos || { x: 0, y: 0 }
  
  // Check if guinea pig is on an item
  const currentItem = cageStore.items?.find(item => item.x === x && item.y === y)
  if (currentItem) {
    const itemData = marketStore.getItemData(currentItem.name)
    if (itemData && itemData.actionWord) {
      const itemName = currentItem.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      return {
        message: `The guinea pig is ${itemData.actionWord} the ${itemName}.`,
        emoji: marketStore.getItemEmoji(currentItem.name)
      }
    }
  }
  
  // Default to guinea pig state
  return {
    message: guineaPigStore.currentMessage,
    emoji: guineaPigStore.currentEmoji
  }
})

// Extract text and emoji from status display
const statusText = computed(() => currentStatus.value.message)
const statusEmoji = computed(() => currentStatus.value.emoji)

// Watch for status changes and trigger bounce animation
watch(() => currentStatus.value, (newValue, oldValue) => {
  if (oldValue !== undefined) { // Don't trigger on initial mount
    shouldBounce.value = true
    setTimeout(() => {
      shouldBounce.value = false
    }, 2000) // Reset after animation duration
  }
}, { deep: true })

// Initialize needs system on mount
onMounted(() => {
  console.log('📢 [STATUSMARQUEE] Mounted, needsQueue will handle all messages')
  // No need to initialize statusStore anymore - needsQueue handles everything
})

</script>

<template>
  <div class="gps-status-marquee">
    <div class="gps-status-marquee__content">
      <div class="gps-status-marquee__emoji-container">
        <span class="gps-status-marquee__emoji" :class="{ 'gps-status-marquee__emoji--bounce': shouldBounce }">{{ statusEmoji }}</span>
      </div>
      <div class="gps-status-marquee__text-container">
        <span class="gps-status-marquee__text">{{ statusText }}</span>
      </div>
    </div>
  </div>
</template>

<style>
.gps-status-marquee {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  border: 2px solid var(--color-accent-light);
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
}

.gps-status-marquee__content {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
}

.gps-status-marquee__emoji-container {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gps-status-marquee__text-container {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gps-status-marquee__emoji {
  font-size: 1.2em;
}

.gps-status-marquee__emoji--bounce {
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

.gps-status-marquee__text {
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
  .gps-status-marquee {
    padding: 0.5rem 1rem;
  }
  
  .gps-status-marquee__content {
    gap: 0.5rem;
  }
  
  .gps-status-marquee__emoji {
    font-size: 1em;
  }
  
  .gps-status-marquee__text {
    font-size: 1em;
  }
}

@media (min-width: 768px) {
  .gps-status-marquee {
    padding: 1rem 2rem;
  }
  
  .gps-status-marquee__emoji {
    font-size: 1.4em;
  }
  
  .gps-status-marquee__text {
    font-size: 1.2em;
  }
}
</style> 