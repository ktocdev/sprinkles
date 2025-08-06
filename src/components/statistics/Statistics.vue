<script setup>
import { computed } from 'vue'
import { useStatisticsStore } from '../../stores/statistics'
import StatusBar from '../shared/StatusBar.vue'

const statisticsStore = useStatisticsStore()

// Computed properties for statistics display
const stats = computed(() => statisticsStore.getStatsSummary())

const foodStats = computed(() => {
  const foods = statisticsStore.actions.foodConsumed
  return Object.entries(foods)
    .filter(([_, data]) => data.count > 0)
    .map(([foodType, data]) => ({
      label: foodType.charAt(0).toUpperCase() + foodType.slice(1),
      count: data.count,
      improvement: Math.round(data.totalImprovement)
    }))
    .sort((a, b) => b.count - a.count)
})

const achievementCount = computed(() => {
  return Object.values(statisticsStore.achievements).filter(a => a.unlocked).length
})

const totalAchievements = computed(() => {
  return Object.keys(statisticsStore.achievements).length
})
</script>

<template>
  <div class="gps-statistics gps-panel-content">
    <!-- Statistics Section -->
    <div class="gps-statistics__container gps-panel-section">
      <div class="gps-statistics__stats">
            <!-- Basic Stats -->
            <div class="gps-statistics__stats-section">
              <h4 class="gps-statistics__stats-title">🕒 Play Session</h4>
              <div class="gps-statistics__stats-grid">
                <div class="gps-statistics__stat-item">
                  <span class="gps-statistics__stat-label">Total Time:</span>
                  <span class="gps-statistics__stat-value">{{ stats.playTime }}</span>
                </div>
                <div class="gps-statistics__stat-item">
                  <span class="gps-statistics__stat-label">Sessions:</span>
                  <span class="gps-statistics__stat-value">{{ stats.sessions }}</span>
                </div>
              </div>
            </div>

            <!-- Food Consumption -->
            <div class="gps-statistics__stats-section">
              <h4 class="gps-statistics__stats-title">🥕 Food Consumption</h4>
              <div class="gps-statistics__stats-grid">
                <div class="gps-statistics__stat-item">
                  <span class="gps-statistics__stat-label">Total Food:</span>
                  <span class="gps-statistics__stat-value">{{ stats.totalFood }}</span>
                </div>
                <div class="gps-statistics__stat-item" v-if="stats.favoriteFood">
                  <span class="gps-statistics__stat-label">Favorite:</span>
                  <span class="gps-statistics__stat-value">{{ stats.favoriteFood.charAt(0).toUpperCase() + stats.favoriteFood.slice(1) }}</span>
                </div>
              </div>
              
              <!-- Food breakdown -->
              <div v-if="foodStats.length > 0" class="gps-statistics__food-breakdown">
                <div 
                  v-for="food in foodStats" 
                  :key="food.label"
                  class="gps-statistics__food-item"
                >
                  <span class="gps-statistics__food-label">{{ food.label }}:</span>
                  <span class="gps-statistics__food-count">{{ food.count }}x</span>
                  <span class="gps-statistics__food-improvement">(+{{ food.improvement }})</span>
                </div>
              </div>
            </div>

            <!-- Poop Stats -->
            <div class="gps-statistics__stats-section">
              <h4 class="gps-statistics__stats-title">💩 Cleanliness</h4>
              <div class="gps-statistics__stats-grid">
                <div class="gps-statistics__stat-item">
                  <span class="gps-statistics__stat-label">Poops Created:</span>
                  <span class="gps-statistics__stat-value">{{ stats.poopsCreated }}</span>
                </div>
                <div class="gps-statistics__stat-item">
                  <span class="gps-statistics__stat-label">Poops Cleaned:</span>
                  <span class="gps-statistics__stat-value">{{ stats.poopsCleaned }}</span>
                </div>
              </div>
              
              <!-- Cleaning efficiency bar -->
              <div class="gps-statistics__efficiency">
                <StatusBar 
                  label="Cleaning Efficiency"
                  :value="stats.cleaningEfficiency"
                  :color="stats.cleaningEfficiency > 80 ? 'var(--color-accent)' : stats.cleaningEfficiency > 50 ? 'var(--color-warning)' : 'var(--color-danger)'"
                  :display-value="`${stats.cleaningEfficiency}%`"
                />
              </div>
            </div>

            <!-- Progress & Achievements -->
            <div class="gps-statistics__stats-section">
              <h4 class="gps-statistics__stats-title">🏆 Progress</h4>
              <div class="gps-statistics__stats-grid">
                <div class="gps-statistics__stat-item">
                  <span class="gps-statistics__stat-label">Level:</span>
                  <span class="gps-statistics__stat-value">{{ stats.level }}</span>
                </div>
                <div class="gps-statistics__stat-item">
                  <span class="gps-statistics__stat-label">Points:</span>
                  <span class="gps-statistics__stat-value">{{ stats.points }}</span>
                </div>
                <div class="gps-statistics__stat-item">
                  <span class="gps-statistics__stat-label">Achievements:</span>
                  <span class="gps-statistics__stat-value">{{ achievementCount }}/{{ totalAchievements }}</span>
                </div>
              </div>
              
              <!-- Level progress bar -->
              <div class="gps-statistics__level-progress">
                <StatusBar 
                  label="Level Progress"
                  :value="(statisticsStore.progression.experience / statisticsStore.progression.experienceToNextLevel) * 100"
                  color="var(--color-accent)"
                  :display-value="`${statisticsStore.progression.experience}/${statisticsStore.progression.experienceToNextLevel} XP`"
                />
              </div>
            </div>
          </div>
    </div>
  </div>
</template>

<style>
/* Statistics Section Styles */
.gps-statistics__stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.gps-statistics__stats-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gps-statistics__stats-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.gps-statistics__stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.375rem;
}

.gps-statistics__stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.375rem 0.5rem;
  background: var(--color-bg);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-statistics__stat-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  opacity: 0.8;
}

.gps-statistics__stat-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
}

/* Food breakdown styles */
.gps-statistics__food-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: var(--color-bg);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-statistics__food-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--font-size-sm);
}

.gps-statistics__food-label {
  flex: 1;
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
}

.gps-statistics__food-count {
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
  min-width: 30px;
  text-align: right;
}

.gps-statistics__food-improvement {
  color: var(--color-text);
  opacity: 0.7;
  font-size: var(--font-size-xs);
  min-width: 40px;
  text-align: right;
}

/* Progress bars */
.gps-statistics__efficiency,
.gps-statistics__level-progress {
  margin-top: 0.5rem;
}

/* Mobile-first responsive design */
@media (min-width: 480px) {
  .gps-statistics__stats-grid {
    gap: 0.5rem;
  }
  
  .gps-statistics__stat-item {
    padding: 0.5rem;
  }
  
  .gps-statistics__food-breakdown {
    padding: 0.75rem;
  }
}

@media (min-width: 768px) {
  .gps-statistics__stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>