<script setup>
import { ref } from 'vue'
import { defineProps } from 'vue'
import GuineaPig from './GuineaPig.vue'
import Cage from './Cage.vue'
import { useCageStore } from '../stores/cage'
import { useGuineaPigStore } from '../stores/guineaPig'

const cageStore = useCageStore()
const guineaPigStore = useGuineaPigStore()

const props = defineProps({
  userStore: Object,
  inventoryStore: Object,
  resetGame: Function
})

const showInventory = ref(false)
const showGuineaPig = ref(false)
const showNeeds = ref(false)

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
    cageStore.$reset()
    localStorage.removeItem('cage')
  }
}
</script>

<template>
  <div class="gps-main">
    <h2 class="gps-main__title">Welcome, {{ userStore.name }}!</h2>
    <p class="gps-main__desc">
      Guinea Pig Simulator is a text-based game where you care for your guinea pig, manage their needs, and keep their cage clean. Earn currency, buy food, and keep your furry friend happy!
    </p>
    <div class="gps-main__menubar" role="menubar">
      <button class="gps-main__button" role="menuitem" @click="toggleInventory">
        {{ showInventory ? 'Hide Inventory' : 'Show Inventory' }}
      </button>
      <button class="gps-main__button" role="menuitem" @click="toggleGuineaPig">
        {{ showGuineaPig ? 'Hide Guinea Pig Info' : 'Show Guinea Pig Info' }}
      </button>
      <button class="gps-main__button" role="menuitem" @click="toggleNeeds">
        {{ showNeeds ? 'Hide Needs' : 'Show Needs' }}
      </button>
      <button class="gps-main__button gps-main__button--danger" role="menuitem" @click="resetGame">Reset Game</button>
      <button class="gps-main__button gps-main__button--warn" role="menuitem" @click="clearCage">Clear Cage</button>
    </div>
    <div class="gps-main__content-grid">
      <div class="gps-main__content-cage">
        <Cage class="gps-main__cage" />
      </div>
      <div class="gps-main__content-info">
        <div v-if="showInventory" class="gps-main__inventory-menu">
          <h3 class="gps-main__subtitle">Your Inventory</h3>
          <ul class="gps-main__inventory-list">
            <li class="gps-main__inventory-item" v-for="(qty, item) in inventoryStore.items" :key="item">
              {{ item.charAt(0).toUpperCase() + item.slice(1) }}: {{ qty }}
            </li>
          </ul>
        </div>
        <div v-if="showGuineaPig" class="gps-main__guinea-pig-panel">
          <GuineaPig class="gps-main__guinea-pig" />
        </div>
        <div v-if="showNeeds" class="gps-main__needs-panel">
          <h4 class="gps-main__needs-title">Needs</h4>
          <ul class="gps-main__needs-list">
            <li class="gps-main__needs-item" v-for="(value, need) in guineaPigStore.needs" :key="need">
              <span class="gps-main__needs-label">{{ need.charAt(0).toUpperCase() + need.slice(1) }}:</span>
              <progress class="gps-main__needs-bar" :value="value" max="100"></progress>
              <span class="gps-main__needs-value">{{ value }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.gps-main__menubar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 1em;
}
.gps-main__button {
  padding: 0.5em 1em;
  border: none;
  background: #42b883;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.2s;
}
.gps-main__button:hover {
  background: #369870;
}
.gps-main__button--danger {
  background: #e74c3c;
}
.gps-main__button--danger:hover {
  background: #c0392b;
}
.gps-main__button--warn {
  background: #e67e22;
}
.gps-main__button--warn:hover {
  background: #d35400;
}
.gps-main__inventory-menu,
.gps-main__guinea-pig-panel {
  background: #f8f8f8;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 1em;
  margin-bottom: 1em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.gps-main__needs-panel {
  background: #f8f8f8;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 1em;
  margin-bottom: 1em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.gps-main__content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2em;
  align-items: start;
  margin-top: 2em;
}
.gps-main__content-cage {
  /* Optionally add a panel style here */
}
.gps-main__content-info {
  /* Optionally add a panel style here */
}
</style> 