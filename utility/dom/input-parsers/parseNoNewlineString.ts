const ReplacementPattern = /\n+/g

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

  return input.replace(ReplacementPattern, "")
}
