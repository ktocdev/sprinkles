import { defineStore } from 'pinia'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    items: {
      bedding: 0,
      hay: 0,
      pellets: 0,
      lettuce: 0,
      blueberries: 0,
      carrots: 0,
      cucumbers: 0,
      small_chew_stick: 0,
      large_chew_stick: 0,
      small_ball: 0,
      large_ball: 0,
      small_tunnel: 0,
      large_tunnel: 0,
      small_hammock: 0,
      large_hammock: 0,
      small_bed: 0,
      large_bed: 0,
      small_house: 0,
      large_house: 0,
      chew_cube: 0,
    }
  }),
  actions: {
    addItem(item, amount = 1) {
      if (this.items[item] !== undefined) {
        this.items[item] += amount
      }
    },
    removeItem(item, amount = 1) {
      if (this.items[item] !== undefined && this.items[item] >= amount) {
        this.items[item] -= amount
        return true
      }
      return false
    },
    setItemQuantity(item, amount) {
      if (this.items[item] !== undefined) {
        this.items[item] = amount
      }
    }
  },
  persist: true
}) 