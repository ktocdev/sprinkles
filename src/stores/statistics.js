import { defineStore } from 'pinia'

export const useStatisticsStore = defineStore('statistics', {
  state: () => ({
    // Session tracking
    sessions: {
      currentSessionStart: null,
      totalPlayTime: 0, // Total milliseconds played across all sessions
      sessionCount: 0,
      isActive: false
    },

    // Action tracking with extensible structure
    actions: {
      // Food consumption tracking by type
      foodConsumed: {
        hay: { count: 0, totalImprovement: 0 },
        pellets: { count: 0, totalImprovement: 0 },
        lettuce: { count: 0, totalImprovement: 0 },
        blueberries: { count: 0, totalImprovement: 0 },
        carrots: { count: 0, totalImprovement: 0 },
        cucumbers: { count: 0, totalImprovement: 0 }
      },
      
      // Poop system tracking
      poopsCreated: { count: 0 },
      poopsCleaned: { count: 0, individual: 0, bulk: 0 },
      
      // Future extensible actions can be added here
      // movementActions: { count: 0 },
      // playActions: { count: 0 },
    },

    // Achievement/progress tracking (for future points system)
    progression: {
      level: 1,
      experience: 0,
      experienceToNextLevel: 100,
      totalPoints: 0,
      // Point values for different actions (configurable for balancing)
      pointsPerAction: {
        feedingGuineaPig: 10,
        cleaningPoop: 5,
        bulkCleaning: 15
      }
    },

    // Milestones and achievements (extensible)
    achievements: {
      firstFeeding: { unlocked: false, timestamp: null },
      firstCleaning: { unlocked: false, timestamp: null },
      hunterGatherer: { unlocked: false, timestamp: null, requirement: 50 }, // 50 foods consumed
      cleaningExpert: { unlocked: false, timestamp: null, requirement: 100 }, // 100 poops cleaned
      dedicated: { unlocked: false, timestamp: null, requirement: 3600000 } // 1 hour play time
    }
  }),

  getters: {
    // Format total play time in human readable format
    formattedPlayTime() {
      const totalMs = this.sessions.totalPlayTime + this.currentSessionDuration
      const hours = Math.floor(totalMs / (1000 * 60 * 60))
      const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((totalMs % (1000 * 60)) / 1000)
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`
      } else {
        return `${seconds}s`
      }
    },

    // Get current session duration
    currentSessionDuration() {
      if (!this.sessions.isActive || !this.sessions.currentSessionStart) {
        return 0
      }
      return Date.now() - this.sessions.currentSessionStart
    },

    // Total food consumed across all types
    totalFoodConsumed() {
      return Object.values(this.actions.foodConsumed).reduce((total, food) => total + food.count, 0)
    },

    // Most consumed food type
    favoriteFood() {
      const foods = this.actions.foodConsumed
      let maxCount = 0
      let favorite = null
      
      for (const [foodType, data] of Object.entries(foods)) {
        if (data.count > maxCount) {
          maxCount = data.count
          favorite = foodType
        }
      }
      
      return favorite
    },

    // Poop cleaning efficiency (cleaned vs created ratio)
    cleaningEfficiency() {
      const created = this.actions.poopsCreated.count
      const cleaned = this.actions.poopsCleaned.count
      
      if (created === 0) return 100
      return Math.min(100, Math.round((cleaned / created) * 100))
    },

    // Available achievements to unlock
    availableAchievements() {
      const achievements = []
      
      // Check each achievement
      if (!this.achievements.firstFeeding.unlocked && this.totalFoodConsumed > 0) {
        achievements.push('firstFeeding')
      }
      
      if (!this.achievements.firstCleaning.unlocked && this.actions.poopsCleaned.count > 0) {
        achievements.push('firstCleaning')
      }
      
      if (!this.achievements.hunterGatherer.unlocked && this.totalFoodConsumed >= this.achievements.hunterGatherer.requirement) {
        achievements.push('hunterGatherer')
      }
      
      if (!this.achievements.cleaningExpert.unlocked && this.actions.poopsCleaned.count >= this.achievements.cleaningExpert.requirement) {
        achievements.push('cleaningExpert')
      }
      
      const totalTime = this.sessions.totalPlayTime + this.currentSessionDuration
      if (!this.achievements.dedicated.unlocked && totalTime >= this.achievements.dedicated.requirement) {
        achievements.push('dedicated')
      }
      
      return achievements
    }
  },

  actions: {
    // Session management
    startSession() {
      if (!this.sessions.isActive) {
        this.sessions.currentSessionStart = Date.now()
        this.sessions.isActive = true
        this.sessions.sessionCount++
      }
    },

    pauseSession() {
      if (this.sessions.isActive && this.sessions.currentSessionStart) {
        this.sessions.totalPlayTime += Date.now() - this.sessions.currentSessionStart
        this.sessions.isActive = false
        this.sessions.currentSessionStart = null
      }
    },

    endSession() {
      this.pauseSession()
    },

    // Action tracking methods
    trackFoodConsumption(foodType, improvement = 0) {
      if (this.actions.foodConsumed[foodType]) {
        this.actions.foodConsumed[foodType].count++
        this.actions.foodConsumed[foodType].totalImprovement += improvement
        
        // Award points
        this.awardPoints('feedingGuineaPig')
        
        // Check for achievements
        this.checkAchievements()
      }
    },

    trackPoopCreation() {
      this.actions.poopsCreated.count++
    },

    trackPoopCleaning(isBulk = false, count = 1) {
      this.actions.poopsCleaned.count += count
      
      if (isBulk) {
        this.actions.poopsCleaned.bulk += count
        this.awardPoints('bulkCleaning')
      } else {
        this.actions.poopsCleaned.individual += count
        this.awardPoints('cleaningPoop')
      }
      
      // Check for achievements
      this.checkAchievements()
    },

    // Points and progression system
    awardPoints(actionType) {
      const points = this.progression.pointsPerAction[actionType] || 0
      this.progression.totalPoints += points
      this.progression.experience += points
      
      // Check for level up
      this.checkLevelUp()
    },

    checkLevelUp() {
      while (this.progression.experience >= this.progression.experienceToNextLevel) {
        this.progression.experience -= this.progression.experienceToNextLevel
        this.progression.level++
        // Increase XP requirement for next level (progressive scaling)
        this.progression.experienceToNextLevel = Math.floor(this.progression.experienceToNextLevel * 1.2)
      }
    },

    // Achievement system
    checkAchievements() {
      const available = this.availableAchievements
      
      available.forEach(achievementKey => {
        this.unlockAchievement(achievementKey)
      })
    },

    unlockAchievement(achievementKey) {
      if (this.achievements[achievementKey] && !this.achievements[achievementKey].unlocked) {
        this.achievements[achievementKey].unlocked = true
        this.achievements[achievementKey].timestamp = Date.now()
        
        // Award bonus points for achievements
        const bonusPoints = 50
        this.progression.totalPoints += bonusPoints
        this.progression.experience += bonusPoints
        this.checkLevelUp()
      }
    },

    // Extensible action tracking
    trackCustomAction(actionType, data = {}) {
      // Future method for tracking new action types
      if (!this.actions[actionType]) {
        this.actions[actionType] = { count: 0, ...data }
      } else {
        this.actions[actionType].count++
        // Merge additional data
        Object.assign(this.actions[actionType], data)
      }
    },

    // Data management
    resetStatistics() {
      // Reset all statistics to initial state
      this.sessions = {
        currentSessionStart: null,
        totalPlayTime: 0,
        sessionCount: 0,
        isActive: false
      }
      
      // Reset action counts
      Object.keys(this.actions.foodConsumed).forEach(foodType => {
        this.actions.foodConsumed[foodType] = { count: 0, totalImprovement: 0 }
      })
      
      this.actions.poopsCreated = { count: 0 }
      this.actions.poopsCleaned = { count: 0, individual: 0, bulk: 0 }
      
      // Reset progression
      this.progression = {
        level: 1,
        experience: 0,
        experienceToNextLevel: 100,
        totalPoints: 0,
        pointsPerAction: {
          feedingGuineaPig: 10,
          cleaningPoop: 5,
          bulkCleaning: 15
        }
      }
      
      // Reset achievements
      Object.keys(this.achievements).forEach(key => {
        this.achievements[key].unlocked = false
        this.achievements[key].timestamp = null
      })
    },

    // Get statistics summary for display
    getStatsSummary() {
      return {
        playTime: this.formattedPlayTime,
        sessions: this.sessions.sessionCount,
        totalFood: this.totalFoodConsumed,
        favoriteFood: this.favoriteFood,
        poopsCreated: this.actions.poopsCreated.count,
        poopsCleaned: this.actions.poopsCleaned.count,
        cleaningEfficiency: this.cleaningEfficiency,
        level: this.progression.level,
        points: this.progression.totalPoints,
        unlockedAchievements: Object.values(this.achievements).filter(a => a.unlocked).length
      }
    }
  },

  persist: true
})