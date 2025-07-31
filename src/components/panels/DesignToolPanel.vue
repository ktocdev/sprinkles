<script setup>
import { ref } from 'vue'
import Panel from '../shared/Panel.vue'
import Button from '../shared/Button.vue'

const showDesignToolPanel = ref(false)

const emit = defineEmits(['showSpecimenLanding', 'showThemeExplorer'])

function toggleDesignToolPanel() {
  showDesignToolPanel.value = !showDesignToolPanel.value
}

function openSpecimenLanding() {
  emit('showSpecimenLanding')
  showDesignToolPanel.value = false
}

function openThemeExplorer() {
  emit('showThemeExplorer')
  showDesignToolPanel.value = false
}

// Expose toggle function for external use
defineExpose({
  toggleDesignToolPanel
})
</script>

<template>
  <Panel 
    :isOpen="showDesignToolPanel" 
    title="🎨 Design Tools" 
    @close="showDesignToolPanel = false"
  >
    <div class="gps-panel-content">
      <div class="gps-panel-section">
        <div class="gps-panel-actions">
          <div class="gps-panel-action-item">
            <Button 
              type="primary"
              @click="openSpecimenLanding"
              class="gps-panel-action-button"
            >
              🧪 Open Specimens
            </Button>
            <p class="gps-panel-action-description">
              Explore and test UI components in an isolated environment to see how they look and behave.
            </p>
          </div>
          
          <div class="gps-panel-action-item">
            <Button 
              type="secondary"
              @click="openThemeExplorer"
              class="gps-panel-action-button"
            >
              🎨 Open Theme Explorer
            </Button>
            <p class="gps-panel-action-description">
              Customize the application theme by adjusting colors, spacing, and other design tokens.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Panel>
</template> 