<script setup>
import { ref, computed } from 'vue'
import Panel from '../shared/Panel.vue'
import { useUserStore } from '../../stores/user'
import { useGuineaPigStore } from '../../stores/guineaPig'
import Button from '../shared/Button.vue'
import Input from '../shared/Input.vue'
import FormGroup from '../shared/FormGroup.vue'
import Dropdown from '../shared/Dropdown.vue'

const userStore = useUserStore()
const guineaPigStore = useGuineaPigStore()
const nameInput = ref('')
const guineaPigInfo = ref({ ...guineaPigStore.info })

// Validation computed property
const isFormValid = computed(() => {
  const userNameValid = nameInput.value && nameInput.value.trim().length > 0
  const guineaPigNameValid = guineaPigInfo.value.name && guineaPigInfo.value.name.trim().length > 0
  const birthdayValid = guineaPigInfo.value.birthday && guineaPigInfo.value.birthday.trim().length > 0
  const coatValid = guineaPigInfo.value.coat && guineaPigInfo.value.coat.trim().length > 0
  const genderValid = guineaPigInfo.value.gender && guineaPigInfo.value.gender.trim().length > 0
  
  return userNameValid && guineaPigNameValid && birthdayValid && coatValid && genderValid
})

// Validation messages
const validationMessages = computed(() => {
  const messages = []
  
  if (!nameInput.value || nameInput.value.trim().length === 0) {
    messages.push('Please enter your name')
  }
  if (!guineaPigInfo.value.name || guineaPigInfo.value.name.trim().length === 0) {
    messages.push('Please enter your guinea pig\'s name')
  }
  if (!guineaPigInfo.value.birthday || guineaPigInfo.value.birthday.trim().length === 0) {
    messages.push('Please enter your guinea pig\'s birthday')
  }
  if (!guineaPigInfo.value.coat || guineaPigInfo.value.coat.trim().length === 0) {
    messages.push('Please enter your guinea pig\'s coat type')
  }
  if (!guineaPigInfo.value.gender || guineaPigInfo.value.gender.trim().length === 0) {
    messages.push('Please select your guinea pig\'s gender')
  }
  
  return messages
})

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

const guineaPigCoatOptions = guineaPigCoats.map(coat => ({
  value: coat,
  label: coat
}))

const guineaPigGenders = [
  { value: 'Neutered Boar', label: 'Neutered Boar' },
  { value: 'Sow', label: 'Sow' }
]

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
    gender: getRandomElement(guineaPigGenders).value
  }
  
  // Update the local form data
  guineaPigInfo.value = { ...randomInfo }
}

function handleSubmit() {
  if (!isFormValid.value) {
    return // Don't proceed if form is not valid
  }
  
  // Save user name
  if (nameInput.value.trim()) {
    userStore.name = nameInput.value.trim()
  }
  
  // Save guinea pig info to store
  for (const key in guineaPigInfo.value) {
    guineaPigStore.setInfoField(key, guineaPigInfo.value[key])
  }
}
</script>

<style>
.gps-welcome {
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
}

.gps-welcome__section {
  margin-block-end: 3rem;
  text-align: start;
}

.gps-welcome__section-title {
  margin-block-end: 1rem;
  font-size: 1.5rem;
  color: var(--color-text);
  text-align: center;
}

.gps-welcome__desc {
  margin-block-end: 1.5rem;
  font-size: 1.1rem;
  color: var(--color-text);
  text-align: center;
}

.gps-welcome__dropdown {
  width: 100%;
}

.gps-welcome__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-block-start: 2rem;
}
</style>

<template>
  <Panel 
    :isOpen="!userStore.name" 
    title="Welcome to Guinea Pig Simulator!" 
    :showClose="false"
  >
    <div class="gps-welcome">
      <div class="gps-welcome__section">
        <h2 class="gps-welcome__section-title">Welcome to Guinea Pig Simulator!</h2>
        <p class="gps-welcome__desc">Please enter your name to begin:</p>
        <FormGroup label="Your Name" required>
          <Input 
            v-model="nameInput"
            placeholder="Enter your name"
            icon="👤"
            @keydown.enter="handleSubmit"
          />
        </FormGroup>
      </div>

      <div class="gps-welcome__section">
        <h3 class="gps-welcome__section-title">Your Guinea Pig</h3>
        <p class="gps-welcome__desc">Tell us about your guinea pig:</p>
        
        <FormGroup label="Name" required>
          <Input 
            v-model="guineaPigInfo.name"
            placeholder="Enter guinea pig name"
            icon="🐹"
          />
        </FormGroup>
        
        <FormGroup label="Birthday" required>
          <Input 
            v-model="guineaPigInfo.birthday"
            type="date"
            icon="📅"
          />
        </FormGroup>
        
        <FormGroup label="Coat" required>
          <Dropdown 
            v-model="guineaPigInfo.coat"
            :options="guineaPigCoatOptions"
            placeholder="Select coat type"
            trigger-class="gps-welcome__dropdown"
          />
        </FormGroup>
        
        <FormGroup label="Gender" required>
          <Dropdown 
            v-model="guineaPigInfo.gender"
            :options="guineaPigGenders"
            placeholder="Select gender"
            trigger-class="gps-welcome__dropdown"
          />
        </FormGroup>
        
        <div class="gps-welcome__actions">
          <Button type="secondary" @click="generateRandomData">🎲 Generate Random Guinea Pig</Button>
        </div>
      </div>

      <div class="gps-welcome__actions">
        <Button 
          :type="isFormValid ? 'primary' : 'disabled'"
          @click="handleSubmit"
          :title="!isFormValid ? 'Please fill in all required fields' : 'Start playing'"
        >
          Play
        </Button>
      </div>
    </div>
  </Panel>
</template> 