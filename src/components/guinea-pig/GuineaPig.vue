<script setup>
import { ref } from 'vue'
import { useGuineaPigStore } from '../../stores/guineaPig'

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
  <div class="gps-guinea-pig">
    <h3 class="gps-guinea-pig__title">Your Guinea Pig</h3>
    <template v-if="editingInfo">
      <div class="gps-guinea-pig__edit-form">
        <label class="gps-guinea-pig__label">Name: <input class="gps-guinea-pig__input" v-model="tempInfo.name" /></label><br />
        <label class="gps-guinea-pig__label">Birthday: <input class="gps-guinea-pig__input" v-model="tempInfo.birthday" type="date" /></label><br />
        <label class="gps-guinea-pig__label">Coat: <input class="gps-guinea-pig__input" v-model="tempInfo.coat" /></label><br />
        <label class="gps-guinea-pig__label">Gender:
          <select class="gps-guinea-pig__input" v-model="tempInfo.gender">
            <option value="">Select</option>
            <option value="neutered boar">Neutered Boar</option>
            <option value="sow">Sow</option>
          </select>
        </label><br />
        <div class="gps-guinea-pig__edit-actions">
          <button class="gps-guinea-pig__button" @click="saveInfo">Save</button>
          <button class="gps-guinea-pig__button gps-guinea-pig__button--secondary" @click="generateRandomData">🎲 Random</button>
          <button class="gps-guinea-pig__button gps-guinea-pig__button--cancel" @click="cancelEditInfo">Cancel</button>
        </div>
      </div>
    </template>
    <template v-else>
      <p class="gps-guinea-pig__info"><strong>Name:</strong> {{ guineaPigStore.info.name || '—' }}</p>
      <p class="gps-guinea-pig__info"><strong>Birthday:</strong> {{ guineaPigStore.info.birthday || '—' }}</p>
      <p class="gps-guinea-pig__info"><strong>Coat:</strong> {{ guineaPigStore.info.coat || '—' }}</p>
      <p class="gps-guinea-pig__info"><strong>Gender:</strong> {{ guineaPigStore.info.gender || '—' }}</p>
      <div class="gps-guinea-pig__actions">
        <button class="gps-guinea-pig__button" @click="startEditInfo">Edit Info</button>
        <button class="gps-guinea-pig__button gps-guinea-pig__button--secondary" @click="generateRandomData">🎲 Generate Random Data</button>
      </div>
    </template>
  </div>
</template>

<style>
.gps-guinea-pig__label {
  display: block;
  margin-block-end: 0.5em;
}
.gps-guinea-pig__input {
  margin-inline-start: 0.5em;
  margin-block-end: 0.5em;
}
.gps-guinea-pig__button {
  padding: 0.3em 0.8em;
  border: none;
  background: var(--color-accent);
  color: var(--color-text);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}
.gps-guinea-pig__button--cancel {
  background: var(--color-danger);
}
.gps-guinea-pig__button--secondary {
  background: var(--color-secondary);
  color: var(--color-text);
}
.gps-guinea-pig__button:hover {
  background: var(--color-accent-hover);
}
.gps-guinea-pig__button--secondary:hover {
  background: var(--color-secondary-hover);
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