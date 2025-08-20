<script setup>
const props = defineProps({
  gridSize: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['size-change'])

const handleSizeChange = (event) => {
  emit('size-change', parseInt(event.target.value))
}
</script>

<template>
  <div class="grid-controls">
    <label for="gridSize">Palette Grid Size:</label>
    <select 
      id="gridSize" 
      :value="gridSize"
      @change="handleSizeChange"
    >
      <option value="2">2×2</option>
      <option value="3">3×3</option>
      <option value="4">4×4</option>
      <option value="5">5×5</option>
    </select>
  </div>
</template>

<style scoped>
/* Mobile-first grid controls */
.grid-controls {
  margin: 15px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.grid-controls label {
  font-weight: bold;
  font-size: 14px;
}

.grid-controls select {
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 120px;
}

/* Tablet and up */
@media (min-width: 481px) {
  .grid-controls {
    flex-direction: row;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;
  }
  
  .grid-controls select {
    font-size: 14px;
    padding: 6px 10px;
  }
}

/* Desktop and up */
@media (min-width: 769px) {
  .grid-controls {
    justify-content: flex-start;
    margin: 30px 0 20px 0;
  }
  
  .grid-controls select {
    padding: 5px 10px;
  }
}
</style>