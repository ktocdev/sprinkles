import { defineStore } from 'pinia'
import { computed } from 'vue'
import { needStoreMixin } from '../shared/needStoreMixin.js'
import { STANDARD_DEGRADATION_RATES } from '../core/needsFulfillmentPatterns.js'
import { MESSAGE_DURATIONS, MESSAGE_DELAYS, ensureMinimumDuration } from '../shared/messageTimingConfig.js'
import { DEBUG_STORES } from '../core/needsQueue.js'
import { useNeedsQueueStore } from '../core/needsQueue.js'
import { getMessageIntervals } from '../shared/messageFrequencyConfig.js'
import { useCageStore } from '../../cage.js'
import { usePoopStore } from '../../poop.js'

export const useCleanlinessStore = defineStore('cleanliness', {
  state: () => ({
    // Core need properties - cleanliness does NOT auto-degrade
    degradationRate: 0, // No auto degradation - only changes when poop added/removed
    maxValue: 100,
    minValue: 0,
    urgency: 0,
    needType: 'cleanliness',
    previousStatus: null,
    recentlyFulfilled: false,
    
    // Cleanliness calculation - each poop reduces cleanliness by 2 points
    poopPenalty: 2, // Points lost per poop
    
    // Status messages for different urgency levels
    urgencyMessages: {
      normal: [
        'Cage could use a cleaning...',
        'A few poops need attention',
        'Time for some tidying up'
      ],
      urgent: [
        'Cage is getting quite messy!',
        'Several poops need cleaning',
        'Cleanliness needs attention!'
      ],
      critical: [
        'CAGE IS VERY DIRTY!',
        'URGENT: Clean up all the poops!',
        'CRITICAL: Hygiene emergency!'
      ]
    },
    
    // Message configuration
    messageConfig: {
      emoji: '🧹',
      intervals: getMessageIntervals('cleanliness')
    },
    
    // Color theming for cleanliness - clean white/gray tones
    colors: {
      primary: '#d3d3d3', // Light gray
      gradient: ['#f5f5f5', '#d3d3d3'], // Very light gray to light gray
      fulfilled: '#ffffff', // Pure white when perfectly clean
      normal: '#f5f5f5',    // Very light gray when normal
      urgent: '#d3d3d3',    // Light gray when urgent
      critical: '#a9a9a9'   // Dark gray when critical
    },
    
    // Reaction messages for status changes
    reactions: {
      // Cleaning reactions
      cleaning: [
        'Much cleaner now!',
        'Sparkling clean!',
        'Fresh and tidy!',
        'All cleaned up!',
        'Nice and hygienic!'
      ],
      
      // Status improvement reactions
      criticalToUrgent: [
        'Cleanliness improving!',
        'Getting tidier!',
        'Some progress on hygiene!'
      ],
      urgentToNormal: [
        'Good cleanliness level!',
        'Nice and tidy now!',
        'Hygienic environment!'
      ],
      normalToFulfilled: [
        'Perfectly clean!',
        'Spotless cage!',
        'Excellent hygiene!'
      ],
      // Status degradation reactions (when poops accumulate)
      fulfilledToNormal: [
        'Getting a bit messy...',
        'Some cleaning needed soon',
        'Tidiness declining'
      ],
      normalToUrgent: [
        'Cage getting quite messy!',
        'Really need to clean up!',
        'Hygiene getting concerning!'
      ],
      urgentToCritical: [
        'CAGE IS VERY DIRTY!',
        'CRITICAL MESS!',
        'HYGIENE EMERGENCY!'
      ]
    }
  }),

  getters: {
    // Calculate current cleanliness based on poop count (1.5 points per poop)
    currentValue() {
      const poopStore = this.getPoopStore()
      if (!poopStore) return 100
      
      const poopCount = poopStore.poopCount
      
      // Each poop reduces cleanliness by 1.5 points
      // Example: 6 poops = 100 - (6 * 1.5) = 100 - 9 = 91
      const cleanliness = Math.max(0, 100 - (poopCount * this.poopPenalty))
      
      return Math.round(cleanliness)
    },
    
    // Status thresholds
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
        name: 'clean_cage',
        displayName: 'Clean Cage',
        improvement: 'variable', // Depends on poop count
        emoji: '🧹',
        description: 'Remove all waste from the cage'
      }]
    },
    
    // Get cleanliness analysis
    cleanlinessAnalysis() {
      const poopStore = this.getPoopStore()
      if (!poopStore) return { poopCount: 0, cleanliness: 100, status: 'perfect', pointsLost: 0 }
      
      const poopCount = poopStore.poopCount
      const cleanliness = this.currentValue
      const pointsLost = poopCount * this.poopPenalty
      
      let status = 'perfect'
      if (cleanliness < 50) status = 'critical'
      else if (cleanliness < 70) status = 'urgent'
      else if (cleanliness < 90) status = 'normal'
      
      return {
        poopCount,
        cleanliness,
        status,
        pointsLost: Math.round(pointsLost * 10) / 10, // Round to 1 decimal place
        maxPoopsFor0: Math.ceil(100 / this.poopPenalty) // ~67 poops = 0% cleanliness
      }
    }
  },

  actions: {
    // Cleanliness does NOT auto-degrade - only changes when poop changes
    degrade(amount = null) {
      // This method exists for interface compliance but does nothing
      // Cleanliness only changes when poops are added/removed
      DEBUG_STORES() && console.log(`🧹 [CLEANLINESS] DEGRADE: No auto-degradation for cleanliness`)
    },

    // Fulfill cleanliness need by cleaning cage
    fulfill(methodName = 'clean_cage') {
      if (methodName !== 'clean_cage') {
        return { success: false, message: 'Invalid fulfillment method for cleanliness' }
      }
      
      const cageStore = this.getCageStore()
      if (!cageStore) {
        return { success: false, message: 'Cage store not available' }
      }
      
      const poopStore = this.getPoopStore()
      if (!poopStore) {
        return { success: false, message: 'Poop store not available' }
      }
      
      const oldValue = this.currentValue
      const poopsBefore = poopStore.poopCount
      
      // Clean all poops via cage store
      const result = cageStore.cleanCage()
      
      if (result.success) {
        const actualImprovement = this.currentValue - oldValue
        
        DEBUG_STORES() && console.log(`🧹 [CLEANLINESS] FULFILL: Cage cleaned, ${result.poopsRemoved} poops removed, improvement: ${actualImprovement} (${oldValue} -> ${this.currentValue})`)
        
        // Show fulfillment reaction if any poops were removed
        if (result.poopsRemoved > 0) {
          this.recentlyFulfilled = true
          
          const cleaningReaction = this.getRandomReaction('cleaning')
          if (cleaningReaction) {
            this.triggerDelayedReaction(cleaningReaction.message, 0, MESSAGE_DURATIONS.REACTION)
          }
          
          // Clear the flag after delay
          setTimeout(() => {
            this.recentlyFulfilled = false
          }, MESSAGE_DELAYS.CLEAR_FULFILLED_FLAG)
        }
        
        return {
          success: true,
          message: `Cage cleaned! Removed ${result.poopsRemoved} poops`,
          improvement: actualImprovement,
          method: methodName,
          poopsRemoved: result.poopsRemoved
        }
      }
      
      return result
    },
    
    // Track when cleanliness changes due to poop changes
    onPoopAdded(x, y) {
      const newValue = this.currentValue
      DEBUG_STORES() && console.log(`🧹 [CLEANLINESS] POOP_ADDED: Poop at (${x}, ${y}), cleanliness now ${newValue}%`)
    },
    
    onPoopRemoved(x, y) {
      const newValue = this.currentValue
      DEBUG_STORES() && console.log(`🧹 [CLEANLINESS] POOP_REMOVED: Poop removed from (${x}, ${y}), cleanliness now ${newValue}%`)
    },
    
    onAllPoopsRemoved(count) {
      const newValue = this.currentValue
      DEBUG_STORES() && console.log(`🧹 [CLEANLINESS] ALL_POOPS_REMOVED: ${count} poops removed, cleanliness now ${newValue}%`)
    },
    
    reset() {
      // Cleanliness resets when cage is reset (all poops removed)
      DEBUG_STORES() && console.log(`🧹 [CLEANLINESS] RESET: Cleanliness value now ${this.currentValue}%`)
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
        return useCageStore()
      } catch (error) {
        DEBUG_STORES() && console.warn(`🧹 [CLEANLINESS] Could not get cage store:`, error)
        return null
      }
    },
    
    // Helper method to get poop store
    getPoopStore() {
      try {
        return usePoopStore()
      } catch (error) {
        DEBUG_STORES() && console.warn(`🧹 [CLEANLINESS] Could not get poop store:`, error)
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
      // No degradation timer needed - cleanliness doesn't auto-degrade
    }
  },
  
  persist: true
})