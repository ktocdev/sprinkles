<template>
  <div class="gps-needs gps-panel-content">
    <div class="gps-needs__container gps-panel-section">
      <div v-if="Object.keys(guineaPigStore.needs).length === 0" class="gps-needs__empty">
        No needs data available
      </div>
      <StatusGrid 
        v-else
        :items="statusItems"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGuineaPigStore } from '../../stores/guineaPig'
import StatusGrid from '../shared/StatusGrid.vue'

const guineaPigStore = useGuineaPigStore()

// Function to get color for different needs
const getNeedColor = (need) => {
  const colors = {
    hunger: '#e74c3c',      // Red
    thirst: '#3498db',      // Blue
    shelter: '#95a5a6',     // Gray
    chew: '#f39c12',        // Orange
    enrichment: '#9b59b6',  // Purple
    love: '#e91e63',        // Pink
    nails: '#16a085',       // Teal
    hygiene: '#2ecc71'      // Green
  }
  return colors[need] || 'var(--color-accent)'
}

// Transform needs data for StatusGrid
const statusItems = computed(() => {
  return Object.entries(guineaPigStore.needs).map(([need, value]) => ({
    key: need,
    label: need.charAt(0).toUpperCase() + need.slice(1),
    value: value,
    color: getNeedColor(need)
  }))
})
</script>

<style>
.gps-needs {
  width: 100%;
}

.gps-needs__empty {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--color-text);
  opacity: 0.7;
  font-style: italic;
  padding: 2rem 0;
}
</style> 