<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from './stores/user'
import { useThemeStore } from './stores/theme'
import { useInventoryStore } from './stores/inventory'
import { useNeedsQueueStore } from './stores/needs/core/needsQueue'
import { useStatisticsStore } from './stores/statistics'
import { useGameControllerStore } from './stores/gameController'
import Cage from './components/cage/Cage.vue'
import StatusMarquee from './components/statuses/StatusMarquee.vue'
import CageNeedsStatus from './components/statuses/CageNeedsStatus.vue'
import CageItemManager from './components/cage/CageItemManager.vue'
import NeedsList from './components/statuses/NeedsList.vue'
import TopBar from './components/navigation/TopBar.vue'
import IconSidebar from './components/navigation/IconSidebar.vue'
import AppPanels from './components/panels/AppPanels.vue'
import { useNeedsList } from './composables/useNeedsList'

const userStore = useUserStore()
const themeStore = useThemeStore()
const inventoryStore = useInventoryStore()
const needsQueueStore = useNeedsQueueStore()
const statisticsStore = useStatisticsStore()
const gameControllerStore = useGameControllerStore()

// Needs list data
const { needsItems } = useNeedsList()

let statisticsVisibilityListener = null

onMounted(() => {
  themeStore.initTheme()
  
  // Initialize the game controller first (includes Page Visibility API)
  gameControllerStore.initialize()
  
  // Always start needs system on page load
  // The debug panel can be used to toggle it off if needed
  needsQueueStore.startNeedsSystem()
  
  // Start session tracking
  statisticsStore.startSession()
  
  // Set up statistics visibility listener (separate from game controller)
  statisticsVisibilityListener = () => {
    if (document.hidden) {
      statisticsStore.pauseSession()
    } else {
      statisticsStore.startSession()
    }
  }
  document.addEventListener('visibilitychange', statisticsVisibilityListener)
})

onUnmounted(() => {
  // Clean up game controller
  gameControllerStore.cleanup()
  
  // Clean up statistics listener
  if (statisticsVisibilityListener) {
    document.removeEventListener('visibilitychange', statisticsVisibilityListener)
  }
})

// End session on page unload
window.addEventListener('beforeunload', () => {
  statisticsStore.endSession()
})

const showGuineaPig = ref(false)
const showStatistics = ref(false)
const showMarket = ref(false)

const appPanelsRef = ref(null)

function toggleGuineaPig() {
  showGuineaPig.value = !showGuineaPig.value
}

function toggleStatistics() {
  showStatistics.value = !showStatistics.value
}

function openGuineaPigInfo() {
  showGuineaPig.value = true
}

function toggleMarket() {
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
  showMarket.value = false
}

</script>

<template>
  <div class="gps-app">
    <TopBar v-if="userStore.name" @openGuineaPigInfo="openGuineaPigInfo" @gameReset="handleGameReset" />
    

    <div class="gps-app__main-layout">
      <IconSidebar 
        :showStatistics="showStatistics"
        :showMarket="showMarket"
        @toggleStatistics="toggleStatistics"
        @toggleMarket="toggleMarket"
        @toggleDebug="toggleDebug"
        @toggleDesign="toggleDesign"
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
            <CageNeedsStatus />
            <CageItemManager />
          </div>
        </div>
      </div>
    </div>

    <AppPanels 
      ref="appPanelsRef"
      :showStatistics="showStatistics"
      :showGuineaPig="showGuineaPig"
      :showMarket="showMarket"
      @gameReset="handleGameReset"
      @closeStatistics="showStatistics = false"
      @closeGuineaPig="showGuineaPig = false"
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

.gps-app__main-wrapper {
  display: flex; 
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  position: relative;
  width: 100%;
}

@media (min-width: 768px) {
  .gps-app__main-layout {
    margin-inline-start: 70px;
    width: calc(100% - 70px);
  }

  .gps-app__main-wrapper {
    padding: 4rem;
    top: 64px;
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
