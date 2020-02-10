import {useEffect} from "react"
import {useForceUpdate} from "../../../hooks"
import {Fetcher} from "./types"

/**
 * Returns a resource's data, and subscribes this components for updates
 * whenever the resource is modified.
 *
 * @param cache The cache to mutate the resource on.
 * @param args Arguments that would otherwise be given to the cache endpoint in
 * order to fetch the resource.
 */
export function useResource<T, A extends any[], U extends A>(
  cache: Fetcher<T, A>,
  args: U
): T {
  const forceUpdate = useForceUpdate()
  const resource = cache._accessResource(...args)

  useEffect(() => {
    resource.subscribe(forceUpdate)
    return () => resource.unsubscribe(forceUpdate)
  }, [cache, resource, forceUpdate])

  return cache.read(...args)
}
