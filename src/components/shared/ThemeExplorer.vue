<template>
  <div class="gps-theme-explorer">
    <div class="gps-theme-explorer__content gps-panel-content">
      <!-- Theme Toggle Section -->
      <div class="gps-theme-explorer__section gps-panel-section">
        <h3 class="gps-theme-explorer__section-title gps-panel-section-title">🎨 Theme</h3>
        <div class="gps-theme-explorer__theme-toggle">
          <ThemeToggle />
        </div>
      </div>

      <!-- Font Controls Section -->
      <div class="gps-theme-explorer__section gps-panel-section">
        <h3 class="gps-theme-explorer__section-title gps-panel-section-title">📝 Typography</h3>
        <div class="gps-theme-explorer__font-controls">
          <FormGroup label="Header Font">
            <Dropdown
              v-model="headerFont"
              :options="headerFontOptions"
              placeholder="Select header font..."
              @change="updateHeaderFont"
            />
          </FormGroup>
          
          <FormGroup label="Body Font">
            <Dropdown
              v-model="bodyFont"
              :options="bodyFontOptions"
              placeholder="Select body font..."
              @change="updateBodyFont"
            />
          </FormGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ThemeToggle from './ThemeToggle.vue'
import Dropdown from './Dropdown.vue'
import FormGroup from './FormGroup.vue'

const headerFont = ref('Inter')
const bodyFont = ref('Inter')

const headerFontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Roboto', label: 'Roboto' }
]

const bodyFontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' }
]

function updateHeaderFont(font) {
  headerFont.value = font.value
  document.documentElement.style.setProperty('--font-family-header', `'${font.value}', sans-serif`)
}

function updateBodyFont(font) {
  bodyFont.value = font.value
  document.documentElement.style.setProperty('--font-family-body', `'${font.value}', sans-serif`)
}
</script>

<style>
.gps-theme-explorer {
  width: 100%;
}

.gps-theme-explorer__section {
  margin-block-end: 1.5rem;
}

.gps-theme-explorer__section:last-child {
  margin-block-end: 0;
}

.gps-theme-explorer__section-title {
  margin-block-end: 1rem;
}

.gps-theme-explorer__theme-toggle {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.gps-theme-explorer__font-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .gps-theme-explorer__font-controls {
    gap: 0.75rem;
  }
}
</style> 