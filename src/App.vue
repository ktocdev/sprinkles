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
import Market from './components/market/Market.vue'

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
    case 'cleanCage':
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
  showFormGroupSpecimen.value = !showFormGroupSpecimen.value
}
</script>

<template>
  <div class="gps-app">
    <IconSidebar
      v-if="userStore.name"
      :onInventory="toggleInventory"
      :onGuineaPig="toggleGuineaPig"
      :onNeeds="toggleNeeds"
      :onCageStatus="toggleCageStatus"
      :onCageInteractions="toggleCageInteractions"
      :onMarket="toggleMarket"
      :onReset="resetGame"
      :onClearCage="clearCage"
      :showInventory="showInventory"
      :showGuineaPig="showGuineaPig"
      :showNeeds="showNeeds"
      :showCageStatus="showCageStatus"
      :showCageInteractions="showCageInteractions"
      :showMarket="showMarket"
    />
    
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
          id: 'cleanCage',
          icon: '🧹',
          title: 'Clean Cage',
          action: 'cleanCage',
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
    <TopBar v-if="userStore.name" />
    <div class="gps-app__content">
      <div class="gps-app__content-wrapper">
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

    <div class="gps-app__footer-wrapper">
      <Footer 
        v-if="userStore.name"
        @showSpecimenLanding="toggleSpecimenLanding"
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

.gps-app__content {
  flex: 1;
  margin-inline-start: 60px; /* Account for sidebar width */
  margin-block-start: 60px; /* Account for TopBar height */
  width: calc(100% - 60px); /* Take full width minus sidebar */
  max-width: 1400px; /* Maximum width constraint */
  margin-inline: auto; /* Center the content horizontally */
  padding: 2rem 1rem;
  text-align: center;
  box-sizing: border-box; /* Include padding in width calculation */
  overflow-x: hidden; /* Prevent horizontal overflow */
}

.gps-app__content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.gps-app__footer-wrapper {
  width: 100%;
  box-sizing: border-box;
}

/* Responsive breakpoints */
@media (max-width: 1250px) {
  .gps-app__content {
    margin-inline-start: 60px; /* Keep sidebar margin */
    width: calc(100% - 60px); /* Keep sidebar width calculation */
    max-width: 1200px;
    margin-inline: auto; /* Center the content horizontally */
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .gps-app__content {
    margin-inline-start: 60px; /* Keep sidebar margin */
    width: calc(100% - 60px); /* Keep sidebar width calculation */
    margin-inline: auto; /* Center the content horizontally */
    padding: 1rem 0.75rem;
  }
}
</style>
