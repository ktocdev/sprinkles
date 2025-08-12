import { defineStore } from 'pinia'
import { useNeedsQueueStore } from './needs/needsQueue.js'

export const useStatusStore = defineStore('status', {
  state: () => ({
    // Message configurations for different urgency levels
    messageConfig: {
      hunger: {
        messages: {
          normal: [
            'Getting a bit peckish...',
            'Sniffing around for food...',
            'Time for a snack?'
          ],
          urgent: [
            'I\'m getting really hungry!',
            'Where\'s the food?',
            'Need food soon!',
            'My tummy is rumbling...'
          ],
          critical: [
            'I\'m STARVING!',
            'FEED ME NOW!',
            'I need food immediately!',
            'This guinea pig is famished!'
          ]
        },
        emoji: '🍽️',
        intervals: {
          normal: 30000,    // 30 seconds
          urgent: 15000,    // 15 seconds  
          critical: 8000    // 8 seconds
        }
      },
      thirst: {
        messages: {
          normal: [
            'Could use some water...',
            'Feeling a bit parched...'
          ],
          urgent: [
            'Getting really thirsty!',
            'Need water soon!'
          ],
          critical: [
            'I\'m SO thirsty!',
            'Water needed urgently!'
          ]
        },
        emoji: '💧',
        intervals: {
          normal: 25000,
          urgent: 12000,
          critical: 6000
        }
      },
      chew: {
        messages: {
          normal: [
            'My teeth need some work...',
            'Looking for something to chew...'
          ],
          urgent: [
            'Need to chew something!',
            'My teeth are getting too long!'
          ],
          critical: [
            'MUST CHEW SOMETHING NOW!',
            'Teeth emergency!'
          ]
        },
        emoji: '🦷',
        intervals: {
          normal: 45000,
          urgent: 20000,
          critical: 10000
        }
      },
      enrichment: {
        messages: {
          normal: [
            'Feeling a bit bored...',
            'Could use some fun...',
            'Time to play?'
          ],
          urgent: [
            'I\'m getting restless!',
            'Need some entertainment!'
          ],
          critical: [
            'I\'m SO BORED!',
            'Need stimulation NOW!'
          ]
        },
        emoji: '🎾',
        intervals: {
          normal: 40000,
          urgent: 18000,
          critical: 12000
        }
      },
      shelter: {
        messages: {
          normal: [
            'Looking for a cozy spot...',
            'Could use some shelter...'
          ],
          urgent: [
            'Need somewhere safe!',
            'Looking for hiding place!'
          ],
          critical: [
            'I feel so exposed!',
            'Need shelter RIGHT NOW!'
          ]
        },
        emoji: '🏠',
        intervals: {
          normal: 50000,
          urgent: 25000,
          critical: 15000
        }
      },
      hygiene: {
        messages: {
          normal: [
            'Feeling a bit messy...',
            'Could use some grooming...'
          ],
          urgent: [
            'I\'m getting quite dirty!',
            'Really need cleaning!'
          ],
          critical: [
            'I\'m absolutely filthy!',
            'HYGIENE EMERGENCY!'
          ]
        },
        emoji: '🛁',
        intervals: {
          normal: 60000,
          urgent: 30000,
          critical: 15000
        }
      }
    },
    
    // Current urgency messages and their timers
    activeMessages: new Map(), // Map of needType -> { message, timer, lastShown }
    
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
    updateInterval: 1000 // Update every 1 second
  }),

  getters: {
    // Get the configuration for a specific need type
    getNeedConfig: (state) => (needType) => {
      return state.messageConfig[needType] || null
    },

    // Get all currently active urgency messages
    getActiveUrgencyMessages: (state) => {
      const messages = []
      // Ensure activeMessages is a Map
      const activeMap = state.activeMessages instanceof Map ? 
        state.activeMessages : 
        new Map(Object.entries(state.activeMessages || {}))
      
      for (const [needType, data] of activeMap.entries()) {
        messages.push({
          needType,
          message: data.message,
          emoji: state.messageConfig[needType]?.emoji || '⚠️',
          urgency: data.urgency,
          lastShown: data.lastShown
        })
      }
      return messages.sort((a, b) => b.urgency - a.urgency)
    },

    // Get the highest priority message to display
    getCurrentPriorityMessage: (state) => {
      if (!state.currentMessage) return null
      
      const config = state.messageConfig[state.currentMessage.needType]
      return {
        ...state.currentMessage,
        emoji: state.currentMessage.emoji || config?.emoji || '⚠️'
      }
    },

    // Get the current status display (message and emoji) based on context
    getCurrentStatusDisplay: (state) => (context) => {
      // context should include: guineaPigStore, cageStore, poopStore, marketStore
      const { guineaPigStore, cageStore, poopStore, marketStore } = context
      const now = Date.now()
      
      // Check for temporary messages first (highest priority)
      const urgencyMessage = state.currentMessage
      if (urgencyMessage && urgencyMessage.isTemporary) {
        const config = state.messageConfig[urgencyMessage.needType]
        return {
          message: urgencyMessage.message,
          emoji: urgencyMessage.emoji || config?.emoji || '⚠️'
        }
      }
      
      // Skip the cooldown content message - let other messages show immediately
      
      const { x, y } = cageStore.guineaPigPos
      
      // Check if guinea pig is on fresh poop (high priority)
      const poopAtPosition = poopStore.getPoopAtPosition(x, y)
      if (poopAtPosition) {
        const poopAge = Date.now() - poopAtPosition.timestamp
        const isFreshPoop = poopAge < 2000
        if (isFreshPoop) {
          return {
            message: 'The guinea pig just made a poop!',
            emoji: '💩'
          }
        }
        // Old poop message is handled by temporary messages now
      }
      
      // Check if guinea pig is on an item (medium priority)
      const currentItem = cageStore.items.find(item => item.x === x && item.y === y)
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
        const config = state.messageConfig[urgencyMessage.needType]
        return {
          message: urgencyMessage.message,
          emoji: urgencyMessage.emoji || config?.emoji || '⚠️'
        }
      }
      
      // Default to guinea pig state (low priority)
      // Only show normal need messages occasionally (10% chance when guinea pig is sitting)
      if (urgencyMessage && urgencyMessage.urgencyLevel === 'normal' && guineaPigStore.sitting && Math.random() < 0.1) {
        const config = state.messageConfig[urgencyMessage.needType]
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
    // Update urgency messages based on current needs
    updateUrgencyMessages() {
      if (!this.enabled) {
        return
      }

      const needsQueueStore = useNeedsQueueStore()
      const allNeedsStatus = needsQueueStore.allNeedsStatus
      
      // Process each need type
      for (const [needType, status] of Object.entries(allNeedsStatus)) {
        const config = this.messageConfig[needType]
        if (!config) {
          continue
        }

        // Determine urgency level
        let urgencyLevel = 'normal'
        let interval = config.intervals.normal

        if (status.isCritical) {
          urgencyLevel = 'critical'
          interval = config.intervals.critical
        } else if (status.isUrgent) {
          urgencyLevel = 'urgent' 
          interval = config.intervals.urgent
        } else if (status.urgency < 10) {
          // Don't show messages for very low urgency (below 10)
          this.clearNeedMessages(needType)
          continue
        }

        // Check if we should show a message for this need
        this.scheduleNeedMessage(needType, urgencyLevel, interval, status.urgency)
      }
    },

    // Schedule a message for a specific need
    scheduleNeedMessage(needType, urgencyLevel, interval, urgency) {
      // Ensure activeMessages is a Map
      if (!(this.activeMessages instanceof Map)) {
        this.activeMessages = new Map(Object.entries(this.activeMessages || {}))
      }
      
      const existing = this.activeMessages.get(needType)
      const now = Date.now()

      // If already scheduled with same urgency level, don't reschedule
      if (existing && existing.urgencyLevel === urgencyLevel) {
        return
      }

      // Clear existing timer if any
      if (existing?.timer) {
        clearInterval(existing.timer)
      }

      // Schedule new message timer
      const timer = setInterval(() => {
        this.showNeedMessage(needType, urgencyLevel, urgency)
      }, interval)

      // Show first message immediately
      const initialDelay = 0

      setTimeout(() => {
        this.showNeedMessage(needType, urgencyLevel, urgency)
      }, initialDelay)

      // Store the message info
      this.activeMessages.set(needType, {
        timer,
        urgencyLevel,
        urgency,
        message: null,
        lastShown: 0
      })
    },

    // Show a specific need message
    showNeedMessage(needType, urgencyLevel, urgency) {
      const now = Date.now()
      
      // Check global cooldown
      if (now - this.lastMessageTime < this.globalCooldown) {
        return
      }

      const config = this.messageConfig[needType]
      if (!config) return

      // Get available messages for this urgency level
      const messages = config.messages[urgencyLevel] || []
      if (messages.length === 0) return

      // Ensure messageHistory is a Map
      if (!(this.messageHistory instanceof Map)) {
        this.messageHistory = new Map(Object.entries(this.messageHistory || {}))
      }
      
      // Get message history for this need to avoid repetition
      const history = this.messageHistory.get(needType) || []
      
      // Filter out recently shown messages
      let availableMessages = messages.filter(msg => !history.includes(msg))
      
      // If all messages were recently used, use all messages
      if (availableMessages.length === 0) {
        availableMessages = [...messages]
        this.messageHistory.set(needType, []) // Clear history
      }

      // Pick a random message
      const message = availableMessages[Math.floor(Math.random() * availableMessages.length)]

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

      this.lastMessageTime = now
    },

    // Clear messages for a specific need
    clearNeedMessages(needType) {
      // Ensure activeMessages is a Map
      if (!(this.activeMessages instanceof Map)) {
        this.activeMessages = new Map(Object.entries(this.activeMessages || {}))
      }
      
      const existing = this.activeMessages.get(needType)
      if (existing?.timer) {
        clearInterval(existing.timer)
      }
      this.activeMessages.delete(needType)
      
      // Clear from current message if it matches
      if (this.currentMessage?.needType === needType) {
        this.currentMessage = null
      }
    },

    // Clear all urgency messages
    clearAllMessages() {
      // Ensure activeMessages is a Map
      if (!(this.activeMessages instanceof Map)) {
        this.activeMessages = new Map(Object.entries(this.activeMessages || {}))
      }
      
      for (const [needType] of this.activeMessages.entries()) {
        this.clearNeedMessages(needType)
      }
      this.currentMessage = null
    },

    // Configure message settings for a need type
    configureNeedMessages(needType, config) {
      if (!this.messageConfig[needType]) {
        this.messageConfig[needType] = {
          messages: { normal: [], urgent: [], critical: [] },
          emoji: '⚠️',
          intervals: { normal: 30000, urgent: 15000, critical: 8000 }
        }
      }
      
      // Merge the configuration
      Object.assign(this.messageConfig[needType], config)
    },

    // Add custom messages for a need type and urgency level
    addCustomMessages(needType, urgencyLevel, messages) {
      if (!this.messageConfig[needType]) {
        this.configureNeedMessages(needType, {})
      }
      
      if (!Array.isArray(messages)) {
        messages = [messages]
      }
      
      this.messageConfig[needType].messages[urgencyLevel].push(...messages)
    },

    // Update intervals for a need type
    updateIntervals(needType, intervals) {
      if (this.messageConfig[needType]) {
        Object.assign(this.messageConfig[needType].intervals, intervals)
        
        // Ensure activeMessages is a Map
        if (!(this.activeMessages instanceof Map)) {
          this.activeMessages = new Map(Object.entries(this.activeMessages || {}))
        }
        
        // If this need has active messages, reschedule them
        const active = this.activeMessages.get(needType)
        if (active) {
          const newInterval = intervals[active.urgencyLevel]
          if (newInterval && active.timer) {
            clearInterval(active.timer)
            active.timer = setInterval(() => {
              this.showNeedMessage(needType, active.urgencyLevel, active.urgency)
            }, newInterval)
          }
        }
      }
    },

    // Enable/disable the status system
    setEnabled(enabled) {
      this.enabled = enabled
      if (!enabled) {
        this.clearAllMessages()
        this.stopUpdates()
      } else {
        this.startUpdates()
      }
    },

    // Start periodic updates
    startUpdates() {
      // Clear any stale timer from persisted state
      if (this.updateTimer) {
        clearInterval(this.updateTimer)
        this.updateTimer = null
      }
      
      // Always create a fresh timer
      this.updateTimer = setInterval(() => {
        if (this.enabled) {
          this.updateUrgencyMessages()
        }
      }, this.updateInterval)
      
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

    // Reset message history
    resetMessageHistory() {
      // Ensure messageHistory is a Map
      if (!(this.messageHistory instanceof Map)) {
        this.messageHistory = new Map(Object.entries(this.messageHistory || {}))
      }
      this.messageHistory.clear()
    },

    // Show a temporary message that overrides other messages for a short time
    showTemporaryMessage(message, emoji = '⚠️', duration = 2000) {
      const now = Date.now()
      
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
        }
      }, duration)
      
      // Extend the global cooldown to prevent other messages from showing immediately after
      // Add a buffer to the cooldown based on the message duration
      this.lastMessageTime = now + duration + 50 // Extra 0.05 second buffer
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
        activeMessagesCount: this.activeMessages.size,
        currentMessage: this.currentMessage,
        lastMessageTime: this.lastMessageTime,
        messageHistorySize: this.messageHistory.size
      }
    }
  },

  persist: {
    paths: ['messageConfig', 'enabled', 'globalCooldown', 'historyLength']
  }
})
