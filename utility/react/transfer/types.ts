import {Resource} from "./Resource"

export type Fetcher<T, A extends any[] = any> = {
  _accessResource: (...args: A) => Resource<T>
  /**
   * Clears the resource from cache and notifies subscribers.
   */
  clear: (...args: A) => void
  /**
   * Clears resource from cache if there are no active subscribers, otherwise
   * pulls fresh resource data from the endpoint and notifies all subscribers.
   *
   * @param args Arguments to be passed to the endpoint.
   */
  invalidate: (...args: A) => Promise<void>
  /**
   * Perform a resource mutation.
   *
   * @param mutator A callback to perform the mutation.
   * @param args Arguments that would otherwise be given to the cache endpoint
   * in order to fetch the resource.
   */
  mutate: (mutator: ResourceMutator<A>, ...args: A) => Promise<void>
  /**
   * Start fetching resource data immediately in order to prepare it for usage
   * in parallel, while rendering or performing other tasks.
   *
   * @param args Arguments to be passed to the endpoint.
   */
  preload: (...args: A) => void
  /**
   * Read the resource from cache or the given endpoint.
   *
   * @param args Arguments to be passed to the endpoint.
   */
  read: (...args: A) => T
  /**
   * Resets the fetcher object to its initial state after creation. This is
   * especially useful in testing when it is desired to clear the internal cache.
   */
  reset: () => void
  /**
   * Writes a value to cache, overwriting the existing resource's data and
   * notifying subscribers. It will create a new resource, if one does not
   * exist for this key at the time of writing.
   *
   * @param value The value to write to cache.
   * @param args Arguments that would otherwise be given to the cache endpoint
   * in order to fetch the resource.
   */
  write: (value: T, ...args: A) => void
}

export type ResourceCacheOptions = {
  /**
   * Other caches to be invalidated.
   */
  invalidates?: Fetcher<any, any>[]
}

export type ResourceChangeSubscriber<T = any> = (value: T | null) => any
export type ResourceMutator<A extends any[] = any> = (...args: A) => any
