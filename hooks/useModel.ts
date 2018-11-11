import { useState } from "react";
import { ParseableInput, parseInputValue } from "../utility/dom";
import { isObject, isType } from "../utility/assertions";
import { cast } from "../utility/string";

type Model<T extends object, K extends keyof T = keyof T> = {
    [key in K]: {
        value: T[K]
        onChange: (input: ModelInput) => void
    }
}
type ModelInput = ParseableInput | string | boolean | number | object

type ModelObject<T extends object> = Model<T> & { $data: T, $set: React.Dispatch<React.SetStateAction<T>> }

function useModel<T extends object>(init: T): Readonly<ModelObject<T>> {
    const [data, setModel] = useState(init)

    // @ts-ignore Spread types may be created only from object types.
    function change(name: string, input: ModelInput) {
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

    let model  = {
        $data: data,
        $set: setModel
    } as ModelObject<T>

    for(let key in init) {
        // @ts-ignore Spread types may be created only from object types.
        model[key] = {
            value: data[key],
            // @ts-ignore Spread types may be created only from object types.
            onChange: c => change(key, c)
        }
    }

    return model
}


export { useModel };

