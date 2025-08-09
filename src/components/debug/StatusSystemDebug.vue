<template>
  <div class="gps-panel-section">
    <h3 class="gps-panel-section-title">📢 Status Message System</h3>
    
    <div class="gps-panel-controls">
      <!-- System Enable/Disable -->
      <FormGroup label="Enable Status Messages">
        <Toggle 
          v-model="isEnabled"
          @change="toggleStatusSystem"
          aria-label="Toggle status messages on and off"
        />
      </FormGroup>

      <!-- Global Settings -->
      <FormGroup label="Global Cooldown (ms)">
        <Input
          v-model.number="globalCooldown"
          type="number"
          :min="1000"
          :max="10000"
          :step="500"
          @update:modelValue="updateGlobalCooldown"
          hint="Minimum time between any messages"
        />
      </FormGroup>

      <!-- Current Message Display -->
      <FormGroup label="Current Priority Message">
        <div class="status-current-message">
          <div v-if="currentMessage" class="status-message-display">
            <span class="status-emoji">{{ currentMessage.emoji }}</span>
            <span class="status-text">{{ currentMessage.message }}</span>
            <span class="status-urgency">({{ currentMessage.needType }}: {{ Math.round(currentMessage.urgency) }})</span>
          </div>
          <div v-else class="status-no-message">
            No urgency message active
          </div>
        </div>
      </FormGroup>

      <!-- Active Messages Summary -->
      <FormGroup label="Active Urgent Needs">
        <div class="status-active-summary">
          <div v-if="activeMessages.length === 0" class="status-no-active">
            No urgent needs detected
          </div>
          <div v-else>
            <div 
              v-for="msg in activeMessages" 
              :key="msg.needType"
              class="status-active-item"
            >
              <span class="status-emoji">{{ msg.emoji }}</span>
              <span class="status-need-type">{{ formatNeedType(msg.needType) }}</span>
              <span class="status-urgency-level">{{ Math.round(msg.urgency) }}</span>
            </div>
          </div>
        </div>
      </FormGroup>

      <!-- Need Type Configuration -->
      <div v-if="selectedNeedType" class="status-need-config">
        <h4>{{ formatNeedType(selectedNeedType) }} Configuration</h4>
        
        <FormGroup label="Timing Intervals (seconds)">
          <div class="status-interval-inputs">
            <div class="status-interval-group">
              <label>Normal</label>
              <Input
                v-model.number="needIntervals.normal"
                type="number"
                :min="5"
                :max="120"
                :step="5"
                @update:modelValue="updateNeedIntervals"
              />
            </div>
            <div class="status-interval-group">
              <label>Urgent</label>
              <Input
                v-model.number="needIntervals.urgent"
                type="number"
                :min="5"
                :max="60"
                :step="2"
                @update:modelValue="updateNeedIntervals"
              />
            </div>
            <div class="status-interval-group">
              <label>Critical</label>
              <Input
                v-model.number="needIntervals.critical"
                type="number"
                :min="2"
                :max="30"
                :step="1"
                @update:modelValue="updateNeedIntervals"
              />
            </div>
          </div>
        </FormGroup>

        <FormGroup label="Test Messages">
          <div class="status-test-buttons">
            <Button
              type="secondary"
              size="compact"
              @click="testMessage('normal')"
            >
              Test Normal
            </Button>
            <Button
              type="warning"
              size="compact"
              @click="testMessage('urgent')"
            >
              Test Urgent
            </Button>
            <Button
              type="danger"
              size="compact"
              @click="testMessage('critical')"
            >
              Test Critical
            </Button>
          </div>
        </FormGroup>
      </div>

      <!-- Need Type Selector -->
      <FormGroup label="Configure Need Type">
        <Dropdown
          v-model="selectedNeedType"
          :options="needTypeOptions"
          placeholder="Select need type to configure..."
          aria-label="Select need type for configuration"
        />
      </FormGroup>

      <!-- Debug Actions -->
      <FormGroup label="Debug Actions">
        <div class="status-debug-actions">
          <Button
            type="secondary"
            size="compact"
            @click="clearAllMessages"
          >
            Clear All Messages
          </Button>
          <Button
            type="secondary"
            size="compact"
            @click="resetMessageHistory"
          >
            Reset Message History
          </Button>
          <Button
            type="primary"
            size="compact"
            @click="forceUpdate"
          >
            Force Update
          </Button>
        </div>
      </FormGroup>

      <!-- System Debug Info -->
      <FormGroup label="Debug Info">
        <div class="status-debug-info">
          <div>Active Messages: {{ debugInfo.activeMessagesCount }}</div>
          <div>Enabled: {{ debugInfo.enabled ? 'Yes' : 'No' }}</div>
          <div>Last Message: {{ debugInfo.lastMessageTime > 0 ? formatTimestamp(debugInfo.lastMessageTime) : 'Never' }}</div>
        </div>
      </FormGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import FormGroup from '../shared/FormGroup.vue'
