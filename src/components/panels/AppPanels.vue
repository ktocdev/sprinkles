<template>
  <!-- Welcome Panel (always rendered, controlled by user store) -->
  <WelcomePanel />
  
  <!-- Development/Design Panels (ref-based) -->
  <SpecimenPanels ref="specimenPanelsRef" />
  <ThemeExplorerPanel ref="themeExplorerPanelRef" />
  <DebugPanel ref="debugPanelRef" @gameReset="$emit('gameReset')" />
  <DesignToolPanel 
    ref="designToolPanelRef"
    @showSpecimenLanding="specimenPanelsRef?.toggleSpecimenLanding()"
    @showThemeExplorer="themeExplorerPanelRef?.toggleThemeExplorer()"
  />
  
  <!-- Icon Sidebar Panels (prop-based) -->
  <IconSidebarPanels 
    :showGuineaPig="showGuineaPig"
    :showCageInteractions="showCageInteractions"
    :showMarket="showMarket"
    @closeGuineaPig="$emit('closeGuineaPig')"
    @closeCageInteractions="$emit('closeCageInteractions')"
    @closeMarket="$emit('closeMarket')"
  />
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import WelcomePanel from './WelcomePanel.vue'
import SpecimenPanels from './SpecimenPanels.vue'
import ThemeExplorerPanel from './ThemeExplorerPanel.vue'
import DebugPanel from './DebugPanel.vue'
import DesignToolPanel from './DesignToolPanel.vue'
import IconSidebarPanels from './IconSidebarPanels.vue'

const props = defineProps({
  showGuineaPig: Boolean,
  showCageInteractions: Boolean,
  showMarket: Boolean
})

const emit = defineEmits(['gameReset', 'closeGuineaPig', 'closeCageInteractions', 'closeMarket'])

// Expose refs for external access
const debugPanelRef = ref(null)
const designToolPanelRef = ref(null)
const specimenPanelsRef = ref(null)
const themeExplorerPanelRef = ref(null)

// Expose methods for external access
defineExpose({
  debugPanelRef,
  designToolPanelRef,
  specimenPanelsRef,
  themeExplorerPanelRef
})
</script> 