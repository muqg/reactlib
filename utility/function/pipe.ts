/**
 * Executes given functions in sequence providing the output of each to the next
 * one in the line.
 *
 * By default typings are loose and the first generic type only specifies the
 * expected return type. In order to enforce strict typings then the second
 * generic type must be specified.
 */
export function pipe<R = any, T extends R = any>(
  ...args: Array<(input: T) => T>
) {
  return (input: T) => {
    for (let i = 0; i < args.length; i++) {
      const next = args[i]
      input = next(input)
    }

    return input as R
  }
}
