<script setup>
import { ref } from 'vue'
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

// Specimen panel visibility state
const showSpecimenLanding = ref(false)
const showButtonSpecimen = ref(false)
const showDropdownSpecimen = ref(false)
const showModalSpecimen = ref(false)
const showStatusBarSpecimen = ref(false)
const showInputSpecimen = ref(false)
const showFormGroupSpecimen = ref(false)
const showToggleSpecimen = ref(false)
const showDetailsSpecimen = ref(false)

// Helper function to close all panels except the specified one
function closeAllPanelsExcept(exceptPanel) {
  showSpecimenLanding.value = exceptPanel === 'landing' ? showSpecimenLanding.value : false
  showButtonSpecimen.value = exceptPanel === 'button' ? showButtonSpecimen.value : false
  showDropdownSpecimen.value = exceptPanel === 'dropdown' ? showDropdownSpecimen.value : false
  showModalSpecimen.value = exceptPanel === 'modal' ? showModalSpecimen.value : false
  showStatusBarSpecimen.value = exceptPanel === 'statusBar' ? showStatusBarSpecimen.value : false
  showInputSpecimen.value = exceptPanel === 'input' ? showInputSpecimen.value : false
  showFormGroupSpecimen.value = exceptPanel === 'formGroup' ? showFormGroupSpecimen.value : false
  showToggleSpecimen.value = exceptPanel === 'toggle' ? showToggleSpecimen.value : false
  showDetailsSpecimen.value = exceptPanel === 'details' ? showDetailsSpecimen.value : false
}

function toggleSpecimenLanding() {
  closeAllPanelsExcept('landing')
  showSpecimenLanding.value = !showSpecimenLanding.value
}

function toggleButtonSpecimen() {
  closeAllPanelsExcept('button')
  showButtonSpecimen.value = !showButtonSpecimen.value
}

function toggleDropdownSpecimen() {
  closeAllPanelsExcept('dropdown')
  showDropdownSpecimen.value = !showDropdownSpecimen.value
}

function toggleModalSpecimen() {
  closeAllPanelsExcept('modal')
  showModalSpecimen.value = !showModalSpecimen.value
}

function toggleStatusBarSpecimen() {
  closeAllPanelsExcept('statusBar')
  showStatusBarSpecimen.value = !showStatusBarSpecimen.value
}

function toggleInputSpecimen() {
  closeAllPanelsExcept('input')
  showInputSpecimen.value = !showInputSpecimen.value
}

function toggleFormGroupSpecimen() {
  closeAllPanelsExcept('formGroup')
  showFormGroupSpecimen.value = !showFormGroupSpecimen.value
}

function toggleToggleSpecimen() {
  closeAllPanelsExcept('toggle')
  showToggleSpecimen.value = !showToggleSpecimen.value
}

function toggleDetailsSpecimen() {
  closeAllPanelsExcept('details')
  showDetailsSpecimen.value = !showDetailsSpecimen.value
}

// Expose functions for external use
defineExpose({
  toggleSpecimenLanding,
  toggleButtonSpecimen,
  toggleDropdownSpecimen,
  toggleModalSpecimen,
  toggleStatusBarSpecimen,
  toggleInputSpecimen,
  toggleFormGroupSpecimen,
  toggleToggleSpecimen,
  toggleDetailsSpecimen
})
</script>

<template>
  <!-- Specimen Landing Panel -->
  <Panel 
    :isOpen="showSpecimenLanding" 
    title="Component Specimens" 
    @close="showSpecimenLanding = false"
  >
    <SpecimenLanding 
      @showButtonSpecimen="toggleButtonSpecimen"
      @showDropdownSpecimen="toggleDropdownSpecimen"
      @showModalSpecimen="toggleModalSpecimen"
      @showStatusBarSpecimen="toggleStatusBarSpecimen"
      @showInputSpecimen="toggleInputSpecimen"
      @showFormGroupSpecimen="toggleFormGroupSpecimen"
      @showToggleSpecimen="toggleToggleSpecimen"
      @showDetailsSpecimen="toggleDetailsSpecimen"
    />
  </Panel>

  <!-- Button Specimen Panel -->
  <Panel 
    :isOpen="showButtonSpecimen" 
    title="Button Component Specimen" 
    @close="showButtonSpecimen = false"
  >
    <ButtonSpecimen @backToLanding="toggleSpecimenLanding" />
  </Panel>

  <!-- Dropdown Specimen Panel -->
  <Panel 
    :isOpen="showDropdownSpecimen" 
    title="Dropdown Component Specimen" 
    @close="showDropdownSpecimen = false"
  >
    <DropdownSpecimen @backToLanding="toggleSpecimenLanding" />
  </Panel>

  <!-- Modal Specimen Panel -->
  <Panel 
    :isOpen="showModalSpecimen" 
    title="Modal Component Specimen" 
    @close="showModalSpecimen = false"
  >
    <ModalSpecimen @backToLanding="toggleSpecimenLanding" />
  </Panel>

  <!-- StatusBar Specimen Panel -->
  <Panel 
    :isOpen="showStatusBarSpecimen" 
    title="StatusBar Component Specimen" 
    @close="showStatusBarSpecimen = false"
  >
    <StatusBarSpecimen @backToLanding="toggleSpecimenLanding" />
  </Panel>

  <!-- Input Specimen Panel -->
  <Panel 
    :isOpen="showInputSpecimen" 
    title="Input Component Specimen" 
    @close="showInputSpecimen = false"
  >
    <InputSpecimen @backToLanding="toggleSpecimenLanding" />
  </Panel>

  <!-- FormGroup Specimen Panel -->
  <Panel 
    :isOpen="showFormGroupSpecimen" 
    title="FormGroup Component Specimen" 
    @close="showFormGroupSpecimen = false"
  >
    <FormGroupSpecimen @backToLanding="toggleSpecimenLanding" />
  </Panel>

  <!-- Toggle Specimen Panel -->
  <Panel 
    :isOpen="showToggleSpecimen" 
    title="Toggle Component Specimen" 
    @close="showToggleSpecimen = false"
  >
    <ToggleSpecimen @backToLanding="toggleSpecimenLanding" />
  </Panel>

  <!-- Details Specimen Panel -->
  <Panel 
    :isOpen="showDetailsSpecimen" 
    title="Details Component Specimen" 
    @close="showDetailsSpecimen = false"
  >
    <DetailsSpecimen @backToLanding="toggleSpecimenLanding" />
  </Panel>
</template> 