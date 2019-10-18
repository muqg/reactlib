import {Dict} from "../utility"
import {isArray, isString} from "../utility/assertions"
import {pull} from "../utility/collection"
import {format, FormatArgument, plural} from "../utility/string"

export interface TranslateOptions {
  /**
   * Arguments to format the text with.
   */
  args?: Dict<FormatArgument> | FormatArgument[]
  /**
   * The number to be used when pluralizing the text. Pluralization format
   * inside the text is singular|plural. It is performed after formatting,
   * which allows for dynamic inclusion of pluralizable text.
   */
  count?: number
}

function translate<T extends any = string>(
  translations: Dict<any>,
  key: string,
  options: TranslateOptions,
): T {
  let result = pull(translations, key) || key

  if (__DEV__) {
    if (result === key) {
      console.error("No translation value found for key: " + key)
    }
  }

  if (isString(result) && options) {
    if (options.args) {
      if (isArray(options.args)) {
        result = format(result, ...options.args)
      } else {
        result = format(result, options.args)
      }
    }

    if (options.count !== undefined) {
      result = plural(result, options.count)
    }
  }

  return result
}

export {translate}
