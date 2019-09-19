type RoundingMethod = typeof Math.floor | typeof Math.round | typeof Math.ceil

function roundWithPrecision(
  x: number,
  precision: number,
  method: RoundingMethod,
) {
  const coef = Math.pow(10, Math.max(precision, 0))

  return method(x * coef) / coef
}

/**
 * Rounds a number with precision.
 *
 * @param x The number to round.
 * @param precision Number of digits to round to.
 */
export function round(x: number, precision: number) {
  return roundWithPrecision(x, precision, Math.round)
}

/**
 * Rounds up a number with precision.
 *
 * @param x The number to round.
 * @param precision Number of digits to round to.
 */
export function ceil(x: number, precision: number) {
  return roundWithPrecision(x, precision, Math.ceil)
}

/**
 * Rounds down a number with precision.
 *
 * @param x The number to round.
 * @param precision Number of digits to round to.
 */
export function floor(x: number, precision: number) {
  return roundWithPrecision(x, precision, Math.floor)
}
