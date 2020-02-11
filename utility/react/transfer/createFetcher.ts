import {Resource, ResourceStatus} from "./Resource"
import {Fetcher, ResourceMutator, ResourceCacheOptions} from "./types"

/**
 * Creates an external cache for an endpoint.
 *
 * Name is intentionally inconsistent with the rest of the package in order to
 * be backwards compatible.
 *
 * @param endpoint A callback to retrieve the resource data.
 */
export function createFetcher<T = any, A extends any[] = any>(
  endpoint: (...args: A) => Promise<T>,
  options: ResourceCacheOptions = {}
): Fetcher<T, A> {
  const storage = new Map<string, Resource<T>>()

  function read(...args: A) {
    const resource = accessResource(...args)
    if (
      resource.status === ResourceStatus.Pending ||
      resource.status === ResourceStatus.Rejected
    ) {
      // This is either the pending Promise or the rejection Error and
      // should therefore be thrown as it instead of a `new Error`.
      throw resource.data
    } else {
      return resource.data
    }
  }

  function preload(...args: A) {
    accessResource(...args)
  }

  function accessResource(...args: A): Resource {
    const key = getCacheKey(...args)
    const resource = storage.get(key)

    if (resource && resource.data !== null) {
      return resource
    }

    const newResource = new Resource()

    hydrate(newResource, ...args)
    storage.set(key, newResource)

    return newResource
  }

  function write(value: T, ...args: A) {
    const key = getCacheKey(...args)
    let resource = storage.get(key)
    if (resource) {
      resource.data = value
    } else {
      resource = new Resource(value, ResourceStatus.Resolved)
      storage.set(key, resource)
    }
  }

  async function mutate(mutator: ResourceMutator<A>, ...args: A) {
    const mutation = mutator(...args)
    if (mutation instanceof Promise) {
      await mutation
    }

    const ownInvalidation = invalidate(...args)
    if (options.invalidates) {
      await Promise.all(options.invalidates.map(cache => cache.invalidate()))
    }
    // Awaiting own invalidation at the end allows for
    // other caches to be invalidated concurrently.
    await ownInvalidation
  }

  async function invalidate(...args: A) {
    const key = getCacheKey(...args)
    const resource = storage.get(key)

    if (!resource) {
      return
    }

    // Pull fresh resource data from the endpoint in order to update
    // subscribed components and keep the UI consitent with the latest data.
    if (resource._subs.size > 0) {
      const hydration = hydrate(resource, ...args)
      if (hydration instanceof Promise) {
        await hydration
      }
    }
    // There are no components expecting to be notified of changes immediately.
    // Therefore resource can be safely evicted from cache, and a fresh piece
    // of data will be pulled from the endpoint whenever it is needed.
    else {
      storage.delete(key)
    }
  }

  /**
   * Fill the resource with fresh data from the endpoint.
   */
  function hydrate(resource: Resource, ...args: A) {
    const request = endpoint(...args)

    resource.status = ResourceStatus.Pending
    resource._data = request

    if (request instanceof Promise) {
      request.then(
        value => {
          if (resource.status === ResourceStatus.Pending) {
            resource.status = ResourceStatus.Resolved
            resource.data = value
          }
        },
        error => {
          if (resource.status === ResourceStatus.Pending) {
            resource.status = ResourceStatus.Rejected
            resource.data = error
          }
        }
      )
    } else {
      resource.status = ResourceStatus.Resolved
    }

    return request
  }

  function clear(...args: A) {
    const key = getCacheKey(...args)
    const resource = storage.get(key)
    resource?.clear()
  }

  function reset() {
    storage.clear()
  }

  function getCacheKey(...args: A) {
    return JSON.stringify(args)
  }

  return {
    _accessResource: accessResource,
    clear,
    mutate,
    preload,
    read,
    invalidate,
    reset,
    write,
  }
}
