<template>
  <SpecimenPage
    title="Dropdown Component Examples"
    description="This page showcases the dropdown component with various examples and use cases."
    @backToLanding="$emit('backToLanding')"
  >
    
      <div class="gps-specimen__section">
        <h2 class="gps-specimen__section-title">Basic Dropdown</h2>
        <p class="gps-specimen__section-desc">A simple dropdown with basic functionality.</p>
        <div class="gps-specimen__examples">
          <Dropdown
            v-model="selectedFruit"
            :options="fruitOptions"
            placeholder="Choose a fruit"
            @change="handleFruitChange"
          />
        </div>
        <p>Selected: {{ selectedFruit || 'None' }}</p>
      </div>

      <div class="gps-specimen__section">
        <h2 class="gps-specimen__section-title">Disabled Dropdown</h2>
        <p class="gps-specimen__section-desc">Dropdown in disabled state, not interactive.</p>
        <div class="gps-specimen__examples">
          <Dropdown
            v-model="selectedColor"
            :options="colorOptions"
            placeholder="Choose a color"
            :disabled="true"
          />
        </div>
      </div>

      <div class="gps-specimen__section">
        <h2 class="gps-specimen__section-title">Custom Styled Dropdown</h2>
        <p class="gps-specimen__section-desc">Dropdown with custom trigger styling.</p>
        <div class="gps-specimen__examples">
          <Dropdown
            v-model="selectedSize"
            :options="sizeOptions"
            placeholder="Select size"
            trigger-class="gps-dropdown-specimen__custom-trigger"
            aria-label="Size selection"
          />
        </div>
      </div>

      <div class="gps-specimen__section">
        <h2 class="gps-specimen__section-title">Multiple Dropdowns</h2>
        <p class="gps-specimen__section-desc">Multiple dropdowns working together.</p>
        <div class="gps-dropdown-specimen__row">
          <Dropdown
            v-model="selectedCategory"
            :options="categoryOptions"
            placeholder="Category"
          />
          <Dropdown
            v-model="selectedSubcategory"
            :options="subcategoryOptions"
            placeholder="Subcategory"
          />
        </div>
      </div>


  </SpecimenPage>
</template>

<script setup>
import { ref, computed } from 'vue'
import Dropdown from '../shared/Dropdown.vue'
import SpecimenPage from './SpecimenPage.vue'

const emit = defineEmits(['backToLanding'])

const selectedFruit = ref('')
const selectedColor = ref('red')
const selectedSize = ref('')
const selectedCategory = ref('')
const selectedSubcategory = ref('')

const fruitOptions = [
  { value: 'apple', label: '🍎 Apple' },
  { value: 'banana', label: '🍌 Banana' },
  { value: 'orange', label: '🍊 Orange' },
  { value: 'grape', label: '🍇 Grape' },
  { value: 'strawberry', label: '🍓 Strawberry' }
]

const colorOptions = [
  { value: 'red', label: '🔴 Red' },
  { value: 'blue', label: '🔵 Blue' },
  { value: 'green', label: '🟢 Green' },
  { value: 'yellow', label: '🟡 Yellow' },
  { value: 'purple', label: '🟣 Purple' }
]

const sizeOptions = [
  { value: 'xs', label: 'Extra Small' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' }
]

const categoryOptions = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'books', label: 'Books' },
  { value: 'home', label: 'Home & Garden' }
]

const subcategoryOptions = computed(() => {
  const subcategories = {
    electronics: [
      { value: 'phones', label: 'Phones' },
      { value: 'laptops', label: 'Laptops' },
      { value: 'tablets', label: 'Tablets' }
    ],
    clothing: [
      { value: 'shirts', label: 'Shirts' },
      { value: 'pants', label: 'Pants' },
      { value: 'shoes', label: 'Shoes' }
    ],
    books: [
      { value: 'fiction', label: 'Fiction' },
      { value: 'non-fiction', label: 'Non-Fiction' },
      { value: 'textbooks', label: 'Textbooks' }
    ],
    home: [
      { value: 'furniture', label: 'Furniture' },
      { value: 'decor', label: 'Decor' },
      { value: 'kitchen', label: 'Kitchen' }
    ]
  }
  
  return subcategories[selectedCategory.value] || []
})

function handleFruitChange(option) {
  selectedFruit.value = option.value
}
</script>

<style>
.gps-dropdown-specimen__row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.gps-dropdown-specimen__row .gps-dropdown {
  flex: 1;
  min-width: 150px;
}

.gps-dropdown-specimen__custom-trigger {
  background: var(--color-accent) !important;
  color: var(--color-white) !important;
  border-color: var(--color-accent) !important;
}

.gps-dropdown-specimen__custom-trigger:hover {
  background: var(--color-accent-hover) !important;
  border-color: var(--color-accent-hover) !important;
}



/* Responsive */
@media (max-width: 768px) {
  .gps-dropdown-specimen__row {
    flex-direction: column;
  }
  
  .gps-dropdown-specimen__row .gps-dropdown {
    min-width: auto;
  }
}
</style> 