<template>
  <!-- Fixed right side navigation -->
  <div class="gps-needs-nav">
    <div class="gps-needs-nav__container">
      <button 
        class="gps-needs-nav__toggle"
        @click="toggleExpanded"
        :class="{ 'gps-needs-nav__toggle--expanded': isExpanded }"
        aria-label="Toggle needs display"
      >
        📋
      </button>
      
      <div 
        v-if="isExpanded"
        class="gps-needs-nav__content"
      >
        <div class="gps-needs-nav__header">
          <h3 class="gps-needs-nav__title">Current Needs</h3>
        </div>
        <BoardList 
          :items="needsItems"
          :showUrgency="true"
          emptyMessage="All needs satisfied"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNeedsQueueStore } from '../../stores/needs/needsQueue'
import BoardList from '../shared/BoardList.vue'

const needsQueueStore = useNeedsQueueStore()

const isExpanded = ref(false)

// Format needs data for BoardList
const needsItems = computed(() => {
  return needsQueueStore.queue
    .filter(need => need.urgency > 10) // Only show needs that require attention
    .slice(0, 5) // Limit to top 5 needs
    .map(need => ({
      message: `${formatNeedName(need.name)}: ${Math.round(need.currentValue)}/100`,
      urgency: need.urgency
    }))
})

function formatNeedName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}
</script>

<style>
/* Fixed right side navigation */
.gps-needs-nav {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: 200;
  max-width: 280px;
  width: 90vw;
  user-select: none;
}

.gps-needs-nav__container {
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-start;
  gap: 0.5rem;
}

.gps-needs-nav__toggle {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  background: var(--color-accent);
  color: var(--color-white);
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  cursor: pointer;
  font-size: var(--font-size-base);
  box-shadow: var(--box-shadow-medium);
  transition: var(--transition);
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gps-needs-nav__toggle:hover {
  background: var(--color-accent-hover);
  transform: translateY(-50%) translateX(-2px);
}

.gps-needs-nav__content {
  position: absolute;
  top: 50%;
  right: 60px; /* Position to the left of the toggle button */
  transform: translateY(-50%);
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow-medium);
  padding: 1rem;
  max-height: 70vh;
  overflow-y: auto;
  user-select: text;
  width: 280px;
  max-width: 90vw;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.gps-needs-nav__title {
  margin: 0 0 1rem 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

/* No complex animations - just simple fade */

/* Responsive adjustments */
@media (min-width: 480px) {
  .gps-needs-nav__content {
    width: 320px;
  }
}

@media (min-width: 768px) {
  .gps-needs-nav__content {
    width: 350px;
  }
  
  .gps-needs-nav__title {
    font-size: var(--font-size-lg);
  }
}
</style>