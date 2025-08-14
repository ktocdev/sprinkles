import { defineStore } from 'pinia'
import { useNeedsQueueStore } from './needsQueue.js'

export const useWellnessStore = defineStore('wellness', {
  state: () => ({
    // Core properties to match need interface
    currentValue: 100,
    degradationRate: 0, // Wellness doesn't degrade - it's calculated
    maxValue: 100,
    minValue: 0,
    urgency: 0,
    needType: 'wellness',
    previousStatus: null,
    recentlyFulfilled: false,
    
    // Wellness status messages for different levels
    urgencyMessages: {
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
        normal: 15000,    // 15 seconds
        urgent: 12000,    // 12 seconds  
        critical: 9000    // 9 seconds
      }
    }
  }),

  getters: {
    // Calculate wellness based on other needs
    overallWellness() {
      const needsQueueStore = useNeedsQueueStore()
      const validNeeds = []
      
      for (const [needName, storeName] of Object.entries(needsQueueStore.needs)) {
        if (storeName === 'wellness') continue // Skip self to avoid recursion
        
        const store = needsQueueStore.getNeedStore(storeName)
        if (store && store.currentValue !== undefined) {
          validNeeds.push(store.currentValue)
        }
      }
      
      if (validNeeds.length === 0) return 50 // Default fallback
      
      const average = validNeeds.reduce((sum, value) => sum + value, 0) / validNeeds.length
      return Math.round(average)
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
      
      let messageArray
      if (level === 'fulfilled') {
        // Add excellent messages for very high wellness
        messageArray = [
          'Guinea pig is excellent!',
          'Thriving guinea pig!',
          'Perfect health!',
          'Living the best life!',
          'Absolutely fantastic!'
        ]
      } else if (level === 'normal') {
        messageArray = this.urgencyMessages.normal
      } else if (level === 'urgent') {
        messageArray = this.urgencyMessages.urgent
      } else {
        messageArray = this.urgencyMessages.critical
      }

      return messageArray[Math.floor(Math.random() * messageArray.length)]
    },

    // Get appropriate emoji for current wellness level
    getWellnessEmoji() {
      const wellness = this.overallWellness
      
      if (wellness >= 90) {
        return '🌟' // excellent
      } else if (wellness >= 80) {
        return '😌' // content
      } else if (wellness >= 60) {
        return '🙂' // okay
      } else if (wellness >= 50) {
        return '😐' // could be better
      } else {
        return '😟' // needs help
      }
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
    }
  },
  
  persist: true
})