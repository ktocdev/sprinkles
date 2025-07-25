<template>
  <footer class="gps-footer">
    <div class="gps-footer__container">
      <div class="gps-footer__content">
        <p class="gps-footer__text">
          Guinea Pig Simulator - A text-based pet care game
        </p>
        <nav class="gps-footer__nav">
          <a href="#" class="gps-footer__link" @click.prevent="showButtonSpecimen">
            Button Specimen
          </a>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['showButtonSpecimen'])

function showButtonSpecimen() {
  emit('showButtonSpecimen')
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
}

.gps-footer__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.gps-footer__text {
  color: var(--color-text);
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

.gps-footer__nav {
  display: flex;
  gap: 1rem;
}

.gps-footer__link {
  color: var(--color-accent);
  text-decoration: none;
  font-size: 0.9rem;
  transition: var(--transition);
}

.gps-footer__link:hover {
  color: var(--color-accent-hover);
  text-decoration: underline;
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