import { put } from "../collection";
import { asFloat, asInt } from "../string";
import { ParseableChange, parseElement } from "./parseElement";


interface CreateModelOptions {
    /**
     * Whether to cast modelled value to its
     * respective primitive or leave it as is.
     */
    cast?: boolean
}


/**
 * Creates a function modelling changes to a nested key of a component's state.
 *
 * @param component The component to model the state of.
 * @param key A nested state model key using "dot notation".
 */
function createModel(component: React.Component, key = "", options: CreateModelOptions = {cast: true}) {
    return (change: ParseableChange, callback?: () => void | undefined) => {
        const parsed = parseElement(change)
        const name = parsed.name
        let value: string | number | boolean = parsed.value

        if(options.cast) {
            if(value.length) {
                if(!isNaN(value as any))
                    value = value.indexOf(".") >= 0 ? asFloat(value) : asInt(value)
                else if(value === "true")
                    value = true
                else if(value === "false")
                    value = false
            }
        }

        component.setState(
            prevState => put(key, {[name]: value}, prevState),
            callback
        )
        return {
            name,
            value
        }
    }
}

export { createModel };

