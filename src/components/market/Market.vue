<template>
  <div class="gps-market">
    <div class="gps-market__header">
      <h1 class="gps-market__title">🐹 Guinea Pig Market</h1>
      <div class="gps-market__status">
        <span class="gps-market__status-indicator" :class="{ 'gps-market__status-indicator--open': marketStore.isOpen, 'gps-market__status-indicator--closed': !marketStore.isOpen }">
          {{ marketStore.isOpen ? '🟢 Open' : '🔴 Closed' }}
        </span>
        <Button type="flat" @click="marketStore.toggleMarket()">
          {{ marketStore.isOpen ? 'Close Market' : 'Open Market' }}
        </Button>
      </div>
    </div>

    <div class="gps-market__content gps-panel-content">
      <!-- Market Stats -->
      <div class="gps-market__stats">
        <div class="gps-market__stat">
          <span class="gps-market__stat-label">Your Currency:</span>
          <span class="gps-market__stat-value">💰 {{ userStore.currency }}</span>
        </div>
        <div class="gps-market__stat">
          <span class="gps-market__stat-label">Market Volatility:</span>
          <span class="gps-market__stat-value">{{ Math.round(marketStore.volatility * 100) }}%</span>
        </div>
        <div class="gps-market__stat">
          <span class="gps-market__stat-label">Last Update:</span>
          <span class="gps-market__stat-value">{{ formatTime(marketStore.lastUpdate) }}</span>
        </div>
      </div>

      <!-- Special Offers -->
      <div v-if="marketStore.getSpecialOffers.length > 0" class="gps-market__offers">
        <h3 class="gps-market__section-title">🎉 Special Offers</h3>
        <div class="gps-market__offers-grid">
          <div v-for="item in marketStore.getSpecialOffers" :key="item" class="gps-market__offer">
            <span class="gps-market__offer-item">{{ formatItemName(item) }}</span>
            <span class="gps-market__offer-discount">-{{ marketStore.getDiscount(item) }}%</span>
          </div>
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
                  <span v-if="marketStore.getDiscount(item) > 0" class="gps-market__item-discount">
                    (-{{ marketStore.getDiscount(item) }}%)
                  </span>
                </span>
                <span class="gps-market__item-stock">Stock: {{ inventoryStore.items[item] || 0 }}</span>
              </div>
              <div class="gps-market__item-actions">
                <Button type="primary" @click="buyItem(item)" :disabled="!marketStore.isOpen">
                  Buy
                </Button>
                <Button type="secondary" @click="sellItem(item)" :disabled="!marketStore.isOpen || !inventoryStore.items[item]">
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
                  <span v-if="marketStore.getDiscount(item) > 0" class="gps-market__item-discount">
                    (-{{ marketStore.getDiscount(item) }}%)
                  </span>
                </span>
                <span class="gps-market__item-stock">Stock: {{ inventoryStore.items[item] || 0 }}</span>
              </div>
              <div class="gps-market__item-actions">
                <Button type="primary" @click="buyItem(item)" :disabled="!marketStore.isOpen">
                  Buy
                </Button>
                <Button type="secondary" @click="sellItem(item)" :disabled="!marketStore.isOpen || !inventoryStore.items[item]">
                  Sell
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Market Controls -->
      <div class="gps-market__controls gps-panel-controls">
        <Button type="warning" @click="updatePrices">Update Prices</Button>
        <Button type="secondary" @click="resetPrices">Reset to Base Prices</Button>
        <Button type="flat" @click="createRandomOffer">Create Random Offer</Button>
      </div>

      <!-- Transaction History -->
      <div class="gps-market__history gps-panel-section">
        <h3 class="gps-market__section-title gps-panel-section-title">📊 Recent Transactions</h3>
        <div class="gps-market__history-list">
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

// Auto-update timer
let updateTimer = null

// Initialize market
onMounted(() => {
  marketStore.initializePrices()
  startAutoUpdate()
})

onUnmounted(() => {
  if (updateTimer) {
    clearInterval(updateTimer)
  }
})

// Start automatic price updates
const startAutoUpdate = () => {
  updateTimer = setInterval(() => {
    marketStore.updatePrices()
    marketStore.clearExpiredOffers()
  }, 30000) // Update every 30 seconds
}

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

// Update prices manually
const updatePrices = () => {
  marketStore.updatePrices()
}

// Reset prices to base
const resetPrices = () => {
  marketStore.resetPrices()
}

// Create a random special offer
const createRandomOffer = () => {
  const allItems = [...foodItems, ...toyItems]
  const randomItem = allItems[Math.floor(Math.random() * allItems.length)]
  const discount = Math.floor(Math.random() * 30) + 10 // 10-40% discount
  marketStore.createSpecialOffer(randomItem, discount, 300000) // 5 minutes
}

// Format item names for display
const formatItemName = (itemName) => {
  return itemName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Format timestamp
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString()
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

.gps-market__status {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.gps-market__status-indicator {
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
}

.gps-market__status-indicator--open {
  background: rgba(34, 197, 94, 0.1);
  color: rgb(34, 197, 94);
}

.gps-market__status-indicator--closed {
  background: rgba(239, 68, 68, 0.1);
  color: rgb(239, 68, 68);
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

.gps-market__offers {
  margin-block-end: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1));
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.gps-market__offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-block-start: 1rem;
}

.gps-market__offer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
}

.gps-market__offer-discount {
  color: rgb(34, 197, 94);
  font-weight: 600;
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

.gps-market__item-discount {
  color: rgb(34, 197, 94);
  font-weight: 600;
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

/* Controls styles now handled by shared .gps-panel-controls */

/* History styles now handled by shared .gps-panel-section */

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