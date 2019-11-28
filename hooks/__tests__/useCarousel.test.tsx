import {renderHook, RenderHookResult} from "@testing-library/react-hooks"
import {Carousel, useCarousel} from "../useCarousel"

type DataElement = {name: string}

const Items: DataElement[] = [
  {name: "one"},
  {name: "two"},
  {name: "three"},
  {name: "four"},
  {name: "five"},
]

describe("Carousel hook", () => {
  let carousel: RenderHookResult<{data: DataElement[]}, Carousel<DataElement>>

  beforeEach(() => {
    carousel = renderHook(({data}) => useCarousel({data}), {
      initialProps: {data: Items},
    })
  })

  it("starts at 0 by default", () => {
    expect(carousel.result.current.index).toBe(0)
  })

  it("can switch to next", () => {
    carousel.result.current.next()
    expect(carousel.result.current.index).toBe(1)
  })

  it("can switch to previous", () => {
    carousel.result.current.next()
    carousel.result.current.prev()
    expect(carousel.result.current.index).toBe(0)
  })

  it("cannot be set to index below 0", () => {
    carousel.result.current.set(-10)
    expect(carousel.result.current.index).toBe(0)
  })

  it("cannot be set to index past `data.length`", () => {
    carousel.result.current.set(10)
    expect(carousel.result.current.index).toBe(Items.length - 1)
  })

  it("overflows back to first element", () => {
    carousel.result.current.set(Items.length - 1)
    carousel.result.current.next()
    expect(carousel.result.current.index).toBe(0)
  })

  it("underflows to last element", () => {
    carousel.result.current.prev()
    expect(carousel.result.current.index).toBe(Items.length - 1)
  })

  it("adjusts index to not go past `data.length` when data length changes", () => {
    carousel.result.current.set(10)
    carousel.rerender({data: [Items[1]]})
    expect(carousel.result.current.index).toBe(0)
  })

  describe("With `start` argument", () => {
    it("starts at index provided by `start` argument", () => {
      carousel = renderHook(() =>
        useCarousel({
          data: Items,
          start: 3,
        })
      )

      expect(carousel.result.current.index).toBe(3)
    })

    it("starts at last index when `start` is past `data.length`", () => {
      carousel = renderHook(() =>
        useCarousel({
          data: Items,
          start: Items.length,
        })
      )

      expect(carousel.result.current.index).toBe(Items.length - 1)
    })
  })
})
