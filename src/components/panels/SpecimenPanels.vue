<script setup>
import { ref, reactive, computed } from 'vue'
import Panel from '../shared/Panel.vue'
import SpecimenLanding from '../specimen/SpecimenLanding.vue'
import ButtonSpecimen from '../specimen/ButtonSpecimen.vue'
import DropdownSpecimen from '../specimen/DropdownSpecimen.vue'
import ModalSpecimen from '../specimen/ModalSpecimen.vue'
import StatusBarSpecimen from '../specimen/StatusBarSpecimen.vue'
import InputSpecimen from '../specimen/InputSpecimen.vue'
import FormGroupSpecimen from '../specimen/FormGroupSpecimen.vue'
import ToggleSpecimen from '../specimen/ToggleSpecimen.vue'
import DetailsSpecimen from '../specimen/DetailsSpecimen.vue'
import TabsSpecimen from '../specimen/TabsSpecimen.vue'

// Configuration for all specimens
const specimens = [
  {
    key: 'landing',
    title: 'Component Specimens',
    component: SpecimenLanding,
    props: {}
  },
  {
    key: 'button',
    title: 'Button Component Specimen',
    component: ButtonSpecimen,
    props: {}
  },
  {
    key: 'dropdown',
    title: 'Dropdown Component Specimen',
    component: DropdownSpecimen,
    props: {}
  },
  {
    key: 'modal',
    title: 'Modal Component Specimen',
    component: ModalSpecimen,
    props: {}
  },
  {
    key: 'statusBar',
    title: 'StatusBar Component Specimen',
    component: StatusBarSpecimen,
    props: {}
  },
  {
    key: 'input',
    title: 'Input Component Specimen',
    component: InputSpecimen,
    props: {}
  },
  {
    key: 'formGroup',
    title: 'FormGroup Component Specimen',
    component: FormGroupSpecimen,
    props: {}
  },
  {
    key: 'toggle',
    title: 'Toggle Component Specimen',
    component: ToggleSpecimen,
    props: {}
  },
  {
    key: 'details',
    title: 'Details Component Specimen',
    component: DetailsSpecimen,
    props: {}
  },
  {
    key: 'tabs',
    title: 'Tabs Component Specimen',
    component: TabsSpecimen,
    props: {}
  }
]

// Reactive visibility state for all specimens
const visibility = specimens.reduce((acc, specimen) => {
  acc[specimen.key] = ref(false)
  return acc
}, {})

// Helper function to close all panels except the specified one
const closeAllPanelsExcept = (exceptPanel) => {
  Object.keys(visibility).forEach(key => {
    visibility[key].value = key === exceptPanel ? visibility[key].value : false
  })
}

// Generate toggle functions dynamically
const toggleFunctions = specimens.reduce((acc, specimen) => {
  const functionName = `toggle${specimen.key.charAt(0).toUpperCase() + specimen.key.slice(1)}Specimen`
  acc[functionName] = () => {
    closeAllPanelsExcept(specimen.key)
    visibility[specimen.key].value = !visibility[specimen.key].value
  }
  return acc
}, {})

// Create computed properties for landing event handlers
const landingEventHandlers = computed(() => {
  return specimens
    .filter(specimen => specimen.key !== 'landing')
    .reduce((acc, specimen) => {
      const eventName = `show${specimen.key.charAt(0).toUpperCase() + specimen.key.slice(1)}Specimen`
      const functionName = `toggle${specimen.key.charAt(0).toUpperCase() + specimen.key.slice(1)}Specimen`
      acc[eventName] = toggleFunctions[functionName]
      return acc
    }, {})
})

// Expose all toggle functions for external use
defineExpose(toggleFunctions)
</script>

<template>
  <!-- Generate all specimen panels dynamically -->
  <Panel 
    v-for="specimen in specimens" 
    :key="specimen.key"
    :isOpen="visibility[specimen.key].value" 
    :title="specimen.title" 
    @close="visibility[specimen.key].value = false"
  >
    <!-- Special handling for landing panel -->
    <component 
      :is="specimen.component"
      v-if="specimen.key === 'landing'"
      v-on="landingEventHandlers"
    />
    
    <!-- All other specimen panels -->
    <component 
      :is="specimen.component"
      v-else
      v-bind="specimen.props"
      @backToLanding="toggleFunctions.toggleLandingSpecimen"
    />
  </Panel>
</template> 