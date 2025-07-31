<script setup>
import { defineProps, defineEmits } from 'vue'
import GuineaPig from '../guinea-pig/GuineaPig.vue'
import Panel from '../shared/Panel.vue'
import Needs from '../guinea-pig/Needs.vue'
import Inventory from '../inventory/Inventory.vue'
import CageStatus from '../cage/CageStatus.vue'
import Market from '../market/Market.vue'

const props = defineProps({
  showInventory: Boolean,
  showGuineaPig: Boolean,
  showNeeds: Boolean,
  showCageStatus: Boolean,
  showMarket: Boolean
})

const emit = defineEmits(['closeInventory', 'closeGuineaPig', 'closeNeeds', 'closeCageStatus', 'closeMarket'])
</script>

<template>
  <!-- Modal Panels -->
  <Panel 
    :isOpen="showInventory" 
    title="Your Inventory" 
    @close="emit('closeInventory')"
  >
    <Inventory />
  </Panel>

  <Panel 
    :isOpen="showGuineaPig" 
    title="Guinea Pig Information" 
    @close="emit('closeGuineaPig')"
  >
    <GuineaPig />
  </Panel>

  <Panel 
    :isOpen="showNeeds" 
    title="Guinea Pig Needs" 
    @close="emit('closeNeeds')"
  >
    <Needs />
  </Panel>

  <Panel 
    :isOpen="showCageStatus" 
    title="Cage Status" 
    @close="emit('closeCageStatus')"
  >
    <CageStatus />
  </Panel>

  <Panel 
    :isOpen="showMarket" 
    title="🐹 Guinea Pig Market" 
    @close="emit('closeMarket')"
  >
    <Market />
  </Panel>
</template> 