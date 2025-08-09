<template>
  <nav class="gps-icon-sidebar">
    <div class="gps-icon-sidebar__container">
      <template v-if="userStore.name">
        <IconSidebarButton 
          :active="showStatistics"
          @click="$emit('toggleStatistics')"
          title="Show Statistics"
        >
          📈
        </IconSidebarButton>

        <IconSidebarButton 
          :active="showCageStatus"
          @click="$emit('toggleCageStatus')"
          title="Show Cage Status"
        >
          🏠
        </IconSidebarButton>

        <IconSidebarButton 
          :active="showCageInteractions"
          @click="$emit('toggleCageInteractions')"
          title="Cage Interactions"
        >
          🛠️
        </IconSidebarButton>
        
        <IconSidebarButton 
          :active="showMarket"
          @click="$emit('toggleMarket')"
          title="Show Market"
        >
          🛒
        </IconSidebarButton>

        <div class="gps-icon-sidebar__divider"></div>

        <IconSidebarButton 
          @click="$emit('toggleDebug')"
          title="Debug Panel"
        >
          🐛
        </IconSidebarButton>

        <IconSidebarButton 
          @click="$emit('toggleDesign')"
          title="Design Tools"
        >
          🎭
        </IconSidebarButton>
      </template>
    </div>
  </nav>

  <IconSidebarSubNavs 
    :showCageStatus="showCageStatus"
    @closeCageStatus="$emit('closeCageStatus')"
  />
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useUserStore } from '../../stores/user'
import IconSidebarButton from './IconSidebarButton.vue'
import IconSidebarSubNavs from './IconSidebarSubNavs.vue'

const props = defineProps({
  showStatistics: Boolean,
  showCageStatus: Boolean,
  showCageInteractions: Boolean,
  showMarket: Boolean
})

const emit = defineEmits([
  'toggleStatistics',
  'toggleCageStatus',
  'toggleCageInteractions',
  'toggleMarket',
  'toggleDebug',
  'toggleDesign',
  'closeCageStatus'
])

const userStore = useUserStore()
</script>

<style>
.gps-icon-sidebar {
  width: 40px;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: 0;
  border-inline-end: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4em 0 1rem 0;
  flex-shrink: 0;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
  box-shadow: var(--box-shadow);
}

.gps-icon-sidebar__container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  align-items: center;
  position: relative;
}

.gps-icon-sidebar__divider {
  width: 25px;
  height: 1px;
  background: var(--color-border);
  margin: 0.5rem 0;
}

@media (min-width: 768px) {
  .gps-icon-sidebar {
    width: 70px;
    padding: 5rem 0 1rem 0;
  }
  
  .gps-icon-sidebar__container {
    gap: 0.75rem;
  }
  
  .gps-icon-sidebar__divider {
    width: 40px;
  }
}
</style> 