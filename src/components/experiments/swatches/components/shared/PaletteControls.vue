<script setup>
defineEmits(['clear', 'randomize'])
</script>

<template>
  <div class="palette-header">
    <h3>Your Custom Palette</h3>
    <div class="palette-controls">
      <button @click="$emit('clear')" class="palette-button clear-button">
        Clear Palette
      </button>
      <button @click="$emit('randomize')" class="palette-button random-button">
        Random Palette
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Mobile-first palette header */
.palette-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

.palette-header h3 {
  font-size: 16px;
  margin: 0;
  text-align: center;
}

.palette-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.palette-button {
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
}

.clear-button {
  background: linear-gradient(135deg, #6B0F1A, #FF0055);
  color: white;
}

.clear-button:hover {
  background: linear-gradient(135deg, #5A0D16, #E6004C);
}

.random-button {
  background: linear-gradient(135deg, #6A5ACD, #2C2A4A);
  color: white;
}

.random-button:hover {
  background: linear-gradient(135deg, #5A4AB7, #242240);
}

/* Tablet and up */
@media (min-width: 481px) {
  .palette-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .palette-header h3 {
    font-size: 18px;
    text-align: left;
  }
  
  .palette-controls {
    flex-direction: row;
    gap: 10px;
  }
  
  .palette-button {
    padding: 10px 16px;
    font-size: 14px;
  }
}

/* Desktop and up */
@media (min-width: 769px) {
  .palette-button {
    padding: 8px 16px;
  }
}
</style>