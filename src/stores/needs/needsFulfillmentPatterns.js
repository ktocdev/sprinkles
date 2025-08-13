// Standard fulfillment patterns for all guinea pig needs
// This file defines how each need type can be satisfied

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
  thirst: 0.08,     // 4.8 points per minute - very urgent  
  love: 0.05,       // 3 points per minute - social need
  hygiene: 0.03,    // 1.8 points per minute - slower
  chew: 0.025,      // 1.5 points per minute - dental health
  enrichment: 0.02, // 1.2 points per minute - mental stimulation
  shelter: 0.015,   // 0.9 points per minute - security need
  sleep: 0.01,      // 0.6 points per minute - rest cycles
  nails: 0.005      // 0.3 points per minute - grooming need
}

// Standard urgency thresholds
export const STANDARD_THRESHOLDS = {
  fulfilled: 90,    // 90-100: Need is well satisfied
  normal: 70,       // 70-89: Need is adequately met
  urgent: 50,       // 50-69: Need requires attention
  critical: 30      // 0-49: Need is critical
}