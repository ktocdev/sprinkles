<template>
  <SpecimenPage
    title="Input Component Specimen"
    description="This page demonstrates the Input component with various types, states, and validation features."
    @backToLanding="$emit('backToLanding')"
  >
    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Basic Input Types</h3>
      <p class="gps-specimen__section-desc">
        Different input types for various use cases.
      </p>
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <h4>Text Input</h4>
          <Input 
            v-model="basicText"
            label="Name"
            placeholder="Enter your name"
            icon="👤"
          />
          <p>Value: {{ basicText || 'None' }}</p>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Email Input</h4>
          <Input 
            v-model="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            icon="📧"
          />
          <p>Value: {{ email || 'None' }}</p>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Password Input</h4>
          <Input 
            v-model="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            icon="🔒"
          />
          <p>Value: {{ password ? '••••••••' : 'None' }}</p>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Number Input</h4>
          <Input 
            v-model="age"
            type="number"
            label="Age"
            placeholder="Enter your age"
            min="0"
            max="120"
            icon="🎂"
          />
          <p>Value: {{ age || 'None' }}</p>
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Input States</h3>
      <p class="gps-specimen__section-desc">
        Different states and validation feedback.
      </p>
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <h4>Error State</h4>
          <Input 
            v-model="errorInput"
            label="Username"
            placeholder="Enter username"
            errorMessage="Username must be at least 3 characters long"
            icon="👤"
          />
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Success State</h4>
          <Input 
            v-model="successInput"
            label="Email"
            placeholder="Enter email"
            successMessage="Email format is valid!"
            icon="📧"
          />
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Disabled State</h4>
          <Input 
            v-model="disabledInput"
            label="Read-only Field"
            placeholder="This field is disabled"
            disabled
            icon="🔒"
          />
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Readonly State</h4>
          <Input 
            v-model="readonlyInput"
            type="readonly"
            label="Display Value"
            placeholder="This field is readonly"
            icon="📊"
            hint="This field shows information but cannot be edited"
          />
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>With Hint</h4>
          <Input 
            v-model="hintInput"
            label="Phone Number"
            placeholder="Enter phone number"
            hint="Format: (123) 456-7890"
            icon="📞"
          />
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Validation Examples</h3>
      <p class="gps-specimen__section-desc">
        Interactive validation examples.
      </p>
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <h4>Email Validation</h4>
          <Input 
            v-model="emailValidation"
            type="email"
            label="Email"
            placeholder="Enter email address"
            :errorMessage="emailError"
            :successMessage="emailSuccess"
            icon="📧"
          />
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Password Strength</h4>
          <Input 
            v-model="passwordValidation"
            type="password"
            label="Password"
            placeholder="Enter password"
            :errorMessage="passwordError"
            :successMessage="passwordSuccess"
            icon="🔒"
          />
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Specialized Inputs</h3>
      <p class="gps-specimen__section-desc">
        Specialized input types for specific use cases.
      </p>
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <h4>Date Input</h4>
          <Input 
            v-model="dateInput"
            type="date"
            label="Birth Date"
            icon="📅"
          />
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Time Input</h4>
          <Input 
            v-model="timeInput"
            type="time"
            label="Meeting Time"
            icon="⏰"
          />
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Search Input</h4>
          <Input 
            v-model="searchInput"
            type="search"
            label="Search"
            placeholder="Search for items..."
            icon="🔍"
          />
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>URL Input</h4>
          <Input 
            v-model="urlInput"
            type="url"
            label="Website"
            placeholder="https://example.com"
            icon="🌐"
          />
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Input Features</h3>
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <h4>🎯 Props</h4>
          <ul>
            <li><code>modelValue</code> - Input value (v-model)</li>
            <li><code>type</code> - Input type (text, email, password, etc.)</li>
            <li><code>label</code> - Input label</li>
            <li><code>placeholder</code> - Placeholder text</li>
            <li><code>disabled</code> - Disable the input</li>
            <li><code>required</code> - Mark as required</li>
            <li><code>icon</code> - Icon to display</li>
            <li><code>errorMessage</code> - Error message</li>
            <li><code>successMessage</code> - Success message</li>
            <li><code>hint</code> - Helper text</li>
          </ul>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>📡 Events</h4>
          <ul>
            <li><code>@update:modelValue</code> - Value changed</li>
            <li><code>@blur</code> - Input lost focus</li>
            <li><code>@focus</code> - Input gained focus</li>
            <li><code>@keydown</code> - Key pressed</li>
          </ul>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>🎨 Features</h4>
          <ul>
            <li>Accessible with proper labels and ARIA</li>
            <li>Error and success states</li>
            <li>Icon support</li>
            <li>Mobile-friendly (prevents zoom)</li>
            <li>Focus management</li>
            <li>Validation support</li>
          </ul>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>📱 Responsive</h4>
          <ul>
            <li>Mobile-first design</li>
            <li>Touch-friendly sizing</li>
            <li>iOS zoom prevention</li>
            <li>Flexible width</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Usage Examples</h3>
      <p class="gps-specimen__section-desc">
        Code examples showing how to implement different types of inputs.
      </p>
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <h4>Basic Usage</h4>
          <pre class="gps-input-specimen__code"><code>&lt;Input 
  v-model="username"
  label="Username"
  placeholder="Enter username"
