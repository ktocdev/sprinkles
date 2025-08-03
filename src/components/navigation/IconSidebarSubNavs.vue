<template>
  <div class="gps-icon-sidebar-subnavs">
    <NeedsSubNav 
      :isOpen="showNeeds"
      @close="$emit('closeNeeds')"
    />

    <CageStatusSubNav 
      :isOpen="showCageStatus"
      @close="$emit('closeCageStatus')"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import NeedsSubNav from '../subnavs/NeedsSubNav.vue'
import CageStatusSubNav from '../subnavs/CageStatusSubNav.vue'

const props = defineProps({
  showNeeds: Boolean,
  showCageStatus: Boolean
})

const emit = defineEmits(['closeNeeds', 'closeCageStatus'])
</script>

<style>
.gps-icon-sidebar-subnavs {
  position: absolute;
  z-index: 200;
}
</style> 