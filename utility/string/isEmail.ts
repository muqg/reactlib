/**
 * Regular expression pattern to match a valid email address.
 */
export const EMAIL_PATTERN =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i

/**
 * Tests whether an input string is a valid email address.
 * @param input The input string to be tested.
 */
export function isEmail(input: string) {
    return EMAIL_PATTERN.test(input)
}
