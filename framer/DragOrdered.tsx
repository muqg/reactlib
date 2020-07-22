import {motion} from "framer-motion"
import React, {useRef} from "react"
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
  targetIndex: number
) => void

type PositionUpdateFunction = (index: number, element: HTMLElement) => void
type MoveItem = (currentIndex: number, offsetX: number, offsetY: number) => void

type DraggableProps = {
  children: JSX.Element
  index: number
  moveItem: MoveItem
  setPosition: PositionUpdateFunction
  style?: React.CSSProperties
}

type DraggableListProps = {
  children: JSX.Element[]
  elementStyle?: React.CSSProperties
  finder: DragOrderedIndexFinder
  onChange?: DragOrderedChangeHandler
}

type ContainerProps = {
  children: DraggableListProps["children"]
  className?: string
  /**
   * Styling for each underlying motion element wrapper.
   */
  elementStyle?: React.CSSProperties
  onChange?: DragOrderedChangeHandler
  style?: Omit<React.CSSProperties, "display" | "flexDirection" | "flexWrap">
}

const dragConstraints = {top: 0, bottom: 0, left: 0, right: 0}

function Draggable({
  children,
  index,
  moveItem,
  setPosition,
  style,
}: DraggableProps) {
  return (
    <motion.li
      drag={true}
      dragConstraints={dragConstraints}
      dragElastic={1}
      layout={true}
      onDragEnd={(_e, {offset}) => moveItem(index, offset.x, offset.y)}
      ref={(element) => {
        if (element) {
          setPosition(index, element)
        }
      }}
      style={{cursor: "grab", overflow: "hidden", ...style}}
      whileTap={{scale: 1.12, zIndex: 100}}
    >
      {children}
    </motion.li>
  )
}

function DraggableList({
  children,
  elementStyle,
  finder,
  onChange,
  ...elementProps
}: DraggableListProps) {
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
      positions
    )
    if (targetIndex !== currentIndex) {
      onChange(currentIndex, targetIndex)
    }
  }

  return (
    <>
      {children.map((child, i) => (
        <Draggable
          {...elementProps}
          index={i}
          key={child.key || undefined}
          moveItem={moveItem}
          setPosition={setPosition}
          style={elementStyle}
        >
          {child}
        </Draggable>
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
      <DraggableList {...listProps} finder={DragOrderedGridIndexFinder} />
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
      <DraggableList {...listProps} finder={DragOrderedGridIndexFinder} />
    </Grid>
  )
}
