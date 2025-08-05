<template>
  <div class="gps-panel-section">
    <h3 class="gps-panel-section-title">🎯 Needs Queue System</h3>
    <div class="gps-needs-queue-container">
      <NeedsQueueDisplay />
    </div>
  </div>
</template>

<script setup>
import NeedsQueueDisplay from '../statuses/NeedsQueueDisplay.vue'
</script>

<style>
/* Panel section title - reduced top margin */
.gps-panel-section-title {
  margin-block-start: 0.5rem;
}

/* Needs Queue Container - simple wrapper */
.gps-needs-queue-container {
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-bg);
}

/* Desktop enhancements */
@media (min-width: 768px) {
  .gps-needs-queue-container {
    max-height: 700px;
  }
}
</style>