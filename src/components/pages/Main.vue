<script setup>
import { defineProps, defineEmits } from 'vue'
import Cage from '../cage/Cage.vue'
import StatusMarquee from '../cage/StatusMarquee.vue'
import CageItemManager from '../cage/CageItemManager.vue'
import IconSidebarPanels from '../panels/IconSidebarPanels.vue'
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
    <IconSidebarPanels 
      :showInventory="showInventory"
      :showGuineaPig="showGuineaPig"
      :showNeeds="showNeeds"
      :showCageStatus="showCageStatus"
      :showMarket="showMarket"
      @closeInventory="emit('closeInventory')"
      @closeGuineaPig="emit('closeGuineaPig')"
      @closeNeeds="emit('closeNeeds')"
      @closeCageStatus="emit('closeCageStatus')"
      @closeMarket="emit('closeMarket')"
    />
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