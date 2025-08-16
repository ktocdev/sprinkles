<template>
  <div class="gps-panel-section">
    <div class="gps-panel-actions">
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
import { useCageStore } from '../../stores/cage'
import { useInventoryStore } from '../../stores/inventory'

// Only need specific stores for individual functions
const cageStore = useCageStore()
const inventoryStore = useInventoryStore()

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