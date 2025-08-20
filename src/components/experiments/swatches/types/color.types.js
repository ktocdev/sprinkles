/**
 * Color data structure used throughout the swatches system
 * @typedef {Object} ColorData
 * @property {string} colorName - Human readable color name
 * @property {string} hexCode - Hex color code (e.g., "#FF0000")
 * @property {string} bgColor - Background color (usually same as hexCode)
 * @property {boolean} isDark - Whether the color is considered dark
 */

/**
 * Color from the palette data
 * @typedef {Object} PaletteColor
 * @property {string} id - Unique identifier
 * @property {string} name - Color name
 * @property {string} hex - Hex color code
 * @property {boolean} is_dark - Whether the color is dark
 */

/**
 * Palette category containing colors
 * @typedef {Object} PaletteCategory
 * @property {PaletteColor[]} colors - Array of colors in this category
 */

/**
 * Complete palette structure
 * @typedef {Object} Palette
 * @property {string} name - Palette name
 * @property {Object.<string, PaletteColor[]>} categories - Categories of colors
 */

/**
 * Drag data structure for drag and drop operations
 * @typedef {Object} DragData
 * @property {string} colorName - Name of the color being dragged
 * @property {string} hexCode - Hex code of the color
 * @property {string} bgColor - Background color
 * @property {boolean} isDark - Whether the color is dark
 * @property {boolean} [isFromGrid] - Whether the drag originated from grid (for touch events)
 */

export default {}