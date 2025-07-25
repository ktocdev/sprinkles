<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useCageStore } from '../stores/cage'

const cageStore = useCageStore()

const grid = computed(() => cageStore.grid)
const width = computed(() => cageStore.size.width)
const height = computed(() => cageStore.size.height)

const guineaPigPos = ref({ x: 0, y: 0 })
const sitting = ref(true)
let moveInterval = null
let poopTimeout = null

function cellContent(cell, x, y) {
  if (guineaPigPos.value.x === x && guineaPigPos.value.y === y) return '🐹'
  if (cell === 'poop') return '💩'
  if (cell === 'object') return '🪑'
  return ''
}

function moveGuineaPig() {
  // 65% chance to sit
  if (Math.random() < 0.65) {
    sitting.value = true
    return
  }
  sitting.value = false
  // Find possible moves (adjacent cells)
  const { x, y } = guineaPigPos.value
  const moves = []
  if (x > 0) moves.push({ x: x - 1, y })
  if (x < width.value - 1) moves.push({ x: x + 1, y })
  if (y > 0) moves.push({ x, y: y - 1 })
  if (y < height.value - 1) moves.push({ x, y: y + 1 })
  if (moves.length > 0) {
    const next = moves[Math.floor(Math.random() * moves.length)]
    guineaPigPos.value = next
    // Drop a poop if it's time
    if (shouldDropPoop.value) {
      cageStore.addPoop(next.x, next.y)
      resetPoopTimer()
    }
  }
}

const shouldDropPoop = ref(false)
function resetPoopTimer() {
  shouldDropPoop.value = false
  if (poopTimeout) clearTimeout(poopTimeout)
  poopTimeout = setTimeout(() => {
    shouldDropPoop.value = true
  }, 5000 + Math.random() * 7000) // 5-12 seconds
}

function handleCellClick(cell, x, y) {
  if (cell === 'poop') {
    cageStore.removePoop(x, y)
  }
}

const flatGrid = computed(() => {
  // Flatten the 2D grid to a 1D array with x, y info
  return grid.value.flatMap((row, y) => row.map((cell, x) => ({ cell, x, y })))
})

onMounted(() => {
  // Place guinea pig at a random position
  guineaPigPos.value = {
    x: Math.floor(Math.random() * width.value),
    y: Math.floor(Math.random() * height.value)
  }
  resetPoopTimer()
  moveInterval = setInterval(moveGuineaPig, 2000)
})

onUnmounted(() => {
  if (moveInterval) clearInterval(moveInterval)
  if (poopTimeout) clearTimeout(poopTimeout)
})
</script>

<template>
  <div class="gps-cage">
    <div class="gps-cage__layout">
      <div class="gps-cage__sidebar">
        <h3 class="gps-cage__title">Cage</h3>
        <div class="gps-cage__bedding">
          <span class="gps-cage__bedding-label">Bedding Freshness:</span>
          <progress class="gps-cage__bedding-bar" :value="cageStore.beddingFreshness" max="100"></progress>
          <span class="gps-cage__bedding-value">{{ cageStore.beddingFreshness }}</span>
        </div>
        <div v-if="sitting" class="gps-cage__status">The guinea pig is sitting.</div>
        <div v-else class="gps-cage__status">The guinea pig is moving...</div>
      </div>
      <div class="gps-cage__grid-wrapper">
        <div
          class="gps-cage__grid"
          :style="{
            display: 'grid',
            gridTemplateColumns: `repeat(${width}, 1.2em)`,
            gridTemplateRows: `repeat(${height}, 1.2em)`
          }"
        >
          <div
            v-for="item in flatGrid"
            :key="item.x + '-' + item.y"
            class="gps-cage__cell"
            :class="{
              'gps-cage__cell--guinea-pig': guineaPigPos.x === item.x && guineaPigPos.y === item.y,
              'gps-cage__cell--poop': item.cell === 'poop'
            }"
            @click="handleCellClick(item.cell, item.x, item.y)"
          >
            {{ cellContent(item.cell, item.x, item.y) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.gps-cage {
  margin-top: 2em;
}
.gps-cage__title {
  margin-bottom: 0.5em;
}
.gps-cage__bedding {
  margin-bottom: 1em;
  display: flex;
  align-items: center;
}
.gps-cage__bedding-label {
  margin-right: 0.5em;
}
.gps-cage__bedding-bar {
  width: 120px;
  margin-right: 0.5em;
}
.gps-cage__bedding-value {
  min-width: 2em;
  text-align: right;
}
.gps-cage__grid {
  display: grid;
  grid-gap: 1px;
  margin-left: auto;
  margin-right: auto;
}
.gps-cage__cell {
  width: 1.2em;
  height: 1.2em;
  background: #f0e6d2;
  border: 1px solid #c2b280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s;
}
.gps-cage__cell--guinea-pig {
  background: #ffe4b5;
}
.gps-cage__cell--poop {
  background: #e2c48d;
}
.gps-cage__status {
  margin-top: 1em;
  font-style: italic;
  color: #888;
}
.gps-cage__layout {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 2em;
}
.gps-cage__sidebar {
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 1em;
}
</style> 