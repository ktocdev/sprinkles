<script setup>
import ThemeToggle from './ThemeToggle.vue'
import Button from './Button.vue'
import { defineProps } from 'vue'

const props = defineProps({
  onInventory: Function,
  onGuineaPig: Function,
  onNeeds: Function,
  onReset: Function,
  onClearCage: Function,
  showInventory: Boolean,
  showGuineaPig: Boolean,
  showNeeds: Boolean
})
</script>

<template>
  <div class="gps-topbar">
    <div class="gps-topbar__menubar" role="menubar">
      <Button type="secondary" role="menuitem" @click="props.onInventory">
        {{ props.showInventory ? 'Hide Inventory' : 'Show Inventory' }}
      </Button>
      <Button type="secondary" role="menuitem" @click="props.onGuineaPig">
        {{ props.showGuineaPig ? 'Hide Guinea Pig Info' : 'Show Guinea Pig Info' }}
      </Button>
      <Button type="secondary" role="menuitem" @click="props.onNeeds">
        {{ props.showNeeds ? 'Hide Needs' : 'Show Needs' }}
      </Button>
      <Button type="danger" role="menuitem" @click="props.onReset">Reset Game</Button>
      <Button type="warning" role="menuitem" @click="props.onClearCage">Clear Cage</Button>
      <ThemeToggle class="gps-topbar__theme-toggle" />
    </div>
  </div>
</template>

<style>
.gps-topbar {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  margin-bottom: 1.5em;
  background: var(--color-panel);
  border-bottom: 2px solid var(--color-accent);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius) var(--border-radius) 0 0;
}
.gps-topbar__menubar {
  display: flex;
  align-items: center;
  gap: 0.5em;
  flex: 1;
}
.gps-topbar__theme-toggle {
  margin-left: auto;
}
</style> 