<script setup>
import { ref, watch, onMounted } from 'vue'
import Panel from '../shared/Panel.vue'
import Button from '../shared/Button.vue'
import FormGroup from '../shared/FormGroup.vue'
import Toggle from '../shared/Toggle.vue'
import Input from '../shared/Input.vue'
import { useUserStore } from '../../stores/user'
import { useInventoryStore } from '../../stores/inventory'
import { useGuineaPigStore } from '../../stores/guineaPig'
import { useCageStore } from '../../stores/cage'
import { useMarketStore } from '../../stores/market'
import { usePoopStore } from '../../stores/poop'

const userStore = useUserStore()
const inventoryStore = useInventoryStore()
const guineaPigStore = useGuineaPigStore()
const cageStore = useCageStore()
const marketStore = useMarketStore()
const poopStore = usePoopStore()

const showDebugPanel = ref(false)

// Poop system controls
const isPoopingEnabled = ref(poopStore.poopTimer !== null)
const minPoopInterval = ref(5) // 5 seconds default
const maxPoopInterval = ref(12) // 12 seconds default

const emit = defineEmits(['gameReset'])

function toggleDebugPanel() {
  showDebugPanel.value = !showDebugPanel.value
}

function togglePooping(enabled) {
  if (enabled) {
    poopStore.startPoopTimer()
  } else {
    poopStore.stopPoopTimer()
  }
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
  isPoopingEnabled.value = poopStore.poopTimer !== null
  updatePoopInterval()
})

// Watch for changes in the poop timer state
watch(() => poopStore.poopTimer, (newTimer) => {
  isPoopingEnabled.value = newTimer !== null
})

// Watch for changes in min/max intervals and update the store
watch([minPoopInterval, maxPoopInterval], () => {
  updatePoopInterval()
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
      <!-- Poop System Section -->
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
      
      <!-- Existing Actions Section -->
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

/* Desktop enhancements */
@media (min-width: 768px) {
  .gps-panel-controls {
    gap: 1rem;
  }
}
</style> 