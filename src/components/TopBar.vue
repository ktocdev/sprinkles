<script setup>
import ThemeToggle from './ThemeToggle.vue'
import Button from './Button.vue'
import { defineProps, ref } from 'vue'

const props = defineProps({
  onInventory: Function,
  onGuineaPig: Function,
  onNeeds: Function,
  onReset: Function,
  onClearCage: Function,
  showInventory: Boolean,
  showGuineaPig: Boolean,
  showNeeds: Boolean
})

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="gps-topbar">
    <div class="gps-topbar__container">
      <div class="gps-topbar__menubar" role="menubar">
        <!-- Logo -->
        <div class="gps-topbar__logo">
          🐹
        </div>
        
        <!-- Desktop menu items -->
        <div class="gps-topbar__menu-items">
          <Button type="secondary" role="menuitem" @click="props.onInventory">
            {{ props.showInventory ? 'Hide Inventory' : 'Show Inventory' }}
          </Button>
          <Button type="secondary" role="menuitem" @click="props.onGuineaPig">
            {{ props.showGuineaPig ? 'Hide Guinea Pig Info' : 'Show Guinea Pig Info' }}
          </Button>
          <Button type="secondary" role="menuitem" @click="props.onNeeds">
            {{ props.showNeeds ? 'Hide Needs' : 'Show Needs' }}
          </Button>
          <Button type="danger" role="menuitem" @click="props.onReset">Reset Game</Button>
          <Button type="warning" role="menuitem" @click="props.onClearCage">Clear Cage</Button>
        </div>
        
        <!-- Theme toggle (always visible) -->
        <ThemeToggle class="gps-topbar__theme-toggle" />
        
        <!-- Hamburger menu button -->
        <button 
          class="gps-topbar__hamburger" 
          @click="toggleMenu"
          aria-label="Toggle menu"
          aria-expanded="isMenuOpen"
        >
          <span class="gps-topbar__hamburger-line"></span>
          <span class="gps-topbar__hamburger-line"></span>
          <span class="gps-topbar__hamburger-line"></span>
        </button>
      </div>
      
      <!-- Mobile menu dropdown -->
      <div class="gps-topbar__mobile-menu" :class="{ 'gps-topbar__mobile-menu--open': isMenuOpen }">
        <Button type="secondary" @click="() => { props.onInventory(); closeMenu(); }">
          {{ props.showInventory ? 'Hide Inventory' : 'Show Inventory' }}
        </Button>
        <Button type="secondary" @click="() => { props.onGuineaPig(); closeMenu(); }">
          {{ props.showGuineaPig ? 'Hide Guinea Pig Info' : 'Show Guinea Pig Info' }}
        </Button>
        <Button type="secondary" @click="() => { props.onNeeds(); closeMenu(); }">
          {{ props.showNeeds ? 'Hide Needs' : 'Show Needs' }}
        </Button>
        <Button type="danger" @click="() => { props.onReset(); closeMenu(); }">Reset Game</Button>
        <Button type="warning" @click="() => { props.onClearCage(); closeMenu(); }">Clear Cage</Button>
      </div>
    </div>
  </header>
</template>

<style>
.gps-topbar {
  width: 100%;
  background: var(--color-panel);
  border-block-end: 2px solid var(--color-accent);
  box-shadow: var(--box-shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.gps-topbar__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 0.75rem;
  container-type: inline-size;
  container-name: topbar;
}

.gps-topbar__menubar {
  display: flex;
  align-items: center;
  gap: 0.25em;
  position: relative;
}

.gps-topbar__logo {
  font-size: 1.5rem;
  margin-inline-end: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
}

/* Mobile-first: Start with hamburger menu */
.gps-topbar__menu-items {
  display: none;
}

.gps-topbar__theme-toggle {
  margin-inline-start: auto;
}

.gps-topbar__hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-inline-start: 1rem;
}

.gps-topbar__hamburger-line {
  width: 100%;
  height: 3px;
  background: var(--color-text);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.gps-topbar__mobile-menu {
  display: none;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0;
  border-block-start: 1px solid var(--color-border);
  margin-block-start: 0.5rem;
}

.gps-topbar__mobile-menu--open {
  display: flex;
}

/* Animation for hamburger menu */
.gps-topbar__mobile-menu {
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.gps-topbar__mobile-menu--open {
  opacity: 1;
  transform: translateY(0);
}

/* Container query for larger containers - expand to horizontal menu */
@container topbar (min-width: 800px) {
  .gps-topbar__container {
    padding: 0.75rem 1.5rem;
  }
  
  .gps-topbar__menubar {
    gap: 0.75em;
  }
  
  .gps-topbar__menu-items {
    display: flex;
    align-items: center;
    gap: 0.75em;
  }
  
  .gps-topbar__hamburger {
    display: none;
  }
  
  .gps-topbar__mobile-menu {
    display: none !important;
  }
}

/* Container query for medium containers */
@container topbar (min-width: 600px) and (max-width: 799px) {
  .gps-topbar__container {
    padding: 0.75rem 1rem;
  }
  
  .gps-topbar__menubar {
    gap: 0.5em;
  }
}
</style> 