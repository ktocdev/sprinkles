<template>
  <div class="gps-needs-list">
    <ul class="gps-needs-list__list" v-if="items.length > 0">
      <li 
        v-for="(item, index) in formattedItems" 
        :key="index"
        class="gps-needs-list__item"
        :class="{
          'gps-needs-list__item--urgent': showUrgency && item.urgency > 50 && item.urgency <= 80,
          'gps-needs-list__item--critical': showUrgency && item.urgency > 80
        }"
      >
        <div class="gps-needs-list__item-content">
          <span class="gps-needs-list__item-text">{{ item.message }}</span>
          <span 
            v-if="showUrgency && item.urgency !== undefined" 
            class="gps-needs-list__item-urgency"
          >
            {{ Math.round(item.urgency) }}%
          </span>
        </div>
      </li>
    </ul>
    <div v-else class="gps-needs-list__empty">
      {{ emptyMessage }}
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  showUrgency: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: 'No items to display'
  }
})

// Transform items to consistent format
const formattedItems = computed(() => {
  return props.items.map(item => {
    if (typeof item === 'string') {
      return { message: item }
    }
    return {
      message: item.message || item.text || String(item),
      urgency: item.urgency
    }
  })
})
</script>

<style>
.gps-needs-list {
  width: 100%;
}

.gps-needs-list__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gps-needs-list__item {
  padding: 0.5rem 0.75rem;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  transition: var(--transition);
  font-family: var(--font-family-body);
}

.gps-needs-list__item:hover {
  background: var(--color-bg);
  border-color: var(--color-accent);
}

.gps-needs-list__item--urgent {
  border-color: var(--color-warning);
  background: rgba(230, 126, 34, 0.1);
}

.gps-needs-list__item--critical {
  border-color: var(--color-danger);
  background: rgba(231, 76, 60, 0.1);
}

.gps-needs-list__item-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.gps-needs-list__item-text {
  width: 100%;
  color: var(--color-text);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

.gps-needs-list__item-urgency {
  align-self: flex-end;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
  background: var(--color-bg);
  padding: 0.25rem 0.5rem;
  border-radius: calc(var(--border-radius) / 2);
  border: 1px solid var(--color-border);
}

.gps-needs-list__item--urgent .gps-needs-list__item-urgency {
  color: var(--color-warning);
  border-color: var(--color-warning);
}

.gps-needs-list__item--critical .gps-needs-list__item-urgency {
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.gps-needs-list__empty {
  padding: 1.5rem 1rem;
  text-align: center;
  color: var(--color-text);
  opacity: 0.7;
  font-style: italic;
  font-size: var(--font-size-sm);
  font-family: var(--font-family-body);
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
}

/* Mobile-first responsive design */
@media (min-width: 480px) {
  .gps-needs-list__item {
    padding: 0.75rem 1rem;
  }
  
  .gps-needs-list__item-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
  
  .gps-needs-list__item-text {
    flex: 1;
    font-size: var(--font-size-base);
  }
  
  .gps-needs-list__item-urgency {
    align-self: auto;
    flex-shrink: 0;
    font-size: var(--font-size-sm);
  }
  
  .gps-needs-list__empty {
    padding: 2rem;
    font-size: var(--font-size-base);
  }
}

@media (min-width: 768px) {
  .gps-needs-list__item {
    padding: 1rem 1.25rem;
  }
  
  .gps-needs-list__item-text {
    font-size: var(--font-size-lg);
  }
  
  .gps-needs-list__item-urgency {
    font-size: var(--font-size-base);
  }
}
</style>