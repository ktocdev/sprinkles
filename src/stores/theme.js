import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isLight = ref(false)

  function toggleTheme() {
    isLight.value = !isLight.value
    document.body.classList.toggle('theme-light', isLight.value)
  }

  function initTheme() {
    document.body.classList.toggle('theme-light', isLight.value)
  }

  return {
    isLight,
    toggleTheme,
    initTheme
  }
}) 