<template>
  <div class="gps-quick-actions-panel">
    <h4 class="gps-section-header">Guinea Pig Actions</h4>
    <div class="gps-quick-actions-buttons">
      <Button 
        type="primary"
        size="compact"
        @click="$emit('getDrink')"
        title="Trigger autonomous drinking behavior - guinea pig will walk to water bottle"
      >
        💧 Get a Drink
      </Button>
      <Button 
        type="primary"
        size="compact"
        @click="$emit('feedTime')"
        title="Trigger autonomous feeding behavior - guinea pig will walk to food"
      >
        🍽️ Feed Time
      </Button>
      <Button 
        type="primary"
        size="compact"
        @click="$emit('sendToBed')"
        title="Trigger sleep-seeking behavior - guinea pig will seek bed"
      >
        💤 Send to Bed
      </Button>
    </div>
  </div>
</template>

<script setup>
import Button from '../shared/Button.vue'

const emit = defineEmits([
  'getDrink',
  'feedTime', 
  'sendToBed'
])
</script>

<style>
/* Component uses utility classes from style.css */
</style>