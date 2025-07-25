<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import Button from './Button.vue'

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
    <Button type="primary" @click="handleSubmit">Start</Button>
  </div>
</template>

<style>
.gps-welcome__input {
  padding: 0.5em;
  margin-right: 0.5em;
  border: 1px solid var(--color-border, #aaa);
  border-radius: 4px;
}

</style> 