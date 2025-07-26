import { defineStore } from 'pinia'
import { useInventoryStore } from './inventory.js'
import { useUserStore } from './user.js'

function isOfferActive(offer) {
  return offer && offer.active && Date.now() < offer.expiresAt
}

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
    
    // Current market prices (can fluctuate)
    currentPrices: {},
    
    // Market volatility (price variation percentage)
    volatility: 0.2,
    
    // Last price update timestamp
    lastUpdate: Date.now(),
    
    // Price update interval (in milliseconds)
    updateInterval: 30000, // 30 seconds
    
    // Market status
    isOpen: true,
    
    // Special offers and discounts
    specialOffers: {},
    
    // Purchase history for analytics
    purchaseHistory: [],
    saleHistory: []
  }),
  
  getters: {
    // Get current price for an item
    getItemPrice: (state) => (itemName) => {
      return state.currentPrices[itemName] || state.basePrices[itemName] || 0
    },
    

    
    // Check if market is due for price update
    shouldUpdatePrices: (state) => {
      return Date.now() - state.lastUpdate > state.updateInterval
    },
    
    // Get items that are on special offer
    getSpecialOffers: (state) => {
      return Object.keys(state.specialOffers).filter(item => 
        isOfferActive(state.specialOffers[item])
      )
    },
    
    // Get discount percentage for an item
    getDiscount: (state) => (itemName) => {
      const offer = state.specialOffers[itemName]
      if (isOfferActive(offer)) {
        return offer.discount
      }
      return 0
    }
  },
  
  actions: {
    // Initialize market prices
    initializePrices() {
      Object.keys(this.basePrices).forEach(item => {
        this.currentPrices[item] = this.basePrices[item]
      })
      this.lastUpdate = Date.now()
    },
    
    // Update market prices with some randomness
    updatePrices() {
      if (!this.shouldUpdatePrices) return
      
      Object.keys(this.basePrices).forEach(item => {
        const basePrice = this.basePrices[item]
        const variation = (Math.random() - 0.5) * 2 * this.volatility
        const newPrice = Math.max(1, Math.round(basePrice * (1 + variation)))
        this.currentPrices[item] = newPrice
      })
      
      this.lastUpdate = Date.now()
    },
    
    // Buy an item
    buyItem(itemName, quantity = 1) {
      const inventoryStore = useInventoryStore()
      const userStore = useUserStore()
      
      if (!this.isOpen) {
        throw new Error('Market is closed')
      }
      
      if (!this.basePrices[itemName]) {
        throw new Error('Item not available in market')
      }
      
      const price = this.getItemPrice(itemName)
      const discount = this.getDiscount(itemName)
      const finalPrice = Math.round(price * (1 - discount / 100))
      const totalCost = finalPrice * quantity
      
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
        price: finalPrice,
        totalCost,
        timestamp: Date.now()
      })
      
      return {
        success: true,
        item: itemName,
        quantity,
        price: finalPrice,
        totalCost,
        discount
      }
    },
    
    // Sell an item
    sellItem(itemName, quantity = 1) {
      const inventoryStore = useInventoryStore()
      const userStore = useUserStore()
      
      if (!this.isOpen) {
        throw new Error('Market is closed')
      }
      
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
    
    // Create a special offer
    createSpecialOffer(itemName, discount, duration = 300000) { // 5 minutes default
      this.specialOffers[itemName] = {
        active: true,
        discount,
        expiresAt: Date.now() + duration
      }
    },
    
    // Remove a special offer
    removeSpecialOffer(itemName) {
      if (this.specialOffers[itemName]) {
        this.specialOffers[itemName].active = false
      }
    },
    
    // Clear expired offers
    clearExpiredOffers() {
      Object.keys(this.specialOffers).forEach(item => {
        const offer = this.specialOffers[item]
        if (offer && !isOfferActive(offer)) {
          this.specialOffers[item].active = false
        }
      })
    },
    
    // Set market volatility
    setVolatility(volatility) {
      this.volatility = Math.max(0, Math.min(1, volatility))
    },
    
    // Toggle market open/closed
    toggleMarket() {
      this.isOpen = !this.isOpen
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
        netProfit: totalEarned - totalSpent,
        isOpen: this.isOpen,
        lastUpdate: this.lastUpdate
      }
    },
    
    // Reset market to base prices
    resetPrices() {
      this.currentPrices = { ...this.basePrices }
      this.lastUpdate = Date.now()
    }
  },
  
  persist: true
}) 