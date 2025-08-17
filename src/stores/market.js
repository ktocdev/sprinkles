import { defineStore } from 'pinia'
import { useInventoryStore } from './inventory.js'
import { useUserStore } from './user.js'

export const useMarketStore = defineStore('market', {
  state: () => ({
    // Comprehensive item data
    items: {
      // Food items (consumables, improve hunger)
      bedding: {
        price: 5,
        size: 1,
        consumable: true,
        placeable: false,
        needType: 'hunger',
        needImprovement: 10
      },
      hay: {
        price: 3,
        size: 1,
        consumable: true,
        placeable: true,
        needType: 'hunger',
        needImprovement: 8,
        actionWord: 'eating'
      },
      pellets: {
        price: 4,
        size: 1,
        consumable: true,
        placeable: true,
        needType: 'hunger',
        needImprovement: 12,
        actionWord: 'eating'
      },
      lettuce: {
        price: 2,
        size: 1,
        consumable: true,
        placeable: true,
        needType: 'hunger',
        needImprovement: 6,
        actionWord: 'eating'
      },
      blueberries: {
        price: 6,
        size: 1,
        consumable: true,
        placeable: true,
        needType: 'hunger',
        needImprovement: 15,
        actionWord: 'eating'
      },
      carrots: {
        price: 3,
        size: 1,
        consumable: true,
        placeable: true,
        needType: 'hunger',
        needImprovement: 10,
        actionWord: 'eating'
      },
      cucumbers: {
        price: 2,
        size: 1,
        consumable: true,
        placeable: true,
        needType: 'hunger',
        needImprovement: 5,
        actionWord: 'eating'
      },
      
      // Toys and enrichment (permanent, improve enrichment)
      small_chew_stick: {
        price: 8,
        size: 1,
        consumable: false,
        placeable: true,
        needType: 'chew',
        needImprovement: 15,
        actionWord: 'chewing'
      },
      large_chew_stick: {
        price: 15,
        size: 1,
        consumable: false,
        placeable: true,
        needType: 'chew',
        needImprovement: 25,
        actionWord: 'chewing'
      },
      small_ball: {
        price: 12,
        size: 1,
        consumable: false,
        placeable: true,
        needType: 'enrichment',
        needImprovement: 20,
        actionWord: 'playing with'
      },
      large_ball: {
        price: 20,
        size: 4,
        consumable: false,
        placeable: true,
        needType: 'enrichment',
        needImprovement: 35,
        actionWord: 'playing with'
      },
      small_tunnel: {
        price: 18,
        size: 1,
        consumable: false,
        placeable: true,
        needType: 'enrichment',
        needImprovement: 25,
        actionWord: 'exploring'
      },
      large_tunnel: {
        price: 30,
        size: 4,
        consumable: false,
        placeable: true,
        needType: 'enrichment',
        needImprovement: 40,
        actionWord: 'exploring'
      },
      small_hammock: {
        price: 25,
        size: 1,
        consumable: false,
        placeable: true,
        needType: 'shelter',
        needImprovement: 20,
        actionWord: 'resting in'
      },
      large_hammock: {
        price: 40,
        size: 4,
        consumable: false,
        placeable: true,
        needType: 'shelter',
        needImprovement: 30,
        actionWord: 'resting in'
      },
      small_bed: {
        price: 20,
        size: 1,
        consumable: false,
        placeable: true,
        needType: 'shelter',
        needImprovement: 25,
        actionWord: 'sleeping in'
      },
      large_bed: {
        price: 35,
        size: 4,
        consumable: false,
        placeable: true,
        needType: 'shelter',
        needImprovement: 40,
        actionWord: 'sleeping in'
      },
      small_house: {
        price: 30,
        size: 1,
        consumable: false,
        placeable: true,
        needType: 'shelter',
        needImprovement: 30,
        actionWord: 'in'
      },
      large_house: {
        price: 50,
        size: 4,
        consumable: false,
        placeable: true,
        needType: 'shelter',
        needImprovement: 50,
        actionWord: 'in'
      },
      chew_cube: {
        price: 15,
        size: 1,
        consumable: false,
        placeable: true,
        needType: 'chew',
        needImprovement: 20,
        actionWord: 'chewing'
      },
    },
    
    // Purchase history for analytics
    purchaseHistory: [],
    saleHistory: []
  }),
  
  getters: {
    // Get current price for an item
    getItemPrice: (state) => (itemName) => {
      return state.items[itemName]?.price || 0
    },
    
    // Get item data
    getItemData: (state) => (itemName) => {
      return state.items[itemName] || null
    },
    
    // Get emoji for item type
    getItemEmoji: (state) => (itemName) => {
      const item = state.items[itemName]
      if (!item) return '❓'
      
      const needType = item.needType
      if (needType === 'hunger') return '🥕'
      if (needType === 'chew') return '🪵'
      if (needType === 'enrichment') return '🎾'
      if (needType === 'shelter') return '🏠'
      return '📦'
    },
    
    // Get all items
    getAllItems: (state) => {
      return state.items
    }
  },
  
  actions: {
    
    // Buy an item
    buyItem(itemName, quantity = 1) {
      const inventoryStore = useInventoryStore()
      const userStore = useUserStore()
      
      if (!this.items[itemName]) {
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
      
      if (!this.items[itemName]) {
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