<script setup>
import { ref, watch, onMounted } from 'vue'
import Panel from '../shared/Panel.vue'
import Button from '../shared/Button.vue'
import FormGroup from '../shared/FormGroup.vue'
import Toggle from '../shared/Toggle.vue'
import Input from '../shared/Input.vue'
import Details from '../shared/Details.vue'
import { useUserStore } from '../../stores/user'
import { useInventoryStore } from '../../stores/inventory'
import { useGuineaPigStore } from '../../stores/guineaPig'
import { useCageStore } from '../../stores/cage'
import { useMarketStore } from '../../stores/market'
import { usePoopStore } from '../../stores/poop'
import NeedsQueueDisplay from '../statuses/NeedsQueueDisplay.vue'
import { useHungerStore } from '../../stores/needs/hunger'
import { useNeedsQueueStore } from '../../stores/needs/needsQueue'

const userStore = useUserStore()
const inventoryStore = useInventoryStore()
const guineaPigStore = useGuineaPigStore()
const cageStore = useCageStore()
const marketStore = useMarketStore()
const poopStore = usePoopStore()
const hungerStore = useHungerStore()
const needsQueueStore = useNeedsQueueStore()

const showDebugPanel = ref(false)

// Poop system controls
const isPoopingEnabled = ref(poopStore.isEnabled)
const minPoopInterval = ref(5) // 5 seconds default
const maxPoopInterval = ref(12) // 12 seconds default

// Hunger system controls
const isHungerEnabled = ref(needsQueueStore.isActive)
const hungerDegradationPerMinute = ref((hungerStore.degradationRate * 60).toFixed(1))
const hungerUrgency = ref(Math.round(hungerStore.urgency))

const emit = defineEmits(['gameReset'])

function toggleDebugPanel() {
  showDebugPanel.value = !showDebugPanel.value
}

function togglePooping(enabled) {
  if (enabled) {
    poopStore.enablePoopSystem()
  } else {
    poopStore.disablePoopSystem()
  }
}

function toggleHunger(enabled) {
  if (enabled) {
    needsQueueStore.startNeedsSystem()
  } else {
    needsQueueStore.stopNeedsSystem()
  }
}

function updateHungerDegradation() {
  // Convert per-minute rate back to per-second rate
  const perSecondRate = hungerDegradationPerMinute.value / 60
  hungerStore.setDegradationPerSecond(perSecondRate)
}

function resetHunger() {
  hungerStore.reset()
  // Also update the needs queue to reflect the reset
  needsQueueStore.updateQueue()
  // Small delay to ensure the reset takes effect
  setTimeout(() => {
    needsQueueStore.updateQueue()
  }, 100)
}

function updatePoopInterval() {
  // Convert seconds to milliseconds and update the base interval
  const minMs = minPoopInterval.value * 1000
  const maxMs = maxPoopInterval.value * 1000
  const baseInterval = (minMs + maxMs) / 2
  poopStore.setPoopInterval(baseInterval)
}

function resetGame() {
  if (window.confirm('Are you sure you want to reset your game? This cannot be undone.')) {
    userStore.$reset()
    inventoryStore.$reset()
    guineaPigStore.$reset()
    cageStore.$reset()
    marketStore.$reset()
    poopStore.$reset()
    // Remove persisted state from localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('inventory')
    localStorage.removeItem('guineaPig')
    localStorage.removeItem('cage')
    localStorage.removeItem('market')
    localStorage.removeItem('poop')
    // Reset debug panel
    showDebugPanel.value = false
    // Reset poop controls
    isPoopingEnabled.value = false
    minPoopInterval.value = 5
    maxPoopInterval.value = 12
    // Reset hunger controls
    isHungerEnabled.value = false
    hungerDegradationPerMinute.value = "2.0"
    needsQueueStore.stopNeedsSystem()
    // Emit event to notify parent about reset
    emit('gameReset')
  }
}

function clearCage() {
  cageStore.$reset()
  localStorage.removeItem('cage')
}

function resetInventory() {
  if (window.confirm('Are you sure you want to reset the inventory to default values? This will restore all items including large beds and houses.')) {
    inventoryStore.resetToDefaults()
  }
}

// Initialize poop controls on mount
onMounted(() => {
  // Set initial values based on current store state
  isPoopingEnabled.value = poopStore.isEnabled
  updatePoopInterval()
  // Set initial hunger controls
  isHungerEnabled.value = needsQueueStore.isActive
  hungerDegradationPerMinute.value = (hungerStore.degradationRate * 60).toFixed(1)
  hungerUrgency.value = Math.round(hungerStore.urgency)
})

// Watch for changes in the poop system enabled state
watch(() => poopStore.isEnabled, (newState) => {
  isPoopingEnabled.value = newState
})

// Watch for changes in min/max intervals and update the store
watch([minPoopInterval, maxPoopInterval], () => {
  updatePoopInterval()
})

// Watch for changes in needs system state
watch(() => needsQueueStore.isActive, (newState) => {
  isHungerEnabled.value = newState
})

// Watch for changes in hunger urgency
watch(() => hungerStore.urgency, (newUrgency) => {
  hungerUrgency.value = Math.round(newUrgency)
})

