import { defineStore } from 'pinia'
import { useCageStore } from './cage.js'
import { useStatisticsStore } from './statistics.js'
import { useNeedsQueueStore } from './needs/needsQueue.js'
import { MESSAGE_DURATIONS } from './needs/messageTimingConfig.js'

export const usePoopStore = defineStore('poop', {
  state: () => ({
    poop: [], // array of { x, y, timestamp }
    poopTimer: null,
    isEnabled: true, // Whether the poop system is enabled
    shouldDropPoop: false,
    minPoopInterval: 10000, // Minimum interval in milliseconds
    maxPoopInterval: 20000, // Maximum interval in milliseconds
    maxPoopPercentage: 0.3, // Maximum 30% of available cells can have poop
    hygieneImpact: 5, // Default hygiene impact when stepping on poop
    totalCells: 0, // Total cells in the grid
    occupiedCells: 0 // Cells occupied by items, guinea pig, water, etc.
  }),

  getters: {
    poopCount: (state) => state.poop.length,
    
    isPoopAtPosition: (state) => (x, y) => {
      return state.poop.some(p => p.x === x && p.y === y)
    },
    
    getPoopAtPosition: (state) => (x, y) => {
      return state.poop.find(p => p.x === x && p.y === y)
    },
    
    freshPoops: (state) => {
      const now = Date.now()
      return state.poop.filter(p => (now - p.timestamp) < 2000) // Poops less than 2 seconds old
    },
    
    oldPoops: (state) => {
      const now = Date.now()
      return state.poop.filter(p => (now - p.timestamp) >= 2000) // Poops 2 seconds or older
    },
    
    // Calculate maximum poop count based on available grid space
    maxPoopCount: (state) => {
      // This will be calculated dynamically based on cage size and occupied cells
      return Math.floor(state.availableCells * state.maxPoopPercentage)
    },
    
    // Calculate available cells (total cells minus occupied ones)
    availableCells: (state) => {
      // This will be set by the cage store when calculating grid
      return state.totalCells - state.occupiedCells
    },
    
    // Calculate poop density percentage
    poopDensity: (state) => {
      if (state.availableCells === 0) return 0
      return (state.poop.length / state.availableCells) * 100
    }
  },

  actions: {
    // Add poop at a specific position
    addPoop(x, y) {
      // Don't add poop if we've reached the maximum
      if (this.poopCount >= this.maxPoopCount) {
        return false
      }
      
      // Don't add poop if there's already poop at this position
      if (this.isPoopAtPosition(x, y)) {
        return false
      }
      
      const poop = {
        x,
        y,
        timestamp: Date.now()
      }
      
      this.poop.push(poop)
      
      // Guinea pig store now handles poop messages
      
      // Track poop creation in statistics
      const statisticsStore = useStatisticsStore()
      statisticsStore.trackPoopCreation()
      
      return true
    },
    
    // Remove poop from a specific position
    removePoop(x, y) {
      const initialCount = this.poop.length
      this.poop = this.poop.filter(p => !(p.x === x && p.y === y))
      const wasRemoved = this.poop.length < initialCount
      
      // Track individual poop cleaning in statistics
      if (wasRemoved) {
        const statisticsStore = useStatisticsStore()
        statisticsStore.trackPoopCleaning(false, 1) // individual cleaning
      }
      
      return wasRemoved
    },
    
    // Remove all poop (clean cage)
    cleanAllPoop() {
      const removedCount = this.poop.length
      this.poop = []
      
      // Track bulk poop cleaning in statistics
      if (removedCount > 0) {
        const statisticsStore = useStatisticsStore()
        statisticsStore.trackPoopCleaning(true, removedCount) // bulk cleaning
      }
      
      return removedCount
    },
    
    // Remove old poop (older than specified age in milliseconds)
    removeOldPoop(ageMs = 30000) { // Default 30 seconds
      const now = Date.now()
      const initialCount = this.poop.length
      this.poop = this.poop.filter(p => (now - p.timestamp) < ageMs)
      return initialCount - this.poop.length
    },
    
    // Start the poop timer
    startPoopTimer() {
      if (this.isEnabled) {
        this.resetPoopTimer()
      }
    },
    
    // Reset the poop timer
    resetPoopTimer() {
      this.shouldDropPoop = false
      if (this.poopTimer) {
        clearTimeout(this.poopTimer)
      }
      
      // Randomize the interval within min/max range
      const randomInterval = this.minPoopInterval + (Math.random() * (this.maxPoopInterval - this.minPoopInterval))
      
      this.poopTimer = setTimeout(() => {
        // Check if game is paused before setting shouldDropPoop
        const cageStore = useCageStore()
        if (!cageStore.paused) {
          this.shouldDropPoop = true
        } else {
          // If paused, reset the timer to try again later
          this.resetPoopTimer()
        }
      }, randomInterval)
    },
    
    // Stop the poop timer
    stopPoopTimer() {
      this.shouldDropPoop = false
      if (this.poopTimer) {
        clearTimeout(this.poopTimer)
        this.poopTimer = null
      }
    },

    // Enable the poop system
    enablePoopSystem() {
      this.isEnabled = true
      this.startPoopTimer()
    },

    // Disable the poop system
    disablePoopSystem() {
      this.isEnabled = false
      this.stopPoopTimer()
    },
    
    // Handle guinea pig interaction with poop
    interactWithPoop(x, y) {
      const poop = this.getPoopAtPosition(x, y)
      
      if (!poop) {
        return {
          success: false,
          message: 'No poop found at this position',
          hygieneImpact: 0
        }
      }
      
      const now = Date.now()
      const poopAge = now - poop.timestamp
      const isFreshPoop = poopAge < 3000 // 3 seconds
      
      if (isFreshPoop) {
        // Don't show message for fresh poop - already shown when created
        return {
          success: true,
          message: 'Fresh poop - no hygiene penalty',
          hygieneImpact: 0,
          poopAge: poopAge
        }
      }
      
      // Create message chain for stepping on old poop (like hunger fulfillment)
      const needsQueueStore = useNeedsQueueStore()
      const messageChain = [
        {
          text: 'Stepped on poop - hygiene decreased',
          emoji: '💩',
          duration: MESSAGE_DURATIONS.FULFILLMENT,
          type: 'hygiene_impact'
        },
        {
          text: 'Guinea pig seems unbothered',
          emoji: '🐹',
          duration: MESSAGE_DURATIONS.REACTION,
          type: 'reaction'
        }
      ]
      
      // Add the complete chain as a single high-priority unit
      needsQueueStore.addMessageChain(messageChain, 1, 'hygiene')
      
      console.log(`💩 [POOP] STEPPED: Guinea pig stepped on old poop, hygiene impact: ${this.hygieneImpact}`)
      
      return {
        success: true,
        message: 'Stepped on poop - hygiene decreased',
        hygieneImpact: this.hygieneImpact,
        poopAge: poopAge
      }
    },
    
    // Set poop intervals (for adjusting frequency)
    setPoopIntervals(minMs, maxMs) {
      this.minPoopInterval = Math.max(1000, minMs) // Minimum 1 second
      this.maxPoopInterval = Math.max(this.minPoopInterval, maxMs) // Max must be >= min
      
      // Restart timer with new intervals if currently enabled
      if (this.isEnabled && this.poopTimer) {
        this.resetPoopTimer()
      }
    },
    
    // Set maximum poop percentage
    setMaxPoopPercentage(percentage) {
      this.maxPoopPercentage = Math.max(0.1, Math.min(1.0, percentage)) // Between 10% and 100%
      
      // Remove excess poop if necessary
      if (this.poopCount > this.maxPoopCount) {
        this.poop = this.poop.slice(0, this.maxPoopCount)
      }
    },
    
    // Update grid information
    updateGridInfo(totalCells, occupiedCells) {
      this.totalCells = totalCells
      this.occupiedCells = occupiedCells
      
      // Remove excess poop if necessary after grid update
      if (this.poopCount > this.maxPoopCount) {
        this.poop = this.poop.slice(0, this.maxPoopCount)
      }
    },
    
    // Get poop statistics
    getPoopStats() {
      const now = Date.now()
      const totalPoops = this.poopCount
      const freshPoops = this.freshPoops.length
      const oldPoops = this.oldPoops.length
      
      return {
        total: totalPoops,
        fresh: freshPoops,
        old: oldPoops,
        maxAllowed: this.maxPoopCount,
        maxPercentage: this.maxPoopPercentage * 100,
        currentDensity: this.poopDensity,
        availableCells: this.availableCells,
        totalCells: this.totalCells,
        occupiedCells: this.occupiedCells,
        averageAge: totalPoops > 0 ? 
          this.poop.reduce((sum, p) => sum + (now - p.timestamp), 0) / totalPoops : 0
      }
    },
    
    // Reset the poop store
    reset() {
      this.poop = []
      this.shouldDropPoop = false
      this.stopPoopTimer()
      this.totalCells = 0
      this.occupiedCells = 0
    }
  },
  
  persist: true
}) 