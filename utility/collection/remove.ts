import { Collection } from "..";

/**
 * Removes an entry from a collection.
 * @param col The collection to remove item from.
 * @param key The key to the removed item
 */
function remove<T extends object>(col: Collection, key: string | number): T {
    const collection = col as any
    const {[key]: item, ...rest} = collection

    return rest
}

export { remove };

