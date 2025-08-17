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
  degradationRate: 0.1,       // Points degraded per second (from STANDARD_DEGRADATION_RATES)
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

  // Color theming for UI (NEW - REQUIRED)
  colors: {
    primary: '#3498db',       // Main color representing this need
    gradient: ['#85c1e9', '#3498db', '#2980b9'], // Light to dark progression
    fulfilled: '#b3d9ff',    // Color when satisfied (90-100%)
    normal: '#85c1e9',       // Color when normal (70-89%)
    urgent: '#3498db',       // Color when urgent (50-69%)
    critical: '#2980b9'      // Color when critical (0-49%)
  },

  // Reaction messages for status changes
  reactions: {
    // General fulfillment reactions (NEW - for needs with consumption)
    eating: [                 // For hunger - shown after eating any food
      'Nom nom nom!',
      'Delicious!',
      'So tasty!'
    ],
    drinking: [               // For thirst - shown after drinking water
      'Glug glug glug!',
      'Refreshing!',
      'Cool water!'
    ],
    // Status improvement reactions
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
    // Status degradation reactions
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
// AUTONOMY SYSTEM INTEGRATION
// =============================================================================

/**
 * Autonomy System Integration
 * 
 * The autonomy system provides automatic guinea pig movement toward items
 * that can fulfill needs. This is configured in needsFulfillmentPatterns.js
 * and uses priority-based decision making.
 */

export const AUTONOMY_INTEGRATION = {
  // Movement priorities (higher = more urgent, see autonomy.js)
  movementPriorities: {
    hunger: 100,        // Highest priority - food is critical
    shelter: 90,        // Very high priority - security need
    chew: 80,          // High priority - dental health
    enrichment: 70,    // High priority - mental stimulation
    sleep: 60,         // Medium priority - rest need
    love: 50,          // Medium priority - social need (requires human)
    thirst: 40         // Lower priority - water need
    // Note: hygiene and nails excluded - require user interaction only
  },

  // Movement thresholds (when guinea pig starts seeking items)
  movementThresholds: {
    hunger: 70,        // Start seeking food at 70%
    shelter: 60,       // Start seeking shelter at 60%
    chew: 50,          // Start seeking chew items at 50%
    enrichment: 45,    // Start seeking enrichment at 45%
    sleep: 80,         // Start seeking sleep items at 80%
    love: 40,          // Start seeking love at 40%
    thirst: 30         // Start seeking water at 30% (less frequent)
  },

  // Item interaction patterns (defined in needsFulfillmentPatterns.js)
  itemPatterns: {
    // For needs with physical items on the board
    normal: {
      preferredItems: ['item1', 'item2'],    // Items guinea pig will seek
      qualityRatings: { 'item1': 100 },      // Quality ratings for pathfinding
      fulfillmentBonus: { 'item1': 20 }      // Points gained when reached
    },
    // For needs with fixed positions (like thirst)
    fixedPosition: {
      getWaterBottlePosition: 'function',    // Returns fixed position
      fixedPosition: true                    // Flag for special handling
    }
  },

  // Automatic consumption (when guinea pig reaches target)
  autoConsumption: {
    hunger: 'Automatically eats food item and removes from cage',
    thirst: 'Automatically drinks from water bottle (bottle remains)',
    sleep: 'Automatically changes status to sleeping',
    other: 'Positions guinea pig at item for manual interaction'
  }
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
import { needStoreMixin } from '../shared/needStoreMixin.js'
import { STANDARD_DEGRADATION_RATES } from '../core/needsFulfillmentPatterns.js'

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
