<script setup>
import { defineProps, defineEmits } from 'vue'
import Statistics from '../statistics/Statistics.vue'
import GuineaPig from '../guinea-pig/GuineaPig.vue'
import Panel from '../shared/Panel.vue'
import Market from '../market/Market.vue'

const props = defineProps({
  showStatistics: Boolean,
  showGuineaPig: Boolean,
  showMarket: Boolean
})

const emit = defineEmits(['closeStatistics', 'closeGuineaPig', 'closeMarket'])
</script>

<template>
  <Panel 
    :isOpen="showStatistics" 
    title="📈 Statistics & Progress" 
    @close="emit('closeStatistics')"
  >
    <Statistics />
  </Panel>

  <Panel 
    :isOpen="showGuineaPig" 
    title="Guinea Pig Information" 
    @close="emit('closeGuineaPig')"
  >
    <GuineaPig />
  </Panel>

  <Panel 
    :isOpen="showMarket" 
    title="🐹 Guinea Pig Market" 
    @close="emit('closeMarket')"
  >
    <Market />
  </Panel>
</template> 