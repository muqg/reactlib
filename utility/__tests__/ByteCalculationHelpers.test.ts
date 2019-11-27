import {bytesSizeUnit, bytes} from "../ByteCalculationHelpers"

describe("bytes()", () => {
  it("returns the correct number of bytes when input value is below 1024", () => {
    expect(bytes(1.1, "MB")).toBe(1.1 * 1024 ** 2)
    expect(bytes(10, "Bytes")).toBe(10)
  })

  it("returns the correct number of bytes when input value is over 1024", () => {
    expect(bytes(1500, "KB")).toBe(1500 * 1024)
  })
})

describe("bytesSizeUnit()", () => {
  it.each([
    ["1023", "Bytes"],
    ["1024", "KB"],
    [(1024 ** 3 + 1).toString(), "GB"],
  ])("returns the corret size unit", (bytes, unit) => {
    expect(bytesSizeUnit(parseInt(bytes))).toBe(unit)
  })
})
