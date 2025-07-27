<script setup>
import { defineProps, defineEmits } from 'vue'
import GuineaPig from '../guinea-pig/GuineaPig.vue'
import Cage from '../cage/Cage.vue'
import Panel from '../shared/Panel.vue'
import Needs from '../guinea-pig/Needs.vue'
import Inventory from '../inventory/Inventory.vue'
import CageStatus from '../cage/CageStatus.vue'
import Market from '../market/Market.vue'
import { useGuineaPigStore } from '../../stores/guineaPig'

const guineaPigStore = useGuineaPigStore()

const props = defineProps({
  userStore: Object,
  inventoryStore: Object,
  showInventory: Boolean,
  showGuineaPig: Boolean,
  showNeeds: Boolean,
  showCageStatus: Boolean,
  showMarket: Boolean
})

const emit = defineEmits(['closeInventory', 'closeGuineaPig', 'closeNeeds', 'closeCageStatus', 'closeMarket'])
</script>

<template>
  <div class="gps-main">
    <div class="gps-main__content-grid gps-flex--justify-center">
      <div class="gps-main__content-cage gps-container">
        <Cage class="gps-main__cage" />
      </div>
    </div>

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
  </div>
</template>

<style>
.gps-main__content-grid {
  margin-block-start: 2em;
}

.gps-main__content-cage {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}




</style> 