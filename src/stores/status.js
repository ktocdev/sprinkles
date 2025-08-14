import { defineStore } from 'pinia'
import { useNeedsQueueStore } from './needs/needsQueue.js'
import { useCageStore } from './cage.js'

export const useStatusStore = defineStore('status', {
  state: () => ({
    
    // Current urgency messages and their timers
    activeMessages: new Map(), // Map of needType -> { message, timer, lastShown }
    
    // Track last message time for each need type to respect intervals
    lastMessageTimes: new Map(), // Map of needType -> timestamp
    
    // Current priority message to display
    currentMessage: null,
    
    // Message history to avoid repetition
    messageHistory: new Map(), // Map of needType -> [recent messages]
    historyLength: 3, // How many recent messages to remember per need
    
    // General settings
    enabled: true,
    globalCooldown: 100, // Minimum time between any messages (0.1 seconds)
    lastMessageTime: 0,
    
    // Update timer management
    updateTimer: null,
    updateInterval: 1000, // Update every 1 second
    
    // Initialization flag
    _initialized: false
  }),

  getters: {
    // Get the configuration for a specific need type from the need store itself
    getNeedConfig: (state) => (needType) => {
      const needsQueueStore = useNeedsQueueStore()
      const needStore = needsQueueStore.getNeedStore(needType)
      return needStore?.messageConfig || null
    },

    // Get all active urgent messages
    getAllActiveMessages: (state) => {
      // Ensure activeMessages is a Map
      const activeMap = state.activeMessages instanceof Map ? 
        state.activeMessages : 
        new Map(Object.entries(state.activeMessages || {}))
      
      return Array.from(activeMap.entries()).map(([needType, data]) => ({
        needType,
        ...data
      }))
    },

    // Get the current status display (message and emoji) based on context
    getCurrentStatusDisplay: (state) => (context) => {
      // context should include: guineaPigStore, cageStore, poopStore, marketStore
      const { guineaPigStore, cageStore, poopStore, marketStore } = context
      const now = Date.now()
      
      // Check for temporary messages first (highest priority)
      const urgencyMessage = state.currentMessage
      if (urgencyMessage && urgencyMessage.isTemporary) {
        const needsQueueStore = useNeedsQueueStore()
        const needStore = needsQueueStore.getNeedStore(urgencyMessage.needType)
        const config = needStore?.messageConfig
        return {
          message: urgencyMessage.message,
          emoji: urgencyMessage.emoji || config?.emoji || '⚠️'
        }
      }
      
      const { x, y } = cageStore.guineaPigPos || { x: 0, y: 0 }
      
      
      // Check if guinea pig is on an item (medium priority)
      const currentItem = cageStore.items?.find(item => item.x === x && item.y === y)
      if (currentItem) {
        const itemData = marketStore.getItemData(currentItem.name)
        if (itemData && itemData.actionWord) {
          const itemName = currentItem.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          return {
            message: `The guinea pig is ${itemData.actionWord} the ${itemName}.`,
            emoji: marketStore.getItemEmoji(currentItem.name)
          }
        }
      }
      
      // Check for urgent/critical need messages (medium-low priority)
      if (urgencyMessage && (urgencyMessage.urgencyLevel === 'critical' || urgencyMessage.urgencyLevel === 'urgent')) {
        const needsQueueStore = useNeedsQueueStore()
        const needStore = needsQueueStore.getNeedStore(urgencyMessage.needType)
        const config = needStore?.messageConfig
        return {
          message: urgencyMessage.message,
          emoji: urgencyMessage.emoji || config?.emoji || '⚠️'
        }
      }
      
      // Show wellness message during cooldown after reactions (medium-low priority)
      if (now - state.lastMessageTime < 2000 && now - state.lastMessageTime > 500) {
        const needsQueueStore = useNeedsQueueStore()
        const wellnessMessage = needsQueueStore.wellnessMessage
        const overallWellness = needsQueueStore.overallWellness
        
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
        
        return {
          message: wellnessMessage,
          emoji: emoji
        }
      }
      
      // Default to guinea pig state (low priority)
      // Show normal need messages more frequently (40% chance when guinea pig is sitting)
      if (urgencyMessage && urgencyMessage.urgencyLevel === 'normal' && guineaPigStore.sitting && Math.random() < 0.4) {
        const needsQueueStore = useNeedsQueueStore()
        const needStore = needsQueueStore.getNeedStore(urgencyMessage.needType)
        const config = needStore?.messageConfig
        return {
          message: urgencyMessage.message,
          emoji: urgencyMessage.emoji || config?.emoji || '⚠️'
        }
      }
      
      return {
        message: guineaPigStore.currentMessage,
        emoji: guineaPigStore.currentEmoji
      }
    }
  },

  actions: {
    // Initialize the status system
    initialize() {
      if (!this._initialized) {
        console.log('🔍 [STATUS] PLAN: Initializing status system')
        this._initialized = true
        if (this.enabled) {
          this.startUpdates()
        }
      }
    },

    // Update urgency messages based on current needs
    updateUrgencyMessages() {
      // Auto-initialize if not done yet
      if (!this._initialized) {
        this.initialize()
      }
      console.log('🔍 [STATUS] PLAN: updateUrgencyMessages called, enabled:', this.enabled)
      
      if (!this.enabled) {
        console.log('🔍 [STATUS] PLAN: Status system disabled, skipping updates')
        return
      }

      const needsQueueStore = useNeedsQueueStore()
      const allNeedsStatus = needsQueueStore.allNeedsStatus
      
      // Process each need type
      for (const [needType, status] of Object.entries(allNeedsStatus)) {
        const config = this.getNeedConfig(needType)
        if (!config) {
          console.log(`🔍 [STATUS] PLAN: No config found for need type: ${needType}`)
          continue
        }

        // Determine urgency level and interval
        console.log(`🔍 [STATUS] DEBUG: ${needType} - currentValue: ${status.currentValue}, isUrgent: ${status.isUrgent}, isCritical: ${status.isCritical}`)
        
        let urgencyLevel = 'normal'
        let interval = config.intervals.normal

        if (status.isCritical) {
          urgencyLevel = 'critical'
          interval = config.intervals.critical
        } else if (status.isUrgent) {
          urgencyLevel = 'urgent'
          interval = config.intervals.urgent
        }

        // Show message based on urgency and timing
        if (status.isCritical || status.isUrgent) {
          this.showNeedMessage(needType, urgencyLevel, status.urgency, interval)
        } else if (status.urgency > 0) {
          this.showNeedMessage(needType, urgencyLevel, status.urgency, interval)
        }
      }
    },

    // Show a specific need message
    showNeedMessage(needType, urgencyLevel, urgency, interval) {
      // Check if game is paused first - exit silently if so
      const cageStore = useCageStore()
      if (cageStore.paused) {
        return
      }
      
      const now = Date.now()
      
      console.log(`🔍 [STATUS] PLAN: Attempting to show ${needType} message (${urgencyLevel}, urgency: ${Math.round(urgency)})`)
      
      // Check global cooldown
      if (now - this.lastMessageTime < this.globalCooldown) {
        console.log(`⏰ DELAY: Message blocked by global cooldown (${this.globalCooldown}ms)`)
        return
      }
      
      // Ensure lastMessageTimes is a Map
      if (!(this.lastMessageTimes instanceof Map)) {
        this.lastMessageTimes = new Map(Object.entries(this.lastMessageTimes || {}))
      }
      
      // Check if enough time has passed since last message for this need type
      const lastMessageTime = this.lastMessageTimes.get(needType) || 0
      const timeSinceLastMessage = now - lastMessageTime
      
      if (timeSinceLastMessage < interval) {
        console.log(`⏰ DELAY: ${needType} message blocked by interval timing (${timeSinceLastMessage}ms < ${interval}ms)`)
        return
      }
      

      const config = this.getNeedConfig(needType)
      if (!config) {
        console.log(`🔍 [STATUS] PLAN: No config found for need type: ${needType}`)
        return
      }

      // Get available messages from the need store
      const needsQueueStore = useNeedsQueueStore()
      const needStore = needsQueueStore.getNeedStore(needType)
      const messages = needStore?.urgencyMessages?.[urgencyLevel] || config.messages?.[urgencyLevel] || []
      if (messages.length === 0) {
        console.log(`🔍 [STATUS] PLAN: No messages available for ${needType} at ${urgencyLevel} level`)
        return
      }
      console.log(`🔍 [STATUS] PLAN: ${messages.length} potential messages for ${needType}:`, messages)

      // Ensure messageHistory is a Map
      if (!(this.messageHistory instanceof Map)) {
        this.messageHistory = new Map(Object.entries(this.messageHistory || {}))
      }
      
      // Get message history for this need to avoid repetition
      const history = this.messageHistory.get(needType) || []
      
      // Filter out recently shown messages
      let availableMessages = messages.filter(msg => !history.includes(msg))
      console.log(`🔍 [STATUS] PLAN: ${availableMessages.length} messages available after filtering out recent ones`)
      
      // If all messages were recently used, use all messages
      if (availableMessages.length === 0) {
        availableMessages = [...messages]
        this.messageHistory.set(needType, []) // Clear history
        console.log(`🔍 [STATUS] PLAN: All messages were recent, cleared history and using all ${availableMessages.length} messages`)
      }

      // Pick a random message
      const message = availableMessages[Math.floor(Math.random() * availableMessages.length)]
      console.log(`📢 [STATUS] SHOW: Selected message for ${needType}: "${message}"`)

      // Update message history
      history.push(message)
      if (history.length > this.historyLength) {
        history.shift()
      }
      this.messageHistory.set(needType, history)

      // Set as current message
      this.currentMessage = {
        needType,
        message,
        urgency,
        urgencyLevel,
        timestamp: now
      }
      console.log(`📢 [STATUS] SHOW: Current message set to ${needType} (urgency: ${Math.round(urgency)})`)

      // Update active message data
      // Ensure activeMessages is a Map
      if (!(this.activeMessages instanceof Map)) {
        this.activeMessages = new Map(Object.entries(this.activeMessages || {}))
      }
      
      const activeData = this.activeMessages.get(needType)
      if (activeData) {
        activeData.message = message
        activeData.lastShown = now
      }

      // Update the last message time
      this.lastMessageTime = now
      
      // Record when this need type last showed a message
      this.lastMessageTimes.set(needType, now)
    },

    // Show a temporary message that overrides other messages for a short time
    showTemporaryMessage(message, emoji = '⚠️', duration = 2000) {
      const now = Date.now()
      
      console.log(`📢 [STATUS] SHOW: Temporary message: "${message}" ${emoji} for ${duration}ms`)
      
      // Set as current message with high priority
      this.currentMessage = {
        needType: 'temporary',
        message,
        urgency: 999, // Very high urgency to override other messages
        urgencyLevel: 'temporary',
        timestamp: now,
        emoji,
        isTemporary: true
      }
      
      // Clear the message after the specified duration
      setTimeout(() => {
        // Only clear if this is still the current temporary message
        if (this.currentMessage?.isTemporary && this.currentMessage.timestamp === now) {
          this.currentMessage = null
          console.log(`📢 [STATUS] SHOW: Temporary message cleared after ${duration}ms`)
        }
      }, duration)
      
      // Extend the global cooldown to prevent other messages from showing immediately after
      // Add a buffer to the cooldown based on the message duration
      this.lastMessageTime = now + duration + 50 // Extra 0.05 second buffer
    },

    // Toggle the status system on/off
    toggle() {
      this.enabled = !this.enabled
      if (!this.enabled) {
        this.clearAllMessages()
        this.stopUpdates()
      } else {
        this.startUpdates()
      }
    },

    // Start periodic updates
    startUpdates() {
      console.log('🔍 [STATUS] PLAN: Starting status system updates, interval:', this.updateInterval)
      
      // Clear any stale timer from persisted state
      if (this.updateTimer) {
        console.log('🔍 [STATUS] PLAN: Clearing existing update timer')
        clearInterval(this.updateTimer)
        this.updateTimer = null
      }
      
      // Always create a fresh timer
      this.updateTimer = setInterval(() => {
        if (this.enabled) {
          this.updateUrgencyMessages()
        }
      }, this.updateInterval)
      
      console.log('🔍 [STATUS] PLAN: Update timer created with ID:', this.updateTimer)
      
      // Do initial update
      if (this.enabled) {
        this.updateUrgencyMessages()
      }
    },

    // Stop periodic updates
    stopUpdates() {
      if (this.updateTimer) {
        clearInterval(this.updateTimer)
        this.updateTimer = null
      }
    },

    // Clear all active messages
    clearAllMessages() {
      // Ensure activeMessages is a Map
      if (!(this.activeMessages instanceof Map)) {
        this.activeMessages = new Map(Object.entries(this.activeMessages || {}))
      }
      
      for (const [needType] of this.activeMessages.entries()) {
        this.clearNeedMessage(needType)
      }
      this.currentMessage = null
    },

    // Clear message for a specific need
    clearNeedMessage(needType) {
      // Ensure activeMessages is a Map
      if (!(this.activeMessages instanceof Map)) {
        this.activeMessages = new Map(Object.entries(this.activeMessages || {}))
      }
      
      const existing = this.activeMessages.get(needType)
      if (existing?.timer) {
        clearInterval(existing.timer)
      }
      this.activeMessages.delete(needType)
    },

    // Reset message history
    resetMessageHistory() {
      // Ensure messageHistory is a Map
      if (!(this.messageHistory instanceof Map)) {
        this.messageHistory = new Map(Object.entries(this.messageHistory || {}))
      }
      this.messageHistory.clear()
    },

    // Get debug info
    getDebugInfo() {
      // Ensure Maps are proper Maps
      if (!(this.activeMessages instanceof Map)) {
        this.activeMessages = new Map(Object.entries(this.activeMessages || {}))
      }
      if (!(this.messageHistory instanceof Map)) {
        this.messageHistory = new Map(Object.entries(this.messageHistory || {}))
      }
      
      return {
        enabled: this.enabled,
        currentMessage: this.currentMessage,
        activeMessagesCount: this.activeMessages.size,
        messageHistoryCount: this.messageHistory.size,
        lastMessageTime: this.lastMessageTime,
        updateTimer: !!this.updateTimer
      }
    }
  },

  persist: true
})