/&gt;</code></pre>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>With Validation</h4>
          <pre class="gps-input-specimen__code"><code>&lt;Input 
  v-model="email"
  type="email"
  label="Email"
  :errorMessage="emailError"
  :successMessage="emailSuccess"
  icon="📧"
/&gt;</code></pre>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Required Field</h4>
          <pre class="gps-input-specimen__code"><code>&lt;Input 
  v-model="password"
  type="password"
  label="Password"
  required
  :errorMessage="passwordError"
  icon="🔒"
/&gt;</code></pre>
        </div>
      </div>
    </div>
  </SpecimenPage>
</template>

<script setup>
import { ref, computed } from 'vue'
import Input from '../shared/Input.vue'
import SpecimenPage from './SpecimenPage.vue'

const emit = defineEmits(['backToLanding'])

// Basic inputs
const basicText = ref('')
const email = ref('')
const password = ref('')
const age = ref('')

// State examples
const errorInput = ref('ab')
const successInput = ref('user@example.com')
const disabledInput = ref('Read-only content')
const hintInput = ref('')
const readonlyInput = ref('Read-only value')

// Validation examples
const emailValidation = ref('')
const passwordValidation = ref('')

// Specialized inputs
const dateInput = ref('')
const timeInput = ref('')
const searchInput = ref('')
const urlInput = ref('')

// Computed validation messages
const emailError = computed(() => {
  if (!emailValidation.value) return ''
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(emailValidation.value) ? '' : 'Please enter a valid email address'
})

const emailSuccess = computed(() => {
  if (!emailValidation.value) return ''
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(emailValidation.value) ? 'Email format is valid!' : ''
})

const passwordError = computed(() => {
  if (!passwordValidation.value) return ''
  if (passwordValidation.value.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  if (!/[A-Z]/.test(passwordValidation.value)) {
    return 'Password must contain at least one uppercase letter'
  }
  if (!/[a-z]/.test(passwordValidation.value)) {
    return 'Password must contain at least one lowercase letter'
  }
  if (!/\d/.test(passwordValidation.value)) {
    return 'Password must contain at least one number'
  }
  return ''
})

const passwordSuccess = computed(() => {
  if (!passwordValidation.value) return ''
  if (!passwordError.value) {
    return 'Password meets all requirements!'
  }
  return ''
})
</script>

<style>
/* Code block styling */
.gps-input-specimen__code {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 1rem;
  overflow-x: auto;
  margin: 0;
}

.gps-input-specimen__code code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: var(--font-size-sm);
  color: var(--color-text);
  line-height: 1.4;
}

/* Guidelines content styling */
.gps-specimen__guidelines h4 {
  color: var(--color-accent);
  margin: 0 0 0.75rem 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.gps-specimen__guidelines ul {
  margin: 0;
  padding-inline-start: 1.5rem;
}

.gps-specimen__guidelines li {
  margin-block-end: 0.25rem;
}

.gps-specimen__guidelines code {
  background: var(--color-bg);
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9em;
  color: var(--color-accent);
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .gps-specimen__examples {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .gps-specimen__examples {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style> 