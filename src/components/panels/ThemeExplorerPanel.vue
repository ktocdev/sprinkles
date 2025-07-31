<script setup>
import { ref } from 'vue'
import Panel from '../shared/Panel.vue'
import ThemeExplorer from '../shared/ThemeExplorer.vue'

const showThemeExplorer = ref(false)

function toggleThemeExplorer() {
  showThemeExplorer.value = !showThemeExplorer.value
}

// Expose toggle function for external use
defineExpose({
  toggleThemeExplorer
})
</script>

<template>
  <Panel 
    :isOpen="showThemeExplorer" 
    title="🎨 Theme Explorer" 
    @close="showThemeExplorer = false"
  >
    <ThemeExplorer />
  </Panel>
</template> 