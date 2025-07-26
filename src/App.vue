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
import Panel from './components/shared/Panel.vue'
import Footer from './components/navigation/Footer.vue'
import ButtonSpecimen from './components/specimen/ButtonSpecimen.vue'
import DropdownSpecimen from './components/specimen/DropdownSpecimen.vue'
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
const showMarket = ref(false)
const showButtonSpecimen = ref(false)
const showDropdownSpecimen = ref(false)

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
    showMarket.value = false
  }
  showCageStatus.value = !showCageStatus.value
}

function toggleMarket() {
  if (!showMarket.value) {
    showInventory.value = false
    showGuineaPig.value = false
    showNeeds.value = false
    showCageStatus.value = false
  }
  showMarket.value = !showMarket.value
}

function clearCage() {
  if (window.confirm('Are you sure you want to clear the cage? This cannot be undone.')) {
    cageStore.$reset()
    localStorage.removeItem('cage')
  }
}

function toggleButtonSpecimen() {
  showButtonSpecimen.value = !showButtonSpecimen.value
}

function toggleDropdownSpecimen() {
  showDropdownSpecimen.value = !showDropdownSpecimen.value
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
      :onMarket="toggleMarket"
      :onReset="resetGame"
      :onClearCage="clearCage"
      :showInventory="showInventory"
      :showGuineaPig="showGuineaPig"
      :showNeeds="showNeeds"
      :showCageStatus="showCageStatus"
      :showMarket="showMarket"
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
        @showButtonSpecimen="toggleButtonSpecimen"
        @showDropdownSpecimen="toggleDropdownSpecimen"
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

    <!-- Button Specimen Panel -->
    <Panel 
      :isOpen="showButtonSpecimen" 
      title="Button Component Specimen" 
      @close="showButtonSpecimen = false"
    >
      <ButtonSpecimen />
    </Panel>

    <!-- Dropdown Specimen Panel -->
    <Panel 
      :isOpen="showDropdownSpecimen" 
      title="Dropdown Component Specimen" 
      @close="showDropdownSpecimen = false"
    >
      <DropdownSpecimen />
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
  width: calc(100% - 60px); /* Take full width minus sidebar */
  max-width: 1400px; /* Maximum width constraint */
  margin-inline-end: auto; /* Center the content */
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
    margin-inline-end: auto;
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .gps-app__content {
    margin-inline-start: 60px; /* Keep sidebar margin */
    width: calc(100% - 60px); /* Keep sidebar width calculation */
    padding: 1rem 0.75rem;
  }
}
</style>
