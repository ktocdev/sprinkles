import { defineStore } from 'pinia'

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
      sleep: 100,
      love: 100,
      cleanliness: 100,
    }
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
        this.needs[need] = Math.max(0, Math.min(100, this.needs[need] + delta))
      }
    },
    resetNeeds() {
      for (const need in this.needs) {
        this.needs[need] = 100
      }
    }
  },
  persist: true
}) 