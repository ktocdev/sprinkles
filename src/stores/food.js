import { defineStore } from 'pinia'
import { useInventoryStore } from './inventory.js'

export const useFoodStore = defineStore('food', {
  state: () => ({
    foods: {
      hay: {
        name: 'hay',
        displayName: 'Hay',
        category: 'fiber',
        hungerImprovement: 15,
        thirstImprovement: 2,
        chewImprovement: 25,
        enrichmentImprovement: 8,
        priority: 3,
        itemType: 'food',
        description: 'Essential fiber for digestion',
        emoji: '🌾'
      },
      pellets: {
        name: 'pellets',
        displayName: 'Pellets',
        category: 'processed',
        hungerImprovement: 30,
        thirstImprovement: 3,
        chewImprovement: 15,
        enrichmentImprovement: 2,
        priority: 1,
        itemType: 'food',
        description: 'Nutritious processed food',
        emoji: '🍽️'
      },
      lettuce: {
        name: 'lettuce',
        displayName: 'Lettuce',
        category: 'vegetable',
        hungerImprovement: 20,
        thirstImprovement: 15,
        chewImprovement: 5,
        enrichmentImprovement: 3,
        priority: 2,
        itemType: 'food',
        description: 'Fresh green leaves',
        emoji: '🥬'
      },
      blueberries: {
        name: 'blueberries',
        displayName: 'Blueberries',
        category: 'fruit',
        hungerImprovement: 12,
        thirstImprovement: 8,
        chewImprovement: 3,
        enrichmentImprovement: 15,
        priority: 2,
        itemType: 'food',
        description: 'Sweet antioxidant-rich berries',
        emoji: '🫐'
      },
      carrots: {
        name: 'carrots',
        displayName: 'Carrots',
        category: 'vegetable',
        hungerImprovement: 25,
        thirstImprovement: 5,
        chewImprovement: 10,
        enrichmentImprovement: 5,
        priority: 1,
        itemType: 'food',
        description: 'A crunchy orange vegetable',
        emoji: '🥕'
      },
      cucumbers: {
        name: 'cucumbers',
        displayName: 'Cucumbers',
        category: 'vegetable',
        hungerImprovement: 18,
        thirstImprovement: 20,
        chewImprovement: 8,
        enrichmentImprovement: 4,
        priority: 2,
        itemType: 'food',
        description: 'Hydrating and refreshing',
        emoji: '🥒'
      }
    }
  }),

  getters: {
    getAllFoods() {
      return Object.values(this.foods)
    },

    getFoodsByCategory() {
      const categories = {}
      Object.values(this.foods).forEach(food => {
        if (!categories[food.category]) {
          categories[food.category] = []
        }
        categories[food.category].push(food)
      })
      return categories
    },

    getFoodByName() {
      return (name) => this.foods[name] || null
    }
  },

  actions: {
    getFulfillmentMethods(needType) {
      const inventoryStore = useInventoryStore()
      
      // Return all foods that can fulfill the specified need AND are available in inventory
      return Object.values(this.foods)
        .filter(food => {
          const improvementKey = `${needType}Improvement`
          const hasImprovement = food[improvementKey] && food[improvementKey] > 0
          const hasInventory = inventoryStore.hasItem(food.name, 1)
          return hasImprovement && hasInventory
        })
        .map(food => ({
          name: food.name,
          displayName: food.displayName,
          improvement: food[`${needType}Improvement`],
          itemType: food.itemType,
          priority: food.priority,
          description: food.description,
          emoji: food.emoji,
          available: inventoryStore.getItemCount(food.name)
        }))
        .sort((a, b) => a.priority - b.priority)
    },

    getBestFulfillmentMethod(needType) {
      const methods = this.getFulfillmentMethods(needType)
      return methods.length > 0 ? methods[0] : null
    },

    getFoodImprovement(foodName, needType) {
      const food = this.foods[foodName]
      if (!food) return 0
      
      const improvementKey = `${needType}Improvement`
      return food[improvementKey] || 0
    },

    addFood(foodData) {
      this.foods[foodData.name] = {
        ...foodData,
        itemType: foodData.itemType || 'food'
      }
    },

    removeFood(foodName) {
      if (this.foods[foodName]) {
        delete this.foods[foodName]
      }
    },

    updateFood(foodName, updates) {
      if (this.foods[foodName]) {
        this.foods[foodName] = { ...this.foods[foodName], ...updates }
      }
    }
  },

  persist: true
}) 