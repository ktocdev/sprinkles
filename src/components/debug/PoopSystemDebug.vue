<template>
  <div class="gps-panel-section">
    <h3 class="gps-panel-section-title">💩 Poop System</h3>
    
    <div class="gps-panel-controls">
      <FormGroup label="Enable Pooping">
        <Toggle 
          v-model="isPoopingEnabled"
          @change="togglePooping"
          aria-label="Toggle pooping on and off"
        />
      </FormGroup>
      
      <FormGroup label="Min Time (seconds)">
        <Input
          v-model="minPoopInterval"
          type="number"
          :min="1"
          :max="30"
          :step="1"
          @update:modelValue="updatePoopInterval"
          hint="Minimum time between poops in seconds"
        />
      </FormGroup>
      
      <FormGroup label="Max Time (seconds)">
        <Input
          v-model="maxPoopInterval"
          type="number"
          :min="1"
          :max="30"
          :step="1"
          @update:modelValue="updatePoopInterval"
          hint="Maximum time between poops in seconds"
        />
      </FormGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import FormGroup from '../shared/FormGroup.vue'
import Toggle from '../shared/Toggle.vue'
import Input from '../shared/Input.vue'
import { usePoopStore } from '../../stores/poop'

const poopStore = usePoopStore()

// Poop system controls
const isPoopingEnabled = ref(poopStore.isEnabled)
const minPoopInterval = ref(5) // 5 seconds default
const maxPoopInterval = ref(12) // 12 seconds default

function togglePooping(enabled) {
  if (enabled) {
    poopStore.enablePoopSystem()
  } else {
    poopStore.disablePoopSystem()
  }
}

function updatePoopInterval() {
  // Convert seconds to milliseconds and update the base interval
  const minMs = minPoopInterval.value * 1000
  const maxMs = maxPoopInterval.value * 1000
  const baseInterval = (minMs + maxMs) / 2
  poopStore.setPoopInterval(baseInterval)
}

// Initialize poop controls on mount
onMounted(() => {
  // Set initial values based on current store state
  isPoopingEnabled.value = poopStore.isEnabled
  updatePoopInterval()
})

// Watch for changes in the poop system enabled state
watch(() => poopStore.isEnabled, (newState) => {
  isPoopingEnabled.value = newState
})

// Watch for changes in min/max intervals and update the store
watch([minPoopInterval, maxPoopInterval], () => {
  updatePoopInterval()
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