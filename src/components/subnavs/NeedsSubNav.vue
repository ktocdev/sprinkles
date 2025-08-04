<template>
  <SubNav 
    :isOpen="isOpen" 
    title="Guinea Pig Needs"
    :useGrid="true"
    @close="$emit('close')"
  >
    <SubNavStatus
      v-for="(needInfo, need) in needsStatus" 
      :key="need"
      :label="formatNeedLabel(need)"
      :value="`${needInfo.value}%`"
      :percentage="needInfo.value"
      :color="getNeedColor(need)"
    />
  </SubNav>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { useNeedsStore } from '../../stores/needs/needs'
import { useHungerStore } from '../../stores/needs/hunger'
import SubNav from '../navigation/SubNav.vue'
import SubNavStatus from '../navigation/SubNavStatus.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const needsStore = useNeedsStore()
const hungerStore = useHungerStore()

// Get needs status from individual stores
const needsStatus = computed(() => {
  return {
    hunger: {
      value: Math.round(hungerStore.currentValue),
      urgency: hungerStore.urgency
    },
    // For now, use legacy values for other needs until individual stores are created
    thirst: { value: needsStore.needs.thirst, urgency: 0 },
    shelter: { value: needsStore.needs.shelter, urgency: 0 },
    chew: { value: needsStore.needs.chew, urgency: 0 },
    enrichment: { value: needsStore.needs.enrichment, urgency: 0 },
    love: { value: needsStore.needs.love, urgency: 0 },
    nails: { value: needsStore.needs.nails, urgency: 0 },
    hygiene: { value: needsStore.needs.hygiene, urgency: 0 }
  }
})

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
