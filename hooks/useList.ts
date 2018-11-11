import { useState } from "react";
import { replaceOrPush } from "../utility/array";

interface List<T> {
    /**
     * Removes current list items and fills it with the provided ones.
     * Typically used for initialization.
     */
    fill: (items: T[]) => void
    /**
     * Removes items from the list, based on the optional custom filter or
     * the factory one otherwise.
     */
    filter: (filter: RemoveFilter<T>) => void
    /**
     * Adds or replaces an item in the list if it already exists, based on
     * the optional custom filter or the factory one otherwise.
     */
    insert: (item: T, filter: InsertFilter<T>) => void
    /**
     * The list items.
     */
    items: Readonly<T>[],
    /**
     * Pushes an item to the end of the list.
     */
    push: (item: T) => void
}

type InsertFilter<T> = (listItem: T, item: T) => boolean
type RemoveFilter<T> = (listItem: T) => boolean

function useList<T extends any = any>(initial: T[]): List<T> {
    const [items, fill] = useState(initial)

    return {
        items,
        fill,
        filter: (fn: RemoveFilter<T>) => fill(items.filter(fn)),
        insert: (item: T, fn: InsertFilter<T>) => fill(replaceOrPush(items, i => fn(i, item), item)),
        push: (item: T) => fill([...items, item]),
    }
}


export { useList };

