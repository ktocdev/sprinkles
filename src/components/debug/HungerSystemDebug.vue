<template>
  <div class="gps-panel-section">
    <h3 class="gps-panel-section-title">🍽️ Hunger System</h3>
    
    <div class="gps-panel-controls">
      <FormGroup label="Enable Hunger Degradation">
        <Toggle 
          v-model="isHungerEnabled"
          @change="toggleHunger"
          aria-label="Toggle hunger degradation on and off"
        />
      </FormGroup>

      <FormGroup label="Degradation Rate (per minute)">
        <Input
          v-model="hungerDegradationPerMinute"
          type="number"
          :min="0"
          :max="20"
          :step="1"
          @update:modelValue="updateHungerDegradation"
          hint="Rate at which hunger decreases per minute"
        />
      </FormGroup>
      
      <FormGroup label="Current Hunger Value">
        <Input
          :model-value="Math.round(hungerStore.currentValue)"
          type="readonly"
          hint="Current hunger value (0-100)"
        />
      </FormGroup>

      <FormGroup label="Urgency Level">
        <Input
          :model-value="hungerUrgency"
          type="readonly"
          hint="Current urgency level (0-100%)"
        />
      </FormGroup>
      
      <FormGroup label="Reset Hunger">
        <Button 
          type="primary"
          @click="resetHunger"
          hint="Reset hunger value to 100"
        >
          🍽️ Reset to 100
        </Button>
      </FormGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Button from '../shared/Button.vue'
import FormGroup from '../shared/FormGroup.vue'
import Toggle from '../shared/Toggle.vue'
import Input from '../shared/Input.vue'
import { useHungerStore } from '../../stores/needs/hunger'
import { useNeedsQueueStore } from '../../stores/needs/needsQueue'

const hungerStore = useHungerStore()
const needsQueueStore = useNeedsQueueStore()

// Hunger system controls
const isHungerEnabled = ref(needsQueueStore.isActive)
const hungerDegradationPerMinute = ref((hungerStore.degradationRate * 60).toFixed(0))
const hungerUrgency = ref(Math.round(hungerStore.urgency))

function toggleHunger(enabled) {
  if (enabled) {
    needsQueueStore.startNeedsSystem()
  } else {
    needsQueueStore.stopNeedsSystem()
  }
}

function updateHungerDegradation() {
  // Convert per-minute rate back to per-second rate
  const perSecondRate = hungerDegradationPerMinute.value / 60
  hungerStore.setDegradationPerSecond(perSecondRate)
}

function resetHunger() {
  hungerStore.reset()
  // Also update the needs queue to reflect the reset
  needsQueueStore.updateQueue()
  // Small delay to ensure the reset takes effect
  setTimeout(() => {
    needsQueueStore.updateQueue()
  }, 100)
}

// Initialize hunger controls on mount
onMounted(() => {
  // Set initial hunger controls
  isHungerEnabled.value = needsQueueStore.isActive
  hungerDegradationPerMinute.value = (hungerStore.degradationRate * 60).toFixed(0)
  hungerUrgency.value = Math.round(hungerStore.urgency)
})

// Watch for changes in needs system state
watch(() => needsQueueStore.isActive, (newState) => {
  isHungerEnabled.value = newState
})

// Watch for changes in hunger urgency
watch(() => hungerStore.urgency, (newUrgency) => {
  hungerUrgency.value = Math.round(newUrgency)
})
</script>

<style>
/* Panel controls layout */
.gps-panel-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Panel section title - reduced top margin */
.gps-panel-section-title {
  margin-block-start: 0.5rem;
}

/* Desktop enhancements */
@media (min-width: 768px) {
  .gps-panel-controls {
    gap: 1rem;
  }
}
</style>