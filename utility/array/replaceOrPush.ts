import { _replaceValue } from "./_replaceValue";

/**
 * Attempts to replace an array entry that meets a search condition with the
 * provided value. If a replacement does not take place then the value is pushed
 * to the end of the array instead.
 * @param arr The subject array.
 * @param search The search condition to be met.
 * @param value The replacement/pushed value.
 */

function replaceOrPush<T>(arr: Array<T>, search: (el: T) => boolean, value: T): Array<T> {
    arr = [...arr]

    if(!_replaceValue(arr, search, value))
        arr.push(value)

    return arr
}


export { replaceOrPush };
