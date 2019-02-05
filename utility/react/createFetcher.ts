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

/**
 * Creates a fetcher object that works in conjunction with React.Suspense.
 * It is meant to be used prior to the release of react-cache and should be
 * used with caution since it may wildly differ from the expected future
 * react version and behavior.
 *
 * @param fetch The fetch request.
 * @param cache Whether to cache the request or not.
 * - Enabled by default.
 */
function createFetcher<T = any, A extends any[] = any>(
    // @ts-ignore TS2370: A rest parameter must be of an array type.
    fetch: (...args: A) => Promise<T>, cache = true
): Fetcher<T, A> {
    let cacheStorage: Dict<T> = {}
    let errorStorage: Dict<any> = {}
    let request: Promise<T> | null = null

    // @ts-ignore TS2370: A rest parameter must be of an array type.
    function getCacheKey(...args: A) {
        return JSON.stringify(args)
    }

    function removeCacheEntry(key: string) {
        delete cacheStorage[key]
        delete errorStorage[key]
    }

    // @ts-ignore TS2370: A rest parameter must be of an array type.
    function read(...args: A) {
        const key = getCacheKey(...args)

        if(!cacheStorage[key] && !errorStorage[key]) {
            // Should prevent double requests
            if(!request) {
                request = fetch(...args)
            }

            (async () => {
                try {
                    cacheStorage[key] = await request
                }
                catch(ex) {
                    errorStorage[key] = ex
                }
                finally {
                    request = null
                }
            })()

            throw request
        }

        if(errorStorage[key]) {
            // Allow error to be caught by an ErrorBoundary.
            throw errorStorage[key]
        }
        else {
            if(!cache) {
                // Will clear cache after initially retunring the entry.
                setTimeout(() => removeCacheEntry(key))
            }
            return cacheStorage[key]
        }
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

