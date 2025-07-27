<template>
  <div class="gps-debug-panel">
    <div class="gps-debug-panel__content gps-panel-content">
      <div class="gps-debug-panel__section gps-panel-section">
        <div class="gps-debug-panel__actions">
          <div class="gps-debug-panel__action-item">
            <Button 
              type="warning"
              size="large"
              @click="handleResetGame"
              class="gps-debug-panel__action-button"
            >
              🔄 Reset Game
            </Button>
            <p class="gps-debug-panel__action-description">
              Completely reset all game data including user, inventory, guinea pig, cage, and market.
            </p>
          </div>
          
          <div class="gps-debug-panel__action-item">
            <Button 
              type="danger"
              size="large"
              @click="handleClearCage"
              class="gps-debug-panel__action-button"
            >
              🧹 Clear Cage
            </Button>
            <p class="gps-debug-panel__action-description">
              Remove all items from the cage and reset cage state while keeping other game data.
            </p>
          </div>
          
          <div class="gps-debug-panel__action-item">
            <Button 
              type="secondary"
              size="large"
              @click="handleResetInventory"
              class="gps-debug-panel__action-button"
            >
              📦 Reset Inventory
            </Button>
            <p class="gps-debug-panel__action-description">
              Reset inventory to default values, restoring all items including large beds and houses.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from './Button.vue'

const emit = defineEmits(['resetGame', 'clearCage', 'resetInventory'])

function handleResetGame() {
  emit('resetGame')
}

function handleClearCage() {
  const confirmed = confirm('Are you sure you want to clear the cage? This cannot be undone.')
  if (confirmed) {
    emit('clearCage')
  }
}

function handleResetInventory() {
  const confirmed = confirm('Are you sure you want to reset the inventory to default values? This will restore all items including large beds and houses.')
  if (confirmed) {
    emit('resetInventory')
  }
}
</script>

<style>
.gps-debug-panel {
  width: 100%;
}

.gps-debug-panel__description {
  color: var(--color-text);
  opacity: 0.8;
  margin-block-end: 1.5rem;
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.gps-debug-panel__actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.gps-debug-panel__action-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.gps-debug-panel__action-button {
  width: 200px;
  justify-content: center;
}

.gps-debug-panel__action-description {
  color: var(--color-text);
  opacity: 0.7;
  font-size: var(--font-size-xs);
  text-align: center;
  line-height: 1.4;
  max-width: 300px;
  margin: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .gps-debug-panel__actions {
    gap: 1.25rem;
  }
  
  .gps-debug-panel__action-button {
    width: 180px;
  }
  
  .gps-debug-panel__action-description {
    max-width: 250px;
  }
}
</style> 