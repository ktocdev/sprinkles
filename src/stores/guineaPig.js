import { defineStore } from 'pinia'

export const useGuineaPigStore = defineStore('guineaPig', {
  state: () => ({
    info: {
      name: '',
      birthday: '', // ISO string or date
      coat: '',
      gender: '', // 'neutered boar' or 'sow'
    },
    sitting: true
  }),
  actions: {
    setInfoField(field, value) {
      if (field in this.info) {
        this.info[field] = value
      }
    },
    setSitting(sitting) {
      this.sitting = sitting
    }
  },
  persist: true
}) 