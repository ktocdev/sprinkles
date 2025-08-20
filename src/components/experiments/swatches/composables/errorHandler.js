/**
 * Centralized error handling utilities
 */

/**
 * Log an error with context
 * @param {string} context - Context where the error occurred
 * @param {Error|string} error - The error to log
 * @param {Object} metadata - Additional metadata
 */
export const logError = (context, error, metadata = {}) => {
  const timestamp = new Date().toISOString()
  const errorMessage = error instanceof Error ? error.message : error
  const stack = error instanceof Error ? error.stack : undefined
  
  console.error(`[${timestamp}] Error in ${context}:`, {
    message: errorMessage,
    stack,
    metadata
  })
}

/**
 * Safe function wrapper that catches and logs errors
 * @param {Function} fn - Function to wrap
 * @param {string} context - Context for error logging
 * @param {*} fallback - Fallback value to return on error
 * @returns {Function} Wrapped function
 */
export const safeFunction = (fn, context, fallback = null) => {
  return (...args) => {
    try {
      return fn(...args)
    } catch (error) {
      logError(context, error, { args })
      return fallback
    }
  }
}

/**
 * Safe async function wrapper
 * @param {Function} fn - Async function to wrap
 * @param {string} context - Context for error logging
 * @param {*} fallback - Fallback value to return on error
 * @returns {Function} Wrapped async function
 */
export const safeAsyncFunction = (fn, context, fallback = null) => {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      logError(context, error, { args })
      return fallback
    }
  }
}

/**
 * Validate color data structure
 * @param {*} colorData - Data to validate
 * @returns {boolean} Whether the data is valid
 */
export const validateColorData = (colorData) => {
  if (!colorData || typeof colorData !== 'object') return false
  
  const requiredFields = ['colorName', 'hexCode', 'bgColor']
  const hasRequiredFields = requiredFields.every(field => 
    typeof colorData[field] === 'string' && colorData[field].length > 0
  )
  
  const hasValidIsDark = typeof colorData.isDark === 'boolean'
  
  return hasRequiredFields && hasValidIsDark
}

/**
 * Validate hex color format
 * @param {string} hex - Hex color to validate
 * @returns {boolean} Whether the hex is valid
 */
export const validateHexColor = (hex) => {
  if (typeof hex !== 'string') return false
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexRegex.test(hex)
}

/**
 * Safe JSON parse with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallback - Fallback value on parse error
 * @returns {*} Parsed object or fallback
 */
export const safeJsonParse = (jsonString, fallback = null) => {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    logError('JSON parse', error, { jsonString })
    return fallback
  }
}

/**
 * Safe JSON stringify with error handling
 * @param {*} data - Data to stringify
 * @param {string} fallback - Fallback string on stringify error
 * @returns {string} JSON string or fallback
 */
export const safeJsonStringify = (data, fallback = '{}') => {
  try {
    return JSON.stringify(data)
  } catch (error) {
    logError('JSON stringify', error, { data })
    return fallback
  }
}