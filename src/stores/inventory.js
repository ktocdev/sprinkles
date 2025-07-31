import { defineStore } from 'pinia'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    items: {
      // Food items
      hay: 10,
      pellets: 10,
      vegetables: 5,
      fruits: 3,
      
      // Bedding
      bedding: 20,
      
      // Toys and enrichment
      chewToys: 2,
      tunnels: 1,
      hideouts: 1,
      
      // Cage items
      waterBottle: 1,
      foodBowl: 1,
      
      // Large items
      largeBed: 0,
      largeHouse: 0
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
        vegetables: 5,
        fruits: 3,
        bedding: 20,
        chewToys: 2,
        tunnels: 1,
        hideouts: 1,
        waterBottle: 1,
        foodBowl: 1,
        largeBed: 1,
        largeHouse: 1
      }
    },

    $reset() {
      this.items = {}
    }
  }
}) 