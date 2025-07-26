<template>
  <div class="gps-cage-item-manager">
    <div class="gps-cage-item-manager__header">
      <h3 class="gps-cage-item-manager__title">Cage Items</h3>
    </div>
    
    <div class="gps-cage-item-manager__actions">
      <Button 
        type="primary"
        @click="showAddItemModal = true"
        title="Add Item to Cage"
      >
        ➕ Add Item
      </Button>
      <Button 
        type="warning"
        @click="resetInventory"
        title="Reset Inventory (Debug)"
      >
        🔄 Reset
      </Button>
      <Button 
        type="danger"
        @click="clearInventory"
        title="Clear All Inventory"
      >
        🗑️ Clear
      </Button>
    </div>

    <!-- Item Lists -->
    <div v-if="cageStore.items.length === 0" class="gps-cage-item-manager__no-cage-items">
      <div class="gps-cage-item-manager__no-cage-items-content">
        <h4>No items in cage yet</h4>
        <p>Add some items to your cage to get started!</p>
        <Button 
          type="primary"
          @click="showAddItemModal = true"
        >
          ➕ Add Your First Item
        </Button>
      </div>
    </div>
    
    <div v-else class="gps-cage-item-manager__sections">
      <!-- Permanent Items -->
      <div class="gps-cage-item-manager__section">
        <h4 class="gps-cage-item-manager__section-title">🏠 Permanent Items</h4>
        <div v-if="cageStore.permanentItems.length === 0" class="gps-cage-item-manager__empty">
          No permanent items in cage
        </div>
        <div v-else class="gps-cage-item-manager__items">
          <div 
            v-for="item in cageStore.permanentItems" 
            :key="item.id"
            class="gps-cage-item-manager__item"
          >
            <div class="gps-cage-item-manager__item-info">
              <span class="gps-cage-item-manager__item-name">{{ formatItemName(item.name) }}</span>
              <span class="gps-cage-item-manager__item-position">({{ item.x }}, {{ item.y }})</span>
            </div>
            <div class="gps-cage-item-manager__item-actions">
              <Button 
                type="flat"
                @click="moveItem(item)"
                title="Move Item"
              >
                📍
              </Button>
              <Button 
                type="flat"
                @click="returnToInventory(item)"
                title="Return to Inventory"
              >
                📦
              </Button>
              <Button 
                type="danger"
                @click="throwOutItem(item)"
                title="Throw Out"
              >
                🗑️
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Consumable Items -->
      <div class="gps-cage-item-manager__section">
        <h4 class="gps-cage-item-manager__section-title">🍽️ Consumable Items</h4>
        <div v-if="cageStore.consumableItems.length === 0" class="gps-cage-item-manager__empty">
          No consumable items in cage
        </div>
        <div v-else class="gps-cage-item-manager__items">
          <div 
            v-for="item in cageStore.consumableItems" 
            :key="item.id"
            class="gps-cage-item-manager__item"
          >
            <div class="gps-cage-item-manager__item-info">
              <span class="gps-cage-item-manager__item-name">{{ formatItemName(item.name) }}</span>
              <span class="gps-cage-item-manager__item-quantity">({{ item.quantity }})</span>
              <span class="gps-cage-item-manager__item-position">({{ item.x }}, {{ item.y }})</span>
            </div>
            <div class="gps-cage-item-manager__item-actions">
              <Button 
                type="flat"
                @click="consumeItem(item)"
                title="Consume Item"
              >
                🍽️
              </Button>
              <Button 
                type="flat"
                @click="moveItem(item)"
                title="Move Item"
              >
                📍
              </Button>
              <Button 
                type="flat"
                @click="returnToInventory(item)"
                title="Return to Inventory"
              >
                📦
              </Button>
              <Button 
                type="danger"
                @click="throwOutItem(item)"
                title="Throw Out"
              >
                🗑️
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Item Modal -->
    <Modal 
      :isVisible="showAddItemModal"
      title="Add Item to Cage"
      @close="showAddItemModal = false"
    >
      <div class="gps-cage-item-manager__form-group">
        <label>Item:</label>
        <div v-if="!hasAnyItems" class="gps-cage-item-manager__no-items-message">
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
      </div>
      
      <FormGroup label="Position X">
        <Input 
          v-model.number="itemX" 
          type="number" 
          :min="0" 
          :max="cageStore.size.width - 1"
          placeholder="Enter X position"
          icon="📍"
        />
      </FormGroup>
      
      <FormGroup label="Position Y">
        <Input 
          v-model.number="itemY" 
          type="number" 
          :min="0" 
          :max="cageStore.size.height - 1"
          placeholder="Enter Y position"
          icon="📍"
        />
      </FormGroup>
      
      <template #actions>
        <Button 
          type="secondary"
          @click="showAddItemModal = false"
        >
          Cancel
        </Button>
        <Button 
          type="primary"
          @click="addItemToCage"
          :class="{ 'gps-button--disabled': !hasAnyItems || !selectedItem || itemX === null || itemY === null }"
        >
          Add Item
        </Button>
      </template>
    </Modal>

    <!-- Move Item Modal -->
    <Modal 
      :isVisible="showMoveModal"
      :title="`Move ${formatItemName(itemToMove?.name)}`"
      @close="showMoveModal = false"
    >
      <FormGroup label="New Position X">
        <Input 
          v-model.number="moveX" 
          type="number" 
          :min="0" 
          :max="cageStore.size.width - 1"
          placeholder="Enter X position"
          icon="📍"
        />
      </FormGroup>
      
      <FormGroup label="New Position Y">
        <Input 
          v-model.number="moveY" 
          type="number" 
          :min="0" 
          :max="cageStore.size.height - 1"
          placeholder="Enter Y position"
          icon="📍"
        />
      </FormGroup>
      
      <template #actions>
        <Button 
          type="secondary"
          @click="showMoveModal = false"
        >
          Cancel
        </Button>
        <Button 
          type="primary"
          @click="confirmMoveItem"
          :class="{ 'gps-button--disabled': moveX === null || moveY === null }"
        >
          Move Item
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCageStore } from '../../stores/cage'
import { useInventoryStore } from '../../stores/inventory'
import Button from '../shared/Button.vue'
import Dropdown from '../shared/Dropdown.vue'
import Modal from '../shared/Modal.vue'
import Input from '../shared/Input.vue'
import FormGroup from '../shared/FormGroup.vue'

