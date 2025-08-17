import { defineStore } from 'pinia'
import { MESSAGE_DURATIONS, MESSAGE_PRIORITIES } from './needs/messageTimingConfig.js'
import { useNeedsQueueStore, DEBUG_STORES } from './needs/needsQueue.js'

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
    
    // Auto-transition timers (not persisted to avoid memory leaks)
    isPaused: false, // Track if guinea pig system is paused
    
    // Non-persisted timer (set in memory only)
    _statusTimer: null, // Timer for status transitions (not persisted)
    
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
    currentEmoji() {
      return this.statusEmojis[this.currentStatus] || '🐹'
    },
    
    currentMessage() {
      const messages = this.statusMessages[this.currentStatus] || []
      return messages[Math.floor(Math.random() * messages.length)] || 'The guinea pig is sitting.'
    }
  },
  
  actions: {
    setInfoField(field, value) {
      if (field in this.info) {
        this.info[field] = value
      }
    },
    
    // Change status and trigger messaging
    async changeStatus(newStatus) {
      if (newStatus === this.currentStatus) {
        return // No change needed
      }
      
      // Special handling for sleep transitions
      if (newStatus === 'sleeping') {
        const shouldAllowSleep = await this.shouldAllowSleepTransition()
        if (!shouldAllowSleep.allowed) {
          DEBUG_STORES() && console.log(`💤 [GUINEAPIG] SLEEP_BLOCK: ${shouldAllowSleep.reason}`)
          // Force movement to seek better sleep location
          newStatus = 'moving'
        }
      }
      
      const oldStatus = this.currentStatus
      this.previousStatus = oldStatus
      this.currentStatus = newStatus
      this.lastStatusChange = Date.now()
      
      DEBUG_STORES() && console.log(`🐹 [GUINEAPIG] STATUS: Changed from ${oldStatus} to ${newStatus}`)
      
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
      // Don't add messages if paused
      if (this.isPaused) {
        DEBUG_STORES() && console.log(`🐹 [GUINEAPIG] TRANSITION: Skipping transition message - system is paused`)
        return
      }
      
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
        DEBUG_STORES() && console.log(`🐹 [GUINEAPIG] TRANSITION: Added transition message: "${message}"`)
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
      // Don't schedule transitions if paused
      if (this.isPaused) {
        DEBUG_STORES() && console.log(`🐹 [GUINEAPIG] SCHEDULE: Skipping transition scheduling - system is paused`)
        return
      }
      
      // Clear any existing timer
      this.clearStatusTimer()
      
      // Set up random transition timing (5-15 seconds)
      const delay = 5000 + Math.random() * 10000
      
      this._statusTimer = setTimeout(() => {
        this.performRandomTransition()
      }, delay)
      
      DEBUG_STORES() && console.log(`🐹 [GUINEAPIG] SCHEDULE: Next transition in ${Math.round(delay/1000)}s`)
    },
    
    // Perform a random status transition with intelligent sleep behavior
    async performRandomTransition() {
      // Don't perform transitions if paused
      if (this.isPaused) {
        DEBUG_STORES() && console.log(`🐹 [GUINEAPIG] TRANSITION: Skipping random transition - system is paused`)
        return
      }
      
      // First, check if we need to proactively handle autonomous behavior
      const autonomyHandled = await this.handleProactiveAutonomousBehavior()
      if (autonomyHandled) {
        return // Autonomous behavior took over, skip normal random transition
      }
      
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
      
      // Simple weighted transitions (autonomy store handles intelligent movement)
      const baseWeights = {
        sitting: 3,
        moving: 2,
        sleeping: 1
      }
      
      // Create weighted array
      const weightedTransitions = []
      possibleTransitions.forEach(status => {
        const weight = baseWeights[status] || 1
        for (let i = 0; i < weight; i++) {
          weightedTransitions.push(status)
        }
      })
      
      // Pick random transition
      if (weightedTransitions.length > 0) {
        const newStatus = weightedTransitions[Math.floor(Math.random() * weightedTransitions.length)]
        await this.changeStatus(newStatus)
      }
    },
    
    // Clear status transition timer
    clearStatusTimer() {
      if (this._statusTimer) {
        clearTimeout(this._statusTimer)
        this._statusTimer = null
      }
    },
    
    // Initialize the guinea pig status system
    initialize() {
      DEBUG_STORES() && console.log(`🐹 [GUINEAPIG] INIT: Initializing guinea pig status system`)
      
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
      // Don't add poop messages if guinea pig is sleeping
      if (this.currentStatus === 'sleeping') {
        DEBUG_STORES() && console.log(`💤 [GUINEAPIG] POOP: Skipping ${type} poop message - guinea pig is sleeping`)
        return
      }
      
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
      DEBUG_STORES() && console.log(`💩 [GUINEAPIG] POOP: Added ${type} poop message: "${message}"`)
    },
    
    // Handle poop creation (called when guinea pig makes poop)
    handlePoopCreated() {
      // Don't show poop messages if guinea pig is sleeping
      if (this.currentStatus === 'sleeping') {
        DEBUG_STORES() && console.log(`💤 [GUINEAPIG] POOP: Skipping poop messages - guinea pig is sleeping`)
        return
      }
      
      const needsQueueStore = useNeedsQueueStore()
      
      // Get random messages for the chain
      const freshMessage = this.poopMessages.fresh[Math.floor(Math.random() * this.poopMessages.fresh.length)]
      const reactionMessage = this.poopMessages.reaction[Math.floor(Math.random() * this.poopMessages.reaction.length)]
      
      const messageChain = [
        {
          text: freshMessage,
          emoji: '💩',
          duration: MESSAGE_DURATIONS.POOP,
          type: 'poop_creation'
        },
        {
          text: reactionMessage,
          emoji: '🐹',
          duration: MESSAGE_DURATIONS.REACTION,
          type: 'reaction'
        }
      ]
      
      // Add the complete chain as a single high-priority unit
      needsQueueStore.addMessageChain(messageChain, 1, 'poop')
      
      DEBUG_STORES() && console.log(`💩 [GUINEAPIG] POOP: Created poop with chain: "${freshMessage}" → "${reactionMessage}"`)
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
        
        DEBUG_STORES() && console.log(`🐹 [GUINEAPIG] MOVEMENT: Blocking movement for ${blockDuration}ms while ${status}`)
      } else if (status === 'moving') {
        // Allow movement when moving
        this.canMove = true
        this.movementBlockedUntil = 0
        
        DEBUG_STORES() && console.log(`🐹 [GUINEAPIG] MOVEMENT: Allowing movement while ${status}`)
      }
    },
    
    // Check if guinea pig can move (called by cage component)
    canGuineaPigMove() {
      const now = Date.now()
      
      // Update movement status if block period has expired
      if (!this.canMove && now >= this.movementBlockedUntil) {
        this.canMove = true
        this.movementBlockedUntil = 0
        DEBUG_STORES() && console.log(`🐹 [GUINEAPIG] MOVEMENT: Movement block expired, allowing movement`)
      }
      
      this.lastMovementCheck = now
      return this.canMove
    },
    
    // Force allow movement (emergency override)
    forceAllowMovement() {
      this.canMove = true
      this.movementBlockedUntil = 0
      DEBUG_STORES() && console.log(`🐹 [GUINEAPIG] MOVEMENT: Force allowing movement (override)`)
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
    
    // Pause the guinea pig status system
    pauseStatusSystem() {
      DEBUG_STORES() && console.log(`🐹 [GUINEAPIG] PAUSE: Pausing guinea pig status system`)
      this.isPaused = true
      this.clearStatusTimer() // Clear any pending transitions
    },
    
    // Resume the guinea pig status system
    resumeStatusSystem() {
      DEBUG_STORES() && console.log(`🐹 [GUINEAPIG] RESUME: Resuming guinea pig status system`)
      this.isPaused = false
      this.scheduleNextTransition() // Resume automatic transitions
    },
    
    // Check if game is paused by looking at cage store
    checkGamePaused() {
      try {
        // Dynamic import to avoid circular dependency
        import('./cage.js').then(({ useCageStore }) => {
          const cageStore = useCageStore()
          if (cageStore.paused && !this.isPaused) {
            this.pauseStatusSystem()
          } else if (!cageStore.paused && this.isPaused) {
            this.resumeStatusSystem()
          }
        })
      } catch (error) {
        // Fallback - continue with current state
        DEBUG_STORES() && console.warn(`🐹 [GUINEAPIG] PAUSE: Could not check cage pause state:`, error)
      }
    },

    // Stop the status system
    stop() {
      this.clearStatusTimer()
      this.pendingStatusMessages = []
      this.isPaused = false
      this.forceAllowMovement() // Allow movement when stopping
    },

    // Intelligent autonomous behavior helper methods

    // Proactively handle autonomous behavior before random transitions
    async handleProactiveAutonomousBehavior() {
      // Don't perform autonomous behavior if system is paused
      if (this.isPaused) {
        DEBUG_STORES() && console.log(`🤖 [GUINEAPIG] PROACTIVE_AUTONOMY: Skipping autonomous behavior - system is paused`)
        return false
      }

      try {
        // Import autonomy store dynamically to avoid circular dependency
        const { useAutonomyStore } = await import('./needs/autonomy.js')
        const autonomyStore = useAutonomyStore()
        
        // Let autonomy store make the decision
        const autonomyResult = await autonomyStore.makeAutonomousDecision()
        
        if (autonomyResult) {
          DEBUG_STORES() && console.log(`🤖 [GUINEAPIG] PROACTIVE_AUTONOMY: Autonomy store handled behavior`)
          return true // Autonomy behavior handled
        }
        
        return false // No autonomous behavior needed
      } catch (error) {
        DEBUG_STORES() && console.warn(`🤖 [GUINEAPIG] PROACTIVE_AUTONOMY: Error with autonomous behavior:`, error)
        return false
      }
    },

    // Detect what item the guinea pig is currently positioned on (works regardless of status)
    async detectCurrentItemPosition() {
      try {
        const { useCageStore } = await import('./cage.js')
        const cageStore = useCageStore()
        
        if (!cageStore.guineaPigPos) return null
        
        const gpX = cageStore.guineaPigPos.x
        const gpY = cageStore.guineaPigPos.y
        
        // Find any item at the guinea pig's current position
        const itemAtPosition = cageStore.items.find(item => 
          item.x === gpX && item.y === gpY
        )
        
        if (itemAtPosition) {
          DEBUG_STORES() && console.log(`🐹 [GUINEAPIG] POSITION: Guinea pig positioned on ${itemAtPosition.name} at (${gpX}, ${gpY})`)
          return itemAtPosition.name
        }
        
        DEBUG_STORES() && console.log(`🐹 [GUINEAPIG] POSITION: Guinea pig on ground at (${gpX}, ${gpY})`)
        return null // On ground
      } catch (error) {
        DEBUG_STORES() && console.warn(`🐹 [GUINEAPIG] POSITION: Could not detect current position:`, error)
        return null
      }
    },

    // Simplified sleep transition check - now works with autonomy store
    async shouldAllowSleepTransition() {
      try {
        const { useSleepStore } = await import('./needs/sleep.js')
        const sleepStore = useSleepStore()
        
        const sleepLevel = sleepStore.currentValue
        
        // Allow sleep if:
        // 1. Sleep is urgent (≤69%) - always allow
        // 2. Sleep is critical (≤50%) - always allow
        // 3. Guinea pig is on a preferred item
        if (sleepLevel <= 69 || sleepLevel <= 50) {
          return { 
            allowed: true, 
            reason: sleepLevel <= 50 ? 'Critical sleep level' : 'Urgent sleep level'
          }
        }
        
        // For higher sleep levels, only allow if on a preferred item
        const currentItem = await this.detectCurrentItemPosition()
        if (currentItem && sleepStore.isPreferredSleepItem(currentItem)) {
          return { allowed: true, reason: `On preferred sleep item: ${currentItem}` }
        }
        
        // Otherwise, sleep level too high for ground sleeping
        return { 
          allowed: false, 
          reason: `Sleep level ${sleepLevel.toFixed(1)}% too high for ground sleeping` 
        }
        
      } catch (error) {
        DEBUG_STORES() && console.warn(`💤 [GUINEAPIG] SLEEP_TRANSITION: Could not check sleep transition rules:`, error)
        return { allowed: true, reason: 'Default allow due to error' }
      }
    }
  },
  
  persist: true
}) 
