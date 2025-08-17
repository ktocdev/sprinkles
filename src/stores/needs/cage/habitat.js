import { defineStore } from 'pinia'
import { computed } from 'vue'
import { needStoreMixin } from '../shared/needStoreMixin.js'
import { STANDARD_DEGRADATION_RATES } from '../core/needsFulfillmentPatterns.js'
import { MESSAGE_DURATIONS, MESSAGE_DELAYS, ensureMinimumDuration } from '../shared/messageTimingConfig.js'
import { DEBUG_STORES } from '../core/needsQueue.js'
import { useNeedsQueueStore } from '../core/needsQueue.js'
import { getMessageIntervals } from '../shared/messageFrequencyConfig.js'
import { useCageStore } from '../../cage.js'

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
    
    // Get habitat analysis - matches cage store habitatValue calculation
    habitatAnalysis() {
      const cageStore = this.getCageStore()
      if (!cageStore) return { score: 0, breakdown: [] }
      
      const permanentItems = cageStore.items.filter(item => !item.isConsumable)
      const foodItems = cageStore.items.filter(item => item.type === 'food')
      const chewItems = cageStore.items.filter(item => item.type === 'chew')
      
      const breakdown = []
      let score = 0
      
      // Permanent items (15 points each)
      if (permanentItems.length > 0) {
        const permanentScore = permanentItems.length * 15
        score += permanentScore
        breakdown.push(`✓ Permanent items (${permanentItems.length} × 15 = ${permanentScore} pts)`)
        
        // Break down by type
        const beds = permanentItems.filter(item => item.type === 'bed').length
        const toys = permanentItems.filter(item => item.type === 'toy').length
        const shelters = permanentItems.filter(item => item.type === 'shelter').length
        const others = permanentItems.length - beds - toys - shelters
        
        if (beds > 0) breakdown.push(`  • ${beds} bed${beds > 1 ? 's' : ''}`)
        if (toys > 0) breakdown.push(`  • ${toys} toy${toys > 1 ? 's' : ''}`)
        if (shelters > 0) breakdown.push(`  • ${shelters} shelter${shelters > 1 ? 's' : ''}`)
        if (others > 0) breakdown.push(`  • ${others} other item${others > 1 ? 's' : ''}`)
      } else {
        breakdown.push('✗ No permanent items (0 pts)')
      }
      
      // Food items (5 points each)
      if (foodItems.length > 0) {
        const foodScore = foodItems.length * 5
        score += foodScore
        breakdown.push(`✓ Food variety (${foodItems.length} × 5 = ${foodScore} pts)`)
      } else {
        breakdown.push('✗ No food items (0 pts)')
      }
      
      // Chew items (3 points each)
      if (chewItems.length > 0) {
        const chewScore = chewItems.length * 3
        score += chewScore
        breakdown.push(`✓ Chew enrichment (${chewItems.length} × 3 = ${chewScore} pts)`)
      } else {
        breakdown.push('✗ No chew items (0 pts)')
      }
      
      return {
        score: Math.min(score, 100),
        breakdown,
        permanentItems: permanentItems.length,
        foodItems: foodItems.length,
        chewItems: chewItems.length,
        totalItems: permanentItems.length + foodItems.length + chewItems.length
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
      if (item) {
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
      if (item) {
        const value = this.calculateItemValue(item)
        if (value > 0) {
          DEBUG_STORES() && console.log(`🏠 [HABITAT] ITEM_REMOVED: ${item.name} removed, habitat now ${this.currentValue}%`)
        }
      }
    },
    
    // Calculate value contribution of an item
    calculateItemValue(item) {
      if (!item) return 0
      
      // Match the cage store's habitatValue calculation
      if (item.isConsumable) {
        switch (item.type) {
          case 'food': return 5  // Food items: 5 points each
          case 'chew': return 3  // Chew items: 3 points each
          default: return 0
        }
      } else {
        // Permanent items: 15 points each
        return 15
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