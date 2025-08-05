<script setup>
import { ref, computed } from 'vue'
import { useGuineaPigStore } from '../../stores/guineaPig'
import { useStatisticsStore } from '../../stores/statistics'
import Input from '../shared/Input.vue'
import FormGroup from '../shared/FormGroup.vue'
import Button from '../shared/Button.vue'
import StatusBar from '../shared/StatusBar.vue'

const guineaPigStore = useGuineaPigStore()
const statisticsStore = useStatisticsStore()
const editingName = ref(false)
const tempName = ref(guineaPigStore.info.name || '')

function startEditName() {
  tempName.value = guineaPigStore.info.name || ''
  editingName.value = true
}

function saveName() {
  guineaPigStore.setInfoField('name', tempName.value)
  editingName.value = false
}

function cancelEditName() {
  editingName.value = false
}

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
  <div class="gps-guinea-pig gps-panel-content">
    <div class="gps-guinea-pig__container gps-panel-section">
      <div class="gps-guinea-pig__info-display">
      <template v-if="editingName">
        <FormGroup label="Name" required>
          <Input 
            v-model="tempName"
            placeholder="Enter guinea pig name"
            icon="🐹"
            @keydown.enter="saveName"
            @keydown.escape="cancelEditName"
          />
        </FormGroup>
        <div class="gps-guinea-pig__edit-actions gps-panel-controls">
          <Button type="primary" @click="saveName">Save</Button>
          <Button type="secondary" @click="cancelEditName">Cancel</Button>
        </div>
      </template>
             <template v-else>
         <div class="gps-guinea-pig__info-row">
           <span class="gps-guinea-pig__info-label">Name:</span>
           <div class="gps-guinea-pig__name-group">
             <span class="gps-guinea-pig__info-value">{{ guineaPigStore.info.name || '—' }}</span>
             <button 
               class="gps-guinea-pig__edit-button"
               @click="startEditName"
               aria-label="Edit guinea pig name"
             >
               ✏️
             </button>
           </div>
         </div>
       </template>
      
      <div class="gps-guinea-pig__info-row">
        <span class="gps-guinea-pig__info-label">Birthday:</span>
        <span class="gps-guinea-pig__info-value">{{ guineaPigStore.info.birthday || '—' }}</span>
      </div>
      
      <div class="gps-guinea-pig__info-row">
        <span class="gps-guinea-pig__info-label">Coat:</span>
        <span class="gps-guinea-pig__info-value">{{ guineaPigStore.info.coat || '—' }}</span>
      </div>
      
      <div class="gps-guinea-pig__info-row">
        <span class="gps-guinea-pig__info-label">Gender:</span>
        <span class="gps-guinea-pig__info-value">{{ guineaPigStore.info.gender || '—' }}</span>
      </div>
      </div>
    </div>

    <!-- Statistics Section -->
    <div class="gps-guinea-pig__container gps-panel-section">
      <h3 class="gps-panel-section-title">📊 Statistics & Progress</h3>
      <div class="gps-guinea-pig__stats">
            <!-- Basic Stats -->
            <div class="gps-guinea-pig__stats-section">
              <h4 class="gps-guinea-pig__stats-title">🕒 Play Session</h4>
              <div class="gps-guinea-pig__stats-grid">
                <div class="gps-guinea-pig__stat-item">
                  <span class="gps-guinea-pig__stat-label">Total Time:</span>
                  <span class="gps-guinea-pig__stat-value">{{ stats.playTime }}</span>
                </div>
                <div class="gps-guinea-pig__stat-item">
                  <span class="gps-guinea-pig__stat-label">Sessions:</span>
                  <span class="gps-guinea-pig__stat-value">{{ stats.sessions }}</span>
                </div>
              </div>
            </div>

            <!-- Food Consumption -->
            <div class="gps-guinea-pig__stats-section">
              <h4 class="gps-guinea-pig__stats-title">🥕 Food Consumption</h4>
              <div class="gps-guinea-pig__stats-grid">
                <div class="gps-guinea-pig__stat-item">
                  <span class="gps-guinea-pig__stat-label">Total Food:</span>
                  <span class="gps-guinea-pig__stat-value">{{ stats.totalFood }}</span>
                </div>
                <div class="gps-guinea-pig__stat-item" v-if="stats.favoriteFood">
                  <span class="gps-guinea-pig__stat-label">Favorite:</span>
                  <span class="gps-guinea-pig__stat-value">{{ stats.favoriteFood.charAt(0).toUpperCase() + stats.favoriteFood.slice(1) }}</span>
                </div>
              </div>
              
              <!-- Food breakdown -->
              <div v-if="foodStats.length > 0" class="gps-guinea-pig__food-breakdown">
                <div 
                  v-for="food in foodStats" 
                  :key="food.label"
                  class="gps-guinea-pig__food-item"
                >
                  <span class="gps-guinea-pig__food-label">{{ food.label }}:</span>
                  <span class="gps-guinea-pig__food-count">{{ food.count }}x</span>
                  <span class="gps-guinea-pig__food-improvement">(+{{ food.improvement }})</span>
                </div>
              </div>
            </div>

            <!-- Poop Stats -->
            <div class="gps-guinea-pig__stats-section">
              <h4 class="gps-guinea-pig__stats-title">💩 Cleanliness</h4>
              <div class="gps-guinea-pig__stats-grid">
                <div class="gps-guinea-pig__stat-item">
                  <span class="gps-guinea-pig__stat-label">Poops Created:</span>
                  <span class="gps-guinea-pig__stat-value">{{ stats.poopsCreated }}</span>
                </div>
                <div class="gps-guinea-pig__stat-item">
                  <span class="gps-guinea-pig__stat-label">Poops Cleaned:</span>
                  <span class="gps-guinea-pig__stat-value">{{ stats.poopsCleaned }}</span>
                </div>
              </div>
              
              <!-- Cleaning efficiency bar -->
              <div class="gps-guinea-pig__efficiency">
                <StatusBar 
                  label="Cleaning Efficiency"
                  :value="stats.cleaningEfficiency"
                  :color="stats.cleaningEfficiency > 80 ? 'var(--color-accent)' : stats.cleaningEfficiency > 50 ? 'var(--color-warning)' : 'var(--color-danger)'"
                  :display-value="`${stats.cleaningEfficiency}%`"
                />
              </div>
            </div>

            <!-- Progress & Achievements -->
            <div class="gps-guinea-pig__stats-section">
              <h4 class="gps-guinea-pig__stats-title">🏆 Progress</h4>
              <div class="gps-guinea-pig__stats-grid">
                <div class="gps-guinea-pig__stat-item">
                  <span class="gps-guinea-pig__stat-label">Level:</span>
                  <span class="gps-guinea-pig__stat-value">{{ stats.level }}</span>
                </div>
                <div class="gps-guinea-pig__stat-item">
                  <span class="gps-guinea-pig__stat-label">Points:</span>
                  <span class="gps-guinea-pig__stat-value">{{ stats.points }}</span>
                </div>
                <div class="gps-guinea-pig__stat-item">
                  <span class="gps-guinea-pig__stat-label">Achievements:</span>
                  <span class="gps-guinea-pig__stat-value">{{ achievementCount }}/{{ totalAchievements }}</span>
                </div>
              </div>
              
              <!-- Level progress bar -->
              <div class="gps-guinea-pig__level-progress">
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


