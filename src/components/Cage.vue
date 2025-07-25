<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useCageStore } from '../stores/cage'

const cageStore = useCageStore()

const grid = computed(() => cageStore.grid)
const width = computed(() => cageStore.size.width)
const height = computed(() => cageStore.size.height)

const sitting = ref(true)
let moveInterval = null
let poopTimeout = null

function cellContent(cell, x, y) {
  if (cageStore.guineaPigPos.x === x && cageStore.guineaPigPos.y === y) return '🐹'
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
  const { x, y } = cageStore.guineaPigPos
  const moves = []
  if (x > 0) moves.push({ x: x - 1, y })
  if (x < width.value - 1) moves.push({ x: x + 1, y })
  if (y > 0) moves.push({ x, y: y - 1 })
  if (y < height.value - 1) moves.push({ x, y: y + 1 })
  if (moves.length > 0) {
    const next = moves[Math.floor(Math.random() * moves.length)]
    cageStore.setGuineaPigPos(next.x, next.y)
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
  const x = Math.floor(Math.random() * width.value)
  const y = Math.floor(Math.random() * height.value)
  cageStore.setGuineaPigPos(x, y)
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
              'gps-cage__cell--guinea-pig': cageStore.guineaPigPos.x === item.x && cageStore.guineaPigPos.y === item.y,
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
  margin-block-start: 2em;
  container-type: inline-size;
  container-name: cage;
}

.gps-cage__title {
  margin-block-end: 0.5em;
}

.gps-cage__bedding {
  margin-block-end: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
}

.gps-cage__bedding-label {
  margin-inline-end: 0;
}

.gps-cage__bedding-bar {
  width: 100%;
  max-width: 200px;
  margin-inline-end: 0;
}

.gps-cage__bedding-value {
  min-width: 2em;
  text-align: center;
}

.gps-cage__grid {
  display: grid;
  grid-gap: 1px;
  margin-inline: auto;
}

.gps-cage__cell {
  width: 1em;
  height: 1em;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  cursor: pointer;
  transition: var(--transition);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.gps-cage__cell--guinea-pig {
  background: var(--color-cage-guinea-pig);
}

.gps-cage__cell--poop {
  background: var(--color-cage-poop);
}

.gps-cage__status {
  margin-block-start: 1em;
  font-style: italic;
  color: var(--color-text, #888);
  text-align: center;
}

/* Mobile-first: Start with column layout */
.gps-cage__layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5em;
}

.gps-cage__sidebar {
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1em;
  text-align: center;
}

.gps-cage__grid-wrapper {
  order: -1;
}

/* Container query for medium containers */
@container cage (min-width: 400px) {
  .gps-cage__bedding {
    flex-direction: row;
    align-items: center;
    gap: 0.5em;
  }
  
  .gps-cage__bedding-label {
    margin-inline-end: 0.5em;
  }
  
  .gps-cage__bedding-bar {
    width: 120px;
    margin-inline-end: 0.5em;
  }
  
  .gps-cage__bedding-value {
    text-align: end;
  }
  
  .gps-cage__cell {
    width: 1.1em;
    height: 1.1em;
    font-size: 0.9em;
  }
}

/* Container query for large containers - expand to row layout */
@container cage (min-width: 500px) {
  .gps-cage__layout {
    flex-direction: row;
    align-items: flex-start;
    gap: 2em;
  }
  
  .gps-cage__sidebar {
    min-width: 180px;
    max-width: none;
    text-align: start;
  }
  
  .gps-cage__status {
    text-align: start;
  }
  
  .gps-cage__cell {
    width: 1.2em;
    height: 1.2em;
    font-size: 1em;
  }
}
</style> 