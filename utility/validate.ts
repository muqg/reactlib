import {call} from "./function"
import {Dictionary} from "./type"

export type ValidationError = string | undefined | void | null

/**
 * Validates an object of values.
 * @param values Value map.
 * @param validators A map of value validator functions.
 */
function validate<T extends object>(
  values: T,
  validators: Partial<
    Dictionary<T, (value: any, values: T) => ValidationError>
  >,
): Partial<Dictionary<T, ValidationError>> {
  const errors: Partial<Dictionary<T, ValidationError>> = {}
  for (const name in values) {
    if (name in validators) {
      const res = call(validators[name], values[name], values)
      if (res) {
        errors[name] = res
      }
    }
  }

  return errors
}

export {validate}
