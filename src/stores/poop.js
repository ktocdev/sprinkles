import { defineStore } from 'pinia'
import { useCageStore } from './cage.js'

export const usePoopStore = defineStore('poop', {
  state: () => ({
    poop: [], // array of { x, y, timestamp }
    poopTimer: null,
    shouldDropPoop: false,
    poopInterval: 5000 + Math.random() * 7000, // 5-12 seconds base interval
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
      return true
    },
    
    // Remove poop from a specific position
    removePoop(x, y) {
      const initialCount = this.poop.length
      this.poop = this.poop.filter(p => !(p.x === x && p.y === y))
      return this.poop.length < initialCount
    },
    
    // Remove all poop (clean cage)
    cleanAllPoop() {
      const removedCount = this.poop.length
      this.poop = []
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
      this.resetPoopTimer()
    },
    
    // Reset the poop timer
    resetPoopTimer() {
      this.shouldDropPoop = false
      if (this.poopTimer) {
        clearTimeout(this.poopTimer)
      }
      
      // Randomize the interval slightly
      const randomInterval = this.poopInterval + (Math.random() * 2000 - 1000) // ±1 second variation
      
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
      const isFreshPoop = poopAge < 2000 // 2 seconds
      
      if (isFreshPoop) {
        return {
          success: true,
          message: 'Fresh poop - no hygiene penalty',
          hygieneImpact: 0,
          poopAge: poopAge
        }
      }
      
      return {
        success: true,
        message: 'Stepped on poop - hygiene decreased',
        hygieneImpact: this.hygieneImpact,
        poopAge: poopAge
      }
    },
    
    // Set poop interval (for adjusting frequency)
    setPoopInterval(intervalMs) {
      this.poopInterval = Math.max(1000, intervalMs) // Minimum 1 second
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