import {useRef, useState} from "react"
import {Serializable, ValidationError} from "../utility"
import {isObject} from "../utility/assertions"
import {ParseableInput, parseInputValue} from "../utility/dom"
import {useForceUpdate} from "./useForceUpdate"

const MODEL_OBJECT_SYMBOL_TAG =
  typeof Symbol === "function" ? Symbol("model") : "$$model"

export type ModelInput = ParseableInput | Serializable | Model<object>

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
   * Whether changes to the value will happen passively, without causing the
   * owner component to render. Should be set to `true` for uncontrolled inputs.
   *
   * _Using this option improperly could possibly lead to modelled and rendered
   * value mismatch._
   */
  passive?: boolean
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
  _utils: Pick<ModelElement, "parse" | "passive" | "validate">
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
   * Performs validation and returns a list of model errors without forcing a
   * component render.
   *
   * If you would like to obtain the error list and render the component,
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
   * Performs validation and returns a list of model errors while also forcing
   * a component to render. This render will be forced regardless of the
   * `passive` setting.
   *
   * If you would like to obtain the error list, without rendering then
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
  Required<Record<keyof T, InternalModelEntry>> & {
    _errors: Record<keyof T, ValidationError> | null
  }

type ModelPrimitive = string | boolean | number | null
type ModelStructureValue<
  T extends object = any,
  K extends keyof T = any
> = T[K] extends ModelPrimitive ? T[K] | ModelElement<T, K> : ModelElement<T, K>

export type ModelStructure<T extends object = any> = () => {
  [K in keyof T]?: ModelStructureValue<T, K>
}

export interface ModelSettings {
  /**
   * Passive models don't cause renders when changed and can be used to model
   * uncontrolled inputs. This setting can be overriden for each model entry
   * individually in the initial structure.
   *
   * _This setting should be used with caution for it may lead to modelled and
   * rendered data mismatch, if used improperly._
   */
  passive?: boolean
}

/**
 * A model instance maps form and other values to a predefined object structure.
 * @param initialStructure Initial model structure.
 * @param settings Model settings.
 */
export function useModel<T extends object>(
  initialStructure: ModelStructure<T>,
  settings = {} as ModelSettings,
): Model<T> {
  const forceUpdate = useForceUpdate()
  const latest = useRef<InternalModel<any>>(null as any)

  if (!latest.current) {
    const commit = () => {
      latest.current = {...latest.current}
      forceUpdate()
    }

    const modelSchema = initialStructure()
    const newModel = {
      _errors: null,

      $change(values: object) {
        const originalPassiveSetting = settings.passive
        settings.passive = true

        Object.keys(values).forEach(name => {
          latest.current[name].onChange(values[name])

          if (__DEV__) {
            if (!(name in modelSchema)) {
              console.error(
                "Attempting to update a model value for name which was " +
                  "not part of the initial structure. There is a typo in " +
                  "your code or you forgot to include a model entry with " +
                  `name ${name}.`,
              )
            }
          }
        })

        settings.passive = originalPassiveSetting

        if (!settings.passive) {
          commit()
        }
      },
      $data() {
        const values: any = {}
        Object.keys(modelSchema).forEach(name => {
          values[name] = latest.current[name].value
        })

        return values
      },
      $errors() {
        const cached = latest.current._errors
        if (cached) {
          return cached
        }

        const errors: Record<any, string> = {}
        const data = latest.current.$data()

        Object.keys(modelSchema).forEach(name => {
          const entry: InternalModelEntry = {
            ...latest.current[name],
            error: null,
          }

          const {validate} = entry._utils
          if (validate) {
            const error = validate(entry.value, data)
            entry.error = error

            if (error) {
              errors[name] = error
            }
          }

          latest.current[name] = entry
        })

        latest.current._errors = errors

        return errors
      },
      $firstError() {
        return Object.values(this.$errors())[0]
      },
      $reset() {
        latest.current = null as any
        forceUpdate()
      },
      $validate() {
        const errors = this.$errors()
        commit()
        return errors
      },
    } as InternalModel

    // @ts-ignore Sneak in the model object symbol tag past the typings.
    newModel[MODEL_OBJECT_SYMBOL_TAG] = MODEL_OBJECT_SYMBOL_TAG

    Object.keys(modelSchema).forEach(name => {
      newModel[name] = createModelEntry(
        name,
        modelSchema[name],
        (input: any) => {
          const entry = {...latest.current[name]} as InternalModelEntry
          const {parse, passive, validate} = entry._utils

          let value = input
          if (parse) {
            value = parse(value, entry.value)
          } else if (isParseableInput(value)) {
            value = parseInputValue(value)
          }

          if (entry.value !== value) {
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

            latest.current[name] = entry
            latest.current._errors = null

            if (passive === undefined) {
              if (!settings.passive) {
                commit()
              }
            } else if (!passive) {
              commit()
            }
          }
        },
      )
    })

    latest.current = newModel
  }

  return latest.current as any
}

function createModelEntry(
  name: string,
  element: ModelStructureValue,
  onChange: (input: any) => void,
) {
  const utils: InternalModelEntry["_utils"] = {}
  let initialValue: any = element

  if (isObject<ModelElement>(element)) {
    initialValue = element.value

    const {parse, passive, validate} = element
    utils.parse = parse
    utils.validate = validate
    utils.passive = passive

    // Run custom parser initially in order to allow
    // it to perform initialization on the value.
    if (parse) {
      // Parsers should not be called with undefined values.
      const value = initialValue === undefined ? "" : initialValue
      initialValue = parse(value, value)

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
      for (const key in element) {
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

  return {
    name,
    onChange,
    // Allowing undefined values plays badly with the way that React
    // determines whether an input is controlled or uncontrolled.
    value: initialValue === undefined ? "" : initialValue,
    _utils: utils,
  } as InternalModelEntry
}

function extractNativeEvent(input: any) {
  if (input && typeof input.nativeEvent === "object") {
    return input.nativeEvent
  }
  return input
}

function isParseableInput(input: any): input is ParseableInput {
  if (!isObject<any>(input)) {
    return false
  }

  return input instanceof Element || input.target instanceof Element
}

export function isModelObject<T extends object = object>(
  val: any,
): val is Model<T> {
  return (
    isObject<any>(val) &&
    MODEL_OBJECT_SYMBOL_TAG in val &&
    // Works perfectly fine without typings in javascript.
    val[MODEL_OBJECT_SYMBOL_TAG] === MODEL_OBJECT_SYMBOL_TAG
  )
}

// =============================================================================

type InputValueInit = ParseableInput | Serializable

/**
 * THIS HOOK MAY BE UNSTABLE FOR PRODUCTION USE.
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
