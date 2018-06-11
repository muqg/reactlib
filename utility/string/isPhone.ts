/**
 * Regular expression pattern to match a valid phone number.
 *
 * Matches: +?(359)?(123 456-78 90)...
 * - Allows initial optional + symbol.
 * - Allows an optional group of digits/spaces surrounded by brackets like so (359).
 * - Matches any number of digits/spaces/dashes afterwards.
 */
export const PHONE_PATTERN = /^\+?([\(](\d|\s)+[\)])?(\d|\s|[-])+$/

/**
 * Tells whether an input string is a valid phone number.
 * @param input The input string to be tested.
 */
export function isPhone(input: string) {
    return PHONE_PATTERN.test(input)
}
