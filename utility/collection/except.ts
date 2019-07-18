/**
 * Creates a new collection which does not contain the given keys.
 * @param col The subject collection.
 * @param keys Keys for the entries to not include in the new collection.
 */
function except<T extends object, K extends keyof T>(
  col: T,
  ...keys: K[]
): Omit<T, K> {
  const collection = col as any
  const res = {} as any

  for (let key in collection) {
    if (keys.indexOf(key as K) === -1) res[key] = collection[key]
  }

  return res
}

export {except}
