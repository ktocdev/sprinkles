import { defineStore } from 'pinia'
import { useNeedsQueueStore, DEBUG_STORES } from './needsQueue.js'

export const useWellnessStore = defineStore('wellness', {
  state: () => ({
    // Core properties to match need interface
    // Note: currentValue is calculated dynamically in getters, not stored in state
    degradationRate: 0, // Wellness doesn't degrade - it's calculated
    maxValue: 100,
    minValue: 0,
    urgency: 0,
    needType: 'wellness',
    previousStatus: null,
    recentlyFulfilled: false,
    
    // Wellness status messages for different levels
    urgencyMessages: {
      fulfilled: [
        'Guinea pig is excellent!',
        'Thriving guinea pig!',
        'Perfect health!',
        'Living the best life!',
        'Absolutely fantastic!',
        'In peak condition!',
        'Couldn\'t be better!',
        'Everything is wonderful!'
      ],
      normal: [
        'Guinea pig is content',
        'Happy and healthy',
        'Doing quite well',
        'Comfortable guinea pig',
        'All good here!'
      ],
      urgent: [
        'Guinea pig could be better',
        'Needs some attention',
        'Could use some care',
        'Not feeling great',
        'Needs improvement'
      ],
      critical: [
        'Guinea pig needs help',
        'Requires immediate attention',
        'Not doing well',
        'Needs serious care',
        'Poor condition'
      ]
    },
    
    // Message configuration with user-specified intervals
    messageConfig: {
      emoji: '🌟',
      intervals: {
        fulfilled: 20000,  // 20 seconds - show positive messages regularly
        normal: 15000,     // 15 seconds
        urgent: 12000,     // 12 seconds  
        critical: 9000     // 9 seconds
      }
    },
    
    // Color theming for wellness - rainbow pattern
    colors: {
      rainbow: true, // Special flag for rainbow coloring
      pattern: ['#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff', '#ff00ff', '#ff0080'], // Full rainbow spectrum
      
      // Status-specific colors (fallback if rainbow not supported)
      fulfilled: '#00ff00', // Bright green
      normal: '#ffff00',    // Yellow
      urgent: '#ff8000',    // Orange
      critical: '#ff0000'   // Red
    }
  }),

  getters: {
    // Calculate wellness based on other needs
    overallWellness() {
      const needsQueueStore = useNeedsQueueStore()
      const validNeeds = []
      const needDetails = []
      
      for (const [needName, storeName] of Object.entries(needsQueueStore.needs)) {
        if (storeName === 'wellness') continue // Skip self to avoid recursion
        
        const store = needsQueueStore.getNeedStore(storeName)
        if (store && store.currentValue !== undefined) {
          validNeeds.push(store.currentValue)
          needDetails.push(`${needName}:${store.currentValue}`)
        }
      }
      
      if (validNeeds.length === 0) {
        DEBUG_STORES && console.log('🌟 [WELLNESS] CALC: No valid needs found, using default 50%')
        return 50 // Default fallback
      }
      
      const average = validNeeds.reduce((sum, value) => sum + value, 0) / validNeeds.length
      const rounded = Math.round(average)
      DEBUG_STORES && console.log(`🌟 [WELLNESS] CALC: Overall wellness: ${rounded}% (from ${validNeeds.length} needs: [${needDetails.join(', ')}])`)
      return rounded
    },

    // Use overall wellness as current value
    currentValue() {
      return this.overallWellness
    },

    // Status thresholds based on overall wellness
    isUrgent() {
      return this.overallWellness <= 60 
    },
    
    isCritical() {
      return this.overallWellness <= 40 
    },
    
    isFulfilled() {
      return this.overallWellness >= 90
    },
    
    isNormal() {
      return this.overallWellness >= 70 && this.overallWellness < 90
    },
    
    needStatus() {
      const wellness = this.overallWellness
      if (wellness >= 90) return 'fulfilled'
      if (wellness >= 70) return 'normal'
      if (wellness >= 50) return 'urgent'
      return 'critical'
    },
    
    percentage() {
      return this.overallWellness
    },
    
    canFulfill() {
      return false // Wellness can't be directly fulfilled
    },

    // No fulfillment methods for wellness
    fulfillmentMethods() {
      return []
    }
  },

  actions: {
    // Wellness doesn't degrade - it's calculated from other needs
    degrade(amount = null) {
      // Do nothing - wellness is calculated, not degraded
    },

    // Wellness can't be directly fulfilled
    fulfill(methodName) {
      return { success: false, message: 'Wellness cannot be directly fulfilled' }
    },
    
    reset() {
      // Do nothing - wellness resets when other needs reset
    },
    
    setUrgency(urgency) {
      this.urgency = urgency
    },
    
    getBestFulfillmentMethod() {
      return null // No fulfillment methods
    },

    // Get wellness message based on current level
    getWellnessMessage() {
      const wellness = this.overallWellness
      const level = this.needStatus
      
      let messageArray = this.urgencyMessages[level] || this.urgencyMessages.normal
      
      const selectedMessage = messageArray[Math.floor(Math.random() * messageArray.length)]
      DEBUG_STORES && console.log(`🌟 [WELLNESS] MESSAGE: Selected "${selectedMessage}" (${level} level, ${wellness}%)`)
      return selectedMessage
    },

    // Get appropriate emoji for current wellness level
    getWellnessEmoji() {
      const wellness = this.overallWellness
      
      let emoji
      if (wellness >= 90) {
        emoji = '🌟' // excellent
      } else if (wellness >= 80) {
        emoji = '😌' // content
      } else if (wellness >= 60) {
        emoji = '🙂' // okay
      } else if (wellness >= 50) {
        emoji = '😐' // could be better
      } else {
        emoji = '😟' // needs help
      }
      
      DEBUG_STORES && console.log(`🌟 [WELLNESS] EMOJI: Selected ${emoji} for ${wellness}% wellness`)
      return emoji
    },

    // Minimal implementation for need store compatibility
    ensureMessageConfig() {
      // Already defined in state
    },

    validateInterface() {
      // Wellness store is valid by design
    },

    initializePreviousStatus() {
      this.previousStatus = this.needStatus
    },

    handleStatusChangeReactions() {
      // Wellness doesn't have status change reactions
    },

    getPendingReactions() {
      return []
    },


    initialize() {
      this.ensureMessageConfig()
      this.validateInterface()
      this.initializePreviousStatus()
      DEBUG_STORES && console.log(`🌟 [WELLNESS] INIT: Wellness store initialized with ${this.overallWellness}% wellness`)
    }
  },
  
  persist: true
})
