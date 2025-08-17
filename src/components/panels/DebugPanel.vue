<script setup>
import { ref } from 'vue'
import Panel from '../shared/Panel.vue'
import Details from '../shared/Details.vue'
import HungerSystemDebug from '../debug/HungerSystemDebug.vue'
import ThirstSystemDebug from '../debug/ThirstSystemDebug.vue'
import SleepSystemDebug from '../debug/SleepSystemDebug.vue'
import PoopSystemDebug from '../debug/PoopSystemDebug.vue'
import GameActionsDebug from '../debug/GameActionsDebug.vue'

const showDebugPanel = ref(false)

const emit = defineEmits(['gameReset'])

function toggleDebugPanel() {
  showDebugPanel.value = !showDebugPanel.value
}

function handleGameReset() {
  showDebugPanel.value = false
  emit('gameReset')
}

// Component logic moved to individual debug components

// Expose toggle function for external use
defineExpose({
  toggleDebugPanel
})
</script>

<template>
  <Panel 
    :isOpen="showDebugPanel" 
    title="🐛 Debug Panel" 
    @close="showDebugPanel = false"
  >
    <div class="gps-panel-content">
      <!-- Hunger System Section -->
      <Details>
        <template #summary>
          🍽️ Hunger System
        </template>
        <template #content>
          <HungerSystemDebug />
        </template>
      </Details>

      <!-- Thirst System Section -->
      <Details>
        <template #summary>
          💧 Thirst System
        </template>
        <template #content>
          <ThirstSystemDebug />
        </template>
      </Details>

      <!-- Sleep System Section -->
      <Details>
        <template #summary>
          💤 Sleep System
        </template>
        <template #content>
          <SleepSystemDebug />
        </template>
      </Details>
      
      <!-- Poop System Section -->
      <Details>
        <template #summary>
          💩 Poop System
        </template>
        <template #content>
          <PoopSystemDebug />
        </template>
      </Details>

      <!-- Game Actions Section -->
      <Details>
        <template #summary>
          ⚙️ Game Actions
        </template>
        <template #content>
          <GameActionsDebug @gameReset="handleGameReset" />
        </template>
      </Details>
    </div>
  </Panel>
</template>

<style>
/* DebugPanel specific styles - component styles moved to individual debug components */
</style> 