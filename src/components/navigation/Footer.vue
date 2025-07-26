<template>
  <footer class="gps-footer">
    <div class="gps-footer__container gps-container">
      <div class="gps-footer__content gps-flex--space-between">
        <p class="gps-footer__text">
          Guinea Pig Simulator - A text-based pet care game
        </p>
        <nav class="gps-footer__nav">
          <button class="gps-footer__link" @click="showButtonSpecimen">
            Button Specimen
          </button>
          <button class="gps-footer__link" @click="showDropdownSpecimen">
            Dropdown Specimen
          </button>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['showButtonSpecimen', 'showDropdownSpecimen'])

function showButtonSpecimen() {
  emit('showButtonSpecimen')
}

function showDropdownSpecimen() {
  emit('showDropdownSpecimen')
}
</script>

<style>
.gps-footer {
  width: 100%;
  background: var(--color-panel);
  border-block-start: 2px solid var(--color-accent);
  margin-block-start: auto;
}

.gps-footer__container {
  padding: 1rem 1.5rem;
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

/* Mobile responsiveness */
@media (max-width: 768px) {
  .gps-footer__container {
    padding: 1rem;
  }
  
  .gps-footer__content {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}
</style> 