<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from './stores/user'
import { useInventoryStore } from './stores/inventory'
import { useGuineaPigStore } from './stores/guineaPig'
import { useCageStore } from './stores/cage'
import { useThemeStore } from './stores/theme'
import WelcomeScreen from './components/WelcomeScreen.vue'
import MainScreen from './components/MainScreen.vue'
import TopBar from './components/TopBar.vue'
import Panel from './components/Panel.vue'
import Footer from './components/Footer.vue'
import ButtonSpecimen from './components/ButtonSpecimen.vue'

const userStore = useUserStore()
const inventoryStore = useInventoryStore()
const guineaPigStore = useGuineaPigStore()
const themeStore = useThemeStore()
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
    const cageStore = useCageStore()
    cageStore.$reset()
    // Remove persisted state from localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('inventory')
    localStorage.removeItem('guineaPig')
    localStorage.removeItem('cage')
    // Reset panel states
    showInventory.value = false
    showGuineaPig.value = false
    showNeeds.value = false
    // Reset name input
    nameInput.value = ''
  }
}

// Panel visibility state
const showInventory = ref(false)
const showGuineaPig = ref(false)
const showNeeds = ref(false)
const showButtonSpecimen = ref(false)

function toggleInventory() {
  if (!showInventory.value) {
    showGuineaPig.value = false
    showNeeds.value = false
  }
  showInventory.value = !showInventory.value
}

function toggleGuineaPig() {
  if (!showGuineaPig.value) {
    showInventory.value = false
    showNeeds.value = false
  }
  showGuineaPig.value = !showGuineaPig.value
}

function toggleNeeds() {
  if (!showNeeds.value) {
    showInventory.value = false
    showGuineaPig.value = false
  }
  showNeeds.value = !showNeeds.value
}

function clearCage() {
  if (window.confirm('Are you sure you want to clear the cage? This cannot be undone.')) {
    const cageStore = useCageStore()
    cageStore.$reset()
    localStorage.removeItem('cage')
  }
}

function toggleButtonSpecimen() {
  showButtonSpecimen.value = !showButtonSpecimen.value
}
</script>

<template>
  <div class="gps-app">
    <TopBar
      v-if="userStore.name"
      :onInventory="toggleInventory"
      :onGuineaPig="toggleGuineaPig"
      :onNeeds="toggleNeeds"
      :onReset="resetGame"
      :onClearCage="clearCage"
      :showInventory="showInventory"
      :showGuineaPig="showGuineaPig"
      :showNeeds="showNeeds"
    />
    <div class="gps-app__content">
      <MainScreen 
        v-if="userStore.name"
        :userStore="userStore" 
        :inventoryStore="inventoryStore" 
        :showInventory="showInventory"
        :showGuineaPig="showGuineaPig"
        :showNeeds="showNeeds"
        @closeInventory="showInventory = false"
        @closeGuineaPig="showGuineaPig = false"
        @closeNeeds="showNeeds = false"
      />
    </div>

    <Footer 
      v-if="userStore.name"
      @showButtonSpecimen="toggleButtonSpecimen"
    />

    <!-- Welcome Panel -->
    <Panel 
      :isOpen="!userStore.name" 
      title="Welcome to Guinea Pig Simulator!" 
      :showClose="false"
    >
      <WelcomeScreen 
        :nameInput="nameInput" 
        @update:nameInput="val => nameInput = val" 
        @submit="submitName" 
      />
    </Panel>

    <!-- Button Specimen Panel -->
    <Panel 
      :isOpen="showButtonSpecimen" 
      title="Button Component Specimen" 
      @close="showButtonSpecimen = false"
    >
      <ButtonSpecimen />
    </Panel>
  </div>
</template>
