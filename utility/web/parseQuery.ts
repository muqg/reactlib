/**
 * Parses a valid query string into object of parameters. Meant to be used as
 * a counterpart to `createQuery()`.
 *
 * @param query The query string to be parsed.
 */
export function parseQuery(query: string): object {
  query = query.replace("?", "")

  if (!query) return {}

  // Replace '&' and '=' with "," and ":" respectively.
  const replacedQuery = query.replace(/&/g, '","').replace(/=/g, '":"')
  return JSON.parse('{"' + replacedQuery + '"}', (key, value) =>
    key === "" ? value : decodeURIComponent(value),
  )
}
