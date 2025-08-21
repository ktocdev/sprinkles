<script setup>
defineEmits(['clear', 'randomize'])
</script>

<template>
  <div class="palette-controls">
    <button @click="$emit('clear')" class="btn-compact btn-gradient-red">
      Clear Palette
    </button>
    <button @click="$emit('randomize')" class="btn-compact btn-gradient-purple">
      Random Palette
    </button>
  </div>
</template>

<style scoped>
@import '../../styles/shared.css';

/* Mobile-first palette header */
.palette-controls {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

/* Tablet and up */
@media (min-width: 481px) {
  .palette-controls {
    flex-direction: row;
    gap: 28px;
  }
}
</style>