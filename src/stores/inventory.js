import { defineStore } from 'pinia'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    items: {
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
      this.items = {
        hay: 10,
        pellets: 10,
        lettuce: 5,
        blueberries: 3,
        carrots: 5,
        cucumbers: 3,
        bedding: 20,
        small_chew_stick: 2,
        large_chew_stick: 1,
        chew_cube: 1,
        small_ball: 1,
        large_ball: 1,
        small_tunnel: 1,
        large_tunnel: 1,
        small_hammock: 1,
        large_hammock: 1,
        small_bed: 1,
        large_bed: 1,
        small_house: 1,
        large_house: 1
      }
    },

    // Initialize inventory if empty
    initializeIfEmpty() {
      console.log('Initializing inventory, current items:', this.items)
      if (Object.keys(this.items).length === 0) {
        console.log('Inventory is empty, resetting to defaults')
        this.resetToDefaults()
      } else {
        console.log('Inventory has items:', Object.keys(this.items))
      }
    },

    // Force reset inventory to defaults
    forceResetToDefaults() {
      console.log('Force resetting inventory to defaults')
      this.resetToDefaults()
      // Clear any persisted state
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('inventory')
      }
    },

    $reset() {
      this.items = {}
    }
  }
}) 