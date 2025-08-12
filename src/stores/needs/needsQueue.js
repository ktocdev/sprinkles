import { defineStore } from 'pinia'
import { useHungerStore } from './hunger.js'
import { useCageStore } from '../cage.js'
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
    updateTimer: null // Timer for continuous updates
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
          console.warn(`Store ${storeName} not found for need ${needName}`)
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

      // Check if game is paused - don't degrade needs when paused
      const cageStore = useCageStore()
      if (cageStore.paused) {
        this.lastUpdate = now
        return // Skip degradation when game is paused
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
          
          // Check for status changes and show reactions
          // But only if the store hasn't recently been manually fulfilled and game isn't paused
          const cageStore = useCageStore()
          if (!cageStore.paused) {
            // Check for improvements first
            let improvementReaction = null
            if (store.checkForStatusImprovement) {
              improvementReaction = store.checkForStatusImprovement()
              if (improvementReaction && !store.recentlyFulfilled) {
                this.showNeedReaction(improvementReaction)
              }
            }
            
            // Check for degradations (only if no improvement reaction was shown)
            if (store.checkForStatusDegradation && !store.recentlyFulfilled && !improvementReaction) {
              const degradationReaction = store.checkForStatusDegradation()
              if (degradationReaction) {
                this.showNeedReaction(degradationReaction)
              }
            }
          } else {
            // When paused, still check status but don't show reactions
            if (store.checkForStatusImprovement) {
              store.checkForStatusImprovement()
            }
            if (store.checkForStatusDegradation) {
              store.checkForStatusDegradation()
            }
          }
          
          // Update previous status after both checks are done
          if (store.updatePreviousStatus) {
            store.updatePreviousStatus()
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
      
      // Initialize previous status for all need stores
      for (const [needName, storeName] of Object.entries(this.needs)) {
        const store = this.getNeedStore(storeName)
        if (store && store.initializePreviousStatus) {
          store.initializePreviousStatus()
        }
      }
      
      this.updateQueue()
      
      // Start the timer for continuous updates
      this.updateTimer = setInterval(() => {
        if (this.isActive) {
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
    },

    // Show a guinea pig reaction in the StatusMarquee with delay
    showNeedReaction(reaction) {
      try {
        const statusStore = useStatusStore()
        
        if (reaction && reaction.message && reaction.emoji) {
          console.log(`🎭 REACTION: Planning to show reaction: "${reaction.message}" ${reaction.emoji} (need: ${reaction.needType})`)
          
          // Extend the cooldown immediately to prevent messages in the gap
          const now = Date.now()
          const totalDuration = 1000 + 800 + 50 // delay + reaction duration + small buffer
          statusStore.lastMessageTime = now + totalDuration
          console.log(`⏰ DELAY: Extended cooldown by ${totalDuration}ms to prevent message conflicts`)
          
          // Delay the reaction to show after any other messages
          console.log(`⏰ DELAY: Delaying reaction by 1000ms`)
          setTimeout(() => {
            console.log(`🎭 REACTION: Showing delayed reaction: "${reaction.message}" ${reaction.emoji}`)
            statusStore.showTemporaryMessage(reaction.message, reaction.emoji, 800)
          }, 1000)
        }
      } catch (error) {
        console.warn('Could not show need reaction:', error)
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