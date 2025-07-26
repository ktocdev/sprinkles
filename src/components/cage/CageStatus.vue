<template>
  <div class="gps-cage-status">
    <div class="gps-cage-status__container gps-status-grid--two-columns">
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
.gps-cage-status {
  width: 100%;
}


</style> 