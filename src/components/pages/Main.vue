<script setup>
import { defineProps, defineEmits } from 'vue'
import GuineaPig from '../guinea-pig/GuineaPig.vue'
import Cage from '../cage/Cage.vue'
import StatusMarquee from '../cage/StatusMarquee.vue'
import CageItemManager from '../cage/CageItemManager.vue'
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
    <div class="gps-flex--justify-center">
      <div class="gps-container">
        <div class="gps-main__content-grid">
          <div class="gps-main__cage-container">
            <Cage class="gps-main__cage" />
            <StatusMarquee class="gps-main__status-marquee" />
          </div>
          <CageItemManager class="gps-main__cage-item-manager" />
        </div>
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
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1rem;
  justify-content: center;
}

.gps-main__cage-container {
  flex: 1;
  min-width: 380px;
  max-width: 600px;
}

.gps-main__cage-item-manager {
  flex: 1;
  min-width: 240px;
  max-width: 520px;
}

.gps-main__cage-container {
  display: flex;
  flex-direction: column;
}
</style> 