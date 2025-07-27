<template>
  <div class="gps-cage-status gps-panel-content">
    <div class="gps-cage-status__container gps-panel-section">
      <StatusGrid :items="statusItems" />
    </div>
    
    <!-- Consumption Statistics -->
    <div class="gps-cage-status__stats gps-panel-section">
      <h3 class="gps-cage-status__stats-title">Consumption Statistics</h3>
      <div v-if="Object.keys(consumptionStats).length === 0" class="gps-cage-status__no-stats">
        No items consumed yet
      </div>
      <div v-else class="gps-cage-status__stats-list">
        <div 
          v-for="(count, itemName) in consumptionStats" 
          :key="itemName"
          class="gps-cage-status__stat-item"
        >
          <span class="gps-cage-status__stat-name">{{ formatItemName(itemName) }}</span>
          <span class="gps-cage-status__stat-count">{{ count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCageStore } from '../../stores/cage'
import StatusGrid from '../shared/StatusGrid.vue'

const cageStore = useCageStore()

// Transform cage data for StatusGrid
const statusItems = computed(() => [
  {
    key: 'bedding',
    label: 'Bedding',
    value: cageStore.beddingFreshness,
    color: 'var(--color-accent)'
  },
  {
    key: 'water',
    label: 'Water',
    value: cageStore.waterLevel,
    color: '#4a90e2'
  },
  {
    key: 'habitat',
    label: 'Habitat',
    value: cageStore.habitatValue,
    color: '#8e44ad'
  }
])

// Get consumption statistics
const consumptionStats = computed(() => cageStore.getConsumptionStats())

// Format item names for display
const formatItemName = (itemName) => {
  return itemName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<style>
.gps-cage-status {
  width: 100%;
}

.gps-cage-status__stats {
  margin-block-start: 1.5rem;
}

.gps-cage-status__stats-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
  margin: 0 0 1rem 0;
}

.gps-cage-status__no-stats {
  text-align: center;
  color: var(--color-text);
  opacity: 0.7;
  font-style: italic;
  padding: 1rem;
}

.gps-cage-status__stats-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gps-cage-status__stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--color-panel);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-cage-status__stat-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.gps-cage-status__stat-count {
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
  background: var(--color-accent);
  color: var(--color-white);
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
}
</style> 