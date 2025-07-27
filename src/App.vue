<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from './stores/user'
import { useInventoryStore } from './stores/inventory'
import { useGuineaPigStore } from './stores/guineaPig'
import { useCageStore } from './stores/cage'
import { useThemeStore } from './stores/theme'
import { useMarketStore } from './stores/market'
import Welcome from './components/pages/Welcome.vue'
import Main from './components/pages/Main.vue'
import TopBar from './components/navigation/TopBar.vue'
import IconSidebar from './components/navigation/IconSidebar.vue'
import SidebarSubNav from './components/navigation/SidebarSubNav.vue'
import Panel from './components/shared/Panel.vue'
import Footer from './components/navigation/Footer.vue'
import SpecimenLanding from './components/specimen/SpecimenLanding.vue'
import ButtonSpecimen from './components/specimen/ButtonSpecimen.vue'
import DropdownSpecimen from './components/specimen/DropdownSpecimen.vue'
import ModalSpecimen from './components/specimen/ModalSpecimen.vue'
import StatusBarSpecimen from './components/specimen/StatusBarSpecimen.vue'
import InputSpecimen from './components/specimen/InputSpecimen.vue'
import FormGroupSpecimen from './components/specimen/FormGroupSpecimen.vue'
import ToggleSpecimen from './components/specimen/ToggleSpecimen.vue'
import Market from './components/market/Market.vue'
import ThemeExplorer from './components/shared/ThemeExplorer.vue'
import DebugPanel from './components/shared/DebugPanel.vue'

const userStore = useUserStore()
const inventoryStore = useInventoryStore()
const guineaPigStore = useGuineaPigStore()
const cageStore = useCageStore()
const themeStore = useThemeStore()
const marketStore = useMarketStore()
const nameInput = ref('')

onMounted(() => {
  themeStore.initTheme()
})

function submitName() {
  if (nameInput.value.trim()) {
    userStore.name = nameInput.value.trim()
  }
}

function resetGame() {
  if (window.confirm('Are you sure you want to reset your game? This cannot be undone.')) {
    userStore.$reset()
    inventoryStore.$reset()
    guineaPigStore.$reset()
    cageStore.$reset()
    marketStore.$reset()
    // Remove persisted state from localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('inventory')
    localStorage.removeItem('guineaPig')
    localStorage.removeItem('cage')
    localStorage.removeItem('market')
    // Reset panel states
    showInventory.value = false
    showGuineaPig.value = false
    showNeeds.value = false
    showCageStatus.value = false
    showCageInteractions.value = false
    showMarket.value = false
    showDebugPanel.value = false
    // Reset name input
    nameInput.value = ''
  }
}

// Panel visibility state
const showInventory = ref(false)
const showGuineaPig = ref(false)
const showNeeds = ref(false)
const showCageStatus = ref(false)
const showCageInteractions = ref(false)
const showMarket = ref(false)
const showSpecimenLanding = ref(false)
const showButtonSpecimen = ref(false)
const showDropdownSpecimen = ref(false)
const showModalSpecimen = ref(false)
const showStatusBarSpecimen = ref(false)
const showInputSpecimen = ref(false)
const showFormGroupSpecimen = ref(false)
const showToggleSpecimen = ref(false)
const showThemeExplorer = ref(false)
const showDebugPanel = ref(false)

function toggleInventory() {
  if (!showInventory.value) {
    showGuineaPig.value = false
    showNeeds.value = false
    showMarket.value = false
  }
  showInventory.value = !showInventory.value
}

function toggleGuineaPig() {
  if (!showGuineaPig.value) {
    showInventory.value = false
    showNeeds.value = false
    showMarket.value = false
  }
  showGuineaPig.value = !showGuineaPig.value
}

function toggleNeeds() {
  if (!showNeeds.value) {
    showInventory.value = false
    showGuineaPig.value = false
    showCageStatus.value = false
    showMarket.value = false
  }
  showNeeds.value = !showNeeds.value
}

function toggleCageStatus() {
  if (!showCageStatus.value) {
    showInventory.value = false
    showGuineaPig.value = false
    showNeeds.value = false
    showCageInteractions.value = false
    showMarket.value = false
  }
  showCageStatus.value = !showCageStatus.value
}

function toggleCageInteractions() {
  showCageInteractions.value = !showCageInteractions.value
}

