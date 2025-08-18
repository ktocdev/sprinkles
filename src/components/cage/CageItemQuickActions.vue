<template>
  <div class="gps-quick-actions-panel">
    <h4 class="gps-section-header">Quick Add Items</h4>
    <div class="gps-quick-actions-buttons">
      <Button 
        type="primary"
        size="compact"
        @click="$emit('placeAllRandomly')"
        title="Place items from all categories randomly in cage"
        :class="{ 'gps-button--disabled': !hasAnyItems }"
      >
        🎲 All
      </Button>
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
import { computed } from 'vue'
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
  'placeAllRandomly',
  'placeFurnitureRandomly',
  'placeFoodRandomly',
  'placeChewsRandomly',
  'placeToyRandomly'
])

// Check if there are any items available from any category
const hasAnyItems = computed(() => {
  return props.hasAnyFurnitureItems || 
         props.hasAnyFoodItems || 
         props.hasAnyChewItems || 
         props.hasAnyToyItems
})
</script>

<style>
/* Component uses utility classes from style.css */
</style>
