<template>
  <div class="gps-market">
    <div class="gps-market__content gps-panel-content">
      <!-- Market Stats -->
      <div class="gps-market__stats gps-panel-section">
        <div class="gps-market__stat">
          <span class="gps-market__stat-label">Your Currency:</span>
          <span class="gps-market__stat-value">💰 {{ userStore.currency }}</span>
        </div>
      </div>



      <!-- Market Items -->
      <div class="gps-market__sections">
        <!-- Food Section -->
        <div class="gps-market__section gps-panel-section">
          <h3 class="gps-market__section-title gps-panel-section-title">🥕 Food & Bedding</h3>
          <div class="gps-market__items">
            <div v-for="item in foodItems" :key="item" class="gps-market__item">
              <div class="gps-market__item-info">
                <span class="gps-market__item-name">{{ formatItemName(item) }}</span>
                <span class="gps-market__item-price">
                  💰 {{ marketStore.getItemPrice(item) }}
                </span>
                <span class="gps-market__item-stock">Stock: {{ inventoryStore.items[item] || 0 }}</span>
              </div>
              <div class="gps-market__item-actions">
                <Button type="primary" @click="buyItem(item)">
                  Buy
                </Button>
                <Button type="secondary" @click="sellItem(item)" :disabled="!inventoryStore.items[item]">
                  Sell
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Toys Section -->
        <div class="gps-market__section gps-panel-section">
          <h3 class="gps-market__section-title gps-panel-section-title">🎾 Toys & Enrichment</h3>
          <div class="gps-market__items">
            <div v-for="item in toyItems" :key="item" class="gps-market__item">
              <div class="gps-market__item-info">
                <span class="gps-market__item-name">{{ formatItemName(item) }}</span>
                <span class="gps-market__item-price">
                  💰 {{ marketStore.getItemPrice(item) }}
                </span>
                <span class="gps-market__item-stock">Stock: {{ inventoryStore.items[item] || 0 }}</span>
              </div>
              <div class="gps-market__item-actions">
                <Button type="primary" @click="buyItem(item)">
                  Buy
                </Button>
                <Button type="secondary" @click="sellItem(item)" :disabled="!inventoryStore.items[item]">
                  Sell
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction History -->
      <div class="gps-market__history gps-panel-section">
        <h3 class="gps-market__section-title gps-panel-section-title">📊 Recent Transactions</h3>
        <div v-if="recentTransactions.length === 0" class="gps-market__no-transactions">
          None yet
        </div>
        <div v-else class="gps-market__history-list">
          <div v-for="(transaction, index) in recentTransactions" :key="index" class="gps-market__transaction">
            <span class="gps-market__transaction-type" :class="transaction.type === 'buy' ? 'gps-market__transaction-type--buy' : 'gps-market__transaction-type--sell'">
              {{ transaction.type === 'buy' ? '🛒' : '💰' }}
            </span>
            <span class="gps-market__transaction-item">{{ formatItemName(transaction.item) }}</span>
            <span class="gps-market__transaction-quantity">x{{ transaction.quantity }}</span>
            <span class="gps-market__transaction-price">{{ transaction.type === 'buy' ? '-' : '+' }}{{ transaction.amount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMarketStore } from '../../stores/market.js'
import { useInventoryStore } from '../../stores/inventory.js'
import { useUserStore } from '../../stores/user.js'
import Button from '../shared/Button.vue'

const marketStore = useMarketStore()
const inventoryStore = useInventoryStore()
const userStore = useUserStore()

// Item categories
const foodItems = ['bedding', 'hay', 'pellets', 'lettuce', 'blueberries', 'carrots', 'cucumbers']
const toyItems = ['small_chew_stick', 'large_chew_stick', 'small_ball', 'large_ball', 'small_tunnel', 'large_tunnel', 'small_hammock', 'large_hammock', 'small_bed', 'large_bed', 'small_house', 'large_house', 'chew_cube']

// Recent transactions
const recentTransactions = ref([])



// Buy item
const buyItem = (itemName) => {
  try {
    const result = marketStore.buyItem(itemName, 1)
    addTransaction('buy', itemName, 1, result.totalCost)
  } catch (error) {
    console.error('Purchase failed:', error.message)
    // You could add a toast notification here
  }
}

// Sell item
const sellItem = (itemName) => {
  try {
    const result = marketStore.sellItem(itemName, 1)
    addTransaction('sell', itemName, 1, result.totalEarnings)
  } catch (error) {
    console.error('Sale failed:', error.message)
    // You could add a toast notification here
  }
}

// Add transaction to history
const addTransaction = (type, item, quantity, amount) => {
  recentTransactions.value.unshift({
    type,
    item,
    quantity,
    amount,
    timestamp: Date.now()
  })
  
  // Keep only last 10 transactions
  if (recentTransactions.value.length > 10) {
    recentTransactions.value = recentTransactions.value.slice(0, 10)
  }
}

// Format item names for display
const formatItemName = (itemName) => {
  return itemName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

</script>

<style>
.gps-market {
  width: 100%;
}

.gps-market__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block-end: 2rem;
  padding-block-end: 1rem;
  border-block-end: 1px solid var(--color-border);
}

.gps-market__title {
  font-size: 2.5em;
  color: var(--color-accent);
  margin: 0;
}

.gps-market__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-block-end: 2rem;
  padding: 1rem;
  background: var(--color-panel);
  border-radius: var(--border-radius);
}

.gps-market__stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gps-market__stat-label {
  color: var(--color-text);
  opacity: 0.8;
}

.gps-market__stat-value {
  font-weight: 600;
  color: var(--color-accent);
}

.gps-market__sections {
  display: grid;
  gap: 2rem;
  margin-block-end: 2rem;
}

/* Section styles now handled by shared .gps-panel-section and .gps-panel-section-title */

.gps-market__items {
  display: grid;
  gap: 1rem;
}

.gps-market__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--color-background);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-market__item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.gps-market__item-name {
  font-weight: 600;
  color: var(--color-text);
}

.gps-market__item-price {
  color: var(--color-accent);
  font-size: 0.9em;
}

.gps-market__item-stock {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.8em;
}

.gps-market__item-actions {
  display: flex;
  gap: 0.5rem;
}

.gps-market__no-transactions {
  text-align: center;
  color: var(--color-text);
  opacity: 0.7;
  font-style: italic;
  padding: 2rem 0;
}

.gps-market__history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-block-start: 1rem;
}

.gps-market__transaction {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  background: var(--color-background);
  border-radius: var(--border-radius);
}

.gps-market__transaction-type {
  font-size: 1.2em;
}

.gps-market__transaction-type--buy {
  color: rgb(239, 68, 68);
}

.gps-market__transaction-type--sell {
  color: rgb(34, 197, 94);
}

.gps-market__transaction-item {
  flex: 1;
  font-weight: 500;
}

.gps-market__transaction-quantity {
  color: var(--color-text);
  opacity: 0.7;
}

.gps-market__transaction-price {
  font-weight: 600;
  color: var(--color-accent);
}

@media (max-width: 768px) {
  .gps-market__header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .gps-market__item {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .gps-market__item-actions {
    width: 100%;
    justify-content: stretch;
  }
}
</style> 