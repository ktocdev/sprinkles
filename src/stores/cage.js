import { defineStore } from 'pinia'
import { useInventoryStore } from './inventory.js'
import { useMarketStore } from './market.js'
import { useGuineaPigStore } from './guineaPig.js'
import { useNeedsQueueStore } from './needs/needsQueue.js'
import { useHungerStore } from './needs/hunger.js'
import { usePoopStore } from './poop.js'
import { useStatisticsStore } from './statistics.js'

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
    guineaPigPos: { x: 0, y: 0 },
    items: [], // array of { id, name, type, x, y, isConsumable, quantity }
    consumptionStats: {}, // Track consumption by item type
    paused: false // Game pause state
  }),

  getters: {
    grid(state) {
      const grid = createEmptyGrid(state.size.width, state.size.height)
      const poopStore = usePoopStore()
      
      // Calculate occupied cells
      let occupiedCells = 0
      
      // Count items (including their size)
      for (const item of state.items) {
        const itemSize = item.size || { width: 1, height: 1 }
        occupiedCells += itemSize.width * itemSize.height
      }
      
      // Count guinea pig position
      occupiedCells += 1
      
      // Count water bottle position
      occupiedCells += 1
      
      // Update poop store with grid information
      const totalCells = state.size.width * state.size.height
      poopStore.updateGridInfo(totalCells, occupiedCells)
      
      // Place poops from poop store
      for (const p of poopStore.poop) {
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
      const poopStore = usePoopStore()
      return poopStore.addPoop(x, y)
    },
    removePoop(x, y) {
      const poopStore = usePoopStore()
      return poopStore.removePoop(x, y)
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
      const poopStore = usePoopStore()
      poopStore.reset()
      this.guineaPigPos = { x: 0, y: 0 }
      this.items = []
    },
    refreshWater() {
      this.waterLevel = 100
    },

    cleanCage() {
      const poopStore = usePoopStore()
      return poopStore.cleanAllPoop()
    },
    addItem(item, x, y) {
      // Get item size (default to 1x1 if not specified)
      const itemSize = item.size || { width: 1, height: 1 }
      const itemWidth = itemSize.width
      const itemHeight = itemSize.height
      
      // Check if all required positions are available
      const poopStore = usePoopStore()
      for (let checkY = y; checkY < y + itemHeight; checkY++) {
        for (let checkX = x; checkX < x + itemWidth; checkX++) {
          const isOccupied = this.items.some(i => i.x === checkX && i.y === checkY) ||
                            (this.guineaPigPos.x === checkX && this.guineaPigPos.y === checkY) ||
                            poopStore.isPoopAtPosition(checkX, checkY) ||
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
      const poopStore = usePoopStore()
      for (let checkY = newY; checkY < newY + itemHeight; checkY++) {
        for (let checkX = newX; checkX < newX + itemWidth; checkX++) {
          const isOccupied = this.items.some(i => i.id !== itemId && i.x === checkX && i.y === checkY) ||
                            (this.guineaPigPos.x === checkX && this.guineaPigPos.y === checkY) ||
                            poopStore.isPoopAtPosition(checkX, checkY) ||
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
      const needsQueueStore = useNeedsQueueStore()
      // Note: Hygiene store not implemented yet, so we'll skip this for now
      // needsQueueStore.resetAllNeeds() // This would reset all needs
      
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
      const poopStore = usePoopStore()
      const poopAtPosition = poopStore.isPoopAtPosition(x, y)
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
      const needsQueueStore = useNeedsQueueStore()
      const poopStore = usePoopStore()
      const { x, y } = this.guineaPigPos
      
      const interaction = poopStore.interactWithPoop(x, y)
      
      if (interaction.success && interaction.hygieneImpact > 0) {
        // Note: Hygiene store not implemented yet, so we'll skip this for now
        // needsQueueStore.adjustNeed('hygiene', -interaction.hygieneImpact)
      }
      
      return {
        success: interaction.success,
        message: interaction.message,
        hygieneDecrease: interaction.hygieneImpact,
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
      
      // Improve guinea pig needs and track statistics
      const needsQueueStore = useNeedsQueueStore()
      if (itemData.needType && itemData.needImprovement) {
        // Note: Only hunger store is implemented, so we'll only handle hunger for now
        if (itemData.needType === 'hunger') {
          const hungerStore = useHungerStore()
          const oldValue = hungerStore.currentValue
          hungerStore.currentValue = Math.min(100, hungerStore.currentValue + itemData.needImprovement)
          const actualImprovement = hungerStore.currentValue - oldValue
          
          // Update needs queue to reflect the change in NeedsNav immediately
          needsQueueStore.updateQueue()
          
          // Track food consumption in statistics
          const statisticsStore = useStatisticsStore()
          statisticsStore.trackFoodConsumption(item.name, actualImprovement)
        }
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

    // Get the guinea pig's next best action using the needs queue
    getGuineaPigAction() {
      const needsQueueStore = useNeedsQueueStore()
      
      // Update needs before getting action
      needsQueueStore.updateAllNeeds()
      
      return needsQueueStore.getBestAction()
    },

    // Fulfill a specific need using the needs queue
    fulfillGuineaPigNeed(needName, methodName) {
      const needsQueueStore = useNeedsQueueStore()
      return needsQueueStore.fulfillNeed(needName, methodName)
    },

  },
  persist: true
}) 