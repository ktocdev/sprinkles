<template>
  <Panel 
    :isOpen="isOpen" 
    title="🛠️ Cage Interactions"
    @close="$emit('close')"
  >
    <div class="gps-panel-content">
      <div class="gps-panel-section">
        <div class="gps-panel-actions">
          <div class="gps-panel-action-item">
            <Button 
              type="primary"
              @click="handleRefreshWater"
              class="gps-panel-action-button"
            >
              💧 Refresh Water
            </Button>
            <p class="gps-panel-action-description">
              Refill the water bottle to ensure your guinea pig has fresh, clean water to drink.
            </p>
          </div>
          
          <div class="gps-panel-action-item">
            <Button 
              type="primary"
              @click="handleRefreshBedding"
              class="gps-panel-action-button"
            >
              🛏️ Refresh Bedding
            </Button>
            <p class="gps-panel-action-description">
              Replace the bedding with fresh material to keep the cage clean and comfortable.
            </p>
          </div>
          
          <div class="gps-panel-action-item">
            <Button 
              type="warning"
              @click="handleCleanPoop"
              class="gps-panel-action-button"
            >
              🧹 Clean Poop
            </Button>
            <p class="gps-panel-action-description">
              Remove waste from the cage to maintain a clean and healthy environment for your guinea pig.
            </p>
          </div>
          
          <div class="gps-panel-action-item">
            <Button 
              type="secondary"
              @click="handleManageItems"
              class="gps-panel-action-button"
            >
              📦 Manage Items
            </Button>
            <p class="gps-panel-action-description">
              Add or remove items from the cage to customize your guinea pig's living space.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Panel>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useCageStore } from '../../stores/cage'
import Panel from '../shared/Panel.vue'
import Button from '../shared/Button.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const cageStore = useCageStore()

function handleRefreshWater() {
  cageStore.refreshWater()
  emit('close')
}

function handleRefreshBedding() {
  cageStore.refreshBedding()
  emit('close')
}

function handleCleanPoop() {
  cageStore.cleanCage()
  emit('close')
}

function handleManageItems() {
  emit('close')
}
</script>

<style>
/* Cage interaction panel specific styles are now consolidated in Panel.vue */
</style> 