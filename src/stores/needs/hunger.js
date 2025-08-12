import { defineStore } from 'pinia'
import { useFoodStore } from '../food.js'
import { useInventoryStore } from '../inventory.js'
import { useStatisticsStore } from '../statistics.js'
import { needStoreMixin } from './needStoreMixin.js'

export const useHungerStore = defineStore('hunger', {
  state: () => ({
    currentValue: 100,
    degradationRate: 0.1, // Points per second (6 points per minute) - more noticeable for testing
    maxValue: 100,
    minValue: 0,
    urgency: 0, // Will be calculated by needs queue
    needType: 'hunger',
    previousStatus: null, // Track previous status for reactions
    recentlyFulfilled: false, // Flag to prevent duplicate reactions
    
    // Guinea pig reactions for different improvements
    reactions: {
      criticalToUrgent: [
        'Wheek wheek wheek!',
        'Finally some food!',
        'Nom nom nom...',
        'Thank you human!'
      ],
      urgentToNormal: [
        'Yummy!',
        'Crunch crunch crunch',
        'Much better now!',
        'Happy guinea pig sounds!'
      ],
      normalToFulfilled: [
        'So satisfied!',
        'Best human ever!',
        'Purr purr purr...',
        'Life is good!',
        'Perfect!'
      ]
    }
  }),

  getters: {
    isUrgent() {
      return this.currentValue <= 60 
    },
    
    isCritical() {
      return this.currentValue <= 40 
    },
    
    isFulfilled() {
      return this.currentValue >= 90
    },
    
    isNormal() {
      return this.currentValue >= 70 && this.currentValue < 90
    },
    
    needStatus() {
      if (this.currentValue >= 90) return 'fulfilled'
      if (this.currentValue >= 70) return 'normal'
      if (this.currentValue >= 50) return 'urgent'
      return 'critical'
    },
    
    percentage() {
      return (this.currentValue / this.maxValue) * 100
    },
    
    canFulfill() {
      return this.currentValue < this.maxValue
    },

    // Get fulfillment methods from food store
    fulfillmentMethods() {
      const foodStore = useFoodStore()
      return foodStore.getFulfillmentMethods(this.needType)
    }
  },

  actions: {
    degrade(amount = null) {
      const degradeAmount = amount || this.degradationRate
      this.currentValue = Math.max(this.minValue, this.currentValue - degradeAmount)
    },

    fulfill(methodName) {
      const foodStore = useFoodStore()
      const inventoryStore = useInventoryStore()
      const statisticsStore = useStatisticsStore()
      const improvement = foodStore.getFoodImprovement(methodName, this.needType)
      
      if (improvement === 0) {
        return { success: false, message: 'Invalid fulfillment method' }
      }

      // Check if the food is available in inventory
      if (!inventoryStore.hasItem(methodName, 1)) {
        return { success: false, message: `No ${methodName} available in inventory` }
      }

      if (this.currentValue >= this.maxValue) {
        return { success: false, message: 'Hunger is already satisfied' }
      }

      // Consume the food from inventory
      const consumed = inventoryStore.removeItem(methodName, 1)
      if (!consumed) {
        return { success: false, message: 'Failed to consume food from inventory' }
      }

      const oldValue = this.currentValue
      this.currentValue = Math.min(this.maxValue, this.currentValue + improvement)
      const actualImprovement = this.currentValue - oldValue

      // Set flag to prevent duplicate reactions from needsQueue
      this.recentlyFulfilled = true
      
      // Check for status improvements and show reactions immediately
      const reaction = this.checkForStatusImprovement()
      if (reaction) {
        // Trigger reaction with delay
        this.triggerDelayedReaction(reaction)
      }
      
      // Clear the flag after a short delay so needsQueue can handle future automatic changes
      setTimeout(() => {
        this.recentlyFulfilled = false
      }, 500) // 0.5 seconds should be enough to avoid conflicts

      // Track food consumption in statistics
      statisticsStore.trackFoodConsumption(methodName, actualImprovement)

      return {
        success: true,
        message: `Hunger improved by ${actualImprovement} points (consumed 1 ${methodName})`,
        improvement: actualImprovement,
        method: methodName,
        consumed: 1
      }
    },

    reset() {
      this.currentValue = this.maxValue
    },

    setUrgency(urgency) {
      this.urgency = urgency
    },

    getBestFulfillmentMethod() {
      // Return the highest priority method that can be used
      const foodStore = useFoodStore()
      return foodStore.getBestFulfillmentMethod(this.needType)
    },

    // Helper methods for setting degradation rates in different time units
    setDegradationPerSecond(rate) {
      this.degradationRate = rate
    },

    setDegradationPerMinute(rate) {
      this.degradationRate = rate / 60
    },

    setDegradationPerHour(rate) {
      this.degradationRate = rate / 3600
    },

    // Get degradation rate in different time units
    getDegradationPerSecond() {
      return this.degradationRate
    },

    getDegradationPerMinute() {
      return this.degradationRate * 60
    },

    getDegradationPerHour() {
      return this.degradationRate * 3600
    },

    // Shared mixin methods for status improvements and reactions
    ...needStoreMixin
  },

  persist: true
}) 