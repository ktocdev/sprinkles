<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from './stores/user'
import { useInventoryStore } from './stores/inventory'
import { useThemeStore } from './stores/theme'
import Main from './components/pages/Main.vue'
import TopBar from './components/navigation/TopBar.vue'
import IconSidebar from './components/navigation/IconSidebar.vue'
import Footer from './components/navigation/Footer.vue'
import SpecimenPanels from './components/panels/SpecimenPanels.vue'
import WelcomePanel from './components/panels/WelcomePanel.vue'
import ThemeExplorerPanel from './components/panels/ThemeExplorerPanel.vue'
import DebugPanel from './components/panels/DebugPanel.vue'

const userStore = useUserStore()
const inventoryStore = useInventoryStore()
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})

// Panel visibility state
const showInventory = ref(false)
const showGuineaPig = ref(false)
const showNeeds = ref(false)
const showCageStatus = ref(false)
const showCageInteractions = ref(false)
const showMarket = ref(false)

const specimenPanelsRef = ref(null)
const themeExplorerPanelRef = ref(null)
const debugPanelRef = ref(null)

// Panel state management
const panelStates = {
  inventory: showInventory,
  guineaPig: showGuineaPig,
  needs: showNeeds,
  cageStatus: showCageStatus,
  cageInteractions: showCageInteractions,
  market: showMarket
}

function togglePanel(panelName) {
  const isOpening = !panelStates[panelName].value
  
  // Close other panels when opening a new one
  if (isOpening) {
    Object.keys(panelStates).forEach(key => {
      if (key !== panelName) {
        panelStates[key].value = false
      }
    })
  }
  
  panelStates[panelName].value = !panelStates[panelName].value
}

function toggleInventory() {
  togglePanel('inventory')
}

function toggleGuineaPig() {
  togglePanel('guineaPig')
}

function toggleNeeds() {
  togglePanel('needs')
}

function toggleCageStatus() {
  togglePanel('cageStatus')
}

function toggleCageInteractions() {
  togglePanel('cageInteractions')
}

function toggleMarket() {
  togglePanel('market')
}

function handleGameReset() {
  // Reset all panel states
  Object.values(panelStates).forEach(state => state.value = false)
  // Reset specimen panels
  specimenPanelsRef.value?.toggleSpecimenLanding()
}

</script>

<template>
  <div class="gps-app">

    <TopBar 
      v-if="userStore.name" 
      @showDebug="debugPanelRef?.toggleDebugPanel()"
    />

    <div class="gps-app__main-layout">
      <IconSidebar
        :onInventory="toggleInventory"
        :onGuineaPig="toggleGuineaPig"
        :onNeeds="toggleNeeds"
        :onCageStatus="toggleCageStatus"
        :onCageInteractions="toggleCageInteractions"
        :onMarket="toggleMarket"
        :showInventory="showInventory"
        :showGuineaPig="showGuineaPig"
        :showNeeds="showNeeds"
        :showCageStatus="showCageStatus"
        :showCageInteractions="showCageInteractions"
        :showMarket="showMarket"
        @closeCageInteractions="showCageInteractions = false"
      />
      
      <div class="gps-app__content-area">
        <div class="gps-app__content-layout">
          <div class="gps-app__content-main">
            <Main 
              v-if="userStore.name"
              :userStore="userStore" 
              :inventoryStore="inventoryStore" 
              :showInventory="showInventory"
              :showGuineaPig="showGuineaPig"
              :showNeeds="showNeeds"
              :showCageStatus="showCageStatus"
              :showMarket="showMarket"
              @closeInventory="showInventory = false"
              @closeGuineaPig="showGuineaPig = false"
              @closeNeeds="showNeeds = false"
              @closeCageStatus="showCageStatus = false"
              @closeMarket="showMarket = false"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="gps-app__footer-wrapper">
      <Footer 
        v-if="userStore.name"
        @showSpecimenLanding="specimenPanelsRef?.toggleSpecimenLanding()"
        @showThemeExplorer="themeExplorerPanelRef?.toggleThemeExplorer()"
      />
    </div>

    <WelcomePanel />
    <SpecimenPanels ref="specimenPanelsRef" />
    <ThemeExplorerPanel ref="themeExplorerPanelRef" />
    <DebugPanel ref="debugPanelRef" @gameReset="handleGameReset" />
  </div>
</template>

<style>
@import './styles/shared.css';

.gps-app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.gps-app__main-layout {
  display: flex;
  flex: 1;
  min-height: 0;
  margin-inline-start: 60px;
  width: calc(100% - 60px);
}

.gps-app__content-area {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
  min-width: 0;
  padding-block-start: 80px; /* Account for TopBar height */
  padding-block-end: 80px; /* Account for Footer height */
}

.gps-app__content-layout {
  display: flex;
  max-width: 1200px;
  width: 100%;
  box-sizing: border-box;
  gap: 2rem;
}

.gps-app__content-main {
  flex: 1;
  min-width: 0;
}

.gps-app__footer-wrapper {
  width: 100%;
  box-sizing: border-box;
}

/* Responsive breakpoints */
@media (max-width: 1250px) {
  .gps-app__content-area {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .gps-app__main-layout {
    margin-inline-start: 50px;
    width: calc(100% - 50px);
  }
  
  .gps-app__content-area {
    padding: 1rem 0.75rem;
    padding-block-start: 70px;
    padding-block-end: 70px;
  }
  
  .gps-app__content-layout {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
