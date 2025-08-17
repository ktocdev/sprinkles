// Standard fulfillment patterns for all guinea pig needs
// This file defines how each need type can be satisfied

import { DEBUG_STORES } from './needsQueue.js'

export const NEED_FULFILLMENT_PATTERNS = {
  hunger: {
    description: 'Fulfilled by eating food items',
    fulfillmentStore: 'food', // Uses food store for fulfillment methods
    methods: {
      // Methods are dynamically loaded from food store
      // Examples: hay, pellets, vegetables, fruits, treats
    },
    integrationNotes: 'Integrates with food store and inventory system'
  },

  thirst: {
    description: 'Fulfilled by drinking water from bottles or dishes',
    fulfillmentStore: 'water', // Would need water store
    methods: {
      water_bottle: {
        name: 'Water Bottle',
        improvement: 25,
        emoji: '🍼',
        description: 'Clean, convenient water source'
      },
      water_dish: {
        name: 'Water Dish', 
        improvement: 20,
        emoji: '🥤',
        description: 'Natural drinking method'
      },
      fresh_water: {
        name: 'Fresh Water',
        improvement: 30,
        emoji: '💧',
        description: 'Freshly changed water'
      }
    },
    integrationNotes: 'Would integrate with water quality and cleanliness systems'
  },

  love: {
    description: 'Fulfilled by human interaction - petting, talking, singing',
    fulfillmentStore: 'interaction', // Would need interaction store
    methods: {
      petting: {
        name: 'Gentle Petting',
        improvement: 20,
        emoji: '👋',
        description: 'Gentle strokes and scratches'
      },
      talking: {
        name: 'Talking To',
        improvement: 15,
        emoji: '💬', 
        description: 'Soft, soothing conversation'
      },
      singing: {
        name: 'Singing To',
        improvement: 25,
        emoji: '🎵',
        description: 'Melodic sounds guinea pigs love'
      },
      hand_feeding: {
        name: 'Hand Feeding',
        improvement: 30,
        emoji: '🤲',
        description: 'Personal feeding builds trust'
      },
      lap_time: {
        name: 'Lap Time',
        improvement: 35,
        emoji: '🤗',
        description: 'Cuddling on human\'s lap'
      }
    },
    integrationNotes: 'Would integrate with user interaction tracking and bonding systems'
  },

  chew: {
    description: 'Fulfilled by chewing on appropriate items for dental health',
    fulfillmentStore: 'chewables', // Would need chewables store
    methods: {
      hay_cubes: {
        name: 'Hay Cubes',
        improvement: 20,
        emoji: '🧊',
        description: 'Compressed hay for chewing'
      },
      wooden_chews: {
        name: 'Wooden Chews',
        improvement: 25,
        emoji: '🪵',
        description: 'Safe wood pieces for gnawing'
      },
      willow_sticks: {
        name: 'Willow Sticks',
        improvement: 30,
        emoji: '🌿',
        description: 'Natural willow branches'
      },
      cardboard_tubes: {
        name: 'Cardboard Tubes',
        improvement: 15,
        emoji: '📦',
        description: 'Safe cardboard for shredding'
      }
    },
    integrationNotes: 'Critical for dental health, prevents overgrown teeth'
  },

  hygiene: {
    description: 'Fulfilled by cleaning and maintaining clean environment',
    fulfillmentStore: 'cleaning', // Would need cleaning store
    methods: {
      cage_cleaning: {
        name: 'Cage Cleaning',
        improvement: 40,
        emoji: '🧹',
        description: 'Full cage clean and disinfect'
      },
      bedding_change: {
        name: 'Bedding Change',
        improvement: 30,
        emoji: '🛏️',
        description: 'Fresh, clean bedding'
      },
      spot_cleaning: {
        name: 'Spot Cleaning',
        improvement: 20,
        emoji: '🧽',
        description: 'Clean dirty areas'
      },
      grooming: {
        name: 'Gentle Grooming',
        improvement: 25,
        emoji: '🪮',
        description: 'Brushing and nail trimming'
      }
    },
    integrationNotes: 'Integrates with poop system and cleanliness tracking'
  },

  shelter: {
    description: 'Fulfilled by having safe hiding places and comfortable spaces',
    fulfillmentStore: 'shelter', // Would need shelter store
    methods: {
      hideout: {
        name: 'Cozy Hideout',
        improvement: 30,
        emoji: '🏠',
        description: 'Enclosed space for security'
      },
      tunnel: {
        name: 'Tunnel',
        improvement: 25,
        emoji: '🚇',
        description: 'Tube for hiding and playing'
      },
      soft_bedding: {
        name: 'Soft Bedding',
        improvement: 20,
        emoji: '🛌',
        description: 'Comfortable resting area'
      },
      covered_area: {
        name: 'Covered Area',
        improvement: 35,
        emoji: '☂️',
        description: 'Protected from overhead threats'
      }
    },
    integrationNotes: 'Reduces stress, especially important for prey animals'
  },

  enrichment: {
    description: 'Fulfilled by mental stimulation and physical activity',
    fulfillmentStore: 'enrichment', // Would need enrichment store
    methods: {
      foraging_mat: {
        name: 'Foraging Mat',
        improvement: 25,
        emoji: '🧩',
        description: 'Hide treats in textured mat'
      },
      puzzle_feeder: {
        name: 'Puzzle Feeder',
        improvement: 30,
        emoji: '🎯',
        description: 'Work for food rewards'
      },
      climbing_ramp: {
        name: 'Climbing Ramp',
        improvement: 20,
        emoji: '📐',
        description: 'Different levels for exploration'
      },
      toy_rotation: {
        name: 'Toy Rotation',
        improvement: 35,
        emoji: '🔄',
        description: 'New toys to explore'
      },
      exploration_time: {
        name: 'Floor Time',
        improvement: 40,
        emoji: '🌍',
        description: 'Supervised exploration outside cage'
      }
    },
    integrationNotes: 'Prevents boredom, promotes natural behaviors'
  },

  sleep: {
    description: 'Fulfilled by having quiet, comfortable rest periods',
    fulfillmentStore: 'sleep', // Would need sleep store
    methods: {
      quiet_time: {
        name: 'Quiet Time',
        improvement: 25,
        emoji: '🤫',
        description: 'Reduced noise and activity'
      },
      dim_lighting: {
        name: 'Dim Lighting',
        improvement: 20,
        emoji: '🌙',
        description: 'Soft, natural lighting'
      },
      comfortable_bedding: {
        name: 'Comfortable Bedding',
        improvement: 30,
        emoji: '🛏️',
        description: 'Soft, warm sleeping area'
      },
      undisturbed_rest: {
        name: 'Undisturbed Rest',
        improvement: 35,
        emoji: '😴',
        description: 'Long periods without interruption'
      }
    },
    integrationNotes: 'Guinea pigs are crepuscular, need rest during day'
  },

  nails: {
    description: 'Fulfilled by nail trimming and maintenance',
    fulfillmentStore: 'grooming', // Would need grooming store
    methods: {
      nail_trim: {
        name: 'Nail Trimming',
        improvement: 50,
        emoji: '✂️',
        description: 'Careful nail trimming session'
      },
      scratching_surface: {
        name: 'Scratching Surface',
        improvement: 20,
        emoji: '📋',
        description: 'Rough surface for natural wear'
      },
      regular_handling: {
        name: 'Regular Handling',
        improvement: 30,
        emoji: '🤲',
        description: 'Gets used to paw handling'
      }
    },
    integrationNotes: 'Critical for mobility and comfort, overgrown nails cause pain'
  }
}

