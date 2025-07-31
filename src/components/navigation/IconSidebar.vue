<template>
  <nav class="gps-icon-sidebar">
    <div class="gps-icon-sidebar__container">
      <div class="gps-icon-sidebar__logo">
        🐹
      </div>
      
      <template v-if="userStore.name">
        <button 
          class="gps-icon-sidebar__button"
          @click="props.onInventory"
          :class="{ 'gps-icon-sidebar__button--active': props.showInventory }"
          title="Show Inventory"
        >
          📦
        </button>

        <button 
          class="gps-icon-sidebar__button"
          @click="props.onGuineaPig"
          :class="{ 'gps-icon-sidebar__button--active': props.showGuineaPig }"
          title="Show Guinea Pig Info"
        >
          📋
        </button>

        <button 
          class="gps-icon-sidebar__button"
          @click="props.onNeeds"
          :class="{ 'gps-icon-sidebar__button--active': props.showNeeds }"
          title="Show Needs"
        >
          📊
        </button>

        <button 
          class="gps-icon-sidebar__button"
          @click="props.onCageStatus"
          :class="{ 'gps-icon-sidebar__button--active': props.showCageStatus }"
          title="Show Cage Status"
        >
          🏠
        </button>

        <button 
          class="gps-icon-sidebar__button"
          @click="props.onCageInteractions"
          :class="{ 'gps-icon-sidebar__button--active': props.showCageInteractions }"
          title="Cage Interactions"
        >
          🛠️
        </button>

        <button 
          class="gps-icon-sidebar__button gps-icon-sidebar__button--primary"
          @click="props.onMarket"
          :class="{ 'gps-icon-sidebar__button--active': props.showMarket }"
          title="Show Market"
        >
          🛒
        </button>

        <div class="gps-icon-sidebar__divider"></div>
      </template>
    </div>
  </nav>

  <!-- SidebarSubNav integrated into IconSidebar -->
  <div class="gps-sidebar-subnav" v-if="props.showCageInteractions">
    <div class="gps-sidebar-subnav__container">
      <div class="gps-sidebar-subnav__header">
        <h3 class="gps-sidebar-subnav__title">Cage Interactions</h3>
        <button 
          class="gps-sidebar-subnav__close"
          @click="$emit('closeCageInteractions')"
          title="Close"
        >
          ✕
        </button>
      </div>
      
      <div class="gps-sidebar-subnav__buttons">
        <button 
          v-for="button in cageInteractionButtons" 
          :key="button.id"
          class="gps-sidebar-subnav__button"
          :class="button.class"
          @click="handleCageInteraction(button.action)"
          :title="button.title"
        >
          {{ button.icon }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useUserStore } from '../../stores/user'
import { useCageStore } from '../../stores/cage'

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

const emit = defineEmits(['closeCageInteractions'])

const userStore = useUserStore()
const cageStore = useCageStore()

// Cage interaction buttons configuration
const cageInteractionButtons = [
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
]

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
      // Handled by Cage component
      break
  }
  emit('closeCageInteractions')
}
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
}

.gps-icon-sidebar__logo {
  font-size: var(--font-size-3xl);
  margin-block-end: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
  text-align: center;
  line-height: 1;
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
    margin-block-end: 1.5rem;
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

/* SidebarSubNav styles integrated into IconSidebar */
.gps-sidebar-subnav {
  position: fixed;
  left: 70px; /* Position to the right of the sidebar */
  top: 70px; /* Position below the top bar */
  width: 180px;
  height: 180px;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow-medium);
  z-index: 300;
  animation: gps-sidebar-subnav-slide-in 0.2s ease-out;
}

@keyframes gps-sidebar-subnav-slide-in {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.gps-sidebar-subnav__container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

.gps-sidebar-subnav__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block-end: 1rem;
  padding-block-end: 0.5rem;
  border-block-end: 1px solid var(--color-border);
}

.gps-sidebar-subnav__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
  margin: 0;
}

.gps-sidebar-subnav__close {
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  font-size: var(--font-size-xl);
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.gps-sidebar-subnav__close:hover {
  background: var(--color-accent);
  color: var(--color-white);
}

.gps-sidebar-subnav__buttons {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  flex: 1;
}

.gps-sidebar-subnav__button {
  width: 100%;
  height: 40px;
  border: none;
  border-radius: var(--border-radius);
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-base);
  position: relative;
}

.gps-sidebar-subnav__button:hover {
  background: var(--color-accent);
  color: var(--color-white);
}

.gps-sidebar-subnav__button--primary:hover {
  background: var(--color-accent);
}

.gps-sidebar-subnav__button--warning:hover {
  background: var(--color-warning);
}

.gps-sidebar-subnav__button--danger:hover {
  background: var(--color-danger);
}

/* Tooltip styles for subnav buttons */
.gps-sidebar-subnav__button::before {
  content: attr(title);
  position: absolute;
  left: 50%;
  bottom: -40px;
  transform: translateX(-50%);
  background: var(--color-panel);
  color: var(--color-text);
  padding: 0.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  font-size: var(--font-size-xs);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1000;
  box-shadow: var(--box-shadow-light);
}

.gps-sidebar-subnav__button:hover::before {
  opacity: 1;
}

/* Tablet and up - enhance for larger screens */
@media (min-width: 768px) {
  .gps-sidebar-subnav {
    width: 200px;
    height: 200px;
  }
  
  .gps-sidebar-subnav__buttons {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .gps-sidebar-subnav__button {
    height: 50px;
    font-size: var(--font-size-lg);
  }
}
</style> 