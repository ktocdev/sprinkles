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

// Specimen panel visibility state
const showSpecimenLanding = ref(false)
const showButtonSpecimen = ref(false)
const showDropdownSpecimen = ref(false)
const showModalSpecimen = ref(false)
const showStatusBarSpecimen = ref(false)
const showInputSpecimen = ref(false)
const showFormGroupSpecimen = ref(false)
const showToggleSpecimen = ref(false)

function toggleSpecimenLanding() {
  showButtonSpecimen.value = false
  showDropdownSpecimen.value = false
  showModalSpecimen.value = false
  showStatusBarSpecimen.value = false
  showInputSpecimen.value = false
  showFormGroupSpecimen.value = false
  showToggleSpecimen.value = false
  showSpecimenLanding.value = !showSpecimenLanding.value
}

function toggleButtonSpecimen() {
  showSpecimenLanding.value = false
  showButtonSpecimen.value = !showButtonSpecimen.value
}

function toggleDropdownSpecimen() {
  showSpecimenLanding.value = false
  showButtonSpecimen.value = false
  showModalSpecimen.value = false
  showStatusBarSpecimen.value = false
  showDropdownSpecimen.value = !showDropdownSpecimen.value
}

function toggleModalSpecimen() {
  showSpecimenLanding.value = false
  showButtonSpecimen.value = false
  showDropdownSpecimen.value = false
  showStatusBarSpecimen.value = false
  showModalSpecimen.value = !showModalSpecimen.value
}

function toggleStatusBarSpecimen() {
  showSpecimenLanding.value = false
  showButtonSpecimen.value = false
  showDropdownSpecimen.value = false
  showModalSpecimen.value = false
  showInputSpecimen.value = false
  showStatusBarSpecimen.value = !showStatusBarSpecimen.value
}

function toggleInputSpecimen() {
  showSpecimenLanding.value = false
  showButtonSpecimen.value = false
  showDropdownSpecimen.value = false
  showModalSpecimen.value = false
  showStatusBarSpecimen.value = false
  showFormGroupSpecimen.value = false
  showInputSpecimen.value = !showInputSpecimen.value
}

function toggleFormGroupSpecimen() {
  showSpecimenLanding.value = false
  showButtonSpecimen.value = false
  showDropdownSpecimen.value = false
  showModalSpecimen.value = false
  showStatusBarSpecimen.value = false
  showInputSpecimen.value = false
  showToggleSpecimen.value = false
  showFormGroupSpecimen.value = !showFormGroupSpecimen.value
}

function toggleToggleSpecimen() {
  showSpecimenLanding.value = false
  showButtonSpecimen.value = false
  showDropdownSpecimen.value = false
  showModalSpecimen.value = false
  showStatusBarSpecimen.value = false
  showInputSpecimen.value = false
  showFormGroupSpecimen.value = false
  showToggleSpecimen.value = !showToggleSpecimen.value
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
  toggleToggleSpecimen
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
</template> 