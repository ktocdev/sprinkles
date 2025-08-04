import { defineStore } from 'pinia'

export const useNeedStoreTemplate = defineStore('needTemplate', {
  state: () => ({
    currentValue: 100,
    degradationRate: 0.033, // Points per second (2 points per minute)
    maxValue: 100,
    minValue: 0,
    urgency: 0, // Will be calculated by needs queue
    fulfillmentMethods: [
      {
        name: 'method1',
        improvement: 25,
        itemType: 'category',
        priority: 1
      },
      {
        name: 'method2',
        improvement: 20,
        itemType: 'category',
        priority: 2
      }
    ]
  }),

  getters: {
    isUrgent() {
      return this.currentValue <= 20
    },
    
    isCritical() {
      return this.currentValue <= 10
    },
    
    percentage() {
      return (this.currentValue / this.maxValue) * 100
    },
    
    canFulfill() {
      return this.currentValue < this.maxValue
    }
  },

  actions: {
    degrade(amount = null) {
      const degradeAmount = amount || this.degradationRate
      this.currentValue = Math.max(this.minValue, this.currentValue - degradeAmount)
    },

    fulfill(methodName) {
      const method = this.fulfillmentMethods.find(m => m.name === methodName)
      if (!method) {
        return { success: false, message: 'Invalid fulfillment method' }
      }

      if (this.currentValue >= this.maxValue) {
        return { success: false, message: 'Need is already satisfied' }
      }

      const oldValue = this.currentValue
      this.currentValue = Math.min(this.maxValue, this.currentValue + method.improvement)
      const improvement = this.currentValue - oldValue

      return {
        success: true,
        message: `Need improved by ${improvement} points`,
        improvement,
        method: methodName
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
      const sortedMethods = [...this.fulfillmentMethods].sort((a, b) => a.priority - b.priority)
      return sortedMethods[0]
    },

    // Helper methods for setting degradation rates in different time units
    setDegradationPerSecond(rate) {
      this.degradationRate = rate
    },

    setDegradationPerMinute(rate) {
      this.degradationRate = rate / 60
    },

    setDegradationPerHour(rate) {
      this.degradationRate = rate / 3600
    },

    // Get degradation rate in different time units
    getDegradationPerSecond() {
      return this.degradationRate
    },

    getDegradationPerMinute() {
      return this.degradationRate * 60
    },

    getDegradationPerHour() {
      return this.degradationRate * 3600
    }
  },

  persist: true
})

/*
EXAMPLE USAGE:

// Create a new need store (e.g., thirst.js)
export const useThirstStore = defineStore('thirst', {
  state: () => ({
    currentValue: 100,
    degradationRate: 0.05, // 3 points per minute
    maxValue: 100,
    minValue: 0,
    urgency: 0,
    fulfillmentMethods: [
      {
        name: 'water_bottle',
        improvement: 30,
        itemType: 'drink',
        priority: 1
      },
      {
        name: 'fresh_water',
        improvement: 25,
        itemType: 'drink',
        priority: 2
      }
    ]
  }),
  // ... rest of the store implementation
})

DEGRADATION RATE EXAMPLES:
- Very slow: 0.01 points/sec (0.6 points/min)
- Slow: 0.02 points/sec (1.2 points/min)  
- Medium: 0.033 points/sec (2 points/min)
- Fast: 0.05 points/sec (3 points/min)
- Very fast: 0.1 points/sec (6 points/min)
*/ 