function handleCageInteraction(action) {
  switch (action) {
    case 'refreshWater':
      cageStore.refreshWater()
      break
    case 'refreshBedding':
      cageStore.refreshBedding()
      break
    case 'cleanPoop':
      cageStore.cleanCage()
      break
    case 'manageItems':
      // This will be handled by the Cage component itself
      // The CageItemManager is already integrated into the Cage view
      break
  }
  showCageInteractions.value = false
}

function toggleMarket() {
  if (!showMarket.value) {
    showInventory.value = false
    showGuineaPig.value = false
    showNeeds.value = false
    showCageStatus.value = false
    showCageInteractions.value = false
  }
  showMarket.value = !showMarket.value
}

function clearCage() {
  if (window.confirm('Are you sure you want to clear the cage? This cannot be undone.')) {
    cageStore.$reset()
    localStorage.removeItem('cage')
  }
}

function toggleSpecimenLanding() {
  showButtonSpecimen.value = false
  showDropdownSpecimen.value = false
  showModalSpecimen.value = false
  showStatusBarSpecimen.value = false
  showInputSpecimen.value = false
  showFormGroupSpecimen.value = false
  showToggleSpecimen.value = false
  showSpecimenLanding.value = !showSpecimenLanding.value
}

function toggleButtonSpecimen() {
  showSpecimenLanding.value = false
  showButtonSpecimen.value = !showButtonSpecimen.value
}

function toggleDropdownSpecimen() {
  showSpecimenLanding.value = false
  showButtonSpecimen.value = false
  showModalSpecimen.value = false
  showStatusBarSpecimen.value = false
  showDropdownSpecimen.value = !showDropdownSpecimen.value
}

function toggleModalSpecimen() {
  showSpecimenLanding.value = false
  showButtonSpecimen.value = false
  showDropdownSpecimen.value = false
  showStatusBarSpecimen.value = false
  showModalSpecimen.value = !showModalSpecimen.value
}

function toggleStatusBarSpecimen() {
  showSpecimenLanding.value = false
  showButtonSpecimen.value = false
  showDropdownSpecimen.value = false
  showModalSpecimen.value = false
  showInputSpecimen.value = false
  showStatusBarSpecimen.value = !showStatusBarSpecimen.value
}

function toggleInputSpecimen() {
  showSpecimenLanding.value = false
  showButtonSpecimen.value = false
  showDropdownSpecimen.value = false
  showModalSpecimen.value = false
  showStatusBarSpecimen.value = false
  showFormGroupSpecimen.value = false
  showInputSpecimen.value = !showInputSpecimen.value
}

function toggleFormGroupSpecimen() {
  showSpecimenLanding.value = false
  showButtonSpecimen.value = false
  showDropdownSpecimen.value = false
  showModalSpecimen.value = false
  showStatusBarSpecimen.value = false
  showInputSpecimen.value = false
  showToggleSpecimen.value = false
  showFormGroupSpecimen.value = !showFormGroupSpecimen.value
}

function toggleToggleSpecimen() {
  showSpecimenLanding.value = false
  showButtonSpecimen.value = false
  showDropdownSpecimen.value = false
  showModalSpecimen.value = false
  showStatusBarSpecimen.value = false
  showInputSpecimen.value = false
  showFormGroupSpecimen.value = false
  showToggleSpecimen.value = !showToggleSpecimen.value
}

function toggleThemeExplorer() {
  showThemeExplorer.value = !showThemeExplorer.value
}

function toggleDebugPanel() {
  showDebugPanel.value = !showDebugPanel.value
}
</script>

