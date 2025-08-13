// Shared methods for need stores to handle status improvements and reactions
import { validateNeedStore } from './needStoreInterface.js'

export const needStoreMixin = {
  // Check for status improvements and return reaction if any
  checkForStatusImprovement() {
    const currentStatus = this.needStatus
    const previousStatus = this.previousStatus
    
    // If no previous status, no reaction yet
    if (!previousStatus) return null
    
    // Check for improvements
    if (previousStatus === 'critical' && currentStatus === 'urgent') {
      return this.getRandomReaction('criticalToUrgent')
    }
    if (previousStatus === 'urgent' && currentStatus === 'normal') {
      return this.getRandomReaction('urgentToNormal')
    }
    if (previousStatus === 'normal' && currentStatus === 'fulfilled') {
      return this.getRandomReaction('normalToFulfilled')
    }
    
    return null
  },

  // Check for status degradations and return reaction if any
  checkForStatusDegradation() {
    const currentStatus = this.needStatus
    const previousStatus = this.previousStatus
    
    // If no previous status, no reaction yet
    if (!previousStatus) return null
    
    // Check for degradations (getting worse)
    if (previousStatus === 'fulfilled' && currentStatus === 'normal') {
      return this.getRandomReaction('fulfilledToNormal')
    }
    if (previousStatus === 'normal' && currentStatus === 'urgent') {
      return this.getRandomReaction('normalToUrgent')
    }
    if (previousStatus === 'urgent' && currentStatus === 'critical') {
      return this.getRandomReaction('urgentToCritical')
    }
    
    return null
  },

  // Update previous status after both improvement and degradation checks are done
  updatePreviousStatus() {
    this.previousStatus = this.needStatus
  },

  // Get a random reaction message for a specific improvement type
  getRandomReaction(improvementType) {
    const reactions = this.reactions[improvementType]
    if (!reactions || reactions.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * reactions.length)
    return {
      message: reactions[randomIndex],
      emoji: '🐹',
      needType: this.needType,
      improvement: improvementType
    }
  },

  // Initialize previous status (call this when store is first created)
  initializePreviousStatus() {
    this.previousStatus = this.needStatus
  },

  // Trigger a delayed reaction message
  triggerDelayedReaction(reaction) {
    try {
      // Import here to avoid circular dependencies
      const { useStatusStore } = require('../status.js')
      const statusStore = useStatusStore()
      
      if (reaction && reaction.message && reaction.emoji) {
        console.log(`🎭 REACTION: Triggering delayed reaction: "${reaction.message}" ${reaction.emoji} (${reaction.needType})`)
        
        // Extend the cooldown immediately to prevent messages in the gap
        const now = Date.now()
        const totalDuration = 1000 + 800 + 50 // delay + reaction duration + small buffer
        statusStore.lastMessageTime = now + totalDuration
        console.log(`⏰ DELAY: Extended status cooldown by ${totalDuration}ms`)
        
        // Delay the reaction to show after other messages
        console.log(`⏰ DELAY: Delaying reaction by 1000ms`)
        setTimeout(() => {
          console.log(`🎭 REACTION: Showing delayed ${reaction.needType} reaction: "${reaction.message}" ${reaction.emoji}`)
          statusStore.showTemporaryMessage(reaction.message, reaction.emoji, 800)
        }, 1000)
      }
    } catch (error) {
      console.warn(`⚠️ ERROR: Could not show delayed reaction for ${reaction?.needType}:`, error)
    }
  },

  // Validate this store follows the standard interface (development only)
  validateInterface() {
    if (process.env.NODE_ENV === 'development') {
      const validation = validateNeedStore(this)
      if (!validation.success) {
        console.warn(`⚠️ Need store "${this.needType}" does not follow standard interface:`)
        validation.errors.forEach(error => console.warn(`  - ${error}`))
        return false
      } else {
        console.log(`✅ Need store "${this.needType}" follows standard interface`)
        return true
      }
    }
    return true
  },

  // Helper method to get standard thresholds (can be overridden by individual stores)
  getStandardThresholds() {
    return {
      critical: 40,
      urgent: 60,
      normal: 70,
      fulfilled: 90
    }
  },

  // Helper method to ensure message config is properly structured
  ensureMessageConfig() {
    if (!this.messageConfig) {
      console.warn(`⚠️ Need store "${this.needType}" missing messageConfig`)
      this.messageConfig = {
        emoji: '❓',
        intervals: { normal: 12000, urgent: 8000, critical: 5000 }
      }
    }
    if (!this.urgencyMessages) {
      console.warn(`⚠️ Need store "${this.needType}" missing urgencyMessages`)
      this.urgencyMessages = {
        normal: ['Need attention...'],
        urgent: ['Urgent need!'],
        critical: ['Critical situation!']
      }
    }
  }
}

/*
USAGE EXAMPLE:

import { needStoreMixin } from './needStoreMixin.js'

export const useThirstStore = defineStore('thirst', {
  state: () => ({
    currentValue: 100,
    needType: 'thirst',
    previousStatus: null,
    reactions: {
      criticalToUrgent: ['Finally some water!', 'Glug glug glug'],
      urgentToNormal: ['So refreshing!', 'Much better now!'],
      normalToFulfilled: ['Perfect hydration!', 'All satisfied!']
    }
  }),
  
  actions: {
    ...needStoreMixin,
    
    // Add your specific methods here
    fulfill() {
      // Your fulfill logic
      const reaction = this.checkForStatusImprovement()
      if (reaction) {
        this.triggerDelayedReaction(reaction)
      }
    }
  }
})
*/