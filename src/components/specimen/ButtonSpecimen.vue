<template>
  <SpecimenPage
    title="Button Component Specimen"
    description="This page showcases all available button variations in the Guinea Pig Simulator design system."
    @backToLanding="$emit('backToLanding')"
  >

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Primary Buttons</h2>
      <p class="gps-specimen__section-desc">Main call-to-action buttons with accent color background.</p>
      <div class="gps-specimen__examples">
        <Button type="primary">Primary Button</Button>
        <Button type="primary">Start Game</Button>
        <Button type="primary">Save Changes</Button>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Secondary Buttons</h2>
      <p class="gps-specimen__section-desc">Secondary actions with transparent background and border.</p>
      <div class="gps-specimen__examples">
        <Button type="secondary">Secondary Button</Button>
        <Button type="secondary">View Inventory</Button>
        <Button type="secondary">Show Info</Button>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Flat Buttons</h2>
      <p class="gps-specimen__section-desc">Subtle buttons with no background or border, used for theme toggles and minor actions.</p>
      <div class="gps-specimen__examples">
        <Button type="flat">Flat Button</Button>
        <Button type="flat">🌙 Dark</Button>
        <Button type="flat">🌞 Light</Button>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Warning Buttons</h2>
      <p class="gps-specimen__section-desc">Buttons for actions that require caution, with orange background.</p>
      <div class="gps-specimen__examples">
        <Button type="warning">Warning Button</Button>
        <Button type="warning">Clear Cage</Button>
        <Button type="warning">Delete Item</Button>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Danger Buttons</h2>
      <p class="gps-specimen__section-desc">Buttons for destructive actions, with red background.</p>
      <div class="gps-specimen__examples">
        <Button type="danger">Danger Button</Button>
        <Button type="danger">Reset Game</Button>
        <Button type="danger">Delete Account</Button>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Disabled Buttons</h2>
      <p class="gps-specimen__section-desc">Buttons that are not interactive, with reduced opacity.</p>
      <div class="gps-specimen__examples">
        <Button type="disabled">Disabled Button</Button>
        <Button type="disabled">Not Available</Button>
        <Button type="disabled">Coming Soon</Button>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Mixed Examples</h2>
      <p class="gps-specimen__section-desc">How different button types work together in a form or interface.</p>
      <div class="gps-specimen__examples">
        <Button type="primary">Save</Button>
        <Button type="secondary">Cancel</Button>
        <Button type="danger">Delete</Button>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Usage Guidelines</h2>
      <div class="gps-specimen__guidelines">
        <h3>When to use each type:</h3>
        <ul>
          <li><strong>Primary:</strong> Main actions, form submissions, game progression</li>
          <li><strong>Secondary:</strong> Alternative actions, navigation, information display</li>
          <li><strong>Flat:</strong> Theme toggles, minor UI controls, subtle actions</li>
          <li><strong>Warning:</strong> Actions that require user attention but aren't destructive</li>
          <li><strong>Danger:</strong> Destructive actions, data loss, permanent changes</li>
          <li><strong>Disabled:</strong> Unavailable actions, loading states, permissions</li>
        </ul>
      </div>
    </div>
  </SpecimenPage>
</template>

<script setup>
import Button from '../shared/Button.vue'
import SpecimenPage from './SpecimenPage.vue'

const emit = defineEmits(['backToLanding'])
</script> 