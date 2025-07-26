<template>
  <SpecimenPage
    title="FormGroup Component Specimen"
    description="This page demonstrates the FormGroup component with various layouts and form field combinations."
    @backToLanding="$emit('backToLanding')"
  >
    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Basic Form Groups</h3>
      <p class="gps-specimen__section-desc">
        Standard form groups with labels and content.
      </p>
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <h4>Simple Form Group</h4>
          <FormGroup label="Name">
            <Input 
              v-model="name"
              placeholder="Enter your name"
              icon="👤"
            />
          </FormGroup>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Required Field</h4>
          <FormGroup label="Email" required>
            <Input 
              v-model="email"
              type="email"
              placeholder="Enter your email"
              icon="📧"
            />
          </FormGroup>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>With Hint</h4>
          <FormGroup label="Phone" hint="Format: (123) 456-7890">
            <Input 
              v-model="phone"
              type="tel"
              placeholder="Enter phone number"
              icon="📞"
            />
          </FormGroup>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>With Error</h4>
          <FormGroup label="Username" errorMessage="Username must be at least 3 characters">
            <Input 
              v-model="username"
              placeholder="Enter username"
              icon="👤"
            />
          </FormGroup>
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Inline Layout</h3>
      <p class="gps-specimen__section-desc">
        Form groups with inline layout for horizontal forms.
      </p>
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <h4>Inline Form Group</h4>
          <FormGroup label="First Name" inline>
            <Input 
              v-model="firstName"
              placeholder="First name"
            />
          </FormGroup>
          
          <FormGroup label="Last Name" inline>
            <Input 
              v-model="lastName"
              placeholder="Last name"
            />
          </FormGroup>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Inline with Dropdown</h4>
          <FormGroup label="Category" inline>
            <Dropdown
              v-model="category"
              :options="categoryOptions"
              placeholder="Select category"
            />
          </FormGroup>
          
          <FormGroup label="Subcategory" inline>
            <Dropdown
              v-model="subcategory"
              :options="subcategoryOptions"
              placeholder="Select subcategory"
            />
          </FormGroup>
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Complex Forms</h3>
      <p class="gps-specimen__section-desc">
        More complex form layouts with multiple components.
      </p>
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <h4>Registration Form</h4>
          <div class="gps-formgroup-specimen__form">
            <FormGroup label="Full Name" required>
              <Input 
                v-model="fullName"
                placeholder="Enter your full name"
                icon="👤"
              />
            </FormGroup>
            
            <FormGroup label="Email Address" required errorMessage="Please enter a valid email address">
              <Input 
                v-model="regEmail"
                type="email"
                placeholder="Enter your email"
                icon="📧"
              />
            </FormGroup>
            
            <FormGroup label="Password" required hint="Must be at least 8 characters">
              <Input 
                v-model="regPassword"
                type="password"
                placeholder="Enter password"
                icon="🔒"
              />
            </FormGroup>
            
            <FormGroup label="Confirm Password" required>
              <Input 
                v-model="confirmPassword"
                type="password"
                placeholder="Confirm password"
                icon="🔒"
              />
            </FormGroup>
            
            <FormGroup label="Account Type" inline>
              <Dropdown
                v-model="accountType"
                :options="accountTypeOptions"
                placeholder="Select account type"
              />
            </FormGroup>
            
            <div class="gps-formgroup-specimen__actions">
              <Button type="primary">Create Account</Button>
              <Button type="secondary">Cancel</Button>
            </div>
          </div>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Settings Form</h4>
          <div class="gps-formgroup-specimen__form">
            <FormGroup label="Display Name" inline>
              <Input 
                v-model="displayName"
                placeholder="Enter display name"
              />
            </FormGroup>
            
            <FormGroup label="Theme" inline>
              <Dropdown
                v-model="theme"
                :options="themeOptions"
                placeholder="Select theme"
              />
            </FormGroup>
            
            <FormGroup label="Notifications" inline>
              <div class="gps-formgroup-specimen__checkbox-group">
                <label class="gps-formgroup-specimen__checkbox">
                  <input type="checkbox" v-model="emailNotifications" />
                  Email notifications
                </label>
                <label class="gps-formgroup-specimen__checkbox">
                  <input type="checkbox" v-model="pushNotifications" />
                  Push notifications
                </label>
              </div>
            </FormGroup>
            
            <FormGroup label="Bio" hint="Tell us about yourself">
              <textarea 
                v-model="bio"
                placeholder="Enter your bio..."
                class="gps-formgroup-specimen__textarea"
                rows="3"
              ></textarea>
            </FormGroup>
            
            <div class="gps-formgroup-specimen__actions">
              <Button type="primary">Save Settings</Button>
              <Button type="secondary">Reset</Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">FormGroup Features</h3>
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <h4>🎯 Props</h4>
          <ul>
            <li><code>label</code> - Form group label</li>
            <li><code>required</code> - Mark as required field</li>
            <li><code>inline</code> - Use inline layout</li>
            <li><code>errorMessage</code> - Error message</li>
            <li><code>hint</code> - Helper text</li>
          </ul>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>🎨 Features</h4>
          <ul>
            <li>Consistent spacing and layout</li>
            <li>Required field indicators</li>
            <li>Error message display</li>
            <li>Hint text support</li>
            <li>Inline and vertical layouts</li>
            <li>Responsive design</li>
            <li>Accessible labels</li>
          </ul>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>📱 Responsive</h4>
          <ul>
            <li>Mobile-first design</li>
            <li>Inline layout stacks on mobile</li>
            <li>Consistent spacing across devices</li>
            <li>Touch-friendly interactions</li>
          </ul>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>🔧 Usage</h4>
          <ul>
            <li>Wrap form fields for consistent layout</li>
            <li>Use with Input, Dropdown, and other components</li>
            <li>Combine with validation states</li>
            <li>Create complex form layouts</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Usage Examples</h3>
      <p class="gps-specimen__section-desc">
        Code examples showing how to implement different form layouts.
      </p>
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <h4>Basic Usage</h4>
          <pre class="gps-formgroup-specimen__code"><code>&lt;FormGroup label="Username"&gt;
  &lt;Input 
    v-model="username"
    placeholder="Enter username"
  /&gt;
