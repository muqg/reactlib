/**
 * Clamps a numeric value.
 * @param val The value to be clamped.
 * @param min Minimum value.
 * @param max Maximum value.
 */
export function clamp(val: number, min: number, max: number) {
  if (__DEV__) {
    if (min > max) {
      console.error(
        "The `min` argument given for the function `clamp` is greater" +
          "than the given `max` argument",
      )
    }
  }

  if (min > max) {
    ;[max, min] = [min, max]
  }
  return Math.min(Math.max(val, min), max)
}
