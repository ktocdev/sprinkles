<script setup>
import { ref } from 'vue'
import { useGuineaPigStore } from '../../stores/guineaPig'
import Input from '../shared/Input.vue'
import FormGroup from '../shared/FormGroup.vue'
import Button from '../shared/Button.vue'

const guineaPigStore = useGuineaPigStore()
const editingName = ref(false)
const tempName = ref(guineaPigStore.info.name || '')

function startEditName() {
  tempName.value = guineaPigStore.info.name || ''
  editingName.value = true
}

function saveName() {
  guineaPigStore.setInfoField('name', tempName.value)
  editingName.value = false
}

function cancelEditName() {
  editingName.value = false
}
</script>

<template>
  <div class="gps-guinea-pig gps-panel-content">
    <div class="gps-guinea-pig__container gps-panel-section">
      <div class="gps-guinea-pig__info-display">
      <template v-if="editingName">
        <FormGroup label="Name" required>
          <Input 
            v-model="tempName"
            placeholder="Enter guinea pig name"
            icon="🐹"
            @keydown.enter="saveName"
            @keydown.escape="cancelEditName"
          />
        </FormGroup>
        <div class="gps-guinea-pig__edit-actions gps-panel-controls">
          <Button type="primary" @click="saveName">Save</Button>
          <Button type="secondary" @click="cancelEditName">Cancel</Button>
        </div>
      </template>
             <template v-else>
         <div class="gps-guinea-pig__info-row">
           <span class="gps-guinea-pig__info-label">Name:</span>
           <div class="gps-guinea-pig__name-group">
             <span class="gps-guinea-pig__info-value">{{ guineaPigStore.info.name || '—' }}</span>
             <button 
               class="gps-guinea-pig__edit-button"
               @click="startEditName"
               aria-label="Edit guinea pig name"
             >
               ✏️
             </button>
           </div>
         </div>
       </template>
      
      <div class="gps-guinea-pig__info-row">
        <span class="gps-guinea-pig__info-label">Birthday:</span>
        <span class="gps-guinea-pig__info-value">{{ guineaPigStore.info.birthday || '—' }}</span>
      </div>
      
      <div class="gps-guinea-pig__info-row">
        <span class="gps-guinea-pig__info-label">Coat:</span>
        <span class="gps-guinea-pig__info-value">{{ guineaPigStore.info.coat || '—' }}</span>
      </div>
      
      <div class="gps-guinea-pig__info-row">
        <span class="gps-guinea-pig__info-label">Gender:</span>
        <span class="gps-guinea-pig__info-value">{{ guineaPigStore.info.gender || '—' }}</span>
      </div>
          </div>
    </div>
  </div>
</template>

<style>


.gps-guinea-pig__info-display {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gps-guinea-pig__info-row {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  background: var(--color-panel);
}

.gps-guinea-pig__info-label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  min-width: 80px;
  flex-shrink: 0;
}

.gps-guinea-pig__name-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.gps-guinea-pig__info-value {
  color: var(--color-text);
}

.gps-guinea-pig__edit-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  font-size: 0.9em;
}

.gps-guinea-pig__edit-button:hover {
  background: var(--color-accent);
  opacity: 0.8;
}

.gps-guinea-pig__edit-actions {
  display: flex;
  gap: 0.5rem;
  margin-block-start: 1rem;
}
</style> 