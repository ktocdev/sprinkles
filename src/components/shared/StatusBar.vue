<template>
  <div class="gps-status-bar">
    <span v-if="showLabel" class="gps-status-bar__label">{{ label }}:</span>
    <progress 
      class="gps-status-bar__progress" 
      :value="value" 
      max="100"
      :style="{ '--progress-color': color }"
    ></progress>
    <span v-if="showValue" class="gps-status-bar__value">{{ displayValue || value }}</span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  value: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
  },
  displayValue: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: 'var(--color-accent)'
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  showValue: {
    type: Boolean,
    default: true
  }
})
</script>

<style>
.gps-status-bar {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.25em;
  min-width: 0;
  container-type: inline-size;
}

.gps-status-bar__label {
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-xs);
  text-align: start;
  margin-block-end: 0.125em;
}

.gps-status-bar__progress {
  width: 100%;
  height: 0.75em;
  border-radius: var(--border-radius);
  background: var(--color-border);
  flex-shrink: 0;
}

.gps-status-bar__progress::-webkit-progress-bar {
  background: var(--color-border);
  border-radius: var(--border-radius);
}

.gps-status-bar__progress::-webkit-progress-value {
  border-radius: var(--border-radius);
  transition: width 0.3s ease;
  background: var(--progress-color, var(--color-accent));
}

.gps-status-bar__progress::-moz-progress-bar {
  border-radius: var(--border-radius);
  background: var(--progress-color, var(--color-accent));
}

.gps-status-bar__value {
  text-align: end;
  color: var(--color-text);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xs);
  margin-block-start: 0.125em;
}

/* ===== RESPONSIVE DESIGN ===== */

@container (min-width: 300px) {
  .gps-status-bar {
    flex-direction: row;
    align-items: center;
    gap: 0.5em;
  }
  
  .gps-status-bar__label {
    font-size: var(--font-size-sm);
    margin-block-end: 0;
    white-space: nowrap;
    min-width: fit-content;
  }
  
  .gps-status-bar__progress {
    height: 1.2em;
    flex: 1;
  }
  
  .gps-status-bar__value {
    font-size: var(--font-size-sm);
    margin-block-start: 0;
    min-width: 2em;
  }
}
</style> 