// Expose toggle function for external use
defineExpose({
  toggleDebugPanel
})
</script>

<template>
  <Panel 
    :isOpen="showDebugPanel" 
    title="🐛 Debug Panel" 
    @close="showDebugPanel = false"
  >
    <div class="gps-panel-content">
      <!-- Hunger System Section -->
      <Details>
        <template #summary>
          🍽️ Hunger System
        </template>
        <template #content>
          <div class="gps-panel-section">
            <h3 class="gps-panel-section-title">🍽️ Hunger System</h3>
            
            <div class="gps-panel-controls">
              <FormGroup label="Enable Hunger Degradation">
                <Toggle 
                  v-model="isHungerEnabled"
                  @change="toggleHunger"
                  aria-label="Toggle hunger degradation on and off"
                />
              </FormGroup>
     
              <FormGroup label="Degradation Rate (per minute)">
                <Input
                  v-model="hungerDegradationPerMinute"
                  type="number"
                  :min="0"
                  :max="10"
                  :step="0.1"
                  @update:modelValue="updateHungerDegradation"
                  hint="Rate at which hunger decreases per minute"
                />
              </FormGroup>
              
              <FormGroup label="Current Hunger Value">
                <Input
                  :model-value="hungerStore.currentValue"
                  type="readonly"
                  hint="Current hunger value (0-100)"
                />
              </FormGroup>

                             <FormGroup label="Urgency Level">
                 <Input
                   :model-value="hungerUrgency"
                   type="readonly"
                   hint="Current urgency level (0-100%)"
                 />
               </FormGroup>
              
              <FormGroup label="Reset Hunger">
                <Button 
                  type="primary"
                  @click="resetHunger"
                  hint="Reset hunger value to 100"
                >
                  🍽️ Reset to 100
                </Button>
              </FormGroup>
            </div>
          </div>
        </template>
      </Details>
      
      <!-- Poop System Section -->
      <Details>
        <template #summary>
          💩 Poop System
        </template>
        <template #content>
          <div class="gps-panel-section">
            <h3 class="gps-panel-section-title">💩 Poop System</h3>
            
            <div class="gps-panel-controls">
              <FormGroup label="Enable Pooping">
                <Toggle 
                  v-model="isPoopingEnabled"
                  @change="togglePooping"
                  aria-label="Toggle pooping on and off"
                />
              </FormGroup>
              
              <FormGroup label="Min Time (seconds)">
                <Input
                  v-model="minPoopInterval"
                  type="number"
                  :min="1"
                  :max="30"
                  :step="1"
                  @update:modelValue="updatePoopInterval"
                  hint="Minimum time between poops in seconds"
                />
              </FormGroup>
              
              <FormGroup label="Max Time (seconds)">
                <Input
                  v-model="maxPoopInterval"
                  type="number"
                  :min="1"
                  :max="30"
                  :step="1"
                  @update:modelValue="updatePoopInterval"
                  hint="Maximum time between poops in seconds"
                />
              </FormGroup>
            </div>
          </div>
        </template>
      </Details>

      <!-- Needs Queue Section -->
      <Details>
        <template #summary>
          🎯 Needs Queue System
        </template>
        <template #content>
          <div class="gps-panel-section">
            <h3 class="gps-panel-section-title">🎯 Needs Queue System</h3>
            <div class="gps-needs-queue-container">
              <NeedsQueueDisplay />
            </div>
          </div>
        </template>
      </Details>
      
      <!-- Game Actions Section -->
      <Details>
        <template #summary>
          ⚙️ Game Actions
        </template>
        <template #content>
          <div class="gps-panel-section">
            <div class="gps-panel-actions">
              <div class="gps-panel-action-item">
                <Button 
                  type="danger"
                  @click="resetGame"
                  class="gps-panel-action-button"
                >
                  🔄 Reset Game
                </Button>
                <p class="gps-panel-action-description">
                  Reset all game data to initial state. This will clear all progress and cannot be undone.
                </p>
              </div>
              
              <div class="gps-panel-action-item">
                <Button 
                  type="warning"
                  @click="clearCage"
                  class="gps-panel-action-button"
                >
                  🧹 Clear Cage
                </Button>
                <p class="gps-panel-action-description">
                  Clear all items and poop from the cage, returning it to an empty state.
                </p>
              </div>
              
              <div class="gps-panel-action-item">
                <Button 
                  type="secondary"
                  @click="resetInventory"
                  class="gps-panel-action-button"
                >
                  📦 Reset Inventory
                </Button>
                <p class="gps-panel-action-description">
                  Reset inventory to default values, restoring all items including large beds and houses.
                </p>
              </div>
            </div>
          </div>
        </template>
      </Details>
    </div>
  </Panel>
</template>

<style>
/* Panel controls layout - specific to DebugPanel */
.gps-panel-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Needs Queue Container - simple wrapper */
.gps-needs-queue-container {
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-bg);
}

/* Panel section title - reduced top margin */
.gps-panel-section-title {
  margin-block-start: 0.5rem;
}


/* Desktop enhancements */
@media (min-width: 768px) {
  .gps-panel-controls {
    gap: 1rem;
  }
  
  .gps-needs-queue-container {
    max-height: 700px;
  }
}
</style> 