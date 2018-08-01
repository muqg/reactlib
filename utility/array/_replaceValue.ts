import { isFunction } from "../assertions";

function _replaceValue<T>(arr: Array<T>, search: ((el: T) => boolean) | T, value: T) {
    const index = isFunction(search) ? arr.findIndex(search) : arr.indexOf(search as T)
    if(index >= 0) {
        arr[index] = value
        return true
    }

    return false
}

export { _replaceValue };
