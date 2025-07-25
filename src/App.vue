<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from './stores/user'
import { useInventoryStore } from './stores/inventory'
import { useGuineaPigStore } from './stores/guineaPig'
import WelcomeScreen from './components/WelcomeScreen.vue'
import MainScreen from './components/MainScreen.vue'

const userStore = useUserStore()
const inventoryStore = useInventoryStore()
const guineaPigStore = useGuineaPigStore()
const nameInput = ref('')

const isLight = ref(false)

function toggleTheme() {
  isLight.value = !isLight.value
  document.body.classList.toggle('theme-light', isLight.value)
}

onMounted(() => {
  document.body.classList.toggle('theme-light', isLight.value)
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
    // Remove persisted state from localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('inventory')
    localStorage.removeItem('guineaPig')
    localStorage.removeItem('cage')
  }
}
</script>

<template>
  <div class="gps-app">
    <WelcomeScreen v-if="!userStore.name" :nameInput="nameInput" @update:nameInput="val => nameInput = val" @submit="submitName" />
    <MainScreen v-else :userStore="userStore" :inventoryStore="inventoryStore" :resetGame="resetGame" />
  </div>
</template>