&lt;/FormGroup&gt;</code></pre>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>With Validation</h4>
          <pre class="gps-formgroup-specimen__code"><code>&lt;FormGroup 
  label="Email" 
  required
  errorMessage="Please enter a valid email"
&gt;
  &lt;Input 
    v-model="email"
    type="email"
    placeholder="Enter email"
  /&gt;
&lt;/FormGroup&gt;</code></pre>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Inline Layout</h4>
          <pre class="gps-formgroup-specimen__code"><code>&lt;FormGroup label="Category" inline&gt;
  &lt;Dropdown
    v-model="category"
    :options="options"
    placeholder="Select category"
  /&gt;
&lt;/FormGroup&gt;</code></pre>
        </div>
      </div>
    </div>
  </SpecimenPage>
</template>

<script setup>
import { ref, computed } from 'vue'
import FormGroup from '../shared/FormGroup.vue'
import Input from '../shared/Input.vue'
import Dropdown from '../shared/Dropdown.vue'
import Button from '../shared/Button.vue'
import SpecimenPage from './SpecimenPage.vue'

const emit = defineEmits(['backToLanding'])

// Basic form data
const name = ref('')
const email = ref('')
const phone = ref('')
const username = ref('ab')

// Inline form data
const firstName = ref('')
const lastName = ref('')
const category = ref('')
const subcategory = ref('')

// Complex form data
const fullName = ref('')
const regEmail = ref('')
const regPassword = ref('')
const confirmPassword = ref('')
const accountType = ref('')
const displayName = ref('')
const theme = ref('')
const emailNotifications = ref(false)
const pushNotifications = ref(false)
const bio = ref('')

// Options for dropdowns
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
  
  return subcategories[category.value] || []
})

const accountTypeOptions = [
  { value: 'personal', label: 'Personal' },
  { value: 'business', label: 'Business' },
  { value: 'enterprise', label: 'Enterprise' }
]

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' }
]
</script>

<style>
/* Code block styling */
.gps-formgroup-specimen__code {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 1rem;
  overflow-x: auto;
  margin: 0;
}

.gps-formgroup-specimen__code code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: var(--font-size-sm);
  color: var(--color-text);
  line-height: 1.4;
}

/* Form styling */
.gps-formgroup-specimen__form {
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-block-end: 1rem;
}

.gps-formgroup-specimen__actions {
  display: flex;
  gap: 1rem;
  margin-block-start: 1.5rem;
  padding-block-start: 1.5rem;
  border-block-start: 1px solid var(--color-border);
}

.gps-formgroup-specimen__checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gps-formgroup-specimen__checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--font-size-sm);
  color: var(--color-text);
  cursor: pointer;
}

.gps-formgroup-specimen__checkbox input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  accent-color: var(--color-accent);
}

.gps-formgroup-specimen__textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: var(--font-size-base);
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: var(--transition);
}

.gps-formgroup-specimen__textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(var(--color-accent-rgb), 0.1);
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
@media (max-width: 768px) {
  .gps-formgroup-specimen__actions {
    flex-direction: column;
  }
  
  .gps-formgroup-specimen__form {
    padding: 1rem;
  }
}

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