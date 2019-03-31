/**
 * Tells whether a number is in between (in range) of two other.
 * @param val The number to be checked.
 * @param min First number range.
 * @param max Second number range.
 */
export function isBetween(val: number, min: number, max: number) {
    if (__DEV__) {
        if (min > max) {
            console.error(
                "The `min` argument given for the function `isBetween` is greater" +
                    "than the given `max` argument"
            )
        }
    }

    if (min > max) {
        ;[max, min] = [min, max]
    }
    return val > min && val < max
}
