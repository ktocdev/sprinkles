<script setup>
import { ref } from 'vue'
import Panel from '../shared/Panel.vue'
import Welcome from '../pages/Welcome.vue'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const nameInput = ref('')

function submitName() {
  if (nameInput.value.trim()) {
    userStore.name = nameInput.value.trim()
  }
}
</script>

<template>
  <Panel 
    :isOpen="!userStore.name" 
    title="Welcome to Guinea Pig Simulator!" 
    :showClose="false"
  >
    <Welcome 
      :nameInput="nameInput" 
      @update:nameInput="val => nameInput = val" 
      @submit="submitName" 
    />
  </Panel>
</template> 