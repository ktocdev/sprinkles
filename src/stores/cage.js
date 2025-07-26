import { defineStore } from 'pinia'

function createEmptyGrid(width, height) {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => null))
}

export const useCageStore = defineStore('cage', {
  state: () => ({
    size: { width: 12, height: 8 },
    beddingFreshness: 100,
    waterLevel: 100,
    poop: [], // array of { x, y }
    guineaPigPos: { x: 0, y: 0 }
  }),
  getters: {
    grid(state) {
      const grid = createEmptyGrid(state.size.width, state.size.height)
      // Place poops
      for (const p of state.poop) {
        if (grid[p.y] && grid[p.y][p.x] !== undefined) {
          grid[p.y][p.x] = 'poop'
        }
      }
      // Place guinea pig
      if (
        grid[state.guineaPigPos.y] &&
        grid[state.guineaPigPos.y][state.guineaPigPos.x] !== undefined
      ) {
        grid[state.guineaPigPos.y][state.guineaPigPos.x] = 'guineaPig'
      }
      return grid
    }
  },
  actions: {
    setSize(width, height) {
      this.size = { width, height }
      this.poop = []
      this.guineaPigPos = { x: 0, y: 0 }
    },
    setBeddingFreshness(value) {
      this.beddingFreshness = Math.max(0, Math.min(100, value))
    },
    setWaterLevel(value) {
      this.waterLevel = Math.max(0, Math.min(100, value))
    },
    addPoop(x, y) {
      this.poop.push({ x, y })
    },
    removePoop(x, y) {
      this.poop = this.poop.filter(p => !(p.x === x && p.y === y))
    },
    setGuineaPigPos(x, y) {
      this.guineaPigPos = { x, y }
    },
    resetCage() {
      this.beddingFreshness = 100
      this.waterLevel = 100
      this.poop = []
      this.guineaPigPos = { x: 0, y: 0 }
    }
  },
  persist: true
}) 