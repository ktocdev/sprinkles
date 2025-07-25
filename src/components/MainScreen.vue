<script setup>
import { defineProps, defineEmits } from 'vue'
import GuineaPig from './GuineaPig.vue'
import Cage from './Cage.vue'
import Panel from './Panel.vue'
import { useGuineaPigStore } from '../stores/guineaPig'

const guineaPigStore = useGuineaPigStore()

const props = defineProps({
  userStore: Object,
  inventoryStore: Object,
  showInventory: Boolean,
  showGuineaPig: Boolean,
  showNeeds: Boolean
})

const emit = defineEmits(['closeInventory', 'closeGuineaPig', 'closeNeeds'])
</script>

<template>
  <div class="gps-main">
    <h1 class="gps-main__title">Guinea Pig Simulator</h1>
    <p class="gps-main__desc">
      Welcome, {{ userStore.name }}! Guinea Pig Simulator is a text-based game where you care for your guinea pig, manage their needs, and keep their cage clean. Earn currency, buy food, and keep your furry friend happy!
    </p>
    <div class="gps-main__content-grid">
      <div class="gps-main__content-cage">
        <Cage class="gps-main__cage" />
      </div>
    </div>

    <!-- Modal Panels -->
    <Panel 
      :isOpen="showInventory" 
      title="Your Inventory" 
      @close="emit('closeInventory')"
    >
      <ul class="gps-main__inventory-list">
        <li class="gps-main__inventory-item" v-for="(qty, item) in inventoryStore.items" :key="item">
          {{ item.charAt(0).toUpperCase() + item.slice(1) }}: {{ qty }}
        </li>
      </ul>
    </Panel>

    <Panel 
      :isOpen="showGuineaPig" 
      title="Guinea Pig Information" 
      @close="emit('closeGuineaPig')"
    >
      <GuineaPig />
    </Panel>

    <Panel 
      :isOpen="showNeeds" 
      title="Guinea Pig Needs" 
      @close="emit('closeNeeds')"
    >
      <ul class="gps-main__needs-list">
        <li class="gps-main__needs-item" v-for="(value, need) in guineaPigStore.needs" :key="need">
          <span class="gps-main__needs-label">{{ need.charAt(0).toUpperCase() + need.slice(1) }}:</span>
          <progress class="gps-main__needs-bar" :value="value" max="100"></progress>
          <span class="gps-main__needs-value">{{ value }}</span>
        </li>
      </ul>
    </Panel>
  </div>
</template>

<style>
.gps-main__title {
  font-size: 2em;
  margin-block-end: 0.5em;
  color: var(--color-accent);
}

.gps-main__content-grid {
  display: flex;
  justify-content: center;
  margin-block-start: 2em;
}

.gps-main__content-cage {
  max-width: 600px;
  width: 100%;
}

.gps-main__inventory-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.gps-main__inventory-item {
  padding: 0.5rem 0;
  border-block-end: 1px solid var(--color-border);
}

.gps-main__inventory-item:last-child {
  border-block-end: none;
}

.gps-main__needs-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.gps-main__needs-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-block-end: 1px solid var(--color-border);
}

.gps-main__needs-item:last-child {
  border-block-end: none;
}

.gps-main__needs-label {
  min-width: 100px;
  font-weight: 500;
}

.gps-main__needs-bar {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: var(--color-border);
}

.gps-main__needs-bar::-webkit-progress-bar {
  background: var(--color-border);
  border-radius: 4px;
}

.gps-main__needs-bar::-webkit-progress-value {
  background: var(--color-accent);
  border-radius: 4px;
}

.gps-main__needs-value {
  min-width: 40px;
  text-align: end;
  font-weight: 500;
}
</style> 