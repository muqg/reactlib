export const ALPHA_NUMERIC_PATTERN = /^([0-9]|[a-z])+([0-9a-z]+)$/i

/**
 * Tells whether a string is alpha-numeric.
 * @param input The input string to be tested.
 */
export function isAlphaNumeric(input: string) {
    return ALPHA_NUMERIC_PATTERN.test(input)
}