.gps-guinea-pig__info-display {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gps-guinea-pig__info-row {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  background: var(--color-panel);
}

.gps-guinea-pig__info-label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  min-width: 60px;
  flex-shrink: 0;
}

.gps-guinea-pig__name-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.gps-guinea-pig__info-value {
  color: var(--color-text);
}

.gps-guinea-pig__edit-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.125rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  font-size: 0.8em;
}

.gps-guinea-pig__edit-button:hover {
  background: var(--color-accent);
  opacity: 0.8;
}

.gps-guinea-pig__edit-actions {
  display: flex;
  gap: 0.5rem;
  margin-block-start: 1rem;
}

/* Statistics Section Styles */
.gps-guinea-pig__stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.gps-guinea-pig__stats-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gps-guinea-pig__stats-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.gps-guinea-pig__stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.375rem;
}

.gps-guinea-pig__stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.375rem 0.5rem;
  background: var(--color-bg);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-guinea-pig__stat-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  opacity: 0.8;
}

.gps-guinea-pig__stat-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
}

/* Food breakdown styles */
.gps-guinea-pig__food-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: var(--color-bg);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-guinea-pig__food-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--font-size-sm);
}

.gps-guinea-pig__food-label {
  flex: 1;
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
}

.gps-guinea-pig__food-count {
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
  min-width: 30px;
  text-align: right;
}

.gps-guinea-pig__food-improvement {
  color: var(--color-text);
  opacity: 0.7;
  font-size: var(--font-size-xs);
  min-width: 40px;
  text-align: right;
}

/* Progress bars */
.gps-guinea-pig__efficiency,
.gps-guinea-pig__level-progress {
  margin-top: 0.5rem;
}

/* Mobile-first responsive design */
@media (min-width: 480px) {
  .gps-guinea-pig__info-label {
    min-width: 80px;
  }
  
  .gps-guinea-pig__edit-button {
    padding: 0.25rem;
    font-size: 0.9em;
  }
  
  .gps-guinea-pig__stats-grid {
    gap: 0.5rem;
  }
  
  .gps-guinea-pig__stat-item {
    padding: 0.5rem;
  }
  
  .gps-guinea-pig__food-breakdown {
    padding: 0.75rem;
  }
}

@media (min-width: 768px) {
  .gps-guinea-pig__stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 