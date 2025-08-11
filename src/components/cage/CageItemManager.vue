<template>
  <div class="gps-cage-item-manager">
    <div v-if="cageStore.items.length > 0" class="gps-cage-item-manager__actions">
      <Button 
        type="primary"
        size="compact"
        @click="showAddItemModal = true"
        title="Add Item to Cage"
      >
        ➕ Add Item
      </Button>
      <Button 
        type="secondary"
        size="compact"
        @click="placeItemsRandomly"
        title="Place items randomly in cage"
        :class="{ 'gps-button--disabled': !hasAnyItems }"
      >
        🎲 Random Place
      </Button>
      <Button 
        type="warning"
        size="compact"
        @click="placeFoodRandomly"
        title="Place random food items in cage"
        :class="{ 'gps-button--disabled': !hasAnyFoodItems }"
      >
        🥕 Feed Time
      </Button>
    </div>

    <!-- Item Lists -->
    <div v-if="cageStore.items.length === 0" class="gps-cage-item-manager__no-cage-items">
      <div class="gps-cage-item-manager__no-cage-items-content">
        <h4>No items in cage yet</h4>
        <p>Add some items to your cage to get started!</p>
        <div class="gps-cage-item-manager__first-item-actions">
          <Button 
            type="primary"
            size="compact"
            @click="showAddItemModal = true"
          >
            ➕ Add Your First Item
          </Button>
          <Button 
            type="secondary"
            size="compact"
            @click="placeItemsRandomly"
            title="Place items randomly in cage"
            :class="{ 'gps-button--disabled': !hasAnyItems }"
          >
            🎲 Random Place
          </Button>
          <Button 
            type="warning"
            size="compact"
            @click="placeFoodRandomly"
            title="Place random food items in cage"
            :class="{ 'gps-button--disabled': !hasAnyFoodItems }"
          >
            🥕 Feed Time
          </Button>
        </div>
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
                size="compact"
                @click="moveItem(item)"
                title="Move Item"
              >
                📍
              </Button>
              <Button 
                type="flat"
                size="compact"
                @click="returnToInventory(item)"
                title="Return to Inventory"
              >
                📦
              </Button>
              <Button 
                type="danger"
                size="compact"
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
                size="compact"
                @click="consumeItem(item)"
                title="Consume Item"
              >
                🍽️
              </Button>
              <Button 
                type="flat"
                size="compact"
                @click="moveItem(item)"
                title="Move Item"
              >
                📍
              </Button>
              <Button 
                type="flat"
                size="compact"
                @click="returnToInventory(item)"
                title="Return to Inventory"
              >
                📦
              </Button>
              <Button 
                type="danger"
                size="compact"
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
      <FormGroup label="Item">
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
      </FormGroup>
      
      <FormGroup label="Position X">
        <Input 
          v-model.number="itemX" 
          type="number" 
          :min="1" 
          :max="cageStore.size.width"
          :placeholder="`Enter X position (1-${cageStore.size.width})`"
          icon="📍"
        />
      </FormGroup>
      
      <FormGroup label="Position Y">
        <Input 
          v-model.number="itemY" 
          type="number" 
          :min="1" 
          :max="cageStore.size.height"
          :placeholder="`Enter Y position (1-${cageStore.size.height})`"
          icon="📍"
        />
      </FormGroup>
      
      <template #actions>
        <Button 
          type="secondary"
          size="compact"
          @click="showAddItemModal = false"
        >
          Cancel
        </Button>
        <Button 
          type="primary"
          size="compact"
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
          :min="1" 
          :max="cageStore.size.width"
          :placeholder="`Enter X position (1-${cageStore.size.width})`"
          icon="📍"
        />
      </FormGroup>
      
      <FormGroup label="New Position Y">
        <Input 
          v-model.number="moveY" 
          type="number" 
          :min="1" 
          :max="cageStore.size.height"
          :placeholder="`Enter Y position (1-${cageStore.size.height})`"
          icon="📍"
        />
      </FormGroup>
      
      <template #actions>
        <Button 
          type="secondary"
          size="compact"
          @click="showMoveModal = false"
        >
          Cancel
        </Button>
        <Button 
          type="primary"
          size="compact"
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
import { ref, computed, onMounted } from 'vue'
import { useCageStore } from '../../stores/cage'
import { useInventoryStore } from '../../stores/inventory'
import { usePoopStore } from '../../stores/poop'
import Button from '../shared/Button.vue'
import Dropdown from '../shared/Dropdown.vue'
import Modal from '../shared/Modal.vue'
import Input from '../shared/Input.vue'
import FormGroup from '../shared/FormGroup.vue'

