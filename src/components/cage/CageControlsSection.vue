<template>
  <div class="gps-cage-controls-section">
    <div class="gps-cage-controls-section__main">
      <CageItemManager />
    </div>
    
    <div class="gps-cage-controls-section__needs">
      <div class="gps-cage-controls-section__needs-header">
        <h3 class="gps-cage-controls-section__needs-title">📊 Current Needs</h3>
      </div>
      <NeedsList 
        :items="needsItems"
        :showUrgency="true"
        emptyMessage="All needs satisfied"
        class="gps-cage-controls-section__needs-board"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNeedsQueueStore } from '../../stores/needs/needsQueue'
import CageItemManager from './CageItemManager.vue'
import NeedsList from '../shared/NeedsList.vue'

const needsQueueStore = useNeedsQueueStore()

// Format needs data for NeedsList (copied from NeedsNav)
const needsItems = computed(() => {
  return needsQueueStore.queue
    .map(need => {
      const value = Math.round(100 - need.urgency)
      return {
        message: `${formatNeedName(need.name)}: ${value}/100`,
        urgency: need.urgency,
        value: value
      }
    })
    .filter(need => need.value >= 50) // Show needs with values 50/100 to 100/100 (urgent, normal, fulfilled)
    .slice(0, 5) // Limit to top 5 needs
})

function formatNeedName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}
</script>

<style>
.gps-cage-controls-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.gps-cage-controls-section__main {
  flex: 1;
}

.gps-cage-controls-section__needs {
  background: var(--color-panel);
  border-radius: var(--border-radius);
  padding: 1rem;
  border: 1px solid var(--color-border);
}

.gps-cage-controls-section__needs-header {
  margin-bottom: 0.75rem;
}

.gps-cage-controls-section__needs-title {
  font-size: var(--font-size-base);
  color: var(--color-accent);
  margin: 0;
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-family-header);
}

.gps-cage-controls-section__needs-board {
  width: 100%;
}

/* Responsive layout - hide needs when not enough room */
@media (max-width: 1023px) {
  .gps-cage-controls-section__needs {
    display: none;
  }
}

/* Desktop inline layout when there's enough room */
@media (min-width: 1024px) {
  .gps-cage-controls-section {
    flex-direction: row;
    align-items: flex-start;
    gap: 1.5rem;
  }
  
  .gps-cage-controls-section__main {
    flex: 1;
    min-width: 0;
  }
  
  .gps-cage-controls-section__needs {
    flex: 0 0 300px;
    max-width: 300px;
  }
}

/* Large desktop - give more room to needs */
@media (min-width: 1280px) {
  .gps-cage-controls-section__needs {
    flex: 0 0 350px;
    max-width: 350px;
  }
}
</style>