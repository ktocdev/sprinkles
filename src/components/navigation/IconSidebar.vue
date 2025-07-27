<template>
  <nav class="gps-icon-sidebar">
    <div class="gps-icon-sidebar__container">
      <!-- Logo -->
      <div class="gps-icon-sidebar__logo">
        🐹
      </div>
      
      <!-- Show navigation buttons only when user is logged in -->
      <template v-if="userStore.name">
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
      </template>
    </div>
  </nav>
</template>

<script setup>
import { defineProps } from 'vue'
import { useUserStore } from '../../stores/user'

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

const userStore = useUserStore()
</script>

<style>
.gps-icon-sidebar {
  width: 60px;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: 0;
  border-inline-end: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  flex-shrink: 0;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
  box-shadow: var(--box-shadow);
}

.gps-icon-sidebar__container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  align-items: center;
  padding-block-start: 80px; /* Account for TopBar height */
}

.gps-icon-sidebar__logo {
  font-size: var(--font-size-3xl);
  margin-block-end: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .gps-icon-sidebar {
    width: 50px;
  }
  
  .gps-icon-sidebar__logo {
    font-size: var(--font-size-2xl);
    margin-block-end: 0.75rem;
  }
  
  .gps-icon-sidebar__button {
    width: 35px;
    height: 35px;
    font-size: 1em;
  }
  
  .gps-icon-sidebar__container {
    padding-block-start: 70px;
  }
}
</style> 