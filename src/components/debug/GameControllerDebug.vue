<template>
  <div class="game-controller-debug">
    <h3>🎮 Game Controller Debug</h3>
    
    <div class="debug-section">
      <h4>Current State</h4>
      <div class="debug-grid">
        <div class="debug-item">
          <label>Game Active:</label>
          <span :class="{ 'status-good': gameState.isGameActive, 'status-bad': !gameState.isGameActive }">
            {{ gameState.isGameActive ? 'Yes' : 'No' }}
          </span>
        </div>
        <div class="debug-item">
          <label>Paused:</label>
          <span :class="{ 'status-bad': gameState.isPaused, 'status-good': !gameState.isPaused }">
            {{ gameState.isPaused ? `Yes (${gameState.pauseReason})` : 'No' }}
          </span>
        </div>
        <div class="debug-item">
          <label>Page Visible:</label>
          <span :class="{ 'status-good': gameState.isPageVisible, 'status-bad': !gameState.isPageVisible }">
            {{ gameState.isPageVisible ? 'Yes' : 'No' }}
          </span>
        </div>
        <div class="debug-item">
          <label>User Idle:</label>
          <span :class="{ 'status-bad': gameState.isUserIdle, 'status-good': !gameState.isUserIdle }">
            {{ gameState.isUserIdle ? 'Yes' : 'No' }}
          </span>
        </div>
        <div class="debug-item">
          <label>Performance Mode:</label>
          <span :class="performanceModeClass">{{ gameState.performanceMode }}</span>
        </div>
        <div class="debug-item">
          <label>Mobile Device:</label>
          <span>{{ gameState.deviceInfo?.isMobileDevice ? 'Yes' : 'No' }}</span>
        </div>
      </div>
    </div>

    <div class="debug-section">
      <h4>Timing Info</h4>
      <div class="debug-grid">
        <div class="debug-item">
          <label>Time Since Interaction:</label>
          <span>{{ formatTime(gameState.timeSinceLastInteraction) }}</span>
        </div>
        <div class="debug-item">
          <label>Idle Timeout:</label>
          <span>{{ formatTime(gameState.deviceInfo?.idleTimeout) }}</span>
        </div>
        <div class="debug-item">
          <label>Last Pause Duration:</label>
          <span>{{ formatTime(gameState.pauseHistory?.pauseDuration) }}</span>
        </div>
      </div>
    </div>

    <div class="debug-section">
      <h4>Performance Metrics</h4>
      <div class="debug-grid">
        <div class="debug-item">
          <label>Pause Count:</label>
          <span>{{ gameState.performanceMetrics?.pauseCount || 0 }}</span>
        </div>
        <div class="debug-item">
          <label>Resume Count:</label>
          <span>{{ gameState.performanceMetrics?.resumeCount || 0 }}</span>
        </div>
        <div class="debug-item">
          <label>Interval Misses:</label>
          <span :class="{ 'status-bad': (gameState.performanceMetrics?.intervalMisses || 0) > 3 }">
            {{ gameState.performanceMetrics?.intervalMisses || 0 }}
          </span>
        </div>
      </div>
    </div>

    <div class="debug-section">
      <h4>Paused Subsystems</h4>
      <div class="subsystems-list">
        <span v-if="gameState.pausedSubsystems?.length === 0" class="no-paused">None</span>
        <span 
          v-for="subsystem in gameState.pausedSubsystems" 
          :key="subsystem"
          class="subsystem-tag"
        >
          {{ subsystem }}
        </span>
      </div>
    </div>

    <div class="debug-section">
      <h4>Actions</h4>
      <div class="debug-actions">
        <button @click="forcePause" :disabled="gameState.isPaused" class="debug-btn pause-btn">
          Force Pause
        </button>
        <button @click="forceResume" :disabled="!gameState.isPaused" class="debug-btn resume-btn">
          Force Resume
        </button>
        <button @click="toggleLowPower" class="debug-btn">
          {{ gameState.deviceInfo?.isLowPowerMode ? 'Disable' : 'Enable' }} Power Saver
        </button>
        <button @click="generateReport" class="debug-btn">
          Generate Report
        </button>
      </div>
    </div>

    <div v-if="performanceReport" class="debug-section">
      <h4>Performance Report</h4>
      <div class="performance-report">
        <h5>Recommendations:</h5>
        <ul v-if="performanceReport.recommendations?.length > 0">
          <li v-for="rec in performanceReport.recommendations" :key="rec">{{ rec }}</li>
        </ul>
        <p v-else>No performance issues detected</p>
        
        <details class="report-details">
          <summary>Full Report (Click to expand)</summary>
          <pre>{{ JSON.stringify(performanceReport, null, 2) }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameControllerStore } from '../../stores/gameController'

