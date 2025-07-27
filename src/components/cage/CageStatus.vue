<template>
  <div class="gps-cage-status gps-panel-content">
    <div class="gps-cage-status__container gps-panel-section">
      <StatusGrid :items="statusItems" />
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
    color: '#27ae60'
  }
])
</script>

<style>
.gps-cage-status {
  width: 100%;
}
</style> 