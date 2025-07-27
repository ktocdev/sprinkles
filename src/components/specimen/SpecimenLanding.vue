<template>
  <div class="gps-specimen-landing gps-panel-content">
    <h2 class="gps-specimen-landing__title">Component Specimens</h2>
    <p class="gps-specimen-landing__description">
      This page showcases all the reusable components used throughout the application. 
      Click on any component to view its specimen page with examples and documentation.
    </p>

    <div class="gps-specimen-landing__grid">
      <!-- Button Specimen -->
      <div class="gps-specimen-landing__card gps-panel-section">
        <div class="gps-specimen-landing__card-header">
          <div class="gps-specimen-landing__card-icon">🔘</div>
          <h3 class="gps-specimen-landing__card-title">Button Component</h3>
        </div>
        <p class="gps-specimen-landing__card-description">
          Reusable button component with multiple variants including primary, secondary, flat, warning, and danger styles.
        </p>
        <div class="gps-specimen-landing__card-features">
          <span class="gps-specimen-landing__feature">Multiple variants</span>
          <span class="gps-specimen-landing__feature">Accessible</span>
          <span class="gps-specimen-landing__feature">Responsive</span>
        </div>
        <Button 
          type="primary" 
          @click="$emit('showButtonSpecimen')"
          class="gps-specimen-landing__card-button"
        >
          View Button Specimen
        </Button>
      </div>

      <!-- Dropdown Specimen -->
      <div class="gps-specimen-landing__card gps-panel-section">
        <div class="gps-specimen-landing__card-header">
          <div class="gps-specimen-landing__card-icon">📋</div>
          <h3 class="gps-specimen-landing__card-title">Dropdown Component</h3>
        </div>
        <p class="gps-specimen-landing__card-description">
          Custom dropdown component with search functionality, keyboard navigation, and customizable options.
        </p>
        <div class="gps-specimen-landing__card-features">
          <span class="gps-specimen-landing__feature">Searchable</span>
          <span class="gps-specimen-landing__feature">Keyboard nav</span>
          <span class="gps-specimen-landing__feature">Customizable</span>
        </div>
        <Button 
          type="primary" 
          @click="$emit('showDropdownSpecimen')"
          class="gps-specimen-landing__card-button"
        >
          View Dropdown Specimen
        </Button>
      </div>

      <!-- Modal Specimen -->
      <div class="gps-specimen-landing__card gps-panel-section">
        <div class="gps-specimen-landing__card-header">
          <div class="gps-specimen-landing__card-icon">🪟</div>
          <h3 class="gps-specimen-landing__card-title">Modal Component</h3>
        </div>
        <p class="gps-specimen-landing__card-description">
          Reusable modal dialog component with backdrop, customizable content, and action buttons.
        </p>
        <div class="gps-specimen-landing__card-features">
          <span class="gps-specimen-landing__feature">Backdrop</span>
          <span class="gps-specimen-landing__feature">Slot-based</span>
          <span class="gps-specimen-landing__feature">Responsive</span>
        </div>
        <Button 
          type="primary" 
          @click="$emit('showModalSpecimen')"
          class="gps-specimen-landing__card-button"
        >
          View Modal Specimen
        </Button>
      </div>



      <!-- StatusBar Specimen -->
      <div class="gps-specimen-landing__card gps-panel-section">
        <div class="gps-specimen-landing__card-header">
          <div class="gps-specimen-landing__card-icon">📊</div>
          <h3 class="gps-specimen-landing__card-title">StatusBar Component</h3>
        </div>
        <p class="gps-specimen-landing__card-description">
          Progress bar component for displaying status, health, and other numerical values with visual indicators.
        </p>
        <div class="gps-specimen-landing__card-features">
          <span class="gps-specimen-landing__feature">Progress bars</span>
          <span class="gps-specimen-landing__feature">Color coding</span>
          <span class="gps-specimen-landing__feature">Labels</span>
        </div>
        <Button 
          type="primary" 
          @click="$emit('showStatusBarSpecimen')"
          class="gps-specimen-landing__card-button"
        >
          View StatusBar Specimen
        </Button>
      </div>

      <!-- Input Specimen -->
      <div class="gps-specimen-landing__card gps-panel-section">
        <div class="gps-specimen-landing__card-header">
          <div class="gps-specimen-landing__card-icon">📝</div>
          <h3 class="gps-specimen-landing__card-title">Input Component</h3>
        </div>
        <p class="gps-specimen-landing__card-description">
          Reusable input component with validation, icons, and various input types for forms and data entry.
        </p>
        <div class="gps-specimen-landing__card-features">
          <span class="gps-specimen-landing__feature">Multiple types</span>
          <span class="gps-specimen-landing__feature">Validation</span>
          <span class="gps-specimen-landing__feature">Icons</span>
        </div>
        <Button 
          type="primary" 
          @click="$emit('showInputSpecimen')"
          class="gps-specimen-landing__card-button"
        >
          View Input Specimen
        </Button>
      </div>

      <!-- FormGroup Specimen -->
      <div class="gps-specimen-landing__card gps-panel-section">
        <div class="gps-specimen-landing__card-header">
          <div class="gps-specimen-landing__card-icon">📋</div>
          <h3 class="gps-specimen-landing__card-title">FormGroup Component</h3>
        </div>
        <p class="gps-specimen-landing__card-description">
          Form field wrapper component that provides consistent layout, labels, and validation for form elements.
        </p>
        <div class="gps-specimen-landing__card-features">
          <span class="gps-specimen-landing__feature">Consistent layout</span>
          <span class="gps-specimen-landing__feature">Labels & validation</span>
          <span class="gps-specimen-landing__feature">Inline support</span>
        </div>
        <Button 
          type="primary" 
          @click="$emit('showFormGroupSpecimen')"
          class="gps-specimen-landing__card-button"
        >
          View FormGroup Specimen
        </Button>
      </div>

      <!-- Toggle Specimen -->
      <div class="gps-specimen-landing__card gps-panel-section">
        <div class="gps-specimen-landing__card-header">
          <div class="gps-specimen-landing__card-icon">🔘</div>
          <h3 class="gps-specimen-landing__card-title">Toggle Component</h3>
        </div>
        <p class="gps-specimen-landing__card-description">
          Physical switch-like toggle component that functions like a checkbox but with a sliding dot animation.
        </p>
        <div class="gps-specimen-landing__card-features">
          <span class="gps-specimen-landing__feature">Switch design</span>
          <span class="gps-specimen-landing__feature">Smooth animation</span>
          <span class="gps-specimen-landing__feature">Accessible</span>
        </div>
        <Button 
          type="primary" 
          @click="$emit('showToggleSpecimen')"
          class="gps-specimen-landing__card-button"
        >
          View Toggle Specimen
        </Button>
      </div>


    </div>

    <div class="gps-specimen-landing__footer gps-panel-section">
      <h3 class="gps-specimen-landing__footer-title">About Component Specimens</h3>
      <p class="gps-specimen-landing__footer-description">
        These specimen pages serve as both documentation and testing environments for our reusable components. 
        Each specimen demonstrates the component's features, provides usage examples, and shows how it behaves 
        in different scenarios. This helps ensure consistency across the application and makes it easier for 
        developers to understand and use the components effectively.
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import Button from '../shared/Button.vue'

