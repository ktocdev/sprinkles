import { defineStore } from 'pinia'
import { useInventoryStore } from './inventory.js'
import { useMarketStore } from './market.js'
import { useGuineaPigStore } from './guineaPig.js'

function createEmptyGrid(width, height) {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => null))
}

function clampValue(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value))
}

export const useCageStore = defineStore('cage', {
  state: () => ({
    size: { width: 18, height: 12 },
    beddingFreshness: 100,
    waterLevel: 100,
    poop: [], // array of { x, y, timestamp }
    guineaPigPos: { x: 0, y: 0 },
    items: [], // array of { id, name, type, x, y, isConsumable, quantity }
    consumptionStats: {}, // Track consumption by item type
    paused: false // Game pause state
  }),

  getters: {
    grid(state) {
      const grid = createEmptyGrid(state.size.width, state.size.height)
      // Place poops
      for (const p of state.poop) {
        if (grid[p.y] && grid[p.y][p.x] !== undefined) {
          grid[p.y][p.x] = 'poop'
        }
      }
      // Place items
      for (const item of state.items) {
        const itemSize = item.size || { width: 1, height: 1 }
        const itemWidth = itemSize.width
        const itemHeight = itemSize.height
        
        // Place item across all its occupied cells
        for (let itemY = item.y; itemY < item.y + itemHeight; itemY++) {
          for (let itemX = item.x; itemX < item.x + itemWidth; itemX++) {
            if (grid[itemY] && grid[itemY][itemX] !== undefined) {
              grid[itemY][itemX] = item
            }
          }
        }
      }
      // Place guinea pig
      if (
        grid[state.guineaPigPos.y] &&
        grid[state.guineaPigPos.y][state.guineaPigPos.x] !== undefined
      ) {
        grid[state.guineaPigPos.y][state.guineaPigPos.x] = 'guineaPig'
      }
      return grid
    },
    consumableItems(state) {
      return state.items.filter(item => item.isConsumable)
    },
    permanentItems(state) {
      return state.items.filter(item => !item.isConsumable)
    },
    habitatValue(state) {
      const permanentItems = state.items.filter(item => !item.isConsumable)
      // Calculate habitat value based on number of permanent items
      // Each permanent item contributes to habitat quality
      // Chew items are consumable and don't count toward habitat
      const baseValue = permanentItems.length * 15 // 15 points per permanent item
      const maxValue = 100 // Maximum habitat value
      return Math.min(baseValue, maxValue)
    }
  },
  actions: {
    setSize(width, height) {
      this.size = { width, height }
      this.resetCage() // Reset everything when size changes
    },

    setBeddingFreshness(value) {
      this.beddingFreshness = clampValue(value)
    },
    setWaterLevel(value) {
      this.waterLevel = clampValue(value)
    },
    addPoop(x, y) {
      this.poop.push({ x, y, timestamp: Date.now() })
    },
    removePoop(x, y) {
      this.poop = this.poop.filter(p => !(p.x === x && p.y === y))
    },
    setGuineaPigPos(x, y) {
      // Ensure position is within grid bounds
      const clampedX = Math.max(0, Math.min(x, this.size.width - 1))
      const clampedY = Math.max(0, Math.min(y, this.size.height - 1))
      this.guineaPigPos = { x: clampedX, y: clampedY }
    },
    resetCage() {
      this.beddingFreshness = 100
      this.waterLevel = 100
      this.poop = []
      this.guineaPigPos = { x: 0, y: 0 }
      this.items = []
    },
    refreshWater() {
      this.waterLevel = 100
    },

    cleanCage() {
      this.poop = []
    },
    addItem(item, x, y) {
      // Get item size (default to 1x1 if not specified)
      const itemSize = item.size || { width: 1, height: 1 }
      const itemWidth = itemSize.width
      const itemHeight = itemSize.height
      
      // Check if all required positions are available
      for (let checkY = y; checkY < y + itemHeight; checkY++) {
        for (let checkX = x; checkX < x + itemWidth; checkX++) {
          const isOccupied = this.items.some(i => i.x === checkX && i.y === checkY) ||
                            (this.guineaPigPos.x === checkX && this.guineaPigPos.y === checkY) ||
                            this.poop.some(p => p.x === checkX && p.y === checkY) ||
                            (checkX === this.size.width - 1 && checkY === 0) // Water bottle position
          
          if (isOccupied) {
            return false
          }
        }
      }
      
      this.items.push({
        id: Date.now() + Math.random(),
        name: item.name,
        type: item.type,
        x: x,
        y: y,
        isConsumable: item.isConsumable,
        quantity: item.quantity || 1,
        size: itemSize
      })
      return true
    },
    removeItem(itemId) {
      this.items = this.items.filter(item => item.id !== itemId)
    },
    moveItem(itemId, newX, newY) {
      const item = this.items.find(i => i.id === itemId)
      if (!item) return false
      
      // Get item size (default to 1x1 if not specified)
      const itemSize = item.size || { width: 1, height: 1 }
      const itemWidth = itemSize.width
      const itemHeight = itemSize.height
      
      // Check if all required positions are available
      for (let checkY = newY; checkY < newY + itemHeight; checkY++) {
        for (let checkX = newX; checkX < newX + itemWidth; checkX++) {
          const isOccupied = this.items.some(i => i.id !== itemId && i.x === checkX && i.y === checkY) ||
                            (this.guineaPigPos.x === checkX && this.guineaPigPos.y === checkY) ||
                            this.poop.some(p => p.x === checkX && p.y === checkY) ||
                            (checkX === this.size.width - 1 && checkY === 0) // Water bottle position
          
          if (isOccupied) {
            return false
          }
        }
      }
      
      item.x = newX
      item.y = newY
      return true
    },
    refreshBedding() {
      const inventoryStore = useInventoryStore()
      const guineaPigStore = useGuineaPigStore()
      const currentBedding = inventoryStore.items.bedding || 0
      
      if (currentBedding === 0) {
        return {
          success: false,
          message: 'No bedding available',
          beddingUsed: 0,
          freshnessGained: 0
        }
      }
      
      // Calculate how much bedding is needed to reach 100% freshness
      const currentFreshness = this.beddingFreshness
      const freshnessNeeded = 100 - currentFreshness
      
      // Each bedding unit provides 20% freshness
      const beddingPerFreshness = 5 // 5 bedding units = 100% freshness
      const beddingNeeded = Math.ceil(freshnessNeeded / 20)
      
      // Use the minimum of available bedding and needed bedding
      const beddingToUse = Math.min(currentBedding, beddingNeeded)
      const freshnessGained = beddingToUse * 20
      
      // Remove bedding from inventory
      inventoryStore.removeItem('bedding', beddingToUse)
      
      // Update bedding freshness
      this.beddingFreshness = clampValue(currentFreshness + freshnessGained)
      
      // Reset hygiene to 100%
      guineaPigStore.setNeed('hygiene', 100)
      
      return {
        success: true,
        message: `Used ${beddingToUse} bedding units`,
        beddingUsed: beddingToUse,
        freshnessGained: freshnessGained,
        newFreshness: this.beddingFreshness,
        hygieneReset: true
      }
    },

    // Handle guinea pig interaction with items
    interactWithItem() {
      const { x, y } = this.guineaPigPos
      
      // Check if guinea pig is on poop
      const poopAtPosition = this.poop.some(p => p.x === x && p.y === y)
      if (poopAtPosition) {
        return this.interactWithPoop()
      }
      
      // Check if guinea pig is on an item
      const item = this.items.find(item => item.x === x && item.y === y)
      if (!item) {
        return { success: false, message: 'No item to interact with' }
      }
      
      // If it's a consumable item, consume it
      if (item.isConsumable) {
        return this.consumeItem(item.id)
      }
      
      // For non-consumable items, just return interaction info
      return {
        success: true,
        message: `Interacting with ${item.name}`,
        item: item.name,
        consumed: false
      }
    },

    // Handle poop interaction
    interactWithPoop() {
      const guineaPigStore = useGuineaPigStore()
      const { x, y } = this.guineaPigPos
      
      // Find the poop at this position
      const poopAtPosition = this.poop.find(p => p.x === x && p.y === y)
      
      if (!poopAtPosition) {
        return { success: false, message: 'No poop found' }
      }
      
      // Check if this is a fresh poop (less than 2 seconds old)
      const poopAge = Date.now() - poopAtPosition.timestamp
      const isFreshPoop = poopAge < 2000 // 2 seconds
      
      if (isFreshPoop) {
        // Don't count as stepping on poop if it's fresh
        return {
          success: true,
          message: 'Fresh poop - no hygiene penalty',
          hygieneDecrease: 0,
          consumed: false
        }
      }
      
      // Decrease hygiene when stepping on old poop
      guineaPigStore.adjustNeed('hygiene', -5)
      
      return {
        success: true,
        message: 'Stepped on poop - hygiene decreased',
        hygieneDecrease: 5,
        consumed: false
      }
    },

    // Consume an item and improve guinea pig needs
    consumeItem(itemId) {
      const item = this.items.find(i => i.id === itemId)
      if (!item || !item.isConsumable) {
        return { success: false, message: 'Item cannot be consumed' }
      }
      
      // Get item data from market store
      const marketStore = useMarketStore()
      const itemData = marketStore.getItemData(item.name)
      
      if (!itemData) {
        return { success: false, message: 'Item data not found' }
      }
      
      // Improve guinea pig needs
      const guineaPigStore = useGuineaPigStore()
      if (itemData.needType && itemData.needImprovement) {
        guineaPigStore.adjustNeed(itemData.needType, itemData.needImprovement)
      }
      
      // Track consumption statistics
      if (!this.consumptionStats[item.name]) {
        this.consumptionStats[item.name] = 0
      }
      this.consumptionStats[item.name]++
      
      // Remove item from grid
      this.removeItem(itemId)
      
      return {
        success: true,
        message: `Consumed ${item.name}`,
        item: item.name,
        needType: itemData.needType,
        needImprovement: itemData.needImprovement,
        consumed: true
      }
    },

    // Get consumption statistics
    getConsumptionStats() {
      return this.consumptionStats
    },

    // Reset consumption statistics
    resetConsumptionStats() {
      this.consumptionStats = {}
    },

    // Pause the game
    pauseGame() {
      this.paused = true
    },

    // Resume the game
    resumeGame() {
      this.paused = false
    },

    // Toggle pause state
    togglePause() {
      this.paused = !this.paused
    },

  },
  persist: true
}) 