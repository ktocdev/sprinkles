<template>
  <SubNav 
    :isOpen="isOpen" 
    title="Cage Status"
    @close="$emit('close')"
  >
    <div class="gps-cage-status-subnav__content">
      <div class="gps-subnav__grid">
        <!-- Bedding Freshness -->
        <SubNavStatus
          label="Bedding Freshness"
          :value="`${cageStore.beddingFreshness}%`"
          :percentage="cageStore.beddingFreshness"
        />

        <!-- Water Level -->
        <SubNavStatus
          label="Water Level"
          :value="`${cageStore.waterLevel}%`"
          :percentage="cageStore.waterLevel"
        />

        <!-- Habitat Value -->
        <SubNavStatus
          label="Habitat Value"
          :value="`${cageStore.habitatValue}%`"
          :percentage="cageStore.habitatValue"
        />

        <!-- Poop Count -->
        <SubNavStatus
          label="Poop Count"
          :value="cageStore.poop.length"
          :percentage="getPoopPercentage()"
        />

        <!-- Item Count -->
        <SubNavStatus
          label="Items in Cage"
          :value="cageStore.items.length"
          :percentage="getItemPercentage()"
        />
      </div>
    </div>
  </SubNav>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useCageStore } from '../../stores/cage'
import SubNav from '../navigation/SubNav.vue'
import SubNavStatus from '../navigation/SubNavStatus.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const cageStore = useCageStore()

// Calculate poop percentage (max 20 poops = 100%)
const getPoopPercentage = () => {
  const maxPoops = 20
  return Math.min((cageStore.poop.length / maxPoops) * 100, 100)
}

// Calculate item percentage (max 10 items = 100%)
const getItemPercentage = () => {
  const maxItems = 10
  return Math.min((cageStore.items.length / maxItems) * 100, 100)
}
</script>

<style>
</style> 