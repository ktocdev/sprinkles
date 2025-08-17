import { defineStore } from 'pinia'
import { computed } from 'vue'
import { needStoreMixin } from '../shared/needStoreMixin.js'
import { STANDARD_DEGRADATION_RATES } from '../core/needsFulfillmentPatterns.js'
import { MESSAGE_DURATIONS, MESSAGE_DELAYS, ensureMinimumDuration } from '../shared/messageTimingConfig.js'
import { DEBUG_STORES } from '../core/needsQueue.js'
import { useNeedsQueueStore } from '../core/needsQueue.js'
import { getMessageIntervals } from '../shared/messageFrequencyConfig.js'

export const useHabitatStore = defineStore('habitat', {
  state: () => ({
    // Core need properties - habitat does NOT auto-degrade
    degradationRate: 0, // No auto degradation - only changes when items added/removed
    maxValue: 100,
    minValue: 0,
    urgency: 0,
    needType: 'habitat',
    previousStatus: null,
    recentlyFulfilled: false,
    
    // Status messages for different urgency levels
    urgencyMessages: {
      normal: [
        'Habitat could use more enrichment...',
        'Cage environment is basic',
        'Could add more items for comfort'
      ],
      urgent: [
        'Habitat needs improvement!',
        'Cage is too sparse for comfort',
        'More items needed for a good environment!'
      ],
      critical: [
        'HABITAT IS TOO BARE!',
        'URGENT: Cage needs more items!',
        'CRITICAL: Poor living environment!'
      ]
    },
    
    // Message configuration
    messageConfig: {
      emoji: '🏠',
      intervals: getMessageIntervals('habitat')
    },
    
    // Color theming for habitat - green/nature tones
    colors: {
      primary: '#32cd32', // Lime green
      gradient: ['#90ee90', '#32cd32'], // Light green to lime green
      fulfilled: '#f0fff0', // Honeydew when excellent
      normal: '#90ee90',    // Light green when normal
      urgent: '#32cd32',    // Lime green when urgent
      critical: '#228b22'   // Forest green when critical
    },
    
    // Reaction messages for status changes
    reactions: {
      // Habitat improvement reactions (when items added)
      improving: [
        'Nice addition to the habitat!',
        'Environment is getting better!',
        'Great home improvement!',
        'Love the new setup!'
      ],
      
      // Status improvement reactions
      criticalToUrgent: [
        'Habitat getting better!',
        'Environment improving!',
        'Some progress on comfort!'
      ],
      urgentToNormal: [
        'Good habitat quality now!',
        'Nice living environment!',
        'Comfortable home setup!'
      ],
      normalToFulfilled: [
        'Perfect habitat!',
        'Excellent living environment!',
        'Dream home setup!'
      ],
      // Status degradation reactions (when items removed)
      fulfilledToNormal: [
        'Habitat not as good as before...',
        'Environment feels less complete',
        'Missing some comfort items'
      ],
      normalToUrgent: [
        'Habitat quality declining!',
        'Environment needs attention!',
        'Home feels too bare!'
      ],
      urgentToCritical: [
        'HABITAT TOO SPARSE!',
        'CRITICAL: Need more items!',
        'ENVIRONMENT TOO BARE!'
      ]
    }
  }),

  getters: {
    // Get current value from cage store calculation
    currentValue() {
      const cageStore = this.getCageStore()
      return cageStore ? cageStore.habitatValue : 0
    },
    
    // Status thresholds
    isUrgent() {
      return this.currentValue <= 50 
    },
    
    isCritical() {
      return this.currentValue <= 30 
    },
    
    isFulfilled() {
      return this.currentValue >= 80
    },
    
    isNormal() {
      return this.currentValue >= 60 && this.currentValue < 80
    },
    
    // Status categorization
    needStatus() {
      if (this.currentValue >= 80) return 'fulfilled'
      if (this.currentValue >= 60) return 'normal'
      if (this.currentValue >= 40) return 'urgent'
      return 'critical'
    },
    
    // Utility getters
    percentage() {
      return (this.currentValue / this.maxValue) * 100
    },
    
    canFulfill() {
      return this.currentValue < this.maxValue
    },
    
    // Fulfillment methods - habitat is automatic, no manual fulfillment
    fulfillmentMethods() {
      return [{
        name: 'add_items',
        displayName: 'Add Items to Cage',
        improvement: 'variable',
        emoji: '🏠',
        description: 'Add beds, toys, and other items to improve habitat'
      }]
    },
    
    // Get habitat analysis
    habitatAnalysis() {
      const cageStore = this.getCageStore()
      if (!cageStore) return { score: 0, breakdown: [] }
      
      const items = cageStore.items.filter(item => !item.isConsumable)
      const breakdown = []
      let score = 0
      
      // Check for essential items
      const hasBed = items.some(item => item.type === 'bed')
      const hasToy = items.some(item => item.type === 'toy')
      const hasHideout = items.some(item => item.type === 'hideout')
      const foodCount = cageStore.items.filter(item => item.type === 'food').length
      
      if (hasBed) {
        score += 20
        breakdown.push('✓ Sleeping area (20 pts)')
      } else {
        breakdown.push('✗ Missing sleeping area (0/20 pts)')
      }
      
      if (hasToy) {
        score += 15
        breakdown.push('✓ Entertainment/toy (15 pts)')
      } else {
        breakdown.push('✗ Missing entertainment (0/15 pts)')
      }
      
      if (hasHideout) {
        score += 10
        breakdown.push('✓ Shelter/hideout (10 pts)')
      } else {
        breakdown.push('✗ Missing shelter (0/10 pts)')
      }
      
      if (foodCount >= 3) {
        score += 15
        breakdown.push(`✓ Food variety (${foodCount} items, 15 pts)`)
      } else {
        breakdown.push(`✗ Limited food variety (${foodCount}/3, 0/15 pts)`)
      }
      
      // Bonus for additional items
      const bonusItems = Math.max(0, items.length - 4)
      if (bonusItems > 0) {
        const bonusScore = bonusItems * 5
        score += bonusScore
        breakdown.push(`✓ Extra items bonus (+${bonusItems} items, ${bonusScore} pts)`)
      }
      
      return {
        score: Math.min(score, 100),
        breakdown,
        bareMinimum: score >= 60
      }
    }
  },

  actions: {
    // Habitat does NOT auto-degrade - only changes when items change
    degrade(amount = null) {
      // This method exists for interface compliance but does nothing
      // Habitat only changes when cage items are added/removed
      DEBUG_STORES() && console.log(`🏠 [HABITAT] DEGRADE: No auto-degradation for habitat`)
    },

    // No manual fulfillment - habitat is automatic based on items
    fulfill(methodName = 'add_items') {
      return {
        success: false,
        message: 'Habitat improves automatically when you add items to the cage. Visit the Market to buy more items!'
      }
    },
    
    // Track when habitat changes due to item changes
    onItemAdded(item) {
      if (item && !item.isConsumable) {
        const improvement = this.calculateItemValue(item)
        DEBUG_STORES() && console.log(`🏠 [HABITAT] ITEM_ADDED: ${item.name} added, habitat now ${this.currentValue}%`)
        
        // Show improvement reaction if significant
        if (improvement > 0) {
          const reaction = this.getRandomReaction('improving')
          if (reaction) {
            this.triggerDelayedReaction(reaction.message, 0, MESSAGE_DURATIONS.REACTION)
          }
        }
      }
    },
    
    onItemRemoved(item) {
      if (item && !item.isConsumable) {
        DEBUG_STORES() && console.log(`🏠 [HABITAT] ITEM_REMOVED: ${item.name} removed, habitat now ${this.currentValue}%`)
      }
    },
    
    // Calculate value contribution of an item
    calculateItemValue(item) {
      if (!item || item.isConsumable) return 0
      
      switch (item.type) {
        case 'bed': return 20
        case 'toy': return 15
        case 'hideout': return 10
        default: return 5 // Generic items
      }
    },
    
    reset() {
      // Habitat resets when cage is reset (all items removed)
      DEBUG_STORES() && console.log(`🏠 [HABITAT] RESET: Habitat value now ${this.currentValue}%`)
    },
    
    setUrgency(urgency) {
      this.urgency = urgency
    },
    
    getBestFulfillmentMethod() {
      const methods = this.fulfillmentMethods
      return methods.length > 0 ? methods[0] : null
    },
    
    // Helper method to get cage store
    getCageStore() {
      try {
        const { useCageStore } = require('../../cage.js')
        return useCageStore()
      } catch (error) {
        DEBUG_STORES() && console.warn(`🏠 [HABITAT] Could not get cage store:`, error)
        return null
      }
    },
    
    // Include all mixin methods
    ...needStoreMixin,
    
    // Initialize and validate the store
    initialize() {
      this.ensureMessageConfig()
      this.validateInterface()
      this.initializePreviousStatus()
      // No degradation timer needed - habitat doesn't auto-degrade
    }
  },
  
  persist: true
})