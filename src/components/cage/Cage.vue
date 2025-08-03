<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useCageStore } from '../../stores/cage'
import { useGuineaPigStore } from '../../stores/guineaPig'
import { usePoopStore } from '../../stores/poop'

const cageStore = useCageStore()
const guineaPigStore = useGuineaPigStore()
const poopStore = usePoopStore()

const grid = computed(() => cageStore.grid)
const width = computed(() => cageStore.size.width)
const height = computed(() => cageStore.size.height)
let moveInterval = null

function cellContent(cell, x, y) {
  if (cageStore.guineaPigPos.x === x && cageStore.guineaPigPos.y === y) return '🐹'
  if (cell === 'poop') return '💩'
  if (cell && typeof cell === 'object' && cell.name) {
    // Return appropriate emoji based on item type
    const itemType = cell.type
    const itemSize = cell.size || { width: 1, height: 1 }
    const isLarge = itemSize.width > 1 || itemSize.height > 1
    
    if (itemType === 'food') return '🥕'
    if (itemType === 'bedding') return '🛏️'
    if (itemType === 'chew') return '🦷'
    if (itemType === 'toy') return '🎾'
    if (itemType === 'bed') return isLarge ? '🛌' : '🛏️'
    if (itemType === 'shelter') return isLarge ? '🏘️' : '🏠'
    return '📦' // Default item emoji
  }
  return ''
}

function moveGuineaPig() {
  // Don't move if game is paused
  if (cageStore.paused) {
    return
  }
  
  // 65% chance to sit
  if (Math.random() < 0.65) {
    guineaPigStore.setSitting(true)
    return
  }
  guineaPigStore.setSitting(false)
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
    
    // Check if guinea pig moved onto an item and interact with it
    const itemAtNewPos = cageStore.items.find(item => item.x === next.x && item.y === next.y)
    if (itemAtNewPos) {
      cageStore.interactWithItem()
    }
    
    // Drop a poop if it's time
    if (poopStore.shouldDropPoop) {
      cageStore.addPoop(next.x, next.y)
      poopStore.resetPoopTimer()
    }
  }
}



function handleCellClick(cell, x, y) {
  if (cell === 'poop') {
    cageStore.removePoop(x, y)
  } else if (cell && typeof cell === 'object' && cell.name) {
    // Handle item click
    // This could be expanded to show item details or allow interaction
  }
}

const flatGrid = computed(() => {
  // Flatten the 2D grid to a 1D array with x, y info
  return grid.value.flatMap((row, y) => row.map((cell, x) => ({ cell, x, y })))
})

const waterBottleEmoji = computed(() => {
  const waterLevel = cageStore.waterLevel
  if (waterLevel === 0) return '🥤' // Empty cup
  if (waterLevel <= 25) return '🥛' // Low water (milk glass)
  return '💧' // Full water bottle
})

onMounted(() => {
  // Place guinea pig at a random position if not already set
  if (cageStore.guineaPigPos.x === 0 && cageStore.guineaPigPos.y === 0) {
    const x = Math.floor(Math.random() * width.value)
    const y = Math.floor(Math.random() * height.value)
    cageStore.setGuineaPigPos(x, y)
  }
  poopStore.startPoopTimer()
  moveInterval = setInterval(moveGuineaPig, 2000)
})

onUnmounted(() => {
  if (moveInterval) clearInterval(moveInterval)
  poopStore.stopPoopTimer()
})
</script>

<template>
  <div class="gps-cage">
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
          'gps-cage__cell--poop': item.cell === 'poop',
          'gps-cage__cell--item': item.cell && typeof item.cell === 'object' && item.cell.name,
          'gps-cage__cell--water': item.x === width - 1 && item.y === 0
        }"
        :data-item-size="item.cell && typeof item.cell === 'object' && item.cell.size ? `${item.cell.size.width}x${item.cell.size.height}` : null"
        @click="handleCellClick(item.cell, item.x, item.y)"
      >
        <span v-if="item.x === width - 1 && item.y === 0" class="gps-cage__water-emoji">
          {{ waterBottleEmoji }}
        </span>
        <span v-else>
          {{ cellContent(item.cell, item.x, item.y) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style>
.gps-cage {
  width: 100%;
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

.gps-cage__cell--item {
  background: var(--color-accent);
  color: var(--color-white);
}

/* Large item styling - make cells appear connected */
.gps-cage__cell--item[data-item-size="2x2"] {
  border-width: 2px;
  border-color: var(--color-accent);
  /* font-size: 1.2em; */
  background: var(--color-accent-hover);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
}

/* Add a subtle pattern to large items */
.gps-cage__cell--item[data-item-size="2x2"]::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  border-radius: 2px;
  pointer-events: none;
}

.gps-cage__grid-wrapper {
  display: flex;
  justify-content: center;
}

.gps-cage__water-emoji {
  font-size: 0.9em;
  opacity: 0.8;
}



/* Container query for medium containers */
@container cage (min-width: 400px) {
  
  .gps-cage__cell {
    width: 1.1em;
    height: 1.1em;
    font-size: 0.9em;
  }
}

/* Container query for large containers */
@container cage (min-width: 500px) {
  .gps-cage__cell {
    width: 1.2em;
    height: 1.2em;
    font-size: 1em;
  }
}
</style> 