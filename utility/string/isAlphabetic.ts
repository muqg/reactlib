export const ALPHABETIC_PATTERN = /^([a-zа-я\s])+$/i

/**
 * Tells whether a string is alphabetic (spaces allowed).
 *
 * - Works will standard latin and cyrillic letters.
 * @param input The input string to be tested.
 */
export function isAlphabetic(input: string) {
  return ALPHABETIC_PATTERN.test(input)
}
