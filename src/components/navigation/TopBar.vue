<script setup>
import Button from '../shared/Button.vue'
import { useCageStore } from '../../stores/cage'

const cageStore = useCageStore()

defineEmits(['showDebug'])

function togglePause() {
  cageStore.togglePause()
}
</script>

<template>
  <header class="gps-topbar">
    <div class="gps-topbar__container gps-container">
      <!-- Title and Logo Group -->
      <div class="gps-topbar__brand">
        <div class="gps-topbar__logo">
          🐹
        </div>
        <h1 class="gps-topbar__title">Guinea Pig Simulator</h1>
      </div>
      
      <!-- Control Buttons -->
      <div class="gps-topbar__controls">
        <!-- Pause Button -->
        <Button 
          type="flat"
          size="compact"
          @click="togglePause"
          class="gps-topbar__pause-button"
          :title="cageStore.paused ? 'Resume Game' : 'Pause Game'"
        >
          {{ cageStore.paused ? '▶️' : '⏸️' }} {{ cageStore.paused ? 'Resume' : 'Pause' }}
        </Button>
        
        <!-- Debug Button -->
        <Button 
          type="flat"
          size="compact"
          @click="$emit('showDebug')"
          class="gps-topbar__debug-button"
          title="Debug Panel"
        >
          🐛 Debug
        </Button>
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
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25em;
  position: relative;
  container-type: inline-size;
  container-name: topbar;
}

.gps-topbar__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.gps-topbar__logo {
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  height: 2.25rem;
  background: var(--color-accent);
  border-radius: 50%;
  color: var(--color-panel);
  box-shadow: var(--box-shadow);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.gps-topbar__logo:hover {
  transform: scale(1.1);
}

.gps-topbar__title {
  font-size: var(--font-size-3xl);
  margin: 0;
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-family-header);
}

.gps-topbar__controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.gps-topbar__pause-button {
  font-size: var(--font-size-sm);
  padding: 0.25rem 0.75rem;
}

.gps-topbar__debug-button {
  font-size: var(--font-size-sm);
  padding: 0.25rem 0.75rem;
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
  
  .gps-topbar__controls {
    gap: 0.25rem;
  }
  
  .gps-topbar__pause-button,
  .gps-topbar__debug-button {
    padding: 0.25rem 0.5rem;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .gps-topbar {
    margin-inline-start: 50px;
    width: calc(100% - 50px);
  }
}
</style> 