<template>
  <div class="gps-cage-data">
    <h3 class="gps-cage-data__title">Cage Status</h3>
    <div class="gps-cage-data__content">
      <StatusBar 
        label="Bedding Freshness" 
        :value="cageStore.beddingFreshness" 
        color="var(--color-accent)"
      />
      <StatusBar 
        label="Water Level" 
        :value="cageStore.waterLevel" 
        color="#4a90e2"
      />
    </div>
  </div>
</template>

<script setup>
import { useCageStore } from '../../stores/cage'
import StatusBar from '../shared/StatusBar.vue'

const cageStore = useCageStore()
</script>

<style>
.gps-cage-data {
  width: 100%;
  padding: 1rem;
  background: var(--color-panel);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-cage-data__title {
  margin-block-end: 1rem;
  margin-block-start: 0;
  color: var(--color-accent);
  font-size: 1.2em;
}

.gps-cage-data__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style> 