<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})

defineEmits(['close'])
</script>

<template>
  <div class="swatches-header">
    <h2>{{ title }}</h2>
    <button @click="$emit('close')" class="close-button">✕ Close</button>
  </div>
</template>

<style scoped>
.swatches-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.swatches-header h2 {
  font-size: 18px;
  margin: 0;
}

.close-button {
  background: linear-gradient(135deg, #6B0F1A, #FF0055);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.close-button:hover {
  background: linear-gradient(135deg, #5A0D16, #E6004C);
}

/* Tablet and up */
@media (min-width: 481px) {
  .swatches-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
  }
  
  .swatches-header h2 {
    font-size: 22px;
  }
}

/* Desktop and up */
@media (min-width: 769px) {
  .swatches-header {
    margin-bottom: 20px;
  }
  
  .swatches-header h2 {
    font-size: 24px;
  }
}
</style>