import { defineStore } from 'pinia'
import { useFoodStore } from '../food.js'
import { useInventoryStore } from '../inventory.js'
import { useStatisticsStore } from '../statistics.js'
import { useStatusStore } from '../status.js'
import { useCageStore } from '../cage.js'
import { needStoreMixin } from './needStoreMixin.js'
import { STANDARD_DEGRADATION_RATES } from './needsFulfillmentPatterns.js'

export const useHungerStore = defineStore('hunger', {
  state: () => ({
    currentValue: 100,
    degradationRate: STANDARD_DEGRADATION_RATES.hunger || 0.1, // Points per second
    maxValue: 100,
    minValue: 0,
    urgency: 0, // Will be calculated by needs queue
    needType: 'hunger',
    previousStatus: null, // Track previous status for reactions
    recentlyFulfilled: false, // Flag to prevent duplicate reactions
    
    // Guinea pig reactions for different improvements
    reactions: {
      // General eating reactions (shown after ANY food consumption)
      eating: [
        'Nom nom nom!',
        'Delicious!',
        'Yummy food!',
        'Crunch crunch!',
        'So tasty!',
        'Thank you for the food!',
        'Munch munch munch!',
        'Perfect snack!',
        'Food makes me happy!',
        'Wheek wheek! More please!'
      ],
      
      criticalToUrgent: [
        'Wheek wheek wheek!',
        'Finally some food!',
        'Nom nom nom...',
        'Thank you human!'
      ],
      urgentToNormal: [
        'Yummy!',
        'Crunch crunch crunch',
        'Much better now!',
        'Happy guinea pig sounds!'
      ],
      normalToFulfilled: [
        'So satisfied!',
        'Best human ever!',
        'Purr purr purr...',
        'Life is good!',
        'Perfect!'
      ],
      // Reactions when status gets worse (degradations)
      fulfilledToNormal: [
        'Getting a bit hungry...',
        'Could use a snack',
        'Tummy starting to rumble',
        'Food thoughts creeping in'
      ],
      normalToUrgent: [
        'Really need food now!',
        'Wheek! Where is dinner?',
        'Getting quite hungry!',
        'Food! Food! Food!',
        'Human, I need sustenance!'
      ],
      urgentToCritical: [
        'WHEEK WHEEK WHEEK!',
        'STARVING GUINEA PIG!',
        'EMERGENCY FOOD NEEDED!',
        'CRITICAL HUNGER ALERT!',
        'MUST EAT NOW!'
      ]
    },
    
    // Urgency status messages (different from reactions)
    urgencyMessages: {
      normal: [
        'Getting a bit peckish...',
        'Sniffing around for food...',
        'Time for a snack?'
      ],
      urgent: [
        'I\'m getting really hungry!',
        'Where\'s the food?',
        'Need food soon!',
        'My tummy is rumbling...'
      ],
      critical: [
        'I\'m STARVING!',
        'FEED ME NOW!',
        'I need food immediately!',
        'This guinea pig is famished!'
      ]
    },
    
    // Message configuration
    messageConfig: {
      emoji: '🍽️',
      intervals: {
        normal: 18000,    // 18 seconds
        urgent: 12000,     // 12 seconds  
        critical: 8000    // 8 seconds
      }
    }
  }),

  getters: {
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
    
    needStatus() {
      if (this.currentValue >= 90) return 'fulfilled'
      if (this.currentValue >= 70) return 'normal'
      if (this.currentValue >= 50) return 'urgent'
      return 'critical'
    },
    
    percentage() {
      return (this.currentValue / this.maxValue) * 100
    },
    
    canFulfill() {
      return this.currentValue < this.maxValue
    },

    // Get fulfillment methods from food store
    fulfillmentMethods() {
      const foodStore = useFoodStore()
      return foodStore.getFulfillmentMethods(this.needType)
    }
  },

  actions: {
    degrade(amount = null) {
      const degradeAmount = amount || this.degradationRate
      this.currentValue = Math.max(this.minValue, this.currentValue - degradeAmount)
    },

    fulfill(methodName) {
      const foodStore = useFoodStore()
      const inventoryStore = useInventoryStore()
      const statisticsStore = useStatisticsStore()
      const improvement = foodStore.getFoodImprovement(methodName, this.needType)
      
      if (improvement === 0) {
        return { success: false, message: 'Invalid fulfillment method' }
      }

      // Check if the food is available in inventory
      if (!inventoryStore.hasItem(methodName, 1)) {
        return { success: false, message: `No ${methodName} available in inventory` }
      }

      if (this.currentValue >= this.maxValue) {
        return { success: false, message: 'Hunger is already satisfied' }
      }

      // Consume the food from inventory
      const consumed = inventoryStore.removeItem(methodName, 1)
      if (!consumed) {
        return { success: false, message: 'Failed to consume food from inventory' }
      }

      const oldValue = this.currentValue
      this.currentValue = Math.min(this.maxValue, this.currentValue + improvement)
      const actualImprovement = this.currentValue - oldValue

      // Show "ate food" message for automatic eating
      if (actualImprovement > 0) {
        const statusStore = useStatusStore()
        const itemDisplayName = methodName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        statusStore.showTemporaryMessage(`Ate ${itemDisplayName}`, '🍽️', 1500)
      }

      // Show eating reaction when food is consumed 
      if (actualImprovement > 0) {
        console.log(`🍽️ [HUNGER] FEED: Guinea pig consumed food, hunger improved by ${actualImprovement} (${oldValue} -> ${this.currentValue})`)
        
        // Set flag to prevent duplicate reactions from automatic degradation checks
        this.recentlyFulfilled = true
        
        // Always show a general eating reaction after any food consumption
        const eatingReaction = this.getRandomReaction('eating')
        if (eatingReaction) {
          console.log(`🍽️ [HUNGER] FEED: Selected eating reaction: "${eatingReaction.message}" 🐹`)
          // Show reaction with shorter delay for better timing
          const statusStore = useStatusStore()
          setTimeout(() => {
            statusStore.showTemporaryMessage(eatingReaction.message, '🐹', 1200)
          }, 800) // Show sooner after "Ate X" message
        }
      }
      
      // Clear the flag after a short delay so needsQueue can handle future automatic changes
      setTimeout(() => {
        console.log(`🍽️ [HUNGER] FEED: Clearing recentlyFulfilled flag after 500ms delay`)
        this.recentlyFulfilled = false
      }, 500) // 0.5 seconds should be enough to avoid conflicts

      // Track food consumption in statistics
      statisticsStore.trackFoodConsumption(methodName, actualImprovement)

      return {
        success: true,
        message: `Hunger improved by ${actualImprovement} points (consumed 1 ${methodName})`,
        improvement: actualImprovement,
        method: methodName,
        consumed: 1
      }
    },

    reset() {
      this.currentValue = this.maxValue
    },

    setUrgency(urgency) {
      this.urgency = urgency
    },

    getBestFulfillmentMethod() {
      // Return the highest priority method that can be used
      const foodStore = useFoodStore()
      return foodStore.getBestFulfillmentMethod(this.needType)
    },

    // Helper methods for setting degradation rates in different time units
    setDegradationPerSecond(rate) {
      this.degradationRate = rate
    },

    // Shared mixin methods for status improvements and reactions
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