import {useState} from "react"

type LoadedItems<T> = Promise<T[] | null> | T[] | null

type ProgressiveLoaderParams<T> = {
  /**
   * Initially loaded items.
   *
   * @default []
   */
  initial?: T[]
  /**
   * A callback to load more items. Return `null` to indicate that there are no
   * more items to be loaded and thus disable further loading.
   */
  load: () => LoadedItems<T>
}

export type ProgressiveLoader<T> = {
  /**
   * A list of all loaded items.
   */
  items: T[]
  /**
   * Whether the loader has finished loading all available items.
   */
  finished: boolean
  /**
   * Set the finished state.
   */
  setFinished: (finished: boolean) => void
  /**
   * Loads more items.
   */
  load: () => LoadedItems<T>
}

/**
 * Provides progressive loading functionality for long finite lists, infinite
 * scrollers, and so on...
 */
export function useProgressiveLoader<T>({
  initial = [],
  load,
}: ProgressiveLoaderParams<T>): ProgressiveLoader<T> {
  const [items, setItems] = useState(initial)
  const [finished, setFinished] = useState(false)

  async function loadMore() {
    if (finished) {
      return null
    }

    const result = load()
    const loaded = result instanceof Promise ? await result : result

    if (loaded === null) {
      setFinished(true)
    } else {
      setItems(current => [...current, ...loaded])
    }

    return loaded
  }

  return {
    items,
    finished,
    setFinished,

    load: loadMore,
  }
}
