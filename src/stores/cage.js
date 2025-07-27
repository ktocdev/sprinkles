import { defineStore } from 'pinia'

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
    poop: [], // array of { x, y }
    guineaPigPos: { x: 0, y: 0 },
    items: [] // array of { id, name, type, x, y, isConsumable, quantity }
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
        if (grid[item.y] && grid[item.y][item.x] !== undefined) {
          grid[item.y][item.x] = item
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
      this.poop.push({ x, y })
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
      // Check if position is available
      const isOccupied = this.items.some(i => i.x === x && i.y === y) ||
                        (this.guineaPigPos.x === x && this.guineaPigPos.y === y) ||
                        this.poop.some(p => p.x === x && p.y === y)
      
      if (isOccupied) {
        return false
      }
      
      this.items.push({
        id: Date.now() + Math.random(),
        name: item.name,
        type: item.type,
        x: x,
        y: y,
        isConsumable: item.isConsumable,
        quantity: item.quantity || 1
      })
      return true
    },
    removeItem(itemId) {
      this.items = this.items.filter(item => item.id !== itemId)
    },
    moveItem(itemId, newX, newY) {
      const item = this.items.find(i => i.id === itemId)
      if (!item) return false
      
      // Check if new position is available
      const isOccupied = this.items.some(i => i.id !== itemId && i.x === newX && i.y === newY) ||
                        (this.guineaPigPos.x === newX && this.guineaPigPos.y === newY) ||
                        this.poop.some(p => p.x === newX && p.y === newY)
      
      if (isOccupied) {
        return false
      }
      
      item.x = newX
      item.y = newY
      return true
    },
    consumeItem(itemId) {
      const item = this.items.find(i => i.id === itemId)
      if (!item || !item.isConsumable) return false
      
      if (item.quantity > 1) {
        item.quantity--
      } else {
        this.removeItem(itemId)
      }
      return true
    },

  },
  persist: true
}) 