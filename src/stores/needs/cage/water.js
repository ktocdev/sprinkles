import { defineStore } from 'pinia'
import { computed } from 'vue'
import { needStoreMixin } from '../shared/needStoreMixin.js'
import { STANDARD_DEGRADATION_RATES } from '../core/needsFulfillmentPatterns.js'
import { MESSAGE_DURATIONS, MESSAGE_DELAYS, ensureMinimumDuration } from '../shared/messageTimingConfig.js'
import { DEBUG_STORES } from '../core/needsQueue.js'
import { useNeedsQueueStore } from '../core/needsQueue.js'
import { getMessageIntervals } from '../shared/messageFrequencyConfig.js'

export const useWaterStore = defineStore('water', {
  state: () => ({
    // Core need properties - water does NOT auto-degrade
    degradationRate: 0, // No auto degradation - only consumed when guinea pig drinks
    maxValue: 100,
    minValue: 0,
    urgency: 0,
    needType: 'water',
    previousStatus: null,
    recentlyFulfilled: false,
    
    // Status messages for different urgency levels
    urgencyMessages: {
      normal: [
        'Water level getting lower...',
        'Water bottle could use a refill',
        'Time to check the water level'
      ],
      urgent: [
        'Water level is getting low!',
        'Water bottle needs refilling',
        'Running low on fresh water!'
      ],
      critical: [
        'WATER BOTTLE IS NEARLY EMPTY!',
        'URGENT: Refill water immediately!',
        'CRITICAL: No water left!'
      ]
    },
    
    // Message configuration
    messageConfig: {
      emoji: '💧',
      intervals: getMessageIntervals('water')
    },
    
    // Color theming for water - blue/cyan tones
    colors: {
      primary: '#00bcd4', // Cyan
      gradient: ['#87ceeb', '#00bcd4'], // Sky blue to cyan
      fulfilled: '#b2ebf2', // Light cyan when full
      normal: '#87ceeb',    // Sky blue when normal
      urgent: '#00bcd4',    // Cyan when urgent
      critical: '#006064'   // Dark cyan when critical
    },
    
    // Reaction messages for status changes
    reactions: {
      // Water refresh reactions
      refilling: [
        'Fresh water!',
        'Nice clean water!',
        'Perfect for drinking!',
        'Water bottle refilled!'
      ],
      
      // Status improvement reactions
      criticalToUrgent: [
        'Water level improving!',
        'Some water available now!',
        'Getting better!'
      ],
      urgentToNormal: [
        'Good water level now!',
        'Plenty of water!',
        'Water bottle looking good!'
      ],
      normalToFulfilled: [
        'Full water bottle!',
        'Perfect water level!',
        'Excellent hydration available!'
      ],
      // Status degradation reactions
      fulfilledToNormal: [
        'Water level going down...',
        'Drinking the water',
        'Water level decreasing'
      ],
      normalToUrgent: [
        'Water getting low!',
        'Need more water soon!',
        'Water level concerning!'
      ],
      urgentToCritical: [
        'WATER ALMOST GONE!',
        'CRITICAL WATER SHORTAGE!',
        'EMERGENCY: NO WATER LEFT!'
      ]
    }
  }),

  getters: {
    // Get current value from cage store
    currentValue() {
      const cageStore = this.getCageStore()
      return cageStore ? cageStore.waterLevel : 100
    },
    
    // Status thresholds
    isUrgent() {
      return this.currentValue <= 70 
    },
    
    isCritical() {
      return this.currentValue <= 50 
    },
    
    isFulfilled() {
      return this.currentValue >= 90
    },
    
    isNormal() {
      return this.currentValue >= 70 && this.currentValue < 90
    },
    
    // Status categorization
    needStatus() {
      if (this.currentValue >= 90) return 'fulfilled'
      if (this.currentValue >= 70) return 'normal'
      if (this.currentValue >= 50) return 'urgent'
      return 'critical'
    },
    
    // Utility getters
    percentage() {
      return (this.currentValue / this.maxValue) * 100
    },
    
    canFulfill() {
      return this.currentValue < this.maxValue
    },
    
    // Fulfillment methods
    fulfillmentMethods() {
      return [{
        name: 'refresh_water',
        displayName: 'Refresh Water',
        improvement: 100, // Always full refresh
        emoji: '💧',
        description: 'Refill water bottle with fresh water'
      }]
    }
  },

  actions: {
    // Water does NOT auto-degrade - only decreases when consumed
    degrade(amount = null) {
      // This method exists for interface compliance but does nothing
      // Water only decreases via consumeWater() method
      DEBUG_STORES() && console.log(`💧 [WATER] DEGRADE: No auto-degradation for water`)
    },

    // Consume water when guinea pig drinks
    consumeWater(amount = 10) {
      const cageStore = this.getCageStore()
      if (!cageStore) return
      
      const oldValue = this.currentValue
      const newValue = Math.max(this.minValue, cageStore.waterLevel - amount)
      cageStore.setWaterLevel(newValue)
      
      DEBUG_STORES() && console.log(`💧 [WATER] CONSUME: Guinea pig drank water, level: ${newValue.toFixed(1)}% (-${amount})`)
      
      return {
        success: true,
        consumed: amount,
        newLevel: newValue,
        oldLevel: oldValue
      }
    },

    // Fulfill water need by refreshing water
    fulfill(methodName = 'refresh_water') {
      if (methodName !== 'refresh_water') {
        return { success: false, message: 'Invalid fulfillment method for water' }
      }
      
      const cageStore = this.getCageStore()
      if (!cageStore) {
        return { success: false, message: 'Cage store not available' }
      }
      
      const oldValue = this.currentValue
      cageStore.refreshWater() // Sets water to 100%
      const actualImprovement = this.currentValue - oldValue
      
      if (actualImprovement > 0) {
        DEBUG_STORES() && console.log(`💧 [WATER] FULFILL: Water refreshed, improvement: ${actualImprovement} (${oldValue} -> ${this.currentValue})`)
        
        // Show fulfillment reaction
        this.recentlyFulfilled = true
        
        const refreshReaction = this.getRandomReaction('refilling')
        if (refreshReaction) {
          this.triggerDelayedReaction(refreshReaction.message, 0, MESSAGE_DURATIONS.REACTION)
        }
        
        // Clear the flag after delay
        setTimeout(() => {
          this.recentlyFulfilled = false
        }, MESSAGE_DELAYS.CLEAR_FULFILLED_FLAG)
      }
      
      return {
        success: true,
        message: 'Water bottle refilled!',
        improvement: actualImprovement,
        method: methodName
      }
    },
    
    reset() {
      const cageStore = this.getCageStore()
      if (cageStore) {
        cageStore.setWaterLevel(this.maxValue)
      }
    },
    
    setUrgency(urgency) {
      this.urgency = urgency
    },
    
    getBestFulfillmentMethod() {
      const methods = this.fulfillmentMethods
      return methods.length > 0 ? methods[0] : null
    },
    
    // Helper method to get cage store
    getCageStore() {
      try {
        const { useCageStore } = require('../../cage.js')
        return useCageStore()
      } catch (error) {
        DEBUG_STORES() && console.warn(`💧 [WATER] Could not get cage store:`, error)
        return null
      }
    },
    
    // Include all mixin methods
    ...needStoreMixin,
    
    // Initialize and validate the store
    initialize() {
      this.ensureMessageConfig()
      this.validateInterface()
      this.initializePreviousStatus()
      // No degradation timer needed - water doesn't auto-degrade
    }
  },
  
  persist: true
})