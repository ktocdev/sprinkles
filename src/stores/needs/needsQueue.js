import { defineStore } from 'pinia'
import { useHungerStore } from './hunger.js'
import { useUserStore } from '../user.js'
import { useCageStore } from '../cage.js'
import { usePoopStore } from '../poop.js'

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
    timerPaused: false, // Track if timer is paused
    
    // Message Queue System
    messageQueue: [], // Array of message objects waiting to be displayed
    currentMessage: null, // Currently displayed message
    messageTimer: null, // Timer for current message
    isProcessingQueue: false, // Flag to prevent concurrent processing
    messageIdCounter: 0 // Simple counter for unique message IDs
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

      // Check if game is paused at higher level (welcome panel or manual pause)
      const userStore = useUserStore()
      const cageStore = useCageStore()
      const isGamePaused = !userStore.name || cageStore.paused
      
      if (isGamePaused) {
        // Don't degrade needs when game is paused, but still update queue for display
        this.lastUpdate = now
        this.updateQueue()
        return
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
          
          // Process any pending reactions from this store
          this.processPendingReactions(store, needName)
          
          // Check if we should show urgency messages
          this.checkUrgencyMessage(store, needName)
          
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
      
      // Process pending poop messages
      this.processPoopMessages()
      
      // Occasionally show wellness messages when there's no urgency
      this.checkWellnessMessage()
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
      
      // Clear all messages when stopping
      this.clearAllMessages()
    },

    // Pause the timer without clearing it
    pauseNeedsSystem() {
      this.timerPaused = true
    },

    // Resume the paused timer
    resumeNeedsSystem() {
      this.timerPaused = false
      
      // Reset lastUpdate to prevent degradation from paused time
      this.lastUpdate = Date.now()
      
      // Just update the queue display without degrading
      if (this.isActive && this.updateTimer) {
        this.updateQueue()
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
    },

    // Message Queue Methods
    
    // Add message to queue with priority-based insertion
    addMessage(text, emoji, duration = 2000, priority = 5, type = 'default', needType = null) {
      if (!text) return null
      
      // Check if game is paused - don't add messages when paused
      const userStore = useUserStore()
      const cageStore = useCageStore()
      const isGamePaused = !userStore.name || cageStore.paused
      
      if (isGamePaused) {
        return null
      }
      
      const messageId = `msg_${++this.messageIdCounter}_${Date.now()}`
      const message = {
        id: messageId,
        text,
        emoji,
        duration,
        priority,
        type,
        needType,
        timestamp: Date.now()
      }
      
      // Insert message based on priority (lower number = higher priority)
      let insertIndex = this.messageQueue.length
      for (let i = 0; i < this.messageQueue.length; i++) {
        if (this.messageQueue[i].priority > priority) {
          insertIndex = i
          break
        }
      }
      
      this.messageQueue.splice(insertIndex, 0, message)
      console.log(`📋 [NEEDSQUEUE] MESSAGE: Added "${text}" (${type}, priority ${priority}) at index ${insertIndex}`)
      
      // Log current queue status
      this.logQueueStatus()
      
      // Start processing if not already active
      if (!this.isProcessingQueue && !this.currentMessage) {
        this.processNextMessage()
      }
      
      return messageId
    },

    // Insert high priority message at the front of queue
    insertHighPriorityMessage(text, emoji, duration = 2000, type = 'urgent') {
      return this.addMessage(text, emoji, duration, 1, type)
    },

    // Process the next message in the queue
    processNextMessage() {
      if (this.isProcessingQueue || this.messageQueue.length === 0) {
        return
      }
      
      // Get next message
      const nextMessage = this.messageQueue.shift()
      if (!nextMessage) return
      
      this.isProcessingQueue = true
      this.currentMessage = nextMessage
      
      console.log(`📢 [NEEDSQUEUE] MESSAGE: Displaying "${nextMessage.text}" for ${nextMessage.duration}ms`)
      
      // Log what's coming up next
      this.logQueueStatus()
      
      // Clear any existing timer
      if (this.messageTimer) {
        clearTimeout(this.messageTimer)
      }
      
      // Set timer to clear message and process next
      this.messageTimer = setTimeout(() => {
        console.log(`📢 [NEEDSQUEUE] MESSAGE: Finished displaying "${nextMessage.text}"`)
        this.currentMessage = null
        this.isProcessingQueue = false
        
        // Process next message if available
        if (this.messageQueue.length > 0) {
          console.log(`📋 [NEEDSQUEUE] QUEUE: Processing next message in queue...`)
          setTimeout(() => this.processNextMessage(), 100) // Small delay between messages
        } else {
          console.log(`📋 [NEEDSQUEUE] QUEUE: Queue is now empty`)
        }
      }, nextMessage.duration)
    },

    // Clear messages of specific type/need
    clearMessagesOfType(type, needType = null) {
      const initialLength = this.messageQueue.length
      this.messageQueue = this.messageQueue.filter(msg => {
        if (msg.type !== type) return true
        if (needType && msg.needType !== needType) return true
        return false
      })
      
      const removed = initialLength - this.messageQueue.length
      if (removed > 0) {
        console.log(`📋 [NEEDSQUEUE] MESSAGE: Cleared ${removed} messages of type "${type}"${needType ? ` for need "${needType}"` : ''}`)
      }
    },

    // Clear all messages and stop processing
    clearAllMessages() {
      this.messageQueue = []
      this.currentMessage = null
      this.isProcessingQueue = false
      
      if (this.messageTimer) {
        clearTimeout(this.messageTimer)
        this.messageTimer = null
      }
      
      console.log(`📋 [NEEDSQUEUE] MESSAGE: Cleared all messages`)
    },

    // Check if we should show urgency message for a need
    checkUrgencyMessage(store, needName) {
      // Only show urgency messages for urgent/critical needs
      if (!store.isUrgent && !store.isCritical) {
        return
      }
      
      const config = store.messageConfig
      if (!config || !store.urgencyMessages) {
        return
      }
      
      // Determine urgency level and interval
      let urgencyLevel = 'normal'
      let interval = config.intervals.normal
      
      if (store.isCritical) {
        urgencyLevel = 'critical'
        interval = config.intervals.critical
      } else if (store.isUrgent) {
        urgencyLevel = 'urgent'
        interval = config.intervals.urgent
      }
      
      // Check if enough time has passed since last urgency message for this need
      const lastUrgencyKey = `urgency_${needName}`
      const now = Date.now()
      const lastTime = this[`_${lastUrgencyKey}`] || 0
      
      if (now - lastTime < interval) {
        return // Too soon to show another urgency message
      }
      
      // Get available messages
      const messages = store.urgencyMessages[urgencyLevel] || []
      if (messages.length === 0) {
        return
      }
      
      // Pick a random message
      const message = messages[Math.floor(Math.random() * messages.length)]
      const emoji = config.emoji || '⚠️'
      
      // Add urgency message to queue
      this.addMessage(message, emoji, 2000, 3, 'urgency', needName)
      
      // Record when we showed this urgency message
      this[`_${lastUrgencyKey}`] = now
      
      console.log(`📢 [NEEDSQUEUE] URGENCY: Added ${needName} urgency message: "${message}"`)
    },

    // Check if we should show wellness message
    checkWellnessMessage() {
      // Only show wellness messages occasionally and when no urgent needs
      const hasUrgentNeeds = this.queue.some(need => need.urgency > 50)
      if (hasUrgentNeeds) {
        return
      }
      
      // Only show wellness message every 30 seconds
      const now = Date.now()
      const lastWellnessTime = this._lastWellnessMessage || 0
      if (now - lastWellnessTime < 30000) {
        return
      }
      
      // Random chance to show wellness message (20%)
      if (Math.random() > 0.2) {
        return
      }
      
      const wellnessMessage = this.wellnessMessage
      const overallWellness = this.overallWellness
      
      // Choose emoji based on wellness level
      let emoji = '😌' // default content
      if (overallWellness >= 90) {
        emoji = '🌟' // excellent
      } else if (overallWellness >= 80) {
        emoji = '😌' // content
      } else if (overallWellness >= 60) {
        emoji = '🙂' // okay
      } else if (overallWellness >= 50) {
        emoji = '😐' // could be better
      } else {
        emoji = '😟' // needs help
      }
      
      // Add wellness message to queue
      this.addMessage(wellnessMessage, emoji, 3000, 4, 'wellness')
      
      // Record when we showed wellness message
      this._lastWellnessMessage = now
      
      console.log(`📢 [NEEDSQUEUE] WELLNESS: Added wellness message: "${wellnessMessage}" (${overallWellness}%)`)
    },

    // Process pending reactions from a need store
    processPendingReactions(store, needName) {
      if (!store.getPendingReactions) {
        return // Store doesn't have pending reactions system
      }
      
      const pendingReactions = store.getPendingReactions()
      if (!pendingReactions || pendingReactions.length === 0) {
        return
      }
      
      // Check if game is paused - don't process reactions when paused
      const userStore = useUserStore()
      const cageStore = useCageStore()
      const isGamePaused = !userStore.name || cageStore.paused
      
      if (isGamePaused || store.recentlyFulfilled) {
        // Clear pending reactions when paused to avoid stale reactions
        console.log(`🎭 [NEEDSQUEUE] REACTION: Clearing ${pendingReactions.length} pending reactions for ${needName} (game paused)`)
        return
      }
      
      // Process each pending reaction
      pendingReactions.forEach(reaction => {
        console.log(`🎭 [NEEDSQUEUE] REACTION: Processing pending reaction for ${needName}: "${reaction.message}" ${reaction.emoji}`)
        
        // Add reaction with highest priority (1) and type 'reaction'
        this.addMessage(
          reaction.message,
          reaction.emoji,
          1200, // 1.2 second duration
          1, // Highest priority
          'reaction',
          reaction.needType
        )
      })
    },

    // Process pending poop messages
    processPoopMessages() {
      try {
        // Get poop store
        const poopStore = usePoopStore()
        if (!poopStore || !poopStore.getPendingPoopMessages) {
          return
        }
        
        const pendingMessages = poopStore.getPendingPoopMessages()
        if (!pendingMessages || pendingMessages.length === 0) {
          return
        }
        
        // Check if game is paused - don't process messages when paused
        const userStore = useUserStore()
        const cageStore = useCageStore()
        const isGamePaused = !userStore.name || cageStore.paused
        
        if (isGamePaused) {
          console.log(`💩 [NEEDSQUEUE] POOP: Clearing ${pendingMessages.length} pending poop messages (game paused)`)
          return
        }
        
        // Process each pending poop message
        pendingMessages.forEach(msg => {
          console.log(`💩 [NEEDSQUEUE] POOP: Processing pending poop message: "${msg.message}" ${msg.emoji}`)
          
          this.addMessage(
            msg.message,
            msg.emoji,
            msg.duration,
            msg.priority,
            msg.type
          )
        })
      } catch (error) {
        console.warn(`💩 [NEEDSQUEUE] POOP: Could not process poop messages:`, error)
      }
    },

    // Log current queue status to console
    logQueueStatus() {
      if (this.messageQueue.length === 0) {
        console.log(`📋 [NEEDSQUEUE] QUEUE: Empty queue`)
        return
      }
      
      console.log(`📋 [NEEDSQUEUE] QUEUE: ${this.messageQueue.length} messages in queue:`)
      this.messageQueue.slice(0, 5).forEach((msg, index) => {
        const truncatedText = msg.text.length > 30 ? msg.text.substring(0, 30) + '...' : msg.text
        console.log(`  ${index + 1}. [P${msg.priority}] ${msg.type}: "${truncatedText}" ${msg.emoji} (${msg.duration}ms)`)
      })
      
      if (this.messageQueue.length > 5) {
        console.log(`  ... and ${this.messageQueue.length - 5} more messages`)
      }
    },

    // Get message queue status for debugging
    getMessageQueueStatus() {
      return {
        queueLength: this.messageQueue.length,
        currentMessage: this.currentMessage,
        isProcessing: this.isProcessingQueue,
        nextMessage: this.messageQueue[0] || null
      }
    }
  },

  persist: true
}) 