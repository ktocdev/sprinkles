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
  background: var(--color-accent);
  color: var(--color-text);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}
.gps-guinea-pig__button--cancel {
  background: var(--color-danger);
}
.gps-guinea-pig__button:hover {
  background: var(--color-accent-hover);
}
.gps-guinea-pig__title {
  margin-bottom: 0.5em;
}
</style> 