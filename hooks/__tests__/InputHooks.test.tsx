import {cleanup, fireEvent, render, RenderResult} from "@testing-library/react"
import {renderHook, RenderHookResult} from "@testing-library/react-hooks"
import React from "react"
import {Model, useModel} from "../InputHooks"

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

describe("Model hook", () => {
  describe("Initialization", () => {
    type InitTestObject = {
      test: number
      test2: []
      test3: string
      test4: number
    }

    let model: RenderHookResult<any, Model<InitTestObject>>["result"]["current"]

    beforeEach(() => {
      model = renderHook(() =>
        useModel<InitTestObject>(() => ({
          test: 10,
          test2: {
            value: [],
          },
          test3: undefined,
          test4: {
            value: 1,
            parse: value => value * 42,
          },
        })),
      ).result.current
    })

    it("initializes a model entry for each structure key", () => {
      const keys = Object.keys(model)
      expect(keys).toEqual(expect.arrayContaining(["test", "test2", "test3"]))
    })

    it("initializes model entries with value equal to the structure's value", () => {
      expect(model.test.value).toBe(10)
      expect(model.test2.value).toEqual([])
    })

    it("converts undefined values to empty string", () => {
      expect(model.test3.value).toBe("")
    })
  })

  describe("Passive settings", () => {
    it("does not cause a render with passive setting", () => {
      let model: Model<{test: string}> = null as any
      const mock = jest.fn()
      const Component = () => {
        model = useModel(
          () => ({
            test: "",
          }),
          {passive: true},
        )

        mock()

        return null
      }

      render(<Component />)
      model.test.onChange("test")

      expect(mock).toHaveBeenCalledTimes(1)
    })

    it("does not render on value change for passive entries", () => {
      let model: Model<{test: string}> = null as any
      const mock = jest.fn()
      const Component = () => {
        model = useModel<{test: string}>(() => ({
          test: {
            value: "",
            passive: true,
          },
        }))

        mock()

        return null
      }

      render(<Component />)
      model.test.onChange("test")

      expect(mock).toHaveBeenCalledTimes(1)
    })

    it("takes priority for entry's passive status over the model's passive setting", () => {
      let model: Model<{test: string}> = null as any
      const mock = jest.fn()
      const Component = () => {
        model = useModel<{test: string}>(
          () => ({
            test: {
              value: "",
              passive: true,
            },
          }),
          {passive: false},
        )

        mock()

        return null
      }

      render(<Component />)
      model.test.onChange("test")

      expect(mock).toHaveBeenCalledTimes(1)
    })
  })

  describe("Validation and errors", () => {
    describe("Renders", () => {
      let model: Model<{test: string}>
      let mock: jest.Mock

      beforeEach(() => {
        mock = jest.fn()
        const Component = () => {
          model = useModel(() => ({test: "test"}))
          mock()
          return null
        }

        render(<Component />)
      })

      it.each(["$errors", "$firstError"])(
        "does not render when %s() is called",
        method => {
          model[method]()

          expect(mock).toHaveBeenCalledTimes(1)
        },
      )

      it("renders when $validate is called", () => {
        model.$validate()
        expect(mock).toHaveBeenCalledTimes(2)
      })

      it("renders when $validate is called, regardless of passive setting", () => {
        let model: Model<any> = null as any
        const mock = jest.fn()

        const Component = () => {
          model = useModel(() => ({tst: "test"}), {passive: true})
          mock()
          return null
        }

        render(<Component />)
        model.$validate()

        expect(mock).toHaveBeenCalledTimes(2)
      })
    })

    it.each(["$errors", "$validate"])(
      "returns cached errors when %s() is called more than once",
      method => {
        const model = renderHook(() =>
          useModel<{test: number}>(() => ({
            test: {
              value: 12,
              validate: () => "error",
            },
          })),
        )

        const errors = model.result.current[method]()

        expect(model.result.current[method]()).toBe(errors)
      },
    )

    it("error list only includes names of invalid values", () => {
      const model = renderHook(() =>
        useModel<{test: string; test2: number}>(() => ({
          test: {
            value: "",
            validate: () => "error",
          },
          test2: 11,
        })),
      ).result.current

      expect(model.$errors()).toEqual({test: "error"})
    })

    it("does not mutate entries on validation", () => {
      const model = renderHook(() =>
        useModel<{test: string}>(() => ({
          test: {
            value: "",
            validate: () => "error",
          },
        })),
      )

      const entryBeforeValidation = model.result.current.test
      model.result.current.$validate()

      expect(model.result.current.test).not.toBe(entryBeforeValidation)
    })

    it("validates values of latest model instance", () => {
      const model = renderHook(() =>
        useModel<{test: string}>(
          () => ({
            test: {
              value: "",
              validate: () => "error",
            },
          }),
          {passive: true},
        ),
      )

      model.result.current.test.onChange("test")

      expect(model.result.current.$errors()).toEqual({test: "error"})
    })
  })

  describe("Reset", () => {
    it("resets using the latest structure", () => {
      const model = renderHook(
        ({initialValue}) =>
          useModel(() => ({
            test: initialValue,
          })),
        {initialProps: {initialValue: 1}},
      )

      model.rerender({initialValue: 2})
      model.result.current.$reset()

      expect(model.result.current.test.value).toBe(2)
    })

    it("renders on reset", () => {
      let model: Model<any> = null as any
      const mock = jest.fn()

      const Component = () => {
        model = useModel(() => ({test: 123}))
        mock()
        return null
      }

      render(<Component />)
      model.$reset()

      expect(mock).toHaveBeenCalledTimes(2)
    })
  })

  describe("Value changes", () => {
    type ValueChangeTestObject = {
      simple: number
      parsed: number
      validated: string
    }

    let component: RenderResult
    let model: Model<ValueChangeTestObject>
    let counter: jest.Mock

    beforeEach(() => {
      counter = jest.fn()

      const Component = () => {
        model = useModel<ValueChangeTestObject>(() => ({
          simple: 12,
          parsed: {
            value: 1,
            parse: value => value * value,
          },
          validated: {
            value: "asd",
            validate: val => {
              if (!val.length) {
                return "error"
              }
            },
          },
        }))

        counter()
        return (
          <input onChange={model.simple.onChange} value={model.simple.value} />
        )
      }

      component = render(<Component />)
    })

    it("can change entry value", () => {
      model.simple.onChange(-1)

      expect(model.simple.value).toBe(-1)
    })

    it("uses input parser by default", () => {
      const input = component.getByDisplayValue(model.simple.value.toString())
      fireEvent.change(input, {target: {value: "test"}})

      expect(model.simple.value).toBe("test")
    })

    it("calls custom parsers on change", () => {
      model.parsed.onChange(5)

      expect(model.parsed.value).toBe(25)
    })

    it("attempts to validate entry when value is changed", () => {
      model.validated.onChange("")

      expect(model.validated.error).toBe("error")
    })

    it("clears error cache on value change", () => {
      model.$errors()
      model.simple.onChange(123)

      // @ts-ignore _errors is only available for InternalModel type.
      expect(model._errors).toBe(null)
    })

    it("does not mutate entries on value change", () => {
      const entryBeforeChange = model.simple
      model.simple.onChange(123)

      expect(model.simple).not.toBe(entryBeforeChange)
    })

    it("does not render when the input value is equal to the previous value", () => {
      model.simple.onChange(model.simple.value)

      expect(counter).toHaveBeenCalledTimes(1)
    })

    it("renders only once when calling $change with multiple values", () => {
      model.$change({simple: 11, parsed: 12, validated: "test"})

      expect(counter).toHaveBeenCalledTimes(2)
    })

    it("keeps object references for unmodified entries when changed", () => {
      const entryBeforeChange = model.parsed
      model.simple.onChange(10)

      expect(model.parsed).toBe(entryBeforeChange)
    })

    it("keeps entry's onChange() method reference when changed", () => {
      const changeHandler = model.simple.onChange
      model.simple.onChange(10)

      expect(model.simple.onChange).toBe(changeHandler)
    })
  })

  describe("Return value", () => {
    type ReturnValueTestObject = {passive: number; normal: number}

    let model: RenderHookResult<any, Model<ReturnValueTestObject>>

    beforeEach(() => {
      model = renderHook(() =>
        useModel<ReturnValueTestObject>(() => ({
          normal: {
            value: 1,
            passive: false,
          },
          passive: {
            value: 1,
            passive: true,
          },
        })),
      )
    })

    it("returns a mutated object when passively changed", () => {
      const resultBeforeRender = model.result.current
      model.result.current.passive.onChange(12)

      model.rerender()

      expect(model.result.current.passive.value).toBe(12)
      expect(model.result.current).toBe(resultBeforeRender)
    })

    it("returns the same object when rerendered without modification", () => {
      const resultBeforeRender = model.result.current
      model.rerender()

      expect(model.result.current).toBe(resultBeforeRender)
    })

    it("returns a model with new reference when committed", () => {
      const resultBeforeRender = model.result.current
      model.result.current.normal.onChange(12)

      expect(model.result.current).not.toBe(resultBeforeRender)
    })
  })

  describe("Serialization", () => {
    it("can be serialized via $data() method", () => {
      const model = renderHook(() =>
        useModel<{test: number[]; asd: string}>(() => ({
          test: {
            value: [1, 2],
          },
          asd: "fgh",
        })),
      )

      expect(model.result.current.$data()).toEqual({test: [1, 2], asd: "fgh"})
    })

    it("serializes the data of latest model instance", () => {
      const model = renderHook(() =>
        useModel<{test: number}>(() => ({
          test: {
            value: 1,
            passive: true,
          },
        })),
      )

      model.result.current.test.onChange(2)

      expect(model.result.current.$data()).toEqual({test: 2})
    })
  })
})
