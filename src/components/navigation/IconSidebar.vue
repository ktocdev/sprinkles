<template>
  <nav class="gps-icon-sidebar">
    <div class="gps-icon-sidebar__container">
      <!-- Inventory -->
      <button 
        class="gps-icon-sidebar__button"
        @click="props.onInventory"
        :class="{ 'gps-icon-sidebar__button--active': props.showInventory }"
        title="Show Inventory"
      >
        📦
      </button>

      <!-- Guinea Pig Info -->
      <button 
        class="gps-icon-sidebar__button"
        @click="props.onGuineaPig"
        :class="{ 'gps-icon-sidebar__button--active': props.showGuineaPig }"
        title="Show Guinea Pig Info"
      >
        📋
      </button>

      <!-- Needs -->
      <button 
        class="gps-icon-sidebar__button"
        @click="props.onNeeds"
        :class="{ 'gps-icon-sidebar__button--active': props.showNeeds }"
        title="Show Needs"
      >
        📊
      </button>

      <!-- Cage Data -->
      <button 
        class="gps-icon-sidebar__button"
        @click="props.onCageStatus"
        :class="{ 'gps-icon-sidebar__button--active': props.showCageStatus }"
        title="Show Cage Status"
      >
        🏠
      </button>

      <!-- Cage Interactions -->
      <button 
        class="gps-icon-sidebar__button"
        @click="props.onCageInteractions"
        :class="{ 'gps-icon-sidebar__button--active': props.showCageInteractions }"
        title="Cage Interactions"
      >
        🛠️
      </button>

      <!-- Market -->
      <button 
        class="gps-icon-sidebar__button gps-icon-sidebar__button--primary"
        @click="props.onMarket"
        :class="{ 'gps-icon-sidebar__button--active': props.showMarket }"
        title="Show Market"
      >
        🛒
      </button>

      <!-- Divider -->
      <div class="gps-icon-sidebar__divider"></div>


    </div>
  </nav>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  onInventory: Function,
  onGuineaPig: Function,
  onNeeds: Function,
  onCageStatus: Function,
  onCageInteractions: Function,
  onMarket: Function,
  showInventory: Boolean,
  showGuineaPig: Boolean,
  showNeeds: Boolean,
  showCageStatus: Boolean,
  showCageInteractions: Boolean,
  showMarket: Boolean
})
</script>

<style>
.gps-icon-sidebar {
  width: 60px;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  flex-shrink: 0;
  height: fit-content;
}

.gps-icon-sidebar__container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  align-items: center;
}

.gps-icon-sidebar__button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: var(--border-radius);
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  position: relative;
}

.gps-icon-sidebar__button:hover {
  background: var(--color-accent);
  color: var(--color-white);
}

.gps-icon-sidebar__button--active {
  background: var(--color-accent);
  color: var(--color-white);
}

.gps-icon-sidebar__button--primary:hover {
  background: var(--color-accent);
}

.gps-icon-sidebar__button--danger:hover {
  background: var(--color-danger);
}

.gps-icon-sidebar__button--warning:hover {
  background: var(--color-warning);
}

.gps-icon-sidebar__divider {
  width: 30px;
  height: 1px;
  background: var(--color-border);
  margin: 0.5rem 0;
}

/* Tooltip styles */
.gps-icon-sidebar__button::before {
  content: attr(title);
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-panel);
  color: var(--color-text);
  padding: 0.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  font-size: 0.8em;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1000;
  box-shadow: var(--box-shadow-light);
}

.gps-icon-sidebar__button:hover::before {
  opacity: 1;
}

</style> 