const cageStore = useCageStore()
const inventoryStore = useInventoryStore()

// Modal states
const showAddItemModal = ref(false)
const showMoveModal = ref(false)
const selectedItem = ref('')
const itemX = ref(null)
const itemY = ref(null)
const itemToMove = ref(null)
const moveX = ref(null)
const moveY = ref(null)

// Item definitions
const itemDefinitions = {
  // Consumables
  bedding: { name: 'Bedding', type: 'bedding', isConsumable: true },
  hay: { name: 'Hay', type: 'food', isConsumable: true },
  pellets: { name: 'Pellets', type: 'food', isConsumable: true },
  lettuce: { name: 'Lettuce', type: 'food', isConsumable: true },
  blueberries: { name: 'Blueberries', type: 'food', isConsumable: true },
  carrots: { name: 'Carrots', type: 'food', isConsumable: true },
  cucumbers: { name: 'Cucumbers', type: 'food', isConsumable: true },
  small_chew_stick: { name: 'Small Chew Stick', type: 'chew', isConsumable: true },
  large_chew_stick: { name: 'Large Chew Stick', type: 'chew', isConsumable: true },
  chew_cube: { name: 'Chew Cube', type: 'chew', isConsumable: true },
  
  // Permanents
  small_ball: { name: 'Small Ball', type: 'toy', isConsumable: false },
  large_ball: { name: 'Large Ball', type: 'toy', isConsumable: false },
  small_tunnel: { name: 'Small Tunnel', type: 'toy', isConsumable: false },
  large_tunnel: { name: 'Large Tunnel', type: 'toy', isConsumable: false },
  small_hammock: { name: 'Small Hammock', type: 'bed', isConsumable: false },
  large_hammock: { name: 'Large Hammock', type: 'bed', isConsumable: false },
  small_bed: { name: 'Small Bed', type: 'bed', isConsumable: false },
  large_bed: { name: 'Large Bed', type: 'bed', isConsumable: false },
  small_house: { name: 'Small House', type: 'shelter', isConsumable: false },
  large_house: { name: 'Large House', type: 'shelter', isConsumable: false }
}

// Computed properties
const availableConsumables = computed(() => {
  const consumables = {}
  Object.keys(itemDefinitions).forEach(item => {
    if (itemDefinitions[item].isConsumable && inventoryStore.items[item] > 0) {
      consumables[item] = inventoryStore.items[item]
    }
  })
  console.log('Available consumables:', consumables)
  return consumables
})

const availablePermanents = computed(() => {
  const permanents = {}
  Object.keys(itemDefinitions).forEach(item => {
    if (!itemDefinitions[item].isConsumable && inventoryStore.items[item] > 0) {
      permanents[item] = inventoryStore.items[item]
    }
  })
  console.log('Available permanents:', permanents)
  return permanents
})

const hasAnyItems = computed(() => {
  return Object.keys(availableConsumables.value).length > 0 || 
         Object.keys(availablePermanents.value).length > 0
})

// Dropdown options for item selection
const itemDropdownOptions = computed(() => {
  const options = []
  
  // Add consumable items
  Object.keys(availableConsumables.value).forEach(item => {
    options.push({
      value: item,
      label: `${formatItemName(item)} (${availableConsumables.value[item]})`
    })
  })
  
  // Add permanent items
  Object.keys(availablePermanents.value).forEach(item => {
    options.push({
      value: item,
      label: `${formatItemName(item)} (${availablePermanents.value[item]})`
    })
  })
  
  return options
})

