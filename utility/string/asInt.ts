/**
 * Attempts to parse a string as integer or returns 0 instead.
 * @param str The string to be parsed.
 */
function asInt(str: string) {
  const res = parseInt(str)
  const nan = isNaN(res)

  if (__DEV__) {
    if (nan) {
      console.warn(`
                asInt function received a string argument that cannot be
                parsed as a valid number and will instead return 0. There is
                probably an error in your code's expected input.
            `)
    }
  }

  return nan ? 0 : res
}

export {asInt}
