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
        <div class="gps-needs-queue__list">
          <div 
            v-for="(need, index) in needsQueueStore.queue" 
            :key="need.name"
            class="gps-needs-queue__item"
            :class="{
              'gps-needs-queue__item--urgent': need.urgency > 50,
              'gps-needs-queue__item--critical': need.urgency > 80
            }"
          >
            <div class="gps-needs-queue__item-info">
              <span class="gps-needs-queue__item-name">{{ formatNeedName(need.name) }}</span>
              <span class="gps-needs-queue__item-value">{{ need.currentValue }}/100</span>
            </div>
            <div class="gps-needs-queue__item-urgency">
              <span class="gps-needs-queue__urgency-label">Urgency:</span>
              <span class="gps-needs-queue__urgency-value">{{ Math.round(need.urgency) }}%</span>
            </div>
            <div class="gps-needs-queue__item-priority">
              Priority: {{ index + 1 }}
            </div>
          </div>
        </div>
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

const needsQueueStore = useNeedsQueueStore()
const hungerStore = useHungerStore()
const foodStore = useFoodStore()

const bestAction = computed(() => needsQueueStore.getBestAction())

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

.gps-needs-queue__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gps-needs-queue__item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--color-bg);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.gps-needs-queue__item--urgent {
  border-color: #f39c12;
  background: rgba(243, 156, 18, 0.1);
}

.gps-needs-queue__item--critical {
  border-color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
}

.gps-needs-queue__item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.gps-needs-queue__item-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.gps-needs-queue__item-value {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  opacity: 0.7;
}

.gps-needs-queue__item-urgency {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.gps-needs-queue__urgency-label {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  opacity: 0.7;
}

.gps-needs-queue__urgency-value {
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
}

.gps-needs-queue__item-priority {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  opacity: 0.7;
  font-weight: var(--font-weight-medium);
}

.gps-needs-queue__action {
  padding: 1rem;
  background: var(--color-bg);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-needs-queue__action-type {
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
  margin-block-end: 0.5rem;
}

.gps-needs-queue__action-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-block-end: 0.5rem;
  font-size: var(--font-size-sm);
}

.gps-needs-queue__action-reason {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  opacity: 0.7;
  font-style: italic;
}

.gps-needs-queue__hunger-status {
  margin-block-end: 1rem;
}

.gps-needs-queue__hunger-bar {
  width: 100%;
  height: 20px;
  background: var(--color-border);
  border-radius: 10px;
  overflow: hidden;
  margin-block-end: 0.5rem;
}

.gps-needs-queue__hunger-fill {
  height: 100%;
  background: var(--color-accent);
  transition: width 0.3s ease;
}

.gps-needs-queue__hunger-fill--urgent {
  background: #f39c12;
}

.gps-needs-queue__hunger-fill--critical {
  background: #e74c3c;
}

.gps-needs-queue__hunger-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: var(--font-size-sm);
  color: var(--color-text);
  opacity: 0.7;
}

.gps-needs-queue__fulfillment h5 {
  margin: 0 0 0.5rem 0;
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.gps-needs-queue__methods {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.gps-needs-queue__method {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--color-bg);
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
}

.gps-needs-queue__method-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.gps-needs-queue__method-emoji {
  font-size: 1.2em;
}

.gps-needs-queue__method-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.gps-needs-queue__method-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.gps-needs-queue__method-improvement {
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
}

.gps-needs-queue__method-available {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.8em;
}

.gps-needs-queue__method-priority {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.8em;
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
  
  .gps-needs-queue__item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .gps-needs-queue__item-urgency {
    align-items: flex-end;
  }
  
  .gps-needs-queue__hunger-info {
    flex-direction: row;
    justify-content: space-between;
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