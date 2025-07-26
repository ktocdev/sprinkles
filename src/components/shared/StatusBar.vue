<template>
  <div class="gps-status-bar">
    <span class="gps-status-bar__label">{{ label }}:</span>
    <progress 
      class="gps-status-bar__progress" 
      :value="value" 
      max="100"
      :style="{ accentColor: color }"
    ></progress>
    <span class="gps-status-bar__value">{{ value }}</span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
  },
  color: {
    type: String,
    default: 'var(--color-accent)'
  }
})
</script>

<style>
.gps-status-bar {
  margin-block-end: 1em;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5em;
}

.gps-status-bar__label {
  margin-inline-end: 0.5em;
  color: var(--color-text);
  font-weight: 500;
  white-space: nowrap;
}

.gps-status-bar__progress {
  width: 100%;
  margin-inline-end: 0.5em;
  height: 1.2em;
  border-radius: var(--border-radius);
  background: var(--color-border);
}

.gps-status-bar__progress::-webkit-progress-bar {
  background: var(--color-border);
  border-radius: var(--border-radius);
}

.gps-status-bar__progress::-webkit-progress-value {
  border-radius: var(--border-radius);
  transition: width 0.3s ease;
}

.gps-status-bar__value {
  min-width: 2em;
  text-align: end;
  color: var(--color-text);
  font-weight: 600;
}


</style> 