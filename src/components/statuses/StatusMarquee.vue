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

// Get current status display (message and emoji) from status store
const currentStatus = computed(() => {
  return statusStore.getCurrentStatusDisplay({
    guineaPigStore,
    cageStore,
    poopStore,
    marketStore
  })
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

// Initialize status system on mount - always start fresh
onMounted(() => {
  statusStore.startUpdates()
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