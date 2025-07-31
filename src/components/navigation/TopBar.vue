<script setup>
import Button from '../shared/Button.vue'
import { useCageStore } from '../../stores/cage'

const cageStore = useCageStore()

function togglePause() {
  cageStore.togglePause()
}
</script>

<template>
  <header class="gps-topbar">
    <div class="gps-topbar__container gps-container">
      <div class="gps-topbar__brand">
        <div class="gps-topbar__logo">
          🐹
        </div>
        <h1 class="gps-topbar__title">Guinea Pig Simulator</h1>
      </div>
      
       <div class="gps-topbar__controls">
         <Button 
           type="flat"
           size="compact"
           @click="togglePause"
           class="gps-topbar__pause-button"
           :title="cageStore.paused ? 'Resume Game' : 'Pause Game'"
         >
           {{ cageStore.paused ? '▶️' : '⏸️' }} {{ cageStore.paused ? 'Resume' : 'Pause' }}
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
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  height: 3em;
}

.gps-topbar__container {
  padding: 0 .75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25em;
  position: relative;
  container-type: inline-size;
  container-name: topbar;
  height: 100%;
}

.gps-topbar__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.gps-topbar__logo {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
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
  font-size: var(--font-size-lg);
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

@media (min-width: 600px) {
  .gps-topbar__container {
    gap: 0.5em;
  }
  
  .gps-topbar__controls {
    gap: 0.25rem;
  }
  
  .gps-topbar__pause-button {
    padding: 0.25rem 0.5rem;
  }
  
  .gps-topbar__title {
    font-size: var(--font-size-xl);
  }
  
  .gps-topbar__logo {
    font-size: 1.75rem;
    min-width: 2.25rem;
    height: 2.25rem;
  }
}

@media (min-width: 800px) {
  .gps-topbar__container {
    gap: 0.75em;
  }
  
  .gps-topbar__title {
    font-size: var(--font-size-2xl);
  }
}

</style> 