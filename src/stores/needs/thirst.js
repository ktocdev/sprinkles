// Thirst need store - example implementation using the standard template
import { defineStore } from 'pinia'
import { needStoreMixin } from './needStoreMixin.js'
import { NEED_FULFILLMENT_PATTERNS, STANDARD_DEGRADATION_RATES } from './needsFulfillmentPatterns.js'
import { DEBUG_STORES } from './needsQueue.js'

export const useThirstStore = defineStore('thirst', {
  state: () => ({
    // Core need properties
    currentValue: 100,
    degradationRate: STANDARD_DEGRADATION_RATES.thirst || 0.08,
    maxValue: 100,
    minValue: 0,
    urgency: 0,
    needType: 'thirst',
    previousStatus: null,
    recentlyFulfilled: false,
    
    // Status messages for different urgency levels
    urgencyMessages: {
      normal: [
        'Getting a bit thirsty...',
        'Could use some water...',
        'Time for a drink?'
      ],
      urgent: [
        'I\'m getting really thirsty!',
        'Need water soon!',
        'Where\'s the water?',
        'Getting quite parched...'
      ],
      critical: [
        'I\'m SO THIRSTY!',
        'NEED WATER NOW!',
        'Critical dehydration!',
        'Water emergency!'
      ]
    },
    
    // Message configuration
    messageConfig: {
      emoji: '💧',
      intervals: {
        normal: 10000,    // 10 seconds
        urgent: 6000,     // 6 seconds  
        critical: 4000    // 4 seconds
      }
    },
    
    // Reaction messages for status changes
    reactions: {
      // General drinking reactions (shown after ANY water consumption)
      drinking: [
        'Glug glug glug!',
        'Refreshing!',
        'Cool water!',
        'Slurp slurp!',
        'So refreshing!',
        'Water tastes great!',
        'Gulp gulp gulp!',
        'Perfect hydration!',
        'Water makes me happy!',
        'Thank you for the water!'
      ],
      
      // Improvement reactions
      criticalToUrgent: [
        'Getting some hydration!',
        'Water is helping!',
        'Thirst improving!'
      ],
      urgentToNormal: [
        'Much more hydrated!',
        'Good water level!',
        'Thirst satisfied!'
      ],
      normalToFulfilled: [
        'Perfect hydration!',
        'All hydrated now!',
        'Water levels excellent!'
      ],
      // Degradation reactions
      fulfilledToNormal: [
        'Starting to get thirsty...',
        'Could use water soon',
        'Hydration declining'
      ],
      normalToUrgent: [
        'Getting quite thirsty!',
        'Really need water now!',
        'Thirst becoming urgent!'
      ],
      urgentToCritical: [
        'CRITICAL THIRST!',
        'DEHYDRATION EMERGENCY!',
        'NEED WATER IMMEDIATELY!'
      ]
    },
    
    // Blue/cyan color theming for thirst
    colors: {
      primary: '#00bcd4', // Cyan color for water/thirst
      gradient: ['#87ceeb', '#00bcd4'], // Light blue to cyan
      
      // Status-specific colors
      fulfilled: '#b2ebf2', // Light cyan when hydrated (maintains cyan theme)
      normal: '#87ceeb',    // Light blue when normal
      urgent: '#00bcd4',    // Cyan when urgent
      critical: '#0097a7'   // Darker cyan when critical
    }
  }),

  getters: {
    // Status thresholds
    isUrgent() {
      return this.currentValue >= 50 && this.currentValue < 70
    },
    
    isCritical() {
      return this.currentValue < 50
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
    
    // Fulfillment methods using predefined patterns
    fulfillmentMethods() {
      const patterns = NEED_FULFILLMENT_PATTERNS.thirst
      if (patterns && patterns.methods) {
        return Object.entries(patterns.methods).map(([key, method]) => ({
          name: key,
          displayName: method.name,
          improvement: method.improvement,
          emoji: method.emoji,
          description: method.description
        }))
      }
      return []
    }
  },

  actions: {
    // Core need actions
    degrade(amount = null) {
      const degradeAmount = amount || this.degradationRate
      this.currentValue = Math.max(this.minValue, this.currentValue - degradeAmount)
    },

    // Thirst fulfillment
    fulfill(methodName) {
      const patterns = NEED_FULFILLMENT_PATTERNS.thirst
      if (patterns && patterns.methods && patterns.methods[methodName]) {
        const method = patterns.methods[methodName]
        const improvement = method.improvement
        
        if (this.currentValue >= this.maxValue) {
          return { success: false, message: 'Thirst is already satisfied' }
        }

        const oldValue = this.currentValue
        this.currentValue = Math.min(this.maxValue, this.currentValue + improvement)
        const actualImprovement = this.currentValue - oldValue

        // Show drinking reaction if improvement occurred
        if (actualImprovement > 0) {
          DEBUG_STORES && console.log(`💧 [THIRST] FULFILL: ${method.name} improved thirst by ${actualImprovement} (${oldValue} -> ${this.currentValue})`)
          
          // Set flag to prevent duplicate reactions
          this.recentlyFulfilled = true
          
          // Always show a general drinking reaction after any water consumption
          const drinkingReaction = this.getRandomReaction('drinking')
          if (drinkingReaction) {
            DEBUG_STORES && console.log(`💧 [THIRST] FULFILL: Selected drinking reaction: "${drinkingReaction.message}" 💧`)
            this.triggerDelayedReaction(drinkingReaction)
          }
          
          // Clear the flag after a short delay
          setTimeout(() => {
            this.recentlyFulfilled = false
          }, 500)
        }

        return {
          success: true,
          message: `Thirst improved by ${actualImprovement} points using ${method.name}`,
          improvement: actualImprovement,
          method: methodName
        }
      }
      
      return { success: false, message: 'Invalid water source' }
    },
    
    reset() {
      this.currentValue = this.maxValue
    },
    
    setUrgency(urgency) {
      this.urgency = urgency
    },
    
    getBestFulfillmentMethod() {
      const methods = this.fulfillmentMethods
      return methods.length > 0 ? methods[0] : null
    },
    
    // Include all mixin methods
    ...needStoreMixin,
    
    // Initialize and validate the store
    initialize() {
      this.ensureMessageConfig()
      this.validateInterface()
      this.initializePreviousStatus()
    }
  },
  
  persist: true
})