const gameControllerStore = useGameControllerStore()
const gameState = ref({})
const performanceReport = ref(null)
let updateInterval = null

// Computed properties
const performanceModeClass = computed(() => {
  const mode = gameState.value.performanceMode
  return {
    'status-good': mode === 'normal',
    'status-warning': mode === 'power_saver',
    'status-bad': mode === 'background'
  }
})

// Methods
function updateGameState() {
  gameState.value = gameControllerStore.getGameState()
}

function formatTime(ms) {
  if (!ms || ms < 0) return '0s'
  
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

function forcePause() {
  gameControllerStore.forcePause('debug')
}

function forceResume() {
  gameControllerStore.forceResume()
}

function toggleLowPower() {
  gameControllerStore.toggleLowPowerMode()
}

function generateReport() {
  performanceReport.value = gameControllerStore.getPerformanceReport()
  console.log('🎮 [DEBUG] Performance Report:', performanceReport.value)
}

// Lifecycle
onMounted(() => {
  updateGameState()
  // Update state every second
  updateInterval = setInterval(updateGameState, 1000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.game-controller-debug {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  font-family: monospace;
  font-size: 12px;
}

.debug-section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.debug-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.debug-section h4 {
  margin: 0 0 12px 0;
  color: var(--color-text-primary);
  font-size: 14px;
}

.debug-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.debug-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: var(--color-background);
  border-radius: 4px;
}

.debug-item label {
  color: var(--color-text-secondary);
  margin-right: 8px;
}

.status-good {
  color: #4ade80;
  font-weight: bold;
}

.status-warning {
  color: #fbbf24;
  font-weight: bold;
}

.status-bad {
  color: #ef4444;
  font-weight: bold;
}

.subsystems-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.subsystem-tag {
  background: var(--color-accent);
  color: white;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 10px;
}

.no-paused {
  color: var(--color-text-secondary);
  font-style: italic;
}

.debug-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.debug-btn {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: 11px;
  transition: background-color 0.2s;
}

.debug-btn:hover:not(:disabled) {
  background: var(--color-background);
}

.debug-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pause-btn:not(:disabled) {
  background: #ef4444;
  color: white;
  border-color: #dc2626;
}

.resume-btn:not(:disabled) {
  background: #4ade80;
  color: white;
  border-color: #16a34a;
}

.performance-report {
  background: var(--color-background);
  padding: 12px;
  border-radius: 4px;
  margin-top: 8px;
}

.performance-report h5 {
  margin: 0 0 8px 0;
  color: var(--color-text-primary);
}

.performance-report ul {
  margin: 0;
  padding-left: 20px;
  color: var(--color-text-secondary);
}

.report-details {
  margin-top: 12px;
}

.report-details summary {
  cursor: pointer;
  color: var(--color-accent);
}

.report-details pre {
  background: var(--color-surface);
  padding: 8px;
  border-radius: 4px;
  overflow: auto;
  max-height: 300px;
  font-size: 10px;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .debug-grid {
    grid-template-columns: 1fr;
  }
  
  .debug-actions {
    flex-direction: column;
  }
  
  .debug-btn {
    width: 100%;
  }
}
</style>