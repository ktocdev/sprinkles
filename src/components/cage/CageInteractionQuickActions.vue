<template>
  <div class="gps-quick-actions-panel">
    <h4 class="gps-section-header">Cage Interactions</h4>
    <div class="gps-quick-actions-buttons">
      <Button 
        type="primary"
        size="compact"
        @click="$emit('refreshWater')"
        title="Refill the water bottle with fresh, clean water"
      >
        💧 Refresh Water
      </Button>
      <Button 
        type="primary"
        size="compact"
        @click="$emit('refreshBedding')"
        title="Replace bedding with fresh material"
      >
        🛏️ Refresh Bedding
      </Button>
      <Button 
        type="primary"
        size="compact"
        @click="$emit('cleanPoop')"
        title="Remove waste from the cage"
      >
        🧹 Clean Poop
      </Button>
    </div>
  </div>
</template>

<script setup>
import Button from '../shared/Button.vue'

const emit = defineEmits([
  'refreshWater',
  'refreshBedding',
  'cleanPoop'
])
</script>

<style>
/* Component uses utility classes from style.css */
</style>