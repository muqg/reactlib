export type Point = {
  x: number
  y: number
}

/**
 * Calculates the distance between two points.
 *
 * @param p1 Coordinates for the first point.
 * @param p2 Coordinates for the second point.
 * @see https://www.mathopenref.com/coorddist.html for reference.
 */
export function distance(p1: Point, p2: Point): number {
  const dX = p1.x - p2.x
  const dY = p1.y - p2.y

  // Can also addopt Math.hypot and allow 3D distance calculations.
  return Math.sqrt(dX * dX + dY * dY)
}
