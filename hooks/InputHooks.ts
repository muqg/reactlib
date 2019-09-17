import {useRef, useState} from "react"
import {Action, Serializable, ValidationError} from "../utility"
import {isObject} from "../utility/assertions"
import {isEmpty, len} from "../utility/collection"
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

type ModelAction = Action<"change", object> | Action<"validate">

export interface ModelElement<
  T extends object = object,
  K extends keyof T = any,
  I = any
> {
  /**
   * A custom parser for when value changes. It is called on initialization with
   * both input and previous value equal to the initial value of the element.
   * @param input Current input value.
   * @param prev The previous value.
   */
  parse?(input: I, prev: T[K]): T[K]
  /**
   * Undefined values are transformed into empty strings.
   */
  value: T[K] extends string ? string | undefined : T[K]
  /**
   * Validates a model entry's value.
   * @param value Current value.
   * @param modelValues List of model's most recent values.
   */
  validate?(value: T[K], modelValues: T): ValidationError
}

export type ModelEntry<T = any, I = any> = {
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
  onChange: (input: I) => void
  /**
   * Model entry's current value.
   */
  value: T
}

type InternalModelEntry = ModelEntry & {
  _utils: Pick<ModelElement, "parse" | "validate">
}

type ModelBase<T extends object> = {
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
   * Returns a list of model errors. While it does not cause a render, it
   * revalidates all model entries on each call and may sometimes lead to
   * performance issues, if called too frequently on large models.
   *
   * If you would like to obtain the error list and re-render the component,
   * refer to `model.$validate()` method.
   */
  $errors(): Record<keyof T, ValidationError>
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
   * Performs validation of model's data and updates errors for all entries,
   * causing a re-render.
   *
   * If you would like to obtain the error list, without re-rendering then
   * refer to `model.$errors()` method.
   */
  $validate(): Record<keyof T, ValidationError>
}

export type Model<T extends object> = ModelBase<T> &
  Required<
    {
      readonly [K in keyof T]: Readonly<
        ModelEntry<
          T[K] extends ModelElement<infer U> ? U : T[K],
          T[K] extends ModelElement<any, any, infer U> ? U : any
        >
      >
    }
  >

type InternalModel<T extends object = object> = ModelBase<T> &
  Required<Record<keyof T, InternalModelEntry>> & {_validated: boolean}

