<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import Button from '../shared/Button.vue'

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
    <p class="gps-welcome__desc">Please enter your name to begin:</p>
    <input class="gps-welcome__input" :value="nameInput" @input="handleInput" @keyup.enter="handleSubmit" placeholder="Your name" />
    <Button type="primary" @click="handleSubmit">Start</Button>
  </div>
</template>

<style>
.gps-welcome {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.gps-welcome__desc {
  margin-block-end: 1.5rem;
  font-size: 1.1rem;
  color: var(--color-text);
}

.gps-welcome__input {
  display: block;
  width: 100%;
  padding: 0.75em;
  margin-block-end: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  font-size: 1rem;
  background: var(--color-bg);
  color: var(--color-text);
  box-sizing: border-box;
}

.gps-welcome__input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: var(--box-shadow-focus);
}

.gps-welcome__input::placeholder {
  color: var(--color-text);
  opacity: 0.6;
}
</style> 