import {useMemo, useState} from "react"
import {isObject, isType} from "../utility/assertions"
import {ParseableInput, parseInputValue} from "../utility/dom"
import {ReactStateSetter} from "../utility/react"
import {cast} from "../utility/string"
import {call} from "../utility/function"

/**
 * Model object structure.
 */
export type Model<T extends object, K extends keyof T = keyof T> = {
    [key in K]: {
        value: any
        onChange: (input: ModelInputValue) => void
    }
} & {$data: T; $set: ReactStateSetter<Partial<T> | T>}
/**
 * Valid model inputs values.
 */
export type ModelInputValue = ParseableInput | ModelPrimitive
type ModelPrimitive = string | boolean | number | object

/**
 * Creates an input model.
 *
 * @param init The initial model object data.
 * @param middleware A function that is called right before updating the model.
 * This allows for final custom manipulations on the value.
 */
function useModel<T extends object>(
    init: T,
    middleware?: (val: ModelPrimitive, name: string) => ModelPrimitive | void
): Model<T> {
    const [data, setModel] = useState(init)

    function change(name: string, input: ModelInputValue) {
        let value = input
        if (
            isType<ParseableInput>(input, v => v.target || isObject(v, Element))
        )
            value = cast(parseInputValue(input))

        value = call(middleware, value, name) || value

        setModel({
            ...data,
            [name]: value,
        })
    }

    return useMemo(() => {
        const model = {} as Model<any>
        for (let key in init) {
            model[key] = {
                value: data[key],
                onChange: c => change(key, c),
            }
        }

        model.$data = data
        model.$set = setModel as Model<T>["$set"]

        return model
    }, [data])
}

export {useModel}
