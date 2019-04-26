import {useRef} from "react"
import {Dictionary, List, Omit, Serializable, ValidationError} from "../utility"
import {isObject, isType} from "../utility/assertions"
import {except, isEmpty, len} from "../utility/collection"
import {ParseableInput, parseInputValue} from "../utility/dom"
import {call} from "../utility/function"
import {Action, createAction, isSyntheticEvent} from "../utility/react"
import {cast} from "../utility/string"
import {useForceUpdate} from "./useForceUpdate"

const MODEL_OBJECT_SYMBOL_TAG =
    typeof Symbol === "function" ? Symbol("model") : "$$model"

export type ModelInput = ParseableInput | Serializable | Model<object>
export type ModelValueList<T extends object = object> = Dictionary<
    T,
    T[keyof T]
>

interface ModelState {
    // Attempts to prevent unnecessary validation.
    hasChanged: boolean
    model: Model<any>
    utils: List<Omit<ModelElement<any>, "value">>
}

type ModelAction =
    | Action<ModelValueList<any>, "change">
    | Action<undefined, "validate">

export interface ModelElement<T extends object = object> {
    /**
     * A custom parser for when value changes.
     * @param input Current input value. Note that parser is called initially
     * with input value as undefined.
     * @param prev The previous value.
     */
    parse?(input: any | undefined, prev: any): Serializable
    /**
     * Undefined values are transformed into empty strings.
     */
    value?: T[keyof T]
    /**
     * Validates a model entry's value.
     * @param value Current value.
     * @param modelValues List of model's most recent values.
     */
    validate?(value: any, modelValues: ModelValueList<T>): ValidationError
}

export interface ModelEntry {
    /**
     * Errors should not be accessed directly for vlidation via this property,
     * since it may not be in sync with the current value. Use the model's special
     * $errors method instead.
     */
    error?: ValidationError
    /**
     * Model entry's name.
     */
    name: string
    /**
     * Performs validation of model's data.
     */
    onBlur: () => void
    /**
     * Changes a model entry's value.
     */
    onChange: (input: ModelInput) => void
    /**
     * Model entry's current value.
     */
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
     * Returns a list of model errors. Note that this method performs
     * a fresh validation in place and may therefore be expensive and
     * avoid being called repeatedly.
     */
    $errors(): Dictionary<T, ValidationError>
    /**
     * Returns the first error from the model's error list. This method calls
     * $errors() method internally and may therefore be expensive and void
     * being called repeatedly.
     */
    $firstError(): ValidationError
    /**
     * Resets the values for the given names to their initial values.
     * If no names are given then all model values are reset.
     */
    $reset(...names: Array<keyof T>): void
}

/**
 * A model instance maps form and other values to a predefined object structure.
 * @param initialElements Initial model structure.
 * @param binder A binder function which is called whenever the model should
 * update. If it is present then the model will not update its owner component
 * and instead pass the model instance to the binder and let it decide when and
 * how to update.
 *
 * This is useful when model model instances from children have
 * to be mirrored (chained) to a value of a parent model.
 */
