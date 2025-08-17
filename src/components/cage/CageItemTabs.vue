<template>
  <Tabs :tabs="tabs" v-model="activeTab" variant="default">
    <!-- Permanent Items Tab -->
    <template #permanent>
      <div class="gps-cage-item-tabs__section">
        <div v-if="cageStore.permanentItems.length === 0" class="gps-cage-item-tabs__empty">
          No permanent items in cage
        </div>
        <div v-else class="gps-cage-item-tabs__items">
          <div 
            v-for="item in cageStore.permanentItems" 
            :key="item.id"
            class="gps-cage-item-tabs__item"
          >
            <div class="gps-cage-item-tabs__item-info">
              <span class="gps-cage-item-tabs__item-name">{{ formatItemName(item.name) }}</span>
              <span class="gps-cage-item-tabs__item-position">({{ item.x }}, {{ item.y }})</span>
            </div>
            <div class="gps-cage-item-tabs__item-actions">
              <Button 
                type="flat"
                size="compact"
                @click="$emit('moveItem', item)"
                title="Move Item"
              >
                📍
              </Button>
              <Button 
                type="flat"
                size="compact"
                @click="$emit('returnToInventory', item)"
                title="Return to Inventory"
              >
                📦
              </Button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Consumable Items Tab -->
    <template #consumable>
      <div class="gps-cage-item-tabs__section">
        <div v-if="cageStore.consumableItems.length === 0" class="gps-cage-item-tabs__empty">
          No consumable items in cage
        </div>
        <div v-else class="gps-cage-item-tabs__items">
          <div 
            v-for="item in cageStore.consumableItems" 
            :key="item.id"
            class="gps-cage-item-tabs__item"
          >
            <div class="gps-cage-item-tabs__item-info">
              <span class="gps-cage-item-tabs__item-name">{{ formatItemName(item.name) }}</span>
              <span class="gps-cage-item-tabs__item-quantity">({{ item.quantity }})</span>
              <span class="gps-cage-item-tabs__item-position">({{ item.x }}, {{ item.y }})</span>
            </div>
            <div class="gps-cage-item-tabs__item-actions">
              <Button 
                type="flat"
                size="compact"
                @click="$emit('consumeItem', item)"
                :class="{ 'gps-button--disabled': isConsumptionDisabled }"
                :title="getConsumptionDisabledReason"
              >
                🍽️
              </Button>
              <Button 
                type="flat"
                size="compact"
                @click="$emit('moveItem', item)"
                title="Move Item"
              >
                📍
              </Button>
              <Button 
                type="flat"
                size="compact"
                @click="$emit('returnToInventory', item)"
                title="Return to Inventory"
              >
                📦
              </Button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Inventory Tab -->
    <template #inventory>
      <div class="gps-cage-item-tabs__section">
        <div v-if="Object.keys(allInventoryItems).length === 0" class="gps-cage-item-tabs__empty">
          No items in inventory
        </div>
        <div v-else class="gps-cage-item-tabs__items">
          <div 
            v-for="(item, itemName) in allInventoryItems" 
            :key="itemName"
            class="gps-cage-item-tabs__item"
          >
            <div class="gps-cage-item-tabs__item-info">
              <span class="gps-cage-item-tabs__item-name">{{ formatItemName(itemName) }}</span>
              <span class="gps-cage-item-tabs__item-quantity">({{ item.quantity }})</span>
              <span class="gps-cage-item-tabs__item-type">{{ item.isConsumable ? 'Consumable' : 'Permanent' }}</span>
            </div>
            <div class="gps-cage-item-tabs__item-actions">
              <Button 
                type="primary"
                size="compact"
                @click="$emit('addItemToCageFromInventory', itemName)"
                title="Add to Cage"
              >
                ➕ Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Tabs>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCageStore } from '../../stores/cage'
import { useInventoryStore, itemDefinitions } from '../../stores/inventory'
import { useHungerStore } from '../../stores/needs/hunger'
import { useGuineaPigStore } from '../../stores/guineaPig'
import Button from '../shared/Button.vue'
import Tabs from '../shared/Tabs.vue'

const props = defineProps({
  allInventoryItems: {
    type: Object,
    required: true
  },
  isConsumptionDisabled: {
    type: Boolean,
    required: true
  },
  getConsumptionDisabledReason: {
    type: String,
    required: true
  }
})

const emit = defineEmits([
  'moveItem',
  'returnToInventory', 
  'consumeItem',
  'addItemToCageFromInventory'
])

const cageStore = useCageStore()

// Tab state
const activeTab = ref(0)

// Tab configuration
const tabs = computed(() => [
  {
    id: 'permanent',
    label: 'Permanent',
    icon: '🏠',
    badge: cageStore.permanentItems.length || null
  },
  {
    id: 'consumable',
    label: 'Consumable', 
    icon: '🍽️',
    badge: cageStore.consumableItems.length || null
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: '📦',
    badge: Object.keys(props.allInventoryItems).length || null
  }
])

// Methods
function formatItemName(itemName) {
  if (!itemName) return ''
  return itemName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}
</script>

<style>
.gps-cage-item-tabs__section {
  background: var(--color-panel);
  border-radius: var(--border-radius);
  padding: 1rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.gps-cage-item-tabs__empty {
  color: var(--color-text);
  opacity: 0.6;
  font-style: italic;
  text-align: center;
  padding: 0.75rem;
  font-size: var(--font-size-sm);
}

.gps-cage-item-tabs__items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gps-cage-item-tabs__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--color-bg);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.gps-cage-item-tabs__item-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.gps-cage-item-tabs__item-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  font-size: var(--font-size-sm);
}

.gps-cage-item-tabs__item-quantity {
  color: var(--color-accent);
  font-size: var(--font-size-xs);
}

.gps-cage-item-tabs__item-position {
  color: var(--color-text);
  opacity: 0.6;
  font-size: var(--font-size-xs);
}

.gps-cage-item-tabs__item-type {
  color: var(--color-accent);
  opacity: 0.8;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.gps-cage-item-tabs__item-actions {
  display: flex;
  gap: 0.25rem;
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .gps-cage-item-tabs__item {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .gps-cage-item-tabs__item-actions {
    justify-content: center;
  }
}
</style>