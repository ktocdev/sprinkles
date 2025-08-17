import { defineStore } from 'pinia'
import { useNeedsQueueStore, DEBUG_STORES } from './needsQueue.js'
import { getPreferredItemsForNeed, findNearestItemForNeed } from './needsFulfillmentPatterns.js'

export const useAutonomyStore = defineStore('autonomy', {
  state: () => ({
    // Current autonomous behavior state
    currentTarget: null, // { needType, item, x, y }
    isActivelyMoving: false,
    lastDecisionTime: 0,
    decisionInterval: 2000, // Check for new autonomous decisions every 2 seconds
    
    // Movement priorities (higher = more urgent)
    needPriorities: {
      hunger: 100,     // Highest priority - food is critical
      shelter: 90,     // Very high priority - security need
      chew: 80,        // High priority - dental health
      enrichment: 70,  // High priority - mental stimulation
      sleep: 60,       // Medium priority - rest need
      love: 50,        // Medium priority - social need (requires human)
      thirst: 40       // Lower priority - water need
      // Note: hygiene and nails excluded - require user interaction
    },
    
    // Movement thresholds for different needs (when to start seeking)
    movementThresholds: {
      hunger: 70,      // Start seeking food at 70%
      shelter: 60,     // Start seeking shelter at 60%
      chew: 50,        // Start seeking chew items at 50%
      enrichment: 45,  // Start seeking enrichment at 45%
      sleep: 80,       // Start seeking sleep items at 80%
      love: 40,        // Start seeking love at 40%
      thirst: 30       // Start seeking water at 30% (less frequent)
      // Note: hygiene and nails excluded - require user interaction only
    }
  }),

  getters: {
    // Check if guinea pig should be actively seeking items
    shouldBeMoving() {
      return this.currentTarget !== null && this.isActivelyMoving
    },
    
    // Get current movement target info
    currentMovementTarget() {
      return this.currentTarget
    }
  },

  actions: {
    // Main autonomous decision-making method
    async makeAutonomousDecision() {
      const now = Date.now()
      
      // Don't make decisions too frequently
      if (now - this.lastDecisionTime < this.decisionInterval) {
        return false
      }
      
      this.lastDecisionTime = now
      
      try {
        // Check if guinea pig is paused or sleeping
        const guineaPigStore = await this.getGuineaPigStore()
        if (!guineaPigStore || guineaPigStore.isPaused || guineaPigStore.currentStatus === 'sleeping') {
          DEBUG_STORES() && console.log(`🤖 [AUTONOMY] DECISION: Skipping - guinea pig paused or sleeping`)
          return false
        }
        
        // Find the most urgent need that requires autonomous movement
        const urgentNeed = await this.findMostUrgentMovementNeed()
        if (!urgentNeed) {
          // No urgent needs requiring movement
          this.clearCurrentTarget()
          return false
        }
        
        // Check if we're already moving toward this need type
        if (this.currentTarget && this.currentTarget.needType === urgentNeed.needType) {
          // Continue current movement
          return await this.continueCurrentMovement()
        }
        
        // Find best item for this urgent need
        const targetItem = await this.findBestItemForNeed(urgentNeed.needType)
        if (!targetItem) {
          DEBUG_STORES() && console.log(`🤖 [AUTONOMY] DECISION: No suitable items found for ${urgentNeed.needType}`)
          return false
        }
        
        // Set new movement target
        this.setMovementTarget(urgentNeed.needType, targetItem)
        
        // Start autonomous movement
        return await this.executeAutonomousMovement()
        
      } catch (error) {
        DEBUG_STORES() && console.warn(`🤖 [AUTONOMY] DECISION: Error making autonomous decision:`, error)
        return false
      }
    },
    
    // Find the most urgent need that requires physical movement
    async findMostUrgentMovementNeed() {
      try {
        const needsQueueStore = useNeedsQueueStore()
        const allNeeds = needsQueueStore.allNeedsStatus
        
        let mostUrgentNeed = null
        let highestPriority = 0
        
        for (const [needName, needData] of Object.entries(allNeeds)) {
          // Skip needs that don't require physical movement
          if (!this.needPriorities[needName] || !this.movementThresholds[needName]) {
            continue
          }
          
          // Check if need is below movement threshold
          const threshold = this.movementThresholds[needName]
          if (needData.currentValue > threshold) {
            continue
          }
          
          // Calculate priority based on urgency and need priority
          const urgencyFactor = 100 - needData.currentValue // Higher when need is lower
          const needPriority = this.needPriorities[needName]
          const totalPriority = urgencyFactor * (needPriority / 100)
          
          if (totalPriority > highestPriority) {
            highestPriority = totalPriority
            mostUrgentNeed = {
              needType: needName,
              currentValue: needData.currentValue,
              priority: totalPriority,
              threshold: threshold
            }
          }
        }
        
        if (mostUrgentNeed) {
          DEBUG_STORES() && console.log(`🤖 [AUTONOMY] URGENT_NEED: ${mostUrgentNeed.needType} at ${mostUrgentNeed.currentValue}% (priority: ${mostUrgentNeed.priority.toFixed(1)})`)
        }
        
        return mostUrgentNeed
      } catch (error) {
        DEBUG_STORES() && console.warn(`🤖 [AUTONOMY] URGENT_NEED: Error finding urgent need:`, error)
        return null
      }
    },
    
    // Find the best item for a specific need
    async findBestItemForNeed(needType) {
      try {
        const cageStore = await this.getCageStore()
        if (!cageStore?.guineaPigPos) return null
        
        const bestItem = findNearestItemForNeed(
          needType,
          cageStore.guineaPigPos.x,
          cageStore.guineaPigPos.y,
          cageStore
        )
        
        if (bestItem) {
          DEBUG_STORES() && console.log(`🤖 [AUTONOMY] TARGET: Found ${bestItem.name} for ${needType} at (${bestItem.x}, ${bestItem.y}) distance ${bestItem.distance}, quality ${bestItem.quality}`)
        }
        
        return bestItem
      } catch (error) {
        DEBUG_STORES() && console.warn(`🤖 [AUTONOMY] TARGET: Error finding item for ${needType}:`, error)
        return null
      }
    },
    
    // Set movement target
    setMovementTarget(needType, targetItem) {
      this.currentTarget = {
        needType,
        item: targetItem,
        x: targetItem.x,
        y: targetItem.y
      }
      this.isActivelyMoving = true
      
      DEBUG_STORES() && console.log(`🤖 [AUTONOMY] TARGET_SET: Moving toward ${targetItem.name} for ${needType} at (${targetItem.x}, ${targetItem.y})`)
    },
    
    // Clear current movement target
    clearCurrentTarget() {
      this.currentTarget = null
      this.isActivelyMoving = false
      DEBUG_STORES() && console.log(`🤖 [AUTONOMY] TARGET_CLEAR: Cleared movement target`)
    },
    
    // Execute autonomous movement toward current target
    async executeAutonomousMovement() {
      if (!this.currentTarget) return false
      
      try {
        const cageStore = await this.getCageStore()
        const guineaPigStore = await this.getGuineaPigStore()
        
        if (!cageStore?.guineaPigPos || !guineaPigStore) return false
        
        const currentX = cageStore.guineaPigPos.x
        const currentY = cageStore.guineaPigPos.y
        const targetX = this.currentTarget.x
        const targetY = this.currentTarget.y
        
        // Check if already at target
        if (currentX === targetX && currentY === targetY) {
          DEBUG_STORES() && console.log(`🤖 [AUTONOMY] MOVEMENT: Reached ${this.currentTarget.item.name}! Transitioning based on need type...`)
          await this.handleReachedTarget()
          return true
        }
        
        // Force guinea pig to moving status if not already
        if (guineaPigStore.currentStatus !== 'moving') {
          await guineaPigStore.changeStatus('moving')
        }
        
        // Calculate next move (Manhattan pathfinding)
        let newX = currentX
        let newY = currentY
        
        // Move horizontally first, then vertically
        if (currentX < targetX) {
          newX = currentX + 1
        } else if (currentX > targetX) {
          newX = currentX - 1
        } else if (currentY < targetY) {
          newY = currentY + 1
        } else if (currentY > targetY) {
          newY = currentY - 1
        }
        
        // Move guinea pig to new position
        if (newX !== currentX || newY !== currentY) {
          cageStore.setGuineaPigPos(newX, newY)
          DEBUG_STORES() && console.log(`🤖 [AUTONOMY] MOVEMENT: Moving toward ${this.currentTarget.item.name} from (${currentX}, ${currentY}) to (${newX}, ${newY})`)
          
          // Check if we've reached the target
          if (newX === targetX && newY === targetY) {
            DEBUG_STORES() && console.log(`🤖 [AUTONOMY] MOVEMENT: Reached ${this.currentTarget.item.name}! Handling arrival...`)
            setTimeout(async () => {
              await this.handleReachedTarget()
            }, 1000) // Small delay to let movement settle
          }
          
          return true
        }
        
        return false
      } catch (error) {
        DEBUG_STORES() && console.warn(`🤖 [AUTONOMY] MOVEMENT: Error executing movement:`, error)
        return false
      }
    },
    
    // Continue current movement (check if still valid)
    async continueCurrentMovement() {
      if (!this.currentTarget) return false
      
      // Check if the need is still urgent enough to continue
      const needsQueueStore = useNeedsQueueStore()
      const needData = needsQueueStore.allNeedsStatus[this.currentTarget.needType]
      
      if (!needData) {
        this.clearCurrentTarget()
        return false
      }
      
      const threshold = this.movementThresholds[this.currentTarget.needType]
      if (needData.currentValue > threshold) {
        DEBUG_STORES() && console.log(`🤖 [AUTONOMY] CONTINUE: ${this.currentTarget.needType} no longer urgent (${needData.currentValue}% > ${threshold}%), stopping movement`)
        this.clearCurrentTarget()
        return false
      }
      
      // Continue movement
      return await this.executeAutonomousMovement()
    },
    
    // Handle reaching the target item
    async handleReachedTarget() {
      if (!this.currentTarget) return
      
      const needType = this.currentTarget.needType
      
      try {
        // Handle different need types when reached
        if (needType === 'sleep') {
          const guineaPigStore = await this.getGuineaPigStore()
          if (guineaPigStore) {
            await guineaPigStore.changeStatus('sleeping')
          }
        } else if (needType === 'hunger') {
          // Automatically consume the food item
          const hungerStore = await this.getHungerStore()
          const foodItemName = this.currentTarget.item.name
          
          if (hungerStore && foodItemName) {
            DEBUG_STORES() && console.log(`🤖 [AUTONOMY] REACHED: At ${foodItemName}, attempting to eat...`)
            
            // Try to fulfill hunger with this food item
            const result = hungerStore.fulfill(foodItemName)
            
            if (result.success) {
              DEBUG_STORES() && console.log(`🤖 [AUTONOMY] EATING: Successfully ate ${foodItemName}, hunger improved by ${result.improvement}`)
              
              // Remove the food item from the cage since it's been consumed
              const cageStore = await this.getCageStore()
              if (cageStore) {
                // Find and remove the food item at the current position
                const itemIndex = cageStore.items.findIndex(item => 
                  item.x === this.currentTarget.x && 
                  item.y === this.currentTarget.y && 
                  item.name === foodItemName
                )
                
                if (itemIndex !== -1) {
                  cageStore.items.splice(itemIndex, 1)
                  DEBUG_STORES() && console.log(`🤖 [AUTONOMY] EATING: Removed ${foodItemName} from cage`)
                }
              }
            } else {
              DEBUG_STORES() && console.log(`🤖 [AUTONOMY] EATING: Failed to eat ${foodItemName}: ${result.message}`)
            }
          }
        } else if (needType === 'thirst') {
          // Automatically drink from the water bottle
          const thirstStore = await this.getThirstStore()
          
          if (thirstStore) {
            DEBUG_STORES() && console.log(`🤖 [AUTONOMY] REACHED: At water bottle, attempting to drink...`)
            
            // Try to fulfill thirst from water bottle
            const result = thirstStore.fulfill('water_bottle_fixed')
            
            if (result.success) {
              DEBUG_STORES() && console.log(`🤖 [AUTONOMY] DRINKING: Successfully drank water, thirst improved by ${result.improvement}`)
            } else {
              DEBUG_STORES() && console.log(`🤖 [AUTONOMY] DRINKING: Failed to drink water: ${result.message}`)
            }
          }
        } else {
          // For other needs, just position the guinea pig at the item
          DEBUG_STORES() && console.log(`🤖 [AUTONOMY] REACHED: At ${this.currentTarget.item.name} for ${needType}`)
        }
        
        // Clear the target since we've reached it
        this.clearCurrentTarget()
        
      } catch (error) {
        DEBUG_STORES() && console.warn(`🤖 [AUTONOMY] REACHED: Error handling reached target:`, error)
        this.clearCurrentTarget()
      }
    },
    
    // Force stop autonomous movement
    stopAutonomousMovement() {
      this.clearCurrentTarget()
      DEBUG_STORES() && console.log(`🤖 [AUTONOMY] STOP: Autonomous movement stopped`)
    },
    
    // Update movement priorities (for customization)
    updateNeedPriority(needType, priority) {
      if (this.needPriorities.hasOwnProperty(needType)) {
        this.needPriorities[needType] = priority
        DEBUG_STORES() && console.log(`🤖 [AUTONOMY] PRIORITY: Updated ${needType} priority to ${priority}`)
      }
    },
    
    // Update movement threshold (for customization)
    updateMovementThreshold(needType, threshold) {
      if (this.movementThresholds.hasOwnProperty(needType)) {
        this.movementThresholds[needType] = threshold
        DEBUG_STORES() && console.log(`🤖 [AUTONOMY] THRESHOLD: Updated ${needType} threshold to ${threshold}%`)
      }
    },
    
    // Helper methods to get other stores (async imports to avoid circular dependencies)
    async getGuineaPigStore() {
      try {
        const { useGuineaPigStore } = await import('../../guineaPig.js')
        return useGuineaPigStore()
      } catch (error) {
        DEBUG_STORES() && console.warn(`🤖 [AUTONOMY] STORE: Could not get guinea pig store:`, error)
        return null
      }
    },
    
    async getCageStore() {
      try {
        const { useCageStore } = await import('../../cage.js')
        return useCageStore()
      } catch (error) {
        DEBUG_STORES() && console.warn(`🤖 [AUTONOMY] STORE: Could not get cage store:`, error)
        return null
      }
    },
    
    async getHungerStore() {
      try {
        const { useHungerStore } = await import('../individual/hunger.js')
        return useHungerStore()
      } catch (error) {
        DEBUG_STORES() && console.warn(`🤖 [AUTONOMY] STORE: Could not get hunger store:`, error)
        return null
      }
    },
    
    async getThirstStore() {
      try {
        const { useThirstStore } = await import('../individual/thirst.js')
        return useThirstStore()
      } catch (error) {
        DEBUG_STORES() && console.warn(`🤖 [AUTONOMY] STORE: Could not get thirst store:`, error)
        return null
      }
    },
    
    // Get current autonomous status for debugging
    getAutonomyStatus() {
      return {
        hasTarget: !!this.currentTarget,
        targetNeed: this.currentTarget?.needType || null,
        targetItem: this.currentTarget?.item?.name || null,
        targetPosition: this.currentTarget ? { x: this.currentTarget.x, y: this.currentTarget.y } : null,
        isMoving: this.isActivelyMoving,
        lastDecision: this.lastDecisionTime,
        nextDecision: this.lastDecisionTime + this.decisionInterval
      }
    }
  },

  persist: true
})