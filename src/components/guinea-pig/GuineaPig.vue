<script setup>
import { ref } from 'vue'
import { useGuineaPigStore } from '../../stores/guineaPig'
import Input from '../shared/Input.vue'
import FormGroup from '../shared/FormGroup.vue'
import Button from '../shared/Button.vue'

const guineaPigStore = useGuineaPigStore()
const editingInfo = ref(false)
const tempInfo = ref({ ...guineaPigStore.info })

// Predefined data sets for random generation
const guineaPigNames = [
  'Pepper', 'Cinnamon', 'Nugget', 'Pumpkin', 'Marshmallow', 'Oreo', 'Buttercup', 
  'Caramel', 'Honey', 'Cocoa', 'Ginger', 'Maple', 'Biscuit', 'Popcorn', 'Waffles',
  'Muffin', 'Pancake', 'Toast', 'Bagel', 'Donut', 'Cupcake', 'Brownie', 'Cookie',
  'Sprinkles', 'Fudge', 'Truffle', 'Latte', 'Mocha', 'Espresso', 'Cappuccino'
]

const guineaPigCoats = [
  'Abyssinian', 'American', 'Peruvian', 'Silkie', 'Teddy', 'Texel', 'Coronet',
  'Lunkarya', 'Merino', 'Alpaca', 'Rex', 'Ridgeback', 'Baldwin', 'Skinny',
  'Tricolor', 'Solid Black', 'Solid White', 'Solid Brown', 'Solid Cream',
  'Agouti', 'Brindle', 'Dalmatian', 'Himalayan', 'Dutch', 'English Crested'
]

const guineaPigGenders = ['Neutered Boar', 'Sow']

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function generateRandomDate() {
  // Generate a random date within the last 2 years
  const now = new Date()
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate())
  const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime())
  const randomDate = new Date(randomTime)
  return randomDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
}

function generateRandomData() {
  const randomInfo = {
    name: getRandomElement(guineaPigNames),
    birthday: generateRandomDate(),
    coat: getRandomElement(guineaPigCoats),
    gender: getRandomElement(guineaPigGenders)
  }
  
  // Update the store directly
  for (const key in randomInfo) {
    guineaPigStore.setInfoField(key, randomInfo[key])
  }
}

function startEditInfo() {
  tempInfo.value = { ...guineaPigStore.info }
  editingInfo.value = true
}
function saveInfo() {
  for (const key in tempInfo.value) {
    guineaPigStore.setInfoField(key, tempInfo.value[key])
  }
  editingInfo.value = false
}
function cancelEditInfo() {
  editingInfo.value = false
}
</script>

<template>
  <div class="gps-guinea-pig gps-panel-content">
    <h3 class="gps-guinea-pig__title">Your Guinea Pig</h3>
    <template v-if="editingInfo">
      <div class="gps-guinea-pig__edit-form">
        <FormGroup label="Name" required>
          <Input 
            v-model="tempInfo.name"
            placeholder="Enter guinea pig name"
            icon="🐹"
          />
        </FormGroup>
        
        <FormGroup label="Birthday">
          <Input 
            v-model="tempInfo.birthday"
            type="date"
            icon="📅"
          />
        </FormGroup>
        
        <FormGroup label="Coat">
          <Input 
            v-model="tempInfo.coat"
            placeholder="Enter coat type"
            icon="🎨"
          />
        </FormGroup>
        
        <FormGroup label="Gender">
          <select 
            v-model="tempInfo.gender"
            class="gps-guinea-pig__select"
          >
            <option value="">Select gender</option>
            <option value="Neutered Boar">Neutered Boar</option>
            <option value="Sow">Sow</option>
          </select>
        </FormGroup>
        
        <div class="gps-guinea-pig__edit-actions gps-panel-controls">
          <Button type="primary" @click="saveInfo">Save</Button>
          <Button type="secondary" @click="generateRandomData">🎲 Random</Button>
          <Button type="danger" @click="cancelEditInfo">Cancel</Button>
        </div>
      </div>
    </template>
    <template v-else>
      <p class="gps-guinea-pig__info"><strong>Name:</strong> {{ guineaPigStore.info.name || '—' }}</p>
      <p class="gps-guinea-pig__info"><strong>Birthday:</strong> {{ guineaPigStore.info.birthday || '—' }}</p>
      <p class="gps-guinea-pig__info"><strong>Coat:</strong> {{ guineaPigStore.info.coat || '—' }}</p>
      <p class="gps-guinea-pig__info"><strong>Gender:</strong> {{ guineaPigStore.info.gender || '—' }}</p>
      <div class="gps-guinea-pig__actions gps-panel-controls">
        <Button type="primary" @click="startEditInfo">Edit Info</Button>
        <Button type="secondary" @click="generateRandomData">🎲 Generate Random Data</Button>
      </div>
    </template>
  </div>
</template>

<style>
.gps-guinea-pig__select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: var(--font-size-base);
  font-family: inherit;
  transition: var(--transition);
}

.gps-guinea-pig__select:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(var(--color-accent-rgb), 0.1);
}
.gps-guinea-pig__actions {
  display: flex;
  gap: 0.5rem;
  margin-block-start: 1rem;
}
.gps-guinea-pig__edit-actions {
  display: flex;
  gap: 0.5rem;
  margin-block-start: 1rem;
}
.gps-guinea-pig__title {
  margin-block-end: 0.5em;
}
</style> 