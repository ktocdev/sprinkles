<script setup>
import { ref, defineEmits, defineProps } from 'vue'

const props = defineProps({
  nameInput: String
})
const emits = defineEmits(['update:nameInput', 'submit'])

function handleInput(e) {
  emits('update:nameInput', e.target.value)
}
function handleSubmit() {
  emits('submit')
}
</script>

<template>
  <div class="gps-welcome">
    <h2 class="gps-welcome__title">Welcome to Guinea Pig Simulator!</h2>
    <p class="gps-welcome__desc">Please enter your name to begin:</p>
    <input class="gps-welcome__input" :value="nameInput" @input="handleInput" @keyup.enter="handleSubmit" placeholder="Your name" />
    <button class="gps-welcome__button" @click="handleSubmit">Start</button>
  </div>
</template>

<style>
.gps-welcome__input {
  padding: 0.5em;
  margin-right: 0.5em;
  border: 1px solid #aaa;
  border-radius: 4px;
}
.gps-welcome__button {
  padding: 0.5em 1em;
  border: none;
  background: #42b883;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
.gps-welcome__button:hover {
  background: #369870;
}
</style> 