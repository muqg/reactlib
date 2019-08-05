import {motion, Point, useMotionValue} from "framer-motion"
import * as React from "react"
import {useEffect, useRef, useState} from "react"
import styled from "styled-components"
import {
  DragOrderedGridIndexFinder,
  DragOrderedIndexFinder,
} from "./DragOrderedIndexFinders"

export type Position = {
  height: number
  left: number
  top: number
  width: number
}

export type DragOrderedChangeHandler = (
  currentIndex: number,
  targetIndex: number,
) => void

type PositionUpdateFunction = (index: number, element: HTMLElement) => void
type MoveItem = (currentIndex: number, offsetX: number, offsetY: number) => void

type MotionElementProps = {
  children: JSX.Element
  continuous?: ContainerProps["continuous"]
  index: number
  moveItem: MoveItem
  setPosition: PositionUpdateFunction
  style?: React.CSSProperties
}

type MotionListProps = {
  children: JSX.Element[]
  continuous?: ContainerProps["continuous"]
  elementStyle?: React.CSSProperties
  finder: DragOrderedIndexFinder
  onChange?: DragOrderedChangeHandler
}

type ContainerProps = {
  children: MotionListProps["children"]
  className?: string
  /**
   * Whether children will continously update and swap places while dragging
   * or only once the dragging ends.
   */
  continuous?: boolean
  /**
   * Styling for each underlying motion element wrapper.
   */
  elementStyle?: React.CSSProperties
  onChange?: DragOrderedChangeHandler
  style?: Omit<React.CSSProperties, "display" | "flexDirection" | "flexWrap">
}

const dragConstraints = {top: 0, bottom: 0, left: 0, right: 0}

function MotionElement({
  children,
  continuous,
  index,
  moveItem,
  setPosition,
  style,
}: MotionElementProps) {
  const [isDragging, setDragging] = useState(false)
  const element = useRef<HTMLLIElement>(null)
  const offset = useRef<Point>({x: 0, y: 0})
  const dragOriginX = useMotionValue(0)
  const dragOriginY = useMotionValue(0)

  useEffect(() => {
    if (element.current) {
      setPosition(index, element.current)
    }
  })

  return (
    <motion.li
      drag
      dragConstraints={dragConstraints}
      dragElastic={1}
      dragOriginX={dragOriginX}
      dragOriginY={dragOriginY}
      onDrag={(_e, {point}) => {
        if (continuous) {
          moveItem(index, point.x, point.y)
        } else {
          offset.current = point
        }
      }}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => {
        setDragging(false)
        if (!continuous) {
          moveItem(index, offset.current.x, offset.current.y)
        }
      }}
      positionTransition={({delta}) => {
        if (isDragging) {
          // If we're dragging, we want to "undo" the items movement within the list
          // by manipulating its dragOriginY. This will keep the item under the cursor,
          // even though it's jumping around the DOM.
          dragOriginY.set(dragOriginY.get() + delta.y)
          dragOriginX.set(dragOriginX.get() + delta.x)
        }

        // If `positionTransition` is a function and returns `false`, it's telling
        // Motion not to animate from its old position into its new one. If we're
        // dragging, we don't want any animation to occur.
        return !isDragging
      }}
      ref={element}
      style={{cursor: "grab", overflow: "hidden", ...style}}
      whileTap={{scale: 1.12, zIndex: 100}}
    >
      {children}
    </motion.li>
  )
}

function MotionElementList({
  children,
  elementStyle,
  finder,
  onChange,
  ...elementProps
}: MotionListProps) {
  const positions: Position[] = useRef([]).current

  const setPosition: PositionUpdateFunction = (index, element) => {
    positions[index] = {
      height: element.offsetHeight,
      left: element.offsetLeft,
      top: element.offsetTop,
      width: element.offsetWidth,
    }
  }

  const moveItem: MoveItem = (currentIndex, offsetX, offsetY) => {
    if (!onChange) {
      return
    }

    const targetIndex = finder(
      currentIndex,
      {x: offsetX, y: offsetY},
      positions,
    )
    if (targetIndex !== currentIndex) {
      onChange(currentIndex, targetIndex)
    }
  }

  return (
    <>
      {children.map((child, i) => (
        <MotionElement
          {...elementProps}
          index={i}
          key={child.key || undefined}
          moveItem={moveItem}
          setPosition={setPosition}
          style={elementStyle}
        >
          {child}
        </MotionElement>
      ))}
    </>
  )
}

const List = styled.ol`
  align-items: flex-start;
  display: flex !important;
  flex-direction: column !important;
  list-style: none;
`

export function DragOrderedList({
  className,
  style,
  ...listProps
}: ContainerProps) {
  return (
    <List className={className} style={style}>
      <MotionElementList {...listProps} finder={DragOrderedGridIndexFinder} />
    </List>
  )
}

const Grid = styled.ol`
  display: flex !important;
  flex-wrap: wrap !important;
  list-style: none;
`

export function DragOrderedGrid({
  className,
  style,
  ...listProps
}: ContainerProps) {
  return (
    <Grid className={className} style={style}>
      <MotionElementList {...listProps} finder={DragOrderedGridIndexFinder} />
    </Grid>
  )
}
