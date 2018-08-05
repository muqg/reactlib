/**
 * Removes all array entries that match a search condition.
 * @param arr The subject array.
 * @param search The search condition to be met.
 */
function removeAll<T>(arr: Array<T>, search: (el: T) => boolean): Array<T> {
    arr = [...arr]
    while(true) {
        const index = arr.findIndex(search)
        if(index >= 0)
            arr.splice(index, 1)
        else
            break
    }

    return arr
}

export { removeAll }
