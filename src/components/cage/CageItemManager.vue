<template>
  <div class="gps-cage-item-manager">
    <CageItemQuickActions 
      :hasAnyFurnitureItems="hasAnyFurnitureItems"
      :hasAnyFoodItems="hasAnyFoodItems"
      :hasAnyChewItems="hasAnyChewItems"
      :hasAnyToyItems="hasAnyToyItems"
      @placeFurnitureRandomly="placeFurnitureRandomly"
      @placeFoodRandomly="placeFoodRandomly"
      @placeChewsRandomly="placeChewsRandomly"
      @placeToyRandomly="placeToyRandomly"
    />

    <!-- Item Lists -->
    <CageItemTabs 
      :allInventoryItems="allInventoryItems"
      :isConsumptionDisabled="isConsumptionDisabled"
      :getConsumptionDisabledReason="getConsumptionDisabledReason"
      @moveItem="moveItem"
      @returnToInventory="returnToInventory"
      @consumeItem="consumeItem"
      @addItemToCageFromInventory="addItemToCageFromInventory"
    />

    <!-- Add Item Modal -->
    <Modal 
      :isVisible="showAddItemModal"
      title="Add Item to Cage"
      @close="showAddItemModal = false"
    >
      <AddItem
        ref="addItemRef"
        :hasAnyItems="hasAnyItems"
        :itemDropdownOptions="itemDropdownOptions"
        :cageWidth="cageStore.size.width"
        :cageHeight="cageStore.size.height"
        :isVisible="showAddItemModal"
        @cancel="showAddItemModal = false"
        @addItem="handleAddItem"
      />
    </Modal>

    <!-- Move Item Modal -->
    <Modal 
      :isVisible="showMoveModal"
      :title="`Move ${formatItemName(itemToMove?.name)}`"
      @close="showMoveModal = false"
    >
      <MoveItem
        :itemToMove="itemToMove"
        :cageWidth="cageStore.size.width"
        :cageHeight="cageStore.size.height"
        :isVisible="showMoveModal"
        @cancel="showMoveModal = false"
        @moveItem="handleMoveItem"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
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
import CageItemTabs from './CageItemTabs.vue'
import CageItemQuickActions from './CageItemQuickActions.vue'
import AddItem from './AddItem.vue'
import MoveItem from './MoveItem.vue'

const cageStore = useCageStore()
const inventoryStore = useInventoryStore()
const poopStore = usePoopStore()
const hungerStore = useHungerStore()
const guineaPigStore = useGuineaPigStore()

// Modal states
const showAddItemModal = ref(false)
const showMoveModal = ref(false)
const itemToMove = ref(null)

// Template refs
const addItemRef = ref(null)


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
    if ((itemDefinitions[item].type === 'furniture' || itemDefinitions[item].type === 'shelter' || itemDefinitions[item].type === 'enrichment' || itemDefinitions[item].type === 'bed') && inventoryStore.items[item] > 0) {
      furnitureItems[item] = inventoryStore.items[item]
    }
  })
  return furnitureItems
})

const hasAnyFurnitureItems = computed(() => {
  return Object.keys(availableFurnitureItems.value).length > 0
})

const availableToyItems = computed(() => {
  const toyItems = {}
  Object.keys(itemDefinitions).forEach(item => {
    if (itemDefinitions[item].type === 'toy' && inventoryStore.items[item] > 0) {
      toyItems[item] = inventoryStore.items[item]
    }
  })
  return toyItems
})

