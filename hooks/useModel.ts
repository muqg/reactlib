import { ParseableChange, parseElement } from "../utility/dom";
import { useState } from "react";

type Model<T extends object, K extends keyof T = keyof T> = {
    [key in K]: {
        value: T[K]
        onChange: (change: ParseableChange) => void
    }
}

type ModelObject<T extends object> = Model<T> & { $data: T, $set: React.Dispatch<React.SetStateAction<T>> }

function useModel<T extends object>(init: T): Readonly<ModelObject<T>> {
    const [data, setModel] = useState(init)

    // @ts-ignore Spread types may be created only from object types.
    function change(name: string, change: ParseableChange) {
        // @ts-ignore Spread types may be created only from object types.
        const parsed = parseElement(change)

        setModel({
            // @ts-ignore Spread types may be created only from object types.
            ...data,
            [name]: parsed.value
        })
    }

    let model  = {
        $data: data,
        $set: setModel
    } as ModelObject<T>

    for(let key in init) {
        model[key] = {
            value: data[key],
            onChange: c => change(key, c)
        }
    }

    return model
}


export { useModel };

