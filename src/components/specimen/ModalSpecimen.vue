<template>
  <SpecimenPage
    title="Modal Component Specimen"
    description="This page demonstrates the Modal component with various configurations and use cases."
    @backToLanding="$emit('backToLanding')"
  >

    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Basic Modal Examples</h3>
      <p class="gps-specimen__section-desc">
        Click the buttons below to see different types of modals in action.
      </p>
      <div class="gps-panel-controls">
        <Button type="primary" @click="showBasicModal = true">
          📋 Basic Modal
        </Button>
        <Button type="secondary" @click="showLargeModal = true">
          📏 Large Content Modal
        </Button>
        <Button type="warning" @click="showFormModal = true">
          📝 Form Modal
        </Button>
        <Button type="danger" @click="showConfirmationModal = true">
          ⚠️ Confirmation Modal
        </Button>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Modal Features</h3>
      <p class="gps-specimen__section-desc">
        The Modal component provides a flexible overlay dialog system with various features.
      </p>
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <h4>🎯 Props</h4>
          <ul>
            <li><code>isVisible</code> - Controls modal visibility</li>
            <li><code>title</code> - Modal header title</li>
          </ul>
        </div>
        <div class="gps-specimen__guidelines">
          <h4>🎨 Slots</h4>
          <ul>
            <li><code>default</code> - Modal body content</li>
            <li><code>actions</code> - Action buttons (optional)</li>
          </ul>
        </div>
        <div class="gps-specimen__guidelines">
          <h4>📡 Events</h4>
          <ul>
            <li><code>@close</code> - Emitted when modal is closed</li>
          </ul>
        </div>
        <div class="gps-specimen__guidelines">
          <h4>📱 Responsive</h4>
          <ul>
            <li>Mobile-first design</li>
            <li>Adaptive padding and sizing</li>
            <li>Stacked action buttons on mobile</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Usage Examples</h3>
      <p class="gps-specimen__section-desc">
        Code examples showing how to implement different types of modals.
      </p>
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <h4>Basic Usage</h4>
          <pre class="gps-modal-specimen__code"><code>&lt;Modal 
  :isVisible="showModal"
  title="My Modal"
  @close="showModal = false"
&gt;
  &lt;p&gt;Modal content goes here&lt;/p&gt;
  
  &lt;template #actions&gt;
    &lt;Button @click="showModal = false"&gt;Close&lt;/Button&gt;
  &lt;/template&gt;
&lt;/Modal&gt;</code></pre>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>With Form Content</h4>
          <pre class="gps-modal-specimen__code"><code>&lt;Modal 
  :isVisible="showFormModal"
  title="Edit Settings"
  @close="showFormModal = false"
&gt;
  &lt;div class="form-group"&gt;
    &lt;label&gt;Name:&lt;/label&gt;
    &lt;input v-model="name" /&gt;
  &lt;/div&gt;

  &lt;template #actions&gt;
    &lt;Button type="secondary" @click="showFormModal = false"&gt;Cancel&lt;/Button&gt;
    &lt;Button type="primary" @click="saveSettings"&gt;Save&lt;/Button&gt;
  &lt;/template&gt;
