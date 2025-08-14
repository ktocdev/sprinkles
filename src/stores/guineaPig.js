import { defineStore } from 'pinia'
import { MESSAGE_DURATIONS, MESSAGE_PRIORITIES } from './needs/messageTimingConfig.js'

export const useGuineaPigStore = defineStore('guineaPig', {
  state: () => ({
    info: {
      name: '',
      birthday: '', // ISO string or date
      coat: '',
      gender: '', // 'neutered boar' or 'sow'
    },
    
    // Status management
    currentStatus: 'sitting', // 'sitting', 'moving', 'sleeping'
    previousStatus: null,
    lastStatusChange: Date.now(),
    pendingStatusMessages: [], // Messages waiting to be processed by needsQueue
    
    // Auto-transition timers
    statusTimer: null,
    
    // Movement control
    canMove: true, // Whether the guinea pig is allowed to move physically
    movementBlockedUntil: 0, // Timestamp when movement will be allowed again
    lastMovementCheck: 0, // Track last time movement was checked
    
    // Status messages for each state
    statusMessages: {
      sitting: [
        'The guinea pig is sitting quietly.',
        'Guinea pig is resting comfortably.',
        'Sitting and watching the world.',
        'Guinea pig is sitting peacefully.'
      ],
      moving: [
        'The guinea pig is moving around.',
        'Guinea pig is exploring.',
        'Moving about curiously.',
        'Guinea pig is on the go.'
      ],
      sleeping: [
        'The guinea pig is sleeping.',
        'Guinea pig is taking a nap.',
        'Sleeping peacefully.',
        'Guinea pig is dreaming.'
      ]
    },
    
    // Status transition messages
    transitionMessages: {
      sittingToMoving: [
        'Guinea pig stands up and starts moving.',
        'Time to explore!',
        'Getting up to move around.',
        'Starting to move about.'
      ],
      movingToSitting: [
        'Guinea pig settles down to sit.',
        'Time to rest.',
        'Sitting down to relax.',
        'Finding a comfortable spot to sit.'
      ],
      sittingToSleeping: [
        'Guinea pig is getting sleepy.',
        'Time for a nap.',
        'Settling down for sleep.',
        'Guinea pig is drifting off to sleep.'
      ],
      sleepingToSitting: [
        'Guinea pig wakes up.',
        'Waking up from a nice nap.',
        'Guinea pig stretches and sits up.',
        'Rising from sleep.'
      ],
      movingToSleeping: [
        'Guinea pig is getting tired from moving.',
        'Time to rest and sleep.',
        'Settling down to sleep after moving.',
        'Guinea pig is ready for sleep.'
      ],
      sleepingToMoving: [
        'Guinea pig wakes up ready to move.',
        'Waking up with energy to explore.',
        'Up and ready to move around.',
        'Guinea pig is energized after sleep.'
      ]
    },
    
    // Poop-related messages
    poopMessages: {
      fresh: [
        'Guinea pig just made a poop!',
        'Oops, nature calls!',
        'Guinea pig had to go!',
        'Fresh poop appears!'
      ],
      old: [
        'Eww, stepped on old poop!',
        'Yuck! Old poop underfoot!',
        'Guinea pig stepped in old poop!',
        'Gross! That poop was old!'
      ],
      reaction: [
        'Guinea pig sniffs around.',
        'Checking out the area.',
        'Guinea pig seems unbothered.',
        'Just part of guinea pig life!'
      ]
    },
    
    // Emojis for each status
    statusEmojis: {
      sitting: '🛋️',
      moving: '🏃',
      sleeping: '💤'
    }
  }),
  
  getters: {
    // Legacy compatibility getters
    sitting() {
      return this.currentStatus === 'sitting'
    },
    
    moving() {
      return this.currentStatus === 'moving'
    },
    
    sleeping() {
      return this.currentStatus === 'sleeping'
    },
    
    currentEmoji() {
      return this.statusEmojis[this.currentStatus] || '🐹'
    },
    
    currentMessage() {
      const messages = this.statusMessages[this.currentStatus] || []
      return messages[Math.floor(Math.random() * messages.length)] || 'Guinea pig is here.'
    }
  },
  
  actions: {
    setInfoField(field, value) {
      if (field in this.info) {
        this.info[field] = value
      }
    },
    
    // Legacy compatibility method
    setSitting(sitting) {
      if (sitting && this.currentStatus !== 'sitting') {
        this.changeStatus('sitting')
      } else if (!sitting && this.currentStatus === 'sitting') {
        this.changeStatus('moving')
      }
    },
    
    // Change status and trigger messaging
    changeStatus(newStatus) {
      if (newStatus === this.currentStatus) {
        return // No change needed
      }
      
      const oldStatus = this.currentStatus
      this.previousStatus = oldStatus
      this.currentStatus = newStatus
      this.lastStatusChange = Date.now()
      
      console.log(`🐹 [GUINEAPIG] STATUS: Changed from ${oldStatus} to ${newStatus}`)
      
      // Generate transition message
      this.addTransitionMessage(oldStatus, newStatus)
      
      // Control movement based on new status
      this.updateMovementControl(newStatus)
      
      // Clear any existing timer
      this.clearStatusTimer()
      
      // Set up next automatic transition
      this.scheduleNextTransition()
    },
    
    // Add a transition message to pending queue
    addTransitionMessage(fromStatus, toStatus) {
      const transitionKey = `${fromStatus}To${toStatus.charAt(0).toUpperCase() + toStatus.slice(1)}`
      const messages = this.transitionMessages[transitionKey] || []
      
      if (messages.length > 0) {
        const message = messages[Math.floor(Math.random() * messages.length)]
        const transitionMessage = {
          text: message,
          emoji: this.statusEmojis[toStatus],
          duration: MESSAGE_DURATIONS.AMBIENT,
          priority: MESSAGE_PRIORITIES.AMBIENT,
          type: 'status_change',
          needType: 'movement',
          timestamp: Date.now()
        }
        
        this.pendingStatusMessages.push(transitionMessage)
        console.log(`🐹 [GUINEAPIG] TRANSITION: Added transition message: "${message}"`)
      }
    },
    
    // Get pending status messages for needsQueue to process
    getPendingStatusMessages() {
      return [...this.pendingStatusMessages]
    },
    
    // Clear processed status messages
    clearProcessedStatusMessages(count = null) {
      if (count === null) {
        this.pendingStatusMessages = []
      } else {
        this.pendingStatusMessages.splice(0, count)
      }
    },
    
    // Schedule the next automatic status transition
    scheduleNextTransition() {
      // Clear any existing timer
      this.clearStatusTimer()
      
      // Set up random transition timing (5-15 seconds)
      const delay = 5000 + Math.random() * 10000
      
      this.statusTimer = setTimeout(() => {
        this.performRandomTransition()
      }, delay)
      
      console.log(`🐹 [GUINEAPIG] SCHEDULE: Next transition in ${Math.round(delay/1000)}s`)
    },
    
    // Perform a random status transition
    performRandomTransition() {
      const currentStatus = this.currentStatus
      let possibleTransitions = []
      
      // Define possible transitions from each state
      switch (currentStatus) {
        case 'sitting':
          possibleTransitions = ['moving', 'sleeping']
          break
        case 'moving':
          possibleTransitions = ['sitting', 'sleeping']
          break
        case 'sleeping':
          possibleTransitions = ['sitting', 'moving']
          break
      }
      
      // Weight transitions (sitting is most common)
      const weights = {
        sitting: 3,
        moving: 2,
        sleeping: 1
      }
      
      // Create weighted array
      const weightedTransitions = []
      possibleTransitions.forEach(status => {
        const weight = weights[status] || 1
        for (let i = 0; i < weight; i++) {
          weightedTransitions.push(status)
        }
      })
      
      // Pick random transition
      if (weightedTransitions.length > 0) {
        const newStatus = weightedTransitions[Math.floor(Math.random() * weightedTransitions.length)]
        this.changeStatus(newStatus)
      }
    },
    
    // Clear status transition timer
    clearStatusTimer() {
      if (this.statusTimer) {
        clearTimeout(this.statusTimer)
        this.statusTimer = null
      }
    },
    
    // Initialize the guinea pig status system
    initialize() {
      console.log(`🐹 [GUINEAPIG] INIT: Initializing guinea pig status system`)
      
      // Ensure we have a valid status
      if (!['sitting', 'moving', 'sleeping'].includes(this.currentStatus)) {
        this.currentStatus = 'sitting'
      }
      
      // Clear any stale timer from persisted state
      this.clearStatusTimer()
      
      // Start the automatic transition system
      this.scheduleNextTransition()
    },
    
    // Add poop-related message
    addPoopMessage(type) {
      const messages = this.poopMessages[type] || []
      if (messages.length === 0) return
      
      const message = messages[Math.floor(Math.random() * messages.length)]
      let emoji = '💩'
      
      if (type === 'old') {
        emoji = '🤢'
      } else if (type === 'reaction') {
        emoji = '🐹'
      }
      
      const poopMessage = {
        text: message,
        emoji: emoji,
        duration: MESSAGE_DURATIONS.POOP,
        priority: MESSAGE_PRIORITIES.POOP,
        type: 'poop',
        needType: 'poop',
        timestamp: Date.now()
      }
      
      this.pendingStatusMessages.push(poopMessage)
      console.log(`💩 [GUINEAPIG] POOP: Added ${type} poop message: "${message}"`)
    },
    
    // Handle poop creation (called when guinea pig makes poop)
    handlePoopCreated() {
      this.addPoopMessage('fresh')
      
      // Add a reaction message after a short delay
      setTimeout(() => {
        this.addPoopMessage('reaction')
      }, MESSAGE_DURATIONS.POOP + 100) // Show reaction after poop message
    },
    
    // Handle stepping on old poop
    handlePoopStepped() {
      this.addPoopMessage('old')
    },
    
    // Update movement control based on status
    updateMovementControl(status) {
      const now = Date.now()
      
      if (status === 'sitting' || status === 'sleeping') {
        // Block movement for sitting/sleeping guinea pigs
        // Duration should be long enough for the status message sequence to complete
        const blockDuration = status === 'sleeping' ? 8000 : 6000 // 8s for sleeping, 6s for sitting
        
        this.canMove = false
        this.movementBlockedUntil = now + blockDuration
        
        console.log(`🐹 [GUINEAPIG] MOVEMENT: Blocking movement for ${blockDuration}ms while ${status}`)
      } else if (status === 'moving') {
        // Allow movement when moving
        this.canMove = true
        this.movementBlockedUntil = 0
        
        console.log(`🐹 [GUINEAPIG] MOVEMENT: Allowing movement while ${status}`)
      }
    },
    
    // Check if guinea pig can move (called by cage component)
    canGuineaPigMove() {
      const now = Date.now()
      
      // Update movement status if block period has expired
      if (!this.canMove && now >= this.movementBlockedUntil) {
        this.canMove = true
        this.movementBlockedUntil = 0
        console.log(`🐹 [GUINEAPIG] MOVEMENT: Movement block expired, allowing movement`)
      }
      
      this.lastMovementCheck = now
      return this.canMove
    },
    
    // Force allow movement (emergency override)
    forceAllowMovement() {
      this.canMove = true
      this.movementBlockedUntil = 0
      console.log(`🐹 [GUINEAPIG] MOVEMENT: Force allowing movement (override)`)
    },
    
    // Get movement status for debugging
    getMovementStatus() {
      const now = Date.now()
      return {
        canMove: this.canMove,
        currentStatus: this.currentStatus,
        blockedUntil: this.movementBlockedUntil,
        timeRemaining: Math.max(0, this.movementBlockedUntil - now),
        lastCheck: this.lastMovementCheck
      }
    },
    
    // Stop the status system
    stop() {
      this.clearStatusTimer()
      this.pendingStatusMessages = []
      this.forceAllowMovement() // Allow movement when stopping
    }
  },
  
  persist: true
}) 