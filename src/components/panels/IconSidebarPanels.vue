<script setup>
import { defineProps, defineEmits } from 'vue'
import GuineaPig from '../guinea-pig/GuineaPig.vue'
import Panel from '../shared/Panel.vue'
import Market from '../market/Market.vue'
import CageInteractionPanel from './CageInteractionPanel.vue'

const props = defineProps({
  showGuineaPig: Boolean,
  showCageInteractions: Boolean,
  showMarket: Boolean
})

const emit = defineEmits(['closeGuineaPig', 'closeCageInteractions', 'closeMarket'])
</script>

<template>
  <Panel 
    :isOpen="showGuineaPig" 
    title="Guinea Pig Information" 
    @close="emit('closeGuineaPig')"
  >
    <GuineaPig />
  </Panel>

  <CageInteractionPanel 
    :isOpen="showCageInteractions"
    @close="emit('closeCageInteractions')"
  />

  <Panel 
    :isOpen="showMarket" 
    title="🐹 Guinea Pig Market" 
    @close="emit('closeMarket')"
  >
    <Market />
  </Panel>
</template> 