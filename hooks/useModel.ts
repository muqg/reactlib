import {useReducer} from "react"
import {Dictionary, List, Omit, Serializable, ValidationError} from "../utility"
import {isObject} from "../utility/assertions"
import {except, len} from "../utility/collection"
import {ParseableInput} from "../utility/dom"
import {call} from "../utility/function"
import {
    modelChangeAction,
    modelHookReducer,
    modelValidateAction,
} from "../__internal__/modelHookReducer"

export type ModelInput = ParseableInput | Serializable
export type ModelValueList<T extends object = object> = Dictionary<
    T,
    T[keyof T]
>
export type ModelUtils = List<Omit<ModelElement<any>, "value">>

export interface ModelElement<T extends object = object> {
    /**
     * A custom parser for when value changes.
     * @param input Current input value. Note that parser is called initially
     * with input value as undefined.
     * @param prev The previous value.
     */
    parse?(input: any | undefined, prev: any): Serializable
    value?: T[keyof T]
    validate?(value: any, modelValues: ModelValueList<T>): ValidationError
}

export interface ModelEntry {
    /**
     * Errors should not be accessed directly for vlidation via this property,
     * since it may not be in sync with the current value. Use the model's special
     * $errors method instead.
     */
    error?: ValidationError
    onBlur: () => void
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

function useModel<T extends object>(
    initialElements: () => Partial<
        Dictionary<T, string | boolean | number | null | ModelElement<T>>
    >
): Model<T> {
    const [state, dispatch] = useReducer(modelHookReducer, {}, initialize)

    function initialize() {
        const elements = initialElements()

        const utils: ModelUtils = {}
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
                    values[name] = isObject<ModelElement>(current)
                        ? current.value
                        : current
                }

                dispatch(modelChangeAction(values))
                dispatch(modelValidateAction())
            },
        } as Model<any>

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
                            console.warn(
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
                                    "an unsupported property ${key}. If you are trying " +
                                    "to model an object or array value then pass it " +
                                    "as a value property of a ModelElement."
                            )
                        }
                    }
                }
            }

            utils[name] = util
            model[name] = {
                onBlur: () => dispatch(modelValidateAction()),
                onChange: v => dispatch(modelChangeAction({[name]: v})),
                value: initialValue,
            } as ModelEntry
        }

        return {model, utils, hasChanged: true}
    }

    return state.model
}

export {useModel}
