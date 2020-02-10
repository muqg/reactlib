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

    const request = endpoint(...args)
    const newResource = new Resource(request, ResourceStatus.Pending)
    storage.set(key, newResource)

    if (request instanceof Promise) {
      request.then(
        value => {
          if (newResource.status === ResourceStatus.Pending) {
            newResource.status = ResourceStatus.Resolved
            newResource.data = value
          }
        },
        error => {
          if (newResource.status === ResourceStatus.Pending) {
            newResource.status = ResourceStatus.Rejected
            newResource.data = error
          }
        }
      )
    } else {
      newResource.status = ResourceStatus.Resolved
    }

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

  function clear(...args: A) {
    const key = getCacheKey(...args)
    const resource = storage.get(key)
    resource?.clear()
  }

  async function mutate(mutator: ResourceMutator<A>, ...args: A) {
    const mutation = mutator(...args)
    if (mutation instanceof Promise) {
      await mutation
    }

    await refresh(...args)
    if (options.refreshes) {
      await Promise.all(options.refreshes.map(cache => cache.refresh()))
    }
  }

  async function refresh(...args: A) {
    const resource = accessResource(...args)

    // If the resource is Pending, then accessing will be enough to fetch it
    // from the endpoint, and is unnecessary to fetch a second time.
    if (resource.status !== ResourceStatus.Pending) {
      const result = endpoint(...args)
      resource.data = result instanceof Promise ? await result : result
    }
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
    refresh,
    reset,
    write,
  }
}
