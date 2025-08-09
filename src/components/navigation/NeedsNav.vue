<template>
  <AnchorNav 
    class="gps-needs-nav"
    :class="{
      'gps-needs-nav--urgent': hasUrgentItems && !hasCriticalItems,
      'gps-needs-nav--critical': hasCriticalItems
    }"
    icon="📊"
    title="Current Needs"
    toggle-aria-label="Toggle needs display"
  >
    <NeedsList 
      :items="needsItems"
      :showUrgency="true"
      emptyMessage="All needs satisfied"
    />
  </AnchorNav>
</template>

<script setup>
import { computed } from 'vue'
import { useNeedsQueueStore } from '../../stores/needs/needsQueue'
import AnchorNav from './AnchorNav.vue'
import NeedsList from '../shared/NeedsList.vue'

const needsQueueStore = useNeedsQueueStore()

// Format needs data for NeedsList
const needsItems = computed(() => {
  return needsQueueStore.queue
    .filter(need => need.urgency > 10) // Only show needs that require attention
    .slice(0, 5) // Limit to top 5 needs
    .map(need => ({
      message: `${formatNeedName(need.name)}: ${Math.round(100 - need.urgency)}/100`,
      urgency: need.urgency
    }))
})

// Check for urgent/critical items to style the AnchorNav button
const hasUrgentItems = computed(() => {
  return needsItems.value.some(item => item.urgency > 50 && item.urgency <= 80)
})

const hasCriticalItems = computed(() => {
  return needsItems.value.some(item => item.urgency > 80)
})

function formatNeedName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}
</script>

<style>
/* Custom positioning for needs nav */
.gps-needs-nav {
  top: 50%;
  transform: translateY(-50%);
}

/* Hide NeedsNav when inline BoardList is shown */
@media (min-width: 1024px) {
  .gps-needs-nav {
    display: none;
  }
}

/* Urgency styling for the anchor button */
.gps-needs-nav--urgent .gps-anchor-nav__toggle {
  background: var(--color-warning);
  color: var(--color-white);
  border-color: var(--color-warning);
}

.gps-needs-nav--urgent .gps-anchor-nav__toggle:hover {
  background: var(--color-warning-hover);
  border-color: var(--color-warning-hover);
}

.gps-needs-nav--critical .gps-anchor-nav__toggle {
  background: var(--color-danger);
  color: var(--color-white);
  border-color: var(--color-danger);
}

.gps-needs-nav--critical .gps-anchor-nav__toggle:hover {
  background: var(--color-danger-hover);
  border-color: var(--color-danger-hover);
}
</style>