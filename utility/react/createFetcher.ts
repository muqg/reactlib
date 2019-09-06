// @ts-ignore Missing experimental requestIdleCallback global definition
let {requestIdleCallback}: (cb: () => void) => void = window
if (typeof requestIdleCallback !== "function") {
  requestIdleCallback = setTimeout
}

export type Fetcher<T, A extends any[] = any> = {
  /**
   * Clears the resource from cache.
   */
  clear: (...input: A) => void
  /**
   * Attempts to prefetch the resource in idle time
   * and prepares it for later use.
   */
  prefetch: (...input: A) => void
  /**
   * Attempts to preload the resource by requesting it immediately. This can be
   * used in order to prepare the resource for use as soon as possible and
   * attempt to load it in parallel with the rest of the code.
   */
  preload: (...input: A) => void
  /**
   * Reads the resource from cache or through the given fetch callback.
   */
  read: (...input: A) => T
  /**
   * Resets the fetcher object to its initial state after creation. This is
   * especially useful in testing when it is desired to clear the internal cache.
   */
  reset: () => void
  /**
   * Writes a value to cache, overwriting the existing entry's value. It will
   * create a new entry, if there is none for this key at the time of writing.
   */
  write: (value: T, ...input: A) => void
}

type Resource<T = any> = {
  status: Status
  value: T | Promise<T>
}

type Status = 0 | 1 | 2

const Rejected: Status = 0
const Pending: Status = 1
const Resolved: Status = 2

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
  fetch: (...input: A) => Promise<T>,
): Fetcher<T, A> {
  const storage = new Map<string, Resource>()

  function read(...input: A) {
    const resource = accessResource(...input)
    if (resource.status === Pending || resource.status === Rejected) {
      // This is either the pending Promise or the rejection Error and
      // should therefore be thrown as it instead of a `new Error`.
      throw resource.value
    } else {
      return resource.value
    }
  }

  function prefetch(...input: A) {
    requestIdleCallback(() => accessResource(...input))
  }

  function preload(...input: A) {
    accessResource(...input)
  }

  function accessResource(...input: A): Resource {
    const key = getCacheKey(...input)
    const resource = storage.get(key)
    if (resource) {
      return resource
    }

    const request = fetch(...input)
    const newResource: Resource = {
      status: Pending,
      value: request,
    }
    storage.set(key, newResource)

    if (request instanceof Promise) {
      request.then(
        value => {
          if (newResource.status === Pending) {
            newResource.status = Resolved
            newResource.value = value
          }
        },
        error => {
          if (newResource.status === Pending) {
            newResource.status = Rejected
            newResource.value = error
          }
        },
      )
    } else {
      newResource.status = Resolved
    }

    return newResource
  }

  function write(value: T, ...input: A) {
    const key = getCacheKey(...input)
    let resource = storage.get(key)
    if (resource) {
      resource.value = value
    } else {
      resource = {
        value,
        status: Resolved,
      }
      storage.set(key, resource)
    }
  }

  function clear(...input: A) {
    const key = getCacheKey(...input)
    storage.delete(key)
  }

  function reset() {
    storage.clear()
  }

  function getCacheKey(...input: A) {
    return JSON.stringify(input)
  }

  return {
    clear,
    prefetch,
    preload,
    read,
    reset,
    write,
  }
}
