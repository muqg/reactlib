/**
 * Returns the length of a collection object.
 * @param col The collection.
 */
function len(col: object): number {
  return Object.keys(col).length
}

export {len}