// Methods
function formatItemName(itemName) {
  if (!itemName) return ''
  return itemName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function addItemToCage() {
  if (!selectedItem.value || itemX.value === null || itemY.value === null) return
  
  const itemDef = itemDefinitions[selectedItem.value]
  if (!itemDef) return
  
  const success = cageStore.addItem({
    name: selectedItem.value,
    type: itemDef.type,
    isConsumable: itemDef.isConsumable
  }, itemX.value, itemY.value)
  
  if (success) {
    inventoryStore.removeItem(selectedItem.value, 1)
    showAddItemModal.value = false
    selectedItem.value = ''
    itemX.value = null
    itemY.value = null
  } else {
    alert('Position is occupied! Please choose a different location.')
  }
}

function moveItem(item) {
  itemToMove.value = item
  moveX.value = item.x
  moveY.value = item.y
  showMoveModal.value = true
}

function confirmMoveItem() {
  if (!itemToMove.value || moveX.value === null || moveY.value === null) return
  
  const success = cageStore.moveItem(itemToMove.value.id, moveX.value, moveY.value)
  
  if (success) {
    showMoveModal.value = false
    itemToMove.value = null
    moveX.value = null
    moveY.value = null
  } else {
    alert('Position is occupied! Please choose a different location.')
  }
}

function consumeItem(item) {
  if (!item.isConsumable) return
  
  const success = cageStore.consumeItem(item.id)
  if (success) {
    // Item was consumed successfully
  }
}

function returnToInventory(item) {
  cageStore.removeItem(item.id)
  inventoryStore.addItem(item.name, 1)
}

function throwOutItem(item) {
  const confirmed = confirm(`Are you sure you want to throw out ${formatItemName(item.name)}? This action cannot be undone.`)
  if (confirmed) {
    cageStore.removeItem(item.id)
  }
}

function resetInventory() {
  inventoryStore.resetToDefaults()
}

function clearInventory() {
  const confirmed = confirm('Are you sure you want to clear all items from your inventory? This action cannot be undone.')
  if (confirmed) {
    // Set all items to 0
    Object.keys(inventoryStore.items).forEach(item => {
      inventoryStore.setItemQuantity(item, 0)
    })
  }
}
</script>

<style>
.gps-cage-item-manager {
  width: 100%;
}

.gps-cage-item-manager__header {
  margin-block-end: 1rem;
}

.gps-cage-item-manager__actions {
  display: flex;
  gap: 0.5rem;
  margin-block-end: 1.5rem;
  flex-wrap: wrap;
}

.gps-cage-item-manager__title {
  font-size: var(--font-size-2xl);
  color: var(--color-accent);
  margin: 0;
  font-weight: var(--font-weight-semibold);
}

/* Action buttons now use shared Button component */

.gps-cage-item-manager__sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.gps-cage-item-manager__section {
  background: var(--color-panel);
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.gps-cage-item-manager__section-title {
  font-size: var(--font-size-lg);
  color: var(--color-accent);
  margin: 0 0 1rem 0;
  font-weight: var(--font-weight-semibold);
}

.gps-cage-item-manager__empty {
  color: var(--color-text);
  opacity: 0.6;
  font-style: italic;
  text-align: center;
  padding: 1rem;
}

.gps-cage-item-manager__items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gps-cage-item-manager__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--color-bg);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-cage-item-manager__item-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.gps-cage-item-manager__item-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.gps-cage-item-manager__item-quantity {
  color: var(--color-accent);
  font-size: var(--font-size-sm);
}

.gps-cage-item-manager__item-position {
  color: var(--color-text);
  opacity: 0.6;
  font-size: var(--font-size-sm);
}

.gps-cage-item-manager__item-actions {
  display: flex;
  gap: 0.25rem;
}

.gps-cage-item-manager__action-button {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: var(--transition);
  font-size: 1.1em;
}

.gps-cage-item-manager__action-button:hover {
  background: var(--color-accent);
  color: var(--color-white);
}

.gps-cage-item-manager__action-button--danger:hover {
  background: var(--color-danger);
}



.gps-cage-item-manager__no-items-message {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 1rem;
  text-align: center;
  color: var(--color-text);
  opacity: 0.8;
}

.gps-cage-item-manager__no-items-message p {
  margin: 0.5rem 0;
  font-size: var(--font-size-sm);
}

.gps-cage-item-manager__no-items-message p:first-child {
  font-weight: var(--font-weight-medium);
  color: var(--color-accent);
}

.gps-cage-item-manager__no-cage-items {
  background: var(--color-panel);
  border-radius: var(--border-radius);
  padding: 3rem 2rem;
  text-align: center;
}

.gps-cage-item-manager__no-cage-items-content h4 {
  color: var(--color-accent);
  font-size: var(--font-size-lg);
  margin: 0 0 1rem 0;
  font-weight: var(--font-weight-semibold);
}

.gps-cage-item-manager__no-cage-items-content p {
  color: var(--color-text);
  opacity: 0.8;
  margin: 0 0 2rem 0;
  font-size: var(--font-size-base);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .gps-cage-item-manager__actions {
    justify-content: center;
  }
  
  .gps-cage-item-manager__item {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }
  
  .gps-cage-item-manager__item-actions {
    justify-content: center;
  }
}
</style> 