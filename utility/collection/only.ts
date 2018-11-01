import { Collection } from "..";


/**
 * Creates a new collection which contains only the entries at the given keys.
 * @param col The subject collection.
 * @param keys Keys for the entries to include in the new collection.
 */
function only<R extends object, C extends Collection, K extends keyof C>(col: C, ...keys: K[]): R {
    const collection = col as any
    const res = {} as any

    for(let key of keys)
        res[key] = collection[key]

    return res
}

export { only };

