<template>
  <SubNav 
    :isOpen="isOpen" 
    title="Cage Status"
    :useGrid="true"
    @close="$emit('close')"
  >
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
      label="Poop Per Cage"
      :value="`${Math.ceil(getPoopPercentage())}%`"
      :percentage="getPoopPercentage()"
    />

    <!-- Item Count -->
    <SubNavStatus
      label="Items in Cage"
      :value="`${cageStore.items.length}`"
      :percentage="getItemPercentage()"
    />
  </SubNav>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useCageStore } from '../../stores/cage'
import { usePoopStore } from '../../stores/poop'
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
const poopStore = usePoopStore()

// Calculate poop percentage based on available cells
const getPoopPercentage = () => {
  if (poopStore.availableCells === 0) return 0
  return Math.min((poopStore.poopCount / poopStore.maxPoopCount) * 100, 100)
}

// Calculate item percentage (max 10 items = 100%)
const getItemPercentage = () => {
  const maxItems = 10
  return Math.min((cageStore.items.length / maxItems) * 100, 100)
}
</script>
