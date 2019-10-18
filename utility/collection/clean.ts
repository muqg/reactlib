/**
 * Removes undefined values from a collection object.
 * @param col The collection to clean.
 */
export function clean<T extends object>(col: object): T {
  const res: any = {}

  Object.entries(col).forEach(([key, value]) => {
    if (value !== undefined) {
      res[key] = value
    }
  })

  return res
}
