import { defineStore } from 'pinia'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    items: {
      bedding: 5,
      hay: 10,
      pellets: 8,
      lettuce: 3,
      blueberries: 2,
      carrots: 4,
      cucumbers: 2,
      small_chew_stick: 3,
      large_chew_stick: 2,
      small_ball: 1,
      large_ball: 1,
      small_tunnel: 1,
      large_tunnel: 1,
      small_hammock: 1,
      large_hammock: 1,
      small_bed: 1,
      large_bed: 1,
      small_house: 1,
      large_house: 1,
      chew_cube: 2,
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
    },
    resetToDefaults() {
      this.items = {
        bedding: 5,
        hay: 10,
        pellets: 8,
        lettuce: 3,
        blueberries: 2,
        carrots: 4,
        cucumbers: 2,
        small_chew_stick: 3,
        large_chew_stick: 2,
        small_ball: 1,
        large_ball: 1,
        small_tunnel: 1,
        large_tunnel: 1,
        small_hammock: 1,
        large_hammock: 1,
        small_bed: 1,
        large_bed: 1,
        small_house: 1,
        large_house: 1,
        chew_cube: 2,
      }
    }
  },
  persist: true
}) 