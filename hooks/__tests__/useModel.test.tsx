import * as React from "react"
import {renderHook} from "react-hooks-testing-library"
import {act, cleanup, fireEvent, render} from "react-testing-library"
import {Model, useModel} from "../useModel"

/**
 * Names of model methods that should force an update on owner component
 * or pass data to binder and let it update instead.
 */
const modelUpdateMethods = ["onChange", "onBlur", "$change", "$reset"]

const modelHook = () => {
    return useModel(() => ({
        undef: undefined,
        parsed: {
            value: 0,
            parse: (input: number) => (input || 1) * 10,
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
    binder?: (val: any) => void
}) => {
    const model = useModel(() => ({test: ""}), binder)
    updateCounter()

    return (
        <>
            <button onClick={() => model.test.onChange("asd")}>onChange</button>
            <button onClick={model.test.onBlur}>onBlur</button>
            <button onClick={() => model.$change({test: 2})}>$change</button>
            <button onClick={() => model.$reset()}>$reset</button>
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

    it("validates values on element blur", () => {
        const {getByTestId} = render(
            <input {...model.current.validated} data-testid="input" />
        )
        fireEvent.blur(getByTestId("input"))

        expect(model.current.validated.error).toBe("error")
    })

    it("bails out of validation update if model values have not changed since last validation", () => {
        const counter = jest.fn()
        const dom = render(<MockModelComponent updateCounter={counter} />)
        const button = dom.getByText("onBlur")

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
        act(() => model.current.validated.onBlur())

        expect(entryBeforeValidation).not.toBe(model.current.validated)
    })

    it("provides the most recent model values to the binder", () => {
        const structure = {test: 10}
        const {result: model} = renderHook(() =>
            useModel<typeof structure>(
                () => ({
                    test: 10,
                }),
                binder
            )
        )

        act(() => model.current.test.onChange("asd"))

        function binder(model: Model<typeof structure>) {
            expect(model.test.value).toBe("asd")
        }
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
        }
    )

    it.each(modelUpdateMethods)(
        "skips update on owner component when binder is present and %s is called",
        method => {
            const childCounter = jest.fn()
            const parentCounter = jest.fn()
            const Parent = () => {
                const model = useModel(() => ({
                    childData: {
                        value: {},
                    },
                }))

                parentCounter()

                return (
                    <MockModelComponent
                        updateCounter={childCounter}
                        binder={model.childData.onChange}
                    />
                )
            }
            const dom = render(<Parent />)

            act(() => {
                fireEvent.click(dom.getByText(method))
            })

            expect(parentCounter).toHaveBeenCalledTimes(2)
            expect(childCounter).toHaveBeenCalledTimes(2)
        }
    )

    describe("Nested modelling", () => {
        it("validates nested models when validating", () => {
            const {result: parentModel} = renderHook(() =>
                useModel(() => ({
                    errorValue: {
                        validate: () => "error",
                    },
                    nested: {},
                }))
            )
            const {result: nestedModel} = renderHook(() =>
                useModel(
                    () => ({
                        id: {
                            value: "test",
                            validate: () => "error",
                        },
                    }),
                    parentModel.current.nested.onChange
                )
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
                }))
            )
            const {result: nestedModel} = renderHook(() =>
                useModel(
                    () => ({
                        id: {
                            value: "test",
                            validate: () => "error",
                        },
                    }),
                    parentModel.current.nested.onChange
                )
            )
            act(() => {
                nestedModel.current.$change({id: "asd"})
                expect(parentModel.current.$errors()).toEqual({
                    errorValue: "error",
                    nested: "custom_error",
                })
            })
        })

        it("resets nested models when resetting", () => {
            const initialData = {id: "", name: ""}
            const {result: parentModel} = renderHook(() =>
                useModel(() => ({
                    nested: {
                        value: {},
                        validate: () => "custom_error",
                    },
                }))
            )
            const {result: nestedModel} = renderHook(() =>
                useModel(
                    () => ({
                        id: "",
                        name: "",
                    }),
                    parentModel.current.nested.onChange
                )
            )

            const changeData = {id: 1, name: "test"}
            act(() => nestedModel.current.$change(changeData))
            expect(parentModel.current.nested.value.$data()).toEqual(changeData)

            act(() => parentModel.current.$reset())
            expect(parentModel.current.nested.value.$data()).toEqual(
                initialData
            )
        })

        it("serializes nested models using their model.$data method", () => {
            const {result: parentModel} = renderHook(() =>
                useModel<{nested: object}>(() => ({
                    nested: {
                        value: {},
                        validate: () => "custom_error",
                    },
                }))
            )
            const {result: nestedModel} = renderHook(() =>
                useModel(
                    () => ({
                        id: "",
                        name: "",
                    }),
                    parentModel.current.nested.onChange
                )
            )

            const changeData = {id: 1, name: "test"}
            act(() => nestedModel.current.$change(changeData))
            expect(parentModel.current.$data().nested).toEqual(changeData)
        })
    })
})
