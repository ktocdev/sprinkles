<template>
  <div class="gps-cage-controls-section">
    <div class="gps-cage-controls-section__main">
      <CageItemManager />
    </div>
    
    <div class="gps-cage-controls-section__needs">
      <div class="gps-cage-controls-section__needs-header">
        <h4 class="gps-section-header">Current Needs</h4>
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
import CageItemManager from './CageItemManager.vue'
import NeedsList from '../shared/NeedsList.vue'
import { useNeedsList } from '../../composables/useNeedsList'

const { needsItems } = useNeedsList()
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
