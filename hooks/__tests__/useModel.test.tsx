import * as React from "react"
import {renderHook} from "react-hooks-testing-library"
import {act, cleanup, fireEvent, render} from "react-testing-library"
import {useModel} from "../useModel"

const modelHook = () =>
    useModel(() => ({
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
            <input {...model.current.validated} data-testid="test_input" />
        )
        fireEvent.blur(getByTestId("test_input"))

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
})