export function useModel<T extends object>(
    initialElements: () => Partial<
        Dictionary<T, string | boolean | number | null | ModelElement<T>>
    >,
    binder?: (model: Model<T>) => void
): Model<T> {
    const forceUpdate = useForceUpdate()
    const state = useRef({} as ModelState)

    if (isEmpty(state.current)) {
        const dispatch = (action: ModelAction) => {
            state.current = reducer(state.current, action)

            if (binder) {
                // Skip update and let the binder do all the hard work.
                binder(state.current.model)
            } else {
                forceUpdate()
            }
        }

        const elements = initialElements()
        const utils: ModelState["utils"] = {}
        const model = {
            $change(values: ModelValueList<any>) {
                dispatch(modelChangeAction(values))
            },
            $data() {
                const values: any = {}
                for (const name in utils) {
                    values[name] = this[name].value
                }
                return values
            },
            $errors() {
                const data = this.$data()
                const errors: any = {}
                for (const name in utils) {
                    const entry = this[name]
                    const err = call(utils[name].validate, entry.value, data)
                    if (err) {
                        errors[name] = err
                    }
                }
                return errors
            },
            $firstError() {
                return Object.values(this.$errors())[0]
            },
            $reset(...names: string[]) {
                const nameList = len(names) ? names : Object.keys(elements)
                const values: any = {}

                for (const name of nameList) {
                    // @ts-ignore Element implicitly has an 'any' type... (7017)
                    const current = elements[name]
                    const value = isObject<ModelElement>(current)
                        ? current.value
                        : current

                    values[name] = value === undefined ? "" : value
                }

                dispatch(modelChangeAction(values))
                dispatch(modelValidateAction())
            },
        } as Model<any>
        // @ts-ignore Sneak in the model object symbol tag past the typings.
        model[MODEL_OBJECT_SYMBOL_TAG] = MODEL_OBJECT_SYMBOL_TAG

        for (const name in elements) {
            const currentElement = elements[name]
            let initialValue: any = currentElement
            let util = {}

            if (isObject<ModelElement>(currentElement)) {
                initialValue = currentElement.value
                util = except(currentElement, "value")

                // Run custom parser initially in order to
                // allow it to initialize the value.
                if (currentElement.parse) {
                    initialValue = currentElement.parse(undefined, initialValue)

                    if (__DEV__) {
                        if (initialValue === undefined) {
                            console.error(
                                `The initial call to a model parser with name [${name}] ` +
                                    "returned undefined. You have probably forgot to " +
                                    "check for the initial undefined input value or " +
                                    "returned nothing."
                            )
                        }
                    }
                }

                if (__DEV__) {
                    const supportedProps = ["parse", "validate", "value"]
                    for (const key in currentElement) {
                        if (!supportedProps.includes(key)) {
                            console.error(
                                "Model received an object or array which contains " +
                                    `an unsupported property ${key}. If you are trying ` +
                                    "to model an object or array value then pass it " +
                                    "as a value property of a ModelElement."
                            )
                        }
                    }
                }
            }

            if (__DEV__) {
                if (name.startsWith("$")) {
                    console.warn(
                        "The model should not contain entries with names starting with " +
                            "a dollar sign $, which is used to designate special model " +
                            "properties and may therefore lead to unexpected behaviour."
                    )
                }
            }

            utils[name] = util
            model[name] = {
                name,
                onBlur: () => dispatch(modelValidateAction()),
                onChange: v => dispatch(modelChangeAction({[name]: v})),
                // Allowing undefined values plays badly with the way that React
                // determines whether an input is controlled or uncontrolled.
                value: initialValue === undefined ? "" : initialValue,
            } as ModelEntry
        }

        state.current = {
            model,
            utils,
            hasChanged: true,
        }
    }

    return state.current.model
}

function reducer(state: ModelState, action: ModelAction): ModelState {
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
                const entry = {...model[name]}
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
                } else if (isModelObject(value)) {
                    value = value.$data()
                }

                entry.value = value
                model[name] = entry

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

            return {
                ...state,
                model,
                hasChanged: true,
            }
        }
        case "validate": {
            if (!state.hasChanged) {
                return state
            }

            const model = {...state.model}
            const data = model.$data()

            for (const name in utils) {
                const entry = {...model[name]}
                entry.error = call(
                    utils[name].validate,
                    model[name].value,
                    data
                )
                model[name] = entry
            }

            return {
                ...state,
                model,
                hasChanged: false,
            }
        }
        default: {
            if (__DEV__) {
                throw "Dispatched invalid model action"
            }
            return state
        }
    }
}

function modelChangeAction(values: ModelValueList<any>) {
    // This aims to prevent issues when dispatch is called asynchronously, after
    // an input event has been cleaned up, by persisting any input synthetic events.
    Object.values(values).forEach(v => isSyntheticEvent(v) && v.persist())

    return createAction("change", values)
}

function modelValidateAction() {
    return createAction("validate", undefined)
}

function isModelObject<T extends object = object>(val: any): val is Model<T> {
    return (
        isObject<any>(val) &&
        MODEL_OBJECT_SYMBOL_TAG in val &&
        // Works perfectly fine without typings in javascript.
        val[MODEL_OBJECT_SYMBOL_TAG] === MODEL_OBJECT_SYMBOL_TAG
    )
}
