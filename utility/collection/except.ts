import { Collection } from "..";
import { Omit } from "../type";

/**
 * Creates a new collection which contains only the entries at the given keys.
 * @param col The subject collection.
 * @param keys Keys for the entries to include in the new collection.
 */
function except<T extends Collection, K extends keyof T>(col: T, ...keys: K[]): Omit<T, K> {
    const collection = col as any
    const res = {} as any

    for(let key in collection) {
        if(keys.indexOf(key as K) === -1)
            res[key] = collection[key]
    }

    return res
}

export { except };

