<template>
  <div class="gps-panel-section">
    <h3 class="gps-panel-section-title">💧 Thirst System</h3>
    
    <div class="gps-panel-controls">
      <FormGroup label="Simulate Drinking Behavior">
        <Button 
          type="primary"
          @click="getDrink"
          hint="Trigger autonomous drinking behavior - guinea pig will walk to water bottle"
        >
          💧 Get a Drink
        </Button>
      </FormGroup>

      <FormGroup label="Enable Thirst Degradation">
        <Toggle 
          v-model="isThirstEnabled"
          @change="toggleThirst"
          aria-label="Toggle thirst degradation on and off"
        />
      </FormGroup>

      <FormGroup label="Degradation Rate (per minute)">
        <Input
          v-model="thirstDegradationPerMinute"
          type="number"
          :min="0"
          :max="20"
          :step="1"
          @update:modelValue="updateThirstDegradation"
          hint="Rate at which thirst decreases per minute"
        />
      </FormGroup>
      
      <FormGroup label="Current Thirst Value">
        <Input
          :model-value="Math.round(thirstStore.currentValue)"
          type="readonly"
          hint="Current thirst value (0-100)"
        />
      </FormGroup>

      <FormGroup label="Urgency Level">
        <Input
          :model-value="thirstUrgency"
          type="readonly"
          hint="Current urgency level (0-100%)"
        />
      </FormGroup>
      
      <FormGroup label="Reset Thirst">
        <Button 
          type="primary"
          @click="resetThirst"
          hint="Reset thirst value to 100"
        >
          💧 Reset to 100
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
import { useThirstStore } from '../../stores/needs/individual/thirst'
import { useGuineaPigStore } from '../../stores/guineaPig'
import { useNeedsQueueStore } from '../../stores/needs/core/needsQueue'

const thirstStore = useThirstStore()
const guineaPigStore = useGuineaPigStore()
const needsQueueStore = useNeedsQueueStore()

// Thirst system controls
const isThirstEnabled = ref(needsQueueStore.isActive)
const thirstDegradationPerMinute = ref((thirstStore.degradationRate * 60).toFixed(0))
const thirstUrgency = ref(Math.round(thirstStore.urgency))

function toggleThirst(enabled) {
  if (enabled) {
    needsQueueStore.startNeedsSystem()
  } else {
    needsQueueStore.stopNeedsSystem()
  }
}

function updateThirstDegradation() {
  // Convert per-minute rate back to per-second rate
  const perSecondRate = thirstDegradationPerMinute.value / 60
  thirstStore.setDegradationPerSecond(perSecondRate)
}

function resetThirst() {
  thirstStore.reset()
  // Also update the needs queue to reflect the reset
  needsQueueStore.updateQueue()
  // Small delay to ensure the reset takes effect
  setTimeout(() => {
    needsQueueStore.updateQueue()
  }, 100)
}

async function getDrink() {
  // Set thirst to trigger autonomous drinking behavior
  thirstStore.currentValue = 65  // Below 70% threshold to trigger autonomy
  
  // Update the needs queue to reflect the change
  needsQueueStore.updateQueue()
  
  console.log('💧 [DEBUG] Thirst reduced to trigger autonomous drinking behavior - guinea pig should walk to water bottle')
  
  // Update queue again after a short delay to ensure changes propagate
  setTimeout(() => {
    needsQueueStore.updateQueue()
  }, 100)
}

// Initialize thirst controls on mount
onMounted(() => {
  // Set initial thirst controls
  isThirstEnabled.value = needsQueueStore.isActive
  thirstDegradationPerMinute.value = (thirstStore.degradationRate * 60).toFixed(0)
  thirstUrgency.value = Math.round(thirstStore.urgency)
})

// Watch for changes in needs system state
watch(() => needsQueueStore.isActive, (newState) => {
  isThirstEnabled.value = newState
})

// Watch for changes in thirst urgency
watch(() => thirstStore.urgency, (newUrgency) => {
  thirstUrgency.value = Math.round(newUrgency)
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