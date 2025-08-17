import { defineStore } from 'pinia'
import { computed } from 'vue'
import { needStoreMixin } from '../shared/needStoreMixin.js'
import { STANDARD_DEGRADATION_RATES } from '../core/needsFulfillmentPatterns.js'
import { MESSAGE_DURATIONS, MESSAGE_DELAYS, ensureMinimumDuration } from '../shared/messageTimingConfig.js'
import { DEBUG_STORES } from '../core/needsQueue.js'
import { useNeedsQueueStore } from '../core/needsQueue.js'
import { getMessageIntervals } from '../shared/messageFrequencyConfig.js'

export const useBeddingStore = defineStore('bedding', {
  state: () => ({
    // Core need properties - bedding auto-degrades over time
    degradationRate: STANDARD_DEGRADATION_RATES.bedding || 0.05, // Points per second (3% per minute)
    maxValue: 100,
    minValue: 0,
    urgency: 0,
    needType: 'bedding',
    previousStatus: null,
    recentlyFulfilled: false,
    
    // Bedding-specific state
    _degradationTimer: null, // Timer for bedding degradation
    
    // Status messages for different urgency levels
    urgencyMessages: {
      normal: [
        'Bedding is getting a bit used...',
        'Time to think about fresh bedding',
        'Bedding could use refreshing soon'
      ],
      urgent: [
        'Bedding is getting quite dirty!',
        'Fresh bedding needed soon',
        'Time for a bedding change!'
      ],
      critical: [
        'BEDDING IS VERY DIRTY!',
        'URGENT: Fresh bedding needed!',
        'CRITICAL: Replace bedding immediately!'
      ]
    },
    
    // Message configuration
    messageConfig: {
      emoji: '🛏️',
      intervals: getMessageIntervals('bedding')
    },
    
    // Color theming for bedding - brown/earth tones
    colors: {
      primary: '#8b7355', // Brown
      gradient: ['#d4b896', '#8b7355'], // Light brown to dark brown
      fulfilled: '#f5deb3', // Wheat color when fresh
      normal: '#d4b896',    // Light brown when normal
      urgent: '#8b7355',    // Brown when urgent
      critical: '#654321'   // Dark brown when critical
    },
    
    // Reaction messages for status changes
    reactions: {
      // Bedding refresh reactions
      refreshing: [
        'Ahh, fresh bedding!',
        'So cozy and clean!',
        'Much better now!',
        'Clean and comfortable!'
      ],
      
      // Status improvement reactions
      criticalToUrgent: [
        'Bedding is getting better!',
        'Some improvement in comfort!',
        'A bit cleaner now!'
      ],
      urgentToNormal: [
        'Bedding much better now!',
        'Good comfort level!',
        'Happy with the cleanliness!'
      ],
      normalToFulfilled: [
        'Perfect fresh bedding!',
        'Bedding completely fresh!',
        'Excellent comfort level!'
      ],
      // Status degradation reactions
      fulfilledToNormal: [
        'Bedding starting to get used...',
        'Could use fresh bedding soon',
        'Bedding not as fresh as before'
      ],
      normalToUrgent: [
        'Bedding getting dirty!',
        'Really need fresh bedding!',
        'Bedding condition worsening!'
      ],
      urgentToCritical: [
        'BEDDING IS VERY DIRTY!',
        'CRITICAL BEDDING CONDITION!',
        'EMERGENCY BEDDING CHANGE NEEDED!'
      ]
    }
  }),

  getters: {
    // Get current value from cage store
    currentValue() {
      const cageStore = this.getCageStore()
      return cageStore ? cageStore.beddingFreshness : 100
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
        name: 'refresh_bedding',
        displayName: 'Refresh Bedding',
        improvement: 'variable', // Depends on inventory
        emoji: '🛏️',
        description: 'Replace with fresh, clean bedding'
      }]
    }
  },

  actions: {
    // Auto-degradation over time
    degrade(amount = null) {
      const cageStore = this.getCageStore()
      if (!cageStore) return
      
      const degradeAmount = amount || this.degradationRate
      const newValue = Math.max(this.minValue, cageStore.beddingFreshness - degradeAmount)
      cageStore.setBeddingFreshness(newValue)
      
      DEBUG_STORES() && console.log(`🛏️ [BEDDING] DEGRADE: ${cageStore.beddingFreshness.toFixed(1)}% (-${degradeAmount.toFixed(2)})`)
    },

    // Fulfill bedding need by refreshing bedding
    fulfill(methodName = 'refresh_bedding') {
      if (methodName !== 'refresh_bedding') {
        return { success: false, message: 'Invalid fulfillment method for bedding' }
      }
      
      const cageStore = this.getCageStore()
      if (!cageStore) {
        return { success: false, message: 'Cage store not available' }
      }
      
      const oldValue = this.currentValue
      const result = cageStore.refreshBedding()
      
      if (result.success) {
        const actualImprovement = this.currentValue - oldValue
        
        DEBUG_STORES() && console.log(`🛏️ [BEDDING] FULFILL: Bedding refreshed, improvement: ${actualImprovement} (${oldValue} -> ${this.currentValue})`)
        
        // Show fulfillment reaction
        this.recentlyFulfilled = true
        
        const refreshReaction = this.getRandomReaction('refreshing')
        if (refreshReaction) {
          this.triggerDelayedReaction(refreshReaction.message, 0, MESSAGE_DURATIONS.REACTION)
        }
        
        // Clear the flag after delay
        setTimeout(() => {
          this.recentlyFulfilled = false
        }, MESSAGE_DELAYS.CLEAR_FULFILLED_FLAG)
        
        return {
          success: true,
          message: `Bedding refreshed! Used ${result.beddingUsed} bedding units`,
          improvement: actualImprovement,
          method: methodName,
          beddingUsed: result.beddingUsed
        }
      }
      
      return result // Return the cage store result (likely inventory issue)
    },
    
    reset() {
      const cageStore = this.getCageStore()
      if (cageStore) {
        cageStore.setBeddingFreshness(this.maxValue)
      }
    },
    
    setUrgency(urgency) {
      this.urgency = urgency
    },
    
    getBestFulfillmentMethod() {
      const methods = this.fulfillmentMethods
      return methods.length > 0 ? methods[0] : null
    },
    
    // Start auto-degradation timer
    startDegradation() {
      if (this._degradationTimer) return // Already running
      
      this._degradationTimer = setInterval(() => {
        this.degrade()
      }, 1000) // Degrade every second
      
      DEBUG_STORES() && console.log(`🛏️ [BEDDING] Started degradation timer (${this.degradationRate}/second)`)
    },
    
    // Stop auto-degradation timer
    stopDegradation() {
      if (this._degradationTimer) {
        clearInterval(this._degradationTimer)
        this._degradationTimer = null
        DEBUG_STORES() && console.log(`🛏️ [BEDDING] Stopped degradation timer`)
      }
    },
    
    // Helper method to get cage store
    getCageStore() {
      try {
        const { useCageStore } = require('../../cage.js')
        return useCageStore()
      } catch (error) {
        DEBUG_STORES() && console.warn(`🛏️ [BEDDING] Could not get cage store:`, error)
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
      this.startDegradation() // Start auto-degradation
    }
  },
  
  persist: true
})