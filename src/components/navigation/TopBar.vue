<script setup>
import { defineEmits } from 'vue'
import Button from '../shared/Button.vue'
import { getActivePinia } from 'pinia'
import { useCageStore } from '../../stores/cage'
import { useNeedsQueueStore } from '../../stores/needs/core/needsQueue'

const cageStore = useCageStore()
const needsQueueStore = useNeedsQueueStore()
const emit = defineEmits(['openGuineaPigInfo', 'gameReset'])

function togglePause() {
  cageStore.togglePause()
}

function openGuineaPigInfo() {
  emit('openGuineaPigInfo')
}

function resetGame() {
  if (window.confirm('Are you to start a new game? All progess will be lost.')) {
    // Stop needs system before reset
    needsQueueStore.stopNeedsSystem()
    
    // Reset all stores automatically using Pinia's active store registry
    const pinia = getActivePinia()
    if (pinia && pinia._s) {
      pinia._s.forEach((store, storeId) => {
        try {
          store.$reset()
          console.log(`✅ Reset store: ${storeId}`)
        } catch (error) {
          console.warn(`❌ Failed to reset store "${storeId}":`, error)
        }
      })
    }
    
    // Clear all persisted state from localStorage
    Object.keys(localStorage).forEach(key => {
      localStorage.removeItem(key)
    })
    
    // Restart needs system after everything is reset
    needsQueueStore.startNeedsSystem()
    
    // Pause the game so user has to click "Play" to start
    cageStore.pauseGame()
    
    // Emit event to notify parent about reset
    emit('gameReset')
  }
}
</script>

<template>
  <header class="gps-topbar">
    <div class="gps-topbar__container gps-container">
      <div class="gps-topbar__brand">
        <button 
          class="gps-topbar__logo gps-topbar__logo--clickable"
          @click="openGuineaPigInfo"
          title="Open Guinea Pig Information"
          aria-label="Open Guinea Pig Information"
        >
          🐹
        </button>
        <h1 class="gps-topbar__title">Guinea Pig Simulator</h1>
      </div>
      
       <div class="gps-topbar__controls">
         <Button 
           type="flat"
           size="compact"
           @click="resetGame"
           class="gps-topbar__reset-button"
           title="New Game"
         >
           🆕 New Game
         </Button>
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
  position: relative;
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

.gps-topbar__logo--clickable {
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
  padding: 0;
  margin: 0;
}

.gps-topbar__logo--clickable:hover {
  transform: scale(1.1);
  background: var(--color-accent-hover);
}

.gps-topbar__title {
  display: none;
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

.gps-topbar__reset-button {
  font-size: var(--font-size-sm);
  padding: 0.25rem 0.75rem;
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
  
  .gps-topbar__reset-button {
    padding: 0.25rem 0.5rem;
  }
  
  .gps-topbar__pause-button {
    padding: 0.25rem 0.5rem;
  }
  
  .gps-topbar__title {
    display: block;
    font-size: var(--font-size-xl);
  }
  
  .gps-topbar__logo {
    font-size: 1.75rem;
    min-width: 2.25rem;
    height: 2.25rem;
  }
}

/* Tablet and above enhancements */
@media (min-width: 768px) {
  .gps-topbar {
    height: 4rem;
  }
  
  .gps-topbar__container {
    padding: 0 1.5rem;
  }
  
  .gps-topbar__brand {
    gap: 1rem;
  }
  
  .gps-topbar__logo {
    font-size: 2.25rem;
    min-width: 3rem;
    height: 3rem;
    box-shadow: 0 4px 16px rgba(var(--color-accent-rgb), 0.3);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s ease, box-shadow 0.3s ease;
  }
  
  .gps-topbar__logo--clickable:hover {
    transform: scale(1.15) rotate(5deg);
    background: var(--color-accent-hover);
    box-shadow: 0 6px 20px rgba(var(--color-accent-rgb), 0.4);
  }
  
  .gps-topbar__title {
    font-size: var(--font-size-2xl);
  }
  
  .gps-topbar__reset-button {
    padding: 0.5rem 1rem;
    font-size: var(--font-size-base);
  }
  
  .gps-topbar__pause-button {
    padding: 0.5rem 1rem;
    font-size: var(--font-size-base);
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