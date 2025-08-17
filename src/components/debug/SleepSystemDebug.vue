<template>
  <div class="gps-panel-section">
    <h3 class="gps-panel-section-title">💤 Sleep System</h3>
    
    <div class="gps-panel-controls">
      <FormGroup label="Simulate Sleep Behavior">
        <Button 
          type="primary"
          @click="sendToBed"
          hint="Trigger sleep-seeking behavior (simulates 80% sleep need)"
        >
          💤 Send to Bed
        </Button>
      </FormGroup>

      <FormGroup label="Enable Sleep Degradation">
        <Toggle 
          v-model="isSleepEnabled"
          @change="toggleSleep"
          aria-label="Toggle sleep degradation on and off"
        />
      </FormGroup>
      
      <FormGroup label="Sleep Degradation (per minute)">
        <Input
          v-model="sleepDegradationPerMinute"
          type="number"
          :min="0"
          :max="20"
          :step="1"
          @update:modelValue="updateSleepDegradation"
          hint="Rate at which sleep decreases per minute"
        />
      </FormGroup>
      
      <FormGroup label="Current Sleep Value">
        <Input
          :model-value="Math.round(sleepStore.currentValue)"
          type="readonly"
          hint="Current sleep value (0-100)"
        />
      </FormGroup>

      <FormGroup label="Urgency Level">
        <Input
          :model-value="sleepUrgency"
          type="readonly"
          hint="Current urgency level (0-100%)"
        />
      </FormGroup>
      
      <FormGroup label="Reset Sleep">
        <Button 
          type="primary"
          @click="resetSleep"
          hint="Reset sleep value to 100"
        >
          💤 Reset to 100
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
import { useSleepStore } from '../../stores/needs/individual/sleep'
import { useGuineaPigStore } from '../../stores/guineaPig'
import { useNeedsQueueStore } from '../../stores/needs/core/needsQueue'

const sleepStore = useSleepStore()
const guineaPigStore = useGuineaPigStore()
const needsQueueStore = useNeedsQueueStore()

// Sleep system controls
const isSleepEnabled = ref(needsQueueStore.isActive)
const sleepDegradationPerMinute = ref((sleepStore.degradationRate * 60).toFixed(0))
const sleepUrgency = ref(Math.round(sleepStore.urgency))

function toggleSleep(enabled) {
  if (enabled) {
    needsQueueStore.startNeedsSystem()
  } else {
    needsQueueStore.stopNeedsSystem()
  }
}

function updateSleepDegradation() {
  // Convert per-minute rate back to per-second rate
  const perSecondRate = sleepDegradationPerMinute.value / 60
  sleepStore.setDegradationPerSecond(perSecondRate)
}

async function sendToBed() {
  // Set sleep to 80% to trigger sleep-seeking behavior
  sleepStore.currentValue = 80
  
  // Update the needs queue to reflect the change
  needsQueueStore.updateQueue()
  
  // Trigger the proactive sleep behavior
  try {
    await guineaPigStore.handleProactiveSleepBehavior()
    console.log('💤 [DEBUG] Sleep behavior triggered - guinea pig should seek bed')
  } catch (error) {
    console.warn('💤 [DEBUG] Failed to trigger sleep behavior:', error)
  }
  
  // Update queue again after a short delay to ensure changes propagate
  setTimeout(() => {
    needsQueueStore.updateQueue()
  }, 100)
}

function resetSleep() {
  sleepStore.reset()
  // Also update the needs queue to reflect the reset
  needsQueueStore.updateQueue()
  // Small delay to ensure the reset takes effect
  setTimeout(() => {
    needsQueueStore.updateQueue()
  }, 100)
}

// Initialize sleep controls on mount
onMounted(() => {
  // Set initial sleep controls
  isSleepEnabled.value = needsQueueStore.isActive
  sleepDegradationPerMinute.value = (sleepStore.degradationRate * 60).toFixed(0)
  sleepUrgency.value = Math.round(sleepStore.urgency)
})

// Watch for changes in needs system state
watch(() => needsQueueStore.isActive, (newState) => {
  isSleepEnabled.value = newState
})

// Watch for changes in sleep urgency
watch(() => sleepStore.urgency, (newUrgency) => {
  sleepUrgency.value = Math.round(newUrgency)
})
</script>

<style>
/* Uses existing panel styles from HungerSystemDebug */
</style>