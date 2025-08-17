import { defineStore } from 'pinia'
import { needStoreMixin } from './needStoreMixin.js'
import { STANDARD_DEGRADATION_RATES, getPreferredItemsForNeed, isPreferredItemForNeed, getItemQualityForNeed, getFulfillmentBonusForItem, getGroundPenaltyForNeed, findNearestItemForNeed } from './needsFulfillmentPatterns.js'
import { MESSAGE_DURATIONS, MESSAGE_DELAYS, ensureMinimumDuration } from './messageTimingConfig.js'
import { useNeedsQueueStore, DEBUG_STORES } from './needsQueue.js'
import { useGuineaPigStore } from '../guineaPig.js'
import { useCageStore } from '../cage.js'

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
      primary: '#080d55ff', // Deep calming blue for sleep
      gradient: ['#036e92ff', '#043c61ff', '#03033dff'], // Light blue to deep blue gradient
      
      // Status-specific colors
      fulfilled: '#b3d9ff', // Light blue when well-rested (maintains blue theme)
      normal: '#036e92ff',    // Light calming blue when normal  
      urgent: '#043c61ff',    // Medium blue when urgent
      critical: '#03033dff'   // Deep navy blue when critical
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

    // Automatic fulfillment when guinea pig is sleeping with location-based quality
    fulfill(methodName = 'automatic_sleep', itemName = null) {
      if (methodName !== 'automatic_sleep') {
        return { success: false, message: 'Sleep can only be fulfilled through natural sleeping' }
      }

      if (this.currentValue >= this.maxValue) {
        return { success: false, message: 'Sleep is already fully satisfied' }
      }

      const oldValue = this.currentValue
      let improvement = 15 // Base sleep improvement
      let sleepLocation = 'ground'
      
      // Check if guinea pig is sleeping on a preferred item
      if (itemName && this.isPreferredSleepItem(itemName)) {
        const bonus = this.getSleepFulfillmentBonus(itemName)
        if (bonus) {
          improvement = bonus
          sleepLocation = itemName
          DEBUG_STORES && console.log(`💤 [SLEEP] ITEM_BONUS: Using ${itemName} for ${improvement} sleep points (bonus: ${bonus - 15})`)
        }
      } else {
        // Check for ground penalty
        const groundPenalty = this.getGroundSleepPenalty()
        if (groundPenalty) {
          improvement = groundPenalty
          DEBUG_STORES && console.log(`💤 [SLEEP] GROUND_PENALTY: Sleeping on ground for only ${improvement} sleep points (penalty: ${15 - groundPenalty})`)
        }
      }

      this.currentValue = Math.min(this.maxValue, this.currentValue + improvement)
      const actualImprovement = this.currentValue - oldValue

      if (actualImprovement > 0) {
        DEBUG_STORES && console.log(`💤 [SLEEP] AUTO_FULFILL: Guinea pig sleeping on ${sleepLocation}, sleep improved by ${actualImprovement} (${oldValue} -> ${this.currentValue})`)
        
        // Set flag to prevent duplicate reactions from automatic degradation checks
        this.recentlyFulfilled = true
        
        // No message chains for sleep - reactions are baked into guinea pig actions
        // The guinea pig sleeping status change will handle the messaging
      }
      
      // Clear the flag after a short delay
      setTimeout(() => {
        DEBUG_STORES && console.log(`💤 [SLEEP] AUTO_FULFILL: Clearing recentlyFulfilled flag after ${MESSAGE_DELAYS.CLEAR_FULFILLED_FLAG}ms delay`)
        this.recentlyFulfilled = false
      }, MESSAGE_DELAYS.CLEAR_FULFILLED_FLAG)

      return {
        success: true,
        message: `Sleep improved by ${actualImprovement} points through natural sleeping on ${sleepLocation}`,
        improvement: actualImprovement,
        method: methodName,
        location: sleepLocation,
        bonus: improvement - 15 // Track bonus/penalty
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

    // Helper methods for setting degradation rates in different time units
    setDegradationPerSecond(rate) {
      this.degradationRate = rate
    },

    // Check if guinea pig is currently sleeping and auto-fulfill if so
    checkAutoFulfillment() {
      try {
        const guineaPigStore = useGuineaPigStore()
        if (guineaPigStore && guineaPigStore.currentStatus === 'sleeping') {
          // Auto-fulfill sleep when guinea pig is sleeping
          if (this.canFulfill) {
            // Detect what item the guinea pig is sleeping on
            const sleepingOnItem = this.detectSleepingLocation()
            this.fulfill('automatic_sleep', sleepingOnItem)
          }
        }
      } catch (error) {
        DEBUG_STORES && console.warn(`💤 [SLEEP] AUTO_FULFILL: Could not check guinea pig status:`, error)
      }
    },

    // Detect what item the guinea pig is currently sleeping on
    detectSleepingLocation() {
      try {
        const cageStore = useCageStore()
        if (!cageStore.guineaPigPos) return null
        
        const gpX = cageStore.guineaPigPos.x
        const gpY = cageStore.guineaPigPos.y
        
        // Find if guinea pig is on any preferred sleep item
        const itemAtPosition = cageStore.items.find(item => 
          item.x === gpX && item.y === gpY && this.isPreferredSleepItem(item.name)
        )
        
        if (itemAtPosition) {
          DEBUG_STORES && console.log(`💤 [SLEEP] LOCATION: Guinea pig sleeping on ${itemAtPosition.name} at (${gpX}, ${gpY})`)
          return itemAtPosition.name
        }
        
        DEBUG_STORES && console.log(`💤 [SLEEP] LOCATION: Guinea pig sleeping on ground at (${gpX}, ${gpY})`)
        return null // Sleeping on ground
      } catch (error) {
        DEBUG_STORES && console.warn(`💤 [SLEEP] LOCATION: Could not detect sleeping location:`, error)
        return null
      }
    },

    // Shared mixin methods for status improvements and reactions
    ...needStoreMixin,

    // Initialize and validate the store
    initialize() {
      this.ensureMessageConfig()
      this.validateInterface()
      this.initializePreviousStatus()
    },

    // Sleep item detection and utility functions (using reusable system)
    
    // Get all preferred sleep items currently in the cage
    getPreferredSleepItems() {
      try {
        const cageStore = useCageStore()
        return getPreferredItemsForNeed('sleep', cageStore)
      } catch (error) {
        DEBUG_STORES && console.warn(`💤 [SLEEP] ITEMS: Could not get preferred sleep items:`, error)
        return []
      }
    },

    // Check if a specific item is good for sleeping
    isPreferredSleepItem(itemName) {
      return isPreferredItemForNeed('sleep', itemName)
    },

    // Rate sleep items by quality/comfort level (higher = better)
    getSleepItemQuality(itemName) {
      return getItemQualityForNeed('sleep', itemName)
    },

    // Get sleep fulfillment bonus for an item
    getSleepFulfillmentBonus(itemName) {
      return getFulfillmentBonusForItem('sleep', itemName)
    },

    // Get ground sleep penalty
    getGroundSleepPenalty() {
      return getGroundPenaltyForNeed('sleep')
    },

    // Find the nearest and best sleep item for the guinea pig
    findNearestSleepItem(guineaPigX = null, guineaPigY = null) {
      try {
        const cageStore = useCageStore()
        
        // Get guinea pig position if not provided
        if (guineaPigX === null || guineaPigY === null) {
          if (!cageStore.guineaPigPos) return null
          guineaPigX = cageStore.guineaPigPos.x
          guineaPigY = cageStore.guineaPigPos.y
        }

        const bestItem = findNearestItemForNeed('sleep', guineaPigX, guineaPigY, cageStore)
        
        if (bestItem) {
          DEBUG_STORES && console.log(`💤 [SLEEP] NEAREST: Found ${bestItem.name} at (${bestItem.x}, ${bestItem.y}) distance ${bestItem.distance}, quality ${bestItem.quality}`)
        }
        
        return bestItem
      } catch (error) {
        DEBUG_STORES && console.warn(`💤 [SLEEP] NEAREST: Could not find nearest sleep item:`, error)
        return null
      }
    }
  },

  persist: true
})
