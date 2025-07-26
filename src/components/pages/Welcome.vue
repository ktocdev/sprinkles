<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import Button from '../shared/Button.vue'
import Input from '../shared/Input.vue'
import FormGroup from '../shared/FormGroup.vue'

const props = defineProps({
  nameInput: String
})
const emits = defineEmits(['update:nameInput', 'submit'])

function handleSubmit() {
  emits('submit')
}
</script>

<template>
  <div class="gps-welcome">
    <p class="gps-welcome__desc">Please enter your name to begin:</p>
    <FormGroup label="Your Name" required>
      <Input 
        :modelValue="nameInput"
        @update:modelValue="(value) => emits('update:nameInput', value)"
        placeholder="Enter your name"
        icon="👤"
        @keydown.enter="handleSubmit"
      />
    </FormGroup>
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


</style> 