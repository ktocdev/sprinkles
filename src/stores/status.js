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
    globalCooldown: 2000, // Minimum time between any messages (2 seconds)
    lastMessageTime: 0,
    
    // Update timer management
    updateTimer: null,
    updateInterval: 5000 // Update every 5 seconds
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
        emoji: config?.emoji || '⚠️'
      }
    }
  },

  actions: {
    // Update urgency messages based on current needs
    updateUrgencyMessages() {
      if (!this.enabled) {
        console.log('Status store: disabled, skipping update')
        return
      }

      const needsQueueStore = useNeedsQueueStore()
      const allNeedsStatus = needsQueueStore.allNeedsStatus
      
      console.log('Status store: updating urgency messages', { 
        enabled: this.enabled, 
        allNeedsStatus,
        isActive: needsQueueStore.isActive 
      })
      
      // Process each need type
      for (const [needType, status] of Object.entries(allNeedsStatus)) {
        const config = this.messageConfig[needType]
        if (!config) {
          console.log(`Status store: no config for ${needType}`)
          continue
        }

        console.log(`Status store: processing ${needType}`, {
          currentValue: status.currentValue,
          percentage: status.percentage,
          urgency: status.urgency,
          isUrgent: status.isUrgent,
          isCritical: status.isCritical
        })

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
          console.log(`Status store: ${needType} urgency too low (${status.urgency}), clearing messages`)
          this.clearNeedMessages(needType)
          continue
        }

        console.log(`Status store: scheduling ${needType} message`, {
          urgencyLevel,
          interval,
          urgency: status.urgency
        })

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

      // Show first message after a short delay if it's urgent/critical
      const initialDelay = urgencyLevel === 'critical' ? 1000 : 
                          urgencyLevel === 'urgent' ? 3000 : interval

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
      console.log('Status store: starting updates', { enabled: this.enabled, hasTimer: !!this.updateTimer })
      
      // Clear any stale timer from persisted state
      if (this.updateTimer) {
        clearInterval(this.updateTimer)
        this.updateTimer = null
      }
      
      // Always create a fresh timer
      this.updateTimer = setInterval(() => {
        if (this.enabled) {
          console.log('Status store: running update cycle')
          this.updateUrgencyMessages()
        }
      }, this.updateInterval)
      
      console.log('Status store: timer started, doing initial update')
      
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