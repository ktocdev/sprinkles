<script setup>
import { onMounted } from 'vue'
import Button from './Button.vue'
import { useThemeStore } from '../../stores/theme'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <Button type="flat" @click="themeStore.toggleTheme">
    <span v-if="themeStore.isLight">🌞 Light</span>
    <span v-else>🌙 Dark</span>
  </Button>
</template> 