const emit = defineEmits([
  'showButtonSpecimen',
  'showDropdownSpecimen', 
  'showModalSpecimen',
  'showStatusBarSpecimen',
  'showInputSpecimen',
  'showFormGroupSpecimen',
  'showToggleSpecimen'
])
</script>

<style>
.gps-specimen-landing__title {
  font-size: var(--font-size-3xl);
  color: var(--color-accent);
  margin-block-end: 1rem;
  font-weight: var(--font-weight-bold);
  text-align: center;
}

.gps-specimen-landing__description {
  color: var(--color-text);
  opacity: 0.8;
  margin-block-end: 3rem;
  font-size: var(--font-size-base);
  text-align: center;
  max-width: 600px;
  margin-inline: auto;
  line-height: var(--line-height-relaxed);
}

.gps-specimen-landing__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-block-end: 3rem;
}

.gps-specimen-landing__card {
  padding: 2rem;
  transition: var(--transition);
  border: 1px solid var(--color-border);
}

.gps-specimen-landing__card:hover {
  border-color: var(--color-accent);
  box-shadow: var(--box-shadow-medium);
}

.gps-specimen-landing__card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-block-end: 1rem;
}

.gps-specimen-landing__card-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent);
  color: var(--color-white);
  border-radius: var(--border-radius);
  flex-shrink: 0;
}

.gps-specimen-landing__card-title {
  font-size: var(--font-size-xl);
  color: var(--color-text);
  margin: 0;
  font-weight: var(--font-weight-semibold);
}

.gps-specimen-landing__card-description {
  color: var(--color-text);
  opacity: 0.8;
  margin: 0 0 1.5rem 0;
  line-height: var(--line-height-relaxed);
}

.gps-specimen-landing__card-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block-end: 1.5rem;
}

.gps-specimen-landing__feature {
  background: var(--color-accent);
  color: var(--color-white);
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.gps-specimen-landing__card-button {
  width: 100%;
}

.gps-specimen-landing__footer {
  text-align: center;
  padding: 2rem;
}

.gps-specimen-landing__footer-title {
  font-size: var(--font-size-xl);
  color: var(--color-accent);
  margin: 0 0 1rem 0;
  font-weight: var(--font-weight-semibold);
}

.gps-specimen-landing__footer-description {
  color: var(--color-text);
  opacity: 0.8;
  margin: 0;
  line-height: var(--line-height-relaxed);
  max-width: 800px;
  margin-inline: auto;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .gps-specimen-landing__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .gps-specimen-landing__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style> 