import Toggle from '../shared/Toggle.vue'
import Input from '../shared/Input.vue'
import Button from '../shared/Button.vue'
import Dropdown from '../shared/Dropdown.vue'
import { useStatusStore } from '../../stores/status'

const statusStore = useStatusStore()

// System settings
const isEnabled = ref(statusStore.enabled)
const globalCooldown = ref(statusStore.globalCooldown)

// Current state
const currentMessage = computed(() => statusStore.getCurrentPriorityMessage)
const activeMessages = computed(() => statusStore.getActiveUrgencyMessages)
const debugInfo = computed(() => statusStore.getDebugInfo())

// Configuration
const selectedNeedType = ref('hunger')
const needIntervals = ref({
  normal: 30,
  urgent: 15,
  critical: 8
})

// Need type options for dropdown
const needTypeOptions = computed(() => [
  { value: 'hunger', label: 'Hunger 🍽️' },
  { value: 'thirst', label: 'Thirst 💧' },
  { value: 'chew', label: 'Chew 🦷' },
  { value: 'enrichment', label: 'Enrichment 🎾' },
  { value: 'shelter', label: 'Shelter 🏠' },
  { value: 'hygiene', label: 'Hygiene 🛁' }
])

// Methods
function toggleStatusSystem(enabled) {
  statusStore.setEnabled(enabled)
}

function updateGlobalCooldown() {
  statusStore.globalCooldown = globalCooldown.value
}

function updateNeedIntervals() {
  if (selectedNeedType.value) {
    const intervals = {
      normal: needIntervals.value.normal * 1000,
      urgent: needIntervals.value.urgent * 1000,
      critical: needIntervals.value.critical * 1000
    }
    statusStore.updateIntervals(selectedNeedType.value, intervals)
  }
}

function testMessage(urgencyLevel) {
  if (!selectedNeedType.value) return
  
  // Create a mock urgency based on the level
  let mockUrgency = 25
  if (urgencyLevel === 'urgent') mockUrgency = 65
  if (urgencyLevel === 'critical') mockUrgency = 90
  
  statusStore.showNeedMessage(selectedNeedType.value, urgencyLevel, mockUrgency)
}

function clearAllMessages() {
  statusStore.clearAllMessages()
}

function resetMessageHistory() {
  statusStore.resetMessageHistory()
}

function forceUpdate() {
  statusStore.updateUrgencyMessages()
}

function formatNeedType(needType) {
  return needType.charAt(0).toUpperCase() + needType.slice(1)
}

function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleTimeString()
}

// Load intervals when need type changes
watch(selectedNeedType, (newNeedType) => {
  if (newNeedType) {
    const config = statusStore.getNeedConfig(newNeedType)
    if (config) {
      needIntervals.value = {
        normal: Math.round(config.intervals.normal / 1000),
        urgent: Math.round(config.intervals.urgent / 1000),
        critical: Math.round(config.intervals.critical / 1000)
      }
    }
  }
})

// Initialize
onMounted(() => {
  // Load initial intervals
  if (selectedNeedType.value) {
    const config = statusStore.getNeedConfig(selectedNeedType.value)
    if (config) {
      needIntervals.value = {
        normal: Math.round(config.intervals.normal / 1000),
        urgent: Math.round(config.intervals.urgent / 1000),
        critical: Math.round(config.intervals.critical / 1000)
      }
    }
  }
})
</script>

<style>
.status-current-message {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 0.75rem;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
}

.status-message-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-emoji {
  font-size: 1.2em;
}

.status-text {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.status-urgency {
  color: var(--color-accent);
  font-size: var(--font-size-xs);
  opacity: 0.8;
}

.status-no-message {
  color: var(--color-text);
  opacity: 0.6;
  font-style: italic;
}

.status-active-summary {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 0.75rem;
  max-height: 8rem;
  overflow-y: auto;
}

.status-no-active {
  color: var(--color-text);
  opacity: 0.6;
  font-style: italic;
  text-align: center;
}

.status-active-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--color-border);
}

.status-active-item:last-child {
  border-bottom: none;
}

.status-need-type {
  flex: 1;
  font-weight: var(--font-weight-medium);
}

.status-urgency-level {
  color: var(--color-accent);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.status-need-config {
  background: var(--color-panel);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-block-start: 1rem;
}

.status-need-config h4 {
  margin: 0 0 1rem 0;
  color: var(--color-accent);
  font-size: var(--font-size-base);
}

.status-interval-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
}

.status-interval-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.status-interval-group label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.status-test-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.status-debug-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.status-debug-info {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 0.75rem;
  font-size: var(--font-size-xs);
  font-family: monospace;
}

.status-debug-info div {
  margin: 0.25rem 0;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .status-interval-inputs {
    grid-template-columns: 1fr;
  }
  
  .status-test-buttons,
  .status-debug-actions {
    justify-content: center;
  }
}
</style>