// Helper function to get fulfillment methods for a specific need
export function getFulfillmentMethodsForNeed(needType) {
  const pattern = NEED_FULFILLMENT_PATTERNS[needType]
  return pattern ? pattern.methods : {}
}

// Helper function to get need description
export function getNeedDescription(needType) {
  const pattern = NEED_FULFILLMENT_PATTERNS[needType]
  return pattern ? pattern.description : 'Unknown need type'
}

// Helper function to check if need requires external store
export function needRequiresExternalStore(needType) {
  const pattern = NEED_FULFILLMENT_PATTERNS[needType]
  return pattern ? pattern.fulfillmentStore : null
}

// Standard degradation rates (points per second)
export const STANDARD_DEGRADATION_RATES = {
  hunger: 0.1,      // 6 points per minute - most urgent
  thirst: 0.03,     // 1.8 points per minute - slower degradation
  love: 0.05,       // 3 points per minute - social need
  hygiene: 0.025,   // 1.5 points per minute - user interaction only
  chew: 0.04,       // 2.4 points per minute - dental health
  enrichment: 0.035, // 2.1 points per minute - mental stimulation
  shelter: 0.06,    // 3.6 points per minute - security need
  sleep: 0.05,      // 3 points per minute - auto-fulfilled during guinea pig sleep
  nails: 0.002      // 0.12 points per minute - slowest degradation, user interaction only
}

