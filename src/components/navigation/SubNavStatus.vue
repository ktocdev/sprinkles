<template>
  <div class="gps-subnav-status">
    <StatusBar 
      :label="label"
      :value="percentage"
      :color="color"
      :showLabel="true"
      :showValue="true"
    />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import StatusBar from '../shared/StatusBar.vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    default: 'var(--color-accent)'
  }
})
</script>

<style>
.gps-subnav-status {
  padding: 0.5rem;
  border-radius: var(--border-radius);
  background: var(--color-panel);
  border: 1px solid var(--color-border);
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .gps-subnav-status {
    padding: 0.75rem;
  }
}
</style> 