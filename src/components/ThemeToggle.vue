<script setup>
import { ref, onMounted } from 'vue'
import Button from './Button.vue'

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
  <Button type="flat" @click="toggleTheme">
    <span v-if="isLight">🌞 Light</span>
    <span v-else>🌙 Dark</span>
  </Button>
</template> 