&lt;/Modal&gt;</code></pre>
        </div>
      </div>
    </div>

    <!-- Basic Modal -->
    <Modal 
      :isVisible="showBasicModal"
      title="Basic Modal Example"
      @close="showBasicModal = false"
    >
      <p>This is a basic modal with simple content. You can put any content here including:</p>
      <ul>
        <li>Text content</li>
        <li>Lists and paragraphs</li>
        <li>Images and media</li>
        <li>Forms and inputs</li>
      </ul>
      <p>The modal will automatically handle scrolling if the content is too long.</p>
      
      <template #actions>
        <Button type="primary" @click="showBasicModal = false">
          Got it!
        </Button>
      </template>
    </Modal>

    <!-- Large Content Modal -->
    <Modal 
      :isVisible="showLargeModal"
      title="Large Content Modal"
      @close="showLargeModal = false"
    >
      <div class="gps-modal-specimen__large-content">
        <h4>This modal demonstrates handling of large content</h4>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        
        <h5>Section 1</h5>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        
        <h5>Section 2</h5>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        
        <h5>Section 3</h5>
        <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
        
        <h5>Section 4</h5>
        <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
        
        <h5>Section 5</h5>
        <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.</p>
      </div>
      
      <template #actions>
        <Button type="secondary" @click="showLargeModal = false">
          Cancel
        </Button>
        <Button type="primary" @click="showLargeModal = false">
          Accept
        </Button>
      </template>
    </Modal>

    <!-- Form Modal -->
    <Modal 
      :isVisible="showFormModal"
      title="User Settings"
      @close="showFormModal = false"
    >
      <div class="gps-modal-specimen__form">
        <FormGroup label="Display Name">
          <Input 
            v-model="formData.displayName" 
            placeholder="Enter your display name"
            icon="👤"
          />
        </FormGroup>
        
        <FormGroup label="Email">
          <Input 
            v-model="formData.email" 
            type="email" 
            placeholder="Enter your email"
            icon="📧"
          />
        </FormGroup>
        
        <FormGroup label="Theme">
          <Dropdown
            v-model="formData.theme"
            :options="[
              { value: 'light', label: 'Light Theme' },
              { value: 'dark', label: 'Dark Theme' },
              { value: 'auto', label: 'Auto (System)' }
            ]"
            placeholder="Select a theme"
          />
        </FormGroup>
        
        <FormGroup label="Notifications">
          <label class="gps-modal-specimen__checkbox-label">
            <input 
              v-model="formData.notifications" 
              type="checkbox"
              class="gps-modal-specimen__checkbox"
            />
            Enable notifications
          </label>
        </FormGroup>
      </div>
      
      <template #actions>
        <Button type="secondary" @click="showFormModal = false">
          Cancel
        </Button>
        <Button type="primary" @click="saveFormData">
          Save Settings
        </Button>
      </template>
    </Modal>

    <!-- Confirmation Modal -->
    <Modal 
      :isVisible="showConfirmationModal"
      title="Confirm Action"
      @close="showConfirmationModal = false"
    >
      <div class="gps-modal-specimen__confirmation">
        <div class="gps-modal-specimen__confirmation-icon">⚠️</div>
        <h4>Are you sure?</h4>
        <p>This action cannot be undone. Please confirm that you want to proceed with this operation.</p>
      </div>
      
      <template #actions>
        <Button type="secondary" @click="showConfirmationModal = false">
          Cancel
        </Button>
        <Button type="danger" @click="confirmAction">
          Yes, Proceed
        </Button>
      </template>
    </Modal>
  </SpecimenPage>
</template>

<script setup>
import { ref } from 'vue'
import Button from '../shared/Button.vue'
import Modal from '../shared/Modal.vue'
import Dropdown from '../shared/Dropdown.vue'
import Input from '../shared/Input.vue'
import FormGroup from '../shared/FormGroup.vue'
import SpecimenPage from './SpecimenPage.vue'

const emit = defineEmits(['backToLanding'])

// Modal visibility states
const showBasicModal = ref(false)
const showLargeModal = ref(false)
const showFormModal = ref(false)
const showConfirmationModal = ref(false)

// Form data
const formData = ref({
  displayName: '',
  email: '',
  theme: '',
  notifications: false
})

function saveFormData() {
  showFormModal.value = false
  // Reset form
  formData.value = {
    displayName: '',
    email: '',
    theme: '',
    notifications: false
  }
}

function confirmAction() {
  showConfirmationModal.value = false
}
</script>

<style>
/* Code block styling */
.gps-modal-specimen__code {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 1rem;
  overflow-x: auto;
  margin: 0;
}

.gps-modal-specimen__code code {
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
  color: var(--color-text);
  font-size: var(--font-size-sm);
}

.gps-specimen__guidelines li {
  margin-block-end: 0.25rem;
}

.gps-specimen__guidelines code {
  background: var(--color-bg);
  padding: 0.125rem 0.25rem;
  border-radius: var(--border-radius);
  font-family: monospace;
  font-size: 0.875em;
  color: var(--color-accent);
}

.gps-modal-specimen__large-content h4 {
  color: var(--color-accent);
  margin: 0 0 1rem 0;
  font-size: var(--font-size-lg);
}

.gps-modal-specimen__large-content h5 {
  color: var(--color-text);
  margin: 1.5rem 0 0.75rem 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.gps-modal-specimen__large-content p {
  margin: 0 0 1rem 0;
  line-height: 1.6;
  color: var(--color-text);
}

.gps-modal-specimen__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.gps-modal-specimen__checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--font-size-sm);
  color: var(--color-text);
  cursor: pointer;
}

.gps-modal-specimen__dropdown {
  width: 100%;
}

.gps-modal-specimen__checkbox {
  margin-inline-end: 0.5rem;
}

.gps-modal-specimen__confirmation {
  text-align: center;
  padding: 1rem 0;
}

.gps-modal-specimen__confirmation-icon {
  font-size: 3rem;
  margin-block-end: 1rem;
}

.gps-modal-specimen__confirmation h4 {
  color: var(--color-warning);
  margin: 0 0 1rem 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.gps-modal-specimen__confirmation p {
  color: var(--color-text);
  margin: 0;
  line-height: 1.5;
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