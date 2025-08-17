<template>
  <div class="add-item">
    <FormGroup label="Item">
      <div v-if="!hasAnyItems" class="add-item__no-items-message">
        <p>No items available in your inventory.</p>
        <p>Visit the Market to buy items first!</p>
      </div>
      <Dropdown
        v-else
        v-model="selectedItem"
        :options="itemDropdownOptions"
        placeholder="Select an item..."
        :disabled="!hasAnyItems"
        aria-label="Select item to add to cage"
      />
    </FormGroup>
    
    <FormGroup label="Position X">
      <Input 
        v-model.number="itemX" 
        type="number" 
        :min="1" 
        :max="cageWidth"
        :placeholder="`Enter X position (1-${cageWidth})`"
        icon="📍"
      />
    </FormGroup>
    
    <FormGroup label="Position Y">
      <Input 
        v-model.number="itemY" 
        type="number" 
        :min="1" 
        :max="cageHeight"
        :placeholder="`Enter Y position (1-${cageHeight})`"
        icon="📍"
      />
    </FormGroup>
    
    <div class="add-item__actions">
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
        @click="handleAddItem"
        :class="{ 'gps-button--disabled': !hasAnyItems || !selectedItem || itemX === null || itemY === null }"
      >
        Add Item
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dropdown from '../shared/Dropdown.vue'
import Input from '../shared/Input.vue'
import FormGroup from '../shared/FormGroup.vue'
import Button from '../shared/Button.vue'

const props = defineProps({
  hasAnyItems: {
    type: Boolean,
    required: true
  },
  itemDropdownOptions: {
    type: Array,
    required: true
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

const emit = defineEmits(['cancel', 'addItem'])

const selectedItem = ref('')
const itemX = ref(null)
const itemY = ref(null)

// Reset form when modal becomes visible
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    selectedItem.value = ''
    itemX.value = null
    itemY.value = null
  }
})

// Method to set selected item directly (called from parent)
function setSelectedItem(itemName) {
  selectedItem.value = itemName || ''
}

// Expose method to parent component
defineExpose({
  setSelectedItem
})

function handleAddItem() {
  if (!selectedItem.value || itemX.value === null || itemY.value === null) return
  
  emit('addItem', {
    selectedItem: selectedItem.value,
    x: itemX.value,
    y: itemY.value
  })
  
  // Reset form
  selectedItem.value = ''
  itemX.value = null
  itemY.value = null
}
</script>

<style>
.add-item__actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.add-item__no-items-message {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 0.75rem;
  text-align: center;
  color: var(--color-text);
  opacity: 0.8;
}

.add-item__no-items-message p {
  margin: 0.4rem 0;
  font-size: var(--font-size-xs);
}

.add-item__no-items-message p:first-child {
  font-weight: var(--font-weight-medium);
  color: var(--color-accent);
}
</style>
