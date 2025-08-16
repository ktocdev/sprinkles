<template>
  <div class="gps-cage-item-manager">
    <div class="gps-cage-item-manager__actions">
      <h4 class="gps-cage-item-manager__actions-header">Quick Add Items</h4>
      <div class="gps-cage-item-manager__actions-buttons">
        <Button 
          type="secondary"
          size="compact"
          @click="placeFurnitureRandomly"
          title="Place furniture items randomly in cage"
          :class="{ 'gps-button--disabled': !hasAnyFurnitureItems }"
        >
          🪑 Place Furniture
        </Button>
        <Button 
          type="secondary"
          size="compact"
          @click="placeFoodRandomly"
          title="Place food items randomly in cage"
          :class="{ 'gps-button--disabled': !hasAnyFoodItems }"
        >
          🥕 Place Food
        </Button>
        <Button 
          type="secondary"
          size="compact"
          @click="placeChewsRandomly"
          title="Place chew items randomly in cage"
          :class="{ 'gps-button--disabled': !hasAnyChewItems }"
        >
          🦷 Place Chews
        </Button>
      </div>
    </div>

    <!-- Item Lists -->
    <div>
      <!-- Tabs for different item views -->
      <Tabs :tabs="tabs" v-model="activeTab" variant="default">
        <!-- Permanent Items Tab -->
        <template #permanent>
          <div class="gps-cage-item-manager__section">
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
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Consumable Items Tab -->
        <template #consumable>
          <div class="gps-cage-item-manager__section">
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
                    :class="{ 'gps-button--disabled': isConsumptionDisabled }"
                    :title="getConsumptionDisabledReason"
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
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Inventory Tab -->
        <template #inventory>
          <div class="gps-cage-item-manager__section">
            <div v-if="Object.keys(allInventoryItems).length === 0" class="gps-cage-item-manager__empty">
              No items in inventory
            </div>
            <div v-else class="gps-cage-item-manager__items">
              <div 
                v-for="(item, itemName) in allInventoryItems" 
                :key="itemName"
                class="gps-cage-item-manager__item"
              >
                <div class="gps-cage-item-manager__item-info">
                  <span class="gps-cage-item-manager__item-name">{{ formatItemName(itemName) }}</span>
                  <span class="gps-cage-item-manager__item-quantity">({{ item.quantity }})</span>
                  <span class="gps-cage-item-manager__item-type">{{ item.isConsumable ? 'Consumable' : 'Permanent' }}</span>
                </div>
                <div class="gps-cage-item-manager__item-actions">
                  <Button 
                    type="primary"
                    size="compact"
                    @click="addItemToCageFromInventory(itemName)"
                    title="Add to Cage"
                  >
                    ➕ Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Tabs>
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
import { useInventoryStore, itemDefinitions } from '../../stores/inventory'
import { usePoopStore } from '../../stores/poop'
import { useHungerStore } from '../../stores/needs/hunger'
import { useGuineaPigStore } from '../../stores/guineaPig'
import Button from '../shared/Button.vue'
import Dropdown from '../shared/Dropdown.vue'
import Modal from '../shared/Modal.vue'
import Input from '../shared/Input.vue'
import FormGroup from '../shared/FormGroup.vue'
import Tabs from '../shared/Tabs.vue'

const cageStore = useCageStore()
const inventoryStore = useInventoryStore()
const poopStore = usePoopStore()
const hungerStore = useHungerStore()
const guineaPigStore = useGuineaPigStore()

// Modal states
const showAddItemModal = ref(false)
const showMoveModal = ref(false)
const selectedItem = ref('')
const itemX = ref(null)
const itemY = ref(null)
const itemToMove = ref(null)
const moveX = ref(null)
const moveY = ref(null)

// Tab state
const activeTab = ref(0)

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

const availableFurnitureItems = computed(() => {
  const furnitureItems = {}
  Object.keys(itemDefinitions).forEach(item => {
    if ((itemDefinitions[item].type === 'furniture' || itemDefinitions[item].type === 'shelter' || itemDefinitions[item].type === 'enrichment') && inventoryStore.items[item] > 0) {
      furnitureItems[item] = inventoryStore.items[item]
    }
  })
  return furnitureItems
})

const hasAnyFurnitureItems = computed(() => {
  return Object.keys(availableFurnitureItems.value).length > 0
})

const availableChewItems = computed(() => {
  const chewItems = {}
  Object.keys(itemDefinitions).forEach(item => {
    if (itemDefinitions[item].type === 'chew' && inventoryStore.items[item] > 0) {
      chewItems[item] = inventoryStore.items[item]
    }
  })
  return chewItems
})

const hasAnyChewItems = computed(() => {
  return Object.keys(availableChewItems.value).length > 0
})

// All inventory items (not in cage)
const allInventoryItems = computed(() => {
  const allItems = {}
  Object.keys(itemDefinitions).forEach(item => {
    if (inventoryStore.items[item] > 0) {
      allItems[item] = {
        name: item,
        quantity: inventoryStore.items[item],
        isConsumable: itemDefinitions[item].isConsumable,
        type: itemDefinitions[item].type,
        ...itemDefinitions[item]
      }
    }
  })
  return allItems
})

