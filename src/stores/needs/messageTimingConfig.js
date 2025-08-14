// Centralized configuration for message timing durations
// All durations are in milliseconds and should be at least 1000ms (1 second)

export const MESSAGE_DURATIONS = {
  // Fulfillment messages (e.g., "Ate Carrots")
  FULFILLMENT: 2000, // 2 seconds - shows what action was taken
  
  // Reaction messages (e.g., "Nom nom nom!")
  REACTION: 2000, // 2 seconds - shows guinea pig's reaction
  
  // Status change reactions (automatic when needs change)
  STATUS_CHANGE: 1500, // 1.5 seconds - automatic status improvements/degradations
  
  // Urgency messages (from needs stores)
  URGENCY: 2000, // 2 seconds - messages about urgent needs
  
  // Wellness messages 
  WELLNESS: 3000, // 3 seconds - overall wellness status
  
  // Temporary messages (high priority overrides)
  TEMPORARY: 2000, // 2 seconds - temporary override messages
  
  // Poop messages
  POOP: 1500, // 1.5 seconds - poop-related messages
  
  // Ambient messages (movement, sitting, etc.)
  AMBIENT: 1000, // 1 second - low priority background messages
  
  // Food-specific messages (can be overridden per food type)
  FOOD: 2000, // 2 seconds - default for all food consumption
  
  // Minimum display time for any message
  MINIMUM: 1000 // 1 second - absolute minimum for any message
}

// Priority levels for message queue (lower number = higher priority)
export const MESSAGE_PRIORITIES = {
  REACTION: 1,        // Highest priority - immediate reactions
  FULFILLMENT: 1,     // Highest priority - fulfillment actions  
  FOOD: 1,           // Highest priority - food consumption
  TEMPORARY: 2,       // High priority - temporary overrides
  URGENCY: 3,         // Medium priority - urgent needs
  WELLNESS: 4,        // Lower priority - wellness messages
  STATUS_CHANGE: 5,   // Lower priority - automatic status changes
  POOP: 6,           // Lower priority - poop messages
  AMBIENT: 8         // Lowest priority - background messages
}

// Delays between message types
export const MESSAGE_DELAYS = {
  // Delay between fulfillment message and reaction message
  FULFILLMENT_TO_REACTION: 100, // 0.1 seconds
  
  // Delay to clear recently fulfilled flag
  CLEAR_FULFILLED_FLAG: 500, // 0.5 seconds
  
  // Delay between messages in queue
  QUEUE_PROCESSING: 100 // 0.1 seconds
}

// Helper function to ensure minimum duration
export function ensureMinimumDuration(duration) {
  return Math.max(duration, MESSAGE_DURATIONS.MINIMUM)
}

// Helper function to get duration by message type
export function getDurationByType(messageType) {
  const duration = MESSAGE_DURATIONS[messageType.toUpperCase()]
  return duration ? ensureMinimumDuration(duration) : MESSAGE_DURATIONS.MINIMUM
}

// Helper function to get priority by message type
export function getPriorityByType(messageType) {
  return MESSAGE_PRIORITIES[messageType.toUpperCase()] || MESSAGE_PRIORITIES.AMBIENT
}