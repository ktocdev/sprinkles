// Centralized configuration for need message frequencies
// Makes it easy to adjust how often urgency messages appear for each status level

// Message frequency intervals (in milliseconds)
export const MESSAGE_FREQUENCY_INTERVALS = {
  // Default intervals for most needs
  default: {
    fulfilled: 60000,  // 60 seconds - very low frequency for fulfilled status
    normal: 45000,     // 45 seconds - low frequency for normal status  
    urgent: 15000,     // 15 seconds - medium frequency for urgent status
    critical: 6000     // 6 seconds - high frequency for critical status
  },
  
  // Wellness-specific intervals (more frequent positive messages)
  wellness: {
    fulfilled: 20000,  // 20 seconds - show positive messages regularly
    normal: 15000,     // 15 seconds
    urgent: 12000,     // 12 seconds  
    critical: 9000     // 9 seconds
  },
  
  // Hunger-specific intervals
  hunger: {
    normal: 45000,     // 45 seconds - low frequency for normal status (70-89%)
    urgent: 15000,     // 15 seconds - medium frequency for urgent status (50-69%)
    critical: 6000     // 6 seconds - high frequency for critical status (0-49%)
  }
}

// Status thresholds (consistent across all needs)
export const STATUS_THRESHOLDS = {
  fulfilled: 90,    // 90-100: Need is well satisfied
  normal: 70,       // 70-89: Need is adequately met
  urgent: 50,       // 50-69: Need requires attention
  critical: 0       // 0-49: Need is critical
}

// Helper function to get intervals for a specific need
export function getMessageIntervals(needType) {
  return MESSAGE_FREQUENCY_INTERVALS[needType] || MESSAGE_FREQUENCY_INTERVALS.default
}

// Helper function to determine status based on value
export function getStatusFromValue(currentValue) {
  if (currentValue >= STATUS_THRESHOLDS.fulfilled) return 'fulfilled'
  if (currentValue >= STATUS_THRESHOLDS.normal) return 'normal'
  if (currentValue >= STATUS_THRESHOLDS.urgent) return 'urgent'
  return 'critical'
}

// Configuration explanation:
// 
// NORMAL (70-89%): Every 45 seconds = Low frequency
// - User request: "every 15 messages" 
// - Assuming ~3 second average message display = 45 seconds between urgency messages
//
// URGENT (50-69%): Every 15 seconds = Medium frequency  
// - User request: "every 5-8 messages"
// - Assuming ~3 second average message display = 15-24 seconds (using 15s)
//
// CRITICAL (0-49%): Every 6 seconds = High frequency
// - User request: "every 2 or 3 messages" 
// - Assuming ~3 second average message display = 6-9 seconds (using 6s)