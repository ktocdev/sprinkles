import { defineStore } from 'pinia'
import { useHungerStore } from './hunger.js'
import { useWellnessStore } from './wellness.js'
import { useUserStore } from '../user.js'
import { useCageStore } from '../cage.js'
import { useMarketStore } from '../market.js'
import { useGuineaPigStore } from '../guineaPig.js'
import { MESSAGE_DURATIONS, MESSAGE_DELAYS, MESSAGE_PRIORITIES, ensureMinimumDuration } from './messageTimingConfig.js'

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
      love: 'love',
      wellness: 'wellness'
    },
    queue: [], // Ordered list of needs by urgency
    lastUpdate: Date.now(),
    updateInterval: 1000, // 1 second in milliseconds
    isActive: true,
    timerPaused: false, // Track if timer is paused
    
    // Non-persisted timer (set in memory only)
    _updateTimer: null, // Timer for continuous updates (not persisted)
    
    // Message Queue System
    messageQueue: [], // Array of message objects waiting to be displayed
    currentMessage: null, // Currently displayed message
    _messageTimer: null, // Timer for current message (not persisted)
    isProcessingQueue: false, // Flag to prevent concurrent processing
    messageIdCounter: 0, // Simple counter for unique message IDs
    fallbackMessage: null, // Fallback message when queue is empty
    
    // Message timing controls
    lastMessageStartTime: 0, // When current message started displaying
    minimumDisplayTime: 1500, // Minimum time any message must show (1.5 seconds)
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


    // Get current display message (from queue or fallback)
    currentDisplayMessage() {
      if (this.currentMessage) {
        return {
          text: this.currentMessage.text,
          emoji: this.currentMessage.emoji
        }
      }
      
      if (this.fallbackMessage) {
        return {
          text: this.fallbackMessage.text,
          emoji: this.fallbackMessage.emoji
        }
      }
      
      // Default wellness message from wellness store
      const wellnessStore = this.getNeedStore('wellness')
      if (wellnessStore) {
        const wellnessText = wellnessStore.getWellnessMessage()
        const wellnessEmoji = wellnessStore.getWellnessEmoji()
        console.log(`📋 [NEEDSQUEUE] FALLBACK: Using wellness message "${wellnessText}" ${wellnessEmoji}`)
        return {
          text: wellnessText,
          emoji: wellnessEmoji
        }
      }
      
      // Final fallback - use guinea pig store directly
      const guineaPigStore = useGuineaPigStore()
      return {
        text: guineaPigStore.currentMessage,
        emoji: guineaPigStore.currentEmoji
      }
    }
  },

  actions: {
    getNeedStore(storeName) {
      // Dynamically import and return the store
      switch (storeName) {
        case 'hunger':
          return useHungerStore()
        case 'wellness':
          return useWellnessStore()
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
      
      // Poop messages are now handled by guinea pig store
      
      // Process pending guinea pig status messages
      this.processGuineaPigStatusMessages()
      
      // Update fallback message based on guinea pig state
      this.updateFallbackMessage()
      
    },

    calculateUrgency(store) {
      const percentage = store.percentage
      const degradationRate = store.degradationRate
      
      // Special case for wellness - different urgency calculation
      if (store.needType === 'wellness') {
        // For wellness, urgency is based on how far from perfect (100%) it is
        // This ensures wellness gets attention even when doing well
        let urgency = Math.abs(100 - percentage) * 0.8 // Scale factor for visibility
        
        // Add boosts based on status levels
        if (store.isCritical) {
          urgency += 50
        } else if (store.isUrgent) {
          urgency += 25
        } else if (percentage >= 80) {
          // Give good wellness some urgency to show positive messages
          urgency = Math.max(urgency, 20)
        }
        
        return Math.min(100, Math.max(0, urgency))
      }
      
      // Standard urgency calculation for other needs
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
      
      // Clear any stale timer from persisted state or memory
      if (this._updateTimer) {
        clearInterval(this._updateTimer)
        this._updateTimer = null
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
      
      // Initialize guinea pig store
      const guineaPigStore = useGuineaPigStore()
      if (guineaPigStore && guineaPigStore.initialize) {
        guineaPigStore.initialize()
      }
      
      this.updateQueue()
      
      // Start the timer for continuous updates
      this._updateTimer = setInterval(() => {
        if (this.isActive && !this.timerPaused) {
          this.updateAllNeeds()
        }
      }, 1000) // Update every second
    },

    stopNeedsSystem() {
      this.isActive = false
      
      // Clear the timer
      if (this._updateTimer) {
        clearInterval(this._updateTimer)
        this._updateTimer = null
      }
      this.timerPaused = false
      
      // Clear all messages when stopping
      this.clearAllMessages()
      
      // Stop guinea pig store
      const guineaPigStore = useGuineaPigStore()
      if (guineaPigStore && guineaPigStore.stop) {
        guineaPigStore.stop()
      }
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
      if (this.isActive && this._updateTimer) {
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
    addMessage(text, emoji, duration = MESSAGE_DURATIONS.TEMPORARY, priority = 5, type = 'default', needType = null, sequenceId = null) {
      // Ensure minimum duration
      duration = ensureMinimumDuration(duration)
      if (!text) return null
      
      // Check if game is paused - don't add messages when paused
      const userStore = useUserStore()
      const cageStore = useCageStore()
      const isGamePaused = !userStore.name || cageStore.paused
      
      if (isGamePaused) {
        return null
      }
      
      const now = Date.now()
      
      // High priority messages (food, reactions) always get through regardless of timing
      const isHighPriorityMessage = type === 'food' || type === 'reaction' || priority <= 2
      
      // Check minimum display time for current message (unless this is high priority)
      if (!isHighPriorityMessage && this.currentMessage && this.lastMessageStartTime > 0) {
        const timeDisplayed = now - this.lastMessageStartTime
        if (timeDisplayed < this.minimumDisplayTime) {
          console.log(`⏰ [NEEDSQUEUE] TIMING: Skipping "${text}" - current message needs ${this.minimumDisplayTime - timeDisplayed}ms more`)
          return null
        }
      }
      
      // Special handling for ambient messages (movement, sitting, etc.)
      if (type === 'ambient' && priority >= 8) {
        // Check for exact duplicate messages in queue or currently showing
        const isDuplicate = this.messageQueue.some(msg => msg.text === text && msg.type === type) ||
                           (this.currentMessage && this.currentMessage.text === text)
        
        if (isDuplicate) {
          console.log(`🚫 [NEEDSQUEUE] AMBIENT: Skipping duplicate ambient message "${text}"`)
          return null
        }
        
        // For guinea pig movement status, only keep the most recent one
        if (needType === 'movement') {
          this.messageQueue = this.messageQueue.filter(msg => !(msg.type === 'ambient' && msg.needType === 'movement'))
        } else {
          // For other ambient messages, don't add if there are higher priority messages
          const hasHigherPriorityMessages = this.messageQueue.some(msg => msg.priority < 7)
          if (hasHigherPriorityMessages) {
            console.log(`🚫 [NEEDSQUEUE] AMBIENT: Skipping ambient message "${text}" - higher priority messages present`)
            return null
          }
          
          // Remove other non-movement ambient messages to prevent spam
          this.messageQueue = this.messageQueue.filter(msg => !(msg.type === 'ambient' && msg.needType !== 'movement'))
        }
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
        sequenceId,
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
      
      // Start processing if not already active, OR if this is a high priority message that should interrupt
      if (!this.isProcessingQueue && !this.currentMessage) {
        this.processNextMessage()
      } else if (isHighPriorityMessage) {
        // Check if current message is part of the same sequence (don't interrupt sequences)
        const currentSequenceId = this.currentMessage?.sequenceId
        const isSameSequence = sequenceId && currentSequenceId && sequenceId === currentSequenceId
        
        if (!isSameSequence) {
          // High priority messages should interrupt current message and start immediately
          console.log(`🚨 [NEEDSQUEUE] HIGH_PRIORITY: Interrupting for high priority message: "${text}"`)
          
          if (this.isProcessingQueue && this._messageTimer) {
            // Clear current message timer to force immediate processing of high priority message
            clearTimeout(this._messageTimer)
            this._messageTimer = null
            this.currentMessage = null
            this.isProcessingQueue = false
            console.log(`🚨 [NEEDSQUEUE] HIGH_PRIORITY: Cleared current message to make room for: "${text}"`)
          }
          
          // Start processing the high priority message immediately
          this.processNextMessage()
        } else {
          console.log(`📋 [NEEDSQUEUE] SEQUENCE: Not interrupting - same sequence ID: ${sequenceId}`)
          // Don't call processNextMessage for same sequence - let natural flow handle it
        }
      }
      
      return messageId
    },

    // Insert high priority message at the front of queue
    insertHighPriorityMessage(text, emoji, duration = 2000, type = 'urgent') {
      return this.addMessage(text, emoji, duration, 1, type)
    },

    // Add a chain of messages that play in sequence as a single unit
    addMessageChain(messageChain, priority = 5, needType = null) {
      if (!messageChain || !Array.isArray(messageChain) || messageChain.length === 0) {
        console.warn('🚫 [NEEDSQUEUE] CHAIN: Invalid message chain provided')
        return null
      }

      // Calculate total duration of all sub-messages
      const totalDuration = messageChain.reduce((total, msg) => total + (msg.duration || 1000), 0)

      // Create chain message object
      const chainId = `chain_${++this.messageIdCounter}_${Date.now()}`
      const chainMessage = {
        id: chainId,
        type: 'chain',
        priority,
        needType,
        messages: messageChain,
        currentIndex: 0,
        totalDuration,
        timestamp: Date.now()
      }

      // Check if game is paused - don't add messages when paused
      const userStore = useUserStore()
      const cageStore = useCageStore()
      const isGamePaused = !userStore.name || cageStore.paused

      if (isGamePaused) {
        return null
      }

      // Insert chain based on priority
      let insertIndex = this.messageQueue.length
      for (let i = 0; i < this.messageQueue.length; i++) {
        if (this.messageQueue[i].priority > priority) {
          insertIndex = i
          break
        }
      }

      this.messageQueue.splice(insertIndex, 0, chainMessage)
      console.log(`📋 [NEEDSQUEUE] CHAIN: Added chain with ${messageChain.length} messages (priority ${priority}) at index ${insertIndex}`)

      // Log chain details
      messageChain.forEach((msg, index) => {
        console.log(`  ${index + 1}. "${msg.text}" ${msg.emoji} (${msg.duration}ms)`)
      })

      // Start processing if not already active
      if (!this.isProcessingQueue && !this.currentMessage) {
        this.processNextMessage()
      }

      return chainId
    },

    // Process the next message in the queue (handles both regular and chain messages)
    processNextMessage() {
      if (this.messageQueue.length === 0) {
        return
      }
      
      // Get next message
      const nextMessage = this.messageQueue.shift()
      if (!nextMessage) return
      
      // For seamless transitions, only set isProcessingQueue if not already processing
      if (!this.isProcessingQueue) {
        this.isProcessingQueue = true
      }
      
      // Handle chain messages differently
      if (nextMessage.type === 'chain') {
        this.processChainMessage(nextMessage)
      } else {
        this.processRegularMessage(nextMessage)
      }
    },

    // Process a regular (non-chain) message
    processRegularMessage(message) {
      this.currentMessage = message
      this.lastMessageStartTime = Date.now()
      
      console.log(`📢 [NEEDSQUEUE] MESSAGE: Displaying "${message.text}" for ${message.duration}ms`)
      this.logQueueStatus()
      
      // Clear any existing timer
      if (this._messageTimer) {
        clearTimeout(this._messageTimer)
      }
      
      // Set timer to process next message
      this._messageTimer = setTimeout(() => {
        console.log(`📢 [NEEDSQUEUE] MESSAGE: Finished displaying "${message.text}"`)
        this.finishCurrentMessage()
      }, message.duration)
    },

    // Process a chain message (multiple sub-messages in sequence)
    processChainMessage(chainMessage) {
      if (!chainMessage.messages || chainMessage.messages.length === 0) {
        console.warn('🚫 [NEEDSQUEUE] CHAIN: Empty chain message, skipping')
        this.finishCurrentMessage()
        return
      }

      // Reset chain index if needed
      if (!chainMessage.hasOwnProperty('currentIndex')) {
        chainMessage.currentIndex = 0
      }

      this.processChainStep(chainMessage)
    },

    // Process a single step in a message chain
    processChainStep(chainMessage) {
      const currentStep = chainMessage.messages[chainMessage.currentIndex]
      if (!currentStep) {
        console.log(`📢 [NEEDSQUEUE] CHAIN: Chain completed`)
        this.finishCurrentMessage()
        return
      }

      // Create a display message for the current step
      this.currentMessage = {
        ...chainMessage,
        text: currentStep.text,
        emoji: currentStep.emoji,
        duration: currentStep.duration,
        chainStep: chainMessage.currentIndex + 1,
        chainTotal: chainMessage.messages.length
      }
      
      this.lastMessageStartTime = Date.now()
      
      console.log(`📢 [NEEDSQUEUE] CHAIN: Step ${chainMessage.currentIndex + 1}/${chainMessage.messages.length}: "${currentStep.text}" for ${currentStep.duration}ms`)
      this.logQueueStatus()
      
      // Clear any existing timer
      if (this._messageTimer) {
        clearTimeout(this._messageTimer)
      }
      
      // Set timer for this step
      this._messageTimer = setTimeout(() => {
        console.log(`📢 [NEEDSQUEUE] CHAIN: Finished step ${chainMessage.currentIndex + 1}: "${currentStep.text}"`)
        
        // Move to next step in chain
        chainMessage.currentIndex++
        
        if (chainMessage.currentIndex < chainMessage.messages.length) {
          // More steps in chain - process next step immediately
          console.log(`📢 [NEEDSQUEUE] CHAIN: Moving to step ${chainMessage.currentIndex + 1}`)
          this.processChainStep(chainMessage)
        } else {
          // Chain completed - move to next message in queue
          console.log(`📢 [NEEDSQUEUE] CHAIN: All steps completed`)
          this.finishCurrentMessage()
        }
      }, currentStep.duration)
    },

    // Finish the current message and move to next
    finishCurrentMessage() {
      // Process next message immediately if available (seamless transition)
      if (this.messageQueue.length > 0) {
        console.log(`📋 [NEEDSQUEUE] QUEUE: Seamlessly transitioning to next message...`)
        this.processNextMessage() // No delay, immediate transition
      } else {
        // Only clear current message when no next message is available
        this.currentMessage = null
        this.isProcessingQueue = false
        console.log(`📋 [NEEDSQUEUE] QUEUE: Queue is now empty`)
      }
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
      
      if (this._messageTimer) {
        clearTimeout(this._messageTimer)
        this._messageTimer = null
      }
      
      console.log(`📋 [NEEDSQUEUE] MESSAGE: Cleared all messages`)
    },

    // Check if we should show urgency message for a need
    checkUrgencyMessage(store, needName) {
      // Special case for wellness - always allow messages to show positive status
      // For other needs, only show urgency messages for urgent/critical needs
      if (needName !== 'wellness' && !store.isUrgent && !store.isCritical) {
        return
      }
      
      // For wellness, we want to show messages at all levels to provide status updates
      if (needName === 'wellness') {
        console.log(`🌟 [WELLNESS] URGENCY: Checking wellness message (${store.percentage}%, status: ${store.needStatus})`)
      }
      
      const config = store.messageConfig
      if (!config || !store.urgencyMessages) {
        if (needName === 'wellness') {
          console.log(`🌟 [WELLNESS] URGENCY: Missing config or urgency messages for wellness`)
        }
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
      } else if (store.isFulfilled && config.intervals.fulfilled) {
        // Special case for fulfilled status (especially wellness)
        urgencyLevel = 'fulfilled'
        interval = config.intervals.fulfilled
      }
      
      // Check if enough time has passed since last urgency message for this need
      const lastUrgencyKey = `urgency_${needName}`
      const now = Date.now()
      const lastTime = this[`_${lastUrgencyKey}`] || 0
      const timeSinceLastMessage = now - lastTime
      
      if (needName === 'wellness') {
        console.log(`🌟 [WELLNESS] URGENCY: Checking timing - ${urgencyLevel} level, interval: ${interval}ms, time since last: ${timeSinceLastMessage}ms`)
      }
      
      if (timeSinceLastMessage < interval) {
        if (needName === 'wellness') {
          console.log(`🌟 [WELLNESS] URGENCY: Too soon for next message (need ${interval - timeSinceLastMessage}ms more)`)
        }
        return // Too soon to show another urgency message
      }
      
      // Get available messages
      const messages = store.urgencyMessages[urgencyLevel] || []
      if (messages.length === 0) {
        if (needName === 'wellness') {
          console.log(`🌟 [WELLNESS] URGENCY: No messages available for ${urgencyLevel} level`)
        }
        return
      }
      
      // Pick a random message
      const message = messages[Math.floor(Math.random() * messages.length)]
      const emoji = config.emoji || '⚠️'
      
      // Add urgency message to queue
      this.addMessage(message, emoji, MESSAGE_DURATIONS.URGENCY, 3, 'urgency', needName)
      
      // Record when we showed this urgency message
      this[`_${lastUrgencyKey}`] = now
      
      if (needName === 'wellness') {
        console.log(`🌟 [WELLNESS] URGENCY: Added urgency message "${message}" ${emoji} (${urgencyLevel} level, ${MESSAGE_DURATIONS.URGENCY}ms duration)`)
      } else {
        console.log(`📢 [NEEDSQUEUE] URGENCY: Added ${needName} urgency message: "${message}"`)
      }
    },


    // Update fallback message based on guinea pig state
    updateFallbackMessage() {
      const cageStore = useCageStore()
      const marketStore = useMarketStore()
      
      if (!cageStore.guineaPigPos) {
        this.fallbackMessage = null
        return
      }
      
      const { x, y } = cageStore.guineaPigPos
      
      // Check if guinea pig is on an item
      const currentItem = cageStore.items?.find(item => item.x === x && item.y === y)
      if (currentItem) {
        const itemData = marketStore.getItemData(currentItem.name)
        if (itemData && itemData.actionWord) {
          const itemName = currentItem.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          this.fallbackMessage = {
            text: `The guinea pig is ${itemData.actionWord} the ${itemName}.`,
            emoji: marketStore.getItemEmoji(currentItem.name)
          }
          return
        }
      }
      
      // Set guinea pig status as fallback
      const guineaPigStore = useGuineaPigStore()
      this.fallbackMessage = {
        text: guineaPigStore.currentMessage,
        emoji: guineaPigStore.currentEmoji
      }
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
          MESSAGE_DURATIONS.STATUS_CHANGE, // Configurable duration for status change reactions
          1, // Highest priority
          'reaction',
          reaction.needType
        )
      })
    },

    // Log current queue status to console
    logQueueStatus() {
      if (this.messageQueue.length === 0) {
        console.log(`📋 [NEEDSQUEUE] QUEUE: Empty queue`)
        return
      }
      
      console.log(`📋 [NEEDSQUEUE] QUEUE: ${this.messageQueue.length} messages in queue:`)
      this.messageQueue.slice(0, 5).forEach((msg, index) => {
        let displayText = 'No text'
        let displayEmoji = '❓'
        let displayDuration = 0
        
        if (msg.type === 'chain' && msg.messages && msg.messages.length > 0) {
          // For chain messages, show summary of chain
          const firstMsg = msg.messages[0]
          displayText = `Chain: ${firstMsg.text || 'Unknown'} (+${msg.messages.length - 1} more)`
          displayEmoji = firstMsg.emoji || '🔗'
          displayDuration = msg.totalDuration || 0
        } else if (msg.text) {
          // For regular messages
          displayText = msg.text.length > 30 ? msg.text.substring(0, 30) + '...' : msg.text
          displayEmoji = msg.emoji || '❓'
          displayDuration = msg.duration || 0
        }
        
        console.log(`  ${index + 1}. [P${msg.priority}] ${msg.type}: "${displayText}" ${displayEmoji} (${displayDuration}ms)`)
      })
      
      if (this.messageQueue.length > 5) {
        console.log(`  ... and ${this.messageQueue.length - 5} more messages`)
      }
    },

    // Process pending guinea pig status messages
    processGuineaPigStatusMessages() {
      try {
        const guineaPigStore = useGuineaPigStore()
        if (!guineaPigStore || !guineaPigStore.getPendingStatusMessages) {
          return
        }
        
        const pendingMessages = guineaPigStore.getPendingStatusMessages()
        if (!pendingMessages || pendingMessages.length === 0) {
          return
        }
        
        // Check if game is paused - don't process messages when paused
        const userStore = useUserStore()
        const cageStore = useCageStore()
        const isGamePaused = !userStore.name || cageStore.paused
        
        if (isGamePaused) {
          console.log(`🐹 [NEEDSQUEUE] GUINEAPIG: Clearing ${pendingMessages.length} pending status messages (game paused)`)
          return
        }
        
        // Process each pending status message
        pendingMessages.forEach(msg => {
          console.log(`🐹 [NEEDSQUEUE] GUINEAPIG: Processing status message: "${msg.text}" ${msg.emoji}`)
          
          this.addMessage(
            msg.text,
            msg.emoji,
            msg.duration || MESSAGE_DURATIONS.AMBIENT,
            msg.priority || MESSAGE_PRIORITIES.AMBIENT,
            msg.type || 'status_change',
            msg.needType || 'movement'
          )
        })
        
        // Clear processed messages from guinea pig store
        if (guineaPigStore.clearProcessedStatusMessages) {
          guineaPigStore.clearProcessedStatusMessages(pendingMessages.length)
        }
        
      } catch (error) {
        console.warn(`🐹 [NEEDSQUEUE] GUINEAPIG: Could not process status messages:`, error)
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