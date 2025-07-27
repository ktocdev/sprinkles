import { defineStore } from 'pinia'

function clampValue(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value))
}

export const useGuineaPigStore = defineStore('guineaPig', {
  state: () => ({
    info: {
      name: '',
      birthday: '', // ISO string or date
      coat: '',
      gender: '', // 'neutered boar' or 'sow'
    },
    needs: {
      hunger: 100,
      thirst: 100,
      shelter: 100,
      chew: 100,
      enrichment: 100,
      love: 100,
      nails: 100,
      hygiene: 100,
    },
    sitting: true
  }),
  actions: {
    setInfoField(field, value) {
      if (field in this.info) {
        this.info[field] = value
      }
    },
    setNeed(need, value) {
      if (need in this.needs) {
        this.needs[need] = value
      }
    },
    adjustNeed(need, delta) {
      if (need in this.needs) {
        this.needs[need] = clampValue(this.needs[need] + delta)
      }
    },
    resetNeeds() {
      for (const need in this.needs) {
        this.needs[need] = 100
      }
    },
    setSitting(sitting) {
      this.sitting = sitting
    }
  },
  persist: true
}) 