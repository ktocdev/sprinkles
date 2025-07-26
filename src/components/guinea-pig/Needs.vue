<template>
  <div class="gps-needs">
    <div class="gps-needs__container gps-status-grid gps-panel-content">
      <div v-if="Object.keys(guineaPigStore.needs).length === 0" class="gps-needs__empty">
        No needs data available
      </div>
      <StatusBar 
        v-else
        v-for="(value, need) in guineaPigStore.needs" 
        :key="need"
        :label="need.charAt(0).toUpperCase() + need.slice(1)"
        :value="value"
        :color="getNeedColor(need)"
      />
    </div>
  </div>
</template>

<script setup>
import { useGuineaPigStore } from '../../stores/guineaPig'
import StatusBar from '../shared/StatusBar.vue'

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
    cleanliness: '#27ae60', // Green
    nails: '#8e44ad'        // Purple (darker shade)
  }
  return colors[need] || 'var(--color-accent)'
}
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