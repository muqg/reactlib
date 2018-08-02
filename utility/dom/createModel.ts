import { ParseableChange, parseElement } from "./parseElement";
import { dive } from "../collection";

/**
 * Creates a function modelling changes to a nested key of a component's state.
 *
 * @param component The component to model the state of.
 * @param key A nested state model key using "dot notation".
 */
function createModel(component: React.Component, key = "") {
    return (change: ParseableChange, callback?: () => void | undefined) => {
        const parsed = parseElement(change)
        component.setState(
            prevState => dive(key, {[parsed.name]: parsed.value}, prevState),
            callback
        )
        return parsed
    }
}

export { createModel }