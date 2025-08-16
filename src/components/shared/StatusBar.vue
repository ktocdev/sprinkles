<template>
  <div class="gps-status-bar">
    <span v-if="showLabel" class="gps-status-bar__label">{{ label }}:</span>
    <progress 
      class="gps-status-bar__progress" 
      :value="value" 
      max="100"
      :style="{ '--progress-color': color }"
      :class="{
        'gps-status-bar__progress--urgent': value >= 50 && value < 70,
        'gps-status-bar__progress--critical': value < 50,
        'gps-status-bar__progress--normal': value >= 70 && value < 90,
        'gps-status-bar__progress--fulfilled': value >= 90
      }"
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
  transition: box-shadow 0.3s ease, filter 0.3s ease;
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

/* Glow effects for different status levels */
.gps-status-bar__progress--fulfilled {
  box-shadow: 0 0 8px rgba(39, 174, 96, 0.4);
}

.gps-status-bar__progress--normal {
  box-shadow: 0 0 6px rgba(var(--progress-color-rgb, 52, 152, 219), 0.3);
}

.gps-status-bar__progress--urgent {
  box-shadow: 0 0 10px rgba(230, 126, 34, 0.5);
  animation: pulse-urgent 2s ease-in-out infinite alternate;
}

.gps-status-bar__progress--critical {
  box-shadow: 0 0 12px rgba(231, 76, 60, 0.6);
  animation: pulse-critical 1.5s ease-in-out infinite alternate;
}

/* Pulse animations for urgent states */
@keyframes pulse-urgent {
  from {
    box-shadow: 0 0 8px rgba(230, 126, 34, 0.4);
  }
  to {
    box-shadow: 0 0 14px rgba(230, 126, 34, 0.7);
  }
}

@keyframes pulse-critical {
  from {
    box-shadow: 0 0 10px rgba(231, 76, 60, 0.5);
  }
  to {
    box-shadow: 0 0 16px rgba(231, 76, 60, 0.8);
  }
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