const cageStore = useCageStore()
const inventoryStore = useInventoryStore()
const poopStore = usePoopStore()


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
  hay: { name: 'Hay', type: 'food', isConsumable: true, size: { width: 1, height: 1 } },
  pellets: { name: 'Pellets', type: 'food', isConsumable: true, size: { width: 1, height: 1 } },
  lettuce: { name: 'Lettuce', type: 'food', isConsumable: true, size: { width: 1, height: 1 } },
  blueberries: { name: 'Blueberries', type: 'food', isConsumable: true, size: { width: 1, height: 1 } },
  carrots: { name: 'Carrots', type: 'food', isConsumable: true, size: { width: 1, height: 1 } },
  cucumbers: { name: 'Cucumbers', type: 'food', isConsumable: true, size: { width: 1, height: 1 } },
  small_chew_stick: { name: 'Small Chew Stick', type: 'chew', isConsumable: true, size: { width: 1, height: 1 } },
  large_chew_stick: { name: 'Large Chew Stick', type: 'chew', isConsumable: true, size: { width: 1, height: 1 } },
  chew_cube: { name: 'Chew Cube', type: 'chew', isConsumable: true, size: { width: 1, height: 1 } },
  
  // Permanents
  small_ball: { name: 'Small Ball', type: 'toy', isConsumable: false, size: { width: 1, height: 1 } },
  large_ball: { name: 'Large Ball', type: 'toy', isConsumable: false, size: { width: 1, height: 1 } },
  small_tunnel: { name: 'Small Tunnel', type: 'toy', isConsumable: false, size: { width: 1, height: 1 } },
  large_tunnel: { name: 'Large Tunnel', type: 'toy', isConsumable: false, size: { width: 1, height: 1 } },
  small_hammock: { name: 'Small Hammock', type: 'bed', isConsumable: false, size: { width: 1, height: 1 } },
  large_hammock: { name: 'Large Hammock', type: 'bed', isConsumable: false, size: { width: 2, height: 2 } },
  small_bed: { name: 'Small Bed', type: 'bed', isConsumable: false, size: { width: 1, height: 1 } },
  large_bed: { name: 'Large Bed', type: 'bed', isConsumable: false, size: { width: 2, height: 2 } },
  small_house: { name: 'Small House', type: 'shelter', isConsumable: false, size: { width: 1, height: 1 } },
  large_house: { name: 'Large House', type: 'shelter', isConsumable: false, size: { width: 2, height: 2 } }
}



// Computed properties
const availableConsumables = computed(() => {
  const consumables = {}
  Object.keys(itemDefinitions).forEach(item => {
    if (itemDefinitions[item].isConsumable && inventoryStore.items[item] > 0) {
      consumables[item] = inventoryStore.items[item]
    }
  })
  return consumables
})

const availablePermanents = computed(() => {
  const permanents = {}
  Object.keys(itemDefinitions).forEach(item => {
    if (!itemDefinitions[item].isConsumable && inventoryStore.items[item] > 0) {
      permanents[item] = inventoryStore.items[item]
    }
  })
  return permanents
})

const hasAnyItems = computed(() => {
  return Object.keys(availableConsumables.value).length > 0 || 
         Object.keys(availablePermanents.value).length > 0
})

const availableFoodItems = computed(() => {
  const foodItems = {}
  Object.keys(itemDefinitions).forEach(item => {
    if (itemDefinitions[item].type === 'food' && inventoryStore.items[item] > 0) {
      foodItems[item] = inventoryStore.items[item]
    }
  })
  return foodItems
})

