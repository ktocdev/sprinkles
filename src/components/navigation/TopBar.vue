<script setup>
import { ref } from 'vue'
import ThemeToggle from '../shared/ThemeToggle.vue'
import Dropdown from '../shared/Dropdown.vue'

const headerFont = ref('Inter')
const bodyFont = ref('Inter')

const headerFontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Roboto', label: 'Roboto' }
]

const bodyFontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' }
]

function updateHeaderFont(font) {
  headerFont.value = font.value
  document.documentElement.style.setProperty('--font-family-header', `'${font.value}', sans-serif`)
}

function updateBodyFont(font) {
  bodyFont.value = font.value
  document.documentElement.style.setProperty('--font-family-body', `'${font.value}', sans-serif`)
}
</script>

<template>
  <header class="gps-topbar">
    <div class="gps-topbar__container gps-container">
      <!-- Logo -->
      <div class="gps-topbar__logo">
        🐹
      </div>
      <!-- Title -->
      <h1 class="gps-topbar__title">Guinea Pig Simulator</h1>
      
      <!-- Font Controls -->
      <div class="gps-topbar__font-controls">
        <Dropdown
          v-model="headerFont"
          :options="headerFontOptions"
          placeholder="Header Font"
          trigger-class="gps-topbar__font-dropdown"
          @change="updateHeaderFont"
        />
        <Dropdown
          v-model="bodyFont"
          :options="bodyFontOptions"
          placeholder="Body Font"
          trigger-class="gps-topbar__font-dropdown"
          @change="updateBodyFont"
        />
      </div>
      
      <!-- Theme toggle -->
      <ThemeToggle class="gps-topbar__theme-toggle gps-margin-start-auto" />
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
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25em;
  position: relative;
  container-type: inline-size;
  container-name: topbar;
}

.gps-topbar__logo {
  font-size: var(--font-size-3xl);
  margin-inline-end: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
}

.gps-topbar__title {
  font-size: var(--font-size-3xl);
  margin: 0;
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-family-header);
}

.gps-topbar__font-controls {
  display: flex;
  gap: 0.5rem;
  margin-inline-start: auto;
  margin-inline-end: 1rem;
}

.gps-topbar__font-dropdown {
  min-width: 100px !important;
  font-size: var(--font-size-sm) !important;
  padding: 0.25rem 0.5rem !important;
}

/* Container query for larger containers */
@container topbar (min-width: 800px) {
  .gps-topbar__container {
    padding: 0.75rem 1.5rem;
    gap: 0.75em;
  }
}

/* Container query for medium containers */
@container topbar (min-width: 600px) and (max-width: 799px) {
  .gps-topbar__container {
    padding: 0.75rem 1rem;
    gap: 0.5em;
  }
  
  .gps-topbar__font-controls {
    gap: 0.25rem;
  }
  
  .gps-topbar__font-dropdown {
    min-width: 80px !important;
  }
}

/* Hide font controls on small screens */
@container topbar (max-width: 599px) {
  .gps-topbar__font-controls {
    display: none;
  }
}
</style> 