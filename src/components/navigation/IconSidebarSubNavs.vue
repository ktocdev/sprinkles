<template>
  <div class="gps-icon-sidebar-subnavs">
    <CageStatusSubNav 
      :isOpen="showCageStatus"
      @close="$emit('closeCageStatus')"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import CageStatusSubNav from '../subnavs/CageStatusSubNav.vue'

const props = defineProps({
  showCageStatus: Boolean
})

const emit = defineEmits(['closeCageStatus'])
</script>

<style>
.gps-icon-sidebar-subnavs {
  position: absolute;
  z-index: 200;
}
</style> 