<template>
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

<script setup>
import Button from '../shared/Button.vue'
import { useUserStore } from '../../stores/user'
import { useInventoryStore } from '../../stores/inventory'
import { useGuineaPigStore } from '../../stores/guineaPig'
import { useCageStore } from '../../stores/cage'
import { useMarketStore } from '../../stores/market'
import { usePoopStore } from '../../stores/poop'
import { useNeedsQueueStore } from '../../stores/needs/needsQueue'
import { useHungerStore } from '../../stores/needs/hunger'

const userStore = useUserStore()
const inventoryStore = useInventoryStore()
const guineaPigStore = useGuineaPigStore()
const cageStore = useCageStore()
const marketStore = useMarketStore()
const poopStore = usePoopStore()
const needsQueueStore = useNeedsQueueStore()
const hungerStore = useHungerStore()

const emit = defineEmits(['gameReset'])

function resetGame() {
  if (window.confirm('Are you sure you want to reset your game? This cannot be undone.')) {
    userStore.$reset()
    inventoryStore.$reset()
    guineaPigStore.$reset()
    cageStore.$reset()
    marketStore.$reset()
    poopStore.$reset()
    hungerStore.$reset()
    // Remove persisted state from localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('inventory')
    localStorage.removeItem('guineaPig')
    localStorage.removeItem('cage')
    localStorage.removeItem('market')
    localStorage.removeItem('poop')
    localStorage.removeItem('hunger')
    needsQueueStore.stopNeedsSystem()
    needsQueueStore.$reset()
    localStorage.removeItem('needsQueue')
    needsQueueStore.startNeedsSystem()
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
</script>

<style>
/* Game actions specific styles */
.gps-panel-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.gps-panel-action-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-bg);
}

.gps-panel-action-description {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text);
  opacity: 0.8;
  line-height: var(--line-height-normal);
}
</style>