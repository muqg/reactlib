/**
 * Builds a URL query string from a query object.
 */
export function buildUrlQuery(params: object): string {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(v => encodePair(`${key}[]`, v)).join("&")
      }

      return encodePair(key, value)
    })
    .join("&")
}

function encodePair(key: any, value: any) {
  return encodeURIComponent(key) + "=" + encodeURIComponent(value)
}
