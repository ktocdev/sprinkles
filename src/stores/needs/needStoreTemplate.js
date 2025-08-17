// Template for creating new need stores
// Copy this file and replace all instances of 'NEEDNAME' with your actual need name

import { defineStore } from 'pinia'
import { needStoreMixin } from './needStoreMixin.js'
import { NEED_FULFILLMENT_PATTERNS, STANDARD_DEGRADATION_RATES } from './needsFulfillmentPatterns.js'
import { MESSAGE_DURATIONS, MESSAGE_DELAYS, ensureMinimumDuration } from './messageTimingConfig.js'
import { DEBUG_STORES } from './needsQueue.js'

export const useNEEDNAMEStore = defineStore('NEEDNAME', {
  state: () => ({
    // Core need properties (REQUIRED)
    currentValue: 100,
    degradationRate: STANDARD_DEGRADATION_RATES.NEEDNAME || 0.1,
    maxValue: 100,
    minValue: 0,
    urgency: 0,
    needType: 'NEEDNAME',
    previousStatus: null,
    recentlyFulfilled: false,
    
    // Status messages for different urgency levels (REQUIRED)
    urgencyMessages: {
      normal: [
        'NEEDNAME is getting low...',
        'Could use some NEEDNAME attention...',
        'Time for NEEDNAME?'
      ],
      urgent: [
        'Really need NEEDNAME now!',
        'NEEDNAME is becoming urgent!',
        'Please help with NEEDNAME!'
      ],
      critical: [
        'CRITICAL NEEDNAME NEED!',
        'EMERGENCY NEEDNAME REQUIRED!',
        'NEEDNAME is in critical state!'
      ]
    },
    
    // Message configuration (REQUIRED)
    messageConfig: {
      emoji: '❓', // Replace with appropriate emoji for this need
      intervals: {
        normal: 12000,    // 12 seconds
        urgent: 8000,     // 8 seconds  
        critical: 5000    // 5 seconds
      }
    },
    
    // Color theming for this need (REQUIRED)
    // This defines how status bars will appear in the UI
    colors: {
      // PRIMARY COLOR: Main color representing this need
      primary: '#3498db', // Replace with appropriate color for this need
      
      // GRADIENT: Creates smooth color transitions for normal/fulfilled status
      // For best results, use 2-3 colors that blend well together
      gradient: ['#85c1e9', '#3498db', '#2980b9'], // Light to dark progression
      
      // SPECIAL PATTERNS: For unique needs like wellness
      // rainbow: true, // Enable rainbow coloring (like wellness)
      // pattern: ['#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00'], // Custom color pattern
      
      // STATUS-SPECIFIC COLORS: Override colors for specific status levels
      // Normal/fulfilled will use gradient, urgent/critical get orange/red overlays
      fulfilled: '#b3d9ff', // Lightest shade of need's theme when satisfied (90-100%)
      normal: '#85c1e9',    // Light version of primary (70-89%)
      urgent: '#3498db',    // Primary color with orange overlay (50-69%)
      critical: '#2980b9'   // Darker version with red overlay (0-49%)
      
      // COLOR THEME SUGGESTIONS (maintain theme identity at all status levels):
      // 🍽️ Hunger: Magenta to orange to gold ['#ff69b4', '#ff8c00', '#ffd700'] fulfilled: '#ffb3dd'
      // 💧 Thirst: Blue/cyan tones ['#87ceeb', '#00bcd4'] fulfilled: '#b2ebf2'
      // 💕 Love: Pink/rose tones ['#f8bbd9', '#e91e63'] fulfilled: '#fce4ec'
      // 💤 Sleep: Deep blue tones ['#036e92ff', '#043c61ff', '#03033dff'] fulfilled: '#b3d9ff'
      // 🌟 Wellness: Rainbow pattern (special case)
      // 🏠 Shelter: Brown/earth tones ['#d4b896', '#8b7355'] fulfilled: '#f5deb3'
      // 🎯 Enrichment: Purple/violet tones ['#bb8fce', '#8e44ad'] fulfilled: '#e1bee7'
      // 🧽 Hygiene: Green/mint tones ['#a8e6cf', '#52c41a'] fulfilled: '#e8f5e8'
    },
    
    // Reaction messages for status changes (REQUIRED)
    reactions: {
      // Improvement reactions
      criticalToUrgent: [
        'NEEDNAME is getting better!',
        'Some improvement in NEEDNAME!',
        'NEEDNAME situation improving!'
      ],
      urgentToNormal: [
        'NEEDNAME much better now!',
        'Good NEEDNAME level!',
        'Happy with NEEDNAME!'
      ],
      normalToFulfilled: [
        'Perfect NEEDNAME!',
        'NEEDNAME completely satisfied!',
        'Excellent NEEDNAME level!'
      ],
      // Degradation reactions
      fulfilledToNormal: [
        'NEEDNAME starting to decline...',
        'Could use more NEEDNAME soon',
        'NEEDNAME not as good as before'
      ],
      normalToUrgent: [
        'NEEDNAME getting urgent!',
        'Really need NEEDNAME attention!',
        'NEEDNAME situation worsening!'
      ],
      urgentToCritical: [
        'CRITICAL NEEDNAME SITUATION!',
        'EMERGENCY NEEDNAME NEEDED!',
        'NEEDNAME AT CRITICAL LEVEL!'
      ]
    }
  }),

  getters: {
    // Status thresholds (REQUIRED)
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
    
    // Fulfillment methods (REQUIRED if need has fulfillment options)
    fulfillmentMethods() {
      // Option 1: Use predefined patterns
      const patterns = NEED_FULFILLMENT_PATTERNS.NEEDNAME
      if (patterns && patterns.methods) {
        return Object.entries(patterns.methods).map(([key, method]) => ({
          name: key,
          displayName: method.name,
          improvement: method.improvement,
          emoji: method.emoji,
          description: method.description
        }))
      }
      
      // Option 2: Use external store (like hunger uses food store)
      // const externalStore = useEXTERNALStore()
      // return externalStore.getFulfillmentMethods(this.needType)
      
      // Option 3: Return empty array if no fulfillment methods
      return []
    }
  },

  actions: {
    // Core need actions (REQUIRED)
    degrade(amount = null) {
      const degradeAmount = amount || this.degradationRate
      this.currentValue = Math.max(this.minValue, this.currentValue - degradeAmount)
    },

    // Fulfillment method (REQUIRED - customize based on need type)
    fulfill(methodName) {
      // Example implementation for predefined patterns:
      const patterns = NEED_FULFILLMENT_PATTERNS.NEEDNAME
      if (patterns && patterns.methods && patterns.methods[methodName]) {
        const method = patterns.methods[methodName]
        const improvement = method.improvement
        
        if (this.currentValue >= this.maxValue) {
          return { success: false, message: 'NEEDNAME is already satisfied' }
        }

        const oldValue = this.currentValue
        this.currentValue = Math.min(this.maxValue, this.currentValue + improvement)
        const actualImprovement = this.currentValue - oldValue

        // Show fulfillment reaction if improvement occurred
        if (actualImprovement > 0) {
          DEBUG_STORES && console.log(`📈 [${this.needType.toUpperCase()}] FULFILL: ${method.name} improved NEEDNAME by ${actualImprovement} (${oldValue} -> ${this.currentValue})`)
          
          // Set flag to prevent duplicate reactions
          this.recentlyFulfilled = true
          
          // Get appropriate reaction based on current status
          const currentStatus = this.needStatus
          let reactionType = 'normalToFulfilled' // default
          
          if (currentStatus === 'critical') {
            reactionType = 'criticalToUrgent'
          } else if (currentStatus === 'urgent') {
            reactionType = 'urgentToNormal'  
          } else if (currentStatus === 'normal' || currentStatus === 'fulfilled') {
            reactionType = 'normalToFulfilled'
          }
          
          const reaction = this.getRandomReaction(reactionType)
          if (reaction) {
            // Use configurable timing for reaction duration
            this.triggerDelayedReaction(reaction, 0, MESSAGE_DURATIONS.REACTION)
          }
          
          // Clear the flag after a short delay
          setTimeout(() => {
            this.recentlyFulfilled = false
          }, MESSAGE_DELAYS.CLEAR_FULFILLED_FLAG)
        }

        return {
          success: true,
          message: `NEEDNAME improved by ${actualImprovement} points using ${method.name}`,
          improvement: actualImprovement,
          method: methodName
        }
      }
      
      // If using external store, call it here:
      // const externalStore = useEXTERNALStore()
      // return externalStore.fulfillNeed(methodName, this.needType)
      
      return { success: false, message: 'Invalid fulfillment method' }
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
    
    // Include all mixin methods (REQUIRED)
    ...needStoreMixin,
    
    // Initialize and validate the store (REQUIRED)
    initialize() {
      this.ensureMessageConfig()
      this.validateInterface()
      this.initializePreviousStatus()
    }
  },
  
  persist: true
})

/*
IMPLEMENTATION CHECKLIST:

1. □ Replace all instances of 'NEEDNAME' with your actual need name (lowercase)
2. □ Update the emoji in messageConfig  
3. □ Customize urgencyMessages for your specific need
4. □ Customize reaction messages to fit the need type
5. □ Set appropriate degradationRate from STANDARD_DEGRADATION_RATES
6. □ Configure colors section with appropriate theme colors:
   - Set primary color that represents the need's essence
   - Create 2-3 color gradient for smooth transitions (prioritized for normal/fulfilled)
   - Set status-specific colors using lightest shade of theme for fulfilled
   - IMPORTANT: Maintain need's color identity - NO forced green for fulfilled
   - For special needs: Set rainbow: true with pattern array (like wellness)
   - Choose colors that are accessible and visually distinct
   - Status bars will show: gradients for normal/fulfilled, theme+orange overlay for urgent, theme+red overlay for critical
   - Glow effects: fulfilled=theme glow, normal=subtle theme glow, urgent=orange pulse, critical=red pulse
7. □ Implement fulfill() method based on your need's fulfillment pattern:
   - Use predefined patterns from needsFulfillmentPatterns.js, OR
   - Integrate with external store (like food store), OR  
   - Custom implementation
8. □ Update fulfillmentMethods getter to match your fulfill() implementation
9. □ Add the new need to needsQueue.js needs object
10. □ Update needsQueue.js getNeedStore() method to include your store
11. □ Test the implementation
12. □ Add any custom methods specific to your need type

EXAMPLE USAGE:
- Copy this file to useThirstStore.js
- Replace 'NEEDNAME' with 'thirst'
- Set emoji to '💧'
- Customize messages to be about water/drinking
- Implement water-based fulfillment methods
*/
