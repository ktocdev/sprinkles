import { defineStore } from 'pinia'

// Item definitions
export const itemDefinitions = {
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

// Default inventory items
const DEFAULT_ITEMS = {
  // Food items
  hay: 10,
  pellets: 10,
  lettuce: 5,
  blueberries: 3,
  carrots: 5,
  cucumbers: 3,
  
  // Bedding
  bedding: 20,
  
  // Chew items
  small_chew_stick: 2,
  large_chew_stick: 1,
  chew_cube: 1,
  
  // Toys
  small_ball: 1,
  large_ball: 1,
  small_tunnel: 1,
  large_tunnel: 1,
  
  // Beds and shelters
  small_hammock: 1,
  large_hammock: 1,
  small_bed: 1,
  large_bed: 1,
  small_house: 1,
  large_house: 1
}

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    items: { ...DEFAULT_ITEMS }
  }),

  getters: {
    getItemCount: (state) => (itemName) => {
      return state.items[itemName] || 0
    },
    
    hasItem: (state) => (itemName, quantity = 1) => {
      return (state.items[itemName] || 0) >= quantity
    },
    
    getTotalItems: (state) => {
      return Object.values(state.items).reduce((total, count) => total + count, 0)
    }
  },

  actions: {
    addItem(itemName, quantity = 1) {
      if (this.items[itemName] !== undefined) {
        this.items[itemName] += quantity
      } else {
        this.items[itemName] = quantity
      }
    },

    removeItem(itemName, quantity = 1) {
      if (this.items[itemName] && this.items[itemName] >= quantity) {
        this.items[itemName] -= quantity
        return true
      }
      return false
    },

    setItemCount(itemName, quantity) {
      this.items[itemName] = Math.max(0, quantity)
    },

    resetToDefaults() {
      this.items = { ...DEFAULT_ITEMS }
    },

    // Force reset inventory to defaults (for new games)
    forceResetToDefaults() {
      this.resetToDefaults()
    }
  },
  
  persist: {
    afterRestore: (ctx) => {
      // Ensure all default items exist with at least their default values if missing
      const defaultItems = { ...DEFAULT_ITEMS }
      Object.keys(defaultItems).forEach(itemKey => {
        if (ctx.store.items[itemKey] === undefined) {
          ctx.store.items[itemKey] = defaultItems[itemKey]
        }
      })
    }
  }
}) 