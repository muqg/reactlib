import { _replaceValue } from "./_replaceValue";

/**
 * Replaces all occurences of an element with the provided value.
 *
 * @param arr The subject array.
 * @param value Replacement value.
 * @param search Element to look for.
 */
function replaceAll<T>(arr: Array<T>, search: T, value: T): Array<T>
/**
 * Replaces all entries in an array that meet a search condition with the
 * provided value.
 *
 * @param arr The subject array.
 * @param value Replacement value.
 * @param search Condition to replace on.
 */
function replaceAll<T>(arr: Array<T>, search: (el: T) => boolean, value: T): Array<T>

function replaceAll<T>(arr: Array<T>, search: ((el: T) => boolean) | T, value: T): Array<T> {
    arr = [...arr]

    while(_replaceValue(arr, search, value)) {
        /*
         * _replaceValue handles it all. Loop is just to
         * make it replace until it finds no match.
         */
    }

    return arr
}

export { replaceAll };
