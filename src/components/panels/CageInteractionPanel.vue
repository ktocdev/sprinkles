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
        </div>
      </div>
    </div>
  </Panel>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useCageStore } from '../../stores/cage'
import { useWaterStore } from '../../stores/needs/cage/water'
import { useBeddingStore } from '../../stores/needs/cage/bedding'
import { useCleanlinessStore } from '../../stores/needs/cage/cleanliness'
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
const waterStore = useWaterStore()
const beddingStore = useBeddingStore()
const cleanlinessStore = useCleanlinessStore()

function handleRefreshWater() {
  const result = waterStore.fulfill('refresh_water')
  if (result.success) {
    emit('close')
  }
}

function handleRefreshBedding() {
  const result = beddingStore.fulfill('refresh_bedding')
  if (result.success) {
    emit('close')
  }
}

function handleCleanPoop() {
  const result = cleanlinessStore.fulfill('clean_cage')
  if (result.success) {
    emit('close')
  }
}
</script>

 