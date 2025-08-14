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

  // Manual reset function for setup syntax stores
  function $reset() {
    isLight.value = false
    document.body.classList.remove('theme-light')
  }

  return {
    isLight,
    toggleTheme,
    initTheme,
    $reset
  }
}, {
  persist: true
}) 