// Standard urgency thresholds
export const STANDARD_THRESHOLDS = {
  fulfilled: 90,    // 90-100: Need is well satisfied
  normal: 70,       // 70-89: Need is adequately met
  urgent: 50,       // 50-69: Need requires attention
  critical: 30      // 0-49: Need is critical
}

// Item interaction patterns for guinea pig behavior
// Defines which items different needs prefer and their quality ratings
export const ITEM_INTERACTION_PATTERNS = {
  sleep: {
    description: 'Items that provide comfort and rest for sleeping',
    preferredItems: [
      'small_bed',
      'large_bed', 
      'small_hammock',
      'large_hammock',
      'small_house',
      'large_house'
    ],
    qualityRatings: {
      'large_bed': 120,      // Best sleep quality
      'small_bed': 100,      // Excellent sleep quality
      'large_hammock': 100,  // Excellent sleep quality
      'small_hammock': 80,   // Good sleep quality
      'large_house': 80,     // Good sleep quality + security
      'small_house': 60      // Decent sleep quality + security
    },
    fulfillmentBonus: {
      // Bonus sleep recovery when using these items
      'large_bed': 25,       // +25 sleep points per cycle
      'small_bed': 20,       // +20 sleep points per cycle
      'large_hammock': 20,   // +20 sleep points per cycle
      'small_hammock': 15,   // +15 sleep points per cycle
      'large_house': 15,     // +15 sleep points per cycle
      'small_house': 12      // +12 sleep points per cycle
    },
    groundPenalty: 8         // Only 8 sleep points when sleeping on ground
  },

  shelter: {
    description: 'Items that provide security and protection',
    preferredItems: [
      'small_house',
      'large_house',
      'small_tunnel', 
      'large_tunnel',
      'small_hammock',
      'large_hammock'
    ],
    qualityRatings: {
      'large_house': 120,    // Best shelter quality
      'small_house': 100,    // Excellent shelter quality
      'large_tunnel': 90,    // Great for hiding
      'small_tunnel': 70,    // Good for hiding
      'large_hammock': 60,   // Some overhead protection
      'small_hammock': 50    // Minimal overhead protection
    }
  },

  chew: {
    description: 'Items that satisfy dental health needs',
    preferredItems: [
      'small_chew_stick',
      'large_chew_stick',
      'chew_cube'
    ],
    qualityRatings: {
      'large_chew_stick': 100, // Best chew quality
      'chew_cube': 90,         // Excellent chew quality
      'small_chew_stick': 80   // Good chew quality
    }
  },

  enrichment: {
    description: 'Items that provide mental stimulation and play',
    preferredItems: [
      'small_ball',
      'large_ball',
      'small_tunnel',
      'large_tunnel',
      'small_chew_stick',
      'large_chew_stick',
      'chew_cube'
    ],
    qualityRatings: {
      'large_ball': 100,       // Best enrichment quality
      'small_ball': 80,        // Good enrichment quality
      'large_tunnel': 90,      // Great for exploration
      'small_tunnel': 70,      // Good for exploration
      'large_chew_stick': 70,  // Dual purpose (chew + play)
      'small_chew_stick': 60,  // Dual purpose (chew + play)
      'chew_cube': 65          // Dual purpose (chew + play)
    }
  },

  hunger: {
    description: 'Food items that provide nutrition and satisfy appetite',
    preferredItems: [
      'hay',
      'pellets', 
      'carrots',
      'lettuce',
      'blueberries',
      'cucumbers'
    ],
    qualityRatings: {
      'pellets': 100,          // Best nutritional value (30 hunger improvement)
      'carrots': 90,           // Excellent nutrition (25 hunger improvement)
      'lettuce': 80,           // Good nutrition (20 hunger improvement)
      'cucumbers': 70,         // Good nutrition (18 hunger improvement)
      'hay': 60,               // Basic nutrition (15 hunger improvement)
      'blueberries': 50        // Lower nutrition but high enrichment (12 hunger improvement)
    },
    fulfillmentBonus: {
      // These match the hungerImprovement values from the food store
      'pellets': 30,           // +30 hunger points when reached
      'carrots': 25,           // +25 hunger points when reached  
      'lettuce': 20,           // +20 hunger points when reached
      'cucumbers': 18,         // +18 hunger points when reached
      'hay': 15,               // +15 hunger points when reached
      'blueberries': 12        // +12 hunger points when reached
    }
  },

  thirst: {
    description: 'Fixed water bottle location for hydration',
    preferredItems: [
      'water_bottle_fixed'
    ],
    qualityRatings: {
      'water_bottle_fixed': 100  // Only water source available
    },
    fulfillmentBonus: {
      'water_bottle_fixed': 20   // +20 thirst points when reached
    },
    // Special handling: water bottle is at fixed position (top-right corner)
    fixedPosition: true,
    getWaterBottlePosition: (cageStore) => {
      return {
        x: cageStore.size.width - 1,
        y: 0,
        name: 'water_bottle_fixed',
        quality: 100
      }
    }
  }
}

