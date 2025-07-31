<script setup>
import { ref } from 'vue'
import Panel from '../shared/Panel.vue'
import Button from '../shared/Button.vue'
import ThemeToggle from '../shared/ThemeToggle.vue'
import Dropdown from '../shared/Dropdown.vue'
import FormGroup from '../shared/FormGroup.vue'

const showThemeExplorer = ref(false)

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

function toggleThemeExplorer() {
  showThemeExplorer.value = !showThemeExplorer.value
}

function updateHeaderFont(font) {
  headerFont.value = font.value
  document.documentElement.style.setProperty('--font-family-header', `'${font.value}', sans-serif`)
}

function updateBodyFont(font) {
  bodyFont.value = font.value
  document.documentElement.style.setProperty('--font-family-body', `'${font.value}', sans-serif`)
}

// Expose toggle function for external use
defineExpose({
  toggleThemeExplorer
})
</script>

<template>
  <Panel 
    :isOpen="showThemeExplorer" 
    title="🎨 Theme Explorer" 
    @close="showThemeExplorer = false"
  >
    <div class="gps-panel-content">
      <!-- Theme Settings Section -->
      <div class="gps-panel-section">
        <div class="gps-panel-actions">
          <div class="gps-panel-action-item">
            <Button 
              type="primary"
              class="gps-panel-action-button"
            >
              🎨 Theme Settings
            </Button>
            <p class="gps-panel-action-description">
              Toggle between light and dark themes to customize your viewing experience.
            </p>
            <div class="gps-theme-toggle-container">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <!-- Typography Settings Section -->
      <div class="gps-panel-section">
        <h3 class="gps-panel-section-title">📝 Typography Settings</h3>
        <p>Customize header and body fonts to personalize the application's typography.</p>
        <div class="gps-font-controls-container">
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
  </Panel>
</template>

<style>
/* ===== THEME EXPLORER STYLES ===== */

.gps-theme-toggle-container {
  margin-block-start: 1rem;
  display: flex;
  justify-content: center;
}

.gps-font-controls-container {
  margin-block-start: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

</style> 