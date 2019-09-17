import {isType} from "../assertions"

export type ParseableElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | HTMLButtonElement
export type ParseableInput =
  | React.ChangeEvent<ParseableElement>
  | ParseableElement

type ParseableValue = ParseableInput | boolean | string | number

/**
 * Parses an input value.
 * @param input The input change event or target element to parse the value of.
 */
export function parseInputValue(input: ParseableValue): string {
  let value: string

  if (typeof input === "object") {
    const element = input instanceof Element ? input : input.target
    value = element.value

    // Parse checkbox and radio button.
    if (isType<HTMLInputElement>(element, () => element.type === "checkbox")) {
      value = element.checked ? "true" : "false"
    }
    // Parse multiple selects.
    else if (element instanceof HTMLSelectElement && element.multiple) {
      value = Object.values(element.options)
        .filter(o => o.selected)
        .map(o => o.value)
        .join(",")
    }
  } else {
    value = input.toString()
  }

  return value
}

/**
 * Returns the input string or string value of ChangeEvent/HTMLElement with
 * newlines removed. Useful for TextAreas or other multiline input elements,
 * such as contenteditables, where only the vertical visual space is needed and
 * newlines are undesired.
 *
 * @param input A valid string, ChangeEvent (including React synthetic), or
 * HTML Select, Input or TextArea element.
 */
export function parseNoNewlineString(input: ParseableValue) {
  return parseInputValue(input).replace(/\n+/g, "")
}

/**
 * Returns the result of a valid React.SetStateAction (BasicStateReducer).
 * More information at:
 * https://github.com/facebook/react/blob/3af05de1aaed309f8146bc53f9a4b4d785abdd3f/packages/react-reconciler/src/ReactFiberHooks.js#L631
 *
 * @param input A valid React.SetStateAction
 * @param current The current state value.
 */
export function parseSetStateAction<T>(
  input: React.SetStateAction<T>,
  current: T,
): T {
  return input instanceof Function ? input(current) : input
}
