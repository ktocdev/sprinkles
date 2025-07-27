<template>
  <SpecimenPage
    title="Toggle Component Specimen"
    description="This page showcases the Toggle component, a physical switch-like control that functions like a checkbox but with a sliding dot animation."
    @backToLanding="$emit('backToLanding')"
  >

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Basic Toggle</h2>
      <p class="gps-specimen__section-desc">A simple toggle switch that can be turned on and off.</p>
      <div class="gps-specimen__examples">
        <div class="gps-toggle-specimen__example">
          <Toggle v-model="basicToggle" aria-label="Basic toggle example" />
          <span class="gps-toggle-specimen__state">State: {{ basicToggle ? 'On' : 'Off' }}</span>
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Disabled States</h2>
      <p class="gps-specimen__section-desc">Toggle switches can be disabled in both on and off states.</p>
      <div class="gps-specimen__examples">
        <div class="gps-toggle-specimen__toggle-group">
          <div class="gps-toggle-specimen__toggle-item">
            <Toggle :model-value="false" :disabled="true" aria-label="Disabled off toggle" />
            <span class="gps-toggle-specimen__label">Disabled (Off)</span>
          </div>
          <div class="gps-toggle-specimen__toggle-item">
            <Toggle :model-value="true" :disabled="true" aria-label="Disabled on toggle" />
            <span class="gps-toggle-specimen__label">Disabled (On)</span>
          </div>
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Multiple Toggles</h2>
      <p class="gps-specimen__section-desc">Multiple toggles can be used together for settings or preferences.</p>
      <div class="gps-specimen__examples">
        <div class="gps-toggle-specimen__settings">
          <div class="gps-toggle-specimen__setting">
            <span class="gps-toggle-specimen__setting-label">Notifications</span>
            <Toggle v-model="settings.notifications" aria-label="Enable notifications" />
          </div>
          <div class="gps-toggle-specimen__setting">
            <span class="gps-toggle-specimen__setting-label">Dark Mode</span>
            <Toggle v-model="settings.darkMode" aria-label="Enable dark mode" />
          </div>
          <div class="gps-toggle-specimen__setting">
            <span class="gps-toggle-specimen__setting-label">Auto Save</span>
            <Toggle v-model="settings.autoSave" aria-label="Enable auto save" />
          </div>
          <div class="gps-toggle-specimen__setting">
            <span class="gps-toggle-specimen__setting-label">Sound Effects</span>
            <Toggle v-model="settings.soundEffects" aria-label="Enable sound effects" />
          </div>
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Interactive Example</h2>
      <p class="gps-specimen__section-desc">This toggle controls the visibility of additional content.</p>
      <div class="gps-specimen__examples">
        <div class="gps-toggle-specimen__interactive">
          <div class="gps-toggle-specimen__toggle-row">
            <span class="gps-toggle-specimen__setting-label">Show Details</span>
            <Toggle v-model="showDetails" aria-label="Show additional details" />
          </div>
          <div v-if="showDetails" class="gps-toggle-specimen__details">
            <p>This content is shown when the toggle is turned on. The toggle provides a clean way to show/hide additional information or features.</p>
            <p>The toggle component is fully accessible and supports keyboard navigation, screen readers, and other assistive technologies.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Event Handling</h2>
      <p class="gps-specimen__section-desc">Toggles emit events when their state changes.</p>
      <div class="gps-specimen__examples">
        <div class="gps-toggle-specimen__event-example">
          <Toggle 
            v-model="eventToggle" 
            @change="handleToggleChange"
            aria-label="Toggle with event handling" 
          />
          <div class="gps-toggle-specimen__events">
            <p>Last event: {{ lastEvent }}</p>
            <p>Event count: {{ eventCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Usage Guidelines</h2>
      <div class="gps-specimen__guidelines">
        <h3>When to use toggles:</h3>
        <ul>
          <li><strong>Settings & Preferences:</strong> Enable/disable features, switch between modes</li>
          <li><strong>Show/Hide Content:</strong> Reveal additional information or controls</li>
          <li><strong>State Changes:</strong> Toggle between two distinct states (on/off, yes/no)</li>
          <li><strong>Accessibility:</strong> Provide clear labels and ARIA attributes for screen readers</li>
          <li><strong>Visual Feedback:</strong> Use smooth animations and clear visual states</li>
          <li><strong>Event Handling:</strong> Listen for change events to respond to user interactions</li>
        </ul>
      </div>
    </div>

  </SpecimenPage>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Toggle from '../shared/Toggle.vue'
import SpecimenPage from './SpecimenPage.vue'

// Basic toggle
const basicToggle = ref(false)

// Settings toggles
const settings = reactive({
  notifications: true,
  darkMode: false,
  autoSave: true,
  soundEffects: false
})

// Interactive example
const showDetails = ref(false)

// Event handling example
const eventToggle = ref(false)
const lastEvent = ref('None')
const eventCount = ref(0)

function handleToggleChange(value) {
  lastEvent.value = `Changed to ${value ? 'ON' : 'OFF'} at ${new Date().toLocaleTimeString()}`
  eventCount.value++
}

const emit = defineEmits(['backToLanding'])
</script>

<style>
/* Toggle-specific styles */
.gps-toggle-specimen__example {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.gps-toggle-specimen__state {
  font-weight: var(--font-weight-medium);
  color: var(--color-accent);
  background: var(--color-panel);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-toggle-specimen__toggle-group {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.gps-toggle-specimen__toggle-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.gps-toggle-specimen__label {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  opacity: 0.7;
}

.gps-toggle-specimen__settings {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.gps-toggle-specimen__setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--color-background);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-toggle-specimen__setting-label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.gps-toggle-specimen__interactive {
  width: 100%;
}

.gps-toggle-specimen__toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block-end: 1rem;
}

.gps-toggle-specimen__details {
  padding: 1rem;
  background: var(--color-background);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  margin-block-start: 1rem;
}

.gps-toggle-specimen__details p {
  margin: 0 0 1rem 0;
  line-height: 1.6;
  color: var(--color-text);
}

.gps-toggle-specimen__details p:last-child {
  margin-block-end: 0;
}

.gps-toggle-specimen__event-example {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.gps-toggle-specimen__events {
  margin-inline-start: 1rem;
}

.gps-toggle-specimen__events p {
  margin: 0.25rem 0;
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

/* Responsive design */
@media (max-width: 768px) {
  .gps-toggle-specimen__toggle-group {
    flex-direction: column;
    gap: 1rem;
  }
  
  .gps-toggle-specimen__example {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .gps-toggle-specimen__event-example {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .gps-toggle-specimen__events {
    margin-inline-start: 0;
    margin-block-start: 1rem;
  }
}
</style> 