const hasAnyFoodItems = computed(() => {
  return Object.keys(availableFoodItems.value).length > 0
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
  
  // Convert from 1-based to 0-based coordinates
  const x = itemX.value - 1
  const y = itemY.value - 1
  
  // Check if item fits within grid bounds
  const itemWidth = itemDef.size.width
  const itemHeight = itemDef.size.height
  
  if (x + itemWidth > cageStore.size.width || y + itemHeight > cageStore.size.height) {
    alert(`This ${formatItemName(itemDef.name)} (${itemWidth}x${itemHeight}) doesn't fit at position (${itemX.value}, ${itemY.value}). Please choose a position where the item fits within the ${cageStore.size.width}x${cageStore.size.height} grid.`)
    return
  }
  
  // Check if all required positions are available
  for (let checkY = y; checkY < y + itemHeight; checkY++) {
    for (let checkX = x; checkX < x + itemWidth; checkX++) {
      // Check if position is occupied by another item
      const isOccupiedByItem = cageStore.items.some(i => i.x === checkX && i.y === checkY)
      // Check if position is occupied by guinea pig
      const isOccupiedByGuineaPig = (cageStore.guineaPigPos.x === checkX && cageStore.guineaPigPos.y === checkY)
      // Check if position is occupied by poop
      const isOccupiedByPoop = poopStore.poop.some(p => p.x === checkX && p.y === checkY)
      // Check if position is water bottle position
      const isWaterBottlePosition = (checkX === cageStore.size.width - 1 && checkY === 0)
      
      if (isOccupiedByItem) {
        alert(`Position (${checkX + 1}, ${checkY + 1}) is occupied by another item! Please choose a different location.`)
        return
      } else if (isOccupiedByGuineaPig) {
        alert(`Position (${checkX + 1}, ${checkY + 1}) is occupied by the guinea pig! Please choose a different location.`)
        return
      } else if (isOccupiedByPoop) {
        alert(`Position (${checkX + 1}, ${checkY + 1}) is occupied by poop! Please clean the cage or choose a different location.`)
        return
      } else if (isWaterBottlePosition) {
        alert(`Cannot place items on the water bottle position (${checkX + 1}, ${checkY + 1})! Please choose a different location.`)
        return
      }
    }
  }
  
  const success = cageStore.addItem({
    name: selectedItem.value,
    type: itemDef.type,
    isConsumable: itemDef.isConsumable,
    size: itemDef.size
  }, x, y)
  
  if (success) {
    inventoryStore.removeItem(selectedItem.value, 1)
    showAddItemModal.value = false
    selectedItem.value = ''
    itemX.value = null
    itemY.value = null
  } else {
    alert('Failed to add item! Please choose a different location.')
  }
}

function moveItem(item) {
  itemToMove.value = item
  // Convert from 0-based to 1-based for display
  moveX.value = item.x + 1
  moveY.value = item.y + 1
  showMoveModal.value = true
}

function confirmMoveItem() {
  if (!itemToMove.value || moveX.value === null || moveY.value === null) return
  
  // Convert from 1-based to 0-based coordinates
  const x = moveX.value - 1
  const y = moveY.value - 1
  
  // Get item size (default to 1x1 if not specified)
  const itemSize = itemToMove.value.size || { width: 1, height: 1 }
  const itemWidth = itemSize.width
  const itemHeight = itemSize.height
  
  // Check if item fits within grid bounds
  if (x + itemWidth > cageStore.size.width || y + itemHeight > cageStore.size.height) {
    alert(`This ${formatItemName(itemToMove.value.name)} (${itemWidth}x${itemHeight}) doesn't fit at position (${moveX.value}, ${moveY.value}). Please choose a position where the item fits within the ${cageStore.size.width}x${cageStore.size.height} grid.`)
    return
  }
  
  // Check if all required positions are available
  for (let checkY = y; checkY < y + itemHeight; checkY++) {
    for (let checkX = x; checkX < x + itemWidth; checkX++) {
      // Check if position is occupied by another item (excluding the item being moved)
      const isOccupiedByItem = cageStore.items.some(i => i.id !== itemToMove.value.id && i.x === checkX && i.y === checkY)
      // Check if position is occupied by guinea pig
      const isOccupiedByGuineaPig = (cageStore.guineaPigPos.x === checkX && cageStore.guineaPigPos.y === checkY)
      // Check if position is occupied by poop
      const isOccupiedByPoop = poopStore.poop.some(p => p.x === checkX && p.y === checkY)
      // Check if position is water bottle position
      const isWaterBottlePosition = (checkX === cageStore.size.width - 1 && checkY === 0)
      
      if (isOccupiedByItem) {
        alert(`Position (${checkX + 1}, ${checkY + 1}) is occupied by another item! Please choose a different location.`)
        return
      } else if (isOccupiedByGuineaPig) {
        alert(`Position (${checkX + 1}, ${checkY + 1}) is occupied by the guinea pig! Please choose a different location.`)
        return
      } else if (isOccupiedByPoop) {
        alert(`Position (${checkX + 1}, ${checkY + 1}) is occupied by poop! Please clean the cage or choose a different location.`)
        return
      } else if (isWaterBottlePosition) {
        alert(`Cannot move items to the water bottle position (${checkX + 1}, ${checkY + 1})! Please choose a different location.`)
        return
      }
    }
  }
  
  const success = cageStore.moveItem(itemToMove.value.id, x, y)
  
  if (success) {
    showMoveModal.value = false
    itemToMove.value = null
    moveX.value = null
    moveY.value = null
  } else {
    alert('Failed to move item! Please choose a different location.')
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

// Check if an item can fit at a specific position
function canItemFitAtPosition(itemSize, x, y) {
  const itemWidth = itemSize.width
  const itemHeight = itemSize.height
  
  // Check if item fits within grid bounds
  if (x + itemWidth > cageStore.size.width || y + itemHeight > cageStore.size.height) {
    return false
  }
  
  // Check if all required positions are available
  for (let checkY = y; checkY < y + itemHeight; checkY++) {
    for (let checkX = x; checkX < x + itemWidth; checkX++) {
      // Check if position is occupied by another item
      const isOccupiedByItem = cageStore.items.some(i => i.x === checkX && i.y === checkY)
      // Check if position is occupied by guinea pig
      const isOccupiedByGuineaPig = (cageStore.guineaPigPos.x === checkX && cageStore.guineaPigPos.y === checkY)
      // Check if position is occupied by poop
      const isOccupiedByPoop = poopStore.poop.some(p => p.x === checkX && p.y === checkY)
      // Check if position is water bottle position
      const isWaterBottlePosition = (checkX === cageStore.size.width - 1 && checkY === 0)
      
      if (isOccupiedByItem || isOccupiedByGuineaPig || isOccupiedByPoop || isWaterBottlePosition) {
        return false
      }
    }
  }
  
  return true
}

// Find all available positions for a specific item size
function getAvailablePositionsForItem(itemSize) {
  const availablePositions = []
  
  for (let y = 0; y < cageStore.size.height; y++) {
    for (let x = 0; x < cageStore.size.width; x++) {
      if (canItemFitAtPosition(itemSize, x, y)) {
        availablePositions.push({ x, y })
      }
    }
  }
  
  return availablePositions
}

// Place items randomly in the cage
function placeItemsRandomly() {
  if (!hasAnyItems.value) {
    alert('No items available in inventory! Visit the Market to buy items first.')
    return
  }
  
  // Get a random selection of items to place (3-6 items)
  const allAvailableItems = [
    ...Object.keys(availableConsumables.value),
    ...Object.keys(availablePermanents.value)
  ]
  
  if (allAvailableItems.length === 0) {
    alert('No items available in inventory!')
    return
  }
  
  // Decide how many items to place (between 1 and min(6, available items))
  const maxItems = Math.min(6, allAvailableItems.length)
  const numItemsToPlace = Math.max(1, Math.min(maxItems, 3 + Math.floor(Math.random() * 4)))
  
  let placedItems = 0
  let attempts = 0
  const maxAttempts = 100 // Prevent infinite loops
  
  while (placedItems < numItemsToPlace && attempts < maxAttempts) {
    attempts++
    
    // Pick a random item
    const randomItemName = allAvailableItems[Math.floor(Math.random() * allAvailableItems.length)]
    const itemDef = itemDefinitions[randomItemName]
    
    if (!itemDef) continue
    
    // Get available positions for this specific item size
    const availablePositions = getAvailablePositionsForItem(itemDef.size)
    
    if (availablePositions.length === 0) {
      // This item can't fit anywhere, try another item
      continue
    }
    
    // Pick a random available position that can fit this item
    const randomPos = availablePositions[Math.floor(Math.random() * availablePositions.length)]
    
    // Try to place the item
    const success = cageStore.addItem({
      name: randomItemName,
      type: itemDef.type,
      isConsumable: itemDef.isConsumable,
      size: itemDef.size
    }, randomPos.x, randomPos.y)
    
    if (success) {
      inventoryStore.removeItem(randomItemName, 1)
      placedItems++
    }
  }
  
  if (placedItems > 0) {
    alert(`Successfully placed ${placedItems} item${placedItems === 1 ? '' : 's'} randomly in the cage!`)
  } else {
    alert('Could not place any items. Try cleaning up the cage or check your inventory.')
  }
}

// Place food items randomly in the cage
function placeFoodRandomly() {
  if (!hasAnyFoodItems.value) {
    alert('No food items available in inventory! Visit the Market to buy food first.')
    return
  }
  
  // Get all available food items
  const allAvailableFoodItems = Object.keys(availableFoodItems.value)
  
  if (allAvailableFoodItems.length === 0) {
    alert('No food items available in inventory!')
    return
  }
  
  // Decide how many food items to place (between 2 and min(5, available food items))
  const maxItems = Math.min(5, allAvailableFoodItems.length)
  const numItemsToPlace = Math.max(2, Math.min(maxItems, 2 + Math.floor(Math.random() * 4)))
  
  let placedItems = 0
  let attempts = 0
  const maxAttempts = 100 // Prevent infinite loops
  
  while (placedItems < numItemsToPlace && attempts < maxAttempts) {
    attempts++
    
    // Pick a random food item
    const randomItemName = allAvailableFoodItems[Math.floor(Math.random() * allAvailableFoodItems.length)]
    const itemDef = itemDefinitions[randomItemName]
    
    if (!itemDef) continue
    
    // Get available positions for this specific item size
    const availablePositions = getAvailablePositionsForItem(itemDef.size)
    
    if (availablePositions.length === 0) {
      // This item can't fit anywhere, try another item
      continue
    }
    
    // Pick a random available position that can fit this item
    const randomPos = availablePositions[Math.floor(Math.random() * availablePositions.length)]
    
    // Try to place the item
    const success = cageStore.addItem({
      name: randomItemName,
      type: itemDef.type,
      isConsumable: itemDef.isConsumable,
      size: itemDef.size
    }, randomPos.x, randomPos.y)
    
    if (success) {
      inventoryStore.removeItem(randomItemName, 1)
      placedItems++
    }
  }
  
  if (placedItems > 0) {
    alert(`Successfully placed ${placedItems} food item${placedItems === 1 ? '' : 's'} randomly in the cage! 🥕`)
  } else {
    alert('Could not place any food items. Try cleaning up the cage or check your food inventory.')
  }
}

</script>

<style>
.gps-cage-item-manager {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.gps-cage-item-manager__actions {
  display: flex;
  gap: 0.5rem;
  margin-block-end: 1rem;
  flex-wrap: wrap;
}

.gps-cage-item-manager__sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.gps-cage-item-manager__section {
  background: var(--color-panel);
  border-radius: var(--border-radius);
  padding: 1rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.gps-cage-item-manager__section-title {
  font-size: var(--font-size-base);
  color: var(--color-accent);
  margin: 0 0 0.75rem 0;
  font-weight: var(--font-weight-semibold);
}

.gps-cage-item-manager__empty {
  color: var(--color-text);
  opacity: 0.6;
  font-style: italic;
  text-align: center;
  padding: 0.75rem;
  font-size: var(--font-size-sm);
}

.gps-cage-item-manager__items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gps-cage-item-manager__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--color-bg);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.gps-cage-item-manager__item-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.gps-cage-item-manager__item-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  font-size: var(--font-size-sm);
}

.gps-cage-item-manager__item-quantity {
  color: var(--color-accent);
  font-size: var(--font-size-xs);
}

.gps-cage-item-manager__item-position {
  color: var(--color-text);
  opacity: 0.6;
  font-size: var(--font-size-xs);
}

.gps-cage-item-manager__item-actions {
  display: flex;
  gap: 0.25rem;
}

.gps-cage-item-manager__action-button {
  background: none;
  border: none;
  padding: 0.2rem;
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: var(--transition);
  font-size: 1em;
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
  padding: 0.75rem;
  text-align: center;
  color: var(--color-text);
  opacity: 0.8;
}

.gps-cage-item-manager__no-items-message p {
  margin: 0.4rem 0;
  font-size: var(--font-size-xs);
}

.gps-cage-item-manager__no-items-message p:first-child {
  font-weight: var(--font-weight-medium);
  color: var(--color-accent);
}

.gps-cage-item-manager__first-item-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.gps-cage-item-manager__no-cage-items {
  background: var(--color-panel);
  border-radius: var(--border-radius);
  padding: 2rem 1.5rem;
}

.gps-cage-item-manager__no-cage-items-content h4 {
  color: var(--color-accent);
  font-size: var(--font-size-base);
  margin: 0 0 0.75rem 0;
  font-weight: var(--font-weight-semibold);
}

.gps-cage-item-manager__no-cage-items-content p {
  color: var(--color-text);
  opacity: 0.8;
  margin: 0 0 1.5rem 0;
  font-size: var(--font-size-sm);
}

/* Tablet and above constraints */
@media (min-width: 768px) {
  .gps-cage-item-manager {
    max-width: 500px;
  }
  
  .gps-cage-item-manager__sections {
    max-width: 100%;
  }
  
  .gps-cage-item-manager__section {
    max-width: 100%;
  }
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .gps-cage-item-manager__actions {
    justify-content: center;
  }
  
  .gps-cage-item-manager__item {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .gps-cage-item-manager__item-actions {
    justify-content: center;
  }
}
</style> 
