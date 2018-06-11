export function isNumeric(input: string) {
    // @ts-ignore isNaN works perfectly fine with strings.
    return input !== "" && !isNaN(input)
}
