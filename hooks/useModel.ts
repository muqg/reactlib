import { useState } from "react";
import { isObject, isType } from "../utility/assertions";
import { ParseableInput, parseInputValue } from "../utility/dom";
import { ReactStateSetter } from "../utility/react";
import { cast } from "../utility/string";

/**
 * Model object structure.
 */
export type Model<T extends object, K extends keyof T = keyof T> = {
    [key in K]: {
        value: any
        onChange: (input: ModelInputValue) => void
    }
}
/**
 * Valid model inputs values.
 */
export type ModelInputValue = ParseableInput | string | boolean | number | object

type ModelReturnValue<T extends object> = [Readonly<Model<T>>, T, ReactStateSetter<T>]

/**
 * Creates an input model.
 *
 * @param init The initial model object data.
 */
function useModel<T extends object>(init: T): ModelReturnValue<T> {
    const [data, setModel] = useState(init)

    // @ts-ignore Spread types may be created only from object types.
    function change(name: string, input: ModelInputValue) {
        // @ts-ignore Spread types may be created only from object types.
        let value = input
        if(isType<ParseableInput>(input, (v) => v.target || isObject(v, Element)))
            value = cast(parseInputValue(input))

        setModel({
            // @ts-ignore Spread types may be created only from object types.
            ...data,
            [name]: value
        })
    }

    let model = {} as Model<T>
    for(let key in init) {
        // @ts-ignore Spread types may be created only from object types.
        model[key] = {
            value: data[key],
            // @ts-ignore Spread types may be created only from object types.
            onChange: c => change(key, c)
        }
    }

    return [model, data, setModel]
}


export { useModel };

