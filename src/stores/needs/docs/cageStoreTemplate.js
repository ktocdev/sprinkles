// Template for creating cage-related need stores
// Copy this file and replace all instances of 'CAGETYPE' with your actual cage need name

import { defineStore } from 'pinia'
import { computed } from 'vue'
import { needStoreMixin } from '../shared/needStoreMixin.js'
import { STANDARD_DEGRADATION_RATES } from '../core/needsFulfillmentPatterns.js'
import { MESSAGE_DURATIONS, MESSAGE_DELAYS, ensureMinimumDuration } from '../shared/messageTimingConfig.js'
import { DEBUG_STORES } from '../core/needsQueue.js'
import { useNeedsQueueStore } from '../core/needsQueue.js'
import { getMessageIntervals } from '../shared/messageFrequencyConfig.js'

export const useCAGETYPEStore = defineStore('CAGETYPE', {
  state: () => ({
    // Core need properties (REQUIRED)
    degradationRate: STANDARD_DEGRADATION_RATES.CAGETYPE || 0, // See degradation patterns below
    maxValue: 100,
    minValue: 0,
    urgency: 0,
    needType: 'CAGETYPE',
    previousStatus: null,
    recentlyFulfilled: false,
    
    // Cage-specific state (OPTIONAL)
    _degradationTimer: null, // Only needed for auto-degrading needs
    
    // Status messages for different urgency levels (REQUIRED)
    urgencyMessages: {
      normal: [
        'CAGETYPE normal message 1',
        'CAGETYPE normal message 2',
        'CAGETYPE normal message 3'
      ],
      urgent: [
        'CAGETYPE urgent message 1',
        'CAGETYPE urgent message 2',
        'CAGETYPE urgent message 3'
      ],
      critical: [
        'CAGETYPE critical message 1',
        'CAGETYPE critical message 2',
        'CAGETYPE critical message 3'
      ]
    },
    
    // Message configuration (REQUIRED)
    messageConfig: {
      emoji: '❓', // Replace with appropriate emoji for this cage need
      intervals: getMessageIntervals('CAGETYPE')
    },
    
    // Color theming for this cage need (REQUIRED)
    colors: {
      primary: '#3498db', // Replace with appropriate color
      gradient: ['#85c1e9', '#3498db'], // Light to dark progression
      fulfilled: '#b3d9ff', // Lightest shade when satisfied
      normal: '#85c1e9',    // Light version when normal
      urgent: '#3498db',    // Primary color when urgent
      critical: '#2980b9'   // Darker version when critical
    },
    
    // Reaction messages for status changes (REQUIRED)
    reactions: {
      // Fulfillment reactions (shown after manual actions)
      fulfilling: [
        'CAGETYPE action completed!',
        'Much better now!',
        'Perfect improvement!'
      ],
      
      // Status improvement reactions
      criticalToUrgent: [
        'CAGETYPE getting better!',
        'Some improvement!',
        'Progress made!'
      ],
      urgentToNormal: [
        'CAGETYPE much better now!',
        'Good level achieved!',
        'Happy with the improvement!'
      ],
      normalToFulfilled: [
        'Perfect CAGETYPE!',
        'Excellent condition!',
        'Outstanding level!'
      ],
      // Status degradation reactions
      fulfilledToNormal: [
        'CAGETYPE starting to decline...',
        'Could use attention soon',
        'Not as good as before'
      ],
      normalToUrgent: [
        'CAGETYPE getting concerning!',
        'Really needs attention!',
        'Condition worsening!'
      ],
      urgentToCritical: [
        'CRITICAL CAGETYPE SITUATION!',
        'EMERGENCY ACTION NEEDED!',
        'URGENT INTERVENTION REQUIRED!'
      ]
    }
  }),

  getters: {
    // Current value calculation (REQUIRED - choose appropriate pattern)
    currentValue() {
      // PATTERN 1: Auto-degrading need (like bedding)
      // const cageStore = this.getCageStore()
      // return cageStore ? cageStore.CAGETYPE_PROPERTY : 100
      
      // PATTERN 2: Consumption-based need (like water)
      // const cageStore = this.getCageStore()
      // return cageStore ? cageStore.CAGETYPE_LEVEL : 100
      
      // PATTERN 3: Calculation-based need (like habitat)
      // const cageStore = this.getCageStore()
      // return cageStore ? cageStore.calculateCAGETYPE() : 0
      
      // PATTERN 4: Store-dependent calculation (like cleanliness)
      // const relatedStore = this.getRelatedStore()
      // if (!relatedStore) return 100
      // return Math.max(0, 100 - (relatedStore.count * penalty))
      
      // Replace with appropriate pattern
      return 100
    },
    
    // Status thresholds (REQUIRED - adjust based on need type)
    isUrgent() {
      return this.currentValue <= 60 
    },
    
    isCritical() {
      return this.currentValue <= 40 
    },
    
    isFulfilled() {
      return this.currentValue >= 90
    },
    
    isNormal() {
      return this.currentValue >= 70 && this.currentValue < 90
    },
    
    // Status categorization (REQUIRED)
    needStatus() {
      if (this.currentValue >= 90) return 'fulfilled'
      if (this.currentValue >= 70) return 'normal'
      if (this.currentValue >= 50) return 'urgent'
      return 'critical'
    },
    
    // Utility getters (REQUIRED)
    percentage() {
      return (this.currentValue / this.maxValue) * 100
    },
    
    canFulfill() {
      return this.currentValue < this.maxValue
    },
    
    // Fulfillment methods (REQUIRED)
    fulfillmentMethods() {
      return [{
        name: 'CAGETYPE_action',
        displayName: 'CAGETYPE Action',
        improvement: 'variable', // or specific number
        emoji: '❓',
        description: 'Description of how to fulfill this cage need'
      }]
    }
  },

  actions: {
    // Degradation method (REQUIRED - implement based on degradation pattern)
    degrade(amount = null) {
      // PATTERN 1: Auto-degrading need
      // const cageStore = this.getCageStore()
      // if (!cageStore) return
      // const degradeAmount = amount || this.degradationRate
      // const newValue = Math.max(this.minValue, cageStore.CAGETYPE_PROPERTY - degradeAmount)
      // cageStore.setCAGETYPE_PROPERTY(newValue)
      
      // PATTERN 2: No auto-degradation
      // DEBUG_STORES() && console.log(`❓ [CAGETYPE] DEGRADE: No auto-degradation for CAGETYPE`)
      
      // Choose appropriate pattern
    },

    // Fulfillment method (REQUIRED - implement based on fulfillment pattern)
    fulfill(methodName = 'CAGETYPE_action') {
      // PATTERN 1: Manual action via cage store
      // const cageStore = this.getCageStore()
      // if (!cageStore) return { success: false, message: 'Cage store not available' }
      // const oldValue = this.currentValue
      // const result = cageStore.CAGETYPE_action()
      // if (result.success) {
      //   const actualImprovement = this.currentValue - oldValue
      //   // Show reaction and return success
      // }
      // return result
      
      // PATTERN 2: Automatic calculation (no manual fulfillment)
      // return { success: false, message: 'CAGETYPE improves automatically when [condition]' }
      
      // PATTERN 3: Consumption-based action
      // const relatedStore = this.getRelatedStore()
      // if (!relatedStore) return { success: false, message: 'Related store not available' }
      // return relatedStore.performAction(amount)
      
      return { success: false, message: 'Implement fulfillment pattern' }
    },
    
    // Standard need actions (REQUIRED)
    reset() {
      const cageStore = this.getCageStore()
      if (cageStore) {
        // Reset to appropriate state based on need type
        // cageStore.setCAGETYPE_PROPERTY(this.maxValue)
      }
    },
    
    setUrgency(urgency) {
      this.urgency = urgency
    },
    
    getBestFulfillmentMethod() {
      const methods = this.fulfillmentMethods
      return methods.length > 0 ? methods[0] : null
    },
    
    // Degradation timer methods (ONLY for auto-degrading needs)
    startDegradation() {
      if (this.degradationRate <= 0) return // No auto-degradation
      if (this._degradationTimer) return // Already running
      
      this._degradationTimer = setInterval(() => {
        this.degrade()
      }, 1000) // Degrade every second
      
      DEBUG_STORES() && console.log(`❓ [CAGETYPE] Started degradation timer (${this.degradationRate}/second)`)
    },
    
    stopDegradation() {
      if (this._degradationTimer) {
        clearInterval(this._degradationTimer)
        this._degradationTimer = null
        DEBUG_STORES() && console.log(`❓ [CAGETYPE] Stopped degradation timer`)
      }
    },
    
    // Event handlers (OPTIONAL - for calculation-based needs)
    onRelatedEvent(eventData) {
      // Handle events that affect this cage need
      // Example: item added/removed, poop added/removed, etc.
      DEBUG_STORES() && console.log(`❓ [CAGETYPE] EVENT: Related event occurred`)
    },
    
    // Helper methods to get other stores (REQUIRED)
    getCageStore() {
      try {
        const { useCageStore } = require('../../cage.js')
        return useCageStore()
      } catch (error) {
        DEBUG_STORES() && console.warn(`❓ [CAGETYPE] Could not get cage store:`, error)
        return null
      }
    },
    
    // Add other store getters as needed
    // getRelatedStore() {
    //   try {
    //     const { useRelatedStore } = require('../../related.js')
    //     return useRelatedStore()
    //   } catch (error) {
    //     DEBUG_STORES() && console.warn(`❓ [CAGETYPE] Could not get related store:`, error)
    //     return null
    //   }
    // },
    
    // Include all mixin methods (REQUIRED)
    ...needStoreMixin,
    
    // Initialize and validate the store (REQUIRED)
    initialize() {
      this.ensureMessageConfig()
      this.validateInterface()
      this.initializePreviousStatus()
      
      // Start degradation timer if needed
      if (this.degradationRate > 0) {
        this.startDegradation()
      }
    }
  },
  
  persist: true
})

