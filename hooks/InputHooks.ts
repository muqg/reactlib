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
   * This callback allows for custom modifications to the value when retrieving
   * the model's `$data()`, e.g. casting to another type, transforming objects
   * to JSON, etc. This is useful when the expected final value requires an
   * expensive or otherwise unnecessary transformation before submission.
   */
  serialize?: (value: T) => any
  /**
   * Undefined values are transformed into empty strings.
   */
  value: T[K] extends string ? string | undefined : T[K]
  /**
   * Validates a model entry's value.
   * @param value Current value.
   * @param modelValues List of model's most recent values.
   */
  validate?(
    value: T[K],
    model: Omit<Model<T>, "$change" | "$reset" | "$submit" | "$validate">
  ): ValidationError
}

export type ModelEntry<T = any, I = any> = {
  /**
   * This property represents the last error, but not necessarily the latest
   * error. The latter can be obtained via the model's special `$validate()`
   * or `$errors()` methods.
   */
  error: string
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
  _utils: Pick<ModelElement, "parse" | "passive" | "serialize" | "validate">
}

type ModelBase<T extends object> = {
  /**
   * Changes the values of multiple model entries at once.
   * @param values A list of the model names to update and their new values as
   * key/value pairs, respectively.
   */
  $change(values: Partial<T>): void
  /**
   * Returns the modeled data as a list of key/value pairs. Each value is passed
   * through its serialization callback, if available.
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
   * Performs model validation via the own `$validate()` method, and then calls
   * the provided submission callback. The latter will not be called, if there
   * are any errors after the validation, and instead the optional error handler
   * callback will be called.
   *
   * Whenever this method is called, any subsequent calls will be discared,
   * until the first one finishes (including waiting for an asynchronous submit
   * callback).
   *
   * @see `this.$validate()` for more information about the validation performed
   * by this method.
   *
   * @param submit A callback to perform submission of the model's data.
   * @param handleError An optional callback to be invoked when there is a model
   * data validation error.
   */
  $submit<R = any>(
    submit: (data: T) => R,
    handleError?: (errors: Record<keyof T, ValidationError>) => any
  ): R | undefined
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

type ModelState = {
  /**
   * The latest model object.
   */
  latest: Model<{}>
  cache: Partial<{
    data: object | null
    errors: Record<any, ValidationError> | null
    // TODO: Consider using React's upcoming Suspense/Transition API
    // in place of this reference, whenever it is released.
    submitted: boolean
  }>
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
  settings = {} as ModelSettings
): Model<T> {
  const forceUpdate = useForceUpdate()
  const state = useRef<ModelState>({
    latest: null as any,
    cache: {},
  }).current

  if (!state.latest) {
    const commit = () => {
      // This aims to refresh the model object's reference, and thus pretend
      // that the object was not previously mutated. This allows for it to
      // benefit from the best of both worlds when necessary -- for example
      // 'passive' updates mutate the object, without rendering.
      state.latest = {...state.latest}
      forceUpdate()
    }

    const modelSchema = initialStructure()
    const newModel = {
      _data: null,
      _errors: null,

      $change(values: object) {
        const model = state.latest
        const originalPassiveSetting = settings.passive
        settings.passive = true

        Object.keys(values).forEach(name => {
          model[name].onChange(values[name])

          if (__DEV__) {
            if (!(name in modelSchema)) {
              console.error(
                "Attempting to update a model value for name which was " +
                  "not part of the initial structure. There is a typo in " +
                  "your code or you forgot to include a model entry with " +
                  `name ${name}.`
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
        const model = state.latest
        const cached = state.cache.data
        if (cached) {
          return cached
        }

        const values = {}
        Object.keys(modelSchema).forEach(name => {
          const {
            _utils: {serialize},
            value,
          } = model[name]
          values[name] = serialize ? serialize(value) : value
        })

        state.cache.data = values
        return values
      },
      $errors() {
        const model = state.latest
        const cached = state.cache.errors
        if (cached) {
          return cached
        }

        const errors = {}
        Object.keys(modelSchema).forEach(name => {
          const entry: InternalModelEntry = {...model[name]}
          const {validate} = entry._utils
          const error = validate?.(entry.value, this) || ""

          entry.error = error
          if (error) {
            errors[name] = error
          }

          model[name] = entry
        })

        state.cache.errors = errors
        return errors
      },
      $firstError() {
        return Object.values(this.$errors())[0]
      },
      $reset() {
        state.latest = null as any
        forceUpdate()
      },
      async $submit(submit, handleError) {
        // Should not be allowed to be called more than once, unless there was
        // a model change, in which case this variable should have been reset
        // to `false`.
        if (state.cache.submitted) {
          return
        }

        try {
          state.cache.submitted = true

          const errors = this.$validate()
          const hasError = Object.keys(errors).length > 0

          if (hasError) {
            handleError?.(errors)

            if (__DEV__) {
              if (!handleError) {
                console.warn(
                  "Model submission cancelled due to validation errors",
                  errors
                )
              }
            }
          } else {
            const data = this.$data()
            const result = submit(data)

            if (result instanceof Promise) {
              // The submission result is awaited for in order
              // to discard duplicate calls to this method for
              // the entire duration of the submission.
              await result
            }

            return result
          }
        } catch (err) {
          // Method cannot be called a second time until the first call is
          // finished, and therefore no race condition can occur.
          // eslint-disable-next-line require-atomic-updates
          state.cache.submitted = false

          throw err
        }
      },
      $validate() {
        const errors = this.$errors()
        commit()
        return errors
      },
    } as Model<{}>

    // @ts-ignore Sneak in the model object symbol tag past the typings.
    newModel[MODEL_OBJECT_SYMBOL_TAG] = MODEL_OBJECT_SYMBOL_TAG

    Object.keys(modelSchema).forEach(name => {
      newModel[name] = createModelEntry(
        name,
        modelSchema[name],
        (input: any) => {
          const model = state.latest
          const entry = {...model[name]} as InternalModelEntry
          const {parse, passive, validate} = entry._utils

          let value = extractNativeEvent(input)
          if (parse) {
            value = parse(value, entry.value)
          } else if (isParseableInput(value)) {
            value = parseInputValue(value)
          }

          // Nothing has changed, bail out early and
          // skip any other change related actions.
          if (entry.value === value) {
            return
          }

          entry.value = value
          model[name] = entry
          // Model's cache should be cleared on each value change in order
          // to allow its methods to operate properly on the newest data.
          state.cache = {}

          const isPassiveChange =
            passive === undefined ? settings.passive : passive
          if (!isPassiveChange) {
            // This is just a 'quick' validation, and may not be a hundred per
            // cent accurate in rare cases. Full validation is expected to be
            // performed via the model's validation methods.
            entry.error = validate?.(entry.value, model) || ""

            commit()
          }
        }
      )
    })

    state.latest = newModel
  }

  return state.latest as Model<T>
}

function createModelEntry(
  name: string,
  element: ModelStructureValue,
  onChange: (input: any) => void
): InternalModelEntry {
  const utils: InternalModelEntry["_utils"] = {}
  let initialValue = element

  if (isObject<ModelElement>(element)) {
    initialValue = element.value

    const {parse, passive, serialize, validate} = element
    utils.parse = parse
    utils.passive = passive
    utils.serialize = serialize
    utils.validate = validate

    if (__DEV__) {
      const supportedProps = [
        "parse",
        "passive",
        "serialize",
        "validate",
        "value",
      ]
      for (const key in element) {
        if (!supportedProps.includes(key)) {
          console.error(
            `Model received an object or array at key '${name}' which ` +
              `contains an unsupported property ${key}. If you are ` +
              "trying to model an object or array value, then pass it " +
              "as the value property of a ModelElement object."
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

  return {
    name,
    onChange,
    error: "",
    // Allowing undefined values plays badly with the way that React
    // determines whether an input is controlled or uncontrolled.
    value: initialValue === undefined ? "" : initialValue,
    _utils: utils,
  }
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
  val: any
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
  init: T
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
      error: "",
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

      next.value = value

      // This is a workaround that will work in most scenarios, but will probably
      // fail for complex cases, where validation depends on other model values
      // (the second argument).
      next.error = validate?.(value, {} as any) || ""

      return next
    })
  }

  return state as any
}
