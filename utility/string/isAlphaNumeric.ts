export const ALPHA_NUMERIC_PATTERN = /^([0-9]|[a-zа-я])+([0-9a-zа-я]+)$/i

/**
 * Tells whether a string is alpha-numeric.
 *
 * - Works will standard latin and cyrillic letters.
 * @param input The input string to be tested.
 */
export function isAlphaNumeric(input: string) {
  return ALPHA_NUMERIC_PATTERN.test(input)
}
