import {buildUrlQuery} from "../buildUrlQuery"

describe("buildURLQuery()", () => {
  it("works for simple objects", () => {
    const params = {
      test: 1,
      another: "asd",
    }
    const expected = encodeURI("test=1&another=asd")

    expect(buildUrlQuery(params)).toBe(expected)
  })

  it("works for objets with arrays", () => {
    const params = {
      test: [1, 2, 3],
      another: "asd",
    }
    const expected = encodeURI("test[]=1&test[]=2&test[]=3&another=asd")

    expect(buildUrlQuery(params)).toBe(expected)
  })

  it("works for objects with multi-dimensional arrays", () => {
    const params = {
      test: [[10, 20], [30, 40]],
      another: "asd",
    }

    const expected = encodeURI("test[]=10,20&test[]=30,40&another=asd").replace(
      /,/g,
      encodeURIComponent(","),
    )

    expect(buildUrlQuery(params)).toBe(expected)
  })
})
