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
  
  // Check for poop at this position (poop goes on top of items)
  if (poopStore.isPoopAtPosition(x, y)) return '💩'
  
  if (cell && typeof cell === 'object' && cell.name) {
    // Return appropriate emoji based on specific item name
    const itemName = cell.name
    
    // Food items
    if (itemName === 'hay') return '🌾'
    if (itemName === 'pellets') return '🟤'
    if (itemName === 'lettuce') return '🥬'
    if (itemName === 'blueberries') return '🫐'
    if (itemName === 'carrots') return '🥕'
    if (itemName === 'cucumbers') return '🥒'
    
    // Bedding
    if (itemName === 'bedding') return '🛏️'
    
    // Chew items
    if (itemName === 'small_chew_stick') return '🪵'
    if (itemName === 'large_chew_stick') return '🌳'
    if (itemName === 'chew_cube') return '🧊'
    
    // Toys
    if (itemName === 'small_ball') return '⚽'
    if (itemName === 'large_ball') return '🏀'
    if (itemName === 'small_tunnel') return '🕳️'
    if (itemName === 'large_tunnel') return '🚇'
    
    // Beds and shelters
    if (itemName === 'small_hammock') return '🛌'
    if (itemName === 'large_hammock') return '🏕️'
    if (itemName === 'small_bed') return '🛏️'
    if (itemName === 'large_bed') return '🛌'
    if (itemName === 'small_house') return '🏠'
    if (itemName === 'large_house') return '🏘️'
    
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
    
    // Add ambient sitting message (very low priority, won't interrupt other messages)
    import('../../stores/needs/needsQueue.js').then(({ useNeedsQueueStore }) => {
      const needsQueueStore = useNeedsQueueStore()
      needsQueueStore.addMessage('Guinea pig is sitting.', '🛋️', 6000, 8, 'ambient') // Extended to 6 seconds
    }).catch(() => {}) // Silently fail if import fails
    
    return
  }
  guineaPigStore.setSitting(false)
  
  // Add ambient movement message (very low priority)
  import('../../stores/needs/needsQueue.js').then(({ useNeedsQueueStore }) => {
    const needsQueueStore = useNeedsQueueStore()
    needsQueueStore.addMessage('Guinea pig is moving...', '🏃', 4000, 8, 'ambient') // Extended to 4 seconds
  }).catch(() => {}) // Silently fail if import fails
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
    
    // Check if guinea pig moved onto poop and interact with it
    const poopAtNewPos = poopStore.isPoopAtPosition(next.x, next.y)
    if (poopAtNewPos) {
      cageStore.interactWithPoop()
    }
    
    // Drop a poop if it's time and game is not paused
    if (poopStore.shouldDropPoop && !cageStore.paused) {
      const poopAdded = cageStore.addPoop(next.x, next.y)
      if (poopAdded) {
        // Show "guinea pig made a poop" message via message queue
        import('../../stores/needs/needsQueue.js').then(({ useNeedsQueueStore }) => {
          const needsQueueStore = useNeedsQueueStore()
          needsQueueStore.addMessage('Guinea pig made a poop!', '💩', 1000, 2, 'poop')
        })
      }
      poopStore.resetPoopTimer()
    }
  }
}

function handleCellClick(cell, x, y) {
  // Check for poop first (poop is on top, so it gets clicked first)
  if (poopStore.isPoopAtPosition(x, y)) {
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
  // Only start poop timer if the poop system is enabled (respects user debug panel settings)
  if (poopStore.isEnabled) {
    poopStore.startPoopTimer()
  }
  moveInterval = setInterval(moveGuineaPig, 2000)
})

onUnmounted(() => {
  if (moveInterval) clearInterval(moveInterval)
  poopStore.stopPoopTimer()
})
</script>

<template>
  <div class="gps-cage">
    <div class="gps-cage__container">
      <div
        class="gps-cage__grid"
        :style="{
          display: 'grid',
          gridTemplateColumns: `repeat(${width}, 1.2em)`,
          gridTemplateRows: `repeat(${height}, 1.2em)`,
          '--grid-width': width,
          '--grid-height': height
        }"
        :class="['gps-cage__grid--responsive']"
      >
      <div
        v-for="item in flatGrid"
        :key="item.x + '-' + item.y"
        class="gps-cage__cell"
        :class="{
          'gps-cage__cell--guinea-pig': cageStore.guineaPigPos.x === item.x && cageStore.guineaPigPos.y === item.y,
          'gps-cage__cell--poop': poopStore.isPoopAtPosition(item.x, item.y),
          'gps-cage__cell--item': item.cell && typeof item.cell === 'object' && item.cell.name && !poopStore.isPoopAtPosition(item.x, item.y),
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
  </div>
</template>

<style>
.gps-cage {
  width: 100%;
  max-width: 75%;
  overflow: hidden;
}

.gps-cage__container {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px; /* Space for scrollbar */
  /* Custom scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: var(--color-accent) var(--color-bg);
}

/* Webkit scrollbar styling for Chrome, Safari, Edge */
.gps-cage__container::-webkit-scrollbar {
  height: 8px;
}

.gps-cage__container::-webkit-scrollbar-track {
  background: var(--color-bg);
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

.gps-cage__container::-webkit-scrollbar-thumb {
  background: var(--color-accent);
  border-radius: 4px;
  border: 1px solid var(--color-accent-light);
}

.gps-cage__container::-webkit-scrollbar-thumb:hover {
  background: var(--color-accent-dark);
}

.gps-cage__grid {
  display: grid;
  grid-gap: 1px;
  margin-inline: auto;
  min-width: fit-content;
  width: fit-content;
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
  justify-content: flex-start; /* Changed from center to allow natural scrolling */
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

/* Tablet and above enhancements */
@media (min-width: 768px) {
  .gps-cage__grid--responsive {
    grid-template-columns: repeat(var(--grid-width), 2.2em) !important;
    grid-template-rows: repeat(var(--grid-height), 2.2em) !important;
  }
  
  .gps-cage__cell {
    width: 2em;
    height: 2em;
    font-size: 1em;
    border-radius: 8px;
  }
  
  .gps-cage__water-emoji {
    font-size: 1.7em;
  }
  
  .gps-cage__cell--item[data-item-size="2x2"] {
    border-width: 3px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
  }
}
</style> 