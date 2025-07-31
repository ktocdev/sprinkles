<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from './stores/user'
import { useThemeStore } from './stores/theme'
import Cage from './components/cage/Cage.vue'
import StatusMarquee from './components/cage/StatusMarquee.vue'
import CageItemManager from './components/cage/CageItemManager.vue'
import TopBar from './components/navigation/TopBar.vue'
import IconSidebar from './components/navigation/IconSidebar.vue'
import AppPanels from './components/panels/AppPanels.vue'

const userStore = useUserStore()
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})

const showGuineaPig = ref(false)
const showNeeds = ref(false)
const showCageStatus = ref(false)
const showCageInteractions = ref(false)
const showMarket = ref(false)

const appPanelsRef = ref(null)

function toggleNeeds() {
  // Close other subnav if open
  if (showCageStatus.value) {
    showCageStatus.value = false
  }
  showNeeds.value = !showNeeds.value
}

function toggleCageStatus() {
  // Close other subnav if open
  if (showNeeds.value) {
    showNeeds.value = false
  }
  showCageStatus.value = !showCageStatus.value
}

function toggleCageInteractions() {
  // Close all subnavs when opening modal
  showNeeds.value = false
  showCageStatus.value = false
  showCageInteractions.value = !showCageInteractions.value
}

function toggleGuineaPig() {
  // Close all subnavs when opening modal
  showNeeds.value = false
  showCageStatus.value = false
  showGuineaPig.value = !showGuineaPig.value
}

function toggleMarket() {
  // Close all subnavs when opening modal
  showNeeds.value = false
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
  showCageInteractions.value = false
  showMarket.value = false
  showNeeds.value = false
  showCageStatus.value = false
}

</script>

<template>
  <div class="gps-app">
    <TopBar v-if="userStore.name" />

    <div class="gps-app__main-layout">
      <IconSidebar 
        :showGuineaPig="showGuineaPig"
        :showNeeds="showNeeds"
        :showCageStatus="showCageStatus"
        :showCageInteractions="showCageInteractions"
        :showMarket="showMarket"
        @toggleGuineaPig="toggleGuineaPig"
        @toggleNeeds="toggleNeeds"
        @toggleCageStatus="toggleCageStatus"
        @toggleCageInteractions="toggleCageInteractions"
        @toggleMarket="toggleMarket"
        @toggleDebug="toggleDebug"
        @toggleDesign="toggleDesign"
        @closeNeeds="showNeeds = false"
        @closeCageStatus="showCageStatus = false"
      />
      
      <div class="gps-app__content-area">
        <div class="gps-main" v-if="userStore.name">
          <Cage />
          <StatusMarquee />
          <CageItemManager />
        </div>
      </div>
    </div>

    <AppPanels 
      ref="appPanelsRef"
      :showGuineaPig="showGuineaPig"
      :showCageInteractions="showCageInteractions"
      :showMarket="showMarket"
      @gameReset="handleGameReset"
      @closeGuineaPig="showGuineaPig = false"
      @closeCageInteractions="showCageInteractions = false"
      @closeMarket="showMarket = false"
    />
  </div>
</template>

<style>
@import './styles/shared.css';

.gps-app__main-layout {
  display: flex;
  flex: 1;
  margin-inline-start: 50px;
  width: calc(100% - 50px);
}

.gps-app__content-area {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 5rem 0;
}

/* Mobile-first responsive styles */
@media (min-width: 768px) {
  .gps-app__main-layout {
    margin-inline-start: 60px;
    width: calc(100% - 60px);
  }
}

</style>
