import { defineStore } from 'pinia'

export const useGameControllerStore = defineStore('gameController', {
  state: () => ({
    // Game state management
    isGameActive: true,
    isPaused: false,
    pauseReason: null, // 'hidden', 'idle', 'manual', 'mobile_background'
    
    // Page visibility tracking
    isPageVisible: true,
    lastVisibilityChange: Date.now(),
    
    // User interaction tracking
    lastUserInteraction: Date.now(),
    idleTimeout: 5 * 60 * 1000, // 5 minutes in milliseconds
    isUserIdle: false,
    
    // Mobile/performance detection
    isMobileDevice: false,
    isLowPowerMode: false,
    performanceMode: 'normal', // 'normal', 'power_saver', 'background'
    
    // State recovery tracking
    pausedAt: null,
    resumedAt: null,
    pauseDuration: 0,
    
    // Performance monitoring
    performanceMetrics: {
      intervalMisses: 0,
      pauseCount: 0,
      resumeCount: 0,
      lastPerformanceCheck: Date.now()
    },
    
    // Subsystem tracking
    pausedSubsystems: new Set(),
    
    // Event listeners (not persisted)
    _visibilityListener: null,
    _interactionListeners: [],
    _idleTimer: null
  }),

  getters: {
    shouldGameBePaused() {
      return !this.isPageVisible || this.isUserIdle || this.isPaused
    },
    
    currentPauseReasons() {
      const reasons = []
      if (!this.isPageVisible) reasons.push('page_hidden')
      if (this.isUserIdle) reasons.push('user_idle')
      if (this.isPaused) reasons.push(this.pauseReason || 'manual')
      return reasons
    },
    
    timeSinceLastInteraction() {
      return Date.now() - this.lastUserInteraction
    },
    
    isInBackgroundMode() {
      return !this.isPageVisible && this.performanceMode === 'background'
    },
    
    shouldUsePowerSaver() {
      return this.isMobileDevice || this.isLowPowerMode || this.performanceMode === 'power_saver'
    }
  },

  actions: {
    // Initialize the game controller
    initialize() {
      console.log('🎮 [GAME_CONTROLLER] Initializing game controller')
      
      // Detect mobile device
      this.detectMobileDevice()
      
      // Set up event listeners
      this.setupVisibilityListener()
      this.setupInteractionListeners()
      this.setupIdleTimer()
      
      // Initialize performance mode
      this.updatePerformanceMode()
      
      // Start performance monitoring
      this.startPerformanceMonitoring()
      
      // Start with game active
      this.isGameActive = true
      this.isPaused = false
      
      console.log(`🎮 [GAME_CONTROLLER] Initialized: mobile=${this.isMobileDevice}, mode=${this.performanceMode}`)
    },
    
    // Clean up when stopping
    cleanup() {
      console.log('🎮 [GAME_CONTROLLER] Cleaning up game controller')
      
      this.removeVisibilityListener()
      this.removeInteractionListeners()
      this.clearIdleTimer()
      this.stopPerformanceMonitoring()
      
      this.pausedSubsystems.clear()
    },
    
    // Pause the entire game system
    async pauseGame(reason = 'manual') {
      if (this.isPaused && this.pauseReason === reason) {
        return // Already paused for this reason
      }
      
      console.log(`🎮 [GAME_CONTROLLER] Pausing game: ${reason}`)
      
      this.isPaused = true
      this.pauseReason = reason
      this.pausedAt = Date.now()
      this.performanceMetrics.pauseCount++
      
      // Update performance mode based on pause reason
      if (reason === 'hidden') {
        this.performanceMode = 'background'
      } else if (reason === 'idle' || reason === 'mobile_background') {
        this.performanceMode = 'power_saver'
      }
      
      // Pause all subsystems
      await this.pauseAllSubsystems()
      
      console.log(`🎮 [GAME_CONTROLLER] Game paused: ${reason}, mode: ${this.performanceMode}`)
    },
    
    // Resume the entire game system
    async resumeGame() {
      if (!this.isPaused) {
        return // Already running
      }
      
      console.log(`🎮 [GAME_CONTROLLER] Resuming game from: ${this.pauseReason}`)
      
      const now = Date.now()
      if (this.pausedAt) {
        this.pauseDuration = now - this.pausedAt
      }
      
      const previousReason = this.pauseReason
      this.isPaused = false
      this.pauseReason = null
      this.resumedAt = now
      this.performanceMetrics.resumeCount++
      
      // Reset performance mode
      this.updatePerformanceMode()
      
      // Perform state recovery before resuming subsystems
      await this.performStateRecovery(previousReason)
      
      // Resume all subsystems
      await this.resumeAllSubsystems()
      
      console.log(`🎮 [GAME_CONTROLLER] Game resumed from ${previousReason}, pause duration: ${this.pauseDuration}ms`)
    },
    
    // Perform state recovery when resuming from pause
    performStateRecovery(pauseReason) {
      console.log(`🎮 [GAME_CONTROLLER] RECOVERY: Performing state recovery for pause reason: ${pauseReason}`)
      
      try {
        // Recovery based on pause reason and duration
        if (this.pauseDuration > 60000) { // More than 1 minute
          console.log(`🎮 [GAME_CONTROLLER] RECOVERY: Long pause detected (${this.pauseDuration}ms), performing full recovery`)
          this.performFullStateRecovery()
        } else if (this.pauseDuration > 10000) { // More than 10 seconds
          console.log(`🎮 [GAME_CONTROLLER] RECOVERY: Medium pause detected (${this.pauseDuration}ms), performing partial recovery`)
          this.performPartialStateRecovery()
        } else {
          console.log(`🎮 [GAME_CONTROLLER] RECOVERY: Short pause detected (${this.pauseDuration}ms), minimal recovery needed`)
          this.performMinimalStateRecovery()
        }
      } catch (error) {
        console.warn(`🎮 [GAME_CONTROLLER] RECOVERY: Error during state recovery:`, error)
      }
    },
    
    // Full state recovery for long pauses
    async performFullStateRecovery() {
      try {
        // Clear all message queues to prevent backlog
        const { useNeedsQueueStore } = await import('./needs/core/needsQueue.js')
        const needsQueueStore = useNeedsQueueStore()
        needsQueueStore.clearAllMessages()
        
        // Reset guinea pig to sitting state
        const { useGuineaPigStore } = await import('./guineaPig.js')
        const guineaPigStore = useGuineaPigStore()
        if (guineaPigStore.currentStatus !== 'sitting') {
          await guineaPigStore.changeStatus('sitting')
        }
        
        // Stop any ongoing autonomous movement
        const { useAutonomyStore } = await import('./needs/core/autonomy.js')
        const autonomyStore = useAutonomyStore()
        autonomyStore.stopAutonomousMovement()
        
        console.log(`🎮 [GAME_CONTROLLER] RECOVERY: Full state recovery completed`)
      } catch (error) {
        console.warn(`🎮 [GAME_CONTROLLER] RECOVERY: Error in full recovery:`, error)
      }
    },
    
    // Partial state recovery for medium pauses
    async performPartialStateRecovery() {
      try {
        // Clear accumulated messages but keep current state
        const { useNeedsQueueStore } = await import('./needs/core/needsQueue.js')
        const needsQueueStore = useNeedsQueueStore()
        
        // Clear ambient and low-priority messages but keep important ones
        needsQueueStore.clearMessagesOfType('ambient')
        
        // Reset autonomy decisions but don't interrupt current movement
        const { useAutonomyStore } = await import('./needs/core/autonomy.js')
        const autonomyStore = useAutonomyStore()
        autonomyStore.lastDecisionTime = 0 // Force new decision on next cycle
        
        console.log(`🎮 [GAME_CONTROLLER] RECOVERY: Partial state recovery completed`)
      } catch (error) {
        console.warn(`🎮 [GAME_CONTROLLER] RECOVERY: Error in partial recovery:`, error)
      }
    },
    
    // Minimal state recovery for short pauses
    async performMinimalStateRecovery() {
      try {
        // Just reset timing baselines to prevent catch-up effects
        const { useNeedsQueueStore } = await import('./needs/core/needsQueue.js')
        const needsQueueStore = useNeedsQueueStore()
        needsQueueStore.lastUpdate = Date.now()
        
        // Reset user interaction timestamp
        this.recordUserInteraction()
        
        console.log(`🎮 [GAME_CONTROLLER] RECOVERY: Minimal state recovery completed`)
      } catch (error) {
        console.warn(`🎮 [GAME_CONTROLLER] RECOVERY: Error in minimal recovery:`, error)
      }
    },
    
    // Pause all game subsystems
    async pauseAllSubsystems() {
      // Import stores dynamically to avoid circular dependencies
      await this.pauseSubsystem('needsQueue', async () => {
        const { useNeedsQueueStore } = await import('./needs/core/needsQueue.js')
        const needsQueueStore = useNeedsQueueStore()
        needsQueueStore.pauseNeedsSystem()
        
        // Clear message queue to prevent backlog
        needsQueueStore.clearAllMessages()
      })
      
      await this.pauseSubsystem('guineaPig', async () => {
        const { useGuineaPigStore } = await import('./guineaPig.js')
        const guineaPigStore = useGuineaPigStore()
        guineaPigStore.pauseStatusSystem()
        
        // Clear pending status messages
        guineaPigStore.clearProcessedStatusMessages()
      })
      
      await this.pauseSubsystem('autonomy', async () => {
        const { useAutonomyStore } = await import('./needs/core/autonomy.js')
        const autonomyStore = useAutonomyStore()
        autonomyStore.pauseAutonomy()
      })
    },
    
    // Resume all game subsystems
    async resumeAllSubsystems() {
      await this.resumeSubsystem('needsQueue', async () => {
        const { useNeedsQueueStore } = await import('./needs/core/needsQueue.js')
        const needsQueueStore = useNeedsQueueStore()
        needsQueueStore.resumeNeedsSystem()
      })
      
      await this.resumeSubsystem('guineaPig', async () => {
        const { useGuineaPigStore } = await import('./guineaPig.js')
        const guineaPigStore = useGuineaPigStore()
        guineaPigStore.resumeStatusSystem()
      })
      
      await this.resumeSubsystem('autonomy', async () => {
        const { useAutonomyStore } = await import('./needs/core/autonomy.js')
        const autonomyStore = useAutonomyStore()
        autonomyStore.resumeAutonomy()
      })
    },
    
    // Helper to pause a specific subsystem
    async pauseSubsystem(name, pauseFunction) {
      if (this.pausedSubsystems.has(name)) {
        return // Already paused
      }
      
      try {
        await pauseFunction()
        this.pausedSubsystems.add(name)
        console.log(`🎮 [GAME_CONTROLLER] Paused subsystem: ${name}`)
      } catch (error) {
        console.warn(`🎮 [GAME_CONTROLLER] Failed to pause ${name}:`, error)
      }
    },
    
    // Helper to resume a specific subsystem  
    async resumeSubsystem(name, resumeFunction) {
      if (!this.pausedSubsystems.has(name)) {
        return // Not paused
      }
      
      try {
        await resumeFunction()
        this.pausedSubsystems.delete(name)
        console.log(`🎮 [GAME_CONTROLLER] Resumed subsystem: ${name}`)
      } catch (error) {
        console.warn(`🎮 [GAME_CONTROLLER] Failed to resume ${name}:`, error)
      }
    },
    
    // Set up page visibility listener
    setupVisibilityListener() {
      if (typeof document === 'undefined') return
      
      this._visibilityListener = () => {
        const wasVisible = this.isPageVisible
        this.isPageVisible = !document.hidden
        this.lastVisibilityChange = Date.now()
        
        console.log(`🎮 [GAME_CONTROLLER] Page visibility changed: ${this.isPageVisible ? 'visible' : 'hidden'}`)
        
        if (!this.isPageVisible && wasVisible) {
          // Page became hidden
          this.pauseGame('hidden')
        } else if (this.isPageVisible && !wasVisible) {
          // Page became visible
          if (this.pauseReason === 'hidden') {
            this.resumeGame()
          }
          // Reset user interaction timer when page becomes visible
          this.recordUserInteraction()
        }
      }
      
      document.addEventListener('visibilitychange', this._visibilityListener)
    },
    
    // Remove page visibility listener
    removeVisibilityListener() {
      if (this._visibilityListener && typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', this._visibilityListener)
        this._visibilityListener = null
      }
    },
    
    // Set up user interaction listeners
    setupInteractionListeners() {
      if (typeof document === 'undefined') return
      
      const interactionEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart']
      
      const interactionHandler = () => {
        this.recordUserInteraction()
      }
      
      interactionEvents.forEach(eventType => {
        document.addEventListener(eventType, interactionHandler, { passive: true })
        this._interactionListeners.push({ eventType, handler: interactionHandler })
      })
    },
    
    // Remove user interaction listeners
    removeInteractionListeners() {
      if (typeof document === 'undefined') return
      
      this._interactionListeners.forEach(({ eventType, handler }) => {
        document.removeEventListener(eventType, handler)
      })
      this._interactionListeners = []
    },
    
    // Record user interaction
    recordUserInteraction() {
      const wasIdle = this.isUserIdle
      this.lastUserInteraction = Date.now()
      this.isUserIdle = false
      
      // Resume game if it was paused due to idle
      if (wasIdle && this.pauseReason === 'idle') {
        this.resumeGame()
      }
      
      // Reset idle timer
      this.resetIdleTimer()
    },
    
    // Set up idle detection timer
    setupIdleTimer() {
      this.resetIdleTimer()
    },
    
    // Reset idle detection timer
    resetIdleTimer() {
      this.clearIdleTimer()
      
      this._idleTimer = setTimeout(() => {
        if (!this.isUserIdle && this.isPageVisible) {
          console.log(`🎮 [GAME_CONTROLLER] User idle after ${this.idleTimeout}ms`)
          this.isUserIdle = true
          this.pauseGame('idle')
        }
      }, this.idleTimeout)
    },
    
    // Clear idle detection timer
    clearIdleTimer() {
      if (this._idleTimer) {
        clearTimeout(this._idleTimer)
        this._idleTimer = null
      }
    },
    
    // Detect if running on mobile device
    detectMobileDevice() {
      if (typeof navigator === 'undefined') return
      
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = ['mobile', 'iphone', 'ipad', 'android', 'windows phone']
      
      this.isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword))
      
      // Also check for touch capability
      if (!this.isMobileDevice && 'ontouchstart' in window) {
        this.isMobileDevice = true
      }
      
      // Mobile-specific optimizations
      if (this.isMobileDevice) {
        // Shorter idle timeout on mobile (2 minutes instead of 5)
        this.idleTimeout = 2 * 60 * 1000
        
        // Enable low power mode by default on mobile
        this.isLowPowerMode = true
        
        // Set up mobile-specific event listeners
        this.setupMobileOptimizations()
      }
      
      console.log(`🎮 [GAME_CONTROLLER] Mobile device detected: ${this.isMobileDevice}, idle timeout: ${this.idleTimeout}ms`)
    },
    
    // Set up mobile-specific optimizations
    setupMobileOptimizations() {
      if (typeof document === 'undefined') return
      
      // Listen for page visibility changes more aggressively on mobile
      document.addEventListener('freeze', () => {
        console.log('🎮 [GAME_CONTROLLER] Mobile: Page frozen')
        this.pauseGame('mobile_background')
      }, { passive: true })
      
      document.addEventListener('resume', () => {
        console.log('🎮 [GAME_CONTROLLER] Mobile: Page resumed')
        if (this.pauseReason === 'mobile_background') {
          this.resumeGame()
        }
      }, { passive: true })
      
      // Listen for app going to background on mobile
      if ('serviceWorker' in navigator) {
        window.addEventListener('beforeunload', () => {
          // Force pause when mobile app is closing/backgrounding
          this.pauseGame('mobile_background')
        })
      }
      
      // Battery API for power management (if available)
      if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
          const checkBatteryLevel = () => {
            // Enable power saver mode when battery is low
            if (battery.level < 0.2 && !this.isLowPowerMode) {
              console.log('🎮 [GAME_CONTROLLER] Mobile: Low battery detected, enabling power saver mode')
              this.isLowPowerMode = true
              this.updatePerformanceMode()
            } else if (battery.level > 0.5 && this.isLowPowerMode && !this.isMobileDevice) {
              // Only auto-disable on non-mobile devices
              this.isLowPowerMode = false
              this.updatePerformanceMode()
            }
          }
          
          battery.addEventListener('levelchange', checkBatteryLevel)
          battery.addEventListener('chargingchange', checkBatteryLevel)
          checkBatteryLevel() // Initial check
        }).catch(() => {
          // Battery API not supported, continue without it
        })
      }
      
      // Orientation change detection for mobile
      window.addEventListener('orientationchange', () => {
        console.log('🎮 [GAME_CONTROLLER] Mobile: Orientation changed')
        // Brief pause to allow layout changes
        this.pauseGame('mobile_background')
        setTimeout(() => {
          if (this.pauseReason === 'mobile_background') {
            this.resumeGame()
          }
        }, 1000)
      })
    },
    
    // Update performance mode based on current conditions
    updatePerformanceMode() {
      let newMode = 'normal'
      
      if (!this.isPageVisible) {
        newMode = 'background'
      } else if (this.isMobileDevice || this.isLowPowerMode) {
        newMode = 'power_saver'
      }
      
      if (newMode !== this.performanceMode) {
        console.log(`🎮 [GAME_CONTROLLER] Performance mode changed: ${this.performanceMode} → ${newMode}`)
        this.performanceMode = newMode
      }
    },
    
    // Toggle low power mode manually
    toggleLowPowerMode() {
      this.isLowPowerMode = !this.isLowPowerMode
      this.updatePerformanceMode()
      console.log(`🎮 [GAME_CONTROLLER] Low power mode: ${this.isLowPowerMode}`)
    },
    
    // Get current game state for debugging
    getGameState() {
      return {
        isGameActive: this.isGameActive,
        isPaused: this.isPaused,
        pauseReason: this.pauseReason,
        isPageVisible: this.isPageVisible,
        isUserIdle: this.isUserIdle,
        timeSinceLastInteraction: this.timeSinceLastInteraction,
        performanceMode: this.performanceMode,
        pausedSubsystems: Array.from(this.pausedSubsystems),
        performanceMetrics: { ...this.performanceMetrics },
        deviceInfo: {
          isMobileDevice: this.isMobileDevice,
          isLowPowerMode: this.isLowPowerMode,
          idleTimeout: this.idleTimeout
        },
        pauseHistory: {
          pausedAt: this.pausedAt,
          resumedAt: this.resumedAt,
          pauseDuration: this.pauseDuration
        }
      }
    },
    
    // Start performance monitoring
    startPerformanceMonitoring() {
      // Monitor for interval timing issues
      this._performanceMonitor = setInterval(() => {
        this.checkPerformanceMetrics()
      }, 5000) // Check every 5 seconds
      
      console.log(`🎮 [GAME_CONTROLLER] MONITOR: Performance monitoring started`)
    },
    
    // Stop performance monitoring
    stopPerformanceMonitoring() {
      if (this._performanceMonitor) {
        clearInterval(this._performanceMonitor)
        this._performanceMonitor = null
      }
    },
    
    // Check performance metrics and log issues
    checkPerformanceMetrics() {
      const now = Date.now()
      const timeSinceLastCheck = now - this.performanceMetrics.lastPerformanceCheck
      
      // Check if we missed expected performance checks (should be ~5000ms)
      if (timeSinceLastCheck > 7000) { // Allow some tolerance
        this.performanceMetrics.intervalMisses++
        console.warn(`🎮 [GAME_CONTROLLER] MONITOR: Performance check missed by ${timeSinceLastCheck - 5000}ms`)
        
        // If we're getting a lot of misses, the browser is throttling
        if (this.performanceMetrics.intervalMisses > 3) {
          console.warn(`🎮 [GAME_CONTROLLER] MONITOR: High interval miss count (${this.performanceMetrics.intervalMisses}), browser may be throttling`)
          
          // Auto-enable power saver mode if not mobile (mobile already has it)
          if (!this.isMobileDevice && !this.isLowPowerMode) {
            console.log(`🎮 [GAME_CONTROLLER] MONITOR: Auto-enabling power saver mode due to throttling`)
            this.toggleLowPowerMode()
          }
        }
      }
      
      this.performanceMetrics.lastPerformanceCheck = now
      
      // Log performance summary occasionally
      if (this.performanceMetrics.pauseCount % 10 === 0 && this.performanceMetrics.pauseCount > 0) {
        this.logPerformanceSummary()
      }
    },
    
    // Log detailed performance summary
    logPerformanceSummary() {
      const uptime = Date.now() - this.performanceMetrics.lastPerformanceCheck
      console.log(`🎮 [GAME_CONTROLLER] MONITOR: Performance Summary:`)
      console.log(`  Pause/Resume cycles: ${this.performanceMetrics.pauseCount}/${this.performanceMetrics.resumeCount}`)
      console.log(`  Interval misses: ${this.performanceMetrics.intervalMisses}`)
      console.log(`  Current mode: ${this.performanceMode}`)
      console.log(`  Mobile device: ${this.isMobileDevice}`)
      console.log(`  Low power mode: ${this.isLowPowerMode}`)
      console.log(`  Last pause duration: ${this.pauseDuration}ms`)
    },
    
    // Get detailed performance report
    getPerformanceReport() {
      const now = Date.now()
      return {
        timestamp: now,
        uptime: now - this.performanceMetrics.lastPerformanceCheck,
        gameState: this.getGameState(),
        performanceIssues: {
          intervalMisses: this.performanceMetrics.intervalMisses,
          averagePauseDuration: this.pauseDuration,
          throttlingDetected: this.performanceMetrics.intervalMisses > 3
        },
        browserInfo: {
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
          language: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
          cookieEnabled: typeof navigator !== 'undefined' ? navigator.cookieEnabled : false,
          onLine: typeof navigator !== 'undefined' ? navigator.onLine : true
        },
        recommendations: this.getPerformanceRecommendations()
      }
    },
    
    // Get performance recommendations based on current state
    getPerformanceRecommendations() {
      const recommendations = []
      
      if (this.performanceMetrics.intervalMisses > 3) {
        recommendations.push('Browser is throttling intervals - consider enabling power saver mode')
      }
      
      if (this.isMobileDevice && !this.isLowPowerMode) {
        recommendations.push('Mobile device detected - consider enabling power saver mode for better battery life')
      }
      
      if (this.pauseDuration > 300000) { // 5 minutes
        recommendations.push('Long pause detected - consider refreshing the page for optimal performance')
      }
      
      if (!this.isPageVisible && this.performanceMode !== 'background') {
        recommendations.push('Page is hidden but not in background mode - check visibility API integration')
      }
      
      if (this.timeSinceLastInteraction > this.idleTimeout * 2) {
        recommendations.push('User has been idle for a very long time - consider showing a re-engagement prompt')
      }
      
      return recommendations
    },
    
    // Force pause for development/debugging
    forcePause(reason = 'manual') {
      this.pauseGame(reason)
    },
    
    // Force resume for development/debugging
    forceResume() {
      this.resumeGame()
    }
  },

  persist: {
    storage: sessionStorage, // Use session storage to reset on new browser sessions
    paths: [
      'idleTimeout',
      'performanceMode',
      'isLowPowerMode',
      'performanceMetrics'
    ]
  }
})