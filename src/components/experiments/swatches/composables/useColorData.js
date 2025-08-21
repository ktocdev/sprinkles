import { computed } from 'vue'
import colorsData from '../data/colors.json'

/**
 * Composable for managing color data from the palette
 * @returns {Object} Color data and utilities
 */
export function useColorData() {
  // Get the main palette (could be made configurable later)
  const palette = computed(() => colorsData.palettes.appleCiderBoardGame)
  
  // Flatten all colors from all categories
  const allColors = computed(() => {
    const colors = []
    Object.values(palette.value.categories).forEach(category => {
      colors.push(...category)
    })
    return colors
  })
  
  /**
   * Get colors by category
   * @param {string} categoryName - Name of the category
   * @returns {Array} Array of colors in the category
   */
  const getColorsByCategory = (categoryName) => {
    return palette.value.categories[categoryName] || []
  }
  
  /**
   * Get all category names
   * @returns {Array} Array of category names
   */
  const getCategoryNames = () => {
    return Object.keys(palette.value.categories)
  }
  
  /**
   * Find a color by name
   * @param {string} colorName - Name of the color to find
   * @returns {Object|null} Color object or null if not found
   */
  const findColorByName = (colorName) => {
    return allColors.value.find(color => 
      color.name.toLowerCase() === colorName.toLowerCase()
    ) || null
  }
  
  /**
   * Find a color by hex code
   * @param {string} hexCode - Hex code to search for
   * @returns {Object|null} Color object or null if not found
   */
  const findColorByHex = (hexCode) => {
    const normalizedHex = hexCode.toLowerCase()
    return allColors.value.find(color => 
      color.hex.toLowerCase() === normalizedHex
    ) || null
  }
  
  /**
   * Get colors filtered by darkness
   * @param {boolean} isDark - Whether to get dark or light colors
   * @returns {Array} Filtered array of colors
   */
  const getColorsByDarkness = (isDark) => {
    return allColors.value.filter(color => color.is_dark === isDark)
  }
  
  /**
   * Get random colors
   * @param {number} count - Number of random colors to get
   * @returns {Array} Array of random colors
   */
  const getRandomColors = (count) => {
    const shuffled = [...allColors.value].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }
  
  /**
   * Convert palette color to standardized color data format
   * @param {Object} paletteColor - Color from palette
   * @returns {Object} Standardized color data
   */
  const convertToColorData = (paletteColor) => {
    return {
      colorName: paletteColor.name,
      hexCode: paletteColor.hex,
      bgColor: paletteColor.hex,
      isDark: paletteColor.is_dark,
      effect: paletteColor.effect || 'matte'
    }
  }
  
  /**
   * Get palette statistics
   * @returns {Object} Statistics about the palette
   */
  const getPaletteStats = () => {
    const totalColors = allColors.value.length
    const darkColors = getColorsByDarkness(true).length
    const lightColors = getColorsByDarkness(false).length
    const categories = getCategoryNames()
    
    return {
      totalColors,
      darkColors,
      lightColors,
      categories: categories.length,
      categoryNames: categories
    }
  }
  
  return {
    palette,
    allColors,
    getColorsByCategory,
    getCategoryNames,
    findColorByName,
    findColorByHex,
    getColorsByDarkness,
    getRandomColors,
    convertToColorData,
    getPaletteStats
  }
}