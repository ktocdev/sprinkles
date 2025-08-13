// Standard interface definition for need stores
// This file documents the expected structure and methods for all need stores

/**
 * Standard Need Store Interface
 * 
 * All need stores should follow this pattern to ensure consistency
 * and proper integration with the needs system.
 */

// =============================================================================
// REQUIRED STATE PROPERTIES
// =============================================================================

export const REQUIRED_STATE = {
  // Core need properties
  currentValue: 100,          // Current need level (0-100)
  degradationRate: 0.1,       // Points degraded per second
  maxValue: 100,              // Maximum value
  minValue: 0,                // Minimum value
  urgency: 0,                 // Calculated urgency (set by needsQueue)
  needType: 'example',        // Unique identifier for this need
  previousStatus: null,       // For tracking status changes
  recentlyFulfilled: false,   // Flag to prevent duplicate reactions

  // Message configurations
  urgencyMessages: {
    normal: [
      'Normal status message 1',
      'Normal status message 2'
    ],
    urgent: [
      'Urgent status message 1',
      'Urgent status message 2'
    ],
    critical: [
      'Critical status message 1',
      'Critical status message 2'
    ]
  },

  messageConfig: {
    emoji: '❓',              // Default emoji for this need
    intervals: {
      normal: 12000,          // Message interval for normal status (ms)
      urgent: 8000,           // Message interval for urgent status (ms)
      critical: 5000          // Message interval for critical status (ms)
    }
  },

  // Reaction messages for status changes
  reactions: {
    // Improvement reactions
    criticalToUrgent: [
      'Getting better!',
      'Improvement!'
    ],
    urgentToNormal: [
      'Much better now!',
      'Feeling good!'
    ],
    normalToFulfilled: [
      'Perfect!',
      'All satisfied!'
    ],
    // Degradation reactions
    fulfilledToNormal: [
      'Starting to decline...',
      'Could be better'
    ],
    normalToUrgent: [
      'Getting worse!',
      'Need attention!'
    ],
    urgentToCritical: [
      'Critical situation!',
      'Emergency!'
    ]
  }
}

// =============================================================================
// REQUIRED GETTERS
// =============================================================================

export const REQUIRED_GETTERS = {
  // Status thresholds
  isUrgent: 'boolean - true if currentValue <= 60',
  isCritical: 'boolean - true if currentValue <= 40', 
  isFulfilled: 'boolean - true if currentValue >= 90',
  isNormal: 'boolean - true if currentValue >= 70 && < 90',

  // Status categorization
  needStatus: 'string - "fulfilled" | "normal" | "urgent" | "critical"',
  
  // Utility getters
  percentage: 'number - (currentValue / maxValue) * 100',
  canFulfill: 'boolean - currentValue < maxValue',
  
  // Fulfillment methods (if applicable)
  fulfillmentMethods: 'array - available methods to fulfill this need'
}

// =============================================================================
// REQUIRED ACTIONS
// =============================================================================

export const REQUIRED_ACTIONS = {
  // Core need actions
  degrade: 'function(amount?) - reduce currentValue by degradationRate or amount',
  fulfill: 'function(methodName) - increase currentValue using specified method',
  reset: 'function() - reset currentValue to maxValue',
  setUrgency: 'function(urgency) - set urgency value (called by needsQueue)',

  // Fulfillment methods
  getBestFulfillmentMethod: 'function() - return the best available fulfillment method',

  // From needStoreMixin (automatically included)
  checkForStatusImprovement: 'function() - check for status improvements',
  checkForStatusDegradation: 'function() - check for status degradations', 
  updatePreviousStatus: 'function() - update previousStatus after checks',
  getRandomReaction: 'function(type) - get random reaction message',
  initializePreviousStatus: 'function() - initialize previousStatus',
  triggerDelayedReaction: 'function(reaction) - show delayed reaction message',
  handleStatusChangeReactions: 'function() - handle automatic status change reactions',
  validateInterface: 'function() - validate store follows standard interface',
  ensureMessageConfig: 'function() - ensure message config is properly structured'
}

// =============================================================================
// CONFIGURATION VALIDATION
// =============================================================================

/**
 * Validates that a need store follows the standard interface
 * @param {Object} needStore - The need store to validate
 * @returns {Object} - Validation result with success flag and errors
 */
