import {move} from "../move"

const numbers = [1, 2, 3, 4, 5]

describe("Array.move utility function", () => {
  it("throws when either of the indices is out of bounds", () => {
    expect(() => move(numbers, -1, 4)).toThrow("Index out of bounds")
    expect(() => move(numbers, 0, 10)).toThrow("Index out of bounds")
  })

  it("it correctly moves the element to its new index", () => {
    const moved = move(numbers, 0, 4)
    expect(moved.indexOf(1)).toBe(4)
  })

  it("does not mutate the original array", () => {
    const movedNumbers = move(numbers, 1, 3)
    expect(numbers.indexOf(2)).toBe(1)
    expect(movedNumbers).not.toBe(numbers)
  })
})
