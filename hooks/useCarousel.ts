import {useEffect, useState} from "react"
import {clamp} from "../utility/number"
import {useInitialRender} from "./useInitialRender"

export type CarouselParams<T = any> = {
  data: Array<T>
  onChange?: (index: number) => void
  /**
   * The index to start at.
   */
  start?: number
}

export type Carousel<T> = {
  element: T
  index: number
  next: () => void
  prev: () => void
  set: (id: number) => void
}

export function useCarousel<T>({
  data,
  onChange,
  start = 0,
}: CarouselParams<T>): Carousel<T> {
  const clampIndex = (input: number) => clamp(input, 0, data.length - 1)
  const [currentIndex, setCurrentIndex] = useState(clampIndex(start))
  const initialRender = useInitialRender()

  useEffect(() => {
    if (!initialRender) {
      setIndex(currentIndex)
    }
  }, [data.length])

  function setIndex(index: number) {
    const nextIndex = clampIndex(index)
    setCurrentIndex(nextIndex)

    if (nextIndex !== currentIndex) {
      onChange?.(nextIndex)
    }
  }

  function changeIndex(change: number) {
    const nextIndex = (data.length + currentIndex + change) % data.length
    setIndex(nextIndex)
  }

  return {
    index: currentIndex,

    element: data[currentIndex],
    next: () => changeIndex(1),
    prev: () => changeIndex(-1),
    set: input => setIndex(clampIndex(input)),
  }
}
