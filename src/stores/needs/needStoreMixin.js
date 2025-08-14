// Shared methods for need stores to handle status improvements and reactions
import { validateNeedStore } from './needStoreInterface.js'
import { MESSAGE_DURATIONS, ensureMinimumDuration } from './messageTimingConfig.js'

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

  // Trigger a reaction message via the message queue
  triggerReaction(reaction) {
    if (!reaction || !reaction.message || !reaction.emoji) {
      return
    }
    
    // Store reaction to be processed later by needsQueue
    if (!this._pendingReactions) {
      this._pendingReactions = []
    }
    
    this._pendingReactions.push({
      message: reaction.message,
      emoji: reaction.emoji,
      needType: this.needType,
      timestamp: Date.now()
    })
    
    console.log(`🎭 [${this.needType.toUpperCase()}] REACTION: Queued reaction: "${reaction.message}" ${reaction.emoji}`)
  },

  // Trigger a delayed reaction with configurable timing
  triggerDelayedReaction(reaction, delay = 0, duration = MESSAGE_DURATIONS.REACTION) {
    if (!reaction || !reaction.message || !reaction.emoji) {
      return
    }
    
    // Ensure minimum duration
    duration = ensureMinimumDuration(duration)
    
    setTimeout(() => {
      // Use the regular triggerReaction method after delay
      this.triggerReaction(reaction)
    }, delay)
    
    console.log(`🎭 [${this.needType.toUpperCase()}] DELAYED_REACTION: Scheduled reaction: "${reaction.message}" ${reaction.emoji} after ${delay}ms delay, duration: ${duration}ms`)
  },

  // Get and clear pending reactions (called by needsQueue)
  getPendingReactions() {
    const reactions = this._pendingReactions || []
    this._pendingReactions = []
    return reactions
  },

  // Handle status change reactions automatically (called by individual stores)
  handleStatusChangeReactions() {
    try {
      // Always update status tracking first
      if (this.checkForStatusImprovement) {
        const improvementReaction = this.checkForStatusImprovement()
        if (improvementReaction) {
          this.triggerReaction(improvementReaction)
        }
      }
      
      // Check for degradations (only if no improvement reaction was shown)
      if (this.checkForStatusDegradation) {
        const degradationReaction = this.checkForStatusDegradation()
        if (degradationReaction) {
          this.triggerReaction(degradationReaction)
        }
      }
      
      // Update previous status after both checks are done
      if (this.updatePreviousStatus) {
        this.updatePreviousStatus()
      }
    } catch (error) {
      console.warn(`⚠️ [${this.needType.toUpperCase()}] ERROR: Could not handle status change reactions:`, error)
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