const hasAnyToyItems = computed(() => {
  return Object.keys(availableToyItems.value).length > 0
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
  
  // Get all item names currently in the cage
  const itemsInCage = new Set(cageStore.items.map(item => item.name))
  
  Object.keys(itemDefinitions).forEach(item => {
    // Only include items that have inventory quantity AND are not currently in the cage
    if (inventoryStore.items[item] > 0 && !itemsInCage.has(item)) {
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

function handleAddItem(data) {
  const { selectedItem, x, y } = data
  if (!selectedItem || x === null || y === null) return
  
  const itemDef = itemDefinitions[selectedItem]
  if (!itemDef) return
  
  // Convert from 1-based to 0-based coordinates
  const posX = x - 1
  const posY = y - 1
  
  // Check if item fits within grid bounds
  const itemWidth = itemDef.size.width
  const itemHeight = itemDef.size.height
  
  if (posX + itemWidth > cageStore.size.width || posY + itemHeight > cageStore.size.height) {
    alert(`This ${formatItemName(itemDef.name)} (${itemWidth}x${itemHeight}) doesn't fit at position (${x}, ${y}). Please choose a position where the item fits within the ${cageStore.size.width}x${cageStore.size.height} grid.`)
    return
  }
  
  // Check if all required positions are available
  for (let checkY = posY; checkY < posY + itemHeight; checkY++) {
    for (let checkX = posX; checkX < posX + itemWidth; checkX++) {
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
    name: selectedItem,
    type: itemDef.type,
    isConsumable: itemDef.isConsumable,
    size: itemDef.size
  }, posX, posY)
  
  if (success) {
    inventoryStore.removeItem(selectedItem, 1)
    showAddItemModal.value = false
  } else {
    alert('Failed to add item! Please choose a different location.')
  }
}

function moveItem(item) {
  itemToMove.value = item
  showMoveModal.value = true
}

function handleMoveItem(data) {
  const { x, y } = data
  if (!itemToMove.value || x === null || y === null) return
  
  // Convert from 1-based to 0-based coordinates
  const posX = x - 1
  const posY = y - 1
  
  // Get item size (default to 1x1 if not specified)
  const itemSize = itemToMove.value.size || { width: 1, height: 1 }
  const itemWidth = itemSize.width
  const itemHeight = itemSize.height
  
  // Check if item fits within grid bounds
  if (posX + itemWidth > cageStore.size.width || posY + itemHeight > cageStore.size.height) {
    alert(`This ${formatItemName(itemToMove.value.name)} (${itemWidth}x${itemHeight}) doesn't fit at position (${x}, ${y}). Please choose a position where the item fits within the ${cageStore.size.width}x${cageStore.size.height} grid.`)
    return
  }
  
  // Check if all required positions are available
  for (let checkY = posY; checkY < posY + itemHeight; checkY++) {
    for (let checkX = posX; checkX < posX + itemWidth; checkX++) {
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
  
  const success = cageStore.moveItem(itemToMove.value.id, posX, posY)
  
  if (success) {
    showMoveModal.value = false
    itemToMove.value = null
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
    } else if (isFull) {
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
  // Open modal first, then set the selected item
  showAddItemModal.value = true
  
  // Use nextTick to ensure the modal and AddItem component are fully rendered
  // before calling the method
  nextTick(() => {
    if (addItemRef.value) {
      addItemRef.value.setSelectedItem(itemName)
    }
  })
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
    alert(`Successfully placed ${placedItems} chew item${placedItems === 1 ? '' : 's'} randomly in the cage! 🪵`)
  } else {
    alert('Could not place any chew items. Try cleaning up the cage or check your chew inventory.')
  }
}

// Place toy items randomly in the cage
function placeToyRandomly() {
  if (!hasAnyToyItems.value) {
    alert('No toy items available in inventory! Visit the Market to buy toys first.')
    return
  }
  
  // Get all available toy items
  const allAvailableToyItems = Object.keys(availableToyItems.value)
  
  if (allAvailableToyItems.length === 0) {
    alert('No toy items available in inventory!')
    return
  }
  
  // Decide how many toy items to place (between 1 and min(3, available toy items))
  const maxItems = Math.min(3, allAvailableToyItems.length)
  const numItemsToPlace = Math.max(1, Math.min(maxItems, 1 + Math.floor(Math.random() * 2)))
  
  let placedItems = 0
  let attempts = 0
  const maxAttempts = 100 // Prevent infinite loops
  
  while (placedItems < numItemsToPlace && attempts < maxAttempts) {
    attempts++
    
    // Pick a random toy item
    const randomItemName = allAvailableToyItems[Math.floor(Math.random() * allAvailableToyItems.length)]
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
    alert(`Successfully placed ${placedItems} toy item${placedItems === 1 ? '' : 's'} randomly in the cage! 🧸`)
  } else {
    alert('Could not place any toy items. Try cleaning up the cage or check your toy inventory.')
  }
}

</script>

<style>
.gps-cage-item-manager {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}
</style> 
