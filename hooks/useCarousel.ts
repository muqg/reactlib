import {useState, useEffect} from "react"
import {clamp} from "../utility/number"
import {useInitialRender} from "./useInitialRender"

type CarouselArgs<T> = {
  data: Array<T>
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
  start = 0,
}: CarouselArgs<T>): Carousel<T> {
  const clampIndex = (input: number) => clamp(input, 0, data.length - 1)
  const initialRender = useInitialRender()
  const [index, setIndex] = useState(clampIndex(start))

  useEffect(() => {
    if (!initialRender) {
      set(index)
    }
  }, [data.length])

  const getIndex = (change: number) =>
    (data.length + index + change) % data.length

  const set: Carousel<T>["set"] = input => setIndex(clampIndex(input))
  return {
    index,
    set,

    element: data[index],
    next: () => setIndex(getIndex(1)),
    prev: () => setIndex(getIndex(-1)),
  }
}
