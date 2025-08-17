<template>
  <div class="gps-cage-item-quick-actions">
    <h4 class="gps-section-header">Quick Add Items</h4>
    <div class="gps-cage-item-quick-actions__buttons">
      <Button 
        type="secondary"
        size="compact"
        @click="$emit('placeFurnitureRandomly')"
        title="Place furniture items randomly in cage"
        :class="{ 'gps-button--disabled': !hasAnyFurnitureItems }"
      >
        🪑 Furniture
      </Button>
      <Button 
        type="secondary"
        size="compact"
        @click="$emit('placeFoodRandomly')"
        title="Place food items randomly in cage"
        :class="{ 'gps-button--disabled': !hasAnyFoodItems }"
      >
        🥕 Food
      </Button>
      <Button 
        type="secondary"
        size="compact"
        @click="$emit('placeChewsRandomly')"
        title="Place chew items randomly in cage"
        :class="{ 'gps-button--disabled': !hasAnyChewItems }"
      >
        🪵 Chews
      </Button>
      <Button 
        type="secondary"
        size="compact"
        @click="$emit('placeToyRandomly')"
        title="Place toy items randomly in cage"
        :class="{ 'gps-button--disabled': !hasAnyToyItems }"
      >
        🧸 Toys
      </Button>
    </div>
  </div>
</template>

<script setup>
import Button from '../shared/Button.vue'

const props = defineProps({
  hasAnyFurnitureItems: {
    type: Boolean,
    required: true
  },
  hasAnyFoodItems: {
    type: Boolean,
    required: true
  },
  hasAnyChewItems: {
    type: Boolean,
    required: true
  },
  hasAnyToyItems: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits([
  'placeFurnitureRandomly',
  'placeFoodRandomly',
  'placeChewsRandomly',
  'placeToyRandomly'
])
</script>

<style>
.gps-cage-item-quick-actions {
  margin-block-end: 1rem;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 1rem;
}

.gps-cage-item-quick-actions__buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.gps-cage-item-quick-actions__buttons .gps-button {
  border-color: var(--color-border-light);
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .gps-cage-item-quick-actions__buttons {
    justify-content: center;
  }
}
</style>
