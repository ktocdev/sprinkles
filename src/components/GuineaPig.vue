<script setup>
import { ref } from 'vue'
import { useGuineaPigStore } from '../stores/guineaPig'

const guineaPigStore = useGuineaPigStore()
const editingInfo = ref(false)
const tempInfo = ref({ ...guineaPigStore.info })

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

const showNeeds = ref(false)
function toggleNeeds() {
  showNeeds.value = !showNeeds.value
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
        <button class="gps-guinea-pig__button" @click="saveInfo">Save</button>
        <button class="gps-guinea-pig__button gps-guinea-pig__button--cancel" @click="cancelEditInfo" style="margin-left: 0.5em;">Cancel</button>
      </div>
    </template>
    <template v-else>
      <p class="gps-guinea-pig__info"><strong>Name:</strong> {{ guineaPigStore.info.name || '—' }}</p>
      <p class="gps-guinea-pig__info"><strong>Birthday:</strong> {{ guineaPigStore.info.birthday || '—' }}</p>
      <p class="gps-guinea-pig__info"><strong>Coat:</strong> {{ guineaPigStore.info.coat || '—' }}</p>
      <p class="gps-guinea-pig__info"><strong>Gender:</strong> {{ guineaPigStore.info.gender || '—' }}</p>
      <button class="gps-guinea-pig__button" @click="startEditInfo">Edit Info</button>
    </template>
    <!-- Needs toggle button removed -->
    <div v-if="showNeeds" class="gps-guinea-pig__needs-panel">
      <h4 class="gps-guinea-pig__needs-title">Needs</h4>
      <ul class="gps-guinea-pig__needs-list">
        <li class="gps-guinea-pig__needs-item" v-for="(value, need) in guineaPigStore.needs" :key="need">
          <span class="gps-guinea-pig__needs-label">{{ need.charAt(0).toUpperCase() + need.slice(1) }}:</span>
          <progress class="gps-guinea-pig__needs-bar" :value="value" max="100"></progress>
          <span class="gps-guinea-pig__needs-value">{{ value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.gps-guinea-pig__label {
  display: block;
  margin-bottom: 0.5em;
}
.gps-guinea-pig__input {
  margin-left: 0.5em;
  margin-bottom: 0.5em;
}
.gps-guinea-pig__button {
  padding: 0.3em 0.8em;
  border: none;
  background: #42b883;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
.gps-guinea-pig__button--cancel {
  background: #e74c3c;
}
.gps-guinea-pig__button:hover {
  background: #369870;
}
.gps-guinea-pig__title {
  margin-bottom: 0.5em;
}
.gps-guinea-pig__info-panel {
  background: #f8f8f8;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 1em;
  margin-bottom: 1em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.gps-guinea-pig__needs-panel {
  background: #f8f8f8;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 1em;
  margin-bottom: 1em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.gps-guinea-pig__needs-list {
  list-style: none;
  padding: 0;
}
.gps-guinea-pig__needs-item {
  margin-bottom: 0.5em;
}
.gps-guinea-pig__needs-label {
  display: inline-block;
  width: 100px;
}
.gps-guinea-pig__needs-bar {
  vertical-align: middle;
  width: 120px;
}
.gps-guinea-pig__needs-value {
  margin-left: 8px;
}
.gps-guinea-pig__needs-toggle {
  margin-bottom: 0.5em;
  padding: 0.5em 1em;
  border: none;
  background: #42b883;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  font-size: 1em;
  transition: background 0.2s;
}
.gps-guinea-pig__needs-toggle:hover {
  background: #369870;
}
</style> 