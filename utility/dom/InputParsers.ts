import {findParentWithClass} from "."
import {isObject, isType} from "../assertions"

export type ParseableElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | HTMLButtonElement
export type ParseableInput =
  | React.ChangeEvent<ParseableElement>
  | ParseableElement

/**
 * Parses an input value.
 * @param input The input change event or target element to parse the value of.
 */
export function parseInputValue(input: ParseableInput): string {
  const element = isObject(input, Element) ? input : input.target
  let value = element.value

  // TODO: Remove this after reworking Select and MultipleSelect to work
  // with callbacks of type (name: string, value: string) => void
  const parentSelect = findParentWithClass(element, "l_select")
  if (
    parentSelect &&
    isType<HTMLInputElement>(
      element,
      () => element.type === "checkbox" || element.type === "radio",
    )
  ) {
    // TODO: Lib | Better Model for multiple Select.
    if (parentSelect.classList.contains("multiple")) {
      const checked = parentSelect.querySelectorAll<HTMLInputElement>(
        ":checked",
      )
      value = Object.values(checked)
        .map(c => c.value)
        .join(",")
    }
  }
  // Parse checkbox and radio button.
  else if (
    isType<HTMLInputElement>(element, () => element.type === "checkbox")
  ) {
    value = element.checked ? "true" : "false"
  }
  // Parse multiple selects.
  else if (isObject(element, HTMLSelectElement) && element.multiple) {
    value = Object.values(element.options)
      .filter(o => o.selected)
      .map(o => o.value)
      .join(",")
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
export function parseNoNewlineString(input: any) {
  if (typeof input === "object") {
    if (typeof input.target === "object") {
      input = input.target
    }
    if (typeof input.value === "string") {
      input = input.value
    }
  }

  // if input is not a string at this point, then it is not a valid string or
  // ParseableInput object.
  if (typeof input !== "string") {
    throw new TypeError(
      "Parser expected a valid ParseableInput object or string.",
    )
  }

  return input.replace(/\n+/g, "")
}
