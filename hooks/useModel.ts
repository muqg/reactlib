import {useReducer} from "react"
import {Dictionary, List, Omit, Serializable} from "../utility"
import {isObject, isType} from "../utility/assertions"
import {except, len} from "../utility/collection"
import {ParseableInput, parseInputValue} from "../utility/dom"
import {call} from "../utility/function"
import {isSyntheticEvent} from "../utility/react"
import {cast} from "../utility/string"

export type ModelError = string | undefined | void
export type ModelInput = ParseableInput | Serializable
export type ModelValues<T extends object = object> = Dictionary<T, T[keyof T]>

export interface ModelElement<T extends object = object> {
    /**
     * A custom parser for when value changes.
     * @param input Current input value. Note that parser is called initially
     * with input value as undefined.
     * @param prev The previous value.
     */
    parse?(input: any | undefined, prev: any): Serializable
    value?: T[keyof T]
    validate?(value: any, modelValues: ModelValues<T>): ModelError
}

export interface ModelEntry {
    error?: ModelError
    onChange: (input: ModelInput) => void
    value: any
}

// Note that all special model props should start with a dollar sign.
export type Model<T extends object> = Required<Dictionary<T, ModelEntry>> & {
    /**
     * Changes the values of multiple model entries at once.
     * @param values A list of the model names to update and their new values as
     * key/value pairs, respectively.
     */
    $change(values: Partial<T>): void
    /**
     * Returns the modeled data as a list of key/value pairs.
     */
    $data(): T
    /**
     * Returns a list of model errors.
     */
    $errors(): Dictionary<T, ModelError>
    /**
     * Returns the first error from the model's error list.
     */
    $firstError(): ModelError
    /**
     * Resets the values for the given names to their initial values.
     * If no names are given then all model values are reset.
     */
    $reset(...names: Array<keyof T>): void
}

interface State {
    model: Model<any>
    utils: List<Omit<ModelElement<any>, "value">>
}

function reducer(state: State, values: ModelValues<any>) {
    // Bail out of rendering if there are no values to update.
    if (!len(values)) {
        return state
    }

    const {utils} = state
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
                    "Attempting to update a model value for name which was" +
                        "not part of the initial structure. There is a typo in" +
                        "your code or you forgot to include a model entry with" +
                        `name ${name}.`
                )
            }

            if (name.startsWith("$")) {
                console.error(
                    "The model should not contain entries with names starting with" +
                        "a dollar sign $, which is used to designate special model" +
                        "properties and may therefore lead to unexpected behaviour."
                )
            }
        }
    }

    // Validate newest values only after assigning all of them
    // to the model object in order to provide the most recent
    // version of model data to each validator.
    validateModelValues(model, values, utils)

    return {model, utils}
}

function useModel<T extends object>(
    initialElements: () => Partial<
        Dictionary<T, string | boolean | number | null | ModelElement<T>>
    >
): Model<T> {
    const [state, dispatch] = useReducer(reducer, {}, initialize)

    function initialize() {
        const elements = initialElements()

        const utils: State["utils"] = {}
        const model = {
            $change(values: ModelValues<any>) {
                dispatch(persistent(values))
            },
            $data() {
                const values: any = {}
                for (const name in this) {
                    const entry = this[name]
                    if (name.startsWith("$")) {
                        continue
                    }

                    values[name] = entry.value
                }
                return values
            },
            $errors() {
                // Refresh validity of all values in case that any
                // of them depends on the value of another one.
                validateModelValues(this, this.$data(), utils)

                const errors: any = {}
                for (const name in this) {
                    const entry = this[name]
                    if (name.startsWith("$") || !entry.error) {
                        continue
                    }

                    errors[name] = entry.error
                }
                return errors
            },
            $firstError() {
                return Object.values(this.$errors())[0]
            },
            $reset(...names: string[]) {
                const nameList = len(names) ? names : Object.keys(elements)
                const values = nameList.map(name => {
                    // @ts-ignore Element implicitly has an 'any' type... (7017)
                    const current = elements[name]
                    return isObject<ModelElement>(current)
                        ? current.value
                        : current
                })

                dispatch(persistent(values))
            },
        } as State["model"]

        for (const name in elements) {
            const current = elements[name]
            let value: any = current
            let util = {}

            if (isObject<ModelElement>(current)) {
                value = current.value
                util = except(current, "value")

                // Run custom parser initially in order to
                // allow it to initialize the value.
                if (current.parse) {
                    value = current.parse(undefined, value)

                    if (__DEV__) {
                        console.warn(
                            "The initial call to a model parser returned undefined." +
                                "You have probably forgot to check for the initial" +
                                "undefined input value or returned nothing."
                        )
                    }
                }

                if (__DEV__) {
                    const supportedProps = ["parse", "validate", "value"]
                    for (const key in current) {
                        if (!supportedProps.includes(key)) {
                            console.error(
                                "Model received an object or array which contains" +
                                    "an unsupported property ${key}. If you are trying" +
                                    "to model an object or array value then pass it" +
                                    "as a value property of a ModelElement."
                            )
                        }
                    }
                }
            }

            utils[name] = util
            model[name] = {
                onChange: v => dispatch(persistent({[name]: v})),
                value,
            } as ModelEntry
        }

        validateModelValues(model, elements, utils)

        return {model, utils}
    }

    return state.model
}

function validateModelValues(
    model: Model<any>,
    values: ModelValues,
    utils: State["utils"]
) {
    const data = model.$data()
    for (const name in values) {
        const entry = model[name]
        entry.error = call(utils[name].validate, entry.value, data)
    }
}

/**
 * This function should be called on any values, before dispatching them.
 * It aims to prevent issues when dispatch is called asynchronously, after
 * an input event has been cleaned up.
 */
function persistent(values: ModelValues<any>) {
    Object.values(values).forEach(v => {
        isSyntheticEvent(v) && v.persist()
    })
    return values
}

export {useModel}
