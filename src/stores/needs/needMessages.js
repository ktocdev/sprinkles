import { defineStore } from 'pinia'
import { useHungerStore } from './hunger.js'

export const useNeedMessagesStore = defineStore('needMessages', {
  state: () => ({
    // Configuration for each need's messages
    needConfigs: {
      hunger: {
        thresholds: [
          {
            minValue: 0,
            maxValue: 10,
            message: "The guinea pig is starving!",
            emoji: "😰",
            priority: 100
          },
          {
            minValue: 10,
            maxValue: 33,
            message: "The guinea pig is very hungry.",
            emoji: "😟",
            priority: 80
          },
          {
            minValue: 33,
            maxValue: 50,
            message: "The guinea pig is hungry.",
            emoji: "😐",
            priority: 60
          }
        ]
      },
      // Add other needs here as they're implemented
      // thirst: {
      //   thresholds: [
      //     {
      //       minValue: 0,
      //       maxValue: 10,
      //       message: "The guinea pig is very thirsty!",
      //       emoji: "😰",
      //       priority: 100
      //     },
      //     {
      //       minValue: 10,
      //       maxValue: 33,
      //       message: "The guinea pig is thirsty.",
      //       emoji: "😟",
      //       priority: 80
      //     }
      //   ]
      // }
    },
    
    // Current active message
    currentMessage: null,
    
    // Message rotation settings
    messageInterval: 2000, // 2 seconds between messages
    messageTimer: null,
    lastMessageTime: 0
  }),

  getters: {
    // Get all active need messages
    activeNeedMessages() {
      const messages = []
      
      // Check hunger
      const hungerStore = useHungerStore()
      if (hungerStore) {
        const hungerConfig = this.needConfigs.hunger
        if (hungerConfig) {
          const hungerValue = hungerStore.currentValue
          const applicableThreshold = hungerConfig.thresholds.find(
            threshold => hungerValue >= threshold.minValue && hungerValue <= threshold.maxValue
          )
          
          if (applicableThreshold) {
            messages.push({
              need: 'hunger',
              message: applicableThreshold.message,
              emoji: applicableThreshold.emoji,
              priority: applicableThreshold.priority,
              value: hungerValue
            })
          }
        }
      }
      
      // Add other needs here as they're implemented
      // const thirstStore = useThirstStore()
      // if (thirstStore) {
      //   // Similar logic for thirst
      // }
      
      return messages
    },

    // Get the highest priority message
    highestPriorityMessage() {
      const messages = this.activeNeedMessages
      if (messages.length === 0) return null
      
      // Sort by priority (highest first)
      messages.sort((a, b) => b.priority - a.priority)
      return messages[0]
    },

    // Check if we should show a need message
    shouldShowNeedMessage() {
      const now = Date.now()
      const timeSinceLastMessage = now - this.lastMessageTime
      
      // Show message if enough time has passed and we have active messages
      return timeSinceLastMessage >= this.messageInterval && this.activeNeedMessages.length > 0
    }
  },

  actions: {
    // Update the current message
    updateCurrentMessage() {
      // Always update if we have active messages and either:
      // 1. No current message, or
      // 2. Enough time has passed since last message
      const hasActiveMessages = this.activeNeedMessages.length > 0
      const shouldShowNewMessage = this.shouldShowNeedMessage
      
      if (hasActiveMessages && (shouldShowNewMessage || !this.currentMessage)) {
        const message = this.highestPriorityMessage
        if (message) {
          this.currentMessage = message
          this.lastMessageTime = Date.now()
        }
      } else if (!hasActiveMessages) {
        // Clear message if no active messages
        this.currentMessage = null
      }
    },

    // Start the message rotation system
    startMessageSystem() {
      if (!this.messageTimer) {
        this.messageTimer = setInterval(() => {
          this.updateCurrentMessage()
        }, 1000) // Check every second
      }
    },

    // Stop the message rotation system
    stopMessageSystem() {
      if (this.messageTimer) {
        clearInterval(this.messageTimer)
        this.messageTimer = null
      }
    },

    // Add a new need configuration
    addNeedConfig(needName, config) {
      this.needConfigs[needName] = config
    },

    // Update threshold for a specific need
    updateNeedThreshold(needName, thresholdIndex, newThreshold) {
      if (this.needConfigs[needName] && this.needConfigs[needName].thresholds[thresholdIndex]) {
        this.needConfigs[needName].thresholds[thresholdIndex] = newThreshold
      }
    },

    // Add a new threshold for a need
    addNeedThreshold(needName, threshold) {
      if (!this.needConfigs[needName]) {
        this.needConfigs[needName] = { thresholds: [] }
      }
      this.needConfigs[needName].thresholds.push(threshold)
      
      // Sort thresholds by minValue
      this.needConfigs[needName].thresholds.sort((a, b) => a.minValue - b.minValue)
    },

    // Remove a threshold for a need
    removeNeedThreshold(needName, thresholdIndex) {
      if (this.needConfigs[needName] && this.needConfigs[needName].thresholds[thresholdIndex]) {
        this.needConfigs[needName].thresholds.splice(thresholdIndex, 1)
      }
    },

    // Get all configurations
    getAllConfigs() {
      return this.needConfigs
    },

    // Reset to default configurations
    resetToDefaults() {
      this.needConfigs = {
        hunger: {
          thresholds: [
            {
              minValue: 0,
              maxValue: 10,
              message: "The guinea pig is starving!",
              emoji: "😰",
              priority: 100
            },
            {
              minValue: 10,
              maxValue: 33,
              message: "The guinea pig is very hungry.",
              emoji: "😟",
              priority: 80
            },
            {
              minValue: 33,
              maxValue: 50,
              message: "The guinea pig is hungry.",
              emoji: "😐",
              priority: 60
            }
          ]
        }
      }
    }
  },

  persist: true
}) 