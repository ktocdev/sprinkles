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
        🐹
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
        title="Show Cage Data"
      >
        🏠
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

      <!-- Reset Game -->
      <button 
        class="gps-icon-sidebar__button gps-icon-sidebar__button--danger"
        @click="props.onReset"
        title="Reset Game"
      >
        🔄
      </button>

      <!-- Clear Cage -->
      <button 
        class="gps-icon-sidebar__button gps-icon-sidebar__button--warning"
        @click="props.onClearCage"
        title="Clear Cage"
      >
        🧹
      </button>
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
  onMarket: Function,
  onReset: Function,
  onClearCage: Function,
  showInventory: Boolean,
  showGuineaPig: Boolean,
  showNeeds: Boolean,
      showCageStatus: Boolean,
  showMarket: Boolean
})
</script>

<style>
.gps-icon-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 60px;
  background: var(--color-panel);
  border-inline-end: 1px solid var(--color-border);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
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
  background: var(--color-warn);
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.gps-icon-sidebar__button:hover::before {
  opacity: 1;
}

/* Responsive - hide on mobile */
@media (max-width: 768px) {
  .gps-icon-sidebar {
    display: none;
  }
}
</style> 