<template>
  <div class="gps-app">
    <SidebarSubNav
      v-if="userStore.name"
      :isVisible="showCageInteractions"
      title="Cage Interactions"
      :buttons="[
        {
          id: 'refreshWater',
          icon: '💧',
          title: 'Refresh Water',
          action: 'refreshWater',
          class: 'gps-sidebar-subnav__button--primary'
        },
        {
          id: 'refreshBedding',
          icon: '🛏️',
          title: 'Refresh Bedding',
          action: 'refreshBedding',
          class: 'gps-sidebar-subnav__button--primary'
        },
        {
          id: 'cleanPoop',
          icon: '🧹',
          title: 'Clean Poop',
          action: 'cleanPoop',
          class: 'gps-sidebar-subnav__button--warning'
        },
        {
          id: 'manageItems',
          icon: '📦',
          title: 'Manage Items',
          action: 'manageItems',
          class: 'gps-sidebar-subnav__button--primary'
        }
      ]"
      @close="showCageInteractions = false"
      @action="handleCageInteraction"
    />

    <TopBar 
      v-if="userStore.name" 
      @resetGame="resetGame"
      @clearCage="clearCage"
      @showDebug="toggleDebugPanel"
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
        @showSpecimenLanding="toggleSpecimenLanding"
        @showThemeExplorer="toggleThemeExplorer"
      />
    </div>

    <!-- Welcome Panel -->
    <Panel 
      :isOpen="!userStore.name" 
      title="Welcome to Guinea Pig Simulator!" 
      :showClose="false"
    >
      <Welcome 
        :nameInput="nameInput" 
        @update:nameInput="val => nameInput = val" 
        @submit="submitName" 
      />
    </Panel>

    <!-- Market Panel -->
    <Panel 
      :isOpen="showMarket" 
      title="🐹 Guinea Pig Market" 
      @close="showMarket = false"
    >
      <Market />
    </Panel>

    <!-- Specimen Landing Panel -->
    <Panel 
      :isOpen="showSpecimenLanding" 
      title="Component Specimens" 
      @close="showSpecimenLanding = false"
    >
      <SpecimenLanding 
        @showButtonSpecimen="toggleButtonSpecimen"
        @showDropdownSpecimen="toggleDropdownSpecimen"
        @showModalSpecimen="toggleModalSpecimen"
        @showStatusBarSpecimen="toggleStatusBarSpecimen"
        @showInputSpecimen="toggleInputSpecimen"
        @showFormGroupSpecimen="toggleFormGroupSpecimen"
        @showToggleSpecimen="toggleToggleSpecimen"
      />
    </Panel>

    <!-- Button Specimen Panel -->
    <Panel 
      :isOpen="showButtonSpecimen" 
      title="Button Component Specimen" 
      @close="showButtonSpecimen = false"
    >
      <ButtonSpecimen @backToLanding="toggleSpecimenLanding" />
    </Panel>

    <!-- Dropdown Specimen Panel -->
    <Panel 
      :isOpen="showDropdownSpecimen" 
      title="Dropdown Component Specimen" 
      @close="showDropdownSpecimen = false"
    >
      <DropdownSpecimen @backToLanding="toggleSpecimenLanding" />
    </Panel>

    <!-- Modal Specimen Panel -->
    <Panel 
      :isOpen="showModalSpecimen" 
      title="Modal Component Specimen" 
      @close="showModalSpecimen = false"
    >
      <ModalSpecimen @backToLanding="toggleSpecimenLanding" />
    </Panel>

    <!-- StatusBar Specimen Panel -->
    <Panel 
      :isOpen="showStatusBarSpecimen" 
      title="StatusBar Component Specimen" 
      @close="showStatusBarSpecimen = false"
    >
      <StatusBarSpecimen @backToLanding="toggleSpecimenLanding" />
    </Panel>

    <!-- Input Specimen Panel -->
    <Panel 
      :isOpen="showInputSpecimen" 
      title="Input Component Specimen" 
      @close="showInputSpecimen = false"
    >
      <InputSpecimen @backToLanding="toggleSpecimenLanding" />
    </Panel>

    <!-- FormGroup Specimen Panel -->
    <Panel 
      :isOpen="showFormGroupSpecimen" 
      title="FormGroup Component Specimen" 
      @close="showFormGroupSpecimen = false"
    >
      <FormGroupSpecimen @backToLanding="toggleSpecimenLanding" />
    </Panel>

    <!-- Toggle Specimen Panel -->
    <Panel 
      :isOpen="showToggleSpecimen" 
      title="Toggle Component Specimen" 
      @close="showToggleSpecimen = false"
    >
      <ToggleSpecimen @backToLanding="toggleSpecimenLanding" />
    </Panel>

    <!-- Theme Explorer Panel -->
    <Panel 
      :isOpen="showThemeExplorer" 
      title="🎨 Theme Explorer" 
      @close="showThemeExplorer = false"
    >
      <ThemeExplorer />
    </Panel>

    <!-- Debug Panel -->
    <Panel 
      :isOpen="showDebugPanel" 
      title="🐛 Debug Panel" 
      @close="showDebugPanel = false"
    >
      <DebugPanel 
        @resetGame="resetGame"
        @clearCage="clearCage"
      />
    </Panel>
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