/*
CAGE NEED DEGRADATION PATTERNS:

1. AUTO-DEGRADING NEEDS (like bedding)
   - degradationRate: > 0 (e.g., 0.05 = 3% per minute)
   - Requires degradation timer
   - Changes continuously over time
   - Example: Bedding gets dirty over time

2. CONSUMPTION-BASED NEEDS (like water)
   - degradationRate: 0 (no auto-degradation)
   - Changes only when consumed
   - Requires consumption tracking
   - Example: Water only decreases when guinea pig drinks

3. CALCULATION-BASED NEEDS (like habitat)
   - degradationRate: 0 (no auto-degradation)
   - Value calculated from other factors
   - Changes when underlying factors change
   - Example: Habitat based on item count/quality

4. EVENT-BASED NEEDS (like cleanliness)
   - degradationRate: 0 (no auto-degradation)
   - Changes based on specific events
   - Requires event handlers
   - Example: Cleanliness decreases when poop is added

CAGE NEED FULFILLMENT PATTERNS:

1. MANUAL FULFILLMENT (bedding, water, cleanliness)
   - User clicks button in CageInteractionPanel
   - May require inventory items (bedding)
   - May be free (water, cleaning)

2. AUTOMATIC FULFILLMENT (habitat)
   - No manual action required
   - Improves when conditions are met
   - User informed via messages

3. HYBRID FULFILLMENT
   - Combination of manual and automatic
   - Example: Items auto-improve habitat, but user can also add items

IMPLEMENTATION CHECKLIST:

1. □ Replace all instances of 'CAGETYPE' with your actual cage need name
2. □ Choose appropriate degradation pattern (auto, consumption, calculation, event)
3. □ Implement currentValue getter based on chosen pattern
4. □ Implement degrade() method based on chosen pattern
5. □ Implement fulfill() method based on fulfillment pattern
6. □ Update urgencyMessages with appropriate content
7. □ Set appropriate emoji in messageConfig
8. □ Configure colors with appropriate theme
9. □ Customize reaction messages
10. □ Add to needsQueue.js needs object
11. □ Update needsQueue.js getNeedStore() method
12. □ Add to CageInteractionPanel if manual fulfillment
13. □ Test the implementation
14. □ Add event handlers if needed (for calculation/event-based needs)

EXAMPLE IMPLEMENTATIONS:

- Bedding: Auto-degrading, manual fulfillment (uses inventory)
- Water: Consumption-based, manual fulfillment (free)
- Habitat: Calculation-based, automatic fulfillment
- Cleanliness: Event-based (poop), manual fulfillment (free)
*/