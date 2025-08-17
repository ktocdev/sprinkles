<template>
  <div class="move-item">
    <FormGroup label="New Position X">
      <Input 
        v-model.number="moveX" 
        type="number" 
        :min="1" 
        :max="cageWidth"
        :placeholder="`Enter X position (1-${cageWidth})`"
        icon="📍"
      />
    </FormGroup>
    
    <FormGroup label="New Position Y">
      <Input 
        v-model.number="moveY" 
        type="number" 
        :min="1" 
        :max="cageHeight"
        :placeholder="`Enter Y position (1-${cageHeight})`"
        icon="📍"
      />
    </FormGroup>
    
    <div class="move-item__actions">
      <Button 
        type="secondary"
        size="compact"
        @click="$emit('cancel')"
      >
        Cancel
      </Button>
      <Button 
        type="primary"
        size="compact"
        @click="handleMoveItem"
        :class="{ 'gps-button--disabled': moveX === null || moveY === null }"
      >
        Move Item
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Input from '../shared/Input.vue'
import FormGroup from '../shared/FormGroup.vue'
import Button from '../shared/Button.vue'

const props = defineProps({
  itemToMove: {
    type: Object,
    default: null
  },
  cageWidth: {
    type: Number,
    required: true
  },
  cageHeight: {
    type: Number,
    required: true
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cancel', 'moveItem'])

const moveX = ref(null)
const moveY = ref(null)

// Populate form with current position when modal becomes visible
watch(() => props.isVisible, (newValue) => {
  if (newValue && props.itemToMove) {
    // Convert from 0-based to 1-based for display
    moveX.value = props.itemToMove.x + 1
    moveY.value = props.itemToMove.y + 1
  }
})

function handleMoveItem() {
  if (moveX.value === null || moveY.value === null) return
  
  emit('moveItem', {
    x: moveX.value,
    y: moveY.value
  })
  
  // Reset form
  moveX.value = null
  moveY.value = null
}
</script>

<style>
.move-item__actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}
</style>