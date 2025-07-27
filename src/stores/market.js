import { defineStore } from 'pinia'
import { useInventoryStore } from './inventory.js'
import { useUserStore } from './user.js'

export const useMarketStore = defineStore('market', {
  state: () => ({
    // Base prices for all items
    basePrices: {
      // Food items
      bedding: 5,
      hay: 3,
      pellets: 4,
      lettuce: 2,
      blueberries: 6,
      carrots: 3,
      cucumbers: 2,
      
      // Toys and enrichment
      small_chew_stick: 8,
      large_chew_stick: 15,
      small_ball: 12,
      large_ball: 20,
      small_tunnel: 18,
      large_tunnel: 30,
      small_hammock: 25,
      large_hammock: 40,
      small_bed: 20,
      large_bed: 35,
      small_house: 30,
      large_house: 50,
      chew_cube: 15,
    },
    
    // Purchase history for analytics
    purchaseHistory: [],
    saleHistory: []
  }),
  
  getters: {
    // Get current price for an item
    getItemPrice: (state) => (itemName) => {
      return state.basePrices[itemName] || 0
    }
  },
  
  actions: {
    
    // Buy an item
    buyItem(itemName, quantity = 1) {
      const inventoryStore = useInventoryStore()
      const userStore = useUserStore()
      
      if (!this.basePrices[itemName]) {
        throw new Error('Item not available in market')
      }
      
      const price = this.getItemPrice(itemName)
      const totalCost = price * quantity
      
      if (userStore.currency < totalCost) {
        throw new Error('Not enough currency')
      }
      
      // Process the purchase
      userStore.spendCurrency(totalCost)
      inventoryStore.addItem(itemName, quantity)
      
      // Record purchase
      this.purchaseHistory.push({
        item: itemName,
        quantity,
        price,
        totalCost,
        timestamp: Date.now()
      })
      
      return {
        success: true,
        item: itemName,
        quantity,
        price,
        totalCost
      }
    },
    
    // Sell an item
    sellItem(itemName, quantity = 1) {
      const inventoryStore = useInventoryStore()
      const userStore = useUserStore()
      
      if (!this.basePrices[itemName]) {
        throw new Error('Item not available for sale')
      }
      
      if (!inventoryStore.removeItem(itemName, quantity)) {
        throw new Error('Not enough items to sell')
      }
      
      const price = this.getItemPrice(itemName)
      const sellPrice = Math.round(price * 0.7) // 70% of buy price
      const totalEarnings = sellPrice * quantity
      
      userStore.addCurrency(totalEarnings)
      
      // Record sale
      this.saleHistory.push({
        item: itemName,
        quantity,
        price: sellPrice,
        totalEarnings,
        timestamp: Date.now()
      })
      
      return {
        success: true,
        item: itemName,
        quantity,
        price: sellPrice,
        totalEarnings
      }
    },
    

    

    

    
    // Get market statistics
    getMarketStats() {
      const totalPurchases = this.purchaseHistory.length
      const totalSales = this.saleHistory.length
      const totalSpent = this.purchaseHistory.reduce((sum, purchase) => sum + purchase.totalCost, 0)
      const totalEarned = this.saleHistory.reduce((sum, sale) => sum + sale.totalEarnings, 0)
      
      return {
        totalPurchases,
        totalSales,
        totalSpent,
        totalEarned,
        netProfit: totalEarned - totalSpent
      }
    }
  },
  
  persist: true
}) 