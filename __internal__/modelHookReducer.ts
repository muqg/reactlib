import {Model, ModelUtils, ModelValueList} from "../hooks"
import {isType} from "../utility/assertions"
import {len} from "../utility/collection"
import {ParseableInput, parseInputValue} from "../utility/dom"
import {Action, createAction, isSyntheticEvent} from "../utility/react"
import {cast} from "../utility/string"
import {call} from "../utility/function"

interface State {
    // Attempts to prevent unnecessary validation.
    hasChanged: boolean
    model: Model<any>
    utils: ModelUtils
}

type Actions =
    | Action<ModelValueList<any>, "change">
    | Action<undefined, "validate">

/**
 * This is the reducer for useModel hook.
 */
export function modelHookReducer(state: State, action: Actions): State {
    const {utils} = state

    switch (action.type) {
        case "change": {
            const values = action.value
            // Bail out of rendering if there are no values to update.
            if (!len(values)) {
                return state
            }

            const model = {...state.model}
            for (const name in values) {
                const entry = model[name]
                const {parse} = utils[name]

                let value = values[name]
                if (parse) {
                    value = parse(value, entry.value)
                } else if (
                    isType<ParseableInput>(
                        value,
                        v => isSyntheticEvent(v) || v instanceof Element
                    )
                ) {
                    value = cast(parseInputValue(value))
                }

                entry.value = value

                if (__DEV__) {
                    if (!(name in model)) {
                        console.error(
                            "Attempting to update a model value for name which was " +
                                "not part of the initial structure. There is a typo in " +
                                "your code or you forgot to include a model entry with " +
                                `name ${name}.`
                        )
                    }
                }
            }

            return {model, utils, hasChanged: true}
        }
        case "validate": {
            if (!state.hasChanged) {
                return state
            }

            const model = {...state.model}
            const data = model.$data()

            for (const name in utils) {
                model[name].error = call(
                    utils[name].validate,
                    model[name].value,
                    data
                )
            }

            return {model, utils, hasChanged: false}
        }
        default: {
            if (__DEV__) {
                throw "Dispatched invalid model action"
            }
            return state
        }
    }
}

export function modelChangeAction(values: ModelValueList<any>) {
    // This aims to prevent issues when dispatch is called asynchronously, after
    // an input event has been cleaned up, by persisting any input synthetic events.
    Object.values(values).forEach(v => isSyntheticEvent(v) && v.persist())

    return createAction("change", values)
}

export function modelValidateAction() {
    return createAction("validate", undefined)
}
