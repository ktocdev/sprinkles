<template>
  <SubNav 
    :isOpen="isOpen" 
    title="Guinea Pig Needs"
    :useGrid="true"
    @close="$emit('close')"
  >
    <SubNavStatus
      v-for="(value, need) in guineaPigStore.needs" 
      :key="need"
      :label="formatNeedLabel(need)"
      :value="`${value}%`"
      :percentage="value"
      :color="getNeedColor(need)"
    />
  </SubNav>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useGuineaPigStore } from '../../stores/guineaPig'
import SubNav from '../navigation/SubNav.vue'
import SubNavStatus from '../navigation/SubNavStatus.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const guineaPigStore = useGuineaPigStore()

// Function to get color for different needs
const getNeedColor = (need) => {
  const colors = {
    hunger: '#e74c3c',      // Red
    thirst: '#3498db',      // Blue
    shelter: '#95a5a6',     // Gray
    chew: '#f39c12',        // Orange
    enrichment: '#9b59b6',  // Purple
    love: '#e91e63',        // Pink
    nails: '#16a085',       // Teal
    hygiene: '#2ecc71'      // Green
  }
  return colors[need] || 'var(--color-accent)'
}

// Format need label for display
const formatNeedLabel = (need) => {
  return need.charAt(0).toUpperCase() + need.slice(1)
}
</script>
