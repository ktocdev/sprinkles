<template>
  <div class="gps-cage-needs-status">
    <div class="gps-cage-needs-status__content">
      <div class="gps-cage-needs-status__header">
        <h4 class="gps-section-header">Cage Environment</h4>
      </div>
      <StatusList
        :items="formattedItems"
        :showStatusBars="true"
        :showBadges="false"
        itemClass="gps-cage-needs-status__item"
        listClass="gps-cage-needs-status__list"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import StatusList from '../shared/StatusList.vue'
import { useBeddingStore } from '../../stores/needs/cage/bedding'
import { useWaterStore } from '../../stores/needs/cage/water'
import { useHabitatStore } from '../../stores/needs/cage/habitat'
import { useCleanlinessStore } from '../../stores/needs/cage/cleanliness'

const props = defineProps({
  showUrgency: {
    type: Boolean,
    default: false
  },
})

// Get cage need stores
const beddingStore = useBeddingStore()
const waterStore = useWaterStore()
const habitatStore = useHabitatStore()
const cleanlinessStore = useCleanlinessStore()

// Transform cage needs to format expected by StatusList
const formattedItems = computed(() => {
  const stores = [
    { store: beddingStore, name: 'Bedding', emoji: '🛏️' },
    { store: waterStore, name: 'Water', emoji: '💧' },
    { store: habitatStore, name: 'Habitat', emoji: '🏠' },
    { store: cleanlinessStore, name: 'Cleanliness', emoji: '🧹' }
  ]

  return stores.map(({ store, name, emoji }) => {
    if (!store) {
      return {
        text: `${emoji} ${name}: Not available`,
        value: 0,
        status: 'critical',
        needName: name.toLowerCase(),
        colors: { primary: '#999999' }
      }
    }

    const value = Math.round(store.currentValue)
    const status = store.needStatus

    return {
      text: `${emoji} ${name}`,
      value: value,
      status: status,
      needName: name.toLowerCase(),
      colors: store.colors || { primary: '#999999' }
    }
  })
})
</script>

<style>
.gps-cage-needs-status {
  max-width: 640px;
  width: 100%;
}

.gps-cage-needs-status__header {
  padding: 1rem 1rem 0;
}

.gps-cage-needs-status__header .gps-section-header {
  margin-block-end: 0;
}

.gps-cage-needs-status__content {
  background: var(--color-panel);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

</style>