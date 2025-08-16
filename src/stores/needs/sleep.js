import { defineStore } from 'pinia'
import { needStoreMixin } from './needStoreMixin.js'
import { STANDARD_DEGRADATION_RATES } from './needsFulfillmentPatterns.js'
import { MESSAGE_DURATIONS, MESSAGE_DELAYS, ensureMinimumDuration } from './messageTimingConfig.js'
import { useNeedsQueueStore } from './needsQueue.js'
import { useGuineaPigStore } from '../guineaPig.js'

export const useSleepStore = defineStore('sleep', {
  state: () => ({
    currentValue: 100,
    degradationRate: STANDARD_DEGRADATION_RATES.sleep || 0.05,
    maxValue: 100,
    minValue: 0,
    urgency: 0, // Will be calculated by needs queue
    needType: 'sleep',
    previousStatus: null, // Track previous status for reactions
    recentlyFulfilled: false, // Flag to prevent duplicate reactions
    
    // Guinea pig reactions for sleep status changes (minimal since no urgency messages)
    reactions: {
      // Improvement reactions (rare, since sleep should stay high)
      criticalToUrgent: [
        'Getting a bit more rest...',
        'Starting to feel sleepy',
        'Finding time to rest'
      ],
      urgentToNormal: [
        'Feeling more rested now',
        'Sleep is helping',
        'Getting better rest'
      ],
      normalToFulfilled: [
        'Perfectly rested!',
        'All caught up on sleep',
        'Feeling wonderfully rested'
      ],
      // Degradation reactions (should be rare due to slow degradation + auto-fulfillment)
      fulfilledToNormal: [
        'Getting a little tired...',
        'Could use some rest soon',
        'Sleep levels decreasing slightly'
      ],
      normalToUrgent: [
        'Need some rest time',
        'Getting quite tired',
        'Time for a good sleep'
      ],
      urgentToCritical: [
        'Really need to sleep!',
        'Very tired now',
        'Sleep is urgently needed!'
      ]
    },
    
    // Minimal urgency messages since sleep won't show urgency messages anyway
    urgencyMessages: {
      normal: [
        'Could use a little rest...',
        'Thinking about nap time...'
      ],
      urgent: [
        'Getting quite sleepy...',
        'Need some rest soon...'
      ],
      critical: [
        'Very tired and sleepy!',
        'Really need to sleep!'
      ]
    },
    
    // Message configuration - won't be used since sleep excluded from urgency messages
    messageConfig: {
      emoji: '💤',
      intervals: {
        normal: 60000,     // 60 seconds (won't be used)
        urgent: 45000,     // 45 seconds (won't be used)
        critical: 30000    // 30 seconds (won't be used)
      }
    },
    
    // Deep, calming blue color theming for sleep
    colors: {
      primary: '#2c3e50', // Deep calming blue for sleep
      gradient: ['#85c1e9', '#2980b9', '#1f4e79'], // Light blue to deep blue gradient
      
      // Status-specific colors
      fulfilled: '#b3d9ff', // Light blue when well-rested (maintains blue theme)
      normal: '#85c1e9',    // Light calming blue when normal  
      urgent: '#2980b9',    // Medium blue when urgent
      critical: '#1f4e79'   // Deep navy blue when critical
    }
  }),

  getters: {
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

    // Sleep fulfillment methods - automatic when guinea pig is sleeping
    fulfillmentMethods() {
      return [
        {
          name: 'automatic_sleep',
          displayName: 'Natural Sleep',
          improvement: 15, // Moderate improvement per sleep cycle
          emoji: '💤',
          description: 'Guinea pig automatically sleeps when tired'
        }
      ]
    }
  },

  actions: {
    degrade(amount = null) {
      const degradeAmount = amount || this.degradationRate
      this.currentValue = Math.max(this.minValue, this.currentValue - degradeAmount)
    },

    // Automatic fulfillment when guinea pig is sleeping
    fulfill(methodName = 'automatic_sleep') {
      if (methodName !== 'automatic_sleep') {
        return { success: false, message: 'Sleep can only be fulfilled through natural sleeping' }
      }

      if (this.currentValue >= this.maxValue) {
        return { success: false, message: 'Sleep is already fully satisfied' }
      }

      const oldValue = this.currentValue
      const improvement = 15 // Sleep increases faster than it decreases (degradation is 0.01/sec, this gives 15 points)
      this.currentValue = Math.min(this.maxValue, this.currentValue + improvement)
      const actualImprovement = this.currentValue - oldValue

      if (actualImprovement > 0) {
        console.log(`💤 [SLEEP] AUTO_FULFILL: Guinea pig sleeping, sleep improved by ${actualImprovement} (${oldValue} -> ${this.currentValue})`)
        
        // Set flag to prevent duplicate reactions from automatic degradation checks
        this.recentlyFulfilled = true
        
        // No message chains for sleep - reactions are baked into guinea pig actions
        // The guinea pig sleeping status change will handle the messaging
      }
      
      // Clear the flag after a short delay
      setTimeout(() => {
        console.log(`💤 [SLEEP] AUTO_FULFILL: Clearing recentlyFulfilled flag after ${MESSAGE_DELAYS.CLEAR_FULFILLED_FLAG}ms delay`)
        this.recentlyFulfilled = false
      }, MESSAGE_DELAYS.CLEAR_FULFILLED_FLAG)

      return {
        success: true,
        message: `Sleep improved by ${actualImprovement} points through natural sleeping`,
        improvement: actualImprovement,
        method: methodName
      }
    },

    reset() {
      this.currentValue = this.maxValue
    },

    setUrgency(urgency) {
      this.urgency = urgency
    },

    getBestFulfillmentMethod() {
      return this.fulfillmentMethods[0] || null
    },

    // Check if guinea pig is currently sleeping and auto-fulfill if so
    checkAutoFulfillment() {
      try {
        const guineaPigStore = useGuineaPigStore()
        if (guineaPigStore && guineaPigStore.currentStatus === 'sleeping') {
          // Auto-fulfill sleep when guinea pig is sleeping
          if (this.canFulfill) {
            this.fulfill('automatic_sleep')
          }
        }
      } catch (error) {
        console.warn(`💤 [SLEEP] AUTO_FULFILL: Could not check guinea pig status:`, error)
      }
    },

    // Shared mixin methods for status improvements and reactions
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