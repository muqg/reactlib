import {act, cleanup, fireEvent, render} from "@testing-library/react"
import {renderHook} from "@testing-library/react-hooks"
import * as React from "react"
import {Model, ModelEntry, useModel} from "../useModel"

/**
 * Names of model methods that should force an update on owner component
 * or pass data to binder and let it update instead.
 */
const modelUpdateMethods = ["onChange", "$change", "$reset", "$validate"]

const modelHook = () => {
  return useModel(() => ({
    undef: undefined,
    parsed: {
      value: 1,
      parse: (input: number) => input * 10,
    },
    validated: {
      value: true,
      validate: () => {
        return "error"
      },
    },
  }))
}

const MockModelComponent = ({
  updateCounter,
  binder,
}: {
  updateCounter: jest.Mock
  binder?: ModelEntry
}) => {
  const model = useModel(() => ({test: ""}), {binder})
  updateCounter()

  return (
    <>
      <button onClick={() => model.test.onChange("asd")}>onChange</button>
      <button onClick={() => model.$change({test: 2})}>$change</button>
      <button onClick={() => model.$reset()}>$reset</button>
      <button onClick={() => model.$validate()}>$validate</button>
    </>
  )
}

describe("Model hook", () => {
  let model = renderHook(modelHook).result

  beforeEach(() => {
    cleanup()
    model = renderHook(modelHook).result
  })

  it("replaces undefined values with empty strings on initialization", () => {
    expect(model.current.undef.value).toBe("")
    expect(model.current.validated.value).toBe(true)
  })

  it("replaces undefined values with empty strings on reset", () => {
    act(() => {
      model.current.undef.onChange(1)
      model.current.$reset()
    })

    expect(model.current.undef.value).toBe("")
  })

  it("calls custom parsers on initialization", () => {
    expect(model.current.parsed.value).toBe(10)
  })

  it("calls custom parsers on update", () => {
    act(() => model.current.parsed.onChange(5))

    expect(model.current.parsed.value).toBe(50)
  })

  it("calls custom parsers on reset", () => {
    act(() => {
      model.current.parsed.onChange(2)
      model.current.$reset()
    })

    expect(model.current.parsed.value).toBe(10)
  })

  it("creates a new model instance from current structure on reset", () => {
    const count = {current: 0}
    const {result: model} = renderHook(() =>
      useModel(() => ({
        test: count.current,
      })),
    )

    expect(model.current.test.value).toBe(0)

    count.current += 1
    act(() => model.current.$reset())

    expect(model.current.test.value).toBe(1)
  })

  it("does not validate values on initialization", () => {
    expect(model.current.validated.error).toBeUndefined()
  })

  it("validates values when accessing the error list and a value has been changed", () => {
    act(() => {
      model.current.$errors()
    })

    expect(model.current.$errors().validated).toBe("error")
    expect(model.current.validated.error).toBe("error")
  })

  it("bails out of validation update, if model values have not changed since last validation", () => {
    const counter = jest.fn()
    const dom = render(<MockModelComponent updateCounter={counter} />)
    const button = dom.getByText("$validate")

    fireEvent.click(button)
    fireEvent.click(button)

    expect(counter).toHaveBeenCalledTimes(2)
  })

  it("does not mutate its entries when updating", () => {
    const entryBeforeUpdate = model.current.parsed
    act(() => model.current.parsed.onChange(5))

    expect(entryBeforeUpdate).not.toBe(model.current.parsed)
  })

  it("does not mutate its entries when validating", () => {
    const entryBeforeValidation = model.current.validated
    act(() => model.current.$validate())

    expect(entryBeforeValidation).not.toBe(model.current.validated)
  })

  it.each(modelUpdateMethods)(
    "updates owner component when %s is called",
    method => {
      const counter = jest.fn()
      const dom = render(<MockModelComponent updateCounter={counter} />)

      act(() => {
        fireEvent.click(dom.getByText(method))
      })

      expect(counter).toHaveBeenCalledTimes(2)
    },
  )

  describe("Nested modelling", () => {
    it("sets binder value on each render", () => {
      const {result: parentModel} = renderHook(() =>
        useModel(() => ({
          binder: {},
          test: 1,
        })),
      )
      const {result: childModel} = renderHook(() =>
        useModel(
          () => ({
            test: 1,
          }),
          {binder: parentModel.current.binder},
        ),
      )

      expect(parentModel.current.binder.value).toBe(childModel.current)

      act(() => childModel.current.test.onChange(42))
      expect(parentModel.current.binder.value).toBe(childModel.current)
    })

    it("does not allow binding to be broken by calling binder entry's onChange", () => {
      const {result: parentModel} = renderHook(() =>
        useModel(() => ({
          binder: {},
        })),
      )
      const {result: childModel} = renderHook(() =>
        useModel(
          () => ({
            test: 10,
          }),
          {binder: parentModel.current.binder},
        ),
      )

      act(() => parentModel.current.binder.onChange(10))
      expect(parentModel.current.binder.value).toBe(childModel.current)
    })

    it("validates nested models", () => {
      const {result: parentModel} = renderHook(() =>
        useModel(() => ({
          errorValue: {
            validate: () => "error",
          },
          nested: {},
        })),
      )
      const {result: nestedModel} = renderHook(() =>
        useModel(
          () => ({
            id: {
              value: "test",
              validate: () => "error",
            },
          }),
          {binder: parentModel.current.nested},
        ),
      )

      act(() => {
        nestedModel.current.$change({id: "asd"})
        expect(parentModel.current.$errors()).toEqual({
          errorValue: "error",
          nested: "error",
        })
      })
    })

    it("uses custom validator when present instead of validating nested models", () => {
      const {result: parentModel} = renderHook(() =>
        useModel(() => ({
          errorValue: {
            validate: () => "error",
          },
          nested: {
            value: {},
            validate: () => "custom_error",
          },
        })),
      )
      const {result: nestedModel} = renderHook(() =>
        useModel(
          () => ({
            id: {
              value: "test",
              validate: () => "error",
            },
          }),
          {binder: parentModel.current.nested},
        ),
      )
      act(() => {
        nestedModel.current.$change({id: "asd"})
        expect(parentModel.current.$errors()).toEqual({
          errorValue: "error",
          nested: "custom_error",
        })
      })
    })

    it("resets nested models", () => {
      const initialData = {id: 0, name: ""}
      const changeData = {id: 1, name: "test"}

      let parentModel = {} as Model<{nested: Model<typeof initialData>}>
      let childModel: Model<typeof initialData>
      const Child = ({binder}: {binder: ModelEntry}) => {
        childModel = useModel(() => initialData, {binder}) as any
        return null
      }
      const Parent = () => {
        parentModel = useModel(() => ({
          nested: {},
        })) as any

        return <Child binder={parentModel.nested} />
      }
      render(<Parent />)

      act(() => childModel.$change(changeData))
      expect(parentModel.nested.value.$data()).toEqual(changeData)

      act(() => parentModel.$reset())
      expect(parentModel.nested.value.$data()).toEqual(initialData)
    })

    it("serializes nested models using their model.$data method", () => {
      const {result: parentModel} = renderHook(() =>
        useModel<{nested: object}>(() => ({
          nested: {
            value: {},
            validate: () => "custom_error",
          },
        })),
      )
      const {result: nestedModel} = renderHook(() =>
        useModel(
          () => ({
            id: "",
            name: "",
          }),
          {binder: parentModel.current.nested},
        ),
      )

      const changeData = {id: 1, name: "test"}
      act(() => nestedModel.current.$change(changeData))
      expect(parentModel.current.$data().nested).toEqual(changeData)
    })
  })
})
