<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from './stores/user'
import { useThemeStore } from './stores/theme'
import { useInventoryStore } from './stores/inventory'
import { useNeedsQueueStore } from './stores/needs/needsQueue'
import { useStatisticsStore } from './stores/statistics'
import Cage from './components/cage/Cage.vue'
import StatusMarquee from './components/statuses/StatusMarquee.vue'
import CageItemManager from './components/cage/CageItemManager.vue'
import NeedsList from './components/shared/NeedsList.vue'
import TopBar from './components/navigation/TopBar.vue'
import IconSidebar from './components/navigation/IconSidebar.vue'
import AppPanels from './components/panels/AppPanels.vue'
import { useNeedsList } from './composables/useNeedsList'

const userStore = useUserStore()
const themeStore = useThemeStore()
const inventoryStore = useInventoryStore()
const needsQueueStore = useNeedsQueueStore()
const statisticsStore = useStatisticsStore()

// Needs list data
const { needsItems } = useNeedsList()

onMounted(() => {
  themeStore.initTheme()
  
  // Always start needs system on page load
  // The debug panel can be used to toggle it off if needed
  needsQueueStore.startNeedsSystem()
  
  // Start session tracking
  statisticsStore.startSession()
})

// Handle session pausing/resuming based on page visibility
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    statisticsStore.pauseSession()
  } else {
    statisticsStore.startSession()
  }
})

// End session on page unload
window.addEventListener('beforeunload', () => {
  statisticsStore.endSession()
})

const showGuineaPig = ref(false)
const showStatistics = ref(false)
const showCageStatus = ref(false)
const showCageInteractions = ref(false)
const showMarket = ref(false)

const appPanelsRef = ref(null)

function toggleCageStatus() {
  showCageStatus.value = !showCageStatus.value
}

function toggleCageInteractions() {
  // Close all subnavs when opening modal
  showCageStatus.value = false
  showCageInteractions.value = !showCageInteractions.value
}

function toggleGuineaPig() {
  // Close all subnavs when opening modal
  showCageStatus.value = false
  showGuineaPig.value = !showGuineaPig.value
}

function toggleStatistics() {
  // Close all subnavs when opening modal
  showCageStatus.value = false
  showStatistics.value = !showStatistics.value
}

function openGuineaPigInfo() {
  // Close all subnavs when opening modal from TopBar logo
  showCageStatus.value = false
  showGuineaPig.value = true
}

function toggleMarket() {
  // Close all subnavs when opening modal
  showCageStatus.value = false
  showMarket.value = !showMarket.value
}

function toggleDebug() {
  // Debug panel is handled by ref in AppPanels
  appPanelsRef.value?.debugPanelRef?.toggleDebugPanel()
}

function toggleDesign() {
  // Design panel is handled by ref in AppPanels
  appPanelsRef.value?.designToolPanelRef?.toggleDesignToolPanel()
}

function handleGameReset() {
  // Reset all panel states
  showGuineaPig.value = false
  showStatistics.value = false
  showCageInteractions.value = false
  showMarket.value = false
  showCageStatus.value = false
}

</script>

<template>
  <div class="gps-app">
    <TopBar v-if="userStore.name" @openGuineaPigInfo="openGuineaPigInfo" @gameReset="handleGameReset" />
    

    <div class="gps-app__main-layout">
      <IconSidebar 
        :showStatistics="showStatistics"
        :showCageStatus="showCageStatus"
        :showCageInteractions="showCageInteractions"
        :showMarket="showMarket"
        @toggleStatistics="toggleStatistics"
        @toggleCageStatus="toggleCageStatus"
        @toggleCageInteractions="toggleCageInteractions"
        @toggleMarket="toggleMarket"
        @toggleDebug="toggleDebug"
        @toggleDesign="toggleDesign"
        @closeCageStatus="showCageStatus = false"
      />
      
      <div class="gps-app__main-wrapper" v-if="userStore.name">
        <div class="gps-app__main">
          <div class="gps-app__cage-area">
            <div>
              <Cage />
              <StatusMarquee />
            </div>
            <NeedsList 
              :items="needsItems"
              :showUrgency="true"
            />
            <CageItemManager />
          </div>
        </div>
      </div>
    </div>

    <AppPanels 
      ref="appPanelsRef"
      :showStatistics="showStatistics"
      :showGuineaPig="showGuineaPig"
      :showCageInteractions="showCageInteractions"
      :showMarket="showMarket"
      @gameReset="handleGameReset"
      @closeStatistics="showStatistics = false"
      @closeGuineaPig="showGuineaPig = false"
      @closeCageInteractions="showCageInteractions = false"
      @closeMarket="showMarket = false"
    />
  </div>
</template>

<style>

.gps-app__main-layout {
  display: flex;
  flex: 1;
  margin-inline-start: 40px;
  width: calc(100% - 40px);
}

@media (min-width: 768px) {
  .gps-app__main-layout {
    margin-inline-start: 70px;
    width: calc(100% - 70px);
  }
}

.gps-app__main-wrapper {
  display: flex; 
  align-items: center;
  justify-content: center;
  padding: 1rem;
  width: 100%;
}

@media (min-width: 800px) {
  .gps-app__main-wrapper {
     padding: 2rem;
  }
}
  
@media (min-width: 1024px) {
  .gps-app__main-wrapper {
     padding: 4rem;
  }
}

.gps-app__main {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
}

.gps-app__cage-area {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: flex-start;
    width: 100%;
    justify-content: center;
}
</style>
