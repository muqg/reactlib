import {Dict} from ".."

const requestIdleCallback: ((cb: () => void) => void) | undefined =
    // @ts-ignore Ignore undefined function on window object
    window.requestIdleCallback

export interface Fetcher<T, A extends any[] = any> {
    /**
     * Clears the resource from cache.
     */
    clear: (...input: A) => void
    /**
     * Prefetches the resource in idle time
     * and prepares it for later use.
     */
    prefetch: (...input: A) => void
    /**
     * Preloads the resource in parallel in order to
     * prepare it for use as soon as possible.
     */
    preload: (...input: A) => void
    /**
     * Reads the resource from cache or through the given fetch callback.
     */
    read: (...input: A) => T
    /**
     * Writes a value to cache, overwriting the existing entry.
     */
    write: (value: T, ...input: A) => void
}

const enum Status {
    Error,
    Pending,
    Resolved,
}

interface Resource<T = any> {
    status: Status
    value: T | Promise<T> | number
}

/**
 * Creates a fetcher object that works in conjunction with React.Suspense.
 * It is meant to be used prior to the release of react-cache and should be
 * used with caution since it may wildly differ from the expected future
 * react version and behavior.
 *
 * @param fetch A valid fetcher callback.
 * @param cache Whether to cache the request or not.
 * - Enabled by default.
 */
export function createFetcher<T = any, A extends any[] = any>(
    fetch: (...input: A) => Promise<T>
): Fetcher<T, A> {
    let storage: Dict<Resource | undefined> = {}

    function read(...input: A) {
        const resource = accessResource(...input)
        if (
            resource.status === Status.Pending ||
            resource.status === Status.Error
        ) {
            throw resource.value
        } else {
            return resource.value
        }
    }

    function prefetch(...input: A) {
        if (requestIdleCallback) {
            requestIdleCallback(() => accessResource(...input))
        } else {
            setTimeout(() => accessResource(...input))
        }
    }

    function preload(...input: A) {
        accessResource(...input)
    }

    function accessResource(...input: A): Resource {
        const key = getCacheKey(...input)
        const resource = storage[key]
        if (resource) {
            return resource
        } else {
            const request = fetch(...input)
            const newResource: Resource = {
                status: Status.Pending,
                value: request,
            }
            storage[key] = newResource

            request.then(
                value => {
                    if (newResource.status === Status.Pending) {
                        newResource.status = Status.Resolved
                        newResource.value = value
                    }
                },
                error => {
                    if (newResource.status === Status.Pending) {
                        newResource.status = Status.Error
                        newResource.value = error
                    }
                }
            )

            return newResource
        }
    }

    function write(value: T, ...input: A) {
        const key = getCacheKey(...input)
        let resource = storage[key]
        if (resource) {
            resource.value = value
        } else {
            resource = {
                status: Status.Resolved,
                value: value,
            }
        }
    }

    function clear(...input: A) {
        const key = getCacheKey(...input)
        delete storage[key]
    }

    function getCacheKey(...input: A) {
        return JSON.stringify(input)
    }

    return {
        clear,
        prefetch,
        preload,
        read,
        write,
    }
}
