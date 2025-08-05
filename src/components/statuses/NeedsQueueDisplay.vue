<template>
  <div class="gps-needs-queue">
    <div class="gps-needs-queue__header">
      <h3 class="gps-needs-queue__title">Needs Queue</h3>
      <div class="gps-needs-queue__controls">
        <Button @click="updateNeeds" type="secondary" size="small">Update</Button>
        <Button @click="resetAll" type="secondary" size="small">Reset All</Button>
      </div>
    </div>

    <div class="gps-needs-queue__content">
      <!-- Current Queue -->
      <div class="gps-panel-section">
        <h4 class="gps-panel-section-title">Priority Queue</h4>
        <BoardList 
          :items="formattedNeedsQueue"
          :showUrgency="true"
          emptyMessage="No needs in queue"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useNeedsQueueStore } from '../../stores/needs/needsQueue'
import { useHungerStore } from '../../stores/needs/hunger'
import { useFoodStore } from '../../stores/food'
import Button from '../shared/Button.vue'
import BoardList from '../shared/BoardList.vue'

const needsQueueStore = useNeedsQueueStore()
const hungerStore = useHungerStore()
const foodStore = useFoodStore()

const bestAction = computed(() => needsQueueStore.getBestAction())

// Format needs queue data for BoardList component
const formattedNeedsQueue = computed(() => {
  return needsQueueStore.queue.map((need, index) => ({
    message: `${formatNeedName(need.name)}: ${Math.round(need.currentValue)}/100 (Priority: ${index + 1})`,
    urgency: need.urgency
  }))
})

function updateNeeds() {
  needsQueueStore.updateAllNeeds()
}

function resetAll() {
  needsQueueStore.resetAllNeeds()
}

function formatNeedName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

onMounted(() => {
  // Only start the needs system if it's currently active (respects user debug panel settings)
  if (needsQueueStore.isActive) {
    needsQueueStore.startNeedsSystem()
  }
})
</script>

<style>
.gps-needs-queue {
  max-width: 100%;
  padding: 0.5rem;
}

.gps-needs-queue__header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  margin-block-end: 1.5rem;
}

.gps-needs-queue__title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.gps-needs-queue__controls {
  display: flex;
  gap: 0.5rem;
}

.gps-needs-queue__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Tablet and desktop enhancements */
@media (min-width: 481px) {
  .gps-needs-queue {
    padding: 1rem;
  }
  .gps-needs-queue__header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

/* Custom styling for panel sections inside needs queue */
.gps-needs-queue__content .gps-panel-section {
  background: transparent;
  border: none;
  padding: 0;
  margin-block-end: 1.5rem;
}

.gps-needs-queue__content .gps-panel-section:last-child {
  margin-block-end: 0;
}

.gps-needs-queue__content .gps-panel-section-title {
  font-size: var(--font-size-lg);
  margin-block-end: 1rem;
}
</style> 