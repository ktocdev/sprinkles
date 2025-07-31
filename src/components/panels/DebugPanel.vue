<script setup>
import { ref } from 'vue'
import Panel from '../shared/Panel.vue'
import Button from '../shared/Button.vue'
import { useUserStore } from '../../stores/user'
import { useInventoryStore } from '../../stores/inventory'
import { useGuineaPigStore } from '../../stores/guineaPig'
import { useCageStore } from '../../stores/cage'
import { useMarketStore } from '../../stores/market'

const userStore = useUserStore()
const inventoryStore = useInventoryStore()
const guineaPigStore = useGuineaPigStore()
const cageStore = useCageStore()
const marketStore = useMarketStore()

const showDebugPanel = ref(false)

const emit = defineEmits(['gameReset'])

function toggleDebugPanel() {
  showDebugPanel.value = !showDebugPanel.value
}

function resetGame() {
  if (window.confirm('Are you sure you want to reset your game? This cannot be undone.')) {
    userStore.$reset()
    inventoryStore.$reset()
    guineaPigStore.$reset()
    cageStore.$reset()
    marketStore.$reset()
    // Remove persisted state from localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('inventory')
    localStorage.removeItem('guineaPig')
    localStorage.removeItem('cage')
    localStorage.removeItem('market')
    // Reset debug panel
    showDebugPanel.value = false
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