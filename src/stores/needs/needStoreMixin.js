// Shared methods for need stores to handle status improvements and reactions

export const needStoreMixin = {
  // Check for status improvements and return reaction if any
  checkForStatusImprovement() {
    const currentStatus = this.needStatus
    const previousStatus = this.previousStatus
    
    // Update previous status for next check
    this.previousStatus = currentStatus
    
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
        // Extend the cooldown immediately to prevent messages in the gap
        const now = Date.now()
        const totalDuration = 0 + 800 + 50 // delay + reaction duration + small buffer
        statusStore.lastMessageTime = now + totalDuration
        
        // Show reaction immediately
        statusStore.showTemporaryMessage(reaction.message, reaction.emoji, 800)
      }
    } catch (error) {
      console.warn('Could not show delayed reaction:', error)
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