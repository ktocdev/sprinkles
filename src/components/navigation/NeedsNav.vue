<template>
  <AnchorPopover 
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
    />
  </AnchorPopover>
</template>

<script setup>
import AnchorPopover from './AnchorPopover.vue'
import NeedsList from '../shared/NeedsList.vue'
import { useNeedsList } from '../../composables/useNeedsList'

const { needsItems, hasUrgentItems, hasCriticalItems } = useNeedsList()
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
.gps-needs-nav--urgent .gps-anchor-popover__toggle {
  background: var(--color-warning);
  color: var(--color-white);
  border-color: var(--color-warning);
}

.gps-needs-nav--urgent .gps-anchor-popover__toggle:hover {
  background: var(--color-warning-hover);
  border-color: var(--color-warning-hover);
}

.gps-needs-nav--critical .gps-anchor-popover__toggle {
  background: var(--color-danger);
  color: var(--color-white);
  border-color: var(--color-danger);
}

.gps-needs-nav--critical .gps-anchor-popover__toggle:hover {
  background: var(--color-danger-hover);
  border-color: var(--color-danger-hover);
}
</style>