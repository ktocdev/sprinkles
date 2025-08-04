<template>
  <details :class="detailsClass">
    <summary class="gps-details__summary">
      <slot name="summary"></slot>
    </summary>
    <div class="gps-details__content">
      <slot name="content"></slot>
    </div>
  </details>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'panel'].includes(value)
  }
})

const detailsClass = computed(() => {
  const baseClass = 'gps-details'
  return props.variant === 'panel' ? `${baseClass} ${baseClass}--panel` : baseClass
})
</script>

<style>
.gps-details {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-bg);
  margin-block: 1rem;
}

.gps-details--panel {
  border: none;
  background: transparent;
  margin-block: 0;
}

.gps-details__summary {
  padding: 1rem;
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  background: var(--color-panel);
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  transition: background-color 0.2s ease;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.gps-details--panel .gps-details__summary {
  background: transparent;
  padding: 0.5rem 0;
  border-radius: 0;
  border-block-end: 1px solid var(--color-border);
}

.gps-details__summary::before {
  content: '▶';
  font-size: 0.8em;
  transition: transform 0.2s ease;
}

.gps-details[open] .gps-details__summary::before {
  transform: rotate(90deg);
}

.gps-details__summary:hover {
  background: var(--color-accent);
  color: var(--color-bg);
}

.gps-details--panel .gps-details__summary:hover {
  background: transparent;
  color: var(--color-accent);
}

.gps-details__content {
  padding: 1rem;
  border-top: 1px solid var(--color-border);
}

.gps-details--panel .gps-details__content {
  padding: 0;
  border-top: none;
}

/* Mobile-first responsive design */
@media (min-width: 481px) {
  .gps-details {
    margin-block: 1.5rem;
  }
  
  .gps-details--panel {
    margin-block: 0;
  }
  
  .gps-details__summary {
    padding: 1.25rem;
  }
  
  .gps-details--panel .gps-details__summary {
    padding: 0.75rem 0;
  }
  
  .gps-details__content {
    padding: 1.25rem;
  }
  
  .gps-details--panel .gps-details__content {
    padding: 0;
  }
}
</style> 