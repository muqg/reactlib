/**
 * Creates a valid search query string from object of parameters. Prefer using
 * `buildUrlQuery()` instead of this function. Use this function only when you
 * want to parse back the query string to an object since the counterpart of
 * this function is `parseQuery()` while `buildUrlQuery()` does not currently
 * have such.
 *
 * @param params Object with parameters.
 */
export function createQuery(params: object): string {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        encodeURIComponent(key) + "=" + encodeURIComponent(value),
    )
    .join("&")
}