// Reusable utility functions for item interactions
// These can be used by any need store to find and interact with preferred items

// Get all preferred items for a specific need from the cage
export function getPreferredItemsForNeed(needType, cageStore) {
  const pattern = ITEM_INTERACTION_PATTERNS[needType]
  if (!pattern) return []

  // Special handling for thirst - fixed water bottle position
  if (needType === 'thirst' && pattern.fixedPosition && pattern.getWaterBottlePosition) {
    const waterBottle = pattern.getWaterBottlePosition(cageStore)
    return [waterBottle]
  }

  // Normal handling for other needs
  if (!cageStore?.items) return []

  // Filter cage items for this need's preferred items
  const preferredItems = cageStore.items.filter(item => {
    return pattern.preferredItems.includes(item.name)
  })

  // Add quality ratings
  return preferredItems.map(item => ({
    ...item,
    quality: pattern.qualityRatings[item.name] || 0,
    distance: 0 // Will be calculated when needed
  }))
}

// Check if a specific item is preferred by a need
export function isPreferredItemForNeed(needType, itemName) {
  const pattern = ITEM_INTERACTION_PATTERNS[needType]
  return pattern ? pattern.preferredItems.includes(itemName) : false
}

// Get quality rating for an item for a specific need
export function getItemQualityForNeed(needType, itemName) {
  const pattern = ITEM_INTERACTION_PATTERNS[needType]
  return pattern?.qualityRatings[itemName] || 0
}

// Get fulfillment bonus for using an item (sleep-specific for now)
export function getFulfillmentBonusForItem(needType, itemName) {
  const pattern = ITEM_INTERACTION_PATTERNS[needType]
  return pattern?.fulfillmentBonus?.[itemName] || null
}

// Get ground penalty for a need (when no preferred items are used)
export function getGroundPenaltyForNeed(needType) {
  const pattern = ITEM_INTERACTION_PATTERNS[needType]
  return pattern?.groundPenalty || null
}

// Find the nearest and best item for a specific need
export function findNearestItemForNeed(needType, guineaPigX, guineaPigY, cageStore) {
  try {
    // Get all preferred items for this need
    const preferredItems = getPreferredItemsForNeed(needType, cageStore)
    if (preferredItems.length === 0) return null

    // Calculate distances and find the best option
    const itemsWithDistance = preferredItems.map(item => {
      const distance = Math.abs(item.x - guineaPigX) + Math.abs(item.y - guineaPigY) // Manhattan distance
      return {
        ...item,
        distance
      }
    })

    // For thirst, there's only one water bottle, so just return it with distance
    if (needType === 'thirst') {
      return itemsWithDistance[0] || null
    }

    // For other needs, sort by priority: prefer higher quality items, but consider distance
    // Quality is weighted more heavily than distance for better outcomes
    const bestItem = itemsWithDistance.reduce((best, current) => {
      if (!best) return current

      // Calculate score: higher quality is better, lower distance is better
      const currentScore = current.quality - (current.distance * 2) // Quality weighted 50% more than distance
      const bestScore = best.quality - (best.distance * 2)

      return currentScore > bestScore ? current : best
    }, null)

    return bestItem
  } catch (error) {
    DEBUG_STORES && console.warn(`🔍 [ITEM_SEARCH] Could not find nearest item for ${needType}:`, error)
    return null
  }
}
