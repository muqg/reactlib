import { Dict } from "..";

export interface Fetcher<T, A extends any[] = any> {
    /**
     * Invalidates the cached result of a fetch request.
     */
    // @ts-ignore TS2370: A rest parameter must be of an array type.
    clear: (...args: A) => void
    /**
     * Reads the fetched request result.
     */
    // @ts-ignore TS2370: A rest parameter must be of an array type.
    read: (...args: A) => T
    /**
     * Overwrites a cache entry
     */
    // @ts-ignore TS2370: A rest parameter must be of an array type.
    write: (item: T, ...args: A) => void
}

function createFetcher<T = any, A extends any[] = any>(
    // @ts-ignore TS2370: A rest parameter must be of an array type.
    fetch: (...args: A) => Promise<T>, cache = true
): Fetcher<T, A> {
    let cacheStorage: Dict<T> = {}
    let request: Promise<T> | null = null

    // @ts-ignore TS2370: A rest parameter must be of an array type.
    function getCacheKey(...args: A) {
        return JSON.stringify(args)
    }

    function removeCacheEntry(key: string) {
        delete cacheStorage[key]
    }

    // @ts-ignore TS2370: A rest parameter must be of an array type.
    function read(...args: A) {
        const key = getCacheKey(...args)
        const cacheItem = cacheStorage[key]

        if(!cacheItem) {
            if(!request) {
                request = fetch(...args)
            }

            (async () => {
                try {
                    cacheStorage[key] = await request
                }
                finally {
                    request = null
                }
            })()

            throw request
        }

        const result = cacheItem
        if(!cache) {
            removeCacheEntry(key)
        }

        return result
    }

    // @ts-ignore TS2370: A rest parameter must be of an array type.
    function clear(...args: A) {
        const key = getCacheKey(...args)
        removeCacheEntry(key)
    }

    // @ts-ignore TS2370: A rest parameter must be of an array type.
    function write(item: T, ...args: A) {
        const key = getCacheKey(...args)
        cacheStorage[key] = item
    }

    return {
        clear,
        read,
        write
    }
}

export { createFetcher };

