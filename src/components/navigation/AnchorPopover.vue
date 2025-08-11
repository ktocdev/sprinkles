<template>
  <div class="gps-anchor-popover" ref="AnchorPopoverRef">
    <div class="gps-anchor-popover__container">
      <Button 
        type="secondary"
        @click="toggleExpanded"
        :class="{ 'gps-anchor-popover__toggle--expanded': isExpanded }"
        class="gps-anchor-popover__toggle"
        :aria-label="toggleAriaLabel"
      >
        {{ icon }}
      </Button>
      
      <SubNav
        v-if="isExpanded"
        :isOpen="isExpanded"
        :title="title"
        @close="toggleExpanded"
      >
        <slot />
      </SubNav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Button from '../shared/Button.vue'
import SubNav from './SubNav.vue'

const props = defineProps({
  icon: {
    type: String,
    default: '⚓'
  },
  title: {
    type: String,
    default: 'Navigation'
  },
  toggleAriaLabel: {
    type: String,
    default: 'Toggle navigation'
  }
})

const isExpanded = ref(false)
const AnchorPopoverRef = ref(null)

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

function handleClickOutside(event) {
  if (isExpanded.value && AnchorPopoverRef.value && !AnchorPopoverRef.value.contains(event.target)) {
    isExpanded.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style>
.gps-anchor-popover {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 200;
  max-width: 280px;
  width: 90vw;
  user-select: none;
}

.gps-anchor-popover__container {
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-start;
  gap: 8px;
}

.gps-anchor-popover__toggle {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  height: 40px;
  width: 40px;
  padding: .2rem 2rem .2rem .5rem;
  font-size: var(--font-size-2xl);
  box-shadow: var(--box-shadow-medium);
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  transition: var(--transition);
}

.gps-anchor-popover__toggle:hover {
  transform: translateY(-50%) translateX(-2px);
}

.gps-anchor-popover__toggle--expanded {
  background: var(--color-accent);
  color: var(--color-white);
  border-color: var(--color-accent);
}

.gps-anchor-popover__toggle--expanded:hover {
  background: var(--color-accent-hover);
  border-color: var(--color-accent-hover);
}

.gps-anchor-popover__container .gps-subnav {
  position: absolute;
  top: 50%;
  inset-inline-end: 32px;
  inset-inline-start: auto;
  transform: translateY(-50%);
  margin-inline-start: 0;
  width: 100%;
}

@media (min-width: 480px) {
  .gps-anchor-popover {
    max-width: 320px;
  }
}

@media (min-width: 768px) {
  .gps-anchor-popover {
    max-width: 350px;
  }
}
</style>