import {listReducer} from "../ListReducer"

const List = [
  {id: 1, text: "asd"},
  {id: 10, text: "omg"},
  {id: 24, text: "age"},
]

describe("listReducer()", () => {
  it("throws on invalid action type", () => {
    const callWithInvalidActionType = () =>
      listReducer(List, {type: "invalid-type", value: {}} as any)

    expect(callWithInvalidActionType).toThrow()
  })

  it("does not crash when accidentally called with undefined list value", () => {
    const callWithUndefindListValue = () =>
      listReducer(undefined as any, {type: "append", value: {}})

    expect(callWithUndefindListValue).not.toThrow()
  })

  describe("append action", () => {
    it("appends an element", () => {
      const item = {id: 227, text: ""}
      const res = listReducer(List, {type: "append", value: item})

      expect(res).toContainEqual(item)
    })

    it("does not mutate the list when appending", () => {
      const item = {id: 227, text: ""}
      const res = listReducer(List, {type: "append", value: item})

      expect(res).not.toBe(List)
    })
  })

  describe("prepend action", () => {
    it("prepends an element", () => {
      const item = {id: 123, text: "test"}
      const res = listReducer(List, {type: "prepend", value: item})

      expect(res).toContainEqual(item)
    })

    it("does not mutate the list when prepending", () => {
      const item = {id: 123, text: "test"}
      const res = listReducer(List, {type: "prepend", value: item})

      expect(res).not.toBe(List)
    })
  })

  describe("update action", () => {
    it("updates the element in the list for function match", () => {
      const item = {id: 1, text: "test-update"}
      const res = listReducer(List, {
        type: "update",
        value: item,
        where: ({id}) => id === item.id,
      })

      expect(res).toContainEqual(item)
    })

    it("updates the element in the list for index match", () => {
      const index = 1
      const item = List[index]
      const res = listReducer(List, {
        type: "update",
        value: item,
        where: index,
      })

      expect(res).toContainEqual(item)
    })

    it("updates by merging update data with existing element's data", () => {
      const index = 0
      const item = {...List[index], merged: true}
      const res = listReducer(List, {
        type: "update",
        value: {merged: true} as any,
        where: index,
      })

      expect(res).toContainEqual(item)
    })

    it("does not mutate the list when updating", () => {
      const item = {id: 1, text: "test-update"}
      const res = listReducer(List, {
        type: "update",
        value: item,
        where: item.id,
      })

      expect(res).not.toBe(List)
    })
  })

  describe("remove action", () => {
    it("removes element from the list for function match", () => {
      const item = {id: 1, text: "asd"}
      expect(List).toContainEqual(item)

      const res = listReducer(List, {
        type: "remove",
        value: ({id}) => id === item.id,
      })

      expect(res).not.toContainEqual(item)
    })

    it("removes element from the list for index match", () => {
      const index = 1
      const item = List[index]
      const res = listReducer(List, {
        type: "remove",
        value: index,
      })

      expect(res).not.toContainEqual(item)
    })

    it("does not mutate the list when removing", () => {
      const res = listReducer(List, {
        type: "remove",
        value: 1,
      })

      expect(res).not.toBe(List)
    })
  })
})
