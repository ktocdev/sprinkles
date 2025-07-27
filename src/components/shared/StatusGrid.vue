<template>
  <div class="gps-status-grid">
    <div 
      v-for="(item, index) in items" 
      :key="item.key || index"
      class="gps-status-grid__item"
    >
      <div class="gps-status-grid__label">{{ item.label }}</div>
      <div class="gps-status-grid__bar">
        <StatusBar 
          :value="item.value"
          :color="item.color"
          :show-label="false"
          :show-value="false"
        />
      </div>
      <div class="gps-status-grid__value">{{ item.value }}%</div>
    </div>
  </div>
</template>

<script setup>
import StatusBar from './StatusBar.vue'

defineProps({
  items: {
    type: Array,
    required: true,
    validator: (items) => {
      return items.every(item => 
        typeof item.label === 'string' && 
        typeof item.value === 'number' &&
        item.value >= 0 && 
        item.value <= 100
      )
    }
  }
})
</script>

<style>
.gps-status-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
}

.gps-status-grid__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  background: var(--color-panel);
  width: calc(50% - 2rem);
  min-width: 0;
}

.gps-status-grid__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  min-width: 80px;
  flex-shrink: 0;
}

.gps-status-grid__bar {
  flex: 1;
  min-width: 0;
}

.gps-status-grid__value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  min-width: 40px;
  text-align: end;
  flex-shrink: 0;
}

/* Mobile-first responsive design */
@media (max-width: 768px) {
  .gps-status-grid__item {
    width: 100%;
  }
}
</style> 