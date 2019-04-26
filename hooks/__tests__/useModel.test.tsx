import * as React from "react"
import {renderHook} from "react-hooks-testing-library"
import {act, cleanup, fireEvent, render} from "react-testing-library"
import {useModel} from "../useModel"

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

    it("replaces undefined values with empty strings initially", () => {
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

    it("calls custom parsers initially", () => {
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

    it("does not validate values initially", () => {
        expect(model.current.validated.error).toBeUndefined()
    })

    it("validates values when accessing the error list", () => {
        expect(model.current.$errors().validated).toBe("error")
    })

    it("validates values on element blur", () => {
        const {getByTestId} = render(
            <input {...model.current.validated} data-testid="input" />
        )
        fireEvent.blur(getByTestId("input"))

        expect(model.current.validated.error).toBe("error")
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

    it("parses input argument of type Model as model.$data() when no custom parser is present", () => {
        const {result: parent} = renderHook(() =>
            useModel(() => ({
                bound: "",
            }))
        )
        const {result: child} = renderHook(() =>
            useModel<{id: string; test: number}>(
                () => ({
                    id: "asd",
                    test: 10,
                }),
                parent.current.bound.onChange
            )
        )
        act(() => child.current.test.onChange(100))

        expect(parent.current.bound.value).toMatchObject({id: "asd", test: 100})
    })

    it.each(modelUpdateMethods)(
        "updates owner component when $method is called",
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
        "skips update on owner component when binder is present and $method is called",
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
})
