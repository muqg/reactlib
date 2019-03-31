import {_replaceValue} from "./_replaceValue"

/**
 * Replaces an array entry that is equal to the provided search element with the
 * provided value.
 *
 * @param arr The subject array.
 * @param value Replacement value.
 * @param search Element to look for.
 */
function replace<T>(arr: Array<T>, search: T, value: T): Array<T>
/**
 * Replaces an array entry that meets a search condition with the provided value.
 *
 * @param arr The subject array.
 * @param value Replacement value.
 * @param search Condition to replace on.
 */
function replace<T>(
    arr: Array<T>,
    search: (el: T) => boolean,
    value: T
): Array<T>

function replace<T>(
    arr: Array<T>,
    search: ((el: T) => boolean) | T,
    value: T
): Array<T> {
    arr = [...arr]

    _replaceValue(arr, search, value)

    return arr
}

export {replace}
