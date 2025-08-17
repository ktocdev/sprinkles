import { defineStore } from 'pinia'

export const useDebugStore = defineStore('debug', {
  state: () => ({
    // Console logging flags
    storeLogging: true,     // Controls all store console messages (DEBUG_STORES equivalent)
    
    // Individual logging categories (for future expansion)
    autonomyLogging: true,  // Autonomy system messages
    needsLogging: true,     // Needs system messages
    movementLogging: true,  // Movement and pathfinding messages
    fulfillmentLogging: true // Need fulfillment messages
  }),

  getters: {
    // Main flag that controls all store logging
    DEBUG_STORES() {
      return this.storeLogging
    },
    
    // Individual category getters
    shouldLogAutonomy() {
      return this.storeLogging && this.autonomyLogging
    },
    
    shouldLogNeeds() {
      return this.storeLogging && this.needsLogging
    },
    
    shouldLogMovement() {
      return this.storeLogging && this.movementLogging
    },
    
    shouldLogFulfillment() {
      return this.storeLogging && this.fulfillmentLogging
    }
  },

  actions: {
    // Toggle main store logging
    toggleStoreLogging() {
      this.storeLogging = !this.storeLogging
      console.log(`🐛 [DEBUG] Store logging ${this.storeLogging ? 'ENABLED' : 'DISABLED'}`)
    },
    
    // Enable all logging
    enableAllLogging() {
      this.storeLogging = true
      this.autonomyLogging = true
      this.needsLogging = true
      this.movementLogging = true
      this.fulfillmentLogging = true
      console.log('🐛 [DEBUG] All logging ENABLED')
    },
    
    // Disable all logging
    disableAllLogging() {
      this.storeLogging = false
      console.log('🐛 [DEBUG] All logging DISABLED')
    },
    
    // Toggle individual categories
    toggleAutonomyLogging() {
      this.autonomyLogging = !this.autonomyLogging
      console.log(`🐛 [DEBUG] Autonomy logging ${this.autonomyLogging ? 'ENABLED' : 'DISABLED'}`)
    },
    
    toggleNeedsLogging() {
      this.needsLogging = !this.needsLogging
      console.log(`🐛 [DEBUG] Needs logging ${this.needsLogging ? 'ENABLED' : 'DISABLED'}`)
    },
    
    toggleMovementLogging() {
      this.movementLogging = !this.movementLogging
      console.log(`🐛 [DEBUG] Movement logging ${this.movementLogging ? 'ENABLED' : 'DISABLED'}`)
    },
    
    toggleFulfillmentLogging() {
      this.fulfillmentLogging = !this.fulfillmentLogging
      console.log(`🐛 [DEBUG] Fulfillment logging ${this.fulfillmentLogging ? 'ENABLED' : 'DISABLED'}`)
    }
  },

  persist: true
})