// Tab configuration
const tabs = computed(() => [
  {
    id: 'permanent',
    label: 'Permanent Items',
    icon: '🏠',
    badge: cageStore.permanentItems.length || null
  },
  {
    id: 'consumable',
    label: 'Consumable Items', 
    icon: '🍽️',
    badge: cageStore.consumableItems.length || null
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: '📦',
    badge: Object.keys(allInventoryItems.value).length || null
  }
])

// Check if consumption should be disabled (hunger is full or guinea pig is sleeping)
// Use same rounding logic as NeedsNav to prevent button state mismatch
const isConsumptionDisabled = computed(() => {
  const roundedValue = Math.round(hungerStore.currentValue)
  const isFull = roundedValue >= hungerStore.maxValue
  const isSleeping = guineaPigStore.currentStatus === 'sleeping'
  return isFull || isSleeping
})

// Get the reason why consumption is disabled for tooltip text
const getConsumptionDisabledReason = computed(() => {
  const roundedValue = Math.round(hungerStore.currentValue)
  const isFull = roundedValue >= hungerStore.maxValue
  const isSleeping = guineaPigStore.currentStatus === 'sleeping'
  
  if (isSleeping) {
    return 'Guinea pig is sleeping!'
  } else if (isFull) {
    return 'Guinea pig is full!'
  } else {
    return 'Consume Item'
  }
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
  
  // Don't consume if guinea pig is full or sleeping
  if (isConsumptionDisabled.value) {
    const roundedValue = Math.round(hungerStore.currentValue)
    const isFull = roundedValue >= hungerStore.maxValue
    const isSleeping = guineaPigStore.currentStatus === 'sleeping'
    
    if (isSleeping) {
      console.log('🚫 [CONSUME] Blocked: Guinea pig is sleeping!')
    } else if (isFull) {
      console.log('🚫 [CONSUME] Blocked: Guinea pig is full!')
    }
    return
  }
  
  const success = cageStore.consumeItem(item.id)
  if (success) {
    // Item was consumed successfully
  }
}

function returnToInventory(item) {
  cageStore.removeItem(item.id)
  inventoryStore.addItem(item.name, 1)
}

function addItemToCageFromInventory(itemName) {
  // Set the selected item and show the add item modal
  selectedItem.value = itemName
  showAddItemModal.value = true
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

// Place furniture items randomly in the cage
function placeFurnitureRandomly() {
  if (!hasAnyFurnitureItems.value) {
    alert('No furniture items available in inventory! Visit the Market to buy furniture first.')
    return
  }
  
  // Get all available furniture items
  const allAvailableFurnitureItems = Object.keys(availableFurnitureItems.value)
  
  if (allAvailableFurnitureItems.length === 0) {
    alert('No furniture items available in inventory!')
    return
  }
  
  // Decide how many furniture items to place (between 1 and min(4, available furniture items))
  const maxItems = Math.min(4, allAvailableFurnitureItems.length)
  const numItemsToPlace = Math.max(1, Math.min(maxItems, 1 + Math.floor(Math.random() * 3)))
  
  let placedItems = 0
  let attempts = 0
  const maxAttempts = 100 // Prevent infinite loops
  
  while (placedItems < numItemsToPlace && attempts < maxAttempts) {
    attempts++
    
    // Pick a random furniture item
    const randomItemName = allAvailableFurnitureItems[Math.floor(Math.random() * allAvailableFurnitureItems.length)]
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
    alert(`Successfully placed ${placedItems} furniture item${placedItems === 1 ? '' : 's'} randomly in the cage! 🪑`)
  } else {
    alert('Could not place any furniture items. Try cleaning up the cage or check your furniture inventory.')
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

// Place chew items randomly in the cage
function placeChewsRandomly() {
  if (!hasAnyChewItems.value) {
    alert('No chew items available in inventory! Visit the Market to buy chew toys first.')
    return
  }
  
  // Get all available chew items
  const allAvailableChewItems = Object.keys(availableChewItems.value)
  
  if (allAvailableChewItems.length === 0) {
    alert('No chew items available in inventory!')
    return
  }
  
  // Decide how many chew items to place (between 1 and min(3, available chew items))
  const maxItems = Math.min(3, allAvailableChewItems.length)
  const numItemsToPlace = Math.max(1, Math.min(maxItems, 1 + Math.floor(Math.random() * 2)))
  
  let placedItems = 0
  let attempts = 0
  const maxAttempts = 100 // Prevent infinite loops
  
  while (placedItems < numItemsToPlace && attempts < maxAttempts) {
    attempts++
    
    // Pick a random chew item
    const randomItemName = allAvailableChewItems[Math.floor(Math.random() * allAvailableChewItems.length)]
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
    alert(`Successfully placed ${placedItems} chew item${placedItems === 1 ? '' : 's'} randomly in the cage! 🦷`)
  } else {
    alert('Could not place any chew items. Try cleaning up the cage or check your chew inventory.')
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
  margin-block-end: 1rem;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 1rem;
}

.gps-cage-item-manager__actions-header {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-accent);
  margin: 0 0 0.75rem 0;
}

.gps-cage-item-manager__actions-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.gps-cage-item-manager__actions-buttons .gps-button {
  border-color: var(--color-border-light);
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

.gps-cage-item-manager__item-type {
  color: var(--color-accent);
  opacity: 0.8;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
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


/* Tablet and above constraints */
@media (min-width: 768px) {
  .gps-cage-item-manager {
    /* max-width: 500px; */
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
