<template>
  <footer class="gps-footer">
    <div class="gps-footer__content-wrapper">
      <div class="gps-footer__content gps-flex--space-between">
        <p class="gps-footer__text">
          Guinea Pig Simulator - A text-based pet care game
        </p>
        <nav class="gps-footer__nav">
          <button class="gps-footer__link" @click="showThemeExplorer">
            🎨 Theme Explorer
          </button>
          <button class="gps-footer__link" @click="showSpecimenLanding">
            Component Specimens
          </button>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['showSpecimenLanding', 'showThemeExplorer'])

function showSpecimenLanding() {
  emit('showSpecimenLanding')
}

function showThemeExplorer() {
  emit('showThemeExplorer')
}
</script>

<style>
.gps-footer {
  background: var(--color-panel);
  border-block-start: 2px solid var(--color-accent);
  margin-block-start: auto;
  position: fixed;
  bottom: 0;
  left: 60px;
  right: 0;
  z-index: 200;
}

.gps-footer__content-wrapper {
  padding: 1rem 1.5rem;
  max-width: 1400px;
  margin-inline: auto;
}

.gps-footer__content {
  gap: 1rem;
}

.gps-footer__text {
  color: var(--color-text);
  margin: 0;
  font-size: var(--font-size-sm);
  opacity: 0.8;
}

.gps-footer__nav {
  display: flex;
  gap: 1rem;
}

.gps-footer__link {
  background: none;
  border: none;
  color: var(--color-accent);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  transition: var(--transition);
}

.gps-footer__link:hover {
  color: var(--color-accent-hover);
  text-decoration: underline;
}

.gps-footer__link:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

@media (max-width: 1250px) {
  .gps-footer__content-wrapper {
    max-width: 1200px;
    margin-inline: auto;
    padding: 1rem 1.5rem;
  }
  
  .gps-footer__content {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
}

@media (max-width: 768px) {
  .gps-footer {
    left: 50px;
  }
  
  .gps-footer__content-wrapper {
    margin-inline: auto;
    padding: 1rem;
  }
  
  .gps-footer__content {
    gap: 0.5rem;
  }
}
</style> 