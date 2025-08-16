<script setup>
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import { useNeedsQueueStore } from '../../stores/needs/needsQueue'

const needsQueueStore = useNeedsQueueStore()

// Keep track of recent messages for ticker effect
const recentMessages = ref([])
const maxMessages = 5 // Show up to 5 recent messages
const tickerContainer = ref(null)

// Get current display message from needsQueue (handles all logic)
const currentStatus = computed(() => {
  return needsQueueStore.currentDisplayMessage
})

// Watch for status changes and add to ticker
watch(() => currentStatus.value, async (newValue, oldValue) => {
  if (oldValue !== undefined && newValue && newValue.text) {
    // Check if this message is the same as the most recent one
    const isDuplicate = recentMessages.value.length > 0 && 
                       recentMessages.value[0].text === newValue.text &&
                       recentMessages.value[0].emoji === newValue.emoji
    
    // Only add if it's not a duplicate
    if (!isDuplicate) {
      // Create message object with unique ID for smooth transitions
      const message = {
        id: Date.now() + Math.random(),
        text: newValue.text,
        emoji: newValue.emoji,
        timestamp: Date.now()
      }
      
      // Add new message to the beginning of array
      recentMessages.value.unshift(message)
      
      // Keep only the most recent messages
      if (recentMessages.value.length > maxMessages) {
        recentMessages.value = recentMessages.value.slice(0, maxMessages)
      }
      
      // Trigger smooth scroll animation
      await nextTick()
      animateNewMessage()
    }
  }
}, { deep: true })

// Animate the entrance of a new message
function animateNewMessage() {
  if (tickerContainer.value) {
    const firstMessage = tickerContainer.value.querySelector('.gps-status-marquee__message')
    if (firstMessage) {
      firstMessage.classList.add('gps-status-marquee__message--entering')
      setTimeout(() => {
        firstMessage.classList.remove('gps-status-marquee__message--entering')
      }, 600)
    }
  }
}

// Initialize with current message if it exists
onMounted(() => {
  console.log('📢 [STATUSMARQUEE] Mounted, needsQueue will handle all messages')
  
  if (currentStatus.value && currentStatus.value.text) {
    recentMessages.value = [{
      id: Date.now(),
      text: currentStatus.value.text,
      emoji: currentStatus.value.emoji,
      timestamp: Date.now()
    }]
  }
})

</script>

<template>
  <div class="gps-status-marquee">
    <div class="gps-status-marquee__ticker" ref="tickerContainer">
      <transition-group name="ticker" tag="div" class="gps-status-marquee__messages">
        <div 
          v-for="message in recentMessages" 
          :key="message.id"
          class="gps-status-marquee__message"
        >
          <div class="gps-status-marquee__message-content">
            <span class="gps-status-marquee__emoji">{{ message.emoji }}</span>
            <span class="gps-status-marquee__text">{{ message.text }}</span>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style>
.gps-status-marquee {
  background: linear-gradient(135deg, var(--color-panel), var(--color-border));
  border: 2px solid var(--color-accent-light);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-block-end: .5rem;
  position: relative;
  width: 100%;
  height: 60px;
  overflow: hidden;
}

.gps-status-marquee__ticker {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.gps-status-marquee__messages {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: auto;
}

.gps-status-marquee__message {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
  position: relative;
  background: transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.gps-status-marquee__message-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
  width: 100%;
}

.gps-status-marquee__emoji {
  font-size: 1.2em;
  flex-shrink: 0;
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

/* News ticker animations */
.ticker-enter-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.ticker-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.ticker-enter-from {
  transform: translateY(60px);
  opacity: 0;
}

.ticker-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.ticker-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.ticker-leave-to {
  transform: translateY(-60px);
  opacity: 0;
}

.ticker-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Entering message special animation */
.gps-status-marquee__message--entering {
  animation: slideUpFade 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUpFade {
  0% {
    transform: translateY(60px);
    opacity: 0;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Subtle glow effect for newest message */
.gps-status-marquee__message:first-child {
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(var(--color-accent-rgb), 0.1) 50%, 
    transparent 100%);
}

.gps-status-marquee__message:first-child .gps-status-marquee__text {
  color: var(--color-accent);
}

/* Fade out older messages */
.gps-status-marquee__message:nth-child(2) {
  opacity: 0.8;
}

.gps-status-marquee__message:nth-child(3) {
  opacity: 0.6;
}

.gps-status-marquee__message:nth-child(4) {
  opacity: 0.4;
}

.gps-status-marquee__message:nth-child(5) {
  opacity: 0.2;
}

/* Mobile-first responsive design */
@media (max-width: 480px) {
  .gps-status-marquee {
    height: 50px;
  }
  
  .gps-status-marquee__message {
    height: 50px;
    padding: 0 1rem;
  }
  
  .gps-status-marquee__message-content {
    gap: 0.5rem;
  }
  
  .gps-status-marquee__emoji {
    font-size: 1em;
  }
  
  .gps-status-marquee__text {
    font-size: 1em;
  }
  
  .ticker-enter-from,
  .ticker-leave-to {
    transform: translateY(50px);
  }
  
  @keyframes slideUpFade {
    0% {
      transform: translateY(50px);
      opacity: 0;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
}

@media (min-width: 768px) {
  .gps-status-marquee {
    height: 70px;
  }
  
  .gps-status-marquee__message {
    height: 70px;
    padding: 0 2rem;
  }
  
  .gps-status-marquee__emoji {
    font-size: 1.4em;
  }
  
  .gps-status-marquee__text {
    font-size: 1.2em;
  }
  
  .ticker-enter-from,
  .ticker-leave-to {
    transform: translateY(70px);
  }
  
  @keyframes slideUpFade {
    0% {
      transform: translateY(70px);
      opacity: 0;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
</style> 