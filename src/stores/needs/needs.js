import { defineStore } from 'pinia'
import { useNeedsQueueStore } from './needsQueue.js'
import { useCageStore } from '../cage.js'

function clampValue(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value))
}

export const useNeedsStore = defineStore('needs', {
  state: () => ({
    // Legacy need values - kept for backward compatibility
    needs: {
      hunger: 100,
      thirst: 100,
      shelter: 100,
      chew: 100,
      enrichment: 100,
      love: 100,
      nails: 100,
      hygiene: 100,
    },
    // System state
    isActive: true,
    lastUpdate: Date.now(),
    updateInterval: 1000, // 1 second in milliseconds
    updateTimer: null
  }),
  
  getters: {
    // Get the needs queue store for managing individual need stores
    needsQueue() {
      return useNeedsQueueStore()
    },
    
    // Get all need statuses from the queue system
    allNeedsStatus() {
      return this.needsQueue.allNeedsStatus
    }
  },
  
  actions: {
    // Legacy methods for backward compatibility
    setNeed(need, value) {
      if (need in this.needs) {
        this.needs[need] = value
      }
    },
    
    adjustNeed(need, delta) {
      if (need in this.needs) {
        this.needs[need] = clampValue(this.needs[need] + delta)
      }
    },
    
    resetNeeds() {
      for (const need in this.needs) {
        this.needs[need] = 100
      }
      // Also reset the queue system
      this.needsQueue.resetAllNeeds()
    },
    
    // System management methods
    startNeedsSystem() {
      this.isActive = true
      this.lastUpdate = Date.now()
      this.needsQueue.startNeedsSystem()
    },
    
    stopNeedsSystem() {
      this.isActive = false
      this.needsQueue.stopNeedsSystem()
    },
    
    // Update all needs (called by the queue system)
    updateAllNeeds() {
      if (!this.isActive) return
      
      const now = Date.now()
      const timeDiff = now - this.lastUpdate
      
      if (timeDiff < this.updateInterval) {
        return // Don't update too frequently
      }
      
      // Check if game is paused - don't update needs when paused
      const cageStore = useCageStore()
      if (cageStore.paused) {
        this.lastUpdate = now
        return // Skip updates when game is paused
      }
      
      this.needsQueue.updateAllNeeds()
      this.lastUpdate = now
    },
    
    // Get the best action for the guinea pig
    getBestAction() {
      return this.needsQueue.getBestAction()
    },
    
    // Fulfill a specific need
    fulfillNeed(needName, methodName) {
      return this.needsQueue.fulfillNeed(needName, methodName)
    }
  },
  
  persist: true
}) 