<script setup>
import { ref, onMounted } from 'vue'

const isLight = ref(false)

function toggleTheme() {
  isLight.value = !isLight.value
  document.body.classList.toggle('theme-light', isLight.value)
}

onMounted(() => {
  document.body.classList.toggle('theme-light', isLight.value)
})
</script>

<template>
  <button class="gps-theme-toggle" @click="toggleTheme">
    <span v-if="isLight">🌞 Light</span>
    <span v-else>🌙 Dark</span>
  </button>
</template>

<style>
.gps-theme-toggle {
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  z-index: 10;
  padding: 0.5em 1em;
  border: none;
  background: var(--color-panel);
  color: var(--color-text);
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: background 0.2s, color 0.2s;
}
.gps-theme-toggle:hover {
  background: var(--color-accent);
  color: var(--color-white);
}
</style> 