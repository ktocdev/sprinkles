import { defineStore } from 'pinia'
import { useHungerStore } from './hunger.js'
import { useStatusStore } from '../status.js'

export const useNeedsQueueStore = defineStore('needsQueue', {
  state: () => ({
    needs: {
      hunger: 'hunger',
      thirst: 'thirst',
      sleep: 'sleep',
      chew: 'chew',
      nails: 'nails',
      shelter: 'shelter',
      hygiene: 'hygiene',
      enrichment: 'enrichment',
      love: 'love'
    },
    queue: [], // Ordered list of needs by urgency
    lastUpdate: Date.now(),
    updateInterval: 1000, // 1 second in milliseconds
    isActive: true,
    updateTimer: null, // Timer for continuous updates
    timerPaused: false // Track if timer is paused
  }),

  getters: {
    urgentNeeds() {
      return this.queue.filter(need => need.urgency > 50)
    },

    criticalNeeds() {
      return this.queue.filter(need => need.urgency > 80)
    },

    nextNeedToFulfill() {
      return this.queue[0] || null
    },

    allNeedsStatus() {
      const status = {}
      for (const [needName, storeName] of Object.entries(this.needs)) {
        try {
          const store = this.getNeedStore(storeName)
          if (store) {
            status[needName] = {
              currentValue: store.currentValue,
              percentage: store.percentage,
              urgency: store.urgency,
              isUrgent: store.isUrgent,
              isCritical: store.isCritical
            }
          }
        } catch (error) {
          console.warn(`🔍 [NEEDSQUEUE] WARN: Store ${storeName} not found for need ${needName}`)
        }
      }
      return status
    },

    // Calculate overall wellness based on average of all implemented needs
    overallWellness() {
      const validNeeds = []
      
      for (const [needName, storeName] of Object.entries(this.needs)) {
        const store = this.getNeedStore(storeName)
        if (store && store.currentValue !== undefined) {
          validNeeds.push(store.currentValue)
        }
      }
      
      if (validNeeds.length === 0) return 50 // Default fallback
      
      const average = validNeeds.reduce((sum, value) => sum + value, 0) / validNeeds.length
      return Math.round(average)
    },

    // Get wellness message based on overall wellness score
    wellnessMessage() {
      const wellness = this.overallWellness
      const messages = {
        excellent: [
          'Guinea pig is excellent!',
          'Thriving guinea pig!',
          'Perfect health!',
          'Living the best life!',
          'Absolutely fantastic!'
        ],
        content: [
          'Guinea pig is content',
          'Happy and healthy',
          'Doing quite well',
          'Comfortable guinea pig',
          'All good here!'
        ],
        okay: [
          'Guinea pig is okay',
          'Doing alright',
          'Could be better',
          'Managing well enough',
          'Getting by fine'
        ],
        needsHelp: [
          'Guinea pig could be better',
          'Needs some attention',
          'Could use some care',
          'Not feeling great',
          'Needs improvement'
        ],
        needsHelp2: [
          'Guinea pig needs help',
          'Requires immediate attention',
          'Not doing well',
          'Needs serious care',
          'Poor condition'
        ]
      }

      let messageArray
      if (wellness >= 90) {
        messageArray = messages.excellent
      } else if (wellness >= 80) {
        messageArray = messages.content
      } else if (wellness >= 60) {
        messageArray = messages.okay
      } else if (wellness >= 50) {
        messageArray = messages.needsHelp
      } else {
        messageArray = messages.needsHelp2
      }

      return messageArray[Math.floor(Math.random() * messageArray.length)]
    }
  },

  actions: {
    getNeedStore(storeName) {
      // Dynamically import and return the store
      switch (storeName) {
        case 'hunger':
          return useHungerStore()
        // Add other need stores here as they're created
        // case 'thirst':
        //   return useThirstStore()
        // case 'shelter':
        //   return useShelterStore()
        // etc.
        default:
          return null
      }
    },

    updateAllNeeds() {
      const now = Date.now()
      const timeDiff = now - this.lastUpdate
      
      if (timeDiff < this.updateInterval) {
        return // Don't update too frequently
      }


      // Degrade all needs
      for (const [needName, storeName] of Object.entries(this.needs)) {
        const store = this.getNeedStore(storeName)
        if (store && store.degrade) {
          // Calculate degradation based on time passed (in seconds)
          const degradationAmount = (store.degradationRate / 1000) * timeDiff
          store.degrade(degradationAmount)
        }
      }

      this.lastUpdate = now
      this.updateQueue()
    },

    updateQueue() {
      const queue = []

      // Calculate urgency for each need and check for reactions
      for (const [needName, storeName] of Object.entries(this.needs)) {
        const store = this.getNeedStore(storeName)
        if (store) {
          // Calculate urgency based on current value and degradation rate
          const urgency = this.calculateUrgency(store)
          store.setUrgency(urgency)
          
          // Let the store handle its own status change reactions
          if (store.handleStatusChangeReactions) {
            store.handleStatusChangeReactions()
          }
          
          queue.push({
            name: needName,
            storeName: storeName,
            urgency: urgency,
            currentValue: store.currentValue,
            percentage: store.percentage
          })
        }
      }

      // Sort by urgency (highest first)
      queue.sort((a, b) => b.urgency - a.urgency)
      this.queue = queue
    },

    calculateUrgency(store) {
      const percentage = store.percentage
      const degradationRate = store.degradationRate
      
      // Base urgency on how low the need is
      let urgency = 100 - percentage
      
      // Boost urgency for critical levels
      if (store.isCritical) {
        urgency += 50
      } else if (store.isUrgent) {
        urgency += 25
      }
      
      // Consider degradation rate - faster degrading needs get higher urgency
      urgency += (degradationRate / 5) * 10
      
      return Math.min(100, Math.max(0, urgency))
    },

    fulfillNeed(needName, methodName) {
      const storeName = this.needs[needName]
      if (!storeName) {
        return { success: false, message: 'Need not found' }
      }

      const store = this.getNeedStore(storeName)
      if (!store) {
        return { success: false, message: 'Need store not found' }
      }

      const result = store.fulfill(methodName)
      
      if (result.success) {
        // Update the queue after fulfillment
        this.updateQueue()
      }

      return result
    },

    getFulfillmentOptions(needName) {
      const storeName = this.needs[needName]
      if (!storeName) {
        return []
      }

      const store = this.getNeedStore(storeName)
      if (!store) {
        return []
      }

      return store.fulfillmentMethods || []
    },

    resetAllNeeds() {
      for (const [needName, storeName] of Object.entries(this.needs)) {
        const store = this.getNeedStore(storeName)
        if (store && store.reset) {
          store.reset()
        }
      }
      this.updateQueue()
    },

    startNeedsSystem() {
      this.isActive = true
      this.lastUpdate = Date.now()
      
      // Clear any stale timer ID from persisted state
      if (this.updateTimer) {
        clearInterval(this.updateTimer)
        this.updateTimer = null
      }
      
      // Initialize all need stores
      for (const [needName, storeName] of Object.entries(this.needs)) {
        const store = this.getNeedStore(storeName)
        if (store) {
          // Call initialize if available (includes validation and setup)
          if (store.initialize) {
            store.initialize()
          } else if (store.initializePreviousStatus) {
            // Fallback for stores without initialize method
            store.initializePreviousStatus()
          }
        }
      }
      
      this.updateQueue()
      
      // Start the timer for continuous updates
      this.updateTimer = setInterval(() => {
        if (this.isActive && !this.timerPaused) {
          this.updateAllNeeds()
        }
      }, 1000) // Update every second
    },

    stopNeedsSystem() {
      this.isActive = false
      
      // Clear the timer
      if (this.updateTimer) {
        clearInterval(this.updateTimer)
        this.updateTimer = null
      }
      this.timerPaused = false
    },

    // Pause the timer without clearing it
    pauseNeedsSystem() {
      console.log('⏸️ [NEEDSQUEUE] PAUSE: Pausing needs system updates')
      this.timerPaused = true
    },

    // Resume the paused timer
    resumeNeedsSystem() {
      console.log('▶️ [NEEDSQUEUE] RESUME: Resuming needs system updates')
      this.timerPaused = false
      
      // Do immediate update when resuming
      if (this.isActive && this.updateTimer) {
        this.updateAllNeeds()
      }
    },

    // Get the best action for the guinea pig to take
    getBestAction() {
      if (this.queue.length === 0) {
        return { action: 'idle', reason: 'All needs satisfied' }
      }

      const topNeed = this.queue[0]
      const store = this.getNeedStore(topNeed.storeName)
      
      if (!store) {
        return { action: 'idle', reason: 'Store not found' }
      }

      const bestMethod = store.getBestFulfillmentMethod()
      
      return {
        action: 'fulfill_need',
        need: topNeed.name,
        method: bestMethod?.name || 'unknown',
        urgency: topNeed.urgency,
        reason: `Need to fulfill ${topNeed.name} (urgency: ${topNeed.urgency})`
      }
    }
  },

  persist: true
}) 