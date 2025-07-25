import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currency: 50,
    maxCurrency: 50,
    name: '',
  }),
  actions: {
    addCurrency(amount) {
      this.currency = Math.min(this.currency + amount, this.maxCurrency)
    },
    spendCurrency(amount) {
      if (this.currency >= amount) {
        this.currency -= amount
        return true
      }
      return false
    },
    setCurrency(amount) {
      this.currency = Math.min(amount, this.maxCurrency)
    }
  },
  persist: true
})
