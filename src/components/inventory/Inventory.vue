<template>
  <div class="gps-inventory">
    <div class="gps-inventory__container gps-panel-content">
      <div v-if="Object.keys(inventoryStore.items).length === 0">
        <p class="gps-inventory__empty">Your inventory is empty.</p>
      </div>
      <div v-else>
        <ul class="gps-inventory__list">
          <li 
            v-for="(qty, item) in inventoryStore.items" 
            :key="item"
            class="gps-inventory__item"
          >
            <span class="gps-inventory__item-name">{{ formatItemName(item) }}</span>
            <span class="gps-inventory__item-quantity">{{ qty }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useInventoryStore } from '../../stores/inventory'

const inventoryStore = useInventoryStore()

// Format item names for display
const formatItemName = (itemName) => {
  return itemName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<style>
.gps-inventory {
  width: 100%;
}

/* Container styles now handled by shared .gps-panel-content */

.gps-inventory__empty {
  text-align: center;
  color: var(--color-text);
  opacity: 0.7;
  font-style: italic;
  margin: 2rem 0;
}

.gps-inventory__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.gps-inventory__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-block-end: 1px solid var(--color-border);
  transition: var(--transition);
}

.gps-inventory__item:hover {
  background: var(--color-panel);
  padding-inline: 0.5rem;
  margin-inline: -0.5rem;
  border-radius: var(--border-radius);
}

.gps-inventory__item:last-child {
  border-block-end: none;
}

.gps-inventory__item-name {
  font-weight: 500;
  color: var(--color-text);
}

.gps-inventory__item-quantity {
  font-weight: 600;
  color: var(--color-accent);
  background: var(--color-panel);
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius);
  min-width: 2rem;
  text-align: center;
}
</style> 