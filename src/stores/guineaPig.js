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
  
  getters: {
    currentEmoji() {
      // Return emoji based on guinea pig state
      return this.sitting ? '🛋️' : '🏃'
    },
    
    currentMessage() {
      // Return message based on guinea pig state
      return this.sitting ? 'The guinea pig is sitting.' : 'The guinea pig is moving...'
    }
  },
  
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