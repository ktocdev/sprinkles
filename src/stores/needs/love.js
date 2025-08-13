// Love need store - fulfilled by human interaction (petting, talking, singing)
import { defineStore } from 'pinia'
import { needStoreMixin } from './needStoreMixin.js'
import { NEED_FULFILLMENT_PATTERNS, STANDARD_DEGRADATION_RATES } from './needsFulfillmentPatterns.js'

export const useLoveStore = defineStore('love', {
  state: () => ({
    // Core need properties
    currentValue: 100,
    degradationRate: STANDARD_DEGRADATION_RATES.love || 0.05,
    maxValue: 100,
    minValue: 0,
    urgency: 0,
    needType: 'love',
    previousStatus: null,
    recentlyFulfilled: false,
    
    // Status messages for different urgency levels
    urgencyMessages: {
      normal: [
        'Could use some attention...',
        'Feeling a bit lonely...',
        'Time for some love?'
      ],
      urgent: [
        'I need some affection!',
        'Please pet me!',
        'Feeling quite lonely!',
        'Want some cuddles...'
      ],
      critical: [
        'I\'m SO LONELY!',
        'NEED ATTENTION NOW!',
        'Please don\'t ignore me!',
        'Desperate for affection!'
      ]
    },
    
    // Message configuration
    messageConfig: {
      emoji: '💕',
      intervals: {
        normal: 15000,    // 15 seconds
        urgent: 10000,    // 10 seconds  
        critical: 6000    // 6 seconds
      }
    },
    
    // Reaction messages for status changes
    reactions: {
      // Improvement reactions
      criticalToUrgent: [
        'Getting some love!',
        'Feeling better already!',
        'Thank you for the attention!'
      ],
      urgentToNormal: [
        'So much better now!',
        'Happy guinea pig sounds!',
        'Love is wonderful!',
        'Feeling loved and appreciated!'
      ],
      normalToFulfilled: [
        'Perfect love and attention!',
        'Completely content and loved!',
        'Best human ever!',
        'Purr purr purr...',
        'Life is amazing!'
      ],
      // Degradation reactions
      fulfilledToNormal: [
        'Starting to miss the attention...',
        'Could use some love soon',
        'Affection levels declining'
      ],
      normalToUrgent: [
        'Really missing human contact!',
        'Please pay attention to me!',
        'Love levels getting low!'
      ],
      urgentToCritical: [
        'FEELING ABANDONED!',
        'LOVE EMERGENCY!',
        'NEED HUMAN INTERACTION!'
      ]
    }
  }),

  getters: {
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
    
    // Fulfillment methods for love/interaction
    fulfillmentMethods() {
      const patterns = NEED_FULFILLMENT_PATTERNS.love
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

    // Love fulfillment through human interaction
    fulfill(methodName) {
      const patterns = NEED_FULFILLMENT_PATTERNS.love
      if (patterns && patterns.methods && patterns.methods[methodName]) {
        const method = patterns.methods[methodName]
        const improvement = method.improvement
        
        if (this.currentValue >= this.maxValue) {
          return { success: false, message: 'Love levels are already maxed out!' }
        }

        const oldValue = this.currentValue
        this.currentValue = Math.min(this.maxValue, this.currentValue + improvement)
        const actualImprovement = this.currentValue - oldValue

        // Show fulfillment reaction if improvement occurred
        if (actualImprovement > 0) {
          console.log(`💕 [LOVE] FULFILL: ${method.name} improved love by ${actualImprovement} (${oldValue} -> ${this.currentValue})`)
          
          // Set flag to prevent duplicate reactions
          this.recentlyFulfilled = true
          
          // Get appropriate reaction based on current status
          const currentStatus = this.needStatus
          let reactionType = 'normalToFulfilled' // default
          
          if (currentStatus === 'critical') {
            reactionType = 'criticalToUrgent'
          } else if (currentStatus === 'urgent') {
            reactionType = 'urgentToNormal'  
          } else if (currentStatus === 'normal' || currentStatus === 'fulfilled') {
            reactionType = 'normalToFulfilled'
          }
          
          const reaction = this.getRandomReaction(reactionType)
          if (reaction) {
            this.triggerDelayedReaction(reaction)
          }
          
          // Clear the flag after a short delay
          setTimeout(() => {
            this.recentlyFulfilled = false
          }, 500)
        }

        return {
          success: true,
          message: `Love improved by ${actualImprovement} points through ${method.name}`,
          improvement: actualImprovement,
          method: methodName
        }
      }
      
      return { success: false, message: 'Invalid interaction method' }
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