export function validateNeedStore(needStore) {
  const errors = []
  
  // Check required state properties
  const requiredStateKeys = Object.keys(REQUIRED_STATE)
  for (const key of requiredStateKeys) {
    if (!(key in needStore)) {
      errors.push(`Missing required state property: ${key}`)
    }
  }
  
  // Check message structure
  if (needStore.urgencyMessages) {
    const requiredLevels = ['normal', 'urgent', 'critical']
    for (const level of requiredLevels) {
      if (!needStore.urgencyMessages[level] || !Array.isArray(needStore.urgencyMessages[level])) {
        errors.push(`Missing or invalid urgencyMessages.${level} (should be array)`)
      }
    }
  }
  
  // Check messageConfig structure
  if (needStore.messageConfig) {
    if (!needStore.messageConfig.emoji) {
      errors.push('Missing messageConfig.emoji')
    }
    if (!needStore.messageConfig.intervals || 
        !needStore.messageConfig.intervals.normal ||
        !needStore.messageConfig.intervals.urgent ||
        !needStore.messageConfig.intervals.critical) {
      errors.push('Missing or incomplete messageConfig.intervals')
    }
  }
  
  // Check reactions structure
  if (needStore.reactions) {
    const requiredReactionTypes = [
      'criticalToUrgent', 'urgentToNormal', 'normalToFulfilled',
      'fulfilledToNormal', 'normalToUrgent', 'urgentToCritical'
    ]
    for (const type of requiredReactionTypes) {
      if (!needStore.reactions[type] || !Array.isArray(needStore.reactions[type])) {
        errors.push(`Missing or invalid reactions.${type} (should be array)`)
      }
    }
  }
  
  return {
    success: errors.length === 0,
    errors
  }
}

// =============================================================================
// USAGE EXAMPLE
// =============================================================================

export const EXAMPLE_NEED_STORE = `
import { defineStore } from 'pinia'
import { needStoreMixin } from './needStoreMixin.js'
import { STANDARD_DEGRADATION_RATES } from './needsFulfillmentPatterns.js'

export const useExampleStore = defineStore('example', {
  state: () => ({
    currentValue: 100,
    degradationRate: STANDARD_DEGRADATION_RATES.example || 0.1,
    maxValue: 100,
    minValue: 0,
    urgency: 0,
    needType: 'example',
    previousStatus: null,
    recentlyFulfilled: false,
    
    urgencyMessages: {
      normal: [
        'Example normal message 1',
        'Example normal message 2'
      ],
      urgent: [
        'Example urgent message 1', 
        'Example urgent message 2'
      ],
      critical: [
        'Example critical message 1',
        'Example critical message 2'
      ]
    },
    
    messageConfig: {
      emoji: '🔧',
      intervals: {
        normal: 12000,
        urgent: 8000,
        critical: 5000
      }
    },
    
    reactions: {
      criticalToUrgent: ['Getting better!'],
      urgentToNormal: ['Much better!'],
      normalToFulfilled: ['Perfect!'],
      fulfilledToNormal: ['Declining...'],
      normalToUrgent: ['Getting worse!'],
      urgentToCritical: ['Critical!']
    }
  }),

  getters: {
    isUrgent() { return this.currentValue <= 60 },
    isCritical() { return this.currentValue <= 40 },
    isFulfilled() { return this.currentValue >= 90 },
    isNormal() { return this.currentValue >= 70 && this.currentValue < 90 },
    
    needStatus() {
      if (this.currentValue >= 90) return 'fulfilled'
      if (this.currentValue >= 70) return 'normal'
      if (this.currentValue >= 50) return 'urgent'
      return 'critical'
    },
    
    percentage() { return (this.currentValue / this.maxValue) * 100 },
    canFulfill() { return this.currentValue < this.maxValue },
    fulfillmentMethods() { return [] } // Implement based on need
  },

  actions: {
    degrade(amount = null) {
      const degradeAmount = amount || this.degradationRate
      this.currentValue = Math.max(this.minValue, this.currentValue - degradeAmount)
    },
    
    fulfill(methodName) {
      // Implement fulfillment logic - see needStoreTemplate.js for examples
      // Return { success: boolean, message: string, improvement?: number }
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
    
    // Include mixin methods
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
`