export type ModelInit<T extends object> = () => {
  [K in keyof T]?: T[K] | ModelElement<T, K>
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
  initialStructure: ModelInit<T>,
  settings = {} as ModelSettings,
): Model<T> {
  const forceUpdate = useForceUpdate()
  const model = useRef({} as InternalModel)

  if (isEmpty(model.current)) {
    const dispatch = (action: ModelAction) => {
      const nextState = reducer(model.current, action)
      // Bail out similarly to how useReducer would do it.
      if (nextState === model.current) {
        return
      }

      model.current = nextState
      forceUpdate()
    }

    const modelSchema = initialStructure()
    const newModel = {
      $change(values: T) {
        dispatch(modelChangeAction(values))
      },
      $data() {
        const values: any = {}
        Object.keys(modelSchema).forEach(name => {
          const currentValue = this[name].value
          // Retrieve data of nested models instead of the model itself.
          values[name] = isModelObject(currentValue)
            ? currentValue.$data()
            : currentValue
        })

        return values
      },
      $errors() {
        const validated = reducer(this, {type: "validate", value: null})

        const errors: any = {}
        Object.keys(modelSchema).forEach(name => {
          const currentError = validated[name as any].error
          if (currentError) {
            errors[name] = currentError
          }
        })

        return errors
      },
      $firstError() {
        return Object.values(this.$errors())[0]
      },
      $reset() {
        Object.keys(modelSchema).forEach(name => {
          if (isModelObject(this[name].value)) {
            this[name].value.$reset()
          }
        })

        model.current = {} as InternalModel
        forceUpdate()
      },
      $validate() {
        dispatch({type: "validate", value: null})
        return this.$errors()
      },
    } as InternalModel<any>
    // @ts-ignore Sneak in the model object symbol tag past the typings.
    newModel[MODEL_OBJECT_SYMBOL_TAG] = MODEL_OBJECT_SYMBOL_TAG

    for (const name in modelSchema) {
      const utils: InternalModelEntry["_utils"] = {}
      const currentElement = modelSchema[name]
      let initialValue: any = currentElement

      if (isObject<ModelElement>(currentElement)) {
        initialValue = currentElement.value

        utils.parse = currentElement.parse
        utils.validate = currentElement.validate

        // Run custom parser initially in order to allow
        // it to perform initialization on the value.
        if (currentElement.parse) {
          // Parsers should not be called with undefined values.
          const value = initialValue === undefined ? "" : initialValue
          initialValue = currentElement.parse(value, value)

          if (__DEV__) {
            if (initialValue === undefined) {
              console.error(
                `The initial call to a model parser with name [${name}] ` +
                  "returned undefined. You have probably forgot to " +
                  "return a value.",
              )
            }
          }
        }

        if (__DEV__) {
          const supportedProps = ["parse", "validate", "value"]
          for (const key in currentElement) {
            if (!supportedProps.includes(key)) {
              console.error(
                `Model received an object or array at key '${name}' which ` +
                  `contains an unsupported property ${key}. If you are ` +
                  "trying to model an object or array value, then pass it " +
                  "as the value property of a ModelElement object.",
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

      newModel[name] = {
        name,
        onChange: v => dispatch(modelChangeAction({[name]: v})),
        // Allowing undefined values plays badly with the way that React
        // determines whether an input is controlled or uncontrolled.
        value: initialValue === undefined ? "" : initialValue,
        _utils: utils,
      } as InternalModelEntry
    }

    model.current = newModel
  }

  if (settings.binder) {
    settings.binder.value = model.current as any
    // Should not allow direct change to binder's value.
    settings.binder.onChange = binderOnChangeNoopFunction
  }
  return model.current as any
}

function reducer(model: InternalModel, action: ModelAction): InternalModel {
  switch (action.type) {
    case "change": {
      const values = action.value
      // Bail out of rendering if there are no values to update.
      if (!len(values)) {
        return model
      }

      const nextModel = {...model}
      for (const name in values) {
        const entry = {...nextModel[name]} as InternalModelEntry
        const {parse, validate} = entry._utils

        let value = values[name]
        if (parse) {
          value = parse(value, entry.value)
        } else if (isParseableInput(value)) {
          value = parseInputValue(value)
        }
        entry.value = value

        // Attempt to perform simple validation in place. Complex validation
        // that requires other model properties can only be performed via the
        // special validation methods.
        if (validate) {
          try {
            entry.error = validate(entry.value, {})
          } catch (err) {
            if (__DEV__) {
              console.error(err)
            }
            entry.error = ""
          }
        }

        nextModel[name] = entry

        if (__DEV__) {
          if (!(name in nextModel)) {
            console.error(
              "Attempting to update a model value for name which was " +
                "not part of the initial structure. There is a typo in " +
                "your code or you forgot to include a model entry with " +
                `name ${name}.`,
            )
          }
        }
      }

      nextModel._validated = false
      return nextModel
    }
    case "validate": {
      if (model._validated) {
        return model
      }

      const nextModel = {...model}
      const data = nextModel.$data()

      for (const name in data) {
        const entry: InternalModelEntry = {
          ...nextModel[name],
          error: null,
        }

        const {validate} = entry._utils
        const {value} = nextModel[name]
        if (validate) {
          entry.error = validate(value, data)
        } else if (isModelObject(value)) {
          entry.error = value.$firstError()
        }

        nextModel[name] = entry
      }

      nextModel._validated = true
      return nextModel
    }
    default: {
      if (__DEV__) {
        throw "Dispatched invalid model action"
      }
      return model
    }
  }
}

function modelChangeAction(values: object): Action<"change", object> {
  // Replace SyntheticEvents with their native representations. On one hand this
  // is due to the fact that the default parser works best with native events,
  // while on the other hand SyntheticEvents have to be persisted anyway since
  // that the update can be delayed at any time and the SyntheticEvent object
  // could be cleaned up and reused.
  Object.keys(values).forEach(
    name => (values[name] = extractNativeEvent(values[name])),
  )

  return {type: "change", value: values}
}

function extractNativeEvent(input: any) {
  if (input && typeof input.nativeEvent === "object") {
    return input.nativeEvent
  }
  return input
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
  if (!isObject<any>(input)) {
    return false
  }

  return input instanceof Element || input.target instanceof Element
}

// =============================================================================

type InputValueInit = ParseableInput | Serializable

/**
 * Model for a single input value.
 *
 * Can be linked to an entry of useModel. If so then it will passively update
 * the entry's value, without causing it to rerender and thus limiting updates
 * to the current component and below. Changes on the model entry are also
 * reflected on the input value, meaning that the binding is two-way.
 *
 * @param data A valid model entry or the initial modelling structure.
 */
export function useInputValue<T extends InputValueInit | ModelEntry>(
  init: T,
): T extends ModelEntry
  ? ModelEntry
  : {onChange: ModelEntry["onChange"]; value: T} {
  const data = init as InputValueInit | InternalModelEntry
  const prevModelEntry = useRef<InternalModelEntry | null>(null)

  const [state, setState] = useState<InternalModelEntry>(() => {
    if (isObject(data) && "_utils" in data) {
      return data
    }

    return {
      _utils: {},
      name: "",
      onChange: () => {},
      value: data === undefined ? "" : data,
    }
  })

  // Map from model to current state and from current state to model,
  // based on which changed since last render.
  if (isObject(data) && "_utils" in data) {
    // Model entries are memoized, unless some of their data has changed, and
    // then a new object will have been created and passed here.
    if (data !== prevModelEntry.current) {
      prevModelEntry.current = data
      setState(data)
    } else {
      data.value = state.value
      data.error = state.error
    }
  }

  // It is redundant to memoize this since the idea of this hook is to be used
  // in leaf components and map to a Model above. This means that this hook
  // itself is intended to be used from within memoized components.
  state.onChange = (input: any) => {
    input = extractNativeEvent(input)

    setState(current => {
      let value = input
      const next = {...current}

      const {parse, validate} = current._utils
      if (parse) {
        value = parse(input, value || input)
      } else if (isParseableInput(input)) {
        value = parseInputValue(input)
      }

      // This is a workaround that will work in most scenarios, but will probably
      // fail for complex cases, where validation depends on other model values
      // (the second argument).
      if (validate) {
        try {
          next.error = validate(value, {})
        } catch (err) {
          if (__DEV__) {
            console.error(err)
          }
          next.error = ""
        }
      }

      next.value = value

      return next
    })
  }

  return state as any
}
