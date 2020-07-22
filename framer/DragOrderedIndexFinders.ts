import {Point2D} from "framer-motion"
import {distance} from "../utility/math"
import {Position} from "./DragOrdered"

export type DragOrderedIndexFinder = (
  dragIndex: number,
  dragOffset: Point2D,
  positions: Position[]
) => number

// Prevents rapid reverse swapping.
const DistanceBuffer = 5

// TODO: Consider improving the perceived performance for lists for this
// finder or at least use it for DragOrderedList with Reeact Concurrent
// mode to confirm if the perceived and actual performance is better than
// the finder for the grid. In React Normal mode the perceived performance
// for DragOrderedGirdIndexFinder is a lot bettter (v16.8.x | 19.7.2019).
export const DragOrderedListIndexFinder: DragOrderedIndexFinder = (
  dragIndex,
  dragOffset,
  positions
) => {
  let targetIndex = dragIndex
  const offsetY = dragOffset.y
  const {top, height} = positions[dragIndex]
  const bottom = top + height

  // If moving down.
  if (offsetY > 0) {
    const nextItem = positions[dragIndex + 1]
    if (nextItem === undefined) {
      return dragIndex
    }

    const dragPoint = {x: 0, y: bottom}
    const targetPoint = {x: 0, y: nextItem.top + nextItem.height / 2}
    const swapOffset = distance(dragPoint, targetPoint) + DistanceBuffer
    if (offsetY > swapOffset) {
      targetIndex = dragIndex + 1
    }

    // If moving up.
  } else if (offsetY < 0) {
    const prevItem = positions[dragIndex - 1]
    if (prevItem === undefined) {
      return dragIndex
    }

    const prevBottom = prevItem.top + prevItem.height
    const dragPoint = {x: 0, y: top}
    const targetPoint = {x: 0, y: prevBottom - prevItem.height / 2}
    const swapOffset = distance(dragPoint, targetPoint) + DistanceBuffer
    if (offsetY < -swapOffset) {
      targetIndex = dragIndex - 1
    }
  }

  return targetIndex
}

function calculateCenterPoint({height, left, top, width}: Position) {
  return {
    x: left + width / 2,
    y: top + height / 2,
  }
}

export const DragOrderedGridIndexFinder: DragOrderedIndexFinder = (
  dragIndex,
  dragOffset,
  positions
) => {
  const originalCenter = calculateCenterPoint(positions[dragIndex])
  const dragCenter: Point2D = {
    x: originalCenter.x + dragOffset.x,
    y: originalCenter.y + dragOffset.y,
  }

  const closest: {index: number; distance: number} = {
    index: dragIndex,
    distance: distance(originalCenter, dragCenter),
  }

  const forward = dragIndex < positions.length / 2
  for (let i = 0; i < positions.length; i += 1) {
    // This line here and the forward boolean above are a simple way to reverse
    // the for-loop and cut the maximum amount of work in half or even less.
    const currentIndex = forward ? i : positions.length - 1 - i
    const targetCenter = calculateCenterPoint(positions[currentIndex])
    const distanceToTarget = distance(dragCenter, targetCenter)

    if (distanceToTarget <= closest.distance) {
      closest.distance = distanceToTarget
      closest.index = currentIndex

      // Break if the dragged element's center point is within the contained
      // circle of an element's box, meaning that the dragged element is
      // considered to be above this element and continuing to measure dstances
      // to other elements is unnecessary.
      const {height, width} = positions[currentIndex]
      const containedCircleRadius = Math.min(height, width)
      if (distanceToTarget - containedCircleRadius <= DistanceBuffer) {
        break
      }
    }
  }

  return closest.index
}
