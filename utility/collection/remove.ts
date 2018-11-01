import { Collection, Dict } from "..";

/**
 * Removes an entry from a collection.
 * @param col The collection to remove item from.
 * @param key The key to the removed item
 */
function remove(col: Collection, key: string | number) {
    const collection = col as Dict<any>
    const {[key]: item, ...rest} = collection

    return rest
}

export { remove };

