import {useRef} from "react"
import {
  Action,
  Dictionary,
  List,
  Serializable,
  ValidationError,
} from "../utility"
import {isObject, isType} from "../utility/assertions"
import {except, isEmpty, len} from "../utility/collection"
import {ParseableInput, parseInputValue} from "../utility/dom"
import {useForceUpdate} from "./useForceUpdate"

const MODEL_OBJECT_SYMBOL_TAG =
  typeof Symbol === "function" ? Symbol("model") : "$$model"

const binderOnChangeNoopFunction = () => {
  if (__DEV__) {
    console.error(
      "Called onChange on model entry with model instance bound ot its value",
    )
  }
}

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

type ModelAction = Action<"change", ModelValueList<any>> | Action<"validate">

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
   * Returns a list of model errors.
   *
   * It re-validates the model, if a value has changed, and thus forces a
   * re-render. Only returns a list of the errors, if no value has changed
   * since the last validation.
   */
  $errors(): Dictionary<T, ValidationError>
  /**
   * Returns the first error from the model's error list.
   *
   * It calls the `model.$errors()` method internally.
   * Refer to it for more information.
   */
  $firstError(): ValidationError
  /**
   * Destroys the existing model instance and creates a new
   * one, as if the model hook is called for the first time.
   */
  $reset(): void
  /**
   * Performs validation of model's data and updates errors for all entries.
   * It will not do anything if the model has not changed, and will therefore
   * not cause a render.
   */
  $validate(): void
}

export interface ModelSettings {
  /**
   * A model entry to bind the current model instance to.
   *
   * The model is bound by mutating the binder's value, therefore not
   * causing a render on higher level than necessary. Method calls on the
   * binder's model such as `$reset`, `$validate`, etc. will also be called
   * on any bound model and thus making them act as a single, big model.
   */
  binder?: ModelEntry
}

/**
 * A model instance maps form and other values to a predefined object structure.
 * @param initialStructure Initial model structure.
 * @param settings Model settings.
 */
export function useModel<T extends object>(
  initialStructure: () => Partial<
    Dictionary<T, string | boolean | number | null | ModelElement<T>>
  >,
  settings = {} as ModelSettings,
): Model<T> {
  const forceUpdate = useForceUpdate()
  const state = useRef({} as ModelState)

  if (isEmpty(state.current)) {
    const dispatch = (action: ModelAction) => {
      const nextState = reducer(state.current, action)
      // Bail out similarly to how useReducer would do it.
      if (nextState === state.current) {
        return
      }

      state.current = nextState
      forceUpdate()
    }

    const modelSchema = initialStructure()
    const utils: ModelState["utils"] = {}
    const model = {
      $change(values: ModelValueList<any>) {
        dispatch(modelChangeAction(values))
      },
      $data() {
        const values: any = {}
        for (const name in utils) {
          const currentValue = this[name].value
          // Retrieve data of nested models instead of the model itself.
          values[name] = isModelObject(currentValue)
            ? currentValue.$data()
            : currentValue
        }
        return values
      },
      $errors() {
        this.$validate()

        const errors: any = {}
        for (const name in utils) {
          // Access the newly updated errors from state since `this`
          // instance may lo longer be the most recent one.
          const currentError = state.current.model[name].error
          if (currentError) {
            errors[name] = currentError
          }
        }
        return errors
      },
      $firstError() {
        return Object.values(this.$errors())[0]
      },
      $reset() {
        for (const name in modelSchema) {
          if (isModelObject(this[name].value)) {
            this[name].value.$reset()
          }
        }

        state.current = {} as ModelState
        forceUpdate()
      },
      $validate() {
        dispatch({type: "validate", value: null})
      },
    } as Model<any>
    // @ts-ignore Sneak in the model object symbol tag past the typings.
    model[MODEL_OBJECT_SYMBOL_TAG] = MODEL_OBJECT_SYMBOL_TAG

    for (const name in modelSchema) {
      const currentElement = modelSchema[name]
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
                  "returned nothing.",
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
                  "as a value property of a ModelElement.",
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
              "properties and may therefore lead to unexpected behaviour.",
          )
        }
      }

      utils[name] = util
      model[name] = {
        name,
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

  if (settings.binder) {
    settings.binder.value = state.current.model
    // Should not allow direct change to binder's value.
    settings.binder.onChange = binderOnChangeNoopFunction
  }
  return state.current.model as Model<T>
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
        } else if (isParseableInput(value)) {
          value = parseInputValue(value)
        }

        entry.value = value
        model[name] = entry

        if (__DEV__) {
          if (!(name in model)) {
            console.error(
              "Attempting to update a model value for name which was " +
                "not part of the initial structure. There is a typo in " +
                "your code or you forgot to include a model entry with " +
                `name ${name}.`,
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
        const entry: ModelEntry = {
          ...model[name],
          error: null,
        }

        const {validate} = utils[name]
        const {value} = model[name]
        if (validate) {
          entry.error = validate(value, data)
        } else if (isModelObject(value)) {
          entry.error = value.$firstError()
        }

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

function modelChangeAction(
  values: ModelValueList<any>,
): Action<"change", ModelValueList<any>> {
  // Replace SyntheticEvents with their native representations. On one hand this
  // is due to the fact that the default parser works best with native events,
  // while on the other hand SyntheticEvents have to be persisted anyway since
  // that the update can be delayed at any time and the SyntheticEvent object
  // could be cleaned up and reused.
  for (const name of Object.keys(values)) {
    const current = values[name]
    if (typeof current.nativeEvent === "object") {
      values[name] = current.nativeEvent
    }
  }

  return {type: "change", value: values}
}

function isModelObject<T extends object = object>(val: any): val is Model<T> {
  return (
    isObject<any>(val) &&
    MODEL_OBJECT_SYMBOL_TAG in val &&
    // Works perfectly fine without typings in javascript.
    val[MODEL_OBJECT_SYMBOL_TAG] === MODEL_OBJECT_SYMBOL_TAG
  )
}

function isParseableInput(input: any): input is ParseableInput {
  return isType<ParseableInput>(
    input,
    v => v instanceof Event || v instanceof Element,
  )
}
