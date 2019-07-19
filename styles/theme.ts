import {
  COLOR_ACCENT,
  COLOR_BACKGROUND,
  COLOR_CONTRAST,
  COLOR_DARK,
  COLOR_ERROR,
  COLOR_SUCCESS,
  COLOR_TEXT,
  COLOR_WARNING,
} from "./colours"

export const defaultColorTheme = {
  /**
   * An accent color that should stand both
   * over the background and the main color.
   */
  accent: COLOR_ACCENT,
  /**
   * Background color.
   */
  background: COLOR_BACKGROUND,
  /**
   * A contrast color that stands out
   * over the main color.
   */
  contrast: COLOR_CONTRAST,
  /**
   * Error color.
   */
  error: COLOR_ERROR,
  /**
   * Main color.
   */
  main: COLOR_DARK,
  /**
   * Success color.
   */
  success: COLOR_SUCCESS,
  /**
   * Primary text color that should
   * stand out over the background.
   */
  text: COLOR_TEXT,
  /**
   * Warning color.
   */
  warning: COLOR_WARNING,
}

export type ColorTheme = typeof defaultColorTheme
export type ThemeInterface = ColorTheme

/**
 * Creates a complete color theme based on the provided colors.
 *
 * @param colorTheme The colors to replace.
 */
export function createColorTheme(colorTheme: Partial<ColorTheme>): ColorTheme {
  return {...defaultColorTheme, ...colorTheme}
}
