/**
 * Moves an array element to a new index position.
 *
 * @throws RangeError if any of the indices is not within the array bounds.
 */
export function move<T = any>(
  array: Array<T>,
  fromIndex: number,
  toIndex: number,
): Array<T> {
  if (
    toIndex >= array.length ||
    toIndex < 0 ||
    fromIndex >= array.length ||
    fromIndex < 0
  ) {
    throw new RangeError("Index out of bounds")
  }

  array = [...array]
  array.splice(toIndex, 0, array.splice(fromIndex, 1)[0])

  return array
}
