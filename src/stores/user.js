import { defineStore } from 'pinia'

function clampValue(value, min = 0, max = 50) {
  return Math.max(min, Math.min(max, value))
}

export const useUserStore = defineStore('user', {
  state: () => ({
    currency: 50,
    maxCurrency: 50,
    name: '',
  }),
  actions: {
    addCurrency(amount) {
      this.currency = clampValue(this.currency + amount, 0, this.maxCurrency)
    },
    spendCurrency(amount) {
      if (this.currency >= amount) {
        this.currency -= amount
        return true
      }
      return false
    },
    setCurrency(amount) {
      this.currency = clampValue(amount, 0, this.maxCurrency)
    }
  },
  persist: true
})
